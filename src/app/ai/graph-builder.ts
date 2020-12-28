import { Graph } from "./pathfinding/graph";
import { Edge } from "./pathfinding/edge";
import { ZONE_TYPE } from "app/world/zone-id";
import { Node } from "./pathfinding/node";
import { Unit } from "w3ts/index";
import { WorldEntity } from "app/world/world-entity";
import { Log } from "lib/serilog/serilog";
import { ZoneWithExits } from "app/world/zone-types/zone-with-exits";
import { Zone } from "app/world/zone-types/zone-type";

export function BuildGraph() {
    const graph = new Graph();

    const edgeForUnit = new Map<Unit, Edge>();
    const nodeForZoneType = new Map<ZONE_TYPE, Node>();

    const nodes: Node[] = [];

    try {
        // Loop through all the zones
        const world = WorldEntity.getInstance();
        world.getAllZones().forEach((zone: Zone) => {
            const node = new Node();
            node.zone = zone;
            nodeForZoneType.set(zone.id, node);
            nodes.push(node);
        });
        

        // After creating "node" map
        // Populate pathways and edges
        nodes.forEach((node: Node) => {

            if (node.zone instanceof ZoneWithExits) {
                const paths = node.zone.getPathways();
                paths.forEach(exit => {
                    // We may already have an edge for this unit
                    const edge = edgeForUnit.get(exit.entrance) ||  new Edge();

                    edge.node = node;
                    edge.unit = exit.entrance;
                    edgeForUnit.set(edge.unit, edge);
                    node.pathways.push(edge);

                    // now set it for the exit
                    const exitEdge = edgeForUnit.get(exit.exit) || new Edge();
                    edgeForUnit.set(exit.exit, exitEdge);
                    edge.exit = exitEdge;
                });
            }
            else {
                // Log.Information(node.zone.id +" Is not a connected node");
            }
        });

        // Populate shallow connections
        nodes.forEach(node => {
            node.pathways.forEach(p => {
                node.connectedNodes.push(p.exit.node);
            });
        });
    }
    catch(e) {
        Log.Error("Graph Builder Error");
        Log.Error(e);
    }

    graph.nodes = nodes;
    graph.nodeDict = nodeForZoneType;

    // Now develop connections
    graph.nodes.forEach(node => DevelopGraphConnections(node));
    return graph;
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