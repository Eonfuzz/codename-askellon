/** @noSelfInFile **/

import { Vector3 } from "../../types/vector3";
import { Gun, GunDecorator } from "./gun";
import { Crewmember } from "../../crewmember/crewmember-type";
import { Projectile } from "../projectile/projectile";
import { ProjectileTargetStatic } from "../projectile/projectile-target";
import { Game } from "../../game";
import { WeaponModule } from "../weapon-module";
import { TimedEvent } from "../../types/timed-event";
import { Vector2 } from "../../types/vector2";
import { BURST_RIFLE_EXTENDED } from "../../../resources/weapon-tooltips";
import { PlayNewSoundOnUnit, staticDecorator } from "../../../lib/translators";

@staticDecorator<GunDecorator>()
export class BurstRifle implements Gun {
    public item: item;
    public equippedTo: unit | undefined;
    
    static abilityId: number = FourCC('A002');
    static itemId: number = FourCC('I000');

    private DEFAULT_STRAY = 200;
    private SHOT_DISTANCE = 800;

    // Set when the gun is removed and a cooldown still exists
    remainingCooldown: number | undefined;

    public static initialise(weaponModule: WeaponModule) {
        weaponModule.weaponItemIds.push(BurstRifle.itemId);
        weaponModule.weaponAbilityIds.push(BurstRifle.abilityId);
    }

    constructor(item: item, equippedTo: unit) {
        this.item = item;
        this.equippedTo = equippedTo;
    }

    public onAdd(weaponModule: WeaponModule, caster: Crewmember): void {
        this.equippedTo = caster.unit;
        UnitAddAbility(caster.unit, BurstRifle.abilityId);
        this.updateTooltip(weaponModule, caster);

        if (this.remainingCooldown && this.remainingCooldown > 0) {
            // SetAbilityCooldown
            print("Reforged better add a way to set cooldowns remaining");
        }
    };
    public onRemove(weaponModule: WeaponModule): void {
        if (this.equippedTo) {
            UnitRemoveAbility(this.equippedTo, BurstRifle.abilityId);
            this.remainingCooldown = BlzGetUnitAbilityCooldownRemaining(this.equippedTo, BurstRifle.abilityId);
        }
    };

    public updateTooltip(weaponModule: WeaponModule, caster: Crewmember) {
        if (this.equippedTo) {
            const owner = GetOwningPlayer(this.equippedTo);
            const accuracyModifier = (this.DEFAULT_STRAY*(100/caster.accuracy))/2
            const newTooltip = BURST_RIFLE_EXTENDED(
                this.getDamage(weaponModule, caster), 
                this.SHOT_DISTANCE-accuracyModifier, 
                this.SHOT_DISTANCE+accuracyModifier
            );
            if (GetLocalPlayer() === owner) {
                BlzSetAbilityExtendedTooltip(BurstRifle.abilityId, newTooltip, 0);
            }
        }
    };

    public onShoot(weaponModule: WeaponModule, caster: Crewmember, targetLocation: Vector3): void {
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
        )
            .setVelocity(2400)
            .onCollide(this.onProjectileCollide);

        weaponModule.addProjectile(projectile);
    }
    
    private onProjectileCollide(projectile: Projectile, collidesWith: unit) {
        projectile.setDestroy(true);
        UnitDamageTarget(projectile.source, collidesWith, 20, false, true, ATTACK_TYPE_PIERCE, DAMAGE_TYPE_NORMAL, WEAPON_TYPE_WOOD_MEDIUM_STAB);
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
}