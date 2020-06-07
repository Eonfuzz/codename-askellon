import { ShipZone } from "../zone-type";
import { WorldModule } from "../world-module";
import { Unit } from "w3ts/index";
import { SoundRef } from "app/types/sound-ref";
import { Log } from "lib/serilog/serilog";

export class ChurchZone extends ShipZone {

    churchMusic = new SoundRef("Music\\GregorianChant.mp3", true);

    public onLeave(world: WorldModule, unit: Unit) {
        super.onLeave(world, unit);

        // Check if it is a main unit
        const isCrew = !!world.game.crewModule.getCrewmemberForUnit(unit);

        if (isCrew && GetLocalPlayer() === unit.owner.handle) {
            // Stop Play music
            this.churchMusic.stopSound();
            SetMusicVolume(20);
        }
        // If no oxy remove oxy loss
        // TODO
        // If no power remove power loss
    }

    public onEnter(world: WorldModule, unit: Unit) {
        super.onEnter(world, unit);

        // Check if it is a main unit
        const isCrew = !!world.game.crewModule.getCrewmemberForUnit(unit);
        // Play music
        this.churchMusic.setVolume(30);

        if (isCrew && GetLocalPlayer() === unit.owner.handle) {
            this.churchMusic.playSound();
            SetMusicVolume(5);

            // // Also make it darker.. for ambience
            // SetDayNightModels("war3mapImported\\NiteVisionModelRed.mdx", "war3mapImported\\war3mapImported\\NiteVisionModelRed.mdx");
        }
    }
}