import { Entity } from "app/entity-type";
import { Hooks } from "lib/Hooks";
import { Log } from "lib/serilog/serilog";
import { EventEntity } from "app/events/event-entity";
import { EVENT_TYPE } from "app/events/event-enum";
import { ZONE_TYPE, ZONE_TYPE_TO_ZONE_NAME } from "app/world/zone-id";
import { Timers } from "app/timer-type";
import { Quick } from "lib/Quick";
import { SoundRef } from "app/types/sound-ref";
import { PlayNewSound } from "lib/translators";
import { COL_ORANGE, COL_ATTATCH } from "resources/colours";
import { Unit } from "w3ts/index";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { SHIP_MAIN_ASKELLON } from "resources/unit-ids";

/**
 * An interface that holds information about askellon
 * Should have NO External deps
 */
export class AskellonEntity extends Entity {

    private static instance: AskellonEntity;

    public static getInstance() {        
        if (this.instance == null) {
            this.instance = new AskellonEntity();
            Hooks.set(this.name, this.instance);
        }
        return this.instance;
    }

    _timerDelay = 0.1;
    step() {
        if (this.currentPower > this.maxPower) {
            this.currentPower = this.maxPower;
        }
        else {
            this.currentPower += this.powerRegeneration * this._timerDelay;
        }
        this.askellonUnit.mana = this.currentPower;
        this.askellonUnit.maxMana = this.maxPower;
    }

    // Starts at 100 max power
    public maxPower = 100;
    // How much power we regenerate each second
    public powerRegeneration = 0.2;
    // Our current power
    public currentPower = 0;

    public mineralsDelivered = 0;

    public reactorWarningSound = new SoundRef("Sounds\\ReactorWarning.mp3", false, true);

    public askellonUnit: Unit;

    constructor() {
        super();

        const spaceX = GetRectCenterX(gg_rct_Space);
        const spaceY = GetRectCenterY(gg_rct_Space);
        // Unit.fromHandle(CreateUnit(PlayerStateFactory.NeutralPassive.handle, SHIP_MAIN_ASKELLON, spaceX, spaceY, 45));
        this.askellonUnit = Unit.fromHandle(CreateUnit(PlayerStateFactory.NeutralPassive.handle, SHIP_MAIN_ASKELLON, spaceX, spaceY, 45));
        this.askellonUnit.setTimeScale(0.1);
    }

    /**
     * Static API
     */
    public static getCurrentPower() {
        return this.getInstance().currentPower;
    }
    public static getMaxPower() {
        return this.getInstance().maxPower;
    }
    public static getPowerGeneration() {
        return this.getInstance().powerRegeneration;
    }
    public static getPowerPercent() {
        return this.getInstance().currentPower / this.getInstance().maxPower;
    }

    public static poweredFloors = [ZONE_TYPE.ARMORY, ZONE_TYPE.REACTOR, ZONE_TYPE.CARGO_A, ZONE_TYPE.CARGO_B, ZONE_TYPE.BIOLOGY, ZONE_TYPE.BRIDGE, ZONE_TYPE.CHURCH]
   
    /**
     * Returns false is a power spike happens
     * @param someVal 
     */
    public static addToPower(someVal): boolean {
        this.getInstance().currentPower += someVal; 

        // If we are losing power..
        // if (someVal < 0) {
        //     // Log.Information("Losing power!");
        //     const power = this.getCurrentPower();
        //     const powerPercent = this.getPowerPercent();
        //     // Random chance we lose power
        //     const lostPower = GetRandomReal(power, 70+(30*powerPercent)) <= 50;
        //     if (lostPower) {
        //         if (powerPercent < 10) this.causePowerSurge(3);
        //         else if (powerPercent < 20) this.causePowerSurge(2);
        //         else if (powerPercent < 30) this.causePowerSurge(3);
        //         else this.causePowerSurge(0);
                
        //         return false;
        //     }
        // }
        return true;
    }

    public static causePowerSurge(severity: number = 1) {
        try {
            this.getInstance().reactorWarningSound.setVolume(80);
            this.getInstance().reactorWarningSound.playSound();

            PlayNewSound("Sounds\\ComplexBeep.mp3", 127);
            DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 10, `[${COL_ATTATCH}DANGER|r] REACTOR POWER LEVELS UNSTABLE`);

            let howManyFloors = severity  === 3 ? this.poweredFloors.length 
                : (severity  === 2 ? GetRandomInt(MathRound(this.poweredFloors.length / 2), this.poweredFloors.length) 
                : (severity  === 1 ? GetRandomInt(1, MathRound(this.poweredFloors.length / 2))
                : 1)); 

            Quick.GetRandomFromArray(this.poweredFloors, howManyFloors).forEach(floor => {
                let howLong = GetRandomReal(40+60*(severity/3), 60+120*(severity/3)); 
                DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 10, `[${COL_ATTATCH}DANGER|r] Power Surge Detected :: ${ZONE_TYPE_TO_ZONE_NAME.get(floor)}`);
                EventEntity.send(EVENT_TYPE.STATION_POWER_OUT, { source: null, data: { zone: floor, duration: howLong }})
            });
        }
        catch(e) {
            Log.Information(e);
        }

    }
}