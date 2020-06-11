/** @noSelfInFile **/
import { Game } from "./app/game";
import { addScriptHook, W3TS_HOOK } from "w3ts/hooks";
import { Timer } from "w3ts/handles/timer";
import { StringSink } from "lib/serilog/string-sink";
import { Log, LogLevel } from "lib/serilog/serilog";
import { SendMessageUnlogged } from "lib/translators";


let AksellonSector = undefined;
let gameStart = undefined;

function tsMain() {
    Log.Init([
        new StringSink(LogLevel.Debug, SendMessageUnlogged),
    ]);

    function Main(){
        AksellonSector = new Game();
        gameStart = new Timer();
        // Fuck sake, apparently periodical events are broken
        // FIXME LATER YO
        gameStart.start(0.1, false, () => {
            try {
                AksellonSector.startGame()
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