import { ShipBay } from "./ship-bay";
import { Unit } from "w3ts/index";
import { SHIP_VOYAGER_UNIT } from "resources/unit-ids";
import { Game } from "app/game";
import { SpaceMovementEngine } from "./ship-movement-engine";

export enum ShipState {
    inBay, inSpace
}

/**
 * This is the ship people ride yo
 */
export class Ship {
    // Ship Unit
    public unit: Unit

    // Ship State
    public state: ShipState;
    // Magic number for starting fuel. Upgrades to apply maybe?
    public shipFuel: number = 100;

    // Ship engine
    public engine: SpaceMovementEngine;

    // Units in the ship
    private inShip: Unit[] = [];

    /**
     * Automatically creates a new unit, adds it to bay if possible
     */
    constructor(game: Game, state: ShipState) {
        this.state = state;
        const u = Unit.fromHandle(CreateUnit(game.forceModule.stationProperty.handle, SHIP_VOYAGER_UNIT, 0, 0, bj_UNIT_FACING));
        this.unit = u;
        this.unit.paused = true;
    }

    process(game: Game, deltaTime: number) {
        if (this.state = ShipState.inSpace) {
            this.engine.updateThrust(this.unit.facing, deltaTime)
                .applyThrust(deltaTime)
                .updatePosition(deltaTime);

            // TODO
            const getFuelCost = this.engine.getMomentum();
            // Set pos
            const enginePos = this.engine.getPosition();
            this.unit.x = enginePos.x;
            this.unit.y = enginePos.y;
        }
        // Otherwise update fuel
        else if (this.state = ShipState.inBay) {
            this.shipFuel = Math.min(this.shipFuel + 5 * deltaTime, 100);
        }
    }

    onEnterShip(who: Unit) {
        const newOwner = who.owner;
        this.unit.owner = who.owner;

        // If we have the entering unit was selected, select the ship too
        if (who.isSelected(newOwner)) {
            SelectUnitForPlayerSingle(this.unit.handle, newOwner.handle);
        }
        // Hide entering unit
        this.inShip.push(who);
        who.show = false;
    }
}