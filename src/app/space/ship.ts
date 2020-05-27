import { ShipBay } from "./ship-bay";
import { Unit, Effect } from "w3ts/index";
import { SHIP_VOYAGER_UNIT } from "resources/unit-ids";
import { Game } from "app/game";
import { SpaceMovementEngine } from "./ship-movement-engine";
import { Log } from "lib/serilog/serilog";
import { vectorFromUnit, Vector2 } from "app/types/vector2";
import { UNIT_IS_FLY } from "resources/ability-ids";

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
    public inShip: Unit[] = [];

    /**
     * Automatically creates a new unit, adds it to bay if possible
     */
    constructor(game: Game, state: ShipState, u: Unit) {
        this.state = state;
        this.unit = u;
        this.unit.maxMana = this.maxFuel;
        this.unit.paused = true;

        // Add and remove fly modifier to the unit
        this.unit.addAbility(UNIT_IS_FLY);
        this.unit.removeAbility(UNIT_IS_FLY);

        // Add engine if we are in space
        if (state === ShipState.inSpace) {
            this.engine = new SpaceMovementEngine(this.unit.x, this.unit.y, vectorFromUnit(this.unit.handle).applyPolarOffset(this.unit.facing, 30));
        }
    }

    process(game: Game, deltaTime: number, minX: number, maxX: number, minY: number, maxY: number) {
        if (this.state === ShipState.inSpace) {
            this.engine.updateThrust(deltaTime)
                .applyThrust(deltaTime)
                .updatePosition(deltaTime, minX, maxX, minY, maxY);

            const facing = this.engine.getFacingAngle();
            BlzSetUnitFacingEx(this.unit.handle, facing);

            // TODO
            // const getFuelCost = this.engine.getMomentum();
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
            // this.shipFuel = Math.min(this.shipFuel + 5 * deltaTime, 100);
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
        this.engine = new SpaceMovementEngine(this.unit.x, this.unit.y, vectorFromUnit(this.unit.handle).applyPolarOffset(this.unit.facing, 30));

        this.unit.setflyHeight(0, 0);
        this.unit.paused = false;
        this.unit.selectionScale = 0.5;
        this.unit.setScale(0.5, 0.5, 0.5);
        this.unit.setPathing(false);
    }

    onLeaveSpace() {
        this.state = ShipState.inBay;
        this.engine.destroy();
        this.engine = undefined;

        this.unit.setflyHeight(800, 0);
        this.unit.paused = true;
        this.unit.selectionScale = 2.5;
        this.unit.setScale(1.5, 1.5, 1.5);
        this.unit.setPathing(true);
    }

    onLeaveShip(game: Game) {
        const newOwner = game.forceModule.stationProperty;
        this.unit.owner = newOwner;

        const shipPos = vectorFromUnit(this.unit.handle);

        this.inShip.forEach(u => {
            const rPos = shipPos.applyPolarOffset(GetRandomReal(0, 360), 350);
            u.x = rPos.x;
            u.y = rPos.y;
            u.show = true;
            u.paused = false;

            // If we have the entering unit was selected, select the ship too
            SelectUnitForPlayerSingle(u.handle, u.owner.handle);
        });
        
        this.inShip = [];
    }

    onMoveOrder(targetLoc: Vector2) {
        if (this.engine) {
            this.engine.setGoal(targetLoc);
            this.engine.increaseVelocity();
        }
        else {
            Log.Error("Ship is receiving orders while not piloted WTF");
        }
    }

    onDeath(game: Game, killer: Unit) {
        // first of all eject all our units
        const allUnits = this.inShip.slice();
        this.onLeaveShip(game);

        // Make killer damage them for 400 damage as they were inside the ship
        allUnits.forEach(u => {
            // If we're in space we need to destoy the unit's items so they don't stop
            if (ShipState.inSpace) {
                for (let index = 0; index < 6; index++) {
                    const item = u.getItemInSlot(index);
                    if (item) {
                        RemoveItem(item);
                    }
                }
            }
            killer.damageTarget(
                u.handle, 
                this.state === ShipState.inSpace ? 99999 : 400,
                undefined, 
                false, 
                false, 
                ATTACK_TYPE_SIEGE, 
                DAMAGE_TYPE_FIRE, 
                WEAPON_TYPE_WHOKNOWS
            )
        });

        // Kill the ship
        const cX = this.unit.x;
        const cY = this.unit.y;

        // Create explosive SFX!
        let sfx = new Effect("Objects\\Spawnmodels\\Other\\NeutralBuildingExplosion\\NeutralBuildingExplosion.mdl", cX, cY);
        sfx.scale = this.state === ShipState.inSpace ? 1 : 5;
        sfx.destroy();

        sfx = new Effect("Objects\\Spawnmodels\\Other\\NeutralBuildingExplosion\\NeutralBuildingExplosion.mdl", cX, cY);
        sfx.scale = this.state === ShipState.inSpace ? 0.5 : 1;
        sfx.destroy();

        sfx = new Effect("Objects\\Spawnmodels\\Other\\NeutralBuildingExplosion\\NeutralBuildingExplosion.mdl", cX, cY);
        sfx.scale = this.state === ShipState.inSpace ? 0.75 : 3;
        sfx.destroy();

        this.unit.destroy();

        // Now we get the ship to explode!
        // Deal another 400 damage
        killer.damageAt(
            0.2, 
            this.state === ShipState.inSpace ? 250 : 500, 
            cX, 
            cY, 
            400, 
            false, 
            false,
            ATTACK_TYPE_SIEGE, 
            DAMAGE_TYPE_FIRE, 
            WEAPON_TYPE_WHOKNOWS
        );

        // Null some data
        this.unit = undefined;
        this.engine.destroy();
        this.engine = undefined;
    }
}