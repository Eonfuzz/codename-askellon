import { Projectile } from "./projectile/projectile";
import { Vector3 } from "../types/vector3";
import { Gun } from "./guns/gun";
import { BurstRifle } from "./guns/burst-rifle";
import { Crewmember } from "../crewmember/crewmember-type";
import { Game } from "../game";
import { Trigger, Unit, Timer, Item, MapPlayer } from "w3ts";
import { Log } from "../../lib/serilog/serilog";
import { Attachment } from "./attachment/attachment";
import {  ArmableUnitWithItem } from "./guns/unit-has-weapon";
import { SNIPER_ITEM_ID, BURST_RIFLE_ITEM_ID, LASER_ABILITY_ID, LASER_ITEM_ID, SHOTGUN_ITEM_ID, AT_ITEM_DRAGONFIRE_BLAST, BURST_RIFLE_ABILITY_ID, SHOTGUN_ABILITY_ID } from "./weapon-constants";
import { LaserRifle } from "./guns/laser-rifle";
import { Shotgun } from "./guns/shotgun";
import { RailRifle } from "./attachment/rail-rifle";
import { DragonfireBarrelAttachment } from "./attachment/dragonfire-barrel";
import { getZFromXY } from "lib/utils";
import { Entity } from "app/entity-type";
import { EventEntity } from "app/events/event-entity";
import { EVENT_TYPE } from "app/events/event-enum";
import { ForceEntity } from "app/force/force-entity";
import { EventListener } from "app/events/event-type";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { ITEM_ATTACH_METEOR_CANISTER, ITEM_WEP_FLAMETHROWER, ITEM_WEP_MINIGUN, ITEM_WEP_NEOKATANA } from "resources/item-ids";
import { ABIL_WEP_FLAMETHROWER, ABIL_WEP_MINIGUN, ABIL_WEP_NEOKATANA } from "resources/ability-ids";
import { Minigun } from "./guns/minigun";
import { Hooks } from "lib/Hooks";
import { WeaponEntityAttackType } from "./weapon-attack-type";
import { Timers } from "app/timer-type";
import { GunItem } from "./guns/gun-item";
import { WepNeokatana } from "./guns/neokatana";
import { MeteorCanisterAttachment } from "./attachment/meteor-canister";
import { CREWMEMBER_UNIT_ID, UNIT_ID_EGG_AUTO_HATCH, UNIT_ID_EGG_AUTO_HATCH_LARGE } from "resources/unit-ids";
import { Flamethrower } from "./guns/flamethrower";
import { Vector2 } from "app/types/vector2";
import { InputManager } from "lib/TreeLib/InputManager/InputManager";
import { FilterIsAlive } from "resources/filters";
import { ALIEN_FORCE_NAME } from "app/force/forces/force-names";

export class WeaponEntity extends Entity {
    private static instance: WeaponEntity;

    public static getInstance() {        
        if (this.instance == null) {
            this.instance = new WeaponEntity();
            Hooks.set(this.name, this.instance);
        }
        return this.instance;
    }

    unitsWithWeapon = new Map<number, Gun>();
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
        // Init burst rifle
        this.weaponItemIds.push(BURST_RIFLE_ITEM_ID);
        this.weaponAbilityIds.push(BURST_RIFLE_ABILITY_ID);

        // Init shotgun
        this.weaponItemIds.push(SHOTGUN_ITEM_ID);
        this.weaponAbilityIds.push(SHOTGUN_ABILITY_ID);

        // Init laser rifle
        this.weaponItemIds.push(LASER_ITEM_ID);
        this.weaponAbilityIds.push(LASER_ABILITY_ID);

        // Init minigun
        this.weaponItemIds.push(ITEM_WEP_MINIGUN);
        this.weaponAbilityIds.push(ABIL_WEP_MINIGUN);

        // Init katana
        this.weaponItemIds.push(ITEM_WEP_NEOKATANA);
        this.weaponAbilityIds.push(ABIL_WEP_NEOKATANA);

        // Init Flamer
        this.weaponItemIds.push(ITEM_WEP_FLAMETHROWER);
        this.weaponAbilityIds.push(ABIL_WEP_FLAMETHROWER);

        /**
         * Now initialise all weapon systems
         */
        this.initialiseWeaponEquip();
        this.initaliseWeaponShooting();
        this.initialiseWeaponDropPickup();

        // Subscribe to event entity
        EventEntity.listen(new EventListener(EVENT_TYPE.DO_EQUIP_WEAPON, (self, data) => {
            this.applyItemEquip(data.source, data.data.item);
        }));
        EventEntity.listen(new EventListener(EVENT_TYPE.DO_UNQEUIP_WEAPON, (self, data) => {
            this.onWeaponUnEquip(data.source, data.data.item, data.data.weapon);
        }));
        EventEntity.listen(new EventListener(EVENT_TYPE.ADD_PROJECTILE, (self, data) => {
            this.addProjectile(data.data.projectile);
        }));
        EventEntity.listen(new EventListener(EVENT_TYPE.WEAPON_MODE_CHANGE, (self, data) => {
            this.changeWeaponModeTo(data.crewmember, data.data.mode);
        }));
        EventEntity.listen(new EventListener(EVENT_TYPE.DEBUG_WEAPONS, (self, data) => {
            this.log();
        }));
    }

    public log() {
        Log.Information(`Weapon Entity`);
        Log.Information(`Projectiles: ${this.projectiles.length}`);
        Log.Information(`Guns: ${this.guns.length}`);
    }


    _timerDelay = 0.02;
    // private MISSILES_PROCESSED_PER_TICK = 10;
    /**
     * Loops through and updates all projectiles
     * @param DELTA_TIME The time passed since last loop, used to get real time value of velocity
     */
    step() {

        let i = 0;
        // const toProcess = Math.min(this.projectiles.length, this.MISSILES_PROCESSED_PER_TICK);

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
            if (projectile.willDestroy() && projectile.destroy()) {
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
        { // DO
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
        } // END
    }

    addProjectile(projectile: Projectile): void {
        projectile.setId(this.projectileIdCounter);
        this.projectiles.push(projectile);
    }
    
    getGunForItem(item: item): GunItem | void {
        for (let gun of this.guns) {
            if (gun instanceof GunItem && gun.item == item) {
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

            EventEntity.send(EVENT_TYPE.DO_EQUIP_WEAPON, {
                source: unit,
                data: { item }
            })
        })
    }

    applyItemEquip(unit: Unit, item: item) {

        const itemId = GetItemTypeId(item);

        const itemIsWeapon = this.itemIsWeapon(itemId);
        const itemIsAttachment = this.itemIsAttachment(itemId);

        // Get crewmember
        const pData = PlayerStateFactory.get(unit.owner);
        const crew = pData.getCrewmember();

        // Log.Information("Equip "+GetItemName(item)+" is weapon "+itemIsWeapon+" is attachment "+itemIsAttachment);

        if (itemIsWeapon) {
            const oldWeapon = this.getGunForUnit(unit);
            const oldItem = this.getGunForItem(item);
            const weaponForItem =  oldItem|| this.createWeaponForId(item, crew);


            if (oldWeapon) {
                oldWeapon.onRemove();
            }

            // Now check to see if we created a gun or not
            if (weaponForItem) {
                weaponForItem.onAdd(crew);
                this.unitsWithWeapon.set(crew.unit.id, weaponForItem);

                // Broadcast item equip event
                EventEntity.getInstance().sendEvent(EVENT_TYPE.WEAPON_EQUIP, { 
                    source: unit, crewmember: crew, data: { weapon: weaponForItem, item: item }
                });
            }
        }

        // Otherwise it's an attachment
        else if (itemIsAttachment) {
            if (crew.weapon) {
                // Log.Information("Crew has weapon while attaching");
                const attachment = this.createAttachmentForId(item);
                if (attachment) {
                    attachment.attachTo(crew.weapon as GunItem, crew);
                    crew.updateTooltips();
                    
                    // Broadcast item equip event
                    EventEntity.getInstance().sendEvent(EVENT_TYPE.WEAPON_EQUIP, { 
                        source: crew.unit, crewmember: crew, data: { attachment: attachment }
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
    // For smart casting
    weaponFacingTrigger = new Trigger();
    weaponFacingHostileGroup = CreateGroup();
    initaliseWeaponShooting() {
        this.weaponFacingTrigger.registerAnyUnitEvent(EVENT_PLAYER_UNIT_SPELL_CAST);
        this.weaponFacingTrigger.addCondition(() => {
            if (this.weaponAbilityIds.indexOf(GetSpellAbilityId()) >= 0) {
                const pData = PlayerStateFactory.get(MapPlayer.fromHandle(GetOwningPlayer(GetTriggerUnit())));
                return (pData && pData.getAttackType() === WeaponEntityAttackType.SMART);
            }
            return false;
        });
        this.weaponFacingTrigger.addAction(() => {
            const u = Unit.fromHandle(GetTriggerUnit());
            const c = InputManager.getLastMouseCoordinate(u.owner.handle);
            const a = new Vector2(u.x, u.y).angleTo(c);

            // Pick nearby units and make them hostile?
            GroupEnumUnitsInRange(
                this.weaponFacingHostileGroup, 
                c.x,
                c.y,
                250,
                FilterIsAlive(u.owner)
            );

            ForGroup(this.weaponFacingHostileGroup, () => {
                ForceEntity.getInstance().aggressionBetweenTwoPlayers(u.owner, Unit.fromHandle(GetEnumUnit()).owner);
            })

            u.facing = a;
        });

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
            if (!validAggression) return IssueImmediateOrder(unit.handle, "stop");
            // How do I handle auto spawning eggs?
            // I'm not actually too sure
            // I guess I do it here?
            if (unit.typeId === UNIT_ID_EGG_AUTO_HATCH || 
                unit.typeId === UNIT_ID_EGG_AUTO_HATCH_LARGE) {

                if (targetUnit.typeId === CREWMEMBER_UNIT_ID && !PlayerStateFactory.get(targetUnit.owner).getForce().is(ALIEN_FORCE_NAME)) {
                    unit.issueImmediateOrder("thunderclap");
                }
                else {
                    unit.paused = true;
                    unit.paused = false;
                }
            }
        });

        this.weaponAttackTrigger.registerAnyUnitEvent(EVENT_PLAYER_UNIT_DAMAGED);
        this.weaponAttackTrigger.addCondition(Condition(() => BlzGetEventIsAttack()));

        this.weaponShootTrigger.registerAnyUnitEvent(EVENT_PLAYER_UNIT_SPELL_EFFECT);
        this.weaponShootTrigger.addCondition(Condition(() => this.weaponAbilityIds.indexOf(GetSpellAbilityId()) >= 0));

    
        this.weaponShootTrigger.addAction(() => {
            let unit = Unit.fromHandle(GetTriggerUnit());

            const pData = PlayerStateFactory.get(unit.owner);
            const isSmartCast = (pData && pData.getAttackType() === WeaponEntityAttackType.SMART);

            const targetLoc : Vector3 = new Vector3(0, 0, 0);
            if (isSmartCast) {
                const mLoc = InputManager.getLastMouseCoordinate(unit.owner.handle);
                targetLoc.x = mLoc.x;
                targetLoc.y = mLoc.y;
            }
            else {
                targetLoc.x = GetSpellTargetX();
                targetLoc.y = GetSpellTargetY();
            }
            
            targetLoc.z = getZFromXY(targetLoc.x, targetLoc.y);

            // Get unit weapon instance
            const weapon = this.getGunForUnit(unit);
            if (weapon) {
                // If we are targeting a unit pass the event over to the force module
                const targetedUnit = GetSpellTargetUnit();
                if (targetedUnit) {
                    ForceEntity.getInstance().aggressionBetweenTwoPlayers(unit.owner, Unit.fromHandle(targetedUnit).owner);
                }
                
                weapon.onShoot(unit, targetLoc);
            }
        })

        this.weaponAttackTrigger.addAction(() => {
            let unit = Unit.fromHandle(GetEventDamageSource());
            let targetUnit = Unit.fromHandle(BlzGetEventDamageTarget())
            if (!this.unitsWithWeapon.has(GetHandleId(GetEventDamageSource()))) return;
            
            let targetLocation = new Vector3(targetUnit.x, targetUnit.y, targetUnit.z);
            
            // Clear and remove all damage taken
            BlzSetEventDamage(0);

            // Get unit weapon instance
            const weapon = this.getGunForUnit(unit);
            if (weapon) {
                // If we are targeting a unit pass the event over to the force module
                const targetedUnit = GetSpellTargetUnit();
                if (targetedUnit) {
                    ForceEntity.getInstance().aggressionBetweenTwoPlayers(unit.owner, Unit.fromHandle(targetedUnit).owner);
                }
                
                weapon.onShoot(unit, targetLocation);
            }
        });
    }

    weaponDropTrigger = new Trigger();
    weaponPickupTrigger = new Trigger();
    initialiseWeaponDropPickup() {
        this.weaponDropTrigger.registerAnyUnitEvent(EVENT_PLAYER_UNIT_DROP_ITEM);
        this.weaponDropTrigger.addCondition(Condition(() => {

            EventEntity.send(EVENT_TYPE.DO_UNQEUIP_WEAPON, { 
                source: Unit.fromHandle(GetTriggerUnit()), data: { item: GetManipulatedItem() }
            });
                
            return false;
        }));

        this.weaponPickupTrigger.registerAnyUnitEvent(EVENT_PLAYER_UNIT_PICKUP_ITEM);
        this.weaponPickupTrigger.addCondition(Condition(() => {
            const pData = PlayerStateFactory.get(MapPlayer.fromEvent());

            if (pData) {
                const unit = Unit.fromHandle(GetTriggerUnit());
                const gun = this.getGunForItem(GetManipulatedItem());
                if (gun) gun.updateTooltip(unit)
            }
            return false;
        }));
    }

    public onWeaponUnEquip(unit: Unit, item: item, _gun?: Gun) {
        let gun = _gun || this.getGunForItem(item);

        if (gun) {
            gun.onRemove();
            // Remove weapon
            this.unitsWithWeapon.delete(unit.id);
        }
    }

    itemIsWeapon(itemId: number) : boolean {
        if (itemId === BURST_RIFLE_ITEM_ID) return true;
        if (itemId === LASER_ITEM_ID) return true;
        if (itemId === SHOTGUN_ITEM_ID) return true;
        if (itemId === ITEM_WEP_MINIGUN) return true;
        if (itemId === ITEM_WEP_NEOKATANA) return true;
        if (itemId === ITEM_WEP_FLAMETHROWER) return true;
        return false;
    }

    itemIsAttachment(itemId: number) : boolean {
        // if (itemId === HIGH_QUALITY_POLYMER_ITEM_ID) return true;
        // if (itemId === EMS_RIFLING_ITEM_ID) return true;
        if (itemId == SNIPER_ITEM_ID) return true;
        if (itemId == AT_ITEM_DRAGONFIRE_BLAST) return true;
        if (itemId == ITEM_ATTACH_METEOR_CANISTER) return true;
        return false;
    }

    createWeaponForId(item: item, unit: ArmableUnitWithItem) : Gun | undefined {
        let itemId = GetItemTypeId(item);
        let result: GunItem;

        if (itemId === BURST_RIFLE_ITEM_ID) 
            result = new BurstRifle(item, unit);
        else if (itemId === LASER_ITEM_ID) 
            result =  new LaserRifle(this.game, item, unit);
        else if (itemId === SHOTGUN_ITEM_ID) 
            result =  new Shotgun(item, unit);
        else if (itemId === ITEM_WEP_MINIGUN) 
            result =  new Minigun(item, unit);
        else if (itemId === ITEM_WEP_FLAMETHROWER) 
            result =  new Flamethrower(item, unit);
        else if (itemId === ITEM_WEP_NEOKATANA) 
            result =  new WepNeokatana(item, unit);

            
        if (result) this.guns.push(result);
        return result;
    }

    createAttachmentForId(item: item) : Attachment | undefined {
        let itemId = GetItemTypeId(item);
        // if (itemId == HIGH_QUALITY_POLYMER_ITEM_ID)
        if (itemId == SNIPER_ITEM_ID)
            return new RailRifle(this.game, item);
        if (itemId == AT_ITEM_DRAGONFIRE_BLAST)
            return new DragonfireBarrelAttachment(this.game, item);
        if (itemId == ITEM_ATTACH_METEOR_CANISTER)
            return new MeteorCanisterAttachment(this.game, item);
        return undefined;
    }

    changeWeaponModeTo(crewmember: Crewmember, weaponType: WeaponEntityAttackType) {
        // Unequip all weapons
        const unitsToRequip = [];

        const equippedGun = this.getGunForUnit(crewmember.unit);
        if (equippedGun) {
            unitsToRequip.push(equippedGun.equippedTo.unit);
            equippedGun.onRemove();
            PlayerStateFactory.get(crewmember.unit.owner).setAttackType(weaponType);
            // Requip them
            Timers.addTimedAction(0, () => {
                equippedGun.onAdd(crewmember);
            });
        }
    }

    registerWeaponForUnit(gun: Gun) {
        this.unitsWithWeapon.set(gun.equippedTo.unit.id, gun);
        this.guns.push(gun);
    }
}