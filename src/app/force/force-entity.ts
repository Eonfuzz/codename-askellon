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
import { ChatEntity } from "app/chat/chat-entity";
import { Players } from "w3ts/globals/index";
import { PLAYER_COLOR } from "lib/translators";
import { Timers } from "app/timer-type";
import { PlayerState } from "./player-type";

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

        // Init and listen for experience gain calls
        eventEntity.addListener(new EventListener(EVENT_TYPE.CREW_BECOMES_ALIEN, (self, data) => this.repairAllAlliances(data.source.owner)));
        eventEntity.addListener(new EventListener(EVENT_TYPE.ALIEN_TRANSFORM_CREW, (self, data) => this.repairAllAlliances(data.source.owner)));
        eventEntity.addListener(new EventListener(EVENT_TYPE.CREW_TRANSFORM_ALIEN, (self, data) => this.repairAllAlliances(data.source.owner)));

        const players = GetActivePlayers();
        // Set up player leaves events
        

        const playerLeavesGameTrigger = new Trigger();
        players.forEach(player => playerLeavesGameTrigger.registerPlayerEvent(player, EVENT_PLAYER_LEAVE));
        playerLeavesGameTrigger.addAction(() => this.playerLeavesGame(MapPlayer.fromHandle(GetTriggerPlayer())));

        eventEntity.addListener(new EventListener(EVENT_TYPE.STATION_SECURITY_TARGETED_PLAYER, (self, data) => 
            this.setPlayerSecurityTargetState(data.data.who, true)));
    
        eventEntity.addListener(new EventListener(EVENT_TYPE.STATION_SECURITY_UNTARGETED_PLAYER, (self, data) => 
            this.setPlayerSecurityTargetState(data.data.who, false)));
    }

    /**
     * Can two players aggress upon each other?
     * used to stop teamkilling
     * will return an aggression key (string) if valid
     * @param player1 
     * @param player2 
     */
    public canFight(player1: MapPlayer, player2: MapPlayer) : boolean | string {
        if (player1 === PlayerStateFactory.StationSecurity) return true;
        // We can never have tracked aggression against aliens
        if (PlayerStateFactory.isAlienAI(player2)) return true;
        if (PlayerStateFactory.isAlienAI(player1)) return true;
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
        return aggressionKey;
    }

    /**
     * Adds an aggression log between two players
     * If they have no aggression between the two after the duration, they become allies again
     * @param player1 
     * @param player2 
     * @returns boolean if aggression was allowed
     */
    private addAggressionLog(player1: MapPlayer, player2: MapPlayer): boolean {
        const key = this.canFight(player1, player2);
        if (key === false) return false;
        // Dont alter alliances if you're attacking alien or neutral hostile
        if (key === true) return true;

        const newItem = {
            id: this.aggressionId++,
            aggressor: player1,
            defendant: player2,
            timeStamp: GameTimeElapsed.getTime(),
            remainingDuration: 30,
            key: key
        };

        const logs = this.aggressionLog.get(newItem.key) || [];
        logs.push(newItem);
        this.aggressionLog.set(newItem.key, logs);
        this.allAggressionLogs.push(newItem);

        return true;
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
            if (player1 !== PlayerStateFactory.StationSecurity) {
                player1.setAlliance(player2, ALLIANCE_PASSIVE, false);
            }

            // If player 2 is Security, NEVER make them hostile
            if (player2 !== PlayerStateFactory.StationSecurity) {
                player2.setAlliance(player1, ALLIANCE_PASSIVE, false);
            }
        }
        return validAggression;
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
                    // If the defendant is station security, we need to make sure we ARE targeted
                    if (instance.defendant !== PlayerStateFactory.StationSecurity || !PlayerStateFactory.isTargeted(instance.aggressor)) {
                        // We have no more combat instances between these two players
                        // Ally them
    
                        instance.aggressor.setAlliance(instance.defendant, ALLIANCE_PASSIVE, true);
                        instance.defendant.setAlliance(instance.aggressor, ALLIANCE_PASSIVE, true);
                        // Delete it from aggression log

                    }
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

    private setPlayerSecurityTargetState(who: MapPlayer, isTargeted: boolean) {
        PlayerStateFactory.setTargeted(who, isTargeted);

        // If we target, make them hostile
        if (isTargeted) {
            PlayerStateFactory.StationSecurity.setAlliance(who, ALLIANCE_PASSIVE, false);
            who.setAlliance(PlayerStateFactory.StationSecurity, ALLIANCE_PASSIVE, false);
        }
        // Otherwise make them allied
        else {
            PlayerStateFactory.StationSecurity.setAlliance(who, ALLIANCE_PASSIVE, true);
            who.setAlliance(PlayerStateFactory.StationSecurity, ALLIANCE_PASSIVE, true);
        }
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

        // Handle player being targeted
        const isTargeted = PlayerStateFactory.isTargeted(forPlayer);

        // If we are targeted, make them hostile
        if (isTargeted) {
            PlayerStateFactory.StationSecurity.setAlliance(forPlayer, ALLIANCE_PASSIVE, false);
            forPlayer.setAlliance(PlayerStateFactory.StationSecurity, ALLIANCE_PASSIVE, false);
        }
        // Otherwise make them allied
        else {
            PlayerStateFactory.StationSecurity.setAlliance(forPlayer, ALLIANCE_PASSIVE, true);
            forPlayer.setAlliance(PlayerStateFactory.StationSecurity, ALLIANCE_PASSIVE, true);
        }
    }

    /**
     * Checks victory conditions of all forces
     * returns a force if it is the only winning force
     */
    public checkVictoryConditions(): ForceType | undefined {
        // has only one force one?
        const winningForces = PlayerStateFactory.getInstance().forces.filter(f => f.checkVictoryConditions());

        if (winningForces.length === 1) {
            const winningSound = new SoundRef("Sound\\Interface\\NewTournament.flac", false, true);
            const losingSound = new SoundRef("Sound\\Dialogue\\UndeadExpCamp\\Undead02x\\L02Balnazzar06.flac", false, true);

            const winner = winningForces[0];
            const winningPlayers = winner.getPlayers();
            

            Timers.addSlowTimedAction(15, () => {
                if (winningPlayers.indexOf(MapPlayer.fromLocal()) >= 0) {
                    winningSound.playSound();
                }
                else {
                    losingSound.playSound();
                }

                Timers.addSlowTimedAction(3, () => {
                    winningPlayers.forEach(winner => {
                        CustomVictoryBJ(winner.handle, true, true);
                    });
                    Timers.addSlowTimedAction(1, () => {
                        Players.forEach(p => {
                            if (winner.name === ALIEN_FORCE_NAME)
                                CustomDefeatBJ(p.handle, "The Askellon is doomed");
                            else
                                CustomDefeatBJ(p.handle, "The last alien has been slain!");
                        });
                    });
                });
            });
        }
        else if (winningForces.length === 0) { 
            const drawSound = new SoundRef("Sound\\Dialogue\\Extra\\KelThuzadDeath1.flac", false, true);
            drawSound.playSound();
            Timers.addSlowTimedAction(5, () => {
                // Log.Information("Slow timed!");
                Players.forEach(player => {
                    // Log.Information("Defeat for all!");
                    CustomDefeatBJ(player.handle, "Draw, Everyone is dead!");
                });
            });
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
        if (PlayerStateFactory.isSinglePlayer())
            StartTimerBJ(timer, false, 0);
        else
            StartTimerBJ(timer, false, 16);

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
        const playerLeaveSound = new SoundRef('Sound\\Interface\\QuestFailed.flac', false, true);
        playerLeaveSound.playSound();

        Players.forEach(player => {
            ChatEntity.getInstance().postSystemMessage(player, `|cff${PLAYER_COLOR[who.id]}${PlayerStateFactory.get(who).originalName}|r has left the game!`);            
        });

        // Kill all units they woned
        const allUnits = GetUnitsOfPlayerAll(who.handle);

        ForGroup(allUnits, () => {
            const u = GetEnumUnit();
            KillUnit(u);
        });

        PlayerStateFactory.get(who).getForce().removePlayer(who);
    }

    public startIntroduction() {
        Players.forEach(player => {
            const pData = PlayerStateFactory.get(player);
            if (pData) {
                const force = pData.getForce();
                if (force) {
                    force.introduction(player);
                }
            }
        })
    }
}
