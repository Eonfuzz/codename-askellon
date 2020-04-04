/** @noSelfInFile **/
import { InteractableData } from "./interactable";
import { InteractionModule } from "./interaction-module";
import { Log } from "../../lib/serilog/serilog";
import { ZONE_TYPE } from "../world/zone-id";
import { PlayNewSoundOnUnit, COLOUR, console } from "../../lib/translators";
import { COL_FLOOR_1, COL_FLOOR_2, COL_VENTS, COL_MISC } from "../../resources/colours";
import { Trigger, MapPlayer, Unit } from "w3ts";
import { TECH_MAJOR_HEALTHCARE } from "resources/ability-ids";
import { STR_GENE_REQUIRES_HEALTHCARE } from "resources/strings";
import { Game } from "app/game";

export let Interactables = new Map<number, InteractableData>();


class Elevator {
    unit: Unit;
    to: Elevator | undefined;
    inside_zone: ZONE_TYPE
    exit_offset: {
        x: number,
        y: number
    };

    constructor(u: Unit, zone: ZONE_TYPE, offset: {x: number, y: number}) {
        this.unit = u;
        this.inside_zone = zone;
        this.exit_offset = offset;
    }
};

const elevatorMap = new Map<number, Elevator>();

export function initElevators() {
    const TEST_ELEVATOR_FLOOR_1 = new Elevator(
        Unit.fromHandle(gg_unit_n001_0032),
        ZONE_TYPE.FLOOR_1,
        {x: 0, y: -180 }
    );
    const TEST_ELEVATOR_FLOOR_2 = new Elevator(
        Unit.fromHandle(gg_unit_n001_0021),
        ZONE_TYPE.FLOOR_2,
        {x: 0, y: -180 }
    );
    
    TEST_ELEVATOR_FLOOR_1.to = TEST_ELEVATOR_FLOOR_2;
    TEST_ELEVATOR_FLOOR_2.to = TEST_ELEVATOR_FLOOR_1;

    TEST_ELEVATOR_FLOOR_1.unit.name = `Elevator to ${COL_FLOOR_2}Floor 2|r|n${COL_MISC}Right Click To Use|r`;
    TEST_ELEVATOR_FLOOR_2.unit.name = `Elevator to ${COL_FLOOR_1}Floor 1|r|n${COL_MISC}Right Click To Use|r`;

    elevatorMap.set(TEST_ELEVATOR_FLOOR_1.unit.typeId, TEST_ELEVATOR_FLOOR_1);
    elevatorMap.set(TEST_ELEVATOR_FLOOR_2.unit.typeId, TEST_ELEVATOR_FLOOR_2);

    const ELEVATOR_TYPE = FourCC('n001');
    const elevatorTest: InteractableData = {
        unitType: ELEVATOR_TYPE,
        onStart: (iModule: InteractionModule, fromUnit: Unit, targetUnit: Unit) => {
            const handleId = targetUnit.id;
            const targetElevator = elevatorMap.get(handleId);

            targetUnit.setAnimation(1);
            KillSoundWhenDone(PlayNewSoundOnUnit("Sounds\\ElevatorOpen.mp3", targetUnit, 90));

            if (targetElevator && targetElevator.to) {
                KillSoundWhenDone(PlayNewSoundOnUnit("Sounds\\ElevatorOpen.mp3", targetElevator.to.unit, 90));
                targetElevator.to.unit.setAnimation(1);
            }
        },
        onCancel: (iModule: InteractionModule, fromUnit: Unit, targetUnit: Unit) => {
            const handleId = targetUnit.id;
            const targetElevator = elevatorMap.get(handleId);

            targetUnit.setAnimation(0);

            if (targetElevator && targetElevator.to) {
                targetElevator.to.unit.setAnimation(0);
            }
        },
        action: (iModule: InteractionModule, fromUnit: Unit, targetUnit: Unit) => {
            const handleId = targetUnit.id;
            const targetElevator = elevatorMap.get(handleId);
            
            if (targetElevator && targetElevator.to) {

                fromUnit.x = targetElevator.to.unit.x + targetElevator.to.exit_offset.x;
                fromUnit.y = targetElevator.to.unit.y + targetElevator.to.exit_offset.y;

                if (IsUnitSelected(fromUnit.handle, fromUnit.owner.handle)) {
                    PanCameraToTimedForPlayer(fromUnit.owner.handle, fromUnit.x, fromUnit.y, 0);
                }
                iModule.game.worldModule.travel(fromUnit, targetElevator.to.inside_zone);
            }
        }
    }
    Interactables.set(ELEVATOR_TYPE, elevatorTest);
}

declare const udg_hatch_entrances: unit[];
declare const udg_hatch_exits: unit[];
declare const udg_hatch_entrance_names: string[];
declare const udg_hatch_exit_zones: string[];

const hatchMap = new Map<number, Elevator>();
export function initHatches(game: Game) {

    const hatches: Elevator[] = [];

    udg_hatch_entrances.forEach((entrance, i) => {
        const entranceName = udg_hatch_entrance_names[i];
        const hatchExitZone = game.worldModule.getZoneByName(udg_hatch_exit_zones[i]);

        const elevator = new Elevator(
            Unit.fromHandle(entrance),
            hatchExitZone,
            {x: 0, y: 0 }
        );

        BlzSetUnitName(entrance, `To ${entranceName}|n${COL_MISC}Right Click To Use|r`);
        hatchMap.set(GetHandleId(entrance), elevator);
        hatches.push(elevator);
    });

    hatches.forEach((hatch, i) => {
        const exit = udg_hatch_exits[i];
        hatch.to = hatchMap.get(GetHandleId(exit));
        hatchMap.set(hatch.unit.typeId, hatch);
    });
    const HATCH_TYPE = FourCC('n002');
    const LADDER_TYPE = FourCC('n004');
    const hatchInteractable: InteractableData = {
        unitType: HATCH_TYPE,
        onStart: (iModule: InteractionModule, fromUnit: Unit, targetUnit: Unit) => {
            const handleId = targetUnit.id;    
            const targetElevator = hatchMap.get(handleId);

            targetUnit.setTimeScale(1.4);
            targetUnit.setAnimation(1);

            if (targetUnit.typeId === HATCH_TYPE) 
                KillSoundWhenDone(PlayNewSoundOnUnit("Sounds\\MetalHatch.mp33", targetUnit, 40));

            if (targetElevator && targetElevator.to) {
                targetElevator.to.unit.setTimeScale(1.4);
                if (targetElevator.to.unit.typeId === HATCH_TYPE) 
                    KillSoundWhenDone(PlayNewSoundOnUnit("Sounds\\MetalHatch.mp3", targetElevator.to.unit, 40));
                targetElevator.to.unit.setAnimation(1);
            }
        },
        onCancel: (iModule: InteractionModule, fromUnit: Unit, targetUnit: Unit) => {
            const handleId = targetUnit.id;    
            const targetElevator = hatchMap.get(handleId);

            targetUnit.setAnimation(2);

            if (targetElevator && targetElevator.to) {
                targetElevator.to.unit.setAnimation(2);
            }
        },
        action: (iModule: InteractionModule, fromUnit: Unit, targetUnit: Unit) => {
            const handleId = targetUnit.id;
            const targetElevator = hatchMap.get(handleId);
            
            if (targetElevator && targetElevator.to) {
                fromUnit.x = targetElevator.to.unit.x + targetElevator.to.exit_offset.x;
                fromUnit.y = targetElevator.to.unit.y + targetElevator.to.exit_offset.y;

                if (IsUnitSelected(fromUnit.handle, fromUnit.owner.handle)) {
                    PanCameraToTimedForPlayer(fromUnit.owner.handle, fromUnit.x, fromUnit.y, 0);
                }
                iModule.game.worldModule.travel(fromUnit, targetElevator.to.inside_zone);
            }
        }
    }
    Interactables.set(HATCH_TYPE, hatchInteractable);
    Interactables.set(LADDER_TYPE, hatchInteractable);
}

export const initWeaponsTerminals = () => {
    
    const WEAPONS_UPGRADE_TERMINAL = FourCC('nWEP');
    const MEDICAL_UPGRADE_TERMINAL = FourCC('nMED');
    const GENE_SPLICER_TERMINAL = FourCC('nGEN');

    const upgradeTerminalProcessing: InteractableData = {
        onStart: (iModule: InteractionModule, fromUnit: Unit, targetUnit: Unit) => {
            Log.Information("Using terminal");
        },
        onCancel: (iModule: InteractionModule, fromUnit: Unit, targetUnit: Unit) => {
        },
        action: (iModule: InteractionModule, fromUnit: Unit, targetUnit: Unit) => {
            const handleId = targetUnit.id;
            const uX = targetUnit.x; 
            const uY = targetUnit.y;
            const player = fromUnit.owner;

            const targetUType = targetUnit.typeId;
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
                if (GetPlayerTechCount(player.handle, TECH_MAJOR_HEALTHCARE, true) < 1) {
                    DisplayTextToPlayer(player.handle, 0, 0, STR_GENE_REQUIRES_HEALTHCARE);
                    return false;
                }
                unitType = FourCC('hGEN');
            }
            else {
                unitType = FourCC('hWEP');
            }

            const nUnit = CreateUnit(player.handle, unitType, uX, uY, bj_UNIT_FACING);
            SelectUnitForPlayerSingle(nUnit, player.handle);

            const trackUnselectEvent = new Trigger();
            trackUnselectEvent.registerPlayerUnitEvent(player, EVENT_PLAYER_UNIT_DESELECTED, Condition(() => GetTriggerUnit() === nUnit));
            trackUnselectEvent.addAction(() => {
                UnitApplyTimedLife(nUnit, FourCC('b001'), 3);
                trackUnselectEvent.destroy();
            })

            // Handle gene splicer interact
            if (targetUType === GENE_SPLICER_TERMINAL) {
                iModule.game.geneModule.addNewGeneInstance(fromUnit, Unit.fromHandle(nUnit));
            }
        }
    }
    Interactables.set(WEAPONS_UPGRADE_TERMINAL, upgradeTerminalProcessing);
    Interactables.set(MEDICAL_UPGRADE_TERMINAL, upgradeTerminalProcessing);
    Interactables.set(GENE_SPLICER_TERMINAL, upgradeTerminalProcessing);
}