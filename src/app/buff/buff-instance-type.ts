import { Unit } from "w3ts/index";

export abstract class BuffInstance {
    public source: Unit;
    
    constructor(source: Unit) {
        this.source = source;
    }

    public abstract isActive(currentTimeStamp: number): boolean; 
}
