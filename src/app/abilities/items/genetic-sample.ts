import { Ability } from "../ability-type";
import { Unit } from "w3ts/index";
import { ITEM_GENETIC_SAMPLE, ITEM_GENETIC_SAMPLE_INFESTED } from "resources/item-ids";
import { STR_GENETIC_SAMPLE } from "resources/strings";
import { COL_MISC, COL_RESOLVE } from "resources/colours";
import { getZFromXY } from "lib/utils";
import { ForceEntity } from "app/force/force-entity";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { ALIEN_FORCE_NAME } from "app/force/forces/force-names";

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

        if (PlayerStateFactory.NeutralPassive == player) {
            alliance = GENE_SPLICE_ALLIANCE.HUMAN;
        }
        else if (PlayerStateFactory.NeutralHostile == player) {
            alliance = GENE_SPLICE_ALLIANCE.HUMAN;
        }
        else if (PlayerStateFactory.AlienAIPlayer == player) {
            alliance = GENE_SPLICE_ALLIANCE.ALIEN
        }
        else {
            // Otherwise it's a player, get force
            // Check unit force
            const pData = PlayerStateFactory.get(this.targetUnit.owner);
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