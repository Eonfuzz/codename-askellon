import { Log } from "../../../lib/serilog/serilog";
import { ForceType } from "./force-type";
import { ABIL_CREWMEMBER_INFO } from "resources/ability-ids";
import { Crewmember } from "app/crewmember/crewmember-type";
import { MapPlayer, Unit, W3TS_HOOK } from "w3ts";
import { resolveTooltip } from "resources/ability-tooltips";
import { EVENT_TYPE } from "app/events/event-enum";

// Entities and factories
import { EventEntity } from "app/events/event-entity";
import { TooltipEntity } from "app/tooltip/tooltip-module";
import { PlayerStateFactory } from "../player-state-entity";
import { CREW_FORCE_NAME, ALIEN_FORCE_NAME, OBSERVER_FORCE_NAME } from "./force-names";
import { AlienForce } from "./alien-force";
import { PlayerState } from "../player-type";
import { SFX_ALIEN_BLOOD, SFX_HUMAN_BLOOD } from "resources/sfx-paths";
import { getZFromXY } from "lib/utils";
import { Timers } from "app/timer-type";
import { SOUND_ALIEN_GROWL } from "resources/sounds";


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
                killedByAlien = PlayerStateFactory.isAlienAI(killer.owner);
            }

            // If alien killed us migrate to alien force
            if (killedByAlien) {
                try {
                    const alienForce = PlayerStateFactory.getForce(ALIEN_FORCE_NAME) as AlienForce;
                    // Revive our unit
                    whichUnit.unit.revive(whichUnit.unit.x, whichUnit.unit.y, false);
                    // Hide our unit
                    whichUnit.unit.show = false;
    
                    alienForce.addPlayerMainUnit(whichUnit, player);
                    PlayerStateFactory.get(player).setForce(alienForce);
    
                    const fogMod = CreateFogModifierRadius(player.handle, FOG_OF_WAR_VISIBLE, whichUnit.unit.x, whichUnit.unit.y, 600, true, true);
                    FogModifierStart(fogMod);

                    // Force transformation
                    DestroyEffect(AddSpecialEffect(SFX_HUMAN_BLOOD, whichUnit.unit.x, whichUnit.unit.y))
                    Timers.addTimedAction(1, () => {
                        DestroyEffect(AddSpecialEffect(SFX_HUMAN_BLOOD, whichUnit.unit.x, whichUnit.unit.y));
                        // handle alien minion AI slots
                        PlayerStateFactory.getAlienAI().forEach(alienAISlot => {
                            // IF we are alien AND transformed, ally the players
                            alienAISlot.setAlliance(player, ALLIANCE_PASSIVE, true);
                            player.setAlliance(alienAISlot, ALLIANCE_PASSIVE, true);
                        });
                    });
                    Timers.addTimedAction(2.2, () => DestroyEffect(AddSpecialEffect(SFX_ALIEN_BLOOD, whichUnit.unit.x, whichUnit.unit.y)));
                    Timers.addTimedAction(3, () => DestroyEffect(AddSpecialEffect(SFX_ALIEN_BLOOD, whichUnit.unit.x, whichUnit.unit.y)));
                    Timers.addTimedAction(3.6, () => DestroyEffect(AddSpecialEffect(SFX_ALIEN_BLOOD, whichUnit.unit.x, whichUnit.unit.y)));
                    Timers.addTimedAction(4, () => {
                        DestroyEffect(AddSpecialEffect(SFX_ALIEN_BLOOD, whichUnit.unit.x, whichUnit.unit.y));
                        alienForce.transform(player, true);
                        FogModifierStop(fogMod);
                        DestroyFogModifier(fogMod);
                    });
                    alienForce.introduction(player, true);
                }
                catch (e) {
                    Log.Error("Crew->Death->Alien failed!");
                    Log.Error(e);
                }
            }
            // Otherwise make observer
            else {
                const obsForce = PlayerStateFactory.getForce(OBSERVER_FORCE_NAME);

                obsForce.addPlayer(player);
                obsForce.addPlayerMainUnit(whichUnit, player);
                PlayerStateFactory.get(player).setForce(obsForce);
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
       super.onTick(delta);
   }
}