import { EventListener } from "app/events/event-type";
import { EVENT_TYPE } from "./event-enum";
import { EventData } from "./event-data";
import { Hooks } from "lib/Hooks";
import { Trigger, Region, Unit } from "w3ts/index";
import { Log } from "lib/serilog/serilog";
import { ABIL_DEFEND } from "resources/ability-ids";
import { Players } from "w3ts/globals/index";
import { Timers } from "app/timer-type";
import { UNIT_ID_DUMMY_CASTER } from "resources/unit-ids";

/**
 * Handles and tracks events being passed to and from the game
 */
export class EventEntity {
    private static instance: EventEntity;

    public static getInstance() {        
        if (this.instance == null) {
            this.instance = new EventEntity();
            Hooks.set(this.name, this.instance);
        }
        return this.instance;
    }


    eventListeners = new Map<EVENT_TYPE, EventListener[]>();

    private onUnitSpawn: Trigger;
    private onUnitUndefend: Trigger;

    constructor() {
        // listen to unit create events
        // this is used as a "on unit remove" hack
        this.onUnitSpawn = new Trigger();
        const mapArea = CreateRegion();
        RegionAddRect(mapArea, GetPlayableMapRect());
        this.onUnitSpawn.registerAnyUnitEvent(EVENT_PLAYER_UNIT_DEATH);
        // this.onUnitSpawn.registerEnterRegion(mapArea, Condition(() => true));

        Players.forEach(player => {
            SetPlayerAbilityAvailable(player.handle, ABIL_DEFEND, false);
        });
        this.onUnitSpawn.addAction(() => {
            // Log.Information("Adding Defend to "+GetUnitName(GetTriggerUnit()));
            UnitAddAbility(GetTriggerUnit(), ABIL_DEFEND);
            // UnitRemoveAbility(GetTriggerUnit(), ABIL_DEFEND);
        })

        this.onUnitUndefend = new Trigger();
        this.onUnitUndefend.registerAnyUnitEvent(EVENT_PLAYER_UNIT_ISSUED_ORDER);
        this.onUnitUndefend.addCondition(Condition(() => { 
            const order = GetIssuedOrderId()
            // If we are undefending it means something's happened to the unit
            if (order === 852056 && GetUnitTypeId(GetTriggerUnit()) !== UNIT_ID_DUMMY_CASTER) {
                const unit = Unit.fromHandle(GetTriggerUnit());
                const unitIsDead = !UnitAlive(unit.handle)
                if (unitIsDead) {
                    Timers.addTimedAction(0.00, () => {
                        if (!UnitAlive(unit.handle)) {
                            // Unit is omega dead
                            EventEntity.send(EVENT_TYPE.UNIT_REMOVED_FROM_GAME, { source: unit });
                        }
                    });
                }
            }
            // Log.Information("Order "+OrderId2String(GetIssuedOrderId()));
            return false;
        }))
    }

    addListener(listeners: EventListener[])
    addListener(listener: EventListener)
    addListener(listener: EventListener | EventListener[]) {
        let _listeners: EventListener[];
        if (listener instanceof EventListener) {
            _listeners = [listener];
        }
        else {
            _listeners = listener;
        }

        _listeners.forEach(listener => {
            // Get the list of listeners
            const listeners = this.eventListeners.get(listener.eventType) || [];
            // Add this listener to it
            listeners.push(listener);
            // No apply the change
            this.eventListeners.set(listener.eventType, listeners);

        });
        return this;
    }

    sendEvent(whichEvent: EVENT_TYPE, data: EventData) {
        // Get the list of listeners
        const listeners = this.eventListeners.get(whichEvent) || [];
        listeners.forEach(l => l.onEvent(data));
    }

    removeListener(listener: EventListener) {
        // Get the list of listeners
        const listeners = this.eventListeners.get(listener.eventType) || [];
        this.eventListeners.set(listener.eventType, listeners.filter(l => l != listener));
    }


    /** STATIC API */
    public static send(whichEvent: EVENT_TYPE, data: EventData) {
        EventEntity.getInstance().sendEvent(whichEvent, data);
    } 

    public static listen(listener: EventListener) {
        EventEntity.getInstance().addListener(listener)
    } 
}