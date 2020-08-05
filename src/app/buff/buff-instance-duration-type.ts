import { Unit } from "w3ts/index";
import { BuffInstance } from "./buff-instance-type";
import { Game } from "app/game";
import { GameTimeElapsed } from "app/types/game-time-elapsed";

export class BuffInstanceDuration extends BuffInstance {
    endTimestamp: number;
    
    constructor(source: Unit, dur: number) {
        super(source);

        this.endTimestamp = GameTimeElapsed.getTime() + dur;
    }

    public isActive(currentTimeStamp: number) {
        return this.endTimestamp > currentTimeStamp;
    }
}