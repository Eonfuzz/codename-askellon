import { AbilityWithDone } from "../ability-type";
import { Vector3 } from "../../types/vector3";
import { Projectile } from "../../weapons/projectile/projectile";
import { ProjectileTargetStatic, ProjectileMoverParabolic, ProjectileMoverLinear } from "../../weapons/projectile/projectile-target";
import { LaserRifle } from "app/weapons/guns/laser-rifle";
import { Crewmember } from "app/crewmember/crewmember-type";
import { getZFromXY, getPointsInRangeWithSpread } from "lib/utils";
import { Unit } from "w3ts/handles/unit";
import { CrewFactory } from "app/crewmember/crewmember-factory";
import { WeaponEntity } from "app/weapons/weapon-entity";
import { LeapEntity } from "app/leap-engine/leap-entity";

// How many projectiles are fired inside the cone
const NUM_PROJECTILES = 20;
const PROJECTILE_CONE = 45;
const PROJECTILE_RANGE = 450;
const PROJECTILE_SPEED = 2800;

export class DiodeEjectAbility extends AbilityWithDone {

    private targetLoc: Vector3 | undefined;

    private timeElapsed: number = 0;

    private doneDamage: boolean = false;
    private hasLeaped: boolean = false;

    private ventDamagePoint: number = 0.1;
    private startLeapAt: number = 0.15;

    private crew: Crewmember | undefined;
    private weapon: LaserRifle | undefined;  

    private weaponIntensityOnCast: number = 0;

    private unitsHit = new Map<number, number>();

    public init() {
        super.init();
        this.casterUnit = Unit.fromHandle(GetTriggerUnit());

        this.targetLoc =  new Vector3(GetSpellTargetX(), GetSpellTargetY(), 0);
        this.targetLoc.z = getZFromXY(this.targetLoc.x, this.targetLoc.y);
        
        // Clear units hit
        this.unitsHit.clear();

        this.crew = CrewFactory.getInstance().getCrewmemberForUnit(this.casterUnit) as Crewmember;
        this.weapon = this.crew.weapon as LaserRifle;
        this.weaponIntensityOnCast = this.weapon.getIntensity();
        return true;
    };

    public step(delta: number) {
        this.timeElapsed += delta;

        if (!this.doneDamage && this.ventDamagePoint <= this.timeElapsed) {
            this.doneDamage = true;
            this.doVentDamage();
        }

        if (!this.hasLeaped && this.startLeapAt <= this.timeElapsed) {
            this.startLeap();
            this.hasLeaped = true;
        }
    };

    private doVentDamage() {
        if (!this.casterUnit || !this.weapon || !this.crew || !this.targetLoc) return;

        const cX = this.casterUnit.x;
        const cY = this.casterUnit.y;
        const casterLoc = new Vector3(cX, cY, getZFromXY(cX, cY));

        // Missile appear loc
        const projStartLoc = casterLoc.projectTowards2D(this.casterUnit.facing, 30);
        projStartLoc.z = projStartLoc.z + 20;

        // Target loc
        const angleToTarget = projStartLoc.angle2Dto(this.targetLoc);
        const deltaTarget = this.targetLoc.subtract(projStartLoc);
        const sfxModel = this.weapon.getModelPath();
        const accuracy = this.crew.getAccuracy() / 100;

        // Range and spread, increase them slightly base on accuracy
        let projectileRange = PROJECTILE_RANGE * (1 + accuracy - 1);
        let spread = PROJECTILE_CONE * (1 + 1 - accuracy);

        // Damage numbers
        const weaponBaseDamage = this.weapon.getDamage(this.crew.unit);
        const diodeDamage = (60 + weaponBaseDamage * 5) / NUM_PROJECTILES;


        const deltaLocs = getPointsInRangeWithSpread(
            angleToTarget - spread,
            angleToTarget + spread,
            30,
            projectileRange,
            0.9
        );

        const centerTargetLoc = casterLoc.projectTowards2D(angleToTarget, projectileRange*1.4);
        centerTargetLoc.z = getZFromXY(centerTargetLoc.x, centerTargetLoc.y);

        deltaLocs.forEach((loc, index) => {
            const nX = casterLoc.x + loc.x;
            const nY = casterLoc.y + loc.y;
            const targetLoc = new Vector3(nX, nY, getZFromXY(nX, nY));

            const projectile = new Projectile(
                this.casterUnit.handle,
                new Vector3(projStartLoc.x, projStartLoc.y, projStartLoc.z),
                new ProjectileTargetStatic(
                    targetLoc.subtract(projStartLoc),
                )
            )
            .setVelocity(PROJECTILE_SPEED)
            .onCollide((projectile, who) => {
                projectile.setDestroy(true);
                if (this.casterUnit) {
                    const timesUnitHit = this.unitsHit.get(GetHandleId(who)) || 0;
                    this.unitsHit.set(GetHandleId(who), timesUnitHit + 1);

                    let damage = diodeDamage / Pow(1.25, timesUnitHit);

                    UnitDamageTarget(this.casterUnit.handle, 
                        who, 
                        damage, 
                        true, 
                        true, 
                        ATTACK_TYPE_MAGIC, 
                        DAMAGE_TYPE_ACID, 
                        WEAPON_TYPE_WHOKNOWS
                    );
                }
            });
    
            projectile.addEffect(sfxModel, new Vector3(0, 0, 0), deltaTarget.normalise(), 1);
            WeaponEntity.getInstance().addProjectile(projectile);
        });
        this.weapon.setIntensity(0);
    }

    private startLeap() {
        if (!this.casterUnit || !this.weapon || !this.crew) return;

        const cX = this.casterUnit.x;
        const cY = this.casterUnit.y;
        const casterLoc = new Vector3(cX, cY, getZFromXY(cX, cY));
        
        const weaponIntensity = this.weaponIntensityOnCast;

        // Set target loc as projection backwards of caster facing
        // 128 is the default tile distance
        // At 4 stacks the user jumps back two tiles
        const distanceJumpBack = 128 + 140 * weaponIntensity / 4;
        let targetLoc = casterLoc.projectTowards2D(this.casterUnit.facing, -distanceJumpBack);

        // Register the leap and its callback
        LeapEntity.getInstance().newLeap(
            this.casterUnit.handle,
            targetLoc,
            45,
            1
        ).onFinish((leapEntry) => {
            this.done = true;
        });
    }
    
    public destroy() {
        if (this.casterUnit) {
            const cX = this.casterUnit.x;
            const cY = this.casterUnit.y;
            const casterLoc = new Vector3(cX, cY, getZFromXY(cX, cY));

            let sfx = AddSpecialEffect("Abilities\\Spells\\Orc\\WarStomp\\WarStompCaster.mdl", casterLoc.x, casterLoc.y);
            DestroyEffect(sfx);
        }
        return true; 
    };
}
