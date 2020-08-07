import { ShipZone } from "../zone-type";
import { Unit } from "w3ts/index";
import { SoundRef } from "app/types/sound-ref";
import { PlayerStateFactory } from "app/force/player-state-entity";

export class ChurchZone extends ShipZone {

    churchMusic = new SoundRef("Music\\GregorianChant.mp3", true, true);

    public onLeave(unit: Unit) {
        super.onLeave(unit);

        const pData = PlayerStateFactory.get(unit.owner);
        const crewmember = pData.getCrewmember();
        const isCrew = crewmember.unit === unit;

        if (isCrew && crewmember && GetLocalPlayer() === unit.owner.handle) {
            // Stop Play music
            this.churchMusic.stopSound();
            SetMusicVolume(20);
        }
        // If no oxy remove oxy loss
        // TODO
        // If no power remove power loss
    }

    public onEnter(unit: Unit) {
        super.onEnter(unit);

        const pData = PlayerStateFactory.get(unit.owner);
        const crewmember = pData.getCrewmember();
        const isCrew = crewmember.unit === unit;

        if (isCrew && crewmember && GetLocalPlayer() === unit.owner.handle) {
            this.churchMusic.playSound();
            SetMusicVolume(5);
            this.churchMusic.setVolume(30)
        }
    }
}