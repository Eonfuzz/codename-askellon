/** @noSelfInFile **/
import { Ability } from "../ability-type";
import { AbilityModule } from "../ability-module";
import { Vector2, vectorFromUnit } from "../../types/vector2";
import { Vector3 } from "../../types/vector3";
import { Projectile } from "../../weapons/projectile/projectile";
import { ProjectileTargetStatic, ProjectileMoverParabolic } from "../../weapons/projectile/projectile-target";
import { ALIEN_FORCE_NAME, AlienForce } from "app/force/alien-force";
import { SMART_ORDER_ID } from "resources/ability-ids";
import { Trigger, Unit, Effect } from "w3ts";
import { Log } from "lib/serilog/serilog";
import { getZFromXY } from "lib/utils";
import { PlayNewSoundOnUnit } from "lib/translators";
import { SoundWithCooldown, SoundRef } from "app/types/sound-ref";
import { EVENT_TYPE } from "app/events/event";


const CREATE_SFX_EVERY = 0.06;
const EGG_SACK = "Doodads\\Dungeon\\Terrain\\EggSack\\EggSack0.mdl";
const EGG_SOUND = "Units\\Critters\\DuneWorm\\DuneWormDeath1.flac"

const HeartbeatSound = new SoundWithCooldown(4, "Sounds\\Alien Heartbeat.mp3");
const MoistSound = new SoundRef("Sounds\\Moist.mp3", true);
const GREEN_LIGHT = "war3mapImported\\Light_Green_20.mdl";

export class EvolveAbility implements Ability {

    private casterUnit: Unit | undefined;
    private effect: Effect;
    private light: Effect;

    private timeElapsed: number;
    private timeElapsedSinceSFX: number = CREATE_SFX_EVERY;

    private castingOrder: number | undefined;

    private duration: number = 40;
    private visibilityModifier: fogmodifier;

    constructor() {
        this.timeElapsed = 0;
    }

    public initialise(abMod: AbilityModule) {
        this.casterUnit = Unit.fromHandle(GetTriggerUnit());
        this.castingOrder = this.casterUnit.currentOrder;

        this.casterUnit.setVertexColor(255, 255, 255, 0);

        this.visibilityModifier = CreateFogModifierRadius(
            this.casterUnit.owner.handle, 
            FOG_OF_WAR_VISIBLE, 
            this.casterUnit.x, 
            this.casterUnit.y, 
            300, 
            true,
            true
        );
        FogModifierStart(this.visibilityModifier);
        PlayNewSoundOnUnit(EGG_SOUND, this.casterUnit, 127);

        this.effect = new Effect(EGG_SACK, this.casterUnit.x, this.casterUnit.y);
        this.effect.scale = 1.5;
        this.effect.z = getZFromXY(this.casterUnit.x, this.casterUnit.y) - 35;

        this.light = new Effect(GREEN_LIGHT, this.casterUnit.x, this.casterUnit.y);
        this.light.scale = 1.5;
        this.light.z = getZFromXY(this.casterUnit.x, this.casterUnit.y);

        MoistSound.setVolume(90);
        if (GetLocalPlayer() == this.casterUnit.owner.handle) {
            MoistSound.playSound();
        }

        return true;
    };

    public process(abMod: AbilityModule, delta: number) {
        this.timeElapsed += delta;
        this.timeElapsedSinceSFX += delta;

        this.light.z = getZFromXY(this.casterUnit.x, this.casterUnit.y) + 150 + Cos(this.timeElapsed*2) * 100;

        // Don't continue if we interrupt
        if (this.castingOrder !== this.casterUnit.currentOrder) {

            abMod.game.event.sendEvent(EVENT_TYPE.CREW_GAIN_EXPERIENCE, {
                source: this.casterUnit,
                data: { value: -500 }
            });

            return false;
        }

        if (HeartbeatSound.canPlaySound(abMod.game.getTimeStamp())) {
            HeartbeatSound.playSoundOnUnit(this.casterUnit.handle, 127);
        }

        if (this.timeElapsedSinceSFX >= CREATE_SFX_EVERY && this.casterUnit) {
            this.timeElapsedSinceSFX = 0;
        }
        return this.timeElapsed < this.duration;
    };

    
    public destroy(abMod: AbilityModule) {
        if (this.casterUnit) {
            this.casterUnit.setVertexColor(255, 255, 255, 255);
            this.effect.destroy();
            this.light.destroy();
            FogModifierStop(this.visibilityModifier);
        }
        if (GetLocalPlayer() == this.casterUnit.owner.handle) {
            MoistSound.stopSound();
        }
        return true; 
    };
}