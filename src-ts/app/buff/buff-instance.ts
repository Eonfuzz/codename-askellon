import { Game } from "../game";
import { Crewmember } from "../crewmember/crewmember-type";

/** @noSelfInFile **/

export abstract class BuffInstance {
    public abstract isActive(currentTimeStamp: number): boolean; 
}

export class BuffInstanceDuration extends BuffInstance {
    endTimestamp: number;
    
    constructor(when: number, dur: number) {
        super();

        this.endTimestamp = when + dur;
    }

    public isActive(currentTimeStamp: number) {
        return this.endTimestamp < currentTimeStamp;
    }
}

export class BuffInstanceCallback extends BuffInstance {
    cb: () => boolean;

    constructor(cb: () => boolean) {
        super();
        this.cb = cb;
    }

    public isActive(currentTimeStamp: number) {
        return this.cb();
    }
}

export abstract class DynamicBuff {
    protected isActive: boolean = false;
    private instances: Array<BuffInstance> = [];

    protected onChangeCallbacks: Array<(self: DynamicBuff) => void> = [];

    public addInstance(game: Game, crewmember: Crewmember, instance: BuffInstance) {
        const wasActive = this.isActive;
        this.isActive = true;
        this.instances.push(instance);

        // Assume buff instances are only added if it's active        
        if (wasActive !== this.isActive) {
            this.onChangeCallbacks.forEach(cb => cb(this));
            this.onStatusChange(game, true);
        }
    }

    /**
     * Procesess all active instances
     * @param game 
     * @param delta 
     */
    public process(game: Game, delta: number): boolean {
        const timestamp = game.getTimeStamp();
        const wasActive = this.instances.length > 0;
        this.instances = this.instances.filter(i => i.isActive(timestamp));
        const isActive = this.instances.length > 0;
        
        if (wasActive != isActive) {
            this.onStatusChange(game, false)
        }
        return isActive;
    }

    public onChange(cb: (self: DynamicBuff) => void) {
        this.onChangeCallbacks.push(cb);
    }

    protected abstract onStatusChange(game: Game, newStatus: boolean): void;

    public getIsActive() { return this.isActive; }
}