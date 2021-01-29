import { getZFromXY, showOverheadText } from "lib/utils";
import { ABIL_LIFE_REGEN_BONUS_25, ABIL_MOVESPEED_BONUS_30, FIRE_ARMOR_REDUCTION } from "resources/ability-ids";
import { BUFF_ID } from "resources/buff-ids";
import { SFX_FIRE, SFX_HEAL } from "resources/sfx-paths";
import { Unit } from "w3ts/index";
import { DynamicBuff } from "../dynamic-buff-type";


/**
 * Resolve is a buff applied to a unit
 * Can be applied multiple times and from multiple sources
 */
export class ComebackDrugBuff extends DynamicBuff {
    id = BUFF_ID.DRUG_COMEBACK;

    private static healthRegeneratedFromDrug: WeakMap<Unit, number>;
    private static currentHealthRegeneratedFromDrug: WeakMap<Unit, number>;


    constructor() {
        super();

        if (!ComebackDrugBuff.healthRegeneratedFromDrug) {
            ComebackDrugBuff.healthRegeneratedFromDrug = new WeakMap<Unit, number>();
            ComebackDrugBuff.currentHealthRegeneratedFromDrug = new WeakMap<Unit, number>();
        }

    }
    protected doesStack = false;

    private ticker = 0;
    private sfx: effect;

    public process(gametime: number, delta: number): boolean {
        const result =  super.process(gametime, delta);
        
        if (!this.isActive) return result;
        if (!this.who.isAlive()) return false;
        if (!this.who.show) return false;

        this.ticker += delta;

        if (this.ticker > 2) {
            this.ticker -= 2;
            
            const healing = Math.min(this.who.maxLife - this.who.life, 25);
            this.who.life += healing;
            ComebackDrugBuff.healthRegeneratedFromDrug.set(this.who, 
                (ComebackDrugBuff.healthRegeneratedFromDrug.get(this.who) || 0) + healing
            );
            ComebackDrugBuff.currentHealthRegeneratedFromDrug.set(this.who, 
                (ComebackDrugBuff.currentHealthRegeneratedFromDrug.get(this.who) || 0) + healing
            );
            if (healing > 0) {
                showOverheadText(this.who.x, this.who.y, 119, 221, 119, 200, `+${MathRound(healing)}`);
            
                this.sfx = AddSpecialEffect(SFX_HEAL, this.who.x, this.who.y);
                BlzSetSpecialEffectZ(this.sfx, getZFromXY(this.who.x, this.who.y) + 20);
                DestroyEffect(this.sfx);
            }
        }
        if (this.sfx) {
            BlzSetSpecialEffectX(this.sfx, this.who.x);
            BlzSetSpecialEffectY(this.sfx, this.who.y);
        }
        return result;
    }

    public onStatusChange(newStatus: boolean) {
        if (newStatus) {
            this.who.addAbility(ABIL_MOVESPEED_BONUS_30);
            const bonusMaxHp = 200 + MathRound((ComebackDrugBuff.healthRegeneratedFromDrug.get(this.who) || 0) / 10);
            this.who.maxLife += bonusMaxHp;
            // this.who.life += bonusMaxHp;
            // Reset current health regen
            ComebackDrugBuff.currentHealthRegeneratedFromDrug.set(this.who, 0);
            showOverheadText(this.who.x, this.who.y, 119, 221, 119, 200, `+${bonusMaxHp}`);
        }
        else {
            this.who.removeAbility(ABIL_MOVESPEED_BONUS_30);
            const bonusHealthLoss = MathRound((ComebackDrugBuff.currentHealthRegeneratedFromDrug.get(this.who) || 0) / 10);
            const healthLoss = 200 + bonusHealthLoss;
            this.who.maxLife -= healthLoss;
            showOverheadText(this.who.x, this.who.y, 255, 105, 97, 200, `-${bonusHealthLoss} Max HP`);
        }
    }
}