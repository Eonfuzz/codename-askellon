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
import { SHIP_VOYAGER_UNIT } from "resources/unit-ids";
import { Interactables } from "./interaction-data";
import { EVENT_TYPE } from "app/events/event";


class ShipInteraction {
    unit: Unit;
    to: undefined;
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

export function initShipInteractions(game: Game) {
    
    const ships: ShipInteraction[] = [];
    const interaction: InteractableData = {
        unitType: SHIP_VOYAGER_UNIT,
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
