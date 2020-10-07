import { Vector3 } from "../../types/vector3";
import { Gun } from "./gun";
import { Crewmember } from "../../crewmember/crewmember-type";
import { Projectile } from "../projectile/projectile";
import { ProjectileTargetStatic } from "../projectile/projectile-target";
import { Vector2, vectorFromUnit } from "../../types/vector2";
import { BURST_RIFLE_EXTENDED, BURST_RIFLE_ITEM } from "../../../resources/weapon-tooltips";
import { PlayNewSoundOnUnit, staticDecorator } from "../../../lib/translators";
import { ArmableUnit, ArmableUnitWithItem } from "./unit-has-weapon";
import { BURST_RIFLE_ABILITY_ID, BURST_RIFLE_ITEM_ID, EMS_RIFLING_ABILITY_ID } from "../weapon-constants";
import { getZFromXY } from "lib/utils";
import { MapPlayer, Force, Effect, Unit } from "w3ts/index";
import { CrewFactory } from "app/crewmember/crewmember-factory";
import { ForceEntity } from "app/force/force-entity";
import { Timers } from "app/timer-type";
import { EventEntity } from "app/events/event-entity";
import { EVENT_TYPE } from "app/events/event-enum";
import { Log } from "lib/serilog/serilog";
import { GunItem } from "./gun-item";

export class BurstRifle extends GunItem {
    constructor(item: item, equippedTo: ArmableUnitWithItem) {
        super(item, equippedTo);
        // Define spread and bullet distance
        this.spreadAOE = 180;
        this.bulletDistance = 1400;
    }

    public applyWeaponAttackValues(caster: Unit) {
        caster.setAttackCooldown(1, 1);
        this.equippedTo.unit.setBaseDamage(this.getDamage(caster) - 1, 0);
        caster.acquireRange = this.bulletDistance * 0.8;
        BlzSetUnitWeaponRealField(this.equippedTo.unit.handle, UNIT_WEAPON_RF_ATTACK_RANGE, 1, this.bulletDistance * 0.7);
        BlzSetUnitWeaponIntegerField(this.equippedTo.unit.handle, UNIT_WEAPON_IF_ATTACK_ATTACK_TYPE, 0, 2);
    }
    
    public onShoot(unit: Unit, targetLocation: Vector3): void {
        super.onShoot(unit, targetLocation);

        const sound = PlayNewSoundOnUnit("Sounds\\BattleRifleShoot.mp3", unit, 50);
        let casterLoc = new Vector3(unit.x, unit.y, getZFromXY(unit.x, unit.y)).projectTowardsGunModel(unit.handle);
        let targetDistance = new Vector2(targetLocation.x - casterLoc.x, targetLocation.y - casterLoc.y).normalise().multiplyN(this.bulletDistance);

        let newTargetLocation = new Vector3(targetDistance.x + casterLoc.x, targetDistance.y + casterLoc.y, targetLocation.z);

        let delay = 0;
        for (let i = 0; i < 5; i++) {
            Timers.addTimedAction(delay, () => {
                this.fireProjectile(unit, newTargetLocation);
                return true;
            });
            delay = delay + 0.05;
        }   
    };

    private fireProjectile(unit: Unit, targetLocation: Vector3) {
        // print("Target "+targetLocation.toString())
        let casterLoc = new Vector3(unit.x, unit.y, getZFromXY(unit.x, unit.y)).projectTowardsGunModel(unit.handle);
        let strayTarget = this.getStrayLocation(targetLocation, unit)
        let deltaTarget = strayTarget.subtract(casterLoc);

        new Effect("war3mapImported\\MuzzleFlash.mdx", unit, "hand, right").destroy();

        let projectile = new Projectile(
            unit.handle,
            casterLoc, 
            new ProjectileTargetStatic(deltaTarget)
        );
        projectile
            .setCollisionRadius(15)
            .setVelocity(2400)
            .onCollide((projectile: Projectile, collidesWith: unit) => 
                this.onProjectileCollide(projectile, collidesWith)
            );
        Timers.addTimedAction(0.05, () => {
            // Log.Information("Projctile: "+projectile+" "+projectile.dead);
            if (projectile.dead === false) {
                projectile.addEffect(
                    "war3mapImported\\Bullet.mdx",
                    new Vector3(0, 0, 0),
                    deltaTarget.normalise(),
                    1.4
                );
            }
        });
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

    protected getTooltip(unit: Unit) {
        const minDistance = this.spreadAOE-this.getStrayValue(unit) / 2;
        const newTooltip = BURST_RIFLE_EXTENDED(
            this.getDamage(unit), 
            minDistance, 
            this.spreadAOE
        );
        return newTooltip;
    }

    protected getItemTooltip(u: Unit): string {
        const damage = this.getDamage(u);
        return BURST_RIFLE_ITEM(this, damage);
    }


    public getDamage(caster: Unit): number {
        if (this.attachment && this.attachment.name === "Ems Rifling") {
            return MathRound( 20 * this.getDamageBonusMult());
        }
        return MathRound( 18 * this.getDamageBonusMult());
    }

    public getAbilityId() { return BURST_RIFLE_ABILITY_ID; }
    public getItemId() { return BURST_RIFLE_ITEM_ID; }
}