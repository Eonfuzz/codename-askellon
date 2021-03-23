import { AbilityWithDone } from "app/abilities/ability-type";
import { Unit } from "w3ts/index";
import { WorldEntity } from "app/world/world-entity";
import { Log } from "lib/serilog/serilog";

export class MinionSpawnAbility extends AbilityWithDone {

    

    public init() {
        super.init();
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
