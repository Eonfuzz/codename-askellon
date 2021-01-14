import { ForceType } from "./force-type";
import { Crewmember } from "app/crewmember/crewmember-type";
import { MapPlayer, Timer } from "w3ts/index";
import { ChatHook } from "app/chat/chat-hook-type";
import { OBSERVER_FORCE_NAME, ALIEN_FORCE_NAME } from "./force-names";
import { PlayerState } from "../player-type";
import { PlayerStateFactory } from "../player-state-entity";
import { Log } from "lib/serilog/serilog";
import { Players } from "w3ts/globals/index";
import { Timers } from "app/timer-type";
import { MessagePlayer } from "lib/utils";
import { COL_ATTATCH } from "resources/colours";
import { SoundRef } from "app/types/sound-ref";

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

    private playerDiesSound =new SoundRef('Sound\\Interface\\QuestFailed.flac', false, true);
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

        Timers.addSlowTimedAction(5, () => {
            MessagePlayer(who, `${COL_ATTATCH}You're dead!|r There's no coming back from this, so feel free to observe the game or quit.`);
            if (who.isLocal()) this.playerDiesSound.playSound();
        });
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
    private deltaTicker = 0;
    public onTick(delta: number) {
        super.onTick(delta);

        this.deltaTicker += delta;
        // Every few seconds, ping all players to obs
        if (this.deltaTicker >= 15) {
            this.deltaTicker = 0;

            if (this.players.length === 0) return;

            // Loop through all game players
            this.players.forEach( obs => {
                Players.forEach( p => {
                    if (p.slotState !== PLAYER_SLOT_STATE_PLAYING) return;
                    if (p.controller !== MAP_CONTROL_USER) return;
                    if (obs == p) return;       
                    
                    const pData = PlayerStateFactory.get(p);
                    if (obs.handle === GetLocalPlayer() && pData && pData.getForce()) {
                        const force = pData.getForce();
                        const u = pData.getUnit();
                        if (u) {
                            if (force.is(ALIEN_FORCE_NAME)) {
                                PingMinimapEx(u.x, u.y, 3, 153, 51, 255, false);
                            }
                            else {
                                PingMinimapEx(u.x, u.y, 3, 102, 255, 51, false);
                            }
                        }
                    }
                });
            })
        }
    }
}