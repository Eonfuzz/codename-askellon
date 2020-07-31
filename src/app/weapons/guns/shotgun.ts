/** @noSelfInFile **/

import { Vector3 } from "../../types/vector3";
import { Gun } from "./gun";
import { Crewmember } from "../../crewmember/crewmember-type";
import { Projectile } from "../projectile/projectile";
import { ProjectileTargetStatic } from "../projectile/projectile-target";
import { SHOTGUN_EXTENDED, SHOTGUN_ITEM } from "../../../resources/weapon-tooltips";
import { PlayNewSoundOnUnit, staticDecorator } from "../../../lib/translators";
import { ArmableUnit } from "./unit-has-weapon";
import { SHOTGUN_ABILITY_ID, SHOTGUN_ITEM_ID } from "../weapon-constants";
import { getPointsInRangeWithSpread, getZFromXY } from "lib/utils";
import { MapPlayer } from "w3ts/index";
import { SFX_SHOCKWAVE } from "resources/sfx-paths";
import { WeaponEntity } from "../weapon-entity";
import { CrewFactory } from "app/crewmember/crewmember-factory";
import { ForceEntity } from "app/force/force-entity";


export const InitShotgun = () => {
    WeaponEntity.getInstance().weaponItemIds.push(SHOTGUN_ITEM_ID);
    WeaponEntity.getInstance().weaponAbilityIds.push(SHOTGUN_ABILITY_ID);
}
export class Shotgun extends Gun {

    private unitsHit = new Map<unit, number>();

    constructor(item: item, equippedTo: ArmableUnit) {
        super(item, equippedTo);
        // Define spread and bullet distance
        this.spreadAOE = 240;
        this.bulletDistance = 300;
    }

    public applyWeaponAttackValues(caster: Crewmember) {
        caster.unit.setAttackCooldown(1.5, 1);
        this.equippedTo.unit.setBaseDamage(this.getDamage(caster) - 1, 0);
        caster.unit.acquireRange = 450;
        BlzSetUnitWeaponIntegerField(this.equippedTo.unit.handle, ConvertUnitWeaponIntegerField(FourCC('ua1t')), 0, 2);
        BlzSetUnitWeaponRealField(this.equippedTo.unit.handle, UNIT_WEAPON_RF_ATTACK_RANGE, 1, 400);
    }
    
    public onShoot(caster: Crewmember, targetLocation: Vector3): void {
        super.onShoot(caster, targetLocation);

        // Clear units hit
        this.unitsHit.clear();

        const unit = caster.unit.handle;
        const sound = PlayNewSoundOnUnit("Sounds\\ShotgunShoot.mp3", caster.unit, 50);
        const NUM_BULLETS = 6;

        let casterLoc = new Vector3(caster.unit.x, caster.unit.y, getZFromXY(caster.unit.x, caster.unit.y)).projectTowardsGunModel(unit);
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
        this.fireProjectile(caster, centerTargetLoc, true);
        
        let bulletsHit = 0;
        deltaLocs.forEach((loc, index) => {
            const nX = casterLoc.x + loc.x;
            const nY = casterLoc.y + loc.y;
            const targetLoc = new Vector3(nX, nY, getZFromXY(nX, nY));
            this.fireProjectile(caster, targetLoc, false)
                .onCollide((projectile: Projectile, collidesWith: unit) => {
                    this.onProjectileCollide(projectile, collidesWith);
                });
        });
    };

    private fireProjectile(caster: Crewmember, targetLocation: Vector3, isCentralProjectile: boolean): Projectile {
        const unit = caster.unit.handle;
        // print("Target "+targetLocation.toString())
        let casterLoc = new Vector3(caster.unit.x, caster.unit.y, getZFromXY(caster.unit.x, caster.unit.y)).projectTowardsGunModel(unit);
        let deltaTarget = targetLocation.subtract(casterLoc);

        let projectile = new Projectile(
            unit,
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

        WeaponEntity.getInstance().addProjectile(projectile);
        return projectile
            .setCollisionRadius(20)
            .setVelocity(isCentralProjectile ? 2400 : 2250);
    }
    
    private onProjectileCollide(projectile: Projectile, collidesWith: unit) {
        projectile.setDestroy(true);
        if (this.equippedTo) {
            const crewmember = CrewFactory.getInstance().getCrewmemberForUnit(this.equippedTo.unit);
            const timesUnitHit = this.unitsHit.get(collidesWith) || 0;
            this.unitsHit.set(collidesWith, timesUnitHit + 1);

            if (crewmember) {
                const damage = this.getDamage(crewmember) / Pow(1.25, timesUnitHit);
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
                ForceEntity.getInstance().aggressionBetweenTwoPlayers(this.equippedTo.unit.owner, MapPlayer.fromHandle(GetOwningPlayer(collidesWith)));
            }
        }
    }

    protected getTooltip(crewmember: Crewmember) {
        const minDistance = this.spreadAOE-this.getStrayValue(crewmember) / 2;
        const newTooltip = SHOTGUN_EXTENDED(
            this.getDamage(crewmember), 
            minDistance, 
            this.spreadAOE
        );
        return newTooltip;
    }

    protected getItemTooltip(crewmember: Crewmember): string {
        const damage = this.getDamage(crewmember);
        return SHOTGUN_ITEM(this, damage);
    }


    public getDamage(caster: Crewmember): number {
        return MathRound(35 * caster.getDamageBonusMult());
    }

    public getAbilityId() { return SHOTGUN_ABILITY_ID; }
    public getItemId() { return SHOTGUN_ITEM_ID; }
}