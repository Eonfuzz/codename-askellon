import { Log } from "../../lib/serilog/serilog";
import { ForceType } from "./forces/force-type";
import { Trigger, MapPlayer, Timer, Unit } from "w3ts";
import { STR_OPT_CULT, STR_OPT_ALIEN, STR_OPT_HUMAN } from "resources/strings";
import { SoundRef } from "app/types/sound-ref";
import { Aggression } from "./alliance/aggression-type";
import { Entity } from "app/entity-type";
import { EventListener } from "app/events/event-type";
import { EVENT_TYPE } from "app/events/event-enum";
import { OptResult, OptSelection } from "./opt/opt-selection-factory";
import { GameTimeElapsed } from "app/types/game-time-elapsed";

// Entities and factories
import { EventEntity } from "app/events/event-entity";
import { PlayerStateFactory } from "./player-state-entity";
// Forces
import { OPT_TYPES } from "./opt/opt-types-enum";
import { CrewmemberForce } from "./forces/crewmember-force";
import { ObserverForce } from "./forces/observer-force";
import { CREW_FORCE_NAME, ALIEN_FORCE_NAME } from "./forces/force-names";
import { AlienForce } from "./forces/alien-force";
import { GetActivePlayers } from "lib/utils";
import { Hooks } from "lib/Hooks";

export interface playerDetails {
    name: string, colour: playercolor
};

export class ForceEntity extends Entity {
    private static instance: ForceEntity;

    public static getInstance() {        
        if (this.instance == null) {
            this.instance = new ForceEntity();
            Hooks.set(this.name, this.instance);
        }
        return this.instance;
    }

    _timerDelay = 5.0;

    // new id for the next aggresison item
    private aggressionId = 0;
    // Key is ${p1}::${p2}
    private aggressionLog = new Map<string, Aggression[]>();
    private allAggressionLogs: Aggression[] = [];

    constructor() {
        super();

        // Add main forces to force array
        PlayerStateFactory.getInstance().forces.push(new CrewmemberForce());
        // Add observer to forces
        PlayerStateFactory.getInstance().forces.push(new ObserverForce());

        // const ticker = new Trigger();
        // // Check every second  
        // ticker.registerTimerEvent(5, true);
        // // Process the ticker
        // ticker.addAction(() => this.onAggressionTick(5));


        // Init and listen for cond checks
        const eventEntity = EventEntity.getInstance();

        eventEntity.addListener(new EventListener(EVENT_TYPE.CHECK_VICTORY_CONDS, () => {
            this.checkVictoryConditions();
        }));


        // Init and listen for experience gain calls
        eventEntity.addListener(new EventListener(EVENT_TYPE.CREW_GAIN_EXPERIENCE, (self, data) => {
            const pData = PlayerStateFactory.get(data.source.owner);

            if (pData) {
                if (!data.data.value) Log.Error("Player gaining nil experience");
                pData.addExperience(data.data.value);
            }
        }))

        const players = GetActivePlayers();
        // Set up player leaves events
        

        const playerLeavesGameTrigger = new Trigger();
        players.forEach(player => playerLeavesGameTrigger.registerPlayerEvent(player, EVENT_PLAYER_LEAVE));
        playerLeavesGameTrigger.addAction(() => this.playerLeavesGame(MapPlayer.fromHandle(GetTriggerPlayer())))
    }

    /**
     * Handles aggression between two players
     * default behaviour sets players as enemies
     * @param player1 
     * @param player2 
     */
    public aggressionBetweenTwoPlayers(player1: MapPlayer, player2: MapPlayer) {
        const validAggression = this.addAggressionLog(player1, player2)
        // Add the log
        if (validAggression) {
            // Make them enemies
            player1.setAlliance(player2, ALLIANCE_PASSIVE, false);
            player2.setAlliance(player1, ALLIANCE_PASSIVE, false);
        }
        return validAggression;
    }

    /**
     * Adds an aggression log between two players
     * If they have no aggression between the two after the duration, they become allies again
     * @param player1 
     * @param player2 
     * @returns boolean if aggression was allowed
     */
    private addAggressionLog(player1: MapPlayer, player2: MapPlayer): boolean {
        // We can never have tracked aggression against aliens
        if (player2 === PlayerStateFactory.AlienAIPlayer) return true;
        // You cannot be aggressive against yourself
        if (player1 === player2) return false;
        // You cannot be aggressive against Neutral Hostile
        if (player2 === PlayerStateFactory.NeutralHostile) return true;

        const aggressionKey = this.getLogKey(player1, player2);
        
        // Only care about force logic if we aren't already hostiles
        if (!this.aggressionLog.has(aggressionKey)) {
            // Now check force logic
            const attackerForce = PlayerStateFactory.get(player1).getForce();
            const aggressionValid = attackerForce.aggressionIsValid(player1, player2);
            // If the force says this aint valid, well it aint valid
            if (!aggressionValid) return false;
        }

        const newItem = {
            id: this.aggressionId++,
            aggressor: player1,
            defendant: player2,
            timeStamp: GameTimeElapsed.getTime(),
            remainingDuration: 30,
            key: aggressionKey
        };

        const logs = this.aggressionLog.get(newItem.key) || [];
        logs.push(newItem);
        this.aggressionLog.set(newItem.key, logs);
        this.allAggressionLogs.push(newItem);

        return true;
    }

    /**
     * Update aggression logs
     * If there are none remaining between players we re-ally them
     */
    step() {
        PlayerStateFactory.getInstance().forces.forEach(force => force.onTick(this._timerDelay));
        if (this.allAggressionLogs.length === 0) return;

        const nextTickLogs = [];

        for (let index = 0; index < this.allAggressionLogs.length; index++) {
            const instance = this.allAggressionLogs[index];
            
            const key = instance.key;
            instance.remainingDuration = instance.remainingDuration - this._timerDelay;

            // Remove the instance if needed
            if (instance.remainingDuration <= 0) {
                // Okay we're removing the instance
                // Remove it from the combat logs
                const logs = this.aggressionLog.get(key) as Aggression[];

                const idx = logs.indexOf(instance);
                logs.splice(idx, 1);

                this.aggressionLog.set(key, logs);

                if (logs.length === 0) {
                    // We have no more combat instances between these two players
                    // Ally them
                    instance.aggressor.setAlliance(instance.defendant, ALLIANCE_PASSIVE, true);
                    instance.defendant.setAlliance(instance.aggressor, ALLIANCE_PASSIVE, true);
                    // Delete it from aggression log
                    this.aggressionLog.delete(key);
                }
            }
            else {
                nextTickLogs.push(instance);
            }
        }

        this.allAggressionLogs = nextTickLogs;
        // Log.Information("Aggression Tick!");
    }

    private getLogKey(aggressor: MapPlayer, defendant: MapPlayer): string {
        const p1Id = aggressor.id;
        const p2Id = defendant.id;

        const sortP2First = p2Id < p1Id;
        return sortP2First ? `${p2Id}::${p1Id}` : `${p1Id}::${p2Id}`;
    }

    /**
     * Makes the player allied to everyone
     * @param forPlayer 
     */
    public repairAllAlliances(forPlayer: MapPlayer) {
        // Log.Information("Repairing Alliance!");
        // Clear aggression logs and repair all alliances
        let players = GetActivePlayers();
        players.forEach(p => {
            const key = this.getLogKey(p, forPlayer);
            const instances = this.aggressionLog.get(key);
            if (instances) {
                this.aggressionLog.delete(key);

                // Filter it out of the aggression logs
                this.allAggressionLogs = this.allAggressionLogs.filter(x => instances.indexOf(x) == -1);

                forPlayer.setAlliance(p, ALLIANCE_PASSIVE, true);
                p.setAlliance(forPlayer, ALLIANCE_PASSIVE, true);
            }
        });

        // TODO Security to maintain aggression state
        forPlayer.setAlliance(PlayerStateFactory.StationSecurity, ALLIANCE_PASSIVE, true);
    }

    /**
     * Checks victory conditions of all forces
     * returns a force if it is the only winning force
     */
    public checkVictoryConditions(): ForceType | undefined {
        // has only one force one?
        const winningForces = PlayerStateFactory.getInstance().forces.filter(f => f.checkVictoryConditions());

        if (winningForces.length === 1) {
            const winningSound = new SoundRef("Sound\\Interface\\NewTournament.flac", false);
            const losingSound = new SoundRef("Sound\\Dialogue\\UndeadExpCamp\\Undead02x\\L02Balnazzar06.flac", false);

            const winner = winningForces[0];
            const winningPlayers = winner.getPlayers();
            

            if (winningPlayers.indexOf(MapPlayer.fromLocal()) >= 0) {
                winningSound.playSound();
            }
            else {
                losingSound.playSound();
            }

            // TODO
            Log.Information("The "+winner.name+" wins but I haven't finished coding it");
        }
        else if (winningForces.length === 0) { 
            const drawSound = new SoundRef("Sound\\Dialogue\\Extra\\KelThuzadDeath1.flac", false);
            drawSound.playSound();

            // TODO
            Log.Information("Game is a draw but I haven't finished coding it");
        }
        return winningForces.length === 1 ? winningForces[0] : undefined;
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
        let force = PlayerStateFactory.getForce(name);
        if (!force) {
            switch(name) {
                case ALIEN_FORCE_NAME:
                    force = new AlienForce(); 
                    break;
                case CREW_FORCE_NAME: 
                default:
                    force = new CrewmemberForce(); 
                    break;
            }
            PlayerStateFactory.getInstance().forces.push(force);
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
        optSelection.askPlayerOpts();

        // Start a 15 second timer
        const timer = CreateTimer();
        StartTimerBJ(timer, false, GetActivePlayers().length > 1 ? 16 : 0.1);

        const timerTrig = new Trigger();

        const timerDialog = CreateTimerDialog(timer);
        TimerDialogDisplay(timerDialog, true);

        timerTrig.registerTimerExpireEvent(timer);
        timerTrig.addAction(() => {
            TimerDialogDisplay(timerDialog, false);
            const results = optSelection.endOptSelection();
            callback(results);
        });
    }


    /**
     * Sets the player's force
     * @param player 
     * @param forceName 
     */
    public addPlayerToForce(player: MapPlayer, forceName: string) {
        let force = PlayerStateFactory.getForce(forceName);

        if (!force) {
            // Log.Error("Failed to add "+GetPlayerName(player)+" to force. Force not found:::"+forceName);
            force = this.getForceFromName(forceName);
        }

        PlayerStateFactory.get(player).setForce(force);
        force.addPlayer(player);
    }
    
    /**
     * When player leaves the game
     * @param who 
     */
    private playerLeavesGame(who: MapPlayer) {
        const playerLeaveSound = new SoundRef('Sound\\Interface\\QuestFailed.flac', false);
        playerLeaveSound.playSound();

        // Kill all units they woned
        const allUnits = GetUnitsOfPlayerAll(who.handle);

        ForGroup(allUnits, () => {
            const u = GetEnumUnit();
            KillUnit(u);
        });

        PlayerStateFactory.get(who).getForce().removePlayer(who);
    }
}
