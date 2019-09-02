/** @noSelfInFile **/
import { SECTOR_NAMES, SECTOR_PREFIXES } from "./sector-names";

export class SpaceSector {
    public name: string = '';
    public seed: string = '';

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

    setSeed(seed: string) {
        this.seed = seed;
    }
}