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
import { EventListener } from "app/events/event-type";
import { EVENT_TYPE } from "app/events/event-enum";
import { EventEntity } from "app/events/event-entity";
import { ALIEN_MINION_LARVA, ALIEN_STRUCTURE_TUMOR } from "resources/unit-ids";
import { UnitActionImmediate } from "lib/TreeLib/ActionQueue/Actions/UnitActionImmediate";
import { ImmediateOrders } from "lib/TreeLib/ActionQueue/Actions/ImmediateOrders";
import { Timers } from "app/timer-type";

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
    private actionQueue = new Map<unit, UnitQueue>();

    // Agents and their state
    // private stateToUnits = new Map<AGENT_STATE, unit[]>();
    // private unitToState = new Map<unit, AGENT_STATE>();
    // private unitToOrderQueue = new Map<unit, UnitQueue>();

    // Units without orders

    constructor(player: MapPlayer, pathingGraph: Graph, maxAgents: number = 33) {
        this.maxAgents = maxAgents;
        this.player = player;
        this.pathingGraph = pathingGraph;

        EventEntity.listen(new EventListener(EVENT_TYPE.UNIT_REMOVED_FROM_GAME, (self, data) => {
            // Log.Information("World entity caught unit remove")
            this.removeAgent(data.source.handle);
        }));
    }

    public removeAgent(agent: unit) {
        if (GetOwningPlayer(agent) !== this.player.handle) return;


        const idx = this.allAgents.indexOf(agent);

        if (idx >= 0) {
            // const unitState = this.unitToState.get(agent);
            Quick.Slice(this.allAgents, idx);
            this.actionQueue.delete(agent);
            // this.unitToState.delete(agent);
            // this.unitToOrderQueue.delete(agent);
            // const unitsStateList = this.stateToUnits.get(unitState);
            // Quick.Slice(unitsStateList, unitsStateList.indexOf(agent));
            // Log.Information("Remove agent");
        }
        else {
            // Log.Information("Remove agent failed?!");
        }
    }

    private generateState(whichAgent: unit) {

        const uType = GetUnitTypeId(whichAgent);

        // first decide the state
        const seed = GetRandomInt(0, 100);

        /**
         * Larvas either travel to hatch or travel to make tumors
         */
        if (uType === ALIEN_MINION_LARVA) {
            // Log.Information("LARVA");
            if (seed >= 60) {
                // Log.Information("BUILD TUMOR");
                return AGENT_STATE.BUILD_TUMOR;
            }
            if (seed >= 30) {
                // Log.Information("EVOLVE");
                return AGENT_STATE.EVOLVE;
            }
            // Log.Information("TRAVEL");
            return AGENT_STATE.TRAVEL;
        }

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
        const agentState = this.generateState(agent);
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
                if (crew && UnitAlive(crew.unit.handle) && (IsUnitVisible(crew.unit.handle, this.player.handle) || UnitHasBuffBJ(crew.unit.handle, BUFF_ID_DESPAIR))) {
                    visibleCrew.push(crew.unit);
                }
            })

            if (visibleCrew.length === 0) {
                const i = GetRandomInt(0, 10);
                if (i > 5) state = AGENT_STATE.WANDER;
                else state = AGENT_STATE.TRAVEL;
            } 
            else {
                const target = visibleCrew[GetRandomInt(0, visibleCrew.length - 1)];
                const targetLocation = WorldEntity.getInstance().getUnitZone(target);
                if (!targetLocation) {
                    state = AGENT_STATE.WANDER;
                }
                else {
                    const agentLocation = WorldEntity.getInstance().getUnitZone(Unit.fromHandle(agent));

                    const attackOrder = new UnitActionWaypoint(Vector2.fromWidget(target.handle), WaypointOrders.attack, 100);
                    const newOrders = new UnitActionExecuteCode((target, timeStep, queue) => this.enactStateOnAgent(agent, this.generateState(agent)));

                    const queue = this.sendUnitTo(agent, agentLocation.id, targetLocation.id);
                    if (queue) {
                        queue.addAction(attackOrder);
                        queue.addAction(newOrders);
                        this.actionQueue.set(agent, queue);
                    }
                    else {
                        this.actionQueue.set(agent, ActionQueue.createUnitQueue(agent, attackOrder, newOrders));
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
                this.enactStateOnAgent(agent, this.generateState(agent));
            }));

            this.actionQueue.set(agent, ActionQueue.createUnitQueue(agent, ...actions));
        }
        if (state === AGENT_STATE.TRAVEL) {
            const agentLocation = WorldEntity.getInstance().getUnitZone(Unit.fromHandle(agent));
            const ourFloor = this.pathingGraph.nodeDict.get(agentLocation.id);
            const randomLocation = ourFloor.connectedNodes[GetRandomInt(0, ourFloor.connectedNodes.length - 1)];

            const queue = this.sendUnitTo(agent, agentLocation.id, randomLocation.zone.id);
            if (queue) {
                queue.addAction(new UnitActionExecuteCode((target, timeStep, queue) => {
                    this.enactStateOnAgent(agent, this.generateState(agent));
                }));
            }
            this.actionQueue.set(agent, queue);
        }
        if (state === AGENT_STATE.BUILD_TUMOR) {
            // Log.Information("Wander start");
            const agentLocation = WorldEntity.getInstance().getUnitZone(Unit.fromHandle(agent));
            // We wander a random amount
            const numWanders = GetRandomInt(1, 2);
            let i = 0;
            const actions = [];
            while (i++ < numWanders) {
                const point = agentLocation.getRandomPointInZone();
                if (point) {
                    actions.push(new UnitActionWaypoint(point, WaypointOrders.attack, 450));
                }          
            }
            actions.push(new UnitActionExecuteCode((target, timeStep, queue) => {                    
                IssueBuildOrderById(agent, ALIEN_STRUCTURE_TUMOR, GetUnitX(agent), GetUnitY(agent));
                Timers.addTimedAction(60, () => {
                    if (UnitAlive(agent)) {
                        this.enactStateOnAgent(agent, this.generateState(agent));
                    }
                })
            }));
            const queue = ActionQueue.createUnitQueue(agent, ...actions);
            this.actionQueue.set(agent, queue);
        }
        if (state === AGENT_STATE.EVOLVE) {
            // Log.Information("Wander start");
            const agentLocation = WorldEntity.getInstance().getUnitZone(Unit.fromHandle(agent));
            // We wander a random amount
            const numWanders = GetRandomInt(2, 4);
            let i = 0;
            const actions = [];
            while (i++ < numWanders) {
                const point = agentLocation.getRandomPointInZone();
                if (point) {
                    if (i !== numWanders) actions.push(new UnitActionWaypoint(point, WaypointOrders.attack, 450));
                    if (i === numWanders) {
                        actions.push(new UnitActionImmediate(point, ImmediateOrders.evolve));
                    }
                }          
            }
            const queue = ActionQueue.createUnitQueue(agent, ...actions);
            this.actionQueue.set(agent, queue);
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

    public debugUnit(whichUnit: unit) {
        if (this.actionQueue.has(whichUnit)) {
            const queue = this.actionQueue.get(whichUnit);
            const uZone = WorldEntity.getInstance().getUnitZone(Unit.fromHandle(whichUnit));

            const pointZone = WorldEntity.getInstance().getPointZone(GetUnitX(whichUnit), GetUnitY(whichUnit));
            Log.Information(`Agent ${GetUnitName(whichUnit)} for: `+this.player.name+`(${this.player.id}) in ${ uZone ? ZONE_TYPE[uZone.id] : 'invalid' }`);
            Log.Information(`Point zone is: ${pointZone ? ZONE_TYPE[pointZone.id] : 'invalid'}`)
            queue.allActions.forEach((action, index) => {
                Log.Information(`${index}::${action}`)
            });
        }
        else {
            // Log.Information(`${this.player.name} does not have ${GetUnitName(whichUnit)}`);
        }
    }

    public hasAgent(whichUnit: unit) {
        return this.actionQueue.has(whichUnit);
    }
}