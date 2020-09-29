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

    private creepMap = new MultiMap<number, number, boolean>();

    private oldCenter: Vector2;
    private oldCenterTile: Vector2;

    constructor(source: CreepSource, radius: number = 8 * TILE_SIZE) {
        this.source = source;
        this.oldCenter = new Vector2(source.x(), source.y());
        this.oldCenterTile = Vector2.toTile(source.x(), source.y());

        this.maxRadius = radius;
    }

    step(delta: number, creepMap: MultiMap<number, number, number>): boolean {
        // We are done shrinking
        if (!this.source.isValid() && this.currentRadius <= 0) return false;

        // We are growing
        if (this.source.isValid() && this.currentRadius < this.maxRadius) 
            this.currentRadius += this.growthRate * delta;
        // We are shrinking
        else if (!this.source.isValid()) {
            this.currentRadius -= this.degenerateRate * delta;
        }

        // Update creep
        this.updateCreep();         
        return true;      
    }

    destroy(instanceMap: MultiMap<number, number, number>) {
        Log.Information("Killing creep");
    }

    updateCreep() {

        const effectedTiles = searchTiles(this.oldCenterTile, this.currentRadius);
            
        effectedTiles.forEach(v => {
            const tileCreeped = this.creepMap.get(v.x, v.y);

            if (!tileCreeped) {
                const oldTerrain = GetTerrainType(v.x, v.y);
                SetTerrainType(v.x, v.y, FourCC('Adrd'), 0, 1, 0);
                SetBlight(PlayerStateFactory.AlienAIPlayer1.handle, v.x, v.y, 1, true);
                this.creepMap.set(v.x, v.y, true);
            }
        });

        // If we've moved our center we need to update all the old shit, expensive process.
        if (this.oldCenter.x !== this.source.x() || this.oldCenter.y !== this.source.y()) {
            Log.Information("Source moving update this shit pls");
        }


    }
}