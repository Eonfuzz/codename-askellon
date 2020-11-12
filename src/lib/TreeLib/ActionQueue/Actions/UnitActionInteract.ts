import {UnitAction} from "./UnitAction";
import {WaypointOrders} from "./WaypointOrders";
import {UnitQueue} from "../Queues/UnitQueue";
import { Vector2 } from "app/types/vector2";
import { Log } from "lib/serilog/serilog";
import { MOVE_ORDER_ID } from "resources/ability-ids";
import { Timers } from "app/timer-type";

/**
 * Basic waypoint action, move, attack move, or smart your way over to a Point.
 */
export class UnitActionInteract implements UnitAction {
    isFinished: boolean = false;
    public readonly targetWidget: widget;
    public readonly order: number = MOVE_ORDER_ID;
    public readonly maxTime: number;
    
    public timer: number = 0;

    private prevLoc: Vector2;
    public idleFor: number = 0;

    constructor(toWidget: widget, maxTime: number = 1200) {
        this.maxTime = maxTime;
        this.isFinished = false;
        this.targetWidget = toWidget;
    }

    update(target: unit, timeStep: number, queue: UnitQueue): void {
        this.timer += timeStep;

        if (GetUnitCurrentOrder(target) == 0) this.idleFor += timeStep;


        let thisLoc = Vector2.fromWidget(target);
        if (this.prevLoc.distanceTo(thisLoc) >= 2000 || this.timer > this.maxTime) {
            this.isFinished = true;
        } else if (this.idleFor >= 6) {
            this.idleFor = 0;
            
            // Log.Information("reissue for "+GetUnitName(target));
            // SetCameraPosition(GetUnitX(target), GetUnitY(target));

            // IssueTargetOrder
            IssuePointOrder(target, WaypointOrders.attack, GetWidgetX(this.targetWidget), GetWidgetY(this.targetWidget)); //Update order
            RemoveGuardPosition(target);

            Timers.addTimedAction(0.5, () => {
                IssueTargetOrderById(target, this.order, this.targetWidget);
            });
        }
        
        this.prevLoc = thisLoc;
    }

    init(target: unit, queue: UnitQueue): void {
        // Log.Information("Begin interact AI order");
        IssueTargetOrderById(target, this.order, this.targetWidget);
        this.prevLoc = Vector2.fromWidget(target);
    }


    toString(): string {
        return `InteractWith [${GetUnitName( this.targetWidget as unit )}]`;
    }
}