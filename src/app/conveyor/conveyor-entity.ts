import { Region, Trigger, Rectangle } from "w3ts/index";
import { UNIT_IS_FLY } from "resources/ability-ids";
import { Entity } from "app/entity-type";
import { Timers } from "app/timer-type";
import { Hooks } from "lib/Hooks";

declare const udg_Conveyors_West: rect[];
declare const udg_Conveyors_North: rect[];
declare const udg_Conveyors_South: rect[];
declare const udg_Conveyors_East: rect[];

export class ConveyorEntity extends Entity {    
    private static instance: ConveyorEntity;

    public static getInstance() {        
        if (this.instance == null) {
            this.instance = new ConveyorEntity();
            Hooks.set(this.name, this.instance);
        }
        return this.instance;
    }

    unitMoveNorth:   unit[] = [];
    unitMoveEast:    unit[] = [];
    unitMoveWest:    unit[] = [];
    unitMoveSouth:   unit[] = [];
    itemMoveNorth:   item[] = [];
    itemMoveEast:    item[] = [];
    itemMoveWest:    item[] = [];
    itemMoveSouth:   item[] = [];


    unitEntersRegionNorth = new Trigger();
    unitEntersRegionEast = new Trigger();
    unitEntersRegionWest = new Trigger();
    unitEntersRegionSouth = new Trigger();

    unitEnterRegion = new Trigger();
    unitLeaveRegion = new Trigger();

    itemPickup = new Trigger();
    itemDrop = new Trigger();

    conveyorPushNorthRegion = new Region();
    conveyorPushEastRegion = new Region();
    conveyorPushWestRegion = new Region();
    conveyorPushSouthRegion = new Region();

    constructor() {
        super();

        const tempGroup = CreateGroup();
        const validUnits = Filter(() => true);

        udg_Conveyors_North.forEach(r => {
            this.conveyorPushNorthRegion.addRect(Rectangle.fromHandle(r));
            // Add all starting units to the group
            GroupEnumUnitsInRect(tempGroup, r, validUnits);
            ForGroup(tempGroup, () => this.unitMoveNorth.push(GetEnumUnit()))
        });
        udg_Conveyors_East.forEach(r => {
            this.conveyorPushEastRegion.addRect(Rectangle.fromHandle(r))
            // Add all starting units to the group
            GroupEnumUnitsInRect(tempGroup, r, validUnits);
            ForGroup(tempGroup, () => this.unitMoveEast.push(GetEnumUnit()))
        });
        udg_Conveyors_West.forEach(r => {this.conveyorPushWestRegion.addRect(Rectangle.fromHandle(r))
            // Add all starting units to the group
            GroupEnumUnitsInRect(tempGroup, r, validUnits);
            ForGroup(tempGroup, () => this.unitMoveWest.push(GetEnumUnit()))
        });
        udg_Conveyors_South.forEach(r => {this.conveyorPushSouthRegion.addRect(Rectangle.fromHandle(r))
            // Add all starting units to the group
            GroupEnumUnitsInRect(tempGroup, r, validUnits);
            ForGroup(tempGroup, () => this.unitMoveSouth.push(GetEnumUnit()))
        });

        this.unitEnterRegion.registerEnterRegion(this.conveyorPushNorthRegion.handle, validUnits);
        this.unitEnterRegion.registerEnterRegion(this.conveyorPushEastRegion.handle, validUnits);
        this.unitEnterRegion.registerEnterRegion(this.conveyorPushSouthRegion.handle, validUnits);
        this.unitEnterRegion.registerEnterRegion(this.conveyorPushWestRegion.handle, validUnits);



        this.unitLeaveRegion.registerLeaveRegion(this.conveyorPushNorthRegion.handle, validUnits);
        this.unitLeaveRegion.registerLeaveRegion(this.conveyorPushEastRegion.handle, validUnits);
        this.unitLeaveRegion.registerLeaveRegion(this.conveyorPushSouthRegion.handle, validUnits);
        this.unitLeaveRegion.registerLeaveRegion(this.conveyorPushWestRegion.handle, validUnits);

        this.itemDrop.registerAnyUnitEvent(EVENT_PLAYER_UNIT_DROP_ITEM);
        this.itemDrop.addAction(() => {
            const item = GetManipulatedItem();
            
            Timers.addTimedAction(0.05, () => {
                const iX = GetItemX(item);
                const iY = GetItemY(item);

                if (this.conveyorPushNorthRegion.containsCoords(iX, iY)) {
                    this.itemMoveNorth.push(item);
                }
                else if (this.conveyorPushEastRegion.containsCoords(iX, iY)) {
                    this.itemMoveEast.push(item);
                }
                else if (this.conveyorPushSouthRegion.containsCoords(iX, iY)) {
                    this.itemMoveSouth.push(item);
                }
                else if (this.conveyorPushWestRegion.containsCoords(iX, iY)) {
                    this.itemMoveWest.push(item);
                }
            });
        })

        
        this.unitEnterRegion.addAction(() => {
            const tRegion = GetTriggeringRegion();
            if (IsUnitType(GetTriggerUnit(), UNIT_TYPE_MECHANICAL)) return false;

            if (tRegion === this.conveyorPushNorthRegion.handle) {
                this.unitMoveNorth.push(GetTriggerUnit());
            }
            else if (tRegion === this.conveyorPushEastRegion.handle) {
                this.unitMoveEast.push(GetTriggerUnit());
            }
            else if (tRegion === this.conveyorPushSouthRegion.handle) {
                this.unitMoveSouth.push(GetTriggerUnit());
            }
            else if (tRegion === this.conveyorPushWestRegion.handle) {
                this.unitMoveWest.push(GetTriggerUnit());
            }
        });
        this.unitLeaveRegion.addAction(() => {
            const tRegion = GetTriggeringRegion();
            if (IsUnitType(GetTriggerUnit(), UNIT_TYPE_MECHANICAL)) return false;

            if (tRegion === this.conveyorPushNorthRegion.handle) {
                this.unitMoveNorth.splice(this.unitMoveNorth.indexOf(GetTriggerUnit()), 1);
            } else if (tRegion === this.conveyorPushEastRegion.handle) {
                this.unitMoveEast.splice(this.unitMoveEast.indexOf(GetTriggerUnit()), 1);
            } else if (tRegion === this.conveyorPushSouthRegion.handle) {
                this.unitMoveSouth.splice(this.unitMoveSouth.indexOf(GetTriggerUnit()), 1);
            } else if (tRegion === this.conveyorPushWestRegion.handle) {
                this.unitMoveWest.splice(this.unitMoveWest.indexOf(GetTriggerUnit()), 1);
            }
        });
    }



    step() {
        const conveyorSpeed = 105 * this._timerDelay;
        
        if (this.unitMoveNorth.length > 0)
            this.unitMoveNorth = this.unitMoveNorth.filter(u => {
                if (!UnitAlive(u)) return false;
                if (GetUnitAbilityLevel(u, UNIT_IS_FLY) === 0)
                    SetUnitY(u, GetUnitY(u) + conveyorSpeed);            
                return true;
            });
        if (this.itemMoveNorth.length > 0)
            this.itemMoveNorth = this.itemMoveNorth.filter(i => {
                if (!IsItemVisible(i)) return false;
                if (IsItemOwned(i)) return false;
                SetItemPosition(i, GetItemX(i), GetItemY(i) + conveyorSpeed);   
                return this.conveyorPushNorthRegion.containsCoords(GetItemX(i), GetItemY(i));
            });
        if (this.unitMoveSouth.length > 0)
            this.unitMoveSouth = this.unitMoveSouth.filter(u => {
                if (!UnitAlive(u)) return false;
                if (GetUnitAbilityLevel(u, UNIT_IS_FLY) === 0)
                    SetUnitY(u, GetUnitY(u) - conveyorSpeed);     
                return true;
            });
        if (this.itemMoveSouth.length > 0)
            this.itemMoveSouth = this.itemMoveSouth.filter(i => {
                if (!IsItemVisible(i)) return false;
                if (IsItemOwned(i)) return false;
                SetItemPosition(i, GetItemX(i), GetItemY(i) - conveyorSpeed); 
                return this.conveyorPushSouthRegion.containsCoords(GetItemX(i), GetItemY(i));
            });
        if (this.unitMoveWest.length > 0)
            this.unitMoveWest = this.unitMoveWest.filter(u => {
                if (!UnitAlive(u)) return false;
                if (GetUnitAbilityLevel(u, UNIT_IS_FLY) === 0)
                    SetUnitX(u, GetUnitX(u) - conveyorSpeed);     
                return true;
            });
        if (this.itemMoveWest.length > 0)
            this.itemMoveWest = this.itemMoveWest.filter(i => {
                if (!IsItemVisible(i)) return false;
                if (IsItemOwned(i)) return false;
                SetItemPosition(i, GetItemX(i)  - conveyorSpeed, GetItemY(i));      
                return this.conveyorPushWestRegion.containsCoords(GetItemX(i), GetItemY(i));
            });
        if (this.unitMoveEast.length > 0)
            this.unitMoveEast = this.unitMoveEast.filter(u => {
                if (!UnitAlive(u)) return false;
                if (GetUnitAbilityLevel(u, UNIT_IS_FLY) === 0)
                    SetUnitX(u, GetUnitX(u) + conveyorSpeed);     
                return true;
            });
        if (this.itemMoveEast.length > 0)
            this.itemMoveEast = this.itemMoveEast.filter(i => {
                if (!IsItemVisible(i)) return false;
                if (IsItemOwned(i)) return false;
                SetItemPosition(i, GetItemX(i) + conveyorSpeed, GetItemY(i));  
                return this.conveyorPushEastRegion.containsCoords(GetItemX(i), GetItemY(i));
            });
    }
}