/** @noSelfInFile **/
import { InteractableData } from "./interactable";
import { InteractionModule } from "./interaction-module";
import { Log } from "../../lib/serilog/serilog";
import { ZONE_TYPE } from "../world/zone-id";
import { PlayNewSoundOnUnit, COLOUR, console } from "../../lib/translators";
import { COL_FLOOR_1, COL_FLOOR_2, COL_VENTS, COL_MISC } from "../../resources/colours";
import { Trigger, MapPlayer, Unit } from "w3ts";
import { TECH_MAJOR_HEALTHCARE } from "resources/ability-ids";
import { STR_GENE_REQUIRES_HEALTHCARE, GENETIC_FACILITY_TOOLTIP } from "resources/strings";
import { Game } from "app/game";
import { GENETIC_TESTING_FACILITY } from "resources/unit-ids";
import { Interactables } from "./interaction-data";
import { EVENT_TYPE } from "app/events/event";
import { SoundRef } from "app/types/sound-ref";
import { ITEM_GENETIC_SAMPLE } from "resources/item-ids";
import { getZFromXY } from "lib/utils";

declare const udg_genetic_test_lights: destructable[];

const LIGHTS_GREEN = FourCC('B005');
const LIGHTS_RED = FourCC('B003');

// Max 4
let testerSlots: item[] = [];

const PlaceSequenceSound = new SoundRef('UI\\Feedback\\CheckpointPopup\\QuestCheckpoint.flac', false);

export function initTesterInteractions(game: Game) {
    const interaction: InteractableData = {
        action: (iModule: InteractionModule, source: Unit, interactable: Unit) => {
            Log.Information("interact start!");

            // Get the first genetic thing in the units inventory
            const hasGeneticSample = UnitHasItemOfTypeBJ(source.handle, ITEM_GENETIC_SAMPLE);

            if (hasGeneticSample && testerSlots.length < 4) {

                // Fetch the item
                let item: item;
                let i = 0;
                while (!item) {
                    const tempItem = UnitItemInSlot(source.handle, i++);
                    if (GetItemTypeId(tempItem) === ITEM_GENETIC_SAMPLE) {
                        item = tempItem;
                    }
                }
                // We have the item
                // Now do stuff
                SetItemPosition(item, source.x, source.y);
                // Now hide item
                SetItemVisible(item, false);
                // Now add it to our tester slots
                testerSlots.push(item);
                
                PlaceSequenceSound.playSoundOnUnit(interactable.handle, 127);
            }

            // Now update our lights
            for (let i = 0; i < 4; i++) {
                const hasTestTube = !!testerSlots[i];
                
                const dX = GetDestructableX(udg_genetic_test_lights[i]);
                const dY = GetDestructableY(udg_genetic_test_lights[i]);
                const dZ = getZFromXY(dX, dY) + 50;

                RemoveDestructable(udg_genetic_test_lights[i]);

                udg_genetic_test_lights[i] = CreateDestructableZ(
                    hasTestTube ? LIGHTS_GREEN : LIGHTS_RED,
                    dX, dY, dZ, 0, 1, 0
                );
            }

            interactable.name = GENETIC_FACILITY_TOOLTIP(testerSlots[0], testerSlots[1], testerSlots[2], testerSlots[3]);
        }
    }

    Interactables.set(GENETIC_TESTING_FACILITY, interaction);
}