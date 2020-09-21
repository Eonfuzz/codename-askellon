import { Entity } from "app/entity-type";
import { Hooks } from "lib/Hooks";
import { Timers } from "app/timer-type";
import { ConveyorEntity } from "app/conveyor/conveyor-entity";
import { Log } from "lib/serilog/serilog";
import { PlayNewSound } from "lib/translators";
import { SoundRef } from "app/types/sound-ref";

declare const gg_rct_mineralcrusherwest: rect;
declare const gg_rct_mineralcrushereast: rect;

declare const gg_rct_mineralcrusherexitwest: rect;
declare const gg_rct_mineralcrusherexiteast: rect;

export class MineralCrusherEntity extends Entity {

    private static instance: MineralCrusherEntity;

    public static getInstance() {        
        if (this.instance == null) {
            this.instance = new MineralCrusherEntity();
            Hooks.set(this.name, this.instance);
        }
        return this.instance;
    }

    _timerDelay = 0.2;


    itemsAnimating = new Map<item, boolean>();

    private soundEnter = new SoundRef("Sounds\\vendingMachineChunk.mp3", false, false);

    step() {
        if (gg_rct_mineralcrusherwest) {
            EnumItemsInRect(gg_rct_mineralcrusherwest, Filter(() => true), () => {
                const item = GetEnumItem();
                if (this.itemsAnimating.get(item)) return;

                this.itemsAnimating.set(item, true);
                SetItemVisible(item, false);
                this.soundEnter.playSoundOnPont(GetRectCenterX(gg_rct_mineralcrusherwest), GetRectCenterY(gg_rct_mineralcrusherwest), 5);
                Timers.addTimedAction(10, () => {
                    SetItemVisible(item, true);
                    this.itemsAnimating.delete(item);
                    const x = GetRectCenterX(gg_rct_mineralcrusherexitwest);
                    const y = GetRectCenterY(gg_rct_mineralcrusherexitwest);
                    this.soundEnter.playSoundOnPont(x, y, 5);
                    SetItemPosition(item, x, y);
                    ConveyorEntity.getInstance().checkItem(item);
                });
            });
        }
        if (gg_rct_mineralcrushereast) {
            EnumItemsInRect(gg_rct_mineralcrushereast, Filter(() => true), () => {
                const item = GetEnumItem();
                if (this.itemsAnimating.get(item)) return;

                this.itemsAnimating.set(item, true);
                SetItemVisible(item, false);
                this.soundEnter.playSoundOnPont(GetRectCenterX(gg_rct_mineralcrushereast), GetRectCenterY(gg_rct_mineralcrushereast), 5);
                Timers.addTimedAction(10, () => {
                    SetItemVisible(item, true);
                    this.itemsAnimating.delete(item);
                    const x = GetRectCenterX(gg_rct_mineralcrusherexiteast);
                    const y = GetRectCenterY(gg_rct_mineralcrusherexiteast);
                    this.soundEnter.playSoundOnPont(x, y, 5);
                    SetItemPosition(item, x, y);
                    ConveyorEntity.getInstance().checkItem(item);
                });
            });
        }
    }
}