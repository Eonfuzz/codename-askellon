/** @noSelfInFile **/
import { Ability } from "../ability-type";
import { AbilityModule } from "../ability-module";
import { Vector3 } from "../../types/vector3";
import { PlayNewSoundOnUnit } from "../../../lib/translators";
import { Unit } from "w3ts/handles/unit";


const LEAP_ID = FourCC('LEAP');
const LEAP_DISTANCE_MAX = 400;

export class LeapAbility implements Ability {

    private casterUnit: unit | undefined;

    private timeElapsed: number;
    private leapExpired: boolean = false;

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
        const clickLoc = new Vector3(GetOrderPointX(), GetOrderPointY(), 0);
        let isSelfCast = GetSpellAbilityId() > 0;
        
        // Only continue if the alien is ordered to move far away
        if (!isSelfCast && clickLoc.subtract(casterLoc).getLength() < 800) return false;

        casterLoc.z = abMod.game.getZFromXY(casterLoc.x, casterLoc.y);

        let targetLoc = new Vector3(0, 0, 0);

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
            targetLoc.x = GetSpellTargetX();
            targetLoc.y = GetSpellTargetY();
            targetLoc.z = abMod.game.getZFromXY(targetLoc.x, targetLoc.y) + 10;
        }
        
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

        PlayNewSoundOnUnit(this.getRandomSound(), Unit.fromHandle(this.casterUnit), 100);

        const angle = Rad2Deg(Atan2(targetLoc.y-casterLoc.y, targetLoc.x-casterLoc.x));
        BlzSetUnitFacingEx(this.casterUnit, angle);
        SetUnitAnimation(this.casterUnit, "attack");
        SetUnitTimeScale(this.casterUnit, 0.3);

        // Register the leap and its callback
        abMod.game.leapModule.newLeap(
            this.casterUnit,
            targetLoc,
            45,
            3
        ).onFinish((leapEntry) => {
            this.leapExpired = true;
        });

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
        return !this.leapExpired;
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
            
        }
        return true; 
    };
}