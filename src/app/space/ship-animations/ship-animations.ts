import { Ship } from "../ship";
import { ShipBay } from "../ship-bay";
import { Trigger } from "w3ts/index";
import { Log } from "lib/serilog/serilog";

export abstract class ShipAnimation {
    protected totalTime: number = 0;
    protected ship: Ship;
    protected dock: ShipBay;
    protected animationTrigger: Trigger;

    public onDoneCallbacks: (() => void)[];

    constructor(ship, dock) {
        this.ship = ship;
        this.dock = dock;

        this.animationTrigger = new Trigger();
        this.animationTrigger.registerTimerEvent(0.1, true);
        this.animationTrigger.addAction(() => !this.process(0.1) && this.destroy());
    }

    abstract process(delta: number): boolean;

    public destroy() {
        this.onDoneCallbacks.forEach(cb => cb());
        this.onDoneCallbacks = undefined;

        this.ship = undefined;
        this.dock = undefined;
        this.animationTrigger.destroy();
        this.animationTrigger = undefined;
    }

    public onDoneCallback(callback: () => void) {
        this.onDoneCallbacks.push(callback);
    }
}


export class ShipAnimationExitStationDock extends ShipAnimation {

    public process(delta: number) {
        this.totalTime += delta;
        
        Log.Information("Processing animation "+this.totalTime);
        return true;
    };
}