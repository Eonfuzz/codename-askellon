import { LootTable } from "./loot-table";
import { BURST_RIFLE_ITEM_ID, SHOTGUN_ITEM_ID, LASER_ITEM_ID, ITEM_ID_NANOMED, AT_ITEM_DRAGONFIRE_BLAST, SNIPER_ITEM_ID, ITEM_ID_CRYO_GRENADE, ITEM_ID_REPAIR, ITEM_ID_25_COINS, ITEM_ID_EMO_INHIB, ITEM_ID_FLARES } from "app/weapons/weapon-constants";
import { ITEM_WEP_MINIGUN, ITEM_TRIFEX_ID, ITEM_HELLFIRE_GRENADE, ITEM_BARRICADES, ITEM_SIGNAL_BOOSTER, ITEM_PLACEABLE_TURRET, ITEM_MINERAL_REACTIVE, ITEM_MINERAL_VALUABLE } from "resources/item-ids";

export const GUN_LOOT_TABLE = new LootTable(
    { rarity: 50, itemId: BURST_RIFLE_ITEM_ID },
    { rarity: 40, itemId: SHOTGUN_ITEM_ID },
    { rarity: 30, itemId: LASER_ITEM_ID },
    { rarity: 1, itemId: ITEM_WEP_MINIGUN },
    { rarity: 120, itemId: AT_ITEM_DRAGONFIRE_BLAST },
    { rarity: 120, itemId: SNIPER_ITEM_ID  },
);

export const MEDICAL_LOOT_TABLE = new LootTable(
    { rarity: 50, itemId: ITEM_ID_NANOMED },
    { rarity: 3, itemId: ITEM_TRIFEX_ID },
    { rarity: 30, itemId: ITEM_ID_EMO_INHIB }
);

export const MISC_ITEM_TABLE = new LootTable(
    { rarity: 30, itemId: ITEM_HELLFIRE_GRENADE },
    { rarity: 30, itemId: ITEM_ID_CRYO_GRENADE },
    { rarity: 35, itemId: ITEM_PLACEABLE_TURRET },
    // { rarity: 35, itemId: ITEM_BARRICADES },
    { rarity: 50, itemId: ITEM_ID_REPAIR },
    { rarity: 100, itemId: ITEM_ID_25_COINS },
    { rarity: 3, itemId: ITEM_SIGNAL_BOOSTER },
    { rarity: 30, itemId: ITEM_ID_FLARES, chargesMin: 2, chargesMax: 2 },
    { rarity: 60, itemId: ITEM_MINERAL_REACTIVE, chargesMin: 3, chargesMax: 10 },
    { rarity: 40, itemId: ITEM_MINERAL_VALUABLE, chargesMin: 3, chargesMax: 10 }
);