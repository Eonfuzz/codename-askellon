import { Entity } from "app/entity-type";
import { Hooks } from "lib/Hooks";
import { Trigger, Unit } from "w3ts/index";
import { Quick } from "lib/Quick";
import { EventEntity } from "app/events/event-entity";
import { EVENT_TYPE } from "app/events/event-enum";
import { EventListener } from "app/events/event-type";
import { Log } from "lib/serilog/serilog";
import { Timers } from "app/timer-type";

export class GlobalCooldownAbilityEntity extends Entity {
    private static instance: GlobalCooldownAbilityEntity;

    public static getInstance() {        
        if (this.instance == null) {
            this.instance = new GlobalCooldownAbilityEntity();
            Hooks.set(this.name, this.instance);
        }
        return this.instance;
    }

    // Debug logs or not
    private TRACE = false;

    private globalCooldownChecker: Trigger;
    private globalCooldownAbilListener: Trigger;

    /**
     * Our currently active cooldown abilities
     * Ensures synchronous looping of cooldowns
     */
    private globalCooldownEntries: number[] = [];
    private globalCooldownActiveAbilities: number[] = [];

    // /**
    //  * Our global cooldown abilities
    //  * <key> is ability id
    //  * <value> is their global cooldown
    //  */
    // private globalCooldownOriginalCooldown = new Map<number, number>();

    /**
     * The current remaining cooldown for an ability
     * <key> is ability id
     * <value> is current remaining cooldown
     */
    private globalCooldownAbilityRemaining = new Map<number, number>();

    /**
     * Living units that have global coolodwns
     * Used for more optimised event propagation
     */
    private unitsListeningToAbility = new Map<unit, number[]>();

    /**
     * The units that are listening to an ability cooldown
     * <key> is ability id
     * <value> is units that have the ability
     */
    private abilitiesOnUnits = new Map<number, unit[]>();

    constructor() {
        super();
        
        Timers.addTimedAction(0, () => {
            // Log.Information("Pre register");
            this.globalCooldownChecker = new Trigger();
            const r = CreateRegion();
            RegionAddRect(r, GetCameraBoundsMapRect());
            this.globalCooldownChecker.registerEnterRegion(r, Filter(() => true));
            this.globalCooldownChecker.addAction(() => this.onUnitAdd(GetTriggerUnit()));
    
            // Log.Information("Post register");
    
    
            /**
             * Listen to the removal of a unit from the game
             */
            EventEntity.listen(new EventListener(EVENT_TYPE.UNIT_REMOVED_FROM_GAME, 
                (event, data) => this.onUnitRemove(data.source)
            ));
    
            /**
             * Listen to units casting abilities
             */
            this.globalCooldownAbilListener = new Trigger();
            this.globalCooldownAbilListener.registerAnyUnitEvent(EVENT_PLAYER_UNIT_SPELL_EFFECT);
            this.globalCooldownAbilListener.addAction(() => this.onAbilityCast(GetTriggerUnit(), GetSpellAbilityId()));

        });

    }

    /**
     * Checks and adds a unit to our array of entries
     * @param u 
     */
    private onUnitAdd(u: unit) {  
        // try {
            // Loop through all our entries
            for (let index = 0; index < this.globalCooldownEntries.length; index++) {
                const abilId = this.globalCooldownEntries[index];
                // If our unit has the ability...
                if (BlzGetUnitAbility(u, abilId)) {
                    if (this.TRACE) Log.Information(`Starting ${GetUnitName(u)} for ${GetAbilityName(abilId)}`);

                    const cooldown = this.globalCooldownAbilityRemaining.get(abilId) || 0;
                    // Start it's cooldown
                    if (cooldown > 0) BlzStartUnitAbilityCooldown(u, abilId, cooldown);
                    
                    // Register what this unit is listening to
                    const abilsThisUnitIsListeningTo = this.unitsListeningToAbility.get(u) || [];
                    abilsThisUnitIsListeningTo.push(abilId);
                    this.unitsListeningToAbility.set(u, abilsThisUnitIsListeningTo);

                    // Register it in the ability -> unit map
                    const abilOnUnits = this.abilitiesOnUnits.get(abilId) || [];
                    abilOnUnits.push(u);
                    this.abilitiesOnUnits.set(abilId, abilOnUnits);

                    // Tracer
                    if (this.TRACE) Log.Information(`NEW ${GetUnitName(u)} for ${GetAbilityName(abilId)}`);
                }
            }
        // }
        // catch(e) {
        //     Log.Error(e);
        // }
    }

    /**
     * Checks and removes a unit from our array of entries
     * @param u 
     */
    private onUnitRemove(u: Unit) {
        
        const uAbils = this.unitsListeningToAbility.get(u.handle);
        if (!uAbils) return;

        // First remove the unit's entry
        this.unitsListeningToAbility.delete(u.handle);
        // Now remove it from each ability entry
        for (let index = 0; index < uAbils.length; index++) {
            const abil = uAbils[index];
            const abilOnUnits = this.abilitiesOnUnits.get(abil);
            const idx = abilOnUnits.indexOf(u.handle);
            if (idx >= 0) {
                Quick.Slice(abilOnUnits, idx);
                // Tracer
                if (this.TRACE) Log.Information(`REMOVED ${u.name} for ${GetAbilityName(abil)}`);
            }
        }
    }

    /**
     * When an ability is cast by ANY unit on the map
     * @param u 
     * @param a 
     */
    private onAbilityCast(u: unit, a: number) {
        // Is it in our registry
        const unitsListeningToAbility = this.abilitiesOnUnits.get(a);
        if (!unitsListeningToAbility || unitsListeningToAbility.length == 0) return;
        
        // fetch CD
        const cooldown = BlzGetAbilityCooldown(a, GetUnitAbilityLevel(u, a)-1);
        // Log.Information("Cooldown: "+cooldown);
        // Set the global cooldown
        this.globalCooldownAbilityRemaining.set(a, cooldown);
        // Add it to trackable entities
        this.globalCooldownActiveAbilities.push(a);
        
        // Loop through all units listening....
        for (let index = 0; index < unitsListeningToAbility.length; index++) {
            const listeningUnit = unitsListeningToAbility[index];
            // Set the cooldown
            BlzStartUnitAbilityCooldown(listeningUnit, a, cooldown);
            if (this.TRACE) Log.Information(`CAST ${GetUnitName(u)} for ${GetAbilityName(a)} set to ${cooldown}`);
        }
    }

    _timerDelay = 0.5;
    /**
     * Our entity stepper
     * Decrements cooldowns and removes them from the array if they aren't active
     */
    step() {
        // Go through our synchronous loop
        for (let index = 0; index < this.globalCooldownActiveAbilities.length; index++) {
            // Get the ability id
            const ability = this.globalCooldownActiveAbilities[index];
            // update our cooldown
            const t = (this.globalCooldownAbilityRemaining.get(ability) || 0) - this._timerDelay;

            if (t <= 0) {
                Quick.Slice(this.globalCooldownActiveAbilities, index--);
                this.globalCooldownAbilityRemaining.delete(ability);
                if (this.TRACE) Log.Information(`Cooldown finished for ${GetAbilityName(ability)}`);
            }
            else {
                this.globalCooldownAbilityRemaining.set(ability, t);
                if (this.TRACE) Log.Information(`Cooldown set ${GetAbilityName(ability)} = ${t}`);
            }
        }
    }
    
    /**
     * STATIC API
     */
    public static register(abil: number) {
        const instance = this.getInstance();
        // instance.globalCooldownOriginalCooldown.set(abil, cooldown);
        instance.globalCooldownEntries.push(abil);
    }
}