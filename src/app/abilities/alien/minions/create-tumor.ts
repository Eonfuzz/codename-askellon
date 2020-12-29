import { Ability } from "app/abilities/ability-type";
import { EventEntity } from "app/events/event-entity";
import { EVENT_TYPE } from "app/events/event-enum";
import { Unit } from "w3ts/index";
import { ALIEN_MINION_CANITE, ALIEN_MINION_LARVA, ALIEN_STRUCTURE_TUMOR } from "resources/unit-ids";
import { AIEntity } from "app/ai/ai-entity";
import { WorldEntity } from "app/world/world-entity";
import { Log } from "lib/serilog/serilog";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { CreepEntity } from "app/creep/creep-entity";
import { getZFromXY } from "lib/utils";

export class SpawnTumorAbility implements Ability {

    constructor() {}

    public initialise() {
        const u = Unit.fromHandle(GetTriggerUnit());
        
        try {
            const x = u.x + GetRandomReal(-10, 10);
            const y = u.y + GetRandomReal(-10, 10);


            const bloodSfx = AddSpecialEffect("Objects\\Spawnmodels\\Undead\\UndeadLargeDeathExplode\\UndeadLargeDeathExplode.mdl", x, y);
            BlzSetSpecialEffectZ(bloodSfx, getZFromXY(x, y) + 10);
            DestroyEffect(bloodSfx);

            // const zone = WorldEntity.getInstance().getPointZone(x, y);
            const tumor = new Unit(PlayerStateFactory.AlienAIPlayer1, ALIEN_STRUCTURE_TUMOR, x, y, bj_UNIT_FACING);
            CreepEntity.addCreepWithSource(600, tumor);
        }
        catch(e) {
            Log.Error(e);            
        }
        return true;
    };

    public process(delta: number) {
        return false;
    };
    
    public destroy() {
        return true; 
    };
}
