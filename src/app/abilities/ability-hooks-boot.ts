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
    ABIL_CULTIST_DARK_THRALL,
    ABIL_CULTIST_CONVOKE_CARRION,
    ABIL_ALIEN_LEAP_MINION,
    ABIL_ALIEN_BERSERK_MINION,
    ABIL_ID_SECURITY_TARGETING,
    ABIL_SYSTEM_PURGE_VENTS_BRIDGE,
    ABIL_GO_BACK_TO_ADMIN_CONTROLS,
    ABIL_ID_LOCKDOWN,
    ABIL_SHIP_AFTERBURNER,
    ABIL_LEAVE_ASKELLON_CONTROLS,
    ABIL_ID_REACTOR_PLATING
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
import { CarrionReincarnationBehaviour} from "./behaviours/carrion-reincarnation"
import { ConvokeCarrionAbility} from "./cult/convoke-carrion"
import { AbilityHooks } from "./ability-hooks";
import { LeapBehaviour } from "./behaviours/minion-leap";
import { BerserkBehaviour } from "./behaviours/minion-berserk";
import { AdministrationBeginTargetingPlayersAbility } from "./station/begin-targeting";
import { LockdownAbility } from "./station/lockdown";
import { DisableAbilityInCombat } from "./behaviours/disable-ability-in-combat";
import { AskellonDamageBehaviour } from "./behaviours/askellon-damage-behaviour";


export const BootAbilityHooks = () => {
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
    AbilityHooks.AddAbility(ABIL_ALIEN_LEAP_MINION, () => new LeapAbility());
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
    AbilityHooks.AddAbility(ABIL_SYSTEM_PURGE_VENTS_BRIDGE, () => new VentPurgeAbility());

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
    AbilityHooks.AddAbility(ABIL_CULTIST_CONVOKE_CARRION, () => new ConvokeCarrionAbility());
    AbilityHooks.AddAbility(ABIL_CULTIST_CEREMONIAL_DAGGER, () => new CeremonialDaggerItemAbility());
    AbilityHooks.AddAbility(ABIL_ITEM_DRUG_COMEBACK, () => new ComebackDrugAbility());
    AbilityHooks.AddAbility(ABIL_ITEM_REMOTE_BOMB, () => new PlaceBombAbility());
    AbilityHooks.AddAbility(ABIL_ALIEN_WEBSHOT, () => new WebshotAbility());
    AbilityHooks.AddAbility(ABIL_ALIEN_BROODNEST, () => new BroodNestAbility());
    AbilityHooks.AddAbility(ABIL_ALIEN_WEBWALK, () => new ConealingWebsAbility());
    AbilityHooks.AddAbility(ABIL_ID_SECURITY_TARGETING, () => new AdministrationBeginTargetingPlayersAbility());
    AbilityHooks.AddAbility(ABIL_GO_BACK_TO_ADMIN_CONTROLS, () => new AdministrationBeginTargetingPlayersAbility());
    AbilityHooks.AddAbility(ABIL_ID_LOCKDOWN, () => new LockdownAbility());
    /**
     * TEST BEHAVIOUR
     */
    // AbilityHooks.AddBehaiour(ABIL_CREWMEMBER_INFO, () => new TestBehaviour());
    AbilityHooks.AddBehaiour(ABIL_CULTIST_DARK_THRALL, () => new CarrionReincarnationBehaviour());
    // AbilityHooks.AddBehaiour(ABIL_ALIEN_LEAP_MINION, () => new TestBehaviour());
    AbilityHooks.AddBehaiour(ABIL_ALIEN_LEAP_MINION, () => new LeapBehaviour());
    AbilityHooks.AddBehaiour(ABIL_ALIEN_BERSERK_MINION, () => new BerserkBehaviour());
    AbilityHooks.AddBehaiour(ABIL_SHIP_AFTERBURNER, () => new DisableAbilityInCombat(ABIL_SHIP_AFTERBURNER));
    AbilityHooks.AddBehaiour(ABIL_ASKELLON_BROADSIDE_LEFT, () => new AskellonDamageBehaviour());
}