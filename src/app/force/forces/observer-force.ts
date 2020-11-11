import { ForceType } from "./force-type";
import { Crewmember } from "app/crewmember/crewmember-type";
import { MapPlayer } from "w3ts/index";
import { ChatHook } from "app/chat/chat-hook-type";
import { OBSERVER_FORCE_NAME } from "./force-names";
import { PlayerState } from "../player-type";
import { PlayerStateFactory } from "../player-state-entity";
import { Log } from "lib/serilog/serilog";

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
    public addPlayerMainUnit(whichUnit: Crewmember, player: MapPlayer): void {
    };

    addPlayer(who: MapPlayer) {
        // Give vision of everything
        const modifier = CreateFogModifierRect(who.handle, FOG_OF_WAR_VISIBLE, bj_mapInitialCameraBounds, true, false);
        FogModifierStart(modifier);
        // Make sure DNC is bright, bug fix for deaths in vents
        if (who.handle === GetLocalPlayer()) {
            SetDayNightModels(
                "Environment\\DNC\\DNCLordaeron\\DNCLordaeronTerrain\\DNCLordaeronTerrain.mdl", 
                "Environment\\DNC\\DNCLordaeron\\DNCLordaeronUnit\\DNCLordaeronUnit.mdl"
            );
            BlzChangeMinimapTerrainTex("war3mapGenerated.blp");
        }

        SetCameraBoundsToRectForPlayerBJ(who.handle, bj_mapInitialCameraBounds);
        super.addPlayer(who);
    }
    
    /**
    * Gets a list of who can see the chat messages
    * Unless overridden returns all the players
    */
   public getChatRecipients(chatHook: ChatHook) {       
       // Otherwise return default behaviour
    //    Log.Information("Getting chat recipients: "+this.players.map(p => p.name).join(','));
       return this.players;
   }

   /**
    * Gets the player's visible chat name, by default shows role name
    */
   public getChatName(chatHook: ChatHook) {
       // Otherwise return default behaviour
       const playerState = PlayerStateFactory.get(chatHook.who);
       return playerState.originalName;
   }

   /**
    * Does this force do anything on tick
    * @param delta 
    */
   public onTick(delta: number) {
    return;
   }
}