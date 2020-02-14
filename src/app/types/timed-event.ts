import { TimedEventQueue } from './timed-event-queue';

export class TimedEvent {
    private time: number;
    private func: () => boolean;
    private safe: boolean;
    private endtime: number | undefined;
    // private created: number | undefined;

    /**
     * 
     * @param func 
     * @param time 
     * @param safe wait time in ms
     */
    constructor(func: () => boolean, time: number, safe: boolean = true) {
        this.safe = safe;
        this.time = time;
        this.func = () => func();
    }

    public setTickRate(msPerTick: number) {
        this.time = this.time / msPerTick;
    }

    public AttemptAction(currentTick: number, teq: TimedEventQueue): boolean {
        if (!this.endtime) {
            this.endtime = ((currentTick + this.time) % 100000) - 1;
            if (this.endtime < 0) {
                this.endtime = 0;
            }
        }
        if (this.endtime <= currentTick) {
            // if (this.safe) {
            //     teq.GetGame().safeEventQueue.AddMed(this.func);
            // } else {
            //     teq.GetGame().eventQueue.AddMed(this.func);
            // }
            this.func();
            return true;
        }
        return false;
    }

    public GetEndTick() {
        return this.endtime || 1;
    }

    // public SetCreatedTime(time: number) {
    //     this.created = time;
    // }

    // public GetCreatedTime() {
    //     return this.created;
    // }
}