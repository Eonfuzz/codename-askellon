
import { InteractableData } from "../../interactions/interactables/interactable-type";
import { Log } from "../../../lib/serilog/serilog";
import { Trigger, MapPlayer, Unit, Timer } from "w3ts";
import { TECH_ITEMS_IN_GENETIC_SEQUENCER, TECH_MINERALS_PROGRESS } from "resources/ability-ids";
import { GENETIC_FACILITY_TOOLTIP } from "resources/strings";
import { GENETIC_TESTING_FACILITY, GENETIC_TESTING_FACILITY_SWITCH, GENETIC_TESTING_FACILITY_SWITCH_DUMMY } from "resources/unit-ids";
import { SoundRef } from "app/types/sound-ref";
import { ITEM_GENETIC_SAMPLE, ITEM_GENETIC_SAMPLE_INFESTED, ITEM_GENETIC_SAMPLE_PURE } from "resources/item-ids";
import { getZFromXY, syncData, MessagePlayer } from "lib/utils";
import { LIGHTS_GREEN, LIGHTS_RED } from "resources/sfx-paths";
import { Interactables } from "../../interactions/interactables/interactables";
import { SendMessage } from "lib/translators";
import { COL_ATTATCH } from "resources/colours";

declare const udg_genetic_test_lights: destructable[];

// Max 4
export let testerSlots: item[] = [];

const PlaceSequenceSound = new SoundRef('Sounds\\QuestCheckpoint.flac', false);
const SequencerActiveSound = new SoundRef('Sounds\\SequencerActive.mp3', false);
const testerIsBrokenSound = new SoundRef("Sounds\\DeniedBeep.mp3", false, true);


export function initTesterInteractions() {
    const interaction: InteractableData = {
        getInteractionTime: (unit, target) => {
            return 3;
        },
        condition: () => {
            return testerSlots.length != 4;
        },
        action: (source: Unit, interactable: Unit) => {
            if (GetPlayerTechCount(source.owner.handle, TECH_MINERALS_PROGRESS, true) < 1) {
                MessagePlayer(source.owner, `The Blood Tester is ${COL_ATTATCH}broken|r. Deposit minerals into Reactor to repair`);
                if (source.owner.handle === GetLocalPlayer()) {
                    testerIsBrokenSound.playSound();
                }
                return false;
            }

            // Get the first genetic thing in the units inventory
            const hasGeneticSample = UnitHasItemOfTypeBJ(source.handle, ITEM_GENETIC_SAMPLE) 
                || UnitHasItemOfTypeBJ(source.handle, ITEM_GENETIC_SAMPLE_INFESTED)
                || UnitHasItemOfTypeBJ(source.handle, ITEM_GENETIC_SAMPLE_PURE);

            if (hasGeneticSample && testerSlots.length < 4) {

                // Fetch the item
                let item: item;
                let i = 0;
                while (!item) {
                    const tempItem = UnitItemInSlot(source.handle, i);
                    const pOwnerIndex = GetItemUserData(tempItem);
                    const itemIsValidType = GetItemTypeId(tempItem) === ITEM_GENETIC_SAMPLE 
                        || GetItemTypeId(tempItem) === ITEM_GENETIC_SAMPLE_INFESTED 
                        || GetItemTypeId(tempItem) === ITEM_GENETIC_SAMPLE_PURE;
                    
                    if (itemIsValidType) {
                        // If pOwner index is undefined this is a pure sample
                        if (GetItemTypeId(tempItem) === ITEM_GENETIC_SAMPLE_PURE) {
                            item = tempItem;
                        }
                        // If it isn't a pure sample check to see if there are nay matching samples
                        else {
                            const matches = testerSlots.filter(i => GetItemUserData(i) === pOwnerIndex);
                            if (matches.length === 0) item = tempItem;
                            else {
                                MessagePlayer(source.owner, `${COL_ATTATCH}Duplicate Sample Detected${COL_ATTATCH}`);
                                MessagePlayer(source.owner, `Please insert Pure or Unique sample`);
                                if (source.owner.handle === GetLocalPlayer()) {
                                    testerIsBrokenSound.playSound();
                                }
                            }
                        }
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
}