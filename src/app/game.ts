/** @NoSelfInFile **/
import { CrewModule } from "./crewmember/crewmember-module";
import { WeaponModule } from "./weapons/weapon-module";
import { TimedEventQueue } from "./types/timed-event-queue";
import { ForceModule } from "./force/force-module";
import { SpaceModule } from "./space/space-module";
import { Trigger } from "./types/jass-overrides/trigger";
import { GameTimeElapsed } from "./types/game-time-elapsed";
import { GeneModule } from "./shops/gene-modules";
import { AbilityModule } from "./abilities/ability-module";
import { InteractionModule } from "./interactions/interaction-module";
import { Log } from "../lib/serilog/serilog";
import { Vector2 } from "./types/vector2";
import { SoundRef } from "./types/sound-ref";
import { WorldModule } from "./world/world-module";
import { ZONE_TYPE } from "./world/zone-id";
import { BuffInstanceDuration, BuffInstanceCallback } from "./buff/buff-instance";
import { GalaxyModule } from "./galaxy/galaxy-module";

export class Game {
    // Helper objects
    public timedEventQueue: TimedEventQueue;
    private gameTimeElapsed: GameTimeElapsed;

    public weaponModule: WeaponModule;
    public forceModule: ForceModule;
    public spaceModule: SpaceModule;
    public crewModule: CrewModule;
    public abilityModule: AbilityModule;
    public geneModule: GeneModule;
    public interactionsModule: InteractionModule;
    public worldModule: WorldModule;
    public galaxyModule: GalaxyModule;

    // public dummyUnit: unit;

    /**
     * Should always be defined,
     * Used for measuring Z heights
     */
    public TEMP_LOCATION = Location(0, 0);


    constructor() {

        // Load order is important
        this.timedEventQueue    = new TimedEventQueue(this);
        this.gameTimeElapsed    = new GameTimeElapsed();

        // Load modules after all helper objects
        this.galaxyModule       = new GalaxyModule(this);
        this.forceModule        = new ForceModule(this);
        this.weaponModule       = new WeaponModule(this);
        this.spaceModule        = new SpaceModule(this);
        this.worldModule        = new WorldModule(this);
        this.crewModule         = new CrewModule(this);

        this.abilityModule      = new AbilityModule(this);
        this.geneModule         = new GeneModule(this);

        this.interactionsModule = new InteractionModule(this);

    }

    public startGame() {
        // Misc
        this.makeUnitsTurnInstantly();

        // Here be dragons, old code is below and needs update
        this.galaxyModule.initSectors();

        // Initialise commands
        this.initCommands();

        // Start role selection
        this.forceModule.getOpts((optResults) => {
            // Init forces
            this.forceModule.initForcesFor(optResults);

            // Init crew
            this.crewModule.initCrew(this.forceModule.getForces());
        });
    }

    /**
     * Returns the current timestamp
     */
    public getTimeStamp(): number {
        return this.gameTimeElapsed.getTimeElapsed();
    }

    private initCommands() {
        const commandTrigger = new Trigger();

        this.forceModule.getActivePlayers().forEach(player => {
            commandTrigger.RegisterPlayerChatEvent(player, "-", false);
        })

        commandTrigger.AddAction(() => {
            const triggerPlayer = GetTriggerPlayer();
            const crew = this.crewModule.getCrewmemberForPlayer(triggerPlayer);
            const message = GetEventPlayerChatString();

            const hasCommanderPower = true;
            Log.Information("Player name: ", GetPlayerName(triggerPlayer))

            if (message === "-resolve" && crew) {
                crew.testResolve(this);
            }
            else if (message === "-u" && crew) {
                if (crew.weapon) {
                    crew.weapon.detach();
                }
                crew.updateTooltips(this.weaponModule);
            }
            else if (message === "-nt") {
                this.noTurn = !this.noTurn;
            }
            else if (message === "-p1off") {
                Log.Information("Killing power to floor 1");
                const z = this.worldModule.askellon.findZone(ZONE_TYPE.FLOOR_1)
                z && z.updatePower(this.worldModule, false);
            }
            else if (message === "-p1on") {
                Log.Information("Restoring power to floor 1");
                const z = this.worldModule.askellon.findZone(ZONE_TYPE.FLOOR_1)
                z && z.updatePower(this.worldModule, true);
            }
            else if (message === "-testalien") {
                this.getCameraXY(triggerPlayer, (self: any, pos: Vector2) => {
                    const alien = CreateUnit(triggerPlayer, FourCC('ALI1'), pos.x, pos.y, bj_UNIT_FACING);
                    this.abilityModule.trackUnitOrdersForAbilities(alien);
                })
            }
            else if (message.indexOf("-m") === 0) {
                const mSplit = message.split(" ");
                const dX = S2I(mSplit[1] || "0");
                const dY = S2I(mSplit[2] || "0");

                Log.Information(`Warping Askellon x+${dX} y+${dY}`);
                this.galaxyModule.navigateToSector(dX, dY);
            }
        });
    }


    /**
     * passes the dummy unit as a parameter to the callback
     * ensure you remove any abilities afterwards
     * @param callback 
     */
    public useDummyFor(callback: Function, abilityToCast: number) {
        // Create a dummy unit for all abilities
        const dummyUnit = CreateUnit(Player(25), FourCC('dumy'), 0, 0, bj_UNIT_FACING);
        ShowUnit(dummyUnit, false);
        UnitAddAbility(dummyUnit, abilityToCast);
        callback(dummyUnit);

        UnitApplyTimedLife(dummyUnit, 0, 3);
    }

    
    public getZFromXY(x: number, y: number): number {
        MoveLocation(this.TEMP_LOCATION, x, y);
        return GetLocationZ(this.TEMP_LOCATION)
    }

    private getCameraXY(whichPlayer: player, cb: Function) {
        const HANDLE = 'CAMERA';
        const syncTrigger = new Trigger();
        BlzTriggerRegisterPlayerSyncEvent(syncTrigger.nativeTrigger, whichPlayer, HANDLE, false);
        syncTrigger.AddAction(() => {
            const data = BlzGetTriggerSyncData();

            const dataSplit = data.split(',');
            const result = new Vector2(
                S2R(dataSplit[0]), 
                S2R(dataSplit[1])
            );
            Log.Information("Got data: "+result.x+", "+result.y);

            // Erase this trigger
            syncTrigger.destroy();
            cb(result);
        });

        if (GetLocalPlayer() === whichPlayer) {
            const x = GetCameraTargetPositionX();
            const y = GetCameraTargetPositionY();
            BlzSendSyncData(HANDLE, `${x},${y}`);
        }
    }

    
    /**
     * Is this something we want?
     */
    private noTurn: boolean = false;
    private makeUnitsTurnInstantly(): void {
        const unitTurnTrigger = new Trigger();
        unitTurnTrigger.RegisterAnyUnitEventBJ(EVENT_PLAYER_UNIT_ISSUED_UNIT_ORDER);
        unitTurnTrigger.RegisterAnyUnitEventBJ(EVENT_PLAYER_UNIT_ISSUED_POINT_ORDER);
        unitTurnTrigger.RegisterAnyUnitEventBJ(EVENT_PLAYER_UNIT_ISSUED_TARGET_ORDER);

        unitTurnTrigger.AddAction(() => {
            if (!this.noTurn) return;

            const triggerUnit = GetTriggerUnit();

            const oX = GetUnitX(triggerUnit);
            const oY = GetUnitY(triggerUnit);

            let targetLocationX = GetOrderPointX();
            let targetLocationY = GetOrderPointY();

            // Loc is undefined, must be a unit target order
            if (targetLocationX === undefined) {
                const u = GetOrderTargetUnit();
                targetLocationX = GetUnitX(u);
                targetLocationY = GetUnitY(u);
            }
            
            const angle = Rad2Deg(Atan2(targetLocationY-oY, targetLocationX-oX));
            BlzSetUnitFacingEx(triggerUnit, angle);
        })
    }
}