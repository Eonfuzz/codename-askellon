import { BuffInstanceDuration } from "app/buff/buff-instance-duration-type";
import { DynamicBuffEntity } from "app/buff/dynamic-buff-entity";
import { ABIL_ALIEN_DEFILER_INFESTATION, ABIL_ALIEN_WEBSHOT } from "resources/ability-ids";
import { BUFF_ID } from "resources/buff-ids";
import { Effect, MapPlayer, Unit } from "w3ts/index";
import { Behaviour } from "../behaviour";
import { ABILITY_HOOK } from "../hook-types";

export class DefilerInfestationBehaviour extends Behaviour {
    
    constructor() {
        super();
        // MessageAllPlayers("Creating cull behaviour");
    }

    public onEvent(event: ABILITY_HOOK) {
        if (event === ABILITY_HOOK.PreUnitDealsDamage) {
            if (BlzGetEventIsAttack() && this.forUnit.getAbilityCooldownRemaining(ABIL_ALIEN_DEFILER_INFESTATION) <= 0) {
                this.forUnit.startAbilityCooldown(ABIL_ALIEN_DEFILER_INFESTATION, 15);

                const target = Unit.fromHandle(GetTriggerUnit());
                
                DynamicBuffEntity.getInstance().addBuff(
                    BUFF_ID.DEFILER_INFESTATION, 
                    target, 
                    new BuffInstanceDuration(this.forUnit, 6)
                );
            }
        }
    }

    /**
     * Iterate upon this instance of the aiblity
     */
    public step(deltaTime: number) {}

    public doDestroy() {
        if (!this.forUnit.isAlive()) return true;
        return false;
    }

    public destroy() {
        // Log.Information(`Destroying CullTheHerd for ${this.forUnit.name}`)
    }
}