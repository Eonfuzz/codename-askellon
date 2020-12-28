import { Ability } from "../ability-type";
import { Unit } from "w3ts/index";
import { SoundRef } from "app/types/sound-ref";
import { ABILITY_SLOW_ID, ABIL_STUN_25 } from "resources/ability-ids";
import { Vector2, vectorFromUnit } from "app/types/vector2";
import { SFX_RED_SINGULARITY, SFX_DARK_RITUAL, SFX_DARK_SUMMONING, SFX_HOWL, SFX_SMITE } from "resources/sfx-paths";
import { PlayNewSoundOnUnit } from "lib/translators";
import { getZFromXY } from "lib/utils";
import { ForceEntity } from "app/force/force-entity";
import { Game } from "app/game";
import { DummyCast } from "lib/dummy";

export const smiteSound = new SoundRef("Sounds\\InquisitorSmite.mp3", false);

export class SmiteAbility implements Ability {

    private unit: Unit;
    private targetUnit: Unit;

    private isImpure: boolean = false;

    private timerUntilCheck: number = 2.2;
    private endNextTick: boolean = false;

    private doFinish: boolean = false;

    private prevUnitLoc: Vector2;

    private smiteSfx: effect;

    constructor(isImpure: boolean) {
        this.isImpure = isImpure;
    }

    public initialise() {
        this.unit = Unit.fromHandle(GetTriggerUnit());
        this.targetUnit = Unit.fromHandle(GetSpellTargetUnit());

        smiteSound.playSoundOnUnit(this.targetUnit.handle, 127);

        this.smiteSfx = AddSpecialEffect(SFX_SMITE, this.targetUnit.x, this.targetUnit.y);
        BlzSetSpecialEffectTimeScale(this.smiteSfx, 0.36);
        BlzSetSpecialEffectScale(this.smiteSfx, 0.6);
        BlzSetSpecialEffectZ(this.smiteSfx, getZFromXY(this.targetUnit.x, this.targetUnit.y) + 30);
        // BlzSetSpecialEffectTimeScale(this.smiteSfx, 0.5);

        return true;
    };

    public process(delta: number) {

        this.timerUntilCheck -= delta;

        BlzSetSpecialEffectX(this.smiteSfx, this.targetUnit.x);
        BlzSetSpecialEffectY(this.smiteSfx, this.targetUnit.y);
        BlzSetSpecialEffectZ(this.smiteSfx, getZFromXY(this.targetUnit.x, this.targetUnit.y) + 30);
        
        if (this.endNextTick) {
            const uLoc = vectorFromUnit(this.targetUnit.handle);
            const d = this.prevUnitLoc.subtract(uLoc).getLength();
            this.doFinish = true;

            PlayNewSoundOnUnit(
                "Doodads\\Cinematic\\LightningboltLightningBolt1.flac", 
                this.targetUnit, 
                127
            );

            BlzSetSpecialEffectTimeScale(this.smiteSfx, 1.3);
            let sfx = AddSpecialEffect(SFX_HOWL, this.targetUnit.x, this.targetUnit.y);
            BlzSetSpecialEffectYaw(sfx, GetRandomInt(0, 360));
            BlzSetSpecialEffectZ(sfx, getZFromXY(this.targetUnit.x, this.targetUnit.y) + 30);
            DestroyEffect(sfx);

            
            if (d > 0) {

                PlayNewSoundOnUnit(
                    "Doodads\\Dungeon\\Terrain\\DungeonPortculisGate\\DungeonPortculisGateOpenMetal.flac", 
                    this.targetUnit, 
                    127
                );
                sfx = AddSpecialEffect(SFX_RED_SINGULARITY, this.targetUnit.x, this.targetUnit.y);
                BlzSetSpecialEffectYaw(sfx, GetRandomInt(0, 360));
                BlzSetSpecialEffectZ(sfx, getZFromXY(this.targetUnit.x, this.targetUnit.y) + 30);
                DestroyEffect(sfx);

                if (!ForceEntity.getInstance().aggressionBetweenTwoPlayers(this.unit.owner, this.targetUnit.owner)) return;
                // We've moved uh oh time for BLAM
                UnitDamageTarget(
                    this.unit.handle, 
                    this.targetUnit.handle, 
                    100,
                    false, 
                    true, 
                    ATTACK_TYPE_MAGIC, 
                    DAMAGE_TYPE_MAGIC, 
                    WEAPON_TYPE_WHOKNOWS
                );

                const unit = this.targetUnit.handle;
                DummyCast((dummy: unit) => {
                    SetUnitAbilityLevel(dummy, ABIL_STUN_25, 8);
                    SetUnitX(dummy, GetUnitX(unit));
                    SetUnitY(dummy, GetUnitY(unit));
                    IssueTargetOrder(dummy, "thunderbolt", unit);
                }, ABIL_STUN_25);

            }
            else {
                if (!ForceEntity.getInstance().aggressionBetweenTwoPlayers(this.unit.owner, this.targetUnit.owner)) return;
                // Deal 50 damage
                UnitDamageTarget(
                    this.unit.handle, 
                    this.targetUnit.handle, 
                    50,
                    false, 
                    true, 
                    ATTACK_TYPE_MAGIC, 
                    DAMAGE_TYPE_MAGIC, 
                    WEAPON_TYPE_WHOKNOWS
                );

                // Slow the unit
                const unit = this.targetUnit.handle;
                DummyCast((dummy: unit) => {
                    SetUnitX(dummy, GetUnitX(unit));
                    SetUnitY(dummy, GetUnitY(unit) + 50);

                    // Set to level 3 for 3 sec slow
                    SetUnitAbilityLevel(dummy, ABILITY_SLOW_ID, 2);
                    IssueTargetOrder(dummy, 'slow', GetEnumUnit());
                }, ABILITY_SLOW_ID);
            }
        }
        else if (this.timerUntilCheck <= 0) {
            this.endNextTick = true;
            this.prevUnitLoc = vectorFromUnit(this.targetUnit.handle);
        }

        return !this.doFinish;
    };

    public destroy() { 
        DestroyEffect(this.smiteSfx);
        return true;
    };
}