import { Zone } from "../zone-types/zone-type";
import { Unit } from "w3ts/index";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { SoundRef } from "app/types/sound-ref";

export class PlanetZone extends Zone {

    public lavaSound = new SoundRef("Sounds\\LavaLoop.mp3", true, true);

    public onLeave(unit: Unit) {
        super.onLeave(unit);

        const crewmember = PlayerStateFactory.getCrewmember(unit.owner);
        const isCrew = crewmember && crewmember.unit === unit;

        if (isCrew && crewmember && GetLocalPlayer() === unit.owner.handle) {
            this.lavaSound.stopSound();
            SetCameraBoundsToRectForPlayerBJ(unit.owner.handle, bj_mapInitialPlayableArea);
        }
    }

    public onEnter(unit: Unit) {
        super.onEnter(unit);

        const crewmember = PlayerStateFactory.getCrewmember(unit.owner);
        const isCrew = crewmember && crewmember.unit === unit;

        if (isCrew && crewmember && GetLocalPlayer() === unit.owner.handle) {
            this.lavaSound.playSound();
            SetCameraBoundsToRectForPlayerBJ(unit.owner.handle, bj_mapInitialPlayableArea);
        }
    }
}