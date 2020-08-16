import { Entity } from "app/entity-type";
import { Hooks } from "lib/Hooks";
import { BuildGraph } from "./graph-builder";
import { Log } from "lib/serilog/serilog";
import { ZONE_TYPE } from "app/world/zone-id";
import { COL_MISC } from "resources/colours";
import { Graph } from "./pathfinding/graph";
import { ActionQueue } from "lib/TreeLib/ActionQueue/ActionQueue";
import { UnitActionWaypoint } from "lib/TreeLib/ActionQueue/Actions/UnitActionWaypoint";
import { Vector2 } from "app/types/vector2";
import { UnitAction } from "lib/TreeLib/ActionQueue/Actions/UnitAction";
import { WaypointOrders } from "lib/TreeLib/ActionQueue/Actions/WaypointOrders";
import { UnitActionInteract } from "lib/TreeLib/ActionQueue/Actions/UnitActionInteract";

export class AIEntity extends Entity {
    private static instance: AIEntity;

    private pathfindingGraph: Graph;

    public static getInstance() {        
        if (this.instance == null) {
            this.instance = new AIEntity();
            Hooks.set(this.name, this.instance);
        }
        return this.instance;
    }

    constructor() {
        super();
        this.pathfindingGraph = BuildGraph();
    }

    /**
     * Constructs edges and pathways based on our zone details
     */
    public sendUnitTo(whichUnit: unit, from: ZONE_TYPE, to: ZONE_TYPE) {
        const path = this.pathfindingGraph.pathTo(from, to);
        if (path) {
            const actions: UnitAction[] = [];
            path.edges.forEach(edge => {
                actions.push(new UnitActionWaypoint(Vector2.fromWidget(edge.unit.handle), WaypointOrders.attack, 600));
                actions.push(new UnitActionInteract(edge.unit.handle));
            });
            ActionQueue.createUnitQueue(whichUnit, ...actions);
        }
    }

    step() {}
}