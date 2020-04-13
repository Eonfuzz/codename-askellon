import { Game } from "../game";
import { Crewmember } from "../crewmember/crewmember-type";
import { Log } from "lib/serilog/serilog";
import { Unit } from "w3ts/index";
import { BUFF_ID } from "resources/buff-ids";

/** @noSelfInFile **/

export abstract class BuffInstance {
    public source: Unit;
    
    constructor(source: Unit) {
        this.source = source;
    }

    public abstract isActive(currentTimeStamp: number): boolean; 
}

export class BuffInstanceDuration extends BuffInstance {
    endTimestamp: number;
    
    constructor(source: Unit, when: number, dur: number) {
        super(source);

        this.endTimestamp = when + dur;
    }

    public isActive(currentTimeStamp: number) {
        return this.endTimestamp > currentTimeStamp;
    }
}

export class BuffInstanceCallback extends BuffInstance {
    cb: () => boolean;
    
    constructor(source: Unit, cb: () => boolean) {
        super(source);
        this.cb = () => cb();
    }

    public isActive(currentTimeStamp: number) {
        return this.cb();
    }
}

export abstract class DynamicBuff {
    public id: BUFF_ID;
    public who: Unit;

    protected isActive: boolean = false;
    protected instances: Array<BuffInstance> = [];
    protected doesStack = true;

    protected onChangeCallbacks: Array<(self: DynamicBuff) => void> = [];

    public addInstance(game: Game, unit: Unit, instance: BuffInstance) {
        const wasActive = this.isActive;
        this.who = unit;

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
        const isActive = this.instances.length > 0 && this.who.isAlive();
        
        if (wasActive != isActive) {
            this.isActive = false;
            this.onStatusChange(game, false);
        }
        return isActive;
    }

    public onChange(cb: (self: DynamicBuff) => void) {
        this.onChangeCallbacks.push(cb);
    }

    public canStack() { return this.doesStack; }

    protected abstract onStatusChange(game: Game, newStatus: boolean): void;

    public getIsActive() { return this.isActive; }
}