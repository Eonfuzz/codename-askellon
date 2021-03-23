import { AbilityWithDone } from "../ability-type";
import { Unit } from "w3ts/index";
import { SoundRef } from "app/types/sound-ref";
import { ABILITY_SLOW_ID, ABIL_STUN_25, TECH_HAS_GENES_TIER_1, TECH_HAS_GENES_TIER_2, TECH_HAS_GENES_TIER_3 } from "resources/ability-ids";
import { Vector2, vectorFromUnit } from "app/types/vector2";
import { SFX_RED_SINGULARITY, SFX_DARK_RITUAL, SFX_DARK_SUMMONING, SFX_HOWL, SFX_SMITE } from "resources/sfx-paths";
import { PlayNewSoundOnUnit } from "lib/translators";
import { getZFromXY } from "lib/utils";
import { ForceEntity } from "app/force/force-entity";
import { DummyCast } from "lib/dummy";
import { BUFF_ID_PURITY_SEAL } from "resources/buff-ids";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { ALIEN_FORCE_NAME, CULT_FORCE_NAME } from "app/force/forces/force-names";

export const smiteSound = new SoundRef("Sounds\\InquisitorSmite.mp3", false);

export class SmiteAbility extends AbilityWithDone {

    private unit: Unit;
    private targetUnit: Unit;

    private isImpure: boolean = false;

    private timerUntilCheck: number = 2.2;
    private endNextTick: boolean = false;

    private prevUnitLoc: Vector2;

    private smiteSfx: effect;

    constructor(isImpure: boolean) {
        super();
        this.isImpure = isImpure;
    }

    public init() {
        super.init();
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

    public step(delta: number) {

        this.timerUntilCheck -= delta;

        BlzSetSpecialEffectX(this.smiteSfx, this.targetUnit.x);
        BlzSetSpecialEffectY(this.smiteSfx, this.targetUnit.y);
        BlzSetSpecialEffectZ(this.smiteSfx, getZFromXY(this.targetUnit.x, this.targetUnit.y) + 30);
        
        if (this.endNextTick) {
            this.done = true;

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

            const pData = PlayerStateFactory.get(this.targetUnit.owner);
            let isHeretic = false;

            if (PlayerStateFactory.isAlienAI(this.targetUnit.owner)) isHeretic = true;
            else if (pData && pData.getForce()) {
                if (pData.getForce().is(ALIEN_FORCE_NAME)) isHeretic = true;
                else if (pData.getForce().is(CULT_FORCE_NAME)) isHeretic = true;
                else if (this.targetUnit.owner.getTechCount(TECH_HAS_GENES_TIER_1, true) > 0) isHeretic = true;
                else if (this.targetUnit.owner.getTechCount(TECH_HAS_GENES_TIER_2, true) > 0) isHeretic = true;
                else if (this.targetUnit.owner.getTechCount(TECH_HAS_GENES_TIER_3, true) > 0) isHeretic = true;
            }

            const damage = isHeretic ? 250 : 100;
            const doStun = UnitHasBuffBJ(this.targetUnit.handle, BUFF_ID_PURITY_SEAL);
            
            if (ForceEntity.getInstance().aggressionBetweenTwoPlayers(this.unit.owner, this.targetUnit.owner))  {
                // We've moved uh oh time for BLAM
                UnitDamageTarget(
                    this.unit.handle, 
                    this.targetUnit.handle, 
                    damage,
                    false, 
                    true, 
                    ATTACK_TYPE_MAGIC, 
                    DAMAGE_TYPE_MAGIC, 
                    WEAPON_TYPE_WHOKNOWS
                );
            }


            if (doStun) {
                PlayNewSoundOnUnit(
                    "Doodads\\Dungeon\\Terrain\\DungeonPortculisGate\\DungeonPortculisGateOpenMetal.flac", 
                    this.targetUnit, 
                    127
                );
                sfx = AddSpecialEffect(SFX_RED_SINGULARITY, this.targetUnit.x, this.targetUnit.y);
                BlzSetSpecialEffectYaw(sfx, GetRandomInt(0, 360));
                BlzSetSpecialEffectZ(sfx, getZFromXY(this.targetUnit.x, this.targetUnit.y) + 30);
                DestroyEffect(sfx);

                const unit = this.targetUnit.handle;
                DummyCast((dummy: unit) => {
                    SetUnitAbilityLevel(dummy, ABIL_STUN_25, 8);
                    SetUnitX(dummy, GetUnitX(unit));
                    SetUnitY(dummy, GetUnitY(unit));
                    IssueTargetOrder(dummy, "thunderbolt", unit);
                }, ABIL_STUN_25);

            }
            else {
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
    };

    public destroy() { 
        DestroyEffect(this.smiteSfx);
        return true;
    };
}