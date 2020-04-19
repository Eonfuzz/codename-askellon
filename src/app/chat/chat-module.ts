import { Game } from "app/game";
import { Trigger, MapPlayer } from "w3ts";
import { Crewmember } from "app/crewmember/crewmember-type";
import { ZONE_TYPE } from "app/world/zone-id";
import { ChatSystem } from "./chat-system";
import { Log } from "lib/serilog/serilog";
import { SoundRef, SoundWithCooldown } from "app/types/sound-ref";

export enum PRIVS {
    USER, MODERATOR, DEVELOPER
}

export class ChatModule {

    game: Game;
    chatHandlers = new Map<MapPlayer, ChatSystem>();

    constructor(game: Game) {
        this.game = game;
        this.chatHandlers = new Map();
    }

    /**
     * Must be called after force init
     */
    initialise() {
        const players = this.game.forceModule.getActivePlayers();
        const font = 'LVCMono.otf';

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
            const chatHandler = new ChatSystem(this.game, p);

            // Init chat system
            chatHandler.init(chatHandle, chatTextHandle);

            // Now set chat system in map
            this.chatHandlers.set(p, chatHandler);
        });

        // Init chat events
        const messageTrigger = new Trigger();
        this.game.forceModule.getActivePlayers().forEach(player => {
            messageTrigger.registerPlayerChatEvent(player, "", false);
        });
        messageTrigger.addAction(() => this.onChatMessage());

        /**
         * Create a fade tracking trigger loop
         */
        const fadeTrig = new Trigger();
        fadeTrig.registerTimerEvent(0.1, true);
        fadeTrig.addAction(() => this.updateFade(0.1));
    }

    updateFade(deltaTime: number) {
        this.chatHandlers.forEach(handler => handler.updateFade(deltaTime));
    }

    onChatMessage() {
        const player = MapPlayer.fromHandle(GetTriggerPlayer());
        const message = GetEventPlayerChatString();
        const crew = this.game.crewModule.getCrewmemberForPlayer(player) as Crewmember;

        const isCommand = message[0] === '-';
        if (isCommand) this.handleCommand(player, message, crew);
        else this.handleMessage(player, message, crew);
    }

    handleCommand(player: MapPlayer, message: string, crew: Crewmember) {
        const priv = this.getUserPrivs(player);

        // Priv 2 === DEVELOPER
        if (priv >= 2) {
            if (message === "-p1off") {
                const z = this.game.worldModule.askellon.findZone(ZONE_TYPE.FLOOR_1)
                z && z.updatePower(false);
            }
            else if (message === "-p1on") {
                const z = this.game.worldModule.askellon.findZone(ZONE_TYPE.FLOOR_1)
                z && z.updatePower(true);
            }
            else if (message === '-nt') {
                this.game.noTurn = !this.game.noTurn;
            }
            else if (message.indexOf("-m") === 0) {
                const mSplit = message.split(" ");
                const dX = S2I(mSplit[1] || "0");
                const dY = S2I(mSplit[2] || "0");
                this.game.galaxyModule.navigateToSector(dX, dY);
            }
            else if (message.indexOf("-wa") === 0) {
                this.game.weaponModule.changeWeaponModeTo('ATTACK');
            }
            else if (message.indexOf("-wc") === 0) {
                this.game.weaponModule.changeWeaponModeTo('CAST');
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
                crew.updateTooltips(this.game.weaponModule);
            }
        }
    }

    handleMessage(player: MapPlayer, message: string, crew: Crewmember) {
        // Get list of players to send the message to by player force
        const force = this.game.forceModule.getPlayerForce(player);
        if (force) {
            const recipients = force.getChatRecipients(player);
            const playername = force.getChatName(player);
            const color      = force.getChatColor(player);
            const sound      = force.getChatSoundRef(player);
            const messageTag = force.getChatTag(player);

            this.postMessageFor(recipients, playername, color, message, messageTag, sound);
        }
    }

    public postMessageFor(players: MapPlayer[], fromName: string, color: string, message: string, messageTag?: string, sound?: SoundWithCooldown) {
        players.forEach(p => {
            const cHandler = this.chatHandlers.get(p);
            if (cHandler) cHandler.sendMessage(fromName, color, message, messageTag, sound);
        });            
    }

    getUserPrivs(who: MapPlayer): PRIVS {
        // Log.Information("Player attempting commands: "+GetPlayerName(who));
        if (who.name === 'Eonfuzz#1988') return PRIVS.DEVELOPER;
        if (who.name === 'Local Player') return PRIVS.DEVELOPER;
        else if (this.game.forceModule.getActivePlayers().length === 1) return PRIVS.MODERATOR;
        return PRIVS.USER;
    }
}