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

    // When units travel
    TRAVEL_UNIT_TO,

    INTERACT_BRIDGE_TERMINAL,

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
    SHIP_STOPS_MINING
}
