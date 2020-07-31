export interface Ability {
    initialise(): boolean;

    /**
     * Return false if the ability must be destroyed
     * @param module 
     * @param delta 
     */
    process(delta: number): boolean;
    destroy(): boolean;
}