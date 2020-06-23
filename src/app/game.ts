/** @NoSelfInFile **/

import { TimedEventQueue } from "./types/timed-event-queue";
import { Trigger, MapPlayer, Timer } from "w3ts";
import { CrewModule } from "./crewmember/crewmember-module";
import { WeaponModule } from "./weapons/weapon-module";
import { ForceModule } from "./force/force-module";
import { SpaceModule } from "./space/space-module";
import { GeneModule } from "./shops/gene-modules";
import { AbilityModule } from "./abilities/ability-module";
import { InteractionModule } from "./interactions/interaction-module";
import { WorldModule } from "./world/world-module";
import { GalaxyModule } from "./galaxy/galaxy-module";
import { LeapModule } from "./leap-engine/leap-module";
import { ResearchModule } from "./research/research-module";
import { ChatModule } from "./chat/chat-module";
import { EventModule } from "./events/event-module";
import { SecurityModule } from "./station/security-module";
import { DynamicBuffModule } from "./buff/dynamic-buff-module";
import { TooltipModule } from "./tooltip/tooltip-module";

import { OptResult } from "./force/opt-selection";
import { Log } from "lib/serilog/serilog";
import { GameTimeElapsed } from "./types/game-time-elapsed";

const PROCESS_TIMER = 0.03;
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

    public dummyUnit: unit;

    private syncedTimer = new Timer();

    constructor() {
        // Load the UI
        if (!BlzLoadTOCFile("UI\\CustomUI.toc")) {
            Log.Error("Failed to load TOC");
        }

        BlzChangeMinimapTerrainTex("war3mapGenerated.blp");
        StopSound(bj_nightAmbientSound, true, true);
        StopSound(bj_dayAmbientSound, true, true);

        SetMapMusic("Music\\MechanicusLostCivilization.mp3", false, 0);
        // SetMusicVolume(20);
        PlayMusic("Music\\MechanicusLostCivilization.mp3");
        SetMusicVolume(20);
        SetSkyModel("war3mapImported\\Skybox3rAlt.mdx");

        // EnablePreSelect(true, false);
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
        // this.buffModule.init();
        this.researchModule.initialise();
        this.geneModule.initGenes();
        this.tooltips.initialise();
        
        // Here be dragons, old code is below and needs update
        // this.galaxyModule.initSectors();

        // Init leaps
        this.leapModule.initialise();

        const enableChat = new Trigger();
        enableChat.registerPlayerChatEvent(MapPlayer.fromIndex(0), "-chat", true);
        enableChat.addAction(() => this.chatModule.initialise());

        // Init station
        this.stationSecurity.initialise();

        // Start role selection
        this.forceModule.getOpts((optResults) => this.postOptResults(optResults));
    }

    postOptResults(optResults: OptResult[]) {
        try {
            // Init forces
            this.forceModule.initForcesFor(optResults);

            this.spaceModule.initShips();            

            // Init crew
            this.crewModule.initCrew(this.forceModule.getForces());

            // Now init force timers
            this.forceModule.init();

        }
        catch (e) {
            Log.Error(e);
        }
        this.syncedTimer.start(PROCESS_TIMER, true, () => this.processActions());
    }

    public processActions() {
        try {
            this.spaceModule.updateShips(PROCESS_TIMER);
            this.weaponModule.updateProjectiles(PROCESS_TIMER);
            this.abilityModule.process(PROCESS_TIMER);
            this.interactionsModule.processInteractions(PROCESS_TIMER);
            this.buffModule.process(PROCESS_TIMER);
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
    
    public initUI() {
        // BlzHideOriginFrames(true);
    }
}