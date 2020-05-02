import { ShipBay } from "../ship-bay";
import { Trigger } from "w3ts/index";
import { Log } from "lib/serilog/serilog";
import { Ship } from "../ship";
import { SoundRef } from "app/types/sound-ref";
import { SFX_WINDWAVE } from "resources/sfx-paths";
import { Vector2 } from "app/types/vector2";

export abstract class ShipAnimation {
    protected totalTime: number = 0;
    protected ship: Ship;
    protected dock: ShipBay;
    protected animationTrigger: Trigger;

    public onDoneCallbacks: (() => void)[] = [];

    constructor(ship, dock) {
        this.ship = ship;
        this.dock = dock;

        this.animationTrigger = new Trigger();
        this.animationTrigger.registerTimerEvent(0.02, true);
        this.animationTrigger.addAction(() => !this.process(0.02) && this.destroy());
    }

    abstract process(delta: number): boolean;

    public destroy() {
        try {
            this.onDoneCallbacks.forEach(cb => cb());
            this.onDoneCallbacks = undefined;

            this.ship = undefined;
            this.dock = undefined;
            this.animationTrigger.destroy();
            this.animationTrigger = undefined;
        }
        catch (e) {
            Log.Error(e);
        }
    }

    public onDoneCallback(callback: () => void) {
        this.onDoneCallbacks.push(callback);
    }
}


export class ShipAnimationExitStationDock extends ShipAnimation {

    private shipFlySound = new SoundRef("Sounds\\EngineFadeInSound1.mp3", false);

    private timeCounterForDustWave = 0;

    private movementVector = new Vector2(0, -600);
    private beganLift = false;
    private beganFlyHigher = false;

    public process(delta: number) {
        this.totalTime += delta;

        /**
         * We're doing the first phase of animations
         */
        if (this.totalTime == delta && !this.beganLift) {
            this.ship.unit.setTimeScale(1);
            this.shipFlySound.playSoundOnUnit(this.ship.unit.handle, 127);
        }

        if (this.totalTime >= 0.5 && !this.beganLift) {
            this.beganLift = true;
            // Set unit fly height
            this.ship.unit.setflyHeight(180, 20);
        }

        this.timeCounterForDustWave += delta;
        if (this.totalTime <= 10 && this.timeCounterForDustWave >= 0.1) {
            this.timeCounterForDustWave = 0;
            let sfx = AddSpecialEffect(SFX_WINDWAVE, this.ship.unit.x, this.ship.unit.y);
            BlzSetSpecialEffectAlpha(sfx, 10);
            BlzSetSpecialEffectScale(sfx, 2 - this.totalTime/6);
            BlzSetSpecialEffectTimeScale(sfx, 0.8);
            BlzSetSpecialEffectTime(sfx, 0.2);
            BlzSetSpecialEffectYaw(sfx, GetRandomInt(0, 360));
            DestroyEffect(sfx);
        }

        if (this.totalTime >= 4.5 && this.totalTime < 10) {
            const vec = this.movementVector
                .multiplyN(delta)
                .multiplyN(Math.min((this.totalTime - 5) / 3, 1));

            this.ship.unit.x += vec.x;
            this.ship.unit.y += vec.y;
        }

        if (this.totalTime >= 6 && !this.beganFlyHigher) {
            this.beganFlyHigher = true;
            this.ship.unit.setflyHeight(800, 120);
        }
        
        if (this.totalTime > 12) {
            this.shipFlySound.stopSound();
            return false;
        }
        return true;
    };
}

export class ShipAnimationEnterStationDock extends ShipAnimation {

    private shipFlySound = new SoundRef("Sounds\\EngineFadeInSound1.mp3", false);

    public process(delta: number) {
        this.totalTime += delta;

        /**
         * We're doing the first phase of animations
         */
        if (this.totalTime == delta) {
            this.ship.unit.setTimeScale(1);
            this.shipFlySound.playSoundOnUnit(this.ship.unit.handle, 127);
        }
        
        return true;
    };
}