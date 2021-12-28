import { Region, Trigger, Rectangle } from "w3ts/index";
import { UNIT_IS_FLY } from "resources/ability-ids";
import { Entity } from "app/entity-type";
import { Timers } from "app/timer-type";
import { Hooks } from "lib/Hooks";
import { Log } from "lib/serilog/serilog";
import { Quick } from "lib/Quick";
import { UNIT_ID_DEBRIS_1, UNIT_ID_DEBRIS_2, UNIT_ID_DEBRIS_3 } from "resources/unit-ids";

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
        const validUnits = Filter(() => {
            const u = GetFilterUnit();
            const uType = GetUnitTypeId(u);
            if (uType !== UNIT_ID_DEBRIS_1 && uType !== UNIT_ID_DEBRIS_2 && uType !== UNIT_ID_DEBRIS_3) return true;
            return false;
        });

        try {
            // We need to scan _g to find rects that match us
            const strWest = `gg_rct_cwest`;
            const strEast = `gg_rct_ceast`;
            const strNorth = `gg_rct_cnorth`;
            const strSouth = `gg_rct_csouth`;
            

            let idx = 1;
            let namespaceCheck = `${strWest}${idx++}`;
            while (_G[namespaceCheck]) {
                const r = _G[namespaceCheck] as rect;
                this.conveyorPushWestRegion.addRect(Rectangle.fromHandle(r))
                // Add all starting units to the group
                GroupEnumUnitsInRect(tempGroup, r, validUnits);
                ForGroup(tempGroup, () => this.unitMoveWest.push(GetEnumUnit()));
                namespaceCheck = `${strWest}${idx++}`;
            }

            
            idx = 1;
            namespaceCheck = `${strNorth}${idx++}`;
            while (_G[namespaceCheck]) {
                const r = _G[namespaceCheck] as rect;
                this.conveyorPushNorthRegion.addRect(Rectangle.fromHandle(r));
                // Add all starting units to the group
                GroupEnumUnitsInRect(tempGroup, r, validUnits);
                ForGroup(tempGroup, () => this.unitMoveNorth.push(GetEnumUnit()))
                namespaceCheck = `${strNorth}${idx++}`;
            }

            idx = 1;
            namespaceCheck = `${strSouth}${idx++}`;
            while (_G[namespaceCheck]) {
                const r = _G[namespaceCheck] as rect;
                this.conveyorPushSouthRegion.addRect(Rectangle.fromHandle(r))
                // Add all starting units to the group
                GroupEnumUnitsInRect(tempGroup, r, validUnits);
                ForGroup(tempGroup, () => this.unitMoveSouth.push(GetEnumUnit()))
                namespaceCheck = `${strSouth}${idx++}`;
            }

            idx = 1;
            namespaceCheck = `${strEast}${idx++}`;
            while (_G[namespaceCheck]) {
                const r = _G[namespaceCheck] as rect;
                this.conveyorPushEastRegion.addRect(Rectangle.fromHandle(r))
                // Add all starting units to the group
                GroupEnumUnitsInRect(tempGroup, r, validUnits);
                ForGroup(tempGroup, () => this.unitMoveEast.push(GetEnumUnit()))
                namespaceCheck = `${strEast}${idx++}`;
            }
        }
        catch(e) {
            Log.Error("Conveyor, reading regions fail");
            Log.Error(e);
        }


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
            Timers.addTimedAction(0, () => this.checkItem(item));
        });

        
        this.unitEnterRegion.addAction(() => this.checkUnit(GetTriggerUnit()));
        this.unitLeaveRegion.addAction(() => this.checkUnit(GetTriggerUnit()));
    }

    /**
     * Validates, adds and rmeove item as necessary
     * @param item 
     */
    checkItem(item: item) {        
        try {
            // Is the item currently in a conveyor belt? Remove it if so
            const northIdx = this.itemMoveNorth.indexOf(item);
            const southIdx = this.itemMoveSouth.indexOf(item);
            const eastIdx = this.itemMoveEast.indexOf(item);
            const westIdx = this.itemMoveWest.indexOf(item);
            

            // Now added to groups as necessary
            const x = GetItemX(item);
            const y = GetItemY(item);
            
            if (GetWidgetLife(item) > 0 && IsItemVisible(item) && !IsItemOwned(item)) {
                const isWithinNorth = this.conveyorPushNorthRegion.containsCoords(x, y);
                if (isWithinNorth && northIdx == -1) this.itemMoveNorth.push(item);
                else if (!isWithinNorth && northIdx != -1) Quick.Slice(this.itemMoveNorth, northIdx);

                const isWithinSouth = this.conveyorPushSouthRegion.containsCoords(x, y);
                if (isWithinSouth && southIdx == -1) this.itemMoveSouth.push(item);
                else if (!isWithinSouth && southIdx != -1) Quick.Slice(this.itemMoveSouth, southIdx);

                const isWithinEast = this.conveyorPushEastRegion.containsCoords(x, y);
                if (isWithinEast && eastIdx == -1) this.itemMoveEast.push(item);
                else if (!isWithinEast && eastIdx != -1) Quick.Slice(this.itemMoveEast, eastIdx);

                const isWithinWest = this.conveyorPushWestRegion.containsCoords(x, y);
                if (isWithinWest && westIdx == -1) this.itemMoveWest.push(item);
                else if (!isWithinWest && westIdx != -1) Quick.Slice(this.itemMoveWest, westIdx);

                // Log.Information("Item North "+isWithinNorth);
                // Log.Information("Item South "+isWithinSouth);
                // Log.Information("Item East "+isWithinEast);
                // Log.Information("Item West "+isWithinWest);
            }
            else {
                if (northIdx >= 0) Quick.Slice(this.itemMoveNorth, northIdx);
                if (southIdx >= 0) Quick.Slice(this.itemMoveSouth, southIdx);
                if (eastIdx >= 0) Quick.Slice(this.itemMoveEast, eastIdx);
                if (westIdx >= 0) Quick.Slice(this.itemMoveWest, westIdx);
            }
        }
        catch(e) {
            Log.Error(e);
        }
    }

    checkUnit(unit: unit) {
        const northIdx = this.unitMoveNorth.indexOf(unit);
        const southIdx = this.unitMoveSouth.indexOf(unit);
        const eastIdx = this.unitMoveEast.indexOf(unit);
        const westIdx = this.unitMoveWest.indexOf(unit);

        const x = GetUnitX(unit);
        const y = GetUnitY(unit);

        
        const isWithinNorth = this.conveyorPushNorthRegion.containsCoords(x, y);
        if (isWithinNorth && northIdx == -1) this.unitMoveNorth.push(unit);
        else if (!isWithinNorth && northIdx != -1) Quick.Slice(this.unitMoveNorth, northIdx);

        const isWithinSouth = this.conveyorPushSouthRegion.containsCoords(x, y);
        if (isWithinSouth && southIdx == -1) this.unitMoveSouth.push(unit);
        else if (!isWithinSouth && southIdx != -1) Quick.Slice(this.unitMoveSouth, southIdx);

        const isWithinEast = this.conveyorPushEastRegion.containsCoords(x, y);
        if (isWithinEast && eastIdx == -1) this.unitMoveEast.push(unit);
        else if (!isWithinEast && eastIdx != -1) Quick.Slice(this.unitMoveEast, eastIdx);

        const isWithinWest = this.conveyorPushWestRegion.containsCoords(x, y);
        if (isWithinWest && westIdx == -1) this.unitMoveWest.push(unit);
        else if (!isWithinWest && westIdx != -1) Quick.Slice(this.unitMoveWest, westIdx);
    }

    _timerDelay = 0.02;
    step() {
        const conveyorSpeed = 105 * this._timerDelay;
        try {
            if (this.unitMoveNorth.length > 0)
                this.unitMoveNorth = this.unitMoveNorth.filter(u => {
                    if (!UnitAlive(u)) return false;
                    if (GetUnitAbilityLevel(u, UNIT_IS_FLY) === 0)
                        SetUnitY(u, GetUnitY(u) + conveyorSpeed);            
                    return true;
                });
            if (this.unitMoveSouth.length > 0)
                this.unitMoveSouth = this.unitMoveSouth.filter(u => {
                    if (!UnitAlive(u)) return false;
                    if (GetUnitAbilityLevel(u, UNIT_IS_FLY) === 0)
                        SetUnitY(u, GetUnitY(u) - conveyorSpeed);     
                    return true;
                });
            if (this.unitMoveWest.length > 0)
                this.unitMoveWest = this.unitMoveWest.filter(u => {
                    if (!UnitAlive(u)) return false;
                    if (GetUnitAbilityLevel(u, UNIT_IS_FLY) === 0)
                        SetUnitX(u, GetUnitX(u) - conveyorSpeed);     
                    return true;
                });
            if (this.unitMoveEast.length > 0)
                this.unitMoveEast = this.unitMoveEast.filter(u => {
                    if (!UnitAlive(u)) return false;
                    if (GetUnitAbilityLevel(u, UNIT_IS_FLY) === 0)
                        SetUnitX(u, GetUnitX(u) + conveyorSpeed);     
                    return true;
                });

            // Iterate items
            this.iterateItem(this.itemMoveNorth, conveyorSpeed, true, false, false, false);
            this.iterateItem(this.itemMoveSouth, conveyorSpeed, false, true, false, false);
            this.iterateItem(this.itemMoveEast, conveyorSpeed, false, false, true, false);
            this.iterateItem(this.itemMoveWest, conveyorSpeed, false, false, false, true);
        }
        catch(e) {
            Log.Error(e);
        }
    }

    iterateItem(whichList: item[], speed: number, north: boolean, south: boolean, east: boolean, west: boolean) {
        if (whichList.length === 0) return;

        let items = whichList.slice();

        for (let index = 0; index < items.length; index++) {
            const item = items[index];
            if (IsItemVisible(item) && !IsItemOwned(item)) {
                let x = GetItemX(item);
                let y = GetItemY(item);

                if (north) y += speed;
                if (south) y -= speed;
                if (east) x += speed;
                if (west) x -= speed;
                
                SetItemPosition(item, x, y);
            }
            this.checkItem(item);
        }
    }


    /**
     * STATIC API
     */
    public static check(item: item) {
        this.getInstance().checkItem(item);
    }
}