import { Vector3 } from "../../types/vector3";
import { Gun } from "./gun";
import { Crewmember } from "../../crewmember/crewmember-type";
import { Projectile } from "../projectile/projectile";
import { ProjectileTargetStatic } from "../projectile/projectile-target";
import { Vector2, vectorFromUnit } from "../../types/vector2";
import { BURST_RIFLE_EXTENDED, BURST_RIFLE_ITEM, MINIGUN_EXTENDED, MINIGUN_ITEM } from "../../../resources/weapon-tooltips";
import { PlayNewSoundOnUnit, staticDecorator } from "../../../lib/translators";
import { ArmableUnit } from "./unit-has-weapon";
import { BURST_RIFLE_ABILITY_ID, BURST_RIFLE_ITEM_ID, EMS_RIFLING_ABILITY_ID } from "../weapon-constants";
import { getZFromXY } from "lib/utils";
import { MapPlayer, Force, Timer, Unit } from "w3ts/index";
import { CrewFactory } from "app/crewmember/crewmember-factory";
import { ForceEntity } from "app/force/force-entity";
import { Timers } from "app/timer-type";
import { EventEntity } from "app/events/event-entity";
import { EVENT_TYPE } from "app/events/event-enum";
import { SoundRef } from "app/types/sound-ref";
import { ABIL_WEP_MINIGUN } from "resources/ability-ids";
import { ITEM_WEP_MINIGUN } from "resources/item-ids";
import { InputManager } from "lib/TreeLib/InputManager/InputManager";
import { Log } from "lib/serilog/serilog";
import { SFX_FIRE, SFX_LASER_3, SFX_LASER_2, SFX_LASER_1 } from "resources/sfx-paths";
import { DynamicBuffEntity } from "app/buff/dynamic-buff-entity";
import { BUFF_ID } from "resources/buff-ids";
import { BuffInstanceDuration } from "app/buff/buff-instance-duration-type";
import { FilterIsAlive } from "resources/filters";

export class Minigun extends Gun {

    private warmUpSound = new SoundRef("Sounds\\minigun-start.wav", false);
    // Have an array of 5 to make sure sounds dont fail to play
    private shootSound = [new SoundRef("Sounds\\minigun-fire.wav", false)];
    private endSound = new SoundRef("Sounds\\minigun-end.wav", false);

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

    private unallyTicker = 1;
    private unallyGroup = CreateGroup();

    constructor(item: item, equippedTo: ArmableUnit) {
        super(item, equippedTo);
        // Define spread and bullet distance
        this.spreadAOE = 375;
        this.bulletDistance = 1875;
    }

    public applyWeaponAttackValues(caster: Crewmember) {
        caster.unit.setAttackCooldown(1, 1);
        this.equippedTo.unit.setBaseDamage(this.getDamage(caster) - 1, 0);
        caster.unit.acquireRange = this.bulletDistance * 0.8;
        BlzSetUnitWeaponRealField(this.equippedTo.unit.handle, UNIT_WEAPON_RF_ATTACK_RANGE, 1, this.bulletDistance * 0.7);
        BlzSetUnitWeaponIntegerField(this.equippedTo.unit.handle, UNIT_WEAPON_IF_ATTACK_ATTACK_TYPE, 0, 2);
    }
    
    public onShoot(caster: Crewmember, targetLocation: Vector3): void {
        super.onShoot(caster, targetLocation);

        const unit = caster.unit.handle;
        this.flamesawActive = false;

        this.spinStacks = 0;
        this.unallyTicker = 1;
        this.castOrderId = caster.unit.currentOrder;
        this.warmUpSound.playSoundOnUnit(caster.unit.handle, 127);


        let casterLoc = new Vector3(caster.unit.x, caster.unit.y, getZFromXY(caster.unit.x, caster.unit.y)).projectTowardsGunModel(unit);
        let targetDistance = new Vector2(targetLocation.x - casterLoc.x, targetLocation.y - casterLoc.y).normalise().multiplyN(this.bulletDistance);

        this.targetLoc = new Vector3(targetDistance.x + casterLoc.x, targetDistance.y + casterLoc.y, targetLocation.z);

        this.shootTimer.start(0.05, true, () => this.updateFacing(0.05))

        Timers.addTimedAction(0.4, () => {
            this.fireProjectile(caster);
        });
    };

    protected getStrayValue(caster: Crewmember) {
        // Accuracy is some number, starting at 100
        const accuracy = caster.getAccuracy() - this.spinStacks * 2.2;
        // Make accuracy exponentially effect the weapon
        const accuracyModifier = Pow(100-accuracy, 2) * (accuracy > 100 ? -1 : 1);
        // Log.Information("Spray: "+accuracyModifier);

        return accuracyModifier;
    }

    // Updates our target location based on facing
    private updateFacing(delta: number) {
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

    private fireProjectile(caster: Crewmember) {
        // If we have the same order, queue up another shot
        if (caster.unit.currentOrder !== this.castOrderId) {
            return this.onStopShooting();
        }
            
        const unit = caster.unit.handle;
        let casterLoc = new Vector3(caster.unit.x, caster.unit.y, getZFromXY(caster.unit.x, caster.unit.y)).projectTowardsGunModel(unit);
        let strayTarget = this.getStrayLocation(this.targetLoc, caster);
        let deltaTarget = strayTarget.subtract(casterLoc);

        PlayNewSoundOnUnit("Sounds\\minigun-fire.wav", caster.unit, 45);

        let projectile = new Projectile(
            unit,
            casterLoc, 
            new ProjectileTargetStatic(deltaTarget)
        );
        projectile
            .setCollisionRadius(15)
            .setVelocity(2100)
            .addEffect(
                "war3mapImported\\Bullet.mdx",
                new Vector3(0, 0, 0),
                deltaTarget.normalise(),
                1.2
            );
        
        if (this.flamesawActive) {
            projectile
            .onCollide((projectile: Projectile, collidesWith: unit) => 
                this.onFlameProjectileCollide(projectile, collidesWith)
            ).addEffect(
                SFX_FIRE,
                new Vector3(0, 0, 0),
                deltaTarget.normalise(),
                0.5
            )
            projectile.addEffect(
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

        EventEntity.send(EVENT_TYPE.ADD_PROJECTILE, { source: caster.unit, data: { projectile: projectile }});
        if (this.spinStacks < this.maxSpinStacks) {
            this.spinStacks++;
        }
        if (this.flamesawActive) {
            Timers.addTimedAction((0.23 / Pow(this.attackSpeedPerStack, this.spinStacks)), () => {
                this.fireProjectile(caster);
            });
        }
        else {
            Timers.addTimedAction((0.25 / Pow(this.attackSpeedPerStack, this.spinStacks)), () => {
                this.fireProjectile(caster);
            });
        }
    }
    
    private onProjectileCollide(projectile: Projectile, collidesWith: unit) {
        projectile.setDestroy(true);
        if (this.equippedTo) {
            const crewmember = CrewFactory.getInstance().getCrewmemberForUnit(this.equippedTo.unit);
            if (crewmember) {
                UnitDamageTarget(
                    projectile.source, 
                    collidesWith, 
                    this.getDamage(crewmember), 
                    false, 
                    true, 
                    ATTACK_TYPE_PIERCE, 
                    DAMAGE_TYPE_NORMAL, 
                    WEAPON_TYPE_WOOD_MEDIUM_STAB
                );
                ForceEntity.getInstance().aggressionBetweenTwoPlayers(this.equippedTo.unit.owner, MapPlayer.fromHandle(GetOwningPlayer(collidesWith)));
            }
        }
    }

    private onFlameProjectileCollide(projectile: Projectile, collidesWith: unit) {
        projectile.setDestroy(true);
        if (this.equippedTo) {
            const crewmember = CrewFactory.getInstance().getCrewmemberForUnit(this.equippedTo.unit);
            if (crewmember) {
                UnitDamageTarget(
                    projectile.source, 
                    collidesWith, 
                    MathRound(this.getDamage(crewmember) * 1.1), 
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
    }

    private onStopShooting() {
        this.endSound.playSoundOnUnit(this.equippedTo.unit.handle, 127);
        BlzStartUnitAbilityCooldown(this.equippedTo.unit.handle, this.getAbilityId(), 8);
        this.shootTimer.pause();
    }

    protected getTooltip(crewmember: Crewmember) {
        // const minDistance = this.spreadAOE-this.getStrayValue(crewmember) / 2;

        const damage = this.getDamage(crewmember);
        const newTooltip = MINIGUN_EXTENDED(this, damage);
        return newTooltip;
    }

    protected getItemTooltip(crewmember: Crewmember): string {
        const damage = this.getDamage(crewmember);
        return MINIGUN_ITEM(this, damage);
    }


    public getDamage(caster: Crewmember): number {
        return MathRound( 13 * caster.getDamageBonusMult());
    }

    public getAbilityId() { return ABIL_WEP_MINIGUN; }
    public getItemId() { return ITEM_WEP_MINIGUN; }
}