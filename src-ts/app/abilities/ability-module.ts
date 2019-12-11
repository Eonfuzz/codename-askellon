/** @noSelfInFile **/
import { Game } from "../game";
import { Ability } from "./ability-type";
import { Trigger } from "../types/jass-overrides/trigger";
import { rollWhenSprinting } from "./roll-sprint";
import { Log } from "../../lib/serilog/serilog";


const TIMEOUT = 0.03;

/**
 * Shouldn't really do that much other than initialise ability loops and triggers
 */
export class AbilityModule {
    public game: Game;

    private data: Array<Ability>;

    private triggerIterator: Trigger;
    private triggerAbilityCast: Trigger;

    constructor(game: Game) {
        this.game = game;

        this.data = [];
        this.triggerIterator = new Trigger();
        this.triggerIterator.RegisterTimerEventPeriodic(TIMEOUT);
        this.triggerIterator.AddAction(() => this.process(TIMEOUT));

        this.triggerAbilityCast = new Trigger();
        this.triggerAbilityCast.RegisterAnyUnitEventBJ( EVENT_PLAYER_UNIT_SPELL_FINISH );
        this.triggerAbilityCast.AddAction(() => this.checkSpells())
    }


    /**
     * Called by the spell cast event
     * Checks to see if the spell is one of ours
     */
    checkSpells() {
        const id = GetSpellAbilityId();

        // Sprint
        if (id === FourCC('A003')) {
            const instance = new rollWhenSprinting();
            if (instance.initialise(this)) {
                Log.Information("Adding new A003[SPRINT] to ability queue");
                this.data.push(instance);
            }
        }
    }

    process(delta: number) {
        this.data = this.data.filter( ability => {
            const doDestroy = !ability.process(this, delta);
            if (doDestroy) {
                Log.Information(`Removing expired ability`);
                ability.destroy(this);
            }
            return !doDestroy;
        });
    }
}