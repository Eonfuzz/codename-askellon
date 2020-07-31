import { Game } from "./app/game";
import { addScriptHook, W3TS_HOOK } from "w3ts/hooks";
import { Timer } from "w3ts/handles/timer";
import { StringSink } from "lib/serilog/string-sink";
import { Log, LogLevel } from "lib/serilog/serilog";
import { SendMessageUnlogged } from "lib/translators";



function tsMain() {
    Log.Init([
        new StringSink(LogLevel.Debug, SendMessageUnlogged),
    ]);

    function Main(){
        const gameStart = new Timer();
        gameStart.start(0.1, false, () => {
            try {
                const askellon = Game.getInstance();
                // AksellonSector.startGame()
                // Log.Information("Start game!");
            }
            catch (e) {
                Log.Error(e)
            }
        });
    }

    Main();
  }
  
  addScriptHook(W3TS_HOOK.MAIN_AFTER, tsMain);