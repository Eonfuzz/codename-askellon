import { AbilityWithDone } from "../ability-type";
import { Vector3 } from "../../types/vector3";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { WorldEntity } from "app/world/world-entity";
import { MessageAllPlayers } from "lib/utils";
import { SoundRef } from "app/types/sound-ref";
import { PlayNewSound } from "lib/translators";
import { COL_GOLD, COL_RED } from "resources/colours";


export class StationAlertAbility extends AbilityWithDone {

    private targetLoc: Vector3 | undefined;
    private visions: fogmodifier[] = [];
    private duration = 30;

    public init() {
        super.init();
        this.targetLoc =  new Vector3(GetSpellTargetX(), GetSpellTargetY(), 0);
        const z = WorldEntity.getInstance().getPointZone(this.targetLoc.x, this.targetLoc.y);
        
        if (z) {
            PlayerStateFactory.getPlayers().forEach(p => {
                const f = CreateFogModifierRadius(p.handle, FOG_OF_WAR_VISIBLE, this.targetLoc.x, this.targetLoc.y, 100, false, false);
                this.visions.push(f);
            });

            PingMinimapEx(this.targetLoc.x, this.targetLoc.y, 30, 10, 255, 10, false);
            MessageAllPlayers(`[${COL_RED}DANGER|R]: Captain requests assistance at ${z.getName()}`);
            PlayNewSound("Sounds\\ComplexBeep.mp3", 32);
        }
        return true;
    }

    public step(delta: number) {
        this.done = (this.duration -= delta) <= 0;
        return true;
    };

    public destroy() { 
        this.visions.forEach(v => DestroyFogModifier(v));
        return true; 
    };
}
