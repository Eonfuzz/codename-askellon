import { Game } from "app/game";
import { Trigger } from "app/types/jass-overrides/trigger";
import { Crewmember } from "app/crewmember/crewmember-type";
import { ZONE_TYPE } from "app/world/zone-id";
import { ChatSystem } from "./chat-system";
import { Log } from "lib/serilog/serilog";

export enum PRIVS {
    USER, MODERATOR, DEVELOPER
}

export class ChatModule {

    game: Game;
    chatHandlers = new Map<player, ChatSystem>();

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
        BlzFrameSetScale(BlzGetFrameByName("AllianceDialog", 0), 0.0001);
        BlzFrameSetVisible(BlzGetFrameByName("AllianceDialog", 0), false);
        BlzFrameSetAlpha(BlzGetFrameByName("AllianceDialog", 0), 0);
        
        BlzFrameSetScale(BlzGetFrameByName("ChatDialog ", 0), 0.0001);

        /**
         * Creates and prepares the text frame area
         */
        const chatHandle = BlzCreateSimpleFrame("Chat", BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0), 0);
        const chatTextHandle = BlzGetFrameByName("Chat Text", 0);
        BlzFrameSetVisible(BlzGetOriginFrame(ORIGIN_FRAME_CHAT_MSG, 0), false);

        BlzFrameSetAbsPoint(chatHandle, FRAMEPOINT_BOTTOMLEFT, -0.1, 0.17);
        BlzFrameSetLevel(chatHandle, 8);

        BlzFrameSetTextAlignment(chatTextHandle, TEXT_JUSTIFY_BOTTOM, TEXT_JUSTIFY_LEFT);
        BlzFrameSetFont(chatTextHandle, "UI\\Font\\" + font, 0.014, 1);

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
            messageTrigger.RegisterPlayerChatEvent(player, "", false);
        });
        messageTrigger.AddAction(() => this.onChatMessage());
    }


    onChatMessage() {
        const player = GetTriggerPlayer();
        const message = GetEventPlayerChatString();
        const crew = this.game.crewModule.getCrewmemberForPlayer(player) as Crewmember;

        const isCommand = message[0] === '-';
        if (isCommand) this.handleCommand(player, message, crew);
        else this.handleMessage(player, message, crew);
    }

    handleCommand(player: player, message: string, crew: Crewmember) {
        const priv = this.getUserPrivs(player);

        // Priv 2 === DEVELOPER
        if (priv >= 2) {
            if (message === "-u" && crew) {
                if (crew.weapon) {
                    crew.weapon.detach();
                }
                crew.updateTooltips(this.game.weaponModule);
            }
            else if (message === "-p1off") {
                const z = this.game.worldModule.askellon.findZone(ZONE_TYPE.FLOOR_1)
                z && z.updatePower(this.game.worldModule, false);
            }
            else if (message === "-p1on") {
                const z = this.game.worldModule.askellon.findZone(ZONE_TYPE.FLOOR_1)
                z && z.updatePower(this.game.worldModule, true);
            }
            else if (message.indexOf("-m") === 0) {
                const mSplit = message.split(" ");
                const dX = S2I(mSplit[1] || "0");
                const dY = S2I(mSplit[2] || "0");
                this.game.galaxyModule.navigateToSector(dX, dY);
            }
        }
        // Priv 1 === MODERATOR
        if (priv >= 1) {

        }
        // Priv 0 === NORMIE
        if (priv >= 0) {

        }
    }

    handleMessage(player: player, message: string, crew: Crewmember) {
        // Get list of players to send the message to by player force
        const force = this.game.forceModule.getPlayerForce(player);
        if (force) {
            const recipients = force.getChatRecipients(player);
            const playername = force.getChatName(player);
            const color      = force.getChatColor(player);
            const sound      = force.getChatSoundRef(player);

            recipients.forEach(p => {
                const cHandler = this.chatHandlers.get(p);
                if (cHandler) cHandler.sendMessage(playername, color, sound, message);
            });            
        }
    }

    getUserPrivs(who: player): PRIVS {
        // Log.Information("Player attempting commands: "+GetPlayerName(who));
        if (GetPlayerName(who) === 'Eonfuzz#1988') return PRIVS.DEVELOPER;
        if (GetPlayerName(who) === 'Local Player') return PRIVS.DEVELOPER;
        else if (this.game.forceModule.getActivePlayers().length === 1) return PRIVS.MODERATOR;
        return PRIVS.USER;
    }
}