import { Ability } from "../ability-type";
import { AbilityModule } from "../ability-module";
import { Unit } from "w3ts/index";
import { BUFF_ID } from "resources/buff-ids";
import { BuffInstanceDuration } from "app/buff/buff-instance";
import { SoundRef } from "app/types/sound-ref";
import { ABIL_INQUIS_PURITY_SEAL_DUMMY, TECH_MAJOR_RELIGION, ABIL_INQUIS_PURITY_SEAL, ABILITY_SLOW_ID, ABIL_STUN_25 } from "resources/ability-ids";
import { PuritySeal } from "app/buff/purity-seal";
import { Vector2, vectorFromUnit } from "app/types/vector2";
import { SFX_RED_SINGULARITY, SFX_DARK_RITUAL, SFX_DARK_SUMMONING, SFX_HOWL } from "resources/sfx-paths";
import { PlayNewSoundOnUnit } from "lib/translators";
import { getZFromXY } from "lib/utils";
import { Log } from "lib/serilog/serilog";

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

    public initialise(module: AbilityModule) {
        this.unit = Unit.fromHandle(GetTriggerUnit());
        this.targetUnit = Unit.fromHandle(GetSpellTargetUnit());

        smiteSound.playSoundOnUnit(this.targetUnit.handle, 127);

        this.smiteSfx = AddSpecialEffect(SFX_DARK_SUMMONING, this.targetUnit.x, this.targetUnit.y);
        BlzSetSpecialEffectZ(this.smiteSfx, getZFromXY(this.targetUnit.x, this.targetUnit.y) + 30);
        BlzSetSpecialEffectTimeScale(this.smiteSfx, 0.5);

        return true;
    };

    public process(module: AbilityModule, delta: number) {

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

                if (!module.game.forceModule.aggressionBetweenTwoPlayers(this.unit.owner, this.targetUnit.owner)) return;
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
                module.game.useDummyFor((dummy: unit) => {
                    SetUnitAbilityLevel(dummy, ABIL_STUN_25, 8);
                    SetUnitX(dummy, GetUnitX(unit));
                    SetUnitY(dummy, GetUnitY(unit));
                    IssueTargetOrder(dummy, "thunderbolt", unit);
                }, ABIL_STUN_25);

            }
            else {
                if (!module.game.forceModule.aggressionBetweenTwoPlayers(this.unit.owner, this.targetUnit.owner)) return;
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
                module.game.useDummyFor((dummy: unit) => {
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

    public destroy(aMod: AbilityModule) { 
        DestroyEffect(this.smiteSfx);
        return true;
    };
}