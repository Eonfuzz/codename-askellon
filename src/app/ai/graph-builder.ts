import { Graph } from "./pathfinding/graph";
import { Edge } from "./pathfinding/edge";
import { ZONE_TYPE } from "app/world/zone-id";
import { Node } from "./pathfinding/node";
import { Unit } from "w3ts/index";
import { WorldEntity } from "app/world/world-entity";
import { Log } from "lib/serilog/serilog";

declare const udg_elevator_entrances: unit[];
declare const udg_elevator_exits: unit[];
declare const udg_elevator_exit_zones: string[];

declare const udg_hatch_entrances: unit[];
declare const udg_hatch_exits: unit[];
declare const udg_hatch_exit_zones: string[];

export function BuildGraph() {
    const graph = new Graph();

    const edgeForUnit = new Map<Unit, Edge>();
    const nodeForZoneType = new Map<ZONE_TYPE, Node>();

    const nodes = [];

    try {
    // Each elevator is an edge
    udg_elevator_entrances.forEach((elevator, i) => {
        const edge = new Edge();
        edge.unit = Unit.fromHandle(elevator);
        edgeForUnit.set(edge.unit, edge);
    });

    // Each elevator is an edge
    udg_hatch_entrances.forEach((hatch, i) => {
        const edge = new Edge();
        edge.unit = Unit.fromHandle(hatch);
        edgeForUnit.set(edge.unit, edge);
    });

    // Loop again and apply exits
    udg_elevator_entrances.forEach((elevator, i) => {
        const edge = edgeForUnit.get(Unit.fromHandle(elevator));
        const exit = udg_elevator_exits[i];
        edge.exit = edgeForUnit.get(Unit.fromHandle(exit));
    });

    // Loop again and apply exits
    udg_hatch_entrances.forEach((hatch, i) => {
        const edge = edgeForUnit.get(Unit.fromHandle(hatch));
        const exit = udg_hatch_exits[i];
        edge.exit = edgeForUnit.get(Unit.fromHandle(exit));
    });


    
    // Loop again and apply exits
    const world = WorldEntity.getInstance();
    udg_elevator_exits.forEach((exit, i) => {
        const edge = edgeForUnit.get(Unit.fromHandle(exit));
        const zoneName = udg_elevator_exit_zones[i];

        
        const zoneType = world.getZoneByName(zoneName);

        let node : Node;

        // If node is not defined, create it
        if (!nodeForZoneType.has(zoneType)) {
            const zone = world.getZone(zoneType);
            node = new Node();
            node.zone = zone;
            nodeForZoneType.set(zoneType, node);
            nodes.push(node);
        }
        else {
            node = nodeForZoneType.get(zoneType);
        }

        // Now add the edge to zone
        node.pathways.push(edge);
        // Add edge zone
        edge.node = node;
    });
    udg_hatch_exits.forEach((exit, i) => {
        const edge = edgeForUnit.get(Unit.fromHandle(exit));
        const zoneName = udg_hatch_exit_zones[i];

        
        const zoneType = world.getZoneByName(zoneName);

        let node : Node;

        // If node is not defined, create it
        if (!nodeForZoneType.has(zoneType)) {
            const zone = world.getZone(zoneType);
            node = new Node();
            node.zone = zone;
            nodeForZoneType.set(zoneType, node);
            nodes.push(node);
        }
        else {
            node = nodeForZoneType.get(zoneType);
        }

        // Now add the edge to zone
        node.pathways.push(edge);
        // Add edge zone
        edge.node = node;
    });

    graph.nodes = nodes;
    graph.nodeDict = nodeForZoneType;

    // Now develop connections
    graph.nodes.forEach(node => DevelopGraphConnections(node));
    return graph;

    }
    catch(e) {
        Log.Error("Error when generating AI pathing map");
        Log.Error(e);
    }
}

function DevelopGraphConnections(node: Node) {
    if (node.connectedNodes.length > 0) return node.connectedNodes;
    const visitedNodes = new Map<Node, boolean>();

    const allNodes = [];
    const nodeSearch = [node];

    // Log.Information("-> "+ZONE_TYPE[node.zone.id]);

    let maxSearches = 60;
    while (nodeSearch.length > 0 && maxSearches > 0) {
        let currentNode = nodeSearch[0];
        maxSearches--;


        // For each possible pathway of a node
        for (let index = 0; index < currentNode.pathways.length; index++) {
            // Get the edge we are traversing
            const nEdge = currentNode.pathways[index];    
            // If the new node doesn't exist in the travel map
            if (!visitedNodes.has(nEdge.exit.node)) {
                visitedNodes.set(nEdge.exit.node, true);                
                // If the new node doesn't exist in the travel map
                // Log.Information("-> "+ZONE_TYPE[nEdge.exit.node.zone.id])
                allNodes.push(nEdge.exit.node);
                nodeSearch.push(nEdge.exit.node);
            }
        }

        nodeSearch.splice(0, 1);
    }

    const idx = allNodes.indexOf(node);
    if (idx > 0) allNodes.splice(idx, 1);
    node.connectedNodes = allNodes;
}