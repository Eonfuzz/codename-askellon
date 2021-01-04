import { Trigger } from "w3ts/index";

/**
 * Extention of TriggerHappy's Trigger class
 * automatically deletes conditions and actions on destroy
 */
export class SmartTrigger extends Trigger {
    private conditions: triggercondition[] = [];
    private actions: triggeraction[] = [];

    public addCondition(condition: boolexpr | (() => boolean)): triggercondition {
        const cnd = super.addCondition(condition);
        this.conditions.push(cnd);
        return cnd;
    }

    public addAction(actionFunc: () => void): triggeraction {
        const act = super.addAction(actionFunc);
        this.actions.push(act);
        return act;
    }

    public destroy() {
        // Destroy our conditions
        for (let index = 0; index < this.conditions.length; index++) {
            const cnd = this.conditions[index];
            TriggerRemoveCondition(this.handle, cnd);
        }
        for (let index = 0; index < this.actions.length; index++) {
            const action = this.actions[index];
            TriggerRemoveAction(this.handle, action);
        }
        super.destroy();
    }
}