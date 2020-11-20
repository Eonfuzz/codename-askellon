import { Log } from "../../../lib/serilog/serilog";
import { Crewmember } from "app/crewmember/crewmember-type";
import { PLAYER_COLOR, PlayNewSound } from "lib/translators";
import { SoundWithCooldown, SoundRef } from "app/types/sound-ref";
import { MapPlayer, Unit, Trigger } from "w3ts";
import { VISION_TYPE } from "app/vision/vision-type";
import { EventEntity } from "app/events/event-entity";
import { VisionFactory } from "app/vision/vision-factory";
import { EVENT_TYPE } from "app/events/event-enum";
import { ChatHook } from "app/chat/chat-hook-type";
import { PlayerStateFactory } from "../player-state-entity";
import { COL_GOLD } from "resources/colours";
import { EventListener } from "app/events/event-type";
import { ChatEntity } from "app/chat/chat-entity";
import { MessageAllPlayers, MessagePlayer } from "lib/utils";
import { ROLE_DESCRIPTIONS } from "resources/crewmember-names";


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
        // Log.Information(`Adding ${who.name} to ${this.name}`);
        this.players.push(who);
    }

    public addPlayerMainUnit(whichUnit: Crewmember, player: MapPlayer): void {
        const trig = new Trigger();
        trig.registerUnitEvent(whichUnit.unit, EVENT_UNIT_DEATH);
        trig.addAction(() => this.removePlayer(player, Unit.fromHandle(GetKillingUnit() || GetDyingUnit())));

        this.playerUnits.set(player, whichUnit);
        this.playerDeathTriggers.set(player, trig);
        VisionFactory.getInstance().setPlayervision(player, VISION_TYPE.HUMAN);
    };

    /**
     * Removes the player from the force entirely
     * @param player 
     * @param killer 
     */
    public removePlayer(player: MapPlayer, killer: Unit = undefined) {
        const idx = this.players.indexOf(player);

        if (idx >= 0) {
            this.players.splice(idx, 1);
            this.playerDeathTriggers.get(player).destroy();
            this.playerDeathTriggers.delete(player);
            this.playerUnits.delete(player);

            // Check victory conds
            EventEntity.getInstance().sendEvent(EVENT_TYPE.CHECK_VICTORY_CONDS);
        }
        else {
            Log.Error(`${player.name} is already removed from force ${this.name}`);
        }

    }

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
            this.onPlayerLevelUp(whichUnit.unit.owner, whichUnit.unit.level);
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
     * Returns the player's currently "active" unit
     */
    public getActiveUnitFor(who: MapPlayer) {
        return this.playerUnits.has(who) && this.playerUnits.get(who).unit;
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
        const percent = delta / 60;
        this.players.forEach(p => {
            
            const details = PlayerStateFactory.get(p);
            const crew = details.getCrewmember();

            if (crew && crew.unit.isAlive()) {
                const calculatedIncome = MathRound(percent * crew.getIncome());
                crew.player.setState(
                    PLAYER_STATE_RESOURCE_GOLD, 
                    crew.player.getState(PLAYER_STATE_RESOURCE_GOLD) + calculatedIncome
                );

                // Also reward passive experience points
                crew.addExperience( 200 * percent );
            }
        })
    }

    /**
     * 
     * @param who 
     */
    private introSound = new SoundRef("Sounds\\ComplexBeep.mp3", false, true);
    public introduction(who: MapPlayer) {
        const pData = PlayerStateFactory.get(who);
        const crew = pData.getCrewmember();

        if (GetLocalPlayer() === who.handle) {
            this.introSound.playSound();
            MessagePlayer(who, `${COL_GOLD}Your Role |r`+crew.role);
            MessagePlayer(who, ROLE_DESCRIPTIONS.get(crew.role));
        }
    }

    protected onPlayerLevelUp(who: MapPlayer, level: number) {
        ChatEntity.getInstance().postSystemMessage(who, `|rLevel up! ${COL_GOLD}+30 Income|r`);
    }


    public onDealDamage(who: MapPlayer, target: MapPlayer, damagingUnit: unit, damagedUnit: unit) {}
    public onTakeDamage(who: MapPlayer, attacker: MapPlayer, damagedUnit: unit, damagingUnit: unit) {}
}