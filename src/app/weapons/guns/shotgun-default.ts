import { Vector3 } from "../../types/vector3";
import { Projectile } from "../projectile/projectile";
import { ProjectileTargetStatic } from "../projectile/projectile-target";
import { SHOTGUN_EXTENDED, SHOTGUN_ITEM } from "../../../resources/weapon-tooltips";
import { PlayNewSoundOnUnit } from "../../../lib/translators";
import { ArmableUnitWithItem } from "./unit-has-weapon";
import { SHOTGUN_ABILITY_ID, SHOTGUN_ITEM_ID } from "../weapon-constants";
import { getPointsInRangeWithSpread, getZFromXY } from "lib/utils";
import { MapPlayer, Unit } from "w3ts/index";
import { SFX_SHOCKWAVE } from "resources/sfx-paths";
import { ForceEntity } from "app/force/force-entity";
import { EventEntity } from "app/events/event-entity";
import { EVENT_TYPE } from "app/events/event-enum";
import { Timers } from "app/timer-type";
import { Shotgun } from "./shotgun";

export class ShotgunDefault extends Shotgun {
    constructor(item: item, equippedTo: ArmableUnitWithItem) {
        super(item, equippedTo);
        // Define spread and bullet distance
    }

    public applyWeaponAttackValues(unit: Unit) {
        this.equippedTo.unit.setBaseDamage(this.getDamage(unit) - 1, 0);
        unit.acquireRange = 450;
        BlzSetUnitWeaponIntegerField(this.equippedTo.unit.handle, ConvertUnitWeaponIntegerField(FourCC('ua1t')), 0, 2);
        BlzSetUnitWeaponRealField(this.equippedTo.unit.handle, UNIT_WEAPON_RF_ATTACK_RANGE, 1, this.bulletDistance+20);
        unit.setAttackCooldown( 
            BlzGetAbilityCooldown(this.getAbilityId(), unit.getAbilityLevel(this.getAbilityId())), 
            0
        );
    }
    
    public onShoot(unit: Unit, targetLocation: Vector3): void {
        super.onShoot(unit, targetLocation);

        // Clear units hit
        this.unitsHit.clear();

        const sound = PlayNewSoundOnUnit("Sounds\\ShotgunShoot.mp3", unit, 50);
        const NUM_BULLETS = 6;

        let casterLoc = new Vector3(unit.x, unit.y, getZFromXY(unit.x, unit.y)).projectTowardsGunModel(unit.handle);
        const angleDeg = casterLoc.angle2Dto(targetLocation);

        const deltaLocs = getPointsInRangeWithSpread(
            angleDeg - 18,
            angleDeg + 18,
            NUM_BULLETS,
            this.bulletDistance,
            1.3
        );

        const centerTargetLoc = casterLoc.projectTowards2D(angleDeg, this.bulletDistance*1.9);
        centerTargetLoc.z = getZFromXY(centerTargetLoc.x, centerTargetLoc.y);

        // Do nothing if the central projectile hits
        this.fireProjectile(unit, centerTargetLoc, true);
        
        deltaLocs.forEach((loc, index) => {
            const nX = casterLoc.x + loc.x;
            const nY = casterLoc.y + loc.y;
            const targetLoc = new Vector3(nX, nY, getZFromXY(nX, nY));
            this.fireProjectile(unit, targetLoc, false)
        });

        Timers.addTimedAction(1.6, () => {
            if (this.equippedTo && this.equippedTo.unit) {
                KillSoundWhenDone( PlayNewSoundOnUnit("Sounds\\ShotgunPump.wav", this.equippedTo.unit, 30) );
            }
        })
    };

    protected fireProjectile(unit: Unit, targetLocation: Vector3, isCentralProjectile: boolean): void {
        // print("Target "+targetLocation.toString())
        let casterLoc = new Vector3(unit.x, unit.y, getZFromXY(unit.x, unit.y)).projectTowardsGunModel(unit.handle);
        let deltaTarget = targetLocation.subtract(casterLoc);

        let projectile = new Projectile(
            unit.handle,
            casterLoc, 
            new ProjectileTargetStatic(deltaTarget)
        );
        BlzSetSpecialEffectAlpha(projectile.addEffect(
            isCentralProjectile 
                ? SFX_SHOCKWAVE
                : "war3mapImported\\Bullet.mdx",
            new Vector3(0, 0, 0),
            deltaTarget.normalise(),
            isCentralProjectile ? 0.6 : 1.4
        ), 100);

        projectile
            .setCollisionRadius(20)
            .setVelocity(isCentralProjectile ? 2400 : 2250)
            .onCollide((projectile: Projectile, collidesWith: unit) => {
                this.onProjectileCollide(projectile, collidesWith);
            });
        
        EventEntity.send(EVENT_TYPE.ADD_PROJECTILE, { source: unit, data: { projectile }});
    }
    
    protected getTooltip(unit: Unit) {
        const minDistance = this.spreadAOE-this.getStrayValue(unit) / 2;
        const newTooltip = SHOTGUN_EXTENDED(
            this.getDamage(unit), 
            minDistance, 
            this.spreadAOE
        );
        return newTooltip;
    }

    protected getItemTooltip(unit: Unit): string {
        const damage = this.getDamage(unit);
        return SHOTGUN_ITEM(this, damage);
    }

    public getDamage(unit: Unit): number {
        return MathRound(35 * this.getDamageBonusMult());
    }

    public getAbilityId() { return SHOTGUN_ABILITY_ID; }
    public getItemId() { return SHOTGUN_ITEM_ID; }
}