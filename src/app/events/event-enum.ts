/**
 * List of all the possible event types
 */
export enum EVENT_TYPE {
    // ALIEN EVENTS
    ALIEN_TRANSFORM_CREW,
    CREW_TRANSFORM_ALIEN,
    // ALIEN_ENTER_FLOOR,

    // CREW EVENTS
    CREW_BECOMES_ALIEN,
    CREW_GAIN_RESOLVE,
    CREW_GAIN_DESPAIR,
    CREW_LOSE_RESOLVE,
    CREW_LOSE_DESPAIR,
    CREW_CHANGES_FLOOR,
    CREW_GAIN_EXPERIENCE,
    // CREW_LEVEL_UP,

    // // STATION EVENTS
    // STATION_DAMAGE,
    STATION_SECURITY_DISABLED,
    STATION_SECURITY_ENABLED,

    STATION_SECURITY_TARGETED_PLAYER,
    STATION_SECURITY_UNTARGETED_PLAYER,

    STATION_POWER_OUT,
    FLOOR_LOSES_POWER,
    FLOOR_GAINS_POWER,
    // STATION_WARP,
    // STATION_ZONE_POWER_OUT,

    MAJOR_UPGRADE_RESEARCHED,
    MINOR_UPGRADE_RESEARCHED,
    GENE_UPGRADE_INSTALLED,

    HERO_LEVEL_UP,
    WEAPON_EQUIP,
    WEAPON_UNEQUIP,
    WEAPON_MODE_CHANGE,

    // Special event just to check for victory conds
    CHECK_VICTORY_CONDS,

    // Ships
    ENTER_SHIP,
    LEAVE_SHIP,

    SHIP_ENTERS_SPACE,
    SHIP_LEAVES_SPACE,

    SYSTEM_PREPARES_VENT_PURGE,
    SYSTEM_STARTS_VENT_PURGE,
    SYSTEM_STOPS_VENT_PURGE,

    // When units travel
    TRAVEL_UNIT_TO,

    INTERACT_TERMINAL,

    // Calls the ability module
    ABILITY_CAST,
    // Adds a projectile, data.projectile = projectile to add
    ADD_PROJECTILE,
    // Unequips a weapon, data.weapon = weapon to drop, data.item = item source
    DO_UNQEUIP_WEAPON,
    // Equips a weapon, data.weapon = weapon to equip, data.item = item source
    DO_EQUIP_WEAPON,

    // EVENTS THAT SHOULD ONLY FIRE ONCE
    ENTITY_INIT_CHAT,

    // Called on death, or if a unit is removed
    UNIT_REMOVED_FROM_GAME,

    SHIP_STARTS_MINING,
    SHIP_STOPS_MINING,

    // Registers a passed unit as an AI entity
    REGISTER_AS_AI_ENTITY,
    SPAWN_ALIEN_EGG_FOR,


    ADD_BUFF_INSTANCE,
    ADD_BEHAVIOUR_INSTANCE,

    WORLD_EVENT_SOLAR,
    
    // Debug events
    DEBUG_WEAPONS,

    EV_HATCHERY_DEATH,
}
