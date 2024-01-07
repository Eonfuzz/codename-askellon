import { Trigger, MapPlayer, Timer, Unit, playerColors } from "w3ts";
import { Crewmember } from "app/crewmember/crewmember-type";
import { ChatSystem } from "./chat-system";
import { Log, LogLevel } from "lib/serilog/serilog";
import {  SoundWithCooldown } from "app/types/sound-ref";
import { COL_GOD, COL_ATTATCH, COL_SYS, COL_MISC_MESSAGE, COL_ALIEN } from "resources/colours";
import { syncData, GetActivePlayers, GetPlayerCamLoc, MessagePlayer, GetPlayerUnitSelection, MessageAllPlayers } from "lib/utils";
import { ChatHook } from "./chat-hook-type";
import { Entity } from "app/entity-type";
import { EventEntity } from "app/events/event-entity";
import { EventListener } from "app/events/event-type";
import { EVENT_TYPE } from "app/events/event-enum";
import { Players } from "w3ts/globals/index";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { Hooks } from "lib/Hooks";
import { CREWMEMBER_UNIT_ID, ALIEN_MINION_CANITE, ALIEN_MINION_LEECH, ALIEN_MINION_FORMLESS, ALIEN_STRUCTURE_TUMOR, ALIEN_MINION_LARVA, ALIEN_MINION_GREATER_CANITE, ALIEN_MINION_HYDRA, ALIEN_STRUCTURE_HATCHERY, ALIEN_MINION_ROACH } from "resources/unit-ids";
import { WorldEntity } from "app/world/world-entity";
import { ZONE_TYPE } from "app/world/zone-id";
import { AIEntity } from "app/ai/ai-entity";
import { Timers } from "app/timer-type";
import { WeaponEntityAttackType } from "app/weapons/weapon-attack-type";
import { AskellonEntity } from "app/station/askellon-entity";
import { CreepEntity } from "app/creep/creep-entity";
import { ITEM_WEP_NEOKATANA, ITEM_WEP_MINIGUN, ITEM_HUMAN_CORPSE, ITEM_COMEBACK_DRUG, ITEM_GENETIC_SAMPLER } from "resources/item-ids";
import { ResearchFactory } from "app/research/research-factory";
import { TECH_MINERALS_PROGRESS } from "resources/ability-ids";
import { ALIEN_FORCE_NAME, OBSERVER_FORCE_NAME } from "app/force/forces/force-names";
import { PlayNewSoundOnUnit, SendMessageToAdmin } from "lib/translators";
import { Quick } from "lib/Quick";
import { BUFF_ID } from "resources/buff-ids";
import { BuffInstanceDuration } from "app/buff/buff-instance-duration-type";
import { PlayerState, PRIVS } from "app/force/player-type";
import { DynamicBuffState } from "app/buff/dynamic-buff-state";
import { StringSink } from "lib/serilog/string-sink";
import { WeaponEntity } from "app/weapons/weapon-entity";
export class ChatEntity extends Entity {

    private static instance: ChatEntity;

    public static getInstance() {        
        if (this.instance == null) {
            this.instance = new ChatEntity();
            Hooks.set(this.name, this.instance);
        }
        return this.instance;
    }


    private chatHandlers = new Map<number, ChatSystem>();

    private adminGodUsers: MapPlayer[] = [];
    private adminListenUsers: MapPlayer[] = [];

    private chatHooks: Array<(data: ChatHook) => ChatHook> = []; 
    private previousMessages: string[] = [];

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
            this.chatHandlers.set(p.id, chatHandler);
            
            messageTrigger.registerPlayerChatEvent(p, "", false);
        });
    }

    _timerDelay = 0.03;
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
        const pData = PlayerStateFactory.get(player);
        const priv = pData.getUserPrivs();


        // Priv 2 === DEVELOPER
        if (priv >= PRIVS.DEVELOPER) {
            if (message.indexOf("-pmax") === 0) {
                AskellonEntity.addToPower(AskellonEntity.getMaxPower());
            }
            else if (message.indexOf("-pmin") === 0) {
                AskellonEntity.addToPower(-AskellonEntity.getCurrentPower());
            }
            else if (message.indexOf("-save") === 0) {
                const p = PlayerStateFactory.get(player).save();
            }
            else if (message.indexOf("-load") === 0) {
                const p = PlayerStateFactory.get(player).load();
            }
            else if (message.indexOf("-plog") === 0) {
                const p = PlayerStateFactory.get(MapPlayer.fromIndex(Number(message.split(" ")[1])));
                if (p) {
                    p.log(player);
                }
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
                player.setState(PLAYER_STATE_RESOURCE_LUMBER, 999999);
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
                GetPlayerUnitSelection(player, units => {
                    units.forEach(u => {                     
                        u.setAnimation(Number(message.slice(2,5)));
                    });
                });
            }
            else if (message == "-level") {
                GetPlayerUnitSelection(player, units => {
                    units.forEach(u => {                           
                        const pData = PlayerStateFactory.get(u.owner);
                        if (pData && pData.getCrewmember()) {
                            pData.getCrewmember().addExperience(99999);
                        }
                    });
                });
            }
            else if (message == "-kill") {
                GetPlayerUnitSelection(player, units => {
                    units.forEach(u => u.kill());
                });
            }
            else if (message == "-damage") {
                GetPlayerUnitSelection(player, units => {
                    units.forEach(u => u.damageTarget(u.handle, u.maxLife * 0.1, false, false, ATTACK_TYPE_CHAOS, DAMAGE_TYPE_DEATH, WEAPON_TYPE_WHOKNOWS));
                });
            }
            else if (message == "-creep") {
                GetPlayerCamLoc(player, (x, y) => {
                    const tumor = new Unit(PlayerStateFactory.AlienAIPlayer1, ALIEN_STRUCTURE_TUMOR, x, y, bj_UNIT_FACING);
                    CreepEntity.addCreepWithSource(600, tumor);
                });
            }
            else if (message == "-hatchery") {
                GetPlayerCamLoc(player, (x, y) => {
                    const tumor = new Unit(PlayerStateFactory.AlienAIPlayer1, ALIEN_STRUCTURE_HATCHERY, x, y, bj_UNIT_FACING);
                });
            }
            else if (message == "-flare") {
                WorldEntity.getInstance().beginASolarFlare();
            }
            else if (message == "-larva") {
                // Log.Information("PF "+message);
                GetPlayerCamLoc(player, (x, y) => {
                    const pData = PlayerStateFactory.get(player);
                    const crewUnit = pData.getCrewmember().unit;

                    const zone = WorldEntity.getInstance().getPointZone(x, y);
                    if (zone) {
                        const aiPlayer = PlayerStateFactory.getAlienAI()[0];
                        CreateUnit(aiPlayer.handle, ALIEN_MINION_LARVA, x, y, GetRandomInt(0, 360));  
                    }
                    else {
                        Log.Information("No Zone picked");
                    }
                });
                // const unit =
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
                            else if (i >= 6) t = ALIEN_MINION_ROACH;
                            else if (i >= 5) t = ALIEN_MINION_FORMLESS;
                            else if (i >= 4) t = ALIEN_MINION_GREATER_CANITE;
                            else if (i >= 3) t = ALIEN_MINION_HYDRA;
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
            else if (message == "-checkzone") {
                GetPlayerCamLoc(player, (x, y) => {
                    const z = WorldEntity.getInstance().getPointZone(x, y);
                    if (z) {
                        Log.Information(`Zone check: ${z.id}`);
                    }
                    else {
                        Log.Information(`Zone check: No Zone`);
                    }
                });
            }
            else if (message == "-test minigun") {
                GetPlayerCamLoc(player, (x, y) => {
                    CreateItem(ITEM_WEP_MINIGUN, x, y);
                });
            }
            else if (message == "-test sampler") {
                GetPlayerCamLoc(player, (x, y) => {
                    CreateItem(ITEM_GENETIC_SAMPLER, x, y);
                });
            }
            else if (message == "-test thano") {
                GetPlayerCamLoc(player, (x, y) => {
                    CreateItem(ITEM_COMEBACK_DRUG, x, y);
                });
            }
            else if (message == "-test corpse") {
                GetPlayerCamLoc(player, (x, y) => {
                    const i = CreateItem(ITEM_HUMAN_CORPSE, x, y);
                    SetItemPlayer(i, Quick.GetRandomFromArray(Players, 1)[0].handle, true);
                });
            }
            else if (message == "-test crew") {
                GetPlayerCamLoc(player, (x, y) => {
                    new Unit(PlayerStateFactory.NeutralHostile, CREWMEMBER_UNIT_ID, x, y, bj_UNIT_FACING);
                });
            }
            else if (message == "-test madness") {
                // Log.Information("Madness test!");
                EnumUnitsSelected(player.handle, Filter(() => true), () => {
                    // Log.Information("aaa");
                    const u = Unit.fromHandle(GetEnumUnit());
                    EventEntity.send(EVENT_TYPE.ADD_BUFF_INSTANCE, { source: u, data: { 
                        buffId: BUFF_ID.MADNESS,
                        instance: new BuffInstanceDuration(u, 300),
                        target: u
                    }});
                    // DynamicBuffEntity.add(BUFF_ID.MADNESS, u, new BuffInstanceDuration(u, 60));
                });
            }
            else if (message == "-cd") {
                GetPlayerUnitSelection(player, units => {
                    units.forEach(u => {
                        u.resetCooldown();
                    });
                });
            }
            else if (message == "-min1") {
                ResearchFactory.getInstance().processMajorUpgrade(TECH_MINERALS_PROGRESS, 1);
            }
            else if (message == "-min2") {
                ResearchFactory.getInstance().processMajorUpgrade(TECH_MINERALS_PROGRESS, 2);
            }
            else if (message == "-min3") {
                ResearchFactory.getInstance().processMajorUpgrade(TECH_MINERALS_PROGRESS, 3);
            }
            else if (message == "-control") {
                GetPlayerUnitSelection(player, units => {
                    units.forEach(u => {
                        SetUnitOwner(u.handle, player.handle, false);
                    });
                });
            }
            else if (message == "-checkai") {
                GetPlayerUnitSelection(player, units => {
                    units.forEach(u => {
                        AIEntity.debugAgent(u)
                    });
                });
            }
            else if (message.indexOf(`-loglevel `) === 0) {
                const level = Number(message.split(" ")[1]);
                Log.Error(`New level: ${LogLevel[level]}`);
                Log.Init([
                    new StringSink(level, SendMessageToAdmin)
                ]);
            }
            else if (message == "-logai") {
                AIEntity.debug();
            }
            else if (message == "-logbuffs") {
                DynamicBuffState.log();
            }
            else if (message == "-logworld") {
                WorldEntity.getInstance().log();
            }
            else if (message == "-logweapons") {
                EventEntity.send(EVENT_TYPE.DEBUG_WEAPONS, { source: undefined });
            }
            else if (message.indexOf("-vision") === 0) {
                const modifier = CreateFogModifierRect(player.handle, FOG_OF_WAR_VISIBLE, bj_mapInitialCameraBounds, true, false);
                FogModifierStart(modifier);
                SetCameraBoundsToRectForPlayerBJ(player.handle, bj_mapInitialPlayableArea);
                SetDayNightModels(
                    "Environment\\DNC\\DNCLordaeron\\DNCLordaeronTerrain\\DNCLordaeronTerrain.mdl", 
                    "Environment\\DNC\\DNCLordaeron\\DNCLordaeronUnit\\DNCLordaeronUnit.mdl"
                );
                BlzChangeMinimapTerrainTex("war3mapGenerated.blp");
            }
            else if (message.indexOf("-dark") === 0) {
                const modifier = CreateFogModifierRect(player.handle, FOG_OF_WAR_VISIBLE, bj_mapInitialCameraBounds, true, false);
                FogModifierStart(modifier);
                SetCameraBoundsToRectForPlayerBJ(player.handle, bj_mapInitialPlayableArea);
                SetDayNightModels(
                    "", 
                    ""
                );
                BlzChangeMinimapTerrainTex("war3mapGenerated.blp");
            }
            else if (message.indexOf("-light") === 0) {
                const modifier = CreateFogModifierRect(player.handle, FOG_OF_WAR_VISIBLE, bj_mapInitialCameraBounds, true, false);
                FogModifierStart(modifier);
                SetCameraBoundsToRectForPlayerBJ(player.handle, bj_mapInitialPlayableArea);
                SetDayNightModels("DeepFried\\dnclordaeronunit.mdx", "DeepFried\\dnclordaeronunit.mdx");
                BlzChangeMinimapTerrainTex("war3mapGenerated.blp");
            }
            else if (message == "-tp") {
                // Log.Information("TP");
                GetPlayerCamLoc(player, (x, y) => {
                    // Get zone at loc
                    MessagePlayer(player, "Tp: "+x+", "+y);
                    const zone = WorldEntity.getInstance().getPointZone(x, y);
                    if (zone) MessagePlayer(player, "Zone: "+ZONE_TYPE[zone.id]);
                    else MessagePlayer(player, "No Zone");

                    GetPlayerUnitSelection(player, units => {
                        units.forEach(u => {
                            u.x = x;
                            u.y = y;
                            if (zone) WorldEntity.getInstance().travel(u, zone.id);
                        });
                    });
                });
            }
        }
        // Priv 1 === MODERATOR
        if (priv >= PRIVS.MODERATOR) {

        }
        // Priv 0 === NORMIE
        if (priv >= PRIVS.USER) {
            if (message === "-u" && crew) {
                if (crew.weapon) {
                    crew.weapon.detach();
                }
                crew.updateTooltips();
            }
            else if (message === "-d" || message === "-dance") {
                crew.unit.setAnimation(10);
            }
            else if (message === "-clear" || message === "-c") {
                if (player.handle === GetLocalPlayer()) ClearTextMessages();
            }
            else if (message === "-tips" || message === "-tip" || message === "-tips off") {
                const pData = PlayerStateFactory.get(player);
                pData.tipsOn = !pData.tipsOn;
                MessagePlayer(player, `Tips are now ${pData.tipsOn ? `on` : `off`}`);
                pData.save();
            }
            else if (message === "-lol" || message === "-l" || message === "-l") {
                const pData = PlayerStateFactory.get(player);
                const crew = PlayerStateFactory.getCrewmember(player);
                if (crew && pData.getUnit() === crew.unit) {    
                    const u = crew.unit;                
                    if (u && u.typeId === CREWMEMBER_UNIT_ID) {
                        PlayNewSoundOnUnit("Sounds\\minigun_fullerauto_2.mp3", u, 60);
                        u.setAnimation(5);
                        const uX = u.x;
                        const uY = u.y;

                        Timers.addTimedAction(1.4, () => u.x == uX && u.y == uY && u.setAnimation(0));
                    }
                }
                if (player.handle === GetLocalPlayer()) ClearTextMessages();
            }
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
            else if (message.indexOf("-ws") === 0) {
                EventEntity.send(EVENT_TYPE.WEAPON_MODE_CHANGE, {
                    source: crew.unit,
                    crewmember: crew,
                    data: { mode: WeaponEntityAttackType.SMART } 
                });
            }
            else if (message === "-h" || message === "-handles" || message === "-p" || message === "-players") {
                const pIsAlien = PlayerStateFactory.get(player).getForce().is(ALIEN_FORCE_NAME);
                const isObserver = PlayerStateFactory.get(player).getForce().is(OBSERVER_FORCE_NAME);

                Players.forEach(p => {
                    if (p.controller === MAP_CONTROL_USER) {
                        const pData = PlayerStateFactory.get(p);
                        const crew = PlayerStateFactory.getCrewmember(p);

                        const showIsAlien = pIsAlien && pData && pData.getForce().is(ALIEN_FORCE_NAME);

                        if (crew) {
                            const pStr = `#${p.id+1}: ${playerColors[p.id].code}${crew.name}|r ${pData.originalName}`
                            if (isObserver) {
                                MessagePlayer(player,  `${pStr} ( ${pData.getForce().name} )`);
                            }
                            else if (pIsAlien && showIsAlien) {
                                MessagePlayer(player,  `${pStr} ( ${pData.getForce().name} )`);
                            }
                            else {
                                MessagePlayer(player,  pStr);
                            }
                        }
                    }                        
                });
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
                chatTag: undefined,
            });

            // Now run through our own hooks
            const postHookData = this.applyChatHooks(chatData);

            // Get list of players to send the message to by player force
            const pDetails = PlayerStateFactory.get(player);

            // Handle listen mode
            this.adminListenUsers.forEach(u => {
                if (chatData.recipients.indexOf(u) === -1) chatData.recipients.push(u);
            });

            try {
                    
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
                if (postHookData.recipients.length > 1) {
                    this.previousMessages.push(postHookData.message);
                }

                this.postMessageFor(postHookData.recipients, postHookData.name, postHookData.color, postHookData.message, postHookData.chatTag, postHookData.sound);
            
            }
            catch(e) {
                Log.Error(`Chat failed ${e}`);
            }
        }
    }

    public getPreviousMessages() {
        return this.previousMessages;
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

        try {
            const idx = this.chatHooks.indexOf(hook);
            if (idx >= 0) {
                this.chatHooks.splice(idx, 1);
                this.hooksForIds.delete(hookHandle);
            }
        }
        catch(e) {
            Log.Error("Failed to delete hook for handle "+hookHandle);
        }
    }

    public postMessageFor(players: MapPlayer[], fromName: string, color: string, message: string, messageTag?: string, sound?: SoundWithCooldown) {
        
        // MessageAllPlayers("Post message!");
        players.forEach(p => {
            // MessageAllPlayers("Player: "+p.id);
            const cHandler = this.chatHandlers.get(p.id);
            if (cHandler) cHandler.sendMessage(fromName, color, message, messageTag, sound);
        });            
    }

    public postSystemMessage(player: MapPlayer, message: string) {
        this.postMessageFor([player], "SYSTEM", COL_SYS, `${COL_ATTATCH}${message}|r`);
    }

    public postMessage(player: MapPlayer, name: string, message: string) {
        this.postMessageFor([player], name, COL_MISC_MESSAGE, `${message}|r`);
    }

    public static postMessageFor(players: MapPlayer[], fromName: string, color: string, message: string, messageTag?: string, sound?: SoundWithCooldown) {
        this.getInstance().postMessageFor(players, fromName, color, message, messageTag, sound);
    }

}