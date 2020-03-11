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
    ABIL_NIGHTEYE,
    GENE_INSTALL_MOBILITY,
    GENE_TECH_MOBILITY,
    GENE_INSTALL_COSMIC_SENSITIVITY
} from "resources/ability-ids";
import { Trigger } from "app/types/jass-overrides/trigger";
import { Crewmember } from "app/crewmember/crewmember-type";
import { Log } from "lib/serilog/serilog";
import { ALIEN_FORCE_NAME, AlienForce } from "app/force/alien-force";
import { STR_GENE_SUCCESSFUL, STR_GENE_ALIEN_SUCCESSFUL } from "resources/strings";
import { EventListener, EVENT_TYPE } from "app/events/event";

interface GeneInstance {
    source: Crewmember,
    ui: unit,
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
            SetPlayerTechResearched(p, TECH_NO_GENES_TIER_1, 1);
            SetPlayerTechResearched(p, TECH_NO_GENES_TIER_2, 1);
            SetPlayerTechResearched(p, TECH_NO_GENES_TIER_3, 1);
        });

        // Start gene check trigger
        const checkTrig = new Trigger();
        checkTrig.RegisterTimerEventPeriodic(0.5);
        checkTrig.AddAction(() => this.checkGeneRequirements());
    }

    addNewGeneInstance(who: unit, geneUiUnit: unit) {
        const crew = this.game.crewModule.getCrewmemberForUnit(who);

        if (crew) {
            const instance = {
                source: crew,
                ui: geneUiUnit,
                castTrigger: new Trigger()
            };

            this.instances.push(instance);

            // Track it casting abilities
            instance.castTrigger.RegisterUnitIssuedOrder(geneUiUnit, EVENT_UNIT_SPELL_FINISH);
            instance.castTrigger.AddAction(() => this.onGeneCast(instance));
        }
        else {
            KillUnit(geneUiUnit);
        }
    }

    checkGeneRequirements() {
        // Go through the instances
        this.instances = this.instances.filter(gInstance => {
            // If the ui unit is dead remove this
            if (!UnitAlive(gInstance.ui)) {
                // Clear the trigger
                gInstance.castTrigger.destroy();
                return false;
            }
            const instanceOwner = GetOwningPlayer(gInstance.source.unit);

            // Make sure there is a unit in the gene zone
            // Make sure it isn't owned by the user of the gene console
            let units: Crewmember[] = [];
            GroupEnumUnitsInRect(this.group, gg_rct_GeneSplicer, Filter(() => {
                const u = GetFilterUnit();
                if (GetOwningPlayer(u) != instanceOwner && GetUnitTypeId(u) !== FourCC('ncp2')) {
                    const crew = this.game.crewModule.getCrewmemberForUnit(u);
                    if (crew) {
                        units.push(crew);
                    }
                }
                return false;
            }));

            // Set the unit in splicer tech
            // > 1 because the circle of power in the region counts
            SetPlayerTechResearched(
                instanceOwner, 
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
                SetPlayerTechResearched(gInstance.unitInGeneZone.player, TECH_NO_GENES_TIER_1,  unitHasTier1Genes ? 0 : 1);
                SetPlayerTechResearched(gInstance.unitInGeneZone.player, TECH_NO_GENES_TIER_2,  unitHasTier2Genes ? 0 : 1);
                SetPlayerTechResearched(gInstance.unitInGeneZone.player, TECH_NO_GENES_TIER_3,  unitHasTier3Genes ? 0 : 1);
            }
            return true;
        });
        // Set tech availabilities
    }

    hasTier1Genes(who: Crewmember) { return GetPlayerTechCount(who.player, TECH_HAS_GENES_TIER_1, true) > 0; }
    hasTier2Genes(who: Crewmember) { return GetPlayerTechCount(who.player, TECH_HAS_GENES_TIER_2, true) > 0; }
    hasTier3Genes(who: Crewmember) { return GetPlayerTechCount(who.player, TECH_HAS_GENES_TIER_3, true) > 0; }

    /**
     * Called on response to the unit event
     */
    onGeneCast(instance: GeneInstance) {
        const castAbil = GetSpellAbilityId();

        if (!instance.unitInGeneZone) return;
        const target = instance.unitInGeneZone;
        const alienForce = this.game.forceModule.getForce(ALIEN_FORCE_NAME) as AlienForce;
        const targetIsAlien = alienForce.hasPlayer(target.player);

        const messageSuccessful = STR_GENE_SUCCESSFUL();
        const messageAlien = STR_GENE_ALIEN_SUCCESSFUL();
        
        DisplayTextToPlayer(instance.source.player, 0, 0, messageSuccessful);
        DisplayTextToPlayer(target.player, 0, 0, messageSuccessful);

        // Check if its nighteye
        if (castAbil === GENE_INSTALL_NIGHTEYE) {
            SetPlayerTechResearched(instance.unitInGeneZone.player, TECH_HAS_GENES_TIER_1,  1);
            if (!targetIsAlien) {
                UnitAddAbility(instance.unitInGeneZone.unit, ABIL_NIGHTEYE);
            }
        }
        else if (castAbil === GENE_INSTALL_MOBILITY) {
            SetPlayerTechResearched(instance.unitInGeneZone.player, TECH_HAS_GENES_TIER_1,  1);
            if (!targetIsAlien) {
                SetPlayerTechResearched(instance.unitInGeneZone.player, GENE_TECH_MOBILITY, 1);
            }
        }
        else if (castAbil === GENE_INSTALL_COSMIC_SENSITIVITY) {
            SetPlayerTechResearched(instance.unitInGeneZone.player, TECH_HAS_GENES_TIER_2,  1);
            if (!targetIsAlien) {
                // Do stuff
                this.game.event.addListener(new EventListener(EVENT_TYPE.CREW_TRANSFORM_ALIEN, 
                    (event: EventListener, data: any) => {
                        const zone = this.game.worldModule.getUnitZone(data.alien);
                        const ourZone = this.game.worldModule.getUnitZone(target.unit);
                        Log.Information("Game transform event post listener");
                        if (zone && ourZone && zone.id == ourZone.id) {
                            DisplayTextToPlayer(target.player, 0, 0, `TRANSFORM DETECTED`);
                        }
                    }));
            }
        }
        
        if (targetIsAlien) {
            DisplayTextToPlayer(target.player, 0, 0, messageAlien);
        }
    }
}