import { Unit } from "w3ts/handles/unit";
import { getZFromXY } from "lib/utils";
import { WeaponEntity } from "app/weapons/weapon-entity";
import { Ability } from "app/abilities/ability-type";
import { Projectile } from "app/weapons/projectile/projectile";
import { Vector3 } from "app/types/vector3";
import { vectorFromUnit } from "app/types/vector2";
import { ProjectileMoverParabolic, ProjectileTargetStatic } from "app/weapons/projectile/projectile-target";
import { LeapEntity } from "app/leap-engine/leap-entity";
import { Leap } from "app/leap-engine/leap-type";
import { ABIL_ALIEN_WEBSHOT } from "resources/ability-ids";
import { PlayNewSoundOnUnit } from "lib/translators";
import { Log } from "lib/serilog/serilog";
import { SFX_ALIEN_ACID_BALL } from "resources/sfx-paths";
import { Timers } from "app/timer-type";

const MISSILE_LAUNCH_EFFECT = "Abilities\\Spells\\Undead\\Web\\Webmissile.mdl";
const MISSILE_EFFECT = "Models\\sfx\\CocoonMissile.mdx";
const MISSILE_BEAM = "SPNL";
const WEB_SFX = "Models\\sfx\\WebFloor.mdl";

export class WebshotAbility implements Ability {

    private casterUnit: Unit | undefined;
    private targetLoc: Vector3 | undefined;

    private webshotSfx: effect | undefined;

    private webshotMissile: Projectile;
    private webshotTrail: lightning;

    // Used post collision
    private webshotCollided: boolean = false;
    private webshotPullingUs: boolean = true;
    private leapInstance: Leap;
    private webshotGoal: Vector3;
    private finishedLeaping: boolean = false;

    private prevFogModifier: fogmodifier;

    private spawnWebSFXCounter = 0.1;

    public initialise() {
        this.casterUnit = Unit.fromHandle(GetTriggerUnit());

        this.targetLoc =  new Vector3(GetSpellTargetX(), GetSpellTargetY(), 0);
        this.targetLoc.z = getZFromXY(this.targetLoc.x, this.targetLoc.y);

        const polarPoint = vectorFromUnit(this.casterUnit.handle).applyPolarOffset(this.casterUnit.facing, 80);
        const startLoc = new Vector3(polarPoint.x, polarPoint.y, getZFromXY(polarPoint.x, polarPoint.y)+30);

        const deltaTarget = this.targetLoc.subtract(startLoc);
        

        this.webshotMissile = new Projectile(
            this.casterUnit.handle,
            startLoc,
            new ProjectileTargetStatic(deltaTarget),
            new ProjectileMoverParabolic(startLoc, this.targetLoc, Deg2Rad(35))
        )
        .onDeath(() => this.onCollide())
        .onCollide((self, who) => this.onCollide(Unit.fromHandle(who)));

        let webSfx = this.webshotMissile.addEffect(MISSILE_EFFECT, new Vector3(0, 0, 0), deltaTarget.normalise(), 1);

        // webSfx = this.webshotMissile.addEffect(MISSILE_EFFECT_2, new Vector3(0, 0, 0), deltaTarget.normalise(), 1);
        // BlzSetSpecialEffectColor(webSfx, 80, 255, 90);
        // BlzSetSpecialEffectPitch(webSfx, -90 * bj_DEGTORAD);
        BlzSetSpecialEffectScale(webSfx, 1);
        BlzSetSpecialEffectAlpha(webSfx, 120);

        const sfx = AddSpecialEffect(MISSILE_LAUNCH_EFFECT, polarPoint.x, polarPoint.y);
        BlzSetSpecialEffectHeight(sfx, -30);
        DestroyEffect(sfx);

        WeaponEntity.getInstance().addProjectile(this.webshotMissile);

        const projPos = this.webshotMissile.getPosition();
        
        this.webshotTrail = AddLightningEx('WEBB', false, 
            startLoc.x, startLoc.y, startLoc.z, 
            projPos.x, projPos.y, projPos.z
        );

        PlayNewSoundOnUnit("Abilities\\Spells\\Undead\\Web\\WebMissileLaunch1.flac", this.casterUnit, 80);

        return true;
    };

    private onCollide(withWho?: Unit) {
        if (this.webshotCollided) return;

        this.webshotMissile.setDestroy(true);
        
        let pullTowards: boolean = true;

        let startVec: Vector3;
        let goalVec: Vector3;
        let who: Unit;

        PlayNewSoundOnUnit("Abilities\\Spells\\Undead\\Web\\WebTarget1.flac", this.casterUnit, 80);

        try {
            this.webshotCollided = true;
            if (withWho != undefined) {
                // If this is the second level abil we need to pull them to us
                if (this.casterUnit.getAbilityLevel(ABIL_ALIEN_WEBSHOT) >= 2 && !IsUnitIdType(withWho.typeId, UNIT_TYPE_STRUCTURE)) {
                    who = withWho;

                    startVec = Vector3.fromWidget(withWho.handle);

                    goalVec = Vector3.fromWidget(this.casterUnit.handle);
                    goalVec = goalVec.projectTowards2D(goalVec.angle2Dto(startVec), 80);

                    // Also ministun the "Pull towards" unit
                    withWho.pauseEx(true);
                    pullTowards = false;
                }
                // Otherwise pull us to them
                else {
                    who = this.casterUnit;

                    goalVec = Vector3.fromWidget(withWho.handle);
                    startVec = Vector3.fromWidget(this.casterUnit.handle);
                    pullTowards = true;

                    // Also ministun the "Pull towards" unit
                    withWho.pauseEx(true);
                }
            }  
            else {
                who = this.casterUnit;
                // Otherwise pull us to the location of the projectile
                goalVec = this.webshotMissile.getPosition();
                startVec = Vector3.fromWidget(this.casterUnit.handle);
                pullTowards = true;
            }
            
            this.webshotGoal = goalVec;
            this.webshotPullingUs = pullTowards;

            this.leapInstance = LeapEntity.getInstance().newLeap(
                who.handle,
                goalVec,
                40,
                1.4
            );
            this.leapInstance.onFinish(() => this.onJumpPullFinish(withWho));
        }
        catch(e) {
            Log.Error(e);
        }
    }

    private onJumpPullFinish(withWho: Unit) {
        this.finishedLeaping = true;

        if (withWho != undefined) {
            withWho.pauseEx(false);
        }
    }

    public process(delta: number) {
        if (!this.webshotCollided) {
            const polarPoint = vectorFromUnit(this.casterUnit.handle).applyPolarOffset(this.casterUnit.facing, 80);
            const startLoc = new Vector3(polarPoint.x, polarPoint.y, getZFromXY(polarPoint.x, polarPoint.y)+30);

            const projPos = this.webshotMissile.getPosition();
            MoveLightningEx(this.webshotTrail, true, startLoc.x, startLoc.y,  startLoc.z, projPos.x, projPos.y, projPos.z);

            if (this.prevFogModifier) DestroyFogModifier(this.prevFogModifier);
            this.prevFogModifier = CreateFogModifierRadius(this.casterUnit.owner.handle, FOG_OF_WAR_VISIBLE, projPos.x, projPos.y, 400, false, false);
            
                
            this.spawnWebSFXCounter -= delta;
            if (this.spawnWebSFXCounter <= 0) {
                this.spawnWebSFXCounter = 0.1;
                const sfx = AddSpecialEffect(WEB_SFX, projPos.x, projPos.y);
                BlzSetSpecialEffectZ(sfx, projPos.z);
                BlzSetSpecialEffectYaw(sfx, GetRandomReal(0, 360) * bj_DEGTORAD);
                BlzSetSpecialEffectScale(sfx, 0.5);
                BlzSetSpecialEffectAlpha(sfx, 45);
                DestroyEffect(sfx);
            }


            return true;
        }
        // After we've collided we need to "reel" in
        else {
            const movingUnitLoc = this.leapInstance.location;
            const goalLoc = this.webshotGoal;
            
            if (this.webshotPullingUs) {
                const interpLoc = movingUnitLoc.projectTowards2D(movingUnitLoc.angle2Dto(goalLoc), 80);
                MoveLightningEx(this.webshotTrail, true, interpLoc.x, interpLoc.y, interpLoc.z, goalLoc.x, goalLoc.y, goalLoc.z);
            }
            else {
                MoveLightningEx(this.webshotTrail, true, this.casterUnit.x, this.casterUnit.y, goalLoc.z,  movingUnitLoc.x, movingUnitLoc.y, movingUnitLoc.z,);
            }

            return !this.finishedLeaping;
        }
    };
    
    public destroy() { 
        // Log.Information("Ending");
        this.webshotSfx && BlzSetSpecialEffectTimeScale(this.webshotSfx, 10);
        this.webshotSfx && DestroyEffect(this.webshotSfx);
        DestroyLightning(this.webshotTrail)

        if (this.prevFogModifier) DestroyFogModifier(this.prevFogModifier);
        return true; 
    };
}