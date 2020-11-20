import { BUFF_ID, BUFF_ID_RESOLVE, BUFF_ID_PURITY_SEAL, BUFF_ID_VOID_SICKNESS } from "resources/buff-ids";
import { Unit, Trigger } from "w3ts/index";
import { SFX_FLASH_HEAL } from "resources/sfx-paths";
import { getZFromXY } from "lib/utils";
import { TECH_MAJOR_RELIGION, ABIL_VOID_SICKNESS_APPLY } from "resources/ability-ids";
import { CREWMEMBER_UNIT_ID } from "resources/unit-ids";
import { ResearchFactory } from "app/research/research-factory";
import { EventEntity } from "app/events/event-entity";
import { DynamicBuff } from "../dynamic-buff-type";
import { EventListener } from "app/events/event-type";
import { EVENT_TYPE } from "app/events/event-enum";
import { ChatEntity } from "app/chat/chat-entity";
import { BuffInstance } from "../buff-instance-type";
import { DummyCast } from "lib/dummy";
import { UPGR_DUMMY_VOID_SICKNESS } from "resources/upgrade-ids";
import { Log } from "lib/serilog/serilog";

export class VoidSickness extends DynamicBuff {
    id = BUFF_ID.PURITY_SEAL;

    protected doesStack = false;

    public addInstance(unit: Unit, instance: BuffInstance, isNegativeInstance?: boolean) {
        super.addInstance(unit, instance, isNegativeInstance);
    }

    public process(gametime: number, delta: number): boolean {
        const result =  super.process(gametime, delta);
        if (!this.isActive) return result;
        if (!UnitHasBuffBJ(this.who.handle, BUFF_ID_VOID_SICKNESS)) {
            DummyCast((dummy: unit) => {
                SetUnitX(dummy, this.who.x);
                SetUnitY(dummy, this.who.y + 50);
                IssueTargetOrder(dummy, "faeriefire", this.who.handle);
            }, ABIL_VOID_SICKNESS_APPLY);
        }
        return result;
    }

    public onStatusChange(newStatus: boolean) {
        if (newStatus) {
            DummyCast((dummy: unit) => {
                SetUnitX(dummy, this.who.x);
                SetUnitY(dummy, this.who.y + 50);
                IssueTargetOrder(dummy, "faeriefire", this.who.handle);
            }, ABIL_VOID_SICKNESS_APPLY);
            this.who.owner.setTechResearched(UPGR_DUMMY_VOID_SICKNESS, 
                this.who.owner.getTechCount(UPGR_DUMMY_VOID_SICKNESS, true) + 1
            );
            // Log.Information("Void sickness tech level "+(this.who.owner.getTechCount(UPGR_DUMMY_VOID_SICKNESS, true)))
        }
        else {

            this.who.owner.setTechResearched(UPGR_DUMMY_VOID_SICKNESS, 
                this.who.owner.getTechCount(UPGR_DUMMY_VOID_SICKNESS, true) - 1
            );
            // Log.Information("down sickness tech level "+(this.who.owner.getTechCount(UPGR_DUMMY_VOID_SICKNESS, true)))
            // Remove purity buff
            UnitRemoveBuffBJ(BUFF_ID_VOID_SICKNESS, this.who.handle);
        }
    }
}