import { AbilityWithDone } from "app/abilities/ability-type";
import { Unit } from "w3ts/index";
import { ALIEN_MINION_CANITE, ALIEN_MINION_FORMLESS, ALIEN_MINION_HYDRA, ALIEN_MINION_ROACH, ALIEN_MINION_SWARMLING, UNIT_ID_EGG_AUTO_HATCH, UNIT_ID_EGG_AUTO_HATCH_LARGE } from "resources/unit-ids";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { SFX_ALIEN_BLOOD } from "resources/sfx-paths";
import { getZFromXY } from "lib/utils";

export class MinionEggHatchAbility extends AbilityWithDone {
    public init() {
        super.init();

        const uType = this.casterUnit.typeId;

        let spawningUType: number;
        if (uType === UNIT_ID_EGG_AUTO_HATCH) {
            spawningUType = ALIEN_MINION_CANITE;
        }
        else if (uType === UNIT_ID_EGG_AUTO_HATCH_LARGE) {
            spawningUType = [ALIEN_MINION_FORMLESS, ALIEN_MINION_HYDRA, ALIEN_MINION_ROACH][GetRandomInt(0, 2)];
        }

        const u = Unit.fromHandle(GetTriggerUnit());
        CreateUnit(PlayerStateFactory.AlienAIPlayer1.handle, spawningUType, GetUnitX(GetTriggerUnit()), GetUnitY(GetTriggerUnit()), GetRandomReal(0, 360));
        CreateUnit(PlayerStateFactory.AlienAIPlayer1.handle, ALIEN_MINION_SWARMLING, GetUnitX(GetTriggerUnit()), GetUnitY(GetTriggerUnit()), GetRandomReal(0, 360));

        const sfx = AddSpecialEffect(SFX_ALIEN_BLOOD, u.x, u.y);
        BlzSetSpecialEffectZ(sfx, getZFromXY(u.x, u.y));
        DestroyEffect(sfx);

        KillUnit(GetTriggerUnit());
        return true;
    };

    public step(delta: number) {
        return false;
    };
    
    public destroy() {
        return true; 
    };
}
