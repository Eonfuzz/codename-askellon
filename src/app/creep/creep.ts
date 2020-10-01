import { CreepSource } from "./creep-source";
import { Vector2 } from "app/types/vector2";
import { MultiMap } from "lib/multi-map";
import { TILE_SIZE } from "resources/data-consts";
import { Log } from "lib/serilog/serilog";
import { searchTiles } from "lib/utils";
import { PlayerStateFactory } from "app/force/player-state-entity";

export class Creep {
    source: CreepSource;

    // The radius of the tile
    private maxRadius: number = 0;
    private currentRadius: number = 0;

    // How far it grows each tick
    private growthRate: number = TILE_SIZE / 4;
    private degenerateRate: number = TILE_SIZE;

    private oldCenter: Vector2;
    private oldCenterTile: Vector2;

    constructor(source: CreepSource, radius: number = 8 * TILE_SIZE) {
        this.source = source;
        this.oldCenter = new Vector2(source.x(), source.y());
        this.oldCenterTile = Vector2.toTile(source.x(), source.y());

        this.maxRadius = radius;
    }

    step(delta: number): boolean {
        this.oldCenter = new Vector2(this.source.x(), this.source.y());
        this.oldCenterTile = Vector2.toTile(this.source.x(), this.source.y());
        
        // We are done shrinking
        if (!this.source.isValid() && this.currentRadius <= 0) return false;

        // We are growing
        if (this.source.isValid() && this.currentRadius < this.maxRadius) 
            this.currentRadius += this.growthRate * delta;
        // We are shrinking
        else if (!this.source.isValid()) {
            this.currentRadius -= this.degenerateRate * delta;
        }
         
        return true;      
    }

    destroy() {
        Log.Information("Killing creep");
    }

    public updateCreep(): Vector2[] {

        const effectedTiles = searchTiles(this.oldCenterTile, this.currentRadius);
        let result = [];

        effectedTiles.forEach(v => result.push(v));
        return result;
    }
}