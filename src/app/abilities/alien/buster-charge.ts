/** @noSelfInFile **/
import { Ability } from "../ability-type";
import { AbilityModule } from "../ability-module";
import { Trigger, Unit, Effect } from "w3ts";
import { BUFF_ID_ROACH_ARMOR, BUFF_ID } from "resources/buff-ids";
import { TECH_20_RANGE_UPGRADE, TECH_ROACH_DUMMY_UPGRADE } from "resources/ability-ids";
import { SFX_ALIEN_ACID_BALL, SFX_ACID_AURA, SFX_CONFLAGRATE_GREEN, SFX_CATAPULT_MISSILE } from "resources/sfx-paths";
import { getZFromXY, getAnyBlockers } from "lib/utils";
import { FilterIsEnemyAndAlive } from "resources/filters";
import { BuffInstanceDuration } from "app/buff/buff-instance";
import { Vector2, vectorFromUnit } from "app/types/vector2";
import { Vector3 } from "app/types/vector3";
import { Log } from "lib/serilog/serilog";

// Damage increase each second
const MAX_DISTANCE = 900;
const DAMAGE_ON_IMPALE = 25;
const DAMAGE_ON_COLLIDE = 50;
const GRAB_DISTANCE = 60;

export class BusterChargeAbility implements Ability {

    private casterUnit: Unit;
    private timeElapsed: number = 0;

    private searchGroup = CreateGroup();
    private impaledUnits = CreateGroup();
    private velocityVector: Vector2;

    private distanceTravelled: number = 0;
    private casterCollisionRadius: number = 0;

    constructor() {}

    public initialise(abMod: AbilityModule) {
        this.casterUnit = Unit.fromHandle(GetTriggerUnit());

        const targetLoc = new Vector2(GetSpellTargetX(), GetSpellTargetY());
        const unitLoc = vectorFromUnit(this.casterUnit.handle);

        this.velocityVector = targetLoc.subtract(unitLoc).normalise().setLengthN(this.casterUnit.defaultMoveSpeed * 2.6);
        this.casterCollisionRadius = this.casterUnit.collisionSize;

        this.casterUnit.pauseEx(true);
        this.casterUnit.setPathing(false);

        return true;
    };

    public process(abMod: AbilityModule, delta: number) {
        this.timeElapsed += delta;

        let moveVec = this.velocityVector.multiplyN(delta);
        this.casterUnit.setAnimation(8);

        let oldZ = GetTerrainCliffLevel(this.casterUnit.x, this.casterUnit.y);
        let newX = this.casterUnit.x + moveVec.x;
        let newY = this.casterUnit.y + moveVec.y;

        let newZ = GetTerrainCliffLevel(
            this.casterUnit.x + 100 * Cos(this.casterUnit.facing * bj_DEGTORAD), 
            this.casterUnit.y + 100 * Sin(this.casterUnit.facing * bj_DEGTORAD)
        );
        let newZ2 = GetTerrainCliffLevel(
            this.casterUnit.x + 100 * Cos((this.casterUnit.facing + 45) * bj_DEGTORAD), 
            this.casterUnit.y + 100 * Sin((this.casterUnit.facing + 45) * bj_DEGTORAD)
        );
        let newZ3 = GetTerrainCliffLevel(
            this.casterUnit.x + 100 * Cos((this.casterUnit.facing - 45) * bj_DEGTORAD), 
            this.casterUnit.y + 100 * Sin((this.casterUnit.facing - 45) * bj_DEGTORAD)
        );

        const hasTerrainCollision = getAnyBlockers(newX-GRAB_DISTANCE, newY-GRAB_DISTANCE, newX+GRAB_DISTANCE, newY+GRAB_DISTANCE).length > 0;

        if (newZ < oldZ) {
            // We try to jump
        }
        else if (hasTerrainCollision || newZ > oldZ || newZ2 > oldZ || newZ3 > oldZ) {
            this.onWallCollide(abMod, newX, newY);
            return false;
        }

        this.casterUnit.x = newX;
        this.casterUnit.y = newY;
        this.distanceTravelled += moveVec.getLength();
        
        // Grab units
        GroupEnumUnitsInRange(
            this.searchGroup, 
            this.casterUnit.x, 
            this.casterUnit.y,
            GRAB_DISTANCE,
            FilterIsEnemyAndAlive(this.casterUnit.owner)
        );

        ForGroup(this.searchGroup, () => {
            const unit = GetEnumUnit();
            if ((this.casterCollisionRadius + 5) < BlzGetUnitCollisionSize(unit)) return;
            if (!IsUnitInGroup(unit, this.impaledUnits)) {
                // damage unit by 25
                UnitDamageTarget(this.casterUnit.handle, 
                    unit, 
                    DAMAGE_ON_IMPALE, 
                    true, 
                    true, 
                    ATTACK_TYPE_MAGIC, 
                    DAMAGE_TYPE_ACID, 
                    WEAPON_TYPE_WHOKNOWS
                );
                GroupAddUnit(this.impaledUnits, unit);
                BlzPauseUnitEx(unit, true);
                SetUnitPathing(unit, false);
            }
        });


        // Now move impaled units
        ForGroup(this.impaledUnits, () => {
            const unit = GetEnumUnit();
            SetUnitX(unit, GetUnitX(unit) + moveVec.x);
            SetUnitY(unit, GetUnitY(unit) + moveVec.y);
        });

        if (this.distanceTravelled >= MAX_DISTANCE) {
            return false;
        }
        
        return true;
    }

    private onWallCollide(abMod: AbilityModule, newX: number, newY: number) {

        // We are colliding
        const sfx = AddSpecialEffect(SFX_CATAPULT_MISSILE, newX, newY);
        BlzSetSpecialEffectZ(sfx, getZFromXY(newX, newY) + 30);
        DestroyEffect(sfx);
        
        const hasImpaledUnits = CountUnitsInGroup(this.impaledUnits) > 0;
        // Now move impaled units
        ForGroup(this.impaledUnits, () => {
            const unit = GetEnumUnit();
            UnitDamageTarget(this.casterUnit.handle, 
                unit, 
                DAMAGE_ON_COLLIDE, 
                true, 
                true, 
                ATTACK_TYPE_MAGIC, 
                DAMAGE_TYPE_ACID, 
                WEAPON_TYPE_WHOKNOWS
            );

            const unitLoc = new Vector3(GetUnitX(unit), GetUnitY(unit), getZFromXY(GetUnitX(unit), GetUnitY(unit))).projectTowards2D(this.casterUnit.facing, -GRAB_DISTANCE);
            SetUnitX(unit, unitLoc.x);
            SetUnitY(unit, unitLoc.y);

            const knockbackLoc = unitLoc.projectTowards2D(this.casterUnit.facing, -250);
            abMod.game.leapModule.newLeap(
                unit,
                knockbackLoc,
                55,
                0.6
            ).onFinish((leapEntry) => {
                // Stun?
            });
        });

        // Get "knocked" backwards
        // Register the leap and its callback
        const unitLoc = new Vector3(this.casterUnit.x, this.casterUnit.y, getZFromXY(this.casterUnit.x, this.casterUnit.y));
        const knockbackLoc = unitLoc.projectTowards2D(this.casterUnit.facing, hasImpaledUnits ? -390 : -250);

        abMod.game.leapModule.newLeap(
            this.casterUnit.handle,
            knockbackLoc,
            55,
            1.1
        ).onFinish((leapEntry) => {
            // Stun?
        });
    }
    
    public destroy(abMod: AbilityModule) {

        this.casterUnit.pauseEx(false);
        this.casterUnit.setPathing(true);

        // Now move impaled units
        ForGroup(this.impaledUnits, () => {
            BlzPauseUnitEx(GetEnumUnit(), false);
            SetUnitPathing(GetEnumUnit(), true);
        });
        DestroyGroup(this.impaledUnits);
        DestroyGroup(this.searchGroup);

        return true; 
    };
}