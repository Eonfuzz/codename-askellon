import { Ability } from "./ability-type";
import { Hooks } from "lib/Hooks";
import { Log } from "lib/serilog/serilog";
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
    ABIL_ALIEN_EVOLVE_T3,
    ABIL_ALIEN_NEURAL_TAKEOVER
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



/**
 * Interface to support adding / removal of ability hooks from ability funcs
 * Used in ./ability-entity.ts to lookup and create the correct abilities
 */
export class AbilityHooks {
    private abilityHooks = new Map<number, () => Ability>();
    private static instance: AbilityHooks;

    public static getInstance() {
        if (this.instance == null) {
            this.instance = new AbilityHooks();
            Hooks.set(this.name, this.instance);
        }
        return this.instance;
    }

    public static Add(abilId: number, instanceFunc: () => Ability) {
        this.getInstance().abilityHooks.set(abilId, instanceFunc)
    }
    public static Get(abilId: number) {
        const i = this.getInstance();
        if (i.abilityHooks.has(abilId)) {
            return i.abilityHooks.get(abilId)();//.initialise();
        }
    }
}

/**
 * Add hook
 */
AbilityHooks.Add(ABIL_ALIEN_ACID_POOL, () => new AcidPoolAbility());
AbilityHooks.Add(ABIL_ALIEN_ACID_HURL, () => new AcidStigmataAbility());
AbilityHooks.Add(ABIL_ALIEN_CHARGE, () => new BusterChargeAbility());
AbilityHooks.Add(ABIL_ALIEN_EVOLVE_T1, () => new EvolveAbility(ABIL_ALIEN_EVOLVE_T2));
AbilityHooks.Add(ABIL_ALIEN_EVOLVE_T2, () => new EvolveAbility(ABIL_ALIEN_EVOLVE_T3));
AbilityHooks.Add(ABIL_ALIEN_LATCH, () => new LatchAbility());
AbilityHooks.Add(ABIL_ALIEN_LEAP, () => new LeapAbility());
AbilityHooks.Add(ABIL_ALIEN_SCREAM, () => new ScreamAbility());
AbilityHooks.Add(ABIL_ALIEN_SURVIVAL_INSTINCTS, () => new SurvivalInstinctsAbility());
AbilityHooks.Add(ABIL_TRANSFORM_ALIEN_HUMAN, () => new TransformAbility(false));
AbilityHooks.Add(ABIL_TRANSFORM_HUMAN_ALIEN, () => new TransformAbility(true));
AbilityHooks.Add(ABIL_GENE_COSMIC, () => new EmbraceCosmosAbility());
AbilityHooks.Add(ABIL_ITEM_CRYO_GRENADE, () => new CryoGrenadeAbility());
AbilityHooks.Add(ABIL_WEP_DIODE_EJ, () => new DiodeEjectAbility());
AbilityHooks.Add(AT_ABILITY_DRAGONFIRE_BLAST, () => new DragonFireBlastAbility());
AbilityHooks.Add(ABIL_ITEM_EMOTIONAL_DAMP, () => new EmotionalDampenerAbility());
AbilityHooks.Add(ABIL_INQUIS_PURITY_SEAL, () => new PuritySealAbility());
AbilityHooks.Add(ABIL_INQUIS_SMITE, () => new SmiteAbility(false));
AbilityHooks.Add(ABIL_GENE_NIGHTEYE, () => new NightVisionAbility());
AbilityHooks.Add(SNIPER_ABILITY_ID, () => new RailRifleAbility());
AbilityHooks.Add(ABIL_ITEM_REPAIR, () => new ItemRepairAbility());
AbilityHooks.Add(ABIL_SHIP_BARREL_ROLL_LEFT, () => new ShipBarrelRoll());
AbilityHooks.Add(ABIL_SHIP_BARREL_ROLL_RIGHT, () => new ShipBarrelRoll());
AbilityHooks.Add(ABIL_SHIP_LASER, () => new ShipMacroLasAbility());
AbilityHooks.Add(ABIL_SHIP_DEEP_SCAN, () => new ShipDeepScanAbility());
AbilityHooks.Add(ABIL_HUMAN_SPRINT, () => new SprintLeapAbility());
AbilityHooks.Add(ABIL_ITEM_TRIFEX, () => new TrifexAbility());
AbilityHooks.Add(ABIL_ITEM_GENETIC_SAMPLER, () => new GeneticSamplerItemAbility());
AbilityHooks.Add(ABIL_ACTIVATE_SEQUENCER_TEST, () => new GeneticSequenceAbility());
AbilityHooks.Add(ABIL_ALIEN_NEURAL_TAKEOVER, () => new NeuralTakeoverAbility());