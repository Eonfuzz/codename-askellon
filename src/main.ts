/** @noSelfInFile **/
import { Game } from "./app/game";
import * as TRANSLATORS from './lib/translators';
import { Trigger } from "./app/types/jass-overrides/trigger";
import { StringSink } from "./lib/serilog/string-sink";
import { Log, LogLevel } from "./lib/serilog/serilog";
import { addScriptHook } from "../node_modules/w3ts/src/hooks/index";

function tsMain() {

    Log.Init([
        new StringSink(LogLevel.Debug, TRANSLATORS.SendMessageUnlogged),
    ]);

    function Main(){
        const AksellonSector = new Game();

        const gameStartTimer = new Trigger();
        gameStartTimer.RegisterTimerEventSingle(0.1);
        gameStartTimer.AddAction(() => AksellonSector.startGame());
    }

    Main();
  }
  
  addScriptHook("main::after", tsMain);