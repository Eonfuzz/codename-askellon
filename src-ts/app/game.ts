/** @NoSelfInFile **/

import * as GALAXY_MODULE from "./galaxy/galaxy-module";
import * as CREW_MODULE from "./crewmember/crewmember-module";
import { WeaponModule } from "./weapons/weapon-module";
import { TimedEventQueue } from "./types/timed-event-queue";
import { ForceModule } from "./force/force-module";

export class Game{
    public timedEventQueue: TimedEventQueue;
    public weaponModule: WeaponModule;
    public forceModule: ForceModule;

    /**
     * Should always be defined,
     * Used for measuring Z heights
     */
    public TEMP_LOCATION = Location(0, 0);


    constructor() {
        // Load order is important
        this.timedEventQueue    = new TimedEventQueue(this);
        // Load modules after all helper objects
        this.forceModule        = new ForceModule(this);
        this.weaponModule       = new WeaponModule(this);

        // Here be dragons, old code is below and needs update
        GALAXY_MODULE.initSectors();
        CREW_MODULE.initCrew(this);
    }
}