import { Vector3 } from "../../types/vector3";
import { Projectile } from "../projectile/projectile";
import { ProjectileMoverParabolic, ProjectileTargetStatic } from "../projectile/projectile-target";
import { Vector2, vectorFromUnit } from "../../types/vector2";
import { FLAME_THROWER_EXTENDED, FLAME_THROWER_ITEM, MINIGUN_EXTENDED, MINIGUN_ITEM } from "../../../resources/weapon-tooltips";
import { ArmableUnit, ArmableUnitWithItem } from "./unit-has-weapon";
import { getZFromXY } from "lib/utils";
import { MapPlayer, Force, Timer, Unit } from "w3ts/index";
import { ForceEntity } from "app/force/force-entity";
import { Timers } from "app/timer-type";
import { EventEntity } from "app/events/event-entity";
import { EVENT_TYPE } from "app/events/event-enum";
import { SoundRef } from "app/types/sound-ref";
import { ABIL_WEP_MINIGUN_FULLER_AUTO, ABIL_WEP_FLAMETHROWER, TECH_HAS_GENES_TIER_1, TECH_HAS_GENES_TIER_2, TECH_HAS_GENES_TIER_3 } from "resources/ability-ids";
import { ITEM_WEP_FLAMETHROWER, ITEM_WEP_MINIGUN } from "resources/item-ids";
import { InputManager } from "lib/TreeLib/InputManager/InputManager";
import { Log } from "lib/serilog/serilog";
import { SFX_ACID_AURA, SFX_DEMONHUNTER_MISSILE, SFX_FIRE, SFX_FIRE_BALL, SFX_FIRE_BOLT, SFX_FIRE_SPEAR, SFX_RED_SINGULARITY } from "resources/sfx-paths";
import { DynamicBuffEntity } from "app/buff/dynamic-buff-entity";
import { BUFF_ID } from "resources/buff-ids";
import { BuffInstanceDuration } from "app/buff/buff-instance-duration-type";
import { GunItem } from "./gun-item";
import { PlayerStateFactory } from "app/force/player-state-entity";
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
    private FACING_TICK_RATE = 0.05;
    private BASE_DPS = 73;
    private DAMAGE_PER_HIT = this.BASE_DPS * this.FIRE_TICK_RATE;

    constructor(item: item, equippedTo: ArmableUnitWithItem) {
        super(item, equippedTo);
        // Define spread and bullet distance
        this.spreadAOE = 50;
        this.bulletDistance = 750;
    }

    public applyWeaponAttackValues(unit: Unit) {
        BlzSetUnitWeaponIntegerField(this.equippedTo.unit.handle, UNIT_WEAPON_IF_ATTACK_ATTACK_TYPE, 0, 5);
        this.equippedTo.unit.setBaseDamage(MathRound(this.getDamage(unit) / this.FIRE_TICK_RATE - 1), 0);
        unit.acquireRange = this.bulletDistance * 0.8;
        BlzSetUnitWeaponRealField(this.equippedTo.unit.handle, UNIT_WEAPON_RF_ATTACK_RANGE, 1, this.bulletDistance * 0.7);
        unit.setAttackCooldown( 
            BlzGetAbilityCooldown(this.getAbilityId(), unit.getAbilityLevel(this.getAbilityId())), 
            0
        );
    }
    
    public onShoot(unit: Unit, targetLocation: Vector3): void {
        super.onShoot(unit, targetLocation);

        this.duration = this.maxDuration;
        this.flamerSound.playSoundOnUnit(unit.handle, 60);

        let casterLoc = new Vector3(unit.x, unit.y, getZFromXY(unit.x, unit.y)).projectTowardsGunModel(unit.handle);
        this.deltaLoc = new Vector2(targetLocation.x - casterLoc.x, targetLocation.y - casterLoc.y).normalise().multiplyN(this.bulletDistance);

        const targetLoc = new Vector3(this.deltaLoc.x + casterLoc.x, this.deltaLoc.y + casterLoc.y, targetLocation.z);

        this.shootTimer.start(this.FACING_TICK_RATE, true, () => this.updateFacing(this.FACING_TICK_RATE))

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

    // Updates our target location based on facing
    private updateFacing(delta: number) {
        if (!this || !this.equippedTo || !this.equippedTo.unit) return;

        const unit = this.equippedTo.unit;

        // const uLoc = Vector3.fromWidget(unit.handle);
        // const dLoc = this.targetLoc.subtract(uLoc);

        // SetUnitLookAt(unit.handle, "bone_turret", unit.handle, dLoc.x, dLoc.y, 0);
        // unit.setAnimation(1);
    }

    private fireProjectile(unit: Unit) {
        this.duration -= this.FIRE_TICK_RATE;

        // If we have the same order, queue up another shot
        if (this.duration <= 0) {
            return this.onStopShooting();
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
            .onCollide((projectile: Projectile, collidesWith: unit) => 
                this.onProjectileCollide(projectile, collidesWith)
            )
            
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
                
            DynamicBuffEntity.getInstance().addBuff(BUFF_ID.FIRE, 
                Unit.fromHandle(collidesWith), 
                new BuffInstanceDuration(this.equippedTo.unit, 10)
            );
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
        const newTooltip = FLAME_THROWER_EXTENDED(damage / this.FIRE_TICK_RATE);
        return newTooltip;
    }

    protected getItemTooltip(unit: Unit): string {
        const damage = this.getDamage(unit);
        return FLAME_THROWER_ITEM(this, damage);
    }


    public getDamage(unit: Unit): number {
        return MathRound( this.DAMAGE_PER_HIT * this.getDamageBonusMult());
    }

    public getAbilityId() { return ABIL_WEP_FLAMETHROWER; }
    public getItemId() { return ITEM_WEP_FLAMETHROWER; }
}