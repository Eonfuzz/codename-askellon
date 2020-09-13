import { Ability } from "../ability-type";
import { Unit } from "w3ts/index";
import { PlayNewSoundOnUnit } from "lib/translators";
import { Game } from "app/game";
import { SecurityEntity } from "app/station/security-module";

const REPAIR_DURATION = 6;
const REPAIR_TICK_EVERY = 1;
const REPAIR_AMOUNT = 100;
// const REPAIR_ORDER_ID = 852010;

export class ItemRepairAbility implements Ability {

    private unit: Unit;
    private targetUnit: Unit;

    private timeElapsed = 0;
    private timeElapsedSinceLastRepair = 0;
    private castOrderId: number;

    constructor() {}

    public initialise() {
        this.unit = Unit.fromHandle(GetTriggerUnit());
        this.targetUnit = Unit.fromHandle(GetSpellTargetUnit());

        this.castOrderId = GetUnitCurrentOrder(this.unit.handle);
        return true;
    };

    public process(delta: number) {
        this.timeElapsed += delta;
        this.timeElapsedSinceLastRepair += delta;

        if (GetUnitCurrentOrder(this.unit.handle) != this.castOrderId) {
            // Log.Information(GetUnitCurrentOrder(this.unit.handle)+" Does not match "+REPAIR_ORDER_ID);
            return false;
        }
        if (this.timeElapsedSinceLastRepair >= REPAIR_TICK_EVERY) {
            this.timeElapsedSinceLastRepair -= REPAIR_TICK_EVERY;
            const sound = PlayNewSoundOnUnit('UI\\Feedback\\CheckpointPopup\\QuestCheckpoint.flac', this.targetUnit, 127);
            KillSoundWhenDone(sound);
            // Repair the target
            this.targetUnit.life = this.targetUnit.life + REPAIR_AMOUNT;

            // Notify game of the healing
            SecurityEntity.getInstance().onSecurityHeal(this.targetUnit.handle, this.unit.handle);

            // If the unit is full health lets end the repair
            if (this.targetUnit.life >= this.targetUnit.maxLife) { 
                this.unit.pauseEx(true);
                this.unit.pauseEx(false);
                return false;
            }
        }

        if (this.timeElapsed >= 0.5) {
            const v = MathRound(Math.max(Sin(this.timeElapsed * bj_PI * 2 + bj_PI/2), 0) * 100);
            this.targetUnit.setVertexColor(255 - v, 255 - v, 255, 255);
            this.unit.setVertexColor(255 - v, 255 - v, 255, 255);
        }
        return this.timeElapsed < REPAIR_DURATION;
    };

    public destroy() { 
        this.targetUnit.setVertexColor(255, 255, 255, 255);
        this.unit.setVertexColor(255, 255 , 255, 255);
        return true;
    };
}