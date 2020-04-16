/** @noSelfInFile **/
import { Game } from "../game";
import { Log } from "../../lib/serilog/serilog";
import { ForceModule } from "./force-module";
import { ForceType } from "./force-type";
import { ABIL_CREWMEMBER_INFO } from "resources/ability-ids";
import { Crewmember } from "app/crewmember/crewmember-type";
import { MapPlayer, Unit } from "w3ts";
import { resolveTooltip } from "resources/ability-tooltips";
import { OBSERVER_FORCE_NAME } from "./observer-force";
import { ALIEN_FORCE_NAME, AlienForce } from "./alien-force";


export const CREW_FORCE_NAME = 'CREW';
export class CrewmemberForce extends ForceType {
    name = CREW_FORCE_NAME;
    
    /**
     * Checks the victory conditions of this force
     * Returns true if victory conditions are met
     */
    checkVictoryConditions(forceModule: ForceModule): boolean {
        return this.players.length > 0;
    }

    /**
     * TODO
     */
    addPlayerMainUnit(game: Game, whichUnit: Crewmember, player: MapPlayer) {
        super.addPlayerMainUnit(game, whichUnit, player);
        whichUnit.unit.addAbility(ABIL_CREWMEMBER_INFO);

        // Add ability tooltip
        game.tooltips.registerTooltip(whichUnit, resolveTooltip);
    }

    removePlayerMainUnit(game: Game, whichUnit: Crewmember, player: MapPlayer, killer?: Unit) {
        super.removePlayerMainUnit(game, whichUnit, player);
        whichUnit.unit.removeAbility(ABIL_CREWMEMBER_INFO);

        // Remove ability tooltip
        game.tooltips.unregisterTooltip(whichUnit, resolveTooltip);

        let killedByAlien: boolean = false;
        if (killer) {
            const pForce = this.forceModule.getPlayerForce( killer.owner );
            
            if (pForce && pForce.is(ALIEN_FORCE_NAME)) {
                const aForce = pForce as AlienForce;
                const alienUnit = aForce.getAlienFormForPlayer( killer.owner );
                killedByAlien = killer === alienUnit;
            }
            else {
                killedByAlien = killer.owner === this.forceModule.alienAIPlayer;
            }
        }

        // If alien killed us migrate to alien force
        if (killedByAlien) {
            const alienForce = this.forceModule.getForce(ALIEN_FORCE_NAME) as AlienForce;
            alienForce.addPlayerMainUnit(game, whichUnit, player);
            this.forceModule.addPlayerToForce(player, ALIEN_FORCE_NAME);
        }
        // Otherwise make observer
        else {
            const obsForce = this.forceModule.getForce(OBSERVER_FORCE_NAME);
            obsForce.addPlayerMainUnit(game, whichUnit, player);

            this.forceModule.addPlayerToForce(player, OBSERVER_FORCE_NAME);
        }
        this.removePlayer(player);
    }
}