import { Entity } from "app/entity-type";
import { Hooks } from "lib/Hooks";
import { Unit } from "w3ts/index";
import { Vector2 } from "app/types/vector2";
import { MultiMap } from "lib/multi-map";
import { Quick } from "lib/Quick";
import { CreepedTile, CreepedTileState } from "./creeped-tile";
import { CreepOriginPoint, CreepOriginUnit } from "./creep-origin";
import { CreepSource } from "./creep-source";
import { Log } from "lib/serilog/serilog";

export class CreepEntity extends Entity {
    private static instance: CreepEntity;

    public static getInstance() {        
        if (this.instance == null) {
            this.instance = new CreepEntity();
            Hooks.set(this.name, this.instance);
        }
        return this.instance;
    }

    // x, y, numberCreepReferences
    private creepMap = new MultiMap<number, number, CreepedTile>();
    private creepIterator: CreepedTile[] = [];
    private creepSources: CreepSource[] = [];


    _timerDelay = 0.1;
    step() {
        for (let index = 0; index < this.creepSources.length; index++) {
            const source = this.creepSources[index];
            if (source.step(this._timerDelay)) {
                let data = source.updateCreep();
                // Log.Information(`C: ${data.new.length} R: ${data.removed.length}`)
                for (let index = 0; index < data.new.length; index++) {
                    const item = data.new[index];
                    this.makeCreep(item);
                }
                for (let index = 0; index < data.removed.length; index++) {
                    const item = data.removed[index];
                    this.killCreep(item);
                }
            }
            else {
                for (let index = 0; index < source.oldTilesIterator.length; index++) {
                    const element = source.oldTilesIterator[index];
                    this.killCreep(element);
                }                
                source.destroy();
                Quick.Slice(this.creepSources, index--);
            }
        }

        for (let index = 0; index < this.creepIterator.length; index++) {
            const creepInstance = this.creepIterator[index];
            if (!creepInstance.step(this._timerDelay)) {
                this.creepMap.delete(creepInstance.loc.x, creepInstance.loc.y);
                Quick.Slice(this.creepIterator, index--);
            }
        }

        this._timerDelay = 0.7 + GetRandomReal(-0.2, 0.2);
    }

    makeCreep(where: Vector2) {
        { // DO
            const existingCreep = this.creepMap.get(where.x, where.y);
            if (existingCreep && existingCreep.state === CreepedTileState.DECAY) {
                existingCreep.setState(CreepedTileState.BIRTH);
            }
            else if (existingCreep) {
                existingCreep.add();
            }
            else  {
                const creepTile = new CreepedTile(where);
                this.creepMap.set(where.x, where.y, creepTile);
                this.creepIterator.push(creepTile);
            }
        } // END
    }

    killCreep(where: Vector2) {
        // Log.Information("Killing creep at: "+where+" x"+where.x+", y"+where.y);
        const existingCreep = this.creepMap.get(where.x, where.y);
        if (existingCreep) {
            existingCreep.subtract();
        }
    }


    /**
     * static api
     */
    
    public static addCreep(radius: number, x: number, y: number);
    public static addCreep(radius: number, x: number, y: number, duration: number);
    public static addCreep(radius: number, x: number, y: number, duration?: number) {
        const instance = this.getInstance();
        instance.creepSources.push( new CreepSource(new CreepOriginPoint(x, y, duration), radius) );
    }

    /**
     * 
     * @param radius 
     * @param source 
     */
    public static addCreepWithSource(radius: number, source: Unit) {
        const instance = this.getInstance();
        instance.creepSources.push( new CreepSource(new CreepOriginUnit(source), radius) );
    }
}