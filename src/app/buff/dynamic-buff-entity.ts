import { Game } from "app/game";
import { Unit } from "w3ts/index";
import { BUFF_ID } from "resources/buff-ids";
import { Log } from "lib/serilog/serilog";
import { Entity } from "app/entity-type";
import { DynamicBuff } from "./dynamic-buff-type";
import { BuffInstance } from "./buff-instance-type";
import { GameTimeElapsed } from "app/types/game-time-elapsed";

// import { flashFreeze } from "./buffs/flash-freeze";
// import { Trifex } from "./buffs/trifex";
// import { Despair } from "./buffs/despair";
// import { Resolve } from "./buffs/resolve";
// import { PuritySeal } from "./buffs/purity-seal";
// import { onFire } from "./buffs/fire";

export class DynamicBuffEntity extends Entity {

    private static instance: DynamicBuffEntity;

    public static getInstance() {        
        Log.Information("Getting buff entity")
        if (this.instance == null) {
            Log.Information("Creating buff entity");
            this.instance = new DynamicBuffEntity();
        }
        return this.instance;
    }

    buffs: DynamicBuff[] = [];
    buffsByUnit = new Map<Unit, DynamicBuff[]>();


    unitHasBuff(buffId: BUFF_ID, who: Unit) {
        if (!this.buffsByUnit.has(who)) return false;
        const buffs = this.buffsByUnit.get(who);
        return buffs.find(b => b.id === buffId);
    }

    addBuff(buffId: BUFF_ID, who: Unit, instance: BuffInstance, isNegativeInstance?: boolean) {
        let buffsForUnit = this.buffsByUnit.has(who) ? this.buffsByUnit.get(who) : [];
        let matchingBuff = buffsForUnit.filter(b => b.id === buffId)[0];

        // if (!matchingBuff) {
        //     matchingBuff = this.newDynamicBuffFor(buffId, who);
        //     buffsForUnit.push(matchingBuff);
        //     this.buffs.push(matchingBuff);
        //     this.buffsByUnit.set(who, buffsForUnit);
        // }

        matchingBuff.addInstance(who, instance, isNegativeInstance);
        return matchingBuff;
    }

    newDynamicBuffFor(id: BUFF_ID, who: Unit) {
        // if (id === BUFF_ID.FIRE) return new onFire();
        // if (id === BUFF_ID.FLASH_FREEZE) return new flashFreeze();
        // if (id === BUFF_ID.TRIFEX) return new Trifex();
        // if (id === BUFF_ID.DESPAIR) return new Despair(who);
        // if (id === BUFF_ID.RESOLVE) return new Resolve(who);
        // if (id === BUFF_ID.PURITY_SEAL) return new PuritySeal();
        Log.Error("Creating new buff no instance for ID "+id);
    }

    step() {
        const timestamp = GameTimeElapsed.getTime();

        // Log.Information("Step 3 "+timestamp);

        // let i = 0;
        // while (i < this.buffs.length) {
        //     const buff = this.buffs[i];
        //     const isActive = buff.process(timestamp, this._timerDelay);

        //     // If we aren't active we need to do stuff
        //     if (!isActive) {
        //         const buffsForUnit = this.buffsByUnit.get(buff.who);
        //         const idx = buffsForUnit.indexOf(buff);

        //         if (idx >= 0) {
        //             buffsForUnit.splice(idx, 1);
        //             if (buffsForUnit.length === 0) this.buffsByUnit.delete(buff.who);
        //         }
        //         else {
        //             Log.Error("Deleting unit buff from unit buff cache but no unit entry");
        //         }

        //         // delete and loop again
        //         this.buffs[i] = this.buffs[this.buffs.length-1];
        //         delete this.buffs[this.buffs.length - 1];
        //     }
        //     else {
        //         i++;
        //     }
        // }
    }
}