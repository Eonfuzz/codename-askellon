import {UnitAction} from "./UnitAction";
import {WaypointOrders} from "./WaypointOrders";
import {UnitQueue} from "../Queues/UnitQueue";
import { Vector2 } from "app/types/vector2";
import { Log } from "lib/serilog/serilog";
import { SMART_ORDER_ID } from "resources/ability-ids";

/**
 * Basic waypoint action, move, attack move, or smart your way over to a Point.
 */
export class UnitActionInteract implements UnitAction {
    isFinished: boolean = false;
    public readonly targetWidget: widget;
    public readonly toPoint: Vector2;
    public readonly order: number = SMART_ORDER_ID;
    public readonly maxTime: number;
    public readonly checkLocationEvery: number;
    
    public timer: number = 0;
    public updateTimer: number = 0;

    private prevLoc: Vector2;
    private prevLocUpdateCounter = 0;

    constructor(toWidget: widget, maxTime: number = 1200, checkLocationEvery: number = 1) {
        this.maxTime = maxTime;
        this.isFinished = false;
        this.targetWidget = toWidget;
        this.checkLocationEvery = checkLocationEvery;
    }

    update(target: unit, timeStep: number, queue: UnitQueue): void {
        this.timer += timeStep;
        this.updateTimer += timeStep;
        this.prevLocUpdateCounter -= timeStep;
        if (this.prevLocUpdateCounter <= 0) {
            if (this.prevLoc.distanceTo(Vector2.fromWidget(target)) >= 2000 || this.timer > this.maxTime) {
                this.isFinished = true;
            } else if (this.updateTimer >= 10) {
                IssueTargetOrderById(target, SMART_ORDER_ID, this.targetWidget);
                this.updateTimer = 0;
            }
            
            this.prevLoc = Vector2.fromWidget(target);
        }
    }

    init(target: unit, queue: UnitQueue): void {
        // Log.Information("Begin interact AI order");
        IssueTargetOrderById(target, this.order, this.targetWidget);
        this.prevLoc = Vector2.fromWidget(target);
    }


    toString(): string {
        return `InteractWith(${GetUnitName( this.targetWidget as unit )})`;
    }
}