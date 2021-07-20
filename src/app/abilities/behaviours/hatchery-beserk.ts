import { Timers } from "app/timer-type";
import { WorldEntity } from "app/world/world-entity";
import { Log } from "lib/serilog/serilog";
import { ABIL_ALIEN_ACID_POOL, ABIL_ALIEN_BERSERK_HATCHERY } from "resources/ability-ids";
import { BUFF_ID_DEFILER_INFESATATION } from "resources/buff-ids";
import { ALIEN_STRUCTURE_TENTACLE } from "resources/unit-ids";
import { Unit } from "w3ts/index";
import { Behaviour } from "../behaviour";
import { ABILITY_HOOK } from "../hook-types";

export class HatcheryBehaviour extends Behaviour {
    
    constructor() {
        super();
    }

    public onEvent(event: ABILITY_HOOK) {
        if (event === ABILITY_HOOK.PostUnitTakesDamage) {
            const damage = GetEventDamage();
            this.forUnit.mana += damage / 20;
        }
        if (event === ABILITY_HOOK.PreUnitDealsDamage) {
            


            // Log.Information("Take damage?!");
            if (this.forUnit.getAbilityCooldownRemaining(ABIL_ALIEN_BERSERK_HATCHERY) <= 0) {
                this.forUnit.issueImmediateOrder("berserk");
            }

            if (BlzGetEventIsAttack()) {
                const target = Unit.fromHandle(BlzGetEventDamageTarget());

                const originZone = WorldEntity.getInstance().getPointZone(this.forUnit.x, this.forUnit.y);             
                const targetZone = WorldEntity.getInstance().getPointZone(target.x, target.y); 
                
                if (originZone === targetZone) {
                    if  (this.forUnit.getAbilityCooldownRemaining(ABIL_ALIEN_ACID_POOL) <= 0) {
                        this.forUnit.issueOrderAt("channel", target.x, target.y);
                    }
                    else {
                        const target = Unit.fromHandle(BlzGetEventDamageTarget());
                        const x = target.x + GetRandomReal(-100, 100); 
                        const y = target.y + GetRandomReal(-100, 100);
                        
                        Timers.addTimedAction(0.5, () => {
                            const tentacle = new Unit(this.forUnit.owner,
                                ALIEN_STRUCTURE_TENTACLE,  
                                x,
                                y,
                                bj_UNIT_FACING 
                            );         
                            tentacle.pauseEx(true);
                            tentacle.applyTimedLife(BUFF_ID_DEFILER_INFESATATION, 30);
                            Timers.addTimedAction(1, () => {
                                if (tentacle && tentacle.isAlive()) tentacle.pauseEx(false);
                            });
                        });       
                    }
                }
            }
        }
    }

    /**
     * Iterate upon this instance of the aiblity
     */
    iterator =  1.5;
    public step(deltaTime: number) {
        this.iterator -= deltaTime;
        if (this.iterator <= 0) {
            this.iterator += 1.5;
            if (this.forUnit.mana >= this.forUnit.maxMana) {
                this.forUnit.setTimeScale(10);
                this.forUnit.issueImmediateOrder("stomp");            
            }
        }
    }

    public destroy() {}
}