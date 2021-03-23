import { Unit } from "w3ts/handles/unit";
import { AbilityWithDone } from "app/abilities/ability-type";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { AlienForce } from "app/force/forces/alien-force";
import { ALIEN_STRUCTURE_TUMOR, UNIT_ID_EGG_AUTO_HATCH, UNIT_ID_EGG_AUTO_HATCH_LARGE } from "resources/unit-ids";
import { Vector2 } from "app/types/vector2";
import { ABIL_ALIEN_BROODNEST } from "resources/ability-ids";
import { CreepEntity } from "app/creep/creep-entity";
import { WorldEntity } from "app/world/world-entity";

export class BroodNestAbility extends AbilityWithDone {

    private eggUnits: Unit[] = [];
    
    private duration = 240;

    public init() {
        super.init();


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

        let eggType1 = UNIT_ID_EGG_AUTO_HATCH;
        let eggType2 = UNIT_ID_EGG_AUTO_HATCH;

        if (this.casterUnit.getAbilityLevel(ABIL_ALIEN_BROODNEST) >= 2) {
            if (GetRandomReal(0, 100) <= chance) eggType1 = UNIT_ID_EGG_AUTO_HATCH_LARGE;
            if (GetRandomReal(0, 100) <= chance) eggType2 = UNIT_ID_EGG_AUTO_HATCH_LARGE;

            // const zone = WorldEntity.getInstance().getPointZone(x, y);
            const tumor = new Unit(PlayerStateFactory.AlienAIPlayer1, ALIEN_STRUCTURE_TUMOR, placeLoc.x, placeLoc.y, bj_UNIT_FACING);
            CreepEntity.addCreepWithSource(600, tumor);

            const floor = WorldEntity.getInstance().getPointZone(placeLoc.x, placeLoc.y);
            // Force our unit to travel too
            WorldEntity.getInstance().travel(tumor, floor.id);
        }
        // Two more eggs
        this.eggUnits.push(
            new Unit(PlayerStateFactory.AlienAIPlayer1, eggType1, placeLoc.x + GetRandomReal(-100, 100), placeLoc.y + GetRandomReal(-30, 30), bj_UNIT_FACING)
        );
        this.eggUnits.push(
            new Unit(PlayerStateFactory.AlienAIPlayer1, eggType2, placeLoc.x + GetRandomReal(-100, 100), placeLoc.y + GetRandomReal(-30, 30), bj_UNIT_FACING)
        );

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