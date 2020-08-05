import { Log } from "../../../lib/serilog/serilog";
import { ForceType } from "./force-type";
import { ABIL_CREWMEMBER_INFO } from "resources/ability-ids";
import { Crewmember } from "app/crewmember/crewmember-type";
import { MapPlayer, Unit } from "w3ts";
import { resolveTooltip } from "resources/ability-tooltips";
import { EVENT_TYPE } from "app/events/event-enum";

// Entities and factories
import { EventEntity } from "app/events/event-entity";
import { TooltipEntity } from "app/tooltip/tooltip-module";
import { PlayerStateFactory } from "../player-state-entity";
import { CREW_FORCE_NAME, ALIEN_FORCE_NAME } from "./force-names";
import { AlienForce } from "./alien-force";


export class CrewmemberForce extends ForceType {
    name = CREW_FORCE_NAME;
    
    /**
     * Checks the victory conditions of this force
     * Returns true if victory conditions are met
     */
    checkVictoryConditions(): boolean {
        return this.players.length > 0;
    }

    /**
     * TODO
     */
    addPlayerMainUnit(whichUnit: Crewmember, player: MapPlayer) {
        super.addPlayerMainUnit(whichUnit, player);
        whichUnit.unit.addAbility(ABIL_CREWMEMBER_INFO);

        // Add ability tooltip
        TooltipEntity.getInstance().registerTooltip(whichUnit, resolveTooltip);
    }

    removePlayerMainUnit(whichUnit: Crewmember, player: MapPlayer, killer?: Unit) {
        super.removePlayerMainUnit(whichUnit, player);

        whichUnit.unit.removeAbility(ABIL_CREWMEMBER_INFO);

        // Remove ability tooltip
        TooltipEntity.getInstance().unregisterTooltip(whichUnit, resolveTooltip);

        let killedByAlien: boolean = false;
        if (killer) {
            const pKiller = PlayerStateFactory.get(killer.owner);
            const pForce = pKiller.getForce();
            
            if (pForce && pForce.is(ALIEN_FORCE_NAME)) {
                const aForce = pForce as AlienForce;
                const alienUnit = aForce.getAlienFormForPlayer( killer.owner );
                killedByAlien = killer === alienUnit;
            }
            else {
                killedByAlien = killer.owner === PlayerStateFactory.AlienAIPlayer;
            }

            // If alien killed us migrate to alien force
            if (killedByAlien) {
                // try {
                //     // Revive our unit
                //     whichUnit.unit.revive(whichUnit.unit.x, whichUnit.unit.y, false);
    
                //     const alienForce = pForce as AlienForce;
                //     alienForce.addPlayerMainUnit(whichUnit, player);
                //     forceEntity.addPlayerToForce(player, ALIEN_FORCE_NAME);
    
                //     // Force transformation
                //     alienForce.transform(player, true);
                // }
                // catch (e) {
                //     Log.Error("Crew->Death->Alien failed!");
                //     Log.Error(e);
                // }
            }
            // Otherwise make observer
            else {
                // const obsForce = forceEntity.getForce(OBSERVER_FORCE_NAME);
                // obsForce.addPlayerMainUnit(whichUnit, player);
                // forceEntity.addPlayerToForce(player, OBSERVER_FORCE_NAME);
    
                // // Also remove their unit from the zone
                // Log.Information("Player died TODO remove from world entity");
                // // WorldEntity.getInstance().removeUnit(whichUnit.unit);
            }
        }
        this.removePlayer(player);

        // Check victory conds
        EventEntity.getInstance().sendEvent(EVENT_TYPE.CHECK_VICTORY_CONDS, {
            source: whichUnit.unit,
            crewmember: whichUnit
        });
    }    
    
    
    /**
    * Does this force do anything on tick
    * We need to reward player income
    * @param delta 
    */
   public onTick(delta: number) {
       const percent = delta / 60;

       this.players.forEach(p => {
            const details = PlayerStateFactory.get(p);
            const crew = details.getCrewmember();

            if (crew) {
                const calculatedIncome = MathRound(percent * crew.getIncome());
                crew.player.setState(
                    PLAYER_STATE_RESOURCE_GOLD, 
                    crew.player.getState(PLAYER_STATE_RESOURCE_GOLD) + calculatedIncome
                );
            }
       })
   }
}