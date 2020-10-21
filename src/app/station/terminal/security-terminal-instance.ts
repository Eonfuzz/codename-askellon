import { Terminal } from "./terminal-instance";
import { Unit } from "w3ts/index";
import { 
    ABIL_SECURITY_TARGET_ALL
} from "resources/ability-ids";
import { Players } from "w3ts/globals/index";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { TARGETING_TOOLTIP, TARGETING_TOOLTIP_EXTENDED } from "resources/strings";
import { GlobalCooldownAbilityEntity } from "app/abilities/global-ability-entity";
import { UNIT_ID_STATION_SECURITY_CAMERA } from "resources/unit-ids";
import { EventListener } from "app/events/event-type";
import { EventEntity } from "app/events/event-entity";
import { EVENT_TYPE } from "app/events/event-enum";
import { Log } from "lib/serilog/serilog";

/**
 * Does upgrades
 * Gets access to station wide abilities
 */
export class SecurityTerminal extends Terminal {
    private evListener: EventListener;
    private evListenerRepair: EventListener;
    private allCameras = CreateGroup();

    constructor(sourceUnit: Unit, baseUnit: Unit) {
        super(sourceUnit, baseUnit);

        // Add "Target" powers
        Players.forEach(p => {
            const idx = p.id;

            if (p.controller === MAP_CONTROL_USER && (p.slotState == PLAYER_SLOT_STATE_PLAYING || p.slotState === PLAYER_SLOT_STATE_LEFT)) {
                const abil = ABIL_SECURITY_TARGET_ALL[idx];
                this.terminalUnit.addAbility(abil);
                const isTargeted = PlayerStateFactory.isTargeted(p);

                const player = PlayerStateFactory.get(p);
                const crew = player.getCrewmember();

                BlzSetAbilityTooltip(abil, TARGETING_TOOLTIP(isTargeted, p, crew), 0);
                BlzSetAbilityExtendedTooltip(abil, TARGETING_TOOLTIP_EXTENDED(isTargeted, p, crew), 0);

                GlobalCooldownAbilityEntity.getInstance().onUnitAdd(this.terminalUnit.handle);
            }
                
        });

        // Add vision of ALL cameras
        GroupEnumUnitsOfPlayer(this.allCameras, PlayerStateFactory.StationSecurity.handle, Filter(() => {
            return GetUnitTypeId(GetFilterUnit()) === UNIT_ID_STATION_SECURITY_CAMERA;
        }));


        ForGroup(this.allCameras, () => {
            if ( !BlzIsUnitInvulnerable(GetEnumUnit()) ) {
                UnitShareVision(GetEnumUnit(), this.sourceUnit.owner.handle, true);
            }
        });

        this.evListener = new EventListener(EVENT_TYPE.STATION_SECURITY_DISABLED, (self, ev) => {
            const unit = ev.data.unit as Unit;
            if (unit.typeId === UNIT_ID_STATION_SECURITY_CAMERA) {
                UnitShareVision(unit.handle, this.sourceUnit.owner.handle, false);
            }
        });
        EventEntity.listen(this.evListener);
        this.evListenerRepair = new EventListener(EVENT_TYPE.STATION_SECURITY_ENABLED, (self, ev) => {
            const unit = ev.data.unit as Unit;
            if (unit.typeId === UNIT_ID_STATION_SECURITY_CAMERA) {
                UnitShareVision(unit.handle, this.sourceUnit.owner.handle, true);
            }
        });
        EventEntity.listen(this.evListenerRepair);
    }

    onDestroy() {
        super.onDestroy();
        ForGroup(this.allCameras, () => {
            UnitShareVision(GetEnumUnit(), this.sourceUnit.owner.handle, false);
        });

        DestroyGroup(this.allCameras);
        EventEntity.getInstance().removeListener(this.evListener);
        EventEntity.getInstance().removeListener(this.evListenerRepair);
    }
}