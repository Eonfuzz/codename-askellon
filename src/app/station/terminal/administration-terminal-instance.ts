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
import { MessagePlayer } from "lib/utils";
import { COL_GOLD } from "resources/colours";

/**
 * Does upgrades
 * Gets access to station wide abilities
 */
export class AdministrationTerminal extends Terminal {
    private evListener: EventListener;
    private evListenerRepair: EventListener;
    private allCameras = CreateGroup();

    constructor(sourceUnit: Unit, baseUnit: Unit) {
        super(sourceUnit, baseUnit);

        GlobalCooldownAbilityEntity.getInstance().onUnitAdd(this.terminalUnit.handle);

        // Add vision of ALL cameras
        GroupEnumUnitsOfPlayer(this.allCameras, PlayerStateFactory.StationSecurity.handle, Filter(() => {
            return GetUnitTypeId(GetFilterUnit()) === UNIT_ID_STATION_SECURITY_CAMERA;
        }));


        ForGroup(this.allCameras, () => {
            if ( !BlzIsUnitInvulnerable(GetEnumUnit()) ) {
                UnitShareVision(GetEnumUnit(), this.sourceUnit.owner.handle, true);
            }
        });

        MessagePlayer(sourceUnit.owner, `${COL_GOLD}Granting Access To Security Feeds|r`);
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
        // MessagePlayer(this.sourceUnit.owner, `${COL_GOLD}Removing Access To Security Feeds|r`);

        ForGroup(this.allCameras, () => {
            UnitShareVision(GetEnumUnit(), this.sourceUnit.owner.handle, false);
        });

        DestroyGroup(this.allCameras);
        EventEntity.getInstance().removeListener(this.evListener);
        EventEntity.getInstance().removeListener(this.evListenerRepair);
    }
}