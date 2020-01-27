export const FilterIsEnemyAndAlive = (enemyOfWho: player) => Filter(() => {
    const fUnit = GetFilterUnit();
    return IsPlayerEnemy(GetOwningPlayer(fUnit), enemyOfWho) && 
        !BlzIsUnitInvulnerable(fUnit)
});