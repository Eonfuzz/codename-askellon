/** @noSelfInFile **/
import { Game } from "../game";
import { BuffInstance } from "./buff-instance";
import { Crewmember } from "../crewmember/crewmember-type";
import { TimedEvent } from "../types/timed-event";

const RESOLVE_ABILITY_ID = FourCC('A008');

/**
 * Resolve is a buff applied to a unit
 * Can be applied multiple times and from multiple sources
 */
export class Resolve {
    
    private instances: Array<BuffInstance>;
    private callbacks: Array<Function>;
    private buttonHighlight: commandcardbuttoneffect | undefined;

    private currentTicker: string | undefined;

    constructor() {
        this.instances = [];
        this.callbacks = [];
    }


    public createResolve(game: Game, crewmember: Crewmember, instance: BuffInstance) {
        const alreadyActive = this.isActive(game);

        if (!instance.startTimeStamp) {
            instance.startTimeStamp = game.getTimeStamp();
        }

        this.instances.push(instance);

        if (!alreadyActive) {
            this.doCallbacks();
        }

        // Now add
        let hasLongerTicker = false;
        if (this.currentTicker) {
            const ticker = game.timedEventQueue.GetEvent(this.currentTicker);
            if (ticker) {
                const newEndTime = (instance.startTimeStamp + instance.duration);
                const oldEndTime = (game.timedEventQueue.GetEventExpireTime(ticker));
                hasLongerTicker = newEndTime < oldEndTime;
                if (hasLongerTicker) game.timedEventQueue.RemoveEvent(this.currentTicker);
            }
        }

        if (!hasLongerTicker) {
            // Now register an event
            this.currentTicker = game.timedEventQueue.AddEvent(new TimedEvent(() => {
                // Just check if we are active upon expiration
                this.isActive(game);
                return true;
            }, instance.duration * 1000, false));
        }
    }

    public onChange(callback: Function) {
        this.callbacks.push(callback);
    }

    public createHighlightEffect(game: Game, crewmember: Crewmember) {
        const localPlayer = crewmember.player;
        if (GetLocalPlayer() == localPlayer) {
            this.buttonHighlight = CreateCommandButtonEffect(RESOLVE_ABILITY_ID, "entangle");
        }

        if (crewmember.weapon) {
            crewmember.weapon.updateTooltip(game.weaponModule, crewmember);
        }
    }

    public removeHighlightEffect(game: Game, crewmember: Crewmember) {
        const localPlayer = crewmember.player;
        if (GetLocalPlayer() == localPlayer && this.buttonHighlight) {
            DestroyCommandButtonEffect(this.buttonHighlight);
            this.buttonHighlight = undefined;
        }

        if (crewmember.weapon) {
            crewmember.weapon.updateTooltip(game.weaponModule, crewmember);
        }
    }

    /**
     * Checks if resolve is active
     * Will COMPARE against game time. Avoid this when possible
     * @param game 
     */
    public isActive(game: Game): Boolean {
        const wasActive = this.instances.length > 0;

        const gameTime = game.getTimeStamp();
        const activeInstances = this.instances
            .filter(instance => (instance.startTimeStamp + instance.duration) > gameTime);

        this.instances = activeInstances;
        const nowIsActive = activeInstances.length > 0

        if (wasActive && !nowIsActive) {
            this.doCallbacks();
        }

        return nowIsActive;
    }

    /**
     * Checks if this is active WITHOUT checking against time
     * Use this whenever possible
     */
    public isActiveNoCheck(): Boolean {
        return this.instances.length > 0;
    }

    /**
     * Goes through and calls the callbacks
     */
    private doCallbacks() {
        this.callbacks.forEach(cb => cb(this));
    }
}