/** @noSelfInFile **/
import { Game } from "../game";
import { BuffInstance, DynamicBuff, BuffInstanceDuration } from "./buff-instance";
import { SoundWithCooldown, SoundRef } from "../types/sound-ref";
import { BUFF_ID, BUFF_ID_RESOLVE } from "resources/buff-ids";
import { Unit, Trigger } from "w3ts/index";
import { Log } from "lib/serilog/serilog";
import { SFX_FLASH_HEAL } from "resources/sfx-paths";
import { getZFromXY } from "lib/utils";

export class PuritySeal extends DynamicBuff {
    id = BUFF_ID.PURITY_SEAL;

    protected doesStack = false;

    private damageTracker: Trigger;


    private nextHealFromResolve: number = 0;

    public addInstance(game: Game, unit: Unit, instance: BuffInstance, isNegativeInstance?: boolean) {
        super.addInstance(game, unit, instance, isNegativeInstance);
        this.damageTracker = new Trigger();
        this.damageTracker.registerUnitEvent(unit, EVENT_UNIT_DAMAGING);
        this.damageTracker.addAction(() => this.onUnitTakesDamage());
    }

    public process(game: Game, delta: number): boolean {
        const result =  super.process(game, delta);
        if (!this.isActive) return result;

        const hasResolve = UnitHasBuffBJ(this.who.handle, BUFF_ID_RESOLVE);
        if (hasResolve) {
            const time = game.getTimeStamp();
            if (this.nextHealFromResolve < time) {
                this.nextHealFromResolve = time + 10;
                this.who.life = this.who.life + 50;
                const sfx = AddSpecialEffect(SFX_FLASH_HEAL, this.who.x, this.who.y);
                BlzSetSpecialEffectZ(sfx, getZFromXY(this.who.x, this.who.y) + 30);
                DestroyEffect(sfx);
            }
        }

        return result;
    }

    public onStatusChange(game: Game, newStatus: boolean) {
        if (newStatus) {
            // Do stuff
        }
        else {
            // Remove purity buff
            this.damageTracker.destroy();
        }
    }

    private onUnitTakesDamage() {
        const damage = GetEventDamage();
        BlzSetEventDamage(damage - 2);
    }
}