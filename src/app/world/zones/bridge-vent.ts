import { Unit, Timer } from "w3ts/index";
import { SoundRef } from "app/types/sound-ref";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { VentZone } from "../zone-types/vent-zone";

export class BridgeZoneVent extends VentZone {

    operaMusic = new SoundRef("Music\\Puccini.mp3", true);

    public onLeave(unit: Unit) {
        super.onLeave(unit);

        // Check if it is a main unit
        const crewmember = PlayerStateFactory.getCrewmember(unit.owner);
        const isCrew = crewmember && crewmember.unit === unit;

        if (isCrew && crewmember && GetLocalPlayer() === unit.owner.handle) {
            // Stop Play music
            this.operaMusic.stopSound();
            SetMusicVolume(20);
        }
    }

    public onEnter(unit: Unit) {
        super.onEnter(unit);

        const crewmember = PlayerStateFactory.getCrewmember(unit.owner);
        const isCrew = crewmember && crewmember.unit === unit;

        BlzGetStackingItemTargetPreviousCharges

        if (isCrew && crewmember && GetLocalPlayer() === unit.owner.handle) {
            this.operaMusic.setVolume(25);
            this.operaMusic.playSound();
            SetMusicVolume(10);
        }
    }
}