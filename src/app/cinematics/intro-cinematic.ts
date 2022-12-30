import { ChatEntity } from "app/chat/chat-entity";
import { ForceEntity } from "app/force/force-entity";
import { GENERIC_CHAT_SOUND_REF } from "app/force/forces/force-type";
import { SpaceEntity } from "app/space/space-module";
import { AskellonEntity } from "app/station/askellon-entity";
import { Timers } from "app/timer-type";
import { SoundRef } from "app/types/sound-ref";
import { Vector2 } from "app/types/vector2";
import { Vector3 } from "app/types/vector3";
import { WorldEntity } from "app/world/world-entity";
import { ShipZone } from "app/world/zone-types/ship-zone";
import { getYawPitchRollFromVector, PlayNewSound } from "lib/translators";
import { GetActivePlayers, MessageAllPlayers } from "lib/utils";
import { COL_ATTATCH, COL_ORANGE } from "resources/colours";
import { SFX_BLACK_HOLE } from "resources/sfx-paths";
import { UIEntity } from "resources/ui/ui-entity";
import { Effect, Timer } from "w3ts";
import { Players } from "w3ts/globals";

export class introCinematic {
    private warpStormSound = new SoundRef("Sounds\\WarpStorm.mp3", true, true);
    private labrynthIntro = new SoundRef("Sounds\\Theme\\TheLabrynth.mp3", true, true);
    private warningSound = new SoundRef("Sounds\\ReactorWarning.mp3", false, true);

    private askellonDamageSound1 = new SoundRef("Sounds\\ShipDamage\\GroanLong1.mp3", false, true);
    private askellonDamageSound2 = new SoundRef("Sounds\\ShipDamage\\GroanLong2.mp3", false, true);
    private askellonDestructionAlarm = new SoundRef("Sounds\\ShipDamage\\ShipDestructionAlarm.mp3", false, true);
    private askellonExplosion = new SoundRef("Sounds\\ShipDamage\\ShipExplosion.mp3", false, true);   
    private cinematicSound = new SoundRef("Sounds\\StationStormScreech.mp3", false, true);

    async intro() {
        this.labrynthIntro.setVolume(80);
        this.labrynthIntro.playSound();

        const mainShip = SpaceEntity.getInstance().mainShip;
        mainShip.onMoveOrder(new Vector2(mainShip.unit.x + 1500, mainShip.unit.y + 1500));
        
        await Timers.awaitTime(5);
        
        EnablePreSelect(false, false);
        CinematicFadeBJ(bj_CINEFADETYPE_FADEIN, 1.5, "ReplaceableTextures\\CameraMasks\\Black_mask.blp", 0, 0, 0, 0);

        EnableUserUI(true);
        // Camera follow the main ship
        // this.followMainShip();
        
        return;
    }
}

// export async function introCinematic () {    
    

    
        
//     Timers.addTimedAction(5, () => {

//     });

    
//     openingCinematic() {
//         for (let i = 0; i < 12; i++) {
//             BlzFrameSetVisible(BlzGetOriginFrame(ORIGIN_FRAME_COMMAND_BUTTON, i), true);            
//         }
        

//         Players.forEach(p => {            
//             SetCameraFieldForPlayer(p.handle, CAMERA_FIELD_TARGET_DISTANCE, bj_CAMERA_DEFAULT_DISTANCE, 0);
//         });
                
//         cinematicSound.playSound();
//         CameraSetSourceNoise(2, 50);
//         PlayNewSound("Sounds\\ComplexBeep.mp3", 127);
//         DisplayTextToForce(bj_FORCE_ALL_PLAYERS, `[${COL_ATTATCH}CRITICAL|r] Hull Deteriorating`);
        
//         UIEntity.start();
//         EnablePreSelect(true, true);

//         new Timer().start(2, false, () => {
//             PlayNewSound("Sounds\\ShipDamage\\GroanLong2.mp3", 127);
//             CinematicFadeBJ(bj_CINEFADETYPE_FADEOUTIN, 2, "ReplaceableTextures\\CameraMasks\\White_mask.blp", 100.00, 100.00, 90.00, 0);           
        
//             EnableUserUI(true);
//         })

//         new Timer().start(3, false, () => {
//             SetDayNightModels("DeepFried\\dnclordaeronunit.mdx", "DeepFried\\dnclordaeronunit.mdx");
//             CameraSetSourceNoise(5, 50);
//         });
//         new Timer().start(6, false, () => {
//             CameraSetSourceNoise(10, 50);
//         });
//         new Timer().start(7, false, () => {
//             CinematicFadeBJ(bj_CINEFADETYPE_FADEOUTIN, 4, "ReplaceableTextures\\CameraMasks\\Black_mask.blp", 0.00, 0.00, 0.00, 0);
            
//             EnableUserUI(true);
//             CameraSetSourceNoise(15, 50);
//         });
//         new Timer().start(9, false, () => {
//             PlayNewSound("Sounds\\ExplosionDistant.mp3", 127);
//             AskellonEntity.poweredFloors.forEach(p => {
//                 (WorldEntity.getInstance().askellon.findZone(p) as ShipZone).updatePower(false);
//             });
//             CameraSetupSetField(GetCurrentCameraSetup(), CAMERA_FIELD_FARZ, 8000, 0.01);
//             SetSkyModel("war3mapImported\\Skybox3rNoDepth.mdx");

//             warpStormSound.stopSound();
//             CameraSetSourceNoise(20, 50);
//         });
//         new Timer().start(14, false, () => {
//             CameraSetSourceNoise(10, 50);
//         });
//         new Timer().start(16, false, () => {
//             CameraSetSourceNoise(5, 50);
//             AskellonEntity.poweredFloors.forEach(p => {
//                 (WorldEntity.getInstance().askellon.findZone(p) as ShipZone).updatePower(true);
//             });
//             labrynthIntro.stopSound();
//         });
//         new Timer().start(20, false, () => {
//             CameraSetSourceNoise(0, 0);
//         });

//         new Timer().start(60, false, () => {
//             ForceEntity.getInstance().startIntroduction();
//         });

//     }
// }

// private portalSFX: Effect;
// private visModifiers = [];
// private followMainShip() {
//     const mainShip = SpaceEntity.getInstance().mainShip;

//     // Clear game messages
//     ClearTextMessages();

//     // mainShip.unit.addAbility(FourCC('Lcst'))
//     mainShip.engine.mass = 0;
//     mainShip.engine.velocityForwardMax = 100;
//     mainShip.unit.paused = true;
//     mainShip.onMoveOrder(new Vector2(mainShip.unit.x + 1500, mainShip.unit.y + 1500));

//     const facingData = getYawPitchRollFromVector(new Vector3(1, 1, -0.7));
//     this.portalSFX = new Effect(SFX_BLACK_HOLE, mainShip.unit.x + 1300, mainShip.unit.y + 1300);

//     this.portalSFX.scale = 15;
//     this.portalSFX.z = -200;
//     this.portalSFX.setTime(1);
//     this.portalSFX.setTimeScale(0.6);
//     this.portalSFX.setPitch(facingData.pitch);
//     this.portalSFX.setRoll(facingData.roll);
//     this.portalSFX.setYaw(facingData.yaw);
    
//     warpStormSound.playSound();


//     GetActivePlayers().forEach(p => {
//         const modifier = CreateFogModifierRect(p.handle, FOG_OF_WAR_VISIBLE, gg_rct_Space, true, false);
//         FogModifierStart(modifier);
//         this.visModifiers.push(modifier);

//         const m = CreateFogModifierRect(p.handle, FOG_OF_WAR_VISIBLE, gg_rct_stationtempvision, true, false);
//         FogModifierStart(m);
//         this.visModifiers.push(m);
//     });
    

//     SetCameraTargetController(mainShip.unit.handle, 0, 0, false);

//     // MessageAllPlayers("ADding Timed actions!");   
//     Timers.addTimedAction(0.5, () => {         
//         // MessageAllPlayers("Starting nav test");   
//         ChatEntity.getInstance().postMessageFor(Players, "Navigator", "|cff4328ef", "They're right behind us!", undefined, GENERIC_CHAT_SOUND_REF);
//     });
//     Timers.addTimedAction(2, () => {            
//         ChatEntity.getInstance().postMessageFor(Players, "Captain", "|cffFF0000", "Engineer, we need ship diagnostics, now.", undefined, GENERIC_CHAT_SOUND_REF);
//     });
//     Timers.addTimedAction(4, () => {            
//         ChatEntity.getInstance().postMessageFor(Players, "Engineer", "|cfff05b33", "Hopeless. Everything's offline or damaged...", undefined, GENERIC_CHAT_SOUND_REF);
//     });
//     Timers.addTimedAction(5, () => {            
//         ChatEntity.getInstance().postMessageFor(Players, "Engineer", "|cfff05b33", "Only thing left is warp drive.", undefined, GENERIC_CHAT_SOUND_REF);
//     });
//     Timers.addTimedAction(7, () => {
//         PlayNewSound("Sounds\\ComplexBeep.mp3", 127);
//         MessageAllPlayers(`[${COL_ATTATCH}INFO|r] Preparing Warp`);
//     });   
//     Timers.addTimedAction(8, () => {            
//         ChatEntity.getInstance().postMessageFor(Players, "Captain", "|cffFF0000", "To all crew, we're initiating emergency warp procedures.", undefined, GENERIC_CHAT_SOUND_REF);
//     });

    
//     new Timer().start(6, false, () => {
//         PlayNewSound("Sounds\\ComplexBeep.mp3", 127);
//         MessageAllPlayers(`[${COL_ORANGE}WARNING|r] Scanners detecting unknown entity`);
//     });
//     new Timer().start(13, false, () => {
//         PlayNewSound("Sounds\\ComplexBeep.mp3", 127);
//         MessageAllPlayers(`[${COL_ATTATCH}DANGER|r] Warp shielding offline`);
//     });
//     new Timer().start(16, false, () => {
//         PlayNewSound("Sounds\\ComplexBeep.mp3", 127);
//         MessageAllPlayers(`[${COL_ATTATCH}DANGER|r] Simulation results: VESSEL DAMAGED 80%, VESSEL DESTROYED 19%`);
//     });

//     Timers.addTimedAction(6, () => {            
//         ChatEntity.getInstance().postMessageFor(Players, "Inquisitor", "|cff6a0dad", "Disciples. Gather and pray for salvation.", undefined, GENERIC_CHAT_SOUND_REF);
//     });
//     Timers.addTimedAction(9, () => {            
//         ChatEntity.getInstance().postMessageFor(Players, "Inquisitor", "|cff6a0dad", "Imperator, ora pro nobis peccatoribus", undefined, GENERIC_CHAT_SOUND_REF);
//     });
//     Timers.addTimedAction(12, () => {            
//         ChatEntity.getInstance().postMessageFor(Players, "Inquisitor", "|cff6a0dad", "Nunc et in hora mortis nostrea.", undefined, GENERIC_CHAT_SOUND_REF);
//     });
//     // Timers.addTimedAction(12, () => {            
//     //     ChatEntity.getInstance().postMessageFor(Players, "Inquisitor", "6a0dad", "In hora mortis meae voca me.", undefined, GENERIC_CHAT_SOUND_REF);
//     // });
//     Timers.addTimedAction(14.5, () => {            
//         ChatEntity.getInstance().postMessageFor(Players, "Captain", "|cffFF0000", "Brace yourselves!", undefined, GENERIC_CHAT_SOUND_REF);
//     });
//     // Timers.addTimedAction(14, () => {            
//     //     ChatEntity.getInstance().postMessageFor(Players, "Inquisitor", "6a0dad", "Et iube me venire ad te.", undefined, GENERIC_CHAT_SOUND_REF);
//     // });
//     // Timers.addTimedAction(16, () => {            
//     //     ChatEntity.getInstance().postMessageFor(Players, "Inquisitor", "6a0dad", "Ut cum Sanctis tuis laudem te.", undefined, GENERIC_CHAT_SOUND_REF);
//     // });
//     Timers.addTimedAction(16, () => {            
//         ChatEntity.getInstance().postMessageFor(Players, "Inquisitor", "|cff6a0dad", "In saecula saeculorum.", undefined, GENERIC_CHAT_SOUND_REF);
//     });
//     Timers.addTimedAction(20, () => {            
//         ChatEntity.getInstance().postMessageFor(Players, "Inquisitor", "|cff6a0dad", "Ave Imperator.", undefined, GENERIC_CHAT_SOUND_REF);
//     });

//     Timers.addTimedAction(15, () => {
//         Players.forEach(p => {                
//             SetCameraFieldForPlayer(p.handle, CAMERA_FIELD_TARGET_DISTANCE, 600, 5);
//         });  

//     });
//     new Timer().start(18, false, () => {
//         PlayNewSound("Sounds\\ComplexBeep.mp3", 127);
//         MessageAllPlayers(`[${COL_ATTATCH}DANGER|r] WARP ENTITY INTERCEPTING VESSEL`);
//         CinematicFadeBJ(bj_CINEFADETYPE_FADEOUTIN, 4, "ReplaceableTextures\\CameraMasks\\Black_mask.blp", 0, 0, 0, 0);
//         // CinematicFadeBJ(bj_CINEFADETYPE_FADEOUTIN, 4, "ReplaceableTextures\\CameraMasks\\White_mask.blp", 40.00, 50.00, 70.00, 0);

//         EnableUserUI(true);
//     });

//     Timers.addTimedAction(18, () => {            
//         PlayNewSound("Sounds\\ShipDamage\\GroanLong1.mp3", 127);
//     });
// }
// export const stopFollowingMainShip() {
//     SetCameraTargetController(undefined, 0, 0, false);
//     BlzShowTerrain(true);


//     this.visModifiers.forEach(m => {
//         FogModifierStop(m);
//     })

//     // Log.Information("stopping main ship!");
//     const mainShip = SpaceEntity.getInstance().mainShip;
//     mainShip.engine.mass = 800;
//     mainShip.engine.velocityForwardMax = 1400;
//     mainShip.unit.paused = false;
//     mainShip.engine.goToAStop();

//     BlzHideOriginFrames(false);

//     this.portalSFX.destroy();
//     Players.forEach(p => mainShip.unit.shareVision(p, false));
// }