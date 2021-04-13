import { SoundRef } from "app/types/sound-ref";
import { Log } from "lib/serilog/serilog";
import { PlayNewSound } from "lib/translators";
import { MessageAllPlayers, MessagePlayer } from "lib/utils";
import { TECH_OUT_OF_COMBAT } from "resources/ability-ids";
import { COL_INFO, COL_ORANGE } from "resources/colours";
import { Behaviour } from "../behaviour";
import { ABILITY_HOOK } from "../hook-types";

export class DisableAbilityInCombat extends Behaviour {
    
    private forAbility: number;
    private outOfCombatTimer = 0;

    private snd = new SoundRef("Sounds\\ComplexBeep.mp3", false, true);

    constructor(whichAbility: number) {
        super();
        this.forAbility = whichAbility;
    }

    public onEvent(event: ABILITY_HOOK) {
        if (event === ABILITY_HOOK.PostUnitTakesDamage) {
            if (this.outOfCombatTimer <= 0) {
                MessagePlayer(this.forUnit.owner, `${COL_ORANGE}WARNING!|r Ship under attack :: Disabling afterburners`);
                this.snd.playSoundForPlayer(this.forUnit.owner);
                this.forUnit.disableAbility(this.forAbility, true, false);
            }
            this.outOfCombatTimer = 10;
        }
    }

    /**
     * Iterate upon this instance of the aiblity
     */
    public step(deltaTime: number) {
        if (this.outOfCombatTimer > 0) {
            this.outOfCombatTimer -= deltaTime;

            if (this.outOfCombatTimer <= 0) {
                if (this.forUnit && this.forUnit.owner) {
                    this.forUnit.disableAbility(this.forAbility, false, false);
                }
            }
        }
    }

    public doDestroy() {
        if (!this.forUnit.isAlive()) return true;
        return false;
    }

    public destroy() {}
}