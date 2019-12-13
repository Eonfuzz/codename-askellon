/** @noSelfInFile **/
import { Game } from "../game";
import { BuffInstance } from "./buff-instance";
import { Crewmember } from "../crewmember/crewmember-type";
import { TimedEvent } from "../types/timed-event";
import { SoundWithCooldown, SoundRef } from "../types/sound-ref";
import { Log } from "../../lib/serilog/serilog";

const RESOLVE_ABILITY_ID = FourCC('A008');

/**
 * Resolve is a buff applied to a unit
 * Can be applied multiple times and from multiple sources
 */
export class Resolve {
    
    private onChangeCallbacks: Array<Function>;
    private doChangeCallbacks: Array<Function>;

    private buttonHighlight: commandbuttoneffect | undefined;

    private currentTicker: string | undefined;


    private breathSound: SoundWithCooldown;
    private resolveMusic: SoundRef;

    private isActive: boolean = false;
    private unit: unit;

    constructor(game: Game, crewmember: Crewmember) {
        this.onChangeCallbacks = [];
        this.doChangeCallbacks = [];

        this.breathSound = new SoundWithCooldown(10, "Sounds\\HeavyBreath.mp3");
        this.resolveMusic = new SoundRef("Music\\KavinskyRampage.mp3", true);

        this.unit = crewmember.unit;

        this.onChangeCallbacks.push(() => this.onStatusChange(game, crewmember));
    }


    public createResolve(game: Game, crewmember: Crewmember, instance: BuffInstance) {
        const wasActive = this.isActive;
        this.isActive = true;

        if (!instance.startTimeStamp) {
            instance.startTimeStamp = game.getTimeStamp();
        }

        if (!wasActive) {
            this.onChangeCallbacks.forEach(cb => cb(this));
        }

        // Now add
        let hasLongerTicker = false;
        if (this.currentTicker) {
            const ticker = game.timedEventQueue.GetEvent(this.currentTicker);
            if (ticker) {
                const newEndTime = (instance.startTimeStamp + instance.duration);
                const oldEndTime = (game.timedEventQueue.GetEventExpireTime(ticker) - 1);

                hasLongerTicker = newEndTime < oldEndTime;
                if (!hasLongerTicker) {
                    game.timedEventQueue.RemoveEvent(this.currentTicker);
                }
            }
        }
        else {
            // If we don't have another ticker apply the buff to the unit
            game.useDummyFor((self: any, dummy: unit) => {
                SetUnitX(dummy, GetUnitX(this.unit));
                SetUnitY(dummy, GetUnitY(this.unit));
                IssueTargetOrder(dummy, "bloodlust", crewmember.unit);
            }, FourCC('A007'));
        }

        if (!hasLongerTicker) {
            // Now register an event
            this.currentTicker = game.timedEventQueue.AddEvent(new TimedEvent(() => {
                // Just check if we are active upon expiration
                this.updateActiveState(game);
                return true;
            }, instance.duration * 1000, false));
        }
    }

    public onChange(callback: Function) {
        this.onChangeCallbacks.push(callback);
    }

    public doChange(callback: Function) {
        this.doChangeCallbacks.push(callback);
    }

    private onStatusChange(game: Game, crewmember: Crewmember) {
        const isActive = this.isActive;
        if (isActive) {
            this.resolveMusic.setVolume(15);

            this.buttonHighlight = CreateCommandButtonEffect(RESOLVE_ABILITY_ID, "entangle");
            if (GetLocalPlayer() === crewmember.player) {
                this.resolveMusic.playSound();
                this.breathSound.playSound();
                StopMusic(true);
            }
            else {
                DestroyCommandButtonEffect(this.buttonHighlight);
            }
        }
        else {
            if (GetLocalPlayer() === crewmember.player) {
                this.resolveMusic.stopSound();
                this.breathSound.stopSound();
                ResumeMusic();
                if (this.buttonHighlight) DestroyCommandButtonEffect(this.buttonHighlight);
            }
        }
    }
    
    /**
     * Checks if resolve is active
     * Will COMPARE against game time. Avoid this when possible
     * @param game 
     */
    public updateActiveState(game: Game): void {
        const wasActive = this.isActive;
        const isNowActive = wasActive && this.doChangeCallbacks.filter(cb => cb(this)).length > 0;
        
        this.isActive = isNowActive;
        if (wasActive !== isNowActive) {
            // Also remove resolve buff
            UnitRemoveBuffBJ(FourCC('B001'), this.unit);
            this.onChangeCallbacks.forEach(cb => cb(this));
        } 
    }

    /**
     * Checks if this is active WITHOUT checking against time
     * Use this whenever possible
     */
    public isActiveNoCheck(): Boolean {
        return this.isActive;
    }
}