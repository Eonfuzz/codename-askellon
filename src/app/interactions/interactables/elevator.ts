/** @noSelfInFile **/
import { InteractableData } from "./interactable-type";
import { Log } from "../../../lib/serilog/serilog";
import { ZONE_TYPE, ZONE_TYPE_TO_ZONE_NAME } from "../../world/zone-id";
import { PlayNewSoundOnUnit, COLOUR, console } from "../../../lib/translators";
import { TERMINAL_RELIGION, TERMINAL_REACTOR, TERMINAL_WEAPONS, TERMINAL_MEDICAL, TERMINAL_GENE, TERMINAL_VOID, BRIDGE_CAPTAINS_TERMINAL, TERMINAL_PURGE, WORM_ALIEN_FORM, ZERGLING_ALIEN_FORM, ROACH_ALIEN_FORM, TERMINAL_SECURITY } from "resources/unit-ids";
import { WorldEntity } from "app/world/world-entity";
// import { GeneEntity } from "app/shops/gene-entity";
import { Interactables } from "./interactables";
import { GeneEntity } from "app/shops/gene-entity";
import { EventEntity } from "app/events/event-entity";
import { EVENT_TYPE } from "app/events/event-enum";
import { Unit } from "w3ts/index";
import { COL_MISC } from "resources/colours";
import { PlayerState } from "app/force/player-type";
import { PlayerStateFactory } from "app/force/player-state-entity";

class Elevator {
    unit: Unit;
    to: Elevator | undefined;
    goes_to: ZONE_TYPE
    exit_offset: {
        x: number,
        y: number
    };

    constructor(u: Unit, zone: ZONE_TYPE, offset: {x: number, y: number}) {
        this.unit = u;
        this.goes_to = zone;
        this.exit_offset = offset;
    }
};

const elevatorMap = new Map<number, Elevator>();

declare const udg_elevator_entrances: unit[];
declare const udg_elevator_exits: unit[];
declare const udg_elevator_exit_zones: string[];

export function initElevators() {
    
    const elevators: Elevator[] = [];

    udg_elevator_entrances.forEach((entrance, i) => {
        const elevatorExitZone = WorldEntity.getInstance().getZoneByName(udg_elevator_exit_zones[i]);
        const elevatorExitZoneName = ZONE_TYPE_TO_ZONE_NAME.get(elevatorExitZone);

        const elevator = new Elevator(
            Unit.fromHandle(entrance),
            elevatorExitZone,
            {x: 0, y: -165 }
        );

        BlzSetUnitName(entrance, `To ${elevatorExitZoneName}|n${COL_MISC}Right Click To Use|r`);
        elevatorMap.set(GetHandleId(entrance), elevator);
        elevators.push(elevator);
    });

    elevators.forEach((elevator, i) => {
        const exit = udg_elevator_exits[i];
        elevator.to = elevatorMap.get(GetHandleId(exit));
        elevatorMap.set(elevator.unit.typeId, elevator);
    });

    const ELEVATOR_TYPE = FourCC('n001');
    const elevatorTest: InteractableData = {
        getInteractionTime: (fromUnit: Unit, targetUnit: Unit) => {
            return 2;
        },
        onStart: (fromUnit: Unit, targetUnit: Unit) => {
            const handleId = targetUnit.id;
            const targetElevator = elevatorMap.get(handleId);

            targetUnit.setAnimation(1);
            KillSoundWhenDone(PlayNewSoundOnUnit("Sounds\\ElevatorOpen.mp3", targetUnit, 15));

            if (targetElevator && targetElevator.to) {
                KillSoundWhenDone(PlayNewSoundOnUnit("Sounds\\ElevatorOpen.mp3", targetElevator.to.unit, 90));
                targetElevator.to.unit.setAnimation(1);
            }
        },
        onCancel: (fromUnit: Unit, targetUnit: Unit) => {
            const handleId = targetUnit.id;
            const targetElevator = elevatorMap.get(handleId);

            targetUnit.setAnimation(0);

            if (targetElevator && targetElevator.to) {
                targetElevator.to.unit.setAnimation(0);
            }
        },
        action: (fromUnit: Unit, targetUnit: Unit) => {
            const handleId = targetUnit.id;
            const targetElevator = elevatorMap.get(handleId);
            
            if (targetElevator && targetElevator.to) {
                fromUnit.x = targetElevator.to.unit.x + targetElevator.to.exit_offset.x;
                fromUnit.y = targetElevator.to.unit.y + targetElevator.to.exit_offset.y;
                // fromUnit.facing = bj_UNIT_FACING;
                BlzSetUnitFacingEx(fromUnit.handle, bj_UNIT_FACING);

                if (true) { //IsUnitSelected(fromUnit.handle, fromUnit.owner.handle)) {
                    PanCameraToTimedForPlayer(fromUnit.owner.handle, fromUnit.x, fromUnit.y, 0);
                }
                WorldEntity.getInstance().travel(fromUnit, targetElevator.goes_to);
            }
        }
    }
    Interactables.set(ELEVATOR_TYPE, elevatorTest);
}

declare const udg_hatch_entrances: unit[];
declare const udg_hatch_exits: unit[];
declare const udg_hatch_exit_zones: string[];

const hatchMap = new Map<number, Elevator>();
export function initHatches() {

    const hatches: Elevator[] = [];

    udg_hatch_entrances.forEach((entrance, i) => {
        const hatchExitZone = WorldEntity.getInstance().getZoneByName(udg_hatch_exit_zones[i]);
        const hatchExitZoneName = ZONE_TYPE_TO_ZONE_NAME.get(hatchExitZone);

        const elevator = new Elevator(
            Unit.fromHandle(entrance),
            hatchExitZone,
            {x: 0, y: 0 }
        );

        BlzSetUnitName(entrance, `To ${hatchExitZoneName}|n${COL_MISC}Right Click To Use|r`);
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
        getInteractionTime: (fromUnit: Unit, targetUnit: Unit) => {
            const type = fromUnit.typeId;

            if (type === WORM_ALIEN_FORM) return 1.5;
            if (type === ZERGLING_ALIEN_FORM) return 1.5;
            if (type === ROACH_ALIEN_FORM) return 1.5;
            if (PlayerStateFactory.isAlienAI(fromUnit.owner)) return 1.5;
            return 3;
        },
        onStart: (fromUnit: Unit, targetUnit: Unit) => {
            const handleId = targetUnit.id;    
            const targetElevator = hatchMap.get(handleId);

            targetUnit.setTimeScale(1.4);
            targetUnit.setAnimation(1);

            if (targetUnit.typeId === HATCH_TYPE) 
                KillSoundWhenDone(PlayNewSoundOnUnit("Sounds\\MetalHatch.mp33", targetUnit, 15));

            if (targetElevator && targetElevator.to) {
                targetElevator.to.unit.setTimeScale(1.4);
                if (targetElevator.to.unit.typeId === HATCH_TYPE) 
                    KillSoundWhenDone(PlayNewSoundOnUnit("Sounds\\MetalHatch.mp3", targetElevator.to.unit, 15));
                targetElevator.to.unit.setAnimation(1);
            }
        },
        onCancel: (fromUnit: Unit, targetUnit: Unit) => {
            const handleId = targetUnit.id;    
            const targetElevator = hatchMap.get(handleId);

            targetUnit.setAnimation(2);

            if (targetElevator && targetElevator.to) {
                targetElevator.to.unit.setAnimation(2);
            }
        },
        action: (fromUnit: Unit, targetUnit: Unit) => {
            const handleId = targetUnit.id;
            const targetElevator = hatchMap.get(handleId);
            
            if (targetElevator && targetElevator.to) {
                fromUnit.x = targetElevator.to.unit.x + targetElevator.to.exit_offset.x;
                fromUnit.y = targetElevator.to.unit.y + targetElevator.to.exit_offset.y;

                if (IsUnitSelected(fromUnit.handle, fromUnit.owner.handle)) {
                    PanCameraToTimedForPlayer(fromUnit.owner.handle, fromUnit.x, fromUnit.y, 0);
                }
                WorldEntity.getInstance().travel(fromUnit, targetElevator.goes_to);
            }
        }
    }
    Interactables.set(HATCH_TYPE, hatchInteractable);
    Interactables.set(LADDER_TYPE, hatchInteractable);
}

export const initWeaponsTerminals = () => {
    
    let i = 0;

    const upgradeTerminalProcessing: InteractableData = {
        onStart: (fromUnit: Unit, targetUnit: Unit) => {
            // Log.Information("Using terminal");
        },
        onCancel: (fromUnit: Unit, targetUnit: Unit) => {
        },
        action: (fromUnit: Unit, targetUnit: Unit) => {
            EventEntity.send(EVENT_TYPE.INTERACT_TERMINAL, { source: fromUnit, data: { target: targetUnit }});
        }
    }
    Interactables.set(TERMINAL_WEAPONS, upgradeTerminalProcessing);
    Interactables.set(TERMINAL_MEDICAL, upgradeTerminalProcessing);
    Interactables.set(TERMINAL_GENE, upgradeTerminalProcessing);
    Interactables.set(TERMINAL_VOID, upgradeTerminalProcessing);
    Interactables.set(TERMINAL_RELIGION, upgradeTerminalProcessing);
    Interactables.set(TERMINAL_REACTOR, upgradeTerminalProcessing);
    Interactables.set(BRIDGE_CAPTAINS_TERMINAL, upgradeTerminalProcessing);
    Interactables.set(TERMINAL_PURGE, upgradeTerminalProcessing);
    Interactables.set(TERMINAL_SECURITY, upgradeTerminalProcessing);
}