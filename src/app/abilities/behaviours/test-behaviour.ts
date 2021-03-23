import { MessageAllPlayers } from "lib/utils";
import { Behaviour } from "../behaviour";
import { ABILITY_HOOK } from "../hook-types";

export class TestBehaviour extends Behaviour {
    
    constructor() {
        super();
        MessageAllPlayers("Creating test behaviour");
    }

    public onEvent(event: ABILITY_HOOK) {
        MessageAllPlayers(`${this.forUnit.name} :: `+ABILITY_HOOK[event]);
    }

    /**
     * Iterate upon this instance of the aiblity
     */
    public step(deltaTime: number) {}

    public doDestroy() {
        if (!this.forUnit.isAlive()) return true;
        return false;
    }

    public destroy() {}
}