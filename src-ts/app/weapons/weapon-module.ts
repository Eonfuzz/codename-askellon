/** @noSelfInFile **/

import { Projectile } from "./projectile/projectile";
import { Vector3 } from "../types/vector3";
import { ProjectileTargetStatic } from "./projectile/projectile-target";
import { ProjectileSFX } from "./projectile/projectile-sfx";
import { Gun } from "./guns/gun";
import { BurstRifle } from "./guns/burst-rifle";
import { getCrewmemberForUnit } from "../crewmember/crewmember-module";
import { Crewmember } from "../crewmember/crewmember-type";
import { Game } from "../game";
import { Trigger } from "../types/jass-overrides/trigger";

export class WeaponModule {

    game: Game;

    guns: Array<Gun> = [];

    projectileUpdateTimer = new Trigger();
    projectiles: Array<Projectile> = [];

    GLOBAL_LOCATION = Location(0, 0);

    constructor(game: Game) {
        this.game = game;
        this.initProjectiles();
        
        this.initialiseWeaponPickup();
        this.initaliseWeaponShooting();
        this.initialiseWeaponDropping();
    }

    initProjectiles() {
        const WEAPON_UPDATE_PERIOD = 0.03;
        this.projectileUpdateTimer.RegisterTimerEventPeriodic(WEAPON_UPDATE_PERIOD);
        this.projectileUpdateTimer.AddAction(() => this.updateProjectiles(WEAPON_UPDATE_PERIOD))

        // INIT_BURST_RFILE();
    }

    updateProjectiles(DELTA_TIME: number) {
        this.projectiles = this.projectiles.filter((projectile: Projectile) => {
            const startPosition = projectile.getPosition();
            const delta = projectile.update(this, DELTA_TIME);

            if (projectile.doesCollide()) {
                const nextPosition = projectile.getPosition();
                this.checkCollisionsForProjectile(projectile, startPosition, nextPosition, delta);
            }

            if (projectile.willDestroy()) {
                return !projectile.destroy();
            }
            return true;
        });
    }

    collisionCheckGroup = CreateGroup();
    checkCollisionsForProjectile(projectile: Projectile, from: Vector3, to: Vector3, delta: Vector3) {
        const centerPoint = from.add(to).multiplyN(0.5);
        const checkDist = delta.getLength() + projectile.getCollisionRadius();

        // Clear existing group units
        GroupClear(this.collisionCheckGroup);
        // Move our dummy location
        if (projectile.filter) {
            GroupEnumUnitsInRange(this.collisionCheckGroup, centerPoint.x, centerPoint.y, checkDist, projectile.filter);
        }
        else {
            return;
        }

        ForGroup(this.collisionCheckGroup, () => {
            const unit = GetEnumUnit();
           
            const unitLoc = new Vector3(GetUnitX(unit), GetUnitY(unit), 0);
            const distance = unitLoc.distanceToLine(from, to);

            if (distance < (projectile.getCollisionRadius() + BlzGetUnitCollisionSize(unit))) {
                projectile.collide(unit);
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

    weaponPickupTrigger = new Trigger();
    initialiseWeaponPickup() {
        this.weaponPickupTrigger.RegisterAnyUnitEventBJ(EVENT_PLAYER_UNIT_PICKUP_ITEM);
        this.weaponPickupTrigger.AddCondition(() => {
            const item = GetManipulatedItem();
            const unit = GetManipulatingUnit();
            let itemId = GetItemTypeId(item);
    
            if (itemId == BurstRifle.itemId) {
                let crewmember = getCrewmemberForUnit(unit);
                let burstRifle = this.getGunForItem(item);
    
                if (!burstRifle) {
                    burstRifle = new BurstRifle(item, unit);
                    this.guns.push(burstRifle);
                }
    
                if (crewmember) {
                    burstRifle.onAdd(this, crewmember);
                }
            }
            return false;
        });
    }

    weaponShootTrigger = new Trigger();
    initaliseWeaponShooting() {
        this.weaponShootTrigger.RegisterAnyUnitEventBJ(EVENT_PLAYER_UNIT_SPELL_EFFECT);
        this.weaponShootTrigger.AddCondition(() => {
            let spellId = GetSpellAbilityId();
    
            if (spellId === BurstRifle.abilityId) {
                let unit = GetTriggerUnit();
                let targetLocation = GetSpellTargetLoc();
                let targetLoc = new Vector3(
                    GetLocationX(targetLocation), 
                    GetLocationY(targetLocation), 
                    GetLocationZ(targetLocation)
                );
    
                // Get unit weapon instance
                const crewmember = getCrewmemberForUnit(unit);
                const burstRifle = this.getGunForUnit(unit);
                if (burstRifle && crewmember) {
                    burstRifle.onShoot(
                        this,
                        crewmember, 
                        targetLoc
                    );
                }
                RemoveLocation(targetLocation);
            }
            return false;
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
}