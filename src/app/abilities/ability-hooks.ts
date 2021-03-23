import { Entity } from "app/entity-type";
import { UnitDex, UnitDexEvent } from "app/events/unit-indexer";
import { Hooks } from "lib/Hooks";
import { Log } from "lib/serilog/serilog";
import { Trigger, Unit } from "w3ts/index";
import { Ability, AbilityWithDone } from "./ability-type";
import { Behaviour } from "./behaviour";
import { ABILITY_HOOK } from "./hook-types";
import { 
    ABIL_ALIEN_ACID_POOL, 
    ABIL_ALIEN_ACID_HURL, 
    ABIL_ALIEN_CHARGE, 
    ABIL_ALIEN_EVOLVE_T1, 
    ABIL_ALIEN_EVOLVE_T2, 
    ABIL_ALIEN_LATCH, 
    ABIL_ALIEN_LEAP, 
    ABIL_ALIEN_SCREAM, 
    ABIL_ALIEN_SURVIVAL_INSTINCTS, 
    ABIL_TRANSFORM_ALIEN_HUMAN, 
    ABIL_TRANSFORM_HUMAN_ALIEN, 
    ABIL_GENE_COSMIC,
    ABIL_ITEM_CRYO_GRENADE,
    ABIL_WEP_DIODE_EJ,
    ABIL_ITEM_EMOTIONAL_DAMP,
    ABIL_INQUIS_PURITY_SEAL,
    ABIL_INQUIS_SMITE,
    ABIL_GENE_NIGHTEYE,
    ABIL_ITEM_REPAIR,
    ABIL_SHIP_BARREL_ROLL_LEFT,
    ABIL_SHIP_BARREL_ROLL_RIGHT,
    ABIL_SHIP_LASER,
    ABIL_SHIP_DEEP_SCAN,
    ABIL_HUMAN_SPRINT,
    ABIL_ITEM_TRIFEX,
    ABIL_ITEM_GENETIC_SAMPLER,
    ABIL_ACTIVATE_SEQUENCER_TEST,
    ABIL_ALIEN_NEURAL_TAKEOVER,
    ABIL_SHIP_CHAINGUN,
    ABIL_ITEM_HELLFIRE_GRENADE,
    ABIL_ALIEN_FRENZY,
    ABIL_GENE_XENOPHOBIC,
    ABIL_GENE_XENOPHOBIC_PUNCH,
    ABIL_GENE_INSTANT_HEAL,
    ABIL_SYSTEM_REACTOR_DIAGNOSTICS,
    ABIL_SYSTEM_PURGE_VENTS,
    ABIL_ALIEN_MINION_EVOLVE,
    ABIL_SECURITY_TARGET_ALL,
    ABIL_ASKELLON_BROADSIDE_LEFT,
    ABIL_ASKELLON_BROADSIDE_RIGHT,
    ABIL_SYSTEM_REACTOR_DIVERT_WEAPONS,
    ABIL_SYSTEM_REACTOR_ROTATE_SHIELD_FREQUENCY,
    ABIL_DROP_MINERALS,
    ABIL_ACTIVATE_SCAN_CREW,
    ABIL_ACTIVATE_SCAN_ALIENS,
    ABIL_WEP_MINIGUN_FULLER_AUTO,
    ABIL_ITEM_ATTACH_METEOR_CANISTER,
    ABIL_EGG_HATCH_NEUTRAL,
    ABIL_ALIEN_CREATE_TUMOR,
    ABIL_CULTIST_CEREMONIAL_DAGGER,
    ABIL_CULTIST_GIFT_MADNESS,
    ABIL_ITEM_DRUG_COMEBACK,
    ABIL_ITEM_REMOTE_BOMB,
    ABIL_ALIEN_WEBSHOT,
    ABIL_ALIEN_BROODNEST,
    ABIL_ALIEN_WEBWALK,
    ABIL_ALIEN_EVOLVE_T2_SPIDER,
    ABIL_ALIEN_EVOLVE_T3_DEFILER,
    ABIL_CREWMEMBER_INFO,
} from "resources/ability-ids";
import { AT_ABILITY_DRAGONFIRE_BLAST, SNIPER_ABILITY_ID } from "app/weapons/weapon-constants";
import { DragonFireBlastAbility } from "./human/dragonfire-blast";
import { EmotionalDampenerAbility } from "./human/emotional-dampener";
import { PuritySealAbility } from "./human/inquis-purity-seal";
import { SmiteAbility } from "./human/inquis-smite";
import { NightVisionAbility } from "./human/night-vision";
import { RailRifleAbility } from "./human/rail-rifle";
import { ItemRepairAbility } from "./human/repair";
import { ShipBarrelRoll } from "./human/ship-barrel-roll";
import { ShipMacroLasAbility } from "./human/ship-macro-las";
import { ShipDeepScanAbility } from "./human/ship-scan";
import { SprintLeapAbility } from "./human/sprint-leap";
import { TrifexAbility } from "./human/trifex";
import { GeneticSamplerItemAbility } from "./items/genetic-sample";
import { GeneticSequenceAbility } from "./station/genetic-sequencer";
import { AcidPoolAbility } from "./alien/acid-pool";
import { AcidStigmataAbility } from "./alien/acid-stigmata";
import { BusterChargeAbility } from "./alien/buster-charge";
import { EvolveAbility } from "./alien/evolve";
import { LatchAbility } from "./alien/latch";
import { LeapAbility } from "./alien/leap";
import { ScreamAbility } from "./alien/scream";
import { SurvivalInstinctsAbility } from "./alien/survival-instincts";
import { TransformAbility } from "./alien/transform";
import { EmbraceCosmosAbility } from "./human/cosmos-embrace";
import { CryoGrenadeAbility } from "./human/cryo-grenade";
import { DiodeEjectAbility } from "./human/diode-ejector";
import { NeuralTakeoverAbility } from "./alien/neural-takeover";
import { ZERGLING_ALIEN_FORM, ROACH_ALIEN_FORM, DEFILER_ALIEN_FORM, SPIDER_ALIEN_FORM } from "resources/unit-ids";
import { ShipChaingunAbility } from "./human/ship-chaingun";
import { HellfireGrenadeAbility } from "./human/hellfire-grenade";
import { FrenzyAbility } from "./alien/frenzy";
import { XenophobicAbility } from "./human/xenophobic";
import { XenophobicPunchAbility } from "./human/xenophobic-punch";
import { InstantHealAbility } from "./human/instant-heal";
import { ReactorDiagnosticsAbility } from "./station/reactor-diagnostics";
import { VentPurgeAbility } from "./station/vent-purge";
import { MinionEvolveAbility } from "./alien/minions/minion-evolve";
import { StationSecurityTargetAbility } from "./station/security-targeting";
import { LaserBroadsideAbility } from "./station/laser-broadside";
import { DivertToWeaponsAbiility } from "./station/divert-weapons";
import { DropMineralsAbility } from "./items/drop-minerals";
import { StationSecurityScanForPlayer } from "./station/scan-for-player";
import { MinigunFullerAutoAbility } from "./human/minigun-fuller-auto";
import { MeteorCanisterAbility } from "./human/meteor-canister";
import { MinionEggHatchAbility } from "./alien/minions/minion-egg-hatch";
import { SpawnTumorAbility } from "./alien/minions/create-tumor";
import { CeremonialDaggerItemAbility } from "./items/ceremonial-dagger";
import { GiftOfMadnessAbility } from "./cult/gift-of-madness";
import { ComebackDrugAbility } from "./items/comeback-drug";
import { PlaceBombAbility } from "./items/place-bomb";
import { WebshotAbility } from "./alien/evo-infestation/webshot";
import { BroodNestAbility } from "./alien/evo-infestation/broodnest";
import { ConealingWebsAbility } from "./alien/evo-infestation/conealing-webs";
import { TestBehaviour } from "./behaviours/test-behaviour";
import { MessageAllPlayers } from "lib/utils";
import { Timers } from "app/timer-type";

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
        castAbilityTrigger.registerAnyUnitEvent(EVENT_PLAYER_UNIT_SPELL_CAST);
        castAbilityTrigger.addAction(() => {
            const u = Unit.fromHandle(GetTriggerUnit());

            // showOverheadText(u.x, u.y, 88, 171, 174, 255, `${GetAbilityName(GetSpellAbilityId())}`);
            this.unitCastsSpell(u.handle);
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
        this.sendBehaviourEvent(Unit.fromHandle(attackingUnit), ABILITY_HOOK.UnitAttacks);
    }
    private unitAttacked(attackedUnit: unit) {
        this.sendBehaviourEvent(Unit.fromHandle(attackedUnit), ABILITY_HOOK.UnitIsAttacked);
    }
    private unitPreDamaged(damagedUnit: unit) {
        this.sendBehaviourEvent(Unit.fromHandle(damagedUnit), ABILITY_HOOK.PreUnitTakesDamage);
    }
    private unitPreDamaging(damagingUnit: unit) {
        this.sendBehaviourEvent(Unit.fromHandle(damagingUnit), ABILITY_HOOK.PreUnitDealsDamage);
    }
    private unitPostDamaged(damagedUnit: unit) {
        this.sendBehaviourEvent(Unit.fromHandle(damagedUnit), ABILITY_HOOK.PostUnitTakesDamage);
    }
    private unitPostDamaging(damagingUnit: unit) {
        this.sendBehaviourEvent(Unit.fromHandle(damagingUnit), ABILITY_HOOK.PostUnitDealsDamage);
    }

    private checkBehaviourKeysFor(u: Unit) {
        this.behaviourKeys.forEach(abilId => {
            this.checkBehaviourKeysForAbility(u, abilId);
        });
    }

    private checkBehaviourKeysForAbility(u: Unit, abilId: number) {
        if (u.getAbilityLevel(abilId) > 0) {
            Log.Information(`Found behaviour for unit:  ${u.name}`)
            const behaviour = AbilityHooks.Behaviour(abilId);
            if (behaviour && behaviour.init(u)) {
                this.behaviours.push(behaviour);
                const behaviours = this.behavioursForUnit.get(u.id) || [];

                behaviours.push(behaviour);
                this.behavioursForUnit.set(u.id, behaviours);

            }
        }
    }

    private sendBehaviourEvent(u: Unit, ev: ABILITY_HOOK) {
        const behaviours = this.behavioursForUnit.get(u.id);
        if (behaviours && behaviours.length > 0) {
            for (let index = 0; index < behaviours.length; index++) {
                const b = behaviours[index];
                b.onEvent(ev);
                if (b.doDestroy()) {
                    b.destroy();
                    behaviours.splice(index--, 1);
                    if (behaviours.length === 0) {
                        this.behavioursForUnit.delete(u.id);
                    }
                }       
            }
        }
    }

    /**
     * Can create an "ability" instance
     * @param castingUnit 
     */
    private unitCastsSpell(castingUnit: unit) {
        const id = GetSpellAbilityId();
        const ability = AbilityHooks.Ability(id);
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
        MessageAllPlayers(`Adding behaviour to instance!`);
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


/**
 * Add hook
 */
AbilityHooks.AddAbility(ABIL_ALIEN_ACID_POOL, () => new AcidPoolAbility());
AbilityHooks.AddAbility(ABIL_ALIEN_ACID_HURL, () => new AcidStigmataAbility());
AbilityHooks.AddAbility(ABIL_ALIEN_CHARGE, () => new BusterChargeAbility());
AbilityHooks.AddAbility(ABIL_ALIEN_EVOLVE_T1, () => new EvolveAbility(ZERGLING_ALIEN_FORM));
AbilityHooks.AddAbility(ABIL_ALIEN_EVOLVE_T2, () => new EvolveAbility(ROACH_ALIEN_FORM));

AbilityHooks.AddAbility(ABIL_ALIEN_EVOLVE_T2_SPIDER, () => new EvolveAbility(SPIDER_ALIEN_FORM));
AbilityHooks.AddAbility(ABIL_ALIEN_EVOLVE_T3_DEFILER, () => new EvolveAbility(DEFILER_ALIEN_FORM));
AbilityHooks.AddAbility(ABIL_ALIEN_LATCH, () => new LatchAbility());
AbilityHooks.AddAbility(ABIL_ALIEN_LEAP, () => new LeapAbility());
AbilityHooks.AddAbility(ABIL_ALIEN_SCREAM, () => new ScreamAbility());
AbilityHooks.AddAbility(ABIL_ALIEN_SURVIVAL_INSTINCTS, () => new SurvivalInstinctsAbility());
AbilityHooks.AddAbility(ABIL_TRANSFORM_ALIEN_HUMAN, () => new TransformAbility(false));
AbilityHooks.AddAbility(ABIL_TRANSFORM_HUMAN_ALIEN, () => new TransformAbility(true));
AbilityHooks.AddAbility(ABIL_GENE_COSMIC, () => new EmbraceCosmosAbility());
AbilityHooks.AddAbility(ABIL_ITEM_CRYO_GRENADE, () => new CryoGrenadeAbility());
AbilityHooks.AddAbility(ABIL_ITEM_HELLFIRE_GRENADE, () => new HellfireGrenadeAbility());
AbilityHooks.AddAbility(ABIL_WEP_DIODE_EJ, () => new DiodeEjectAbility());
AbilityHooks.AddAbility(AT_ABILITY_DRAGONFIRE_BLAST, () => new DragonFireBlastAbility());
AbilityHooks.AddAbility(ABIL_ITEM_EMOTIONAL_DAMP, () => new EmotionalDampenerAbility());
AbilityHooks.AddAbility(ABIL_INQUIS_PURITY_SEAL, () => new PuritySealAbility());
AbilityHooks.AddAbility(ABIL_INQUIS_SMITE, () => new SmiteAbility(false));
AbilityHooks.AddAbility(ABIL_GENE_NIGHTEYE, () => new NightVisionAbility());
AbilityHooks.AddAbility(SNIPER_ABILITY_ID, () => new RailRifleAbility());
AbilityHooks.AddAbility(ABIL_ITEM_REPAIR, () => new ItemRepairAbility());
AbilityHooks.AddAbility(ABIL_SHIP_BARREL_ROLL_LEFT, () => new ShipBarrelRoll());
AbilityHooks.AddAbility(ABIL_SHIP_BARREL_ROLL_RIGHT, () => new ShipBarrelRoll());
AbilityHooks.AddAbility(ABIL_SHIP_LASER, () => new ShipMacroLasAbility());
AbilityHooks.AddAbility(ABIL_SHIP_DEEP_SCAN, () => new ShipDeepScanAbility());
AbilityHooks.AddAbility(ABIL_SHIP_CHAINGUN, () => new ShipChaingunAbility());
AbilityHooks.AddAbility(ABIL_HUMAN_SPRINT, () => new SprintLeapAbility());
AbilityHooks.AddAbility(ABIL_ITEM_TRIFEX, () => new TrifexAbility());
AbilityHooks.AddAbility(ABIL_ITEM_GENETIC_SAMPLER, () => new GeneticSamplerItemAbility());
AbilityHooks.AddAbility(ABIL_ACTIVATE_SEQUENCER_TEST, () => new GeneticSequenceAbility());
AbilityHooks.AddAbility(ABIL_ALIEN_NEURAL_TAKEOVER, () => new NeuralTakeoverAbility());
AbilityHooks.AddAbility(ABIL_ALIEN_FRENZY, () => new FrenzyAbility());
AbilityHooks.AddAbility(ABIL_GENE_XENOPHOBIC, () => new XenophobicAbility());
AbilityHooks.AddAbility(ABIL_GENE_XENOPHOBIC_PUNCH, () => new XenophobicPunchAbility());
AbilityHooks.AddAbility(ABIL_GENE_INSTANT_HEAL, () => new InstantHealAbility());
AbilityHooks.AddAbility(ABIL_SYSTEM_REACTOR_DIAGNOSTICS, () => new ReactorDiagnosticsAbility());
AbilityHooks.AddAbility(ABIL_SYSTEM_PURGE_VENTS, () => new VentPurgeAbility());
AbilityHooks.AddAbility(ABIL_WEP_MINIGUN_FULLER_AUTO, () => new MinigunFullerAutoAbility());

ABIL_SECURITY_TARGET_ALL.forEach(a => {
    AbilityHooks.AddAbility(a, () => new StationSecurityTargetAbility());
});

AbilityHooks.AddAbility(ABIL_ASKELLON_BROADSIDE_LEFT, () => new LaserBroadsideAbility());
AbilityHooks.AddAbility(ABIL_ASKELLON_BROADSIDE_RIGHT, () => new LaserBroadsideAbility());
AbilityHooks.AddAbility(ABIL_SYSTEM_REACTOR_DIVERT_WEAPONS, () => new DivertToWeaponsAbiility());
AbilityHooks.AddAbility(ABIL_DROP_MINERALS, () => new DropMineralsAbility());

AbilityHooks.AddAbility(ABIL_ACTIVATE_SCAN_CREW, () => new StationSecurityScanForPlayer(false));
AbilityHooks.AddAbility(ABIL_ACTIVATE_SCAN_ALIENS, () => new StationSecurityScanForPlayer(true));
// Alien Minion AI hooks
AbilityHooks.AddAbility(ABIL_ALIEN_MINION_EVOLVE, () => new MinionEvolveAbility());
// AbilityHooks.AddAbility(ABIL_ALIEN_MINION_PLACE_EGG, () => new MinionSpawnAbility());
AbilityHooks.AddAbility(ABIL_ITEM_ATTACH_METEOR_CANISTER, () => new MeteorCanisterAbility());
AbilityHooks.AddAbility(ABIL_EGG_HATCH_NEUTRAL, () => new MinionEggHatchAbility());

AbilityHooks.AddAbility(ABIL_ALIEN_CREATE_TUMOR, () => new SpawnTumorAbility());
AbilityHooks.AddAbility(ABIL_CULTIST_GIFT_MADNESS, () => new GiftOfMadnessAbility());
AbilityHooks.AddAbility(ABIL_CULTIST_CEREMONIAL_DAGGER, () => new CeremonialDaggerItemAbility());
AbilityHooks.AddAbility(ABIL_ITEM_DRUG_COMEBACK, () => new ComebackDrugAbility());
AbilityHooks.AddAbility(ABIL_ITEM_REMOTE_BOMB, () => new PlaceBombAbility());
AbilityHooks.AddAbility(ABIL_ALIEN_WEBSHOT, () => new WebshotAbility());
AbilityHooks.AddAbility(ABIL_ALIEN_BROODNEST, () => new BroodNestAbility());
AbilityHooks.AddAbility(ABIL_ALIEN_WEBWALK, () => new ConealingWebsAbility());

/**
 * TEST BEHAVIOUR
 */
AbilityHooks.AddBehaiour(ABIL_CREWMEMBER_INFO, () => new TestBehaviour());