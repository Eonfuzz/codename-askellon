import { ShipZone } from "../zone-type";
import { WorldModule } from "../world-module";
import { Unit } from "w3ts/index";
import { SoundRef } from "app/types/sound-ref";
import { Log } from "lib/serilog/serilog";

export class BridgeZone extends ShipZone {

    operaMusic = new SoundRef("Music\\Puccini.mp3", true);
    private musicIsActive = false;

    public onLeave(world: WorldModule, unit: Unit) {
        super.onLeave(world, unit);

        if (GetLocalPlayer() === unit.owner.handle) {
            this.musicIsActive = false;
            // Stop Play music
            this.operaMusic.stopSound();
            SetMusicVolume(20);
        }
    }

    public onEnter(world: WorldModule, unit: Unit) {
        super.onEnter(world, unit);

        if (GetLocalPlayer() === unit.owner.handle && !this.musicIsActive) {
            this.musicIsActive = true;
            // Play music
            this.operaMusic.setVolume(127);
            this.operaMusic.playSound();
            SetMusicVolume(5);
        }
    }
}
export class BridgeZoneVent extends ShipZone {

    operaMusic = new SoundRef("Music\\Puccini.mp3", true);
    private musicIsActive = false;

    public onLeave(world: WorldModule, unit: Unit) {
        super.onLeave(world, unit);

        if (GetLocalPlayer() === unit.owner.handle) {
            this.musicIsActive = false;
            // Stop Play music
            this.operaMusic.stopSound();
            SetMusicVolume(20);
        }
    }

    public onEnter(world: WorldModule, unit: Unit) {
        super.onEnter(world, unit);

        if (GetLocalPlayer() === unit.owner.handle && !this.musicIsActive) {
            this.musicIsActive = true;
            // Play music
            this.operaMusic.setVolume(50);
            this.operaMusic.playSound();
            SetMusicVolume(10);
        }
    }
}