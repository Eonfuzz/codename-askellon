import { Vector3 } from "../../types/vector3";
import { getZFromXY, getGroundBlockers, getAirBlockers } from "lib/utils";

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
    getTargetZ(): number { return getZFromXY(this.getTargetX(), this.getTargetY()); };
    getTargetVector(): Vector3 {
        return new Vector3(this.getTargetX(), this.getTargetY(), getZFromXY(this.getTargetX(), this.getTargetY()));
    }
}

export interface ProjectileMover {
    move(goal: Vector3, delta: number): Vector3
    getDoodadChecker(): (minX: number, minY: number, maxX: number, maxY: number) => destructable[];
    reachedGoal(): boolean;
    setVelocity(velocity: number);
}

export class ProjectileMoverLinear implements ProjectileMover {
    private timerToGoal: number;
    private velocity: number;

    private goal: Vector3;
    private startPos: Vector3;
    
    constructor(currentPosition: Vector3, goal: Vector3, velocity?: number) {
        this.velocity = velocity;
        this.startPos = currentPosition;
        this.goal = goal;

        if (this.velocity) {
            this.timerToGoal = goal.subtract(currentPosition).getLength() / this.velocity;
        }
    }
    move(goal: Vector3, delta: number): Vector3 {
        let velocityVector = goal.normalise().multiplyN(this.velocity * delta);
        return velocityVector;
    }
    getDoodadChecker() {
        return getGroundBlockers;
    }
    reachedGoal() {
        return this.timerToGoal <= 0;
    }
    setVelocity(velocity: number) {
        this.velocity = velocity;
        this.timerToGoal = this.goal.subtract(this.startPos).getLength() / this.velocity;
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

    timescale: number;

    /**
     * 
     * @param originalPosition 
     * @param goal 
     * @param angle radians
     */
    constructor(originalPosition: Vector3, goal: Vector3, radians: number, timescale: number = 1) {
        this.originalPos = originalPosition;
        this.originalDelta = goal.subtract(originalPosition);
        const dLen = this.originalDelta.to2D().getLength();
        this.timescale = timescale;

        // Calculate velocity given goal and angle
        const velocity = SquareRoot(
            ((dLen*dLen)*GRAVITY) / (
                dLen*Sin(2*radians) - 2*this.originalDelta.z*(Cos(radians) * Cos(radians))
            )
        );

        this.angle = radians;
        this.velocity = velocity;
    }
    
    move(goal: Vector3, deltaTime: number): Vector3 {
        const direction = this.originalDelta.normalise();

        const totalXY = this.velocity * this.timeElapsed * Cos(this.angle);
        const xyDelta = totalXY - this.distanceTravelled;
        
        const totalZ = (this.velocity * this.timeElapsed * Sin(this.angle)) - (GRAVITY * (this.timeElapsed * this.timeElapsed))/2;
        const zDelta = totalZ - this.distanceTravelledVertically;
        

        this.distanceTravelled += xyDelta;
        this.distanceTravelledVertically += zDelta;
        this.timeElapsed += deltaTime * this.timescale;

        return new Vector3(
            direction.x * xyDelta,
            direction.y * xyDelta,
            0 + zDelta
        );
    }

    getDoodadChecker() {
        return getAirBlockers;
    }

    setVelocity(velocity: number) {
        this.velocity = velocity;
    }

    reachedGoal() {
        return this.originalDelta.getLength() < this.distanceTravelled;
    }
}