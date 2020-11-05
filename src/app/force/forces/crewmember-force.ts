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

    removePlayer(player: MapPlayer, killer: Unit = undefined) {
        const forceHasPlayer = this.players.indexOf(player) >= 0;

        if (forceHasPlayer) {
            const playerData = PlayerStateFactory.get(player);
            const crew = playerData.getCrewmember();
            
            /**
             * Handle the removal of RESOLVE passive
             */
            crew.unit.removeAbility(ABIL_CREWMEMBER_INFO);
            // Remove ability tooltip
            TooltipEntity.getInstance().unregisterTooltip(crew, resolveTooltip);

    
            if (killer) {
                const pKiller = PlayerStateFactory.get(killer.owner);
                const pForce = pKiller.getForce();
                
                const killedByAlien = 
                    // Killed by station AI
                    PlayerStateFactory.isAlienAI(killer.owner) ||
                    // Or killed by an Alien form Alien player
                    (pForce && pForce.is(ALIEN_FORCE_NAME) && killer === (pForce as AlienForce).getAlienFormForPlayer( killer.owner ));
    
                // If alien killed us migrate to alien force
                if (killedByAlien) {
                    const alienForce = PlayerStateFactory.getForce(ALIEN_FORCE_NAME) as AlienForce;
                    // Revive and hide the crewmember
                    crew.unit.revive(crew.unit.x, crew.unit.y, false);
                    crew.unit.show = false;
    
                    PlayerStateFactory.get(player).setForce(alienForce);
                    alienForce.addPlayer(player);
                    alienForce.addPlayerMainUnit(crew, player);
    
                    const fogMod = CreateFogModifierRadius(player.handle, FOG_OF_WAR_VISIBLE, crew.unit.x, crew.unit.y, 600, true, true);
                    FogModifierStart(fogMod);

                    // Force transformation
                    DestroyEffect(AddSpecialEffect(SFX_HUMAN_BLOOD, crew.unit.x, crew.unit.y))
                    Timers.addTimedAction(1, () => {
                        DestroyEffect(AddSpecialEffect(SFX_HUMAN_BLOOD, crew.unit.x, crew.unit.y));
                    });
                    Timers.addTimedAction(2.2, () => DestroyEffect(AddSpecialEffect(SFX_ALIEN_BLOOD, crew.unit.x, crew.unit.y)));
                    Timers.addTimedAction(3, () => DestroyEffect(AddSpecialEffect(SFX_ALIEN_BLOOD, crew.unit.x, crew.unit.y)));
                    Timers.addTimedAction(3.6, () => DestroyEffect(AddSpecialEffect(SFX_ALIEN_BLOOD, crew.unit.x, crew.unit.y)));
                    Timers.addTimedAction(4, () => {
                        DestroyEffect(AddSpecialEffect(SFX_ALIEN_BLOOD, crew.unit.x, crew.unit.y));
                        alienForce.transform(player, true);
                        FogModifierStop(fogMod);
                        DestroyFogModifier(fogMod);
                    });
                    alienForce.introduction(player, true);
                }
                // Otherwise make observer
                else {
                    const obsForce = PlayerStateFactory.getForce(OBSERVER_FORCE_NAME);
    
                    obsForce.addPlayer(player);
                    obsForce.addPlayerMainUnit(crew, player);
                    PlayerStateFactory.get(player).setForce(obsForce);
                }
            }

        }
            
        super.removePlayer(player, killer);
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