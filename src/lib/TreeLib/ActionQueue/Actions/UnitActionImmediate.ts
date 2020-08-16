import {UnitAction} from "./UnitAction";
import {UnitQueue} from "../Queues/UnitQueue";
import {ImmediateOrders} from "./ImmediateOrders";
import { Vector2 } from "app/types/vector2";

/**
 * Basic immediate action, stop, hold position.
 */
export class UnitActionImmediate implements UnitAction {
    isFinished: boolean = false;
    private readonly toPoint: Vector2;
    private readonly order: ImmediateOrders;

    constructor(toPoint: Vector2, order: ImmediateOrders = ImmediateOrders.holdPosition) {
        this.toPoint = toPoint;
        this.order = order;
        this.isFinished = false;
    }

    update(target: unit, timeStep: number, queue: UnitQueue): void {
        this.isFinished = true;
        IssueImmediateOrder(target, this.order); //Update order
    }

    init(target: unit, queue: UnitQueue): void {
        IssueImmediateOrder(target, this.order); //Update order
    }

}