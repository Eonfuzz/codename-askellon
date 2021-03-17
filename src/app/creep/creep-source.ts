import { Vector2 } from "app/types/vector2";
import { MultiMap } from "lib/multi-map";
import { TILE_SIZE } from "resources/data-consts";
import { Log } from "lib/serilog/serilog";
import { searchTiles, distance } from "lib/utils";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { CreepOrigin } from "./creep-origin";
import { SFX_RED_SINGULARITY, SFX_DARK_RITUAL } from "resources/sfx-paths";
import { Quick } from "lib/Quick";

export class CreepSource {
    source: CreepOrigin;

    // The radius of the tile
    private maxRadius: number = 0;
    private currentRadius: number = 0;

    // How far it grows each tick
    private growthRate: number = TILE_SIZE / 2;
    private degenerateRate: number = TILE_SIZE / 4;

    public oldTilesIterator = [];
    private oldTileMap = new MultiMap<number, number, boolean>();


    constructor(source: CreepOrigin, radius: number = 8 * TILE_SIZE) {
        this.source = source;
        this.maxRadius = radius;
    }

    step(delta: number): boolean {        
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
        // Log.Information("Killing creep");
    }

    public updateCreep(): { new: Vector2[], removed: Vector2[] } {
        { // DO
            const tileMap = new MultiMap<number, number, boolean>();

            const cX = Math.round(this.source.x() / TILE_SIZE) * TILE_SIZE;
            const cY = Math.round(this.source.y() / TILE_SIZE) * TILE_SIZE;
            const radius = Math.round(this.currentRadius / TILE_SIZE) * TILE_SIZE;

            // Log.Information(`cX: ${cX} cY: ${cY}`);

            const points = [];
            const removed = [];

            for (let j = (cX-radius); j <= (cX+radius); j += TILE_SIZE) {
                for (let k = (cY-radius); k<=(cY+radius); k += TILE_SIZE) {
                    if (distance(cX, cY, j, k) <= radius) {
                        if (!this.oldTileMap.get(j, k)) {
                            const vec = new Vector2(j, k);
                            points.push( vec );
                            this.oldTilesIterator.push( vec );
                        }
                        tileMap.set( j, k, true );
                    }
                }
            }

            // Log.Information("UC: Points length: "+this.oldTilesIterator.length);

            for (let index = 0; index < this.oldTilesIterator.length; index++) {
                const vec = this.oldTilesIterator[index];
                if (!tileMap.get(vec.x, vec.y)) {
                    removed.push( vec );
                    Quick.Slice(this.oldTilesIterator, index--);
                }
            }

            this.oldTileMap = tileMap;
            return { new: points,  removed: removed };
        } // END
    }
}