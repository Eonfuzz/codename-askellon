import { MapPlayer } from "w3ts/index";
import { PlayerState } from "./player-type";
import { ForceType } from "./forces/force-type";
import { ChatHook } from "app/chat/chat-hook-type";
import { Hooks } from "lib/Hooks";

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

    public static getForce(forceName: string) {
        const instance = PlayerStateFactory.getInstance();
        return instance.forces.filter(f => f.is(forceName))[0];
    }
    // Players
    public static StationSecurity = MapPlayer.fromIndex(22);
    public static StationProperty = MapPlayer.fromIndex(21);
    public static UnknownPlayer = MapPlayer.fromIndex(23);

    public static AlienAIPlayer = MapPlayer.fromIndex(20);

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
}