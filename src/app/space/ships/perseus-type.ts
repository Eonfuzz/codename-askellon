import { Unit, Effect } from "w3ts/index";
import { SpaceMovementEngine } from "../ship-movement-engine";
import { Log } from "lib/serilog/serilog";
import { vectorFromUnit, Vector2 } from "app/types/vector2";
import { UNIT_IS_FLY, HOLD_ORDER_ID } from "resources/ability-ids";
import { ZONE_TYPE } from "app/world/zone-id";
import { ROLE_TYPES } from "resources/crewmember-names";
import { Ship, ShipWithFuel } from "./ship-type";
import { ShipState } from "./ship-state-type";

import { WorldEntity } from "app/world/world-entity";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { Timers } from "app/timer-type";
import { ITEM_MINERALS_REACTIVE_SHIP_ID, ITEM_MINERALS_VALUABLE_SHIP_ID, ITEM_MINERAL_REACTIVE, ITEM_MINERAL_VALUABLE } from "resources/item-ids";
import { EventEntity } from "app/events/event-entity";
import { EventListener } from "app/events/event-type";
import { EVENT_TYPE } from "app/events/event-enum";

export class PerseusShip extends ShipWithFuel {

    maxFuel = 150;

    /**
     * Automatically creates a new unit, adds it to bay if possible
     */
    constructor(state: ShipState, u: Unit) {
        super(state, u);
        
        this.unit.maxMana = this.maxFuel;
        this.shipFuel = this.maxFuel;

        this.unit.addItemById(ITEM_MINERALS_REACTIVE_SHIP_ID);
        this.unit.addItemById(ITEM_MINERALS_VALUABLE_SHIP_ID);

        EventEntity.listen(new EventListener(EVENT_TYPE.SHIP_STARTS_MINING, (self, ev) => {
            if (ev.source.handle === this.unit.handle) {
                this.engine.setGoal(Vector2.fromWidget(ev.data.target.handle));
                this.engine.increaseVelocity();
                this.engine.goToAStop();
            }
        }))
    }

    createEngine() {
        if (!this.engine) {
            this.engine = new SpaceMovementEngine(
                this.unit.x, 
                this.unit.y, 
                vectorFromUnit(this.unit.handle).applyPolarOffset(this.unit.facing, 30)
            );
            this.engine.velocityForwardMax = 400;
            this.engine.mass = 260;
        }
        else {
            Log.Warning("Perseus asked to create vector engine but already exists");
        }
    }

    onEnterShip(who: Unit) {
        const newOwner = who.owner;
        this.unit.owner = who.owner;

        // If we have the entering unit was selected, select the ship too
        if (true) { // who.isSelected(newOwner)) {
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
        try {
            // first of all eject all our units
            const allUnits = this.inShip.slice();
            this.onLeaveShip();

            Timers.addTimedAction(0.00, () => {
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
            });
        } 
        catch(e) {
            Log.Error("Ship death failed");
            Log.Error(e);
        }
    }

    public onMoveOrder(targetLoc: Vector2) {
        // Log.Information("Move order!");
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
        
        // Drop minerals off
        // Only continue if we are NOT dying
        if (!isDeath) {
            // We're leaving space, can we dump off minerals?
            const unitZone = WorldEntity.getInstance().getUnitZone(this.unit);
            if (unitZone.id === ZONE_TYPE.CARGO_A) {        
                this.dropMineral(this.unit.getItemInSlot(0), ITEM_MINERAL_REACTIVE);
                this.dropMineral(this.unit.getItemInSlot(1), ITEM_MINERAL_VALUABLE);
            }
        }
        
        this.inShip = [];
    }


    private dropMineral(parentMineral: item, ITEM_ID: number) {
        const stacks = GetItemCharges(parentMineral);
        SetItemCharges(parentMineral, 0);
        
        if (stacks > 0) {
            const minerals = CreateItem(ITEM_ID, this.unit.x + GetRandomInt(-50, 50), this.unit.y - 300 + GetRandomInt(-50, 50));
            const maxCharges = ITEM_ID === ITEM_MINERAL_REACTIVE ? 30 : 15; 
            const fullStacks = Math.floor(stacks / maxCharges);
            const remainder = stacks % maxCharges;
            
            SetItemCharges(minerals, remainder);

            let i = 0;
            while (i < fullStacks) {
                i++;
                const nItem = CreateItem(ITEM_ID, this.unit.x + GetRandomInt(-50, 50), this.unit.y - 300 + GetRandomInt(-50, 50));
                SetItemCharges(nItem, maxCharges);
            }
        }

    }
}