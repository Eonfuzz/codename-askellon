import { BUFF_ID, BUFF_ID_RESOLVE, BUFF_ID_PURITY_SEAL } from "resources/buff-ids";
import { Unit, Trigger } from "w3ts/index";
import { Log } from "lib/serilog/serilog";
import { SFX_FLASH_HEAL } from "resources/sfx-paths";
import { getZFromXY } from "lib/utils";
import { TECH_MAJOR_RELIGION } from "resources/ability-ids";
import { CREWMEMBER_UNIT_ID } from "resources/unit-ids";
import { ResearchFactory } from "app/research/research-factory";
import { EventEntity } from "app/events/event-entity";
import { DynamicBuff } from "../dynamic-buff-type";
import { EventListener } from "app/events/event-type";
import { EVENT_TYPE } from "app/events/event-enum";
import { ChatEntity } from "app/chat/chat-entity";
import { BuffInstance } from "../buff-instance-type";

export class PuritySeal extends DynamicBuff {
    id = BUFF_ID.PURITY_SEAL;

    protected doesStack = false;

    private damageTracker: Trigger;
    private levelUpTracker: EventListener;


    private doHealWhileLow: boolean = false;
    private nextHealFromResolve: number = 0;

    public addInstance(unit: Unit, instance: BuffInstance, isNegativeInstance?: boolean) {
        super.addInstance(unit, instance, isNegativeInstance);
    }

    public process(gametime: number, delta: number): boolean {
        const result =  super.process(gametime, delta);
        if (!this.isActive) return result;

        if (this.doHealWhileLow) {
            const hasResolve = UnitHasBuffBJ(this.who.handle, BUFF_ID_RESOLVE);
            if (hasResolve) {
                if (this.nextHealFromResolve < gametime) {
                    this.nextHealFromResolve = gametime + 30;
                    this.who.life = this.who.life + 50;
                    const sfx = AddSpecialEffect(SFX_FLASH_HEAL, this.who.x, this.who.y);
                    BlzSetSpecialEffectZ(sfx, getZFromXY(this.who.x, this.who.y) + 30);
                    DestroyEffect(sfx);
                }
            }
        }

        return result;
    }

    public onStatusChange(newStatus: boolean) {
        if (newStatus) {

            this.doHealWhileLow = ResearchFactory.getInstance().getMajorUpgradeLevel(TECH_MAJOR_RELIGION) >= 2;

            // Do stuff
            this.damageTracker = new Trigger();
            this.damageTracker.registerUnitEvent(this.who, EVENT_UNIT_DAMAGING);
            this.damageTracker.addAction(() => this.onUnitTakesDamage());

            this.levelUpTracker = new EventListener(
                EVENT_TYPE.HERO_LEVEL_UP, 
                (self, data) => this.onUnitLevelup(data.source)
            );

            EventEntity.getInstance().addListener(this.levelUpTracker);
        }
        else {
            this.damageTracker.destroy();
            this.damageTracker = undefined;
            EventEntity.getInstance().removeListener(this.levelUpTracker);
            this.levelUpTracker = undefined;

            // Remove purity buff
            UnitRemoveBuffBJ(BUFF_ID_PURITY_SEAL, this.who.handle);
        }
    }

    private onUnitTakesDamage() {
        const damage = GetEventDamage();
        BlzSetEventDamage(damage - 2);
    }

    private onUnitLevelup(whichUnit: Unit) {
        if (whichUnit === this.who && ResearchFactory.getInstance().getMajorUpgradeLevel(TECH_MAJOR_RELIGION) >= 1) {
            // Increase strength by 1
            whichUnit.strength += 1;

            const ourInstance = this.instances[0];
            const buffSource = ourInstance.source;
            ChatEntity.getInstance().postMessage(whichUnit.owner, "BLESSING", "Holy power floods your veins (+1 Vitality)");

            if (buffSource.typeId === CREWMEMBER_UNIT_ID && ResearchFactory.getInstance().techHasOccupationBonus(TECH_MAJOR_RELIGION, 1)) {
                buffSource.strength += 1;
                ChatEntity.getInstance().postMessage(buffSource.owner, "BLESSING", "Holy power floods your veins (+1 Vitality)");
            }
        }        
    }
}