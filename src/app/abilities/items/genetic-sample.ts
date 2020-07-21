import { Ability } from "../ability-type";
import { AbilityModule } from "../ability-module";
import { Unit } from "w3ts/index";
import { ITEM_GENETIC_SAMPLE } from "resources/item-ids";
import { STR_GENETIC_SAMPLE } from "resources/strings";
import { COL_MISC, COL_RESOLVE } from "resources/colours";
import { ALIEN_FORCE_NAME } from "app/force/alien-force";
import { ABIL_ITEM_GENETIC_SAMPLE_INFESTED } from "resources/ability-ids";

export enum GENE_SPLICE_ALLIANCE {
    HUMAN,
    ALIEN
}

export class GeneticSamplerItemAbility implements Ability {

    private unit: Unit;
    private targetUnit: Unit;

    constructor() {}

    public initialise(module: AbilityModule) {
        const targetUnit = GetSpellTargetUnit();

        if (GetUnitLevel(targetUnit) === 0) {
            DisplayTimedTextToPlayer(GetOwningPlayer(GetTriggerUnit()), 0, 0, 30, `${COL_RESOLVE}ERROR|r Target is not valid`);
            return false;
        }

        this.unit = Unit.fromHandle(GetTriggerUnit());
        this.targetUnit = Unit.fromHandle(GetSpellTargetUnit());        
        
        return true;
    };

    public process(module: AbilityModule, delta: number) {
        const item = CreateItem(ITEM_GENETIC_SAMPLE, this.unit.x, this.unit.y);
        BlzSetItemName(item, `Genetic Sample: ${COL_MISC}${this.targetUnit.name}|r`);
        BlzSetItemTooltip(item, `Genetic Sample: ${COL_MISC}${this.targetUnit.name}|r`);
        BlzSetItemExtendedTooltip(item, STR_GENETIC_SAMPLE(this.targetUnit.owner, this.targetUnit));
        BlzSetItemDescription(item, STR_GENETIC_SAMPLE(this.targetUnit.owner, this.targetUnit));

        const unitHasSpareItemSlot = UnitInventoryCount(this.unit.handle) < UnitInventorySize(this.unit.handle);

        const player = this.targetUnit.owner;

        const forceModule = module.game.forceModule;
        let alliance;

        if (forceModule.neutralPassive == player) {
            alliance = GENE_SPLICE_ALLIANCE.HUMAN;
        }
        else if (forceModule.neutralHostile == player) {
            alliance = GENE_SPLICE_ALLIANCE.HUMAN;
        }
        else if (forceModule.alienAIPlayer == player) {
            alliance = GENE_SPLICE_ALLIANCE.ALIEN
        }
        else {
            // Otherwise it's a player, get force
            // Check unit force
            const pData = module.game.forceModule.getPlayerDetails(this.targetUnit.owner);
            if (pData.getForce().name === ALIEN_FORCE_NAME) {
                alliance = GENE_SPLICE_ALLIANCE.ALIEN;
            }
            else {
                alliance = GENE_SPLICE_ALLIANCE.HUMAN;
            }
        }

        if (alliance === GENE_SPLICE_ALLIANCE.ALIEN) {
            BlzItemAddAbility(item, ABIL_ITEM_GENETIC_SAMPLE_INFESTED);
        }

        if (unitHasSpareItemSlot) {
            UnitAddItem(this.unit.handle, item);
        }

        return false;
    };

    public destroy(aMod: AbilityModule) {
        return true;
    };
}