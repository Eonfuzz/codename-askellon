/** @noSelfInFile **/
import { Vector3 } from "../../types/vector3";

export class ProjectileSFX {
    private offset: Vector3;
    private sfx: effect;

    private pitch: number;
    private roll: number;
    private yaw: number;

    constructor(sfx: string, startingLoc: Vector3, offset: Vector3, facing: Vector3) {
        this.offset = offset;

        this.yaw = Atan2(facing.y, facing.x);
        this.pitch = Asin(facing.z);
        this.roll = 0;

        this.sfx = AddSpecialEffect(sfx, startingLoc.x, startingLoc.y); 
        BlzSetSpecialEffectZ(this.sfx, startingLoc.z);
        BlzSetSpecialEffectRoll(this.sfx, this.pitch);
        BlzSetSpecialEffectYaw(this.sfx, this.yaw);
    }

    updatePosition(currentPosition: Vector3) {
        BlzSetSpecialEffectX(this.sfx, currentPosition.x + this.offset.x);
        BlzSetSpecialEffectY(this.sfx, currentPosition.y + this.offset.y);
        BlzSetSpecialEffectZ(this.sfx, currentPosition.z + this.offset.z);
    }

    setScale(scale: number) {
        BlzSetSpecialEffectScale(this.sfx, scale);
    }

    destroy() {
        DestroyEffect(this.sfx);
    }
}
