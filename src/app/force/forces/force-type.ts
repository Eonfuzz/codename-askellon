import { Log } from "../../../lib/serilog/serilog";
import { Crewmember } from "app/crewmember/crewmember-type";
import { PLAYER_COLOR } from "lib/translators";
import { SoundWithCooldown } from "app/types/sound-ref";
import { MapPlayer, Unit, Trigger } from "w3ts";
import { VISION_TYPE } from "app/vision/vision-type";
import { EventEntity } from "app/events/event-entity";
import { VisionFactory } from "app/vision/vision-factory";
import { EVENT_TYPE } from "app/events/event-enum";
import { ChatHook } from "app/chat/chat-hook-type";
import { PlayerStateFactory } from "../player-state-entity";


export const GENERIC_CHAT_SOUND_REF = new SoundWithCooldown(3, 'Sounds\\RadioChatter.mp3', true);
export abstract class ForceType {
    // Keep track of players in force
    protected players: Array<MapPlayer> = [];
    protected playerUnits: Map<MapPlayer, Crewmember> = new Map();
    protected playerDeathTriggers: Map<MapPlayer, Trigger> = new Map();

    abstract name: string;
    
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

    public addPlayerMainUnit(whichUnit: Crewmember, player: MapPlayer): void {
        const trig = new Trigger();
        trig.registerUnitEvent(whichUnit.unit, EVENT_UNIT_DEATH);
        trig.addAction(() => this.removePlayerMainUnit(whichUnit, player, Unit.fromHandle(GetKillingUnit() || GetDyingUnit())));

        this.playerUnits.set(player, whichUnit);
        this.playerDeathTriggers.set(player, trig);
        VisionFactory.getInstance().setPlayervision(player, VISION_TYPE.HUMAN);
    };

    public removePlayerMainUnit(whichUnit: Crewmember, player: MapPlayer, killer?: Unit): void {
        this.playerDeathTriggers.get(player).destroy();
        this.playerDeathTriggers.delete(player);

        this.playerUnits.delete(player);
    };

    /**
     * Checks the victory conditions of this force
     * Returns true if victory conditions are met
     */
    abstract checkVictoryConditions(): boolean;

    /**
     * Does nothing by default
     * @param game 
     * @param whichUnit 
     * @param whichPlayer 
     * @param amount 
     */
    public onUnitGainsXp(whichUnit: Crewmember, newTotal: number) {
        let levelBefore = whichUnit.unit.level;

        // Just apply the xp earned
        whichUnit.unit.suspendExperience(false);
        whichUnit.unit.setExperience(MathRound(newTotal), false);
        whichUnit.unit.suspendExperience(true);

        if (levelBefore !== whichUnit.unit.level) {
            EventEntity.getInstance().sendEvent(EVENT_TYPE.HERO_LEVEL_UP, { source: whichUnit.unit, crewmember: whichUnit });
        }
    }

    public getChatMessage(chatEvent: ChatHook): string {
        return chatEvent.message;
    }

    /**
     * Gets a list of who can see the chat messages
     * Unless overridden returns all the players
     */
    public getChatRecipients(chatEvent: ChatHook) {
        return chatEvent.recipients;
    }

    /**
     * Gets the player's visible chat name, by default shows role name
     */
    public getChatName(chatEvent: ChatHook): string {
        const crew = PlayerStateFactory.get(chatEvent.who).getCrewmember();
        if (crew)
            return crew.name;
        else {
            Log.Error("Failed to get crew name for "+chatEvent.who.name);
            return "Missing Crew Name";
        }
    }

    /**
     * Return's a players chat colour
     * @param who 
     */
    public getChatColor(chatEvent: ChatHook): string {
        return PLAYER_COLOR[chatEvent.who.id];
    }

    /**
     * Returns the sound to be used on chat events
     * @param who
     */
    public getChatSoundRef(chatEvent: ChatHook): SoundWithCooldown {
        return GENERIC_CHAT_SOUND_REF;
    }

    /**
     * Returns the chat tag, by default it will be null
     */
    public getChatTag(chatEvent: ChatHook): string | undefined { return; }


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