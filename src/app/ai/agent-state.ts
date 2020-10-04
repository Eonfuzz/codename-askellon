export enum AGENT_STATE {
    // Unit needs a state
    AIMLESS,
    // Seeks out a specific player
    SEEK,
    // Goes to a specific floor
    TRAVEL,
    // Wanders through the current floor aimlessly
    WANDER,


    // Specific states
    BUILD_TUMOR,
    EVOLVE,
}