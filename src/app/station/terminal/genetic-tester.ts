import { Trigger, MapPlayer, Unit, Timer } from "w3ts";
import { TECH_ITEMS_IN_GENETIC_SEQUENCER, TECH_MAJOR_HEALTHCARE, GENE_INFESTED_1 } from "resources/ability-ids";
import { testerSlots } from "app/interactions/interactables/genetic-testing-facility";

import { Terminal } from "./terminal-instance";

/**
 * Does upgrades
 * Gets access to station wide abilities
 */
export class GeneticTerminal extends Terminal {
    constructor(sourceUnit: Unit, baseUnit: Unit) {
        super(sourceUnit, baseUnit);

        SetPlayerTechResearched(sourceUnit.owner.handle, TECH_ITEMS_IN_GENETIC_SEQUENCER, testerSlots.length);
    }
}