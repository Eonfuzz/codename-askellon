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
    ABIL_INQUIS_SMITE,
    GENE_INSTALL_XENOPHOBIC,
    ABIL_GENE_XENOPHOBIC,
    GENE_INSTALL_OSBORNE_GENE,
    ABIL_GENE_INSTANT_HEAL,
    GENE_INFESTED_1,
    ABIL_GENE_REMOVE_VOCAL,
    UPGR_REMOVED_VOCAL_CHORDS,
    ABIL_REMOVED_VOCAL_CHORDS,
    GENE_INSTALL_PSIONIC_POTENCY,
    ABIL_GENE_MIND_LASH,
    GENE_TECH_PSI_POTENCY
} from "resources/ability-ids";
import { TOOLTIP_EMBRACE_COSMOS } from "resources/ability-tooltips";
import { Trigger, Unit, Timer } from "w3ts";
import { Crewmember } from "app/crewmember/crewmember-type";
import { Log } from "lib/serilog/serilog";
import { STR_GENE_SUCCESSFUL } from "resources/strings";
import { EventListener } from "app/events/event-type";
import { ROLE_NAMES, ROLE_TYPES } from "resources/crewmember-names";
import { Entity } from "app/entity-type";

import { EventEntity } from "app/events/event-entity";
import { ChatEntity } from "app/chat/chat-entity";
import { EVENT_TYPE } from "app/events/event-enum";
import { TooltipEntity } from "app/tooltip/tooltip-module";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { ALIEN_FORCE_NAME } from "app/force/forces/force-names";
import { AlienForce } from "app/force/forces/alien-force";
import { ResearchFactory } from "app/research/research-factory";
import { GetActivePlayers, getZFromXY } from "lib/utils";
import { Hooks } from "lib/Hooks";
import { SFX_RED_SINGULARITY, SFX_HUMAN_BLOOD } from "resources/sfx-paths";
import { SoundRef } from "app/types/sound-ref";
import { SOUND_STR_GENE_LOOP } from "resources/sounds";
import { Timers } from "app/timer-type";
import { COL_MISC, COL_TEAL } from "resources/colours";
import { UPGR_DUMMY_WILL_BECOME_ALIEN_ON_DEATH } from "resources/upgrade-ids";
import { SmartTrigger } from "lib/SmartTrigger";
import { PsionicPotentialBehaviour } from "app/abilities/behaviours/psionic-potential";

declare const udg_genetic_splicer_unit: unit;
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
            Hooks.set(this.name, this.instance);
        }
        return this.instance;
    }

    _timerDelay = 1;
    
    instances: GeneInstance[] = [];
    // A group used to track units inside the rect
    group: group = CreateGroup();

    constructor() {
        super();

        const players = GetActivePlayers();

        // Apply starting gene upgrades
        players.forEach(p => {
            p.setTechResearched(TECH_NO_GENES_TIER_1, 1);
            p.setTechResearched(TECH_NO_GENES_TIER_2, 1);
            p.setTechResearched(TECH_NO_GENES_TIER_3, 1);
        });

        const u = Unit.fromHandle(udg_genetic_splicer_unit);
        u.owner = PlayerStateFactory.NeutralPassive;
        u.name = `${COL_TEAL}Genetic Sequencer|r|n${COL_MISC}Requires two people to use`
    }

    addNewGeneInstance(who: Unit, geneUiUnit: Unit) {
        const pData = PlayerStateFactory.get(who.owner);
        const crew = pData.getCrewmember();

        if (crew && crew.unit === who) {

            if (pData && pData.getForce().is(ALIEN_FORCE_NAME)) {
                const infestedGenes1 = ResearchFactory.getInstance().isUpgradeInfested(TECH_MAJOR_HEALTHCARE, 1);
                if (infestedGenes1) {
                    geneUiUnit.addAbility( GENE_INFESTED_1 );
                }                   
                const infestedGenes2 = ResearchFactory.getInstance().isUpgradeInfested(TECH_MAJOR_HEALTHCARE, 2);
                if (infestedGenes2) {
                    geneUiUnit.addAbility( ABIL_GENE_REMOVE_VOCAL );
                }                     
            }
            
            const instance = {
                source: crew,
                ui: geneUiUnit,
                castTrigger: new SmartTrigger()
            };

            this.instances.push(instance);

            // Track it casting abilities
            instance.castTrigger.registerUnitEvent(geneUiUnit, EVENT_UNIT_SPELL_FINISH);
            instance.castTrigger.addAction(() => this.onGeneCast(instance));

            instance.source.player.setTechResearched(TECH_NO_GENES_TIER_1, 0);
            instance.source.player.setTechResearched(TECH_NO_GENES_TIER_2, 0);
            instance.source.player.setTechResearched(TECH_NO_GENES_TIER_3, 0);
        

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
                        const pData = PlayerStateFactory.get(u.owner);
                        const crew = pData.getCrewmember();
                        if (crew && crew.unit == u) {
                            units.push(crew);
                        }
                    }
                    return false;
                }));
    

                // If we are single player add the interactor as a unit in the circle
                if (units.length === 0 && PlayerStateFactory.isSinglePlayer()) {
                    units.push(gInstance.source);
                }

                const validNumberOfUnits = units.length === 1 && !this.isUpgradingAlready;

                // Set the unit in splicer tech
                // > 1 because the circle of power in the region counts
                instanceOwner.setTechResearched(
                    TECH_NO_UNIT_IN_SPLICER, 
                    // Multiple units also fail this condition
                    validNumberOfUnits ? 1 : 0
                );
    
                if (units.length === 1) {
                    const targetedUnit = units[0];
                    gInstance.unitInGeneZone = targetedUnit;
                    // Now check the target units genes
                    const unitHasTier1Genes = this.hasTier1Genes(targetedUnit);
                    const unitHasTier2Genes = this.hasTier2Genes(targetedUnit);
                    const unitHasTier3Genes = this.hasTier3Genes(targetedUnit);

                    gInstance.source.player.setTechResearched(TECH_NO_GENES_TIER_1,  (!unitHasTier1Genes && validNumberOfUnits && this.canBuyTier1()) ? 1 : 0);
                    gInstance.source.player.setTechResearched(TECH_NO_GENES_TIER_2,  (!unitHasTier2Genes && validNumberOfUnits && this.canBuyTier2()) ? 1 : 0);
                    gInstance.source.player.setTechResearched(TECH_NO_GENES_TIER_3,  (!unitHasTier3Genes && validNumberOfUnits && this.canBuyTier3()) ? 1 : 0);
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

    canBuyTier1() { return ResearchFactory.getInstance().getMajorUpgradeLevel(TECH_MAJOR_HEALTHCARE) > 0; }
    canBuyTier2() { return ResearchFactory.getInstance().getMajorUpgradeLevel(TECH_MAJOR_HEALTHCARE) > 1; }
    canBuyTier3() { return ResearchFactory.getInstance().getMajorUpgradeLevel(TECH_MAJOR_HEALTHCARE) > 2; }


    geneUpgradeSound = new SoundRef(SOUND_STR_GENE_LOOP, true, false);
    isUpgradingAlready = false;

    /**
     * Called on response to the unit event
     */
    onGeneCast(instance: GeneInstance) {
        { 
            const castAbil = GetSpellAbilityId();
            const researchFactory = ResearchFactory.getInstance();
            const techLevel = researchFactory.getMajorUpgradeLevel(TECH_MAJOR_HEALTHCARE); 
            // Only disable resolve if HC 2 isn't upgraded
            const doGiveBonusXp = researchFactory.techHasOccupationBonus(TECH_MAJOR_HEALTHCARE, 1);
            const bonusXpInfested = researchFactory.isUpgradeInfested(TECH_MAJOR_HEALTHCARE, 1);


            const geneTier = this.getGeneTierFor(castAbil);
            if (geneTier === 1) {
                instance.source.player.setTechResearched(TECH_NO_GENES_TIER_1, 0);
                instance.unitInGeneZone.player.setTechResearched(TECH_HAS_GENES_TIER_1, 1);

                // Check for infestation
                if (instance.ui.getAbilityLevel( GENE_INFESTED_1 ) > 0) {
                    instance.unitInGeneZone.player.setTechResearched(UPGR_DUMMY_WILL_BECOME_ALIEN_ON_DEATH, 1);
                }
            }
            else if (geneTier === 2) {
                instance.source.player.setTechResearched(TECH_NO_GENES_TIER_2, 0);
                instance.unitInGeneZone.player.setTechResearched(TECH_HAS_GENES_TIER_2, 1);
            }
            else  {
                instance.source.player.setTechResearched(TECH_NO_GENES_TIER_3, 0);
                instance.unitInGeneZone.player.setTechResearched(TECH_HAS_GENES_TIER_3, 1);
            }


            if (!instance.unitInGeneZone || this.isUpgradingAlready) return;
            const target = instance.unitInGeneZone;
            const alienForce = PlayerStateFactory.getForce(ALIEN_FORCE_NAME) as AlienForce;
            const targetIsAlien = alienForce.hasPlayer(target.player);

            target.unit.pauseEx(true);
            this.geneUpgradeSound.playSoundOnUnit(target.unit.handle, 50);
            target.unit.x = GetRectCenterX(gg_rct_GeneSplicer);
            target.unit.y = GetRectCenterY(gg_rct_GeneSplicer);

            SetUnitTimeScale(udg_genetic_splicer_unit, 5);

            Timers.addTimedAction(1, () => {
                const sfx = AddSpecialEffect(SFX_HUMAN_BLOOD, target.unit.x, target.unit.y);
                BlzSetSpecialEffectZ(sfx, getZFromXY(target.unit.x, target.unit.y));
                DestroyEffect(sfx);    
            });
            Timers.addTimedAction(2, () => {
                const sfx = AddSpecialEffect(SFX_HUMAN_BLOOD, target.unit.x, target.unit.y);
                BlzSetSpecialEffectZ(sfx, getZFromXY(target.unit.x, target.unit.y));
                DestroyEffect(sfx);    
            });

            Timers.addTimedAction(3, () => {
                SetUnitTimeScale(udg_genetic_splicer_unit, 1);

                this.isUpgradingAlready = false;
                this.geneUpgradeSound.stopSound();
                target.unit.pauseEx(false);

                const sfx = AddSpecialEffect(SFX_RED_SINGULARITY, target.unit.x, target.unit.y);
                BlzSetSpecialEffectZ(sfx, getZFromXY(target.unit.x, target.unit.y));
                DestroyEffect(sfx);
        
                const messageSuccessful = STR_GENE_SUCCESSFUL();
                
                DisplayTextToPlayer(instance.source.player.handle, 0, 0, messageSuccessful);
                // We may be the same player due to singleplayer
                // Make sure we don't display the message twice
                if (target.player != instance.source.player) {
                    DisplayTextToPlayer(target.player.handle, 0, 0, messageSuccessful);
                }

                const crewmember = PlayerStateFactory.getCrewmember(instance.unitInGeneZone.player);

                // Check if its nighteye
                if (castAbil === GENE_INSTALL_NIGHTEYE) {
                    crewmember.setAgiGain( crewmember.getAgiGain() + 2.5);
                    crewmember.setIntGain( crewmember.getIntGain() + 1);
                    UnitAddAbility(instance.unitInGeneZone.unit.handle, ABIL_GENE_NIGHTEYE);
                }
                else if (castAbil === GENE_INSTALL_MOBILITY) {
                    crewmember.setStrGain( crewmember.getStrGain() + 1.0 );
                    SetPlayerTechResearched(instance.unitInGeneZone.player.handle, GENE_TECH_MOBILITY, 1);
                }
                else if (castAbil === GENE_INSTALL_PSIONIC_POTENCY) {
                    SetPlayerTechResearched(instance.unitInGeneZone.player.handle, GENE_TECH_PSI_POTENCY, 1);

                    SetPlayerTechResearched(instance.unitInGeneZone.player.handle, TECH_HAS_GENES_TIER_1, 1);
                    SetPlayerTechResearched(instance.unitInGeneZone.player.handle, TECH_HAS_GENES_TIER_2, 1);
                    SetPlayerTechResearched(instance.unitInGeneZone.player.handle, TECH_HAS_GENES_TIER_3, 1);

                    instance.source.player.setTechResearched(TECH_NO_GENES_TIER_1, 0);
                    instance.source.player.setTechResearched(TECH_NO_GENES_TIER_2, 0);
                    instance.source.player.setTechResearched(TECH_NO_GENES_TIER_3, 0);

                    crewmember.setStrGain( crewmember.getStrGain() - 2.7 );

                    // This has no effect on aliens
                    if (!targetIsAlien) {
                        EventEntity.getInstance().sendEvent(EVENT_TYPE.ADD_BEHAVIOUR_INSTANCE, { 
                            source: crewmember.unit,
                            data: { behaviour: () => new PsionicPotentialBehaviour() } 
                        })
                    }
                }
                else if (castAbil === GENE_INSTALL_COSMIC_SENSITIVITY) {
                    crewmember.setIntGain( crewmember.getIntGain() + 3 );
                    crewmember.setAgiGain( crewmember.getAgiGain() - 2 );
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
                            else if (rNumber === 4) text = "Its out there, masquerading as us";
                            ChatEntity.getInstance().postMessage(instance.unitInGeneZone.player, "COSMIC", text);
                        })
                    );
                }
                else if (castAbil === GENE_INSTALL_XENOPHOBIC) {
                    crewmember.setStrGain( crewmember.getStrGain() + 3.5 );
                    crewmember.setIntGain( crewmember.getIntGain() - 1 );
                    instance.unitInGeneZone.unit.addAbility(ABIL_GENE_XENOPHOBIC);
                }
                else if (castAbil === GENE_INSTALL_OSBORNE_GENE) {
                    crewmember.setStrGain( crewmember.getStrGain() + 2 );
                    crewmember.setAgiGain( crewmember.getAgiGain() + 2 );
                    crewmember.setIntGain( crewmember.getIntGain() + 1.5 );
                    instance.unitInGeneZone.unit.addAbility(ABIL_GENE_INSTANT_HEAL);
                }
                else if (castAbil === ABIL_GENE_REMOVE_VOCAL) {
                    crewmember.setStrGain( crewmember.getStrGain() - 1 );
                    crewmember.setIntGain( crewmember.getIntGain() - 1 );
                    instance.unitInGeneZone.unit.addAbility(ABIL_REMOVED_VOCAL_CHORDS);
                    crewmember.player.setTechResearched(UPGR_REMOVED_VOCAL_CHORDS, 1);
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
        
                    let text = "Someone is using the Gene Splicer";
                    const alienPlayers = alienForce.getPlayers();
        
                    for (let index = 0; index < alienPlayers.length; index++) {
                        const aPlayer = alienPlayers[index];
                        const pData = PlayerStateFactory.get(aPlayer);
                        EventEntity.getInstance().sendEvent(EVENT_TYPE.CREW_GAIN_EXPERIENCE, {
                            source: pData.getCrewmember().unit,
                            data: { value: 100 }
                        });                
                        ChatEntity.getInstance().postMessage(aPlayer, "INFEST", text);
                    }
        
                }
            
                // Send gene upgrade event
                EventEntity.getInstance().sendEvent(EVENT_TYPE.GENE_UPGRADE_INSTALLED, { 
                    source: instance.unitInGeneZone.unit, 
                    crewmember: instance.unitInGeneZone, 
                    data: { gene: castAbil}
                });

            })
        }
    }


    getGeneTierFor(abilId: number) {
        switch (abilId) {
            case GENE_INSTALL_MOBILITY:
            case GENE_INSTALL_NIGHTEYE:
            case GENE_INSTALL_PSIONIC_POTENCY:
                return 1;
            case GENE_INSTALL_COSMIC_SENSITIVITY:
            case GENE_INSTALL_OSBORNE_GENE:
            case GENE_INSTALL_XENOPHOBIC:
            case ABIL_GENE_REMOVE_VOCAL:
                return 2;
        }
    }
}