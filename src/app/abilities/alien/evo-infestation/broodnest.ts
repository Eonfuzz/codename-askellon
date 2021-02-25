import { Unit } from "w3ts/handles/unit";
import { Ability } from "app/abilities/ability-type";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { AlienForce } from "app/force/forces/alien-force";
import { UNIT_ID_EGG_AUTO_HATCH, UNIT_ID_EGG_AUTO_HATCH_LARGE } from "resources/unit-ids";
import { Vector2 } from "app/types/vector2";

export class BroodNestAbility implements Ability {

    private casterUnit: Unit | undefined;
    private eggUnits: Unit[] = [];
    
    private duration = 240;

    public initialise() {
        this.casterUnit = Unit.fromHandle(GetTriggerUnit());


        const aForce = PlayerStateFactory.get(this.casterUnit.owner).getForce() as AlienForce;
        
        const placeLoc = Vector2.fromWidget(this.casterUnit.handle);

        const chance = aForce.getHost() === this.casterUnit.owner ?  50 : 20;
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

        // Two more eggs
        this.eggUnits.push(
            new Unit(PlayerStateFactory.AlienAIPlayer1, UNIT_ID_EGG_AUTO_HATCH, placeLoc.x + GetRandomReal(-100, 100), placeLoc.y + GetRandomReal(-30, 30), bj_UNIT_FACING)
        );
        this.eggUnits.push(
            new Unit(PlayerStateFactory.AlienAIPlayer1, UNIT_ID_EGG_AUTO_HATCH, placeLoc.x + GetRandomReal(-100, 100), placeLoc.y + GetRandomReal(-30, 30), bj_UNIT_FACING)
        );

        return true;
    }
    
    public process(delta: number) {
        this.duration -= delta;
        return this.duration >= 0;
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