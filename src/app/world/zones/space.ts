import { Zone } from "../zone-type";
import { Unit } from "w3ts/index";
// import { CrewFactory } from "app/crewmember/crewmember-factory";

export class SpaceZone extends Zone {

    public onLeave(unit: Unit) {
        super.onLeave(unit);

        // // Check if it is a main unit
        // const crewmember = CrewFactory.getInstance().getCrewmemberForUnit(unit);

        // if (crewmember && GetLocalPlayer() === unit.owner.handle) {
        //     SetCameraBoundsToRectForPlayerBJ(unit.owner.handle, bj_mapInitialPlayableArea);
        //     BlzChangeMinimapTerrainTex("war3mapGenerated.blp");
        //     BlzShowTerrain(true);
        // }
    }

    public onEnter(unit: Unit) {
        super.onEnter(unit);

        // // Check if it is a main unit
        // const crewmember = CrewFactory.getInstance().getCrewmemberForUnit(unit);

        // if (crewmember && GetLocalPlayer() === unit.owner.handle) {
        //     SetCameraBoundsToRectForPlayerBJ(unit.owner.handle, gg_rct_Space);
        //     BlzChangeMinimapTerrainTex("minimap-space.blp");
        //     BlzShowTerrain(false);
        // }
    }
}