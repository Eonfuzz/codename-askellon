import { Vector2 } from "app/types/vector2";
import { WorldEntity } from "app/world/world-entity";
import { ActionQueue } from "lib/TreeLib/ActionQueue/ActionQueue";
import { ImmediateOrders } from "lib/TreeLib/ActionQueue/Actions/ImmediateOrders";
import { UnitActionImmediate } from "lib/TreeLib/ActionQueue/Actions/UnitActionImmediate";
import { UnitActionWaypoint } from "lib/TreeLib/ActionQueue/Actions/UnitActionWaypoint";
import { WaypointOrders } from "lib/TreeLib/ActionQueue/Actions/WaypointOrders";
import { Unit } from "w3ts/index";
import { AgentState } from "./agent-state";

export class AgentEvolve extends AgentState {
    
    constructor(agent: Unit) {
        super(agent);
        
        // Get our starting unit zone
        const agentLocation = WorldEntity.getInstance().getUnitZone(agent);
        
        // We wander a random amount
        const numWanders = GetRandomInt(1, 4);
        let i = 0;
        const actions = [];
        let point: Vector2;
        while (i++ < numWanders) {
            point = agentLocation.getRandomPointInZone();
            if (point) {
                actions.push(new UnitActionWaypoint(point, WaypointOrders.attack, 800));
            }          
        }

        actions.push(new UnitActionImmediate(point, ImmediateOrders.evolve));

        // Set our queue
        this.actionQueue = ActionQueue.createUnitQueue(agent.handle, ...actions);
    }

    tick(delta: number): boolean {
        return !this.actionQueue.isFinished;
    }
}