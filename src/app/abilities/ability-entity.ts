import { Ability } from "./ability-type";
import { Trigger, Unit, Timer } from "w3ts";
import { Entity } from "app/entity-type";
import { Hooks } from "lib/Hooks";
import { AbilityHooks } from "./ability-hooks";
import { Log } from "lib/serilog/serilog";

/**
 * Shouldn't really do that much other than initialise ability loops and triggers
 */
export class AbilityEntity extends Entity {
    private static instance: AbilityEntity;

    public static getInstance() {        
        if (this.instance == null) {
            this.instance = new AbilityEntity();
            Hooks.set(this.name, this.instance);
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
        this.triggerAbilityCast.addAction(() => this.checkSpells());
    }


    /**
     * Called by the spell cast event
     * Checks to see if the spell is one of ours
     */
    private checkSpells() {
        const id = GetSpellAbilityId();
        const ability = AbilityHooks.Get(id);
        if (ability) {
            try {
                if (ability.initialise())
                    this.abilityQueue.push(ability);
            }
            catch(e) {
                Log.Error(e);
            }
        }

    }


    _timerDelay = 0.02;
    step() {
        // Go through all abilities cast
        let i = 0;

        try {
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
        catch (e) {
            const erroringAbility = this.abilityQueue[i];

            Log.Error("Error in Ability Entity ");
            Log.Error(e);

            try {
                erroringAbility.destroy();
            }
            catch(e) {

            }
            
            this.abilityQueue[i] = this.abilityQueue[this.abilityQueue.length-1];
            delete this.abilityQueue[this.abilityQueue.length - 1];
        }
    }

}