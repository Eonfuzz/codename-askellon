/** @noSelfInFile **/
import { Game } from "../game";
import { Ability } from "./ability-type";
import { Trigger } from "../types/jass-overrides/trigger";
import { RollWhenSprinting } from "./human/roll-sprint";
import { Log } from "../../lib/serilog/serilog";
import { AcidPoolAbility } from "./alien/acid-pool";
import { LeapAbility } from "./alien/leap";
import { SMART_ORDER_ID } from "../../lib/order-ids";
import { TRANSFORM_ID, TransformAbility } from "./alien/transform";


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

        // Sprint
        if (id === FourCC('A003')) {
            const instance = new RollWhenSprinting();
            if (instance.initialise(this)) {
                // Log.Information("Adding new A003[SPRINT] to ability queue");
                this.data.push(instance);
            }
        }
        else if (id === FourCC('ACID')) {
            const instance = new AcidPoolAbility();
            if (instance.initialise(this)) {
                // Log.Information("Adding new ACID[ACID POOL] to ability queue");
                this.data.push(instance);
            }
        }
        else if (id === FourCC('LEAP')) {
            const instance = new LeapAbility();
            if (instance.initialise(this)) {
                this.data.push(instance);
            }
        }
        else if (id === TRANSFORM_ID) {
            const instance = new TransformAbility();
            if (instance.initialise(this)) {
                this.data.push(instance);
            }
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
        this.data = this.data.filter( ability => {
            const doDestroy = !ability.process(this, delta);
            if (doDestroy) {
                // Log.Information(`Removing expired ability`);
                ability.destroy(this);
            }
            return !doDestroy;
        });
    }

}