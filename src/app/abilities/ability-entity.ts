/** @noSelfInFile **/
import { Game } from "../game";
import { Ability } from "./ability-type";
import { Trigger, Unit, Timer } from "w3ts";
import { AcidPoolAbility } from "./alien/acid-pool";
import { LeapAbility } from "./alien/leap";
import { TransformAbility } from "./alien/transform";
import { DiodeEjectAbility } from "./human/diode-ejector";
import { ABIL_TRANSFORM_HUMAN_ALIEN, ABIL_ALIEN_SURVIVAL_INSTINCTS, ABIL_HUMAN_SPRINT, ABIL_ALIEN_LATCH, ABIL_ALIEN_ACID_POOL, ABIL_ALIEN_EVOLVE_T3, ABIL_ALIEN_LEAP, ABIL_TRANSFORM_ALIEN_HUMAN, ABIL_ALIEN_SCREAM, ABIL_WEP_DIODE_EJ, ABIL_GENE_NIGHTEYE, SMART_ORDER_ID, ABIL_ITEM_REPAIR, ABIL_ITEM_EMOTIONAL_DAMP, ABIL_ITEM_CRYO_GRENADE, ABIL_GENE_COSMIC, ABIL_SHIP_CHAINGUN, ABIL_SHIP_BARREL_ROLL_LEFT, ABIL_SHIP_BARREL_ROLL_RIGHT, ABIL_ITEM_TRIFEX, ABIL_SHIP_DEEP_SCAN, ABIL_SHIP_LASER, ABIL_ALIEN_EVOLVE_T1, ABIL_ALIEN_ACID_HURL, ABIL_ALIEN_CHARGE, ABIL_INQUIS_PURITY_SEAL, ABIL_INQUIS_SMITE, ABIL_ALIEN_EVOLVE_T2, ABIL_ITEM_GENETIC_SAMPLER, ABIL_ACTIVATE_SEQUENCER_TEST } from "resources/ability-ids";
import { ScreamAbility } from "./alien/scream";
import { SprintLeapAbility } from "./human/sprint-leap";
import { NightVisionAbility } from "./human/night-vision";
import { ItemRepairAbility } from "./human/repair";
import { SNIPER_ABILITY_ID, AT_ABILITY_DRAGONFIRE_BLAST } from "app/weapons/weapon-constants";
import { RailRifleAbility } from "./human/rail-rifle";
import { Log } from "lib/serilog/serilog";
import { DragonFireBlastAbility } from "./human/dragonfire-blast";
import { EmotionalDampenerAbility } from "./human/emotional-dampener";
import { CryoGrenadeAbility } from "./human/cryo-grenade";
import { EmbraceCosmosAbility } from "./human/cosmos-embrace";
import { ShipChaingunAbility } from "./human/ship-chaingun";
import { ShipBarrelRoll } from "./human/ship-barrel-roll";
import { TrifexAbility } from "./human/trifex";
import { ShipDeepScanAbility } from "./human/ship-scan";
import { ShipMacroLasAbility } from "./human/ship-macro-las";
import { EvolveAbility } from "./alien/evolve";
import { ROACH_ALIEN_FORM, ZERGLING_ALIEN_FORM } from "resources/unit-ids";
import { AcidStigmataAbility } from "./alien/acid-stigmata";
import { BusterChargeAbility } from "./alien/buster-charge";
import { PuritySealAbility } from "./human/inquis-purity-seal";
import { SmiteAbility } from "./human/inquis-smite";
import { LatchAbility } from "./alien/latch";
import { SurvivalInstinctsAbility } from "./alien/survival-instincts";
import { GeneticSamplerItemAbility } from "./items/genetic-sample";
import { GeneticSequenceAbility } from "./station/genetic-sample";
import { Entity } from "app/entity-type";

/**
 * Shouldn't really do that much other than initialise ability loops and triggers
 */
export class AbilityEntity extends Entity {
    private static instance: AbilityEntity;

    public static getInstance() {        
        if (this.instance == null) {
            this.instance = new AbilityEntity();
        }
        return this.instance;
    }

    private abilityQueue: Array<Ability>;

    private triggerAbilityCast: Trigger;

    constructor() {
        super();
        this.abilityQueue = [];

        this.triggerAbilityCast = new Trigger();
        this.triggerAbilityCast.registerAnyUnitEvent( EVENT_PLAYER_UNIT_SPELL_EFFECT );
        this.triggerAbilityCast.addAction(() => this.checkSpells())
    }


    /**
     * Called by the spell cast event
     * Checks to see if the spell is one of ours
     */
    checkSpells() {
        const id = GetSpellAbilityId();
        let instance: Ability;

        // Log.Information("New Ability!");

        switch(id) {
            case ABIL_HUMAN_SPRINT:
                instance = new SprintLeapAbility();
                if (instance.initialise()) {
                    this.abilityQueue.push(instance);
                }
                break;
            case ABIL_INQUIS_PURITY_SEAL:
                instance = new PuritySealAbility();
                if (instance.initialise()) {
                    this.abilityQueue.push(instance);
                }
                break;
            case ABIL_INQUIS_SMITE:
                instance = new SmiteAbility(false);
                if (instance.initialise()) {
                    this.abilityQueue.push(instance);
                }
                break;
            case ABIL_WEP_DIODE_EJ:
                instance = new DiodeEjectAbility();
                if (instance.initialise()) {
                    this.abilityQueue.push(instance);
                }
                break;
            case ABIL_GENE_NIGHTEYE:
                instance = new NightVisionAbility();
                if (instance.initialise()) {
                    this.abilityQueue.push(instance);
                }
                break;
            case ABIL_ALIEN_ACID_POOL:
                instance = new AcidPoolAbility();
                if (instance.initialise()) {
                    this.abilityQueue.push(instance);
                }
                break;
            case ABIL_ALIEN_LEAP:
                instance = new LeapAbility();
                if (instance.initialise()) {
                    this.abilityQueue.push(instance);
                }
                break;
            case ABIL_ALIEN_SCREAM:
                instance = new ScreamAbility();
                if (instance.initialise()) {
                    this.abilityQueue.push(instance);
                }
                break;
            case ABIL_ITEM_REPAIR:
                instance = new ItemRepairAbility();
                if (instance.initialise()) {
                    this.abilityQueue.push(instance);
                }
                break;
            case SNIPER_ABILITY_ID:
                instance = new RailRifleAbility();
                if (instance.initialise()) {
                    this.abilityQueue.push(instance);
                }
                break;
            case AT_ABILITY_DRAGONFIRE_BLAST:
                instance = new DragonFireBlastAbility();
                if (instance.initialise()) {
                    this.abilityQueue.push(instance);
                }
                break;
            case ABIL_ITEM_EMOTIONAL_DAMP:
                instance = new EmotionalDampenerAbility();
                if (instance.initialise()) {
                    this.abilityQueue.push(instance);
                }
                break;
            case ABIL_ITEM_CRYO_GRENADE:
                instance = new CryoGrenadeAbility();
                if (instance.initialise()) {
                    this.abilityQueue.push(instance);
                }
                break;
            case ABIL_ITEM_GENETIC_SAMPLER:
                instance = new GeneticSamplerItemAbility();
                if (instance.initialise()) {
                    this.abilityQueue.push(instance);
                }
                break;
            case ABIL_ITEM_TRIFEX:
                instance = new TrifexAbility();
                if (instance.initialise()) {
                    this.abilityQueue.push(instance);
                }
                break;
            case ABIL_GENE_COSMIC:
                instance = new EmbraceCosmosAbility();
                if (instance.initialise()) {
                    this.abilityQueue.push(instance);
                }
                break;
            case ABIL_SHIP_CHAINGUN:
                instance = new ShipChaingunAbility();
                if (instance.initialise()) {
                    this.abilityQueue.push(instance);
                }
                break;
            case ABIL_SHIP_DEEP_SCAN:
                instance = new ShipDeepScanAbility();
                if (instance.initialise()) {
                    this.abilityQueue.push(instance);
                }
                break;
            case ABIL_SHIP_LASER:
                instance = new ShipMacroLasAbility();
                if (instance.initialise()) {
                    this.abilityQueue.push(instance);
                }
                break;
            case ABIL_ACTIVATE_SEQUENCER_TEST:
                instance = new GeneticSequenceAbility();
                if (instance.initialise()) {
                    this.abilityQueue.push(instance);
                }
                break;
            case ABIL_ALIEN_ACID_HURL:
                instance = new AcidStigmataAbility();
                if (instance.initialise()) {
                    this.abilityQueue.push(instance);
                }
                break;    
            case ABIL_ALIEN_CHARGE:
                instance = new BusterChargeAbility();
                if (instance.initialise()) {
                    this.abilityQueue.push(instance);
                }
                break;  
            case ABIL_ALIEN_SURVIVAL_INSTINCTS:
                instance = new SurvivalInstinctsAbility();
                if (instance.initialise()) {
                    this.abilityQueue.push(instance);
                }
                break;  
            case ABIL_ALIEN_LATCH:
                instance = new LatchAbility();
                if (instance.initialise()) {
                    this.abilityQueue.push(instance);
                }
                break;               
            case ABIL_ALIEN_EVOLVE_T1:
                instance = new EvolveAbility(ZERGLING_ALIEN_FORM);
                if (instance.initialise()) {
                    this.abilityQueue.push(instance);
                }
                break;             
            case ABIL_ALIEN_EVOLVE_T2:
                instance = new EvolveAbility(ROACH_ALIEN_FORM);
                if (instance.initialise()) {
                    this.abilityQueue.push(instance);
                }
                break;    
            case ABIL_ALIEN_EVOLVE_T3:
                instance = new EvolveAbility(ROACH_ALIEN_FORM);
                if (instance.initialise()) {
                    this.abilityQueue.push(instance);
                }
                break;
            case ABIL_SHIP_BARREL_ROLL_LEFT:
            case ABIL_SHIP_BARREL_ROLL_RIGHT:
                instance = new ShipBarrelRoll();
                if (instance.initialise()) {
                    this.abilityQueue.push(instance);
                }
                break;
            case ABIL_TRANSFORM_HUMAN_ALIEN:
            case ABIL_TRANSFORM_ALIEN_HUMAN:
                instance = new TransformAbility(id === ABIL_TRANSFORM_HUMAN_ALIEN);
                if (instance.initialise()) {
                    this.abilityQueue.push(instance);
                }
                break;
        }
    }

    step() {
        // Go through all abilities cast
        let i = 0;
        while (i < this.abilityQueue.length) {
            const ability = this.abilityQueue[i];
            const doDestroy = !ability.process(this._timerDelay);

            // Destroy the ability if needed
            if (!doDestroy || !ability.destroy()) {
                // Increment i
                i++;
            }
            else {
                // Otherwise delete and loop again
                this.abilityQueue[i] = this.abilityQueue[this.abilityQueue.length-1];
                delete this.abilityQueue[this.abilityQueue.length - 1];
            }
        }
    }

}