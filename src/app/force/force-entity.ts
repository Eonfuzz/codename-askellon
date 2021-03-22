import { Log } from "../../lib/serilog/serilog";
import { ForceType } from "./forces/force-type";
import { Trigger, MapPlayer, Timer, Unit, playerColors, Force } from "w3ts";
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
import { CREW_FORCE_NAME, ALIEN_FORCE_NAME, OBSERVER_FORCE_NAME, CULT_FORCE_NAME } from "./forces/force-names";
import { AlienForce } from "./forces/alien-force";
import { GetActivePlayers, MessageAllPlayers, MessagePlayer } from "lib/utils";
import { Hooks } from "lib/Hooks";
import { ChatEntity } from "app/chat/chat-entity";
import { Players } from "w3ts/globals/index";
import { Timers } from "app/timer-type";
import { PlayerState } from "./player-type";
import { CultistForce } from "./forces/cultist/cultist-force";
import { COL_ALIEN, COL_ATTATCH, COL_GOOD } from "resources/colours";

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

    _timerDelay = 0.3;

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

            
        // this.alienTakesDamageTrigger.addAction(() => this.onAlienTakesDamage());
        const forceTakesOrDealsDamage = new Trigger();
        forceTakesOrDealsDamage.registerAnyUnitEvent(EVENT_PLAYER_UNIT_DAMAGING);
        forceTakesOrDealsDamage.addAction(() => this.onForceTakeOrDealDamage(
            GetEventDamageSource(),
            BlzGetEventDamageTarget()
        ));

        /**
         * Now try to load in all the players
         */
        players.forEach(p => {
            const pData = PlayerStateFactory.get(p);
            if (pData) {
                pData.load(() => {
                    const crew = pData.getCrewmember();
                    if (crew) {
                        EventEntity.send(EVENT_TYPE.WEAPON_MODE_CHANGE, { 
                            source: undefined, 
                            crewmember: crew, 
                            data: { mode: pData.getAttackType() }
                        });
                    }
                });
            }
        });
    }

    public onForceTakeOrDealDamage(damagingUnit: unit, damagedUnit: unit) {
        const damagingPlayer = MapPlayer.fromHandle(GetOwningPlayer(damagingUnit));
        const damagedPlayer = MapPlayer.fromHandle(GetOwningPlayer(damagedUnit));

        const p1Data = PlayerStateFactory.get(damagingPlayer);
        const p2Data = PlayerStateFactory.get(damagedPlayer);

        if (p2Data && p2Data.getForce()) p2Data.getForce().onTakeDamage(damagedPlayer, damagingPlayer, damagedUnit, damagingUnit);
        if (p1Data && p1Data.getForce()) p1Data.getForce().onDealDamage(damagingPlayer, damagedPlayer, damagingUnit, damagedUnit);
    }

    /**
     * Can two players aggress upon each other?
     * used to stop teamkilling
     * will return an aggression key (string) if valid
     * @param player1 
     * @param player2 
     */
    public canFight(player1: MapPlayer, player2: MapPlayer) : boolean | string {
        // Aggression is always OK by security
        if (player1 === PlayerStateFactory.StationSecurity) return true;
        // We can never have tracked aggression against aliens
        if (PlayerStateFactory.isAlienAI(player2)) return true;
        if (PlayerStateFactory.isAlienAI(player1)) {
            const defenderPData = PlayerStateFactory.get(player2);
            const defenderForce = defenderPData ? defenderPData.getForce() : undefined;

            if (!defenderForce) return true;
            else if (defenderForce.is(ALIEN_FORCE_NAME) && (defenderForce as AlienForce).isPlayerTransformed(player2)) return false;
            return true;
        }
        // You cannot be aggressive against yourself
        if (player1 === player2) return false;
        // You cannot be aggressive against Neutral Hostile
        if (player2 === PlayerStateFactory.NeutralHostile) return true;
        if (player2 === PlayerStateFactory.NeutralPassive) return true;

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
                    
                    // Ensure we are not trying to ally between targeted players and security
                    // This is aggression of security vs player or player vs security
                    if (instance.defendant === PlayerStateFactory.StationSecurity) {
                        
                    } 
                    else if(instance.aggressor === PlayerStateFactory.StationSecurity) {

                    }

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
        
        const pData = PlayerStateFactory.get(who);
        const pIsAlienAndTransformed = pData && pData.getForce() && pData.getForce()
            .is(ALIEN_FORCE_NAME) && (pData.getForce() as AlienForce).isPlayerTransformed(who);

        // If we target, make them hostile
        if (isTargeted || pIsAlienAndTransformed) {
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

        // Other "bug fix" calls
        // Always be allied to neutral passive
        PlayerStateFactory.NeutralPassive.setAlliance(forPlayer, ALLIANCE_PASSIVE, true);
        forPlayer.setAlliance(PlayerStateFactory.NeutralPassive, ALLIANCE_PASSIVE, true);
        // Always be hostile to neutral hostile
        PlayerStateFactory.NeutralHostile.setAlliance(forPlayer, ALLIANCE_PASSIVE, false);
        forPlayer.setAlliance(PlayerStateFactory.NeutralHostile, ALLIANCE_PASSIVE, false);

        // Are we alien, and are we transformed?
        const pData = PlayerStateFactory.get(forPlayer);
        const pIsAlienAndTransformed = pData && pData.getForce() && pData.getForce()
            .is(ALIEN_FORCE_NAME) && (pData.getForce() as AlienForce).isPlayerTransformed(forPlayer);

        // if (pData.getForce()) Log.Information(`${forPlayer.name} Force ${pData.getForce().name} is transformed ${pIsAlienAndTransformed}`);

        // Security state, depends if the player is targeted or not
        // If we are targeted OR alien form, make them hostile
        if (PlayerStateFactory.isTargeted(forPlayer) || pIsAlienAndTransformed) {
            PlayerStateFactory.StationSecurity.setAlliance(forPlayer, ALLIANCE_PASSIVE, false);
            forPlayer.setAlliance(PlayerStateFactory.StationSecurity, ALLIANCE_PASSIVE, false);
        }
        // Otherwise make them allied
        else {
            PlayerStateFactory.StationSecurity.setAlliance(forPlayer, ALLIANCE_PASSIVE, true);
            forPlayer.setAlliance(PlayerStateFactory.StationSecurity, ALLIANCE_PASSIVE, true);
        }

        // handle alien minion AI slots
        PlayerStateFactory.getAlienAI().forEach(alienAISlot => {
            // IF we are alien AND transformed, ally the players
            alienAISlot.setAlliance(forPlayer, ALLIANCE_PASSIVE, pIsAlienAndTransformed);
            forPlayer.setAlliance(alienAISlot, ALLIANCE_PASSIVE, pIsAlienAndTransformed);
        });
    }


    // The currently winning force (if any)
    private hasWinningForce: ForceType | undefined;
    private gameOver: boolean = false;
    /**
     * Checks victory conditions of all forces
     * returns a force if it is the only winning force
     */
    public checkVictoryConditions(): ForceType | undefined {

        // Too late! Game is over
        if (this.gameOver) return;

        // Takes X seconds

        // has only one force one?
        const winningForces = PlayerStateFactory.getInstance().forces.filter(f => f.checkVictoryConditions());

        if (winningForces.length === 1) {
            const winner = winningForces[0];

            // Ensure this trigger never runs if the same winning force is called
            if (this.hasWinningForce && this.hasWinningForce === winner) return;

            this.hasWinningForce = winner;
            const winningPlayers = winner.getPlayers();
            
            Timers.addSlowTimedAction(15, () => {
                // has only one force one?
                const winningForces2 = PlayerStateFactory.getInstance().forces.filter(f => f.checkVictoryConditions());

                // If the winning forces CHANGE cancel and restart
                if (winningForces2.length > 1) return this.hasWinningForce = undefined;
                if (winner !== winningForces2[0]) return this.hasWinningForce = undefined;
                
                this.gameOver = true;

                const winningSound = new SoundRef("Sounds\\VictoryStinger.mp3", false, true);
                const losingSound = new SoundRef("Sounds\\DefeatStinger.mp3", false, true);

                if (winner.is(ALIEN_FORCE_NAME)) {
                    Players.forEach(p => MessagePlayer(p, `${COL_ALIEN}The Aliens have eliminated humanity.`));
                }
                else if (winner.is(CREW_FORCE_NAME)) {
                    Players.forEach(p => MessagePlayer(p, `${COL_GOOD}Humanity has exterminated the alien threat!`));
                }

                if (winningPlayers.indexOf(MapPlayer.fromLocal()) >= 0) {
                    winningSound.playSound();
                    MessageAllPlayers(`${COL_GOOD} You win!|r Your stats have been saved. Thanks for playing!`)
                }
                else {
                    losingSound.playSound();
                    MessageAllPlayers(`${COL_ATTATCH} You lose!|r Your stats have been saved. Thanks for playing!`)
                }


                Players.forEach(p => {
                    const pData = PlayerStateFactory.get(p);
                    if (pData) {
                        if (pData.getForce() && !pData.getForce().is(OBSERVER_FORCE_NAME)) {
                            pData.gamesLeft -= 1;
                        }
                        if (winningPlayers.indexOf(p) >= 0) {
                            pData.playerGamesWon += 1;
                        }
                        else {
                            pData.playerGamesLost += 1;
                        }
                        pData.save();
                    }
                });


                // Wait 10 seconds before the game ends
                Timers.addSlowTimedAction(10, () => {

                    Players.forEach(p => {
                        if (winningPlayers.indexOf(p) >= 0) {
                            CustomVictoryBJ(p.handle, true, true);
                        }
                        else {
                            CustomDefeatBJ(p.handle, `You lose!`);
                        }
                    });
                });
            });
        }
        else if (winningForces.length === 0) { 
            const drawSound = new SoundRef("Sound\\Dialogue\\Extra\\KelThuzadDeath1.flac", false, true);
            drawSound.playSound();
            Timers.addSlowTimedAction(10, () => {
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
                case CULT_FORCE_NAME:
                    force = new CultistForce(); 
                    break;
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
            isRequired: PlayerStateFactory.isSinglePlayer() ? false : true,
            text: STR_OPT_ALIEN,
            hotkey: "a",
            type: OPT_TYPES.ANTAGONST,
            chanceToExist: 100,
            count: 1
        });

        if (PlayerStateFactory.isSinglePlayer() || PlayerStateFactory.allowWIP()) {
            optSelection.addOpt({
                name: CULT_FORCE_NAME,
                isRequired: false,
                text: STR_OPT_CULT,
                hotkey: "c",
                type: OPT_TYPES.ANTAGONST,
                chanceToExist: 100,
                count: (PlayerStateFactory.getInstance().playerCount > 8) ? 2 : 1
            });
        }
        
        // Now ask for opts
        optSelection.askPlayerOpts();

        // Start a 15 second timer
        const timer = CreateTimer();
        StartTimerBJ(timer, false, 20);

        const timerTrig = new Trigger();

        // const timerDialog = CreateTimerDialog(timer);
        // TimerDialogDisplay(timerDialog, true);
        timerTrig.addAction(() => {
            // TimerDialogDisplay(timerDialog, false);
            const results = optSelection.endOptSelection();
            callback(results);
        });
        
        timerTrig.registerTimerExpireEvent(timer);

        // We will always have Alien and Crewmember forces
        PlayerStateFactory.getInstance().forces.push(new AlienForce());
        PlayerStateFactory.getInstance().forces.push(new CrewmemberForce());
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

        // Check to see if they were originally in obs force
        const pData = PlayerStateFactory.get(who);
        if (pData && pData.getForce() && pData.getForce().is(OBSERVER_FORCE_NAME)) return false;

        // const playerLeaveSound = new SoundRef('Sound\\Interface\\QuestFailed.flac', false, true);
        // playerLeaveSound.playSound();
        const c = playerColors[who.id].code;
        Players.forEach(player => {
            ChatEntity.getInstance().postSystemMessage(player, `${c}${PlayerStateFactory.get(who).originalName}|r has left the game!`);            
        });

        // Kill all units they woned
        const allUnits = GetUnitsOfPlayerAll(who.handle);

        ForGroup(allUnits, () => {
            const u = GetEnumUnit();
            KillUnit(u);
        });
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
