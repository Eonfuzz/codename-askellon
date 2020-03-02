/** @noSelfInFile **/
import { Ability } from "../ability-type";
import { AbilityModule } from "../ability-module";
import { Vector2, vectorFromUnit } from "../../types/vector2";
import { Log } from "../../../lib/serilog/serilog";
import { Vector3 } from "../../types/vector3";
import { Projectile } from "../../weapons/projectile/projectile";
import { ProjectileTargetStatic, ProjectileMoverParabolic, ProjectileMoverLinear } from "../../weapons/projectile/projectile-target";
import { FilterIsEnemyAndAlive } from "../../../resources/filters";
import { PlayNewSoundOnUnit } from "../../../lib/translators";
import { UNIT_IS_FLY, SMART_ORDER_ID } from "../../../lib/order-ids";
import { Trigger } from "../../types/jass-overrides/trigger";
import { LaserRifle } from "app/weapons/guns/laser-rifle";
import { Crewmember } from "app/crewmember/crewmember-type";

// How many projectiles are fired inside the cone
const NUM_PROJECTILES = 20;
const PROJECTILE_CONE = 45;
const PROJECTILE_RANGE = 450;
const PROJECTILE_SPEED = 2800;

export class DiodeEjectAbility implements Ability {

    private casterUnit: unit | undefined;
    private targetLoc: Vector3 | undefined;

    private timeElapsed: number;

    private doneDamage: boolean = false;
    private hasLeaped: boolean = false;

    private ventDamagePoint: number = 0.1;
    private startLeapAt: number = 0.15;

    private unitLocTracker: Vector3 | undefined;
    private initialZ: number = 0;

    private mover: ProjectileMoverParabolic | undefined;  
    private crew: Crewmember | undefined;
    private weapon: LaserRifle | undefined;  

    private weaponIntensityOnCast: number = 0;

    constructor() {
        this.timeElapsed = 0;
    }

    public initialise(abMod: AbilityModule) {
        this.casterUnit = GetTriggerUnit();

        this.targetLoc =  new Vector3(GetSpellTargetX(), GetSpellTargetY(), 0);
        this.targetLoc.z = abMod.game.getZFromXY(this.targetLoc.x, this.targetLoc.y);
        

        this.crew = abMod.game.crewModule.getCrewmemberForUnit(this.casterUnit) as Crewmember;
        this.weapon = this.crew.weapon as LaserRifle;
        this.weaponIntensityOnCast = this.weapon.getIntensity();
        return true;
    };

    public process(abMod: AbilityModule, delta: number) {
        let leapFinished = false;
        this.timeElapsed += delta;

        if (!this.doneDamage && this.ventDamagePoint <= this.timeElapsed) {
            this.doneDamage = true;
            this.doVentDamage(abMod);
        }

        if (!this.hasLeaped && this.startLeapAt <= this.timeElapsed) {
            this.startLeap(abMod);
            this.hasLeaped = true;
        }
        
        if (this.hasLeaped) {
            leapFinished = this.processLeap(abMod, delta);
        }

        return !leapFinished;
    };

    private doVentDamage(abMod: AbilityModule) {
        if (!this.casterUnit || !this.weapon || !this.crew || !this.targetLoc) return;

        const cX = GetUnitX(this.casterUnit);
        const cY = GetUnitY(this.casterUnit);
        const casterLoc = new Vector3(cX, cY, abMod.game.getZFromXY(cX, cY));

        // Missile appear loc
        const projStartLoc = casterLoc.projectTowards2D(GetUnitFacing(this.casterUnit), 30);
        projStartLoc.z = projStartLoc.z + 20;

        // Target loc
        const angleToTarget = projStartLoc.angle2Dto(this.targetLoc);
        const deltaTarget = this.targetLoc.subtract(projStartLoc);
        const sfxModel = this.weapon.getModelPath();
        const accuracy = this.crew.getAccuracy() / 100;

        // Range and spread, increase them slightly base on accuracy
        let projectileRange = PROJECTILE_RANGE * (1 + accuracy - 1);
        let spread = PROJECTILE_CONE * (1 + 1 - accuracy);

        // Damage numbers
        const weaponBaseDamage = this.weapon.getDamage(abMod.game.weaponModule, this.crew);
        const diodeDamage = (50 + weaponBaseDamage * 3) / NUM_PROJECTILES;

        const endAngle = angleToTarget + spread;
        let currentAngle = angleToTarget - spread;
        const incrementBy = (endAngle - currentAngle) / NUM_PROJECTILES;

        PlayNewSoundOnUnit(this.weapon.getSoundPath(), this.casterUnit, 127);

        while (currentAngle <= endAngle) {    
            const endLoc = projStartLoc.projectTowards2D(currentAngle, projectileRange);
            endLoc.z = abMod.game.getZFromXY(endLoc.x, endLoc.y);

            const projectile = new Projectile(
                this.casterUnit,
                new Vector3(projStartLoc.x, projStartLoc.y, projStartLoc.z),
                new ProjectileTargetStatic(
                    endLoc.subtract(projStartLoc),
                ),
                new ProjectileMoverLinear()
            )
            .setVelocity(PROJECTILE_SPEED)
            .onCollide((module, projectile, who) => {
                projectile.setDestroy(true);
                if (this.casterUnit) {
                    UnitDamageTarget(this.casterUnit, 
                        who, 
                        diodeDamage, 
                        true, 
                        true, 
                        ATTACK_TYPE_MAGIC, 
                        DAMAGE_TYPE_ACID, 
                        WEAPON_TYPE_WHOKNOWS
                    );
                }
            });
    
            projectile.addEffect(sfxModel, new Vector3(0, 0, 0), deltaTarget.normalise(), 1);
            abMod.game.weaponModule.addProjectile(projectile);

            // Increment current angle
            currentAngle += incrementBy;
        }
        this.weapon.setIntensity(0);
    }

    private startLeap(abMod: AbilityModule) {
        if (!this.casterUnit || !this.weapon || !this.crew) return;

        const cX = GetUnitX(this.casterUnit);
        const cY = GetUnitY(this.casterUnit);

        const casterLoc = new Vector3(cX, cY, abMod.game.getZFromXY(cX, cY));
        this.initialZ = casterLoc.z;
        
        const weaponIntensity = this.weaponIntensityOnCast;

        // Set target loc as projection backwards of caster facing
        // 128 is the default tile distance
        // At 4 stacks the user jumps back two tiles
        const distanceJumpBack = 128 + 140 * weaponIntensity / 4;
        let targetLoc = casterLoc.projectTowards2D(GetUnitFacing(this.casterUnit), -distanceJumpBack);

        this.mover = new ProjectileMoverParabolic(
            casterLoc, 
            targetLoc, 
            Deg2Rad(70)
        );
        this.unitLocTracker = casterLoc;

        BlzPauseUnitEx(this.casterUnit, true);
        UnitAddAbility(this.casterUnit, UNIT_IS_FLY);
        BlzUnitDisableAbility(this.casterUnit, UNIT_IS_FLY, true, true);

        let sfx = AddSpecialEffect("war3mapImported\\DustWave.mdx", casterLoc.x, casterLoc.y);
        BlzSetSpecialEffectAlpha(sfx, 40);
        BlzSetSpecialEffectScale(sfx, 0.8);
        BlzSetSpecialEffectTimeScale(sfx, 0.8);
        BlzSetSpecialEffectTime(sfx, 0.2);
        BlzSetSpecialEffectYaw(sfx, GetRandomInt(0, 360));
        DestroyEffect(sfx);
    }

    private processLeap(abMod: AbilityModule, delta: number) {
        if (this.mover && this.casterUnit && this.unitLocTracker) {

            const posDelta = this.mover.move(
                this.mover.originalPos, 
                this.mover.originalDelta, 
                this.mover.velocity,
                // Faster timescale 
                delta * 2
            );

            const unitLoc = new Vector3(
                GetUnitX(this.casterUnit) + posDelta.x,
                GetUnitY(this.casterUnit) + posDelta.y,
                this.unitLocTracker.z + posDelta.z
            );
            this.unitLocTracker = unitLoc;
            const terrainZ = abMod.game.getZFromXY(unitLoc.x, unitLoc.y);

            SetUnitX(this.casterUnit, unitLoc.x);
            SetUnitY(this.casterUnit, unitLoc.y);
            SetUnitFlyHeight(this.casterUnit, unitLoc.z+this.initialZ-terrainZ, 9999);

            if (this.unitLocTracker.z < terrainZ) return true;
        }
        return false;
    }
    
    public destroy(abMod: AbilityModule) {
        if (this.casterUnit) {
            const cX = GetUnitX(this.casterUnit);
            const cY = GetUnitY(this.casterUnit);
            const casterLoc = new Vector3(cX, cY, abMod.game.getZFromXY(cX, cY));

            let sfx = AddSpecialEffect("Abilities\\Spells\\Orc\\WarStomp\\WarStompCaster.mdl", casterLoc.x, casterLoc.y);
            DestroyEffect(sfx);

            
            UnitRemoveAbility(this.casterUnit, UNIT_IS_FLY);
            BlzPauseUnitEx(this.casterUnit, false);
            SetUnitFlyHeight(this.casterUnit, 0, 9999);
        }
        return true; 
    };
}