import { Vector3 } from "../../types/vector3";
import { Projectile } from "../projectile/projectile";
import { ProjectileMoverParabolic, ProjectileTargetStatic } from "../projectile/projectile-target";
import { Vector2 } from "../../types/vector2";
import { FLAME_THROWER_EXTENDED, FLAME_THROWER_ITEM } from "../../../resources/weapon-tooltips";
import { ArmableUnitWithItem } from "./unit-has-weapon";
import { getZFromXY } from "lib/utils";
import { MapPlayer, Timer, Unit } from "w3ts/index";
import { ForceEntity } from "app/force/force-entity";
import { Timers } from "app/timer-type";
import { EventEntity } from "app/events/event-entity";
import { EVENT_TYPE } from "app/events/event-enum";
import { SoundRef } from "app/types/sound-ref";
import { ABIL_WEP_FLAMETHROWER, TECH_HAS_GENES_TIER_1, TECH_HAS_GENES_TIER_2, TECH_HAS_GENES_TIER_3 } from "resources/ability-ids";
import { ITEM_WEP_FLAMETHROWER } from "resources/item-ids";
import { SFX_FIRE, SFX_FIRE_BALL, SFX_FIRE_SPEAR } from "resources/sfx-paths";
import { DynamicBuffEntity } from "app/buff/dynamic-buff-entity";
import { BUFF_ID } from "resources/buff-ids";
import { BuffInstanceDuration } from "app/buff/buff-instance-duration-type";
import { GunItem } from "./gun-item";
import { PlayerStateFactory } from "app/force/player-state-entity";
import * as Quick from "lib/quick";
import { ALIEN_FORCE_NAME, CULT_FORCE_NAME } from "app/force/forces/force-names";

export class Flamethrower extends GunItem {

    private flamerSound = new SoundRef("Sounds\\flamethrower.mp3", false);
    gunPath = "Weapons\\WeaponFlamer.mdx";

    private maxDuration = 3;
    private duration = this.maxDuration;
    private dummyFireballIn = 0.1;
    private deltaLoc: Vector2;

    private shootTimer = new Timer();

    private FIRE_TICK_RATE = 0.07;
    private DAMAGE_TICK_RATE = 0.5;
    private BASE_DPS = 85;
    private DAMAGE_PER_HIT = this.BASE_DPS * this.DAMAGE_TICK_RATE;

    private unitsHitMap = new Map<number, number>();
    private unitsHit = [];

    constructor(item: item, equippedTo: ArmableUnitWithItem) {
        super(item, equippedTo);
        // Define spread and bullet distance
        this.spreadAOE = 300;
        this.bulletDistance = 750;
    }

    public applyWeaponAttackValues(unit: Unit) {
        BlzSetUnitWeaponIntegerField(this.equippedTo.unit.handle, UNIT_WEAPON_IF_ATTACK_ATTACK_TYPE, 0, 5);
        this.equippedTo.unit.setBaseDamage(MathRound(this.getDamage(unit) / this.DAMAGE_TICK_RATE - 1), 0);
        unit.acquireRange = this.bulletDistance * 0.8;
        BlzSetUnitWeaponRealField(this.equippedTo.unit.handle, UNIT_WEAPON_RF_ATTACK_RANGE, 1, this.bulletDistance * 0.7);
        unit.setAttackCooldown( 
            BlzGetAbilityCooldown(this.getAbilityId(), unit.getAbilityLevel(this.getAbilityId())), 
            0
        );
    }
    
    public onShoot(unit: Unit, targetLocation: Vector3): void {
        super.onShoot(unit, targetLocation);

        // Clear the units hit array
        this.unitsHitMap = new Map();
        this.unitsHit = []; 

        this.duration = this.maxDuration;
        this.flamerSound.playSoundOnUnit(unit.handle, 60);

        let casterLoc = new Vector3(unit.x, unit.y, getZFromXY(unit.x, unit.y)).projectTowardsGunModel(unit.handle);
        this.deltaLoc = new Vector2(targetLocation.x - casterLoc.x, targetLocation.y - casterLoc.y).normalise().multiplyN(this.bulletDistance);

        const targetLoc = new Vector3(this.deltaLoc.x + casterLoc.x, this.deltaLoc.y + casterLoc.y, targetLocation.z);


        const uLoc = Vector3.fromWidget(unit.handle);
        const dLoc = targetLoc.subtract(uLoc);
        const a = uLoc.angle2Dto(targetLoc);
        const offsetVec = new Vector2(0, 0).applyPolarOffset(a - 90, dLoc.getLength());

        // AddSpecialEffect(SFX_ACID_AURA, 
        //     unit.x + dLoc.x + offsetVec.x, 
        //     unit.y + dLoc.y + offsetVec.y
        // );
        SetUnitLookAt(unit.handle, "bone_turret", unit.handle, dLoc.x + offsetVec.x, dLoc.y + offsetVec.y, 0);

        Timers.addTimedAction(this.FIRE_TICK_RATE, () => {
            if (this.equippedTo && this.equippedTo.unit) {
                this.fireProjectile(unit);
            }
        });
    };

    private fireProjectile(unit: Unit) {
        this.duration -= this.FIRE_TICK_RATE;

        // If we have the same order, queue up another shot
        if (this.duration <= 0) {
            return this.onStopShooting();
        }

        for (let index = 0; index < this.unitsHit.length; index++) {
            const element = this.unitsHit[index];
            this.unitsHitMap.set(element, this.unitsHitMap.get(element) - this.FIRE_TICK_RATE);
        }
        
            
        let casterLoc = new Vector3(unit.x, unit.y, getZFromXY(unit.x, unit.y)+10).projectTowardsGunModel(unit.handle);
        const targetLoc = new Vector3(casterLoc.x + this.deltaLoc.x, casterLoc.y + this.deltaLoc.y, casterLoc.z);
        
        let strayTarget = this.getStrayLocation(targetLoc, unit);
        strayTarget.z = 0;
        let deltaTarget = strayTarget.subtract(casterLoc);

        let projectile = new Projectile(
            unit.handle,
            casterLoc, 
            new ProjectileTargetStatic(deltaTarget),
            new ProjectileMoverParabolic(casterLoc, strayTarget, Deg2Rad(15), 0.9)
        );
        projectile
            .setCollisionRadius(25)
            .onCollide((projectile: Projectile, collidesWith: unit) => {
                const h = GetHandleId(collidesWith);
                const t = this.unitsHitMap.get(h);
                if (t === undefined || t  <= 0) {
                    this.onProjectileCollide(projectile, collidesWith);
                    return true;
                }
                return false;
            })
            
        projectile.addEffect(
            SFX_FIRE,
            new Vector3(0, 0, -30),
            deltaTarget.normalise(),
            1
        );
        Timers.addTimedAction(0.15, () => {
            // Log.Information("Projctile: "+projectile+" "+projectile.dead);
            if (projectile.dead === false) {
                projectile.addEffect(
                    SFX_FIRE_BALL,
                    new Vector3(0, 0, 0),
                    deltaTarget.normalise(),
                    1
                );
            }
            else {
                DestroyEffect(AddSpecialEffect(SFX_FIRE_BALL, projectile.getPosition().x, projectile.getPosition().y));
            }
        });

        EventEntity.send(EVENT_TYPE.ADD_PROJECTILE, { source: unit, data: { projectile: projectile }});

        // Do we need to create a dummy fireball?
        this.dummyFireballIn -= this.FIRE_TICK_RATE;
        if (this.dummyFireballIn <= 0) {
            this.dummyFireballIn = GetRandomReal(0.8, 0.9);
            // TODO
            const dummyBallLoc = casterLoc.add(deltaTarget.normalise().multiplyN(GetRandomReal(200, this.bulletDistance)));
            dummyBallLoc.x + GetRandomReal(-250, 250);
            dummyBallLoc.y + GetRandomReal(-250, 250);
    
            const ballDelta = dummyBallLoc.subtract(casterLoc);   
            
            const ball = new Projectile(
                unit.handle,
                casterLoc,
                new ProjectileTargetStatic(ballDelta),
                new ProjectileMoverParabolic(casterLoc, dummyBallLoc, Deg2Rad(35), 0.9)
            )
            // .onDeath((proj: Projectile) => true)
            .onCollide(() => true);

            ball.addEffect(
                SFX_FIRE_SPEAR,
                new Vector3(0, 0, 0),
                deltaTarget.normalise(),
                1)
            EventEntity.send(EVENT_TYPE.ADD_PROJECTILE, { source: unit, data: { projectile: ball }});
        }

        Timers.addTimedAction(this.FIRE_TICK_RATE, () => {
            this.fireProjectile(unit);
        });
    }
    
    private onProjectileCollide(projectile: Projectile, collidesWith: unit) {
        projectile.setDestroy(true);
        if (this && this.equippedTo) {

            const owningPlayer = MapPlayer.fromHandle(GetOwningPlayer(collidesWith));
            const pData = PlayerStateFactory.get(owningPlayer);
            const collidingUnit = Unit.fromHandle(collidesWith);
            const isMechanical = collidingUnit.isUnitType(UNIT_TYPE_MECHANICAL);

            let damageMult = 1;

            if (PlayerStateFactory.isAlienAI(owningPlayer)) {
                damageMult = 1.5;
            }
            else if (
                owningPlayer.getTechCount(TECH_HAS_GENES_TIER_1, true) > 0 ||
                owningPlayer.getTechCount(TECH_HAS_GENES_TIER_2, true) > 0 ||
                owningPlayer.getTechCount(TECH_HAS_GENES_TIER_3, true) > 0) {
                damageMult = 1.5;
            }
            else if (pData && pData.getForce() && (
                pData.getForce().is(ALIEN_FORCE_NAME) || pData.getForce().is(CULT_FORCE_NAME))
            ) {
                damageMult = 1.5;
            }

            // Reduced damage to mechanical
            if (isMechanical) damageMult = damageMult * 0.4;

            if (!this.unitsHitMap.has(collidingUnit.id)) {
                this.unitsHit.push(collidingUnit.id);
            }
            this.unitsHitMap.set(collidingUnit.id, this.DAMAGE_TICK_RATE);

            UnitDamageTarget(
                projectile.source, 
                collidesWith, 
                this.getDamage(this.equippedTo.unit) * damageMult, 
                false, 
                true, 
                ATTACK_TYPE_PIERCE, 
                DAMAGE_TYPE_NORMAL, 
                WEAPON_TYPE_WOOD_MEDIUM_STAB
            );

            // if (damageMult > 1) {
            //     const sfx = AddSpecialEffect(SFX_RED_SINGULARITY, GetUnitX(collidesWith), GetUnitY(collidesWith));
            //     BlzSetSpecialEffectZ(sfx, getZFromXY(GetUnitX(collidesWith), GetUnitY(collidesWith)) + 20);
            //     DestroyEffect(sfx)
            // }

            ForceEntity.getInstance().aggressionBetweenTwoPlayers(
                this.equippedTo.unit.owner, MapPlayer.fromHandle(GetOwningPlayer(collidesWith)
            ));
                
            if (!isMechanical) {
                DynamicBuffEntity.getInstance().addBuff(BUFF_ID.FIRE, 
                    collidingUnit, 
                    new BuffInstanceDuration(this.equippedTo.unit, 10)
                );
            }
        }
    }

    private onStopShooting() {
        if (this.equippedTo && this.equippedTo.unit) {
            this.flamerSound.stopSound(true);
            BlzStartUnitAbilityCooldown(this.equippedTo.unit.handle, this.getAbilityId(), 5);
            ResetUnitLookAt(this.equippedTo.unit.handle);
        }
        this.shootTimer.pause();
    }

    protected getTooltip(unit: Unit) {
        const damage = this.getDamage(unit);
        const newTooltip = FLAME_THROWER_EXTENDED(damage);
        return newTooltip;
    }



    protected getItemTooltip(unit: Unit): string {
        const damage = this.getDamage(unit);
        return FLAME_THROWER_ITEM(this, damage / this.DAMAGE_TICK_RATE);
    }

    protected getAccuracy(caster: Unit) {
        let accuracy = super.getAccuracy(caster);
        if (accuracy < 100) {
            return accuracy + (100 - accuracy) / 2
        }
        return accuracy;
    }
    

    public getDamage(unit: Unit): number {
        return MathRound( this.DAMAGE_PER_HIT * this.getDamageBonusMult());
    }

    public getAbilityId() { return ABIL_WEP_FLAMETHROWER; }
    public getItemId() { return ITEM_WEP_FLAMETHROWER; }
}