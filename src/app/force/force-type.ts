/** @noSelfInFile **/
import { Game } from "../game";
import { Log } from "../../lib/serilog/serilog";
import { ForceModule } from "./force-module";
import { Crewmember } from "app/crewmember/crewmember-type";
import { PLAYER_COLOR } from "lib/translators";
import { SoundRef } from "app/types/sound-ref";
import { MapPlayer, Unit, Trigger } from "w3ts";


const GENERIC_CHAT_SOUND_REF = new SoundRef('Sound/ChatSound', false);
export abstract class ForceType {
    // Keep track of players in force
    protected players: Array<MapPlayer> = [];
    protected playerUnits: Map<MapPlayer, Unit> = new Map();

    protected forceModule: ForceModule;
    abstract name: string;
    
    constructor(fModule: ForceModule) { this.forceModule = fModule; }

    is(name: string): boolean {
        return this.name === name;
    }

    hasPlayer(who: MapPlayer): boolean {
        return this.players.indexOf(who) >= 0;
    }

    getPlayers() {
        return this.players
    }

    addPlayer(who: MapPlayer) {
        this.players.push(who);
    }

    removePlayer(who: MapPlayer) {
        const idx = this.players.indexOf(who);

        if (idx >= 0) {
            this.players.splice(idx, 1);
        }
    }

    public addPlayerMainUnit(game: Game, whichUnit: Unit, player: MapPlayer): void {
        this.playerUnits.set(player, whichUnit);
    };

    public removePlayerMainUnit(game: Game, whichUnit: Unit, player: MapPlayer): void {
        this.playerUnits.delete(player);
    };

    /**
     * Checks the victory conditions of this force
     * Returns true if victory conditions are met
     */
    abstract checkVictoryConditions(forceModule: ForceModule): boolean;

    /**
     * Does nothing by default
     * @param game 
     * @param whichUnit 
     * @param whichPlayer 
     * @param amount 
     */
    public onUnitGainsXp(game: Game, whichUnit: Crewmember, amount: number) {
        // Just apply the xp earned
        whichUnit.unit.suspendExperience(false);
        whichUnit.unit.addExperience(MathRound(amount), true);
        whichUnit.unit.suspendExperience(true);
    }

    /**
     * Updates the forces tooltip
     * does nothing by default
     * @param game 
     * @param whichUnit 
     * @param whichPlayer 
     */
    public updateForceTooltip(game: Game, whichUnit: Crewmember) {

    }

    /**
     * Gets a list of who can see the chat messages
     * Unless overridden returns all the players
     */
    public getChatRecipients(sendingPlayer: MapPlayer) {
        return this.forceModule.getActivePlayers();
    }

    /**
     * Gets the player's visible chat name, by default shows role name
     */
    public getChatName(who: MapPlayer): string {
        const crew = this.forceModule.game.crewModule.getCrewmemberForPlayer(who);
        if (crew)
            return crew.name;
        else
            return "Missing Crew Name";
    }

    /**
     * Return's a players chat colour
     * @param who 
     */
    public getChatColor(who: MapPlayer): string {
        return PLAYER_COLOR[who.id];
    }

    /**
     * Returns the sound to be used on chat events
     * @param who
     */
    public getChatSoundRef(who: MapPlayer): SoundRef {
        return GENERIC_CHAT_SOUND_REF;
    }

    /**
     * Returns the chat tag, by default it will be null
     */
    public getChatTag(who: MapPlayer): string | undefined { return; }
}