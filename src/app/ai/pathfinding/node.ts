import { Edge } from "./edge";
import { Zone } from "app/world/zone-types/zone-type";

/**
 * Connections and zone
 */
export class Node {
    pathways: Edge[] = [];
    zone: Zone;

    // A map all nodes this node could possibly reach
    connectedNodes: Node[] = [];
}