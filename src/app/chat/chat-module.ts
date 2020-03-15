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
    chatHandler: ChatSystem;

    constructor(game: Game) {
        this.game = game;
        this.chatHandler = new ChatSystem(game);
    }

    /**
     * Must be called after force init
     */
    initialise() {
        // Init chat system
        this.chatHandler.init('LVCMono.otf');

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
        this.chatHandler.sendMessage(GetPlayerId(player), message);
    }

    getUserPrivs(who: player): PRIVS {
        Log.Information("Player attempting commands: "+GetPlayerName(who));
        if (GetPlayerName(who) === 'Eonfuzz#1988') return PRIVS.DEVELOPER;
        else if (this.game.forceModule.getActivePlayers().length === 1) return PRIVS.MODERATOR;
        return PRIVS.USER;
    }
}