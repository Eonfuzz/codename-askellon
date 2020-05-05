/** @noSelfInFile **/
import { Game } from "../game";
import { Ability } from "./ability-type";
import { Trigger, Unit, Timer } from "w3ts";
import { AcidPoolAbility } from "./alien/acid-pool";
import { LeapAbility } from "./alien/leap";
import { TransformAbility } from "./alien/transform";
import { DiodeEjectAbility } from "./human/diode-ejector";
import { ABIL_TRANSFORM_HUMAN_ALIEN, ABIL_HUMAN_SPRINT, ABIL_ALIEN_ACID_POOL, ABIL_ALIEN_LEAP, ABIL_TRANSFORM_ALIEN_HUMAN, ABIL_ALIEN_SCREAM, ABIL_WEP_DIODE_EJ, ABIL_GENE_NIGHTEYE, SMART_ORDER_ID, ABIL_ITEM_REPAIR, ABIL_ITEM_EMOTIONAL_DAMP, ABIL_ITEM_CRYO_GRENADE, ABIL_GENE_COSMIC, ABIL_SHIP_CHAINGUN } from "resources/ability-ids";
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


const TIMEOUT = 0.03;

/**
 * Shouldn't really do that much other than initialise ability loops and triggers
 */
export class AbilityModule {
    public game: Game;

    private data: Array<Ability>;

    private triggerAbilityCast: Trigger;
    private unitIssuedCommand: Trigger;

    constructor(game: Game) {
        this.game = game;

        this.data = [];

        new Timer().start(TIMEOUT, true, () => this.process(TIMEOUT));

        // this.triggerIterator = new Trigger();
        // this.triggerIterator.registerTimerEvent(TIMEOUT, true);
        // this.triggerIterator.addAction(() => this.process(TIMEOUT));

        this.triggerAbilityCast = new Trigger();
        this.triggerAbilityCast.registerAnyUnitEvent( EVENT_PLAYER_UNIT_SPELL_EFFECT );
        this.triggerAbilityCast.addAction(() => this.checkSpells())

        this.unitIssuedCommand = new Trigger();

        this.unitIssuedCommand.addAction(() => this.onTrackUnitOrders())
    }


    /**
     * Called by the spell cast event
     * Checks to see if the spell is one of ours
     */
    checkSpells() {
        const id = GetSpellAbilityId();
        let instance: Ability;

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
            case ABIL_TRANSFORM_HUMAN_ALIEN:
            case ABIL_TRANSFORM_ALIEN_HUMAN:
                instance = new TransformAbility(id === ABIL_TRANSFORM_HUMAN_ALIEN);
                if (instance.initialise(this)) {
                    this.data.push(instance);
                }
                break;
        }
    }

    /**
     * Abilities that need to listen to unit orders
     * WARNING: The units must be added to the track list seperately
     */
    onTrackUnitOrders() {
        const triggerUnit = GetTriggerUnit();
        const orderId = GetIssuedOrderId();

        // Leap ability
        if (orderId == SMART_ORDER_ID && GetUnitAbilityLevel(triggerUnit, FourCC('LEAP')) >= 1) {
            const instance = new LeapAbility();
            if (instance.initialise(this)) {
                this.data.push(instance);
            }
        }
    }

    public trackUnitOrdersForAbilities(whichUnit: Unit) {
        // this.unitIssuedCommand.registerUnitEvent(whichUnit, EVENT_UNIT_ISSUED_TARGET_ORDER);
        this.unitIssuedCommand.registerUnitEvent(whichUnit, EVENT_UNIT_ISSUED_POINT_ORDER);
    }

    process(delta: number) {
        // Go through all abilities cast
        let result = [];
        for (let index = 0; index < this.data.length; index++) {
            const ability = this.data[index];
            const doDestroy = !ability.process(this, delta);
            // Destroy the ability if needed
            if (doDestroy) {
                ability.destroy(this);
            }
            else {
                result.push(ability);
            }
        }
        this.data = result;
    }

}