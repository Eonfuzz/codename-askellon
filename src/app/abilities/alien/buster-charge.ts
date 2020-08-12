import { Ability } from "../ability-type";
import { Trigger, Unit, Effect, MapPlayer } from "w3ts";
import { ABIL_STUN_25, ABIL_ALIEN_CHARGE } from "resources/ability-ids";
import { SFX_CATAPULT_MISSILE } from "resources/sfx-paths";
import { getZFromXY, getAnyBlockers } from "lib/utils";
import { FilterIsAlive } from "resources/filters";
import { Vector2, vectorFromUnit } from "app/types/vector2";
import { Vector3 } from "app/types/vector3";
import { Log } from "lib/serilog/serilog";
import { PlayNewSoundOnUnit } from "lib/translators";
import { LeapEntity } from "app/leap-engine/leap-entity";
import { ForceEntity } from "app/force/force-entity";
import { DummyCast } from "lib/dummy";
import { AbilityHooks } from "../ability-hooks";

// Damage increase each second
const MAX_DISTANCE = 900;
const DAMAGE_ON_IMPALE = 25;
const DAMAGE_ON_COLLIDE = 50;
const GRAB_DISTANCE = 60;

export class BusterChargeAbility implements Ability {

    private casterUnit: Unit;

    private searchGroup = CreateGroup();
    private impaledUnits = CreateGroup();
    private velocityVector: Vector2;

    private distanceTravelled: number = 0;
    private casterCollisionRadius: number = 0;
    private isJumping: boolean = false;
    // Used when jumping
    private prevLoc: Vector2;
    private jumpAtZ: number;

    constructor() {}

    public initialise() {
        this.casterUnit = Unit.fromHandle(GetTriggerUnit());

        const targetLoc = new Vector2(GetSpellTargetX(), GetSpellTargetY());
        const unitLoc = vectorFromUnit(this.casterUnit.handle);

        this.velocityVector = targetLoc.subtract(unitLoc).normalise().setLengthN(this.casterUnit.defaultMoveSpeed * 2.8);
        this.casterCollisionRadius = this.casterUnit.collisionSize;

        this.casterUnit.pauseEx(true);
        this.casterUnit.setPathing(false);

        const sfx = AddSpecialEffect("war3mapImported\\DustWave.mdx", unitLoc.x, unitLoc.y);
        BlzSetSpecialEffectAlpha(sfx, 40);
        BlzSetSpecialEffectScale(sfx, 0.9);
        BlzSetSpecialEffectTimeScale(sfx, 0.4);
        BlzSetSpecialEffectTime(sfx, 0.2);
        BlzSetSpecialEffectYaw(sfx, GetRandomInt(0, 360));
        DestroyEffect(sfx);

        PlayNewSoundOnUnit("Abilities\\Spells\\Undead\\Impale\\ImpaleHit.flac", this.casterUnit, 60);
        this.casterUnit.setAnimation(8);

        return true;
    };

    public process(delta: number) {

        let moveVec: Vector2;
        let oldZ: number;
        if (this.isJumping) {
            const uVec = vectorFromUnit(this.casterUnit.handle);
            moveVec = uVec.subtract(this.prevLoc);
            this.prevLoc = uVec;
            oldZ = this.jumpAtZ;
        }
        else {
            moveVec = this.velocityVector.multiplyN(delta);
            oldZ = GetTerrainCliffLevel(this.casterUnit.x, this.casterUnit.y);
        }

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
    
        if (newZ < oldZ && !this.isJumping) {
            // We try to jump
            this.isJumping = true;
            const unitLoc = new Vector3(this.casterUnit.x, this.casterUnit.y, getZFromXY(this.casterUnit.x, this.casterUnit.y));
            const jumpVec = unitLoc.projectTowards2D(this.casterUnit.facing, 360);
            this.jumpAtZ = oldZ;
            this.prevLoc = unitLoc.to2D();


            const angle = this.casterUnit.facing;
            LeapEntity.getInstance().newLeap(
                this.casterUnit.handle,
                jumpVec,
                55,
                2.5
            ).onFinish(() => {
                this.isJumping = false;
                this.distanceTravelled += MAX_DISTANCE;

                if (this.casterUnit && this.casterUnit.isAlive()) {
                    // We are colliding
                    const sfx = AddSpecialEffect(SFX_CATAPULT_MISSILE, this.casterUnit.x, this.casterUnit.y);
                    BlzSetSpecialEffectZ(sfx, getZFromXY(newX, newY) + 30);
                    DestroyEffect(sfx);
                }

                // Knock impaled units forwards to avoid falling to death
                ForGroup(this.impaledUnits, () => {
                    const unit = GetEnumUnit();

                    const unitLoc = new Vector3(GetUnitX(unit), GetUnitY(unit), getZFromXY(GetUnitX(unit), GetUnitY(unit))).projectTowards2D(this.casterUnit.facing, -GRAB_DISTANCE);
                    SetUnitX(unit, unitLoc.x);
                    SetUnitY(unit, unitLoc.y);

                    const knockbackLoc = unitLoc.projectTowards2D(angle, 450);
                    DummyCast((dummy: unit) => {
                        SetUnitAbilityLevel(dummy, ABIL_STUN_25, 5);
                        SetUnitX(dummy, GetUnitX(unit));
                        SetUnitY(dummy, GetUnitY(unit));
                        IssueTargetOrder(dummy, "thunderbolt", unit);
                    }, ABIL_STUN_25);
                    LeapEntity.getInstance().newLeap(
                        unit,
                        knockbackLoc,
                        55,
                        0.6
                    );
                });
            });
        }
        else if (hasTerrainCollision || newZ > oldZ || newZ2 > oldZ || newZ3 > oldZ) {
            this.onWallCollide(newX, newY);
            return false;
        }

        if (!this.isJumping) {
            this.casterUnit.x = newX;
            this.casterUnit.y = newY;
        }
        this.distanceTravelled += moveVec.getLength();
        
        // Grab units
        GroupEnumUnitsInRange(
            this.searchGroup, 
            this.casterUnit.x, 
            this.casterUnit.y,
            GRAB_DISTANCE,
            FilterIsAlive(this.casterUnit.owner)
        );

        ForGroup(this.searchGroup, () => {
            const unit = GetEnumUnit();
            if ((this.casterCollisionRadius + 5) < BlzGetUnitCollisionSize(unit)) return;
            if (!ForceEntity.getInstance().aggressionBetweenTwoPlayers(this.casterUnit.owner, MapPlayer.fromHandle(GetOwningPlayer(unit)))) return;
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

    private onWallCollide(newX: number, newY: number) {

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
            DummyCast((dummy: unit) => {
                SetUnitAbilityLevel(dummy, ABIL_STUN_25, 5);
                SetUnitX(dummy, GetUnitX(unit));
                SetUnitY(dummy, GetUnitY(unit));
                IssueTargetOrder(dummy, "thunderbolt", unit);
            }, ABIL_STUN_25);
            LeapEntity.getInstance().newLeap(
                unit,
                knockbackLoc,
                55,
                0.6
            );
        });

        // Get "knocked" backwards
        // Register the leap and its callback
        const unitLoc = new Vector3(this.casterUnit.x, this.casterUnit.y, getZFromXY(this.casterUnit.x, this.casterUnit.y));
        const knockbackLoc = unitLoc.projectTowards2D(this.casterUnit.facing, hasImpaledUnits ? -390 : -250);

        if (!hasImpaledUnits) {
            DummyCast((dummy: unit) => {
                SetUnitAbilityLevel(dummy, ABIL_STUN_25, 5);
                SetUnitX(dummy, this.casterUnit.x);
                SetUnitY(dummy, this.casterUnit.y + 50);
                IssueTargetOrder(dummy, "thunderbolt", this.casterUnit.handle);
            }, ABIL_STUN_25);
        }
        LeapEntity.getInstance().newLeap(
            this.casterUnit.handle,
            knockbackLoc,
            55,
            1.1
        ).onFinish(() => {
            PlayNewSoundOnUnit("Abilities\\Spells\\Undead\\Impale\\ImpaleLand.flac", this.casterUnit, 30);
        });
    }
    
    public destroy() {

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
