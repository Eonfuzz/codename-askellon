import { Ability } from "../ability-type";
import { Unit } from "w3ts/index";
import { ITEM_GENETIC_SAMPLE, ITEM_GENETIC_SAMPLE_INFESTED, ITEM_MINERAL_REACTIVE, ITEM_MINERAL_VALUABLE } from "resources/item-ids";
import { STR_GENETIC_SAMPLE } from "resources/strings";
import { COL_MISC, COL_RESOLVE } from "resources/colours";
import { getZFromXY } from "lib/utils";
import { ForceEntity } from "app/force/force-entity";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { ALIEN_FORCE_NAME } from "app/force/forces/force-names";
import { Vector2 } from "app/types/vector2";

export class DropMineralsAbility implements Ability {

    private unit: Unit;
    private targetPoint: Vector2;

    constructor() {}

    public initialise() {
        this.unit = Unit.fromHandle(GetTriggerUnit());
        this.targetPoint = new Vector2( GetSpellTargetX(), GetSpellTargetY() );
        return true;
    };

    public process(delta: number) {

        // Loop through all items and place them on the ground ( that are minerals )
        for (let i = 0; i < this.unit.inventorySize; i++) {
            const item = this.unit.getItemInSlot(i);
            const iType = GetItemTypeId(item);
            if (iType === ITEM_MINERAL_REACTIVE || iType === ITEM_MINERAL_VALUABLE) {
                const minerals = CreateItem(iType, this.targetPoint.x + GetRandomInt(-25, 25), this.targetPoint.y + GetRandomInt(-25, 25));
                SetItemCharges(minerals, GetItemCharges(item));
                RemoveItem(item);
            }
        }
        return false;
    };

    public destroy() {
        return true;
    };
}