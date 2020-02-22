/** @noSelfInFile **/
import { SpaceSector } from "./sector-sector-type";
import { Vector2 } from "app/types/vector2";

export class SpaceGrid {
    public sectors: Array<Array<SpaceSector>> = [];
    constructor() {}

    initSectors(minX: number, minY: number, maxX: number, maxY: number) {
        let x = minX;
        while (x++ < maxX) {
            let newSectors = [];

            let y = minY;
            while (y++ < maxY) {
                newSectors.push(new SpaceSector());
            } 

            this.sectors.push(newSectors);
        }

        this.sectors.forEach(sectorArray => 
            sectorArray.forEach(sector => sector.initalise()))
    }

    navigateTo(position: Vector2): SpaceSector {
        const nSector = this.sectors[position.x][position.y];
        return nSector;
    }
}