import { Interactables } from "./interactables";
import { GeneEntity } from "app/shops/gene-entity";
import { EventEntity } from "app/events/event-entity";
import { EVENT_TYPE } from "app/events/event-enum";
import { PlayerState } from "app/force/player-type";
import { InteractableData } from "./interactable-type";
import { Unit } from "w3ts/index";
import { ResearchFactory } from "app/research/research-factory";
import { TECH_MAJOR_RELIGION } from "resources/ability-ids";
import { MessagePlayer } from "lib/utils";
import { COL_MISC, COL_TEAL } from "resources/colours";
import { BuffInstance } from "app/buff/buff-instance-type";
import { DynamicBuffEntity } from "app/buff/dynamic-buff-entity";
import { BUFF_ID } from "resources/buff-ids";
import { BuffInstanceDuration } from "app/buff/buff-instance-duration-type";
import { Crewmember } from "app/crewmember/crewmember-type";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { ROLE_TYPES } from "resources/crewmember-names";
import { TERMINAL_RELIGION_ALTAR } from "resources/unit-ids";

export const intAltarInteraction = () => {
    
    let i = 0;1

    const upgradeTerminalProcessing: InteractableData = {
        onStart: (fromUnit: Unit, targetUnit: Unit) => {
            // Log.Information("Using terminal");
        },
        onCancel: (fromUnit: Unit, targetUnit: Unit) => {
        },
        action: (fromUnit: Unit, targetUnit: Unit) => {
            if (ResearchFactory.getInstance().getMajorUpgradeLevel(TECH_MAJOR_RELIGION) >= 2) {
                const inquisitorCrew: Crewmember = PlayerStateFactory.getCrewOfRole(ROLE_TYPES.INQUISITOR)[0];
                let casterUnit = (inquisitorCrew && inquisitorCrew.unit.isAlive()) ? inquisitorCrew.unit : targetUnit;
                DynamicBuffEntity.getInstance().addBuff(BUFF_ID.PURITY_SEAL, fromUnit, new BuffInstanceDuration(casterUnit, 180));
                MessagePlayer(fromUnit.owner, `The Imperator a ${COL_TEAL}mighty|r blessing upon you`);
            }
            else {
                MessagePlayer(fromUnit.owner, `The Imperator bestows no blessings upon you`);
                MessagePlayer(fromUnit.owner, `${COL_MISC}Consecrate this place first|r`);
            }
        }
    }
    Interactables.set(TERMINAL_RELIGION_ALTAR, upgradeTerminalProcessing);
}