import { Log } from "lib/serilog/serilog";
import { Timers } from "./timer-type";

/**
 * Made by Fred, @https://github.com/ScrewTheTrees/TreeLib-WC3/blob/master/src/TreeLib/Entity.ts
 */
export abstract class Entity {
    private static entities: Entity[] = [];
    private static entityLoop: Function;

    private _internalTimer: number = 0;
    protected _timerDelay: number = 0.01;

    public constructor() {
        if (Entity.entityLoop == null) {
            Entity.entityLoop = () => {
                Entity.entities.forEach((entity) => {

                    entity._internalTimer += 0.01;
                    if (entity._internalTimer >= entity._timerDelay) {
                        entity._internalTimer = 0;
                        xpcall(() => {
                            entity.step();
                        }, Log.Error);
                    }
                });
            };
            Timers.getInstance().addFastTimerCallback(Entity.entityLoop);
        }
        Entity.entities.push(this);
    }

    abstract step(): void;

    public remove() {
        let index = Entity.entities.indexOf(this);
        if (index != -1) {
            Entity.entities.splice(index, 1);
        }
    }

}