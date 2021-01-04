import { ShipZone } from "../zone-types/ship-zone";
import { Unit } from "w3ts/index";
import { SoundRef } from "app/types/sound-ref";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { ResearchFactory } from "app/research/research-factory";
import { TECH_MAJOR_RELIGION, ABIL_INQUIS_CHURCH_CONSECRATED_AREA } from "resources/ability-ids";
import { ZONE_TYPE } from "../zone-id";
import { EventEntity } from "app/events/event-entity";
import { EVENT_TYPE } from "app/events/event-enum";

export class ChurchZone extends ShipZone {

    churchMusic = new SoundRef("Music\\GregorianChant.mp3", true, true);

    constructor(id: ZONE_TYPE) {
        super(id);

        EventEntity.listen(EVENT_TYPE.MAJOR_UPGRADE_RESEARCHED, (self, data) => {
            if (data && data.data && data.data.researched === TECH_MAJOR_RELIGION && data.data.level == 2) {
                this.unitsInside.forEach(unit => {
                    const crewmember = PlayerStateFactory.getCrewmember(unit.owner);
                    const isCrew = crewmember && crewmember.unit === unit;
                    if (isCrew) {
                        unit.addAbility(ABIL_INQUIS_CHURCH_CONSECRATED_AREA);
                    }
                });
            }
        })
    }

    // Listen to upgrade event
    // Give healing aura to all

    public onLeave(unit: Unit) {
        super.onLeave(unit);

        const crewmember = PlayerStateFactory.getCrewmember(unit.owner);
        const isCrew = crewmember && crewmember.unit === unit;

        if (isCrew && crewmember) {
            // Stop Play music
            if (GetLocalPlayer() === unit.owner.handle) {
                this.churchMusic.stopSound();
                SetMusicVolume(20);
            }

            const techLevelChurch = ResearchFactory.getInstance().getMajorUpgradeLevel(TECH_MAJOR_RELIGION);
            if (techLevelChurch >= 2) {
                unit.removeAbility(ABIL_INQUIS_CHURCH_CONSECRATED_AREA);
            }
        }
        // If no oxy remove oxy loss
        // TODO
        // If no power remove power loss
    }

    public onEnter(unit: Unit) {
        super.onEnter(unit);

        const crewmember = PlayerStateFactory.getCrewmember(unit.owner);
        const isCrew = crewmember && crewmember.unit === unit;

        if (isCrew && crewmember) {
            if (GetLocalPlayer() === unit.owner.handle) {
                this.churchMusic.playSound();
                SetMusicVolume(5);
                this.churchMusic.setVolume(30)
            }
            const techLevelChurch = ResearchFactory.getInstance().getMajorUpgradeLevel(TECH_MAJOR_RELIGION);
            if (techLevelChurch >= 2) {
                unit.addAbility(ABIL_INQUIS_CHURCH_CONSECRATED_AREA);
            }
        }
    }
}