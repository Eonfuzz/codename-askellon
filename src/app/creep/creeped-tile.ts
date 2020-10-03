import { Vector2 } from "app/types/vector2";
import { SFX_DARK_RITUAL, SFX_RED_SINGULARITY, SFX_AVATAR } from "resources/sfx-paths";
import { Log } from "lib/serilog/serilog";
import { getZFromXY } from "lib/utils";
import { Timers } from "app/timer-type";
export enum CreepedTileState {
    BIRTH, STAND, DECAY
}

export class CreepedTile {
    loc: Vector2;
    terrainTile: number;
    terrainVariation: number;
    state: CreepedTileState;
    timeElapsed: number;
    value: number;

    references: number = 0;

    constructor(loc: Vector2) {
        this.loc = loc;
        this.terrainTile = GetTerrainType(loc.x, loc.y);
        this.terrainVariation = GetTerrainVariance(loc.x, loc.y)
        this.add();
    }

    setState(to: CreepedTileState) {
        this.state = to;
        if (to === CreepedTileState.BIRTH) {
            this.timeElapsed = 0;
            this.value = GetRandomReal(0, 3);    
            // Timers.addTimedAction(this.value-1.5, () => {
            //     const v = this.loc;
            //     const sfx = AddSpecialEffect("Models\\DarkHarvest.mdx", v.x, v.y);
            //     BlzSetSpecialEffectZ(sfx, getZFromXY(v.x, v.y)+10);
            //     BlzSetSpecialEffectTimeScale(sfx, 2);
            //     // BlzSetSpecialEffectAlpha(sfx, 45);
            //     DestroyEffect(sfx);
            // });
            // Log.Information("Start birth!!");
            // AddSpecialEffect(SFX_DARK_RITUAL, this.loc.x, this.loc.y);  
        }
        else if (to === CreepedTileState.STAND) {
            // AddSpecialEffect(SFX_AVATAR, this.loc.x, this.loc.y);  
            SetTerrainType(this.loc.x, this.loc.y, FourCC('Jwmb'), 0, 1, 0);
        }
        else if (to === CreepedTileState.DECAY) {
            this.timeElapsed = 0;
            this.value = GetRandomReal(0, 10);
            // AddSpecialEffect(SFX_RED_SINGULARITY, this.loc.x, this.loc.y); 
        }
    }


    step(delta: number) {
        // Log.Information(`Stepping : ${CreepedTileState[this.state]}`)
        // Do nothing during stand
        if (this.state === CreepedTileState.STAND) {
            // Do nothing
        }
        // Hand the birthing of the tile
        else if (this.state === CreepedTileState.BIRTH) {
            this.timeElapsed += delta;
            if (this.timeElapsed >= this.value) this.setState(CreepedTileState.STAND);
        }
        else if (this.state === CreepedTileState.DECAY) {
            this.timeElapsed += delta;
            if (this.timeElapsed >= this.value) {
                SetTerrainType(this.loc.x, this.loc.y, this.terrainTile, this.terrainVariation, 1, 0);

                // This instance is dead after it's done decaying
                return false;
            }
        }

        return true;
    }

    // Adds a reference
    add() {
        this.references ++;
        if (this.references === 1) {
            this.setState(CreepedTileState.BIRTH);
        }
    }
    // Subtracts a reference
    // If we have no refrences, we start decaying
    subtract() {
        this.references --;
        // Log.Information("subtracting ref "+this.references);
        if (this.references <= 0) this.setState(CreepedTileState.DECAY);
    }
}