import { Unit, Effect } from "w3ts/index";
import { ALIEN_MINION_EGG } from "resources/unit-ids";
import { SFX_HUMAN_BLOOD } from "resources/sfx-paths";
import { getZFromXY } from "lib/utils";
import { EVENT_TYPE } from "app/events/event-enum";
import { AIEntity } from "./ai-entity";
import { Log } from "lib/serilog/serilog";
import { WorldEntity } from "app/world/world-entity";
import { PlayerStateFactory } from "app/force/player-state-entity";

export const DEFAULT_EGG_DURATION = 60;

export class EggInstance {
    private from: Unit;
    private to: number;
    private duration: number

    public egg: Unit;

    private timeElapsed = 0;

    constructor(from: Unit, to: number, duration?: number) {
        this.from = from;
        this.to = to;
        this.duration = duration || DEFAULT_EGG_DURATION;
    }

    init() {
        this.egg = new Unit(this.from.owner, ALIEN_MINION_EGG, this.from.x, this.from.y, this.from.facing);
        this.egg.setPathing(false);
        
        // Hide and kill the old unit
        this.from.show = false;
        this.from.paused = true
        this.from.kill();
    }

    end(interrupted: boolean = false) {
        // Kill the egg
        this.egg.kill();

        // Log.Information("On end!");
        if (!interrupted) {
            // Log.Information("Spawning unit");
            const sfx = AddSpecialEffect(SFX_HUMAN_BLOOD, this.egg.x, this.egg.y);
            BlzSetSpecialEffectZ(sfx, getZFromXY(this.egg.x, this.egg.y));
            // const unit = new Unit(this.egg.owner, this.to, this.egg.x, this.egg.y, this.egg.facing);

            const zone = WorldEntity.getInstance().getPointZone(this.egg.x, this.egg.y);
            if (zone) {
                const aiPlayer = PlayerStateFactory.getAlienAI()[0];

                // AIEntity.createAddAgent(this.to, this.egg.x, this.egg.y, zone.id);
                CreateUnit(aiPlayer.handle, this.to, this.egg.x, this.egg.y, this.egg.facing);
            }
        }

        return false;
    }

    step(delta: number) {
        this.timeElapsed += delta;
        // Log.Information("Step!");
        if (!this.egg.isAlive()) return this.end(false);
        if (this.timeElapsed >= this.duration) return this.end();
        return true;
    }
}