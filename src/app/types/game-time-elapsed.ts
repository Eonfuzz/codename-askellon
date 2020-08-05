export class GameTimeElapsed {

    private static instance: GameTimeElapsed;
    public static getInstance() {        
        if (this.instance == null) {
            this.instance = new GameTimeElapsed();
        }
        return this.instance;
    }

    
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

    /**
     * STATIC API
     */
    public static getTime() {
        return GameTimeElapsed.getInstance().getTimeElapsed();
    }
}