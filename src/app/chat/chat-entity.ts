import { Trigger, MapPlayer, Timer } from "w3ts";
import { Crewmember } from "app/crewmember/crewmember-type";
import { ChatSystem } from "./chat-system";
import { Log } from "lib/serilog/serilog";
import {  SoundWithCooldown } from "app/types/sound-ref";
import { COL_GOD, COL_ATTATCH, COL_SYS, COL_MISC_MESSAGE } from "resources/colours";
import { syncData } from "lib/utils";
import { ChatHook } from "./chat-hook-type";
import { Entity } from "app/entity-type";
import { EventEntity } from "app/events/event-entity";
import { EventListener } from "app/events/event-type";
import { EVENT_TYPE } from "app/events/event-enum";
import { ForceEntity } from "app/force/force-entity";
import { PRIVS } from "./chat-privs-enum";

export class ChatEntity extends Entity {

    private static instance: ChatEntity;

    public static getInstance() {        
        if (this.instance == null) {
            this.instance = new ChatEntity();
        }
        return this.instance;
    }


    private chatHandlers = new Map<MapPlayer, ChatSystem>();

    private adminGodUsers: MapPlayer[] = [];
    private adminListenUsers: MapPlayer[] = [];

    private chatHooks: Array<(data: ChatHook) => ChatHook> = []; 

    constructor() {
        super();

        // Subscribe to our event module and listen for init player UI event
        const eventEntity = EventEntity.getInstance();
        eventEntity.addListener(new EventListener(EVENT_TYPE.ENTITY_INIT_CHAT, () => this.initialise()));
    }

    /**
     * Must be called after force init
     */
    fadeHandler = new Timer();
    initialise() {
        const players = ForceEntity.getInstance().getActivePlayers();
        const font = 'LVCMono.otf';

        const playerActivityTrigger = new Trigger();
        playerActivityTrigger.registerPlayerMouseEvent

        // Hide alliance UI
        BlzFrameSetVisible(BlzGetFrameByName("AllianceDialog", 0), false);
        BlzFrameSetEnable(BlzGetFrameByName("AllianceDialog", 0), false);
        BlzFrameSetScale(BlzGetFrameByName("AllianceDialog", 0), 0.1);

        BlzFrameSetVisible(BlzGetFrameByName("ChatDialog", 0), false);
        BlzFrameSetEnable(BlzGetFrameByName("ChatDialog", 0), false);
        BlzFrameSetScale(BlzGetFrameByName("ChatDialog", 0), 0.1);

        BlzFrameSetVisible(BlzGetFrameByName("UpperButtonBarAlliesButton", 0), false);
        BlzFrameSetEnable(BlzGetFrameByName("UpperButtonBarAlliesButton", 0), false);
        BlzFrameSetVisible(BlzGetFrameByName("UpperButtonBarChatButton", 0), false);
        BlzFrameSetEnable(BlzGetFrameByName("UpperButtonBarChatButton", 0), false);

        /**
         * Creates and prepares the text frame area
         */
        const chatHandle = BlzCreateSimpleFrame("Chat", BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0), 0);
        const chatTextHandle = BlzGetFrameByName("Chat Text", 0);
        BlzFrameSetVisible(BlzGetOriginFrame(ORIGIN_FRAME_CHAT_MSG, 0), false);

        BlzFrameSetAbsPoint(chatHandle, FRAMEPOINT_BOTTOMLEFT, (0.6 * BlzGetLocalClientWidth() / BlzGetLocalClientHeight() - 0.8) / -2, 0.17);
        BlzFrameSetLevel(chatHandle, 8);

        BlzFrameSetTextAlignment(chatTextHandle, TEXT_JUSTIFY_BOTTOM, TEXT_JUSTIFY_LEFT);
        BlzFrameSetFont(chatTextHandle, "UI\\Font\\" + font, 0.011, 1);

        /**
         * Creates and prepare the chat handlers
         */
        players.forEach(p => {
            const chatHandler = new ChatSystem(p);

            // Init chat system
            chatHandler.init(chatHandle, chatTextHandle);

            // Now set chat system in map
            this.chatHandlers.set(p, chatHandler);
        });

        // Init chat events
        const messageTrigger = new Trigger();
        ForceEntity.getInstance().getActivePlayers().forEach(player => {
            messageTrigger.registerPlayerChatEvent(player, "", false);
        });
        messageTrigger.addAction(() => this.onChatMessage());
    }

    step() {
        this.chatHandlers.forEach(handler => handler.updateFade(this._timerDelay));
    }

    onChatMessage() {
        const player = MapPlayer.fromHandle(GetTriggerPlayer());
        const message = GetEventPlayerChatString();
        const pData = ForceEntity.getInstance().getPlayerDetails(player);
        const crew = pData.getCrewmember();

        const isCommand = message[0] === '-';
        if (isCommand) this.handleCommand(player, message, crew);
        else this.handleMessage(player, message, crew);
    }

    handleCommand(player: MapPlayer, message: string, crew: Crewmember) {
        const priv = this.getUserPrivs(player);

        // Priv 2 === DEVELOPER
        if (priv >= 2) {
            // if (message.indexOf("-m") === 0) {
            //     const mSplit = message.split(" ");
            //     const dX = S2I(mSplit[1] || "0");
            //     const dY = S2I(mSplit[2] || "0");
            //     this.game.galaxyModule.navigateToSector(dX, dY);
            // }
            // else if (message.indexOf("-wa") === 0) {
            //     this.game.weaponModule.changeWeaponModeTo('ATTACK');
            // }
            // else if (message.indexOf("-wc") === 0) {
            //     this.game.weaponModule.changeWeaponModeTo('CAST');
            // }
            // else 
            if (message.indexOf("-god") === 0) {
                const idx = this.adminGodUsers.indexOf(player);
                if (idx >= 0) {
                    this.postMessageFor(this.adminGodUsers, "GAME", COL_GOD, player.name+" exiting god chat");
                    this.adminGodUsers.splice(idx, 1);
                }
                else {
                    this.adminGodUsers.push(player);
                    this.postMessageFor(this.adminGodUsers, "GAME", COL_GOD, player.name+" entering god chat");
                }
            }
            else if (message.indexOf("-listen") === 0) {
                const idx = this.adminListenUsers.indexOf(player);
                if (idx >= 0) {
                    this.postSystemMessage(player, "Disabled Listen Mode");
                    this.adminListenUsers.splice(idx, 1);
                }
                else {
                    this.postSystemMessage(player, "Enabled Listen Mode");
                    this.adminListenUsers.push(player);
                }
            }
            else if (message.indexOf("-cheat") === 0) {
                player.setState(PLAYER_STATE_RESOURCE_GOLD, 999999);
            }
            else if (message.indexOf("-help") === 0) {
                this.postSystemMessage(player, "Commands: -god, -listen, -wa, -wc, -cheat, -kill, -cd, -vision");
            }
            else if (message.indexOf("-ns") === 0) {
                BlzShowTerrain(false);
            }
            else if (message.indexOf("-ss") === 0) {
                BlzShowTerrain(true);
            }
            else if (message == "-level") {
                EnumUnitsSelected(player.handle, Filter(() => true), () => {
                    const pData = ForceEntity.getInstance().getPlayerDetails(MapPlayer.fromHandle(GetOwningPlayer(GetEnumUnit())));
                    if (pData && pData.getCrewmember()) {
                        pData.getCrewmember().addExperience(99999);
                    }
                });
            }
            else if (message == "-kill") {
                EnumUnitsSelected(player.handle, Filter(() => true), () => {
                    // KillUnit(GetEnumUnit());
                    UnitDamageTarget(GetEnumUnit(), GetEnumUnit(), 9999999, false, false, ATTACK_TYPE_HERO, DAMAGE_TYPE_DIVINE, WEAPON_TYPE_WHOKNOWS);
                });
            }
            else if (message == "-cd") {
                EnumUnitsSelected(player.handle, Filter(() => true), () => {
                    UnitResetCooldown(GetEnumUnit());
                });
            }
            else if (message.indexOf("-vision") === 0) {
                const modifier = CreateFogModifierRect(player.handle, FOG_OF_WAR_VISIBLE, bj_mapInitialCameraBounds, true, false);
                FogModifierStart(modifier);
            }
            else if (message == "-tp") {
                let i = GetRandomInt(0, 10000);
                const syncher = syncData('-tp'+i, player, (self, data: string) => {
                    Log.Information(data);
                    const x = S2R(data.split(',')[0]);
                    const y = S2R(data.split(',')[1]);
                
                    EnumUnitsSelected(player.handle, Filter(() => true), () => {
                        const u = GetEnumUnit();
                        SetUnitX(u, x);
                        SetUnitY(u, y);
                    })
                });

                if (GetLocalPlayer() == player.handle) {
                    const x = GetCameraTargetPositionX();
                    const y = GetCameraTargetPositionY();
                    syncher(`${x},${y}`);
                }
            }
        }
        // Priv 1 === MODERATOR
        if (priv >= 1) {

        }
        // Priv 0 === NORMIE
        if (priv >= 0) {
            if (message === "-u" && crew) {
                if (crew.weapon) {
                    crew.weapon.detach();
                }
                crew.updateTooltips();
            }
        }
    }

    handleMessage(player: MapPlayer, message: string, crew: Crewmember) {
        // We might handle this differently for admins.
        // Is the user in god chat?
        if (this.adminGodUsers.indexOf(player) >= 0) {
            const players = ForceEntity.getInstance().getActivePlayers();
            this.postMessageFor(players, player.name, COL_GOD, message, "ADMIN");
        }
        else {
            // Get list of players to send the message to by player force
            const pDetails = ForceEntity.getInstance().getPlayerDetails(player);
            const force = pDetails.getForce();

            if (force) {
                const recipients = force.getChatRecipients(player).slice();
                const playername = force.getChatName(player);
                const color      = force.getChatColor(player);
                const sound      = force.getChatSoundRef(player);
                const messageTag = force.getChatTag(player);
                const messageString = force.getChatMessage(player, message);

                
                const postHookData = this.applyChatHooks(player, playername, recipients, color, message, sound);

                // Handle listen mode
                this.adminListenUsers.forEach(u => {
                    if (recipients.indexOf(u) === -1) recipients.push(u);
                });

                this.postMessageFor(postHookData.recipients, postHookData.name, postHookData.color, postHookData.message, messageTag, postHookData.sound);
            }
        }
    }

    private applyChatHooks(player: MapPlayer, playerName: string, recipients: MapPlayer[], color: string, message: string, sound?: SoundWithCooldown) {
        let idx = 0;
        let data: ChatHook = {
            who: player, 
            name: playerName, 
            recipients, color, message, sound
        };

        while (idx < this.chatHooks.length) {
            data = this.chatHooks[idx](data);
            idx++;
        }
        return data;
    }

    /**
     * A hook that messages must first pass through
     * @param hook 
     */
    private hooksForIds = new Map<number, (data: ChatHook) => ChatHook>();
    private hookIdCounter = 0;
    public addHook(hook: (data: ChatHook) => ChatHook): number {
        this.chatHooks.push(hook);
        this.hooksForIds.set(this.hookIdCounter, hook);
        return this.hookIdCounter++;
    }

    /**
     * Removes a hook if it is in the array
     * @param hookHandle 
     */
    public removeHook(hookHandle: number) {
        const hook = this.hooksForIds.get(hookHandle);

        const idx = this.chatHooks.indexOf(hook);
        if (idx >= 0) {
            this.chatHooks.splice(idx, 1);
            this.hooksForIds.delete(hookHandle);
        }
        else {
            Log.Error("Failed to delete hook for handle "+hookHandle);
        }
    }

    public postMessageFor(players: MapPlayer[], fromName: string, color: string, message: string, messageTag?: string, sound?: SoundWithCooldown) {
        players.forEach(p => {
            const cHandler = this.chatHandlers.get(p);
            if (cHandler) cHandler.sendMessage(fromName, color, message, messageTag, sound);
        });            
    }

    public postSystemMessage(player: MapPlayer, message: string) {
        this.postMessageFor([player], "SYSTEM", COL_SYS, `${COL_ATTATCH}${message}|r`);
    }

    public postMessage(player: MapPlayer, name: string, message: string) {
        this.postMessageFor([player], name, COL_MISC_MESSAGE, `${message}|r`);
    }

    getUserPrivs(who: MapPlayer): PRIVS {
        // Log.Information("Player attempting commands: "+GetPlayerName(who));
        if (who.name === 'Eonfuzz#1988') return PRIVS.DEVELOPER;
        if (who.name === 'maddeem#1693') return PRIVS.DEVELOPER;
        if (who.name === 'mayday#12613') return PRIVS.DEVELOPER;
        // if (who.name === 'pipski#12613') return PRIVS.DEVELOPER;
        if (who.name === 'Local Player') return PRIVS.DEVELOPER;
        // No # means this is a local game
        if (who.name.indexOf("#") === -1) return PRIVS.DEVELOPER;
        else if (ForceEntity.getInstance().getActivePlayers().length === 1) return PRIVS.MODERATOR;
        return PRIVS.USER;
    }
}