/** @noSelfInFile **/
import { Vector3 } from "../../types/vector3";
import { getYawPitchRollFromVector } from "../../../lib/translators";

export class ProjectileSFX {
    private offset: Vector3;
    private sfx: effect;

    private pitch: number;
    private roll: number;
    private yaw: number;

    constructor(sfx: string, startingLoc: Vector3, offset: Vector3, facing: Vector3) {
        this.offset = offset;

        const facingData = getYawPitchRollFromVector(facing);
        this.yaw = facingData.yaw;
        this.pitch = facingData.pitch;
        this.roll = facingData.roll;

        this.sfx = AddSpecialEffect(sfx, startingLoc.x, startingLoc.y); 
        BlzSetSpecialEffectZ(this.sfx, startingLoc.z);
        BlzSetSpecialEffectRoll(this.sfx, this.pitch);
        BlzSetSpecialEffectYaw(this.sfx, this.yaw);
    }

    updatePosition(currentPosition: Vector3) {
        BlzSetSpecialEffectPosition(this.sfx,
            currentPosition.x + this.offset.x,
            currentPosition.y + this.offset.y,
            currentPosition.z + this.offset.z
        );
    }

    setScale(scale: number) {
        BlzSetSpecialEffectScale(this.sfx, scale);
    }

    destroy() {
        DestroyEffect(this.sfx);
    }

    getEffect() {
        return this.sfx;
    }
}
