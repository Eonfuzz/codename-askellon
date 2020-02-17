/** @noSelfInFile **/
import { Game } from "../game";
import { Log } from "../../lib/serilog/serilog";
import { ForceType } from "./force-type";
import { CrewmemberForce, CREW_FORCE_NAME } from "./crewmember-force";
import { AlienForce, ALIEN_FORCE_NAME } from "./alien-force";
import { ObserverForce } from "./observer-force";
import { Trigger } from "app/types/jass-overrides/trigger";
import { COL_VENTS, COL_GOOD, COL_BAD } from "resources/colours";
import { OptSelection, OPT_TYPES } from "./opt-selection";
import { STR_OPT_CULT, STR_OPT_ALIEN, STR_OPT_HUMAN } from "resources/strings";

export class ForceModule {
    public forces: Array<ForceType> = [];

    public neutralPassive: player;
    public neutralHostile: player;

    constructor(game: Game) {
        // Add main forces to force array
        this.forces.push(new CrewmemberForce());
        // Add observer to forces
        this.forces.push(new ObserverForce());

        this.neutralPassive = Player(22);
        this.neutralHostile = Player(23);
    }

    /**
     * Handles aggression between two players
     * default behaviour sets players as enemies
     * @param player1 
     * @param player2 
     */
    public aggressionBetweenTwoPlayers(player1: player, player2: player) {
        Log.Information(`Player aggression between ${GetPlayerName(player1)} and ${GetPlayerName(player2)}`);
        // TODO
        // For now just force them as enemies
        SetPlayerAllianceStateAllyBJ(player1, player2, false);
        SetPlayerAllianceStateAllyBJ(player2, player1, false);
        // TODO
        // Wait 30 seconds
        // Re-ally
    }

    /**
     * Checks victory conditions of all forces
     * returns a force if it is the only winning force
     */
    public checkVictoryConditions(): ForceType | undefined {
        // has only one force one?
        const winningForces = this.forces.filter(f => f.checkVictoryConditions(this));
        return winningForces.length === 1 ? winningForces[0] : undefined;
    }

    /**
     * Returns a list of active players
     */
    public getActivePlayers(): Array<player> {
        const result = [];
        for (let i = 0; i < GetBJMaxPlayerSlots(); i ++) {
            const currentPlayer = Player(i);
            const isPlaying = GetPlayerSlotState(currentPlayer) == PLAYER_SLOT_STATE_PLAYING;
            const isUser = GetPlayerController(currentPlayer) == MAP_CONTROL_USER;
            if (isPlaying && isUser) {
                result.push(Player(i));
            }
        }
        return result;
    }

    /**
     * Gets a force under a name ID
     * @param whichForce 
     */
    public getForce(whichForce: string): ForceType | undefined {
        return this.forces.filter(f => f.is(whichForce))[0];
    }

    /**
     * Gets the player opts
     */
    public getOpts() {
        const optSelection = new OptSelection({
            isRequired: false,
            text: STR_OPT_HUMAN,
            hotkey: "h",
            type: OPT_TYPES.PROTAGANIST,
            chanceToExist: 100,
        });

        // Add alien
        optSelection.addOpt({
            isRequired: true,
            text: STR_OPT_ALIEN,
            hotkey: "a",
            type: OPT_TYPES.ANTAGONST,
            chanceToExist: 100,
            count: 1
        });

        // Add Cultist
        optSelection.addOpt({
            isRequired: true,
            text: STR_OPT_CULT,
            hotkey: "a",
            type: OPT_TYPES.NEUTRAL,
            chanceToExist: 30,
        });


        // TODO
        // Go through and increase player chance?? Maybe.

        // Now ask for opts
        optSelection.askPlayerOpts(this);
    }
}
