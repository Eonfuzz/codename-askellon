import { Ability } from "../ability-type";
import { Unit } from "w3ts/index";
import { ITEM_GENETIC_SAMPLE, ITEM_GENETIC_SAMPLE_INFESTED } from "resources/item-ids";
import { STR_GENETIC_SAMPLE } from "resources/strings";
import { COL_MISC, COL_RESOLVE } from "resources/colours";
import { ALIEN_FORCE_NAME } from "app/force/forces/alien-force";
import { getZFromXY } from "lib/utils";
import { ForceEntity } from "app/force/force-entity";

export enum GENE_SPLICE_ALLIANCE {
    HUMAN,
    ALIEN
}

export class GeneticSamplerItemAbility implements Ability {

    private unit: Unit;
    private targetUnit: Unit;

    constructor() {}

    public initialise() {
        const targetUnit = GetSpellTargetUnit();

        if (GetUnitLevel(targetUnit) === 0) {
            DisplayTimedTextToPlayer(GetOwningPlayer(GetTriggerUnit()), 0, 0, 30, `${COL_RESOLVE}ERROR|r Target is not valid`);
            return false;
        }

        this.unit = Unit.fromHandle(GetTriggerUnit());
        this.targetUnit = Unit.fromHandle(GetSpellTargetUnit());        
        
        return true;
    };

    public process(delta: number) {

        const unitHasSpareItemSlot = UnitInventoryCount(this.unit.handle) < UnitInventorySize(this.unit.handle);

        const player = this.targetUnit.owner;

        const forceEntity = ForceEntity.getInstance()
        let alliance;

        if (forceEntity.neutralPassive == player) {
            alliance = GENE_SPLICE_ALLIANCE.HUMAN;
        }
        else if (forceEntity.neutralHostile == player) {
            alliance = GENE_SPLICE_ALLIANCE.HUMAN;
        }
        else if (forceEntity.alienAIPlayer == player) {
            alliance = GENE_SPLICE_ALLIANCE.ALIEN
        }
        else {
            // Otherwise it's a player, get force
            // Check unit force
            const pData = forceEntity.getPlayerDetails(this.targetUnit.owner);
            if (pData.getForce().name === ALIEN_FORCE_NAME) {
                alliance = GENE_SPLICE_ALLIANCE.ALIEN;
            }
            else {
                alliance = GENE_SPLICE_ALLIANCE.HUMAN;
            }
        }

        const item = CreateItem(alliance === GENE_SPLICE_ALLIANCE.ALIEN 
            ? ITEM_GENETIC_SAMPLE_INFESTED 
            : ITEM_GENETIC_SAMPLE, 
            this.unit.x, this.unit.y
        );
        BlzSetItemName(item, `Genetic Sample: ${COL_MISC}${this.targetUnit.name}|r`);
        BlzSetItemTooltip(item, `Genetic Sample: ${COL_MISC}${this.targetUnit.name}|r`);
        BlzSetItemExtendedTooltip(item, STR_GENETIC_SAMPLE(this.targetUnit.owner, this.targetUnit));
        BlzSetItemDescription(item, STR_GENETIC_SAMPLE(this.targetUnit.owner, this.targetUnit));

        if (unitHasSpareItemSlot) {
            UnitAddItem(this.unit.handle, item);
        }

        const sfx = AddSpecialEffect("Objects\\Spawnmodels\\Orc\\Orcblood\\BattrollBlood.mdl", this.unit.x, this.unit.y);
        BlzSetSpecialEffectZ(sfx, getZFromXY(this.unit.x, this.unit.y) + 30);
        DestroyEffect(sfx);

        return false;
    };

    public destroy() {
        return true;
    };
}