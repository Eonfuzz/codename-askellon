import { Entity } from "app/entity-type";
import { Timers } from "app/timer-type";
import { ABIL_MECH_CRITTER } from "resources/ability-ids";
import { BUFF_ID_VOID_SICKNESS } from "resources/buff-ids";
import { Timer, Trigger, Unit } from "w3ts";
import { Hooks } from "./Hooks";
import { Log } from "./serilog/serilog";

let dummyUnit;

export function GetDummyUnit() {
    if (!dummyUnit) {
        // Create a dummy unit for all abilities
        dummyUnit = CreateUnit(Player(25), FourCC('dumy'), 0, 0, bj_UNIT_FACING);
        ShowUnit(dummyUnit, false);

        const t = new Trigger();
        t.registerUnitEvent(Unit.fromHandle(dummyUnit), EVENT_UNIT_SPELL_FINISH);
        t.addAction(() => {
            UnitRemoveAbility(GetTriggerUnit(), GetSpellAbilityId());
            // Log.Information("Remove spell for unit");
        });
    }
    return dummyUnit; 
}

/**
 * passes the dummy unit as a parameter to the callback
 * ensure you remove any abilities afterwards
 * @param callback 
 */
export function DummyCast(callback: (dummy: unit) => void, abilityToCast: number, isChannelledAbility: boolean = false) {
    { // DO
        const dummyUnit = isChannelledAbility ? CreateUnit(Player(25), FourCC('dumy'), 0, 0, bj_UNIT_FACING) : GetDummyUnit();
        UnitAddAbility(dummyUnit, abilityToCast);
        ShowUnit(dummyUnit, true);
        callback(dummyUnit);
        ShowUnit(dummyUnit, false);
        if (isChannelledAbility) {
            UnitApplyTimedLife(dummyUnit, BUFF_ID_VOID_SICKNESS, 10);
        }
        // // Timers.addTimedAction(10, () => UnitRemoveAbility(dummyUnit, abilityToCast));
        // UnitRemoveAbility(dummyUnit, abilityToCast);
    } // END
}

