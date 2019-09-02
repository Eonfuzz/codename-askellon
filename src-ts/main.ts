/** @noSelfInFile **/
import { Game } from "./app/game";
import * as TRANSLATORS from './lib/translators';
import { Trigger } from "./app/types/jass-overrides/trigger";
import { StringSink } from "./lib/serilog/string-sink";
import { Log, LogLevel } from "./lib/serilog/serilog";

ceres.addHook("main::after", () => {
    // require('lib/lua-modules/timer-utils'); // Non leaking timers
    // require('lib/lua-modules/fast-triggers'); // 16x faster triggers
    
    Log.Init([
        new StringSink(LogLevel.Debug, TRANSLATORS.SendMessageUnlogged),
                 // new PreloadSink(LogLevel.Message, `WCMAUL\\${os.time()}.txt`),
    ]);

    function Main(){
        const AksellonSector = new Game();
    }

    xpcall(() => {
        const init: Trigger = new Trigger();
        init.RegisterTimerEvent(0.00, false);
        init.AddAction(() => Main());
    },     (err) => {
        print(err)
    });
});
