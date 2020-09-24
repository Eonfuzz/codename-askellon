import { MapPlayer } from "w3ts/index";
import { PlayerState } from "./player-type";
import { ForceType } from "./forces/force-type";
import { ChatHook } from "app/chat/chat-hook-type";
import { Hooks } from "lib/Hooks";
import { Crewmember } from "app/crewmember/crewmember-type";
import { Players } from "w3ts/globals/index";
import { Log } from "lib/serilog/serilog";

/**
 * A factory that stores all player data
 * Crewmember, Force etc
 */
export class PlayerStateFactory {
    private static instance: PlayerStateFactory;

    public static getInstance() {        
        if (this.instance == null) {
            this.instance = new PlayerStateFactory();
            Hooks.set(this.name, this.instance);
        }
        return this.instance;
    }

    private state = new Map<MapPlayer, PlayerState>();

    public isSnglePlayer = false;

    /**
     * Constructor
     */
    constructor() {
        const playerCount = Players.filter(p => {
            return p.controller === MAP_CONTROL_USER && p.slotState === PLAYER_SLOT_STATE_PLAYING;
        });
        
        // Log.Information("Player count: "+playerCount.length);
        this.isSnglePlayer = playerCount.length === 1;

        // Set alien AI colour to all be the same
        if (!this.isSnglePlayer) {
            PlayerStateFactory.getAlienAI().forEach(p => {
                p.color = PLAYER_COLOR_PURPLE;
            })
        }
        else {
            PlayerStateFactory.AlienAIPlayer1.name = "Alien 1";
            PlayerStateFactory.AlienAIPlayer2.name = "Alien 2";
            PlayerStateFactory.AlienAIPlayer3.name = "Alien 3";
        }

        // Disable player help messages
        Players.forEach(p => {
            Players.forEach(p2 => {
                SetPlayerAlliance(p.handle, p2.handle, ALLIANCE_HELP_REQUEST, false);
            });
        });
    }

    public get(who: MapPlayer) {
        if (this.state.has(who)) {
            return this.state.get(who);
        }
        else {
            const nState = new PlayerState(who);
            this.state.set(who, nState);
            return nState;
        }
    }

    // Forces
    public forces: Array<ForceType> = [];

    /**
     * Static API
     */
    public static get(who: MapPlayer) {
        return PlayerStateFactory.getInstance().get(who);
    }

    public static getCrewmember(who: MapPlayer): Crewmember | undefined {
        const pData = PlayerStateFactory.get(who);
        
        if (pData) {
            const crewmember = pData.getCrewmember();
            return crewmember;
        }
        return undefined;
    }

    public static getForce(forceName: string) {
        const instance = PlayerStateFactory.getInstance();
        return instance.forces.filter(f => f.is(forceName))[0];
    }
    // Players
    public static StationSecurity = MapPlayer.fromIndex(22);
    public static StationProperty = MapPlayer.fromIndex(21);
    public static UnknownPlayer = MapPlayer.fromIndex(23);

    public static AlienAIPlayer1 = MapPlayer.fromIndex(18);
    public static AlienAIPlayer2 = MapPlayer.fromIndex(19);
    public static AlienAIPlayer3 = MapPlayer.fromIndex(20);

    // Neutrals
    public static NeutralPassive = MapPlayer.fromIndex(PLAYER_NEUTRAL_PASSIVE);
    public static NeutralHostile = MapPlayer.fromIndex(PLAYER_NEUTRAL_AGGRESSIVE);


    /**
     * Run through the chat hook for a player's force
     * @param who 
     * @param hook 
     */
    public static doChat(hook: ChatHook) {
        const pData = PlayerStateFactory.get(hook.who);
        const force = pData.getForce();

        hook.recipients     = force.getChatRecipients(hook);
        hook.name           = force.getChatName(hook);
        hook.color          = force.getChatColor(hook);
        hook.sound          = force.getChatSoundRef(hook);
        // hook. = force.getChatTag(player);
        hook.message        = force.getChatMessage(hook);

        return hook;
    }

    /**
     * Returns true if the game is singleplayer
     */
    public static isSinglePlayer() {
        // return false;

        const instance = PlayerStateFactory.getInstance();
        return instance.isSnglePlayer;
    }

    public static isAlienAI(who: MapPlayer) {
        return who === this.AlienAIPlayer1 || who === this.AlienAIPlayer2 || who === this.AlienAIPlayer3;
    }

    public static getAlienAI() {
        return [this.AlienAIPlayer1, this.AlienAIPlayer2, this.AlienAIPlayer3];
    }
}