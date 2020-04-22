import { Game } from "app/game";
import { DynamicBuff, BuffInstance } from "./buff-instance";
import { Unit, Trigger } from "w3ts/index";
import { BUFF_ID } from "resources/buff-ids";
import { onFire } from "./fire";
import { Log } from "lib/serilog/serilog";
import { flashFreeze } from "./flash-freeze";

/** @noSelfInFile **/
export class DynamicBuffModule {
    name = 'default';

    game: Game;
    buffs: DynamicBuff[] = [];
    buffsByUnit = new Map<Unit, DynamicBuff[]>();

    constructor(game: Game) {
        this.game = game;
    }

    init() {
        const buffUpdateTrigger = new Trigger();
        buffUpdateTrigger.registerTimerEvent(0.1, true);
        buffUpdateTrigger.addAction(() => this.process(0.1));
    }

    addBuff(buffId: BUFF_ID, who: Unit, instance: BuffInstance, isNegativeInstance?: boolean) {
        let buffsForUnit = this.buffsByUnit.get(who) || [];
        let matchingBuff = buffsForUnit.filter(b => b.id === buffId)[0];

        if (!matchingBuff) {
            matchingBuff = this.newDynamicBuffFor(buffId, who);
            buffsForUnit.push(matchingBuff);
            this.buffs.push(matchingBuff);
            this.buffsByUnit.set(who, buffsForUnit);
        }

        matchingBuff.addInstance(this.game, who, instance, isNegativeInstance);
    }

    newDynamicBuffFor(id: BUFF_ID, who: Unit) {
        if (id === BUFF_ID.FIRE) return new onFire();
        if (id === BUFF_ID.FLASH_FREEZE) return new flashFreeze();
        Log.Error("Creating new buff no instance for ID "+id);
    }

    process(delta) {
        this.buffs = this.buffs.filter(buff => {
            const doDestroy = !buff.process(this.game, delta);
            if (doDestroy) {
                const buffs = this.buffsByUnit.get(buff.who) || [];
                buffs.splice(buffs.indexOf(buff), 1);
                if (buffs.length === 0) this.buffsByUnit.delete(buff.who);
            }
            return !doDestroy;
        })
    }
}