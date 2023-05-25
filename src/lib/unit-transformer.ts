import { ABIL_MECH_CRITTER } from "resources/ability-ids";
import { GetDummyUnit } from "./dummy";
import { Log } from "./serilog/serilog";

export class UnitTransformer {
    private dummyUnit: unit;
    private checks: {player: player, transformSpell: number, locX: number, locY: number, facing: number}[] = [];
    private trigger: trigger;
    private previousSpawned?: unit;

    constructor() {
        // Create a dummy unit for all abilities
        this.dummyUnit = CreateUnit(Player(25), FourCC('dumy'), 0, 0, bj_UNIT_FACING);
        ShowUnit(this.dummyUnit, false);

        UnitAddAbility(this.dummyUnit, ABIL_MECH_CRITTER);
        this.trigger = CreateTrigger();

        TriggerRegisterAnyUnitEventBJ(this.trigger, EVENT_PLAYER_UNIT_SUMMON);
        TriggerAddAction(this.trigger, () => this.onSummonCheck(GetSummonedUnit()));
    }

    private onSummonCheck(unit: unit) {
        let next = this.checks[0];
        if (next) {
            this.checks.splice(0, 1);
            SetUnitOwner(unit, next.player, true);
            UnitAddAbility(unit, next.transformSpell);
            SetUnitX(unit, next.locX);
            SetUnitY(unit, next.locY);
            BlzSetUnitFacingEx(unit, next.facing);
            this.previousSpawned = unit;
        }
    }

    public apply(player: player, transformSpell: number, locX: number, locY: number, facing: number = 90): unit {
        this.checks.push({ player, transformSpell, locX, locY, facing });
        ShowUnit(this.dummyUnit, true);
        IssueImmediateOrderById(this.dummyUnit, 852564);
        ShowUnit(this.dummyUnit, false);
        return this.previousSpawned;
    }

    public destroy() {
        // DisableTrigger(this.trigger);
        DestroyTrigger(this.trigger);
    }
}