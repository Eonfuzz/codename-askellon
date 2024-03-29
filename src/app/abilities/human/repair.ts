import { AbilityWithDone } from "../ability-type";
import { Unit } from "w3ts/index";
import { PlayNewSoundOnUnit } from "lib/translators";
import { Game } from "app/game";
import { SecurityEntity } from "app/station/security-module";
import { UNIT_ID_DEBRIS_1, UNIT_ID_DEBRIS_2, UNIT_ID_DEBRIS_3 } from "resources/unit-ids";

const REPAIR_DURATION = 6;
const REPAIR_TICK_EVERY = 1;
const REPAIR_AMOUNT = 100;
// const REPAIR_ORDER_ID = 852010;

export class ItemRepairAbility extends AbilityWithDone {

    private timeElapsed = 0;
    private timeElapsedSinceLastRepair = 0;
    private castOrderId: number;

    

    public init() {
        super.init();
        // We are targeting a destructible
        if (GetSpellTargetDestructable()) {
            KillDestructable(GetSpellTargetDestructable());
            return false;
        }
        
        this.casterUnit = Unit.fromHandle(GetTriggerUnit());
        this.targetUnit = Unit.fromHandle(GetSpellTargetUnit());

        if (this.targetUnit.typeId === UNIT_ID_DEBRIS_1 || 
            this.targetUnit.typeId === UNIT_ID_DEBRIS_2 || 
            this.targetUnit.typeId === UNIT_ID_DEBRIS_3) {
                this.targetUnit.kill();
            }

        this.castOrderId = GetUnitCurrentOrder(this.casterUnit.handle);
        return true;
    };

    public step(delta: number) {
        this.timeElapsed += delta;
        this.timeElapsedSinceLastRepair += delta;

        if (GetUnitCurrentOrder(this.casterUnit.handle) != this.castOrderId) {
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
            SecurityEntity.getInstance().onSecurityHeal(this.targetUnit.handle, this.casterUnit.handle);

            // If the unit is full health lets end the repair
            if (this.targetUnit.life >= this.targetUnit.maxLife) { 
                this.casterUnit.pauseEx(true);
                this.casterUnit.pauseEx(false);
                this.done = true;
                return false;
            }
        }

        if (this.timeElapsed >= 0.5) {
            const v = MathRound(Math.max(Sin(this.timeElapsed * bj_PI * 2 + bj_PI/2), 0) * 100);
            this.targetUnit.setVertexColor(255 - v, 255 - v, 255, 255);
            this.casterUnit.setVertexColor(255 - v, 255 - v, 255, 255);
        }

        if (this.timeElapsed >= REPAIR_DURATION) this.done = true;
    };

    public destroy() { 
        this.targetUnit.setVertexColor(255, 255, 255, 255);
        this.casterUnit.setVertexColor(255, 255 , 255, 255);
        return true;
    };
}