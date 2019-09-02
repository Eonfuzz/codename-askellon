/** @noSelfInFile **/
import { ProjectileTarget } from "./projectile-target";
import { Vector3 } from "../../types/vector3";
import { ProjectileSFX } from "./projectile-sfx";
import { WeaponModule } from "../weapon-module";

const DEFAULT_FILTER = (projectile: Projectile) => {
    return Filter(() => {
        let unit = GetFilterUnit(); 
        
        return GetWidgetLife(unit) > 0.405 && 
            !IsUnitAlly(unit, GetOwningPlayer(projectile.source)) && 
            IsUnitType(unit, UNIT_TYPE_STRUCTURE) == false && 
            IsUnitType(unit, UNIT_TYPE_MAGIC_IMMUNE) == false && 
            IsUnitType(unit, UNIT_TYPE_MECHANICAL) == false;
    });
};

export class Projectile {
    private position: Vector3;

    private target: ProjectileTarget;
    public source: unit;

    private collisionRadius: number = 30;
    public velocity: number = 10;

    private sfx: Array<ProjectileSFX>;

    private doDestroy = false;

    public filter: filterfunc;

    // Callbacks
    private onCollideCallback: Function | undefined;
    private onDeathCallback: Function | undefined;

    constructor(source: unit, startPosition: Vector3, target: ProjectileTarget) {
        this.position = startPosition;
        this.target = target;
        this.sfx = [];

        this.source = source;
        this.filter = DEFAULT_FILTER(this);
    }

    /**
     * Adds an effect to the projectile
     * @param sfx 
     * @param offset 
     * @param facing 
     */
    addEffect(sfx: string, offset: Vector3, facing: Vector3, scale: number): Projectile {
        let _sfx = new ProjectileSFX(sfx, this.position, offset, facing);
        _sfx.setScale(scale);
        this.sfx.push(_sfx);
        return this;
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

    willDestroy(): boolean {
        return this.doDestroy;
    }

    setDestroy(val: boolean): Projectile {
        this.doDestroy = val;
        return this;
    }

    public overrideFilter(newFunc: Function): Projectile {
        this.filter = Filter(<any>newFunc);
        return this;
    }

    public onCollide(callback: Function): Projectile {
        this.onCollideCallback = callback;
        return this;
    }

    public onDeath(callback: Function): Projectile {
        this.onDeathCallback = callback;
        return this;
    }

    public collide(withUnit: unit): void {
        if (this.onCollideCallback) {
            this.onCollideCallback(this, withUnit);
        }
    }
    
    /**
     * Updates the projectile's location and returns distance moved
     * @param deltaTime 
     */
    update(weaponModule: WeaponModule, deltaTime: number): Vector3 {
        let targetVector = this.target.getTargetVector();
        let velocityVector = targetVector.normalise().multiplyN(this.velocity * deltaTime);
        let newPosition = this.position.add(velocityVector);
        this.position = newPosition;

        // Now update attached sfx
        this.sfx.forEach(sfx => sfx.updatePosition(this.position));

        if (this.reachedEnd(weaponModule, targetVector)) this.doDestroy = true;
        // Return distance travelled
        return velocityVector;
    }

    public setVelocity(velocity: number): Projectile {
        this.velocity = velocity;
        return this;
    }

    private reachedEnd(weaponModule: WeaponModule, targetVector: Vector3): boolean {
        MoveLocation(weaponModule.GLOBAL_LOCATION, this.position.x, this.position.y);
        let z = GetLocationZ(weaponModule.GLOBAL_LOCATION)
        // let location = GLOBAL_LOCATION
        return (this.position.z <= z);
    }

    public destroy(): boolean {
        this.sfx.forEach(sfx => sfx.destroy());
        this.sfx = [];
        return true;
    }
}
