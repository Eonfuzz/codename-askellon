import { Unit, Effect, Trigger } from "w3ts/index";
import { Game } from "app/game";
import { SpaceMovementEngine } from "../ship-movement-engine";
import { Log } from "lib/serilog/serilog";
import { vectorFromUnit, Vector2 } from "app/types/vector2";
import { ZONE_TYPE } from "app/world/zone-id";
import { Ship } from "./ship-type";
import { Zone } from "app/world/zone-types/zone-type";
import { ShipState } from "./ship-state-type";
import { WorldEntity } from "app/world/world-entity";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { Timers } from "app/timer-type";
import { HOLD_ORDER_ID } from "resources/ability-ids";

export class AskellonShip extends Ship {

    private unitControllingDeath: Trigger;
    private controllerOldZone: Zone;

    private updateIconEvery = 5;
    private iconTicker = 0;
    private minimapIcon: minimapicon;

    /**
     * Automatically creates a new unit, adds it to bay if possible
     */
    constructor(state: ShipState, u: Unit) {
        super(state, u);
        u.paused = false;
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
            this.engine.baseTurningArc = 3;
        }
        else {
            Log.Warning("Perseus asked to create vector engine but already exists");
        }
    }

    onEnterShip(who: Unit) {

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
            this.unitControllingDeath.addAction(() => this.onLeaveShip(false));

            // Also "transport" the unit into space
            this.controllerOldZone = WorldEntity.getInstance().getUnitZone(who);
            WorldEntity.getInstance().travel(who, ZONE_TYPE.SPACE);
        }
        else {
            Log.Warning("Unit is already piloting the Askellon");
        }
    }

    process(deltaTime: number, minX: number, maxX: number, minY: number, maxY: number) {
        super.process(deltaTime, minX, maxX, minY, maxY);

        this.iconTicker -= deltaTime;
        if (this.iconTicker <= 0) {
            this.iconTicker = this.updateIconEvery;
            // Redraw icon
            if (this.minimapIcon) {
                DestroyMinimapIcon(this.minimapIcon);
            }
            this.minimapIcon = CreateMinimapIconOnUnit(this.unit.handle, 255, 255, 255, "minimap-askellon.mdx", FOG_OF_WAR_FOGGED);
        }
        SetUnitAnimationByIndex(this.unit.handle, 4);
    }

    onEnterSpace() {
        // Shouldn't need to do anything
    }

    onLeaveSpace() {
        // Shouldn't need to do anything
    }

    onDeath(killer: Unit) {
        if (this.minimapIcon) {
            DestroyMinimapIcon(this.minimapIcon);
        }
        Log.Information("Main ship dead, not yet implemented soz");
    }

    public onMoveOrder(targetLoc: Vector2) {
        Log.Information("Move order!");
        if (this.engine && !this.ignoreCommands) {
            this.engine.setGoal(targetLoc);
            this.engine.increaseVelocity();

            this.ignoreCommands = true;
            Timers.addTimedAction(0, () => {
                this.unit.issueImmediateOrder(HOLD_ORDER_ID);
                Timers.addTimedAction(0, () => {
                    this.ignoreCommands = false;
                });
            });
        }
        else if (!this.engine) {
            Log.Error("Ship is receiving orders while not piloted WTF");
        }
    }
    
    onLeaveShip(isDeath?: boolean) {
        const newOwner = PlayerStateFactory.NeutralHostile;
        this.unit.owner = newOwner;

        // Remove control
        // Move unit back to its old word
        const u = this.inShip[0];
        WorldEntity.getInstance().travel(u, this.controllerOldZone.id);

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