import { Unit } from "w3ts";
import { UnitDex, UnitDexEvent } from "app/events/unit-indexer";
import { Interactables } from "./interactables";
import { InteractableData } from "./interactable-type";
import { MessagePlayer } from "lib/utils";
import { COL_MISC } from "resources/colours";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { TERMINAL_PLACEABLE_TURRET } from "resources/unit-ids";
import { ITEM_PLACEABLE_TURRET} from "resources/item-ids"

export const intPlaceableTurretInteraction = () => {
    
    let i = 0;1
    let turretOwner = [];

    const upgradeTerminalProcessing: InteractableData = {
        onStart: (fromUnit: Unit, targetUnit: Unit) => {
            // Log.Information("Using terminal");
        },
        onCancel: (fromUnit: Unit, targetUnit: Unit) => {
        },
        action: (fromUnit: Unit, targetUnit: Unit) => {
            if (BlzGetUnitMaxHP(targetUnit.handle)*.99 <= GetWidgetLife(targetUnit.handle)) {
                if (turretOwner[targetUnit.id] == GetOwningPlayer(fromUnit.handle)){
                    RemoveUnit(targetUnit.handle);
                    let itemMade = CreateItem(ITEM_PLACEABLE_TURRET,GetUnitX(fromUnit.handle),GetUnitY(fromUnit.handle));
                    SetItemCharges(itemMade,1);
                    UnitAddItem(fromUnit.handle, itemMade);
                }
                else {
                    MessagePlayer(fromUnit.owner, `${COL_MISC}This turret is encrypted and you don't have access.|r`);
                }
            }
            else {
                MessagePlayer(fromUnit.owner, `${COL_MISC}This turret is too damaged or has not finished upacking, to be packed up.|r`);
            }
        }
    }
    
    UnitDex.registerEvent(UnitDexEvent.INDEX, () => {
        if (GetUnitTypeId(UnitDex.eventUnit.handle) == TERMINAL_PLACEABLE_TURRET){
                turretOwner[UnitDex.eventUnit.id] = GetOwningPlayer(UnitDex.eventUnit.handle);
                SetUnitOwner(UnitDex.eventUnit.handle, PlayerStateFactory.StationSecurity.handle, true);
        }
    });
    Interactables.set(TERMINAL_PLACEABLE_TURRET, upgradeTerminalProcessing);
}