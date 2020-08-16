import { Edge } from "./edge";
import { Zone } from "app/world/zone-type";

/**
 * Connections and zone
 */
export class Node {
    pathways: Edge[] = [];
    zone: Zone;
}