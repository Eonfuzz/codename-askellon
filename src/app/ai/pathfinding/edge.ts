import { Node } from "./node";
import { Unit } from "w3ts/index";

/**
 * Edges in askellon
 * Has a unit (ie, elevator) and exit 1, exit 2 (Floor)
 */
export class Edge {
    // Used for backgracking
    id: number;

    // The unit representing the edge
    unit: Unit;
    // It's in a node
    node: Node;
    exit: Edge;

    connectsWith(node: Node) {
        return this.exit && this.exit.node == node;
    }
}