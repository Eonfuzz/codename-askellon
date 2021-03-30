import { ABIL_ALIEN_BERSERK_MINION } from "resources/ability-ids";
import { Behaviour } from "../behaviour";
import { ABILITY_HOOK } from "../hook-types";

export class BerserkBehaviour extends Behaviour {
    
    constructor() {
        super();
    }

    public onEvent(event: ABILITY_HOOK) {
        if (event === ABILITY_HOOK.PreUnitDealsDamage) {
            // Log.Information("Take damage?!");
            if (this.forUnit.getAbilityCooldownRemaining(ABIL_ALIEN_BERSERK_MINION) <= 0) {
                this.forUnit.issueImmediateOrder("berserk");
            }
        }
    }

    /**
     * Iterate upon this instance of the aiblity
     */
    public step(deltaTime: number) {}

    public destroy() {}
}