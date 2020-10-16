import { Trigger, MapPlayer, Timer, Effect } from "w3ts";
import { Log } from "lib/serilog/serilog";
import { GameTimeElapsed } from "./types/game-time-elapsed";
import { SoundRef } from "./types/sound-ref";
import { ZONE_TYPE } from "./world/zone-id";
import { SFX_PORTAL, SFX_BLACK_HOLE } from "resources/sfx-paths";
import { Vector2 } from "./types/vector2";
import { Vector3 } from "./types/vector3";
import { COL_GOOD, COL_ORANGE, COL_ATTATCH } from "resources/colours";
import { SecurityEntity } from "./station/security-module";
import { EventEntity } from "./events/event-entity";
import { TooltipEntity } from "./tooltip/tooltip-module";
import { DynamicBuffEntity } from "./buff/dynamic-buff-entity";
import { VisionFactory } from "./vision/vision-factory";
import { ConveyorEntity } from "./conveyor/conveyor-entity";
import { LeapEntity } from "./leap-engine/leap-entity";
import { ForceEntity } from "./force/force-entity";
import { ChatEntity } from "./chat/chat-entity";

import { InteractionEntity } from "./interactions/interaction-entity";
import { ResearchFactory } from "./research/research-factory";
import { GeneEntity } from "./shops/gene-entity";
import { AbilityEntity } from "./abilities/ability-entity";
import { WorldEntity } from "./world/world-entity";
import { SpaceEntity } from "./space/space-module";

import { CrewFactory } from "./crewmember/crewmember-factory";
import { WeaponEntity } from "./weapons/weapon-entity";
import { PlayNewSound, getYawPitchRollFromVector } from "lib/translators";
import { OptResult } from "./force/opt/opt-selection-factory";
import { Players } from "w3ts/globals/index";
import { GetActivePlayers } from "lib/utils";
import { InputManager } from "lib/TreeLib/InputManager/InputManager";
import { Hooks } from "lib/Hooks";
import { AIEntity } from "./ai/ai-entity";
import { PlayerStateFactory } from "./force/player-state-entity";
import { AntiMetaEntity } from "resources/anti-meta-entity";
import { UIEntity } from "resources/ui/ui-entity";
import { AskellonEntity } from "./station/askellon-entity";
import { Timers } from "./timer-type";
import { ShipZone } from "./world/zone-types/ship-zone";
import { EggInstance } from "./ai/egg-instance";
import { EggEntity } from "./ai/egg-entity";

const warpStormSound = new SoundRef("Sounds\\WarpStorm.mp3", true, true);
export class Game {
    private static instance: Game;

    public static getInstance() {        
        if (this.instance == null) {
            this.instance = new Game();
            Hooks.set(this.name, this.instance);
        }
        return this.instance;
    }

    public stationSecurity: any;

    constructor() {
        // Load the UI
        if (!BlzLoadTOCFile("UI\\CustomUI.toc")) {
            Log.Error("Failed to load TOC");
        }

        StopSound(bj_nightAmbientSound, true, true);
        StopSound(bj_dayAmbientSound, true, true);

        SetSkyModel("war3mapImported\\skybox_green_warp.mdx");

        SetMapMusic("Music\\MechanicusLostCivilization.mp3", false, 0);
        // SetMusicVolume(20);
        PlayMusic("Music\\MechanicusLostCivilization.mp3");
        SetMusicVolume(30);
        PauseGameOff();

        
        warpStormSound.playSound();
        CinematicFilterGenericBJ(5, BLEND_MODE_NONE, "ReplaceableTextures\\CameraMasks\\Black_mask.blp", 0, 0, 0, 0, 0, 0 ,0 ,0);
        DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 5, `Loading, please wait`);
        BlzHideOriginFrames(true);
        BlzFrameSetAllPoints(BlzGetOriginFrame(ORIGIN_FRAME_WORLD_FRAME, 0), BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0));
        BlzFrameSetVisible(BlzGetFrameByName("ConsoleUIBackdrop",0), false);
        // Cinematic
    }

    public startGame() {
        InputManager.getInstance();
        GameTimeElapsed.getInstance();
        // Load our helper objects
        // Load order is VERY important
        EventEntity.getInstance();
        TooltipEntity.getInstance();
        DynamicBuffEntity.getInstance();
        VisionFactory.getInstance();
        ConveyorEntity.getInstance();
        LeapEntity.getInstance();

        ForceEntity.getInstance();
        SecurityEntity.getInstance();
        AskellonEntity.getInstance();
        
        // Deps: Force Entity
        ResearchFactory.getInstance();

        // Deps: Force Entity
        ChatEntity.getInstance();

        // Deps: Force Entity + Others
        WorldEntity.getInstance();
        InteractionEntity.getInstance();
        GeneEntity.getInstance();

        // // Relies on the above
        CrewFactory.getInstance();

        // Relies on ALL the above
        SpaceEntity.getInstance();
        WeaponEntity.getInstance();
        AbilityEntity.getInstance();

        AIEntity.getInstance();
        AntiMetaEntity.start();
        EggEntity.getInstance();

        Timers.addTimedAction(5, () => {

            CinematicFadeBJ(bj_CINEFADETYPE_FADEIN, 1.5, "ReplaceableTextures\\CameraMasks\\Black_mask.blp", 0, 0, 0, 0);

            // Camera follow the main ship
            this.followMainShip();
    
            // Start role selection
            ForceEntity.getInstance().getOpts((optResults) => this.postOptResults(optResults));
        });
    }

    private followTimer = new Timer();
    private portalSFX: Effect;
    private visModifiers = [];
    private followMainShip() {
        const mainShip = SpaceEntity.getInstance().mainShip;

        mainShip.engine.mass = 0;
        mainShip.engine.velocityForwardMax = 100;
        mainShip.onMoveOrder(new Vector2(mainShip.unit.x + 500, mainShip.unit.y + 500));

        const facingData = getYawPitchRollFromVector(new Vector3(1, 1, -0.7));
        this.portalSFX = new Effect(SFX_BLACK_HOLE, mainShip.unit.x + 1300, mainShip.unit.y + 1300);

        this.portalSFX.scale = 15;
        this.portalSFX.z = -200;
        this.portalSFX.setTime(1);
        this.portalSFX.setTimeScale(0.6);
        this.portalSFX.setPitch(facingData.pitch);
        this.portalSFX.setRoll(facingData.roll);
        this.portalSFX.setYaw(facingData.yaw);
        


        GetActivePlayers().forEach(p => {
            const modifier = CreateFogModifierRect(p.handle, FOG_OF_WAR_VISIBLE, gg_rct_Space, true, false);
            FogModifierStart(modifier);
            this.visModifiers.push(modifier);

            const m = CreateFogModifierRect(p.handle, FOG_OF_WAR_VISIBLE, gg_rct_stationtempvision, true, false);
            FogModifierStart(m);
            this.visModifiers.push(m);
        });
        
        this.followTimer.start(0.01, true, () => {
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
        new Timer().start(15.25, false, () => {
            PlayNewSound("Sounds\\ComplexBeep.mp3", 127);
            DisplayTextToForce(bj_FORCE_ALL_PLAYERS, `[${COL_ATTATCH}CRITICAL|r] DIVERTING`);
            CinematicFadeBJ(bj_CINEFADETYPE_FADEOUTIN, 1.5, "ReplaceableTextures\\CameraMasks\\White_mask.blp", 40.00, 50.00, 70.00, 0)
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

        const mainShip = SpaceEntity.getInstance().mainShip;
        mainShip.engine.mass = 800;
        mainShip.engine.velocityForwardMax = 1400;
        mainShip.engine.goToAStop();

        BlzHideOriginFrames(false);
        BlzFrameSetVisible(BlzGetFrameByName("ConsoleUIBackdrop",0), true);

        this.portalSFX.destroy();
        Players.forEach(p => mainShip.unit.shareVision(p, false));
    }

    postOptResults(optResults: OptResult[]) {
        try {
            // Start opening cinematic            
            this.stopFollowingMainShip();

            // Init forces
            ForceEntity.getInstance().initForcesFor(optResults);       

            // Init crew
            CrewFactory.getInstance().initCrew()

            // Init chat
            ChatEntity.getInstance().initialise();

            if (!PlayerStateFactory.isSinglePlayer()) {
                this.openingCinematic();
            }
            else {
                Log.Information("TEST LOBBY DETECTED")
                Players.forEach(p => p.setState(PLAYER_STATE_RESOURCE_GOLD, 999999));
                SetSkyModel("war3mapImported\\Skybox3rNoDepth.mdx");
                BlzChangeMinimapTerrainTex("war3mapPreviewAskellon.dds");
                Players.forEach(p => {            
                    SetCameraBoundsToRectForPlayerBJ(p.handle, gg_rct_stationtempvision);
                })
            }

            // UIEntity.start();
        }
        catch (e) {
            Log.Error(e);
        }
    }

    private cinematicSound = new SoundRef("Sounds\\StationStormScreech.mp3", false, true);
    private openingCinematic() {
        for (let i = 0; i < 12; i++) {
            BlzFrameSetVisible(BlzGetOriginFrame(ORIGIN_FRAME_COMMAND_BUTTON, i), true);            
        }
        
        BlzChangeMinimapTerrainTex("war3mapPreviewAskellon.dds");
        Players.forEach(p => {            
            SetCameraBoundsToRectForPlayerBJ(p.handle, gg_rct_stationtempvision);
        })
        
        this.cinematicSound.playSound();
        CameraSetSourceNoise(2, 50);
        PlayNewSound("Sounds\\ComplexBeep.mp3", 127);
        DisplayTextToForce(bj_FORCE_ALL_PLAYERS, `[${COL_ATTATCH}CRITICAL|r] Hull Deteriorating`);


        new Timer().start(2, false, () => {
            PlayNewSound("Sounds\\ShipDamage\\GroanLong2.mp3", 127);
            CinematicFadeBJ(bj_CINEFADETYPE_FADEOUTIN, 2, "ReplaceableTextures\\CameraMasks\\White_mask.blp", 100.00, 100.00, 90.00, 0)
           
        })

        new Timer().start(3, false, () => {
            // PlayNewSound("Sounds\\ComplexBeep.mp3", 127);
            // DisplayTextToForce(bj_FORCE_ALL_PLAYERS, `[${COL_ORANGE}WARNING|r] Damage Sustained`);

            SetDayNightModels("DeepFried\\dnclordaeronunit.mdx", "DeepFried\\dnclordaeronunit.mdx");
            CameraSetSourceNoise(5, 50);
            for (let i = 0; i < 12; i++) {
                BlzFrameSetVisible(BlzGetOriginFrame(ORIGIN_FRAME_COMMAND_BUTTON, i), false);            
            }
        });
        // new Timer().start(4, false, () => {
        //     // PlayNewSound("Sounds\\ShipDamage\\GroanLong1.mp3", 127);
        //     PlayNewSound("Sounds\\ComplexBeep.mp3", 127);
        //     DisplayTextToForce(bj_FORCE_ALL_PLAYERS, `[${COL_ORANGE}WARNING|r] Damage Sustained`);
        // });
        // new Timer().start(5, false, () => {
        //     PlayNewSound("Sounds\\ComplexBeep.mp3", 127);
        //     DisplayTextToForce(bj_FORCE_ALL_PLAYERS, `[${COL_ORANGE}WARNING|r] Damage Sustained`);
        // });
        new Timer().start(6, false, () => {
            // PlayNewSound("Sounds\\ComplexBeep.mp3", 127);
            // DisplayTextToForce(bj_FORCE_ALL_PLAYERS, `[${COL_ATTATCH}CRITICAL|r] Power Loss imminent`);

            CameraSetSourceNoise(10, 50);
        });
        new Timer().start(7, false, () => {
            CinematicFadeBJ(bj_CINEFADETYPE_FADEOUTIN, 4, "ReplaceableTextures\\CameraMasks\\Black_mask.blp", 0.00, 0.00, 0.00, 0);
            CameraSetSourceNoise(15, 50);
        });
        new Timer().start(9, false, () => {
            AskellonEntity.poweredFloors.forEach(p => {
                (WorldEntity.getInstance().askellon.findZone(p) as ShipZone).updatePower(false);
            });
            CameraSetupSetField(GetCurrentCameraSetup(), CAMERA_FIELD_FARZ, 8000, 0.01);
            SetSkyModel("war3mapImported\\Skybox3rNoDepth.mdx");
            CameraSetSourceNoise(20, 50);
        });
        new Timer().start(14, false, () => {
            // PlayNewSound("Sounds\\ComplexBeep.mp3", 127);
            // DisplayTextToForce(bj_FORCE_ALL_PLAYERS, `[${COL_GOOD}INFO|r] Rebooting...`);
            CameraSetSourceNoise(10, 50);
        });
        new Timer().start(16, false, () => {
            CameraSetSourceNoise(5, 50);
            AskellonEntity.poweredFloors.forEach(p => {
                (WorldEntity.getInstance().askellon.findZone(p) as ShipZone).updatePower(true);
            });
        });
        new Timer().start(20, false, () => {
            // PlayNewSound("Sounds\\ComplexBeep.mp3", 127);
            // DisplayTextToForce(bj_FORCE_ALL_PLAYERS, `[${COL_ORANGE}WARNING|r] Breaches detected`);

            CameraSetSourceNoise(0, 0);
        });
        new Timer().start(21, false, () => {
            // PlayNewSound("Sounds\\ComplexBeep.mp3", 127);
            // DisplayTextToForce(bj_FORCE_ALL_PLAYERS, `[${COL_ATTATCH}CRITICAL|r] Signs of ${COL_ATTATCH}INTRUSION|r. XENOS ON BOARD`);

            ForceEntity.getInstance().startIntroduction();
        });
    }
    
}