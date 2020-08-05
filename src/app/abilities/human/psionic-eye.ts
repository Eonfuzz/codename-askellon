import { Ability } from "../ability-type";
import { Crewmember } from "app/crewmember/crewmember-type";
import { Unit } from "w3ts/handles/unit";
import { ForceEntity } from "app/force/force-entity";
import { ALIEN_FORCE_NAME } from "app/force/forces/force-names";
import { AlienForce } from "app/force/forces/alien-force";

/** @noSelfInFile **/
const PSIONIC_EYE_DURATION = 5;
const PSIONIC_EYE_INTERVAL = 1;

export class PsionicEyeAbility implements Ability {

    private unit: Unit | undefined;
    private timeElapsed: number = 0;
    private timeSincePing: number = 0;


    constructor() {}

    public initialise() {
        this.unit = Unit.fromHandle(GetTriggerUnit());
        return true;
    };

    public process(delta: number) {
        this.timeElapsed += delta;

        const pingFor: Crewmember[] = [];
        const alienForce = ForceEntity.getInstance().getForce(ALIEN_FORCE_NAME) as AlienForce;
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

    public destroy() {
        return true;
    };
}