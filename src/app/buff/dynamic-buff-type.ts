import { Game } from "../game";
import { Unit } from "w3ts/index";
import { BUFF_ID } from "resources/buff-ids";
import { BuffInstance } from "./buff-instance-type";


export abstract class DynamicBuff {
    public id: BUFF_ID;
    public who: Unit;

    protected isActive: boolean = false;

    // These make the buff active
    protected instances: Array<BuffInstance> = [];

    // These prevent the buff from being active
    protected negativeinstances: Array<BuffInstance> = [];
    protected doesStack = true;

    protected onChangeCallbacks: Array<(self: DynamicBuff) => void> = [];

    public addInstance(unit: Unit, instance: BuffInstance, isNegativeInstance?: boolean) {
        const wasActive = this.isActive;
        this.who = unit;

        if (isNegativeInstance) {
            // this.isActive = false;
            this.negativeinstances.push(instance);
        }
        else {
            // this.isActive = true;
            this.instances.push(instance);
        }

        // Assume buff instances are only added if it's active        
        if (wasActive !== this.isActive) {
            this.onChangeCallbacks.forEach(cb => cb(this));
            this.onStatusChange(this.isActive);
        }
    }

    /**
     * Procesess all active instances
     * @param game 
     * @param delta 
     */
    public process(timestamp: number, delta: number): boolean {
        const hadPositive = this.instances.length > 0 && this.who.isAlive();
        const hadNegative = this.negativeinstances.length > 0;

        this.instances = this.instances.filter(i => i.isActive(timestamp));
        this.negativeinstances = this.negativeinstances.filter(i => i.isActive(timestamp));

        const hasPositive = this.instances.length > 0 && this.who.isAlive();
        const hasNegative = this.negativeinstances.length > 0;

        const wasActive = this.isActive;
        const isActive = hasPositive && !hasNegative;

        if (wasActive != isActive) {
            this.isActive = isActive;
            this.onStatusChange(this.isActive);
        }
        // Otherwise we still broadcast changes even when there isn't a status chnage
        // this is to allow infestation of medical research
        else if (hasPositive !== hadPositive || hasNegative !== hadNegative) {
            this.onStatusChange(this.isActive);
        }
        return isActive;
    }

    public onChange(cb: (self: DynamicBuff) => void) {
        this.onChangeCallbacks.push(cb);
    }

    public canStack() { return this.doesStack; }

    protected abstract onStatusChange(newStatus: boolean): void;

    public getIsActive() { return this.isActive; }

    public getInstanceCount() { return this.instances.length; }
    public getNegativeinstanceCount() { return this.negativeinstances.length; }
}