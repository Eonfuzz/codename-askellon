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

const MISSILE_LAUNCH_EFFECT = "someWebShot";
const MISSILE_EFFECT = "someWebShot";
const MISSILE_BEAM = "SOME";

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

        this.webshotMissile.addEffect(MISSILE_EFFECT, new Vector3(0, 0, 0), deltaTarget.normalise(), 1);

        const sfx = AddSpecialEffect(MISSILE_LAUNCH_EFFECT, polarPoint.x, polarPoint.y);
        BlzSetSpecialEffectHeight(sfx, -30);
        DestroyEffect(sfx);

        WeaponEntity.getInstance().addProjectile(this.webshotMissile);

        const projPos = this.webshotMissile.getPosition();
        
        this.webshotTrail = AddLightningEx(MISSILE_BEAM, false, 
            startLoc.x, startLoc.y, startLoc.z, 
            projPos.x, projPos.y, projPos.z
        );

        return true;
    };

    private onCollide(withWho?: Unit) {
        let pullTowards: boolean = true;

        let startVec: Vector3;
        let goalVec: Vector3;
        let who: Unit;

        if (withWho != undefined) {
            // If this is the second level abil we need to pull them to us
            if (this.casterUnit.getAbilityLevel(ABIL_WEBSHOT) > 1) {
                who = withWho;

                goalVec = Vector3.fromWidget(this.casterUnit.handle);
                startVec = Vector3.fromWidget(withWho.handle);

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

        LeapEntity.getInstance().newLeap(
            who.handle,
            goalVec,
            55,
            2.5
        ).onFinish(() => this.onJumpPullFinish(withWho));
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
            return true;
        }
        // After we've collided we need to "reel" in
        else {
            const movingUnitLoc = this.leapInstance.location;
            const goalLoc = this.webshotGoal;
            
            if (this.webshotPullingUs) {
                MoveLightningEx(this.webshotTrail, true, movingUnitLoc.x, movingUnitLoc.y,  movingUnitLoc.z, goalLoc.x, goalLoc.y, goalLoc.z);
            }
            else {
                MoveLightningEx(this.webshotTrail, true, goalLoc.x, goalLoc.y, goalLoc.z,  movingUnitLoc.x, movingUnitLoc.y, movingUnitLoc.z,);
            }

            return this.finishedLeaping;
        }
    };
    
    public destroy() { 
        // Log.Information("Ending");
        this.webshotSfx && BlzSetSpecialEffectTimeScale(this.webshotSfx, 10);
        this.webshotSfx && DestroyEffect(this.webshotSfx);

        return true; 
    };
}