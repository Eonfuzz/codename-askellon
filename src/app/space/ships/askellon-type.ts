import { Unit, Effect, Trigger } from "w3ts/index";
import { Game } from "app/game";
import { SpaceMovementEngine } from "../ship-movement-engine";
import { Log } from "lib/serilog/serilog";
import { vectorFromUnit, Vector2 } from "app/types/vector2";
import { UNIT_IS_FLY } from "resources/ability-ids";
import { ZONE_TYPE } from "app/world/zone-id";
import { ROLE_TYPES } from "resources/crewmember-names";
import { Ship, ShipWithFuel } from "./ship-type";
import { Zone } from "app/world/zone-type";
import { ShipState } from "./ship-state-type";

export class AskellonShip extends Ship {

    private unitControllingDeath: Trigger;
    private controllerOldZone: Zone;

    /**
     * Automatically creates a new unit, adds it to bay if possible
     */
    constructor(game: Game, state: ShipState, u: Unit) {
        super(game, state, u);
    }

    createEngine() {
        if (!this.engine) {
            this.engine = new SpaceMovementEngine(
                this.unit.x, 
                this.unit.y, 
                vectorFromUnit(this.unit.handle).applyPolarOffset(this.unit.facing, 30)
            );
            this.engine.mass = 800;
            this.engine.velocityForwardMax = 1400;
        }
        else {
            Log.Warning("Perseus asked to create vector engine but already exists");
        }
    }

    onEnterShip(game: Game, who: Unit) {

        if (this.inShip.length === 0) {
            const newOwner = who.owner;
            this.unit.owner = who.owner;
    
            // If we have the entering unit was selected, select the ship too
            SelectUnitForPlayerSingle(this.unit.handle, newOwner.handle);

            // Hide entering unit
            this.inShip.push(who);
            who.pauseEx(true);
            this.unit.paused = false;

            this.unitControllingDeath = new Trigger();
            this.unitControllingDeath.registerUnitEvent(who, EVENT_UNIT_DEATH);
            this.unitControllingDeath.addAction(() => this.onLeaveShip(game, false));

            // Also "transport" the unit into space
            this.controllerOldZone = game.worldModule.getUnitZone(who);
            game.worldModule.travel(who, ZONE_TYPE.SPACE);
        }
        else {
            Log.Warning("Unit is already piloting the Askellon");
        }
    }

    onEnterSpace() {
        // Shouldn't need to do anything
    }

    onLeaveSpace() {
        // Shouldn't need to do anything
    }

    onDeath(game: Game, killer: Unit) {
        Log.Information("Main ship dead, not yet implemented soz");
    }

    public onMoveOrder(targetLoc: Vector2) {
        // Log.Information("Move order!");
        if (this.engine) {
            this.engine.setGoal(targetLoc);
            this.engine.increaseVelocity();
        }
        else {
            Log.Error("Ship is receiving orders while not piloted WTF");
        }
    }

    onLeaveShip(game: Game, isDeath?: boolean) {
        const newOwner = game.forceModule.neutralHostile;
        this.unit.owner = newOwner;

        // Remove control
        // Move unit back to its old word
        const u = this.inShip[0];
        game.worldModule.travel(u, this.controllerOldZone.id);

        // Center the camera back on the unit
        // Select unit too
        u.pauseEx(false);
        SelectUnitForPlayerSingle(u.handle, u.owner.handle);
        PanCameraToTimedForPlayer(u.owner.handle, u.x, u.y, 0);

        u.issueImmediateOrder("stop");

        this.unit.paused = true;

        this.inShip = [];
    }
}