import { Entity } from "app/entity-type";
import { UnitDex, UnitDexEvent } from "app/events/unit-indexer";
import { Hooks } from "lib/Hooks";
import { Log } from "lib/serilog/serilog";
import { Trigger, Unit } from "w3ts/index";
import { Ability } from "./ability-type";
import { Behaviour } from "./behaviour";
import { ABILITY_HOOK } from "./hook-types";
import { MessageAllPlayers, MessagePlayer } from "lib/utils";
import { Timers } from "app/timer-type";
import { SHIP_MAIN_ASKELLON } from "resources/unit-ids";
import { EventEntity } from "app/events/event-entity";
import { EVENT_TYPE } from "app/events/event-enum";
import { EmulateCast } from "./emulate-cast-type";

/**
 * Interface to support adding / removal of ability hooks from ability funcs
 * Used in ./ability-entity.ts to lookup and create the correct abilities
 */
export class AbilityHooks extends Entity {
    private static instance: AbilityHooks;

    public static getInstance() {
        if (this.instance == null) {
            this.instance = new AbilityHooks();
            Hooks.set(this.name, this.instance);
        }
        return this.instance;
    }

    // Hooks to listen for
    // - unit attacks
    // - unit is attacked
    // - unit issued order
    // - before unit takes damage
    // - after unit takes damage
    // - before unit deals damage
    // - after unit deals damage

    // Our behaviours
    private behavioursForUnit = new Map<number, Behaviour[]>();
    private behaviours: Behaviour[] = [];
    private behaviourHooks = new Map<number, () => Behaviour>();
    private behaviourKeys: number[] = [];

    // Our ability instances
    private abilities: Ability[] = [];
    private abilityHooks = new Map<number, () => Ability>();

    constructor() {
        super();

        _G.CreateUnit = Hooks.hookResult(_G.CreateUnit, (u) => this.unitCreatedEvent(Unit.fromHandle(u)));
        _G.CreateUnitByName = Hooks.hookResult(_G.CreateUnitByName, (u) => this.unitCreatedEvent(Unit.fromHandle(u)));
        _G.CreateUnitAtLoc = Hooks.hookResult(_G.CreateUnitAtLoc, (u) => this.unitCreatedEvent(Unit.fromHandle(u)));
        _G.CreateUnitAtLocByName = Hooks.hookResult(_G.CreateUnitAtLocByName, (u) => this.unitCreatedEvent(Unit.fromHandle(u)));
        _G.BlzCreateUnitWithSkin = Hooks.hookResult(_G.BlzCreateUnitWithSkin, (u) => this.unitCreatedEvent(Unit.fromHandle(u)));
        

        const attackTrigger = new Trigger();
        attackTrigger.registerAnyUnitEvent(EVENT_PLAYER_UNIT_ATTACKED);
        attackTrigger.addAction(() => {
            this.unitAttacks(GetAttacker());
            this.unitAttacked(GetTriggerUnit());
        });

        const preDamageTrigger = new Trigger();
        preDamageTrigger.registerAnyUnitEvent(EVENT_PLAYER_UNIT_DAMAGED);
        preDamageTrigger.addAction(() => {
            this.unitPreDamaged(GetTriggerUnit());
            this.unitPreDamaging(GetEventDamageSource());
        });

        const postDamageTrigger = new Trigger();
        postDamageTrigger.registerAnyUnitEvent(EVENT_PLAYER_UNIT_DAMAGING);
        postDamageTrigger.addAction(() => {
            this.unitPostDamaged(GetTriggerUnit());
            this.unitPostDamaging(GetEventDamageSource());
        });

        const castAbilityTrigger = new Trigger();
        castAbilityTrigger.registerAnyUnitEvent(EVENT_PLAYER_UNIT_SPELL_EFFECT);
        castAbilityTrigger.addAction(() => {
            const u = Unit.fromHandle(GetTriggerUnit());
            this.unitCastsSpell();
            this.sendBehaviourEvent(u, ABILITY_HOOK.UnitCastsAbility);
        });

        const unitDiesTrigger = new Trigger();
        unitDiesTrigger.registerAnyUnitEvent(EVENT_PLAYER_UNIT_DEATH);
        unitDiesTrigger.addAction(() => {
            this.sendBehaviourEvent(Unit.fromHandle(GetDyingUnit()), ABILITY_HOOK.UnitDies);
            this.sendBehaviourEvent(Unit.fromHandle(GetKillingUnit()), ABILITY_HOOK.UnitKills);
        });

        const heroLearnsAbilityTrigger = new Trigger();
        heroLearnsAbilityTrigger.registerAnyUnitEvent(EVENT_PLAYER_HERO_SKILL);
        heroLearnsAbilityTrigger.addAction(() => {
            const u = Unit.fromEvent();

            // If we are learning this skill for the first time
            if (u.getAbilityLevel(GetLearnedSkill()) === 1) {
                // Check if we have behaviours for it
                this.checkBehaviourKeysForAbility(u, GetLearnedSkill());
            }
            // Then fire learn event
            this.sendBehaviourEvent(u, ABILITY_HOOK.UnitLearnsASkill);
        });

        // Hook into udex to remove dying units from this entity
        UnitDex.registerEvent(UnitDexEvent.DEINDEX, () => {
            const keysForDyingUnit = this.behavioursForUnit.get(UnitDex.eventUnit.id);
            if (keysForDyingUnit) {
                keysForDyingUnit.forEach(k => {
                    if (k.doDestroy()) {
                        k.destroy();
                        const idx = this.behaviours.indexOf(k);
                        if (idx >= 0) this.behaviours.splice(idx, 1);                        
                    }
                });
                this.behavioursForUnit.delete(UnitDex.eventUnit.id);
            }
        });

        EventEntity.listen(EVENT_TYPE.ABILITY_CAST, (ev, data) => {
            this.emulateCast(data.data as EmulateCast);
        });

        EventEntity.listen(EVENT_TYPE.ADD_BEHAVIOUR_INSTANCE, (ev, data) => {
            Log.Information("Add behaviour instance!");
            this.createBehaviour(data.data?.behaviour(), data.source)
        });
    }

    public checkExistingUnit() {
        // Iterate across all pre-placed units
        const world = GetWorldBounds();
        // Detect units when they enter or leave the map
        GroupEnumUnitsInRect(CreateGroup(), world, Filter(() => {
            const u = GetFilterUnit();
            this.checkBehaviourKeysFor(Unit.fromHandle(u));
            return false;
        }));

    }

    private unitCreatedEvent(u: Unit) {
        // Bug fix
        // Delay the check because some abilities can be added dynamically // teh tick the unit spawns in
        Timers.addTimedAction(this._timerDelay, () => {
            this.checkBehaviourKeysFor(u);
            this.sendBehaviourEvent(u, ABILITY_HOOK.UnitEntersMap);
        });
    }

    private unitAttacks(attackingUnit: unit) {
        if (attackingUnit !== undefined) {
            this.sendBehaviourEvent(Unit.fromHandle(attackingUnit), ABILITY_HOOK.UnitAttacks);
        }
        else {
            Log.Error("Null unit passed to unitAttacks");
        }
    }
    private unitAttacked(attackedUnit: unit) {
        if (attackedUnit !== undefined) {
            this.sendBehaviourEvent(Unit.fromHandle(attackedUnit), ABILITY_HOOK.UnitIsAttacked);
        }
        else {
            Log.Error("Null unit passed to unitAttacked");
        }
    }
    private unitPreDamaged(damagedUnit: unit) {
        if (damagedUnit !== undefined) {
            this.sendBehaviourEvent(Unit.fromHandle(damagedUnit), ABILITY_HOOK.PreUnitTakesDamage);
        }
        else {
            Log.Error("Null unit passed to unitPreDamaged");
        }
    }
    private unitPreDamaging(damagingUnit: unit) {
        if (damagingUnit !== undefined) {
            this.sendBehaviourEvent(Unit.fromHandle(damagingUnit), ABILITY_HOOK.PreUnitDealsDamage);
        }
        else {
            Log.Error("Null unit passed to unitPreDamaging");
        }
    }
    private unitPostDamaged(damagedUnit: unit) {
        if (damagedUnit !== undefined) {
            this.sendBehaviourEvent(Unit.fromHandle(damagedUnit), ABILITY_HOOK.PostUnitTakesDamage);
        }
        else {
            Log.Error("Null unit passed to unitPostDamaged");
        }
    }
    private unitPostDamaging(damagingUnit: unit) {
        if (damagingUnit !== undefined) {
            this.sendBehaviourEvent(Unit.fromHandle(damagingUnit), ABILITY_HOOK.PostUnitDealsDamage);
        }
        else {
            Log.Error("Null unit passed to PostDamaging");
        }
    }

    private checkBehaviourKeysFor(u: Unit) {
        this.behaviourKeys.forEach(abilId => {
            this.checkBehaviourKeysForAbility(u, abilId);
        });
    }

    private checkBehaviourKeysForAbility(u: Unit, abilId: number) {
        if (u.getAbilityLevel(abilId) > 0) {
            // Log.Information(`Found behaviour for unit:  ${u.name}`)
            const behaviour = AbilityHooks.Behaviour(abilId);
            if (behaviour) {
                this.createBehaviour(behaviour, u);
            }
        }
    }

    private createBehaviour(behaviour: Behaviour, forUnit: Unit) {
        if (behaviour.init(forUnit)) {
            const behaviours = this.behavioursForUnit.get(forUnit.id) || [];
            behaviours.push(behaviour);

            this.behaviours.push(behaviour);
            this.behavioursForUnit.set(forUnit.id, behaviours);
        }
    }

    private sendBehaviourEvent(u: Unit | undefined, ev: ABILITY_HOOK) {
        if (u && u.id) {
            const behaviours = this.behavioursForUnit.get(u.id);
            if (behaviours && behaviours.length > 0) {
                for (let index = 0; index < behaviours.length; index++) {
                    const b = behaviours[index];
                    try {
                        b.onEvent(ev);
                        if (b.doDestroy()) {
                            b.destroy();
                            behaviours.splice(index--, 1);
                            if (behaviours.length === 0) {
                                this.behavioursForUnit.delete(u.id);
                            }
                        }    
                    }
                    catch(e) {
                        Log.Error("Behaviour Error: ", e);
                    }   
                }
            }
        }
    }

    /**
     * Can create an "ability" instance
     * @param castingUnit 
     */
    private unitCastsSpell() {
        const id = GetSpellAbilityId();
        const ability = AbilityHooks.Ability(id);
        if (ability && ability.init()) {
            this.abilities.push(ability);
        }
    }

    private emulateCast(opt: EmulateCast) {
        const id = opt.spellId;
        const ability = AbilityHooks.Ability(id);
        ability.targetLocation = opt.targetLocation;
        ability.casterUnit = opt.caster;
        ability.targetUnit = opt.target;

        if (ability && ability.init()) {
            this.abilities.push(ability);
        }
    }
    
    /**
     * 
     */
    step() {
        // Go through all abilities cast
        this.itAbilities();
        // Iterate behaviours
        this.itBehaviours();
    }

    private itAbilities() {
        let i = 0;
        /**
         * Iterate abilities
         */
        try {
            while (i < this.abilities.length) {
                const ability = this.abilities[i];

                if (ability.doDestroy()) {                    
                    ability.destroy();
                    // Otherwise delete and loop again
                    this.abilities[i] = this.abilities[this.abilities.length-1];
                    delete this.abilities[this.abilities.length - 1];
                }
                else {
                    // Step
                    ability.step(this._timerDelay);
                    // Increment i
                    i++;
                }
            }
        }
        catch (e) {
            const erroringAbility = this.abilities[i];

            try {
                erroringAbility.destroy();
            }
            catch(e) {}
            
            this.abilities[i] = this.abilities[this.abilities.length-1];
            delete this.abilities[this.abilities.length - 1];
        }
    }

    private itBehaviours() {
        let i = 0;
        /**
         * Iterate behaviours
         */
        try {
            while (i < this.behaviours.length) {
                const behaviour = this.behaviours[i];

                if (behaviour.doDestroy()) {                    
                    behaviour.destroy();
                    // Otherwise delete and loop again
                    this.behaviours[i] = this.behaviours[this.behaviours.length-1];
                    delete this.behaviours[this.behaviours.length - 1];
                }
                else {
                    // Step
                    behaviour.step(this._timerDelay);
                    // Increment i
                    i++;
                }
            }
        }
        catch (e) {
            Log.Error("Error in iterating behaviours");
            Log.Error(e);
            const behaviourAbility = this.behaviours[i];
            try {
                behaviourAbility.destroy();
            }
            catch(e) {}
            
            this.behaviours[i] = this.behaviours[this.behaviours.length-1];
            delete this.behaviours[this.behaviours.length - 1];
        }
    }

    public static AddAbility(abilId: number, instanceFunc: () => Ability) {
        this.getInstance().abilityHooks.set(abilId, instanceFunc)
    }

    public static AddBehaiour(abilId: number, instanceFunc: () => Behaviour) {
        if (!this.getInstance().behaviourHooks.has(abilId)) {
            this.getInstance().behaviourKeys.push(abilId);
        }
        this.getInstance().behaviourHooks.set(abilId, instanceFunc);
    }

    public static Ability(abilId: number) {
        const i = this.getInstance();
        const hook = i.abilityHooks.get(abilId);
        return hook ? hook () : undefined;
    }

    public static Behaviour(abilId: number) {
        const i = this.getInstance();
        const hook = i.behaviourHooks.get(abilId);
        return hook ? hook () : undefined;
    }
}