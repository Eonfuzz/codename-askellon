import { Entity } from "app/entity-type";
import { Hooks } from "lib/Hooks";
import { Unit } from "w3ts/index";
import { CreepSource, CreepSourcePoint, CreepSourceUnit } from "./creep-source";
import { Vector2 } from "app/types/vector2";
import { MultiMap } from "lib/multi-map";
import { Creep } from "./creep";
import { Quick } from "lib/Quick";

export class CreepEntity extends Entity {
    private static instance: CreepEntity;

    public static getInstance() {        
        if (this.instance == null) {
            this.instance = new CreepEntity();
            Hooks.set(this.name, this.instance);
        }
        return this.instance;
    }

    private instances: Creep[] = [];
    // x, y, numberCreepReferences
    private creepMap = new MultiMap<number, number, number>();


    step() {
        for (let index = 0; index < this.instances.length; index++) {
            const instance = this.instances[index];
            if (!instance.step(this._timerDelay, this.creepMap)) {
                instance.destroy(this.creepMap);
                Quick.Slice(this.instances, index);
            }
        }
    }


    /**
     * static api
     */
    
    public static addCreep(radius: number, x: number, y: number);
    public static addCreep(radius: number, x: number, y: number, duration: number);
    public static addCreep(radius: number, x: number, y: number, duration?: number) {
        const instance = this.getInstance();
        instance.instances.push( new Creep(new CreepSourcePoint(x, y, duration), radius) );
    }

    /**
     * 
     * @param radius 
     * @param source 
     */
    public static addCreepWithSource(radius: number, source: Unit) {
        const instance = this.getInstance();
        instance.instances.push( new Creep(new CreepSourceUnit(source), radius) );
    }
}