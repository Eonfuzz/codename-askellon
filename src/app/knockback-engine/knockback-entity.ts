import { Entity } from "app/entity-type";
import { Hooks } from "lib/Hooks";
import { Unit } from "w3ts/index";

interface KnockbackInstance {
    who: Unit;
    direction: number;
    force: number;
    decay: number;
}

export class KnockbackEntity extends Entity {
    private static instance: KnockbackEntity;

    private MINIMUM_PUSH = 50;
    private instances: KnockbackInstance[] = [];

    public static getInstance() {        
        if (this.instance == null) {
            this.instance = new KnockbackEntity();
            Hooks.set(this.name, this.instance);
        }
        return this.instance;
    }


    // The timer delay for knockback
    _timerDelay = 0.3;
    step() {
        for (let index = 0; index < this.instances.length; index++) {
            const instance = this.instances[index];

            let offset = instance.force;

            // Process instance
            instance.who.x = instance.who.x + offset * Cos(instance.direction * bj_DEGTORAD);
            instance.who.y = instance.who.y + offset * Sin(instance.direction * bj_DEGTORAD);

            instance.force -= instance.force * instance.decay;
            if (instance.force < this.MINIMUM_PUSH) {
                this.instances.splice(index, 1);
            }
            else {
                index++;
            }
        }
    }

    public add(i: KnockbackInstance) {
        this.instances.push(i);
    }

    public static add(who: Unit, direction: number, force: number, decay: number = 0.1) {
        const instance = KnockbackEntity.getInstance();
        instance.add({who, direction, force, decay});
    }
}