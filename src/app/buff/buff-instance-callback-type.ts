import { Unit } from "w3ts/index";
import { BuffInstance } from "./buff-instance-type";

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