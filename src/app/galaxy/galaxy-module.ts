/** @noSelfInFile **/
import { SpaceGrid } from "./sector-type";
import { Game } from "../game";
import { SpaceSector } from "./sector-sector-type";
import { Vector2 } from "app/types/vector2";
import { Log } from "lib/serilog/serilog";
import { NavigationGrid } from "./navigation-grid-type";

const GRID_RECT = gg_rct_Galaxy_Map;
export class GalaxyModule {
    public spaceGrid: SpaceGrid;
    public game: Game;
    
    private galaxyMap = new NavigationGrid();
    private currentSector = new Vector2(0, 0);


    constructor(game: Game) {
        this.game = game;

        this.spaceGrid = new SpaceGrid();
    }

    initSectors() {
        this.spaceGrid.initSectors(-5, -5, 5, 5);
        // this.createNavigationGrid();
    }

    getCurrentSector() {
        return this.spaceGrid.sectors[this.currentSector.x][this.currentSector.y];
    }

    navigateToSector(deltaX: number, deltaY: number) {
        const oldSector = this.spaceGrid.sectors[this.currentSector.x][this.currentSector.y];
        const nSector = this.spaceGrid.navigateTo(new Vector2(
            this.currentSector.x + deltaX,
            this.currentSector.y + deltaY
        ));

        const pilot = this.game.worldModule.askellon.getPilot() || this.game.crewModule.CREW_MEMBERS[0];
        if (!nSector) {
            return Log.Error("Failed to jump to new location!");
        }

        this.currentSector = new Vector2(this.currentSector.x + deltaX, this.currentSector.y + deltaY);
        Log.Information(`Entering ${nSector.name}`);
        if (pilot) {
            DisplayText(pilot.unit.owner.id, `Entering ${nSector.name}`);
        }

        // Now update the navigation grid
        this.galaxyMap.getNewDisplay(this.currentSector.x, this.currentSector.y, this.spaceGrid.sectors);
        this.galaxyMap.renderForOffset(new Vector2(0, 0));
    }

    /**
     * Creates a visible "Holographic navigation grid"
     */
    createNavigationGrid() {
        const centerX = GetRectCenterX(gg_rct_Galaxy_Map);
        const centerY = GetRectCenterY(gg_rct_Galaxy_Map);   

        this.galaxyMap.setCenter(centerX, centerY, this.game.getZFromXY(centerX, centerY));
        this.galaxyMap.getNewDisplay(this.currentSector.x, this.currentSector.y, this.spaceGrid.sectors);
        this.galaxyMap.renderForOffset(this.game.spaceModule.getAskellonPosition());
    }
}