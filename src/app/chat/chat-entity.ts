import { Trigger, MapPlayer, Timer, Unit } from "w3ts";
import { Crewmember } from "app/crewmember/crewmember-type";
import { ChatSystem } from "./chat-system";
import { Log } from "lib/serilog/serilog";
import {  SoundWithCooldown } from "app/types/sound-ref";
import { COL_GOD, COL_ATTATCH, COL_SYS, COL_MISC_MESSAGE } from "resources/colours";
import { syncData, GetActivePlayers, GetPlayerCamLoc, MessagePlayer } from "lib/utils";
import { ChatHook } from "./chat-hook-type";
import { Entity } from "app/entity-type";
import { EventEntity } from "app/events/event-entity";
import { EventListener } from "app/events/event-type";
import { EVENT_TYPE } from "app/events/event-enum";
import { PRIVS } from "./chat-privs-enum";
import { Players } from "w3ts/globals/index";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { Hooks } from "lib/Hooks";
import { CREWMEMBER_UNIT_ID, ALIEN_MINION_CANITE, ALIEN_MINION_LEECH, ALIEN_MINION_FORMLESS, ALIEN_STRUCTURE_TUMOR, ALIEN_MINION_LARVA } from "resources/unit-ids";
import { WorldEntity } from "app/world/world-entity";
import { ZONE_TYPE } from "app/world/zone-id";
import { AIEntity } from "app/ai/ai-entity";
import { Timers } from "app/timer-type";
import { WeaponEntityAttackType } from "app/weapons/weapon-attack-type";
import { AskellonEntity } from "app/station/askellon-entity";
import { CreepEntity } from "app/creep/creep-entity";
import { PlayerState } from "app/force/player-type";
import { ITEM_WEP_NEOKATANA } from "resources/item-ids";
import { PLAYER_COLOR } from "lib/translators";
export class ChatEntity extends Entity {

    private static instance: ChatEntity;

    public static getInstance() {        
        if (this.instance == null) {
            this.instance = new ChatEntity();
            Hooks.set(this.name, this.instance);
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

        BlzFrameSetAbsPoint(chatHandle, FRAMEPOINT_BOTTOMLEFT, (0.6 * BlzGetLocalClientWidth() / BlzGetLocalClientHeight() - 0.8) / -2 + 0.05, 0.17);
        BlzFrameSetLevel(chatHandle, 8);

        BlzFrameSetTextAlignment(chatTextHandle, TEXT_JUSTIFY_BOTTOM, TEXT_JUSTIFY_LEFT);
        BlzFrameSetFont(chatTextHandle, "UI\\Font\\" + font, 0.011, 1);

        // Init chat events
        const messageTrigger = new Trigger();
        messageTrigger.addAction(() => this.onChatMessage());

        /**
         * Creates and prepare the chat handlers
         */
        GetActivePlayers().forEach(p => {
            const chatHandler = new ChatSystem(p);

            // Init chat system
            chatHandler.init(chatHandle, chatTextHandle);

            // Now set chat system in map
            this.chatHandlers.set(p, chatHandler);
            
            messageTrigger.registerPlayerChatEvent(p, "", false);
        });
    }

    step() {
        this.chatHandlers.forEach(handler => handler.updateFade(this._timerDelay));
    }

    onChatMessage() {
        const player = MapPlayer.fromHandle(GetTriggerPlayer());
        const message = GetEventPlayerChatString();
        const pData = PlayerStateFactory.get(player);
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
            // else 
            if (message.indexOf("-wa") === 0) {
                EventEntity.send(EVENT_TYPE.WEAPON_MODE_CHANGE, {
                    source: crew.unit,
                    crewmember: crew,
                    data: { mode: WeaponEntityAttackType.ATTACK } 
                });
            }
            else if (message.indexOf("-wc") === 0) {
                EventEntity.send(EVENT_TYPE.WEAPON_MODE_CHANGE, {
                    source: crew.unit,
                    crewmember: crew,
                    data: { mode: WeaponEntityAttackType.CAST } 
                });
            }
            else if (message.indexOf("-pmax") === 0) {
                AskellonEntity.addToPower(AskellonEntity.getMaxPower());
            }
            else if (message.indexOf("-pmin") === 0) {
                AskellonEntity.addToPower(-AskellonEntity.getCurrentPower());
            }
            else  if (message.indexOf("-god") === 0) {
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
            else if (message.indexOf("-a") === 0) {
                EnumUnitsSelected(player.handle, Filter(() => true), () => {
                    const u = Unit.fromHandle(GetEnumUnit());
                    u.setAnimation(Number(message.slice(2,5)));
                });
            }
            else if (message == "-level") {
                EnumUnitsSelected(player.handle, Filter(() => true), () => {
                    const pData = PlayerStateFactory.get(MapPlayer.fromHandle(GetOwningPlayer(GetEnumUnit())));
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
            else if (message == "-creep") {
                GetPlayerCamLoc(player, (x, y) => {
                    const tumor = new Unit(PlayerStateFactory.AlienAIPlayer1, ALIEN_STRUCTURE_TUMOR, x, y, bj_UNIT_FACING);
                    CreepEntity.addCreepWithSource(600, tumor);
                });
            }
            else if (message == "-pf") {
                // Log.Information("PF "+message);
                GetPlayerCamLoc(player, (x, y) => {
                    const pData = PlayerStateFactory.get(player);
                    const crewUnit = pData.getCrewmember().unit;

                    const zone = WorldEntity.getInstance().getPointZone(x, y);
                    if (zone) {
                        const aiPlayer = PlayerStateFactory.getAlienAI()[0];
                        CreateUnit(aiPlayer.handle, ALIEN_MINION_CANITE, x, y, GetRandomInt(0, 360));  
                    }
                    else {
                        Log.Information("No Zone picked");
                    }
                });
                // const unit =
            }
            else if (message == "-horde") {
                // Log.Information("PF "+message);
                GetPlayerCamLoc(player, (x, y) => {
                    const pData = PlayerStateFactory.get(player);
                    const aiPlayer = PlayerStateFactory.getAlienAI()[0];

                    const crewUnit = pData.getCrewmember().unit;
                    for (let index = 0; index < 20; index++) { 
                        let _x = x + GetRandomReal(-300, 300);
                        let _y = y + GetRandomReal(-300, 300);
                        const zone = WorldEntity.getInstance().getPointZone(_x, _y);   
                        if (zone) {
                            const i = GetRandomInt(1,10);
                            let t: number;
                            if (i >= 7) t = ALIEN_MINION_LARVA;
                            else if (i >= 5) t = ALIEN_MINION_FORMLESS;
                            else t = ALIEN_MINION_CANITE;    
                            CreateUnit(aiPlayer.handle, t, _x, _y, GetRandomInt(0, 360));                    
                        }
                        else {
                            Log.Information("No Zone picked");
                        }               
                    }
                });
                // const unit =
            }
            else if (message == "-test katana") {
                GetPlayerCamLoc(player, (x, y) => {
                    CreateItem(ITEM_WEP_NEOKATANA, x, y);
                });
            }
            else if (message == "-cd") {
                EnumUnitsSelected(player.handle, Filter(() => true), () => {
                    UnitResetCooldown(GetEnumUnit());
                });
            }
            else if (message == "-checkai") {
                EnumUnitsSelected(player.handle, Filter(() => true), () => {
                    AIEntity.debugAgent(GetEnumUnit())
                });
            }
            else if (message.indexOf("-vision") === 0) {
                const modifier = CreateFogModifierRect(player.handle, FOG_OF_WAR_VISIBLE, bj_mapInitialCameraBounds, true, false);
                FogModifierStart(modifier);
            }
            else if (message == "-tp") {
                // Log.Information("TP");
                GetPlayerCamLoc(player, (x, y) => {
                    // Get zone at loc
                    Log.Information("Tp: "+x+", "+y);
                    const zone = WorldEntity.getInstance().getPointZone(x, y);
                    if (zone) Log.Information("Zone: "+ZONE_TYPE[zone.id]);
                    else Log.Information("No Zone");

                    EnumUnitsSelected(player.handle, Filter(() => true), () => {
                        const u = GetEnumUnit();
                        SetUnitX(u, x);
                        SetUnitY(u, y);
                        if (zone) WorldEntity.getInstance().travel(Unit.fromHandle(u), zone.id);
                    })
                });
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
            else if (message === "-d" || message === "-dance") {
                crew.unit.setAnimation(9);
            }
            else if (message === "-clear" || message === "-c") {
                if (player.handle === GetLocalPlayer()) ClearTextMessages();
            }
            else if (message === "-h" || message === "-handles" || message === "-p" || message === "-players") {
                let str = '';
                Players.forEach(p => {
                    const pData = PlayerStateFactory.get(p);
                    const crew = PlayerStateFactory.getCrewmember(p);

                    if (crew) {
                        str += `#${p.id}: |cff${PLAYER_COLOR[p.id]}${crew.name}|r ${pData.originalName}`
                    }
                });
                MessagePlayer(player, str);
            }
        }
    }

    handleMessage(player: MapPlayer, message: string, crew: Crewmember) {
        // We might handle this differently for admins.
        // Is the user in god chat?
        if (this.adminGodUsers.indexOf(player) >= 0) {
            const players = GetActivePlayers();
            this.postMessageFor(players, PlayerStateFactory.get(player).originalName, COL_GOD, message, "ADMIN");
        }
        else {

            // Run through our initial hook via force
            const chatData = PlayerStateFactory.doChat({
                who: player, 
                name: player.name, 
                recipients: Players, 
                color: undefined, 
                message: message,
                sound: undefined,
                doContinue: true,
            });

            // Now run through our own hooks
            const postHookData = this.applyChatHooks(chatData);

            // Get list of players to send the message to by player force
            const pDetails = PlayerStateFactory.get(player);

            // Handle listen mode
            this.adminListenUsers.forEach(u => {
                if (chatData.recipients.indexOf(u) === -1) chatData.recipients.push(u);
            });

            if (postHookData.recipients.length > 0) {
                // Play unit chat animation
                const u = pDetails.getUnit();
                if (u && u.typeId === CREWMEMBER_UNIT_ID) {
                    u.setAnimation(5);
                    const uX = u.x;
                    const uY = u.y;

                    Timers.addTimedAction(1.4, () => u.x == uX && u.y == uY && u.setAnimation(0));
                }
            }

            this.postMessageFor(postHookData.recipients, postHookData.name, postHookData.color, postHookData.message, undefined, postHookData.sound);
        }
    }

    private applyChatHooks(chatData: ChatHook) {
        let idx = 0;
        while (idx < this.chatHooks.length && chatData.doContinue) {
            chatData = this.chatHooks[idx](chatData);
            idx++;
        }
        return chatData;
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
        if (who.name === 'redaxe#1865') return PRIVS.DEVELOPER;

        if (PlayerStateFactory.isSinglePlayer() && who.name === 'ChemixV#2500') return PRIVS.DEVELOPER;
        if (who.name === 'pipski#12613') return PRIVS.DEVELOPER;
        if (who.name === 'Local Player') return PRIVS.DEVELOPER;
        // No # means this is a local game
        if (who.name.indexOf("#") === -1) return PRIVS.DEVELOPER;
        else if (GetActivePlayers().length === 1) return PRIVS.MODERATOR;
        return PRIVS.USER;
    }
}