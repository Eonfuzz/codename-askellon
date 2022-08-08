import { Vector2 } from "app/types/vector2";
import { Unit } from "w3ts";

export interface EmulateCast {
    spellId: number,
    caster: Unit,
    target?: Unit,
    targetLocation?: Vector2
}