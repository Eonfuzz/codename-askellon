import { ShipZone, Zone } from "../zone-type";
import { WorldModule } from "../world-module";
import { Unit } from "w3ts/index";
import { SoundRef } from "app/types/sound-ref";
import { Log } from "lib/serilog/serilog";

export class SpaceZone extends Zone {

    public onLeave(world: WorldModule, unit: Unit) {
        super.onLeave(world, unit);

        // Check if it is a main unit
        const isCrew = !!world.game.crewModule.getCrewmemberForUnit(unit);

        if (isCrew && GetLocalPlayer() === unit.owner.handle) {
            SetCameraBoundsToRectForPlayerBJ(unit.owner.handle, bj_mapInitialPlayableArea);
            BlzChangeMinimapTerrainTex("war3mapGenerated.blp");
            BlzShowTerrain(true);
        }
    }

    public onEnter(world: WorldModule, unit: Unit) {
        super.onEnter(world, unit);

        // Check if it is a main unit
        const isCrew = !!world.game.crewModule.getCrewmemberForUnit(unit);

        if (isCrew && GetLocalPlayer() === unit.owner.handle) {
            SetCameraBoundsToRectForPlayerBJ(unit.owner.handle, gg_rct_Space);
            BlzChangeMinimapTerrainTex("minimap-space.blp");
            BlzShowTerrain(false);
        }
    }
}