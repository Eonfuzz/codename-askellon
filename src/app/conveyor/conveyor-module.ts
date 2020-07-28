import { Game } from "app/game";
import { Widget, Region, Trigger, Rectangle, Timer } from "w3ts/index";
import { Log } from "lib/serilog/serilog";

declare const udg_Conveyors_West: rect[];
declare const udg_Conveyors_North: rect[];
declare const udg_Conveyors_South: rect[];
declare const udg_Conveyors_East: rect[];

export class ConveyorModule {
    game: Game;

    unitMoveNorth:   unit[] = [];
    unitMoveEast:    unit[] = [];
    unitMoveWest:    unit[] = [];
    unitMoveSouth:   unit[] = [];

    unitEntersRegionNorth = new Trigger();
    unitEntersRegionEast = new Trigger();
    unitEntersRegionWest = new Trigger();
    unitEntersRegionSouth = new Trigger();

    unitEnterRegion = new Trigger();
    unitLeaveRegion = new Trigger();

    conveyorPushNorthRegion = new Region();
    conveyorPushEastRegion = new Region();
    conveyorPushWestRegion = new Region();
    conveyorPushSouthRegion = new Region();

    constructor(game: Game) {
        try {
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


            
            this.unitEnterRegion.addAction(() => {
                const tRegion = GetTriggeringRegion();

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
        catch(e) {
            Log.Error("Failed to create Conveyor");
            Log.Error(e);
        }
    }


    initialise() {
        const t = new Timer();
        t.start(0.02, true, () => this.updateConveyors(0.02));
    }

    updateConveyors(delta) {
        const conveyorSpeed = 105 * delta;
        
        if (this.unitMoveNorth.length > 0)
            this.unitMoveNorth = this.unitMoveNorth.filter(u => {
                if (!UnitAlive(u)) return false;
                SetUnitY(u, GetUnitY(u) + conveyorSpeed);            
                return true;
            });
        if (this.unitMoveSouth.length > 0)
            this.unitMoveSouth = this.unitMoveSouth.filter(u => {
                if (!UnitAlive(u)) return false;
                SetUnitY(u, GetUnitY(u) - conveyorSpeed);     
                return true;
            });
        if (this.unitMoveWest.length > 0)
            this.unitMoveWest = this.unitMoveWest.filter(u => {
                if (!UnitAlive(u)) return false;
                SetUnitX(u, GetUnitX(u) - conveyorSpeed);     
                return true;
            });
        if (this.unitMoveEast.length > 0)
            this.unitMoveEast = this.unitMoveEast.filter(u => {
                if (!UnitAlive(u)) return false;
                SetUnitX(u, GetUnitX(u) + conveyorSpeed);     
                return true;
            });
    }
}