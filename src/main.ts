import { Game } from "./app/game";
import { addScriptHook, W3TS_HOOK } from "w3ts/hooks";
import { Timer } from "w3ts/handles/timer";
import { StringSink } from "lib/serilog/string-sink";
import { Log, LogLevel } from "lib/serilog/serilog";
import { SendMessageToAdmin, SendMessageUnlogged } from "lib/translators";

tsMain();


function tsMain() {
    Log.Init([
        new StringSink(LogLevel.Debug, SendMessageToAdmin),
        // new StringSink(LogLevel.Debug, SendMessageUnlogged),
    ]);

    // Override Trigger Behaviour
    const realTriggerAddAction = TriggerAddAction;
    //@ts-ignore
    TriggerAddAction = (whichTrigger: trigger, actionfunc: () => void) => {
        realTriggerAddAction(whichTrigger, () => {
          try {
            actionfunc();
          } catch (e) {
            Log.Error(`Trigger: ${e} `);
          }
        });
      };

    function Main() {
        const askellon = Game.getInstance();

        const gameStart = new Timer();
        gameStart.start(0.1, false, () => {
            try {
                askellon.startGame();
            }
            catch (e) {
                Log.Error(e)
            }
        });
    }

    Main();
}
