import { EVENT_TYPE, EventListener } from "app/events/event";

/**
 * Handles and tracks events being passed to and from the game
 */
export class EventModule {
    eventListeners = new Map<EVENT_TYPE, EventListener[]>();

    addListener(type: EVENT_TYPE, listener: EventListener) {
        // Get the list of listeners
        const listeners = this.eventListeners.get(type) || [];
        // Add this listener to it
        listener.eventType = type;
        listeners.push(listener);
        // No apply the change
        this.eventListeners.set(type, listeners);
    }

    onEvent(whichEvent: EVENT_TYPE, data: object) {
        // Get the list of listeners
        const listeners = this.eventListeners.get(whichEvent) || [];
        listeners.forEach(l => l.onEvent(whichEvent, data));
    }

    removeListener(listener: EventListener) {
        // Get the list of listeners
        const listeners = this.eventListeners.get(listener.eventType) || [];
        this.eventListeners.set(listener.eventType, listeners.filter(l => l != listener));
    }
}