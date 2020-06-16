import { Unit, Effect } from "w3ts/index";
import { Game } from "app/game";
import { SpaceMovementEngine } from "./ship-movement-engine";
import { Log } from "lib/serilog/serilog";
import { vectorFromUnit, Vector2 } from "app/types/vector2";
import { UNIT_IS_FLY } from "resources/ability-ids";
import { ZONE_TYPE } from "app/world/zone-id";
import { ROLE_TYPES } from "resources/crewmember-names";

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

    private fuelUpdateTicker = 1;
    private fuelUsagePercent = 1;

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

            // Set pos
            const enginePos = this.engine.getPosition();
            this.unit.x = enginePos.x;
            this.unit.y = enginePos.y;

            // We also force player cam to the ship
            const p = this.unit.owner;
            PanCameraToTimedForPlayer(p.handle, this.unit.x, this.unit.y, 0);
        }
        // What to do each tick if we are in a bay??
        else if (this.state = ShipState.inBay) {
        }

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

            const fuelCost = (0.5 + momentumLen / 4000);
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

    public setFuelUsagePercent(newVal: number) {
        this.fuelUsagePercent = newVal;
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
        this.unit.selectionScale = 0.4;
        this.unit.setScale(0.4, 0.4, 0.4);
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

    onLeaveShip(game: Game, isDeath?: boolean) {
        const newOwner = game.forceModule.neutralHostile;
        this.unit.owner = newOwner;
        SetUnitAnimationByIndex(this.unit.handle, 3);

        const shipPos = vectorFromUnit(this.unit.handle);

        

        this.inShip.forEach(u => {
            const rPos = shipPos.applyPolarOffset(GetRandomReal(0, 360), 150);
            u.x = rPos.x;
            u.y = rPos.y;
            u.show = true;
            u.paused = false;

            // If we have the entering unit was selected, select the ship too
            SelectUnitForPlayerSingle(u.handle, u.owner.handle);
            PanCameraToTimedForPlayer(u.owner.handle, u.x, u.y, 0);
        });
        
        // We're leaving space, can we dump off minerals?
        if (!isDeath && game.worldModule.getUnitZone(this.unit).id === ZONE_TYPE.CARGO_A) {
            const owningUnit = this.inShip[0];
    
            const mineralItem = this.unit.getItemInSlot(0);
            const stacks = GetItemCharges(mineralItem);
            SetItemCharges(mineralItem, 0);

            // Reward money
            if (owningUnit) {
                const crew = game.crewModule.getCrewmemberForUnit(owningUnit);
                if (crew) {
                    const hasRoleOccupationBonus = crew.role === ROLE_TYPES.PILOT;
                    if (hasRoleOccupationBonus) {
                        crew.addExperience(game, stacks * 5);
                        crew.player.setState(PLAYER_STATE_RESOURCE_GOLD, 
                            crew.player.getState(PLAYER_STATE_RESOURCE_GOLD) + stacks * 7
                        );
                    }
                    else {
                        crew.addExperience(game, stacks * 3);
                        crew.player.setState(PLAYER_STATE_RESOURCE_GOLD, 
                            crew.player.getState(PLAYER_STATE_RESOURCE_GOLD) + stacks * 5
                        );
                    }
                }
            } 
        }
        
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

        if (this.engine) {
            this.engine.destroy();
            this.engine = undefined;
        }
    }
}