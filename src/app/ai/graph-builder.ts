import { Graph } from "./pathfinding/graph";
import { Edge } from "./pathfinding/edge";
import { ZONE_TYPE, ZONE_TYPE_TO_ZONE_NAME } from "app/world/zone-id";
import { Node } from "./pathfinding/node";
import { Unit } from "w3ts/index";
import { WorldEntity } from "app/world/world-entity";
import { Log } from "lib/serilog/serilog";
import { ZoneWithExits } from "app/world/zone-types/zone-with-exits";
import { Zone } from "app/world/zone-types/zone-type";

export class NodeGraph {
    private static graph = new Graph();
    
    /**
     * Populates and builds NodeGraph.graph
     */
    public static buildGraph() : void {
       

        const edgeForUnit = new Map<number, Edge>();
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
            
            // Log.Information("Building nodes: "+nodes.length);

            // After creating "node" map
            // Populate pathways and edges
            nodes.forEach((node: Node) => {

                if (node.zone instanceof ZoneWithExits) {
                    const paths = node.zone.getPathways();
                    paths.forEach(exit => {
            
                        // Log.Information(`${ZONE_TYPE[node.zone.id]} -> ${exit.entrance.name}`);
                        // We may already have an edge for this unit
                        const edge = edgeForUnit.get(exit.entrance.id) ||  new Edge();

                        edge.node = node;
                        edge.unit = exit.entrance;
                        edgeForUnit.set(edge.unit.id, edge);
                        node.pathways.push(edge);

                        // now set it for the exit
                        const exitEdge = edgeForUnit.get(exit.exit.id) || new Edge();
                        edgeForUnit.set(exit.exit.id, exitEdge);
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

        this.graph.nodes = nodes;
        this.graph.nodeDict = nodeForZoneType;

        // Now develop connections
        this.graph.nodes.forEach(node => this.populateNode(node));
    }

    private static populateNode(node: Node) {
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

    /**
     * Returns our node graph
     * NodeGraph.buildGraph() must be called beforehand!
     */
    public static getGraph() {
        return this.graph;
    }
}