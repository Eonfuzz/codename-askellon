/** @noSelfInFile **/
import { SpaceGrid } from "./sector-type";

const SPACE_GRID: SpaceGrid = new SpaceGrid();

export function initSectors() {
    SPACE_GRID.initSectors(-5, -5, 5, 5);
}