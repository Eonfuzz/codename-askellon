import { AbilityWithDone } from "../ability-type";
import { EventEntity } from "app/events/event-entity";
import { EVENT_TYPE } from "app/events/event-enum";
import { Unit, MapPlayer, playerColors } from "w3ts/index";
import { Log } from "lib/serilog/serilog";

export class AdministrationBeginTargetingPlayersAbility extends AbilityWithDone {
    

    public init() {
        super.init();
        const u = Unit.fromHandle(GetTriggerUnit());    
        EventEntity.send(EVENT_TYPE.INTERACT_TERMINAL, { source: u, data: { target: u }});
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