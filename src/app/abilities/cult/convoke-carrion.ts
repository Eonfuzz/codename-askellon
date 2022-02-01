import { AbilityWithDone } from "../ability-type";
import { Effect, MapPlayer, Unit } from "w3ts/index";
import { Vector2 } from "app/types/vector2";
import { Timers } from "app/timer-type";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { SFX_CONVOKE_CARRION } from "resources/sfx-paths";
import { ABIL_CULTIST_DARK_THRALL} from "resources/ability-ids";
import { MessagePlayer } from "lib/utils";
import { COLOUR_CULT } from "app/force/forces/cultist/constants";
import { ChatEntity } from "app/chat/chat-entity";
import { Players } from "w3ts/globals/index";
import { COL_MISC } from "resources/colours";
import { SOUND_EVIL_LATIN } from "resources/sounds";

const CARRION_ID = FourCC("H006");
const CORPSE_ID = FourCC("I00N")

export class ConvokeCarrionAbility extends AbilityWithDone {

    private targetItem: item;
    private targetLoc:  Vector2;
    private castPlayer: MapPlayer;
 

    public init() {
        let SFX = SFX_CONVOKE_CARRION;
        super.init();
        this.targetItem = GetSpellTargetItem();
        if (GetItemTypeId(this.targetItem) == CORPSE_ID) {
            this.targetLoc = new Vector2(GetItemX(this.targetItem), GetItemY(this.targetItem));
            this.castPlayer = MapPlayer.fromEvent();
            const carrionPlayer = GetItemPlayer(this.targetItem);

            const pData = PlayerStateFactory.get(MapPlayer.fromHandle(carrionPlayer));
            const localOrCult = (pData && pData.player.isLocal()) || this.castPlayer.isLocal();

            // SOUND_EVIL_LATIN.setVolume(300);
            // SOUND_EVIL_LATIN.playSound();

            SetItemInvulnerable(this.targetItem, true);

            PanCameraToForPlayer(carrionPlayer, this.targetLoc.x, this.targetLoc.y);
            

            Timers.addTimedAction(5, () => {
                const text = localOrCult ? `Rise from your shackles of mortality` : `${COL_MISC}< Strange Sounds >|r`;
                ChatEntity.getInstance().postMessageFor(Players, `U̎ͩ̌ͬ̏̊̔͑ͯ̑ͦ͐̓̑͋͏̻̜̪͚̲̞̭̝͎̬̱͍́̕n͔̥̘̫̞͖͓̣͇͓͈̻͚͈̓͛ͭ́ͪ̅̾̔̓̾ͤ̇ͭͤ̀͡k̷̢̡̧̙̺͙̼̖̳͎̘̱̻̖̱̻ͦ͑ͨ̋̿̓ͨ͌̓̆ͭͫ͒͊͌̈ͭ͋̑n̶̷̹̬̞̭͉͔̯̞̘̭͕̼͖̻͇̯̙͎̤ͪͬ̂ͥͨ̐ͯ͘͠ỡ̛͈̤̼͉̳̮̅́̏ͦ̊̽̑̅̓͑̒̋ͭ͊ͦ̾͘͢w̸̙͓̣̪͔̞̗͉̳̙̭ͫ̒ͩ̿ͬ͆̃͛ͥ̈́̐͂͟n̴̢̨̛̝̱̮͕̑̐̃ͩ̉͌̍ͤͣ́`, COLOUR_CULT, text);
                const sfx = new Effect(SFX, this.targetLoc.x, this.targetLoc.y);
                sfx.destroy();
            });
            Timers.addTimedAction(10, () => {
                const text = localOrCult ? `Leave the rivers of nyx` : `${COL_MISC}< Strange Sounds >|r`;
                ChatEntity.getInstance().postMessageFor(Players, `U̎ͩ̌ͬ̏̊̔͑ͯ̑ͦ͐̓̑͋͏̻̜̪͚̲̞̭̝͎̬̱͍́̕n͔̥̘̫̞͖͓̣͇͓͈̻͚͈̓͛ͭ́ͪ̅̾̔̓̾ͤ̇ͭͤ̀͡k̷̢̡̧̙̺͙̼̖̳͎̘̱̻̖̱̻ͦ͑ͨ̋̿̓ͨ͌̓̆ͭͫ͒͊͌̈ͭ͋̑n̶̷̹̬̞̭͉͔̯̞̘̭͕̼͖̻͇̯̙͎̤ͪͬ̂ͥͨ̐ͯ͘͠ỡ̛͈̤̼͉̳̮̅́̏ͦ̊̽̑̅̓͑̒̋ͭ͊ͦ̾͘͢w̸̙͓̣̪͔̞̗͉̳̙̭ͫ̒ͩ̿ͬ͆̃͛ͥ̈́̐͂͟n̴̢̨̛̝̱̮͕̑̐̃ͩ̉͌̍ͤͣ́`, COLOUR_CULT, text);
                const sfx = new Effect(SFX, this.targetLoc.x, this.targetLoc.y);
                sfx.destroy();
            });
            Timers.addTimedAction(16, () => {
                const text = localOrCult ? `Rise beyond death our child of Carrion and continue` : `${COL_MISC}< Strange Sounds >|r`;
                ChatEntity.getInstance().postMessageFor(Players, `U̎ͩ̌ͬ̏̊̔͑ͯ̑ͦ͐̓̑͋͏̻̜̪͚̲̞̭̝͎̬̱͍́̕n͔̥̘̫̞͖͓̣͇͓͈̻͚͈̓͛ͭ́ͪ̅̾̔̓̾ͤ̇ͭͤ̀͡k̷̢̡̧̙̺͙̼̖̳͎̘̱̻̖̱̻ͦ͑ͨ̋̿̓ͨ͌̓̆ͭͫ͒͊͌̈ͭ͋̑n̶̷̹̬̞̭͉͔̯̞̘̭͕̼͖̻͇̯̙͎̤ͪͬ̂ͥͨ̐ͯ͘͠ỡ̛͈̤̼͉̳̮̅́̏ͦ̊̽̑̅̓͑̒̋ͭ͊ͦ̾͘͢w̸̙͓̣̪͔̞̗͉̳̙̭ͫ̒ͩ̿ͬ͆̃͛ͥ̈́̐͂͟n̴̢̨̛̝̱̮͕̑̐̃ͩ̉͌̍ͤͣ́`, COLOUR_CULT, text);
                const sfx = new Effect(SFX, this.targetLoc.x, this.targetLoc.y);
                sfx.destroy();
            });
            Timers.addTimedAction(22, () => {
                const text = localOrCult ? `For the Carrion One` : `${COL_MISC}< Strange Sounds >|r`;
                ChatEntity.getInstance().postMessageFor(Players, `U̎ͩ̌ͬ̏̊̔͑ͯ̑ͦ͐̓̑͋͏̻̜̪͚̲̞̭̝͎̬̱͍́̕n͔̥̘̫̞͖͓̣͇͓͈̻͚͈̓͛ͭ́ͪ̅̾̔̓̾ͤ̇ͭͤ̀͡k̷̢̡̧̙̺͙̼̖̳͎̘̱̻̖̱̻ͦ͑ͨ̋̿̓ͨ͌̓̆ͭͫ͒͊͌̈ͭ͋̑n̶̷̹̬̞̭͉͔̯̞̘̭͕̼͖̻͇̯̙͎̤ͪͬ̂ͥͨ̐ͯ͘͠ỡ̛͈̤̼͉̳̮̅́̏ͦ̊̽̑̅̓͑̒̋ͭ͊ͦ̾͘͢w̸̙͓̣̪͔̞̗͉̳̙̭ͫ̒ͩ̿ͬ͆̃͛ͥ̈́̐͂͟n̴̢̨̛̝̱̮͕̑̐̃ͩ̉͌̍ͤͣ́`, COLOUR_CULT, text);
                const sfx = new Effect(SFX, this.targetLoc.x, this.targetLoc.y);
                sfx.destroy();
            });

            SetItemInvulnerable(this.targetItem, true);

            // if (this.castPlayer.isLocal()) {
            //     BlzSetAbilityPosY(ABIL_CULTIST_DARK_THRALL,2);
            // }
            Timers.addTimedAction(22, () => {
                RemoveItem(this.targetItem);
                let carrion = new Unit(MapPlayer.fromHandle(carrionPlayer), CARRION_ID, this.targetLoc.x, this.targetLoc.y, 270);
                if (pData && pData.getCrewmember()) {
                    carrion.nameProper = pData.getCrewmember().name;
                }
                else {
                    // carrion.name = `Mindless Thrall`;
                    carrion.nameProper = `Mindless Thrall`;
                }
                SetPlayerAlliance(carrionPlayer, this.castPlayer.handle, ALLIANCE_SHARED_CONTROL, true);
                PlayerStateFactory.CultistAIPlayer.setAlliance(MapPlayer.fromHandle(carrionPlayer), ALLIANCE_PASSIVE, TRUE);
                SetUnitAnimation(carrion.handle, "birth");
                QueueUnitAnimation(carrion.handle, "stand")
                this.done = true;
            });
        }
        return true;
    };

    public step(delta: number) {
    };

    public destroy() {
        return true;
    };
}