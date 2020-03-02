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
const PROJECTILE_RANGE = 900;
const PROJECTILE_SPEED = 800;

export class DiodeEjectAbility implements Ability {

    private casterUnit: unit | undefined;
    private targetLoc: Vector3 | undefined;

    private timeElapsed: number;

    private doneDamage: boolean = false;
    private hasLeaped: boolean = false;

    private ventDamagePoint: number = 0.4;
    private startLeapAt: number = 0.5;

    private crew: Crewmember | undefined;
    private weapon: LaserRifle | undefined;  

    private leapExpired: boolean = false;

    constructor() {
        this.timeElapsed = 0;
    }

    public initialise(abMod: AbilityModule) {
        this.casterUnit = GetTriggerUnit();

        this.targetLoc =  new Vector3(GetSpellTargetX(), GetSpellTargetY(), 0);
        this.targetLoc.z = abMod.game.getZFromXY(this.targetLoc.x, this.targetLoc.y);

        this.crew = abMod.game.crewModule.getCrewmemberForUnit(this.casterUnit) as Crewmember;
        this.weapon = this.crew.weapon as LaserRifle;

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
        }
        
        if (this.hasLeaped) {
            leapFinished = this.processLeap(abMod, delta);
        }

        return leapFinished;
    };

    private doVentDamage(abMod: AbilityModule) {
        if (!this.casterUnit || !this.weapon || !this.crew || !this.targetLoc) return;

        const cX = GetUnitX(this.casterUnit);
        const cY = GetUnitY(this.casterUnit);
        const casterLoc = new Vector3(cX, cY, abMod.game.getZFromXY(cX, cY));

        // Missile appear loc
        const projStartLoc = casterLoc.projectTowards2D( GetUnitFacing(this.casterUnit), 10);

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
        const diodeDamage = 50 + weaponBaseDamage * 1.5 / 20;

        const endAngle = angleToTarget + spread;
        const incrementBy = angleToTarget*2 / NUM_PROJECTILES;
        let currentAngle = angleToTarget - spread;

        while (currentAngle <= endAngle) {
            const endLoc = projStartLoc.projectTowards2D(currentAngle, projectileRange);
            endLoc.z = abMod.game.getZFromXY(endLoc.x, endLoc.y);

            const projectile = new Projectile(
                this.casterUnit,
                projStartLoc,
                new ProjectileTargetStatic(endLoc),
                new ProjectileMoverLinear()
            )
            .onCollide((module, projectile, who) => {
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
    }

    private startLeap(abMod: AbilityModule) {
        if (!this.casterUnit || !this.weapon || !this.crew) return;

        const cX = GetUnitX(this.casterUnit);
        const cY = GetUnitY(this.casterUnit);
        const casterLoc = new Vector3(cX, cY, abMod.game.getZFromXY(cX, cY));
        
        const weaponIntensity = this.weapon.getIntensity();

        // Set target loc as projection backwards of caster facing
        // 128 is the default tile distance
        // At 4 stacks the user jumps back two tiles
        const distanceJumpBack = 128 + 128 * weaponIntensity / 4;
        let targetLoc = casterLoc.projectTowards2D(GetUnitFacing(this.casterUnit), -distanceJumpBack);

        // Register the leap and its callback
        abMod.game.leapModule.newLeap(
            this.casterUnit,
            targetLoc,
            45,
            3
        ).onFinish((leapEntry) => {
            this.leapExpired = true;
        });
    }

    private processLeap(abMod: AbilityModule, delta: number) {
        return !this.leapExpired;
    }
    
    public destroy(abMod: AbilityModule) {
        if (this.casterUnit) {
            UnitRemoveAbility(this.casterUnit, UNIT_IS_FLY);
            BlzPauseUnitEx(this.casterUnit, false);
            SetUnitFlyHeight(this.casterUnit, 0, 9999);
        }
        return true; 
    };
}