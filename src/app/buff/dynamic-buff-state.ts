import { Unit } from "w3ts/index";
import { BUFF_ID } from "resources/buff-ids";
import { DynamicBuff } from "./dynamic-buff-type";
import { Hooks } from "lib/Hooks";

export class DynamicBuffState {
    private static instance: DynamicBuffState;

    public static getInstance() {        
        if (this.instance == null) {
            this.instance = new DynamicBuffState();
            Hooks.set(this.name, this.instance);
        }
        return this.instance;
    }

    
    public buffs: DynamicBuff[] = [];
    public buffsByUnit = new Map<number, DynamicBuff[]>();

    public static unitHasBuff(buffId: BUFF_ID, who: Unit): false | DynamicBuff {
        const state = DynamicBuffState.getInstance();

        if (!state.buffsByUnit.has(who.id)) return false;
        const buffs = state.buffsByUnit.get(who.id);
        return buffs.find(b => b.id === buffId);
    }


    public static addBuff(who: Unit, buff: DynamicBuff) {
        const state = DynamicBuffState.getInstance();

        const unitBuffs = state.buffsByUnit.get(who.id) || [];

        unitBuffs.push(buff);
        state.buffs.push(buff);
        state.buffsByUnit.set(who.id, unitBuffs);
    }
}