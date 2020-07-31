/** @noSelfInFile **/

import { Projectile } from "./projectile/projectile";
import { Vector3 } from "../types/vector3";
import { Gun } from "./guns/gun";
import { BurstRifle, InitBurstRifle } from "./guns/burst-rifle";
import { Crewmember } from "../crewmember/crewmember-type";
import { Game } from "../game";
import { Trigger, Unit, Timer } from "w3ts";
import { Log } from "../../lib/serilog/serilog";
import { Attachment } from "./attachment/attachment";
import { ArmableUnit } from "./guns/unit-has-weapon";
import { SNIPER_ITEM_ID, BURST_RIFLE_ITEM_ID, HIGH_QUALITY_POLYMER_ITEM_ID, EMS_RIFLING_ITEM_ID, LASER_ABILITY_ID, LASER_ITEM_ID, SHOTGUN_ITEM_ID, AT_ITEM_DRAGONFIRE_BLAST } from "./weapon-constants";
import { InitLaserRifle, LaserRifle } from "./guns/laser-rifle";
import { Shotgun, InitShotgun } from "./guns/shotgun";
import { RailRifle } from "./attachment/rail-rifle";
import { DragonfireBarrelAttachment } from "./attachment/dragonfire-barrel";
import { getZFromXY } from "lib/utils";
import { Entity } from "app/entity-type";
import { EventEntity } from "app/events/event-entity";
import { EVENT_TYPE } from "app/events/event-enum";
import { ForceEntity } from "app/force/force-entity";
import { CrewFactory } from "app/crewmember/crewmember-factory";

export class WeaponEntity extends Entity {
    private static instance: WeaponEntity;

    public static getInstance() {        
        if (this.instance == null) {
            this.instance = new WeaponEntity();
        }
        return this.instance;
    }

    WEAPON_MODE: 'CAST' | 'ATTACK' = 'CAST';
    unitsWithWeapon = new Map<unit, Gun>();
    game: Game;
    
    weaponItemIds: Array<number> = [];
    weaponAbilityIds: Array<number> = [];

    guns: Array<Gun> = [];

    projectiles: Array<Projectile> = [];
    projectileIdCounter: number = 0;

    constructor() {
        super();
        
        /**
         * Initialise all guns first
         * To add a new weapon call its initialisation AND add it to CreateWeaponForId()
         * I tried to work out a better way of doing this, but sleep is hurting my thoughts
         */
        InitBurstRifle();
        InitLaserRifle();
        InitShotgun();

        /**
         * Now initialise all weapon systems
         */
        this.initialiseWeaponEquip();
        this.initaliseWeaponShooting();
        this.initialiseWeaponDropPickup();
    }


    /**
     * Loops through and updates all projectiles
     * @param DELTA_TIME The time passed since last loop, used to get real time value of velocity
     */
    step() {

        let i = 0;
        while (i < this.projectiles.length) {
            const projectile = this.projectiles[i];
            
            const startPosition = projectile.getPosition();
            const delta = projectile.update(this._timerDelay);

            // If the projectile collides check to see if it hits anything
            if (projectile.doesCollide()) {
                const nextPosition = projectile.getPosition();
                
                const checker = projectile.getDoodadChecker();
                this.checkCollisionsForProjectile(
                    projectile, 
                    startPosition, 
                    nextPosition, 
                    delta,
                    checker(
                        (startPosition.x < nextPosition.x ? startPosition.x : nextPosition.x) - projectile.getCollisionRadius(), 
                        (startPosition.y < nextPosition.y ? startPosition.y : nextPosition.y) - projectile.getCollisionRadius(), 
                        (startPosition.x < nextPosition.x ? nextPosition.x : startPosition.x) + projectile.getCollisionRadius(), 
                        (startPosition.y < nextPosition.y ? nextPosition.y : startPosition.y) + projectile.getCollisionRadius(),
                    )
                );
            }

            // Destroy projectile if it asks nicely
            if (!(projectile.willDestroy() && projectile.destroy())) {
                this.projectiles[i] = this.projectiles[this.projectiles.length-1];
                delete this.projectiles[this.projectiles.length - 1];
            }
            else {
                i++;
            }
        }
    }

    /**
     * Create and use only a single group
     * This is for optimisation purposes, creating groups is expensive
     */
    collisionCheckGroup = CreateGroup();
    /**
     * See if a projectile collides with any units given a line and speed
     * @param projectile 
     * @param from 
     * @param to 
     * @param delta 
     */
    checkCollisionsForProjectile(projectile: Projectile, from: Vector3, to: Vector3, delta: Vector3, pbLockers: destructable[]) {
        if (!projectile.filter) return;

        // Clear existing group units
        GroupClear(this.collisionCheckGroup);

        const centerPoint = from.add(to).multiplyN(0.5);
        const checkDist = delta.getLength() + projectile.getCollisionRadius() + 200;

        // Grab all units in the rough area
        // Optimisation to not run an expensive check on many units
        GroupEnumUnitsInRange(this.collisionCheckGroup, centerPoint.x, centerPoint.y, checkDist, projectile.filter);

        // Now loop through all units found
        ForGroup(this.collisionCheckGroup, () => {
            const unit = GetEnumUnit();
            const unitLoc = new Vector3(GetUnitX(unit), GetUnitY(unit), 0);
            // Calculates the distance away from the dot product
            const distance = unitLoc.distanceToLine(from, to);
            if (distance < (projectile.getCollisionRadius() + BlzGetUnitCollisionSize(unit))) {
                projectile.collide(unit);
            }
        });

        // After all this is done, check for pathing blockers
        if (!projectile.willDestroy()) {
            const blocker = pbLockers.find(b => {
                const dLoc = new Vector3( GetDestructableX(b), GetDestructableY(b), 0);
                // Calculates the distance away from the dot product
                const distance = dLoc.distanceToLine(from, to);
                if (distance < (projectile.getCollisionRadius() + 32)) {
                    projectile.setDestroy(true);
                }
            })
        }
    }

    addProjectile(projectile: Projectile): void {
        projectile.setId(this.projectileIdCounter);
        this.projectiles.push(projectile);
    }
    
    getGunForItem(item: item): Gun | void {
        for (let gun of this.guns) {
            if (gun.item == item) {
                return gun;
            }
        }
        return undefined;
    }

    getGunForUnit(unit: Unit): Gun | void {
        for (let gun of this.guns) {
            if (gun.equippedTo && gun.equippedTo.unit == unit) {
                return gun;
            }
        }
    }

    /**
     * Here there be dragons
     */
    // Equip weapon ability ID
    private equipWeaponAbilityId = FourCC('A004');
    weaponEquipTrigger = new Trigger();
    initialiseWeaponEquip() {
        this.weaponEquipTrigger.registerAnyUnitEvent(EVENT_PLAYER_UNIT_SPELL_EFFECT);
        this.weaponEquipTrigger.addCondition(Condition(() => {
            let spellId = GetSpellAbilityId();
            return spellId === this.equipWeaponAbilityId;
        }));
        this.weaponEquipTrigger.addAction(() => {
            const unit = Unit.fromHandle(GetTriggerUnit());
            // Because blizzard is smart and we can't detect if an item is being manipulated AND cast
            // Lets grab the order ID, subtract a magic number by it and the remaining number is the inventory slot used
            const orderId = GetUnitCurrentOrder(unit.handle);
            const itemSlot = orderId - 852008;
            const item = UnitItemInSlot(unit.handle, itemSlot);

            // Phew, hope you have the water running, ready for your shower            
            let crewmember = CrewFactory.getInstance().getCrewmemberForUnit(unit);
            if (crewmember) {
                this.applyItemEquip(crewmember, item);
            }
        })
    }

    applyItemEquip(unit: Crewmember, item: item) {

        const itemId = GetItemTypeId(item);
        const itemIsWeapon = this.itemIsWeapon(itemId);
        const itemIsAttachment = this.itemIsAttachment(itemId);

        if (itemIsWeapon) {
            const oldWeapon = this.getGunForUnit(unit.unit);
            const weaponForItem = this.getGunForItem(item) || this.createWeaponForId(item, unit);

            if (oldWeapon) {
                oldWeapon.onRemove();
            }

            // Now check to see if we created a gun or not
            if (weaponForItem) {
                this.guns.push(weaponForItem);
                weaponForItem.onAdd(unit);

                // Broadcast item equip event
                EventEntity.getInstance().sendEvent(EVENT_TYPE.WEAPON_EQUIP, { 
                    source: unit.unit, crewmember: unit, data: { weapon: weaponForItem }
                });
            }
        }

        // Otherwise it's an attachment
        else if (itemIsAttachment) {
            if (unit.weapon) {
                const attachment = this.createAttachmentForId(item);
                if (attachment) {
                    attachment.attachTo(unit.weapon, unit);
                    unit.updateTooltips();
                    
                    // Broadcast item equip event
                    EventEntity.getInstance().sendEvent(EVENT_TYPE.WEAPON_EQUIP, { 
                        source: unit.unit, crewmember: unit, data: { attachment: attachment }
                    });
                }                
            }
        }

        // Uh oh, unsupported. Log and remind myself to add support.
        else {
            Log.Warning(`Warning, item ${itemId} is being attached but is not attachment or weapon`);
        }
    }

    weaponShootTrigger = new Trigger();
    weaponAttackTrigger = new Trigger();
    initaliseWeaponShooting() {
        // if (this.WEAPON_MODE === 'CAST') {
            this.weaponShootTrigger.registerAnyUnitEvent(EVENT_PLAYER_UNIT_SPELL_EFFECT);
            this.weaponShootTrigger.addCondition(Condition(() => this.weaponAbilityIds.indexOf(GetSpellAbilityId()) >= 0))
            this.weaponShootTrigger.addAction(() => {
                let unit = Unit.fromHandle(GetTriggerUnit());

                let targetLoc = new Vector3(
                    GetSpellTargetX(),
                    GetSpellTargetY(),
                    0
                );

                targetLoc.z = getZFromXY(targetLoc.x, targetLoc.y);

                // Get unit weapon instance
                const crewmember = CrewFactory.getInstance().getCrewmemberForUnit(unit);
                const weapon = this.getGunForUnit(unit);
                if (weapon && crewmember) {
                    // If we are targeting a unit pass the event over to the force module
                    const targetedUnit = GetSpellTargetUnit();
                    if (targetedUnit) {
                        ForceEntity.getInstance().aggressionBetweenTwoPlayers(unit.owner, Unit.fromHandle(targetedUnit).owner);
                    }
                    
                    weapon.onShoot(
                        crewmember, 
                        targetLoc
                    );
                }
            })
        // }
        // // Handle auto attack
        // else {

        // Handle start of the attack
        const attackTrigger = new Trigger();
        attackTrigger.registerAnyUnitEvent(EVENT_PLAYER_UNIT_ATTACKED);
        attackTrigger.addAction(() => {
            let unit = Unit.fromHandle(GetAttacker());
            let targetUnit = Unit.fromHandle(GetAttackedUnitBJ())

            const validAggression = ForceEntity.getInstance().aggressionBetweenTwoPlayers(
                unit.owner, 
                targetUnit.owner
            );
            if (!validAggression) IssueImmediateOrder(unit.handle, "stop");
        });

            this.weaponAttackTrigger.registerAnyUnitEvent(EVENT_PLAYER_UNIT_DAMAGED);
            this.weaponAttackTrigger.addCondition(Condition(() => BlzGetEventIsAttack()));
            this.weaponAttackTrigger.addAction(() => {
                let unit = Unit.fromHandle(GetEventDamageSource());
                let targetUnit = Unit.fromHandle(BlzGetEventDamageTarget())

                const validAggression = ForceEntity.getInstance().aggressionBetweenTwoPlayers(
                    unit.owner, 
                    targetUnit.owner
                );

                if (!this.unitsWithWeapon.has(GetEventDamageSource())) return;

                let targetLocation = new Vector3(targetUnit.x, targetUnit.y, targetUnit.z);
                
                // Clear and remove all damage taken
                BlzSetEventDamage(0);

                // Get unit weapon instance
                const crewmember = CrewFactory.getInstance().getCrewmemberForUnit(unit);
                const weapon = this.getGunForUnit(unit);
                if (weapon && crewmember) {
                    // If we are targeting a unit pass the event over to the force module
                    const targetedUnit = GetSpellTargetUnit();
                    if (targetedUnit) {
                        ForceEntity.getInstance().aggressionBetweenTwoPlayers(unit.owner, Unit.fromHandle(targetedUnit).owner);
                    }
                    
                    weapon.onShoot(
                        crewmember, 
                        targetLocation
                    );
                }
            })
        // }
    }

    weaponDropTrigger = new Trigger();
    weaponPickupTrigger = new Trigger();
    initialiseWeaponDropPickup() {
        this.weaponDropTrigger.registerAnyUnitEvent(EVENT_PLAYER_UNIT_DROP_ITEM);
        this.weaponDropTrigger.addCondition(Condition(() => {
            const gun = this.getGunForItem(GetManipulatedItem());
            if (gun) {
                gun.onRemove();
            }
            return false;
        }));

        this.weaponPickupTrigger.registerAnyUnitEvent(EVENT_PLAYER_UNIT_PICKUP_ITEM);
        this.weaponPickupTrigger.addCondition(Condition(() => {
            const gun = this.getGunForItem(GetManipulatedItem());
            const crewmember = CrewFactory.getInstance().getCrewmemberForUnit(Unit.fromHandle(GetManipulatingUnit()));
            if (gun && crewmember) {
                gun.updateTooltip(crewmember)
            }
            return false;
        }));
    }

    itemIsWeapon(itemId: number) : boolean {
        if (itemId === BURST_RIFLE_ITEM_ID) return true;
        if (itemId === LASER_ITEM_ID) return true;
        if (itemId === SHOTGUN_ITEM_ID) return true;
        return false;
    }

    itemIsAttachment(itemId: number) : boolean {
        if (itemId === HIGH_QUALITY_POLYMER_ITEM_ID) return true;
        if (itemId === EMS_RIFLING_ITEM_ID) return true;
        if (itemId == SNIPER_ITEM_ID) return true;
        if (itemId == AT_ITEM_DRAGONFIRE_BLAST) return true;
        return false;
    }

    createWeaponForId(item: item, unit: ArmableUnit) : Gun | undefined {
        let itemId = GetItemTypeId(item);
        if (itemId === BURST_RIFLE_ITEM_ID) 
            return new BurstRifle(item, unit);
        else if (itemId === LASER_ITEM_ID) 
            return new LaserRifle(this.game, item, unit);
        else if (itemId === SHOTGUN_ITEM_ID) 
            return new Shotgun(item, unit);
        return undefined;
    }

    createAttachmentForId(item: item) : Attachment | undefined {
        let itemId = GetItemTypeId(item);
        if (itemId == HIGH_QUALITY_POLYMER_ITEM_ID)
        if (itemId == SNIPER_ITEM_ID)
            return new RailRifle(this.game, item);
        if (itemId == AT_ITEM_DRAGONFIRE_BLAST)
            return new DragonfireBarrelAttachment(this.game, item);
        return undefined;
    }

    changeWeaponModeTo(weaponType: 'CAST' | 'ATTACK') {
        // Unequip all weapons
        const unitsToRequip = [];
        const gunsToReEquip = this.guns.filter(gun => {
            if (gun.equippedTo) {
                unitsToRequip.push(gun.equippedTo.unit);
                gun.onRemove();
                return true;
            }
        });

        this.WEAPON_MODE = weaponType;

        // Requip them
        gunsToReEquip.forEach((g, i) => g.onAdd(unitsToRequip[i]));
    }
}