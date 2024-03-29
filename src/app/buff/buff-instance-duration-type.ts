import { getElapsedTime, Unit } from "w3ts/index";
import { BuffInstance } from "./buff-instance-type";
import { Game } from "app/game";

export class BuffInstanceDuration extends BuffInstance {
    endTimestamp: number;
    
    constructor(source: Unit, dur: number) {
        super(source);

        this.endTimestamp = getElapsedTime() + dur;
    }

    public isActive(currentTimeStamp: number) {
        return this.endTimestamp > currentTimeStamp;
    }
}