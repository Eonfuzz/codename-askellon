import { Vector3 } from "../../types/vector3";

/** @noSelfInFile **/

export interface ProjectileTarget {
    getTargetVector(): Vector3;
    getTargetX() : number;
    getTargetY() : number;
    getTargetZ() : number;
}

export class ProjectileTargetStatic implements ProjectileTarget {
    private loc: Vector3;

    constructor (loc: Vector3) {
        this.loc = loc;
    }

    getTargetX(): number { return this.loc.x; };
    getTargetY(): number { return this.loc.y; };
    getTargetZ(): number { return this.loc.z; };
    getTargetVector(): Vector3 {
        return new Vector3(this.getTargetX(), this.getTargetY(), this.getTargetZ());
    }
}

export class ProjectileTargetUnit implements ProjectileTarget {
    private target: unit;

    constructor (target: unit) {
        this.target = target;
    }

    getTargetX(): number { return GetUnitX(this.target); };
    getTargetY(): number { return GetUnitY(this.target); };
    getTargetZ(): number { return BlzGetUnitZ(this.target); };
    getTargetVector(): Vector3 {
        return new Vector3(this.getTargetX(), this.getTargetY(), this.getTargetZ());
    }
}