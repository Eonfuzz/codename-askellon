import { UiWidget } from "./widget";
import { MapPlayer, Trigger } from "w3ts/index";
import { PlayerStateFactory } from "app/force/player-state-entity";

export class IncomeWidget extends UiWidget {

    private income: framehandle;

    private updateTicker = 5;

    constructor() {
        super();

        const font = 'LVCMono.otf';

        
        //Income
        this.income = BlzCreateFrameByType("TEXT", "income", BlzGetFrameByName("ConsoleUIBackdrop", 0), "ResourceBarGoldText", 0);
        BlzFrameSetTextColor(this.income, BlzConvertColor(255,150,255,255));
        BlzFrameSetTextAlignment(this.income,TEXT_JUSTIFY_MIDDLE,TEXT_JUSTIFY_RIGHT);
        BlzFrameSetFont(this.income, "UI\\Font\\" + font, 0.009, 1);
        BlzFrameSetLevel(this.income, 1);
        BlzFrameClearAllPoints(this.income);
        BlzFrameSetAbsPoint(this.income, FRAMEPOINT_TOPRIGHT, 0.595, 0.5795);
        BlzFrameSetSize(this.income, 0.8, 0.01);
    }

    update(forWho: MapPlayer) {

        this.updateTicker -= 0.3;
        if (this.updateTicker < 0) {
            this.updateTicker = 6;

            const crew = PlayerStateFactory.getCrewmember(forWho.id);

            if (crew && crew.unit && crew.unit.isAlive()) {
                BlzFrameSetText(this.income,"Income: +"+crew.getIncome());
            }
        }
    }
}