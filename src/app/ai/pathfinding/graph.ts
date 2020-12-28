import { Node } from "./node";
import { ZONE_TYPE } from "app/world/zone-id";
import { Path } from "./path";
import { Log } from "lib/serilog/serilog";

export class Graph {

    nodeDict = new Map<ZONE_TYPE, Node>();
    nodes: Node[];

    
    pathTo(from: ZONE_TYPE, to: ZONE_TYPE): Path | false {
        const fromNode = this.nodeDict.get(from);
        const toNode = this.nodeDict.get(to);

        // Map of travelled nodes
        const travelledNodes = new Map<Node, boolean>();
        // Paths starts as just our pathways
        const paths = [];
        // Add our current node as a travelled node
        travelledNodes.set(fromNode, true);

        let currentPath = new Path();
        currentPath.currentNode = fromNode;
        paths.push(paths);


        let maxSearches = 20;
        while (currentPath !== undefined && currentPath.currentNode !== toNode && maxSearches > 0) {
            maxSearches--;

            // For each possible pathway of a node
            for (let index = 0; index < currentPath.currentNode.pathways.length; index++) {
                // Get the edge we are traversing
                const nEdge = currentPath.currentNode.pathways[index];    
                // If the new node doesn't exist in the travel map
                if (!travelledNodes.has(nEdge.exit.node)) {
                    travelledNodes.set(nEdge.exit.node, true);                
                    // If the new node doesn't exist in the travel map
                    const nPath = new Path(currentPath);
                    nPath.currentNode = nEdge.exit.node;
                    nPath.addEdge(nEdge);
                    paths.push(nPath);
                }
            }

            // Remove our current path
            paths.splice(0, 1);
            // Get the next path if we can
            currentPath = (paths.length === 0) ? undefined : paths[0];
        }

        if (maxSearches <= 0) {
            // Log.Information("PATH FAIL: "+ZONE_TYPE[from]+" to "+ZONE_TYPE[to]+" NO PATH FOUND (Max Searches)");
            return false;
        }
        else if (currentPath == undefined) {
            // Log.Information("PATH FAIL: "+ZONE_TYPE[from]+" to "+ZONE_TYPE[to]+" NO PATH FOUND (Exhausted Search)");
            return false;
        }
        return currentPath;
    }
}