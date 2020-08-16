import { MapPlayer, Unit } from "w3ts/index";
import { AGENT_STATE } from "./agent-state";
import { Quick } from "lib/Quick";
import { Log } from "lib/serilog/serilog";
import { Graph } from "./pathfinding/graph";
import { WorldEntity } from "app/world/world-entity";
import { ZONE_TYPE } from "app/world/zone-id";
import { ActionQueue } from "lib/TreeLib/ActionQueue/ActionQueue";
import { UnitAction } from "lib/TreeLib/ActionQueue/Actions/UnitAction";
import { UnitActionWaypoint } from "lib/TreeLib/ActionQueue/Actions/UnitActionWaypoint";
import { UnitActionInteract } from "lib/TreeLib/ActionQueue/Actions/UnitActionInteract";
import { WaypointOrders } from "lib/TreeLib/ActionQueue/Actions/WaypointOrders";
import { Vector2 } from "app/types/vector2";
import { UnitActionExecuteCode } from "lib/TreeLib/ActionQueue/Actions/UnitActionExecuteCode";
import { CrewFactory } from "app/crewmember/crewmember-factory";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { CREW_FORCE_NAME } from "app/force/forces/force-names";
import { UnitQueue } from "lib/TreeLib/ActionQueue/Queues/UnitQueue";
import { BUFF_ID_DESPAIR } from "resources/buff-ids";

/**
 * A player that acts under the AI entity
 * Used to keep track of the number of units the AI has, and various states
 */
export class PlayerAgent {
    player: MapPlayer;

    private maxAgents: number;
    private pathingGraph: Graph;

    // A list of all agents
    private allAgents: unit[] = [];

    // Agents and their state
    // private stateToUnits = new Map<AGENT_STATE, unit[]>();
    // private unitToState = new Map<unit, AGENT_STATE>();
    // private unitToOrderQueue = new Map<unit, UnitQueue>();

    // Units without orders


    constructor(player: MapPlayer, pathingGraph: Graph, maxAgents: number = 33) {
        this.maxAgents = maxAgents;
        this.player = player;
        this.pathingGraph = pathingGraph;
    }

    public removeAgent(agent: unit) {
        const idx = this.allAgents.indexOf(agent);

        if (idx >= 0) {
            // const unitState = this.unitToState.get(agent);
            Quick.Slice(this.allAgents, idx);
            // this.unitToState.delete(agent);
            // this.unitToOrderQueue.delete(agent);
            // const unitsStateList = this.stateToUnits.get(unitState);
            // Quick.Slice(unitsStateList, unitsStateList.indexOf(agent));
        }
        else {
            Log.Information("Remove agent failed?!");
        }
    }

    private generateState() {
        // first decide the state
        const seed = GetRandomInt(0, 100);

        // 25% to go to a random floor
        if (seed >= 75) {
            return AGENT_STATE.TRAVEL;
        }
        // 40% to seek a random player
        // If no players are available it wanders
        else if (seed >= 10) {
            return AGENT_STATE.SEEK;
        }
        // 20% to wander on current floor
        else  {
            return AGENT_STATE.WANDER;
        }
    }

    public addAgent(agent: unit) {
        const agentState = this.generateState();
        // Add it to our agents array
        this.allAgents.push(agent);

        this.enactStateOnAgent(agent, agentState);
    }

    public hasMaximumAgents() {
        return this.allAgents.length > 33;
    }

    public getCurrentAgents() {
        return this.allAgents.length;
    }

    private enactStateOnAgent(agent: unit, state: AGENT_STATE) {
        if (state === AGENT_STATE.SEEK) {
            // Log.Information("Seek Start");
            const visibleCrew: Unit[] = [];

            const humanPlayers = PlayerStateFactory.getForce(CREW_FORCE_NAME);
            const allHumans = humanPlayers.getPlayers();

            allHumans.forEach(human => {
                const crew = PlayerStateFactory.getCrewmember(human);
                // if (crew) Log.Information("Checking crew is visible "+crew.unit.nameProper);
                if (crew && UnitAlive(crew.unit.handle) && 
                (IsUnitVisible(crew.unit.handle, this.player.handle) || UnitHasBuffBJ(crew.unit.handle, BUFF_ID_DESPAIR))) {
                    // Log.Information("Crew is visible crew is alive "+crew.unit.nameProper);
                    visibleCrew.push(crew.unit);
                }
            })

            if (visibleCrew.length === 0) {
                const i = GetRandomInt(0, 10);
                if (i > 5) state = AGENT_STATE.WANDER;
                else state = AGENT_STATE.TRAVEL;
                // Log.Information("AI cannot see any crew...");
            } 
            else {
                const target = visibleCrew[GetRandomInt(0, visibleCrew.length - 1)];
                const targetLocation = WorldEntity.getInstance().getUnitZone(target);
                if (!targetLocation) {
                    // Log.Error("Failed to find target location for seek AI");
                    state = AGENT_STATE.WANDER;
                }
                else {
                    const agentLocation = WorldEntity.getInstance().getUnitZone(Unit.fromHandle(agent));

                    const attackOrder = new UnitActionWaypoint(Vector2.fromWidget(target.handle), WaypointOrders.attack, 100);
                    const newOrders = new UnitActionExecuteCode((target, timeStep, queue) => this.enactStateOnAgent(agent, this.generateState()));

                    const queue = this.sendUnitTo(agent, agentLocation.id, targetLocation.id);
                    if (queue) {
                        queue.addAction(attackOrder);
                        queue.addAction(newOrders);
                    }
                    else {
                        ActionQueue.createUnitQueue(agent, attackOrder, newOrders);
                    }
                }
            }
        } 
        if (state === AGENT_STATE.WANDER) {
            // Log.Information("Wander start");
            const agentLocation = WorldEntity.getInstance().getUnitZone(Unit.fromHandle(agent));
            // We wander a random amount
            const numWanders = GetRandomInt(1, 4);
            let i = 0;
            const actions = [];
            while (i++ < numWanders) {
                const point = agentLocation.getRandomPointInZone();
                if (point) {
                    actions.push(new UnitActionWaypoint(point, WaypointOrders.attack, 450));
                }          
            }
            actions.push(new UnitActionExecuteCode((target, timeStep, queue) => {
                this.enactStateOnAgent(agent, this.generateState());
            }));

            const queue = ActionQueue.createUnitQueue(agent, ...actions);
        }
        if (state === AGENT_STATE.TRAVEL) {
            // Log.Information("Travel start");
            const agentLocation = WorldEntity.getInstance().getUnitZone(Unit.fromHandle(agent));
            const ourFloor = this.pathingGraph.nodeDict.get(agentLocation.id);
            const randomLocation = ourFloor.connectedNodes[GetRandomInt(0, ourFloor.connectedNodes.length - 1)];

            const queue = this.sendUnitTo(agent, agentLocation.id, randomLocation.zone.id);
            if (queue) {
                queue.addAction(new UnitActionExecuteCode((target, timeStep, queue) => {
                    this.enactStateOnAgent(agent, this.generateState());
                }));
            }
        }
    }

    /**
     * Constructs edges and pathways based on our zone details
     */
    private sendUnitTo(whichUnit: unit, from: ZONE_TYPE, to: ZONE_TYPE): UnitQueue | undefined {
        const path = this.pathingGraph.pathTo(from, to);
        if (path && path.edges.length > 0) {
            const actions: UnitAction[] = [];
            path.edges.forEach(edge => {
                if (!IsUnitVisible(edge.unit.handle, this.player.handle)) {
                    UnitShareVision(edge.unit.handle, this.player.handle, true);
                }
                actions.push(new UnitActionWaypoint(Vector2.fromWidget(edge.unit.handle), WaypointOrders.attack, 200));
                actions.push(new UnitActionInteract(edge.unit.handle));
            });
            return ActionQueue.createUnitQueue(whichUnit, ...actions);
        }
    }
}