import { MapPlayer, Trigger, Unit } from "w3ts/index";
import { Vector2 } from "app/types/vector2";
import { AskellonEntity } from "../askellon-entity";
import { Log } from "lib/serilog/serilog";
import { syncData } from "lib/utils";
import { Timers } from "app/timer-type";
import { TERMINAL_REACTOR_DUMMY, TERMINAL_GENE_DUMMY, TERMINAL_RELIGION_DUMMY, TERMINAL_WEAPONS_DUMMY, TERMINAL_MEDICAL_DUMMY, TERMINAL_PURGE_DUMMY, TERMINAL_SECURITY_DUMMY, TERMINAL_VOID_DUMMY, TERMINAL_REACTOR, TERMINAL_GENE, TERMINAL_RELIGION, TERMINAL_WEAPONS, TERMINAL_MEDICAL, TERMINAL_VOID, TERMINAL_PURGE, TERMINAL_SECURITY } from "resources/unit-ids";

export const TERMINAL_TIMEOUT_DISTANCE = 600;

export const terminalTypetoDummy = new Map<number, number>();
terminalTypetoDummy.set(TERMINAL_REACTOR, TERMINAL_REACTOR_DUMMY);
terminalTypetoDummy.set(TERMINAL_GENE, TERMINAL_GENE_DUMMY);
terminalTypetoDummy.set(TERMINAL_RELIGION, TERMINAL_RELIGION_DUMMY);
terminalTypetoDummy.set(TERMINAL_WEAPONS, TERMINAL_WEAPONS_DUMMY);
terminalTypetoDummy.set(TERMINAL_MEDICAL, TERMINAL_MEDICAL_DUMMY);
terminalTypetoDummy.set(TERMINAL_VOID, TERMINAL_VOID_DUMMY);
terminalTypetoDummy.set(TERMINAL_PURGE, TERMINAL_PURGE_DUMMY);
terminalTypetoDummy.set(TERMINAL_SECURITY, TERMINAL_SECURITY_DUMMY);

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

        this.terminalCastAbilityTrigger = new Trigger();
        this.terminalCastAbilityTrigger.registerUnitEvent(this.terminalUnit, EVENT_UNIT_SPELL_CAST);
        this.terminalCastAbilityTrigger.addAction(() => this.onCast());

        this.unselectionTrigger = new Trigger();
        const syncher = syncData(`INT_SEL_${Terminal.id++}`, this.sourceUnit.owner, (self, data: string) => this.onUnitUnselect());

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