import { Terminal } from "./terminal-instance";
import { Unit } from "w3ts/index";
import { 
    ABIL_SECURITY_TARGET_PLAYER_1, 
    ABIL_SECURITY_TARGET_PLAYER_2, 
    ABIL_SECURITY_TARGET_PLAYER_3, 
    ABIL_SECURITY_TARGET_PLAYER_4, 
    ABIL_SECURITY_TARGET_PLAYER_5,
    ABIL_SECURITY_TARGET_PLAYER_6,
    ABIL_SECURITY_TARGET_PLAYER_7,
    ABIL_SECURITY_TARGET_PLAYER_8,
    ABIL_SECURITY_TARGET_PLAYER_9,
    ABIL_SECURITY_TARGET_PLAYER_10,
    ABIL_SECURITY_TARGET_PLAYER_11,
    ABIL_SECURITY_TARGET_PLAYER_12,
    ABIL_SECURITY_TARGET_ALL
} from "resources/ability-ids";
import { Players } from "w3ts/globals/index";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { Log } from "lib/serilog/serilog";
import { EventEntity } from "app/events/event-entity";
import { EVENT_TYPE } from "app/events/event-enum";
import { PlayerState } from "app/force/player-type";
import { COL_MISC, COL_ATTATCH, COL_GOOD } from "resources/colours";
import { PLAYER_COLOR } from "lib/translators";
import { TARGETING_TOOLTIP, TARGETING_TOOLTIP_EXTENDED } from "resources/strings";
import { GlobalCooldownAbilityEntity } from "app/abilities/global-ability-entity";

export const TERMINAL_TIMEOUT_DISTANCE = 600;


/**
 * Does upgrades
 * Gets access to station wide abilities
 */
export class SecurityTerminal extends Terminal {
    constructor(sourceUnit: Unit, baseUnit: Unit, terminalUnit: Unit) {
        super(sourceUnit, baseUnit, terminalUnit);

        // Add "Target" powers
        Players.forEach(p => {
            const idx = p.id;

            if (p.controller === MAP_CONTROL_USER && (p.slotState == PLAYER_SLOT_STATE_PLAYING || p.slotState === PLAYER_SLOT_STATE_LEFT)) {
                const abil = ABIL_SECURITY_TARGET_ALL[idx];
                terminalUnit.addAbility(abil);
                const isTargeted = PlayerStateFactory.isTargeted(p);

                const player = PlayerStateFactory.get(p);
                const crew = player.getCrewmember();

                BlzSetAbilityTooltip(abil, TARGETING_TOOLTIP(isTargeted, p, crew), 0);
                BlzSetAbilityExtendedTooltip(abil, TARGETING_TOOLTIP_EXTENDED(isTargeted, p, crew), 0);

                GlobalCooldownAbilityEntity.getInstance().onUnitAdd(terminalUnit.handle);
            }
                
        })
    }
}