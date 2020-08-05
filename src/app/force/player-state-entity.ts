import { MapPlayer } from "w3ts/index";
import { PlayerState } from "./player-type";

/**
 * A factory that stores all player data
 * Crewmember, Force etc
 */
export class PlayerStateFactory {
    private static instance: PlayerStateFactory;

    public static getInstance() {        
        if (this.instance == null) {
            this.instance = new PlayerStateFactory();
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


    /**
     * Static API
     */
    public static get(who: MapPlayer) {
        return PlayerStateFactory.getInstance().get(who);
    }

    public static StationSecurity = MapPlayer.fromIndex(22);
    public static StationProperty = MapPlayer.fromIndex(21);
    public static UnknownPlayer = MapPlayer.fromIndex(23);

    public static AlienAIPlayer = MapPlayer.fromIndex(20);

    // Neutrals
    public static NeutralPassive = MapPlayer.fromIndex(PLAYER_NEUTRAL_PASSIVE);
    public static NeutralHostile = MapPlayer.fromIndex(PLAYER_NEUTRAL_AGGRESSIVE);
}