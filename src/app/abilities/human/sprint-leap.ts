import { Ability } from "../ability-type";
import { AbilityModule } from "../ability-module";
import { Vector2, vectorFromUnit } from "../../types/vector2";
import { Log } from "../../../lib/serilog/serilog";
import { HIGH_QUALITY_POLYMER_ABILITY_ID } from "../../weapons/weapon-constants";
import { SPRINT_BUFF_ID } from "resources/ability-ids";
import { Vector3 } from "app/types/vector3";
import { getZFromXY } from "lib/utils";

/** @noSelfInFile **/

const TECH_UPGRADE_SPRINT_LEAP = FourCC('R001');

export class SprintLeapAbility implements Ability {

    private unit: unit | undefined;
    private distanceTravelled: number = 0;

    private unitLastLoc: Vector2 | undefined;

    constructor() {}

    public initialise(module: AbilityModule) {
        this.unit = GetTriggerUnit();

        Log.Information("Fast sprint!");

        // If unit doesn't have the right tech upgrade return false
        const hasUpgrade = GetPlayerTechCount(GetOwningPlayer(this.unit), TECH_UPGRADE_SPRINT_LEAP, true) > 0;
        if (!hasUpgrade) return false;

        this.unitLastLoc = vectorFromUnit(this.unit);

        // Play crew effort sound

        return true;
    };

    public process(module: AbilityModule, delta: number) {
        if (this.unit && UnitHasBuffBJ(this.unit, SPRINT_BUFF_ID) && this.unitLastLoc) {
            const newPos = vectorFromUnit(this.unit);
            const delta = newPos.subtract(this.unitLastLoc).getLength();
            this.distanceTravelled = (delta == 0) ? 0 : (this.distanceTravelled + delta)
            this.unitLastLoc = newPos;
        }
        else {
            return false;
        }
        return true;
    };

    public destroy(aMod: AbilityModule) { 
        if (this.unit) {
            let targetLoc = new Vector3(GetUnitX(this.unit), GetUnitY(this.unit), 0);
            targetLoc.z = getZFromXY(targetLoc.x, targetLoc.z);

            // Play leap sound
            let sfx = AddSpecialEffect("war3mapImported\\DustWave.mdx", targetLoc.x, targetLoc.y);
            BlzSetSpecialEffectAlpha(sfx, 40);
            BlzSetSpecialEffectScale(sfx, 0.9);
            BlzSetSpecialEffectTimeScale(sfx, 0.4);
            BlzSetSpecialEffectTime(sfx, 0.2);
            BlzSetSpecialEffectYaw(sfx, GetRandomInt(0, 360));
            DestroyEffect(sfx);

            aMod.game.leapModule.newLeap(
                this.unit,
                targetLoc.projectTowards2D(GetUnitFacing(this.unit), this.distanceTravelled/1.5),
                30,
                2.5
            );
        }
        return false;
    };
}