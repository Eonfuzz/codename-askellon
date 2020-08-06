import { Unit } from "w3ts/index";
import { BUFF_ID } from "resources/buff-ids";
import { DynamicBuff } from "./dynamic-buff-type";

export class DynamicBuffState {
    private static instance: DynamicBuffState;

    public static getInstance() {        
        if (this.instance == null) {
            this.instance = new DynamicBuffState();
        }
        return this.instance;
    }

    
    public buffs: DynamicBuff[] = [];
    public buffsByUnit = new Map<Unit, DynamicBuff[]>();

    public static unitHasBuff(buffId: BUFF_ID, who: Unit): false | DynamicBuff {
        const state = DynamicBuffState.getInstance();

        if (!state.buffsByUnit.has(who)) return false;
        const buffs = state.buffsByUnit.get(who);
        return buffs.find(b => b.id === buffId);
    }


    public static addBuff(who: Unit, buff: DynamicBuff) {
        const state = DynamicBuffState.getInstance();

        const unitBuffs = state.buffsByUnit.get(who) || [];

        unitBuffs.push(buff);
        state.buffs.push(buff);
        state.buffsByUnit.set(who, unitBuffs);
    }
}