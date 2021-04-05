import { AbilityWithDone } from "../ability-type";
import { EventEntity } from "app/events/event-entity";
import { EVENT_TYPE } from "app/events/event-enum";
import { Unit, MapPlayer, playerColors, Group } from "w3ts/index";
import { Log } from "lib/serilog/serilog";
import { SecurityEntity } from "app/station/security-module";
import { Vector3 } from "app/types/vector3";
import { Vector2 } from "app/types/vector2";
import { UNIT_ID_MANSION_DOOR } from "resources/unit-ids";

export class LockdownAbility extends AbilityWithDone {
    

    public init() {
        super.init();

        
        const group = new Group();
        const targetLoc = new Vector2(GetSpellTargetX(), GetSpellTargetY());

        const filter = Filter(() => GetUnitTypeId(GetFilterUnit()) == UNIT_ID_MANSION_DOOR);
        let targetU: Unit;
        let distance = 2000;


        group.enumUnitsInRange(targetLoc.x, targetLoc.y, 2000, filter);
        group.for(() => {
            const u = Unit.fromHandle(GetEnumUnit());

            if (!targetU || targetLoc.distanceTo(Vector2.fromWidget(u.handle)) < distance) {
                distance = targetLoc.distanceTo(Vector2.fromWidget(u.handle));
                targetU = u;
            }
        });
   

        if (targetU) {
            const door = SecurityEntity.getInstance().findDoor(targetU);

            if (door) { 
                door.lockFor(15);
            }
        }
        this.done = true;
        return true;
    };

    public step(delta: number) {
        return false;
    };

    public destroy() {
        return true;
    };
}