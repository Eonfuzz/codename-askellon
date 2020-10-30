import { Ability } from "../ability-type";
import { SoundRef } from "app/types/sound-ref";
import { MessageAllPlayers } from "lib/utils";
import { COL_ORANGE, COL_INFO } from "resources/colours";
import { EventEntity } from "app/events/event-entity";
import { EVENT_TYPE } from "app/events/event-enum";
import { ResearchFactory } from "app/research/research-factory";
import { TECH_MAJOR_REACTOR } from "resources/ability-ids";

export const ventPurgeWarning = new SoundRef("Sounds\\ReactorWarning.mp3", false, true);
export const ventPurgeWarmup = new SoundRef('Sounds\\SequencerActive.mp3', false);

export class VentPurgeAbility implements Ability {
    private timeElapsed = 0;

    private warmupTime = 10;

    private purgeMaxDuration = 30;


    constructor() {}

    public initialise() {
        ventPurgeWarning.playSound();
        ventPurgeWarmup.playSoundOnUnit(GetTriggerUnit(), 60);

        const rInstance = ResearchFactory.getInstance();

        if (rInstance.getMajorUpgradeLevel(TECH_MAJOR_REACTOR) > 2 && rInstance.techHasOccupationBonus(TECH_MAJOR_REACTOR, 2)) {
            MessageAllPlayers(`[${COL_ORANGE}WARNING|r] PURGING SERVICE TUNNELS IN 7`);
            this.warmupTime = 7;

        }
        else {
            MessageAllPlayers(`[${COL_ORANGE}WARNING|r] PURGING SERVICE TUNNELS IN 10`);
        }

        EventEntity.send(EVENT_TYPE.SYSTEM_PREPARES_VENT_PURGE, { source: null });
        return true;
    };

    public process(delta: number) {

        if (this.timeElapsed < this.warmupTime && (this.timeElapsed + delta) >= this.warmupTime) {
            EventEntity.send(EVENT_TYPE.SYSTEM_STARTS_VENT_PURGE, { source: null });
        }

        this.timeElapsed += delta;
        return this.timeElapsed <= (this.purgeMaxDuration + this.warmupTime);
    };

    public destroy() {
        MessageAllPlayers(`[${COL_INFO}INFO|r] PURGE COMPLETE`);
        EventEntity.send(EVENT_TYPE.SYSTEM_STOPS_VENT_PURGE, { source: null });
        return true;
    };
}