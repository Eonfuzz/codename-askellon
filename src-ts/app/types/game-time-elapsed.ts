import { Trigger } from './jass-overrides/trigger';
import { TimedEvent } from './timed-event';
import { Game } from '../game';
import { Util } from '../../lib/translators';

export class GameTimeElapsed {
    
    private everyTenSeconds: number = 0;
    private globalTimer: timer;

    constructor() {
        // Set global timer
        this.globalTimer = CreateTimer();
        TimerStart(this.globalTimer, 10000, false, () => this.incrementTimer());
    }

    private incrementTimer() {
        this.everyTenSeconds += 1;
        TimerStart(this.globalTimer, 10000, false,  () => this.incrementTimer());
    }

    public getTimeElapsed() {
        return this.everyTenSeconds * 10 + TimerGetElapsed(this.globalTimer);
    }
}