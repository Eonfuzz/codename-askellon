/** @NoSelfInFile **/
import { Trigger, MapPlayer, Timer, Effect } from "w3ts";
import { Log } from "lib/serilog/serilog";
import { GameTimeElapsed } from "./types/game-time-elapsed";
import { SoundRef } from "./types/sound-ref";
import { ZONE_TYPE } from "./world/zone-id";
import { SFX_PORTAL } from "resources/sfx-paths";
import { Vector2 } from "./types/vector2";
import { Vector3 } from "./types/vector3";
import { getYawPitchRollFromVector, PlayNewSound } from "lib/translators";
import { COL_ATTATCH, COL_GOOD, COL_ORANGE } from "resources/colours";
import { SecurityFactory } from "./station/security-module";

const warpStormSound = new SoundRef("Sounds\\WarpStorm.mp3", true, true);
const PROCESS_TIMER = 0.03;
export class Game {
    private static instance: Game;

    public static getInstance() {        
        if (this.instance == null) {
            this.instance = new Game();
        }
        return this.instance;
    }

    // Helper objects
    private gameTimeElapsed: GameTimeElapsed;
    public stationSecurity: SecurityFactory;

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
        this.gameTimeElapsed    = new GameTimeElapsed();

        // Load our helper objects
        // Load order is VERY important
        // EventEntity.getInstance();
        // TooltipEntity.getInstance();
        // DynamicBuffEntity.getInstance();
        // VisionFactory.getInstance();
        // DynamicBuffEntity.getInstance();
        // ConveyorEntity.getInstance();
        // InteractionEntity.getInstance();

        // // Relies on the above
        // GeneEntity.getInstance();
        // AbilityEntity.getInstance();
        // ResearchFactory.getInstance();
        // LeapEntity.getInstance();
        // WeaponEntity.getInstance();

        // // Relies on ALL the above
        // WorldEntity.getInstance();
        // ForceEntity.getInstance();
        // SpaceEntity.getInstance();
        // ChatEntity.getInstance();

        // // Load modules after all helper objects
        // CrewFactory.getInstance();
        this.stationSecurity = new SecurityFactory();
    }

    public startGame() {
        // Camera follow the main ship
        this.followMainShip();

        // Start role selection
        // ForceEntity.getInstance().getOpts((optResults) => this.postOptResults(optResults));
    }

    private followTimer = new Timer();
    private portalSFX: Effect;
    private visModifiers = [];
    private followMainShip() {
        // const mainShip = SpaceEntity.getInstance().mainShip;

        // mainShip.engine.mass = 0;
        // mainShip.engine.velocityForwardMax = 120;
        // mainShip.onMoveOrder(new Vector2(mainShip.unit.x + 600, mainShip.unit.y + 600));

        // warpStormSound.playSound();

        // const facingData = getYawPitchRollFromVector(new Vector3(1, 1, 0));
        // this.portalSFX = new Effect(SFX_PORTAL, mainShip.unit.x + 1500, mainShip.unit.y + 1500);

        // this.portalSFX.scale = 2;
        // this.portalSFX.z = -600;
        // this.portalSFX.setPitch(facingData.pitch);
        // this.portalSFX.setRoll(facingData.roll);
        // this.portalSFX.setYaw(facingData.yaw);
        

        // BlzHideOriginFrames(true);
        // BlzFrameSetAllPoints(BlzGetOriginFrame(ORIGIN_FRAME_WORLD_FRAME, 0), BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0));
        // BlzFrameSetVisible(BlzGetFrameByName("ConsoleUIBackdrop",0), false);

        // BlzShowTerrain(false);
        // ForceEntity.getInstance().getActivePlayers().forEach(p => {
        //     const modifier = CreateFogModifierRect(p.handle, FOG_OF_WAR_VISIBLE, gg_rct_Space, true, false);
        //     FogModifierStart(modifier);
        //     this.visModifiers.push(modifier);
        // });
        
        // this.followTimer.start(0.03, true, () => {
        //     const x = mainShip.unit.x;
        //     const y = mainShip.unit.y;
        //     PanCameraToTimed(x, y, 0);
        // });

        
        // PlayNewSound("Sounds\\ComplexBeep.mp3", 127);
        // DisplayTextToForce(bj_FORCE_ALL_PLAYERS, `[${COL_ATTATCH}INFO|r] Preparing Warp`);
        // new Timer().start(10, false, () => {
        //     PlayNewSound("Sounds\\ComplexBeep.mp3", 127);
        //     DisplayTextToForce(bj_FORCE_ALL_PLAYERS, `[${COL_ORANGE}WARNING|r] Deep-Scan failing`);
        // });
        // new Timer().start(16, false, () => {
        //     PlayNewSound("Sounds\\ComplexBeep.mp3", 127);
        //     DisplayTextToForce(bj_FORCE_ALL_PLAYERS, `[${COL_ATTATCH}CRITICAL|r] DIVERTING`);
        //     CinematicFadeBJ(bj_CINEFADETYPE_FADEOUTIN, 1, "ReplaceableTextures\\CameraMasks\\White_mask.blp", 80.00, 80.00, 100.00, 0)
        // });
    }

    private stopFollowingMainShip() {
        // this.followTimer.pause();
        // this.followTimer.destroy();
        // BlzShowTerrain(true);

        // warpStormSound.stopSound();

        // this.visModifiers.forEach(m => {
        //     FogModifierStop(m);
        // })


        // SetSkyModel("war3mapImported\\Skybox3rAlt.mdx");
        // const mainShip = SpaceEntity.getInstance().mainShip;
        // mainShip.engine.mass = 800;
        // mainShip.engine.velocityForwardMax = 1400;

        // ForceEntity.getInstance().getActivePlayers().forEach(p => mainShip.unit.shareVision(p, false));
    }

    // postOptResults(optResults: OptResult[]) {
    //     try {
    //         this.stopFollowingMainShip();

    //         // Init forces
    //         ForceEntity.getInstance().initForcesFor(optResults);       

    //         // Init crew
    //         CrewFactory.getInstance().initCrew()

    //         // Start opening cinematic
    //         this.openingCinematic();
    //     }
    //     catch (e) {
    //         Log.Error(e);
    //     }
    // }

    // private cinematicSound = new SoundRef("Sounds\\StationStormScreech.mp3", false, true);
    // private openingCinematic() {

    //     this.cinematicSound.playSound();
    //     CameraSetSourceNoise(2, 50);
    //     PlayNewSound("Sounds\\ComplexBeep.mp3", 127);
    //     DisplayTextToForce(bj_FORCE_ALL_PLAYERS, `[${COL_ATTATCH}CRITICAL|r] Hull Deteriorating`);

    //     // Init chat
    //     ChatEntity.getInstance().initialise();

    //     new Timer().start(2, false, () => {
    //         PlayNewSound("Sounds\\ShipDamage\\GroanLong2.mp3", 127);
    //         CinematicFadeBJ(bj_CINEFADETYPE_FADEOUTIN, 2, "ReplaceableTextures\\CameraMasks\\White_mask.blp", 100.00, 100.00, 90.00, 0)
           
    //     })

    //     new Timer().start(3, false, () => {
    //         PlayNewSound("Sounds\\ComplexBeep.mp3", 127);
    //         DisplayTextToForce(bj_FORCE_ALL_PLAYERS, `[${COL_ORANGE}WARNING|r] Damage Sustained`);

    //         SetDayNightModels("DeepFried\\dnclordaeronunit.mdx", "DeepFried\\dnclordaeronunit.mdx");
    //         CameraSetSourceNoise(5, 50);
    //         for (let i = 0; i < 12; i++) {
    //             BlzFrameSetVisible(BlzGetOriginFrame(ORIGIN_FRAME_COMMAND_BUTTON, i), false);            
    //         }
    //     });
    //     new Timer().start(4, false, () => {
    //         // PlayNewSound("Sounds\\ShipDamage\\GroanLong1.mp3", 127);
    //         PlayNewSound("Sounds\\ComplexBeep.mp3", 127);
    //         DisplayTextToForce(bj_FORCE_ALL_PLAYERS, `[${COL_ORANGE}WARNING|r] Damage Sustained`);
    //     });
    //     new Timer().start(5, false, () => {
    //         PlayNewSound("Sounds\\ComplexBeep.mp3", 127);
    //         DisplayTextToForce(bj_FORCE_ALL_PLAYERS, `[${COL_ORANGE}WARNING|r] Damage Sustained`);
    //     });
    //     new Timer().start(6, false, () => {
    //         PlayNewSound("Sounds\\ComplexBeep.mp3", 127);
    //         DisplayTextToForce(bj_FORCE_ALL_PLAYERS, `[${COL_ATTATCH}CRITICAL|r] Power Loss imminent`);

    //         CameraSetSourceNoise(10, 50);
    //     });
    //     new Timer().start(7, false, () => {
    //         CinematicFadeBJ(bj_CINEFADETYPE_FADEOUTIN, 4, "ReplaceableTextures\\CameraMasks\\Black_mask.blp", 0.00, 0.00, 0.00, 0);
    //         CameraSetSourceNoise(15, 50);
    //     });
    //     new Timer().start(7, false, () => {
    //         WorldEntity.getInstance().askellon.powerDownSound.playSound();
    //     });
    //     new Timer().start(9, false, () => {
    //         WorldEntity.getInstance().askellon.findZone(ZONE_TYPE.BRIDGE).updatePower(false);
    //         WorldEntity.getInstance().askellon.findZone(ZONE_TYPE.ARMORY).updatePower(false);
    //         WorldEntity.getInstance().askellon.findZone(ZONE_TYPE.BIOLOGY).updatePower(false);
    //         CameraSetSourceNoise(20, 50);
    //     });
    //     new Timer().start(14, false, () => {
    //         // PlayNewSound("Sounds\\ComplexBeep.mp3", 127);
    //         DisplayTextToForce(bj_FORCE_ALL_PLAYERS, `[${COL_GOOD}INFO|r] Rebooting...`);
    //         CameraSetSourceNoise(10, 50);
    //     });
    //     new Timer().start(16, false, () => {
    //         CameraSetSourceNoise(5, 50);

    //         WorldEntity.getInstance().askellon.findZone(ZONE_TYPE.BRIDGE).updatePower(true);
    //         WorldEntity.getInstance().askellon.findZone(ZONE_TYPE.ARMORY).updatePower(true);
    //         WorldEntity.getInstance().askellon.findZone(ZONE_TYPE.BIOLOGY).updatePower(true);
    //     });
    //     new Timer().start(20, false, () => {
    //         PlayNewSound("Sounds\\ComplexBeep.mp3", 127);
    //         DisplayTextToForce(bj_FORCE_ALL_PLAYERS, `[${COL_ORANGE}WARNING|r] Breaches detected`);

    //         CameraSetSourceNoise(0, 0);
    //         BlzHideOriginFrames(false);
    //         BlzFrameSetAllPoints(BlzGetOriginFrame(ORIGIN_FRAME_WORLD_FRAME, 0), BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0));
    //         BlzFrameSetVisible(BlzGetFrameByName("ConsoleUIBackdrop",0),true);
    //         for (let i = 0; i < 12; i++) {
    //             BlzFrameSetVisible(BlzGetOriginFrame(ORIGIN_FRAME_COMMAND_BUTTON, i), true);            
    //         }
    //     });
    //     new Timer().start(21, false, () => {
    //         PlayNewSound("Sounds\\ComplexBeep.mp3", 127);
    //         DisplayTextToForce(bj_FORCE_ALL_PLAYERS, `[${COL_ATTATCH}CRITICAL|r] Signs of ${COL_ATTATCH}INTRUSION|r. XENOS ON BOARD`);
    //     });
    //     new Timer().start(22, false, () => {
    //         PlayNewSound("Sounds\\ComplexBeep.mp3", 127);
    //         DisplayTextToForce(bj_FORCE_ALL_PLAYERS, `[${COL_GOOD}INFO|r] Calculating scenario...`);
    //     });
    //     new Timer().start(24, false, () => {
    //         PlayNewSound("Sounds\\ComplexBeep.mp3", 127);
    //         DisplayTextToForce(bj_FORCE_ALL_PLAYERS, `[${COL_GOOD}INFO|r] Eliminate intruder`);
    //     });
    // }

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