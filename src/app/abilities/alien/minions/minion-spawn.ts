import { Ability } from "app/abilities/ability-type";
import { EventEntity } from "app/events/event-entity";
import { EVENT_TYPE } from "app/events/event-enum";
import { Unit } from "w3ts/index";
import { ALIEN_MINION_CANITE, ALIEN_MINION_LARVA } from "resources/unit-ids";
import { AIEntity } from "app/ai/ai-entity";
import { WorldEntity } from "app/world/world-entity";
import { Log } from "lib/serilog/serilog";

export class MinionSpawnAbility implements Ability {

    constructor() {}

    public initialise() {
        const u = Unit.fromHandle(GetTriggerUnit());
        
        try {
            const x = u.x + GetRandomReal(-10, 10);
            const y = u.y + GetRandomReal(-10, 10);

            const zone = WorldEntity.getInstance().getPointZone(x, y);
            // if (zone) AIEntity.createAddAgent(ALIEN_MINION_LARVA, x, y, zone.id);
        }
        catch(e) {
            Log.Error(e);            
        }
        return true;
    };

    public process(delta: number) {
        return false;
    };
    
    public destroy() {
        return true; 
    };
}
