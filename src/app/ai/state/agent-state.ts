import { ActionQueue } from "lib/TreeLib/ActionQueue/ActionQueue";
import { UnitQueue } from "lib/TreeLib/ActionQueue/Queues/UnitQueue";
import { Unit } from "w3ts/index";

export abstract class AgentState {

    // The agent we act upon
    public agent: Unit;
    // Our action queue
    public actionQueue: UnitQueue;

    constructor(agent: Unit) {
        this.agent = agent;
    }
    /**
     * Process the agent's state, returns false if complete
     * @param delta 
     */
    abstract tick(delta: number): boolean;
}