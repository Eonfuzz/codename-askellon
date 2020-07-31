import { EVENT_TYPE } from "./event-enum";
import { EventData } from "./event-data";

export class EventListener {
    eventType: EVENT_TYPE;
    onEvent: (data: EventData) => void;

    constructor(type: EVENT_TYPE, onEvent: (self: EventListener, data: EventData) => void) {
        this.eventType = type;
        this.onEvent = (data) => onEvent(this, data);
    }
}