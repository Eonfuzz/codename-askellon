import { Graph } from "./pathfinding/graph";
import { Edge } from "./pathfinding/edge";
import { ZONE_TYPE } from "app/world/zone-id";
import { Node } from "./pathfinding/node";
import { Unit } from "w3ts/index";
import { WorldEntity } from "app/world/world-entity";

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
    return graph;
}