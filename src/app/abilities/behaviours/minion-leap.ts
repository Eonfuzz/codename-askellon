import { Vector2 } from "app/types/vector2";
import { Log } from "lib/serilog/serilog";
import { ABIL_ALIEN_LEAP_MINION } from "resources/ability-ids";
import { Behaviour } from "../behaviour";
import { ABILITY_HOOK } from "../hook-types";

export class LeapBehaviour extends Behaviour {
    
    constructor() {
        super();
    }

    public onEvent(event: ABILITY_HOOK) {
        if (event === ABILITY_HOOK.PreUnitTakesDamage) {
            // Log.Information("Take damage?!");
            if (this.forUnit.getAbilityCooldownRemaining(ABIL_ALIEN_LEAP_MINION) <= 0) {
                const dLoc = Vector2.fromWidget(GetEventDamageSource());
                const sLoc = Vector2.fromWidget(this.forUnit.handle);
                const d = sLoc.distanceTo(dLoc);

                if (d >= 250 && d <= 1000) {
                    // Log.Information("Leap Cast!");
                    this.forUnit.issueOrderAt("clusterrockets", dLoc.x, dLoc.y);
                }
            }
        }
    }

    /**
     * Iterate upon this instance of the aiblity
     */
    public step(deltaTime: number) {}

    public destroy() {}
}