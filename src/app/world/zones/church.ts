import { ShipZone } from "../zone-type";
import { Unit } from "w3ts/index";
import { SoundRef } from "app/types/sound-ref";
// import { CrewFactory } from "app/crewmember/crewmember-factory";

export class ChurchZone extends ShipZone {

    churchMusic = new SoundRef("Music\\GregorianChant.mp3", true, true);

    public onLeave(unit: Unit) {
        super.onLeave(unit);

        // // Check if it is a main unit
        // const crewmember = CrewFactory.getInstance().getCrewmemberForUnit(unit);

        // if (crewmember && GetLocalPlayer() === unit.owner.handle) {
        //     // Stop Play music
        //     this.churchMusic.stopSound();
        //     SetMusicVolume(20);
        // }
        // // If no oxy remove oxy loss
        // // TODO
        // // If no power remove power loss
    }

    public onEnter(unit: Unit) {
        super.onEnter(unit);

        // // Check if it is a main unit
        // const crewmember = CrewFactory.getInstance().getCrewmemberForUnit(unit);
        // // Play music
        // this.churchMusic.setVolume(30);

        // if (crewmember && GetLocalPlayer() === unit.owner.handle) {
        //     this.churchMusic.playSound();
        //     SetMusicVolume(5);

        //     // // Also make it darker.. for ambience
        //     // SetDayNightModels("war3mapImported\\NiteVisionModelRed.mdx", "war3mapImported\\war3mapImported\\NiteVisionModelRed.mdx");
        // }
    }
}