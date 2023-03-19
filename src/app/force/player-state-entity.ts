import { MapPlayer } from "w3ts/index";
import { PlayerState } from "./player-type";
import { ForceType } from "./forces/force-type";
import { ChatHook } from "app/chat/chat-hook-type";
import { Hooks } from "lib/Hooks";
import { Crewmember } from "app/crewmember/crewmember-type";
import { Players } from "w3ts/globals/index";
import { ROLE_TYPES } from "resources/crewmember-names";
import { Entity } from "app/entity-type";
import { MessageAllPlayers } from "lib/utils";

/**
 * A factory that stores all player data
 * Crewmember, Force etc
 */
export class PlayerStateFactory extends Entity {
    private static instance: PlayerStateFactory;

    public static getInstance() {        
        if (this.instance == null) {
            this.instance = new PlayerStateFactory();
            Hooks.set(this.name, this.instance);
        }
        return this.instance;
    }

    private state = new Map<number, PlayerState>();

    public isSnglePlayer = false;
    public playerCount = 0;
    // Are players targeted?
    private securityTargetState = new Map<number, boolean>();

    _timerDelay = 50;
    

    /**
     * Constructor
     */
    constructor() {
        super();

        const playerCount = Players.filter(p => {
            return p.controller === MAP_CONTROL_USER && p.slotState === PLAYER_SLOT_STATE_PLAYING;
        });
        
        // Log.Information("Player count: "+playerCount.length);
        // this.isSnglePlayer = false; 
        this.isSnglePlayer = playerCount.length === 1;
        this.playerCount = playerCount.length;

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

    step(): void {}

    public get(who: number): PlayerState {
        if (!who) return;

        
        // MessageAllPlayers(`${who}`);

        const inState = this.state.get(who);
        if (inState) {
            return inState;
        }
        
        if (!PlayerStateFactory.isValidPlayerById(who)) {
            return;
        }
        else {
            const nState = new PlayerState(MapPlayer.fromIndex(who));
            this.state.set(who, nState);
            return nState;
        }
    }

    // Forces
    public forces: Array<ForceType> = [];

    /**
     * Static API
     */
    public static get(who: number | MapPlayer): PlayerState {
        return PlayerStateFactory.getInstance().get(
            type(who) === 'number' 
            ? (who as number) 
            : (who as MapPlayer).id
        );
    }

    public static getCrewmember(who: number): Crewmember | undefined 
    public static getCrewmember(who: MapPlayer): Crewmember | undefined 
    public static getCrewmember(who: number | MapPlayer): Crewmember | undefined {
        const pData = PlayerStateFactory.get(type(who) === 'number' 
            ? (who as number) 
            : (who as MapPlayer).id
        );
        
        if (pData) {
            const crewmember = pData.getCrewmember();
            return crewmember;
        }
        return undefined;
    }

    public static getForce(forceName: string) {
        {
        const instance = PlayerStateFactory.getInstance();
        for (let index = 0; index < instance.forces.length; index++) {
            const force = instance.forces[index];
            if (force && force.is(forceName)) {
                return force;
            } 
        }
        }
    }
    // Players
    public static StationProperty = MapPlayer.fromIndex(21);
    public static StationSecurity = MapPlayer.fromIndex(22);
    public static UnknownPlayer = MapPlayer.fromIndex(23);

    public static CultistAIPlayer = MapPlayer.fromIndex(17);

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
        const pData = PlayerStateFactory.get(hook.who.id);
        const force = pData.getForce();

        hook.recipients     = force.getChatRecipients(hook);
        hook.name           = force.getChatName(hook);
        hook.color          = force.getChatColor(hook);
        hook.sound          = force.getChatSoundRef(hook);
        hook.chatTag        = force.getChatTag(hook);
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

    /**
     * Returns true if the game is singleplayer
     */
    public static allowWIP() {
        return MapPlayer.fromIndex(1).name === "Eonfuzz#1988";
    }

    public static isAlienAI(who: MapPlayer) {
        if (who === PlayerStateFactory.AlienAIPlayer1) return true;
        if (who === PlayerStateFactory.AlienAIPlayer2) return true;
        if (who === PlayerStateFactory.AlienAIPlayer3) return true;
        return false;
    }

    public static isAlienAIById(who: number) {
        return who === PlayerStateFactory.AlienAIPlayer1.id || who === PlayerStateFactory.AlienAIPlayer2.id  || who === PlayerStateFactory.AlienAIPlayer3.id;
    }

    public static getAlienAI() {
        return [PlayerStateFactory.AlienAIPlayer1, PlayerStateFactory.AlienAIPlayer2, PlayerStateFactory.AlienAIPlayer3];
    }

    public static isTargeted(who: MapPlayer) {
        return PlayerStateFactory.getInstance().securityTargetState.get(who.id);
    }

    public static setTargeted(who: MapPlayer, to: boolean) {
        PlayerStateFactory.getInstance().securityTargetState.set(who.id, to);
    }

    public static getCrewOfRole(role: ROLE_TYPES): Crewmember[] {
        let result = [];
        Players.forEach(p => {
            const crew = PlayerStateFactory.getCrewmember(p.id);
            if (crew && crew.role === role) result.push(crew);
        });
        return result;
    }

    public static isValidPlayerById(who: number) {
        if (PlayerStateFactory.isAlienAIById(who)) return false;
        if (who === PlayerStateFactory.CultistAIPlayer.id) return false;
        if (who === PlayerStateFactory.NeutralHostile.id) return false;
        if (who === PlayerStateFactory.NeutralPassive.id) return false;
        if (who === PlayerStateFactory.UnknownPlayer.id) return false;
        if (who === PlayerStateFactory.StationProperty.id) return false;
        if (who === PlayerStateFactory.StationSecurity.id) return false;
        return true;
    }

    public static isValidPlayer(who: MapPlayer) {
        return PlayerStateFactory.isValidPlayerById(who.id);
    }

    public static getPlayers(): MapPlayer[] {
        return Players.filter(p => PlayerStateFactory.isValidPlayer(p));
    }
}