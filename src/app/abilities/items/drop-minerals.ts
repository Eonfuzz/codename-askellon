import { AbilityWithDone } from "../ability-type";
import { Item, Unit } from "w3ts/index";
import { ITEM_GENETIC_SAMPLE, ITEM_GENETIC_SAMPLE_INFESTED, ITEM_MINERAL_REACTIVE, ITEM_MINERAL_VALUABLE } from "resources/item-ids";
import { Vector2 } from "app/types/vector2";
import { ConveyorEntity } from "app/conveyor/conveyor-entity";

export class DropMineralsAbility extends AbilityWithDone {

    private unit: Unit;
    private targetPoint: Vector2;

    

    public init() {
        super.init();
        this.unit = Unit.fromHandle(GetTriggerUnit());
        this.targetPoint = new Vector2( GetSpellTargetX(), GetSpellTargetY() );
        return true;
    };

    public step(delta: number) {

        // Loop through all items and place them on the ground ( that are minerals )
        for (let i = 0; i < this.unit.inventorySize; i++) {
            const _item = UnitItemInSlot(this.unit.handle, i);
            if (_item) {
                const item = Item.fromHandle(_item);
                const iType = item.typeId;
                if (iType === ITEM_MINERAL_REACTIVE || iType === ITEM_MINERAL_VALUABLE) {
                    item.setPosition(this.targetPoint.x, this.targetPoint.y);
                    ConveyorEntity.getInstance().checkItem(item.handle);
                }
            }
            
        }
        this.done = true; 
        return false;
    };

    public destroy() {
        return true;
    };
}