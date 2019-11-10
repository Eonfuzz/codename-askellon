/** @noSelfInFile **/

import { Projectile } from "./projectile/projectile";
import { Vector3 } from "../types/vector3";
import { ProjectileTargetStatic } from "./projectile/projectile-target";
import { ProjectileSFX } from "./projectile/projectile-sfx";
import { Gun } from "./guns/gun";
import { BurstRifle } from "./guns/burst-rifle";
import { Crewmember } from "../crewmember/crewmember-type";
import { Game } from "../game";
import { Trigger } from "../types/jass-overrides/trigger";
import { SniperRifle } from "./guns/sniper-rifle";

export class WeaponModule {
    game: Game;
    
    weaponItemIds: Array<number> = [];
    weaponAbilityIds: Array<number> = [];

    guns: Array<Gun> = [];

    projectiles: Array<Projectile> = [];

    constructor(game: Game) {
        this.game = game;
        
        /**
         * Initialise all guns first
         * To add a new weapon call its initialisation AND add it to CreateWeaponForId()
         * I tried to work out a better way of doing this, but sleep is hurting my thoughts
         */
        BurstRifle.initialise(this);
        SniperRifle.initialise(this);

        /**
         * Now initialise all weapon systems
         */
        this.initialiseWeaponEquip();
        this.initaliseWeaponShooting();
        this.initialiseWeaponDropping();

        this.initProjectiles();
    }

    /**
     * Registers are repeating timer that updates projectiles
     */
    projectileUpdateTimer = new Trigger();
    initProjectiles() {
        const WEAPON_UPDATE_PERIOD = 0.03;
        this.projectileUpdateTimer.RegisterTimerEventPeriodic(WEAPON_UPDATE_PERIOD);
        this.projectileUpdateTimer.AddAction(() => this.updateProjectiles(WEAPON_UPDATE_PERIOD))
    }

    /**
     * Loops through and updates all projectiles
     * @param DELTA_TIME The time passed since last loop, used to get real time value of velocity
     */
    updateProjectiles(DELTA_TIME: number) {
        this.projectiles = this.projectiles.filter((projectile: Projectile) => {
            const startPosition = projectile.getPosition();
            const delta = projectile.update(this, DELTA_TIME);

            // If the projectile collides check to see if it hits anything
            if (projectile.doesCollide()) {
                const nextPosition = projectile.getPosition();
                this.checkCollisionsForProjectile(projectile, startPosition, nextPosition, delta);
            }

            // Destroy projectile if it asks nicely
            if (projectile.willDestroy()) {
                // Destroy is a callback, it may not actually destroy itself
                return !projectile.destroy();
            }
            return true;
        });
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
    checkCollisionsForProjectile(projectile: Projectile, from: Vector3, to: Vector3, delta: Vector3) {
        if (!projectile.filter) return;

        // Clear existing group units
        GroupClear(this.collisionCheckGroup);

        const centerPoint = from.add(to).multiplyN(0.5);
        const checkDist = delta.getLength() + projectile.getCollisionRadius();

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
                projectile.collide(this, unit);
            }
        });
    }

    addProjectile(projectile: Projectile): void {
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

    getGunForUnit(unit: unit): Gun | void {
        for (let gun of this.guns) {
            if (gun.equippedTo == unit) {
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
        this.weaponEquipTrigger.RegisterAnyUnitEventBJ(EVENT_PLAYER_UNIT_SPELL_EFFECT);
        this.weaponEquipTrigger.AddCondition(() => {
            let spellId = GetSpellAbilityId();
            return spellId === this.equipWeaponAbilityId;
        });
        this.weaponEquipTrigger.AddAction(() => {
            const unit = GetTriggerUnit();
            // Because blizzard is smart and we can't detect if an item is being manipulated AND cast
            // Lets grab the order ID, subtract a magic number by it and the remaining number is the inventory slot used
            const orderId = GetUnitCurrentOrder(unit);
            const itemSlot = orderId - 852008;
            const item = UnitItemInSlot(unit, itemSlot);

            // Phew, hope you have the water running, ready for your shower            
            let crewmember = this.game.crewModule.getCrewmemberForUnit(unit);
            let weapon = this.getGunForItem(item);
            let oldWeapon = this.getGunForUnit(unit);

            if (oldWeapon) {
                oldWeapon.onRemove(this);
            }
            if (!weapon) {
                weapon = this.createWeaponForId(item, unit);
                this.guns.push(weapon);
            }

            if (crewmember) {
                weapon.onAdd(this, crewmember);
            }
        })
    }

    weaponShootTrigger = new Trigger();
    initaliseWeaponShooting() {
        this.weaponShootTrigger.RegisterAnyUnitEventBJ(EVENT_PLAYER_UNIT_SPELL_EFFECT);
        this.weaponShootTrigger.AddCondition(() => this.weaponAbilityIds.indexOf(GetSpellAbilityId()) >= 0)
        this.weaponShootTrigger.AddAction(() => {
            let unit = GetTriggerUnit();
            let targetLocation = GetSpellTargetLoc();
            let targetLoc = new Vector3(
                GetLocationX(targetLocation), 
                GetLocationY(targetLocation), 
                GetLocationZ(targetLocation)
            );

            // Get unit weapon instance
            const crewmember = this.game.crewModule.getCrewmemberForUnit(unit);
            const weapon = this.getGunForUnit(unit);
            if (weapon && crewmember) {
                // If we are targeting a unit pass the event over to the force module
                const targetedUnit = GetSpellTargetUnit();
                if (targetedUnit) {
                    this.game.forceModule.aggressionBetweenTwoPlayers(GetOwningPlayer(unit), GetOwningPlayer(targetedUnit));
                }
                
                weapon.onShoot(
                    this,
                    crewmember, 
                    targetLoc
                );
            }
            RemoveLocation(targetLocation);
        })
    }

    weaponDropTrigger = new Trigger();
    initialiseWeaponDropping() {
        this.weaponDropTrigger.RegisterAnyUnitEventBJ(EVENT_PLAYER_UNIT_DROP_ITEM);
        this.weaponDropTrigger.AddCondition(() => {
            const gun = this.getGunForItem(GetManipulatedItem());
            if (gun) {
                gun.onRemove(this);
            }
            return false;
        });
    }

    createWeaponForId(item: item, unit: unit) : Gun {
        let itemId = GetItemTypeId(item);
        if (itemId == SniperRifle.itemId)
            return new SniperRifle(item, unit);
        // if (itemId === BurstRifle.itemId) 
            return new BurstRifle(item, unit);
        // return undefined;
    }
}