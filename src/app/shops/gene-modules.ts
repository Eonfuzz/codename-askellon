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
    ABIL_GENE_COSMIC
} from "resources/ability-ids";
import { TOOLTIP_EMBRACE_COSMOS } from "resources/ability-tooltips";
import { Trigger, Unit, Timer } from "w3ts";
import { Crewmember } from "app/crewmember/crewmember-type";
import { Log } from "lib/serilog/serilog";
import { ALIEN_FORCE_NAME, AlienForce } from "app/force/alien-force";
import { STR_GENE_SUCCESSFUL, STR_GENE_ALIEN_SUCCESSFUL } from "resources/strings";
import { EventListener, EVENT_TYPE } from "app/events/event";
import { ROLE_NAMES, ROLE_TYPES } from "resources/crewmember-names";
import { ForceType } from "app/force/force-type";

interface GeneInstance {
    source: Crewmember,
    ui: Unit,
    unitInGeneZone?: Crewmember,
    castTrigger: Trigger
}

export class GeneModule {   
    game: Game;

    instances: GeneInstance[] = [];
    // A group used to track units inside the rect
    group: group = CreateGroup();

    constructor(game: Game) {
        this.game = game;
    }

    initGenes() {
        const players = this.game.forceModule.getActivePlayers();

        // Apply starting gene upgrades
        players.forEach(p => {
            p.setTechResearched(TECH_NO_GENES_TIER_1, 1);
            p.setTechResearched(TECH_NO_GENES_TIER_2, 1);
            p.setTechResearched(TECH_NO_GENES_TIER_3, 1);
        });

        // Start gene check trigger
        new Timer().start(0.5, true, () => this.checkGeneRequirements());
        // const checkTrig = new Trigger();
        // checkTrig.registerTimerEvent(0.5, true);
        // checkTrig.addAction(() => this.checkGeneRequirements());
    }

    addNewGeneInstance(who: Unit, geneUiUnit: Unit) {
        const crew = this.game.crewModule.getCrewmemberForUnit(who);

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

    checkGeneRequirements() {
        // Go through the instances
        this.instances = this.instances.filter(gInstance => {
            // If the ui unit is dead remove this
            if (!gInstance.ui.isAlive()) {
                // Clear the trigger
                gInstance.castTrigger.destroy();
                return false;
            }
            const instanceOwner = gInstance.source.unit.owner;

            // Make sure there is a unit in the gene zone
            // Make sure it isn't owned by the user of the gene console
            let units: Crewmember[] = [];
            GroupEnumUnitsInRect(this.group, gg_rct_GeneSplicer, Filter(() => {
                const u = Unit.fromHandle(GetFilterUnit());
                if (u.owner != instanceOwner && u.typeId !== FourCC('ncp2')) {
                    const crew = this.game.crewModule.getCrewmemberForUnit(u);
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

            // Log.Information("Owner "+GetPlayerName(instanceOwner)+"::"+GetPlayerId(instanceOwner)+"Units in gene? "+units.length);

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
            return true;
        });
        // Set tech availabilities
    }

    hasTier1Genes(who: Crewmember) { return who.player.getTechCount(TECH_HAS_GENES_TIER_1, true) > 0; }
    hasTier2Genes(who: Crewmember) { return who.player.getTechCount(TECH_HAS_GENES_TIER_2, true) > 0; }
    hasTier3Genes(who: Crewmember) { return who.player.getTechCount(TECH_HAS_GENES_TIER_3, true) > 0; }

    /**
     * Called on response to the unit event
     */
    onGeneCast(instance: GeneInstance) {
        const castAbil = GetSpellAbilityId();
        const techLevel = this.game.researchModule.getMajorUpgradeLevel(TECH_MAJOR_HEALTHCARE); 
        // Only disable resolve if HC 2 isn't upgraded
        const doGiveBonusXp = this.game.researchModule.techHasOccupationBonus(TECH_MAJOR_HEALTHCARE, 2);
        const bonusXpInfested = this.game.researchModule.isUpgradeInfested(TECH_MAJOR_HEALTHCARE, 2);

        if (!instance.unitInGeneZone) return;
        const target = instance.unitInGeneZone;
        const alienForce = this.game.forceModule.getForce(ALIEN_FORCE_NAME) as AlienForce;
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
                this.game.tooltips.registerTooltip(instance.unitInGeneZone, TOOLTIP_EMBRACE_COSMOS);
                // Do stuff
                this.game.event.addListener(new EventListener(EVENT_TYPE.CREW_TRANSFORM_ALIEN, 
                    (event: EventListener, data: any) => {
                        let text: string;
                        const rNumber = GetRandomInt(0,4);
                        if (rNumber === 0) text = "You feel sick";
                        else if (rNumber === 1) text = "Visions flash; creatures changing form";
                        else if (rNumber === 2) text = "You feel a howl of tearing flesh";
                        else if (rNumber === 3) text = "Something is out there, perverse and twisted";
                        else if (rNumber === 4) text = "Its out there, pretending to be one of us";
                        this.game.chatModule.postMessage(instance.unitInGeneZone.player, "COSMIC", text);
                    })
                );
            }
        }
        
        // Now grant XP if installed by doc and medicare 2 was researched
        if (instance.source.role === ROLE_TYPES.DOCTOR && doGiveBonusXp) {
            const installerForce = this.game.forceModule.getPlayerForce(instance.source.player) as ForceType;
            const targetForce = this.game.forceModule.getPlayerForce(instance.unitInGeneZone.player) as ForceType;

            // Grant 100 xp each
            installerForce.onUnitGainsXp(this.game, instance.source, 100);
            targetForce.onUnitGainsXp(this.game, instance.unitInGeneZone, 100);
        }
        // INFESTED ugprade
        // Grant XP for HOST
        else if (bonusXpInfested) {
            const host = alienForce.getHost();
            if (host) {
                const hostCrewmember = this.game.crewModule.getCrewmemberForPlayer(host);
                hostCrewmember && alienForce.onUnitGainsXp(this.game, hostCrewmember, 100);
                
                let text: string;
                const rNumber = GetRandomInt(0,1);
                if (rNumber === 0) text = "The humans alter their bodies";
                else if (rNumber === 1) text = "Inspecting infested gene splicing";
                this.game.chatModule.postMessage(hostCrewmember.player, "INFEST", text);
            }
        }

        if (targetIsAlien) {
            DisplayTextToPlayer(target.player.handle, 0, 0, messageAlien);
        }

        // Send gene upgrade event
        this.game.event.sendEvent(EVENT_TYPE.GENE_UPGRADE_INSTALLED, { 
            source: instance.unitInGeneZone.unit, 
            crewmember: instance.unitInGeneZone, 
            data: { gene: castAbil}
        });
    }
}