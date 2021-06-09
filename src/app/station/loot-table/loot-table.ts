export interface LootTableEntry {
    // Higher is less rare
    rarity: number,
    // The ID of the item to spawn
    itemId: number,

    chargesMin?: number,
    chargesMax?: number
}


export class LootTable {

    private totalRarity: number = 0;
    private entries: LootTableEntry[];
    
    constructor(...entries: LootTableEntry[]) {
        this.entries = entries;
        this.entries.forEach(e => {
            this.totalRarity += e.rarity;
        });
    }

    getItem() {
        let seed = GetRandomInt(1, this.totalRarity);
        let result: LootTableEntry;
        let i = 0;

        while (seed > 0 && i < this.entries.length) {
            result = this.entries[i++];
            seed -= result.rarity;
        }

        return result;
    }
}