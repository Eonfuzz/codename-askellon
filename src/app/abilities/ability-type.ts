import { Unit } from "w3ts/index";

export abstract class Ability {
    protected casterUnit!: Unit;
    protected spellLevel!: number;

    /**
     * Inits the ability
     */
    public init(): boolean {
        this.casterUnit = Unit.fromEvent();
        this.spellLevel = this.casterUnit.getAbilityLevel(GetSpellAbilityId());
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