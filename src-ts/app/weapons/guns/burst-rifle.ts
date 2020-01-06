/** @noSelfInFile **/

import { Vector3 } from "../../types/vector3";
import { Gun } from "./gun";
import { Crewmember } from "../../crewmember/crewmember-type";
import { Projectile } from "../projectile/projectile";
import { ProjectileTargetStatic } from "../projectile/projectile-target";
import { Game } from "../../game";
import { WeaponModule } from "../weapon-module";
import { TimedEvent } from "../../types/timed-event";
import { Vector2 } from "../../types/vector2";
import { BURST_RIFLE_EXTENDED, BURST_RIFLE_ITEM } from "../../../resources/weapon-tooltips";
import { PlayNewSoundOnUnit, staticDecorator } from "../../../lib/translators";
import { Attachment } from "../attachment/attachment";
import { ArmableUnit } from "./unit-has-weapon";

export const BURST_RIFLE_ABILITY_ID = FourCC('A002');
export const BURST_RIFLE_ITEM_ID = FourCC('I000');

export const InitBurstRifle = (weaponModule: WeaponModule) => {
    weaponModule.weaponItemIds.push(BURST_RIFLE_ITEM_ID);
    weaponModule.weaponAbilityIds.push(BURST_RIFLE_ABILITY_ID);
}
@staticDecorator()
export class BurstRifle extends Gun {    
    private DEFAULT_STRAY = 200;
    private SHOT_DISTANCE = 900;

    constructor(item: item, equippedTo: ArmableUnit) {
        super(item, equippedTo);
    }
    
    public onShoot(weaponModule: WeaponModule, caster: Crewmember, targetLocation: Vector3): void {
        super.onShoot(weaponModule, caster, targetLocation);

        const unit = caster.unit;
        const sound = PlayNewSoundOnUnit("Sounds\\BattleRifleShoot.mp3", caster.unit, 50);
        let casterLoc = new Vector3(GetUnitX(unit), GetUnitY(unit), BlzGetUnitZ(unit)+50).projectTowards2D(GetUnitFacing(unit) * bj_DEGTORAD, 30);
        let targetDistance = new Vector2(targetLocation.x - casterLoc.x, targetLocation.y - casterLoc.y).normalise().multiplyN(this.SHOT_DISTANCE);

        let newTargetLocation = new Vector3(targetDistance.x + casterLoc.x, targetDistance.y + casterLoc.y, targetLocation.z);


        let delay = 0;
        for (var i = 0; i < 5; i++) {
            weaponModule.game.timedEventQueue.AddEvent(new TimedEvent(() => {
                this.fireProjectile(weaponModule, caster, newTargetLocation);
                return true;
            }, delay, false));
            delay = delay + 50;
        }   
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
            );

        weaponModule.addProjectile(projectile);
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

    protected getTooltip(weaponModule: WeaponModule, crewmember: Crewmember) {
        const accuracyModifier = (this.DEFAULT_STRAY*(100/crewmember.accuracy))/2;
        const newTooltip = BURST_RIFLE_EXTENDED(
            this.getDamage(weaponModule, crewmember), 
            this.SHOT_DISTANCE-accuracyModifier, 
            this.SHOT_DISTANCE+accuracyModifier
        );
        return newTooltip;
    }

    protected getItemTooltip(weaponModule: WeaponModule, crewmember: Crewmember): string {
        return BURST_RIFLE_ITEM(this);
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
        return 15;
    }

    public getAbilityId() { return BURST_RIFLE_ABILITY_ID; }
    public getItemId() { return BURST_RIFLE_ITEM_ID; }
}