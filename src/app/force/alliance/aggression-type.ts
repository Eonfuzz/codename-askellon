import { MapPlayer } from "w3ts/index";

export interface Aggression {
    // Unique identifier
    id: number,
    aggressor: MapPlayer;
    defendant: MapPlayer;
    // Time stamp must be in seconds
    timeStamp: number;
    // Duration must be in seconds
    remainingDuration: number;

    // The key of the aggressionLog
    key: string;
}