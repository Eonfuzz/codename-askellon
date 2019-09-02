/** @NoSelfInFile **/

import * as GALAXY_MODULE from "./galaxy/galaxy-module";
import * as CREW_MODULE from "./crewmember/crewmember-module";
import * as WEAPON_MODULE from "./weapons/weapon-module";
import { TimedEventQueue } from "./types/timed-event-queue";

export class Game{
    public timedEventQueue: TimedEventQueue;
    
    public weaponModule: WEAPON_MODULE.WeaponModule;

    public humanPlayers: Array<player>;

    constructor() {
        this.timedEventQueue = new TimedEventQueue(this);

        this.humanPlayers = [];

        for (let i = 0; i < GetBJMaxPlayerSlots(); i ++) {
            const currentPlayer = Player(i);
            const isPlaying = GetPlayerSlotState(currentPlayer) == PLAYER_SLOT_STATE_PLAYING;
            const isUser = GetPlayerController(currentPlayer) == MAP_CONTROL_USER;
            if (isPlaying && isUser) {
                this.humanPlayers.push(Player(i));
            }
        }
        
        GALAXY_MODULE.initSectors();
        CREW_MODULE.initCrew(this);

        this.weaponModule = new WEAPON_MODULE.WeaponModule(this);
    }
}