import { Zone } from "../zone-types/zone-type";
import { Unit } from "w3ts/index";
import { PlayerStateFactory } from "app/force/player-state-entity";

export class SpaceZone extends Zone {

    public onLeave(unit: Unit) {
        super.onLeave(unit);

        const crewmember = PlayerStateFactory.getCrewmember(unit.owner);
        const isCrew = crewmember && crewmember.unit === unit;

        if (isCrew && crewmember && GetLocalPlayer() === unit.owner.handle) {
            // SetCameraBoundsToRectForPlayerBJ(unit.owner.handle, bj_mapInitialPlayableArea);
            // BlzChangeMinimapTerrainTex("war3mapGenerated.blp");
            BlzShowTerrain(true);
        }
    }

    public onEnter(unit: Unit) {
        super.onEnter(unit);

        const crewmember = PlayerStateFactory.getCrewmember(unit.owner);
        const isCrew = crewmember && crewmember.unit === unit;

        if (isCrew && crewmember && GetLocalPlayer() === unit.owner.handle) {
            SetCameraBoundsToRectForPlayerBJ(unit.owner.handle, gg_rct_Space);
            BlzChangeMinimapTerrainTex("minimap-space.blp");
            BlzShowTerrain(false);
        }
    }
}