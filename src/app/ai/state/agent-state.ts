export abstract class AgentState {
    abstract tick(delta: number): void;
}