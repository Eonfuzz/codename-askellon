import { ShipBay } from "../ship-bay";
import { Trigger, Timer } from "w3ts/index";
import { Log } from "lib/serilog/serilog";
import { Ship } from "../ships/ship-type";
import { SoundRef } from "app/types/sound-ref";
import { SFX_WINDWAVE } from "resources/sfx-paths";
import { Vector2 } from "app/types/vector2";
import { terrainIsPathable, getDistanceBetweenTwoPoints } from "lib/utils";
import { ProjectileMoverParabolic } from "app/weapons/projectile/projectile-target";
import { Vector3 } from "app/types/vector3";
import { PlayNewSoundOnUnit } from "lib/translators";
import { UNIT_IS_FLY } from "resources/ability-ids";
import { Timers } from "app/timer-type";

export abstract class ShipAnimation {
    protected totalTime: number = 0;
    protected ship: Ship;
    protected dock: ShipBay;
    protected animationTimer: Timer;

    public onDoneCallbacks: (() => void)[] = [];

    constructor(ship: Ship, dock: ShipBay) {
        this.ship = ship;
        this.dock = dock;

        this.animationTimer = new Timer();
        this.animationTimer.start(0.02, true, () =>  !this.process(0.02) && this.destroy());
        UnitAddAbility(ship.unit.handle, UNIT_IS_FLY);
    }

    abstract process(delta: number): boolean;

    public destroy(skipCallbacks?: boolean) {
        try {
            if (!skipCallbacks) {
                this.onDoneCallbacks.forEach(cb => cb());
            }
            UnitRemoveAbility(this.ship.unit.handle, UNIT_IS_FLY);
            this.onDoneCallbacks = undefined;
            this.ship = undefined;
            this.dock = undefined;
            if (this.animationTimer) {
                this.animationTimer.destroy();
                this.animationTimer = undefined;
            }
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

    private timeCounterForDustWave = 0;

    private movementVector = new Vector2(0, -600);
    private beganLift = false;
    private beganFlyHigher = false;

    private sound: SoundRef = new SoundRef("Sounds\\EngineFadeInSound1.mp3", false);

    public process(delta: number) {
        this.totalTime += delta;

        /**
         * We're doing the first phase of animations
         */
        if (this.totalTime == delta && !this.beganLift) {
            this.ship.unit.setTimeScale(1);
            this.sound.playSoundOnUnit(this.ship.unit.handle, 50);
        }

        if (this.totalTime >= 0.5 && !this.beganLift) {
            this.beganLift = true;
            // Set unit fly height
            this.ship.unit.setflyHeight(180, 20);
        }

        this.timeCounterForDustWave += delta;
        if (this.totalTime <= 10 && this.timeCounterForDustWave >= 0.05) {
            this.timeCounterForDustWave = 0;
            if (terrainIsPathable(this.ship.unit.x, this.ship.unit.y)) {
                let sfx = AddSpecialEffect(SFX_WINDWAVE, this.ship.unit.x, this.ship.unit.y);
                BlzSetSpecialEffectAlpha(sfx, 10);
                BlzSetSpecialEffectScale(sfx, 2 - this.totalTime/6);
                BlzSetSpecialEffectTimeScale(sfx, 0.8);
                BlzSetSpecialEffectTime(sfx, 0.2);
                BlzSetSpecialEffectYaw(sfx, GetRandomInt(0, 360));
                DestroyEffect(sfx);
            }
        }

        if (this.totalTime >= 4.5 && this.totalTime < 10) {
            SetUnitAnimationByIndex(this.ship.unit.handle, 4);
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
        
        if (this.totalTime > 10) {
            this.sound.stopSound(true);
            return false;
        }

        PanCameraToTimedForPlayer(this.ship.unit.owner.handle, this.ship.unit.x, this.ship.unit.y, 0);
        return true;
    };
}

export class ShipAnimationEnterStationDock extends ShipAnimation {

    private shipshipLandSound = new SoundRef("Sounds\\Ships\\ShipLand.mp3", false);

    private timeCounterForDustWave = 0;

    private offsetVector = new Vector2(0, 0);
    private mover: ProjectileMoverParabolic;

    constructor(ship: Ship, dock: ShipBay) {
        super(ship, dock);

        const height = dock.RECT.maxY - dock.RECT.minY;
        const width = dock.RECT.maxX - dock.RECT.minX;

        let projectedX = dock.RECT.centerX + width * 2;
        const projectedY = dock.RECT.centerY - height * 5;


        let isRight = GetRandomInt(0, 1) === 1 || !terrainIsPathable(dock.RECT.centerX - width * 2, projectedY);


        // If we are not pathable reverse the projected vals pathable
        if (!isRight) {
            projectedX = dock.RECT.centerX - width * 2;
        }

        this.offsetVector.x = projectedX;
        this.offsetVector.y = projectedY;

        this.ship.unit.setTimeScale(1);
        this.ship.unit.x = this.offsetVector.x;
        this.ship.unit.y = this.offsetVector.y;
        this.ship.unit.setflyHeight(180, 120);
        BlzSetUnitFacingEx(this.ship.unit.handle, 90);
        SetUnitAnimationByIndex(this.ship.unit.handle, 4);

        Timers.addTimedAction(1.90, () => {
            this.shipshipLandSound.playSoundOnUnit(this.ship.unit.handle, 30);
        });

        // huh, we could use the parabolic mover here
        // Flip the axis
        // y = z
        // x = x
        // z = y
        this.mover = new ProjectileMoverParabolic(
            new Vector3(
                this.ship.unit.x,
                0,
                dock.RECT.centerY
            ),
            new Vector3(
                dock.RECT.centerX,
                0,
                dock.RECT.centerY
            ),
            83 * bj_DEGTORAD,
        );
    }

    public process(delta: number) {
        this.totalTime += delta;

        this.moveShip(delta);

        PanCameraToTimedForPlayer(this.ship.unit.owner.handle, this.ship.unit.x, this.ship.unit.y, 0);

        this.timeCounterForDustWave += delta;
        if (this.totalTime <= 10 && this.timeCounterForDustWave >= 0.05) {
            this.timeCounterForDustWave = 0;
            if (terrainIsPathable(this.ship.unit.x, this.ship.unit.y)) {
                let sfx = AddSpecialEffect(SFX_WINDWAVE, this.ship.unit.x, this.ship.unit.y);
                BlzSetSpecialEffectAlpha(sfx, 10);
                BlzSetSpecialEffectScale(sfx, this.totalTime/4);
                BlzSetSpecialEffectTimeScale(sfx, 0.8);
                BlzSetSpecialEffectTime(sfx, 0.2);
                BlzSetSpecialEffectYaw(sfx, GetRandomInt(0, 360));
                DestroyEffect(sfx);
            }
        }
        
        const totalD = getDistanceBetweenTwoPoints(this.ship.unit.x, this.ship.unit.y, this.dock.RECT.centerX, this.dock.RECT.centerY);
        return totalD >= 15
    }

    private moveShip(delta: number) {
        // Cubic formula time
        // Translate points into local scale,

        if (this.ship.unit.y >= (this.dock.RECT.centerY)) {
            const oldX = this.ship.unit.x;
            const oldY = this.ship.unit.y;

            const totalD = getDistanceBetweenTwoPoints(this.ship.unit.x, this.ship.unit.y, this.dock.RECT.centerX, this.dock.RECT.centerY);
        
            let simulatedDelta = delta/2;
            // If we are approaching the center point we need to slow down even further
            if (totalD <= 300) {
                simulatedDelta = simulatedDelta * Math.max(totalD/300, 0.2)
                this.ship.unit.setflyHeight(100, 20);
            }
            const nPos = this.mover.move(undefined, simulatedDelta );
    
            // Log.Information(`Delta: ${nPos.toString()}`)
            this.ship.unit.x += nPos.x;
            this.ship.unit.y += nPos.z;
    
            const facingAngle = Rad2Deg(Atan2(oldY-this.ship.unit.y, oldX-this.ship.unit.x));
            this.ship.unit.facing = facingAngle + 180;
        }
        else {
            this.ship.unit.y += 600 * delta;
        }
    }
}