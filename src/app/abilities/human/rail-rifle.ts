import { Ability } from "../ability-type";
import { Unit } from "w3ts/handles/unit";
import { PlayNewSoundOnUnit, getYawPitchRollFromVector } from "lib/translators";
import { getZFromXY } from "lib/utils";
import { Vector3 } from "app/types/vector3";
import { Projectile } from "app/weapons/projectile/projectile";
import { ProjectileTargetStatic } from "app/weapons/projectile/projectile-target";
import { SoundRef } from "app/types/sound-ref";
import { vectorFromUnit } from "app/types/vector2";
import { WeaponEntity } from "app/weapons/weapon-entity";
import { CrewFactory } from "app/crewmember/crewmember-factory";
import { Timers } from "app/timer-type";


export class RailRifleAbility implements Ability {

    private unit: Unit;
    private targetLoc: Vector3;
    private prevTargetLoc: Vector3;
    private castOrderId: number;

    private targetUnit?: Unit;
    private timeElapsed: number = 0;
    private sound: SoundRef;
    constructor() {}

    public initialise() {
        this.unit = Unit.fromHandle(GetTriggerUnit());
        this.sound = new SoundRef("Sounds\\chargeUp.mp3", false); 
        this.sound.playSoundOnUnit(this.unit.handle, 30);

        this.castOrderId = this.unit.currentOrder;
        
        if (GetSpellTargetUnit()) {
            this.targetUnit = Unit.fromHandle(GetSpellTargetUnit());
            this.targetLoc = new Vector3(this.targetUnit.x, this.targetUnit.y, getZFromXY(this.targetUnit.x, this.targetUnit.y))
        }
        else {
            this.targetLoc = new Vector3(GetSpellTargetX(), GetSpellTargetY(), 
                getZFromXY(GetSpellTargetX(), GetSpellTargetY())
            );
        }
        return true;
    };

    public process(delta: number) {
        const unit = this.unit;
        this.timeElapsed += delta;

        const doCancel = this.unit.currentOrder !== this.castOrderId;

        if (doCancel && this.timeElapsed < 0.75) return false;

        // If we have a target unit try to predict where it will be based on movement during channel
        if (this.targetUnit) {
            // update target loc for the future
            this.prevTargetLoc = this.targetLoc;
            this.targetLoc = new Vector3(
                this.targetUnit.x, 
                this.targetUnit.y, 
                getZFromXY(this.targetUnit.x, this.targetUnit.y)
            );
            // Make unit face the target
            this.unit.facing = vectorFromUnit(this.unit.handle).angleTo(this.targetLoc.to2D());
        }

        // Should we fire?
        if (doCancel) {
            const sound = PlayNewSoundOnUnit("Sounds\\SniperRifleShoot.mp3", unit, 50);
            let casterLoc = new Vector3(
                unit.x,
                unit.y,
                getZFromXY(unit.x, unit.y)+50
            ).projectTowards2D(unit.facing * bj_DEGTORAD, 30);

            let targetLoc = this.targetLoc;
            const PROJ_SPEED = 2900;

            // If we had a unit target try to track them
            if (this.targetUnit) {
                const dVec = this.targetLoc.subtract(this.prevTargetLoc);
                const dLen = dVec.getLength();
                const ourDistance = this.targetLoc.subtract(casterLoc).getLength();

                const tTakenToDistance = ourDistance / PROJ_SPEED;
                const tTakenNewLoc = this.targetLoc.getLength() / PROJ_SPEED;
                targetLoc = this.targetLoc.add( dVec.normalise().multiplyN(tTakenNewLoc - tTakenToDistance) );
            }

            let deltaTarget = targetLoc.subtract(casterLoc).normalise();
            deltaTarget.x *= 6000;
            deltaTarget.y *= 6000;
            let collisionRadius = 25;
            let projectile = new Projectile(
                unit.handle,
                casterLoc, 
                new ProjectileTargetStatic(deltaTarget)
            );
            const effect =  projectile.addEffect(
                "war3mapImported\\Bullet.mdx",
                new Vector3(0, 0, 0),
                targetLoc.subtract(casterLoc).normalise(),
                2.5
            );
            // BlzSetSpecialEffectColor(effect, 130, 160, 255);

            WeaponEntity.getInstance().addProjectile(projectile);

            // Create smoke rings every tick if we charged more than 2 seconds
            if (this.timeElapsed >= 2) this.createSmokeRingsFor(projectile, deltaTarget);
            if (this.timeElapsed >= 3) {
                const facingVec = targetLoc.subtract(casterLoc).normalise();
                collisionRadius = 40;
                projectile.addEffect(
                    "war3mapImported\\Bullet.mdx",
                    new Vector3(15, 0, 0),
                    facingVec,
                    2.5
                );
                projectile.addEffect(
                    "war3mapImported\\Bullet.mdx",
                    new Vector3(-15, 0, 0),
                    facingVec,
                    2.5
                );
                projectile.addEffect(
                    "war3mapImported\\Bullet.mdx",
                    new Vector3(0, 15, 0),
                    facingVec,
                    2.5
                );
                projectile.addEffect(
                    "war3mapImported\\Bullet.mdx",
                    new Vector3(0, -15, 0),
                    facingVec,
                    2.5
                );
            }
            
            projectile
                .setCollisionRadius(collisionRadius)
                .setVelocity(PROJ_SPEED)
                .onCollide((projectile: Projectile, collidesWith: unit) => 
                    this.onProjectileCollide(projectile, collidesWith)
                );
            return false;
        }
        return true;
    };

    
    private onProjectileCollide(projectile: Projectile, collidesWith: unit) {
        // Destroy projectile
        projectile.setDestroy(true);

        // Case equipped unit to damage the target
        const crewmember = CrewFactory.getInstance().getCrewmemberForUnit(this.unit);
        if (crewmember) {
            const chargeFactor = Pow(1+this.timeElapsed/10, 2)

            UnitDamageTarget(
                projectile.source, 
                collidesWith, 
                (50 + (chargeFactor*125) )*crewmember.getDamageBonusMult(),
                false, 
                true, 
                ATTACK_TYPE_PIERCE, 
                DAMAGE_TYPE_NORMAL, 
                WEAPON_TYPE_WOOD_MEDIUM_STAB
            );
        }
    }

    private createSmokeRingsFor(projectile: Projectile, deltaTarget: Vector3) {
        let delay = 0;
        while (delay < 1000) {
            Timers.addTimedAction(delay, () => {
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
            });
            delay += 100;
        }

    }

    public destroy() {
        // Stop the charge sound
        StopSound(this.sound.sound, true, false);
        // SetSoundVolume(this.sound.sound, 0);
        return true;
    };
}