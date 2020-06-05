/** @noSelfInFile **/
import { InteractableData } from "./interactable";
import { InteractionModule } from "./interaction-module";
import { Log } from "../../lib/serilog/serilog";
import { ZONE_TYPE } from "../world/zone-id";
import { PlayNewSoundOnUnit, COLOUR, console } from "../../lib/translators";
import { COL_FLOOR_1, COL_FLOOR_2, COL_VENTS, COL_MISC } from "../../resources/colours";
import { Trigger, MapPlayer, Unit, Timer } from "w3ts";
import { TECH_MAJOR_HEALTHCARE, TECH_MAJOR_VOID } from "resources/ability-ids";
import { STR_GENE_REQUIRES_HEALTHCARE } from "resources/strings";
import { Game } from "app/game";
import { SHIP_VOYAGER_UNIT, SHIP_MAIN_ASKELLON, SPACE_UNIT_ASTEROID } from "resources/unit-ids";
import { Interactables } from "./interaction-data";
import { EVENT_TYPE } from "app/events/event";
import { vectorFromUnit } from "app/types/vector2";
import { getZFromXY } from "lib/utils";

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

    // Interacting with asteroids
    
    
    const asteroidTimers = new Map<Unit, Timer>();
    const asteroidInteraction: InteractableData = {
        condition:  (iModule: InteractionModule, source: Unit, interactable: Unit) => {
            // Make sure ships can't fly ships, lol.
            return source.typeId === SHIP_VOYAGER_UNIT;
        },
        getInteractionTime:  (iModule: InteractionModule, source: Unit, interactable: Unit) => {
            // Takes time based on asteroids remaining HP
            if (iModule.game.researchModule.getMajorUpgradeLevel(TECH_MAJOR_VOID) >= 3)
                return interactable.life / 200 + 0.15;
            return interactable.life / 100 + 0.3
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

            const timer = new Timer();
            // Log.Information("Start!");
            timer.start(iModule.game.researchModule.getMajorUpgradeLevel(TECH_MAJOR_VOID) >= 3 ? 0.15 : 0.3, true, () => {
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
                    "Abilities\\Spells\\Undead\\DarkRitual\\DarkRitualTarget.mdl",
                    tVec.x,
                    tVec.y
                );

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
            if (aTimer) aTimer.destroy();
        },
        action: (iModule: InteractionModule, source: Unit, interactable: Unit) => {
            // Set rock anim speed so it dies faster
            interactable.setTimeScale(1);
        }
    }
    Interactables.set(SPACE_UNIT_ASTEROID, asteroidInteraction);
}

export function initAskellonInteractions(game: Game) {
    const interaction: InteractableData = {
        unitType: SHIP_MAIN_ASKELLON,
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
