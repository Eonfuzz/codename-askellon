import { Edge } from "./edge";
import { Node } from "./node";

export class Path {
    currentNode: Node;
    edges: Edge[] = [];

    constructor(prevPath?: Path) {
        if (prevPath) {
            this.edges = prevPath.edges.slice();
        }
    }

    addEdge(edge: Edge) {
        this.edges.push(edge);
    }
}