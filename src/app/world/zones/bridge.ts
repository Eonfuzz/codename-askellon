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
            this.operaMusic.setVolume(127);
            this.operaMusic.playSound();
            SetMusicVolume(5);

            // // Also make it darker.. for ambience
            // SetDayNightModels("war3mapImported\\NiteVisionModelRed.mdx", "war3mapImported\\war3mapImported\\NiteVisionModelRed.mdx");
        }
    }
}