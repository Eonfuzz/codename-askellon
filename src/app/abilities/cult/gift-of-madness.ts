import { AbilityWithDone } from "../ability-type";
import { Effect, MapPlayer, Unit } from "w3ts/index";
import { Vector3 } from "app/types/vector3";
import { getZFromXY } from "lib/utils";
import { PlayNewSoundAt } from "lib/translators";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { ALIEN_FORCE_NAME, CULT_FORCE_NAME } from "app/force/forces/force-names";
import { SFX_DARK_HARVEST, SFX_DARK_RITUAL } from "resources/sfx-paths";
import { FilterIsAlive } from "resources/filters";
import { DynamicBuffEntity } from "app/buff/dynamic-buff-entity";
import { BUFF_ID } from "resources/buff-ids";
import { BuffInstanceDuration } from "app/buff/buff-instance-duration-type";
export class GiftOfMadnessAbility extends AbilityWithDone {

    private targetLoc: Vector3;
    private damageGroup: group = CreateGroup();

    private AOE = 150;

    

    public init() {
        super.init();
        
        this.targetLoc = new Vector3(GetSpellTargetX(), GetSpellTargetY(), getZFromXY(GetSpellTargetX(), GetSpellTargetY()));
        return true;
    };

    public step(delta: number) {

        let sfx = SFX_DARK_HARVEST;
        let volume = 50;

        GroupEnumUnitsInRange(
            this.damageGroup, 
            this.targetLoc.x, 
            this.targetLoc.y,
            this.AOE,
            FilterIsAlive(this.casterUnit.owner)
        );
        ForGroup(this.damageGroup, () => {
            const u = Unit.fromHandle(GetEnumUnit());
            if (!PlayerStateFactory.isValidPlayer(u.owner)) return;

            // if (owningForce && owningForce.getForce() && !owningForce.getForce().is(ALIEN_FORCE_NAME)) {
                if (u.owner.isLocal()) {
                    sfx = "";
                    volume = 0;
                }
                DynamicBuffEntity.add(
                    BUFF_ID.MADNESS, 
                    u,
                    new BuffInstanceDuration(this.casterUnit, 300)
                );
            // }
        });

        PlayNewSoundAt("Sounds\\HorrorRiser.mp3", this.targetLoc.x, this.targetLoc.y, volume);

        const effect = new Effect(sfx, this.targetLoc.x, this.targetLoc.y);
        effect.z = this.targetLoc.z + 10;
        effect.destroy();

        this.done = true;
        return false;
    };

    public destroy() {
        DestroyGroup(this.damageGroup);
        return true;
    };
}