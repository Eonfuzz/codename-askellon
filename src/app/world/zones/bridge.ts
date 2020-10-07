import { Unit, Timer } from "w3ts/index";
import { SoundRef } from "app/types/sound-ref";
import { ROLE_TYPES } from "resources/crewmember-names";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { ShipZone } from "../zone-types/ship-zone";
import { Log } from "lib/serilog/serilog";
import { CREWMEMBER_UNIT_ID } from "resources/unit-ids";
export class BridgeZone extends ShipZone {

    operaMusic = new SoundRef("Music\\Puccini.mp3", true, true);
    private musicIsActive = false;

    private xpTicker = 0;

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

        try {

            if (isCrew && crewmember && GetLocalPlayer() === unit.owner.handle && !this.musicIsActive) {
                // Play music
                this.operaMusic.setVolume(50);
                this.operaMusic.playSound();
                SetMusicVolume(5);

            }
        }
        catch(e) {
            Log.Error("Error entering bridge");
            Log.Error(e);
        }
    }

    public step(delta: number) {
        super.step(delta);

        this.xpTicker += delta;

        if (this.xpTicker >= 10) {
            this.xpTicker = 0;
            for (let index = 0; index < this.unitsInside.length; index++) {
                const u = this.unitsInside[index];
                if (u.typeId === CREWMEMBER_UNIT_ID) {
                    const crewmember = PlayerStateFactory.getCrewmember(u.owner);
                    const isCrew = crewmember && crewmember.unit === u;
                    if (isCrew && crewmember.role === ROLE_TYPES.CAPTAIN) {
                        crewmember.addExperience(25);
                    }
                }
            }
        }
    }
}