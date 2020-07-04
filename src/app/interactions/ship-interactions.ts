/** @noSelfInFile **/
import { InteractableData } from "./interactable";
import { InteractionModule } from "./interaction-module";
import { Log } from "../../lib/serilog/serilog";
import { ZONE_TYPE } from "../world/zone-id";
import { PlayNewSoundOnUnit, COLOUR, console } from "../../lib/translators";
import { COL_FLOOR_1, COL_FLOOR_2, COL_VENTS, COL_MISC, COL_ATTATCH, COL_PINK } from "../../resources/colours";
import { Trigger, MapPlayer, Unit, Timer } from "w3ts";
import { TECH_MAJOR_HEALTHCARE, TECH_MAJOR_VOID } from "resources/ability-ids";
import { STR_GENE_REQUIRES_HEALTHCARE } from "resources/strings";
import { Game } from "app/game";
import { SHIP_VOYAGER_UNIT, SHIP_MAIN_ASKELLON, SPACE_UNIT_ASTEROID, SPACE_UNIT_MINERAL } from "resources/unit-ids";
import { Interactables } from "./interaction-data";
import { EVENT_TYPE } from "app/events/event";
import { vectorFromUnit } from "app/types/vector2";
import { getZFromXY } from "lib/utils";
import { ITEM_MINERALS_SHIP_ID } from "resources/item-ids";
import { SoundWithCooldown, SoundRef } from "app/types/sound-ref";

// Interacting with asteroids
const noInventorySpace = new SoundRef("Sounds\\DeniedBeep.mp3", false);
const asteroidTimers = new Map<Unit, Timer>();

export function initShipInteractions(game: Game) {
    const interaction: InteractableData = {
        condition:  (iModule: InteractionModule, source: Unit, interactable: Unit) => {

            if (source.typeId === SHIP_VOYAGER_UNIT) {
                return false;
            }
            if (GetPlayerTechCount(source.owner.handle, TECH_MAJOR_VOID, true) === 0) {
                DisplayTimedTextToPlayer(source.owner.handle, 0, 0, 5, `${COL_ATTATCH}ACCESS DENIED|R ${COL_PINK}Void Delving I|r required`);
                if (source.owner.handle === GetLocalPlayer()) {
                    noInventorySpace.playSound();
                }
                return false;
            }
            // Make sure ships can't fly ships, lol.
            return true;
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

    const asteroidInteraction: InteractableData = {
        hideInteractionBar: true,
        condition:  (iModule: InteractionModule, source: Unit, interactable: Unit) => {
            // Make sure ships can't fly ships, lol.
            return source.typeId === SHIP_VOYAGER_UNIT;
        },
        getInteractionTime:  (iModule: InteractionModule, source: Unit, interactable: Unit) => {
            // Takes time based on asteroids remaining HP
            if (iModule.game.researchModule.getMajorUpgradeLevel(TECH_MAJOR_VOID) >= 3)
                return interactable.life / 200 + 0.3;
            return interactable.life / 100 + 0.6;
        },
        getInteractionDistance:  (iModule: InteractionModule, source: Unit, interactable: Unit) => {
            if (iModule.game.researchModule.getMajorUpgradeLevel(TECH_MAJOR_VOID) >= 2) {
                return 800 * 1.33;
            }
            return 800;
        },
        onStart: (iModule: InteractionModule, source: Unit, interactable: Unit) => {
            // Issue unit "Hold" order
            const ship = game.spaceModule.getShipForUnit(source);
            if (ship) {
                ship.engine.goToAStop();
            }

            let isBlue = interactable.typeId === SPACE_UNIT_MINERAL;

            // let sfxPath = isBlue ? "Abilities\\Weapons\\Bolt\\BoltImpact.mdl" : "Abilities\\Spells\\Undead\\DarkRitual\\DarkRitualTarget.mdl";
            let sfxPath = "Abilities\\Spells\\Undead\\DarkRitual\\DarkRitualTarget.mdl";
            
            const timer = new Timer();
            // Log.Information("Start!");
            timer.start(iModule.game.researchModule.getMajorUpgradeLevel(TECH_MAJOR_VOID) >= 3 ? 0.15 : 0.3, true, () => {

                if (!interactable.isAlive()) {
                    timer.pause();
                    return;
                }

                const scale = interactable.selectionScale;

                const sVec = vectorFromUnit(source.handle).applyPolarOffset(source.facing, 60);
                const tVec = vectorFromUnit(interactable.handle);
                tVec.x += GetRandomInt(-45, 45) * scale;
                tVec.y += GetRandomInt(-45, 45) * scale;
                const vecZ = getZFromXY(tVec.x, tVec.y) + GetRandomInt(-45, 45) * scale;
                
                const lightning = AddLightningEx(
                    "SPNL", false, 
                    sVec.x, sVec.y, getZFromXY(sVec.x, sVec.y) + 80,
                    tVec.x , tVec.y, vecZ
                );

                const kL = new Timer();
                UnitDamageTarget(source.handle, interactable.handle, 30, false, false, ATTACK_TYPE_HERO, DAMAGE_TYPE_MAGIC, WEAPON_TYPE_WHOKNOWS);

                const sfx = AddSpecialEffect(
                    sfxPath,
                    tVec.x,
                    tVec.y
                );

                const minerals = source.getItemInSlot(0);
                const charges = GetItemCharges(minerals);
                if (charges < 250) {
                    SetItemCharges(minerals, charges + 1);
                    
                }
                else if (GetLocalPlayer() == ship.unit.owner.handle) {
                    noInventorySpace.playSound();
                }

                BlzSetSpecialEffectZ(sfx, vecZ);
                

                kL.start(0.1, false, () => {
                    DestroyEffect(sfx);
                    DestroyLightning(lightning);
                    kL.destroy()
                });
            });
            asteroidTimers.set(source, timer);
        },
        onCancel: (iModule: InteractionModule, source: Unit, interactable: Unit) => {
            const aTimer = asteroidTimers.get(source);
            if (aTimer) {
                aTimer.destroy();
                asteroidTimers.delete(source);
            }
        },
        action: (iModule: InteractionModule, source: Unit, interactable: Unit) => {
            // Set rock anim speed so it dies faster
            interactable.setTimeScale(1);

            const aTimer = asteroidTimers.get(source);
            if (aTimer) {
                aTimer.destroy();
                asteroidTimers.delete(source);
            }
        }
    }
    
    Interactables.set(SPACE_UNIT_ASTEROID, asteroidInteraction);
    Interactables.set(SPACE_UNIT_MINERAL, asteroidInteraction);
}

export function initAskellonInteractions(game: Game) {
    const interaction: InteractableData = {
        condition:  (iModule: InteractionModule, source: Unit, interactable: Unit) => {
            // Make sure ships can't fly ships, lol.
            return source.typeId === SHIP_VOYAGER_UNIT;
        },
        onStart: (iModule: InteractionModule, source: Unit, interactable: Unit) => {
            // Issue unit "Hold" order
            const ship = game.spaceModule.getShipForUnit(source);
            if (ship) {
                ship.engine.goToAStop();
            }
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
