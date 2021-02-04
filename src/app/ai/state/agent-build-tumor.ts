import { WorldEntity } from "app/world/world-entity";
import { ActionQueue } from "lib/TreeLib/ActionQueue/ActionQueue";
import { UnitActionExecuteCode } from "lib/TreeLib/ActionQueue/Actions/UnitActionExecuteCode";
import { UnitActionWaypoint } from "lib/TreeLib/ActionQueue/Actions/UnitActionWaypoint";
import { WaypointOrders } from "lib/TreeLib/ActionQueue/Actions/WaypointOrders";
import { ALIEN_STRUCTURE_TUMOR } from "resources/unit-ids";
import { Unit } from "w3ts/index";
import { AgentState } from "./agent-state";
import { AgentWander } from "./agent-wander";

export class AgentBuildTumor extends AgentState {
    
    // Potentially software gore
    // or at least an unhealthy parasitic relationship
    private wanderState: AgentWander;

    // True when we've been ordered to build
    private hasBeenOrderedToBuild: boolean = false;
    // HOWTO: Programm in java
    private timeElapsedSinceOrderedToBuild: number = 0;

    constructor(agent: Unit) {
        super(agent);
        
        // Add our wander state
        this.wanderState = new AgentWander(agent);
        this.actionQueue = this.wanderState.actionQueue;

        // Add on our action
        this.actionQueue.addAction(
            new UnitActionExecuteCode((target, timeStep, queue) => {                    
                IssueBuildOrderById(agent.handle, ALIEN_STRUCTURE_TUMOR, agent.x, agent.y);
                this.hasBeenOrderedToBuild = true;
            })

        );
    }

    tick(delta: number): boolean {
        if (this.hasBeenOrderedToBuild) {
            this.timeElapsedSinceOrderedToBuild += delta;
            // Give it a 5 second grace period before we start checking
            if (this.timeElapsedSinceOrderedToBuild > 5 && !IsUnitIdType(this.agent.currentOrder, UNIT_TYPE_STRUCTURE)) return false;
        }
        else {
            return this.actionQueue.isFinished;
        }
    }
}