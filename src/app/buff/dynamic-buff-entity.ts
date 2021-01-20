import { Unit } from "w3ts/index";
import { BUFF_ID } from "resources/buff-ids";
import { Log } from "lib/serilog/serilog";
import { Entity } from "app/entity-type";
import { DynamicBuff } from "./dynamic-buff-type";
import { BuffInstance } from "./buff-instance-type";
import { GameTimeElapsed } from "app/types/game-time-elapsed";

import { flashFreeze } from "./buffs/flash-freeze";
import { Trifex } from "./buffs/trifex";
import { Despair } from "./buffs/despair";
import { Resolve } from "./buffs/resolve";
import { PuritySeal } from "./buffs/purity-seal";
import { onFire } from "./buffs/fire";
import { DynamicBuffState } from "./dynamic-buff-state";
import { Hooks } from "lib/Hooks";
import { VoidSickness } from "./buffs/void-sickness";
import { Madness } from "./buffs/madness";
import { EventEntity } from "app/events/event-entity";
import { EVENT_TYPE } from "app/events/event-enum";
import { ComebackDrugBuff } from "./buffs/drug-comeback";

export class DynamicBuffEntity extends Entity {

    private static instance: DynamicBuffEntity;

    public static getInstance() {        
        if (this.instance == null) {
            this.instance = new DynamicBuffEntity();
            Hooks.set(this.name, this.instance);
        }
        return this.instance;
    }

    constructor() {
        super();

        EventEntity.listen(EVENT_TYPE.ADD_BUFF_INSTANCE, (self, data) => {
            const id = data.data.buffId;
            const instance = data.data.instance;
            const target = data.data.target;

            this.addBuff(id, target, instance);
        });
    }

    addBuff(buffId: BUFF_ID, who: Unit, instance: BuffInstance, isNegativeInstance?: boolean) {
        try {
            let matchingBuff = DynamicBuffState.unitHasBuff(buffId, who);

            if (!matchingBuff) {
                matchingBuff = this.newDynamicBuffFor(buffId, who);
                DynamicBuffState.addBuff(who, matchingBuff);
            }

            matchingBuff.addInstance(who, instance, isNegativeInstance);
            return matchingBuff;
        }
        catch (e) {
            Log.Error("Error Adding Buff");
            Log.Error(e);
        }
    }

    newDynamicBuffFor(id: BUFF_ID, who: Unit) {
        if (id === BUFF_ID.FIRE) return new onFire();
        if (id === BUFF_ID.FLASH_FREEZE) return new flashFreeze();
        if (id === BUFF_ID.TRIFEX) return new Trifex();
        if (id === BUFF_ID.DESPAIR) return new Despair(who);
        if (id === BUFF_ID.RESOLVE) return new Resolve(who);
        if (id === BUFF_ID.PURITY_SEAL) return new PuritySeal();
        if (id === BUFF_ID.VOID_SICKNESS) return new VoidSickness();
        if (id === BUFF_ID.MADNESS) return new Madness(who);
        if (id === BUFF_ID.DRUG_COMEBACK) return new ComebackDrugBuff();
        Log.Error("Creating new buff no instance for ID "+id);
    }

    step() {
        const timestamp = GameTimeElapsed.getTime();

        const buffState = DynamicBuffState.getInstance();

        let i = 0;
        while (i < buffState.buffs.length) {
            const buff = buffState.buffs[i];
            const isActive = buff.process(timestamp, this._timerDelay);

            // If we aren't active we need to do stuff
            const iC = buff.getInstanceCount() + buff.getNegativeinstanceCount();
            if (!isActive && iC <= 0) {
                // Log.Information("destorying buff "+buff.id+" for unit!");
                const buffsForUnit = buffState.buffsByUnit.get(buff.who);
                const idx = buffsForUnit.indexOf(buff);

                if (idx >= 0) {
                    buffsForUnit.splice(idx, 1);
                    if (buffsForUnit.length === 0) buffState.buffsByUnit.delete(buff.who);
                }
                else {
                    Log.Error("Deleting unit buff from unit buff cache but no unit entry");
                }

                // delete and loop again
                buffState.buffs[i] = buffState.buffs[buffState.buffs.length-1];
                delete buffState.buffs[buffState.buffs.length - 1];
            }
            else {
                i++;
            }
        }
    }

    public static add(buffId: BUFF_ID, who: Unit, instance: BuffInstance, isNegativeInstance: boolean = false) {
        const entity = this.getInstance();
        return entity.addBuff(buffId, who, instance, isNegativeInstance);
    }
}