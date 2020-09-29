import { Entity } from "app/entity-type";
import { Hooks } from "lib/Hooks";
import { BuildGraph } from "./graph-builder";
import { Log } from "lib/serilog/serilog";
import { ZONE_TYPE } from "app/world/zone-id";
import { Graph } from "./pathfinding/graph";
import { PlayerAgent } from "./player-agent";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { MapPlayer, Unit } from "w3ts/index";
import { WorldEntity } from "app/world/world-entity";
import { EventEntity } from "app/events/event-entity";
import { EventListener } from "app/events/event-type";
import { EVENT_TYPE } from "app/events/event-enum";
import { UNIT_ID_NEUTRAL_BEAR, ALIEN_MINION_FORMLESS, ALIEN_MINION_CANITE } from "resources/unit-ids";

export class AIEntity extends Entity {
    private static instance: AIEntity;
    public static getInstance() {        
        if (this.instance == null) {
            this.instance = new AIEntity();
            Hooks.set(this.name, this.instance);
        }
        return this.instance;
    }

    /**
     * Class def
     */
    private pathfindingGraph: Graph;

    private playerToAgent: Map<MapPlayer, PlayerAgent>;
    private playerAgents: PlayerAgent[];

    constructor() {
        super();
        this.pathfindingGraph = BuildGraph();
        this.playerToAgent = new Map<MapPlayer, PlayerAgent>();
        this.playerAgents = [];

        // Create agents
        PlayerStateFactory.getAlienAI().forEach(p => {
            const agent = new PlayerAgent(p, this.pathfindingGraph, 33);
            this.playerAgents.push(agent);
            this.playerToAgent.set(agent.player, agent);
        })

        /**
         * Listen to create AI minion requests
         */
        EventEntity.listen(new EventListener(EVENT_TYPE.SPAWN_ALIEN_MINION_FOR, (self, ev) => {
            const forWho = ev.source;
            const z = WorldEntity.getInstance().getPointZone(forWho.x, forWho.y);

            if (!z) return;

            if (forWho.typeId === UNIT_ID_NEUTRAL_BEAR) {
                AIEntity.createAddAgent(ALIEN_MINION_FORMLESS  , ev.source.x, ev.source.y, z.id);
            }
            else {
                AIEntity.createAddAgent(ALIEN_MINION_CANITE  , ev.source.x, ev.source.y, z.id);
            }
        }))
    }

    /**
     * Returns a player agent that can have more agents
     * @param ignoreLimit 
     */
    public getBestPlayerAgent(ignoreLimit: boolean = false): PlayerAgent | undefined {
        // Search through our agents and add
        for (let i = 0; i< this.playerAgents.length; i++) {
            const agent = this.playerAgents[i];
            if (!agent.hasMaximumAgents()) {
                return agent;
            }
        }

        // Otherwise our agents are at max
        // Can we ignore limit?
        if (ignoreLimit) {
            // Find agent with least amound of units
            let leastUnitAgent: PlayerAgent = undefined;
            for (let i = 0; i< this.playerAgents.length; i++) {
                const agent = this.playerAgents[i];
                if (!leastUnitAgent || leastUnitAgent.getCurrentAgents() > agent.getCurrentAgents()) {
                    leastUnitAgent = agent;
                }
            }
            // Now create
            return leastUnitAgent;
        }
        return undefined;
    }

    step() {}

    getAgentforPlayer(who: MapPlayer): PlayerAgent | undefined {
        return this.playerToAgent.get(who);
    }

    /**
     * STATIC API
     */

     /**
      * Requries the unit to be currently owned by an agent user
      * @param whichUnit 
      */
    public static addAgent(whichUnit: unit) {
        const instance = this.getInstance();

        const playerAgent = instance.getAgentforPlayer(MapPlayer.fromHandle(GetOwningPlayer(whichUnit)));

        if (playerAgent) {
            playerAgent.addAgent(whichUnit);
        }
    }

    /**
     * Creates the unit type under an agent with empty "control" slots
     * Returns undefined if all agent slots were full at the time of create request
     * @param whichUnitType 
     * @param x 
     * @param y 
     * @param ignoreLimit 
     */
    public static createAddAgent(whichUnitType: number, x: number, y: number, zone: ZONE_TYPE, ignoreLimit: boolean = false): unit | undefined {
        try {
            const instance = this.getInstance();
            const createFor = instance.getBestPlayerAgent(ignoreLimit);
            
            if (createFor) {
                const unit = CreateUnit(createFor.player.handle, whichUnitType, x, y, bj_UNIT_FACING);
                WorldEntity.getInstance().handleTravel(Unit.fromHandle(unit), zone);
                this.addAgent(unit);
                return unit;
            }
            else {
                Log.Information("Failed to create and add agent for player");
            }
        }
        catch(e) {
            Log.Error("Error when createAddAgent()");
            Log.Error(e);
        }
    }
}