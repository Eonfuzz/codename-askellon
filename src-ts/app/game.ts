/** @NoSelfInFile **/

import * as GALAXY_MODULE from "./galaxy/galaxy-module";
import * as CREW_MODULE from "./crewmember/crewmember-module";
import { WeaponModule } from "./weapons/weapon-module";
import { TimedEventQueue } from "./types/timed-event-queue";
import { ForceModule } from "./force/force-module";
import { SpaceModule } from "./space/space-module";

export class Game{
    public timedEventQueue: TimedEventQueue;
    public weaponModule: WeaponModule;
    public forceModule: ForceModule;
    public spaceModule: SpaceModule;

    /**
     * Should always be defined,
     * Used for measuring Z heights
     */
    public TEMP_LOCATION = Location(0, 0);

    private globalTimer: timer;


    constructor() {
        // Set global timer
        this.globalTimer = CreateTimer();

        // Load order is important
        this.timedEventQueue    = new TimedEventQueue(this);
        // Load modules after all helper objects
        this.forceModule        = new ForceModule(this);
        this.weaponModule       = new WeaponModule(this);
        this.spaceModule        = new SpaceModule(this);

        // Here be dragons, old code is below and needs update
        GALAXY_MODULE.initSectors();
        CREW_MODULE.initCrew(this);
    }

    /**
     * Returns the current timestamp
     */
    public getTimeStamp(): number {
        return TimerGetElapsed(this.globalTimer);
    }
}