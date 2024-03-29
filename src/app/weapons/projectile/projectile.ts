import { ProjectileTarget, ProjectileMover, ProjectileMoverLinear } from "./projectile-target";
import { Vector3 } from "../../types/vector3";
import { ProjectileSFX } from "./projectile-sfx";
import { getZFromXY } from "lib/utils";
import { UNIT_IS_FLY } from "resources/ability-ids";

const DEFAULT_FILTER = (projectile: Projectile) => {
    return Filter(() => {
        let unit = GetFilterUnit(); 
        
        return GetWidgetLife(unit) > 0.405 && 
            !IsUnitAlly(unit, GetOwningPlayer(projectile.source)) &&
            IsUnitType(unit, UNIT_TYPE_MAGIC_IMMUNE) == false && 
            BlzIsUnitInvulnerable(unit) === false &&
            GetUnitAbilityLevel(unit, UNIT_IS_FLY) == 0;
    });
};

export class Projectile {
    private id = 0;
    private position: Vector3;

    private target: ProjectileTarget;
    private mover: ProjectileMover;
    
    public source: unit;

    private collisionRadius: number = 30;

    private sfx: Array<ProjectileSFX>;

    private doDestroy = false;
    public dead = false;

    public filter: filterfunc;


    private stopAtGroundCollision = true;
    private stopAtGoal = false;

    // Callbacks
    private onCollideCallback: ((projectile: Projectile, who: unit) => boolean | void) | undefined;
    private onDeathCallback: ((projectile: Projectile) => boolean | void) | undefined;

    constructor(source: unit, startPosition: Vector3, target: ProjectileTarget, projectileMover?: ProjectileMover) {
        this.position = startPosition;
        this.target = target;
        this.sfx = [];

        this.mover = projectileMover || new ProjectileMoverLinear(startPosition, target.getTargetVector());

        this.source = source;
        this.filter = DEFAULT_FILTER(this);
    }

    setId(to: number) {
        this.id = to;
    }

    getId() {
        return this.id;
    }

    /**
     * Adds an effect to the projectile
     * @param sfx 
     * @param offset 
     * @param facing 
     */
    addEffect(sfx: string, offset: Vector3, facing: Vector3, scale: number): effect {
        let _sfx = new ProjectileSFX(sfx, this.position, offset, facing);
        _sfx.setScale(scale);
        this.sfx.push(_sfx);
        return _sfx.getEffect();
    }

    public getSfx() {
        return this.sfx
    }

    /**
     * Does the projectile collide
     */
    doesCollide(): boolean {
        return true;
    }
    /**
     * Returns the projctile's current position
     */
    getPosition(): Vector3 {
        return this.position;
    }
    
    /**
     * Gets collision radius of the projectile
     */
    getCollisionRadius(): number {
        return this.collisionRadius;
    }

    setCollisionRadius(radius: number): Projectile {
        this.collisionRadius = radius;
        return this;
    }

    willDestroy(): boolean {
        return this.doDestroy;
    }

    setDestroy(val: boolean): Projectile {
        this.doDestroy = val;
        return this;
    }

    public overrideFilter(newFunc: (projectile: Projectile) => boolean): Projectile {
        this.filter = Filter(<any>newFunc);
        return this;
    }

    public onCollide(callback: (projectile: Projectile, who: unit) => boolean | void): Projectile {
        this.onCollideCallback = callback;
        return this;
    }

    public onDeath(callback: (projectile: Projectile) => boolean | void): Projectile {
        this.onDeathCallback = callback;
        return this;
    }

    public collide(withUnit: unit): void {
        if (this.onCollideCallback) {
            this.onCollideCallback(this, withUnit);
        }
    }
    
    public getTarget(): ProjectileTarget {
        return this.target;
    }
    /**
     * Updates the projectile's location and returns distance moved
     * @param deltaTime 
     */
    update(deltaTime: number): Vector3 {
        { // DO
            let velocityToApply = this.mover.move(this.getTarget().getTargetVector(), deltaTime);
            let newPosition = this.position.add(velocityToApply);
            this.position = newPosition;

            // Now update attached 
            this.sfx.forEach(sfx => sfx.updatePosition(this.position, velocityToApply));
            
            if (this.reachedEnd(velocityToApply)) this.doDestroy = true;
            // Return distance travelled
            return velocityToApply;
        } // END
    }

    public setVelocity(velocity: number): Projectile {
        this.mover.setVelocity(velocity);
        return this;
    }

    private reachedEnd(targetVector: Vector3): boolean {
        if (this.stopAtGoal) {
            return this.mover.reachedGoal();
        }
        if (this.stopAtGroundCollision) {
            let z = getZFromXY(this.position.x, this.position.y);
            // let location = GLOBAL_LOCATION
            return (this.position.z <= z);
        }
        return true;
    }

    public doStopAtGoal(state: boolean) {
        this.stopAtGoal = state;
        return this;
    }
    public doStopAtGroundCollision(state: boolean) {
        this.stopAtGroundCollision = state;
        return this;
    }

    public destroy(): boolean {
        if (this.onDeathCallback) {
            let result = this.onDeathCallback(this);
            if (result == false) {
                this.dead = result 
            }
            else {
                this.dead = true;
            }
        }
        else {
            this.dead = true;
        }
        
        if (this.dead) {
            this.sfx.forEach(sfx => sfx.destroy());
            this.sfx = [];
            if (this.filter) {
                DestroyFilter(this.filter);
            }
        }
        return this.dead;
    }

    public getDoodadChecker() {
        return this.mover.getDoodadChecker();
    }
}
