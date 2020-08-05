import { Vector3 } from "../../types/vector3";
import { Gun } from "./gun";
import { Crewmember } from "../../crewmember/crewmember-type";
import { Projectile } from "../projectile/projectile";
import { ProjectileTargetStatic } from "../projectile/projectile-target";
import { Game } from "../../game";
import { Vector2, vectorFromUnit } from "../../types/vector2";
import { LASER_EXTENDED, LASER_ITEM } from "../../../resources/weapon-tooltips";
import { PlayNewSoundOnUnit, staticDecorator } from "../../../lib/translators";
import { ArmableUnit } from "./unit-has-weapon";
import { LASER_ITEM_ID, LASER_ABILITY_ID } from "../weapon-constants";
import { DiodeEjector } from "../attachment/diode-ejector";
import { getZFromXY } from "lib/utils";
import { MapPlayer } from "w3ts/index";
import { EventEntity } from "app/events/event-entity";
import { CrewFactory } from "app/crewmember/crewmember-factory";
import { ForceEntity } from "app/force/force-entity";
import { EVENT_TYPE } from "app/events/event-enum";

const INTENSITY_MAX = 4;

export class LaserRifle extends Gun {

    // The intensity of the gun, each increment increases damage and sound
    private intensity = 0;
    private collideDict = new Map<number, boolean>();

    constructor(game: Game, item: item, equippedTo: ArmableUnit) {
        super(item, equippedTo);
        // Define spread and bullet distance
        this.spreadAOE = 100;
        this.bulletDistance = 2100;
        this.attachment = new DiodeEjector(game, item);
    }

    public applyWeaponAttackValues(caster: Crewmember) {
        caster.unit.setAttackCooldown(1.5, 1);
        this.equippedTo.unit.setBaseDamage(this.getDamage(caster) - 1, 0);
        caster.unit.acquireRange = this.bulletDistance * 0.8;
        BlzSetUnitWeaponIntegerField(this.equippedTo.unit.handle, UNIT_WEAPON_IF_ATTACK_ATTACK_TYPE, 0, 5);
        BlzSetUnitWeaponRealField(this.equippedTo.unit.handle, UNIT_WEAPON_RF_ATTACK_RANGE, 1, this.bulletDistance * 0.7);
        BlzSetUnitWeaponIntegerField(this.equippedTo.unit.handle, UNIT_WEAPON_IF_ATTACK_TARGETS_ALLOWED, 0, 2);
    }
    
    public onShoot(caster: Crewmember, targetLocation: Vector3): void {
        super.onShoot(caster, targetLocation);

        const unit = caster.unit.handle;
        
        PlayNewSoundOnUnit(this.getSoundPath(), caster.unit, 127);
        let casterLoc = new Vector3(caster.unit.x, caster.unit.y, getZFromXY(caster.unit.x, caster.unit.y)).projectTowardsGunModel(unit);
        let targetDistance = new Vector2(targetLocation.x - casterLoc.x, targetLocation.y - casterLoc.y).normalise().multiplyN(this.bulletDistance);
        let newTargetLocation = new Vector3(targetDistance.x + casterLoc.x, targetDistance.y + casterLoc.y, targetLocation.z);

        this.fireProjectile(caster, newTargetLocation);
    };

    private fireProjectile(caster: Crewmember, targetLocation: Vector3) {
        const unit = caster.unit.handle;
        // print("Target "+targetLocation.toString())
        let casterLoc = new Vector3(caster.unit.x, caster.unit.y, getZFromXY(caster.unit.x, caster.unit.y)).projectTowardsGunModel(unit);
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
            .onCollide((projectile: Projectile, collidesWith: unit) => 
                this.onProjectileCollide(projectile, collidesWith)
            )
            .onDeath((projectile: Projectile) => {
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
                this.updateTooltip(caster);

                // Broadcast item equip event
                EventEntity.getInstance().sendEvent(EVENT_TYPE.MINOR_UPGRADE_RESEARCHED, { 
                    source: this.equippedTo.unit, crewmember: caster
                });
                return true;
            })

        EventEntity.send(EVENT_TYPE.ADD_PROJECTILE, { source: caster.unit, data: { projectile }});
    }
    
    private onProjectileCollide(projectile: Projectile, collidesWith: unit) {
        // Set true in the collide dict
        this.collideDict.set(projectile.getId(), true);
        // Destroy projectile
        projectile.setDestroy(true);

        // increase intensity
        this.intensity = Math.min(this.intensity + 1, INTENSITY_MAX);

        // Case equipped unit to damage the target
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
        const newTooltip = LASER_EXTENDED(
            this.getDamage(crewmember), 
            this.intensity,
            minDistance, 
            this.spreadAOE
        );
        return newTooltip;
    }

    protected getItemTooltip(crewmember: Crewmember): string {
        const damage = this.getDamage(crewmember);
        return LASER_ITEM(this, damage);
    }


    public getDamage(caster: Crewmember): number {
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