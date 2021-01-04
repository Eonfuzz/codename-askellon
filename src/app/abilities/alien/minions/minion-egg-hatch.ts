import { Ability } from "app/abilities/ability-type";
import { EventEntity } from "app/events/event-entity";
import { EVENT_TYPE } from "app/events/event-enum";
import { Unit } from "w3ts/index";
import { ALIEN_MINION_CANITE, ALIEN_MINION_FORMLESS, ALIEN_MINION_HYDRA, UNIT_ID_EGG_AUTO_HATCH, UNIT_ID_EGG_AUTO_HATCH_LARGE } from "resources/unit-ids";
import { Log } from "lib/serilog/serilog";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { SFX_ALIEN_BLOOD } from "resources/sfx-paths";
import { getZFromXY } from "lib/utils";

export class MinionEggHatchAbility implements Ability {

    constructor() {}

    public initialise() {
        const uType = GetUnitTypeId( GetTriggerUnit() );

        let spawningUType: number;
        if (uType === UNIT_ID_EGG_AUTO_HATCH) {
            spawningUType = ALIEN_MINION_CANITE;
        }
        else if (uType === UNIT_ID_EGG_AUTO_HATCH_LARGE) {
            spawningUType = [ALIEN_MINION_FORMLESS, ALIEN_MINION_HYDRA][GetRandomInt(0, 1)];
        }

        const u = Unit.fromHandle(GetTriggerUnit());
        CreateUnit(PlayerStateFactory.AlienAIPlayer1.handle, spawningUType, GetUnitX(GetTriggerUnit()), GetUnitY(GetTriggerUnit()), GetRandomReal(0, 360));


        const sfx = AddSpecialEffect(SFX_ALIEN_BLOOD, u.x, u.y);
        BlzSetSpecialEffectZ(sfx, getZFromXY(u.x, u.y));
        DestroyEffect(sfx);

        KillUnit(GetTriggerUnit());
        return true;
    };

    public process(delta: number) {
        return false;
    };
    
    public destroy() {
        return true; 
    };
}