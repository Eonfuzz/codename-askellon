import { AbilityWithDone } from "../ability-type";
import { SoundRef } from "app/types/sound-ref";
import { MessageAllPlayers } from "lib/utils";
import { COL_ORANGE, COL_INFO } from "resources/colours";
import { EventEntity } from "app/events/event-entity";
import { EVENT_TYPE } from "app/events/event-enum";
import { ResearchFactory } from "app/research/research-factory";
import { ABIL_SYSTEM_PURGE_VENTS, ABIL_SYSTEM_PURGE_VENTS_BRIDGE, TECH_MAJOR_REACTOR } from "resources/ability-ids";
import { GlobalCooldownAbilityEntity } from "../global-ability-entity";

export const ventPurgeWarning = new SoundRef("Sounds\\ReactorWarning.mp3", false, true);
export const ventPurgeWarmup = new SoundRef('Sounds\\SequencerActive.mp3', false);

export class VentPurgeAbility extends AbilityWithDone {
    private timeElapsed = 0;

    private warmupTime = 10;

    private purgeMaxDuration = 120;


    

    public init() {
        super.init();
        ventPurgeWarning.playSound();
        ventPurgeWarmup.playSoundOnUnit(GetTriggerUnit(), 60);

        const rInstance = ResearchFactory.getInstance();

        GlobalCooldownAbilityEntity.getInstance().onAbilityCast(this.casterUnit.handle, ABIL_SYSTEM_PURGE_VENTS);
        GlobalCooldownAbilityEntity.getInstance().onAbilityCast(this.casterUnit.handle, ABIL_SYSTEM_PURGE_VENTS_BRIDGE);

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

    public step(delta: number) {

        if (this.timeElapsed < this.warmupTime && (this.timeElapsed + delta) >= this.warmupTime) {
            EventEntity.send(EVENT_TYPE.SYSTEM_STARTS_VENT_PURGE, { source: null });
        }

        this.timeElapsed += delta;

        if (this.timeElapsed >= (this.purgeMaxDuration + this.warmupTime)) {
            this.done = true; 
        }
    };

    public destroy() {
        MessageAllPlayers(`[${COL_INFO}INFO|r] PURGE COMPLETE`);
        EventEntity.send(EVENT_TYPE.SYSTEM_STOPS_VENT_PURGE, { source: null });
        return true;
    };
}