import { Trigger } from './jass-overrides/trigger';
import { TimedEvent } from './timed-event';
import { Game } from '../game';
import { Util } from '../../lib/translators';

export class TimedEventQueue {
    private ticker: Trigger;
    private tick: number = 0;
    private maxTick: number = 100000;
    private events: Map<string, TimedEvent> = new Map<string, TimedEvent>();
    private game: Game;

    private tickRate = 0.05;

    constructor(game: Game) {
        this.ticker = new Trigger();
        this.ticker.RegisterTimerEventPeriodic(this.tickRate);
        this.ticker.AddAction(() => {
            this.tick = (this.tick + 1) % this.maxTick;
            this.HandleTick();
        });
        this.game = game;
    }

    private HandleTick(): void {
        this.events.forEach(((event: TimedEvent, key: string) => {
            if (event.AttemptAction(this.tick, this)) {
                this.events.delete(key);
            }
        }));
    }

    public AddEvent(event: TimedEvent): void {
        event.setTickRate(1000 * this.tickRate);
        this.events.set(Util.RandomHash(10), event);
    }

    public GetGame(): Game {
        return this.game;
    }
}