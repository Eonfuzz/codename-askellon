/** @noSelfInFile **/
import { InteractableData } from "./interactable";
import { InteractionModule } from "./interaction-module";
import { Log } from "../../lib/serilog/serilog";
import { ZONE_TYPE } from "../world/zone-id";
import { PlayNewSoundOnUnit } from "../../lib/translators";

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
        gg_unit_n001_0021,
        ZONE_TYPE.FLOOR_1,
        {x: 0, y: -180 }
    );
    const TEST_ELEVATOR_FLOOR_2 = new Elevator(
        gg_unit_n001_0032,
        ZONE_TYPE.FLOOR_2,
        {x: 0, y: -180 }
    );
    
    TEST_ELEVATOR_FLOOR_1.to = TEST_ELEVATOR_FLOOR_2;
    TEST_ELEVATOR_FLOOR_2.to = TEST_ELEVATOR_FLOOR_1;
    
    elevatorMap.set(GetHandleId(TEST_ELEVATOR_FLOOR_1.unit), TEST_ELEVATOR_FLOOR_1);
    elevatorMap.set(GetHandleId(TEST_ELEVATOR_FLOOR_2.unit), TEST_ELEVATOR_FLOOR_2);

    const elevatorTest: InteractableData = {
        unitType: FourCC('n001'),
        onStart: (iModule: InteractionModule, fromUnit: unit, targetUnit: unit) => {
            const handleId = GetHandleId(targetUnit);    
            const targetElevator = elevatorMap.get(handleId);

            SetUnitAnimationByIndex(targetUnit, 1);
            PlayNewSoundOnUnit("Sounds\\ElevatorOpen.mp3", targetUnit, 90);

            if (targetElevator && targetElevator.to) {
                PlayNewSoundOnUnit("Sounds\\ElevatorOpen.mp3", targetElevator.to.unit, 90);
                SetUnitAnimationByIndex(targetElevator.to.unit, 1);
            }
        },
        onCancel: (iModule: InteractionModule, fromUnit: unit, targetUnit: unit) => {
            const handleId = GetHandleId(targetUnit);    
            const targetElevator = elevatorMap.get(handleId);

            SetUnitAnimationByIndex(targetUnit, 2);

            if (targetElevator && targetElevator.to) {
                SetUnitAnimationByIndex(targetElevator.to.unit, 2);
            }
        },
        action: (iModule: InteractionModule, fromUnit: unit, targetUnit: unit) => {
            const handleId = GetHandleId(targetUnit);    
            const targetElevator = elevatorMap.get(handleId);
            
            if (targetElevator && targetElevator.to) {

                iModule.game.worldModule.travel(fromUnit, targetElevator.inside_zone);
                SetUnitX(fromUnit, GetUnitX(targetElevator.to.unit) + targetElevator.exit_offset.x);
                SetUnitY(fromUnit, GetUnitY(targetElevator.to.unit) + targetElevator.exit_offset.y);

                if (IsUnitSelected(fromUnit, GetOwningPlayer(fromUnit))) {
                    PanCameraToForPlayer(GetOwningPlayer(fromUnit), GetUnitX(fromUnit), GetUnitY(fromUnit));
                }
            }
        }
    }
    Interactables.set(elevatorTest.unitType, elevatorTest);
}
