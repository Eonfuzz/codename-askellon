/** @noSelfInFile **/

import { Vector3 } from "../../types/vector3";
import { Gun } from "./gun";
import { Crewmember } from "../../crewmember/crewmember-type";
import { Projectile } from "../projectile/projectile";
import { ProjectileTargetStatic } from "../projectile/projectile-target";
import { Game } from "../../game";
import { WeaponModule } from "../weapon-module";
import { TimedEvent } from "../../types/timed-event";
import { Vector2, vectorFromUnit } from "../../types/vector2";
import { BURST_RIFLE_EXTENDED, BURST_RIFLE_ITEM, LASER_EXTENDED, LASER_ITEM } from "../../../resources/weapon-tooltips";
import { PlayNewSoundOnUnit, staticDecorator } from "../../../lib/translators";
import { Attachment } from "../attachment/attachment";
import { ArmableUnit } from "./unit-has-weapon";
import { Log } from "../../../lib/serilog/serilog";
import { LASER_ITEM_ID, LASER_ABILITY_ID } from "../weapon-constants";

const INTENSITY_MAX = 4;

export const InitLaserRifle = (weaponModule: WeaponModule) => {
    weaponModule.weaponItemIds.push(LASER_ITEM_ID);
    weaponModule.weaponAbilityIds.push(LASER_ABILITY_ID);
}
export class LaserRifle extends Gun {

    // The intensity of the gun, each increment increases damage and sound
    private insensity = 0;
    private collideDict = new Map<number, boolean>();

    constructor(item: item, equippedTo: ArmableUnit) {
        super(item, equippedTo);
        // Define spread and bullet distance
        this.spreadAOE = 100;
        this.bulletDistance = 2000;
    }
    
    public onShoot(weaponModule: WeaponModule, caster: Crewmember, targetLocation: Vector3): void {
        super.onShoot(weaponModule, caster, targetLocation);

        const unit = caster.unit;
        
        // Play sound based on intensity
        switch (this.insensity) {
            case 0: 
                PlayNewSoundOnUnit("Sounds\\LaserShoot0.mp3", caster.unit, 50);
                break;
            case 1:
                PlayNewSoundOnUnit("Sounds\\LaserShoot1.mp3", caster.unit, 50);
                break;
            case 2:
                PlayNewSoundOnUnit("Sounds\\LaserShoot2.mp3", caster.unit, 50);
                break;
            case 3:
                PlayNewSoundOnUnit("Sounds\\LaserShoot3.mp3", caster.unit, 50);
                break;
            default:
                PlayNewSoundOnUnit("Sounds\\LaserShoot4.mp3", caster.unit, 50);
        }
        let casterLoc = new Vector3(GetUnitX(unit), GetUnitY(unit), BlzGetUnitZ(unit)+50).projectTowards2D(GetUnitFacing(unit) * bj_DEGTORAD, 30);
        let targetDistance = new Vector2(targetLocation.x - casterLoc.x, targetLocation.y - casterLoc.y).normalise().multiplyN(this.bulletDistance);
        let newTargetLocation = new Vector3(targetDistance.x + casterLoc.x, targetDistance.y + casterLoc.y, targetLocation.z);

        this.fireProjectile(weaponModule, caster, newTargetLocation);
    };

    private fireProjectile(weaponModule: WeaponModule, caster: Crewmember, targetLocation: Vector3) {
        const unit = caster.unit;
        // print("Target "+targetLocation.toString())
        let casterLoc = new Vector3(GetUnitX(unit), GetUnitY(unit), BlzGetUnitZ(unit)+50).projectTowards2D(GetUnitFacing(unit) * bj_DEGTORAD, 30);
        let strayTarget = this.getStrayLocation(targetLocation, caster)
        let deltaTarget = strayTarget.subtract(casterLoc);

        let projectile = new Projectile(
            unit,
            casterLoc, 
            new ProjectileTargetStatic(deltaTarget)
        );
        projectile.addEffect(
            "war3mapImported\\Bullet.mdx",
            new Vector3(0, 0, 0),
            deltaTarget.normalise(),
            1.6
        );
        projectile
            .setVelocity(2400)
            .onCollide((self: any, weaponModule: WeaponModule, projectile: Projectile, collidesWith: unit) => 
                this.onProjectileCollide(weaponModule, projectile, collidesWith)
            )
            .onDeath((self: any, weaponModule: WeaponModule, projectile: Projectile) => {
                const didCollide = this.collideDict.get(projectile.getId());
                if (!didCollide) this.insensity = 0;
                else this.collideDict.delete(projectile.getId());
            })

        weaponModule.addProjectile(projectile);
    }
    
    private onProjectileCollide(weaponModule: WeaponModule, projectile: Projectile, collidesWith: unit) {
        // Set true in the collide dict
        this.collideDict.set(projectile.getId(), true);
        // Destroy projectile
        projectile.setDestroy(true);

        // increase intensity
        this.insensity = Min(this.insensity + 1, INTENSITY_MAX);

        // Case equipped unit to damage the target
        if (this.equippedTo) {
            const crewmember = weaponModule.game.crewModule.getCrewmemberForUnit(this.equippedTo.unit);
            if (crewmember) {
                UnitDamageTarget(
                    projectile.source, 
                    collidesWith, 
                    this.getDamage(weaponModule, crewmember), 
                    false, 
                    true, 
                    ATTACK_TYPE_PIERCE, 
                    DAMAGE_TYPE_NORMAL, 
                    WEAPON_TYPE_WOOD_MEDIUM_STAB
                );
            }
        }
    }

    protected getTooltip(weaponModule: WeaponModule, crewmember: Crewmember) {
        const minDistance = this.spreadAOE-this.getStrayValue(crewmember) / 2;
        const newTooltip = LASER_EXTENDED(
            this.getDamage(weaponModule, crewmember), 
            this.insensity,
            minDistance, 
            this.spreadAOE
        );
        return newTooltip;
    }

    protected getItemTooltip(weaponModule: WeaponModule, crewmember: Crewmember): string {
        const damage = this.getDamage(weaponModule, crewmember);
        return LASER_ITEM(this, damage);
    }


    public getDamage(weaponModule: WeaponModule, caster: Crewmember): number {
        return 25 * Pow(1.5, this.insensity);
    }

    public getAbilityId() { return LASER_ABILITY_ID; }
    public getItemId() { return LASER_ITEM_ID; }
}