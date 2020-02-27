/** @noSelfInFile **/
import { Ability } from "../ability-type";
import { AbilityModule } from "../ability-module";
import { Vector2, vectorFromUnit } from "../../types/vector2";
import { Log } from "../../../lib/serilog/serilog";
import { Vector3 } from "../../types/vector3";
import { Projectile } from "../../weapons/projectile/projectile";
import { ProjectileTargetStatic, ProjectileMoverParabolic } from "../../weapons/projectile/projectile-target";
import { FilterIsEnemyAndAlive } from "../../../resources/filters";
import { PlayNewSoundOnUnit } from "../../../lib/translators";
import { UNIT_IS_FLY, SMART_ORDER_ID } from "../../../lib/order-ids";
import { Trigger } from "../../types/jass-overrides/trigger";
import { LaserRifle } from "app/weapons/guns/laser-rifle";
import { Crewmember } from "app/crewmember/crewmember-type";

export class DiodeEjectAbility implements Ability {

    private casterUnit: unit | undefined;
    private timeElapsed: number;

    private doneDamage: boolean = false;
    private hasLeaped: boolean = false;

    private ventDamagePoint: number = 0.4;
    private startLeapAt: number = 0.5;

    private unitLocTracker: Vector3 | undefined;
    private initialZ: number = 0;

    private mover: ProjectileMoverParabolic | undefined;  
    private crew: Crewmember | undefined;
    private weapon: LaserRifle | undefined;  

    constructor() {
        this.timeElapsed = 0;
    }

    public initialise(abMod: AbilityModule) {
        this.casterUnit = GetTriggerUnit();

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
        if (!this.casterUnit || !this.weapon || !this.crew) return;

        const weaponBaseDamage = this.weapon.getDamage(abMod.game.weaponModule, this.crew);
        const diodeDamage = 50 + weaponBaseDamage * 1.25;

        Log.Information("Vent damage: "+diodeDamage);
    }

    private startLeap(abMod: AbilityModule) {
        if (!this.casterUnit || !this.weapon || !this.crew) return;

        const cX = GetUnitX(this.casterUnit);
        const cY = GetUnitY(this.casterUnit);
        const casterLoc = new Vector3(cX, cY, abMod.game.getZFromXY(cX, cY));
        this.initialZ = casterLoc.z;
        
        const weaponIntensity = this.weapon.getIntensity();

        // Set target loc as projection backwards of caster facing
        // 128 is the default tile distance
        // At 4 stacks the user jumps back two tiles
        const distanceJumpBack = 128 + 128 * weaponIntensity / 4;
        let targetLoc = casterLoc.projectTowards2D(GetUnitFacing(this.casterUnit), -distanceJumpBack);

        this.mover = new ProjectileMoverParabolic(
            casterLoc, 
            targetLoc, 
            Deg2Rad(45)
        );
        this.unitLocTracker = casterLoc;

        BlzPauseUnitEx(this.casterUnit, true);
        UnitAddAbility(this.casterUnit, UNIT_IS_FLY);
        BlzUnitDisableAbility(this.casterUnit, UNIT_IS_FLY, true, true);
    }

    private processLeap(abMod: AbilityModule, delta: number) {
        if (this.mover && this.casterUnit && this.unitLocTracker) {

            const posDelta = this.mover.move(
                this.mover.originalPos, 
                this.mover.originalDelta, 
                this.mover.velocity, 
                delta
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
            UnitRemoveAbility(this.casterUnit, UNIT_IS_FLY);
            BlzPauseUnitEx(this.casterUnit, false);
            SetUnitFlyHeight(this.casterUnit, 0, 9999);
        }
        return true; 
    };
}