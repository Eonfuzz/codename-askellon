import { Unit } from "w3ts/handles/unit";
import { AbilityWithDone } from "app/abilities/ability-type";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { ALIEN_MINION_CANITE, ALIEN_MINION_FORMLESS, ALIEN_MINION_GREATER_CANITE, ALIEN_MINION_HYDRA, ALIEN_MINION_LARVA, ALIEN_MINION_ROACH, ALIEN_MINION_SWARMLING, UNIT_ID_EGG_AUTO_HATCH, UNIT_ID_EGG_AUTO_HATCH_LARGE } from "resources/unit-ids";
import { Vector2 } from "app/types/vector2";
import { WorldEntity } from "app/world/world-entity";
import { SFX_ALIEN_BLOOD } from "resources/sfx-paths";

export class SpawnAlienHordeAbility extends AbilityWithDone {

    private eggUnits: Unit[] = [];
    
    private duration = 240;

    public init() {
        super.init();


        const chance = 20;

        const numEggs = GetRandomInt(3,5);
        for (let index = 0; index < numEggs; index++) {
            const placeLoc = Vector2.fromWidget(this.casterUnit.handle).applyPolarOffset(GetRandomReal(0, 360), 250);
            
            
            const zone = WorldEntity.getInstance().getPointZone(placeLoc.x, placeLoc.y);   
            if (zone) {
                if (GetRandomReal(0, 100) <= chance) {
                    // Place the large egg
                    this.eggUnits.push(
                        new Unit(PlayerStateFactory.AlienAIPlayer1, UNIT_ID_EGG_AUTO_HATCH_LARGE, placeLoc.x, placeLoc.y, bj_UNIT_FACING)
                    );
                }
                else {
                    this.eggUnits.push(
                        new Unit(PlayerStateFactory.AlienAIPlayer1, UNIT_ID_EGG_AUTO_HATCH, placeLoc.x, placeLoc.y, bj_UNIT_FACING)
                    );
                }
            }
    
        }

        this.casterUnit.setTimeScale(1);
        const numUnits = GetRandomInt(7, 12);
        for (let index = 0; index < numUnits; index++) {

            const aiPlayer = PlayerStateFactory.getAlienAI()[0];

            let _x = this.casterUnit.x + GetRandomReal(-300, 300);
            let _y = this.casterUnit.y + GetRandomReal(-300, 300);
            
            const zone = WorldEntity.getInstance().getPointZone(_x, _y);   
            if (zone) {
                const i = GetRandomInt(1,10);
                let t: number;
                if (i >= 7) t = ALIEN_MINION_LARVA;
                else if (i >= 6) t = ALIEN_MINION_ROACH;
                else if (i >= 5) t = ALIEN_MINION_FORMLESS;
                else if (i >= 4) t = ALIEN_MINION_GREATER_CANITE;
                else if (i >= 3) t = ALIEN_MINION_HYDRA;
                else t = ALIEN_MINION_CANITE;    
                
                DestroyEffect(AddSpecialEffect(SFX_ALIEN_BLOOD, _x, _y));
                    
                CreateUnit(aiPlayer.handle, t, _x, _y, GetRandomInt(0, 360));         
            }         
        }
        
        return true;
    }
    
    public step(delta: number) {
        this.duration -= delta;
        if (this.duration <= 0) {
            this.done = true;
        }
    }
    
    public destroy() { 
        this.eggUnits.forEach(u => {
            if (u.isAlive()) {
                u.issueImmediateOrder("thunderclap");
            }
        });
        return true; 
    }
}