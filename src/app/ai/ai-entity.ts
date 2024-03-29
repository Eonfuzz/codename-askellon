import { Entity } from "app/entity-type";
import { Hooks } from "lib/Hooks";
import { Log } from "lib/serilog/serilog";
import { ZONE_TYPE } from "app/world/zone-id";
import { Graph } from "./pathfinding/graph";
import { PlayerAgent } from "./player-agent";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { MapPlayer, Unit, Trigger, Group } from "w3ts/index";
import { WorldEntity } from "app/world/world-entity";
import { EventEntity } from "app/events/event-entity";
import { EventListener } from "app/events/event-type";
import { EVENT_TYPE } from "app/events/event-enum";
import {  ALIEN_MINION_FORMLESS, ALIEN_MINION_CANITE, ALIEN_STRUCTURE_TUMOR, ALIEN_MINION_LARVA, ALIEN_STRUCTURE_HATCHERY } from "resources/unit-ids";
import { CreepEntity } from "app/creep/creep-entity";
import { Timers } from "app/timer-type";
import { NodeGraph } from "./graph-builder";
import { ABIL_ALIEN_MINION_EVOLVE, TECH_MAJOR_RELIGION } from "resources/ability-ids";
import { AI_MAX_TUMORS } from "./agent-state";
import { PlayerAgentCult } from "./player-agent-cult";
import { ResearchFactory } from "app/research/research-factory";

export class AIEntity extends Entity {
    private static instance: AIEntity;
    public static getInstance() {        
        if (this.instance == null) {
            this.instance = new AIEntity();
            Hooks.set(this.name, this.instance);
        }
        return this.instance;
    }

    private playerToAgent: Map<number, PlayerAgent>;
    private playerAgents: PlayerAgent[];

    private unitBuildTrigger = new Trigger();

    constructor() {
        super();

        // Populate our node grapoh
        NodeGraph.buildGraph();

        this.playerToAgent = new Map<number, PlayerAgent>();
        this.playerAgents = [];

        // Create agents
        PlayerStateFactory.getAlienAI().forEach(p => {
            const agent = new PlayerAgent(p, 50);
            this.playerAgents.push(agent);
            this.playerToAgent.set(agent.player.id, agent);
            // Set max count of tumors
            SetPlayerTechMaxAllowed(p.handle, ALIEN_STRUCTURE_TUMOR, AI_MAX_TUMORS);
        });

        const nAgent = new PlayerAgentCult(PlayerStateFactory.CultistAIPlayer, 40);
        this.playerAgents.push(nAgent);
        this.playerToAgent.set(nAgent.player.id, nAgent);

        /**
         * Listen to create AI minion requests
         */
        EventEntity.listen(new EventListener(EVENT_TYPE.REGISTER_AS_AI_ENTITY, (self, ev) => {
            // Log.Information("Register as AI entity called "+ev.source.name);
            // Dont register tumors as AI entities
            if (!ev.source.isUnitType( UNIT_TYPE_STRUCTURE )) {
                // Log.Information("Adding: "+ev.source.name);
                AIEntity.addAgent(ev.source);
            }
            // But DO add them to the map
            else {
                const z = WorldEntity.getInstance().getPointZone(ev.source.x, ev.source.y);
                if (z) {
                    WorldEntity.getInstance().travel(ev.source, z.id);
                }
                if (ev.source.typeId === ALIEN_STRUCTURE_HATCHERY) {
                    CreepEntity.addCreepWithSource(1200, ev.source);
                }
            }
        }));

        this.unitBuildTrigger.registerAnyUnitEvent(EVENT_PLAYER_UNIT_CONSTRUCT_FINISH);
        this.unitBuildTrigger.addAction(() => {
            const building = Unit.fromHandle(GetConstructedStructure());
            // Now see if we need to register it as creep
            if (GetUnitTypeId(GetConstructedStructure()) === ALIEN_STRUCTURE_TUMOR) {
                CreepEntity.addCreepWithSource(600, building);
            }
        })
    }

    /**
     * Returns a player agent that can have more agents
     * @param ignoreLimit 
     */
    public getBestPlayerAgent(forAgent: Unit, ignoreLimit: boolean = false): PlayerAgent | undefined {
        { // DO
            // Search through our agents and add
            for (let i = 0; i< this.playerAgents.length; i++) {
                const playerAgent = this.playerAgents[i];
                if (playerAgent.canTakeAgent(forAgent)) {
                    return playerAgent;
                }
            }

            // Otherwise our agents are at max
            // Can we ignore limit?
            if (ignoreLimit) {
                // Find agent with least amound of units
                let leastUnitAgent: PlayerAgent = this.playerAgents[0];
                for (let i = 0; i< this.playerAgents.length; i++) {
                    const playerAgent = this.playerAgents[i];
                    if (playerAgent.canTakeAgent(forAgent, ignoreLimit) && 
                        leastUnitAgent.getCurrentAgents() > playerAgent.getCurrentAgents()) {
                        leastUnitAgent = playerAgent;
                    }
                }
                // Now create
                return leastUnitAgent;
            }
            return undefined;
        } // END
    }

    _timerDelay = 2;
    step() {
        for (let index = 0; index < this.playerAgents.length; index++) {
            const agent = this.playerAgents[index];
            agent.step(this._timerDelay);
        }
    }

    getAgentforPlayer(who: MapPlayer): PlayerAgent | undefined {
        return this.playerToAgent.get(who.id);
    }

    /**
     * STATIC API
     */

     /**
      * Requries the unit to be currently owned by an agent user
      * @param whichUnit 
      */
    public static addAgent(whichUnit: Unit) {
        { // DO
            const instance = this.getInstance();

            // Check this unit currently isn't in the AI database
            const isAlreadyAgent = !!instance.playerAgents.find(a => a.hasAgent(whichUnit));

            if (!isAlreadyAgent) {
                try {
                    const createFor = instance.getBestPlayerAgent(whichUnit);

                    if (!createFor) {
                        whichUnit.show = false;
                        return whichUnit.kill();
                    }

                    SetUnitOwner(whichUnit.handle, createFor.player.handle, false);

                    const z = WorldEntity.getInstance().getPointZone(whichUnit.x, whichUnit.y);

                    if (!z) {
                        return; //Log.Error("Failed to add AI unit, no zone found "+GetUnitName(whichUnit));
                    }
                    if (whichUnit.typeId === ALIEN_MINION_FORMLESS) {
                        CreepEntity.addCreepWithSource(256, whichUnit);
                    }

                    const abilLevel = whichUnit.getAbilityLevel(ABIL_ALIEN_MINION_EVOLVE);
                    if (abilLevel > 0) {
                        let cooldown = BlzGetAbilityCooldown(ABIL_ALIEN_MINION_EVOLVE, abilLevel - 1);
                        if (z.id === ZONE_TYPE.CHURCH && ResearchFactory.getInstance().isUpgradeInfested(TECH_MAJOR_RELIGION, 1)) {
                            cooldown = R2I(cooldown * 0.5);
                        }
                        whichUnit.startAbilityCooldown(ABIL_ALIEN_MINION_EVOLVE, cooldown);
                    }

                    WorldEntity.getInstance().travel(whichUnit, z.id);
                    createFor.addAgent(whichUnit);
                }
                catch(e) {
                    Log.Error(`Error adding agent:`);
                    Log.Error(e);
                }
            }
        } // END
    }

    /**
     * Logs all actions a unit is expected to do
     * @param who 
     */
    public static debugAgent(who: Unit) {
        const i = this.getInstance();
        if (!i.playerAgents.some(a => a.debugUnit(who))) { 
            Log.Information(`${who.name} not found in any agents`)
        }
    }

    public static debug() {
        Log.Information("Debug logging!");
        const i = this.getInstance();
        i.playerAgents.forEach( p => p.log());
    }
}