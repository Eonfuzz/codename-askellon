import { SoundWithCooldown, SoundRef } from "../../types/sound-ref";
import { ABIL_ACCURACY_BONUS_30, ABIL_RESOLVE } from "resources/ability-ids";
import { BUFF_ID_RESOLVE, BUFF_ID } from "resources/buff-ids";
import { Trigger, Unit } from "w3ts/index";
import { DynamicBuff } from "../dynamic-buff-type";
import { DummyCast } from "lib/dummy";
import { Action } from "lib/TreeLib/ActionQueue/Actions/Action";
import { Log } from "lib/serilog/serilog";
import { SmartTrigger } from "lib/SmartTrigger";

export const resolveMusic = new SoundRef("Music\\Behemoth (Remix).mp3", true, true);
Preload("Music\\Behemoth (Remix).mp3");

/**
 * Resolve is a buff applied to a unit
 * Can be applied multiple times and from multiple sources
 */
export class Resolve extends DynamicBuff {
    protected static DAMAGE_COUNTER_DURATION = 10;

    id = BUFF_ID.RESOLVE;

    private breathSound: SoundWithCooldown;
    private unit: Unit;
    protected doesStack = false;

    private checkForDespairBuffTicker: number = 0;

    private musicEnabled = false;
    private damageTrigger: Trigger;
    private damageCounter: number = Resolve.DAMAGE_COUNTER_DURATION;

    constructor(who: Unit) {
        super();

        this.breathSound = new SoundWithCooldown(10, "Sounds\\HeavyBreath.mp3");
        this.unit = who;
    }

    public process(gametime: number, delta: number): boolean {
        const result =  super.process(gametime, delta);
        if (!this.isActive) return result;
        
        // const currentHealth = GetUnitState(this.crewmember.unit, UNIT_STATE_LIFE);
        // const deltaHealth = currentHealth - this.prevUnitHealth;
        this.checkForDespairBuffTicker += delta

        if (this.checkForDespairBuffTicker >= 1) {
            this.checkForDespairBuffTicker = 0;
            if (!UnitHasBuffBJ(this.unit.handle, BUFF_ID_RESOLVE)) {
                // If we don't have another ticker apply the buff to the unit
                DummyCast((dummy: unit) => {
                    SetUnitX(dummy, this.unit.x);
                    SetUnitY(dummy, this.unit.y + 50);
                    IssueTargetOrder(dummy, "bloodlust", this.unit.handle);
                }, ABIL_RESOLVE);
            }
        }
        if (this.damageCounter > 0) {
            this.damageCounter -= delta;
            if (this.damageCounter <= 0) {
                // Stop combat music
                this.stopMusic();
            }
        }
        return result;
    }

    public onStatusChange(newStatus: boolean) {
        if (newStatus) {
            this.unit.addAbility(ABIL_ACCURACY_BONUS_30);
            this.damageCounter = Resolve.DAMAGE_COUNTER_DURATION;
            this.playMusic();
            // If we dont got the buff cast that bad boi
            if (!UnitHasBuffBJ(this.unit.handle, BUFF_ID_RESOLVE)) {
                // If we don't have another ticker apply the buff to the unit
                DummyCast((dummy: unit) => {
                    SetUnitX(dummy, this.unit.x);
                    SetUnitY(dummy, this.unit.y + 50);
                    IssueTargetOrder(dummy, "bloodlust", this.unit.handle);
                }, ABIL_RESOLVE);
            }

            // Add damage event listeners
            if (!this.damageTrigger) {
                this.damageTrigger = new SmartTrigger();
                this.damageTrigger.registerUnitEvent(this.unit, EVENT_UNIT_DAMAGING);
                this.damageTrigger.addAction(() => this.onResolveDamage());
            }
            else {
                Log.Error("Damage trigger already exists for unit! Please report this");
            }
        }
        else {
            this.unit.removeAbility(ABIL_ACCURACY_BONUS_30);
            // Also remove resolve buff
            UnitRemoveBuffBJ(BUFF_ID_RESOLVE, this.unit.handle);
            this.onChangeCallbacks.forEach(cb => cb(this));
            this.stopMusic();
            // remove damage event listeners
            if (this.damageTrigger) {
                this.damageTrigger.destroy();
                this.damageTrigger = undefined;
            }
            else {
                Log.Error("Damage trigger doesnt exist for unit! Please report this");
            }
        }
    }

    private onResolveDamage() {
        const damage = GetEventDamage();
        if (damage > 0) {
            const nDamage = damage * 0.7;
            BlzSetEventDamage(nDamage);
            this.damageCounter = Resolve.DAMAGE_COUNTER_DURATION;
            this.playMusic();
        }
    }

    private playMusic() {
        if (!this.musicEnabled) {
            this.musicEnabled = true;
            this.breathSound.setVolume(127);
            this.breathSound.playSoundForPlayer(this.unit.owner);
            resolveMusic.setVolume(45);
            resolveMusic.playSoundForPlayer(this.unit.owner);
        }
    }

    private stopMusic() {
        if (this.musicEnabled) {
            this.musicEnabled = false;
            // End music and sounds
            this.breathSound.stopSound();
            resolveMusic.stopSound();
            if (GetLocalPlayer() === this.unit.owner.handle) {
                SetMusicVolume(30);
            }
        }
    }
}