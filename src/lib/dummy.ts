
/**
 * passes the dummy unit as a parameter to the callback
 * ensure you remove any abilities afterwards
 * @param callback 
 */
export function DummyCast(callback: (dummy: unit) => void, abilityToCast: number) {
    { // DO
        // Create a dummy unit for all abilities
        const dummyUnit = CreateUnit(Player(25), FourCC('dumy'), 0, 0, bj_UNIT_FACING);
        ShowUnit(dummyUnit, false);
        UnitAddAbility(dummyUnit, abilityToCast);
        callback(dummyUnit);

        UnitApplyTimedLife(dummyUnit, 0, 3);
    } // END
}