import { Unit, Timer } from "w3ts/index";
import { SoundRef } from "app/types/sound-ref";
import { ROLE_TYPES } from "resources/crewmember-names";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { ShipZone } from "../ship-zone";
export class BridgeZone extends ShipZone {

    operaMusic = new SoundRef("Music\\Puccini.mp3", true, true);
    private musicIsActive = false;

    public onLeave(unit: Unit) {
        super.onLeave(unit);

        // Check if it is a main unit
        const crewmember = PlayerStateFactory.getCrewmember(unit.owner);
        const isCrew = crewmember && crewmember.unit === unit;

        if (isCrew && GetLocalPlayer() === unit.owner.handle) {
            // Stop Play music
            this.operaMusic.stopSound();
            SetMusicVolume(20);
        }
    }

    public onEnter(unit: Unit) {
        super.onEnter(unit);

        // Check if it is a main unit
        const crewmember = PlayerStateFactory.getCrewmember(unit.owner);
        const isCrew = crewmember && crewmember.unit === unit;

        if (isCrew && crewmember && GetLocalPlayer() === unit.owner.handle && !this.musicIsActive) {
            // Play music
            this.operaMusic.setVolume(50);
            this.operaMusic.playSound();
            SetMusicVolume(5);

        }
        // If we are captain keep track of his existance
        if (isCrew && crewmember && crewmember.role === ROLE_TYPES.CAPTAIN) {
            const captainXpTimer = new Timer().start(5, true, () => {
                if (this.unitsInside.indexOf(crewmember.unit) > 0) {
                    return captainXpTimer.destroy();
                }
                // instead listen to events
                crewmember.addExperience(5);
            });
        }
    }
}
export class BridgeZoneVent extends ShipZone {

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

        if (isCrew && crewmember && GetLocalPlayer() === unit.owner.handle) {
            this.operaMusic.setVolume(25);
            this.operaMusic.playSound();
            SetMusicVolume(10);
        }
    }
}