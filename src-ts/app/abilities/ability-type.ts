import { AbilityModule } from "./ability-module";

/** @noSelfInFile **/


export interface Ability {
    initialise(module: AbilityModule): boolean;
    process(module: AbilityModule, delta: number): boolean;
    destroy(module: AbilityModule): boolean;
}