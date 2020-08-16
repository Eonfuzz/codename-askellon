import { AgentState } from "./agent-state";
import { MapPlayer } from "w3ts/index";

export class AgentSeek implements AgentState {
    private seekableUnits = new Map<unit, boolean>();

    public tick(delta: number) {
        //
    }
}