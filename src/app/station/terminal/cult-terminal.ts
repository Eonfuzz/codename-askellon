import { Trigger, MapPlayer, Unit, Timer } from "w3ts";
import { TECH_ITEMS_IN_GENETIC_SEQUENCER, TECH_MAJOR_HEALTHCARE, GENE_INFESTED_1, ABIL_CULTIST_T1_GLUTTONY, ABIL_CULTIST_T1_GRAVE_GIFT, ABIL_CULTIST_T1_PERNICIOUS_POWER, ABIL_CULTIST_T2_DELICIOUS_DECAY } from "resources/ability-ids";
import { testerSlots } from "app/interactions/interactables/genetic-testing-facility";

import { Terminal } from "./terminal-instance";
import { TECH_RESEARCH_CULT_ID } from "app/force/forces/cultist/constants";

/**
 * Does upgrades
 * Gets access to station wide abilities
 */
export class CultTerminal extends Terminal {
    constructor(sourceUnit: Unit, baseUnit: Unit) {
        super(sourceUnit, baseUnit);

        const cultTechLevel = sourceUnit.owner.getTechCount(TECH_RESEARCH_CULT_ID, true);
        if (cultTechLevel == 0) {
            this.terminalUnit.addAbility(ABIL_CULTIST_T1_GLUTTONY);
            this.terminalUnit.addAbility(ABIL_CULTIST_T1_GRAVE_GIFT);
            this.terminalUnit.addAbility(ABIL_CULTIST_T1_PERNICIOUS_POWER);
        }
        if (cultTechLevel == 1) {
            this.terminalUnit.addAbility(ABIL_CULTIST_T2_DELICIOUS_DECAY);
        }
    }
}