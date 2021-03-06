import { SoundWithCooldown, SoundRef } from "../../types/sound-ref";
import { ABIL_ACCURACY_BONUS_30, ABIL_RESOLVE } from "resources/ability-ids";
import { BUFF_ID_RESOLVE, BUFF_ID } from "resources/buff-ids";
import { Unit } from "w3ts/index";
import { DynamicBuff } from "../dynamic-buff-type";
import { DummyCast } from "lib/dummy";

export const resolveMusic = new SoundRef("Music\\Behemoth (Remix).mp3", true, true);
Preload("Music\\Behemoth (Remix).mp3");

/**
 * Resolve is a buff applied to a unit
 * Can be applied multiple times and from multiple sources
 */
export class Resolve extends DynamicBuff {
    id = BUFF_ID.RESOLVE;
    private breathSound: SoundWithCooldown;

    private unit: Unit;
    private prevUnitHealth: number;
    protected doesStack = false;

    private checkForDespairBuffTicker: number = 0;

    constructor(who: Unit) {
        super();

        this.breathSound = new SoundWithCooldown(10, "Sounds\\HeavyBreath.mp3");

        this.unit = who;
        this.prevUnitHealth = this.unit.getState(UNIT_STATE_LIFE);
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
        return result;
    }

    public onStatusChange(newStatus: boolean) {
        if (newStatus) {
            this.unit.addAbility(ABIL_ACCURACY_BONUS_30);

            this.breathSound.setVolume(127);
            this.breathSound.playSoundForPlayer(this.unit.owner);
            resolveMusic.setVolume(45);
            resolveMusic.playSoundForPlayer(this.unit.owner);

            // If we dont got the buff cast that bad boi
            if (!UnitHasBuffBJ(this.unit.handle, BUFF_ID_RESOLVE)) {
                // If we don't have another ticker apply the buff to the unit
                DummyCast((dummy: unit) => {
                    SetUnitX(dummy, this.unit.x);
                    SetUnitY(dummy, this.unit.y + 50);
                    IssueTargetOrder(dummy, "bloodlust", this.unit.handle);
                }, ABIL_RESOLVE);
            }
        }
        else {
            this.unit.removeAbility(ABIL_ACCURACY_BONUS_30);
            // Also remove resolve buff
            UnitRemoveBuffBJ(BUFF_ID_RESOLVE, this.unit.handle);
            this.onChangeCallbacks.forEach(cb => cb(this));

            // End music and sounds
            this.breathSound.stopSound();
            resolveMusic.stopSound();
            if (GetLocalPlayer() === this.unit.owner.handle) {
                SetMusicVolume(30);
            }
        }
    }
}