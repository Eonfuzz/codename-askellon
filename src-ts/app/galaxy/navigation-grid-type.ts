/** @noSelfInFile **/
import { SpaceGrid } from "./sector-type";
import { Game } from "../game";
import { SpaceSector } from "./sector-sector-type";
import { GalaxyModule } from "./galaxy-module";

export class NavigationGrid {
    centerX: number;
    centerY: number;

    gridItems: Array<Array<effect>> = [];

    constructor(x: number, y: number) {
        this.centerX = x;
        this.centerY = y;
    }

    renderForSectors(galaxyModule: GalaxyModule, sectors: SpaceSector[]) {
        // const shipSector = galaxyModule.game.spaceModule.
    }

    /**
     * Returns the alpha for an sfx based on fade distance
     * @param distanceFromCenter 
     */
    getFadeValue(distanceFromCenter: number) {
        return 1;
    }
}