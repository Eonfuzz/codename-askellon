/** @noSelfInFile **/
import { Game } from "../game";
import { BuffInstance, DynamicBuff } from "./buff-instance";
import { BUFF_ID } from "resources/buff-ids";
import { ChatHook } from "app/chat/chat-module";
import { Log } from "lib/serilog/serilog";

/**
 * Resolve is a buff applied to a unit
 * Can be applied multiple times and from multiple sources
 */
export class Trifex extends DynamicBuff {
    name = BUFF_ID.TRIFEX;

    hookId: number;

    constructor() {
        super();
    }

    public onStatusChange(game: Game, newStatus: boolean) {
        if (newStatus) {
            this.hookId = game.chatModule.addHook((hook: ChatHook) => this.processChat(hook));
        }
        else {
            game.chatModule.removeHook(this.hookId);
        }
    }

    private processChat(chat: ChatHook) {
        if (chat.who === this.who.owner) {
            
            const skipChat = GetRandomInt(0, 10);
            if (skipChat === 10) {
                chat.message = "uhh";
                return chat;
            }

            chat.message = chat.message.toLowerCase();

            // Now replace words
            chat.message = chat.message.replace("research", 'like thingy');
            chat.message = chat.message.replace("upgrade", 'thingy');
            chat.message = chat.message.replace("upgr", 'thingy');
            chat.message = chat.message.replace("upg", 'thingy');
            chat.message = chat.message.replace("space", 'spaced out man');
            chat.message = chat.message.replace("ship", 'saucer');
            chat.message = chat.message.replace("run", 'zoinks');
            chat.message = chat.message.replace(".", 'uhh');
            chat.message = chat.message.replace(", ", ' like ');
            chat.message = chat.message.replace("help", 'bruh');
            chat.message = chat.message.replace("job", 'actually nah just chill');
            chat.message = chat.message.replace("floor", 'brain space');
            chat.message = chat.message.replace("there", ' dude ');
            chat.message = chat.message.replace(" so ", ' so like ');
            chat.message = chat.message.replace(" i ", ' i like ');
            chat.message = chat.message.replace("where", 'huh');
            chat.message = chat.message.replace("what", 'huh');
            chat.message = chat.message.replace("this", 'like this');
            chat.message = chat.message.replace("alien", 'dude');
            chat.message = chat.message.replace("evil", 'not a cool dude');
            chat.message = chat.message.replace("red", "dude");
            chat.message = chat.message.replace("blue", "dude");
            chat.message = chat.message.replace("green", "dude");
            chat.message = chat.message.replace("aqua", "dude");
            chat.message = chat.message.replace("brown", "dude");
            chat.message = chat.message.replace("coal", "dude");
            chat.message = chat.message.replace("black", "dude");
            chat.message = chat.message.replace("cyan", "dude");
            chat.message = chat.message.replace("emerald", "dude");
            chat.message = chat.message.replace("lavendar", "dude");
            chat.message = chat.message.replace("light blue", "dude");
            chat.message = chat.message.replace("lb", "dude");
            chat.message = chat.message.replace("lg", "dude");
            chat.message = chat.message.replace("gray", "dude");
            chat.message = chat.message.replace("grey", "dude");
            chat.message = chat.message.replace("maroon", "dude");
            chat.message = chat.message.replace("mint", "dude");
            chat.message = chat.message.replace("purple", "dude");
            chat.message = chat.message.replace("pink", "dude");
            chat.message = chat.message.replace("int", "dude");
            chat.message = chat.message.replace("psion", "dude");
            chat.message = chat.message.replace("teal", "dude");
            chat.message = chat.message.replace("brown", "dude");

            // Now we need to update chat
            // Finally replace the ending randomly
            const r = GetRandomInt(0, 10);
            switch (r) {
                case 1: chat.message += ".. bro!"; break;
                case 2: chat.message += " seriously dude"; break;
                case 3: chat.message += " homie"; break;
                case 4: chat.message += " like im totally cool with that..."; break;
                case 5: chat.message += " yeah?"; break;
                case 6: chat.message += " man dude bro. like yeah."; break;
                case 7: chat.message += " okay?"; break;
                case 8: chat.message += " like what's so bad about that?"; break;
                case 9: chat.message += " yeah."; break;
                case 10: chat.message += " aliens okay."; break;
            }

            if (GetRandomInt(0, 10) > 7) {
                chat.message = chat.message.replace("dude", "man");
            }
        }
        return chat;
    }
}