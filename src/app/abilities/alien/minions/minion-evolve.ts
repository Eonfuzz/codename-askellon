import { AbilityWithDone } from "app/abilities/ability-type";
import { EventEntity } from "app/events/event-entity";
import { EVENT_TYPE } from "app/events/event-enum";
import { Unit } from "w3ts/index";
import { ALIEN_MINION_CANITE, ALIEN_MINION_FORMLESS, ALIEN_MINION_GREATER_CANITE, ALIEN_MINION_HYDRA, ALIEN_MINION_LARVA } from "resources/unit-ids";

export class MinionEvolveAbility extends AbilityWithDone {

    public init() {
        super.init();
        // Log.Information("Doing evolve egg thing");
        const unit = Unit.fromEvent();
        let target: number;
        let scale = 1;

        if (unit.typeId === ALIEN_MINION_LARVA) {
            target = ALIEN_MINION_CANITE;
            scale = 0.9;
        }
        else if (unit.typeId === ALIEN_MINION_CANITE) {
            target = GetRandomReal(0, 100) > 50 ? ALIEN_MINION_HYDRA : ALIEN_MINION_GREATER_CANITE;
            scale = 1.2;
        }
        else if (unit.typeId === ALIEN_MINION_GREATER_CANITE) {
            target = ALIEN_MINION_FORMLESS;
            scale = 1.5;
        }

        EventEntity.send(EVENT_TYPE.SPAWN_ALIEN_EGG_FOR, {
            source: Unit.fromHandle( GetTriggerUnit() ),
            data: { to: target, scale: scale }
        });

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
