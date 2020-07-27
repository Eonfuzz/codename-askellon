/** @NoSelfInFile **/

import { TimedEventQueue } from "./types/timed-event-queue";
import { Trigger, MapPlayer, Timer, Effect } from "w3ts";
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
import { VisionModule } from "./vision/vision-module";
import { SoundRef } from "./types/sound-ref";
import { ZONE_TYPE } from "./world/zone-id";
import { ShipZone } from "./world/zone-type";
import { SFX_PORTAL } from "resources/sfx-paths";
import { Vector2 } from "./types/vector2";
import { Vector3 } from "./types/vector3";
import { getYawPitchRollFromVector, PlayNewSoundOnUnit, PlayNewSound } from "lib/translators";
import { COL_ATTATCH, COL_GOOD, COL_ORANGE } from "resources/colours";

const warpStormSound = new SoundRef("Sounds\\WarpStorm.mp3", true, true);
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
    public vision: VisionModule;

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

        SetSkyModel("war3mapImported\\skybox_green_warp.mdx");

        SetMapMusic("Music\\MechanicusLostCivilization.mp3", false, 0);
        // SetMusicVolume(20);
        PlayMusic("Music\\MechanicusLostCivilization.mp3");
        SetMusicVolume(30);

        BlzHideOriginFrames(true);
        PauseGameOff();

        // Load order is important
        this.timedEventQueue    = new TimedEventQueue(this);
        this.gameTimeElapsed    = new GameTimeElapsed();
        this.event              = new EventModule();
        this.tooltips           = new TooltipModule(this);

        // Load modules after all helper objects
        this.vision             = new VisionModule(this);
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

        this.spaceModule.initShips();     
        
        // Camera follow the main ship
        this.followMainShip();

        // Start role selection
        this.forceModule.getOpts((optResults) => this.postOptResults(optResults));
        this.syncedTimer.start(PROCESS_TIMER, true, () => this.processActions());
    }

    private followTimer = new Timer();
    private portalSFX: Effect;
    private visModifiers = [];
    private followMainShip() {
        const mainShip = this.spaceModule.mainShip;

        mainShip.engine.mass = 0;
        mainShip.engine.velocityForwardMax = 120;
        mainShip.onMoveOrder(new Vector2(mainShip.unit.x + 600, mainShip.unit.y + 600));

        warpStormSound.playSound();

        const facingData = getYawPitchRollFromVector(new Vector3(1, 1, 0));
        this.portalSFX = new Effect(SFX_PORTAL, mainShip.unit.x + 1500, mainShip.unit.y + 1500);

        this.portalSFX.scale = 2;
        this.portalSFX.z = -600;
        this.portalSFX.setPitch(facingData.pitch);
        this.portalSFX.setRoll(facingData.roll);
        this.portalSFX.setYaw(facingData.yaw);
        

        BlzHideOriginFrames(true);
        BlzFrameSetAllPoints(BlzGetOriginFrame(ORIGIN_FRAME_WORLD_FRAME, 0), BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0));
        BlzFrameSetVisible(BlzGetFrameByName("ConsoleUIBackdrop",0), false);

        BlzShowTerrain(false);
        this.forceModule.getActivePlayers().forEach(p => {
            const modifier = CreateFogModifierRect(p.handle, FOG_OF_WAR_VISIBLE, gg_rct_Space, true, false);
            FogModifierStart(modifier);
            this.visModifiers.push(modifier);
        });
        
        this.followTimer.start(0.03, true, () => {
            const x = mainShip.unit.x;
            const y = mainShip.unit.y;
            PanCameraToTimed(x, y, 0);
        });

        
        PlayNewSound("Sounds\\ComplexBeep.mp3", 127);
        DisplayTextToForce(bj_FORCE_ALL_PLAYERS, `[${COL_ATTATCH}INFO|r] Preparing Warp`);
        new Timer().start(10, false, () => {
            PlayNewSound("Sounds\\ComplexBeep.mp3", 127);
            DisplayTextToForce(bj_FORCE_ALL_PLAYERS, `[${COL_ORANGE}WARNING|r] Deep-Scan failing`);
        });
        new Timer().start(16, false, () => {
            PlayNewSound("Sounds\\ComplexBeep.mp3", 127);
            DisplayTextToForce(bj_FORCE_ALL_PLAYERS, `[${COL_ATTATCH}CRITICAL|r] DIVERTING`);
            CinematicFadeBJ(bj_CINEFADETYPE_FADEOUTIN, 1, "ReplaceableTextures\\CameraMasks\\White_mask.blp", 80.00, 80.00, 100.00, 0)
        });
    }

    private stopFollowingMainShip() {
        this.followTimer.pause();
        this.followTimer.destroy();
        BlzShowTerrain(true);

        warpStormSound.stopSound();

        this.visModifiers.forEach(m => {
            FogModifierStop(m);
        })


        SetSkyModel("war3mapImported\\Skybox3rAlt.mdx");
        const mainShip = this.spaceModule.mainShip;
        mainShip.engine.mass = 800;
        mainShip.engine.velocityForwardMax = 1400;

        this.forceModule.getActivePlayers().forEach(p => mainShip.unit.shareVision(p, false));
    }

    postOptResults(optResults: OptResult[]) {
        try {
            this.stopFollowingMainShip();

            // Init forces
            this.forceModule.initForcesFor(optResults);       

            // Init crew
            this.crewModule.initCrew(this.forceModule.getForces());

            // Now init force timers
            this.forceModule.init();

            // Start opening cinematic
            this.openingCinematic();
        }
        catch (e) {
            Log.Error(e);
        }
    }

    private cinematicSound = new SoundRef("Sounds\\StationStormScreech.mp3", false, true);
    private openingCinematic() {

        const hideButtons = new Timer().start(0.01, true, () => {
            for (let i = 0; i < 12; i++) {
                BlzFrameSetVisible(BlzGetOriginFrame(ORIGIN_FRAME_COMMAND_BUTTON, i), false);  
            }
        });

        this.cinematicSound.playSound();
        CameraSetSourceNoise(2, 50);
        PlayNewSound("Sounds\\ComplexBeep.mp3", 127);
        DisplayTextToForce(bj_FORCE_ALL_PLAYERS, `[${COL_ATTATCH}CRITICAL|r] Hull Deteriorating`);

        new Timer().start(2, false, () => {
            PlayNewSound("Sounds\\ShipDamage\\GroanLong2.mp3", 127);
            CinematicFadeBJ(bj_CINEFADETYPE_FADEOUTIN, 2, "ReplaceableTextures\\CameraMasks\\White_mask.blp", 100.00, 100.00, 90.00, 0)
           
        })

        new Timer().start(3, false, () => {
            PlayNewSound("Sounds\\ComplexBeep.mp3", 127);
            DisplayTextToForce(bj_FORCE_ALL_PLAYERS, `[${COL_ORANGE}WARNING|r] Damage Sustained`);

            SetDayNightModels("DeepFried\\dnclordaeronunit.mdx", "DeepFried\\dnclordaeronunit.mdx");
            CameraSetSourceNoise(5, 50);
            for (let i = 0; i < 12; i++) {
                BlzFrameSetVisible(BlzGetOriginFrame(ORIGIN_FRAME_COMMAND_BUTTON, i), false);            
            }
        });
        new Timer().start(4, false, () => {
            // PlayNewSound("Sounds\\ShipDamage\\GroanLong1.mp3", 127);
            PlayNewSound("Sounds\\ComplexBeep.mp3", 127);
            DisplayTextToForce(bj_FORCE_ALL_PLAYERS, `[${COL_ORANGE}WARNING|r] Damage Sustained`);
        });
        new Timer().start(5, false, () => {
            PlayNewSound("Sounds\\ComplexBeep.mp3", 127);
            DisplayTextToForce(bj_FORCE_ALL_PLAYERS, `[${COL_ORANGE}WARNING|r] Damage Sustained`);
        });
        new Timer().start(6, false, () => {
            PlayNewSound("Sounds\\ComplexBeep.mp3", 127);
            DisplayTextToForce(bj_FORCE_ALL_PLAYERS, `[${COL_ATTATCH}CRITICAL|r] Power Loss imminent`);

            CameraSetSourceNoise(10, 50);
        });
        new Timer().start(7, false, () => {
            CinematicFadeBJ(bj_CINEFADETYPE_FADEOUTIN, 4, "ReplaceableTextures\\CameraMasks\\Black_mask.blp", 0.00, 0.00, 0.00, 0);
            CameraSetSourceNoise(15, 50);
        });
        new Timer().start(7, false, () => {
            this.worldModule.askellon.powerDownSound.playSound();
        });
        new Timer().start(9, false, () => {
            this.worldModule.askellon.findZone(ZONE_TYPE.BRIDGE).updatePower(false);
            this.worldModule.askellon.findZone(ZONE_TYPE.ARMORY).updatePower(false);
            this.worldModule.askellon.findZone(ZONE_TYPE.BIOLOGY).updatePower(false);
            CameraSetSourceNoise(20, 50);
        });
        new Timer().start(14, false, () => {
            // PlayNewSound("Sounds\\ComplexBeep.mp3", 127);
            DisplayTextToForce(bj_FORCE_ALL_PLAYERS, `[${COL_GOOD}INFO|r] Rebooting...`);
            CameraSetSourceNoise(10, 50);
        });
        new Timer().start(16, false, () => {
            CameraSetSourceNoise(5, 50);

            this.worldModule.askellon.findZone(ZONE_TYPE.BRIDGE).updatePower(true);
            this.worldModule.askellon.findZone(ZONE_TYPE.ARMORY).updatePower(true);
            this.worldModule.askellon.findZone(ZONE_TYPE.BIOLOGY).updatePower(true);
        });
        new Timer().start(20, false, () => {
            PlayNewSound("Sounds\\ComplexBeep.mp3", 127);
            DisplayTextToForce(bj_FORCE_ALL_PLAYERS, `[${COL_ORANGE}WARNING|r] Breaches detected`);

            hideButtons.pause();
            hideButtons.destroy();

            CameraSetSourceNoise(0, 0);
            BlzHideOriginFrames(false);
            BlzFrameSetAllPoints(BlzGetOriginFrame(ORIGIN_FRAME_WORLD_FRAME, 0), BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0));
            BlzFrameSetVisible(BlzGetFrameByName("ConsoleUIBackdrop",0),true);
            for (let i = 0; i < 12; i++) {
                BlzFrameSetVisible(BlzGetOriginFrame(ORIGIN_FRAME_COMMAND_BUTTON, i), true);            
            }

            // Init chat
            this.chatModule.initialise();
        });
        new Timer().start(21, false, () => {
            PlayNewSound("Sounds\\ComplexBeep.mp3", 127);
            DisplayTextToForce(bj_FORCE_ALL_PLAYERS, `[${COL_ATTATCH}CRITICAL|r] Signs of ${COL_ATTATCH}INTRUSION|r. XENOS ON BOARD`);
        });
        new Timer().start(22, false, () => {
            PlayNewSound("Sounds\\ComplexBeep.mp3", 127);
            DisplayTextToForce(bj_FORCE_ALL_PLAYERS, `[${COL_GOOD}INFO|r] Calculating scenario...`);
        });
        new Timer().start(24, false, () => {
            PlayNewSound("Sounds\\ComplexBeep.mp3", 127);
            DisplayTextToForce(bj_FORCE_ALL_PLAYERS, `[${COL_GOOD}INFO|r] Eliminate intruder`);
        });
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
    
}