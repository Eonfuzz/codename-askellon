import { Game } from "app/game";
import { DynamicBuff, BuffInstance } from "./buff-instance";
import { Unit, Trigger, Timer } from "w3ts/index";
import { BUFF_ID } from "resources/buff-ids";
import { onFire } from "./fire";
import { Log } from "lib/serilog/serilog";
import { flashFreeze } from "./flash-freeze";
import { Trifex } from "./trifex";

/** @noSelfInFile **/
export class DynamicBuffModule {
    name = 'default';

    game: Game;
    buffs: DynamicBuff[] = [];
    buffsByUnit = new Map<Unit, DynamicBuff[]>();

    constructor(game: Game) {
        this.game = game;
    }

    init() {}

    addBuff(buffId: BUFF_ID, who: Unit, instance: BuffInstance, isNegativeInstance?: boolean) {
        let buffsForUnit = this.buffsByUnit.has(who) ? this.buffsByUnit.get(who) : [];
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
        if (id === BUFF_ID.TRIFEX) return new Trifex();
        Log.Error("Creating new buff no instance for ID "+id);
    }

    process(delta) {
        // Dont do anything if no buffs
        if (this.buffs.length === 0) return;
        const nBuffs = [];

        for (let index = 0; index < this.buffs.length; index++) {
            const buff = this.buffs[index];
            const doDestory = buff.process(this.game, delta);
            if (!doDestory) {
                nBuffs.push(buff);
            }
            else {
                const buffsForUnit = this.buffsByUnit.get(buff.who);
                const idx = buffsForUnit.indexOf(buff);
                if (idx >= 0) {
                    buffsForUnit.splice(idx, 1);
                    if (buffsForUnit.length === 0) this.buffsByUnit.delete(buff.who);
                }
                else {
                    Log.Error("Deleting unit buff from unit buff cache but no unit entry");
                }
            }
        }

        this.buffs = nBuffs;
    }
}