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
import { SHIP_VOYAGER_UNIT, SHIP_MAIN_ASKELLON } from "resources/unit-ids";
import { Interactables } from "./interaction-data";
import { EVENT_TYPE } from "app/events/event";

export function initShipInteractions(game: Game) {
    const interaction: InteractableData = {
        unitType: SHIP_VOYAGER_UNIT,
        condition:  (iModule: InteractionModule, source: Unit, interactable: Unit) => {
            // Make sure ships can't fly ships, lol.
            return source.typeId !== SHIP_VOYAGER_UNIT;
        },
        onStart: (iModule: InteractionModule, source: Unit, interactable: Unit) => {
        },
        onCancel: (iModule: InteractionModule, source: Unit, interactable: Unit) => {
        },
        action: (iModule: InteractionModule, source: Unit, interactable: Unit) => {
            iModule.game.event.sendEvent(EVENT_TYPE.ENTER_SHIP, {
                source: source,
                data: {
                    ship: interactable
                }
            })
        }
    }

    Interactables.set(SHIP_VOYAGER_UNIT, interaction);
}

export function initAskellonInteractions(game: Game) {
    const interaction: InteractableData = {
        unitType: SHIP_MAIN_ASKELLON,
        condition:  (iModule: InteractionModule, source: Unit, interactable: Unit) => {
            // Make sure ships can't fly ships, lol.
            return source.typeId === SHIP_VOYAGER_UNIT;
        },
        onStart: (iModule: InteractionModule, source: Unit, interactable: Unit) => {
        },
        onCancel: (iModule: InteractionModule, source: Unit, interactable: Unit) => {
        },
        action: (iModule: InteractionModule, source: Unit, interactable: Unit) => {
            iModule.game.event.sendEvent(EVENT_TYPE.SHIP_LEAVES_SPACE, {
                source: source,
                data: {
                    goal: interactable
                }
            })
        }
    }

    Interactables.set(SHIP_MAIN_ASKELLON, interaction);
}
