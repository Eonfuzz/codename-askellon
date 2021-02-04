import { MapPlayer, Unit } from "w3ts/index";
import { AGENT_STATE } from "./agent-state";
import { Log } from "lib/serilog/serilog";
import { WorldEntity } from "app/world/world-entity";
import { ZONE_TYPE } from "app/world/zone-id";
import { EventListener } from "app/events/event-type";
import { EVENT_TYPE } from "app/events/event-enum";
import { EventEntity } from "app/events/event-entity";
import { ALIEN_MINION_LARVA, ALIEN_STRUCTURE_TUMOR } from "resources/unit-ids";
import { COL_MISC, COL_GOOD } from "resources/colours";
import { AgentState } from "./state/agent-state";
import { AgentSeek } from "./state/agent-seek";
import { AgentTravel } from "./state/agent-travel";
import { AgentWander } from "./state/agent-wander";
import { AgentBuildTumor } from "./state/agent-build-tumor";

/**
 * A player that acts under the AI entity
 * Used to keep track of the number of units the AI has, and various states
 */
export class PlayerAgent {
    player: MapPlayer;

    private agentCount = 0;
    private maxAgents: number;

    // A list of all agents
    private agents = new WeakMap<Unit, AgentState>();


    constructor(player: MapPlayer, maxAgents: number = 33) {
        this.maxAgents = maxAgents;
        this.player = player;

        EventEntity.listen(new EventListener(EVENT_TYPE.UNIT_REMOVED_FROM_GAME, (self, data) => {
            // Log.Information("World entity caught unit remove")
            this.removeAgent(data.source);
        }));

        // Reveal the map to the AI agents
        
        const m = CreateFogModifierRect(this.player.handle, FOG_OF_WAR_VISIBLE, gg_rct_stationtempvision, true, false);
        FogModifierStart(m);
    }

    public removeAgent(agent: Unit) {
        if (agent.owner !== this.player) return;
        if (this.agents.has(agent)) {
            // Decrement our agent count
            this.agentCount--;
            this.agents.delete(agent);
        }
    }

    private generateState(whichAgent: Unit) {

        const uType = whichAgent.typeId;

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

    public addAgent(agent: Unit) {
        const agentStateId = this.generateState(agent);
        const agentState = this.enactStateOnAgent(agent, agentStateId);
        if (agentState) {
            // Increment our agent count
            this.agentCount++;
            this.agents.set(agent, agentState);
            
        }
    }

    public hasMaximumAgents() {
        return this.agentCount >= this.maxAgents;
    }

    public getCurrentAgents() {
        return this.agentCount;
    }

    private enactStateOnAgent(agent: Unit, state: AGENT_STATE): AgentState | undefined {
        if (state === AGENT_STATE.SEEK) {
            return new AgentSeek(agent);
        } 
        if (state === AGENT_STATE.TRAVEL) {
            return new AgentTravel(agent);
        }
        if (state === AGENT_STATE.WANDER) {
            return new AgentWander(agent);
        }
        if (state === AGENT_STATE.BUILD_TUMOR) {
            return new AgentBuildTumor(agent);
        }
        if (state === AGENT_STATE.EVOLVE) {
            // TODO FIX ME
            // // Log.Information("Wander start");
            // const agentLocation = WorldEntity.getInstance().getUnitZone(Unit.fromHandle(agent));
            // // We wander a random amount
            // const numWanders = GetRandomInt(2, 4);
            // let i = 0;
            // const actions = [];
            // while (i++ < numWanders) {
            //     const point = agentLocation.getRandomPointInZone();
            //     if (point) {
            //         if (i !== numWanders) actions.push(new UnitActionWaypoint(point, WaypointOrders.attack, 800));
            //         if (i === numWanders) {
            //             actions.push(new UnitActionImmediate(point, ImmediateOrders.evolve));
            //         }
            //     }          
            // }
            // const queue = ActionQueue.createUnitQueue(agent, ...actions);
            // this.actionQueue.set(agent, queue);
        }
    }

    public debugUnit(whichUnit: Unit) {
        const state = this.agents.get(whichUnit);
        if (state) {
            const queue = state.actionQueue;
            const uZone = WorldEntity.getInstance().getUnitZone(whichUnit);

            const pointZone = WorldEntity.getInstance().getPointZone(whichUnit.x, whichUnit.y);
            Log.Information(`${whichUnit.name} ${this.player.id}:`+this.player.name+` in ${ uZone ? ZONE_TYPE[uZone.id] : 'invalid' }`);
            Log.Information(`Location: ${pointZone ? ZONE_TYPE[pointZone.id] : 'invalid'}`)
            
            queue.allActions.forEach((action, index) => {
                let isActive = queue.currentActionIndex === index;
                Log.Information(`[${isActive ? COL_GOOD : COL_MISC}${index}|r] ${action}`)
            });
        }
    }

    public hasAgent(whichUnit: Unit) {
        return this.agents.has(whichUnit);
    }

    // Updates our agent behaviours
    public step(delta: number) {

    }
}