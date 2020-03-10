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
import { DiodeEjector } from "../attachment/diode-ejector";
import { TECH_WEP_DAMAGE } from "resources/ability-ids";

const INTENSITY_MAX = 4;

export const InitLaserRifle = (weaponModule: WeaponModule) => {
    weaponModule.weaponItemIds.push(LASER_ITEM_ID);
    weaponModule.weaponAbilityIds.push(LASER_ABILITY_ID);
}
export class LaserRifle extends Gun {

    // The intensity of the gun, each increment increases damage and sound
    private intensity = 0;
    private collideDict = new Map<number, boolean>();

    constructor(item: item, equippedTo: ArmableUnit) {
        super(item, equippedTo);
        // Define spread and bullet distance
        this.spreadAOE = 100;
        this.bulletDistance = 2100;
        this.attachment = new DiodeEjector(item);
    }
    
    public onShoot(weaponModule: WeaponModule, caster: Crewmember, targetLocation: Vector3): void {
        super.onShoot(weaponModule, caster, targetLocation);

        const unit = caster.unit;
        
        PlayNewSoundOnUnit(this.getSoundPath(), caster.unit, 127);
        let casterLoc = new Vector3(GetUnitX(unit), GetUnitY(unit), BlzGetUnitZ(unit)+50).projectTowards2D(GetUnitFacing(unit) * bj_DEGTORAD, 10);
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
            this.getModelPath(),
            new Vector3(0, 0, 0),
            deltaTarget.normalise(),
            1.6
        );
        projectile
            .setVelocity(3000)
            .onCollide((weaponModule: WeaponModule, projectile: Projectile, collidesWith: unit) => 
                this.onProjectileCollide(weaponModule, projectile, collidesWith)
            )
            .onDeath((self: any, weaponModule: WeaponModule, projectile: Projectile) => {
                const didCollide = this.collideDict.get(projectile.getId());
                if (!didCollide) {
                    if (this.intensity > 1) {
                        PlayNewSoundOnUnit("war3mapImported\\laserMiss.mp3", caster.unit, 30);
                    }
                    this.intensity = 0;
                }
                else {
                    this.collideDict.delete(projectile.getId());
                    PlayNewSoundOnUnit("Sounds\\LaserConfirmedHit.mp3", caster.unit, 80);
                }
                this.updateTooltip(weaponModule, caster);
            })

        weaponModule.addProjectile(projectile);
    }
    
    private onProjectileCollide(weaponModule: WeaponModule, projectile: Projectile, collidesWith: unit) {
        // Set true in the collide dict
        this.collideDict.set(projectile.getId(), true);
        // Destroy projectile
        projectile.setDestroy(true);

        // increase intensity
        this.intensity = Math.min(this.intensity + 1, INTENSITY_MAX);

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
            this.intensity,
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
        return MathRound( 25 * Pow(1.5, this.intensity) * caster.getDamageBonusMult());
    }

    public getIntensity() {
        return this.intensity;
    }

    public getAbilityId() { return LASER_ABILITY_ID; }
    public getItemId() { return LASER_ITEM_ID; }

    public getModelPath() {
           // Play sound based on intensity
           switch (this.intensity) {
            case 0: return "Weapons\\Laser1.mdx";
            case 1: return "Weapons\\Laser2.mdx";
            case 2: return "Weapons\\Laser3.mdx";
            case 3: return "Weapons\\Laser4.mdx";
            default: return "Weapons\\Laser5.mdx";
        }
    }

    public getSoundPath() {
        // Play sound based on intensity
        switch (this.intensity) {
         case 0: return "Sounds\\Laser1.mp3";
         case 1: return "Sounds\\Laser2.mp3";
         case 2: return "Sounds\\Laser3.mp3";
         case 3: return "Sounds\\Laser4.mp3";
         default: return "Sounds\\Laser5.mp3";
        }
    }

    public setIntensity(val: number) {
        this.intensity = val;
    }
}