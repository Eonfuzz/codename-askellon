/** @noSelfInFile **/
import { Game } from "../game";
import { BuffInstance, DynamicBuff } from "./buff-instance";
import { Crewmember } from "../crewmember/crewmember-type";
import { TimedEvent } from "../types/timed-event";
import { SoundWithCooldown, SoundRef } from "../types/sound-ref";
import { Log } from "../../lib/serilog/serilog";

const RESOLVE_ABILITY_ID = FourCC('A007');
const RESOLVE_BUFF_ID = FourCC('B001');

/**
 * Resolve is a buff applied to a unit
 * Can be applied multiple times and from multiple sources
 */
export class Resolve extends DynamicBuff {
    private breathSound: SoundWithCooldown;
    private resolveMusic: SoundRef;

    private crewmember: Crewmember;

    constructor(game: Game, crewmember: Crewmember) {
        super();

        this.breathSound = new SoundWithCooldown(10, "Sounds\\HeavyBreath.mp3");
        this.resolveMusic = new SoundRef("Music\\KavinskyRampage.mp3", true);

        this.crewmember = crewmember;
    }


    public onStatusChange(game: Game, newStatus: boolean) {
        if (newStatus) {
            this.resolveMusic.setVolume(15);
            if (GetLocalPlayer() === this.crewmember.player) {
                StopMusic(true);
                this.breathSound.playSound();
                this.resolveMusic.playSound();
            }

            // If we dont got the buff cast that bad boi
            if (!UnitHasBuffBJ(this.crewmember.unit, RESOLVE_BUFF_ID)) {
                // If we don't have another ticker apply the buff to the unit
                game.useDummyFor((self: any, dummy: unit) => {
                    SetUnitX(dummy, GetUnitX(this.crewmember.unit));
                    SetUnitY(dummy, GetUnitY(this.crewmember.unit) + 50);
                    IssueTargetOrder(dummy, "bloodlust", this.crewmember.unit);
                }, RESOLVE_ABILITY_ID);
            }
        }
        else {
            // Also remove resolve buff
            UnitRemoveBuffBJ(RESOLVE_BUFF_ID, this.crewmember.unit);
            this.onChangeCallbacks.forEach(cb => cb(this));

            // End music and sounds
            if (GetLocalPlayer() === this.crewmember.player) {
                this.breathSound.stopSound();
                this.resolveMusic.stopSound();
                ResumeMusic();
            }
        }
    }
}