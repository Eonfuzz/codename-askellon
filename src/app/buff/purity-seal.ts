/** @noSelfInFile **/
import { Game } from "../game";
import { BuffInstance, DynamicBuff, BuffInstanceDuration } from "./buff-instance";
import { SoundWithCooldown, SoundRef } from "../types/sound-ref";
import { BUFF_ID } from "resources/buff-ids";
import { Unit } from "w3ts/index";

export class PuritySeal extends DynamicBuff {
    id = BUFF_ID.PURITY_SEAL;

    protected doesStack = false;

    public addInstance(game: Game, unit: Unit, instance: BuffInstance, isNegativeInstance?: boolean) {
        super.addInstance(game, unit, instance, isNegativeInstance);

    }

    public process(game: Game, delta: number): boolean {
        const result =  super.process(game, delta);
        if (!this.isActive) return result;
        return result;
    }

    public onStatusChange(game: Game, newStatus: boolean) {
        if (newStatus) {
            // Do stuff
        }
        else {
            // Remove purity buff
        }
    }
}