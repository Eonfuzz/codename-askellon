/** @noSelfInFile **/

import { Vector3 } from "../../types/vector3";
import { Gun } from "./gun";
import { Crewmember } from "../../crewmember/crewmember-type";
import { Projectile } from "../projectile/projectile";
import { ProjectileTargetStatic } from "../projectile/projectile-target";
import { WeaponModule } from "../weapon-module";
import { TimedEvent } from "../../types/timed-event";
import { Vector2 } from "../../types/vector2";
import { BURST_RIFLE_EXTENDED } from "../../../resources/weapon-tooltips";
import { PlayNewSoundOnUnit, staticDecorator, getYawPitchRollFromVector } from "../../../lib/translators";
import { Log } from "../../../lib/serilog/serilog";
import { ArmableUnit } from "./unit-has-weapon";

export const SNIPER_ABILITY_ID = FourCC('A005');
export const SNIPER_ITEM_ID = FourCC('I001');

export const InitSniperRifle = (weaponModule: WeaponModule) => {
    weaponModule.weaponItemIds.push(SNIPER_ITEM_ID);
    weaponModule.weaponAbilityIds.push(SNIPER_ABILITY_ID);
}
@staticDecorator()
export class SniperRifle extends Gun {    
    private DEFAULT_STRAY = 30;
    private SHOT_DISTANCE = 1600;

    constructor(item: item, equippedTo: ArmableUnit) {
        super(item, equippedTo);
    }
    
    protected getTooltip(weaponModule: WeaponModule, crewmember: Crewmember) {
        const accuracyModifier = (this.DEFAULT_STRAY*(100/crewmember.accuracy))/2
        const newTooltip = BURST_RIFLE_EXTENDED(
            this.getDamage(weaponModule, crewmember), 
            this.SHOT_DISTANCE-accuracyModifier, 
            this.SHOT_DISTANCE+accuracyModifier
        );
        return "";
    };

    public onShoot(weaponModule: WeaponModule, caster: Crewmember, targetLocation: Vector3): void {
        Log.Information("Shooting sniper!");
        super.onShoot(weaponModule, caster, targetLocation);

        const unit = caster.unit;
        let casterLoc = new Vector3(GetUnitX(unit), GetUnitY(unit), BlzGetUnitZ(unit)+50).projectTowards2D(GetUnitFacing(unit) * bj_DEGTORAD, 30);
        let targetDistance = new Vector2(targetLocation.x - casterLoc.x, targetLocation.y - casterLoc.y).normalise().multiplyN(this.SHOT_DISTANCE);

        let newTargetLocation = new Vector3(targetDistance.x + casterLoc.x, targetDistance.y + casterLoc.y, targetLocation.z);

        this.fireProjectile(weaponModule, caster, newTargetLocation);
    };

    private fireProjectile(weaponModule: WeaponModule, caster: Crewmember, targetLocation: Vector3) {
        const unit = caster.unit;
        const sound = PlayNewSoundOnUnit("Sounds\\SniperRifleShoot.mp3", caster.unit, 50);
        let casterLoc = new Vector3(GetUnitX(unit), GetUnitY(unit), BlzGetUnitZ(unit)+50).projectTowards2D(GetUnitFacing(unit) * bj_DEGTORAD, 30);
        let strayTarget = this.getStrayLocation(targetLocation, caster)
        let deltaTarget = strayTarget.subtract(casterLoc);

        let projectile = new Projectile(
            unit,
            casterLoc, 
            new ProjectileTargetStatic(deltaTarget)
        );
        const effect =  projectile.addEffect(
            "war3mapImported\\Bullet.mdx",
            new Vector3(0, 0, 0),
            deltaTarget.normalise(),
            2.5
        );
        BlzSetSpecialEffectColor(effect, 130, 160, 255);

        projectile
            .setCollisionRadius(40)
            .setVelocity(2400)
            .onCollide((self: any, weaponModule: WeaponModule, projectile: Projectile, collidesWith: unit) => 
                this.onProjectileCollide(weaponModule, projectile, collidesWith)
            );

        weaponModule.addProjectile(projectile);

        // Create smoke rings every tick
        let delay = 0;
        while (delay < 1000) {
            weaponModule.game.timedEventQueue.AddEvent(new TimedEvent(() => {
                if (!projectile || projectile.willDestroy()) return true;
                const position = projectile.getPosition().add(deltaTarget.normalise());
                const sfxOrientation = getYawPitchRollFromVector(deltaTarget.normalise());

                const sfx = AddSpecialEffect("war3mapImported\\DustWave.mdx", position.x, position.y);
                BlzSetSpecialEffectHeight(sfx, position.z);
                BlzSetSpecialEffectYaw(sfx, sfxOrientation.yaw + 90 * bj_DEGTORAD);
                BlzSetSpecialEffectRoll(sfx, sfxOrientation.pitch + 90 * bj_DEGTORAD);
                BlzSetSpecialEffectAlpha(sfx, 40);
                BlzSetSpecialEffectScale(sfx, 0.7);
                BlzSetSpecialEffectTimeScale(sfx, 1);
                BlzSetSpecialEffectTime(sfx, 0.5);

                DestroyEffect(sfx);
                return true;
            }, delay, false));
            delay += 100;
        }
    }
    
    private onProjectileCollide(weaponModule: WeaponModule, projectile: Projectile, collidesWith: unit) {
        projectile.setDestroy(true);
        if (this.equippedTo) {
            const crewmember = weaponModule.game.crewModule.getCrewmemberForUnit(this.equippedTo.unit);
            if (crewmember) {
                const damage = this.getDamage(weaponModule, crewmember);
                UnitDamageTarget(
                    projectile.source, 
                    collidesWith, 
                    damage, 
                    false, 
                    true, 
                    ATTACK_TYPE_PIERCE, 
                    DAMAGE_TYPE_NORMAL, 
                    WEAPON_TYPE_WOOD_MEDIUM_STAB
                );
            }
        }
    }

    private getStrayLocation(originalLocation: Vector3, caster: Crewmember): Vector3 {
        let accuracy = caster.accuracy;

        let newLocation = new Vector3(
            originalLocation.x + ((Math.random()-0.5)*this.DEFAULT_STRAY*(100/accuracy)),
            originalLocation.y + ((Math.random()-0.5)*this.DEFAULT_STRAY*(100/accuracy)),
            originalLocation.z,
        );

        return newLocation;
    }

    public getDamage(weaponModule: WeaponModule, caster: Crewmember): number {
        return 120;
    }

    public getAbilityId() { return SNIPER_ABILITY_ID; }
    public getItemId() { return SNIPER_ITEM_ID; }
}