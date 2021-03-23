import { AbilityWithDone } from "../ability-type";
import { Vector2, vectorFromUnit } from "../../types/vector2";
import { Vector3 } from "../../types/vector3";
import { Projectile } from "../../weapons/projectile/projectile";
import { ProjectileTargetStatic, ProjectileMoverParabolic } from "../../weapons/projectile/projectile-target";
import { FilterIsEnemyAndAlive, FilterIsAlive } from "../../../resources/filters";
import { MapPlayer, Unit } from "w3ts";
import { getZFromXY, randomWithinCircle } from "lib/utils";
import { SFX_METEOR_CANISTER } from "resources/sfx-paths";
import { WeaponEntity } from "app/weapons/weapon-entity";
import { ForceEntity } from "app/force/force-entity";
import { CrewFactory } from "app/crewmember/crewmember-factory";
import { ABILITY_SLOW_ID, ABIL_ITEM_CRYO_GRENADE } from "resources/ability-ids";
import { Timers } from "app/timer-type";
import { Log } from "lib/serilog/serilog";
import { DummyCast } from "lib/dummy";
import { getYawPitchRollFromVector } from "lib/translators";

const EXPLOSION_BASE_DAMAGE = 25;
const EXPLOSION_AOE = 300;


export class MeteorCanisterAbility extends AbilityWithDone {

    private targetLoc: Vector3 | undefined;

    private castingPlayer: MapPlayer | undefined;

    private damageGroup = CreateGroup();

    private numWaves = 5;
    private waitBetweenWaves = 1.3;

    

    public init() {
        super.init();
        this.casterUnit = Unit.fromHandle(GetTriggerUnit());
        this.castingPlayer = this.casterUnit.owner;

        this.targetLoc =  new Vector3(GetSpellTargetX(), GetSpellTargetY(), 0);
        this.targetLoc.z = getZFromXY(this.targetLoc.x, this.targetLoc.y) + 400;


        const polarPoint = vectorFromUnit(this.casterUnit.handle).applyPolarOffset(this.casterUnit.facing, 80);
        const startLoc = new Vector3(polarPoint.x, polarPoint.y, getZFromXY(polarPoint.x, polarPoint.y)+30);

        if (startLoc.distanceTo(this.targetLoc) <= 500) {
            this.targetLoc = startLoc.projectTowards2D(startLoc.angle2Dto(this.targetLoc), 500);
        }

        const deltaTarget = this.targetLoc.subtract(startLoc);       
        const facingVec = deltaTarget.normalise();

        const projectile = new Projectile(
            this.casterUnit.handle,
            startLoc,
            new ProjectileTargetStatic(deltaTarget),
            new ProjectileMoverParabolic(startLoc, this.targetLoc, Deg2Rad(45), 1.3)
        )
        .doStopAtGoal(true)
        .onDeath((proj: Projectile) => {
            const pos = proj.getPosition();
            this.explode(pos);
            const faceData = getYawPitchRollFromVector(facingVec);
            let sfx = AddSpecialEffect(SFX_METEOR_CANISTER, pos.x, pos.y);
            BlzSetSpecialEffectZ(sfx, pos.z);
            BlzSetSpecialEffectYaw(sfx, faceData.yaw);
            BlzSetSpecialEffectPitch(sfx, faceData.pitch);
            BlzSetSpecialEffectRoll(sfx, faceData.roll);

            for (let index = 0; index < this.numWaves; index++) {
                let i = index;
                Timers.addTimedAction(index * this.waitBetweenWaves, () => {
                    DestroyEffect(sfx);
                    this.explode(pos);      
                    if (i !== (this.numWaves - 1)) {          
                        sfx = AddSpecialEffect(SFX_METEOR_CANISTER, pos.x, pos.y);
                        BlzSetSpecialEffectZ(sfx, pos.z);
                        BlzSetSpecialEffectYaw(sfx, faceData.yaw);
                        BlzSetSpecialEffectPitch(sfx, faceData.pitch);
                        BlzSetSpecialEffectRoll(sfx, faceData.roll);
                    }
                });
            }
        })
        .onCollide(() => true);

        projectile.addEffect(SFX_METEOR_CANISTER, new Vector3(0, 0, 0), facingVec, 1);
        WeaponEntity.getInstance().addProjectile(projectile);

        return true;
    };

    private explode(atWhere: Vector3) {
        for (let index = 0; index < 40; index++) {
            const loc = randomWithinCircle(EXPLOSION_AOE-20, atWhere.x, atWhere.y);

            const delta = new Vector3(loc.x, loc.y, getZFromXY(loc.x, loc.y)).subtract(atWhere);
            const timeToLand = 0.25;

            const projectile = new Projectile(
                this.casterUnit.handle,
                new Vector3(atWhere.x, atWhere.y, atWhere.z),
                new ProjectileTargetStatic(
                    delta,
                )
            )
            .setVelocity(delta.getLength() / timeToLand)
            .onCollide((projectile, who) => true);
            projectile.addEffect(
                "Abilities\\Weapons\\GyroCopter\\GyroCopterImpact.mdl", 
                new Vector3(0, 0, 0), 
                delta.normalise(), 
                0.7
            );
            WeaponEntity.getInstance().addProjectile(projectile);
        }
        Timers.addTimedAction(0.25, () => {
            if (this.castingPlayer) {
                GroupEnumUnitsInRange(
                    this.damageGroup, 
                    atWhere.x, 
                    atWhere.y,
                    EXPLOSION_AOE,
                    FilterIsAlive(this.castingPlayer)
                );
                ForGroup(this.damageGroup, () => this.damageUnit());
            }
        });
        return true;
    }

    public step(delta: number) {
        return !this.done;
    };

    private damageUnit() {
        if (this.casterUnit) {
            const unit = Unit.fromHandle(GetEnumUnit());

            // Check to make sure we are allowed aggression between the two teams
            const aggressionAllowed = this.casterUnit.owner === unit.owner 
                || ForceEntity.getInstance().aggressionBetweenTwoPlayers(
                    this.casterUnit.owner, 
                    unit.owner
                );

            // If we aren't allowed aggression we stop
            // Prevents griefing etc
            if (!aggressionAllowed) return;

            // Otherwise continue onwards
            const crew = CrewFactory.getInstance().getCrewmemberForUnit(unit);
            let damageMult = 1;
            if (crew) damageMult = crew.getDamageBonusMult();
            
            this.casterUnit.damageTarget(
                unit.handle, 
                EXPLOSION_BASE_DAMAGE * damageMult, 
                true, 
                true, 
                ATTACK_TYPE_MAGIC, 
                DAMAGE_TYPE_ACID, 
                WEAPON_TYPE_WHOKNOWS
            );
            this.slowUnit(unit.handle);
        }
    }

    private slowUnit(unit: unit) {
        DummyCast((dummy: unit) => {
            SetUnitX(dummy, GetUnitX(unit));
            SetUnitY(dummy, GetUnitY(unit) + 50);
            IssueTargetOrder(dummy, 'slow', GetEnumUnit());
        }, ABILITY_SLOW_ID);
    }

    public destroy() { 
        DestroyGroup(this.damageGroup);
        return true; 
    };
}
