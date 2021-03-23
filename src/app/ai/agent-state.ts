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

// How many tumors can the AI build (per player)
export const AI_MAX_TUMORS = 12;
// How far away each tumor has to be
export const AI_TUMOR_MIN_RADIUS = 600;