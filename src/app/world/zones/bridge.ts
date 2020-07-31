import { ShipZone } from "../zone-type";
import { WorldEntity } from "../world-entity";
import { Unit, Timer } from "w3ts/index";
import { SoundRef } from "app/types/sound-ref";
import { Log } from "lib/serilog/serilog";
import { ROLE_TYPES } from "resources/crewmember-names";
import { ZONE_TYPE } from "../zone-id";
import { CrewFactory } from "app/crewmember/crewmember-factory";

export class BridgeZone extends ShipZone {

    operaMusic = new SoundRef("Music\\Puccini.mp3", true, true);
    private musicIsActive = false;

    public onLeave(unit: Unit) {
        super.onLeave(unit);

        // Check if it is a main unit
        const isCrew = !!CrewFactory.getInstance().getCrewmemberForUnit(unit);

        if (isCrew && GetLocalPlayer() === unit.owner.handle) {
            // Stop Play music
            this.operaMusic.stopSound();
            SetMusicVolume(20);
        }
    }

    public onEnter(unit: Unit) {
        super.onEnter(unit);

        // Check if it is a main unit
        const crewmember = CrewFactory.getInstance().getCrewmemberForUnit(unit);

        if (crewmember && GetLocalPlayer() === unit.owner.handle && !this.musicIsActive) {
            // Play music
            this.operaMusic.playSound();
            SetMusicVolume(5);

        }
        // If we are captain keep track of his existance
        if (crewmember && crewmember.role === ROLE_TYPES.CAPTAIN) {
            const captainXpTimer = new Timer().start(5, true, () => {
                const zone = WorldEntity.getInstance().getUnitZone(crewmember.unit);
                if (!zone || (zone.id !== ZONE_TYPE.BRIDGE && zone.id !==  ZONE_TYPE.SPACE)) {
                    return captainXpTimer.destroy();
                }

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
        const crewmember = CrewFactory.getInstance().getCrewmemberForUnit(unit);

        if (crewmember && GetLocalPlayer() === unit.owner.handle) {
            // Stop Play music
            this.operaMusic.stopSound();
            SetMusicVolume(20);
        }
    }

    public onEnter(unit: Unit) {
        super.onEnter(unit);

        const crewmember = CrewFactory.getInstance().getCrewmemberForUnit(unit);

        // Play music
        this.operaMusic.setVolume(50);

        if (crewmember && GetLocalPlayer() === unit.owner.handle) {
            this.operaMusic.playSound();
            SetMusicVolume(10);
        }
    }
}