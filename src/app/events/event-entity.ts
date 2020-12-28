import { EventListener } from "app/events/event-type";
import { EVENT_TYPE } from "./event-enum";
import { EventData } from "./event-data";
import { Hooks } from "lib/Hooks";
import { Trigger, Region, Unit, MapPlayer } from "w3ts/index";
import { Log } from "lib/serilog/serilog";
import { ABIL_DEFEND, ABIL_EGG_HATCH_NEUTRAL } from "resources/ability-ids";
import { Players } from "w3ts/globals/index";
import { Timers } from "app/timer-type";
import { UNIT_ID_DUMMY_CASTER, UNIT_ID_CRATE, SPACE_UNIT_ASTEROID, SPACE_UNIT_MINERAL, ALIEN_STRUCTURE_TUMOR, ALIEN_MINION_LARVA, ALIEN_MINION_EGG, ALIEN_MINION_CANITE, UNIT_ID_EGG_AUTO_HATCH_LARGE, UNIT_ID_EGG_AUTO_HATCH } from "resources/unit-ids";
import { SFX_ZERG_BUILDING_DEATH, SFX_ZERG_LARVA_DEATH, SFX_ZERG_EGG_DEATH, SFX_ALIEN_BLOOD } from "resources/sfx-paths";
import { PlayerStateFactory } from "app/force/player-state-entity";

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
    private onUnitDeath: Trigger;
    private onUnitUndefend: Trigger;

    constructor() {
        const mapArea = CreateRegion();
        RegionAddRect(mapArea, GetPlayableMapRect());
        
        // listen to unit create events
        // this is used as a "on unit remove" hack
        this.onUnitSpawn = new Trigger();
        this.onUnitSpawn.registerEnterRegion(mapArea, Condition(() => true));

        Players.forEach(player => {
            SetPlayerAbilityAvailable(player.handle, ABIL_DEFEND, false);
        });
        this.onUnitSpawn.addAction(() => {
            const unit = GetTriggerUnit();
            const u = GetUnitTypeId(GetTriggerUnit());
            
            if (u == UNIT_ID_DUMMY_CASTER) return false;
            if (u == UNIT_ID_CRATE) return false;
            if (u == SPACE_UNIT_ASTEROID) return false;
            if (u == SPACE_UNIT_MINERAL) return false;

            // Check to see if controller is alien AI
            if (PlayerStateFactory.isAlienAI(MapPlayer.fromHandle(GetOwningPlayer(unit)))) {
                const source = Unit.fromHandle(unit);
                EventEntity.send(EVENT_TYPE.REGISTER_AS_AI_ENTITY, { source: source });
            }
            else if (GetUnitTypeId(unit) === ALIEN_MINION_CANITE) {
                DestroyEffect(AddSpecialEffect(SFX_ALIEN_BLOOD, GetUnitX(unit), GetUnitY(unit)));
                const source = Unit.fromHandle(unit);
                EventEntity.send(EVENT_TYPE.REGISTER_AS_AI_ENTITY, { source: source });
            }
        })

        this.onUnitDeath = new Trigger();
        this.onUnitDeath.registerAnyUnitEvent(EVENT_PLAYER_UNIT_DEATH);
        this.onUnitDeath.addAction(() => {
            const unit = GetTriggerUnit();
            const u = GetUnitTypeId(GetTriggerUnit());
            
            if (u == UNIT_ID_DUMMY_CASTER) return false;
            if (u == UNIT_ID_CRATE) return false;
            if (u == SPACE_UNIT_ASTEROID) return false;
            if (u == SPACE_UNIT_MINERAL) return false;
            // if (u == UNIT_) return false;

            
            UnitAddAbility(GetTriggerUnit(), ABIL_DEFEND);
        })

        this.onUnitUndefend = new Trigger();
        this.onUnitUndefend.registerAnyUnitEvent(EVENT_PLAYER_UNIT_ISSUED_ORDER);
        this.onUnitUndefend.addCondition(Condition(() => { 
            const order = GetIssuedOrderId()
            // If we are undefending it means something's happened to the unit
            if (order === 852056) {
                const unit = Unit.fromHandle(GetTriggerUnit());
                const unitIsDead = !UnitAlive(unit.handle)
                if (unitIsDead) {

                    // Other things we gotta do
                    // If it is a creep tumor, play the zerg building sfx
                    if (unit.typeId === ALIEN_STRUCTURE_TUMOR) {
                        unit.show = false;
                        const sfx = AddSpecialEffect(SFX_ZERG_BUILDING_DEATH, unit.x, unit.y);
                        BlzSetSpecialEffectScale(sfx, 0.4);
                        DestroyEffect(sfx);
                    }
                    else if (unit.typeId === ALIEN_MINION_LARVA) {
                        unit.show = false;
                        const sfx = AddSpecialEffect(SFX_ZERG_LARVA_DEATH, unit.x, unit.y);
                        BlzSetSpecialEffectScale(sfx, 0.6);
                        DestroyEffect(sfx);
                    }
                    else if (unit.typeId === ALIEN_MINION_EGG || unit.typeId === UNIT_ID_EGG_AUTO_HATCH || unit.typeId == UNIT_ID_EGG_AUTO_HATCH_LARGE) {
                        unit.show = false;
                        const sfx = AddSpecialEffect(SFX_ZERG_EGG_DEATH, unit.x, unit.y);
                        BlzSetSpecialEffectScale(sfx, unit.selectionScale);
                        DestroyEffect(sfx)
                    }

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

    sendEvent(whichEvent: EVENT_TYPE, data?: EventData) {
        // Get the list of listeners
        const listeners = this.eventListeners.get(whichEvent);
        // Log.Information(`Sending event: ${EVENT_TYPE[whichEvent]} count ${listeners && listeners.length}`)
        if (listeners) {
            // Log.Information(`Got event ${EVENT_TYPE[whichEvent]} to ${listeners.length}`);
            listeners.forEach(l => l.onEvent(data));
        }
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

    public static listen(listener: EventListener)
    public static listen(event: EVENT_TYPE, cb: (self: EventListener, data: EventData) => void)
    public static listen(listener: EventListener | EVENT_TYPE, cb?: (self: EventListener, data: EventData) => void) {
        if (listener instanceof EventListener) {
            EventEntity.getInstance().addListener(listener)
        }
        else {
            EventEntity.getInstance().addListener(new EventListener(listener as EVENT_TYPE, cb));
        }
    } 
}