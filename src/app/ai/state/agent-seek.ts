import { CREW_FORCE_NAME } from "app/force/forces/force-names";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { Vector2 } from "app/types/vector2";
import { WorldEntity } from "app/world/world-entity";
import { ZONE_TYPE } from "app/world/zone-id";
import { Zone } from "app/world/zone-types/zone-type";
import { Quick } from "lib/Quick";
import { Log } from "lib/serilog/serilog";
import { ActionQueue } from "lib/TreeLib/ActionQueue/ActionQueue";
import { UnitActionExecuteCode } from "lib/TreeLib/ActionQueue/Actions/UnitActionExecuteCode";
import { UnitActionWaypoint } from "lib/TreeLib/ActionQueue/Actions/UnitActionWaypoint";
import { WaypointOrders } from "lib/TreeLib/ActionQueue/Actions/WaypointOrders";
import { UnitQueue } from "lib/TreeLib/ActionQueue/Queues/UnitQueue";
import { BUFF_ID_DESPAIR } from "resources/buff-ids";
import { Unit } from "w3ts/index";
import { NodeGraph } from "../graph-builder";
import { Path } from "../pathfinding/path";
import { AgentState } from "./agent-state";
import { AgentTravel } from "./agent-travel";

export class AgentSeek extends AgentState {
    
    // Potentially software gore
    // or at least an unhealthy parasitic relationship
    private travelState: AgentTravel | undefined;
    // The target of our seek
    private seekTarget: Unit;
    private seekTargetOldLocation: Zone;


    constructor(agent: Unit) {
        super(agent);
        
        // Get our starting unit zone
        const agentLocation = WorldEntity.getInstance().getUnitZone(agent);

        // Find a visible crewmember
        const seekTarget = this.findSeekTarget(agentLocation);

        if (seekTarget) {
            // Assign our target
            this.seekTarget = seekTarget.target;
            // Assign our last known location
            this.seekTargetOldLocation = seekTarget.loc;
            // Create a sub agent travel
            try {
                this.travelState = new AgentTravel(this.agent, seekTarget.path);
                this.travelState.actionQueue.addAction(new UnitActionWaypoint(Vector2.fromWidget(this.seekTarget.handle), WaypointOrders.attack, 450));
                this.actionQueue = this.travelState.actionQueue;
            }
            catch(e) {
                this.travelState = undefined;
                this.actionQueue = ActionQueue.createUnitQueue(agent.handle, 
                    new UnitActionWaypoint(Vector2.fromWidget(this.seekTarget.handle), WaypointOrders.attack, 450)
                );
            }
        }
        else {
            error(`Failed to find seek target`);
        }
    }

    /**
     * Finds a seek target
     * for now it just iterates through all living crewmembers
     */
    private findSeekTarget(agentLocation: Zone): { target: Unit, path: Path, loc: Zone } | undefined {

        // Grab all human players
        const humanPlayers = PlayerStateFactory.getForce(CREW_FORCE_NAME);
        const allHumans = humanPlayers.getPlayers();

        // All our possible targets
        const targets = [];

        allHumans.forEach(human => {
            const crew = PlayerStateFactory.getCrewmember(human);
            const targetLocation = crew && WorldEntity.getInstance().getUnitZone(crew.unit);
            // If the target is a crew, alive AND visible
            if (crew && UnitAlive(crew.unit.handle) && targetLocation && this.isVisibleOrHasDespair(crew.unit)) {
                // Make sure we can path to it
                let path = NodeGraph.getGraph().pathTo(agentLocation.id, targetLocation.id)
                if (path) {
                    targets.push({ target: crew.unit, path: path, loc: targetLocation });
                }
            }
        });

        return Quick.GetRandomFromArray(targets, 1)[0];
    }

    private recalculateTargetPath(target: Unit): { target: Unit, path: Path, loc: Zone } | undefined  {

        const targetLocation = target && WorldEntity.getInstance().getUnitZone(target);
        // If the target is a crew, alive AND visible
        if (targetLocation) {

            const agentLocation = WorldEntity.getInstance().getUnitZone(this.agent);
            // Make sure we can path to it
            let path = NodeGraph.getGraph().pathTo(agentLocation.id, targetLocation.id)
            if (path) {
                return { target: target, path: path, loc: targetLocation };
            }
        }
    }

    private ticker = 0;
    private CHECK_LOC_EVERY = 10;

    tick(delta: number): boolean {
        this.ticker += delta;

        // Every X seconds we need to check that this seek state is still valid
        if (this.ticker >= this.CHECK_LOC_EVERY) {
            this.ticker -= this.CHECK_LOC_EVERY;

            // Is our target dead?
            if (!this.seekTarget.isAlive()) return false;
            // Is our target still visible?
            if (!this.isVisibleOrHasDespair(this.seekTarget)) return false;
            // Has our target moved locations?
            if (this.seekTargetOldLocation != WorldEntity.getInstance().getUnitZone(this.seekTarget)) {
                const data = this.recalculateTargetPath(this.seekTarget);
                // Can we still path to our target?
                if (!data) return false;
                // Otherwise lets recalculate the path
                try {
                    this.travelState = new AgentTravel(this.agent, data.path);
                    this.travelState.actionQueue.addAction(new UnitActionWaypoint(Vector2.fromWidget(this.seekTarget.handle), WaypointOrders.attack, 450));
                    this.actionQueue = this.travelState.actionQueue;
                }
                catch(e) {
                    this.travelState = undefined;
                    this.actionQueue = ActionQueue.createUnitQueue(this.agent.handle, 
                        new UnitActionWaypoint(Vector2.fromWidget(this.seekTarget.handle), WaypointOrders.attack, 450)
                    );
                }
            }
        }

        // We finish when our attack move is finished
        return !this.actionQueue.isFinished;
    }


    private isVisibleOrHasDespair(who: Unit): boolean {
        return UnitHasBuffBJ(who.handle, BUFF_ID_DESPAIR);
    }
}