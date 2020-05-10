import { ShipZone } from "../zone-type";
import { WorldModule } from "../world-module";
import { Unit } from "w3ts/index";
import { SoundRef } from "app/types/sound-ref";
import { Log } from "lib/serilog/serilog";

export class ChurchZone extends ShipZone {

    churchMusic = new SoundRef("Music\\GregorianChant.mp3", true);
    private musicIsActive = false;

    public onLeave(world: WorldModule, unit: Unit) {
        super.onLeave(world, unit);

        if (GetLocalPlayer() === unit.owner.handle) {
            this.musicIsActive = false;
            // Stop Play music
            this.churchMusic.stopSound();
            // SetDayNightModels(
            //     "Environment\\DNC\\DNCLordaeron\\DNCLordaeronTerrain\\DNCLordaeronTerrain.mdl", 
            //     "Environment\\DNC\\DNCLordaeron\\DNCLordaeronUnit\\DNCLordaeronUnit.mdl"
            // );
        }
        // If no oxy remove oxy loss
        // TODO
        // If no power remove power loss
    }

    public onEnter(world: WorldModule, unit: Unit) {
        super.onEnter(world, unit);

        if (GetLocalPlayer() === unit.owner.handle && !this.musicIsActive) {
            this.musicIsActive = true;
            // Play music
            this.churchMusic.setVolume(30);
            this.churchMusic.playSound();

            // // Also make it darker.. for ambience
            // SetDayNightModels("war3mapImported\\NiteVisionModelRed.mdx", "war3mapImported\\war3mapImported\\NiteVisionModelRed.mdx");
        }
    }
}