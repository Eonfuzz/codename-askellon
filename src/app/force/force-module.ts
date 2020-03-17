/** @noSelfInFile **/
import { Game } from "../game";
import { Log } from "../../lib/serilog/serilog";
import { ForceType } from "./force-type";
import { CrewmemberForce, CREW_FORCE_NAME } from "./crewmember-force";
import { AlienForce, ALIEN_FORCE_NAME } from "./alien-force";
import { ObserverForce } from "./observer-force";
import { Trigger } from "app/types/jass-overrides/trigger";
import { COL_VENTS, COL_GOOD, COL_BAD } from "resources/colours";
import { OptSelection, OPT_TYPES, OptSelectOption, OptResult } from "./opt-selection";
import { STR_OPT_CULT, STR_OPT_ALIEN, STR_OPT_HUMAN } from "resources/strings";

export interface playerDetails {
    name: string, colour: playercolor
};

export class ForceModule {
    private forces: Array<ForceType> = [];

    private playerOriginalDetails = new Map<player, playerDetails>();
    private playerForceDetails = new Map<player, ForceType>();

    public neutralPassive: player;
    public neutralHostile: player;
    public game: Game;

    constructor(game: Game) {
        this.game = game;

        // set original player details
        this.getActivePlayers().forEach(p => {
            this.playerOriginalDetails.set(p, {
                name: GetPlayerName(p),
                colour: GetPlayerColor(p)
            });
        });

        // Add main forces to force array
        this.forces.push(new CrewmemberForce(this));
        // Add observer to forces
        this.forces.push(new ObserverForce(this));

        this.neutralPassive = Player(22);
        this.neutralHostile = Player(23);
    }


    public getOriginalPlayerDetails(who: player) {
        return this.playerOriginalDetails.get(who);
    }
    
    /**
     * Handles aggression between two players
     * default behaviour sets players as enemies
     * @param player1 
     * @param player2 
     */
    public aggressionBetweenTwoPlayers(player1: player, player2: player) {
        // Log.Information(`Player aggression between ${GetPlayerName(player1)} and ${GetPlayerName(player2)}`);
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
                result.push(currentPlayer);
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

    public getForces() {
        return this.forces;
    }


    /**
     * Initialises forces
     * @param opts 
     */
    public initForcesFor(opts: OptResult[]) {
        opts.forEach(opt => this.addPlayerToForce(opt.player, opt.role.name));
    }

    /**
     * Gets the force based on name
     * Will create a new force if it doesnt exist already
     * @param name 
     */
    private getForceFromName(name: string) {
        let force = this.getForce(name);
        if (!force) {
            switch(name) {
                case ALIEN_FORCE_NAME:
                    force = new AlienForce(this); 
                    break;
                case CREW_FORCE_NAME: 
                default:
                    force = new CrewmemberForce(this); 
                    break;
            }
            this.forces.push(force);
        }
        return force;
    }

    /**
     * Gets the player opts
     */
    public getOpts(callback: (optSelection: OptResult[]) => void) {
        const optSelection = new OptSelection({
            name: CREW_FORCE_NAME,
            isRequired: false,
            text: STR_OPT_HUMAN,
            hotkey: "h",
            type: OPT_TYPES.PROTAGANIST,
            chanceToExist: 100,
        });

        // Add alien
        optSelection.addOpt({
            name: ALIEN_FORCE_NAME,
            isRequired: true,
            text: STR_OPT_ALIEN,
            hotkey: "a",
            type: OPT_TYPES.ANTAGONST,
            chanceToExist: 100,
            count: 1
        });
        // Now ask for opts
        optSelection.askPlayerOpts(this);

        // Start a 15 second timer
        const timer = CreateTimer();
        StartTimerBJ(timer, false, this.getActivePlayers().length > 1 ? 15 : 1);

        const timerTrig = new Trigger();

        const timerDialog = CreateTimerDialog(timer);
        TimerDialogDisplay(timerDialog, true);

        timerTrig.RegisterTimerExpire(timer);
        timerTrig.AddAction(() => {
            TimerDialogDisplay(timerDialog, false);
            const results = optSelection.endOptSelection(this);
            callback(results);
        });
    }


    /**
     * Sets the player's force
     * @param player 
     * @param forceName 
     */
    public addPlayerToForce(player: player, forceName: string) {
        const force = this.getForce(forceName);

        if (!force) Log.Error("Failed to add "+GetPlayerName(player)+" to force. Force not found:::"+forceName);
        else {
            this.playerForceDetails.set(player, force);
            force.addPlayer(player);
        }
    }

    /**
     * Gets the player's force
     */
    public getPlayerForce(player: player) {
        return this.playerForceDetails.get(player);
    }
}
