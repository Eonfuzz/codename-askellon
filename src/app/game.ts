import { Trigger, MapPlayer, Timer, Effect, playerColors } from "w3ts";
import { Log } from "lib/serilog/serilog";
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
import { IntroCinematic } from "./cinematics/intro-cinematic";

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
    
    private introCinematic = new IntroCinematic();

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
        
        
        EnableUserUI(false);
        CinematicFilterGenericBJ(5, BLEND_MODE_NONE, "ReplaceableTextures\\CameraMasks\\Black_mask.blp", 0, 0, 0, 0, 0, 0 ,0 ,0);
        DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 5, `Loading, please wait`);
        // Cinematic
    }

    public async startGame() {     
        BlzFrameSetAllPoints(BlzGetOriginFrame(ORIGIN_FRAME_WORLD_FRAME, 0), BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0));
        BlzFrameSetVisible(BlzGetFrameByName("ConsoleUIBackdrop",0), false);   
        BlzHideOriginFrames(true);

        InputManager.getInstance();
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

        PlayerStateFactory.getInstance();


        await this.introCinematic.setupIntro();

        // Init chat
        ChatEntity.getInstance().initialise();

        // Start role selection
        ForceEntity.getInstance().getOpts((optResults) => this.postOptResults(optResults));

        await this.introCinematic.intro();



        
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


    postOptResults(optResults: OptResult[]) {
        try {
            this.introCinematic.introInteriorCinematic();
            // Init forces
            ForceEntity.getInstance().initForcesFor(optResults);       

            // Init crew
            CrewFactory.getInstance().initCrew();

            if (PlayerStateFactory.isSinglePlayer()) {
                Players.forEach(p => p.setState(PLAYER_STATE_RESOURCE_GOLD, 999999));
            }
        }
        catch (e) {
            Log.Error(e);
        }
    }

}