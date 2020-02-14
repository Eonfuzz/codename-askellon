/** @noSelfInFile **/
import { SpaceGrid } from "./sector-type";
import { Game } from "../game";

declare const NAGIVATION_RECT: rect;

export class GalaxyModule {
    public spaceGrid: SpaceGrid;
    public game: Game;

    constructor(game: Game) {
        this.game = game;
        this.spaceGrid = new SpaceGrid();
    }

    initSectors() {
        this.spaceGrid.initSectors(-5, -5, 5, 5);
    }

    /**
     * Creates a visible "Holographic navigation grid"
     */
    createNavigationGrid() {
        const centerX = GetRectCenterX(NAGIVATION_RECT);
        const centerY = GetRectCenterY(NAGIVATION_RECT);

        
    }
}