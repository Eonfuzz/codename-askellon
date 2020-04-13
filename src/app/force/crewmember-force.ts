/** @noSelfInFile **/
import { Game } from "../game";
import { Log } from "../../lib/serilog/serilog";
import { ForceModule } from "./force-module";
import { ForceType } from "./force-type";
import { ABIL_CREWMEMBER_INFO } from "resources/ability-ids";
import { Crewmember } from "app/crewmember/crewmember-type";
import { MapPlayer, Unit } from "w3ts";
import { resolveTooltip } from "resources/ability-tooltips";


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

    removePlayerMainUnit(game: Game, whichUnit: Crewmember, player: MapPlayer) {
        super.removePlayerMainUnit(game, whichUnit, player);
        whichUnit.unit.removeAbility(ABIL_CREWMEMBER_INFO);

        // Remove ability tooltip
        game.tooltips.unregisterTooltip(whichUnit, resolveTooltip);
    }
}