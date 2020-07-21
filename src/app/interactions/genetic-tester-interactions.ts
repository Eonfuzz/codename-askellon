/** @noSelfInFile **/
import { InteractableData } from "./interactable";
import { InteractionModule } from "./interaction-module";
import { Log } from "../../lib/serilog/serilog";
import { ZONE_TYPE } from "../world/zone-id";
import { PlayNewSoundOnUnit, COLOUR, console } from "../../lib/translators";
import { COL_FLOOR_1, COL_FLOOR_2, COL_VENTS, COL_MISC } from "../../resources/colours";
import { Trigger, MapPlayer, Unit, Timer } from "w3ts";
import { TECH_MAJOR_HEALTHCARE, TECH_ITEMS_IN_GENETIC_SEQUENCER, ABIL_ACTIVATE_SEQUENCER_TEST } from "resources/ability-ids";
import { STR_GENE_REQUIRES_HEALTHCARE, GENETIC_FACILITY_TOOLTIP } from "resources/strings";
import { Game } from "app/game";
import { GENETIC_TESTING_FACILITY, GENETIC_TESTING_FACILITY_SWITCH, GENETIC_TESTING_FACILITY_SWITCH_DUMMY } from "resources/unit-ids";
import { Interactables } from "./interaction-data";
import { EVENT_TYPE } from "app/events/event";
import { SoundRef } from "app/types/sound-ref";
import { ITEM_GENETIC_SAMPLE } from "resources/item-ids";
import { getZFromXY, syncData } from "lib/utils";
import { LIGHTS_GREEN, LIGHTS_RED } from "resources/sfx-paths";

declare const udg_genetic_test_lights: destructable[];

// Max 4
export let testerSlots: item[] = [];
let testerLastActivated = 0.0;
export const setTesterLastActivatedTo = (val: number) => {
    testerLastActivated = val;
}
let gTicker = 0;

const PlaceSequenceSound = new SoundRef('UI\\Feedback\\CheckpointPopup\\QuestCheckpoint.flac', false);
const SequencerActiveSound = new SoundRef('Sounds\\SequencerActive.mp3', false);

export function initTesterInteractions(game: Game) {
    const interaction: InteractableData = {
        getInteractionTime: (iModule, unit, target) => {
            return 3;
        },
        condition: () => {
            return testerSlots.length != 4;
        },
        action: (iModule: InteractionModule, source: Unit, interactable: Unit) => {

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

                if (testerSlots.length < 4) {
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

                }
                else {
                    SequencerActiveSound.playSoundOnUnit(interactable.handle, 127);
                    const flashTimer = new Timer();
                    let flashes = 0;
                    flashTimer.start(0.3, true, () => {
                        flashes++;
                        const flashRed = flashes % 2 === 0;
                        for (let i = 0; i < 4; i++) {                            
                            const dX = GetDestructableX(udg_genetic_test_lights[i]);
                            const dY = GetDestructableY(udg_genetic_test_lights[i]);
                            const dZ = getZFromXY(dX, dY) + 50;
            
                            RemoveDestructable(udg_genetic_test_lights[i]);
            
                            udg_genetic_test_lights[i] = CreateDestructableZ(
                                !flashRed ? LIGHTS_GREEN : LIGHTS_RED,
                                dX, dY, dZ, 0, 1, 0
                            );
                        }
                        if (flashes > 12) {
                            flashTimer.pause();
                            flashTimer.destroy();
                        }
                    });
                }
            }

            interactable.name = GENETIC_FACILITY_TOOLTIP(testerSlots[0], testerSlots[1], testerSlots[2], testerSlots[3]);
        }
    }

    Interactables.set(GENETIC_TESTING_FACILITY, interaction);



    const upgradeTerminalProcessing: InteractableData = {
        onStart: (iModule: InteractionModule, fromUnit: Unit, targetUnit: Unit) => {
            // Log.Information("Using terminal");
        },
        onCancel: (iModule: InteractionModule, fromUnit: Unit, targetUnit: Unit) => {
        },
        action: (iModule: InteractionModule, fromUnit: Unit, targetUnit: Unit) => {
            const handleId = targetUnit.id;
            const uX = targetUnit.x; 
            const uY = targetUnit.y;
            const player = fromUnit.owner;

            const targetUType = targetUnit.typeId;
            let unitType = GENETIC_TESTING_FACILITY_SWITCH_DUMMY;

            const nUnit = CreateUnit(player.handle, unitType, uX, uY, bj_UNIT_FACING);
            SelectUnitForPlayerSingle(nUnit, player.handle);
            SetPlayerTechResearched(fromUnit.owner.handle, TECH_ITEMS_IN_GENETIC_SEQUENCER, testerSlots.length);

            let timeSinceLastCast = iModule.game.getTimeStamp() - testerLastActivated;
            if (timeSinceLastCast < 20) {
                BlzStartUnitAbilityCooldown(nUnit, ABIL_ACTIVATE_SEQUENCER_TEST, 20 - timeSinceLastCast);
            }

            try {
                // Select events are async
                const syncher = syncData(`INT_SEL_${gTicker++}`, player, (self, data: string) => {
                    UnitApplyTimedLife(nUnit, FourCC('b001'), 3);
                });

                const trackUnselectEvent = new Trigger();
                trackUnselectEvent.registerPlayerUnitEvent(player, EVENT_PLAYER_UNIT_DESELECTED, null);
                trackUnselectEvent.addAction(() => {
                    const u = GetTriggerUnit();
                    if (u === nUnit) {
                        syncher("Data");
                    }
                });
            }
            catch (e) {
                Log.Error(e);
            }
        }
    }
    Interactables.set(GENETIC_TESTING_FACILITY_SWITCH, upgradeTerminalProcessing);
}