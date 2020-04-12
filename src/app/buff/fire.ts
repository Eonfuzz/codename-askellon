/** @noSelfInFile **/
import { Game } from "../game";
import { BuffInstance, DynamicBuff } from "./buff-instance";
import { Crewmember } from "../crewmember/crewmember-type";
import { TimedEvent } from "../types/timed-event";
import { SoundWithCooldown, SoundRef } from "../types/sound-ref";
import { Log } from "../../lib/serilog/serilog";
import { ABIL_ACCURACY_BONUS_30, FIRE_ARMOR_REDUCTION } from "resources/ability-ids";
import { BUFF_ID } from "resources/buff-ids";

const FIRE_SFX = 'Abilities\\Spells\\Other\\BreathOfFire\\BreathOfFireDamage.mdl;'

/**
 * Resolve is a buff applied to a unit
 * Can be applied multiple times and from multiple sources
 */
export class onFire extends DynamicBuff {
    name = BUFF_ID.FIRE;

    private fireDamageTicker: number = 0;
    private fireSfx = [];

    protected doesStack = false;

    public process(game: Game, delta: number): boolean {
        const result =  super.process(game, delta);
        if (!this.isActive) return result;
    
        this.fireDamageTicker += delta

        const sfx = AddSpecialEffect(FIRE_SFX, this.who.x, this.who.y);
        this.fireSfx.unshift(sfx);

        if (this.fireSfx.length >= 4) {
            const nSfx = this.fireSfx.pop();
            DestroyEffect(nSfx);
        }

        if (this.fireDamageTicker >= 1) {
            this.fireDamageTicker = 0;
            UnitDamageTarget(
                this.who.handle, 
                this.who.handle, 
                1,
                false, 
                false, 
                ATTACK_TYPE_HERO, 
                DAMAGE_TYPE_FIRE, 
                WEAPON_TYPE_WHOKNOWS
            );
        }
        return result;
    }

    public onStatusChange(game: Game, newStatus: boolean) {
        if (newStatus) {
            this.who.addAbility(FIRE_ARMOR_REDUCTION);
        }
        else {
            this.who.removeAbility(FIRE_ARMOR_REDUCTION);
            this.fireSfx.forEach(sfx => DestroyEffect(sfx));
        }
    }
}