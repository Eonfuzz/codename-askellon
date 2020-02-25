/** @noSelfInFile **/
import { Game } from "../game";
import { BuffInstance, DynamicBuff } from "./buff-instance";
import { Crewmember } from "../crewmember/crewmember-type";
import { TimedEvent } from "../types/timed-event";
import { SoundWithCooldown, SoundRef } from "../types/sound-ref";
import { Log } from "../../lib/serilog/serilog";
import { ABIL_ACCURACY_PENALTY_30 } from "resources/ability-ids";
import { ALIEN_FORCE_NAME, AlienForce } from "app/force/alien-force";

const DESPAIR_ABILITY_ID = FourCC('A00D');
const DESPAIR_BUFF_ID = FourCC('B004');

/**
 * Resolve is a buff applied to a unit
 * Can be applied multiple times and from multiple sources
 */
export class Despair extends DynamicBuff {
    

    private jumpScareSound: SoundWithCooldown;
    private despairMusic: SoundRef;

    private crewmember: Crewmember;
    private prevUnitHealth: number;

    private checkForDespairBuffTicker: number = 0;

    constructor(game: Game, crewmember: Crewmember) {
        super();
        
        this.jumpScareSound = new SoundWithCooldown(10, "Sounds\\HeavyBreath.mp3");
        this.despairMusic = new SoundRef("Music\\FlightIntoTheUnkown.mp3", true);
        this.despairMusic.setVolume(127);

        this.crewmember = crewmember;
        this.prevUnitHealth = GetUnitState(this.crewmember.unit, UNIT_STATE_LIFE);
    }

    public process(game: Game, delta: number): boolean {
        const result =  super.process(game, delta);
        if (!this.isActive) return result;
        
        const currentHealth = GetUnitState(this.crewmember.unit, UNIT_STATE_LIFE);
        const deltaHealth = currentHealth - this.prevUnitHealth;
        this.checkForDespairBuffTicker += delta

        // If the unit has gained health reduce it by 50%
        if (deltaHealth > 0) {
            SetUnitState(this.crewmember.unit, UNIT_STATE_LIFE, currentHealth - deltaHealth/2);
        }
        if (this.checkForDespairBuffTicker >= 1) {
            this.checkForDespairBuffTicker = 0;
            if (!UnitHasBuffBJ(this.crewmember.unit, DESPAIR_BUFF_ID)) {
                // If we don't have another ticker apply the buff to the unit
                game.useDummyFor((self: any, dummy: unit) => {
                    SetUnitX(dummy, GetUnitX(this.crewmember.unit));
                    SetUnitY(dummy, GetUnitY(this.crewmember.unit) + 50);
                    IssueTargetOrder(dummy, "faeriefire", this.crewmember.unit);
                }, DESPAIR_ABILITY_ID);
            }
        }
        return result;
    }

    public onStatusChange(game: Game, newStatus: boolean) {
        if (newStatus) {
            UnitAddAbility(this.crewmember.unit, ABIL_ACCURACY_PENALTY_30);
            this.despairMusic.setVolume(127);
            if (GetLocalPlayer() === this.crewmember.player) {
                StopMusic(true);
                this.despairMusic.playSound();
                this.jumpScareSound.playSound();
            }

            // If we dont got the buff cast that bad boi
            if (!UnitHasBuffBJ(this.crewmember.unit, DESPAIR_BUFF_ID)) {
                // If we don't have another ticker apply the buff to the unit
                game.useDummyFor((self: any, dummy: unit) => {
                    SetUnitX(dummy, GetUnitX(this.crewmember.unit));
                    SetUnitY(dummy, GetUnitY(this.crewmember.unit) + 50);
                    IssueTargetOrder(dummy, "faeriefire", this.crewmember.unit);
                }, DESPAIR_ABILITY_ID);
            }

            // Add unit visibility
            const alienForce = game.forceModule.getForce(ALIEN_FORCE_NAME) as AlienForce;
            const players = alienForce.getPlayers();
            players.forEach(p => UnitShareVision(this.crewmember.unit, p, true));
        }
        else {
            UnitRemoveAbility(this.crewmember.unit, ABIL_ACCURACY_PENALTY_30);

            // Also remove resolve buff
            UnitRemoveBuffBJ(DESPAIR_BUFF_ID, this.crewmember.unit);
            this.onChangeCallbacks.forEach(cb => cb(this));

            // End music and sounds
            if (GetLocalPlayer() === this.crewmember.player) {
                this.despairMusic.stopSound();
                this.jumpScareSound.stopSound();
                ResumeMusic();
            }

            // Remove unit visibility
            const alienForce = game.forceModule.getForce(ALIEN_FORCE_NAME) as AlienForce;
            const players = alienForce.getPlayers();
            players.forEach(p => UnitShareVision(this.crewmember.unit, p, false));
        }
    }
}