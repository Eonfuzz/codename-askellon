/** @noSelfInFile **/
import { Game } from "../game";
import { BuffInstance, DynamicBuff } from "./buff-instance";
import { Crewmember } from "../crewmember/crewmember-type";
import { TimedEvent } from "../types/timed-event";
import { SoundWithCooldown, SoundRef } from "../types/sound-ref";
import { Log } from "../../lib/serilog/serilog";
import { ABIL_ACCURACY_BONUS_30, ABIL_RESOLVE } from "resources/ability-ids";
import { BUFF_ID_RESOLVE, BUFF_ID } from "resources/buff-ids";
import { Unit } from "w3ts/index";

export const resolveMusic = new SoundRef("Music\\KavinskyRampage.mp3", true, true);
Preload("Music\\KavinskyRampage.mp3");

/**
 * Resolve is a buff applied to a unit
 * Can be applied multiple times and from multiple sources
 */
export class Resolve extends DynamicBuff {
    id = BUFF_ID.RESOLVE;
    name = 'resolve';

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

    public process(game: Game, delta: number): boolean {
        const result =  super.process(game, delta);
        if (!this.isActive) return result;
        
        // const currentHealth = GetUnitState(this.crewmember.unit, UNIT_STATE_LIFE);
        // const deltaHealth = currentHealth - this.prevUnitHealth;
        this.checkForDespairBuffTicker += delta

        if (this.checkForDespairBuffTicker >= 1) {
            this.checkForDespairBuffTicker = 0;
            if (!UnitHasBuffBJ(this.unit.handle, BUFF_ID_RESOLVE)) {
                // If we don't have another ticker apply the buff to the unit
                game.useDummyFor((dummy: unit) => {
                    SetUnitX(dummy, this.unit.x);
                    SetUnitY(dummy, this.unit.y + 50);
                    IssueTargetOrder(dummy, "bloodlust", this.unit.handle);
                }, ABIL_RESOLVE);
            }
        }
        return result;
    }

    public onStatusChange(game: Game, newStatus: boolean) {
        if (newStatus) {
            this.unit.addAbility(ABIL_ACCURACY_BONUS_30);
            resolveMusic.setVolume(15);
            if (GetLocalPlayer() === this.unit.owner.handle) {
                SetMusicVolume(0);
                this.breathSound.playSound();
                resolveMusic.playSound();
            }

            // If we dont got the buff cast that bad boi
            if (!UnitHasBuffBJ(this.unit.handle, BUFF_ID_RESOLVE)) {
                // If we don't have another ticker apply the buff to the unit
                game.useDummyFor((dummy: unit) => {
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
            if (GetLocalPlayer() === this.unit.owner.handle) {
                this.breathSound.stopSound();
                resolveMusic.stopSound();
                SetMusicVolume(30);
            }
        }
    }
}