import { ForceType } from "./force-type";
import { Crewmember } from "app/crewmember/crewmember-type";
import { MapPlayer } from "w3ts/index";
import { SoundRef, SoundWithCooldown } from "app/types/sound-ref";

export const OBSERVER_FORCE_NAME = 'OBS';
export class ObserverForce extends ForceType {
    name = OBSERVER_FORCE_NAME;

    /**
     * Checks the victory conditions of this force
     * Returns true if victory conditions are met
     */
    checkVictoryConditions(): boolean {
        return false; // Observers can never win
    }

    /**
     * TODO
     */
    addPlayerMainUnit(whichUnit: Crewmember, player: MapPlayer) {
        // Give vision of everything
        const modifier = CreateFogModifierRect(player.handle, FOG_OF_WAR_VISIBLE, bj_mapInitialCameraBounds, true, false);
        FogModifierStart(modifier);
        // Make sure DNC is bright, bug fix for deaths in vents
        // if (player.handle === GetLocalPlayer()) {
        //     SetDayNightModels(
        //         "Environment\\DNC\\DNCLordaeron\\DNCLordaeronTerrain\\DNCLordaeronTerrain.mdl", 
        //         "Environment\\DNC\\DNCLordaeron\\DNCLordaeronUnit\\DNCLordaeronUnit.mdl"
        //     );
        // }
    }    
    
    /**
    * Gets a list of who can see the chat messages
    * Unless overridden returns all the players
    */
   public getChatRecipients(sendingPlayer: MapPlayer) {       
       // Otherwise return default behaviour
       return this.players;
   }

   /**
    * Gets the player's visible chat name, by default shows role name
    */
   public getChatName(who: MapPlayer) {
       // Otherwise return default behaviour
       return who.name;
   }

   /**
    * Return's a players chat colour
    * @param who 
    */
   public getChatColor(who: MapPlayer): string {       
       // Otherwise return default behaviour
       return super.getChatColor(who);
   }

   /**
    * Returns the sound to be used on chat events
    * @param who
    */
   public getChatSoundRef(who: MapPlayer): SoundWithCooldown {
       // Otherwise return default behaviour
       return super.getChatSoundRef(who);
   }
   
   /**
    * Returns the chat tag, by default it will be null
    */
   public getChatTag(who: MapPlayer): string | undefined { 
       // Otherwise return default behaviour
       return 'OBS';
   }

   /**
    * Does this force do anything on tick
    * @param delta 
    */
   public onTick(delta: number) {
    return;
   }
}