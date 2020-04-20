/** @NoSelfInFile **/
import { CrewModule } from "./crewmember/crewmember-module";
import { WeaponModule } from "./weapons/weapon-module";
import { TimedEventQueue } from "./types/timed-event-queue";
import { ForceModule } from "./force/force-module";
import { SpaceModule } from "./space/space-module";
import { Trigger, MapPlayer } from "w3ts";
import { GameTimeElapsed } from "./types/game-time-elapsed";
import { GeneModule } from "./shops/gene-modules";
import { AbilityModule } from "./abilities/ability-module";
import { InteractionModule } from "./interactions/interaction-module";
import { Vector2 } from "./types/vector2";
import { WorldModule } from "./world/world-module";
import { ZONE_TYPE } from "./world/zone-id";
import { GalaxyModule } from "./galaxy/galaxy-module";
import { LeapModule } from "./leap-engine/leap-module";
import { ResearchModule } from "./research/research-module";
import { ChatModule } from "./chat/chat-module";
import { EventModule } from "./events/event-module";
import { SecurityModule } from "./station/security-module";
import { Log } from "lib/serilog/serilog";
import { DynamicBuffModule } from "./buff/dynamic-buff-module";
import { TooltipModule } from "./tooltip/tooltip-module";
import { OptResult } from "./force/opt-selection";

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
    public leapModule: LeapModule;
    public researchModule: ResearchModule;
    public chatModule: ChatModule;
    public event: EventModule;
    public tooltips: TooltipModule;

    public stationSecurity: SecurityModule;
    public buffModule: DynamicBuffModule;

    // public dummyUnit: unit;

    /**
     * Should always be defined,
     * Used for measuring Z heights
     */
    public TEMP_LOCATION = Location(0, 0);


    constructor() {
        // Load the UI
        if (!BlzLoadTOCFile("UI\\CustomUI.toc")) {
            Log.Error("Failed to load TOC");
        }

        BlzChangeMinimapTerrainTex("war3mapGenerated.blp")

        this.initUI();

        // Load order is important
        this.timedEventQueue    = new TimedEventQueue(this);
        this.gameTimeElapsed    = new GameTimeElapsed();
        this.event              = new EventModule();
        this.tooltips           = new TooltipModule(this);

        // Load modules after all helper objects
        this.buffModule         = new DynamicBuffModule(this);
        this.galaxyModule       = new GalaxyModule(this);
        this.forceModule        = new ForceModule(this);
        this.weaponModule       = new WeaponModule(this);
        this.spaceModule        = new SpaceModule(this);
        this.worldModule        = new WorldModule(this);
        this.crewModule         = new CrewModule(this);
        this.leapModule         = new LeapModule(this);
        this.researchModule     = new ResearchModule(this);

        this.abilityModule      = new AbilityModule(this);
        this.geneModule         = new GeneModule(this);

        this.interactionsModule = new InteractionModule(this);
        this.chatModule         = new ChatModule(this);
        this.stationSecurity    = new SecurityModule(this);
    }

    public startGame() {
        // Misc
        this.makeUnitsTurnInstantly();

        this.buffModule.init();
        this.researchModule.initialise();
        this.geneModule.initGenes();
        this.tooltips.initialise();
        
        // Here be dragons, old code is below and needs update
        this.galaxyModule.initSectors();

        // Init leaps
        this.leapModule.initialise();

        // Init chat
        this.chatModule.initialise();

        // Init station
        this.stationSecurity.initialise();

        // Start role selection
        this.forceModule.getOpts((optResults) => this.postOptResults(optResults));
    }

    postOptResults(optResults: OptResult[]) {
        try {
            // Init forces
            this.forceModule.initForcesFor(optResults);

            // Init crew
            this.crewModule.initCrew(this.forceModule.getForces());
        }
        catch (e) {
            Log.Error(e);
        }
    }

    /**
     * Returns the current timestamp
     */
    public getTimeStamp(): number {
        return this.gameTimeElapsed.getTimeElapsed();
    }

    /**
     * passes the dummy unit as a parameter to the callback
     * ensure you remove any abilities afterwards
     * @param callback 
     */
    public useDummyFor(callback: (dummy: unit) => void, abilityToCast: number) {
        // Create a dummy unit for all abilities
        const dummyUnit = CreateUnit(Player(25), FourCC('dumy'), 0, 0, bj_UNIT_FACING);
        ShowUnit(dummyUnit, false);
        UnitAddAbility(dummyUnit, abilityToCast);
        callback(dummyUnit);

        UnitApplyTimedLife(dummyUnit, 0, 3);
    }

    //@deprecated
    public getZFromXY(x: number, y: number): number {
        MoveLocation(this.TEMP_LOCATION, x, y);
        return GetLocationZ(this.TEMP_LOCATION)
    }

    private getCameraXY(whichPlayer: MapPlayer, cb: Function) {
        const HANDLE = 'CAMERA';
        const syncTrigger = new Trigger();
        syncTrigger.registerPlayerSyncEvent(whichPlayer, HANDLE, false);
        syncTrigger.addAction(() => {
            const data = BlzGetTriggerSyncData();

            const dataSplit = data.split(',');
            const result = new Vector2(
                S2R(dataSplit[0]), 
                S2R(dataSplit[1])
            );

            // Erase this trigger
            syncTrigger.destroy();
            cb(result);
        });

        if (GetLocalPlayer() === whichPlayer.handle) {
            const x = GetCameraTargetPositionX();
            const y = GetCameraTargetPositionY();
            BlzSendSyncData(HANDLE, `${x},${y}`);
        }
    }

    
    /**
     * Is this something we want?
     */
    public noTurn: boolean = false;
    private makeUnitsTurnInstantly(): void {
        const unitTurnTrigger = new Trigger();
        unitTurnTrigger.registerAnyUnitEvent(EVENT_PLAYER_UNIT_ISSUED_UNIT_ORDER);
        unitTurnTrigger.registerAnyUnitEvent(EVENT_PLAYER_UNIT_ISSUED_POINT_ORDER);
        unitTurnTrigger.registerAnyUnitEvent(EVENT_PLAYER_UNIT_ISSUED_TARGET_ORDER);

        unitTurnTrigger.addAction(() => {
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

    public initUI() {
        // BlzHideOriginFrames(true);
    }
}