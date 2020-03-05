/** @noSelfInFile **/
import { SECTOR_NAMES, SECTOR_PREFIXES } from "./sector-names";

export class SpaceSector {
    public name: string = '';
    public seed: number = 0;


    /**
     * Has the sector been generated yet?
     */
    hasGenerated: boolean = false;

    constructor() {}

    initalise() {
        this.nameSector()
    }

    nameSector() {
        const prefix    = SECTOR_PREFIXES[ Math.floor( Math.random() * SECTOR_PREFIXES.length) ];
        const name      = SECTOR_NAMES[ Math.floor( Math.random() * SECTOR_NAMES.length) ];
        this.name = prefix + ' ' + name;
        // print("Sector ["+this.name+"]");
    }

    setSeed(seed: number) {
        this.seed = seed;
    }

    generateMinerals() {
        // Refresh game seed
        SetRandomSeed(this.seed);
        // Get density
        // Mineral Density defines how dense the mineral path may be
        const mineralDensity = GetRandomInt(20, 60);
    }
}