/** @noSelfInFile **/
import { Game } from "../game";
import { BuffInstance, DynamicBuff, BuffInstanceDuration } from "./buff-instance";
import { SoundWithCooldown, SoundRef } from "../types/sound-ref";
import { BUFF_ID, BUFF_ID_RESOLVE, BUFF_ID_PURITY_SEAL } from "resources/buff-ids";
import { Unit, Trigger } from "w3ts/index";
import { Log } from "lib/serilog/serilog";
import { SFX_FLASH_HEAL } from "resources/sfx-paths";
import { getZFromXY } from "lib/utils";
import { EventListener, EVENT_TYPE } from "app/events/event";
import { TECH_MAJOR_RELIGION } from "resources/ability-ids";
import { CREWMEMBER_UNIT_ID } from "resources/unit-ids";

export class PuritySeal extends DynamicBuff {
    id = BUFF_ID.PURITY_SEAL;

    protected doesStack = false;

    private damageTracker: Trigger;
    private levelUpTracker: EventListener;


    private doHealWhileLow: boolean = false;
    private nextHealFromResolve: number = 0;

    public addInstance(game: Game, unit: Unit, instance: BuffInstance, isNegativeInstance?: boolean) {
        super.addInstance(game, unit, instance, isNegativeInstance);
    }

    public process(game: Game, delta: number): boolean {
        const result =  super.process(game, delta);
        if (!this.isActive) return result;

        if (this.doHealWhileLow) {
            const hasResolve = UnitHasBuffBJ(this.who.handle, BUFF_ID_RESOLVE);
            if (hasResolve) {
                const time = game.getTimeStamp();
                if (this.nextHealFromResolve < time) {
                    this.nextHealFromResolve = time + 30;
                    this.who.life = this.who.life + 50;
                    const sfx = AddSpecialEffect(SFX_FLASH_HEAL, this.who.x, this.who.y);
                    BlzSetSpecialEffectZ(sfx, getZFromXY(this.who.x, this.who.y) + 30);
                    DestroyEffect(sfx);
                }
            }
        }

        return result;
    }

    public onStatusChange(game: Game, newStatus: boolean) {
        if (newStatus) {

            this.doHealWhileLow = game.researchModule.getMajorUpgradeLevel(TECH_MAJOR_RELIGION) >= 2;

            // Do stuff
            this.damageTracker = new Trigger();
            this.damageTracker.registerUnitEvent(this.who, EVENT_UNIT_DAMAGING);
            this.damageTracker.addAction(() => this.onUnitTakesDamage());

            this.levelUpTracker = new EventListener(
                EVENT_TYPE.HERO_LEVEL_UP, 
                (self, data) => this.onUnitLevelup(game, data.source)
            );

            game.event.addListener(this.levelUpTracker);
        }
        else {
            this.damageTracker.destroy();
            this.damageTracker = undefined;
            game.event.removeListener(this.levelUpTracker);
            this.levelUpTracker = undefined;

            // Remove purity buff
            UnitRemoveBuffBJ(BUFF_ID_PURITY_SEAL, this.who.handle);
        }
    }

    private onUnitTakesDamage() {
        const damage = GetEventDamage();
        BlzSetEventDamage(damage - 2);
    }

    private onUnitLevelup(game: Game, whichUnit: Unit) {
        if (whichUnit === this.who && game.researchModule.getMajorUpgradeLevel(TECH_MAJOR_RELIGION) >= 1) {
            // Increase strength by 1
            whichUnit.strength += 1;

            const ourInstance = this.instances[0];
            const buffSource = ourInstance.source;
            game.chatModule.postMessage(whichUnit.owner, "BLESSING", "Holy power floods your veins (+1 Vitality)");

            if (buffSource.typeId === CREWMEMBER_UNIT_ID && game.researchModule.techHasOccupationBonus(TECH_MAJOR_RELIGION, 1)) {
                buffSource.strength += 1;
                game.chatModule.postMessage(buffSource.owner, "BLESSING", "Holy power floods your veins (+1 Vitality)");
            }
        }        
    }
}