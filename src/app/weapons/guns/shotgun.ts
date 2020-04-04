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
import { SHOTGUN_EXTENDED, SHOTGUN_ITEM } from "../../../resources/weapon-tooltips";
import { PlayNewSoundOnUnit, staticDecorator } from "../../../lib/translators";
import { ArmableUnit } from "./unit-has-weapon";
import { SHOTGUN_ABILITY_ID, SHOTGUN_ITEM_ID } from "../weapon-constants";
import { getPointsInRangeWithSpread, getZFromXY } from "lib/utils";
import { Log } from "lib/serilog/serilog";


export const InitShotgun = (weaponModule: WeaponModule) => {
    weaponModule.weaponItemIds.push(SHOTGUN_ITEM_ID);
    weaponModule.weaponAbilityIds.push(SHOTGUN_ABILITY_ID);
}
export class Shotgun extends Gun {
    constructor(item: item, equippedTo: ArmableUnit) {
        super(item, equippedTo);
        // Define spread and bullet distance
        this.spreadAOE = 240;
        this.bulletDistance = 300;
    }
    
    public onShoot(weaponModule: WeaponModule, caster: Crewmember, targetLocation: Vector3): void {
        super.onShoot(weaponModule, caster, targetLocation);

        // Log.Information("Shooting shotgun!"); 

        const unit = caster.unit.handle;
        const sound = PlayNewSoundOnUnit("Sounds\\ShotgunShoot.mp3", caster.unit, 50);
        const NUM_BULLETS = 26;

        let casterLoc = new Vector3(GetUnitX(unit), GetUnitY(unit), BlzGetUnitZ(unit)).projectTowardsGunModel(unit);
        const angleDeg = casterLoc.angle2Dto(targetLocation);

        const deltaLocs = getPointsInRangeWithSpread(
            angleDeg - 15,
            angleDeg + 15,
            NUM_BULLETS,
            this.bulletDistance,
            1.3
        );

        const centerTargetLoc = casterLoc.projectTowards2D(angleDeg, this.bulletDistance*1.4);
        centerTargetLoc.z = getZFromXY(centerTargetLoc.x, centerTargetLoc.y);

        this.fireProjectile(weaponModule, caster, centerTargetLoc, true)
            .onCollide((weaponModule: WeaponModule, projectile: Projectile, collidesWith: unit) => {
                this.onProjectileCollide(weaponModule, projectile, collidesWith);
            });
        
        let bulletsHit = 0;
        deltaLocs.forEach((loc, index) => {
            const nX = casterLoc.x + loc.x;
            const nY = casterLoc.y + loc.y;
            const targetLoc = new Vector3(nX, nY, getZFromXY(nX, nY));
            this.fireProjectile(weaponModule, caster, targetLoc, false)
                .onCollide((weaponModule: WeaponModule, projectile: Projectile, collidesWith: unit) => {
                    this.onProjectileCollide(weaponModule, projectile, collidesWith);
                    if (++bulletsHit == NUM_BULLETS) this.onCritDamage(weaponModule, collidesWith);
                });
        });
    };

    private fireProjectile(weaponModule: WeaponModule, caster: Crewmember, targetLocation: Vector3, isCentralProjectile: boolean): Projectile {
        const unit = caster.unit.handle;
        // print("Target "+targetLocation.toString())
        let casterLoc = new Vector3(GetUnitX(unit), GetUnitY(unit), BlzGetUnitZ(unit)).projectTowardsGunModel(unit);
        let deltaTarget = targetLocation.subtract(casterLoc);

        let projectile = new Projectile(
            unit,
            casterLoc, 
            new ProjectileTargetStatic(deltaTarget)
        );
        BlzSetSpecialEffectAlpha(projectile.addEffect(
            isCentralProjectile 
                ? "Abilities\\Spells\\Orc\\Shockwave\\ShockwaveMissile.mdl" 
                : "war3mapImported\\Bullet.mdx",
            new Vector3(0, 0, 0),
            deltaTarget.normalise(),
            isCentralProjectile ? 0.6 : 1.4
        ), 50);

        weaponModule.addProjectile(projectile);
        return projectile
            .setCollisionRadius(15)
            .setVelocity(2400);
    }
    
    private onProjectileCollide(weaponModule: WeaponModule, projectile: Projectile, collidesWith: unit) {
        projectile.setDestroy(true);
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

    private onCritDamage(weaponModule: WeaponModule, collidesWith: unit) {
        if (this.equippedTo) {
            const crewmember = weaponModule.game.crewModule.getCrewmemberForUnit(this.equippedTo.unit);
            if (crewmember) {
                const targetLoc = vectorFromUnit(collidesWith);
                const text = CreateTextTag();
                SetTextTagColor(text, 180, 50, 50, 100);
                SetTextTagText(text, "CRIT!", 0.023);
                SetTextTagPermanent(text, false);
                SetTextTagPos(text, targetLoc.x, targetLoc.y, getZFromXY(targetLoc.x, targetLoc.y));
                SetTextTagVelocity(text, 0, 100);
                SetTextTagLifespan(text, 3);
                // SetTextTagFadepoint(text, 2);
                UnitDamageTarget(
                    crewmember.unit.handle, 
                    collidesWith, 
                    this.getDamage(weaponModule, crewmember) * 12 * 0.25, 
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
        const newTooltip = SHOTGUN_EXTENDED(
            this.getDamage(weaponModule, crewmember), 
            minDistance, 
            this.spreadAOE
        );
        return newTooltip;
    }

    protected getItemTooltip(weaponModule: WeaponModule, crewmember: Crewmember): string {
        const damage = this.getDamage(weaponModule, crewmember);
        return SHOTGUN_ITEM(this, damage);
    }


    public getDamage(weaponModule: WeaponModule, caster: Crewmember): number {
        return MathRound( 10 * caster.getDamageBonusMult());
    }

    public getAbilityId() { return SHOTGUN_ABILITY_ID; }
    public getItemId() { return SHOTGUN_ITEM_ID; }
}