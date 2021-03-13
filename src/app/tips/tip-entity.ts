import { Hooks } from "lib/Hooks";
import { Entity } from "app/entity-type";
import { ALL_TIPS } from "./tips";
import { Quick } from "lib/Quick";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { Players } from "w3ts/globals/index";
import { MessagePlayer } from "lib/utils";
import { COL_GOOD } from "resources/colours";
import { SoundRef } from "app/types/sound-ref";
import { Log } from "lib/serilog/serilog";

export class TipEntity extends Entity {
    private static instance: TipEntity;
    private tipSound = new SoundRef(`Sound\\Interface\\ItemReceived.flac`, false, true);
    public static getInstance() {        
        if (this.instance == null) {
            this.instance = new TipEntity();
            Hooks.set(this.name, this.instance);
        }
        return this.instance;
    }

    constructor() {
        super();
    }

    showTipsEvery = 180;
    tipTimer = 0;
    _timerDelay = 90;
    step() {
        this.tipTimer += this._timerDelay;
        if (this.showTipsEvery <= this.tipTimer) {
            this.tipTimer -= this.showTipsEvery;

            // Show tip
            this.showNextTip();
        }
    }

    showNextTip() {
        if (ALL_TIPS.length > 0) {
            const tip = Quick.GetRandomFromArray(ALL_TIPS)[0];
            Quick.Slice(ALL_TIPS, ALL_TIPS.indexOf(tip));

            Players.forEach(p => {
                const player = PlayerStateFactory.get(p);
                if (player && player.tipsOn) {
                    if (p.isLocal()) {
                        this.tipSound.playSound();
                    }
                    MessagePlayer(p, `${COL_GOOD}Tip|r: ${tip}`);
                }
            });
        }
    }
}