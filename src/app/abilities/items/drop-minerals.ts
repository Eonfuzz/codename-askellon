import { Ability } from "../ability-type";
import { Unit } from "w3ts/index";
import { ITEM_GENETIC_SAMPLE, ITEM_GENETIC_SAMPLE_INFESTED, ITEM_MINERAL_REACTIVE, ITEM_MINERAL_VALUABLE } from "resources/item-ids";
import { Vector2 } from "app/types/vector2";
import { ConveyorEntity } from "app/conveyor/conveyor-entity";

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
            if (item) {
                const iType = item.typeId;
                if (iType === ITEM_MINERAL_REACTIVE || iType === ITEM_MINERAL_VALUABLE) {
                    item.setPosition(this.targetPoint.x, this.targetPoint.y);
                    ConveyorEntity.getInstance().checkItem(item.handle);
                }
            }
            
        }
        return false;
    };

    public destroy() {
        return true;
    };
}