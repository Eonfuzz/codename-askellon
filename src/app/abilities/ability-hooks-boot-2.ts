import { ABIL_ALIEN_BERSERK_HATCHERY, ABIL_ALIEN_DEFILER_INFESTATION, ABIL_ALIEN_SPAWN_HORDE, ABIL_ID_REACTOR_PLATING } from "resources/ability-ids";
import { AbilityHooks } from "./ability-hooks";
import { SpawnAlienHordeAbility } from "./alien/evo-infestation/alien-horde";
import { DefilerInfestationBehaviour } from "./behaviours/defiler-infestation";
import { HatcheryBehaviour } from "./behaviours/hatchery-beserk";
import { PowerCoreDamageBehaviour } from "./behaviours/power-core-damage-behaviour";


export const BootAbilityHooks2 = () => {
    AbilityHooks.AddAbility(ABIL_ALIEN_SPAWN_HORDE, () => new SpawnAlienHordeAbility());
    AbilityHooks.AddBehaiour(ABIL_ID_REACTOR_PLATING, () => new PowerCoreDamageBehaviour());
    AbilityHooks.AddBehaiour(ABIL_ALIEN_DEFILER_INFESTATION, () => new DefilerInfestationBehaviour());
    AbilityHooks.AddBehaiour(ABIL_ALIEN_BERSERK_HATCHERY, () => new HatcheryBehaviour());
}