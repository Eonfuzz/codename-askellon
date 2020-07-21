import { Unit, Effect } from "w3ts/index";
import { Game } from "app/game";
import { SpaceMovementEngine } from "../ship-movement-engine";
import { Log } from "lib/serilog/serilog";
import { vectorFromUnit, Vector2 } from "app/types/vector2";
import { UNIT_IS_FLY } from "resources/ability-ids";
import { ZONE_TYPE } from "app/world/zone-id";
import { ROLE_TYPES } from "resources/crewmember-names";
import { ShipState } from "./ship-state-type";

/**
 * This is the ship people ride yo
 */
export abstract class Ship {
    // Ship Unit
    public unit: Unit

    // Ship State
    public state: ShipState;

    // Ship engine
    public engine: SpaceMovementEngine;

    // Units in the ship
    public inShip: Unit[] = [];

    /**
     * Automatically creates a new unit, adds it to bay if possible
     */
    constructor(game: Game, state: ShipState, u: Unit) {
        this.state = state;
        this.unit = u;
        this.unit.paused = true;

        // Add and remove fly modifier to the unit
        this.unit.addAbility(UNIT_IS_FLY);
        this.unit.removeAbility(UNIT_IS_FLY);

        // Add engine if we are in space
        if (state === ShipState.inSpace) {
            this.createEngine();
        }
    }

    process(game: Game, deltaTime: number, minX: number, maxX: number, minY: number, maxY: number) {
        if (this.state === ShipState.inSpace) {
            this.engine.updateThrust(deltaTime)
                .applyThrust(deltaTime)
                .updatePosition(deltaTime, minX, maxX, minY, maxY);

            const facing = this.engine.getFacingAngle();
            BlzSetUnitFacingEx(this.unit.handle, facing);

            // Set pos
            const enginePos = this.engine.getPosition();
            this.unit.x = enginePos.x;
            this.unit.y = enginePos.y;

            // We also force player cam to the ship
            const p = this.unit.owner;
            PanCameraToTimedForPlayer(p.handle, this.unit.x, this.unit.y, 0);

            // Log.Information("Momemntum: "+this.engine.getMomentum().getLength());
        }
        // What to do each tick if we are in a bay??
        else if (this.state = ShipState.inBay) {
        }
    }

    public abstract createEngine();

    public abstract onEnterShip(game: Game, who: Unit);

    public abstract onEnterSpace();
    public abstract onLeaveSpace();

    public abstract onDeath(game: Game, killer: Unit);
    public abstract onMoveOrder(targetLoc: Vector2);
    public abstract onLeaveShip(game: Game, isDeath?: boolean);
}

export abstract class ShipWithFuel extends Ship {

    // Magic number for starting fuel. Upgrades to apply maybe?
    public shipFuel: number;
    public maxFuel: number;
    
    protected fuelUpdateTicker = 1;
    protected fuelUsagePercent = 1;
    
    /**
     * Automatically creates a new unit, adds it to bay if possible
     */
    constructor(game: Game, state: ShipState, u: Unit) {
        super(game, state, u);
    }

    public setFuelUsagePercent(newVal: number) {
        this.fuelUsagePercent = newVal;
    }

    public process(game: Game, deltaTime: number, minX: number, maxX: number, minY: number, maxY: number) {
        super.process(game, deltaTime, minX, maxX, minY, maxY);
        
        // Now update fuel costs if relevant
        this.fuelUpdateTicker += deltaTime;
        if (this.fuelUpdateTicker >= 1) {
            this.fuelUpdateTicker -= 1;
            this.updateFuel();
        }
    }

    /**
     * Update fuel and fuel loss / gain, is called every 1 second
     */
    private updateFuel() {
        if (this.state === ShipState.inSpace) {
            const momentumLen = this.engine.getMomentum().getLength();

            const fuelCost = (0.4 + momentumLen / 7000);
            this.shipFuel -= fuelCost * this.fuelUsagePercent;

            // Also update some sfx when we update fuel
            if (momentumLen >= 100) {
                // Set animation
                SetUnitAnimationByIndex(this.unit.handle, 4);
            }
            else {
                // Set animation
                SetUnitAnimationByIndex(this.unit.handle, 3);
            }

            // Additionally, if we are out of mana damage the ship...
            if (this.shipFuel <= 0) {
                this.unit.damageTarget(this.unit.handle, 
                    40, 0, 
                    false, false, 
                    ATTACK_TYPE_HERO, 
                    DAMAGE_TYPE_DIVINE, 
                    WEAPON_TYPE_WHOKNOWS
                );
            }
        }
        else if (this.state === ShipState.inBay) {
            this.shipFuel = this.shipFuel + 0.5;
        }

        // Make sure we can't be less than 0 or higher than max
        if (this.shipFuel < 0) {
            this.shipFuel = 0;
        }
        else if (this.shipFuel > this.maxFuel) {
            this.shipFuel = this.maxFuel;
        }
        // Now apply the fuel change
        this.unit.mana = this.shipFuel;
    }
}