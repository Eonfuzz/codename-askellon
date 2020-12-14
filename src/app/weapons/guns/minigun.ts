import { Vector3 } from "../../types/vector3";
import { Gun } from "./gun";
import { Crewmember } from "../../crewmember/crewmember-type";
import { Projectile } from "../projectile/projectile";
import { ProjectileTargetStatic } from "../projectile/projectile-target";
import { Vector2, vectorFromUnit } from "../../types/vector2";
import { BURST_RIFLE_EXTENDED, BURST_RIFLE_ITEM, MINIGUN_EXTENDED, MINIGUN_ITEM } from "../../../resources/weapon-tooltips";
import { PlayNewSoundOnUnit, staticDecorator } from "../../../lib/translators";
import { ArmableUnit, ArmableUnitWithItem } from "./unit-has-weapon";
import { BURST_RIFLE_ABILITY_ID, BURST_RIFLE_ITEM_ID, EMS_RIFLING_ABILITY_ID } from "../weapon-constants";
import { getZFromXY } from "lib/utils";
import { MapPlayer, Force, Timer, Unit } from "w3ts/index";
import { CrewFactory } from "app/crewmember/crewmember-factory";
import { ForceEntity } from "app/force/force-entity";
import { Timers } from "app/timer-type";
import { EventEntity } from "app/events/event-entity";
import { EVENT_TYPE } from "app/events/event-enum";
import { SoundRef } from "app/types/sound-ref";
import { ABIL_WEP_MINIGUN, ABIL_WEP_MINIGUN_OVERSIZED, ABIL_WEP_MINIGUN_FULLER_AUTO } from "resources/ability-ids";
import { ITEM_WEP_MINIGUN } from "resources/item-ids";
import { InputManager } from "lib/TreeLib/InputManager/InputManager";
import { Log } from "lib/serilog/serilog";
import { SFX_FIRE, SFX_LASER_3, SFX_LASER_2, SFX_LASER_1 } from "resources/sfx-paths";
import { DynamicBuffEntity } from "app/buff/dynamic-buff-entity";
import { BUFF_ID } from "resources/buff-ids";
import { BuffInstanceDuration } from "app/buff/buff-instance-duration-type";
import { FilterIsAlive } from "resources/filters";
import { GunItem } from "./gun-item";

export class Minigun extends GunItem {

    private warmUpSound = new SoundRef("Sounds\\minigun-start.wav", false);
    // Have an array of 5 to make sure sounds dont fail to play
    private shootSound = [new SoundRef("Sounds\\minigun-fire.wav", false)];
    private endSound = new SoundRef("Sounds\\minigun-end.wav", false);
    gunPath = "Weapons\\MarineMinigun.mdx";

    private spinStacks = 0;
    private attackSpeedPerStack = 1.3;
    private maxSpinStacks = 5;
    private flameSawMaxCounter = 0;
    private flamesawActive = false;

    private castOrderId: number;
    private targetLoc: Vector3;

    // Max degree of turn per second
    private maxTurnSpeed = 110;
    private shootTimer = new Timer();

    public fullerAutoActive = false;

    private unallyTicker = 1;
    private unallyGroup = CreateGroup();

    constructor(item: item, equippedTo: ArmableUnitWithItem) {
        super(item, equippedTo);
        // Define spread and bullet distance
        this.spreadAOE = 375;
        this.bulletDistance = 1875;
    }

    public applyWeaponAttackValues(unit: Unit) {
        unit.setAttackCooldown(1, 1);
        this.equippedTo.unit.setBaseDamage(this.getDamage(unit) - 1, 0);
        unit.acquireRange = this.bulletDistance * 0.8;
        BlzSetUnitWeaponRealField(this.equippedTo.unit.handle, UNIT_WEAPON_RF_ATTACK_RANGE, 1, this.bulletDistance * 0.7);
        BlzSetUnitWeaponIntegerField(this.equippedTo.unit.handle, UNIT_WEAPON_IF_ATTACK_ATTACK_TYPE, 0, 2);
    }

    
    public onAdd(caster: ArmableUnitWithItem) {
        super.onAdd(caster);
        this.equippedTo.unit.addAbility(ABIL_WEP_MINIGUN_OVERSIZED);
        this.equippedTo.unit.addAbility(ABIL_WEP_MINIGUN_FULLER_AUTO);
        this.equippedTo.unit.startAbilityCooldown(ABIL_WEP_MINIGUN_FULLER_AUTO, 60);
    }

    public onRemove() {
        this.equippedTo.unit.removeAbility(ABIL_WEP_MINIGUN_OVERSIZED);
        this.equippedTo.unit.removeAbility(ABIL_WEP_MINIGUN_FULLER_AUTO);
        super.onRemove();
    }

    
    public onShoot(unit: Unit, targetLocation: Vector3): void {
        super.onShoot(unit, targetLocation);

        this.flamesawActive = false;

        this.spinStacks = 0;
        this.unallyTicker = 1;
        this.castOrderId = unit.currentOrder;
        this.warmUpSound.playSoundOnUnit(unit.handle, 127);


        let casterLoc = new Vector3(unit.x, unit.y, getZFromXY(unit.x, unit.y)).projectTowardsGunModel(unit.handle);
        let targetDistance = new Vector2(targetLocation.x - casterLoc.x, targetLocation.y - casterLoc.y).normalise().multiplyN(this.bulletDistance);

        this.targetLoc = new Vector3(targetDistance.x + casterLoc.x, targetDistance.y + casterLoc.y, targetLocation.z);

        this.shootTimer.start(0.05, true, () => this.updateFacing(0.05))

        Timers.addTimedAction(0.4, () => {
            if (this.equippedTo && this.equippedTo.unit) {
                this.fireProjectile(unit);
            }
        });
    };

    protected getAccuracy(unit: Unit) {
        const stray = super.getAccuracy(unit);
        const accuracy = stray - this.spinStacks * 2.2;
        return accuracy;
    }

    // Updates our target location based on facing
    private updateFacing(delta: number) {
        if (!this || !this.equippedTo || !this.equippedTo.unit) return;
        
        const oldLength = this.targetLoc.getLength(); 
        const unit = this.equippedTo.unit;

        const newLoc = InputManager.getLastMouseCoordinate(this.equippedTo.unit.owner.handle);

        const angleToCurrentTarget = Rad2Deg(Atan2(this.targetLoc.y-unit.y, this.targetLoc.x-unit.x));
        const angleToNewTarget = Rad2Deg(Atan2(newLoc.y-unit.y, newLoc.x-unit.x));

        const angleDelta = (angleToNewTarget - angleToCurrentTarget + 180) % 360 - 180;

        const nAngleD = (angleDelta < 0) ? Math.max(angleDelta, -this.maxTurnSpeed*delta) : Math.min(angleDelta, this.maxTurnSpeed*delta);
        const nAngle = angleToCurrentTarget + nAngleD;

        const targetLocation = new Vector3(unit.x, unit.y, this.targetLoc.z).projectTowards2D(nAngle, oldLength);

        let targetDistance = new Vector2(targetLocation.x - unit.x, targetLocation.y - unit.y).normalise().multiplyN(this.bulletDistance);

        this.targetLoc = new Vector3(targetDistance.x + unit.x, targetDistance.y + unit.y, targetLocation.z);

        unit.facing = nAngle;

        
        // Log.Information("nAngle "+nAngleD+", vs "+45*delta);

        if (nAngleD < -45*delta || nAngleD > 45*delta) {
            this.spinStacks -= 1;
            if (nAngleD < -60*delta || nAngleD > 60*delta) {
                this.flamesawActive = false;
            }
            if (nAngleD < -90*delta || nAngleD > 90*delta) {
                this.spinStacks = MathRound( this.spinStacks / 1.5 );
            }
            if (this.spinStacks < 0) this.spinStacks = 0;
        }

        if (this.spinStacks === this.maxSpinStacks && !this.flamesawActive) {
            this.flameSawMaxCounter += delta;
            if (this.flameSawMaxCounter >= 0.75) {
                this.flamesawActive = true;

                let sfx = AddSpecialEffect("war3mapImported\\DustWave.mdx", unit.x, unit.y);
                BlzSetSpecialEffectAlpha(sfx, 40);
                BlzSetSpecialEffectScale(sfx, 0.7);
                BlzSetSpecialEffectTimeScale(sfx, 1);
                BlzSetSpecialEffectTime(sfx, 0.2);
                BlzSetSpecialEffectYaw(sfx, GetRandomInt(0, 360));
                DestroyEffect(sfx);
            }
        }
        else {
            this.flameSawMaxCounter = 0;
        }

        this.unallyTicker -= delta;
        if (this.unallyTicker <= 0) {
            this.unallyTicker = 1;
            GroupEnumUnitsInRange(
                this.unallyGroup, 
                unit.x, 
                unit.y,
                350,
                FilterIsAlive(unit.owner)
            );
            ForGroup(this.unallyGroup, () => {
                ForceEntity.getInstance().aggressionBetweenTwoPlayers(
                    this.equippedTo.unit.owner,
                    MapPlayer.fromHandle(GetOwningPlayer(GetEnumUnit()))
                );
            });
            // Now unally for target loc
            GroupEnumUnitsInRange(
                this.unallyGroup, 
                this.targetLoc.x, 
                this.targetLoc.y,
                1350,
                FilterIsAlive(unit.owner)
            );
            ForGroup(this.unallyGroup, () => {
                ForceEntity.getInstance().aggressionBetweenTwoPlayers(
                    this.equippedTo.unit.owner,
                    MapPlayer.fromHandle(GetOwningPlayer(GetEnumUnit()))
                );
            });
            
        }
    }

    private fireProjectile(unit: Unit) {
        // If we have the same order, queue up another shot
        if (unit.currentOrder !== this.castOrderId) {
            return this.onStopShooting();
        }
            
        DestroyEffect(AddSpecialEffectTarget("war3mapImported\\MuzzleFlash.mdx", unit.handle, "hand, right"));
        let casterLoc = new Vector3(unit.x, unit.y, getZFromXY(unit.x, unit.y)).projectTowardsGunModel(unit.handle);
        let strayTarget = this.getStrayLocation(this.targetLoc, unit);
        let deltaTarget = strayTarget.subtract(casterLoc);

        PlayNewSoundOnUnit("Sounds\\minigun-fire.wav", unit, 25);

        let projectile = new Projectile(
            unit.handle,
            casterLoc, 
            new ProjectileTargetStatic(deltaTarget)
        );
        projectile
            .setCollisionRadius(15)
            .setVelocity(2100);
            
        Timers.addTimedAction(0.05, () => {
            // Log.Information("Projctile: "+projectile+" "+projectile.dead);
            if (projectile.dead === false) {
                projectile.addEffect(
                    "war3mapImported\\Bullet.mdx",
                    new Vector3(0, 0, 0),
                    deltaTarget.normalise(),
                    1.2
                );
            }
        });
        if (this.flamesawActive) {
            projectile
            .onCollide((projectile: Projectile, collidesWith: unit) => 
                this.onFlameProjectileCollide(projectile, collidesWith)
            ).addEffect(
                SFX_LASER_2,
                new Vector3(0, 0, 0),
                deltaTarget.normalise(),
                0.2
            )
        }
        else {
            projectile
            .onCollide((projectile: Projectile, collidesWith: unit) => 
                this.onProjectileCollide(projectile, collidesWith)
            )
        }

        EventEntity.send(EVENT_TYPE.ADD_PROJECTILE, { source: unit, data: { projectile: projectile }});
        if (this.spinStacks < this.maxSpinStacks) {
            this.spinStacks++;
        }
        let shootTimer = (0.25 / Pow(this.attackSpeedPerStack, this.spinStacks));

        if (this.fullerAutoActive) shootTimer /= 2;

        Timers.addTimedAction(shootTimer, () => {
            this.fireProjectile(unit);
        });
    }
    
    private onProjectileCollide(projectile: Projectile, collidesWith: unit) {
        projectile.setDestroy(true);
        if (this && this.equippedTo) {
            UnitDamageTarget(
                projectile.source, 
                collidesWith, 
                this.getDamage(this.equippedTo.unit), 
                false, 
                true, 
                ATTACK_TYPE_PIERCE, 
                DAMAGE_TYPE_NORMAL, 
                WEAPON_TYPE_WOOD_MEDIUM_STAB
            );
            ForceEntity.getInstance().aggressionBetweenTwoPlayers(this.equippedTo.unit.owner, MapPlayer.fromHandle(GetOwningPlayer(collidesWith)));
        }
    }

    private onFlameProjectileCollide(projectile: Projectile, collidesWith: unit) {
        projectile.setDestroy(true);
        if (this && this.equippedTo) {
            UnitDamageTarget(
                projectile.source, 
                collidesWith, 
                MathRound(this.getDamage(this.equippedTo.unit) * 1.1), 
                false, 
                true, 
                ATTACK_TYPE_PIERCE, 
                DAMAGE_TYPE_NORMAL, 
                WEAPON_TYPE_WOOD_MEDIUM_STAB
            );
            ForceEntity.getInstance().aggressionBetweenTwoPlayers(this.equippedTo.unit.owner, MapPlayer.fromHandle(GetOwningPlayer(collidesWith)));
            
            // Add fire debuff to unit
            DynamicBuffEntity.getInstance().addBuff(BUFF_ID.FIRE, 
                Unit.fromHandle(collidesWith), 
                new BuffInstanceDuration(this.equippedTo.unit, 4)
            );
        }
    }

    private onStopShooting() {
        if (this.equippedTo && this.equippedTo.unit) {
            this.endSound.playSoundOnUnit(this.equippedTo.unit.handle, 127);
            BlzStartUnitAbilityCooldown(this.equippedTo.unit.handle, this.getAbilityId(), 5);
        }
        this.shootTimer.pause();
    }

    protected getTooltip(unit: Unit) {
        // const minDistance = this.spreadAOE-this.getStrayValue(crewmember) / 2;

        const damage = this.getDamage(unit);
        const newTooltip = MINIGUN_EXTENDED(this, damage);
        return newTooltip;
    }

    protected getItemTooltip(unit: Unit): string {
        const damage = this.getDamage(unit);
        return MINIGUN_ITEM(this, damage);
    }


    public getDamage(unit: Unit): number {
        return MathRound( 13 * this.getDamageBonusMult());
    }

    public getAbilityId() { return ABIL_WEP_MINIGUN; }
    public getItemId() { return ITEM_WEP_MINIGUN; }
}