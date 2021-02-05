import { Vector2 } from "app/types/vector2";
import { WorldEntity } from "app/world/world-entity";
import { ZONE_TYPE } from "app/world/zone-id";
import { Log } from "lib/serilog/serilog";
import { ActionQueue } from "lib/TreeLib/ActionQueue/ActionQueue";
import { UnitAction } from "lib/TreeLib/ActionQueue/Actions/UnitAction";
import { UnitActionInteract } from "lib/TreeLib/ActionQueue/Actions/UnitActionInteract";
import { UnitActionWaypoint } from "lib/TreeLib/ActionQueue/Actions/UnitActionWaypoint";
import { WaypointOrders } from "lib/TreeLib/ActionQueue/Actions/WaypointOrders";
import { Unit } from "w3ts/index";
import { NodeGraph } from "../graph-builder";
import { Graph } from "../pathfinding/graph";
import { Path } from "../pathfinding/path";
import { AgentState } from "./agent-state";

/**
 * Travels to a certain floor
 */
export class AgentTravel extends AgentState {
    
    /**
     * If passed path, the travel agent will use that instead
     * @param agent 
     * @param path 
     */
    constructor(agent: Unit, path?: Path) {
        super(agent);

        // Log.Information("Beginning agent travel");

        let queue: UnitAction[];

        // Log.Information("Getting path");
        // Just use our path if received
        if (path) {
            queue = this.pathToQueue(path);
        }
        // Generate a new one otherwise
        else {
            // Log.Information("Loading graph");
            const pathingGraph = NodeGraph.getGraph();
            
            const agentLocation = WorldEntity.getInstance().getUnitZone(agent);
            const ourFloor = pathingGraph.nodeDict.get(agentLocation.id);

            // Log.Information(`our pos ${agentLocation.id} our floor connections #${ourFloor.connectedNodes.map(z => ZONE_TYPE[z.zone.id]).join(', ')}`);
    
            if (ourFloor.connectedNodes.length > 0) {
                const randomLocation = ourFloor.connectedNodes[GetRandomInt(0, ourFloor.connectedNodes.length - 1)];
    
                queue = this.sendUnitTo(pathingGraph, agentLocation.id, randomLocation.zone.id);
            }
        }

        if (queue) {
            // Set our queue
            this.actionQueue = ActionQueue.createUnitQueue(agent.handle, ...queue);
        }
        else {
            error('');
        }
    }

    /**
     * Constructs edges and pathways based on our zone details
     */
    private sendUnitTo(pathingGraph: Graph, from: ZONE_TYPE, to: ZONE_TYPE): UnitAction[] | undefined {
        if (from === to) return;

        // Log.Information("Getting paths...");
        const path = pathingGraph.pathTo(from, to);
        // Log.Information(`Travel paths: ${path ? path.edges.length : 'nil'}`)
        if (path && path.edges.length > 0) {
            return this.pathToQueue(path);
        }
    }

    private pathToQueue(path: Path): UnitAction[] {
        const actions: UnitAction[] = [];
        path.edges.forEach(edge => {
            // Attack move the ground underneath the goal
            actions.push(new UnitActionWaypoint(Vector2.fromWidget(edge.unit.handle), WaypointOrders.attack, 450));
            // Then Interact with the goal to travel
            actions.push(new UnitActionInteract(edge.unit.handle));
        });
        return actions;

    }

    tick(delta: number): boolean {
        return !this.actionQueue.isFinished;
    }
}