import { WorldEntity } from "app/world/world-entity";
import { ActionQueue } from "lib/TreeLib/ActionQueue/ActionQueue";
import { UnitActionWaypoint } from "lib/TreeLib/ActionQueue/Actions/UnitActionWaypoint";
import { WaypointOrders } from "lib/TreeLib/ActionQueue/Actions/WaypointOrders";
import { Unit } from "w3ts/index";
import { AgentState } from "./agent-state";

export class AgentWander extends AgentState {
    
    constructor(agent: Unit) {
        super(agent);
        
        // Get our starting unit zone
        const agentLocation = WorldEntity.getInstance().getUnitZone(agent);

        // We wander a random amount
        const numWanders = GetRandomInt(1, 4);
        let i = 0;
        const actions = [];
        while (i++ < numWanders) {
            const point = agentLocation.getRandomPointInZone();
            if (point) {
                actions.push(new UnitActionWaypoint(point, WaypointOrders.attack, 800));
            }          
        }

        // Set our queue
        this.actionQueue = ActionQueue.createUnitQueue(agent.handle, ...actions);
    }

    tick(delta: number): boolean {
        return this.actionQueue.isFinished;
    }
}