import { MapPlayer } from "w3ts";

export const FilterIsEnemyAndAlive = (enemyOfWho: MapPlayer) => Filter(() => {
    const fUnit = GetFilterUnit();
    return IsPlayerEnemy(GetOwningPlayer(fUnit), enemyOfWho.handle) && 
        !BlzIsUnitInvulnerable(fUnit)
});

export const FilterIsAlive = (whichPlayer: MapPlayer) => Filter(() => {
    const fUnit = GetFilterUnit();
    return !BlzIsUnitInvulnerable(fUnit) && GetOwningPlayer(fUnit) !== whichPlayer.handle;
});