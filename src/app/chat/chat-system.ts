/**
 * Chat system by Niklas
 * Converted to Typescript by Boar
 */


import { Game } from "app/game";
import { Log } from "lib/serilog/serilog";
import { SoundRef, SoundWithCooldown } from "app/types/sound-ref";
import { MapPlayer } from "w3ts";

export class ChatSystem {
    private game: Game;

    private player: MapPlayer;

    private messageQueue: string[] = [];

    private frame: framehandle | undefined;
    private chatFrame: framehandle | undefined;
    private timeSinceLastMessage: number = 0;
    private timestampLastMessage: number = 0;

    constructor(game: Game, forWho: MapPlayer) {
        this.game = game;
        this.player = forWho;
    }

    /**
     * Delegate for gametime
     */
    private getGameTime() { return this.game.getTimeStamp(); }

    /**
     * Gets the player's chat colour
     * @param playerId 
     */
    public getChatColor(playerColor: string): string {
        return `|cff${playerColor}`;
    }

    /**
     * Gets the chat time stamp in [00:00] format
     */
    private getChatTimeTag(): string {
        const timeStamp = this.getGameTime();
        let minutes = I2S(MathRound(timeStamp / 60));
        let seconds = I2S(MathRound(this.getGameTime() % 60));

        if (minutes.length < 2) minutes = `0${minutes}`;
        if (seconds.length < 2) seconds = `0${seconds}`;

        return `${minutes}:${seconds}`;
    }

    /**
     * Returns the chat user string
     */
    private getChatUser(playerName: string, playerColor: string,): string {
        const name = playerName;
        const color = this.getChatColor(playerColor);
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
    private generateMessage(playerName: string, playerColor: string, message: string, messageTag?: string): string {
        // Append an empty string if this isn't the local player
        if (GetLocalPlayer() === this.player.handle) {
            return `[${this.getChatTimeTag()}${messageTag ? `::${messageTag}` : ''}] ${this.getChatUser(playerName, playerColor)}: ${message}`;
        }
        return ``;
    }

    /**
     * Loops through all the messages and upates the chat window
     */
    private update() {
        let string = "";

        // Clone the queue and iterate
        let queue = this.messageQueue.slice();
        while (queue.length > 0) {
            let message = queue.shift();
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
        if (this.messageQueue.length > 10) {
            this.messageQueue.shift();
        }
    }

    /**
     * Displays a message to all the players
     * @param playerId 
     * @param message 
     */
    public sendMessage(playerName: string, playerColor: string, message: string, messageTag?: string, sound?: SoundWithCooldown, ) {
        const timestamp = this.getGameTime();
        if (GetLocalPlayer() === this.player.handle) {
            if (this.messageIsValid(message)) {
                const text = this.generateMessage(playerName, playerColor, message, messageTag);
                this.addMessage(text);
                this.update();
                if (sound && sound.canPlaySound(this.game.getTimeStamp())) sound.playSound();
                this.timestampLastMessage = timestamp;
                this.timeSinceLastMessage = 0;
            }
        }
    }

    public updateFade(timeSinceLastPost: number) {
        this.timeSinceLastMessage += timeSinceLastPost;
        const alpha = Math.max(
            Math.min(255 - (this.timeSinceLastMessage - 6) / 3 * 255, 255), 
        0);
        if (this.chatFrame && this.player.handle === GetLocalPlayer()) {
            BlzFrameSetAlpha(this.chatFrame, MathRound(alpha));
        }
    }

    public init(chatHandle: framehandle, chatText: framehandle) {
        this.chatFrame = chatHandle;
        this.frame = chatText;
    }
 }
