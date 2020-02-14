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
import { UNIT_IS_FLY } from "../../../lib/order-ids";


const LEAP_ID = FourCC('LEAP');
const LEAP_DISTANCE_MAX = 400;

export class LeapAbility implements Ability {

    private casterUnit: unit | undefined;
    private mover: ProjectileMoverParabolic | undefined;

    private timeElapsed: number;
    private unitLocTracker = new Vector3(0, 0, 0);
    private initialZ: number = 0;

    constructor() {
        this.timeElapsed = 0;
    }

    public initialise(abMod: AbilityModule) {
        this.casterUnit = GetTriggerUnit();

        const cdRemaining = BlzGetUnitAbilityCooldownRemaining(this.casterUnit, LEAP_ID);

        if (cdRemaining > 0) return false;

        const casterLoc = new Vector3(
            GetUnitX(this.casterUnit), 
            GetUnitY(this.casterUnit), 
            0
        );
        casterLoc.z = abMod.game.getZFromXY(casterLoc.x, casterLoc.y);

        let targetLoc = new Vector3(0, 0, 0);
        let isSelfCast = GetSpellAbilityId() > 0;

        // Log.Information(`Is self cast? ${isSelfCast}::${isSelfCast ? 'YES' : 'NO'}`);

        // Handle incoming from order
        if (!isSelfCast) {
            targetLoc.x = GetOrderPointX();
            targetLoc.y = GetOrderPointY();

            // Now project the delta
            let delta = targetLoc.subtract(casterLoc);
            let distance = delta.getLength();

            delta = delta.normalise().multiplyN(Math.min(distance, LEAP_DISTANCE_MAX));

            targetLoc = casterLoc.add(delta);
            targetLoc.z = casterLoc.z;

            // Force the ability to go on CD / be cast
            BlzStartUnitAbilityCooldown(this.casterUnit, LEAP_ID, BlzGetAbilityCooldown(LEAP_ID, 0));
        }
        // Handle incoming from self cast
        else {
            targetLoc.x = GetUnitX(this.casterUnit);
            targetLoc.y = GetUnitY(this.casterUnit);
            targetLoc = targetLoc.projectTowards2D(Rad2Deg(GetUnitFacing(this.casterUnit)), 150);
            targetLoc.z = abMod.game.getZFromXY(targetLoc.x, targetLoc.y) + 10;
        }

        this.initialZ = casterLoc.z;
        this.mover = new ProjectileMoverParabolic(
            casterLoc, 
            targetLoc, 
            Deg2Rad(isSelfCast ? 82 : 45)
        );
        this.unitLocTracker = casterLoc;
        
        // const MISSILE_SFX = 'Abilities\\Weapons\\ChimaeraAcidMissile\\ChimaeraAcidMissile.mdl';
        // AddSpecialEffect(MISSILE_SFX, targetLoc.x, targetLoc.y);
        // AddSpecialEffect(MISSILE_SFX, casterLoc.x, casterLoc.y);

        let sfx = AddSpecialEffect("war3mapImported\\DustWave.mdx", casterLoc.x, casterLoc.y);
        BlzSetSpecialEffectAlpha(sfx, 40);
        BlzSetSpecialEffectScale(sfx, 0.7);
        BlzSetSpecialEffectTimeScale(sfx, 1);
        BlzSetSpecialEffectTime(sfx, 0.2);
        BlzSetSpecialEffectYaw(sfx, GetRandomInt(0, 360));
        DestroyEffect(sfx);

        sfx = AddSpecialEffect("war3mapImported\\DustWave.mdx", casterLoc.x, casterLoc.y);
        BlzSetSpecialEffectAlpha(sfx, 40);
        BlzSetSpecialEffectScale(sfx, 0.8);
        BlzSetSpecialEffectTimeScale(sfx, 0.7);
        BlzSetSpecialEffectTime(sfx, 0.2);
        BlzSetSpecialEffectYaw(sfx, GetRandomInt(0, 360));
        DestroyEffect(sfx);

        sfx = AddSpecialEffect("war3mapImported\\DustWave.mdx", casterLoc.x, casterLoc.y);
        BlzSetSpecialEffectAlpha(sfx, 40);
        BlzSetSpecialEffectScale(sfx, 0.9);
        BlzSetSpecialEffectTimeScale(sfx, 0.4);
        BlzSetSpecialEffectTime(sfx, 0.2);
        BlzSetSpecialEffectYaw(sfx, GetRandomInt(0, 360));
        DestroyEffect(sfx);

        PlayNewSoundOnUnit(this.getRandomSound(), this.casterUnit, 100);

        const angle = Rad2Deg(Atan2(targetLoc.y-casterLoc.y, targetLoc.x-casterLoc.x));
        BlzSetUnitFacingEx(this.casterUnit, angle);
        BlzPauseUnitEx(this.casterUnit, true);
        SetUnitAnimation(this.casterUnit, "attack");
        SetUnitTimeScale(this.casterUnit, 0.3);
        UnitAddAbility(this.casterUnit, UNIT_IS_FLY);
        BlzUnitDisableAbility(this.casterUnit, UNIT_IS_FLY, true, true);
        return true;
    };

    private getRandomSound() {
        const soundPaths = [
            "Units\\Critters\\Hydralisk\\HydraliskYes1.flac",
            "Units\\Critters\\Hydralisk\\HydraliskYesAttack1.flac",
            "Units\\Critters\\Hydralisk\\HydraliskYesAttack2.flac",
        ];

        return soundPaths[GetRandomInt(0, soundPaths.length - 1)]
    }

    public process(abMod: AbilityModule, delta: number) {
        if (this.mover && this.casterUnit) {

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

            if (this.unitLocTracker.z < terrainZ) return false;
        }
        return true;
    };

    
    public destroy(abMod: AbilityModule) {
        if (this.casterUnit) {
            const casterLoc = new Vector3(
                GetUnitX(this.casterUnit), 
                GetUnitY(this.casterUnit), 
                0
            );
            casterLoc.z = abMod.game.getZFromXY(casterLoc.x, casterLoc.y);

            // let sfx = AddSpecialEffect("Abilities\\Spells\\Orc\\WarStomp\\WarStompCaster.mdl", casterLoc.x, casterLoc.y);
            // DestroyEffect(sfx);

            let sfx = AddSpecialEffect("war3mapImported\\DustWave.mdx", casterLoc.x, casterLoc.y);
            BlzSetSpecialEffectAlpha(sfx, 40);
            BlzSetSpecialEffectScale(sfx, 0.8);
            BlzSetSpecialEffectTimeScale(sfx, 0.8);
            BlzSetSpecialEffectTime(sfx, 0.2);
            BlzSetSpecialEffectYaw(sfx, GetRandomInt(0, 360));
            DestroyEffect(sfx);

            sfx = AddSpecialEffect("war3mapImported\\DustWave.mdx", casterLoc.x, casterLoc.y);
            BlzSetSpecialEffectAlpha(sfx, 40);
            BlzSetSpecialEffectScale(sfx, 0.9);
            BlzSetSpecialEffectTimeScale(sfx, 0.5);
            BlzSetSpecialEffectTime(sfx, 0.2);
            BlzSetSpecialEffectYaw(sfx, GetRandomInt(0, 360));
            DestroyEffect(sfx);

            SetUnitAnimation(this.casterUnit, "stand");
            SetUnitTimeScale(this.casterUnit, 1);
            UnitRemoveAbility(this.casterUnit, UNIT_IS_FLY);

            this.casterUnit && BlzPauseUnitEx(this.casterUnit, false);
            this.casterUnit && SetUnitFlyHeight(this.casterUnit, 0, 9999);
        }
        return true; 
    };
}