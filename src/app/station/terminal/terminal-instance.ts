import { MapPlayer, Trigger, Unit } from "w3ts/index";
import { Vector2 } from "app/types/vector2";
import { AskellonEntity } from "../askellon-entity";
import { Log } from "lib/serilog/serilog";
import { syncData } from "lib/utils";
import { Timers } from "app/timer-type";

export const TERMINAL_TIMEOUT_DISTANCE = 600;

/**
 * Does upgrades
 * Gets access to station wide abilities
 */
export class Terminal {

    public static id: number = 0;

    private sourceUnit: Unit;
    private baseUnit: Unit;
    private terminalUnit: Unit;

    private terminalCastAbilityTrigger: Trigger;
    private unselectionTrigger: Trigger;
    
    constructor(sourceUnit: Unit, baseUnit: Unit, terminalUnit: Unit) {
        this.sourceUnit = sourceUnit;
        this.baseUnit = baseUnit;
        this.terminalUnit = terminalUnit;

        this.terminalCastAbilityTrigger = new Trigger();
        this.terminalCastAbilityTrigger.registerUnitEvent(terminalUnit, EVENT_UNIT_SPELL_CAST);
        this.terminalCastAbilityTrigger.addAction(() => this.onCast());

        this.unselectionTrigger = new Trigger();
        const syncher = syncData(`INT_SEL_${Terminal.id++}`, this.sourceUnit.owner, (self, data: string) => {
            this.terminalUnit.kill();
        });

        this.unselectionTrigger.registerPlayerUnitEvent(this.sourceUnit.owner, EVENT_PLAYER_UNIT_DESELECTED, null);
        this.unselectionTrigger.addAction(() => {
            const u = GetTriggerUnit();
            if (u === this.terminalUnit.handle) syncher("Data");
        });

        terminalUnit.maxMana = AskellonEntity.getMaxPower();
        terminalUnit.mana = AskellonEntity.getCurrentPower();

        // Wait a frame and select our unit
        Timers.addTimedAction(0, () => {
            SelectUnitForPlayerSingle(terminalUnit.handle, terminalUnit.owner.handle);
        });
    }

    onCast() {
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

    onDestroy() {
        // Log.Information("Destroying terminal trig");
        this.terminalCastAbilityTrigger.destroy();
        this.unselectionTrigger.destroy();
    }
}