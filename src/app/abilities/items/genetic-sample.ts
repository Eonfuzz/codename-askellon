import { AbilityWithDone } from "../ability-type";
import { Unit, playerColors } from "w3ts/index";
import { ITEM_GENETIC_SAMPLE, ITEM_GENETIC_SAMPLE_INFESTED, ITEM_GENETIC_SAMPLE_PURE } from "resources/item-ids";
import { STR_GENETIC_SAMPLE, STR_GENETIC_SAMPLE_PURE } from "resources/strings";
import { COL_MISC, COL_RESOLVE } from "resources/colours";
import { getZFromXY } from "lib/utils";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { ALIEN_FORCE_NAME } from "app/force/forces/force-names";

export enum GENE_SPLICE_ALLIANCE {
    HUMAN,
    ALIEN,
    PURE
}

export class GeneticSamplerItemAbility extends AbilityWithDone {

    private unit: Unit;
    private targetUnit: Unit;

    

    public init() {
        super.init();
        this.unit = Unit.fromHandle(GetTriggerUnit());
        this.targetUnit = Unit.fromHandle(GetSpellTargetUnit());        
        
        return true;
    };

    public step(delta: number) {

        const unitHasSpareItemSlot = UnitInventoryCount(this.unit.handle) < UnitInventorySize(this.unit.handle);

        const player = this.targetUnit.owner;

        let alliance;

        const crew = PlayerStateFactory.getCrewmember(player);
        let itemUserDataVal = -1;

        if (crew) {
            // Otherwise it's a player, get force
            // Check unit force
            const pData = PlayerStateFactory.get(this.targetUnit.owner);
            if (pData.getForce().name === ALIEN_FORCE_NAME) {
                alliance = GENE_SPLICE_ALLIANCE.ALIEN;
            }
            else {
                alliance = GENE_SPLICE_ALLIANCE.HUMAN;
            }
            itemUserDataVal = pData.player.id;
        }
        else if (PlayerStateFactory.isAlienAI(player)) {
            alliance = GENE_SPLICE_ALLIANCE.ALIEN
        }
        // Otherwise they are targeting an animal
        else {
            alliance = GENE_SPLICE_ALLIANCE.PURE;
            // Kill the animal. SAD.
            this.targetUnit.kill();
        }

        let iType: number;
        switch(alliance) {
            case GENE_SPLICE_ALLIANCE.ALIEN:
                iType = ITEM_GENETIC_SAMPLE_INFESTED
                break;
            case GENE_SPLICE_ALLIANCE.HUMAN:
                iType = ITEM_GENETIC_SAMPLE;
                break;
            case GENE_SPLICE_ALLIANCE.PURE:
                iType = ITEM_GENETIC_SAMPLE_PURE;
                break;
        }
        
        const item = CreateItem(iType, this.unit.x, this.unit.y);
        BlzSetItemName(item, `Genetic Sample: ${COL_MISC}${this.targetUnit.name}|r`);
        BlzSetItemTooltip(item, `Genetic Sample: ${COL_MISC}${this.targetUnit.name}|r`);
        SetItemUserData(item, itemUserDataVal);

        if (alliance == GENE_SPLICE_ALLIANCE.PURE) {
            BlzSetItemExtendedTooltip(item, STR_GENETIC_SAMPLE_PURE(this.targetUnit.owner, this.targetUnit));
            BlzSetItemDescription(item, STR_GENETIC_SAMPLE_PURE(this.targetUnit.owner, this.targetUnit));
        }
        else {
            BlzSetItemExtendedTooltip(item, STR_GENETIC_SAMPLE(this.targetUnit.owner, this.targetUnit));
            BlzSetItemDescription(item, STR_GENETIC_SAMPLE(this.targetUnit.owner, this.targetUnit));     
            

            const pColor = playerColors[this.targetUnit.owner.id];
            if (pColor) {
                BlzSetItemIntegerField(item, ITEM_IF_TINTING_COLOR_RED, pColor.red);       
                BlzSetItemIntegerField(item, ITEM_IF_TINTING_COLOR_GREEN, pColor.green);
                BlzSetItemIntegerField(item, ITEM_IF_TINTING_COLOR_BLUE, pColor.blue);
            }

        }

        if (unitHasSpareItemSlot) {
            UnitAddItem(this.unit.handle, item);
        }

        const sfx = AddSpecialEffect("Objects\\Spawnmodels\\Orc\\Orcblood\\BattrollBlood.mdl", this.unit.x, this.unit.y);
        BlzSetSpecialEffectZ(sfx, getZFromXY(this.unit.x, this.unit.y) + 30);
        DestroyEffect(sfx);

        this.done = true; 
        return false;
    };

    public destroy() {
        return true;
    };
}