import { ShipZone } from "../zone-type";
import { WorldModule } from "../world-module";
import { Unit, Timer } from "w3ts/index";
import { SoundRef } from "app/types/sound-ref";
import { Log } from "lib/serilog/serilog";
import { ROLE_TYPES } from "resources/crewmember-names";
import { ZONE_TYPE } from "../zone-id";

export class BridgeZone extends ShipZone {

    operaMusic = new SoundRef("Music\\Puccini.mp3", true, true);
    private musicIsActive = false;

    public onLeave(world: WorldModule, unit: Unit) {
        super.onLeave(world, unit);

        // Check if it is a main unit
        const isCrew = !!world.game.crewModule.getCrewmemberForUnit(unit);

        if (isCrew && GetLocalPlayer() === unit.owner.handle) {
            // Stop Play music
            this.operaMusic.stopSound();
            SetMusicVolume(20);
        }
    }

    public onEnter(world: WorldModule, unit: Unit) {
        super.onEnter(world, unit);

        // Check if it is a main unit
        const crewmember = world.game.crewModule.getCrewmemberForUnit(unit);

        if (crewmember && GetLocalPlayer() === unit.owner.handle && !this.musicIsActive) {
            // Play music
            this.operaMusic.playSound();
            SetMusicVolume(5);

            // If we are captain keep track of his existance
            if (crewmember.role === ROLE_TYPES.CAPTAIN) {
                const captainXpTimer = new Timer().start(5, true, () => {
                    const zone = world.getUnitZone(crewmember.unit);
                    if (!zone || (zone.id !== ZONE_TYPE.BRIDGE && zone.id !==  ZONE_TYPE.SPACE)) {
                        return captainXpTimer.destroy();
                    }

                    crewmember.addExperience(world.game, 5);
                });
            }
        }
    }
}
export class BridgeZoneVent extends ShipZone {

    operaMusic = new SoundRef("Music\\Puccini.mp3", true);

    public onLeave(world: WorldModule, unit: Unit) {
        super.onLeave(world, unit);

        // Check if it is a main unit
        const isCrew = !!world.game.crewModule.getCrewmemberForUnit(unit);

        if (isCrew && GetLocalPlayer() === unit.owner.handle) {
            // Stop Play music
            this.operaMusic.stopSound();
            SetMusicVolume(20);
        }
    }

    public onEnter(world: WorldModule, unit: Unit) {
        super.onEnter(world, unit);

        // Check if it is a main unit
        const isCrew = !!world.game.crewModule.getCrewmemberForUnit(unit);

        // Play music
        this.operaMusic.setVolume(50);

        if (isCrew && GetLocalPlayer() === unit.owner.handle) {
            this.operaMusic.playSound();
            SetMusicVolume(10);
        }
    }
}