/** @noSelfInFile **/
import { Game } from "../../game";
import { ABIL_ACCURACY_BONUS_30, FIRE_ARMOR_REDUCTION } from "resources/ability-ids";
import { BUFF_ID } from "resources/buff-ids";
import { SFX_FIRE } from "resources/sfx-paths";
import { DynamicBuff } from "../dynamic-buff-type";


/**
 * Resolve is a buff applied to a unit
 * Can be applied multiple times and from multiple sources
 */
export class onFire extends DynamicBuff {
    id = BUFF_ID.FIRE;

    private fireDamageTicker: number = 0;
    private fireSfx = [];

    protected doesStack = false;

    public process(gametime: number, delta: number): boolean {
        const result =  super.process(gametime, delta);
        
        // Log.Information("Fire tick "+result);
        if (!this.isActive) return result;
    
        this.fireDamageTicker += delta

        const sfx = AddSpecialEffect(SFX_FIRE, this.who.x, this.who.y);
        this.fireSfx.unshift(sfx);

        if (this.fireSfx.length >= 4) {
            const nSfx = this.fireSfx.pop();
            DestroyEffect(nSfx);
        }

        if (this.fireDamageTicker >= 1) {
            this.fireDamageTicker = 0;
            const damageSource = this.instances[this.instances.length - 1].source;

            UnitDamageTarget(
                damageSource.handle, 
                this.who.handle, 
                5,
                false, 
                false, 
                ATTACK_TYPE_HERO, 
                DAMAGE_TYPE_FIRE, 
                WEAPON_TYPE_WHOKNOWS
            );
        }
        return result;
    }

    public onStatusChange(newStatus: boolean) {
        if (newStatus) {
            this.who.addAbility(FIRE_ARMOR_REDUCTION);
        }
        else {
            this.who.removeAbility(FIRE_ARMOR_REDUCTION);
            this.fireSfx.forEach(sfx => DestroyEffect(sfx));
        }
    }
}