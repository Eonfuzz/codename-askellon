import { Ability } from "../ability-type";
import { Vector2, vectorFromUnit } from "../../types/vector2";
import { Vector3 } from "../../types/vector3";
import { Projectile } from "../../weapons/projectile/projectile";
import { ProjectileTargetStatic, ProjectileMoverParabolic } from "../../weapons/projectile/projectile-target";
import { FilterIsEnemyAndAlive } from "../../../resources/filters";
import { Unit } from "w3ts/handles/unit";
import { MapPlayer } from "w3ts";
import { getZFromXY } from "lib/utils";
import { ABILITY_SLOW_ID } from "resources/ability-ids";
import { WeaponEntity } from "app/weapons/weapon-entity";
import { DummyCast } from "lib/dummy";

/** @noSelfInFile **/
const DAMAGE_PER_SECOND = 35;

const MISSILE_SPEED = 400;
const MISSILE_ARC_HEIGHT = 800;
const MISSILE_LAUNCH_SFX = 'Abilities\\Spells\\Undead\\DeathCoil\\DeathCoilSpecialArt.mdl';
const MISSILE_SFX = 'Abilities\\Weapons\\ChimaeraAcidMissile\\ChimaeraAcidMissile.mdl';

const POOL_SFX = 'war3mapImported\\ToxicField.mdx';
const POOL_DURATION = 10;
const POOL_AREA = 350;

export class AcidPoolAbility implements Ability {

    private casterUnit: Unit | undefined;
    private targetLoc: Vector3 | undefined;
    private timeElapsed: number;

    private poolLocation: Vector3 | undefined;
    private sfx: effect | undefined;

    private castingPlayer: MapPlayer | undefined;
    private damageGroup = CreateGroup();

    // Used for optimisation
    private lastDelta = 0;
    private checkForSlowEvery = 0.3;
    private timeElapsedSinceLastSlowCheck = 0.5;

    constructor() {
        this.timeElapsed = 0;
    }

    public initialise() {
        this.casterUnit = Unit.fromHandle(GetTriggerUnit());
        this.castingPlayer = this.casterUnit.owner;

        this.targetLoc =  new Vector3(GetSpellTargetX(), GetSpellTargetY(), 0);
        this.targetLoc.z = getZFromXY(this.targetLoc.x, this.targetLoc.y);

        const polarPoint = vectorFromUnit(this.casterUnit.handle).applyPolarOffset(this.casterUnit.facing, 80);
        const startLoc = new Vector3(polarPoint.x, polarPoint.y, getZFromXY(polarPoint.x, polarPoint.y)+30);

        const deltaTarget = this.targetLoc.subtract(startLoc);
        

        const projectile = new Projectile(
            this.casterUnit.handle,
            startLoc,
            new ProjectileTargetStatic(deltaTarget),
            new ProjectileMoverParabolic(startLoc, this.targetLoc, Deg2Rad(GetRandomReal(45,80)))
        )
        .onDeath((proj: Projectile) => { return this.createPool(proj.getPosition()); })
        .onCollide(() => true);

        projectile.addEffect(MISSILE_SFX, new Vector3(0, 0, 0), deltaTarget.normalise(), 1);

        const sfx = AddSpecialEffect(MISSILE_LAUNCH_SFX, polarPoint.x, polarPoint.y);
        BlzSetSpecialEffectHeight(sfx, -30);
        DestroyEffect(sfx);

        WeaponEntity.getInstance().addProjectile(projectile);

        return true;
    };

    private createPool(atWhere: Vector3) {
        this.poolLocation = atWhere;
        this.sfx = AddSpecialEffect(POOL_SFX, atWhere.x, atWhere.y);
        BlzSetSpecialEffectTimeScale(this.sfx, 0.01);
        BlzSetSpecialEffectScale(this.sfx, 1.3);

        // Also pick all nearby items
        const rect = Rect(
            atWhere.x - POOL_AREA/2, 
            atWhere.y - POOL_AREA/2, 
            atWhere.x + POOL_AREA/2,
            atWhere.y + POOL_AREA/2
        );
        EnumItemsInRect(rect, Filter(() => true), () => {
            const item = GetEnumItem();
            // Log.Information("Destroying Item "+GetItemName(item));
            RemoveItem(item);
        });
        return true;
    }

    public process(delta: number) {

        if (this.poolLocation && this.castingPlayer) {
            this.timeElapsed += delta;
            this.timeElapsedSinceLastSlowCheck += delta;
            GroupEnumUnitsInRange(
                this.damageGroup, 
                this.poolLocation.x, 
                this.poolLocation.y,
                POOL_AREA,
                FilterIsEnemyAndAlive(this.castingPlayer)
            );
            this.lastDelta = delta;

            ForGroup(this.damageGroup, () => this.damageUnit());
            if (this.timeElapsedSinceLastSlowCheck >= this.checkForSlowEvery) {
                ForGroup(this.damageGroup, () => this.slowUnit());
                this.timeElapsedSinceLastSlowCheck = 0;
            }
        }

        return this.timeElapsed < POOL_DURATION;
    };

    private damageUnit() {
        if (this.casterUnit) {
            const unit = GetEnumUnit();
            UnitDamageTarget(this.casterUnit.handle, 
                unit, 
                DAMAGE_PER_SECOND * this.lastDelta, 
                true, 
                true, 
                ATTACK_TYPE_MAGIC, 
                DAMAGE_TYPE_ACID, 
                WEAPON_TYPE_WHOKNOWS
            );
        }
    }

    private slowUnit() {
        const unit = GetEnumUnit();
        DummyCast((dummy: unit) => {
            SetUnitX(dummy, GetUnitX(unit));
            SetUnitY(dummy, GetUnitY(unit) + 50);
            IssueTargetOrder(dummy, 'slow', GetEnumUnit());
        }, ABILITY_SLOW_ID);
    }
    
    public destroy() { 
        // Log.Information("Ending");
        this.sfx && BlzSetSpecialEffectTimeScale(this.sfx, 10);
        this.sfx && DestroyEffect(this.sfx);

        DestroyGroup(this.damageGroup);

        return true; 
    };
}