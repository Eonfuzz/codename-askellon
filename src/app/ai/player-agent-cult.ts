import { PlayerStateFactory } from "app/force/player-state-entity";
import { Unit } from "w3ts/index";
import { PlayerAgent } from "./player-agent";

/**
 * A player that acts under the AI entity
 * Used to keep track of the number of units the AI has, and various states
 */
export class PlayerAgentCult extends PlayerAgent {

    public canTakeAgent(agent: Unit, ignoreLimit: boolean = false) {
        return (ignoreLimit || !this.hasMaximumAgents()) && PlayerStateFactory.CultistAIPlayer.id === agent.owner.id;
    }
}