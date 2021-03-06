import { AbilityWithDone } from "../ability-type";
import { Vector3 } from "../../types/vector3";
import { PlayNewSoundOnUnit } from "../../../lib/translators";
import { Unit } from "w3ts/handles/unit";
import { getZFromXY } from "lib/utils";
import { LeapEntity } from "app/leap-engine/leap-entity";


const LEAP_ID = FourCC('LEAP');
const LEAP_DISTANCE_MAX = 600;

export class LeapAbility extends AbilityWithDone {

    private timeElapsed: number = 0;
    private leapExpired: boolean = false;

    public init() {
        super.init();

        const cdRemaining = BlzGetUnitAbilityCooldownRemaining(this.casterUnit.handle, LEAP_ID);

        if (cdRemaining > 0) return false;

        const casterLoc = Vector3.fromWidget(this.casterUnit.handle);
        const clickLoc = new Vector3(GetOrderPointX(), GetOrderPointY(), 0);
        let isSelfCast = GetSpellAbilityId() > 0;
        
        // Only continue if the alien is ordered to move far away
        if (!isSelfCast && clickLoc.subtract(casterLoc).getLength() < 800) return false;


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
            BlzStartUnitAbilityCooldown(this.casterUnit.handle, LEAP_ID, BlzGetAbilityCooldown(LEAP_ID, 0));
        }
        // Handle incoming from self cast
        else {
            targetLoc.x = GetSpellTargetX();
            targetLoc.y = GetSpellTargetY();
            targetLoc.z = casterLoc.z + 10;
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

        PlayNewSoundOnUnit(this.getRandomSound(), Unit.fromHandle(this.casterUnit.handle), 100);

        const angle = Rad2Deg(Atan2(targetLoc.y-casterLoc.y, targetLoc.x-casterLoc.x));
        BlzSetUnitFacingEx(this.casterUnit.handle, angle);
        SetUnitTimeScale(this.casterUnit.handle, 0.3);

        // Register the leap and its callback
        LeapEntity.getInstance().newLeap(
            this.casterUnit.handle,
            targetLoc,
            55,
            1
        ).onFinish((leapEntry) => {
            let caster = this.casterUnit;
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

    public step(delta: number) {
        // Bug fix, play this here to avoid animation locking
        if (this.timeElapsed == 0) {
            SetUnitAnimation(this.casterUnit.handle, "attack");
        }
        this.timeElapsed += delta;

        if (this.leapExpired) {
            this.done = true;
        }
        return !this.leapExpired;
    };

    
    public destroy() {
        if (this.casterUnit) {
            const casterLoc = Vector3.fromWidget(this.casterUnit.handle);

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

            SetUnitAnimation(this.casterUnit.handle, "stand");
            SetUnitTimeScale(this.casterUnit.handle, 1);
            
        }
        return true; 
    };
}