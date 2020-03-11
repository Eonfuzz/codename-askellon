/**
 * List of all the possible event types
 */
export enum EVENT_TYPE {
    // ALIEN EVENTS
    ALIEN_TRANSFORM,

    // CREW EVENTS
    CREW_GAIN_RESOLVE,
    CREW_GAIN_DESPAIR,
    CREW_ENTER_FLOOR,

    // STATION EVENTS
    STATION_DAMAGE,
    STATION_WARP
}

export interface Event<dataType> {
    data: dataType;
}

export interface EventListener {
    eventType: EVENT_TYPE;
    onEvent(whichEvent: EVENT_TYPE, data: object): void;
}