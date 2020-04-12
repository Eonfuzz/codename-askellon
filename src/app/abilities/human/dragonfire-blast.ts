import { Ability } from "../ability-type";
import { AbilityModule } from "../ability-module";
import { Vector2, vectorFromUnit } from "../../types/vector2";
import { Log } from "../../../lib/serilog/serilog";
import { Vector3 } from "../../types/vector3";
import { Projectile } from "../../weapons/projectile/projectile";
import { ProjectileTargetStatic, ProjectileMoverParabolic } from "../../weapons/projectile/projectile-target";
import { FilterIsEnemyAndAlive } from "../../../resources/filters";
import { MapPlayer, Unit } from "w3ts";
import { getPointsInRangeWithSpread, getZFromXY } from "lib/utils";
import { WeaponModule } from "app/weapons/weapon-module";
import { PlayNewSoundOnUnit, getYawPitchRollFromVector } from "lib/translators";
import { BUFF_ID } from "resources/buff-ids";
import { BuffInstanceDuration } from "app/buff/buff-instance";

/** @noSelfInFile **/
const SPREAD = 45;
const NUM_BULLETS = 26;
const DISTANCE = 300;
const MISSILE_BULLET = 'war3mapImported\\Bullet.mdx';
const MISSILE_BULLET_FIRE = 'Abilities\\Spells\\Other\\BreathOfFire\\BreathOfFireDamage.mdl';
const MISSILE_FIRE_WAVE = 'Abilities\\Spells\\Undead\\DeathCoil\\DeathCoilSpecialArt.mdl';
const FIRE_BREATH = 'Abilities\\Spells\\Other\\BreathOfFire\\BreathOfFireMissile.mdl';


export class DragonFireBlastAbility implements Ability {

    private casterUnit: Unit | undefined;
    private targetLoc: Vector3 | undefined;
    private unitsHit = new Map<unit, number>();

    private damageGroup = CreateGroup();

    constructor() {}

    public initialise(module: AbilityModule) {
        this.casterUnit = Unit.fromHandle(GetTriggerUnit());
        this.unitsHit.clear();

        const sound = PlayNewSoundOnUnit("Sounds\\ShotgunShoot.mp3", this.casterUnit, 50);

        this.targetLoc =  new Vector3(GetSpellTargetX(), GetSpellTargetY(), 0);
        this.targetLoc.z = module.game.getZFromXY(this.targetLoc.x, this.targetLoc.y);


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
            this.fireProjectile(module.game.weaponModule, this.casterUnit, targetLoc, false)
                .onCollide((weaponModule: WeaponModule, projectile: Projectile, collidesWith: unit) => 
                    this.onProjectileCollide(module.game.weaponModule, projectile, collidesWith)
                );
        });

        return true;
    };

    
    private fireProjectile(weaponModule: WeaponModule, caster: Unit, targetLocation: Vector3, isCentralProjectile: boolean): Projectile {
        const unit = caster.handle;
        // print("Target "+targetLocation.toString())
        let casterLoc = new Vector3(GetUnitX(unit), GetUnitY(unit), BlzGetUnitZ(unit)).projectTowardsGunModel(unit);
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

        weaponModule.addProjectile(projectile);
        return projectile
            .setCollisionRadius(15)
            .setVelocity(1250);
    }

    public process(abMod: AbilityModule, delta: number) {
        return true;
    };

    public destroy(module: AbilityModule) { 
        DestroyGroup(this.damageGroup);
        return true; 
    };
    
    private onProjectileCollide(weaponModule: WeaponModule, projectile: Projectile, collidesWith: unit) {
        projectile.setDestroy(true);
        const timesUnitHit = this.unitsHit.get(collidesWith) || 0;
        this.unitsHit.set(collidesWith, timesUnitHit + 1);

        const crewmember = weaponModule.game.crewModule.getCrewmemberForUnit(this.casterUnit);

        // Add fire debuff to unit
        weaponModule.game.buffModule.addBuff(BUFF_ID.FIRE, 
            Unit.fromHandle(collidesWith), 
            new BuffInstanceDuration(weaponModule.game.getTimeStamp(), 10)
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