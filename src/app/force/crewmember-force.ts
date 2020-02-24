/** @noSelfInFile **/
import { Game } from "../game";
import { Log } from "../../lib/serilog/serilog";
import { ForceModule } from "./force-module";
import { ForceType } from "./force-type";
import { ABIL_CREWMEMBER_INFO } from "resources/ability-ids";
import { Crewmember } from "app/crewmember/crewmember-type";
import { RESOLVE_TOOLTIP } from "resources/ability-tooltips";


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
    addPlayerMainUnit(game: Game, whichUnit: unit, player: player) {
        UnitAddAbility(whichUnit, ABIL_CREWMEMBER_INFO);
    }

    removePlayerMainUnit(game: Game, whichUnit: unit, player: player) {
        UnitRemoveAbility(whichUnit, ABIL_CREWMEMBER_INFO);
    }
    
    
    /**
     * Updates the forces tooltip
     * does nothing by default
     * @param game 
     * @param whichUnit 
     * @param whichPlayer 
     */
    public updateForceTooltip(game: Game, whichCrew: Crewmember) {
        const income = game.crewModule.calculateIncome(whichCrew);
        const tooltip = RESOLVE_TOOLTIP(income);
        if (GetLocalPlayer() === whichCrew.player) {
            BlzSetAbilityExtendedTooltip(ABIL_CREWMEMBER_INFO, tooltip, 0);
        }
    }
}