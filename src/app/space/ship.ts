import { ShipBay } from "./ship-bay";
import { Unit } from "w3ts/index";
import { SHIP_VOYAGER_UNIT } from "resources/unit-ids";
import { Game } from "app/game";
import { SpaceMovementEngine } from "./ship-movement-engine";
import { Log } from "lib/serilog/serilog";

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
    public maxFuel: number = 100;

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
        this.unit.maxMana = this.maxFuel;
        this.unit.paused = true;
    }

    process(game: Game, deltaTime: number) {
        if (this.state === ShipState.inSpace) {
            this.engine.updateThrust(this.unit.facing, deltaTime)
                .applyThrust(deltaTime)
                .updatePosition(deltaTime);

            // TODO
            const getFuelCost = this.engine.getMomentum();
            // Set pos
            const enginePos = this.engine.getPosition();
            this.unit.x = enginePos.x;
            this.unit.y = enginePos.y;

            // We also force player cam to the ship
            const p = this.unit.owner;
            PanCameraToTimedForPlayer(p.handle, this.unit.x, this.unit.y, 0);
        }
        // Otherwise update fuel
        else if (this.state = ShipState.inBay) {
            this.shipFuel = Math.min(this.shipFuel + 5 * deltaTime, 100);
        }
        this.unit.mana = this.shipFuel;
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

    onEnterSpace() {
        this.state = ShipState.inSpace;
        this.engine = new SpaceMovementEngine(this.unit.x, this.unit.y);

        this.unit.setflyHeight(0, 0);
        this.unit.paused = false;
        this.unit.selectionScale = 0.5;
        this.unit.setScale(0.5, 0.5, 0.5);
    }
}