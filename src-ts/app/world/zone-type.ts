import { ZONE_TYPE } from "./zone-id";

/** @noSelfInFile **/


export class Zone {
    public id: ZONE_TYPE;

    // Adjacent zones UNUSED
    private adjacent: Array<Zone> = [];

    constructor(id: ZONE_TYPE) {
        this.id = id;
    }

    /**
     * Unit enters the zone
     * @param unit 
     */
    public onLeave(unit: unit) {}

    /**
     * Unit leaves the zone
     * @param unit 
     */
    public onEnter(unit: unit) {}
}