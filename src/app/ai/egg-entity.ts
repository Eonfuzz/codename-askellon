import { Entity } from "app/entity-type";
import { Hooks } from "lib/Hooks";
import { Unit } from "w3ts/index";
import { EventEntity } from "app/events/event-entity";
import { EventListener } from "app/events/event-type";
import { EVENT_TYPE } from "app/events/event-enum";
import { EggInstance } from "./egg-instance";
import { Quick } from "lib/Quick";

export class EggEntity extends Entity {
    private static instance: EggEntity;
    public static getInstance() {        
        if (this.instance == null) {
            this.instance = new EggEntity();
            Hooks.set(this.name, this.instance);
        }
        return this.instance;
    }

    private instances: EggInstance[] = [];

    constructor() {
        super();

        // Register egg events
        EventEntity.listen(new EventListener(EVENT_TYPE.SPAWN_ALIEN_EGG_FOR, (self, event) => {
            this.instances.push( new EggInstance(event.source, event.data.to, event.data.duration, event.data.scale));
            this.instances[this.instances.length-1].init();
        }))
    }

    _timerDelay = 0.5;
    step() {
        for (let index = 0; index < this.instances.length; index++) {
            const egg = this.instances[index];
            if (!egg.step(this._timerDelay)) {
                Quick.Slice(this.instances, index--);
            }
        }
    }
}