/** @noSelfInFile **/
import { Game } from "../game";
import { BuffInstance, DynamicBuff } from "./buff-instance";
import { Crewmember } from "../crewmember/crewmember-type";
import { TimedEvent } from "../types/timed-event";
import { SoundWithCooldown, SoundRef } from "../types/sound-ref";
import { Log } from "../../lib/serilog/serilog";
import { ABIL_ACCURACY_BONUS_30 } from "resources/ability-ids";

const RESOLVE_ABILITY_ID = FourCC('A007');
const RESOLVE_BUFF_ID = FourCC('B001');

/**
 * Resolve is a buff applied to a unit
 * Can be applied multiple times and from multiple sources
 */
export class Resolve extends DynamicBuff {
    name = 'resolve';

    private breathSound: SoundWithCooldown;
    private resolveMusic: SoundRef;

    private crewmember: Crewmember;
    private prevUnitHealth: number;

    private checkForDespairBuffTicker: number = 0;

    constructor(game: Game, crewmember: Crewmember) {
        super();

        this.breathSound = new SoundWithCooldown(10, "Sounds\\HeavyBreath.mp3");
        this.resolveMusic = new SoundRef("Music\\KavinskyRampage.mp3", true);

        this.crewmember = crewmember;
        this.prevUnitHealth = this.crewmember.unit.getState(UNIT_STATE_LIFE);
    }

    public process(game: Game, delta: number): boolean {
        const result =  super.process(game, delta);
        if (!this.isActive) return result;
        
        // const currentHealth = GetUnitState(this.crewmember.unit, UNIT_STATE_LIFE);
        // const deltaHealth = currentHealth - this.prevUnitHealth;
        this.checkForDespairBuffTicker += delta

        if (this.checkForDespairBuffTicker >= 1) {
            this.checkForDespairBuffTicker = 0;
            if (!UnitHasBuffBJ(this.crewmember.unit.handle, RESOLVE_BUFF_ID)) {
                // If we don't have another ticker apply the buff to the unit
                game.useDummyFor((dummy: unit) => {
                    SetUnitX(dummy, this.crewmember.unit.x);
                    SetUnitY(dummy, this.crewmember.unit.y + 50);
                    IssueTargetOrder(dummy, "bloodlust", this.crewmember.unit.handle);
                }, RESOLVE_ABILITY_ID);
            }
        }
        return result;
    }

    public onStatusChange(game: Game, newStatus: boolean) {
        if (newStatus) {
            this.crewmember.unit.addAbility(ABIL_ACCURACY_BONUS_30);
            this.resolveMusic.setVolume(15);
            if (GetLocalPlayer() === this.crewmember.player.handle) {
                SetMusicVolume(0);
                this.breathSound.playSound();
                this.resolveMusic.playSound();
            }

            // If we dont got the buff cast that bad boi
            if (!UnitHasBuffBJ(this.crewmember.unit.handle, RESOLVE_BUFF_ID)) {
                // If we don't have another ticker apply the buff to the unit
                game.useDummyFor((dummy: unit) => {
                    SetUnitX(dummy, this.crewmember.unit.x);
                    SetUnitY(dummy, this.crewmember.unit.y + 50);
                    IssueTargetOrder(dummy, "bloodlust", this.crewmember.unit.handle);
                }, RESOLVE_ABILITY_ID);
            }
        }
        else {
            this.crewmember.unit.removeAbility(ABIL_ACCURACY_BONUS_30);
            // Also remove resolve buff
            UnitRemoveBuffBJ(RESOLVE_BUFF_ID, this.crewmember.unit.handle);
            this.onChangeCallbacks.forEach(cb => cb(this));

            // End music and sounds
            if (GetLocalPlayer() === this.crewmember.player.handle) {
                this.breathSound.stopSound();
                this.resolveMusic.stopSound();
                SetMusicVolume(30);
            }
        }
    }
}