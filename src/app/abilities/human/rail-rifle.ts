import { Ability } from "../ability-type";
import { Unit } from "w3ts/handles/unit";
import { PlayNewSoundOnUnit, getYawPitchRollFromVector } from "lib/translators";
import { getZFromXY } from "lib/utils";
import { Vector3 } from "app/types/vector3";
import { Projectile } from "app/weapons/projectile/projectile";
import { ProjectileTargetStatic } from "app/weapons/projectile/projectile-target";
import { SoundRef } from "app/types/sound-ref";
import { vectorFromUnit, Vector2 } from "app/types/vector2";
import { WeaponEntity } from "app/weapons/weapon-entity";
import { CrewFactory } from "app/crewmember/crewmember-factory";
import { Timers } from "app/timer-type";
import { InputManager } from "lib/TreeLib/InputManager/InputManager";
import { Effect } from "w3ts/index";
import { SFX_BLUE_BALL, SFX_BLUE_BLAST } from "resources/sfx-paths";


export class RailRifleAbility implements Ability {

    private unit: Unit;
    private targetLoc: Vector2;
    private castOrderId: number;

    private timeElapsed: number = 0;
    private sound: SoundRef;

    private createSfxTimer = 0;
    private createSfxEvery = 1;

    private orbEffect: Effect;

    constructor() {}

    public initialise() {
        this.unit = Unit.fromHandle(GetTriggerUnit());
        this.sound = new SoundRef("Sounds\\chargeUp.mp3", false); 
        this.sound.playSoundOnUnit(this.unit.handle, 30);

        this.castOrderId = this.unit.currentOrder;

        const uLoc = Vector2.fromWidget(this.unit.handle);
        this.targetLoc = new Vector2( GetSpellTargetX(), GetSpellTargetY() );
        const nLoc = uLoc.applyPolarOffset( uLoc.angleTo(this.targetLoc), 80);

        this.orbEffect = new Effect(SFX_BLUE_BALL, nLoc.x, nLoc.y);
        this.orbEffect.z = getZFromXY(nLoc.x, nLoc.y) + 80;
        // this.orbEffect.setTimeScale(0.1);
        this.orbEffect.scale = 0;
        
        return true;
    };

    public process(delta: number) {
        this.timeElapsed += delta;

        const doCancel = this.unit.currentOrder !== this.castOrderId;

        if (doCancel && this.timeElapsed < 0.75) return false;

        const uLoc = Vector2.fromWidget(this.unit.handle);
        this.targetLoc = InputManager.getLastMousePosition(this.unit.owner.handle);

        const angleTo = uLoc.angleTo(this.targetLoc);
        const nLoc = uLoc.applyPolarOffset( angleTo, 80);

        this.unit.facing = angleTo;

        this.orbEffect.x = nLoc.x;
        this.orbEffect.y = nLoc.y;        
        this.orbEffect.setTimeScale(0.3);
        this.orbEffect.scale = 0 + (0.1 * this.timeElapsed / 2);
        this.orbEffect.z = 75 - 75 * this.orbEffect.scale

        this.createSfxTimer += delta;
        if (this.createSfxTimer >= this.createSfxEvery / (this.timeElapsed * 2)) {
            this.createSfxTimer = 0;

            // Create "wind" effect

            const sfx = AddSpecialEffect("war3mapImported\\DustWave.mdx", nLoc.x, nLoc.y);
            BlzSetSpecialEffectHeight(sfx,  this.orbEffect.z);
            BlzSetSpecialEffectYaw(sfx, GetRandomInt(0, 360) * bj_DEGTORAD);
            BlzSetSpecialEffectRoll(sfx, GetRandomInt(0, 360) * bj_DEGTORAD);
            BlzSetSpecialEffectPitch(sfx, GetRandomInt(0, 360) * bj_DEGTORAD);
            BlzSetSpecialEffectAlpha(sfx, 40);
            BlzSetSpecialEffectScale(sfx, 0.7);
            BlzSetSpecialEffectTimeScale(sfx, 1);
            BlzSetSpecialEffectTime(sfx, 0.5);
        }


        // Should we fire?
        if (doCancel) {
            this.fire();
            return false;
        }
        return true;
    };

    private fire() {
        const unit = this.unit;

        this.orbEffect.destroy();

        const sound = PlayNewSoundOnUnit("Sounds\\SniperRifleShoot.mp3", unit, 50);

        let targetLoc = new Vector3(this.targetLoc.x, this.targetLoc.y, getZFromXY(this.targetLoc.x, this.targetLoc.y) + 10);
        const PROJ_SPEED = 3400;

        
        let casterLoc = new Vector3(
            unit.x,
            unit.y,
            getZFromXY(unit.x, unit.y)+50
        );
        
        const angleTo = casterLoc.angle2Dto(this.targetLoc);

        casterLoc = casterLoc.projectTowards2D(angleTo, 80);
        let deltaTarget = targetLoc.subtract(casterLoc).normalise();

        const sfx = AddSpecialEffect("Objects\\Spawnmodels\\NightElf\\NECancelDeath\\NECancelDeath.mdl", casterLoc.x, casterLoc.y);
        const rotData = getYawPitchRollFromVector(deltaTarget);
        BlzSetSpecialEffectYaw(sfx, rotData.yaw+ 90 * bj_DEGTORAD);
        BlzSetSpecialEffectRoll(sfx, rotData.roll+ 90 * bj_DEGTORAD);
        BlzSetSpecialEffectPitch(sfx, rotData.pitch);
        // BlzSetSpecialEffectHeight(sfx, casterLoc.z);
        // DestroyEffect(sfx);
        

        deltaTarget.x *= 6000;
        deltaTarget.y *= 6000;
        let collisionRadius = 25;
        let projectile = new Projectile(
            unit.handle,
            casterLoc, 
            new ProjectileTargetStatic(deltaTarget)
        );
        const effect =  projectile.addEffect(
            SFX_BLUE_BLAST,
            new Vector3(0, 0, 0),
            targetLoc.subtract(casterLoc).normalise(),
            0.4 * this.timeElapsed / 6
        );
        // BlzSetSpecialEffectColor(effect, 130, 160, 255);

        WeaponEntity.getInstance().addProjectile(projectile);

        // Create smoke rings every tick if we charged more than 2 seconds
        if (this.timeElapsed >= 2) this.createSmokeRingsFor(projectile, deltaTarget);
        if (this.timeElapsed >= 3) {
            const facingVec = targetLoc.subtract(casterLoc).normalise();
            collisionRadius = 40;
        }
        
        projectile
            .setCollisionRadius(collisionRadius)
            .setVelocity(PROJ_SPEED)
            .onCollide((projectile: Projectile, collidesWith: unit) => 
                this.onProjectileCollide(projectile, collidesWith)
            );
    }
    
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