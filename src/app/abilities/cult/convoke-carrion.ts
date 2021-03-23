import { AbilityWithDone } from "../ability-type";
import { Effect, MapPlayer, Unit } from "w3ts/index";
import { Vector2 } from "app/types/vector2";
import { getZFromXY } from "lib/utils";
import { Timers } from "app/timer-type";
import { PlayNewSoundAt } from "lib/translators";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { ALIEN_FORCE_NAME, CULT_FORCE_NAME } from "app/force/forces/force-names";
import { SFX_CONVOKE_CARRION } from "resources/sfx-paths";
import { FilterIsAlive } from "resources/filters";
import { DynamicBuffEntity } from "app/buff/dynamic-buff-entity";
import { BUFF_ID } from "resources/buff-ids";
import { BuffInstanceDuration } from "app/buff/buff-instance-duration-type";
import { ABIL_CULTIST_DARK_THRALL} from "resources/ability-ids";

const CARRION_ID = FourCC("H006");
const CORPSE_ID = FourCC("I00N")

export class ConvokeCarrionAbility extends AbilityWithDone {

    private targetItem : item;
    private targetLoc : Vector2;
    private effectDone = false;
    private castPlayer : player;
 
    public init() {
        let SFX = SFX_CONVOKE_CARRION
        super.init();
        this.targetItem = GetSpellTargetItem();
        if (GetItemTypeId(this.targetItem) == CORPSE_ID) {
            this.targetLoc = new Vector2(GetItemX(this.targetItem), GetItemY(this.targetItem));
            this.castPlayer = GetTriggerPlayer();
            SetItemInvulnerable(this.targetItem,true);
            DestroyEffect(AddSpecialEffect(SFX,this.targetLoc.x, this.targetLoc.y));
            if (GetLocalPlayer() == this.castPlayer) {
                BlzSetAbilityPosY(ABIL_CULTIST_DARK_THRALL,2);
            }
            Timers.addTimedAction(3, () => {
                let carrionPlayer = GetItemPlayer(this.targetItem);
                RemoveItem(this.targetItem);
                let carrion = new Unit(GetPlayerId(carrionPlayer), CARRION_ID,this.targetLoc.x,this.targetLoc.y,270);
                SetPlayerAlliance(carrionPlayer, this.castPlayer, ALLIANCE_SHARED_CONTROL, true);
                SetUnitAnimation(carrion.handle,"birth");
                QueueUnitAnimation(carrion.handle,"stand")
                this.effectDone = true;
            });
        }
        return true;
    };

    public step(delta: number) {
        return this.effectDone;
    };

    public destroy() {
        return true;
    };
}