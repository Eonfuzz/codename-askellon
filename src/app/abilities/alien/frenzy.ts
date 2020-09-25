import { Ability } from "../ability-type";
import { Unit, Effect } from "w3ts";
import { SOUND_ALIEN_GROWL } from "resources/sounds";

const MAX_DURATION = 8;
const ABILITY_SLOW_ID = FourCC('A00W');

export class FrenzyAbility implements Ability {

    private casterUnit: Unit;
    private timeElapsed: number = 0;

    constructor() {}

    public initialise() {
        this.casterUnit = Unit.fromHandle(GetTriggerUnit());

        SOUND_ALIEN_GROWL.playSoundOnUnit(this.casterUnit.handle, 60);
        this.casterUnit.addAbility(ABILITY_SLOW_ID);
        return true;
    };

    public process(delta: number) {
        this.timeElapsed += delta;

        // Stop if time elapsed is too far
        if (this.timeElapsed >= MAX_DURATION) {
            return false;
        }
        return true;
    };

    public destroy() {
        if (this.casterUnit) {
            this.casterUnit.removeAbility(ABILITY_SLOW_ID);
        }

        return true; 
    };
}
