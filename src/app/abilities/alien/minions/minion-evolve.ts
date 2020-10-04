import { Ability } from "app/abilities/ability-type";
import { EventEntity } from "app/events/event-entity";
import { EVENT_TYPE } from "app/events/event-enum";
import { Unit } from "w3ts/index";
import { ALIEN_MINION_CANITE } from "resources/unit-ids";
import { Log } from "lib/serilog/serilog";

export class MinionEvolveAbility implements Ability {

    constructor() {}

    public initialise() {
        // Log.Information("Doing evolve egg thing");
        EventEntity.send(EVENT_TYPE.SPAWN_ALIEN_EGG_FOR, {
            source: Unit.fromHandle( GetTriggerUnit() ),
            data: { to: ALIEN_MINION_CANITE }
        });
        return true;
    };

    public process(delta: number) {
        return false;
    };
    
    public destroy() {
        return true; 
    };
}
