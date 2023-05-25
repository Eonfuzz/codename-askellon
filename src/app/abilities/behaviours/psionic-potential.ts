import { BuffInstanceDuration } from "app/buff/buff-instance-duration-type";
import { DynamicBuffEntity } from "app/buff/dynamic-buff-entity";
import { ChatEntity } from "app/chat/chat-entity";
import { EventEntity } from "app/events/event-entity";
import { EVENT_TYPE } from "app/events/event-enum";
import { EventListener } from "app/events/event-type";
import { Log } from "lib/serilog/serilog";
import { getZFromXY, MessageAllPlayers, MessagePlayer } from "lib/utils";
import { ABIL_GENE_HOP, ABIL_GENE_PSIONIC, ABIL_GENE_PSION_SPIKE, ABIL_HUMAN_SPRINT } from "resources/ability-ids";
import { BUFF_ID } from "resources/buff-ids";
import { COL_PSIONIC, COL_RED } from "resources/colours";
import { SFX_BLUE_BALL, SFX_DARK_RITUAL, SFX_MANA_DRAIN_AURA } from "resources/sfx-paths";
import { Effect, Unit } from "w3ts";
import { Behaviour } from "../behaviour";
import { ABILITY_HOOK } from "../hook-types";

export class PsionicPotentialBehaviour extends Behaviour {
    private stepper = 0.5;
    private sfx?: Effect;
    private active = false;

    private listeners = [];
    private stormCount = 0;
    
    public init(unit: Unit) {
        if (super.init(unit)) {
            this.forUnit.disableAbility(ABIL_HUMAN_SPRINT, true, true);

            // Add Spike
            this.forUnit.addAbility(ABIL_GENE_PSION_SPIKE);
            this.forUnit.disableAbility(ABIL_GENE_PSION_SPIKE, true, false);
            // this.forUnit.disableAbility(ABIL_GENE_PSION_SPIKE, true, false);
            // Add Blink
            this.forUnit.addAbility(ABIL_GENE_HOP);
            this.forUnit.disableAbility(ABIL_GENE_HOP, true, false);
            this.forUnit.addAbility(ABIL_GENE_PSIONIC);
            // this.forUnit.disableAbility(ABIL_GENE_PSIONIC, true, false);

            this.listeners.push(new EventListener(EVENT_TYPE.WORLD_EVENT_SOLAR, data => {
                ChatEntity.postMessageFor([this.forUnit.owner], "PSIONIC", COL_PSIONIC, "Your powers grow");
                DynamicBuffEntity.add(BUFF_ID.RESOLVE, this.forUnit, new BuffInstanceDuration(this.forUnit, 60));

                if (this.stormCount === 0) {
                    this.forUnit.disableAbility(ABIL_GENE_PSION_SPIKE, false, false);
                }
                else if (this.stormCount === 1) {
                    this.forUnit.disableAbility(ABIL_GENE_HOP, false, false);
                }

                this.forUnit.intelligence += 2;
                this.stormCount++;
            }));
            EventEntity.getInstance().addListener(this.listeners);
            return true;
        }
        return false;        
    }

    public onEvent(event: ABILITY_HOOK) {
        if (event === ABILITY_HOOK.UnitCastsAbility) {
            if (this.forUnit.invulnerable) return;

            if (BlzGetAbilityManaCost(GetSpellAbilityId(), 1) > 0) {
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
    }

    /**
     * Iterate upon this instance of the aiblity
     */
    public step(deltaTime: number) {
        this.stepper -= deltaTime;
        if (this.stepper <= 0) {
            this.stepper = 0.5;

            BlzSetUnitAbilityManaCost(this.forUnit.handle, ABIL_GENE_PSION_SPIKE, 1, MathRound(this.forUnit.maxMana * 0.2))
            BlzSetUnitAbilityManaCost(this.forUnit.handle, ABIL_GENE_PSION_SPIKE, 0, MathRound(this.forUnit.maxMana * 0.2))

            if (this.active) {
                this.forUnit.life = this.forUnit.life - 2.5;
                this.forUnit.mana = this.forUnit.mana + 5;
                
                if ((this.forUnit.mana / this.forUnit.maxMana) > 0.4) {
                    this.active = false;
                    this.sfx?.destroy();
                    this.forUnit.setVertexColor(255, 255, 255, 255);
                } 
            }
            else if (this.forUnit.mana / this.forUnit.maxMana <= 0.4 && this.forUnit.getAbilityCooldownRemaining(ABIL_GENE_PSIONIC) <=0) {
                this.forUnit.startAbilityCooldown(ABIL_GENE_PSIONIC, 60);
                this.active = true;
                this.sfx = new Effect(SFX_MANA_DRAIN_AURA, this.forUnit, "origin");
                this.forUnit.setVertexColor(50, 50, 255, 150);
            }            
        }
    }

    public doDestroy() {
        if (!this.forUnit.isAlive()) return true;
        return false;
    }

    public destroy() {
        this.forUnit.removeAbility(ABIL_GENE_PSION_SPIKE);
        this.forUnit.removeAbility(ABIL_GENE_HOP);
        this.forUnit.removeAbility(ABIL_GENE_PSIONIC);
        this.forUnit.disableAbility(ABIL_HUMAN_SPRINT, false, false);

        this.listeners.forEach(e => EventEntity.getInstance().removeListener(e));        
    }
}