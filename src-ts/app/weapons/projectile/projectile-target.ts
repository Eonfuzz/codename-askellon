import { Vector3 } from "../../types/vector3";
import { Log } from "../../../lib/serilog/serilog";
import { Vector2 } from "../../types/vector2";

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

export interface ProjectileMover {
    move(currentPostion: Vector3, goal: Vector3, velocity: number, delta: number): Vector3
}

export class ProjectileMoverLinear implements ProjectileMover {
    move(currentPostion: Vector3, goal: Vector3, velocity: number, delta: number): Vector3 {
        let velocityVector = goal.normalise().multiplyN(velocity * delta);
        return velocityVector;
    }
}

const GRAVITY = 800;

export class ProjectileMoverParabolic implements ProjectileMover {
    originalPos: Vector3;
    originalDelta: Vector3;
    distanceTravelled: number = 0;
    distanceTravelledVertically: number = 0;

    angle: number = 0;
    velocity: number = 0;
    timeElapsed: number = 0;

    /**
     * 
     * @param originalPosition 
     * @param goal 
     * @param angle radians
     */
    constructor(originalPosition: Vector3, goal: Vector3, angle: number) {
        this.originalPos = originalPosition;
        this.originalDelta = goal.subtract(originalPosition);
        const dLen = this.originalDelta.to2D().getLength();

        // Calculate velocity given goal and angle
        const velocity = SquareRoot(
            ((dLen*dLen)*GRAVITY) / (
                dLen*Sin(2*angle) - 2*this.originalDelta.z*(Cos(angle) * Cos(angle))
            )
        );

        this.angle = angle;
        this.velocity = velocity;
    }
    
    move(currentPostion: Vector3, goal: Vector3, velocity: number, deltaTime: number): Vector3 {
        const direction = this.originalDelta.normalise();

        const totalXY = this.velocity * this.timeElapsed * Cos(this.angle);
        const xyDelta = totalXY - this.distanceTravelled;
        
        const totalZ = (this.velocity * this.timeElapsed * Sin(this.angle)) - (GRAVITY * (this.timeElapsed * this.timeElapsed))/2;
        const zDelta = totalZ - this.distanceTravelledVertically;
        

        this.distanceTravelled += xyDelta;
        this.distanceTravelledVertically += zDelta;
        this.timeElapsed += deltaTime;

        return new Vector3(
            direction.x * xyDelta,
            direction.y * xyDelta,
            0 + zDelta
        );
    }
}