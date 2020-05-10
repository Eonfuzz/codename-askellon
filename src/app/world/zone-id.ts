import { COL_VENTS, COL_CARGO_A, COL_FLOOR_1, COL_GOLD } from "resources/colours";

/** @noSelfInFile **/
export enum ZONE_TYPE {
    FLOOR_1='FLOOR_1',
    FLOOR_2='FLOOR_2',
    FLOOR_3='FLOOR_3',

    BRIDGE='BRIDGE',
    CHURCH='CHURCH',

    CARGO_A='CARGO_A',
    CARGO_A_VENT='CARGO_A_VENT',

    SERVICE_TUNNELS='SERVICE_TUNNELS'
}

export const STRING_TO_ZONE_TYPE = new Map<string, ZONE_TYPE>();
STRING_TO_ZONE_TYPE.set('FLOOR_1', ZONE_TYPE.FLOOR_1);
STRING_TO_ZONE_TYPE.set('FLOOR_2', ZONE_TYPE.FLOOR_2);
STRING_TO_ZONE_TYPE.set('FLOOR_3', ZONE_TYPE.FLOOR_3);
STRING_TO_ZONE_TYPE.set('CHURCH', ZONE_TYPE.CHURCH);
STRING_TO_ZONE_TYPE.set('CARGO_A', ZONE_TYPE.CARGO_A);
STRING_TO_ZONE_TYPE.set('BRIDGE', ZONE_TYPE.BRIDGE);
STRING_TO_ZONE_TYPE.set('CARGO_A_VENT', ZONE_TYPE.CARGO_A_VENT);
STRING_TO_ZONE_TYPE.set('SERVICE_TUNNELS', ZONE_TYPE.SERVICE_TUNNELS);

export const ZONE_TYPE_TO_ZONE_NAME = new Map<ZONE_TYPE, string>();
ZONE_TYPE_TO_ZONE_NAME.set(ZONE_TYPE.FLOOR_1, `${COL_FLOOR_1}Floor 1|r - Recreation`);
ZONE_TYPE_TO_ZONE_NAME.set(ZONE_TYPE.CHURCH, `${COL_GOLD}Cathederal|r`);
ZONE_TYPE_TO_ZONE_NAME.set(ZONE_TYPE.SERVICE_TUNNELS, `${COL_VENTS}Service Tunnels|r`);
ZONE_TYPE_TO_ZONE_NAME.set(ZONE_TYPE.BRIDGE, `${COL_CARGO_A}Bridge|r`);
ZONE_TYPE_TO_ZONE_NAME.set(ZONE_TYPE.CARGO_A, `${COL_CARGO_A}Cargo|r`);
ZONE_TYPE_TO_ZONE_NAME.set(ZONE_TYPE.CARGO_A_VENT, `${COL_VENTS}Cargo Vents|r`);
