import { Trigger, MapPlayer, Timer, Effect, playerColors } from "w3ts";
import { Log } from "lib/serilog/serilog";
import { GameTimeElapsed } from "./types/game-time-elapsed";
import { SoundRef } from "./types/sound-ref";
import { ZONE_TYPE } from "./world/zone-id";
import { SFX_PORTAL, SFX_BLACK_HOLE } from "resources/sfx-paths";
import { Vector2 } from "./types/vector2";
import { Vector3 } from "./types/vector3";
import { COL_GOOD, COL_ORANGE, COL_ATTATCH, COL_GOLD } from "resources/colours";
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
import { WorldEntity } from "./world/world-entity";
import { SpaceEntity } from "./space/space-module";

import { CrewFactory } from "./crewmember/crewmember-factory";
import { WeaponEntity } from "./weapons/weapon-entity";
import { PlayNewSound, getYawPitchRollFromVector } from "lib/translators";
import { OptResult } from "./force/opt/opt-selection-factory";
import { Players } from "w3ts/globals/index";
import { GetActivePlayers, MessageAllPlayers } from "lib/utils";
import { InputManager } from "lib/TreeLib/InputManager/InputManager";
import { Hooks } from "lib/Hooks";
import { AIEntity } from "./ai/ai-entity";
import { PlayerStateFactory } from "./force/player-state-entity";
import { AntiMetaEntity } from "resources/anti-meta-entity";
import { UIEntity } from "resources/ui/ui-entity";
import { AskellonEntity } from "./station/askellon-entity";
import { Timers } from "./timer-type";
import { ShipZone } from "./world/zone-types/ship-zone";
import { EggEntity } from "./ai/egg-entity";
import { GENERIC_CHAT_SOUND_REF } from "./force/forces/force-type";
import { ROLE_TYPES } from "resources/crewmember-names";
import { TipEntity } from "./tips/tip-entity";
import { AbilityHooks } from "./abilities/ability-hooks";
import { BootAbilityHooks } from "./abilities/ability-hooks-boot";
import { BootAbilityHooks2 } from "./abilities/ability-hooks-boot-2";
import { Ability } from "./abilities/ability-type";
import { EVENT_TYPE } from "./events/event-enum";

export const warpStormSound = new SoundRef("Sounds\\WarpStorm.mp3", true, true);
export const labrynthIntro = new SoundRef("Sounds\\Theme\\TheLabrynth.mp3", true, true);
export const warningSound = new SoundRef("Sounds\\ReactorWarning.mp3", false, true);

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

        SuspendTimeOfDay(true);
        
        
        CinematicFilterGenericBJ(5, BLEND_MODE_NONE, "ReplaceableTextures\\CameraMasks\\Black_mask.blp", 0, 0, 0, 0, 0, 0 ,0 ,0);
        DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 5, `Loading, please wait`);
        // Cinematic
    }

    public startGame() {     
        BlzFrameSetAllPoints(BlzGetOriginFrame(ORIGIN_FRAME_WORLD_FRAME, 0), BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0));
        BlzFrameSetVisible(BlzGetFrameByName("ConsoleUIBackdrop",0), false);   
        BlzHideOriginFrames(true);

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

        AbilityHooks.getInstance();
        // Boot our abil hooks
        BootAbilityHooks();
        BootAbilityHooks2();
        // now check existing units
        AbilityHooks.getInstance().checkExistingUnit();
        
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


        AIEntity.getInstance();
        AntiMetaEntity.start();
        EggEntity.getInstance();

        TipEntity.getInstance();

        SpaceEntity.getInstance().initShips();

        const mainShip = SpaceEntity.getInstance().mainShip;
        mainShip.onMoveOrder(new Vector2(mainShip.unit.x + 1500, mainShip.unit.y + 1500));

        labrynthIntro.setVolume(80);
        labrynthIntro.playSound();
        
        Timers.addTimedAction(5, () => {
            // Init chat
            ChatEntity.getInstance().initialise();

            EnablePreSelect(false, false);
            CinematicFadeBJ(bj_CINEFADETYPE_FADEIN, 1.5, "ReplaceableTextures\\CameraMasks\\Black_mask.blp", 0, 0, 0, 0);

            EnableUserUI(true);
            // Camera follow the main ship
            this.followMainShip();
    
            // Start role selection
            ForceEntity.getInstance().getOpts((optResults) => this.postOptResults(optResults));
        });

        // listen to hatchery death event
        EventEntity.listen(EVENT_TYPE.EV_HATCHERY_DEATH, () => {
            PlayNewSound("Sounds\\ComplexBeep.mp3", 127);
            MessageAllPlayers(`[${COL_GOOD}SUCCESS|r] Alien Entity destroyed!`);
            ChatEntity.getInstance().postMessageFor(Players, "Reward", COL_GOLD, "Entity Down! +1000 XP, +700 Credts|r");
                
            CrewFactory.getInstance().allCrew.forEach(crew => {
                if (crew && crew.unit.isAlive()) {
                    crew.addExperience(1000);

                    crew.player.setState(
                        PLAYER_STATE_RESOURCE_GOLD, 
                        crew.player.getState(PLAYER_STATE_RESOURCE_GOLD) + 700
                    );
                   }
            });
            Timers.addTimedAction(10, () => {
                PlayNewSound("Sounds\\ComplexBeep.mp3", 127);
                MessageAllPlayers(`[${COL_ATTATCH}DANGER|r] New Directives: Detecting smaller unknown entity onboard. Seek and destroy.`);
    
            });
        });
    }

    private portalSFX: Effect;
    private visModifiers = [];
    private followMainShip() {
        const mainShip = SpaceEntity.getInstance().mainShip;

        // Clear game messages
        ClearTextMessages();

        // mainShip.unit.addAbility(FourCC('Lcst'))
        mainShip.engine.mass = 0;
        mainShip.engine.velocityForwardMax = 100;
        mainShip.unit.paused = true;
        mainShip.onMoveOrder(new Vector2(mainShip.unit.x + 1500, mainShip.unit.y + 1500));

        const facingData = getYawPitchRollFromVector(new Vector3(1, 1, -0.7));
        this.portalSFX = new Effect(SFX_BLACK_HOLE, mainShip.unit.x + 1300, mainShip.unit.y + 1300);

        this.portalSFX.scale = 15;
        this.portalSFX.z = -200;
        this.portalSFX.setTime(1);
        this.portalSFX.setTimeScale(0.6);
        this.portalSFX.setPitch(facingData.pitch);
        this.portalSFX.setRoll(facingData.roll);
        this.portalSFX.setYaw(facingData.yaw);
        
        warpStormSound.playSound();


        GetActivePlayers().forEach(p => {
            const modifier = CreateFogModifierRect(p.handle, FOG_OF_WAR_VISIBLE, gg_rct_Space, true, false);
            FogModifierStart(modifier);
            this.visModifiers.push(modifier);

            const m = CreateFogModifierRect(p.handle, FOG_OF_WAR_VISIBLE, gg_rct_stationtempvision, true, false);
            FogModifierStart(m);
            this.visModifiers.push(m);
        });
        

        SetCameraTargetController(mainShip.unit.handle, 0, 0, false);

        // MessageAllPlayers("ADding Timed actions!");   
        Timers.addTimedAction(0.5, () => {         
            // MessageAllPlayers("Starting nav test");   
            ChatEntity.getInstance().postMessageFor(Players, "Navigator", "|cff4328ef", "They're right behind us!", undefined, GENERIC_CHAT_SOUND_REF);
        });
        Timers.addTimedAction(2, () => {            
            ChatEntity.getInstance().postMessageFor(Players, "Captain", "|cffFF0000", "Engineer, we need ship diagnostics, now.", undefined, GENERIC_CHAT_SOUND_REF);
        });
        Timers.addTimedAction(4, () => {            
            ChatEntity.getInstance().postMessageFor(Players, "Engineer", "|cfff05b33", "Hopeless. Everything's offline or damaged...", undefined, GENERIC_CHAT_SOUND_REF);
        });
        Timers.addTimedAction(5, () => {            
            ChatEntity.getInstance().postMessageFor(Players, "Engineer", "|cfff05b33", "Only thing left is warp drive.", undefined, GENERIC_CHAT_SOUND_REF);
        });
        Timers.addTimedAction(7, () => {
            PlayNewSound("Sounds\\ComplexBeep.mp3", 127);
            MessageAllPlayers(`[${COL_ATTATCH}INFO|r] Preparing Warp`);
        });   
        Timers.addTimedAction(8, () => {            
            ChatEntity.getInstance().postMessageFor(Players, "Captain", "|cffFF0000", "To all crew, we're initiating emergency warp procedures.", undefined, GENERIC_CHAT_SOUND_REF);
        });

        
        new Timer().start(6, false, () => {
            PlayNewSound("Sounds\\ComplexBeep.mp3", 127);
            MessageAllPlayers(`[${COL_ORANGE}WARNING|r] Scanners detecting unknown entity`);
        });
        new Timer().start(13, false, () => {
            PlayNewSound("Sounds\\ComplexBeep.mp3", 127);
            MessageAllPlayers(`[${COL_ATTATCH}DANGER|r] Warp shielding offline`);
        });
        new Timer().start(16, false, () => {
            PlayNewSound("Sounds\\ComplexBeep.mp3", 127);
            MessageAllPlayers(`[${COL_ATTATCH}DANGER|r] Simulation results: VESSEL DAMAGED 80%, VESSEL DESTROYED 19%`);
        });

        Timers.addTimedAction(6, () => {            
            ChatEntity.getInstance().postMessageFor(Players, "Inquisitor", "|cff6a0dad", "Disciples. Gather and pray for salvation.", undefined, GENERIC_CHAT_SOUND_REF);
        });
        Timers.addTimedAction(9, () => {            
            ChatEntity.getInstance().postMessageFor(Players, "Inquisitor", "|cff6a0dad", "Imperator, ora pro nobis peccatoribus", undefined, GENERIC_CHAT_SOUND_REF);
        });
        Timers.addTimedAction(12, () => {            
            ChatEntity.getInstance().postMessageFor(Players, "Inquisitor", "|cff6a0dad", "Nunc et in hora mortis nostrea.", undefined, GENERIC_CHAT_SOUND_REF);
        });
        // Timers.addTimedAction(12, () => {            
        //     ChatEntity.getInstance().postMessageFor(Players, "Inquisitor", "6a0dad", "In hora mortis meae voca me.", undefined, GENERIC_CHAT_SOUND_REF);
        // });
        Timers.addTimedAction(14.5, () => {            
            ChatEntity.getInstance().postMessageFor(Players, "Captain", "|cffFF0000", "Brace yourselves!", undefined, GENERIC_CHAT_SOUND_REF);
        });
        // Timers.addTimedAction(14, () => {            
        //     ChatEntity.getInstance().postMessageFor(Players, "Inquisitor", "6a0dad", "Et iube me venire ad te.", undefined, GENERIC_CHAT_SOUND_REF);
        // });
        // Timers.addTimedAction(16, () => {            
        //     ChatEntity.getInstance().postMessageFor(Players, "Inquisitor", "6a0dad", "Ut cum Sanctis tuis laudem te.", undefined, GENERIC_CHAT_SOUND_REF);
        // });
        Timers.addTimedAction(16, () => {            
            ChatEntity.getInstance().postMessageFor(Players, "Inquisitor", "|cff6a0dad", "In saecula saeculorum.", undefined, GENERIC_CHAT_SOUND_REF);
        });
        Timers.addTimedAction(20, () => {            
            ChatEntity.getInstance().postMessageFor(Players, "Inquisitor", "|cff6a0dad", "Ave Imperator.", undefined, GENERIC_CHAT_SOUND_REF);
        });

        Timers.addTimedAction(15, () => {
            Players.forEach(p => {                
                SetCameraFieldForPlayer(p.handle, CAMERA_FIELD_TARGET_DISTANCE, 600, 5);
            });  

        });
        new Timer().start(18, false, () => {
            PlayNewSound("Sounds\\ComplexBeep.mp3", 127);
            MessageAllPlayers(`[${COL_ATTATCH}DANGER|r] WARP ENTITY INTERCEPTING VESSEL`);
            CinematicFadeBJ(bj_CINEFADETYPE_FADEOUTIN, 4, "ReplaceableTextures\\CameraMasks\\Black_mask.blp", 0, 0, 0, 0);
            // CinematicFadeBJ(bj_CINEFADETYPE_FADEOUTIN, 4, "ReplaceableTextures\\CameraMasks\\White_mask.blp", 40.00, 50.00, 70.00, 0);

            EnableUserUI(true);
        });

        Timers.addTimedAction(18, () => {            
            PlayNewSound("Sounds\\ShipDamage\\GroanLong1.mp3", 127);
        });
    }

    private stopFollowingMainShip() {
        SetCameraTargetController(undefined, 0, 0, false);
        BlzShowTerrain(true);


        this.visModifiers.forEach(m => {
            FogModifierStop(m);
        })

        // Log.Information("stopping main ship!");
        const mainShip = SpaceEntity.getInstance().mainShip;
        mainShip.engine.mass = 800;
        mainShip.engine.velocityForwardMax = 1400;
        mainShip.unit.paused = false;
        mainShip.engine.goToAStop();

        BlzHideOriginFrames(false);

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
            CrewFactory.getInstance().initCrew();

            this.openingCinematic();

            if (PlayerStateFactory.isSinglePlayer()) {
                Players.forEach(p => p.setState(PLAYER_STATE_RESOURCE_GOLD, 999999));
            }
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
        

        Players.forEach(p => {            
            SetCameraFieldForPlayer(p.handle, CAMERA_FIELD_TARGET_DISTANCE, bj_CAMERA_DEFAULT_DISTANCE, 0);
        });
                
        this.cinematicSound.playSound();
        CameraSetSourceNoise(2, 50);
        PlayNewSound("Sounds\\ComplexBeep.mp3", 127);
        DisplayTextToForce(bj_FORCE_ALL_PLAYERS, `[${COL_ATTATCH}CRITICAL|r] Hull Deteriorating`);
        
        UIEntity.start();
        EnablePreSelect(true, true);

        new Timer().start(2, false, () => {
            PlayNewSound("Sounds\\ShipDamage\\GroanLong2.mp3", 127);
            CinematicFadeBJ(bj_CINEFADETYPE_FADEOUTIN, 2, "ReplaceableTextures\\CameraMasks\\White_mask.blp", 100.00, 100.00, 90.00, 0);           
        
            EnableUserUI(true);
        })

        new Timer().start(3, false, () => {
            SetDayNightModels("DeepFried\\dnclordaeronunit.mdx", "DeepFried\\dnclordaeronunit.mdx");
            CameraSetSourceNoise(5, 50);
        });
        new Timer().start(6, false, () => {
            CameraSetSourceNoise(10, 50);
        });
        new Timer().start(7, false, () => {
            CinematicFadeBJ(bj_CINEFADETYPE_FADEOUTIN, 4, "ReplaceableTextures\\CameraMasks\\Black_mask.blp", 0.00, 0.00, 0.00, 0);
            
            EnableUserUI(true);
            CameraSetSourceNoise(15, 50);
        });
        new Timer().start(9, false, () => {
            PlayNewSound("Sounds\\ExplosionDistant.mp3", 127);
            AskellonEntity.poweredFloors.forEach(p => {
                (WorldEntity.getInstance().askellon.findZone(p) as ShipZone).updatePower(false);
            });
            CameraSetupSetField(GetCurrentCameraSetup(), CAMERA_FIELD_FARZ, 8000, 0.01);
            SetSkyModel("war3mapImported\\Skybox3rNoDepth.mdx");

            warpStormSound.stopSound();
            CameraSetSourceNoise(20, 50);
        });
        new Timer().start(14, false, () => {
            CameraSetSourceNoise(10, 50);
        });
        new Timer().start(16, false, () => {
            CameraSetSourceNoise(5, 50);
            AskellonEntity.poweredFloors.forEach(p => {
                (WorldEntity.getInstance().askellon.findZone(p) as ShipZone).updatePower(true);
            });
            labrynthIntro.stopSound();
        });
        new Timer().start(20, false, () => {
            CameraSetSourceNoise(0, 0);
        });

        new Timer().start(60, false, () => {
            ForceEntity.getInstance().startIntroduction();
        });

    }
}