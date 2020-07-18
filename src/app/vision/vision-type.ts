
/**
 * The base vision types
 */
export enum VISION_TYPE { HUMAN, ALIEN, NIGHT_VISION };


// We can have multiple penalties
export enum VISION_PENALTY {
    // Vision penalty caused by no oxygen
    NO_OXYGEN,
    // Vision penalty caused by spells
    FORCED_DARKNESS,
    // Vision penalty caused by supernatural darkness
    SUPERNATURAL_DARKNESS,

    // Dark areas
    TERRAIN_DARK_AREA,
    // Only god vision bonus, caused by a bright sun
    TERRAIN_BRIGHT_AREA
};

/**
 * Our current vision state
 */
export enum VISION_STATE {
    DARK,
    ALIEN_DARK,
    NORMAL,
    BRIGHT
};
