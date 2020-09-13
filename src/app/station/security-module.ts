import { Trigger, Unit, Group, Rectangle, MapPlayer } from "w3ts";
import { getZFromXY } from "lib/utils";
import { BURST_RIFLE_ITEM_ID, SHOTGUN_ITEM_ID, LASER_ITEM_ID, AT_ITEM_DRAGONFIRE_BLAST, SNIPER_ITEM_ID, ITEM_ID_EMO_INHIB, ITEM_ID_REPAIR, ITEM_ID_NANOMED, ITEM_ID_25_COINS, ITEM_ID_CRYO_GRENADE } from "app/weapons/weapon-constants";
import { ITEM_TRIFEX_ID, ITEM_BARRICADES } from "resources/item-ids";
import { SFX_CATAPULT_MISSILE } from "resources/sfx-paths";
import { EVENT_TYPE } from "app/events/event-enum";
import { EventEntity } from "app/events/event-entity";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { Hooks } from "lib/Hooks";
import { UNIT_ID_CRATE, UNIT_ID_MANSION_DOOR } from "resources/unit-ids";
import { LootTable } from "./loot-table/loot-table";
import { GUN_LOOT_TABLE, MISC_ITEM_TABLE, MEDICAL_LOOT_TABLE } from "./loot-table/loot";
import { Door } from "./door";
import { Entity } from "app/entity-type";

// const UNIT_ID_STATION_SECURITY_TURRET = FourCC('');
const UNIT_ID_STATION_SECURITY_POWER = FourCC('h004');
export class SecurityEntity extends Entity {
    isDestroyedMap = new Map<Unit, boolean>();

    private static instance: SecurityEntity;

    public static getInstance() {        
        if (this.instance == null) {
            this.instance = new SecurityEntity();
            Hooks.set(this.name, this.instance);
        }
        return this.instance;
    }

    private doors = new Map<Unit, Door>();
    private doorsIterator: Door[] = [];

    constructor() {
        super();
        
        const securityDamageTrigger = new Trigger();

        // Get all security units on the map
        const uGroup = CreateGroup();
        GroupEnumUnitsOfPlayer(uGroup, PlayerStateFactory.StationProperty.handle, Filter(() => {
            const uType = GetUnitTypeId(GetFilterUnit());
            
            // if (uType === UNIT_ID_STATION_SECURITY_TURRET) return true;
            if (uType !== UNIT_ID_STATION_SECURITY_POWER &&
                uType !== UNIT_ID_MANSION_DOOR) return false;

            const u = Unit.fromHandle(GetFilterUnit());
            securityDamageTrigger.registerUnitEvent(u, EVENT_UNIT_DAMAGED);

            if (u.typeId === UNIT_ID_MANSION_DOOR) {
                const door = new Door(u, false);
                this.doors.set(u, door);
                this.doorsIterator.push(door)
            }

            return false;
        }));
        GroupEnumUnitsOfPlayer(uGroup, PlayerStateFactory.NeutralPassive.handle, Filter(() => {
            const uType = GetUnitTypeId(GetFilterUnit());
            
            // if (uType === UNIT_ID_STATION_SECURITY_TURRET) return true;
            if (uType !== UNIT_ID_STATION_SECURITY_POWER && 
                uType !== UNIT_ID_MANSION_DOOR) return false;

            const u = Unit.fromHandle(GetFilterUnit());
            securityDamageTrigger.registerUnitEvent(u, EVENT_UNIT_DAMAGED);

            if (u.typeId === UNIT_ID_MANSION_DOOR) {
                const door = new Door(u, false);
                this.doors.set(u, door);
                this.doorsIterator.push(door)
            }

            return false;
        }));

        securityDamageTrigger.addAction(() => this.onSecurityDamage(
            BlzGetEventDamageTarget(),
            GetEventDamageSource(),
            GetEventDamage()
        ));

        // Decimate crates
        this.decimateCrates();

        // Now begin crate death trig
        const crateDeath = new Trigger();
        crateDeath.registerAnyUnitEvent(EVENT_PLAYER_UNIT_DEATH);
        crateDeath.addCondition(Filter(() => GetUnitTypeId(GetDyingUnit()) === UNIT_ID_CRATE));
        crateDeath.addAction(() => this.onCrateDeath(Unit.fromHandle(GetDyingUnit())));
    }

    public isUnitDestroyed(u: Unit) {
        return this.isDestroyedMap.get(u) || false;
    }

    /**
     * Prevent security death
     */
    public onSecurityDamage(u: unit, source: unit, damage: number) {
        // Log.Information("Security taking damage");
        // Is this blow gonna kill the security item?
        const damageWithAllowance = damage + GetUnitState(u, UNIT_STATE_MAX_LIFE) * 0.1;
        if (damageWithAllowance > GetUnitState(u, UNIT_STATE_LIFE)) {
            const unit = Unit.fromHandle(u);
            const unitIsDestroyed = this.isUnitDestroyed(unit);

            // Set the unit to 1 hp
            SetUnitState(u, UNIT_STATE_LIFE, 1);
            // Make the unit invulnerable
            SetUnitInvulnerable(u, true);
            // Set the damage dealt to zero
            BlzSetEventDamage(0);

            if (!unitIsDestroyed) {
                this.isDestroyedMap.set(unit, true);
                // Pause the unit
                unit.paused = true;
                // Publish event that a security object is damaged
                EventEntity.getInstance().sendEvent(EVENT_TYPE.STATION_SECURITY_DISABLED, {
                    source: Unit.fromHandle(source),
                    data: { 
                        unit: unit,
                        damaged: Unit.fromHandle(u)
                    }
                });
            }
        }
    }

    /**
     * If the security unit is full hp re-enable it
     * @param u 
     */
    public onSecurityHeal(u: unit, source: unit) {

        // Log.Information("Security healing!");

        const unit = Unit.fromHandle(u);
        const unitIsDestroyed = this.isUnitDestroyed(unit);

        // Remove damage invulnerability
        unit.invulnerable = false;

        // Once a unit is healed remove its invulnerability
        // Allow some margin of error
        if (unitIsDestroyed && GetUnitLifePercent(u) >= 99) {
            this.isDestroyedMap.set(unit, false);
            // Set unit hp to full
            SetUnitLifePercentBJ(u, 100);
            // Pause the unit
            unit.paused = false;
            // Publish event that a security object is repaired
            EventEntity.getInstance().sendEvent(EVENT_TYPE.STATION_SECURITY_ENABLED, {
                source: Unit.fromHandle(source),
                data: { 
                    unit: unit,
                    damaged: Unit.fromHandle(u)
                }
            });
        }
    }

    
    _timerDelay = 0.5;
    step() {
        for (let index = 0; index < this.doorsIterator.length; index++) {
            const door = this.doorsIterator[index];
            door.search();
        }
    }



    decimateCrates() {
        const group = new Group();
        const rect = Rectangle.fromHandle(bj_mapInitialPlayableArea);

        group.enumUnitsInRect(rect, Filter(() => GetUnitTypeId(GetFilterUnit()) === UNIT_ID_CRATE));
        group.for(() => {
            const doDecimate = GetRandomInt(0, 100) >= 40;
            if (doDecimate) {
                RemoveUnit(GetEnumUnit());
            }
        });

        group.destroy();
    }

    onCrateDeath(who: Unit) {
        const uX = who.x;
        const uY = who.y;
        const uZ = getZFromXY(uX, uY);

        const sfx = AddSpecialEffect(SFX_CATAPULT_MISSILE, who.x, who.y);
        BlzSetSpecialEffectZ(sfx, uZ+10);
        DestroyEffect(sfx);
        RemoveUnit(who.handle);

        // Handle loot tables
        this.spawnLootOn(uX, uY); 
    }

    spawnLootOn(x: number, y: number) {
        const mainSeed = GetRandomInt(0, 1000);

        let table: LootTable;

        // 5% for weapon spawn
        if (mainSeed >= 900) {
            table = GUN_LOOT_TABLE;
        }
        // 50% Chance for 50 coins
        else if (mainSeed >= 300) {
            table = MISC_ITEM_TABLE;
        }
        else {
            table = MEDICAL_LOOT_TABLE;
        }

        CreateItem(table.getItem(), x, y);
       
        EventEntity.getInstance().sendEvent(EVENT_TYPE.CREW_GAIN_EXPERIENCE, {
            source: Unit.fromHandle(GetKillingUnit() || GetDyingUnit()),
            data: { value: 25 }
        });
    }
}