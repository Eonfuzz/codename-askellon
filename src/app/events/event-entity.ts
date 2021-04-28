import { EventListener } from "app/events/event-type";
import { EVENT_TYPE } from "./event-enum";
import { EventData } from "./event-data";
import { Hooks } from "lib/Hooks";
import { Trigger, Region, Unit, MapPlayer } from "w3ts/index";
import { Players } from "w3ts/globals/index";
import { Timers } from "app/timer-type";
import { UNIT_ID_DUMMY_CASTER, UNIT_ID_CRATE, SPACE_UNIT_ASTEROID, SPACE_UNIT_MINERAL, ALIEN_STRUCTURE_TUMOR, ALIEN_MINION_LARVA, ALIEN_MINION_EGG, ALIEN_MINION_CANITE, UNIT_ID_EGG_AUTO_HATCH_LARGE, UNIT_ID_EGG_AUTO_HATCH, UNIT_ID_EXPLOSIVE_BARREL, SPACE_UNIT_MINERAL_RARE, UNIT_ID_DEBRIS_3, UNIT_ID_DEBRIS_2, UNIT_ID_DEBRIS_1 } from "resources/unit-ids";
import { SFX_ZERG_BUILDING_DEATH, SFX_ZERG_LARVA_DEATH, SFX_ZERG_EGG_DEATH, SFX_ALIEN_BLOOD, SFX_BUILDING_EXPLOSION } from "resources/sfx-paths";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { ABIL_ALIEN_MINION_EVOLVE, ABIL_U_DEX } from "resources/ability-ids";
import { UnitDex, UnitDexEvent } from "./unit-indexer";
import { console } from "lib/translators";
import { Log } from "lib/serilog/serilog";

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

    constructor() {
        UnitDex.init();

        UnitDex.registerEvent(UnitDexEvent.INDEX, () => {
            const u = UnitDex.eventUnit;
            const uType = u.typeId;

            if (uType == UNIT_ID_DUMMY_CASTER) return false;
            if (uType == UNIT_ID_CRATE) return u.paused = true;
            if (uType == UNIT_ID_EXPLOSIVE_BARREL) return u.paused = true;
            if (uType == SPACE_UNIT_ASTEROID) return false;
            if (uType == SPACE_UNIT_MINERAL) return false;
            if (uType == SPACE_UNIT_MINERAL_RARE) return false;


            if (uType === ALIEN_MINION_CANITE) {
                DestroyEffect(AddSpecialEffect(SFX_ALIEN_BLOOD, u.x, u.y));
                u.setAbilityLevel(ABIL_ALIEN_MINION_EVOLVE, 2);
            }
            // Check to see if controller is alien AI
            if (PlayerStateFactory.isAlienAI(u.owner)) {
                EventEntity.send(EVENT_TYPE.REGISTER_AS_AI_ENTITY, { source: u });
            }
        });

        UnitDex.registerEvent(UnitDexEvent.DEATH, () => {
            const unit = UnitDex.eventUnit;

            Log.Verbose(`Death called for ${unit.name} ${unit.id}`);
            // Other things we gotta do
            // If it is a creep tumor, play the zerg building sfx
            if (unit.typeId === UNIT_ID_DEBRIS_3 || unit.typeId === UNIT_ID_DEBRIS_2 || unit.typeId == UNIT_ID_DEBRIS_1) {
                const sfx = AddSpecialEffect(SFX_BUILDING_EXPLOSION, unit.x, unit.y);
                BlzSetSpecialEffectScale(sfx, 0.4);
                DestroyEffect(sfx);
                unit.destroy();
            }
            if (unit.typeId === ALIEN_STRUCTURE_TUMOR) {
                const sfx = AddSpecialEffect(SFX_ZERG_BUILDING_DEATH, unit.x, unit.y);
                BlzSetSpecialEffectScale(sfx, 0.4);
                DestroyEffect(sfx);
                unit.destroy();
                EventEntity.send(EVENT_TYPE.UNIT_REMOVED_FROM_GAME, { source: unit });
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
        });

        UnitDex.registerEvent(UnitDexEvent.DEINDEX, () => {
            const unit = UnitDex.eventUnit;
            Log.Verbose(`Remove called for ${unit.name} ${unit.id}`);
            // Unit is omega dead
            EventEntity.send(EVENT_TYPE.UNIT_REMOVED_FROM_GAME, { source: unit });
        });
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