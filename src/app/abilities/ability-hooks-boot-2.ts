import { ABIL_ALIEN_BERSERK_HATCHERY, ABIL_ALIEN_DEFILER_INFESTATION, ABIL_ALIEN_SPAWN_HORDE, ABIL_CULTIST_T1_GLUTTONY, ABIL_CULTIST_T1_GRAVE_GIFT, ABIL_CULTIST_T1_PERNICIOUS_POWER, ABIL_CULTIST_T2_DELICIOUS_DECAY, ABIL_ID_REACTOR_PLATING } from "resources/ability-ids";
import { AbilityHooks } from "./ability-hooks";
import { SpawnAlienHordeAbility } from "./alien/evo-infestation/alien-horde";
import { DefilerInfestationBehaviour } from "./behaviours/defiler-infestation";
import { HatcheryBehaviour } from "./behaviours/hatchery-beserk";
import { PowerCoreDamageBehaviour } from "./behaviours/power-core-damage-behaviour";
import { CultistResearchAbility } from "./cult/cultist-research";


export const BootAbilityHooks2 = () => {
    AbilityHooks.AddAbility(ABIL_CULTIST_T1_GLUTTONY, () => new CultistResearchAbility(1));
    AbilityHooks.AddAbility(ABIL_CULTIST_T1_GRAVE_GIFT, () => new CultistResearchAbility(1));
    AbilityHooks.AddAbility(ABIL_CULTIST_T1_PERNICIOUS_POWER, () => new CultistResearchAbility(1));
    AbilityHooks.AddAbility(ABIL_CULTIST_T2_DELICIOUS_DECAY, () => new CultistResearchAbility(2));
    
    AbilityHooks.AddAbility(ABIL_ALIEN_SPAWN_HORDE, () => new SpawnAlienHordeAbility());
    AbilityHooks.AddBehaiour(ABIL_ID_REACTOR_PLATING, () => new PowerCoreDamageBehaviour());
    AbilityHooks.AddBehaiour(ABIL_ALIEN_DEFILER_INFESTATION, () => new DefilerInfestationBehaviour());
    AbilityHooks.AddBehaiour(ABIL_ALIEN_BERSERK_HATCHERY, () => new HatcheryBehaviour());
    
}