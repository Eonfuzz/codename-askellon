import { AbilityModule } from "./ability-module";

/** @noSelfInFile **/


export interface Ability {
    initialise(module: AbilityModule): boolean;
    /**
     * Return false if the ability must be destroyed
     * @param module 
     * @param delta 
     */
    process(module: AbilityModule, delta: number): boolean;
    destroy(module: AbilityModule): boolean;
}