
import { MapPlayer, Force, Effect, Unit } from "w3ts/index";
import { CrewFactory } from "app/crewmember/crewmember-factory";
import { ForceEntity } from "app/force/force-entity";
import { Timers } from "app/timer-type";
import { EventEntity } from "app/events/event-entity";
import { EVENT_TYPE } from "app/events/event-enum";
import { Log } from "lib/serilog/serilog";
import { Gun } from "../gun";
import { ArmableUnit } from "../unit-has-weapon";
import { Crewmember } from "app/crewmember/crewmember-type";
import { Vector3 } from "app/types/vector3";
import { getZFromXY } from "lib/utils";
import { Vector2 } from "app/types/vector2";
import { Projectile } from "app/weapons/projectile/projectile";
import { PlayNewSound, PlayNewSoundOnUnit, getYawPitchRollFromVector } from "lib/translators";
import { ProjectileTargetStatic } from "app/weapons/projectile/projectile-target";
import { SoundRef } from "app/types/sound-ref";

export class DefaultSecurityGun extends Gun {
    shootRef = new SoundRef("Sounds\\Station\\TurretShoot.ogg", false, true);
    constructor(equippedTo: ArmableUnit) {
        super(equippedTo);
        // Define spread and bullet distance
        this.spreadAOE = 100;
        this.bulletDistance = 1400;
    }

    public applyWeaponAttackValues(unit: Unit) {
        unit.setAttackCooldown(1, 1);
        this.equippedTo.unit.setBaseDamage(this.getDamage(unit) - 1, 0);
        unit.acquireRange = this.bulletDistance * 0.8;
        BlzSetUnitWeaponRealField(this.equippedTo.unit.handle, UNIT_WEAPON_RF_ATTACK_RANGE, 1, this.bulletDistance * 0.7);
        BlzSetUnitWeaponIntegerField(this.equippedTo.unit.handle, UNIT_WEAPON_IF_ATTACK_ATTACK_TYPE, 0, 2);
    }
    
    public onShoot(unit: Unit, targetLocation: Vector3): void {
        super.onShoot(unit, targetLocation);

        try {
            const sound = PlayNewSoundOnUnit("Sounds\\turretShoot.wav", unit, 20);
            let casterLoc = new Vector3(unit.x, unit.y, getZFromXY(unit.x, unit.y) + 30).projectTowards2D(unit.facing, 20);
            let targetDistance = new Vector2(targetLocation.x - casterLoc.x, targetLocation.y - casterLoc.y).normalise().multiplyN(this.bulletDistance);

            let newTargetLocation = new Vector3(targetDistance.x + casterLoc.x, targetDistance.y + casterLoc.y, targetLocation.z);

            let delay = 0;
            for (let i = 0; i < 4; i++) {
                Timers.addTimedAction(delay, () => {
                    if (this.equippedTo && this.equippedTo.unit && this.equippedTo.unit.isAlive()) {
                        this.fireProjectile(unit, newTargetLocation);
                    }
                });
                delay = delay + 0.15;
            }   
        }
        catch(e) {
            Log.Error(e);
        }
    };

    private fireProjectile(unit: Unit, targetLocation: Vector3) {
        let casterLoc = new Vector3(unit.x, unit.y, getZFromXY(unit.x, unit.y) + 30);
        casterLoc = casterLoc.projectTowards2D(casterLoc.angle2Dto(targetLocation)+GetRandomReal(-10,10), 40);
        let strayTarget = this.getStrayLocation(targetLocation, unit)
        let deltaTarget = strayTarget.subtract(casterLoc);

        new Effect("war3mapImported\\MuzzleFlash.mdx", unit, "hand, right").destroy();

        const sfxOrientation = getYawPitchRollFromVector(deltaTarget.normalise());

        const sfx = AddSpecialEffect("war3mapImported\\DustWave.mdx", casterLoc.x, casterLoc.y);
        BlzSetSpecialEffectHeight(sfx, casterLoc.z);
        BlzSetSpecialEffectYaw(sfx, sfxOrientation.yaw + 90 * bj_DEGTORAD);
        BlzSetSpecialEffectRoll(sfx, sfxOrientation.pitch + 90 * bj_DEGTORAD);
        BlzSetSpecialEffectAlpha(sfx, 40);
        BlzSetSpecialEffectScale(sfx, 0.4);
        BlzSetSpecialEffectTimeScale(sfx, 0.3);
        BlzSetSpecialEffectTime(sfx, 0.5);

        DestroyEffect(sfx);

        let projectile = new Projectile(
            unit.handle,
            casterLoc, 
            new ProjectileTargetStatic(deltaTarget)
        );
        projectile
            .setCollisionRadius(25)
            .setVelocity(3100)
            .onCollide((projectile: Projectile, collidesWith: unit) => 
                this.onProjectileCollide(projectile, collidesWith)
            );
        projectile.addEffect(
            "war3mapImported\\Bullet.mdx",
            new Vector3(0, 0, 0),
            deltaTarget.normalise(),
            1.6
        );
        EventEntity.send(EVENT_TYPE.ADD_PROJECTILE, { source: unit, data: { projectile: projectile }});
    }
    
    private onProjectileCollide(projectile: Projectile, collidesWith: unit) {
        projectile.setDestroy(true);
        if (this.equippedTo) {
            UnitDamageTarget(
                projectile.source, 
                collidesWith, 
                this.getDamage(this.equippedTo.unit), 
                false, 
                true, 
                ATTACK_TYPE_PIERCE, 
                DAMAGE_TYPE_NORMAL, 
                WEAPON_TYPE_WOOD_MEDIUM_STAB
            );
            ForceEntity.getInstance().aggressionBetweenTwoPlayers(this.equippedTo.unit.owner, MapPlayer.fromHandle(GetOwningPlayer(collidesWith)));
        }
    }

    public getDamage(unit: Unit): number {
        return MathRound( 10 + GetRandomInt(0,6) );
    }
}