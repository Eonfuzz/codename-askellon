import {UnitAction} from "./UnitAction";
import {WaypointOrders} from "./WaypointOrders";
import {UnitQueue} from "../Queues/UnitQueue";
import { Vector2 } from "app/types/vector2";

/**
 * Basic waypoint action, move, attack move, or smart your way over to a Point.
 */
export class UnitActionWaypoint implements UnitAction {
    isFinished: boolean = false;
    public readonly toPoint: Vector2;
    public readonly acceptableDistance: number;
    public readonly order: WaypointOrders;
    public readonly maxTime: number;
    public timer: number = 0;
    public updateTimer: number = 0;
    public idleFor: number = 0;

    constructor(toPoint: Vector2, order: WaypointOrders = WaypointOrders.smart, acceptableDistance: number = 64, maxTime: number = 1200) {
        this.toPoint = toPoint;
        this.order = order;
        this.acceptableDistance = acceptableDistance;
        this.maxTime = maxTime;
        this.isFinished = false;
    }

    update(target: unit, timeStep: number, queue: UnitQueue): void {
        this.timer += timeStep;
        this.updateTimer += timeStep;
        if (GetUnitCurrentOrder(target) == 0) this.idleFor += timeStep;


        if (this.inObjectiveRange(target) || this.timer > this.maxTime) {
            this.isFinished = true;
        } else if (this.updateTimer >= 7 || this.idleFor >= 1) {
            IssuePointOrder(target, this.order, this.toPoint.x, this.toPoint.y); //Update order
            this.updateTimer = 0;
            this.idleFor = 0;
        }
    }

    init(target: unit, queue: UnitQueue): void {
        IssuePointOrder(target, this.order, this.toPoint.x, this.toPoint.y); //Update order
    }

    toString(): string {
        return `Waypoint(x:${this.toPoint.x},y:${this.toPoint.y})`;
    }

    inObjectiveRange(target: unit) {
        let targetPoint = Vector2.fromWidget(target);
        let offset = targetPoint.subtract(this.toPoint);

        if (offset.x > this.acceptableDistance
            || offset.x < -this.acceptableDistance
            || offset.y > this.acceptableDistance
            || offset.y < -this.acceptableDistance) {
            return false;
        }

        let acceptSquare = this.acceptableDistance * this.acceptableDistance;
        return targetPoint.distanceTo(this.toPoint) <= acceptSquare;
    }
}