import { ChatEntity } from "app/chat/chat-entity";
import { EventEntity } from "app/events/event-entity";
import { EVENT_TYPE } from "app/events/event-enum";
import { ForceEntity } from "app/force/force-entity";
import { GENERIC_CHAT_SOUND_REF } from "app/force/forces/force-type";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { SpaceEntity } from "app/space/space-module";
import { AskellonEntity } from "app/station/askellon-entity";
import { Timers } from "app/timer-type";
import { SoundRef } from "app/types/sound-ref";
import { Vector2 } from "app/types/vector2";
import { Vector3 } from "app/types/vector3";
import { Projectile } from "app/weapons/projectile/projectile";
import { ProjectileTargetStatic } from "app/weapons/projectile/projectile-target";
import { WorldEntity } from "app/world/world-entity";
import { ShipZone } from "app/world/zone-types/ship-zone";
import { Log } from "lib/serilog/serilog";
import { getYawPitchRollFromVector, PlayNewSound } from "lib/translators";
import { GetActivePlayers, MessageAllPlayers } from "lib/utils";
import { COL_ATTATCH, COL_ORANGE } from "resources/colours";
import { SFX_BLACK_HOLE, SFX_LASER_1 } from "resources/sfx-paths";
import { UIEntity } from "resources/ui/ui-entity";
import { UNIT_ID_DUMMY_CASTER } from "resources/unit-ids";
import { Effect, MapPlayer, Timer, Unit } from "w3ts";
import { Players } from "w3ts/globals";

export class IntroCinematic {
    private warpStormSound = new SoundRef("Sounds\\WarpStorm.mp3", true, true);
    private labrynthIntro = new SoundRef("Sounds\\Theme\\TheLabrynth.mp3", true, true);
    private warningSound = new SoundRef("Sounds\\ReactorWarning.mp3", false, true);

    private askellonDamageSound1 = new SoundRef("Sounds\\ShipDamage\\GroanLong1.mp3", false, true);
    private askellonDamageSound2 = new SoundRef("Sounds\\ShipDamage\\GroanLong2.mp3", false, true);
    private askellonDestructionAlarm = new SoundRef("Sounds\\ShipDamage\\ShipDestructionAlarm.mp3", false, true);
    private askellonExplosion = new SoundRef("Sounds\\ShipDamage\\ShipExplosion.mp3", false, true);   
    private cinematicSound = new SoundRef("Sounds\\StationStormScreech.mp3", false, true);

    private visionModifiers = [];
    private portalSfx: Effect;

    async setupIntro() {
        this.labrynthIntro.setVolume(80);
        this.labrynthIntro.playSound();

        const mainShip = SpaceEntity.getInstance().mainShip;
        mainShip.onMoveOrder(new Vector2(mainShip.unit.x + 1500, mainShip.unit.y + 1500));
        
        EnablePreSelect(false, false);
        
        await Timers.wait(5);
    }

    async intro() {
        const mainShip = SpaceEntity.getInstance().mainShip;

        CinematicFadeBJ(bj_CINEFADETYPE_FADEIN, 1.5, "ReplaceableTextures\\CameraMasks\\Black_mask.blp", 0, 0, 0, 0);
        EnableUserUI(true);

        // Clear game messages
        ClearTextMessages();

        this.askellonDestructionAlarm.setVolume(40);
        this.askellonDestructionAlarm.playSound();

        // mainShip.unit.addAbility(FourCC('Lcst'))
        mainShip.engine.mass = 0;
        mainShip.engine.velocityForwardMax = 100;
        mainShip.unit.paused = true;
        mainShip.onMoveOrder(new Vector2(mainShip.unit.x + 1500, mainShip.unit.y + 1500));

        const facingData = getYawPitchRollFromVector(new Vector3(1, 1, -0.7));
        const portalSFX = new Effect(SFX_BLACK_HOLE, mainShip.unit.x + 1300, mainShip.unit.y + 1300);

        portalSFX.scale = 15;
        portalSFX.z = -200;
        portalSFX.setTime(1);
        portalSFX.setTimeScale(0.6);
        portalSFX.setPitch(facingData.pitch);
        portalSFX.setRoll(facingData.roll);
        portalSFX.setYaw(facingData.yaw);
        
        this.portalSfx = portalSFX;
        this.warpStormSound.playSound();

        const hostileDummy = new Unit(MapPlayer.fromIndex(25), FourCC('dumy'), 0, 0, bj_UNIT_FACING);


        for (let i = 0; i < 12; i++) {
            BlzFrameSetVisible(BlzGetOriginFrame(ORIGIN_FRAME_COMMAND_BUTTON, i), true);            
        }
        
        GetActivePlayers().forEach(p => {
            const modifier = CreateFogModifierRect(p.handle, FOG_OF_WAR_VISIBLE, gg_rct_Space, true, false);
            FogModifierStart(modifier);
            this.visionModifiers.push(modifier);

            const m = CreateFogModifierRect(p.handle, FOG_OF_WAR_VISIBLE, gg_rct_stationtempvision, true, false);
            FogModifierStart(m);
            this.visionModifiers.push(m);
        });
        

        SetCameraTargetController(mainShip.unit.handle, 0, 0, false);

        
        await Promise.all([ 
            this.captainChatMessages(),
            this.inquistorChatMessages(),
            this.navigatorChatMessages(),
            this.engineerChatMessages(),
            this.systemChatMessages(),
            this.shipSounds(),
            this.hostileProjectiles(mainShip.unit, hostileDummy)
        ]);

        return;
    }

    private async captainChatMessages() {
        await Timers.wait(2, 'captain'); 
        // MessageAllPlayers("Capt 2");
        ChatEntity.postMessageFor(Players, "Captain", "|cffFF0000", "Engineer, we need ship diagnostics, now.", undefined, GENERIC_CHAT_SOUND_REF);
        await Timers.wait(9, 'captain'); 
        ChatEntity.postMessageFor(Players, "Captain", "|cffFF0000", "To all crew, we're initiating emergency warp procedures.", undefined, GENERIC_CHAT_SOUND_REF);
        await Timers.wait(5, 'captain'); 
        ChatEntity.postMessageFor(Players, "Captain", "|cffFF0000", "Brace yourselves!", undefined, GENERIC_CHAT_SOUND_REF);
    }

    private async navigatorChatMessages() {
        await Timers.wait(2.5); 
        ChatEntity.postMessageFor(Players, "Navigator", "|cff4328ef", "They're right behind us!", undefined, GENERIC_CHAT_SOUND_REF);
    }

    private async engineerChatMessages() {
        await Timers.wait(4, 'engineer'); 
        ChatEntity.postMessageFor(Players, "Engineer", "|cfff05b33", "Hopeless. Everything's offline or damaged...", undefined, GENERIC_CHAT_SOUND_REF);
        await Timers.wait(3, 'engineer'); 
        ChatEntity.postMessageFor(Players, "Engineer", "|cfff05b33", "Only thing left is warp drive.", undefined, GENERIC_CHAT_SOUND_REF);
    }

    private async inquistorChatMessages() {
        await Timers.wait(3); 
        ChatEntity.postMessageFor(Players, "Inquisitor", "|cff6a0dad", "Disciples. Gather and pray for salvation.", undefined, GENERIC_CHAT_SOUND_REF);
        await Timers.wait(5); 
        ChatEntity.postMessageFor(Players, "Inquisitor", "|cff6a0dad", "Imperator, ora pro nobis peccatoribus", undefined, GENERIC_CHAT_SOUND_REF);
        await Timers.wait(4); 
        ChatEntity.postMessageFor(Players, "Inquisitor", "|cff6a0dad", "Nunc et in hora mortis nostrea.", undefined, GENERIC_CHAT_SOUND_REF);
        await Timers.wait(4); 
        ChatEntity.postMessageFor(Players, "Inquisitor", "|cff6a0dad", "In saecula saeculorum.", undefined, GENERIC_CHAT_SOUND_REF);
        await Timers.wait(2); 
        ChatEntity.postMessageFor(Players, "Inquisitor", "|cff6a0dad", "Ave Imperator.", undefined, GENERIC_CHAT_SOUND_REF);
    }

    private async systemChatMessages() {
        await Timers.wait(12);          
        PlayNewSound("Sounds\\ComplexBeep.mp3", 127);
        MessageAllPlayers(`[${COL_ATTATCH}INFO|r] Preparing Warp`);

        await Timers.wait(2);        
        PlayNewSound("Sounds\\ComplexBeep.mp3", 127);
        MessageAllPlayers(`[${COL_ORANGE}WARNING|r] Scanners detecting unknown entity`);  
        
        await Timers.wait(2);        
        PlayNewSound("Sounds\\ComplexBeep.mp3", 127);
        MessageAllPlayers(`[${COL_ATTATCH}DANGER|r] Warp shielding offline`);

        await Timers.wait(2);        
        PlayNewSound("Sounds\\ComplexBeep.mp3", 127);
        MessageAllPlayers(`[${COL_ATTATCH}DANGER|r] Simulation results: VESSEL DAMAGED 80%, VESSEL DESTROYED 19%`);

        await Timers.wait(2);
        PlayNewSound("Sounds\\ComplexBeep.mp3", 127);
        MessageAllPlayers(`[${COL_ATTATCH}DANGER|r] WARP ENTITY INTERCEPTING VESSEL`);
        CinematicFadeBJ(bj_CINEFADETYPE_FADEOUTIN, 4, "ReplaceableTextures\\CameraMasks\\Black_mask.blp", 0, 0, 0, 0);
        EnableUserUI(true);
    }

    private async hostileProjectiles(mainShip: Unit, hostileDummy: Unit) {
        const shipLoc = Vector3.fromWidget(mainShip.handle);
        const sourceLoc = Vector3.fromWidget(mainShip.handle).add(new Vector3(-600, -600, 0));

        // const hostileDummy = new Unit(PlayerStateFactory.AlienAIPlayer1, UNIT_ID_DUMMY_CASTER, sourceLoc.x, sourceLoc.y);

        this.spawnProj(hostileDummy, shipLoc, sourceLoc);
        await Timers.wait(0.5);
        this.spawnProj(hostileDummy, shipLoc, sourceLoc);
        this.spawnProj(hostileDummy, shipLoc, sourceLoc);
        await Timers.wait(1);        
        this.spawnProj(hostileDummy, shipLoc, sourceLoc);
        this.spawnProj(hostileDummy, shipLoc, sourceLoc);
        this.spawnProj(hostileDummy, shipLoc, sourceLoc);
        this.spawnProj(hostileDummy, shipLoc, sourceLoc);
        this.spawnProj(hostileDummy, shipLoc, sourceLoc);
        this.spawnProj(hostileDummy, shipLoc, sourceLoc);
        this.spawnProj(hostileDummy, shipLoc, sourceLoc);
    }

    private spawnProj(forDummy: Unit, shipLoc: Vector3, sourceLoc: Vector3) {
        const startLoc = sourceLoc.add(new Vector3(
            Math.random() * 300 - 150, 
            Math.random() * 300 - 150, 
            45
        ));
        const goalLoc = shipLoc.add(new Vector3(
            Math.random() * 300 - 150, 
            Math.random() * 300 - 150, 
            5
        ));
        const deltaLoc = goalLoc.subtract(startLoc);

        const projectile = new Projectile(
            forDummy.handle,
            startLoc,
            new ProjectileTargetStatic(deltaLoc)
        )
        .setVelocity(450)
        .onCollide(() => true);
        projectile.addEffect(SFX_LASER_1, new Vector3(0, 0, 0), deltaLoc.normalise(), 1);
        EventEntity.send(EVENT_TYPE.ADD_PROJECTILE, { source: forDummy, data: { projectile: projectile }});
    }

    private async shipSounds() {
        await Timers.wait(15);        
        Players.forEach(p => SetCameraFieldForPlayer(p.handle, CAMERA_FIELD_TARGET_DISTANCE, 600, 5));  

        await Timers.wait(3);                  
        PlayNewSound("Sounds\\ShipDamage\\GroanLong1.mp3", 127);
    }

    public async introInteriorCinematic() {
        Players.forEach(p => {            
            SetCameraFieldForPlayer(p.handle, CAMERA_FIELD_TARGET_DISTANCE, bj_CAMERA_DEFAULT_DISTANCE, 0);
        });
                
        this.cinematicSound.playSound();
        CameraSetSourceNoise(2, 50);
        PlayNewSound("Sounds\\ComplexBeep.mp3", 127);
        DisplayTextToForce(bj_FORCE_ALL_PLAYERS, `[${COL_ATTATCH}CRITICAL|r] Hull Deteriorating`);
        
        UIEntity.start();
        EnablePreSelect(true, true);


        this.stopInteriorCinematic();
        
        await Timers.wait(2);  
        PlayNewSound("Sounds\\ShipDamage\\GroanLong2.mp3", 127);
        CinematicFadeBJ(bj_CINEFADETYPE_FADEOUTIN, 2, "ReplaceableTextures\\CameraMasks\\White_mask.blp", 100.00, 100.00, 90.00, 0);  
        EnableUserUI(true);

        await Timers.wait(1); 
        this.askellonDestructionAlarm.stopSound();
        SetDayNightModels("DeepFried\\dnclordaeronunit.mdx", "DeepFried\\dnclordaeronunit.mdx");
        CameraSetSourceNoise(5, 50);
        
        await Timers.wait(3); 
        CameraSetSourceNoise(10, 50);

        await Timers.wait(1); 
        CinematicFadeBJ(bj_CINEFADETYPE_FADEOUTIN, 4, "ReplaceableTextures\\CameraMasks\\Black_mask.blp", 0.00, 0.00, 0.00, 0);
        
        EnableUserUI(true);
        CameraSetSourceNoise(15, 50);

        await Timers.wait(2); 
        PlayNewSound("Sounds\\ExplosionDistant.mp3", 127);
        AskellonEntity.poweredFloors.forEach(p => {
            (WorldEntity.getInstance().askellon.findZone(p) as ShipZone).updatePower(false);
        });
        CameraSetupSetField(GetCurrentCameraSetup(), CAMERA_FIELD_FARZ, 8000, 0.01);
        SetSkyModel("war3mapImported\\Skybox3rNoDepth.mdx");

        this.warpStormSound.stopSound();
        CameraSetSourceNoise(20, 50);

        await Timers.wait(4); 
        CameraSetSourceNoise(10, 50);

        await Timers.wait(2); 
        CameraSetSourceNoise(5, 50);
        AskellonEntity.poweredFloors.forEach(p => {
            (WorldEntity.getInstance().askellon.findZone(p) as ShipZone).updatePower(true);
        });
        this.labrynthIntro.stopSound();

        await Timers.wait(4); 
        CameraSetSourceNoise(0, 0);

        new Timer().start(60, false, () => {
            ForceEntity.getInstance().startIntroduction();
        });
    }

    async stopInteriorCinematic() {
        SetCameraTargetController(undefined, 0, 0, false);
        BlzShowTerrain(true);

        this.visionModifiers.forEach(m => {
            FogModifierStop(m);
        })
    
        // Log.Information("stopping main ship!");
        const mainShip = SpaceEntity.getInstance().mainShip;
        mainShip.engine.mass = 800;
        mainShip.engine.velocityForwardMax = 1400;
        mainShip.unit.paused = false;
        mainShip.engine.goToAStop();
    
        BlzHideOriginFrames(false);
    
        this.portalSfx.destroy();
        Players.forEach(p => mainShip.unit.shareVision(p, false));
    }
}