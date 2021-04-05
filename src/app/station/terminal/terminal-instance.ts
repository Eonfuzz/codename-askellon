import { MapPlayer, Trigger, Unit } from "w3ts/index";
import { Vector2 } from "app/types/vector2";
import { AskellonEntity } from "../askellon-entity";
import { Log } from "lib/serilog/serilog";
import { syncData } from "lib/utils";
import { Timers } from "app/timer-type";
import { TERMINAL_REACTOR_DUMMY, TERMINAL_GENE_DUMMY, TERMINAL_RELIGION_DUMMY, TERMINAL_WEAPONS_DUMMY, TERMINAL_MEDICAL_DUMMY, TERMINAL_PURGE_DUMMY, TERMINAL_SECURITY_DUMMY, TERMINAL_VOID_DUMMY, TERMINAL_REACTOR, TERMINAL_GENE, TERMINAL_RELIGION, TERMINAL_WEAPONS, TERMINAL_MEDICAL, TERMINAL_VOID, TERMINAL_PURGE, TERMINAL_ADMINISTRATION, GENETIC_TESTING_FACILITY_SWITCH, GENETIC_TESTING_FACILITY_SWITCH_DUMMY, UNIT_ID_CULTIST_ALTAR, UNIT_ID_CULTIST_ALTAR_TERMINAL, TERMINAL_ADMINISTRATION_DUMMY } from "resources/unit-ids";
import { SmartTrigger } from "lib/SmartTrigger";

export const TERMINAL_TIMEOUT_DISTANCE = 600;

export const terminalTypetoDummy = new Map<number, number>();
terminalTypetoDummy.set(TERMINAL_REACTOR, TERMINAL_REACTOR_DUMMY);
terminalTypetoDummy.set(TERMINAL_GENE, TERMINAL_GENE_DUMMY);
terminalTypetoDummy.set(TERMINAL_RELIGION, TERMINAL_RELIGION_DUMMY);
terminalTypetoDummy.set(TERMINAL_WEAPONS, TERMINAL_WEAPONS_DUMMY);
terminalTypetoDummy.set(TERMINAL_MEDICAL, TERMINAL_MEDICAL_DUMMY);
terminalTypetoDummy.set(TERMINAL_VOID, TERMINAL_VOID_DUMMY);
terminalTypetoDummy.set(TERMINAL_PURGE, TERMINAL_PURGE_DUMMY);
terminalTypetoDummy.set(TERMINAL_ADMINISTRATION, TERMINAL_ADMINISTRATION_DUMMY);
terminalTypetoDummy.set(TERMINAL_ADMINISTRATION_DUMMY, TERMINAL_SECURITY_DUMMY);
terminalTypetoDummy.set(TERMINAL_SECURITY_DUMMY, TERMINAL_ADMINISTRATION_DUMMY);
terminalTypetoDummy.set(GENETIC_TESTING_FACILITY_SWITCH, GENETIC_TESTING_FACILITY_SWITCH_DUMMY);
terminalTypetoDummy.set(UNIT_ID_CULTIST_ALTAR, UNIT_ID_CULTIST_ALTAR_TERMINAL);

/**
 * Does upgrades
 * Gets access to station wide abilities
 */
export class Terminal {

    public static id: number = 0;

    protected sourceUnit: Unit;
    protected baseUnit: Unit;
    protected terminalUnit: Unit;

    protected terminalCastAbilityTrigger: Trigger;
    protected unselectionTrigger: Trigger;
    
    constructor(sourceUnit: Unit, baseUnit: Unit) {
        this.sourceUnit = sourceUnit;
        this.baseUnit = baseUnit;

        this.createTerminalUnit(sourceUnit, baseUnit);

        this.terminalCastAbilityTrigger = new SmartTrigger();
        this.terminalCastAbilityTrigger.registerUnitEvent(this.terminalUnit, EVENT_UNIT_SPELL_CAST);
        this.terminalCastAbilityTrigger.addAction(() => this.onCast());

        this.unselectionTrigger = new SmartTrigger();
        const syncher = syncData(`INT_SEL_${Terminal.id++}`, this.sourceUnit.owner, (data: string) => this.onUnitUnselect());

        this.unselectionTrigger.registerPlayerUnitEvent(this.sourceUnit.owner, EVENT_PLAYER_UNIT_DESELECTED, null);
        this.unselectionTrigger.addAction(() => {
            const u = GetTriggerUnit();
            if (u === this.terminalUnit.handle) syncher("Data");
        });

    }

    /**
     * Creates our terminal unit, can be overridden
     */
    public createTerminalUnit(sourceUnit: Unit, fromUnit: Unit) {
        this.terminalUnit = new Unit(sourceUnit.owner, terminalTypetoDummy.get(fromUnit.typeId), fromUnit.x, fromUnit.y, bj_UNIT_FACING);
        this.terminalUnit.maxMana = AskellonEntity.getMaxPower();
        this.terminalUnit.mana = AskellonEntity.getCurrentPower();

        // Wait a frame and select our unit
        Timers.addTimedAction(0, () => {
            SelectUnitForPlayerSingle(this.terminalUnit.handle, this.terminalUnit.owner.handle);
        });

    }

    protected onCast() {
        const abil = GetSpellAbilityId();
        const level = GetUnitAbilityLevel(this.terminalUnit.handle, abil);
        const manaCost = BlzGetAbilityManaCost(abil, level-1);
        AskellonEntity.addToPower(-manaCost);
    }

    public getTerminalDummy() { return this.terminalUnit; }

    step(delta: number): boolean {
        const tooFar = Vector2.fromWidget(this.sourceUnit.handle)
            .distanceTo(Vector2.fromWidget(this.terminalUnit.handle)) > TERMINAL_TIMEOUT_DISTANCE;

        if (tooFar || !this.terminalUnit.isAlive()) {
            return false;
        }
        else {            
            this.terminalUnit.maxMana = AskellonEntity.getMaxPower();
            this.terminalUnit.mana = AskellonEntity.getCurrentPower();
        }
        return true;
    }

    protected onUnitUnselect() {
        this.terminalUnit.kill();
    }

    onDestroy() {
        // Log.Information("Destroying terminal trig");
        this.terminalCastAbilityTrigger.destroy();
        this.unselectionTrigger.destroy();
    }
}