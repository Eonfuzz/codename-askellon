import { Trigger, Unit, Group, Rectangle, MapPlayer } from "w3ts";
import { getZFromXY } from "lib/utils";
import { BURST_RIFLE_ITEM_ID, SHOTGUN_ITEM_ID, LASER_ITEM_ID, AT_ITEM_DRAGONFIRE_BLAST, SNIPER_ITEM_ID, ITEM_ID_EMO_INHIB, ITEM_ID_REPAIR, ITEM_ID_NANOMED, ITEM_ID_25_COINS, ITEM_ID_CRYO_GRENADE } from "app/weapons/weapon-constants";
import { ITEM_TRIFEX_ID, ITEM_BARRICADES } from "resources/item-ids";
import { SFX_CATAPULT_MISSILE, SFX_EXPLOSION_GROUND } from "resources/sfx-paths";
import { EVENT_TYPE } from "app/events/event-enum";
import { EventEntity } from "app/events/event-entity";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { Hooks } from "lib/Hooks";
import { UNIT_ID_CRATE, UNIT_ID_MANSION_DOOR, UNIT_ID_STATION_SECURITY_TURRET, UNIT_ID_STATION_SECURITY_CAMERA, UNIT_ID_EXPLOSIVE_BARREL } from "resources/unit-ids";
import { LootTable } from "./loot-table/loot-table";
import { GUN_LOOT_TABLE, MISC_ITEM_TABLE, MEDICAL_LOOT_TABLE } from "./loot-table/loot";
import { Door } from "./door";
import { Entity } from "app/entity-type";
import { MineralCrusherEntity } from "./mineral-crusher";
import { ConveyorEntity } from "app/conveyor/conveyor-entity";
import { TerminalEntity } from "./terminal/terminal-entity";
import { WeaponEntity } from "app/weapons/weapon-entity";
import { DefaultSecurityGun } from "app/weapons/guns/security/default-security-gun";
import { ArmableUnit, ArmableUnitNoCallbacks } from "app/weapons/guns/unit-has-weapon";
import { Log } from "lib/serilog/serilog";
import { EventListener } from "app/events/event-type";
import { TECH_MAJOR_SECURITY, TECH_INCREASE_SECURITY_VISION_HEALTH, TECH_MINERALS_PROGRESS, TECH_CREW_ARMOR_HITPOINTS_INCREASE } from "resources/ability-ids";
import { Players } from "w3ts/globals/index";
import { GENETIC_FACILITY_TOOLTIP, GENETIC_FACILITY_TOOLTIP_DAMAGED } from "resources/strings";
import { ROLE_TYPES } from "resources/crewmember-names";
import { Vector2 } from "app/types/vector2";
import { WorldEntity } from "app/world/world-entity";
import { ShipZone } from "app/world/zone-types/ship-zone";

// const UNIT_ID_STATION_SECURITY_TURRET = FourCC('');
const UNIT_ID_STATION_SECURITY_POWER = FourCC('h004');
export class SecurityEntity extends Entity {
    isDestroyedMap = new Map<number, boolean>();

    private static instance: SecurityEntity;

    public static getInstance() {        
        if (this.instance == null) {
            this.instance = new SecurityEntity();
            Hooks.set(this.name, this.instance);
        }
        return this.instance;
    }

    private doors = new Map<number, Door>();
    private doorsIterator: Door[] = [];

    private stationSecurityDamageTrigger = new Trigger();
    constructor() {
        super();
        
        // Get all security units on the map
        const uGroup = CreateGroup();
        GroupEnumUnitsOfPlayer(uGroup, PlayerStateFactory.StationProperty.handle, Filter(() => {
            this.unitIterateSetup(Unit.fromHandle(GetFilterUnit()));
            return false;
        }));
        GroupClear(uGroup);
        GroupEnumUnitsOfPlayer(uGroup, PlayerStateFactory.StationSecurity.handle, Filter(() => {
            this.unitIterateSetup(Unit.fromHandle(GetFilterUnit()));
            return false;
        }));
        GroupClear(uGroup);
        GroupEnumUnitsOfPlayer(uGroup, PlayerStateFactory.NeutralPassive.handle, Filter(() => {
            this.unitIterateSetup(Unit.fromHandle(GetFilterUnit()));
            return false;
        }));
        GroupClear(uGroup);

        this.stationSecurityDamageTrigger.addAction(() => this.onSecurityDamage(
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

        const barrelDeath = new Trigger();
        barrelDeath.registerAnyUnitEvent(EVENT_PLAYER_UNIT_DEATH);
        barrelDeath.addCondition(Filter(() => GetUnitTypeId(GetDyingUnit()) === UNIT_ID_EXPLOSIVE_BARREL));
        barrelDeath.addAction(() => this.onBarrelDeath(Unit.fromHandle(GetDyingUnit())));


        // Start mineral crusher
        MineralCrusherEntity.getInstance();
        TerminalEntity.getInstance();

        EventEntity.listen(new EventListener(EVENT_TYPE.MAJOR_UPGRADE_RESEARCHED, (self, data) => {
            if (data.data.researched === TECH_MAJOR_SECURITY && data.data.level > 1) {
                Players.forEach(p => {
                    SetPlayerTechResearched(p.handle, TECH_INCREASE_SECURITY_VISION_HEALTH, data.data.level - 1);
                })
            }
            if (data.data.researched === TECH_MINERALS_PROGRESS && data.data.level === 1) {
                BlzSetUnitName(udg_genetic_sequencer_unit, GENETIC_FACILITY_TOOLTIP(undefined, undefined, undefined, undefined));
            }
            if (data.data.researched === TECH_MINERALS_PROGRESS && data.data.level === 2) {
                Players.forEach(p => {
                    const crew = PlayerStateFactory.getCrewmember(p);
                    if (crew && crew.role === ROLE_TYPES.PILOT) {
                        SetPlayerTechResearched(p.handle, TECH_CREW_ARMOR_HITPOINTS_INCREASE, 2);
                    }
                    else {
                        SetPlayerTechResearched(p.handle, TECH_CREW_ARMOR_HITPOINTS_INCREASE, 1);
                    }
                })
            }
        }));
        BlzSetUnitName(udg_genetic_sequencer_unit, GENETIC_FACILITY_TOOLTIP_DAMAGED());
    }

    private unitIterateSetup(u: Unit) {
        const uType = u.typeId;
        
        // if (uType === UNIT_ID_STATION_SECURITY_TURRET) return true;
        if (uType !== UNIT_ID_STATION_SECURITY_POWER &&
            uType !== UNIT_ID_MANSION_DOOR &&
            uType !== UNIT_ID_STATION_SECURITY_TURRET &&
            uType !== UNIT_ID_STATION_SECURITY_CAMERA) return false;

        this.stationSecurityDamageTrigger.registerUnitEvent(u, EVENT_UNIT_DAMAGING);

        if (u.typeId === UNIT_ID_STATION_SECURITY_TURRET) {
            u.color = PLAYER_COLOR_LIGHT_GRAY;
            const point = Vector2.fromWidget(u.handle);
            const zone = WorldEntity.getInstance().getPointZone(point.x, point.y) as ShipZone || undefined;

            if (zone && zone.addTurret) {
                zone.addTurret(u);
            }
        }

        if (u.typeId === UNIT_ID_MANSION_DOOR) {
            if (!this.doors.has(u.id)) {
                const door = new Door(u, false);
                this.doors.set(u.id, door);
                this.doorsIterator.push(door)
            }
        }
        else if (u.typeId === UNIT_ID_STATION_SECURITY_TURRET) {
            // Add a gun to the turret
            WeaponEntity.getInstance().registerWeaponForUnit(new DefaultSecurityGun( new ArmableUnitNoCallbacks(u) ));
        }

        return false;

    }

    public isUnitDestroyed(u: Unit) {
        return this.isDestroyedMap.get(u.id) || false;
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
                this.isDestroyedMap.set(unit.id, true);
                // Pause the unit
                unit.paused = true;

                // If unit type is turret play its burrow animation
                if (unit.typeId === UNIT_ID_STATION_SECURITY_TURRET) {
                    unit.setTimeScale(0.2);
                    unit.setAnimation(3);
                    unit.addAnimationProps('alternate', true);
                }
                else if (unit.typeId === UNIT_ID_STATION_SECURITY_CAMERA) {
                    unit.setTimeScale(0);
                    unit.setVertexColor(120, 120, 120, 255);         
                }
                unit.name = unit.name+" - Destroyed";      

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
            this.isDestroyedMap.set(unit.id, false);
            // Set unit hp to full
            SetUnitLifePercentBJ(u, 100);
            // Pause the unit
            unit.paused = false;

            // If unit type is turret play its burrow animation
            if (unit.typeId === UNIT_ID_STATION_SECURITY_TURRET) {
                unit.setTimeScale(1);
                unit.setAnimation(1);
                unit.addAnimationProps('alternate', false);
            }
            else if (unit.typeId === UNIT_ID_STATION_SECURITY_CAMERA) {
                unit.setTimeScale(1);
                unit.setVertexColor(255, 255, 255, 255);      
            }
            unit.name = unit.name.replace(" - Destroyed", "");

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
            door.search(this._timerDelay);
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

    onBarrelDeath(who: Unit) {
        const uX = who.x;
        const uY = who.y;
        const uZ = getZFromXY(uX, uY);

        const sfx = AddSpecialEffect(SFX_EXPLOSION_GROUND, who.x, who.y);
        BlzSetSpecialEffectZ(sfx, uZ+10);
        DestroyEffect(sfx);
        RemoveUnit(who.handle);

        const killer = Unit.fromHandle(GetKillingUnit());
        killer.damageAt(
            0.35, 
            200, 
            uX, 
            uY, 
            200, 
            false, 
            false,
            ATTACK_TYPE_SIEGE, 
            DAMAGE_TYPE_FIRE, 
            WEAPON_TYPE_WHOKNOWS
        );

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

        ConveyorEntity.getInstance().checkItem(CreateItem(table.getItem(), x, y));
    }


    public findDoor(forUnit: Unit) {
        return this.doors.get(forUnit.id);
    }
}