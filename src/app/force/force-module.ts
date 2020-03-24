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

export interface PlayerAggressionLog {
    // Unique identifier
    id: number,
    aggressor: player;
    defendant: player;
    // Time stamp must be in seconds
    timeStamp: number;
    // Duration must be in seconds
    remainingDuration: number;

    // The key of the aggressionLog
    key: string;
}

export class ForceModule {
    private forces: Array<ForceType> = [];

    private playerOriginalDetails = new Map<player, playerDetails>();
    private playerForceDetails = new Map<player, ForceType>();

    // new id for the next aggresison item
    private aggressionId = 0;
    // Key is ${p1}::${p2}
    private aggressionLog = new Map<string, PlayerAggressionLog[]>();
    private allAggressionLogs: PlayerAggressionLog[] = [];

    public neutralPassive: player;
    public neutralHostile: player;

    public stationSecurity: player;
    public stationProperty: player;
    public alienAIPlayer: player;

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
        this.stationSecurity = Player(23);
        this.stationProperty = Player(23);
        this.alienAIPlayer = Player(23);

        // Start aggression log ticker
        const ticker = new Trigger();
        // Check every second  
        ticker.RegisterTimerEventPeriodic(5);
        // Process the ticker
        ticker.AddAction(() => this.onAggressionTick(5));
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
        // Make them enemies
        SetPlayerAllianceStateAllyBJ(player1, player2, false);
        SetPlayerAllianceStateAllyBJ(player2, player1, false);

        // Add the log
        this.addAggressionLog(player1, player2);
    }

    /**
     * Adds an aggression log between two players
     * If they have no aggression between the two after the duration, they become allies again
     * @param player1 
     * @param player2 
     */
    private addAggressionLog(player1: player, player2: player) {
        const newItem = {
            id: this.aggressionId++,
            aggressor: player1,
            defendant: player2,
            timeStamp: this.game.getTimeStamp(),
            remainingDuration: 30,
            key: '',
        };
        newItem.key = this.getLogKey(player1, player2);

        const logs = this.aggressionLog.get(newItem.key) || [];
        logs.push(newItem);
        this.aggressionLog.set(newItem.key, logs);
        this.allAggressionLogs.push(newItem);
    }

    /**
     * Update aggression logs
     * If there are none remaining between players we re-ally them
     * @param delta 
     */
    private onAggressionTick(delta: number) {
        this.allAggressionLogs = this.allAggressionLogs.filter(instance => {
            const key = instance.key;
            instance.remainingDuration = instance.remainingDuration - delta;

            // Remove the instance if needed
            if (instance.remainingDuration <= 0) {
                // Okay we're removing the instance
                // Remove it from the combat logs
                const logs = this.aggressionLog.get(key) as PlayerAggressionLog[];

                const idx = logs.indexOf(instance);
                logs.splice(idx, 1);

                this.aggressionLog.set(key, logs);

                if (logs.length === 0) {
                    // We have no more combat instances between these two players
                    // Ally them
                    SetPlayerAllianceStateAllyBJ(instance.aggressor, instance.defendant, true);
                    SetPlayerAllianceStateAllyBJ(instance.defendant, instance.aggressor, true);
                }
                return false;
            }
            return true;
        });
    }

    private getLogKey(aggressor: player, defendant: player): string {
        const p1Id = GetPlayerId(aggressor);
        const p2Id = GetPlayerId(defendant);

        const sortP2First = p2Id < p1Id;
        return sortP2First ? `${p2Id}::${p1Id}` : `${p1Id}::${p2Id}`;
    }

    /**
     * Makes the player allied to everyone
     * @param forPlayer 
     */
    public repairAllAlliances(forPlayer: player) {
        // Clear aggression logs and repair all alliances
        let players = this.getActivePlayers();
        players.forEach(p => {
            const key = this.getLogKey(p, forPlayer);
            const instances = this.aggressionLog.get(key);
            if (instances) {
                this.aggressionLog.delete(key);

                // Filter it out of the aggression logs
                this.allAggressionLogs = this.allAggressionLogs.filter(x => instances.indexOf(x) == -1);

                SetPlayerAllianceStateAllyBJ(forPlayer, p, true);
                SetPlayerAllianceStateAllyBJ(p, forPlayer, true);
            }
        });

        // TODO Security to maintain aggression state
        SetPlayerAllianceStateAllyBJ(forPlayer, this.stationSecurity, true);
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
            count: 2
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
        let force = this.getForce(forceName);

        if (!force) {
            // Log.Error("Failed to add "+GetPlayerName(player)+" to force. Force not found:::"+forceName);
            force = this.getForceFromName(forceName);
        }

        this.playerForceDetails.set(player, force);
        force.addPlayer(player);
    }

    /**
     * Gets the player's force
     */
    public getPlayerForce(player: player) {
        return this.playerForceDetails.get(player);
    }
}
