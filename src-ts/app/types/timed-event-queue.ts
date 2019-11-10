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

    /**
     * Retruns the event hash
     * @param event 
     */
    public AddEvent(event: TimedEvent): string {
        const hash = Util.RandomHash(10);
        event.setTickRate(1000 * this.tickRate);
        // event.SetCreatedTime(this.game.getTimeStamp());
        this.events.set(hash, event);
        return hash;
    }

    public RemoveEvent(eventHash: string): void {
        if (this.events.has(eventHash)) {
            this.events.delete(eventHash);
        }
    }

    public GetEvent(eventHash: string): TimedEvent | undefined {
        if (this.events.has(eventHash)) {
            return this.events.get(eventHash);
        }
    }

    public GetEventExpireTime(event: TimedEvent): number {
        return event.GetEndTick() * this.tickRate;
    }

    public GetGame(): Game {
        return this.game;
    }
}