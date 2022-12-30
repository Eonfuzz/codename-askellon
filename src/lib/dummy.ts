import { ABIL_MECH_CRITTER } from "resources/ability-ids";

let dummyUnit;

export function GetDummyUnit() {
    if (!dummyUnit) {
        // Create a dummy unit for all abilities
        dummyUnit = CreateUnit(Player(25), FourCC('dumy'), 0, 0, bj_UNIT_FACING);
        ShowUnit(dummyUnit, false);
    }
    return dummyUnit; 
}

/**
 * passes the dummy unit as a parameter to the callback
 * ensure you remove any abilities afterwards
 * @param callback 
 */
export function DummyCast(callback: (dummy: unit) => void, abilityToCast: number) {
    { // DO
        const dummyUnit = GetDummyUnit();
        UnitAddAbility(dummyUnit, abilityToCast);
        ShowUnit(dummyUnit, true);
        callback(dummyUnit);
        ShowUnit(dummyUnit, false);
    } // END
}

