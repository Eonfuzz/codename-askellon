import { MapPlayer } from "w3ts";
import { ALIEN_STRUCTURE_TUMOR } from "./unit-ids";

export const FilterIsEnemyAndAlive = (enemyOfWho: MapPlayer) => Filter(() => {
    const fUnit = GetFilterUnit();
    return IsPlayerEnemy(GetOwningPlayer(fUnit), enemyOfWho.handle) && 
        !BlzIsUnitInvulnerable(fUnit)
});

export const FilterIsAlive = (whichPlayer: MapPlayer) => Filter(() => {
    const fUnit = GetFilterUnit();
    return !BlzIsUnitInvulnerable(fUnit) && GetOwningPlayer(fUnit) !== whichPlayer.handle;
});

export const FilterAnyUnit = () => Filter(() => {
    const fUnit = GetFilterUnit();
    return !BlzIsUnitInvulnerable(fUnit);
});

export const FilterTumors = () => Filter(() => {
    return GetUnitTypeId(GetFilterUnit()) === ALIEN_STRUCTURE_TUMOR;
})