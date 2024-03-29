import {UnitGroupAction} from "./UnitGroupAction";
import {UnitGroupQueue} from "../Queues/UnitGroupQueue";
import { Timers } from "app/timer-type";

/**
 * Sets the current action index in queue to another action, also resets all actions.
 * Allows for adding an expression which will evaluate, returning true if it should go to the action or false if not.
 */
export class UnitGroupActionGoToAction implements UnitGroupAction {
    isFinished: boolean = false;
    public readonly expression: (this: void, targets: unit[], timeStep: number, queue: UnitGroupQueue) => boolean;

    constructor(public actionIndex: number, expression?: (targets: unit[], timeStep: number, queue: UnitGroupQueue) => boolean) {
        this.expression = expression || function () {
            return true;
        };
    }

    update(targets: unit[], timeStep: number, queue: UnitGroupQueue): void {
        if (this.expression(targets, timeStep, queue)) {
            queue.resetActions();
            queue.currentActionIndex = this.actionIndex;
            Timers.addTimedAction(0.02, () => {
                queue.allActions[this.actionIndex].init(queue.targets, queue);
            });
        } else {
            this.isFinished = true;
        }
    }

    init(targets: unit[], queue: UnitGroupQueue): void {
    }

}