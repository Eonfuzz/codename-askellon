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
import { ROLE_TYPES } from "resources/crewmember-names";
import { ALIEN_STRUCTURE_TUMOR } from "resources/unit-ids";
import { CreepEntity } from "app/creep/creep-entity";
import { ObserverForce } from "./observer-force";
import { UPGR_DUMMY_WILL_BECOME_ALIEN_ON_DEATH } from "resources/upgrade-ids";
import { WorldEntity } from "app/world/world-entity";
import { ZONE_TYPE } from "app/world/zone-id";


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

                const pZone = WorldEntity.getInstance().getPointZone(crew.unit.x, crew.unit.y);
                
                // Remove our crew trackers
                super.removePlayer(player, killer);
                
                const killedByAlien = 
                    // Gene infested T1
                    (pZone && pZone.id !== ZONE_TYPE.SPACE && player.getTechCount(UPGR_DUMMY_WILL_BECOME_ALIEN_ON_DEATH, true) > 0) ||
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

                        const tumor = new Unit(PlayerStateFactory.AlienAIPlayer1, ALIEN_STRUCTURE_TUMOR, crew.unit.x, crew.unit.y, bj_UNIT_FACING);
                        CreepEntity.addCreepWithSource(600, tumor);
                    });
                    alienForce.introduction(player, true);
                }
                // Otherwise make observer
                else {
                    const obsForce = PlayerStateFactory.getForce(OBSERVER_FORCE_NAME) as ObserverForce;
    
                    obsForce.addPlayer(player);
                    obsForce.addPlayerMainUnit(crew, player);
                    PlayerStateFactory.get(player).setForce(obsForce);
                }
            }

        }
    }    
    
    
    /**
    * Does this force do anything on tick
    * We need to reward player income
    * @param delta 
    */
   public onTick(delta: number) {
       super.onTick(delta);
   }

   public onDealDamage(who: MapPlayer, target: MapPlayer, damagingUnit: unit, damagedUnit: unit) {
       // Reward XP if we are damaging Alien AI

       let targetIsAlien = PlayerStateFactory.isAlienAI(target);

        // If we aren't shooting alien minions...
        if (!targetIsAlien) {
            // Check to see if it is an alien form player
            const tData = PlayerStateFactory.get(target);
            if (tData && tData.getForce() && tData.getForce().is(ALIEN_FORCE_NAME)) {
                const alienForce = tData.getForce() as AlienForce;
                targetIsAlien = alienForce.isPlayerTransformed(target) && alienForce.getActiveUnitFor(target).handle === damagedUnit;
            }
        }
        if (PlayerStateFactory.isAlienAI(target)) {
            const pData = PlayerStateFactory.get(who);
            const crew = pData.getCrewmember() 
            const xpMultiplier = (crew && crew.role === ROLE_TYPES.SEC_GUARD) ? 1.5 : 1;

            const damageAmount = GetEventDamage();
            
            EventEntity.getInstance().sendEvent(EVENT_TYPE.CREW_GAIN_EXPERIENCE, {
                source: crew.unit,
                data: { value: damageAmount * xpMultiplier }
            });
        }
   }

   public onTakeDamage(who: MapPlayer, attacker: MapPlayer, damagedUnit: unit, damagingUnit: unit) {
   }
}