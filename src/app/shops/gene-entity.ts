/** @noSelfInFile **/
import { Game } from "../game";
import { TECH_NO_GENES_TIER_1, 
    TECH_NO_GENES_TIER_2, 
    TECH_NO_GENES_TIER_3, 
    TECH_NO_UNIT_IN_SPLICER, 
    TECH_HAS_GENES_TIER_1, 
    TECH_HAS_GENES_TIER_2, 
    TECH_HAS_GENES_TIER_3,
    GENE_INSTALL_NIGHTEYE,
    ABIL_GENE_NIGHTEYE,
    GENE_INSTALL_MOBILITY,
    GENE_TECH_MOBILITY,
    GENE_INSTALL_COSMIC_SENSITIVITY,
    TECH_MAJOR_HEALTHCARE,
    ABIL_GENE_COSMIC,
    ABIL_INQUIS_SMITE
} from "resources/ability-ids";
import { TOOLTIP_EMBRACE_COSMOS } from "resources/ability-tooltips";
import { Trigger, Unit, Timer } from "w3ts";
import { Crewmember } from "app/crewmember/crewmember-type";
import { Log } from "lib/serilog/serilog";
import { ALIEN_FORCE_NAME, AlienForce } from "app/force/forces/alien-force";
import { STR_GENE_SUCCESSFUL, STR_GENE_ALIEN_SUCCESSFUL } from "resources/strings";
import { EventListener } from "app/events/event-type";
import { ROLE_NAMES, ROLE_TYPES } from "resources/crewmember-names";
import { ForceType } from "app/force/forces/force-type";
import { Entity } from "app/entity-type";
import { ForceEntity } from "app/force/force-entity";
import { ResearchFactory } from "app/research/research-factory";
import { EventEntity } from "app/events/event-entity";
import { ChatEntity } from "app/chat/chat-entity";
import { EVENT_TYPE } from "app/events/event-enum";
import { CrewFactory } from "app/crewmember/crewmember-factory";
import { TooltipEntity } from "app/tooltip/tooltip-module";

interface GeneInstance {
    source: Crewmember,
    ui: Unit,
    unitInGeneZone?: Crewmember,
    castTrigger: Trigger
}

export class GeneEntity extends Entity {
    private static instance: GeneEntity;

    public static getInstance() {        
        if (this.instance == null) {
            this.instance = new GeneEntity();
        }
        return this.instance;
    }

    _timerDelay = 1;
    
    instances: GeneInstance[] = [];
    // A group used to track units inside the rect
    group: group = CreateGroup();

    constructor() {
        super();

        const players = ForceEntity.getInstance().getActivePlayers();

        // Apply starting gene upgrades
        players.forEach(p => {
            p.setTechResearched(TECH_NO_GENES_TIER_1, 1);
            p.setTechResearched(TECH_NO_GENES_TIER_2, 1);
            p.setTechResearched(TECH_NO_GENES_TIER_3, 1);
        });
    }

    addNewGeneInstance(who: Unit, geneUiUnit: Unit) {
        const crew = CrewFactory.getInstance().getCrewmemberForUnit(who);

        if (crew) {
            const instance = {
                source: crew,
                ui: geneUiUnit,
                castTrigger: new Trigger()
            };

            this.instances.push(instance);

            // Track it casting abilities
            instance.castTrigger.registerUnitEvent(geneUiUnit, EVENT_UNIT_SPELL_FINISH);
            instance.castTrigger.addAction(() => this.onGeneCast(instance));
        }
        else {
            geneUiUnit.kill();
        }
    }

    step() {

        let i = 0;
        while (i < this.instances.length) {
            const gInstance = this.instances[i];

            // If the ui unit is dead remove this
            if (gInstance.ui.isAlive()) {
                i++;
                const instanceOwner = gInstance.source.unit.owner;
    
                // Make sure there is a unit in the gene zone
                // Make sure it isn't owned by the user of the gene console
                let units: Crewmember[] = [];
                GroupEnumUnitsInRect(this.group, gg_rct_GeneSplicer, Filter(() => {
                    const u = Unit.fromHandle(GetFilterUnit());
    
                    // Make sure unit does not have the smite ability
                    const isInquis = u.getAbilityLevel(ABIL_INQUIS_SMITE) > 0;
                    if (u.owner != instanceOwner && u.typeId !== FourCC('ncp2') && !isInquis) {
                        const crew = CrewFactory.getInstance().getCrewmemberForUnit(u);
                        if (crew) {
                            units.push(crew);
                        }
                    }
                    return false;
                }));
    
                // Set the unit in splicer tech
                // > 1 because the circle of power in the region counts
                instanceOwner.setTechResearched(
                    TECH_NO_UNIT_IN_SPLICER, 
                    // Multiple units also fail this condition
                    (units.length === 1) ? 1 : 0
                );
    
                if (units.length === 1) {
                    const targetedUnit = units[0];
                    gInstance.unitInGeneZone = targetedUnit;
                    // Now check the target units genes
                    const unitHasTier1Genes = this.hasTier1Genes(targetedUnit);
                    const unitHasTier2Genes = this.hasTier2Genes(targetedUnit);
                    const unitHasTier3Genes = this.hasTier3Genes(targetedUnit);
                    gInstance.unitInGeneZone.player.setTechResearched(TECH_NO_GENES_TIER_1,  unitHasTier1Genes ? 0 : 1);
                    gInstance.unitInGeneZone.player.setTechResearched(TECH_NO_GENES_TIER_2,  unitHasTier2Genes ? 0 : 1);
                    gInstance.unitInGeneZone.player.setTechResearched(TECH_NO_GENES_TIER_3,  unitHasTier3Genes ? 0 : 1);
                }
            }
            else {
                gInstance.castTrigger.destroy();
                this.instances[i] = this.instances[ this.instances.length - 1];
                delete this.instances[this.instances.length - 1];
            }
        }
    }

    hasTier1Genes(who: Crewmember) { return who.player.getTechCount(TECH_HAS_GENES_TIER_1, true) > 0; }
    hasTier2Genes(who: Crewmember) { return who.player.getTechCount(TECH_HAS_GENES_TIER_2, true) > 0; }
    hasTier3Genes(who: Crewmember) { return who.player.getTechCount(TECH_HAS_GENES_TIER_3, true) > 0; }

    /**
     * Called on response to the unit event
     */
    onGeneCast(instance: GeneInstance) {
        const castAbil = GetSpellAbilityId();
        const researchFactory = ResearchFactory.getInstance();
        const techLevel = researchFactory.getMajorUpgradeLevel(TECH_MAJOR_HEALTHCARE); 
        // Only disable resolve if HC 2 isn't upgraded
        const doGiveBonusXp = researchFactory.techHasOccupationBonus(TECH_MAJOR_HEALTHCARE, 2);
        const bonusXpInfested = researchFactory.isUpgradeInfested(TECH_MAJOR_HEALTHCARE, 2);

        if (!instance.unitInGeneZone) return;
        const target = instance.unitInGeneZone;
        const alienForce = ForceEntity.getInstance().getForce(ALIEN_FORCE_NAME) as AlienForce;
        const targetIsAlien = alienForce.hasPlayer(target.player);

        const messageSuccessful = STR_GENE_SUCCESSFUL();
        const messageAlien = STR_GENE_ALIEN_SUCCESSFUL();
        
        DisplayTextToPlayer(instance.source.player.handle, 0, 0, messageSuccessful);
        DisplayTextToPlayer(target.player.handle, 0, 0, messageSuccessful);

        // Check if its nighteye
        if (castAbil === GENE_INSTALL_NIGHTEYE) {
            SetPlayerTechResearched(instance.unitInGeneZone.player.handle, TECH_HAS_GENES_TIER_1,  1);
            if (!targetIsAlien) {
                UnitAddAbility(instance.unitInGeneZone.unit.handle, ABIL_GENE_NIGHTEYE);
            }
        }
        else if (castAbil === GENE_INSTALL_MOBILITY) {
            SetPlayerTechResearched(instance.unitInGeneZone.player.handle, TECH_HAS_GENES_TIER_1,  1);
            if (!targetIsAlien) {
                SetPlayerTechResearched(instance.unitInGeneZone.player.handle, GENE_TECH_MOBILITY, 1);
            }
        }
        else if (castAbil === GENE_INSTALL_COSMIC_SENSITIVITY) {
            SetPlayerTechResearched(instance.unitInGeneZone.player.handle, TECH_HAS_GENES_TIER_2,  1);
            if (!targetIsAlien) {
                UnitAddAbility(instance.unitInGeneZone.unit.handle, ABIL_GENE_COSMIC);
                TooltipEntity.getInstance().registerTooltip(instance.unitInGeneZone, TOOLTIP_EMBRACE_COSMOS);
                // Do stuff
                EventEntity.getInstance().addListener(new EventListener(EVENT_TYPE.CREW_TRANSFORM_ALIEN, 
                    (event: EventListener, data: any) => {
                        let text: string;
                        const rNumber = GetRandomInt(0,4);
                        if (rNumber === 0) text = "You feel sick";
                        else if (rNumber === 1) text = "Visions flash; creatures changing form";
                        else if (rNumber === 2) text = "You feel a howl of tearing flesh";
                        else if (rNumber === 3) text = "Something is out there, perverse and twisted";
                        else if (rNumber === 4) text = "Its out there, pretending to be one of us";
                        ChatEntity.getInstance().postMessage(instance.unitInGeneZone.player, "COSMIC", text);
                    })
                );
            }
        }
        
        // Now grant XP if installed by doc and medicare 2 was researched
        if (instance.source.role === ROLE_TYPES.DOCTOR && doGiveBonusXp) {
            EventEntity.getInstance().sendEvent(EVENT_TYPE.CREW_GAIN_EXPERIENCE, {
                source: instance.source.unit,
                data: { value: 100 }
            });
            EventEntity.getInstance().sendEvent(EVENT_TYPE.CREW_GAIN_EXPERIENCE, {
                source: instance.unitInGeneZone.unit,
                data: { value: 100 }
            });
        }
        // INFESTED ugprade
        // Grant XP for ALL ALiENS
        else if (bonusXpInfested) {

            let text = "Humans alter their bodies";
            const alienPlayers = alienForce.getPlayers();

            for (let index = 0; index < alienPlayers.length; index++) {
                const aPlayer = alienPlayers[index];
                const pData = ForceEntity.getInstance().getPlayerDetails(aPlayer);
                EventEntity.getInstance().sendEvent(EVENT_TYPE.CREW_GAIN_EXPERIENCE, {
                    source: pData.getCrewmember().unit,
                    data: { value: 100 }
                });                
                ChatEntity.getInstance().postMessage(aPlayer, "INFEST", text);
            }

        }

        if (targetIsAlien) {
            DisplayTextToPlayer(target.player.handle, 0, 0, messageAlien);
        }

        // Send gene upgrade event
        EventEntity.getInstance().sendEvent(EVENT_TYPE.GENE_UPGRADE_INSTALLED, { 
            source: instance.unitInGeneZone.unit, 
            crewmember: instance.unitInGeneZone, 
            data: { gene: castAbil}
        });
    }
}