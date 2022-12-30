import { MessageAllPlayers } from "lib/utils";
import { ABIL_GENE_PSION_SPIKE } from "resources/ability-ids";
import { Unit } from "w3ts";
import { Behaviour } from "../behaviour";
import { ABILITY_HOOK } from "../hook-types";

export class PsionicPotentialBehaviour extends Behaviour {
    
    public init(unit: Unit) {
        if (super.init(unit)) {
            this.forUnit.addAbility(ABIL_GENE_PSION_SPIKE);

            return true;
        }
        return false;        
    }

    public onEvent(event: ABILITY_HOOK) {
        // if (event === ABILITY_HOOK.PostUnitTakesDamage) {
        //     if (this.forUnit.invulnerable) return;

        //     // If we are less than 20% life we explode
        //     if ((this.forUnit.life - GetEventDamage()) / this.forUnit.maxLife <= 0.2) {
        //         BlzSetEventDamage(0);
        //         this.forUnit.invulnerable = true;
        //         this.forUnit.setVertexColor(80, 80, 80, 255);
        //     }
        // }
    }

    /**
     * Iterate upon this instance of the aiblity
     */
    public step(deltaTime: number) {}

    public doDestroy() {
        if (!this.forUnit.isAlive()) return true;
        return false;
    }

    public destroy() {}
}