/** @noSelfInFile **/
import { InteractableData } from "./interactable";
import { InteractionModule } from "./interaction-module";
import { Log } from "../../lib/serilog/serilog";
import { ZONE_TYPE } from "../world/zone-id";
import { PlayNewSoundOnUnit, COLOUR } from "../../lib/translators";
import { COL_FLOOR_1, COL_FLOOR_2, COL_VENTS } from "../../resources/colours";

export let Interactables = new Map<number, InteractableData>();


class Elevator {
    unit: unit;
    to: Elevator | undefined;
    inside_zone: ZONE_TYPE
    exit_offset: {
        x: number,
        y: number
    };

    constructor(u: unit, zone: ZONE_TYPE, offset: {x: number, y: number}) {
        this.unit = u;
        this.inside_zone = zone;
        this.exit_offset = offset;
    }
};

const elevatorMap = new Map<number, Elevator>();

export function initElevators() {
    const TEST_ELEVATOR_FLOOR_1 = new Elevator(
        gg_unit_n001_0032,
        ZONE_TYPE.FLOOR_1,
        {x: 0, y: -180 }
    );
    const TEST_ELEVATOR_FLOOR_2 = new Elevator(
        gg_unit_n001_0021,
        ZONE_TYPE.FLOOR_2,
        {x: 0, y: -180 }
    );
    
    TEST_ELEVATOR_FLOOR_1.to = TEST_ELEVATOR_FLOOR_2;
    TEST_ELEVATOR_FLOOR_2.to = TEST_ELEVATOR_FLOOR_1;

    BlzSetUnitName(TEST_ELEVATOR_FLOOR_1.unit, `Elevator to ${COL_FLOOR_2}Floor 2|r`);
    BlzSetUnitName(TEST_ELEVATOR_FLOOR_2.unit, `Elevator to ${COL_FLOOR_1}Floor 1|r`);

    elevatorMap.set(GetHandleId(TEST_ELEVATOR_FLOOR_1.unit), TEST_ELEVATOR_FLOOR_1);
    elevatorMap.set(GetHandleId(TEST_ELEVATOR_FLOOR_2.unit), TEST_ELEVATOR_FLOOR_2);

    const elevatorTest: InteractableData = {
        unitType: FourCC('n001'),
        onStart: (iModule: InteractionModule, fromUnit: unit, targetUnit: unit) => {
            const handleId = GetHandleId(targetUnit);    
            const targetElevator = elevatorMap.get(handleId);

            SetUnitAnimationByIndex(targetUnit, 1);
            KillSoundWhenDone(PlayNewSoundOnUnit("Sounds\\ElevatorOpen.mp3", targetUnit, 90));

            if (targetElevator && targetElevator.to) {
                KillSoundWhenDone(PlayNewSoundOnUnit("Sounds\\ElevatorOpen.mp3", targetElevator.to.unit, 90));
                SetUnitAnimationByIndex(targetElevator.to.unit, 1);
            }
        },
        onCancel: (iModule: InteractionModule, fromUnit: unit, targetUnit: unit) => {
            const handleId = GetHandleId(targetUnit);    
            const targetElevator = elevatorMap.get(handleId);

            SetUnitAnimationByIndex(targetUnit, 0);

            if (targetElevator && targetElevator.to) {
                SetUnitAnimationByIndex(targetElevator.to.unit, 0);
            }
        },
        action: (iModule: InteractionModule, fromUnit: unit, targetUnit: unit) => {
            const handleId = GetHandleId(targetUnit);    
            const targetElevator = elevatorMap.get(handleId);
            
            if (targetElevator && targetElevator.to) {

                SetUnitX(fromUnit, GetUnitX(targetElevator.to.unit) + targetElevator.to.exit_offset.x);
                SetUnitY(fromUnit, GetUnitY(targetElevator.to.unit) + targetElevator.to.exit_offset.y);

                if (IsUnitSelected(fromUnit, GetOwningPlayer(fromUnit))) {
                    PanCameraToTimedForPlayer(GetOwningPlayer(fromUnit), GetUnitX(fromUnit), GetUnitY(fromUnit), 0);
                }
                iModule.game.worldModule.travel(fromUnit, targetElevator.to.inside_zone);
            }
        }
    }
    Interactables.set(elevatorTest.unitType, elevatorTest);
}

const hatchMap = new Map<number, Elevator>();
export function initHatches() {
    const HATCH_FLOOR_1 = new Elevator(
        gg_unit_n002_0033,
        ZONE_TYPE.FLOOR_1,
        {x: 0, y: 0 }
    );
    const VENT_EXIT_FLOOR_1 = new Elevator(
        gg_unit_n002_0034,
        ZONE_TYPE.VENTRATION,
        {x: 0, y: 0 }
    );
    
    HATCH_FLOOR_1.to = VENT_EXIT_FLOOR_1;
    VENT_EXIT_FLOOR_1.to = HATCH_FLOOR_1;

    BlzSetUnitName(HATCH_FLOOR_1.unit, `To ${COL_VENTS}Service Tunnels|r`);
    BlzSetUnitName(VENT_EXIT_FLOOR_1.unit, `Hatch to ${COL_FLOOR_1}Floor 1|r`);

    hatchMap.set(GetHandleId(HATCH_FLOOR_1.unit), HATCH_FLOOR_1);
    hatchMap.set(GetHandleId(VENT_EXIT_FLOOR_1.unit), VENT_EXIT_FLOOR_1);
    
    const hatcInteractable: InteractableData = {
        unitType: FourCC('n002'),
        onStart: (iModule: InteractionModule, fromUnit: unit, targetUnit: unit) => {
            const handleId = GetHandleId(targetUnit);    
            const targetElevator = hatchMap.get(handleId);

            SetUnitTimeScale(targetUnit, 1.4);
            SetUnitAnimationByIndex(targetUnit, 1);
            KillSoundWhenDone(PlayNewSoundOnUnit("Sounds\\MetalHatch.mp33", targetUnit, 40));

            if (targetElevator && targetElevator.to) {
                SetUnitTimeScale(targetElevator.to.unit, 1.4);
                PlayNewSoundOnUnit("Sounds\\MetalHatch.mp3", targetElevator.to.unit, 40);
                SetUnitAnimationByIndex(targetElevator.to.unit, 1);
            }
        },
        onCancel: (iModule: InteractionModule, fromUnit: unit, targetUnit: unit) => {
            const handleId = GetHandleId(targetUnit);    
            const targetElevator = hatchMap.get(handleId);

            SetUnitAnimationByIndex(targetUnit, 2);

            if (targetElevator && targetElevator.to) {
                SetUnitAnimationByIndex(targetElevator.to.unit, 2);
            }
        },
        action: (iModule: InteractionModule, fromUnit: unit, targetUnit: unit) => {
            const handleId = GetHandleId(targetUnit);    
            const targetElevator = hatchMap.get(handleId);
            
            if (targetElevator && targetElevator.to) {

                SetUnitX(fromUnit, GetUnitX(targetElevator.to.unit) + targetElevator.exit_offset.x);
                SetUnitY(fromUnit, GetUnitY(targetElevator.to.unit) + targetElevator.exit_offset.y);

                if (IsUnitSelected(fromUnit, GetOwningPlayer(fromUnit))) {
                    PanCameraToTimedForPlayer(GetOwningPlayer(fromUnit), GetUnitX(fromUnit), GetUnitY(fromUnit), 0);
                }
                iModule.game.worldModule.travel(fromUnit, targetElevator.to.inside_zone);
            }
        }
    }
    Interactables.set(hatcInteractable.unitType, hatcInteractable);
}