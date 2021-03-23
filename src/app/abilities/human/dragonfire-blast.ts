import { AbilityWithDone } from "../ability-type";
import { Vector3 } from "../../types/vector3";
import { Projectile } from "../../weapons/projectile/projectile";
import { ProjectileTargetStatic, ProjectileMoverParabolic } from "../../weapons/projectile/projectile-target";
import { MapPlayer, Unit } from "w3ts";
import { getPointsInRangeWithSpread, getZFromXY } from "lib/utils";
import { PlayNewSoundOnUnit, getYawPitchRollFromVector } from "lib/translators";
import { BUFF_ID } from "resources/buff-ids";
import { CrewFactory } from "app/crewmember/crewmember-factory";
import { DynamicBuffEntity } from "app/buff/dynamic-buff-entity";
import { WeaponEntity } from "app/weapons/weapon-entity";
import { BuffInstanceDuration } from "app/buff/buff-instance-duration-type";

const SPREAD = 45;
const NUM_BULLETS = 26;
const DISTANCE = 300;
const MISSILE_BULLET = 'war3mapImported\\Bullet.mdx';
const MISSILE_BULLET_FIRE = 'Abilities\\Spells\\Other\\BreathOfFire\\BreathOfFireDamage.mdl';
const MISSILE_FIRE_WAVE = 'Abilities\\Spells\\Undead\\DeathCoil\\DeathCoilSpecialArt.mdl';
const FIRE_BREATH = 'Abilities\\Spells\\Other\\BreathOfFire\\BreathOfFireMissile.mdl';


export class DragonFireBlastAbility extends AbilityWithDone {

    private targetLoc: Vector3 | undefined;
    private unitsHit = new Map<number, number>();

    private damageGroup = CreateGroup();

    

    public init() {
        super.init();
        this.unitsHit.clear();

        const sound = PlayNewSoundOnUnit("Sounds\\DragonBreathShotgun.wav", this.casterUnit, 50);

        this.targetLoc =  new Vector3(GetSpellTargetX(), GetSpellTargetY(), 0);
        this.targetLoc.z = getZFromXY(this.targetLoc.x, this.targetLoc.y);


        let casterLoc = new Vector3(this.casterUnit.x, this.casterUnit.y, this.casterUnit.z)
            .projectTowardsGunModel(this.casterUnit.handle);
        const angleDeg = casterLoc.angle2Dto(this.targetLoc);    
        let flameLoc = casterLoc.projectTowards2D(angleDeg, 190);
        const sfx = AddSpecialEffect(FIRE_BREATH, flameLoc.x, flameLoc.y);

        const facingData = getYawPitchRollFromVector(this.targetLoc.subtract(casterLoc).normalise());
        // BlzSetSpecialEffectZ(sfx, facingData.z);

        BlzSetSpecialEffectRoll(sfx, facingData.pitch);
        BlzSetSpecialEffectYaw(sfx, facingData.yaw);
        BlzSetSpecialEffectPitch(sfx, facingData.roll);

        BlzSetSpecialEffectZ(sfx, casterLoc.z-80);
        BlzSetSpecialEffectScale(sfx, 1);
        BlzSetSpecialEffectTimeScale(sfx, 200);
        DestroyEffect(sfx);

        const deltaLocs = getPointsInRangeWithSpread(
            angleDeg - SPREAD,
            angleDeg + SPREAD,
            NUM_BULLETS,
            DISTANCE,
            0.9
        );

        const centerTargetLoc = casterLoc.projectTowards2D(angleDeg, DISTANCE*1.4);
        centerTargetLoc.z = getZFromXY(centerTargetLoc.x, centerTargetLoc.y);

        deltaLocs.forEach((loc, index) => {
            const nX = casterLoc.x + loc.x;
            const nY = casterLoc.y + loc.y;
            const targetLoc = new Vector3(nX, nY, getZFromXY(nX, nY));
            this.fireProjectile(this.casterUnit, targetLoc, false)
                .onCollide((projectile: Projectile, collidesWith: unit) => 
                    this.onProjectileCollide(projectile, collidesWith)
                );
        });

        this.done = true;

        return true;
    };

    
    private fireProjectile(caster: Unit, targetLocation: Vector3, isCentralProjectile: boolean): Projectile {
        const unit = caster.handle;
        // print("Target "+targetLocation.toString())
        let casterLoc = new Vector3(caster.x, caster.y, getZFromXY(caster.x, caster.y)).projectTowardsGunModel(unit);
        let deltaTarget = targetLocation.subtract(casterLoc);

        let projectile = new Projectile(
            unit,
            casterLoc, 
            new ProjectileTargetStatic(deltaTarget)
        );
        projectile.addEffect(
            MISSILE_BULLET,
            new Vector3(0, 0, 0),
            deltaTarget.normalise(),
            1.4
        );
        projectile.addEffect(
            MISSILE_BULLET_FIRE,
            new Vector3(0, 0, 0),
            deltaTarget.normalise(),
            0.4
        );

        WeaponEntity.getInstance().addProjectile(projectile);
        return projectile
            .setCollisionRadius(15)
            .setVelocity(1250);
    }

    public step(delta: number) {};

    public destroy() { 
        DestroyGroup(this.damageGroup);
        return true; 
    };
    
    private onProjectileCollide(projectile: Projectile, collidesWith: unit) {
        projectile.setDestroy(true);
        const timesUnitHit = this.unitsHit.get(GetHandleId(collidesWith)) || 0;
        this.unitsHit.set(GetHandleId(collidesWith), timesUnitHit + 1);

        const crewmember = CrewFactory.getInstance().getCrewmemberForUnit(this.casterUnit);

        // Add fire debuff to unit
        DynamicBuffEntity.getInstance().addBuff(BUFF_ID.FIRE, 
            Unit.fromHandle(collidesWith), 
            new BuffInstanceDuration(this.casterUnit, 10)
        );
        if (crewmember) {
            const damage = (20 * crewmember.getDamageBonusMult()) / Pow(2, timesUnitHit);
            UnitDamageTarget(
                projectile.source, 
                collidesWith, 
                damage, 
                false, 
                true, 
                ATTACK_TYPE_PIERCE, 
                DAMAGE_TYPE_NORMAL, 
                WEAPON_TYPE_WOOD_MEDIUM_STAB
            );
        }
    };
}