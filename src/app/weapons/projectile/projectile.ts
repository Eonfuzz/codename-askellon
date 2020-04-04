/** @noSelfInFile **/
import { ProjectileTarget, ProjectileMover, ProjectileMoverLinear } from "./projectile-target";
import { Vector3 } from "../../types/vector3";
import { ProjectileSFX } from "./projectile-sfx";
import { WeaponModule } from "../weapon-module";

const AIRBORN_ABILITY_DUMMY = FourCC('A00C');
const DEFAULT_FILTER = (projectile: Projectile) => {
    return Filter(() => {
        let unit = GetFilterUnit(); 
        
        return GetWidgetLife(unit) > 0.405 && 
            !IsUnitAlly(unit, GetOwningPlayer(projectile.source)) &&
            IsUnitType(unit, UNIT_TYPE_MAGIC_IMMUNE) == false && 
            GetUnitAbilityLevel(unit, AIRBORN_ABILITY_DUMMY) == 0;
    });
};

export class Projectile {
    private id = 0;
    private position: Vector3;

    private target: ProjectileTarget;
    private mover: ProjectileMover;
    
    public source: unit;

    private collisionRadius: number = 30;
    public velocity: number = 10;

    private sfx: Array<ProjectileSFX>;

    private doDestroy = false;

    public filter: filterfunc;

    // Callbacks
    private onCollideCallback: ((module: WeaponModule, projectile: Projectile, who: unit) => void) | undefined;
    private onDeathCallback: Function | undefined;

    constructor(source: unit, startPosition: Vector3, target: ProjectileTarget, projectileMover?: ProjectileMover) {
        this.position = startPosition;
        this.target = target;
        this.sfx = [];

        this.mover = projectileMover || new ProjectileMoverLinear();

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

    public overrideFilter(newFunc: Function): Projectile {
        this.filter = Filter(<any>newFunc);
        return this;
    }

    public onCollide(callback: (module: WeaponModule, projectile: Projectile, who: unit) => void): Projectile {
        this.onCollideCallback = callback;
        return this;
    }

    public onDeath(callback: Function): Projectile {
        this.onDeathCallback = callback;
        return this;
    }

    public collide(weaponModule: WeaponModule, withUnit: unit): void {
        if (this.onCollideCallback) {
            this.onCollideCallback(weaponModule, this, withUnit);
        }
    }
    
    public getTarget(): ProjectileTarget {
        return this.target;
    }
    /**
     * Updates the projectile's location and returns distance moved
     * @param deltaTime 
     */
    update(weaponModule: WeaponModule, deltaTime: number): Vector3 {

        let velocityToApply = this.mover.move(this.position, this.getTarget().getTargetVector(), this.velocity, deltaTime);
        let newPosition = this.position.add(velocityToApply);
        this.position = newPosition;

        // Now update attached sfx
        this.sfx.forEach(sfx => sfx.updatePosition(this.position));

        if (this.reachedEnd(weaponModule, velocityToApply)) this.doDestroy = true;
        // Return distance travelled
        return velocityToApply;
    }

    public setVelocity(velocity: number): Projectile {
        this.velocity = velocity;
        return this;
    }

    private reachedEnd(weaponModule: WeaponModule, targetVector: Vector3): boolean {
        MoveLocation(weaponModule.game.TEMP_LOCATION, this.position.x, this.position.y);
        let z = GetLocationZ(weaponModule.game.TEMP_LOCATION)
        // let location = GLOBAL_LOCATION
        return (this.position.z <= z);
    }

    public destroy(weaponModule: WeaponModule): boolean {
        this.onDeathCallback && this.onDeathCallback(weaponModule, this);
        this.sfx.forEach(sfx => sfx.destroy());
        this.sfx = [];
        return true;
    }
}
