/** @NoSelfInFile **/

import * as GALAXY_MODULE from "./galaxy/galaxy-module";
import { CrewModule } from "./crewmember/crewmember-module";
import { WeaponModule } from "./weapons/weapon-module";
import { TimedEventQueue } from "./types/timed-event-queue";
import { ForceModule } from "./force/force-module";
import { SpaceModule } from "./space/space-module";
import { Trigger } from "./types/jass-overrides/trigger";
import { GameTimeElapsed } from "./types/game-time-elapsed";
import { GeneModule } from "./shops/gene-modules";
import { AbilityModule } from "./abilities/ability-module";

export class Game {
    // Helper objects
    public timedEventQueue: TimedEventQueue;
    private gameTimeElapsed: GameTimeElapsed;

    public weaponModule: WeaponModule;
    public forceModule: ForceModule;
    public spaceModule: SpaceModule;
    public crewModule: CrewModule;
    public abilityModule: AbilityModule;
    public geneModule: GeneModule;

    /**
     * Should always be defined,
     * Used for measuring Z heights
     */
    public TEMP_LOCATION = Location(0, 0);


    constructor() {

        // ResumeTimer(this.globalTimer);

        // Load order is important
        this.timedEventQueue    = new TimedEventQueue(this);
        this.gameTimeElapsed    = new GameTimeElapsed();

        // Load modules after all helper objects
        this.forceModule        = new ForceModule(this);
        this.weaponModule       = new WeaponModule(this);
        this.spaceModule        = new SpaceModule(this);
        this.crewModule         = new CrewModule(this);

        this.abilityModule      = new AbilityModule(this);
        this.geneModule         = new GeneModule(this);

        // Here be dragons, old code is below and needs update
        GALAXY_MODULE.initSectors();

        // Initialise commands
        this.initCommands();
    }

    /**
     * Returns the current timestamp
     */
    public getTimeStamp(): number {
        return this.gameTimeElapsed.getTimeElapsed();
    }

    private initCommands() {
        const commandTrigger = new Trigger();

        this.forceModule.activePlayers.forEach(player => {
            commandTrigger.RegisterPlayerChatEvent(player, "-", false);
        })

        commandTrigger.AddAction(() => {
            const triggerPlayer = GetTriggerPlayer();
            const crew = this.crewModule.getCrewmemberForPlayer(triggerPlayer);
            const message = GetEventPlayerChatString();

            if (message === "-resolve" && crew) {
                crew.resolve.createResolve(this, crew, {
                    startTimeStamp: this.getTimeStamp(), 
                    duration: 5
                });
                SetUnitLifePercentBJ(crew.unit, 20);
            }
        });
    }


}