import { Log } from "lib/serilog/serilog";
import { getZFromXY, MessageAllPlayers } from "lib/utils";
import { ABIL_GENE_HOP, ABIL_GENE_PSIONIC, ABIL_GENE_PSION_SPIKE, ABIL_HUMAN_SPRINT } from "resources/ability-ids";
import { SFX_DARK_RITUAL } from "resources/sfx-paths";
import { Effect, Unit } from "w3ts";
import { Behaviour } from "../behaviour";
import { ABILITY_HOOK } from "../hook-types";

export class PsionicPotentialBehaviour extends Behaviour {
    private stepper = 0.5;
    private active = false;
    
    public init(unit: Unit) {
        if (super.init(unit)) {
            // Add spike
            this.forUnit.addAbility(ABIL_GENE_PSION_SPIKE);
            this.forUnit.disableAbility(ABIL_GENE_PSION_SPIKE, false, false);
            // Disable and remove sprint
            this.forUnit.disableAbility(ABIL_HUMAN_SPRINT, true, true);
            this.forUnit.addAbility(ABIL_GENE_HOP);
            this.forUnit.disableAbility(ABIL_GENE_HOP, false, false);
            this.forUnit.addAbility(ABIL_GENE_PSIONIC);

            return true;
        }
        return false;        
    }

    public onEvent(event: ABILITY_HOOK) {
        if (event === ABILITY_HOOK.UnitCastsAbility) {
            if (this.forUnit.invulnerable) return;
            const damage = this.forUnit.intelligence * 2;
            const sfx = new Effect(SFX_DARK_RITUAL, this.forUnit.x, this.forUnit.y);
            sfx.z = getZFromXY(this.forUnit.x, this.forUnit.y);
            sfx.destroy();
            if (this.forUnit.life > damage) {
                this.forUnit.life -= damage;
            }
            else {
                this.forUnit.life = 1;
            }
        }
    }

    /**
     * Iterate upon this instance of the aiblity
     */
    public step(deltaTime: number) {
        this.stepper -= deltaTime;
        if (this.stepper <= 0) {
            this.stepper = 0.5;

            if (this.active) {
                Log.Information("Active!")
                this.forUnit.life += 5;
                this.forUnit.mana += 5;
                
                if (this.forUnit.mana / this.forUnit.maxMana <= 0.3) {
                    this.active = false;
                } 
            }
            else if (this.forUnit.mana / this.forUnit.maxMana <= 0.3 && this.forUnit.getAbilityCooldownRemaining(ABIL_GENE_PSIONIC) <=0) {
                this.forUnit.startAbilityCooldown(ABIL_GENE_PSIONIC, 60);
            }            
        }
    }

    public doDestroy() {
        if (!this.forUnit.isAlive()) return true;
        return false;
    }

    public destroy() {}
}