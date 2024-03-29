import { AbilityWithDone } from "../ability-type";
import { SoundRef } from "app/types/sound-ref";
import { MessageAllPlayers } from "lib/utils";
import { COL_ORANGE, COL_INFO, COL_ATTATCH, COL_GOOD } from "resources/colours";
import { EventEntity } from "app/events/event-entity";
import { EVENT_TYPE } from "app/events/event-enum";
import { Unit, MapPlayer, playerColors } from "w3ts/index";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { ABIL_SECURITY_TARGET_ALL } from "resources/ability-ids";
import { PlayNewSound } from "lib/translators";
import { PlayerState } from "app/force/player-type";
import { TARGETING_TOOLTIP, TARGETING_TOOLTIP_EXTENDED } from "resources/strings";

export class StationSecurityTargetAbility extends AbilityWithDone {
    

    public init() {
        super.init();
        const u = Unit.fromHandle(GetTriggerUnit());

        const idx = ABIL_SECURITY_TARGET_ALL.indexOf(GetSpellAbilityId());
        const who = MapPlayer.fromIndex(idx) ;
        const pCrew = PlayerStateFactory.getCrewmember( who );
        const isTargeted = PlayerStateFactory.isTargeted(who);

        const c =  playerColors[who.id].code;

        if (!PlayerStateFactory.isTargeted( who )) {
            PlayNewSound("Sounds\\ComplexBeep.mp3", 32);
            MessageAllPlayers(`${COL_ATTATCH}Security engaging |r${c}${pCrew.name}|r`);            
            EventEntity.send(EVENT_TYPE.STATION_SECURITY_TARGETED_PLAYER, { source: u, data: { who: who }});
        }
        else {

            PlayNewSound("Sounds\\ComplexBeep.mp3", 32);
            MessageAllPlayers(`${COL_GOOD}Security disengaging |r${c}${pCrew.name}|r`);
            EventEntity.send(EVENT_TYPE.STATION_SECURITY_UNTARGETED_PLAYER, { source: u, data: { who: who }});
        }

        BlzSetAbilityTooltip(GetSpellAbilityId(), TARGETING_TOOLTIP(PlayerStateFactory.isTargeted(who), who, pCrew), 0);
        BlzSetAbilityExtendedTooltip(GetSpellAbilityId(), TARGETING_TOOLTIP_EXTENDED(PlayerStateFactory.isTargeted(who), who, pCrew), 0);
        this.done = true; 
        return true;
    };

    public step(delta: number) {
        return false;
    };

    public destroy() {
        return true;
    };
}