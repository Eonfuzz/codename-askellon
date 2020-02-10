import { ZONE_TYPE } from "./zone-id";
import { Game } from "../game";
import { Zone } from "./zone-type";

/** @noSelfInFile **/


export class TheAskellon {
    
    floors: Map<ZONE_TYPE, Zone> = new Map();

    constructor(game: Game) {
        this.floors.set(ZONE_TYPE.FLOOR_1, new Zone(ZONE_TYPE.FLOOR_1));
        this.floors.set(ZONE_TYPE.FLOOR_2, new Zone(ZONE_TYPE.FLOOR_2));
    }

    findZone(zone: ZONE_TYPE) {
        return this.floors.get(zone);
    }
}