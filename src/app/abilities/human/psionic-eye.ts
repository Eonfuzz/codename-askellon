import { Ability } from "../ability-type";
import { AbilityModule } from "../ability-module";
import { Vector2, vectorFromUnit } from "../../types/vector2";
import { Log } from "../../../lib/serilog/serilog";
import { HIGH_QUALITY_POLYMER_ABILITY_ID } from "../../weapons/weapon-constants";
import { SPRINT_BUFF_ID } from "resources/ability-ids";
import { Vector3 } from "app/types/vector3";
import { getZFromXY } from "lib/utils";
import { VISION_TYPE } from "app/world/vision-type";
import { Crewmember } from "app/crewmember/crewmember-type";
import { ALIEN_FORCE_NAME, AlienForce } from "app/force/alien-force";
import { Unit } from "w3ts/handles/unit";

/** @noSelfInFile **/
const PSIONIC_EYE_DURATION = 5;
const PSIONIC_EYE_INTERVAL = 1;

export class PsionicEyeAbility implements Ability {

    private unit: Unit | undefined;
    private timeElapsed: number = 0;
    private timeSincePing: number = 0;

    private oldVis: VISION_TYPE = VISION_TYPE.NORMAL;

    constructor() {}

    public initialise(abMod: AbilityModule) {
        this.unit = Unit.fromHandle(GetTriggerUnit());
        return true;
    };

    public process(module: AbilityModule, delta: number) {
        this.timeElapsed += delta;

        const pingFor: Crewmember[] = [];
        const alienForce = module.game.forceModule.getForce(ALIEN_FORCE_NAME) as AlienForce;
        const pingForplayer = this.unit.owner;

        pingFor.forEach(crew => {
            const isAlien = alienForce.hasPlayer(crew.player);
            let unitToPing: Unit;
            if (isAlien) {
                unitToPing = alienForce.getAlienFormForPlayer(crew.player) as Unit;
            }
            else {
                unitToPing = crew.unit;
            }
            PingMinimapForPlayer(pingForplayer.handle, unitToPing.x, unitToPing.y, 1);
        });

        return this.timeElapsed < PSIONIC_EYE_DURATION;
    };

    public destroy(aMod: AbilityModule) {
        return false;
    };
}