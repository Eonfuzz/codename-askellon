import { DynamicBuff } from "../dynamic-buff-type";
import { BUFF_ID } from "resources/buff-ids";
import { ChatEntity } from "app/chat/chat-entity";
import { ChatHook } from "app/chat/chat-hook-type";

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

    public onStatusChange(newStatus: boolean) {
        if (newStatus) {
            this.hookId = ChatEntity.getInstance().addHook((hook: ChatHook) => this.processChat(hook));
        }
        else {
            ChatEntity.getInstance().removeHook(this.hookId);
        }
    }

    private processChat(chat: ChatHook) {
        if (chat.who === this.who.owner) {
            
            const skipChat = GetRandomInt(0, 15);
            if (skipChat === 15) {
                chat.message = "uhh";
                return chat;
            }

            if (GetRandomInt(0, 10) > 8) {
                chat.message = "like "+chat.message;
            }

            chat.message = chat.message.toLowerCase();

            // Now replace words
            chat.message = chat.message.replace("me", 'my person');
            chat.message = chat.message.replace("coming", 'heading');
            chat.message = chat.message.replace("back", 'zoinks');
            chat.message = chat.message.replace("ask", 'enter his like mind');
            chat.message = chat.message.replace("attack", 'peace');
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
            chat.message = chat.message.replace("floor", 'brainspace');
            chat.message = chat.message.replace("there", ' dude');
            chat.message = chat.message.replace(" so ", ' so like ');
            chat.message = chat.message.replace(" i ", ' i like ');
            chat.message = chat.message.replace("where", 'huh');
            chat.message = chat.message.replace("what", 'whaaat');
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
            const r = GetRandomInt(0, 15);
            switch (r) {
                case 1: chat.message += ".. bro!"; break;
                case 2: chat.message += " seriously dude"; break;
                case 3: chat.message += " homie"; break;
                case 4: chat.message += " like im totally cool with that..."; break;
                case 5: chat.message += " yeah?"; break;
                case 6: chat.message += " like yeah."; break;
                case 7: chat.message += " okay?"; break;
                case 8: chat.message += " like what's so bad about that?"; break;
                case 9: chat.message += " yeah."; break;
                case 10: chat.message += " aliens okay."; break;
            }

            if (GetRandomInt(0, 10) > 7) {
                chat.message = chat.message.replace("dude", "man");
            }
            if (GetRandomInt(0, 10) > 7) {
                chat.message = chat.message.replace("dude", "bro");
            }
            if (GetRandomInt(0, 10) > 7) {
                chat.message = chat.message.replace("like", "like totally");
            }
        }
        return chat;
    }
}