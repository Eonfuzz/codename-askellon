import { Log } from "lib/serilog/serilog";
import { Hooks } from "lib/Hooks";
import { Trigger } from "w3ts";
import { Quick } from "lib/Quick";

/**
 * Provides timers for other classes,
 * Now, these timers generally is used by Entity, and i recommend extending Entity instead of adding callbacks here.
 * Once added, removing the callbacks can be quite the pain, only use it for static, always there callbacks.
 * Otherwise use Entity.
 */
export class Timers {
    private static instance: Timers;

    public static getInstance() {
        if (this.instance == null) {
            this.instance = new Timers();
            Hooks.set(this.name, this.instance);
        }
        return this.instance;
    }

    private fastTimerCallbacks: Function[] = [];
    private readonly fastTimer: Trigger;

    private timedActionCallbacks: {time: number, action: Function, name?: string}[] = [];

    
    private readonly slowTimer: Trigger;
    private slowTimedActionCallbacks: {time: number, action: Function, name?: string}[] = [];

    private constructor() {
        this.fastTimer = new Trigger();
        this.fastTimer.registerTimerEvent(0.01, true);
        this.fastTimer.addAction(() => {
            // Iterate our core modules first
            for (let index = 0; index < this.fastTimerCallbacks.length; index++) {
                const callback = this.fastTimerCallbacks[index];
                try {
                    callback();
                }
                catch (e) {
                    DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 10, `err: ${e}`);
                    DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 10, debug.traceback());
                }
            }

            // Iterate timed callbacks
            for (let index = 0; index < this.timedActionCallbacks.length; index++) {
                const item = this.timedActionCallbacks[index];
                item.time -= 0.01;

                if (item.time <= 0) {
                    try {
                        item.action();
                    }
                    catch (e) {
                        DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 10, `err: ${e}`);
                        DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 10, debug.traceback());
                    }
                    Quick.Slice(this.timedActionCallbacks, index--);
                }  
            }
        });

        this.slowTimer = new Trigger();
        this.slowTimer.registerTimerEvent(1, true);
        this.slowTimer.addAction(() => {
            let i = 0;
            while (i < this.slowTimedActionCallbacks.length) {
               this.slowTimedActionCallbacks[i].time -= 1;
               if (this.slowTimedActionCallbacks[i].time <= 0) {
                    try {
                        this.slowTimedActionCallbacks[i].action();
                        this.slowTimedActionCallbacks[i] = this.slowTimedActionCallbacks[this.slowTimedActionCallbacks.length - 1];
                        delete this.slowTimedActionCallbacks[this.slowTimedActionCallbacks.length - 1];
                    }
                    catch (e) {
                        Log.Error(`SlowTimer ${e}`);
                        delete this.slowTimedActionCallbacks[this.slowTimedActionCallbacks.length - 1];
                    }
               } 
               else {
                   i++;
               }
            }
        });
    }

    public addFastTimerCallback(func: Function) {
        this.fastTimerCallbacks.push(func);
    }

    /*
    STATIC API
     */
    public static addFastTimerCallback(func: Function) {
        return Timers.getInstance().addFastTimerCallback(func);
    }

    public static addTimedAction(time: number, action: Function, name?: string) {
        return Timers.getInstance().timedActionCallbacks.push({ time, action, name });
    }

    public static async wait(time: number, debugName?: string) {
        // if (debugName) DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 10, debugName+": added");
        return await new Promise<void>(r => this.addTimedAction(time, () => {
            // if (debugName) DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 10, debugName+": resolving");
            r();
            // if (debugName) DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 10, debugName+": resolved");
        }, debugName));
    }

    /**
     * This increments by the seconds
     * Use for long lasting effects or counters
     * @param time 
     * @param action 
     */
    public static addSlowTimedAction(time: number, action: Function) {
        return Timers.getInstance().slowTimedActionCallbacks.push({ time, action });
    }
}