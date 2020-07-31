import { Unit, Effect } from "w3ts/index";
import { SpaceMovementEngine } from "../ship-movement-engine";
import { Log } from "lib/serilog/serilog";
import { vectorFromUnit, Vector2 } from "app/types/vector2";
import { UNIT_IS_FLY } from "resources/ability-ids";
import { ZONE_TYPE } from "app/world/zone-id";
import { ROLE_TYPES } from "resources/crewmember-names";
import { Ship, ShipWithFuel } from "./ship-type";
import { ShipState } from "./ship-state-type";
import { ForceEntity } from "app/force/force-entity";
import { WorldEntity } from "app/world/world-entity";
import { CrewFactory } from "app/crewmember/crewmember-factory";

export class PerseusShip extends ShipWithFuel {

    maxFuel = 150;

    /**
     * Automatically creates a new unit, adds it to bay if possible
     */
    constructor(state: ShipState, u: Unit) {
        super(state, u);
        
        this.unit.maxMana = this.maxFuel;
        this.shipFuel = this.maxFuel;
    }

    createEngine() {
        if (!this.engine) {
            this.engine = new SpaceMovementEngine(
                this.unit.x, 
                this.unit.y, 
                vectorFromUnit(this.unit.handle).applyPolarOffset(this.unit.facing, 30)
            );
        }
        else {
            Log.Warning("Perseus asked to create vector engine but already exists");
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

    onEnterSpace() {
        this.state = ShipState.inSpace;
        this.createEngine();
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

    onDeath(killer: Unit) {
        // first of all eject all our units
        const allUnits = this.inShip.slice();
        this.onLeaveShip();

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

    public onMoveOrder(targetLoc: Vector2) {
        if (this.engine) {
            this.engine.setGoal(targetLoc);
            this.engine.increaseVelocity();
        }
        else {
            Log.Error("Ship is receiving orders while not piloted WTF");
        }
    }

    onLeaveShip(isDeath?: boolean) {
        const newOwner = ForceEntity.getInstance().neutralHostile;
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
        const unitZone = WorldEntity.getInstance().getUnitZone(this.unit);
        if (!isDeath && unitZone && WorldEntity.getInstance().getUnitZone(this.unit).id === ZONE_TYPE.CARGO_A) {
            const owningUnit = this.inShip[0];
    
            const mineralItem = this.unit.getItemInSlot(0);
            const stacks = GetItemCharges(mineralItem);
            SetItemCharges(mineralItem, 0);

            // Reward money
            if (owningUnit && stacks > 0) {
                const crew = CrewFactory.getInstance().getCrewmemberForUnit(owningUnit);
                if (crew) {
                    const hasRoleOccupationBonus = (crew.role === ROLE_TYPES.PILOT);
                    if (hasRoleOccupationBonus) {
                        crew.addExperience(stacks * 4);
                        crew.player.setState(PLAYER_STATE_RESOURCE_GOLD, 
                            crew.player.getState(PLAYER_STATE_RESOURCE_GOLD) + stacks * 7
                        );
                    }
                    else {
                        crew.addExperience(stacks * 3);
                        crew.player.setState(PLAYER_STATE_RESOURCE_GOLD, 
                            crew.player.getState(PLAYER_STATE_RESOURCE_GOLD) + stacks * 5
                        );
                    }
                }
            } 
        }
        
        this.inShip = [];
    }
}