import { Ability } from "app/abilities/ability-type";
import { EventEntity } from "app/events/event-entity";
import { EVENT_TYPE } from "app/events/event-enum";
import { Unit } from "w3ts/index";
import { ALIEN_MINION_CANITE, ALIEN_MINION_HYDRA, ALIEN_MINION_LARVA } from "resources/unit-ids";
import { Log } from "lib/serilog/serilog";

export class MinionEvolveAbility implements Ability {

    constructor() {}

    public initialise() {
        // Log.Information("Doing evolve egg thing");
        const unit = Unit.fromEvent();
        let target: number;
        let scale = 1;

        if (unit.typeId === ALIEN_MINION_LARVA) {
            target = ALIEN_MINION_CANITE;
            scale = 0.9;
        }
        else if (unit.typeId === ALIEN_MINION_CANITE) {
            target = ALIEN_MINION_HYDRA;
            scale = 1.2;
        }

        EventEntity.send(EVENT_TYPE.SPAWN_ALIEN_EGG_FOR, {
            source: Unit.fromHandle( GetTriggerUnit() ),
            data: { to: target, scale: scale }
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
