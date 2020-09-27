import { Vector3 } from "../../types/vector3";
import { Gun } from "./gun";
import { Crewmember } from "../../crewmember/crewmember-type";
import { Projectile } from "../projectile/projectile";
import { ProjectileTargetStatic } from "../projectile/projectile-target";
import { Vector2, vectorFromUnit } from "../../types/vector2";
import { BURST_RIFLE_EXTENDED, BURST_RIFLE_ITEM } from "../../../resources/weapon-tooltips";
import { PlayNewSoundOnUnit, staticDecorator } from "../../../lib/translators";
import { ArmableUnit } from "./unit-has-weapon";
import { BURST_RIFLE_ABILITY_ID, BURST_RIFLE_ITEM_ID, EMS_RIFLING_ABILITY_ID } from "../weapon-constants";
import { getZFromXY } from "lib/utils";
import { MapPlayer, Force, Effect } from "w3ts/index";
import { CrewFactory } from "app/crewmember/crewmember-factory";
import { ForceEntity } from "app/force/force-entity";
import { Timers } from "app/timer-type";
import { EventEntity } from "app/events/event-entity";
import { EVENT_TYPE } from "app/events/event-enum";
import { Log } from "lib/serilog/serilog";

export class BurstRifle extends Gun {
    constructor(item: item, equippedTo: ArmableUnit) {
        super(item, equippedTo);
        // Define spread and bullet distance
        this.spreadAOE = 180;
        this.bulletDistance = 1400;
    }

    public applyWeaponAttackValues(caster: Crewmember) {
        caster.unit.setAttackCooldown(1, 1);
        this.equippedTo.unit.setBaseDamage(this.getDamage(caster) - 1, 0);
        caster.unit.acquireRange = this.bulletDistance * 0.8;
        BlzSetUnitWeaponRealField(this.equippedTo.unit.handle, UNIT_WEAPON_RF_ATTACK_RANGE, 1, this.bulletDistance * 0.7);
        BlzSetUnitWeaponIntegerField(this.equippedTo.unit.handle, UNIT_WEAPON_IF_ATTACK_ATTACK_TYPE, 0, 2);
    }
    
    public onShoot(caster: Crewmember, targetLocation: Vector3): void {
        super.onShoot(caster, targetLocation);

        const unit = caster.unit.handle;
        const sound = PlayNewSoundOnUnit("Sounds\\BattleRifleShoot.mp3", caster.unit, 50);
        let casterLoc = new Vector3(caster.unit.x, caster.unit.y, getZFromXY(caster.unit.x, caster.unit.y)).projectTowardsGunModel(unit);
        let targetDistance = new Vector2(targetLocation.x - casterLoc.x, targetLocation.y - casterLoc.y).normalise().multiplyN(this.bulletDistance);

        let newTargetLocation = new Vector3(targetDistance.x + casterLoc.x, targetDistance.y + casterLoc.y, targetLocation.z);

        let delay = 0;
        for (let i = 0; i < 5; i++) {
            Timers.addTimedAction(delay, () => {
                this.fireProjectile(caster, newTargetLocation);
                return true;
            });
            delay = delay + 0.05;
        }   
    };

    private fireProjectile(caster: Crewmember, targetLocation: Vector3) {
        const unit = caster.unit.handle;
        // print("Target "+targetLocation.toString())
        let casterLoc = new Vector3(caster.unit.x, caster.unit.y, getZFromXY(caster.unit.x, caster.unit.y)).projectTowardsGunModel(unit);
        let strayTarget = this.getStrayLocation(targetLocation, caster)
        let deltaTarget = strayTarget.subtract(casterLoc);

        new Effect("war3mapImported\\MuzzleFlash.mdx", caster.unit, "hand, right").destroy();

        let projectile = new Projectile(
            unit,
            casterLoc, 
            new ProjectileTargetStatic(deltaTarget)
        );
        projectile
            .setCollisionRadius(15)
            .setVelocity(2400)
            .onCollide((projectile: Projectile, collidesWith: unit) => 
                this.onProjectileCollide(projectile, collidesWith)
            );
        Timers.addTimedAction(0.07, () => {
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
        EventEntity.send(EVENT_TYPE.ADD_PROJECTILE, { source: caster.unit, data: { projectile: projectile }});
    }
    
    private onProjectileCollide(projectile: Projectile, collidesWith: unit) {
        projectile.setDestroy(true);
        if (this.equippedTo) {
            const crewmember = CrewFactory.getInstance().getCrewmemberForUnit(this.equippedTo.unit);
            if (crewmember) {
                UnitDamageTarget(
                    projectile.source, 
                    collidesWith, 
                    this.getDamage(crewmember), 
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
        const newTooltip = BURST_RIFLE_EXTENDED(
            this.getDamage(crewmember), 
            minDistance, 
            this.spreadAOE
        );
        return newTooltip;
    }

    protected getItemTooltip(crewmember: Crewmember): string {
        const damage = this.getDamage(crewmember);
        return BURST_RIFLE_ITEM(this, damage);
    }


    public getDamage(caster: Crewmember): number {
        if (this.attachment && this.attachment.name === "Ems Rifling") {
            return MathRound( 20 * caster.getDamageBonusMult());
        }
        return MathRound( 18 * caster.getDamageBonusMult());
    }

    public getAbilityId() { return BURST_RIFLE_ABILITY_ID; }
    public getItemId() { return BURST_RIFLE_ITEM_ID; }
}