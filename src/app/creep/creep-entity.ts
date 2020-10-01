import { Entity } from "app/entity-type";
import { Hooks } from "lib/Hooks";
import { Unit } from "w3ts/index";
import { CreepSource, CreepSourcePoint, CreepSourceUnit } from "./creep-source";
import { Vector2 } from "app/types/vector2";
import { MultiMap } from "lib/multi-map";
import { Creep } from "./creep";
import { Quick } from "lib/Quick";
import { getZFromXY } from "lib/utils";
import { Timers } from "app/timer-type";

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
    private creepMap = new MultiMap<number, number, boolean>();
    private tileData = new MultiMap<number, number, number>();
    private tileDataVariance = new MultiMap<number, number, number>();

    private oldMap: Vector2[] = [];


    _timerDelay = 0.5;
    step() {
        const oldCreepMap = this.creepMap;
        this.creepMap = new MultiMap<number, number, boolean>(); 
        
        let vectors = [];

        for (let index = 0; index < this.instances.length; index++) {
            const instance = this.instances[index];
            if (!instance.step(this._timerDelay)) {
                instance.destroy();
                Quick.Slice(this.instances, index);
            }
            else {
                const effectedByInstance = instance.updateCreep();
                for (let index = 0; index < effectedByInstance.length; index++) {
                    const vec = effectedByInstance[index];
                    this.creepMap.set(vec.x, vec.y, true);
                    vectors.push(vec);                    
                }
            }
        }

        const newOldMap = [];
        // Loop through all the old creep
        for (let index = 0; index < this.oldMap.length; index++) {
            const oldVec = this.oldMap[index];
            if (!this.creepMap.get(oldVec.x, oldVec.y)) {
                // Doesn't exist in the new creep instant, kill it   
                this.uncreepTile(oldVec);
            }
            else {
                newOldMap.push(oldVec);
            }
        }
        // Clear the old map
        this.oldMap = newOldMap;

        for (let index = 0; index < vectors.length; index++) {
            const nVec = vectors[index];
            this.creepMap.set(nVec.x, nVec.y, true);
            if (!oldCreepMap.get(nVec.x, nVec.y)) {
                // Set tile to creep    
                this.creepTile(nVec);
                this.oldMap.push(nVec);
            }
        }
    }

    private creepTile(v: Vector2) {
        this.tileData.set(v.x, v.y, GetTerrainType(v.x, v.y));
        this.tileDataVariance.set(v.x, v.y, GetTerrainVariance(v.x, v.y));
        
        // const sfx = AddSpecialEffect("Models\\DarkHarvest.mdx", v.x, v.y);
        // BlzSetSpecialEffectZ(sfx, getZFromXY(v.x, v.y)+10);
        // BlzSetSpecialEffectTimeScale(sfx, 2);
        // // BlzSetSpecialEffectAlpha(sfx, 45);
        // DestroyEffect(sfx);

        Timers.addTimedAction(this._timerDelay/GetRandomReal(1.3,10), () => {
            SetTerrainType(v.x, v.y, FourCC('Jwmb'), 0, 1, 0);
        });
    }

    private uncreepTile(v: Vector2) {
        SetTerrainType(v.x, v.y, this.tileData.get(v.x, v.y), this.tileDataVariance.get(v.x, v.y), 1, 0);
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