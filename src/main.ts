/** @noSelfInFile **/
import { Game } from "./app/game";
import { addScriptHook, W3TS_HOOK } from "w3ts/hooks";
import { Timer } from "w3ts/handles/timer";
import { Trigger, Unit, MapPlayer } from "w3ts";
import { StringSink } from "lib/serilog/string-sink";
import { Log, LogLevel } from "lib/serilog/serilog";
import { SendMessageUnlogged } from "lib/translators";

function tsMain() {
    Log.Init([
        new StringSink(LogLevel.Debug, SendMessageUnlogged),
    ]);

    function Main(){
        const AksellonSector = new Game();

        // Fuck sake, apparently periodical events are broken
        // FIXME LATER YO
        const timer = new Timer();
        timer.start(0.1, false, () => {
            try {
                AksellonSector.startGame()
            }
            catch (e) {
                Log.Error(e)
            }
        });
    }

    Main();
  }
  
  addScriptHook(W3TS_HOOK.MAIN_AFTER, tsMain);