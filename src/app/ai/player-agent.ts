import { MapPlayer } from "w3ts/index";
import { AGENT_STATE } from "./agent-state";

/**
 * A player that acts under the AI entity
 * Used to keep track of the number of units the AI has, and various states
 */
export class PlayerAgent {
    player: MapPlayer;

    private maxAgents: number;

    // A list of all agents
    private allAgents: unit[];
    // Agents and their state
    private agents = new Map<unit, AGENT_STATE>();
    // The number of agents in a state
    private stateCount = new Map<AGENT_STATE, number>();

    constructor(maxAgents: number = 33) {
        this.maxAgents = maxAgents;
    }

    public hasMaximumAgents() {
        return this.allAgents.length > 33;
    }
}