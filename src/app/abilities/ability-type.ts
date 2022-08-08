import { Vector2 } from "app/types/vector2";
import { Vector3 } from "app/types/vector3";
import { Unit } from "w3ts/index";

export abstract class Ability {
    public casterUnit!: Unit;
    public spellLevel!: number;
    public targetUnit?: Unit;
    public targetLocation?: Vector2;

    /**
     * Inits the ability
     */
    public init(): boolean {
        this.casterUnit = Unit.fromEvent();
        this.spellLevel = this.casterUnit.getAbilityLevel(GetSpellAbilityId());
        if (GetSpellTargetX() != undefined) {
            this.targetLocation = new Vector2(GetSpellTargetX(), GetSpellTargetY());
        }
        if (GetSpellTargetUnit() != undefined) {
            this.targetUnit = Unit.fromHandle(GetSpellTargetUnit());
        }
        return true;
    }
    /**
     * Iterate upon this instance of the aiblity
     */
    public abstract step(deltaTime: number): void

    public abstract doDestroy(): boolean

    public abstract destroy(): void
}

export abstract class AbilityWithDone extends Ability {
    /**
     * If done is set true we kill this ability
     */
    protected done: boolean = false;
    public doDestroy() { return this.done; }
}