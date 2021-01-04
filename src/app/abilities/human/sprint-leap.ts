import { Ability } from "../ability-type";
import { Vector2, vectorFromUnit } from "../../types/vector2";
import { SPRINT_BUFF_ID } from "resources/ability-ids";
import { Vector3 } from "app/types/vector3";
import { getZFromXY } from "lib/utils";
import { LeapEntity } from "app/leap-engine/leap-entity";
import { SoundRef } from "app/types/sound-ref";


const TECH_UPGRADE_SPRINT_LEAP = FourCC('R001');

export class SprintLeapAbility implements Ability {

    private unit: unit | undefined;

    private timeElapsed = 0;
    private timeAtZeroDelta = 0;
    private unitLastLoc: Vector2 | undefined;
    
    private sound: SoundRef; 
    constructor() {}

    public initialise() {
        this.unit = GetTriggerUnit();

        // If unit doesn't have the right tech upgrade return false
        const hasUpgrade = GetPlayerTechCount(GetOwningPlayer(this.unit), TECH_UPGRADE_SPRINT_LEAP, true) > 0;
        if (!hasUpgrade) return false;

        // Log.Information("Movement speed: "+GetUnitMoveSpeed(this.unit));
        this.unitLastLoc = vectorFromUnit(this.unit);

        // Play crew effort sound
        this.sound = new SoundRef("Sounds\\minigun_fullerauto_1.mp3", false);

        return true;
    };

    public process(delta: number) {
        this.timeElapsed += delta;

        if (this.unit && UnitHasBuffBJ(this.unit, SPRINT_BUFF_ID) && this.unitLastLoc) {
            const newPos = vectorFromUnit(this.unit);
            const dPos = newPos.subtract(this.unitLastLoc).getLength();

            // If they've stopped moving, kill buff return false
            // Require some time to be elapsed before this thing ends
            if (dPos === 0 && this.timeElapsed > 0.3) {
                this.timeAtZeroDelta += delta;

                if (this.timeAtZeroDelta > 0.2) {                  
                    UnitRemoveBuffBJ(SPRINT_BUFF_ID, this.unit);
                    return false;
                }
            }
            else {
                this.timeAtZeroDelta = 0;
            }

            this.unitLastLoc = newPos;
        }
        else {
            return false;
        }
        return true;
    };

    public destroy() { 
        if (this.unit) {              
            this.sound.playSoundOnUnit(this.unit, 50, true);
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

            LeapEntity.getInstance().newLeap(
                this.unit,
                targetLoc.projectTowards2D(GetUnitFacing(this.unit), 350),
                30,
                1
            ).onFinish(() => {
                // Log.Information("Post speed: "+GetUnitMoveSpeed(unit));
            });
        }
        return true;
    };
}