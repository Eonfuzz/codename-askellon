import { Unit } from "w3ts/index";
import { Crewmember } from "app/crewmember/crewmember-type";

/**
 * List of all the possible event types
 */
export enum EVENT_TYPE {
    // ALIEN EVENTS
    ALIEN_TRANSFORM_CREW,
    CREW_TRANSFORM_ALIEN,
    // ALIEN_ENTER_FLOOR,

    // CREW EVENTS
    CREW_BECOMES_ALIEN,
    CREW_GAIN_RESOLVE,
    CREW_GAIN_DESPAIR,
    CREW_LOSE_RESOLVE,
    CREW_LOSE_DESPAIR,
    CREW_CHANGES_FLOOR,
    // CREW_LEVEL_UP,

    // // STATION EVENTS
    // STATION_DAMAGE,
    STATION_SECURITY_DISABLED,
    STATION_SECURITY_ENABLED,
    // STATION_WARP,
    // STATION_ZONE_POWER_OUT,

    MAJOR_UPGRADE_RESEARCHED,
    MINOR_UPGRADE_RESEARCHED,
    GENE_UPGRADE_INSTALLED,

    HERO_LEVEL_UP,
    WEAPON_EQUIP,
    WEAPON_UNEQUIP,

    // Special event just to check for victory conds
    CHECK_VICTORY_CONDS,
}

export interface Event<dataType> {
    data: dataType;
}

export interface EventData {
    source: Unit,
    crewmember?: Crewmember,
    data?: any
}

export class EventListener {
    eventType: EVENT_TYPE;
    onEvent: (data: EventData) => void;

    constructor(type: EVENT_TYPE, onEvent: (self: EventListener, data: EventData) => void) {
        this.eventType = type;
        this.onEvent = (data) => onEvent(this, data);
    }
}