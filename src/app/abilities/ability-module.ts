/** @noSelfInFile **/
import { Game } from "../game";
import { Ability } from "./ability-type";
import { Trigger, Unit, Timer } from "w3ts";
import { AcidPoolAbility } from "./alien/acid-pool";
import { LeapAbility } from "./alien/leap";
import { TransformAbility } from "./alien/transform";
import { DiodeEjectAbility } from "./human/diode-ejector";
import { ABIL_TRANSFORM_HUMAN_ALIEN, ABIL_HUMAN_SPRINT, ABIL_ALIEN_ACID_POOL, ABIL_ALIEN_LEAP, ABIL_TRANSFORM_ALIEN_HUMAN, ABIL_ALIEN_SCREAM, ABIL_WEP_DIODE_EJ, ABIL_GENE_NIGHTEYE, SMART_ORDER_ID, ABIL_ITEM_REPAIR, ABIL_ITEM_EMOTIONAL_DAMP, ABIL_ITEM_CRYO_GRENADE, ABIL_GENE_COSMIC, ABIL_SHIP_CHAINGUN, ABIL_SHIP_BARREL_ROLL_LEFT, ABIL_SHIP_BARREL_ROLL_RIGHT, ABIL_ITEM_TRIFEX, ABIL_SHIP_DEEP_SCAN, ABIL_SHIP_LASER, ABIL_ALIEN_EVOLVE_T1, ABIL_ALIEN_ACID_HURL, ABIL_ALIEN_CHARGE } from "resources/ability-ids";
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
import { ROACH_ALIEN_FORM } from "resources/unit-ids";
import { AcidStigmataAbility } from "./alien/acid-stigmata";
import { BusterChargeAbility } from "./alien/buster-charge";


const TIMEOUT = 0.03;

/**
 * Shouldn't really do that much other than initialise ability loops and triggers
 */
export class AbilityModule {
    public game: Game;

    private data: Array<Ability>;

    private triggerAbilityCast: Trigger;

    constructor(game: Game) {
        this.game = game;

        this.data = [];

        // this.triggerIterator = new Trigger();
        // this.triggerIterator.registerTimerEvent(TIMEOUT, true);
        // this.triggerIterator.addAction(() => this.process(TIMEOUT));

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
                if (instance.initialise(this)) {
                    this.data.push(instance);
                }
                break;
            case ABIL_WEP_DIODE_EJ:
                instance = new DiodeEjectAbility();
                if (instance.initialise(this)) {
                    this.data.push(instance);
                }
                break;
            case ABIL_GENE_NIGHTEYE:
                instance = new NightVisionAbility();
                if (instance.initialise(this)) {
                    this.data.push(instance);
                }
                break;
            case ABIL_ALIEN_ACID_POOL:
                instance = new AcidPoolAbility();
                if (instance.initialise(this)) {
                    this.data.push(instance);
                }
                break;
            case ABIL_ALIEN_LEAP:
                instance = new LeapAbility();
                if (instance.initialise(this)) {
                    this.data.push(instance);
                }
                break;
            case ABIL_ALIEN_SCREAM:
                instance = new ScreamAbility();
                if (instance.initialise(this)) {
                    this.data.push(instance);
                }
                break;
            case ABIL_ITEM_REPAIR:
                instance = new ItemRepairAbility();
                if (instance.initialise(this)) {
                    this.data.push(instance);
                }
                break;
            case SNIPER_ABILITY_ID:
                instance = new RailRifleAbility();
                if (instance.initialise(this)) {
                    this.data.push(instance);
                }
                break;
            case AT_ABILITY_DRAGONFIRE_BLAST:
                instance = new DragonFireBlastAbility();
                if (instance.initialise(this)) {
                    this.data.push(instance);
                }
                break;
            case ABIL_ITEM_EMOTIONAL_DAMP:
                instance = new EmotionalDampenerAbility();
                if (instance.initialise(this)) {
                    this.data.push(instance);
                }
                break;
            case ABIL_ITEM_CRYO_GRENADE:
                instance = new CryoGrenadeAbility();
                if (instance.initialise(this)) {
                    this.data.push(instance);
                }
                break;
            case ABIL_ITEM_TRIFEX:
                instance = new TrifexAbility();
                if (instance.initialise(this)) {
                    this.data.push(instance);
                }
                break;
            case ABIL_GENE_COSMIC:
                instance = new EmbraceCosmosAbility();
                if (instance.initialise(this)) {
                    this.data.push(instance);
                }
                break;
            case ABIL_SHIP_CHAINGUN:
                instance = new ShipChaingunAbility();
                if (instance.initialise(this)) {
                    this.data.push(instance);
                }
                break;
            case ABIL_SHIP_DEEP_SCAN:
                instance = new ShipDeepScanAbility();
                if (instance.initialise(this)) {
                    this.data.push(instance);
                }
                break;
            case ABIL_SHIP_LASER:
                instance = new ShipMacroLasAbility();
                if (instance.initialise(this)) {
                    this.data.push(instance);
                }
                break;
            case ABIL_ALIEN_ACID_HURL:
                instance = new AcidStigmataAbility();
                if (instance.initialise(this)) {
                    this.data.push(instance);
                }
                break;    
            case ABIL_ALIEN_CHARGE:
                instance = new BusterChargeAbility();
                if (instance.initialise(this)) {
                    this.data.push(instance);
                }
                break;                
            case ABIL_ALIEN_EVOLVE_T1:
                instance = new EvolveAbility(ROACH_ALIEN_FORM);
                if (instance.initialise(this)) {
                    this.data.push(instance);
                }
                break;
            case ABIL_SHIP_BARREL_ROLL_LEFT:
            case ABIL_SHIP_BARREL_ROLL_RIGHT:
                instance = new ShipBarrelRoll();
                if (instance.initialise(this)) {
                    this.data.push(instance);
                }
                break;
            case ABIL_TRANSFORM_HUMAN_ALIEN:
            case ABIL_TRANSFORM_ALIEN_HUMAN:
                instance = new TransformAbility(id === ABIL_TRANSFORM_HUMAN_ALIEN);
                if (instance.initialise(this)) {
                    this.data.push(instance);
                }
                break;
        }
    }

    process(delta: number) {
        if (this.data.length === 0) return;

        // Go through all abilities cast
        let result = [];
        for (let index = 0; index < this.data.length; index++) {
            const ability = this.data[index];
            const doDestroy = !ability.process(this, delta);
            // Destroy the ability if needed
            if (!doDestroy || !ability.destroy(this)) {
                result.push(ability);
            }
        }
        this.data = result;
    }

}