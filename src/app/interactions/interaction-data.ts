/** @noSelfInFile **/
import { InteractableData } from "./interactable";
import { InteractionModule } from "./interaction-module";
import { Log } from "../../lib/serilog/serilog";
import { ZONE_TYPE } from "../world/zone-id";
import { PlayNewSoundOnUnit, COLOUR, console } from "../../lib/translators";
import { COL_FLOOR_1, COL_FLOOR_2, COL_VENTS, COL_MISC } from "../../resources/colours";
import { Trigger } from "app/types/jass-overrides/trigger";
import { TECH_MAJOR_HEALTHCARE } from "resources/ability-ids";
import { STR_GENE_REQUIRES_HEALTHCARE } from "resources/strings";

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

    BlzSetUnitName(TEST_ELEVATOR_FLOOR_1.unit, `Elevator to ${COL_FLOOR_2}Floor 2|r|n${COL_MISC}Right Click To Use|r`);
    BlzSetUnitName(TEST_ELEVATOR_FLOOR_2.unit, `Elevator to ${COL_FLOOR_1}Floor 1|r|n${COL_MISC}Right Click To Use|r`);

    elevatorMap.set(GetHandleId(TEST_ELEVATOR_FLOOR_1.unit), TEST_ELEVATOR_FLOOR_1);
    elevatorMap.set(GetHandleId(TEST_ELEVATOR_FLOOR_2.unit), TEST_ELEVATOR_FLOOR_2);

    const ELEVATOR_TYPE = FourCC('n001');
    const elevatorTest: InteractableData = {
        unitType: ELEVATOR_TYPE,
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
    Interactables.set(ELEVATOR_TYPE, elevatorTest);
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

    BlzSetUnitName(HATCH_FLOOR_1.unit, `To ${COL_VENTS}Service Tunnels|r|n${COL_MISC}Right Click To Use|r`);
    BlzSetUnitName(VENT_EXIT_FLOOR_1.unit, `Hatch to ${COL_FLOOR_1}Floor 1|r|n${COL_MISC}Right Click To Use|r`);

    hatchMap.set(GetHandleId(HATCH_FLOOR_1.unit), HATCH_FLOOR_1);
    hatchMap.set(GetHandleId(VENT_EXIT_FLOOR_1.unit), VENT_EXIT_FLOOR_1);
    
    const HATCH_TYPE = FourCC('n002');
    const hatcInteractable: InteractableData = {
        unitType: HATCH_TYPE,
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
    Interactables.set(HATCH_TYPE, hatcInteractable);
}

export const initWeaponsTerminals = () => {
    
    const WEAPONS_UPGRADE_TERMINAL = FourCC('nWEP');
    const MEDICAL_UPGRADE_TERMINAL = FourCC('nMED');
    const GENE_SPLICER_TERMINAL = FourCC('nGEN');

    const upgradeTerminalProcessing: InteractableData = {
        onStart: (iModule: InteractionModule, fromUnit: unit, targetUnit: unit) => {
        },
        onCancel: (iModule: InteractionModule, fromUnit: unit, targetUnit: unit) => {
        },
        action: (iModule: InteractionModule, fromUnit: unit, targetUnit: unit) => {
            const handleId = GetHandleId(targetUnit);    
            const uX = GetUnitX(targetUnit); 
            const uY = GetUnitY(targetUnit);

            const targetUType = GetUnitTypeId(targetUnit);
            let unitType;
            if (targetUType === WEAPONS_UPGRADE_TERMINAL) {
                unitType = FourCC('hWEP');
            }
            else if (targetUType === MEDICAL_UPGRADE_TERMINAL) {
                unitType = FourCC('hMED');
            }
            else if (targetUType === GENE_SPLICER_TERMINAL) {
                // If we haven't got HC 2
                // Don't do anything
                if (GetPlayerTechCount(GetOwningPlayer(fromUnit), TECH_MAJOR_HEALTHCARE, true) < 1) {
                    DisplayTextToPlayer(GetOwningPlayer(fromUnit), 0, 0, STR_GENE_REQUIRES_HEALTHCARE);
                    return false;
                }
                unitType = FourCC('hGEN');
            }
            else {
                unitType = FourCC('hWEP');
            }

            const nUnit = CreateUnit(GetOwningPlayer(fromUnit), unitType, uX, uY, bj_UNIT_FACING);
            SelectUnitForPlayerSingle(nUnit, GetOwningPlayer(fromUnit));

            const trackUnselectEvent = new Trigger();
            trackUnselectEvent.RegisterPlayerUnitEventSimple(GetOwningPlayer(fromUnit), EVENT_PLAYER_UNIT_DESELECTED);
            trackUnselectEvent.AddAction(() => {
                if (GetTriggerUnit() === nUnit) {
                    UnitApplyTimedLife(nUnit, FourCC('b001'), 3);
                    trackUnselectEvent.destroy();
                }
            })

            // Handle gene splicer interact
            if (targetUType === GENE_SPLICER_TERMINAL) {
                iModule.game.geneModule.addNewGeneInstance(fromUnit, nUnit);
            }
        }
    }
    Interactables.set(WEAPONS_UPGRADE_TERMINAL, upgradeTerminalProcessing);
    Interactables.set(MEDICAL_UPGRADE_TERMINAL, upgradeTerminalProcessing);
    Interactables.set(GENE_SPLICER_TERMINAL, upgradeTerminalProcessing);
}