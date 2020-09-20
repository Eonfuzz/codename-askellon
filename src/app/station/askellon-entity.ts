import { Entity } from "app/entity-type";
import { Hooks } from "lib/Hooks";
import { Log } from "lib/serilog/serilog";

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
    }

    // Starts at 100 max power
    public maxPower = 100;
    // How much power we regenerate each second
    public powerRegeneration = 0.2;
    // Our current power
    public currentPower = 0;

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
    public static addToPower(someVal) {
        this.getInstance().currentPower += someVal; 
    }
}