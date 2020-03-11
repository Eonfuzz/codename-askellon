/**
 * Chat system by Niklas
 * Converted to Typescript by Boar
 */


import { Game } from "app/game";
import { Log } from "lib/serilog/serilog";

// UNUSED
const CHAT_SYSTEM = "[|cffe6a200System|r]";
const CHAT_GLOBAL = "[|cffe6a200Global|r]";

// DEFAULT PLAYER COLOUR
const DEFAULT_COLOR = "|cff990000";

export class ChatSystem {
    game: Game;

    playerColors: string[] = [];
    playerNames: string[] = [];
    messageQueue: string[] = [];

    frame: framehandle | undefined;

    constructor(game: Game) {
        this.game = game;
    }

    /**
     * Delegate for gametime
     */
    private getGameTime() { return this.game.getTimeStamp(); }

    /**
     * Sets the chat colour for a player
     * Color string length must be 6 and hexa
     * @param playerId 
     * @param color 
     */
    public setChatColor(playerId: number, color: string) {
        if (StringLength(color) != 6) {
            Log.Error("Chat color is wrong format");
        }
        else {
            this.playerColors[playerId] = color;
        }
    }

    /**
     * Sets the player's chat name
     * @param playerId
     * @param name 
     */
    public setPlayerName(playerId: number, name: string) {
        this.playerNames[playerId] = name;
    }

    /**
     * Gets the player's chat colour
     * @param playerId 
     */
    public getChatColor(playerId: number): string {
        return this.playerColors[playerId] || DEFAULT_COLOR;
    }

    /**
     * Gets the chat time stamp in [00:00] format
     */
    private getChatTimeTag(): string {
        const timeStamp = this.getGameTime();
        let minutes = I2S(MathRound(timeStamp / 60));
        let seconds = I2S(this.getGameTime() % 60);

        if (minutes.length < 2) minutes = `0${minutes}`;
        if (seconds.length < 2) seconds = `0${seconds}`;

        return `[${minutes}:${seconds}]`;
    }

    /**
     * Returns the chat user string
     */
    private getChatUser(playerId: number): string {
        const name = this.playerNames[playerId] || GetPlayerName(Player(playerId));
        const color = this.getChatColor(playerId);
        return `${color}${name}|r`
    }

    /**
     * Returns true if the message is valid
     * @param message 
     */
    private messageIsValid(message: string): boolean {
        return message.length <= 128
    }

    /**
     * Generates the message string
     * @param playerId 
     * @param message 
     */
    private generateMessage(playerId: number, message: string): string {
        return `${this.getChatTimeTag()} ${this.getChatUser(playerId)}: ${message}`;
    }

    /**
     * Loops through all the messages and upates the chat window
     */
    private update() {
        let string = "";

        // Clone the queue and iterate
        let queue = this.messageQueue.slice();
        while (queue.length > 0) {
            let message = queue.pop();
            if (message) string += `${message}\n`
            else string += '';
        }

        // Update the chat frame
        BlzFrameSetText(this.frame as framehandle, string);
    }

    /**
     * Adds a message to the queue
     * @param message 
     */
    private addMessage(message: string) {
        this.messageQueue.push(message);
    }

    /**
     * Displays a message to all the players
     * @param playerId 
     * @param message 
     */
    public sendMessage(playerId: number, message: string) {
        const text = this.generateMessage(playerId, message);
        if (this.messageIsValid(message)) {
            this.addMessage(text);
            this.update();
        }
    }

    public init(font: string) {
        const chat: framehandle = BlzCreateSimpleFrame("Chat", BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0), 0);
        const chatText: framehandle = BlzGetFrameByName("Chat Text", 0);

        BlzFrameSetAbsPoint(chat, FRAMEPOINT_TOPLEFT, -0.131, 0.595);
        BlzFrameSetLevel(chat, 8);

        BlzFrameSetTextAlignment(chatText, TEXT_JUSTIFY_TOP, TEXT_JUSTIFY_LEFT);
        BlzFrameSetFont(chatText, "UI\\Font\\" + font, 0.009, 0);
    }
 }
