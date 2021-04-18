import { ABIL_ID_REACTOR_PLATING } from "resources/ability-ids";
import { AbilityHooks } from "./ability-hooks";
import { PowerCoreDamageBehaviour } from "./behaviours/power-core-damage-behaviour";


export const BootAbilityHooks2 = () => {
    AbilityHooks.AddBehaiour(ABIL_ID_REACTOR_PLATING, () => new PowerCoreDamageBehaviour());
}