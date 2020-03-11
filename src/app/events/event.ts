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
    // STATION_WARP,
    // STATION_ZONE_POWER_OUT,
}

export interface Event<dataType> {
    data: dataType;
}

export class EventListener {
    eventType: EVENT_TYPE;
    onEvent: (data: object) => void;

    constructor(type: EVENT_TYPE, onEvent: (self: EventListener, data: object) => void) {
        this.eventType = type;
        this.onEvent = (data) => onEvent(this, data);
    }
}