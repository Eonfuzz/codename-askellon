/** @noSelfInFile **/
import { SpaceObject } from "./space-object";
import { Vector2 } from "../../types/vector2";
import { ForceModule } from "../../force/force-module";
import { Game } from "../../game";


export const ASTEROID_UNIT_ID = FourCC('h002');

export class Asteroid extends SpaceObject {

    private unit: unit | undefined;

    constructor(locX: number, locY: number) {
        super(new Vector2(locX, locY));
    }

    public load(game: Game) {
        super.load(game);

        const location = this.getLocation();
        this.unit = CreateUnit(game.forceModule.neutralPassive, ASTEROID_UNIT_ID, location.x, location.y, bj_UNIT_FACING);

        SetUnitTimeScale(this.unit, 0.1);
        SetUnitScalePercent(this.unit, GetRandomReal(50, 300), GetRandomReal(50, 300), GetRandomReal(50, 300));
        SetUnitFacing(this.unit, GetRandomReal(0, 360));
    }

    public onUpdate() {
        if (this.unit) {
            const loc = this.getLocation();
            SetUnitX(this.unit, loc.x);
            SetUnitY(this.unit, loc.y);
        }
    }

    public offload() {
        super.offload();
        
        // If we have a unit remove it
        if (this.unit) {
            RemoveUnit(this.unit);
        }
    }
    
    public pickle() {}
}