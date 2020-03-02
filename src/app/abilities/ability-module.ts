/** @noSelfInFile **/
import { Game } from "../game";
import { Ability } from "./ability-type";
import { Trigger } from "../types/jass-overrides/trigger";
import { Log } from "../../lib/serilog/serilog";
import { AcidPoolAbility } from "./alien/acid-pool";
import { LeapAbility } from "./alien/leap";
import { SMART_ORDER_ID } from "../../lib/order-ids";
import { TransformAbility } from "./alien/transform";
import { DiodeEjectAbility } from "./human/diode-ejector";
import { ABIL_TRANSFORM_HUMAN_ALIEN, ABIL_HUMAN_SPRINT, ABIL_ALIEN_ACID_POOL, ABIL_ALIEN_LEAP, ABIL_TRANSFORM_ALIEN_HUMAN, ABIL_ALIEN_SCREAM, ABIL_WEP_DIODE_EJ } from "resources/ability-ids";
import { ScreamAbility } from "./alien/scream";
import { SprintLeapAbility } from "./human/sprint-leap";


const TIMEOUT = 0.03;

/**
 * Shouldn't really do that much other than initialise ability loops and triggers
 */
export class AbilityModule {
    public game: Game;

    private data: Array<Ability>;

    private triggerIterator: Trigger;
    private triggerAbilityCast: Trigger;
    private unitIssuedCommand: Trigger;

    constructor(game: Game) {
        this.game = game;

        this.data = [];
        this.triggerIterator = new Trigger();
        this.triggerIterator.RegisterTimerEventPeriodic(TIMEOUT);
        this.triggerIterator.AddAction(() => this.process(TIMEOUT));

        this.triggerAbilityCast = new Trigger();
        this.triggerAbilityCast.RegisterAnyUnitEventBJ( EVENT_PLAYER_UNIT_SPELL_EFFECT );
        this.triggerAbilityCast.AddAction(() => this.checkSpells())

        this.unitIssuedCommand = new Trigger();

        this.unitIssuedCommand.AddAction(() => this.onTrackUnitOrders())
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

    public trackUnitOrdersForAbilities(whichUnit: unit) {
        // this.unitIssuedCommand.RegisterUnitIssuedOrder(whichUnit, EVENT_UNIT_ISSUED_TARGET_ORDER);
        this.unitIssuedCommand.RegisterUnitIssuedOrder(whichUnit, EVENT_UNIT_ISSUED_POINT_ORDER);
    }

    process(delta: number) {
        // Go through all abilities cast
        this.data = this.data.filter( ability => {
            const doDestroy = !ability.process(this, delta);
            // Destroy the ability if needed
            if (doDestroy) {
                ability.destroy(this);
            }
            return !doDestroy;
        });
    }

}