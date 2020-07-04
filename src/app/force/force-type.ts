/** @noSelfInFile **/
import { Game } from "../game";
import { Log } from "../../lib/serilog/serilog";
import { ForceModule } from "./force-module";
import { Crewmember } from "app/crewmember/crewmember-type";
import { PLAYER_COLOR } from "lib/translators";
import { SoundRef, SoundWithCooldown } from "app/types/sound-ref";
import { MapPlayer, Unit, Trigger } from "w3ts";
import { EVENT_TYPE } from "app/events/event";


const GENERIC_CHAT_SOUND_REF = new SoundWithCooldown(3, 'Sounds\\RadioChatter.mp3');
export abstract class ForceType {
    // Keep track of players in force
    protected players: Array<MapPlayer> = [];
    protected playerUnits: Map<MapPlayer, Crewmember> = new Map();
    protected playerDeathTriggers: Map<MapPlayer, Trigger> = new Map();

    protected forceModule: ForceModule;
    abstract name: string;
    
    constructor(fModule: ForceModule) { 
        this.forceModule = fModule;
    }

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

    public addPlayerMainUnit(game: Game, whichUnit: Crewmember, player: MapPlayer): void {
        const trig = new Trigger();
        trig.registerUnitEvent(whichUnit.unit, EVENT_UNIT_DEATH);
        trig.addAction(() => this.removePlayerMainUnit(game, whichUnit, player, Unit.fromHandle(GetKillingUnit() || GetDyingUnit())));

        this.playerUnits.set(player, whichUnit);
        this.playerDeathTriggers.set(player, trig);
    };

    public removePlayerMainUnit(game: Game, whichUnit: Crewmember, player: MapPlayer, killer?: Unit): void {
        this.playerDeathTriggers.get(player).destroy();
        this.playerDeathTriggers.delete(player);

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
    public onUnitGainsXp(game: Game, whichUnit: Crewmember, newTotal: number) {
        let levelBefore = whichUnit.unit.level;

        // Just apply the xp earned
        whichUnit.unit.suspendExperience(false);
        whichUnit.unit.setExperience(MathRound(newTotal), true);
        whichUnit.unit.suspendExperience(true);

        if (levelBefore !== whichUnit.unit.level) {
            game.event.sendEvent(EVENT_TYPE.HERO_LEVEL_UP, { source: whichUnit.unit, crewmember: whichUnit });
        }
    }

    public getChatMessage(who: MapPlayer, oldString: string): string {
        return oldString;
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
        const pData = this.forceModule.getPlayerDetails(who);
        const crew = pData.getCrewmember();
        if (crew)
            return crew.name;
        else {
            Log.Error("Failed to get crew name for "+who.name);
            Log.Error("P Data: "+(pData.player ? pData.player.name : "p data no player!"));
            return "Missing Crew Name";
        }
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
    public getChatSoundRef(who: MapPlayer): SoundWithCooldown {
        return GENERIC_CHAT_SOUND_REF;
    }

    /**
     * Returns the chat tag, by default it will be null
     */
    public getChatTag(who: MapPlayer): string | undefined { return; }


    /**
     * Returns true if the aggression is valid
     * used by force
     * by default returns true
     * @param aggressor 
     * @param defendant 
     */
    public aggressionIsValid(aggressor: MapPlayer, defendant: MapPlayer): boolean {
        return true;
    }


    /**
     * Does this force do anything on tick
     * @param delta 
     */
    public onTick(delta: number) {

    }
}