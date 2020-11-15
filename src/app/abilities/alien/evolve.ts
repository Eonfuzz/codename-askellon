import { Ability } from "../ability-type";
import { Trigger, Unit, Effect } from "w3ts";
import { getZFromXY } from "lib/utils";
import { PlayNewSoundOnUnit } from "lib/translators";
import { SoundWithCooldown, SoundRef } from "app/types/sound-ref";
import { ABIL_ALIEN_EVOLVE_ARMOR, ABIL_ALIEN_EVOLVE_T1, ABIL_ALIEN_EVOLVE_T2, ABIL_ALIEN_EVOLVE_T3 } from "resources/ability-ids";
import { vectorFromUnit } from "app/types/vector2";
import { Vector3 } from "app/types/vector3";
import { Projectile } from "app/weapons/projectile/projectile";
import { ProjectileTargetStatic, ProjectileMoverParabolic } from "app/weapons/projectile/projectile-target";
import { AlienForce } from "app/force/forces/alien-force";
import { EVENT_TYPE } from "app/events/event-enum";
import { EventEntity } from "app/events/event-entity";
import { WeaponEntity } from "app/weapons/weapon-entity";
import { ALIEN_FORCE_NAME } from "app/force/forces/force-names";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { AbilityHooks } from "../ability-hooks";


const CREATE_SFX_EVERY = 0.06;
const EGG_SACK = "Doodads\\Dungeon\\Terrain\\EggSack\\EggSack0.mdl";
const EGG_SOUND = "Units\\Critters\\DuneWorm\\DuneWormDeath1.flac"
const EGG_HATCH_SOUND = "Units\\Creeps\\Archnathid\\ArachnathidWhat2.flac";

const HeartbeatSound = new SoundWithCooldown(4, "Sounds\\Alien Heartbeat.mp3");
const MoistSound = new SoundRef("Sounds\\Moist.mp3", true, true);
const GREEN_LIGHT = "war3mapImported\\Light_Green_20.mdl";

export class EvolveAbility implements Ability {

    private casterUnit: Unit | undefined;
    private effect: Effect;
    private light: Effect;

    private timeElapsed: number;
    private timeElapsedSinceSFX: number = CREATE_SFX_EVERY;

    private castingOrder: number | undefined;

    private duration: number = 38;
    private visibilityModifier: fogmodifier;

    private completedEvolve = false;
    private toForm: number;

    constructor(toWhichForm: number) {
        this.timeElapsed = 0;
        this.toForm = toWhichForm;
    }

    public initialise() {
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

        this.casterUnit.addAbility(ABIL_ALIEN_EVOLVE_ARMOR);

        return true;
    };

    public process(delta: number) {

        // Is the unit dead?
        if (!this.casterUnit.isAlive() || !this.casterUnit.show) {
            return false;
        }

        this.timeElapsed += delta;
        this.timeElapsedSinceSFX += delta;

        this.light.z = getZFromXY(this.casterUnit.x, this.casterUnit.y) + 150 + Cos(this.timeElapsed*1.1) * 100;
        this.effect.x = this.casterUnit.x;
        this.effect.y = this.casterUnit.y;

        // Don't continue if we interrupt
        if (this.castingOrder !== this.casterUnit.currentOrder) {

            EventEntity.getInstance().sendEvent(EVENT_TYPE.CREW_GAIN_EXPERIENCE, {
                source: this.casterUnit,
                data: { value: -500 }
            });

            return false;
        }

        if (HeartbeatSound.canPlaySound()) {
            HeartbeatSound.playSoundOnUnit(this.casterUnit.handle, 127);
        }

        if (this.timeElapsedSinceSFX >= CREATE_SFX_EVERY && this.casterUnit) {
            this.timeElapsedSinceSFX = 0;
        }

        if (this.timeElapsed >= this.duration) {
            this.completedEvolve = true;

            for (let index = 0; index < 10; index++) {
                this.createGiblet();
            }

            return false;
        }
        return true;
    };

    public createGiblet() {
        
        const tLoc = vectorFromUnit(this.casterUnit.handle);

        const unitHeight = getZFromXY(tLoc.x, tLoc.y);
        const startLoc = new Vector3(tLoc.x, tLoc.y, unitHeight + 80)

        const newTarget = new Vector3(
            startLoc.x + this.getRandomOffset(),
            startLoc.y + this.getRandomOffset(),
            unitHeight
        );

        const projStartLoc = new Vector3(startLoc.x, startLoc.y, unitHeight + 20);
        const projectile = new Projectile(
            this.casterUnit.handle, 
            projStartLoc,
            new ProjectileTargetStatic(newTarget.subtract(startLoc)),
            new ProjectileMoverParabolic(projStartLoc, newTarget, Deg2Rad(GetRandomReal(60,70)))
        )
        .onCollide(() => true);

        projectile.addEffect("Abilities\\Weapons\\MeatwagonMissile\\MeatwagonMissile.mdl", 
            new Vector3(0, 0, 0), newTarget.subtract(startLoc).normalise(), 1
        );

        const bloodSfx = AddSpecialEffect("Objects\\Spawnmodels\\Undead\\UndeadLargeDeathExplode\\UndeadLargeDeathExplode.mdl", startLoc.x, startLoc.y);
        BlzSetSpecialEffectZ(bloodSfx, startLoc.z - 30);
        DestroyEffect(bloodSfx);

        WeaponEntity.getInstance().addProjectile(projectile);
    }

    private getRandomOffset(): number {
        const isNegative = GetRandomInt(0, 1);
        return (isNegative == 1 ? -1 : 1) * Math.max(200, GetRandomInt(0, 800));
    }
    
    public destroy() {
        if (this.casterUnit) {
            this.casterUnit.setVertexColor(255, 255, 255, 255);
            this.effect.destroy();
            this.light.z = 9999;
            this.light.destroy();
            FogModifierStop(this.visibilityModifier);
            this.casterUnit.removeAbility(ABIL_ALIEN_EVOLVE_ARMOR);
            PlayNewSoundOnUnit(EGG_HATCH_SOUND, this.casterUnit, 127);
        }
        if (GetLocalPlayer() == this.casterUnit.owner.handle) {
            MoistSound.stopSound();
        }

        // If we evolved
        if (this.completedEvolve) {
            // get alien force
            const alienForce = PlayerStateFactory.getForce(ALIEN_FORCE_NAME) as AlienForce;
            alienForce.onEvolve(this.toForm);
        }
        return true; 
    };
}
