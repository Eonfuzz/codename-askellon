import { PlayerStateFactory } from "app/force/player-state-entity";
import { AbilityWithDone } from "../ability-type";

export class GunAbility extends AbilityWithDone {
    
    public step(deltaTime: number): void {}
    public destroy(): void {}

    protected getDamageBonusMult(): number {
        if (this.casterUnit) {
            const crew = PlayerStateFactory.getCrewmember(this.casterUnit.owner);
            if (crew) return crew.getDamageBonusMult();
        }
        return 1;
    }
}
