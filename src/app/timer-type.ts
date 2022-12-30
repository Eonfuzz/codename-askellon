import { Log } from "lib/serilog/serilog";
import { Hooks } from "lib/Hooks";

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
    private readonly fastTimer: trigger;

    private timedActionCallbacks: {time: number, action: Function}[] = [];

    
    private readonly slowTimer: trigger;
    private slowTimedActionCallbacks: {time: number, action: Function}[] = [];

    private constructor() {
        this.fastTimer = CreateTrigger();
        TriggerRegisterTimerEvent(this.fastTimer, 0.01, true);
        TriggerAddAction(this.fastTimer, () => {
            this.fastTimerCallbacks.forEach((callback) => {
                try {
                    callback();
                }
                catch (e) {
                    Log.Error(e);
                }
            });
            
            let i = 0;
            while (i < this.timedActionCallbacks.length) {
               this.timedActionCallbacks[i].time -= 0.01;
               if (this.timedActionCallbacks[i].time <= 0) {
                   try {
                        this.timedActionCallbacks[i].action();
                        this.timedActionCallbacks[i] = this.timedActionCallbacks[this.timedActionCallbacks.length - 1];
                        delete this.timedActionCallbacks[this.timedActionCallbacks.length - 1];
                    }
                    catch (e) {
                        Log.Error(`FastTimer ${e}`);
                        delete this.timedActionCallbacks[this.timedActionCallbacks.length - 1];
                    }
               } 
               else {
                   i++;
               }
            }
        });
        this.slowTimer = CreateTrigger();
        TriggerRegisterTimerEvent(this.slowTimer, 1, true);
        TriggerAddAction(this.slowTimer, () => {
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

    public static addTimedAction(time: number, action: Function) {
        return Timers.getInstance().timedActionCallbacks.push({ time, action });
    }

    public static async awaitTime(time: number) {
        return new Promise<void>(resolve => {
            Timers.getInstance().timedActionCallbacks.push({ time, action: () => resolve() })
        });
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