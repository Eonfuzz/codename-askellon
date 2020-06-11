/** @noSelfInFile **/

import { Game } from "../game";
import { Trigger, Region, Rectangle, Unit, Timer } from "w3ts";
import { SpaceObject, SpaceObjectType } from "./space-objects/space-object";
import { Asteroid } from "./space-objects/asteroid";
import { Log } from "lib/serilog/serilog";
import { ShipBay } from "./ship-bay";
import { SHIP_VOYAGER_UNIT, SHIP_MAIN_ASKELLON } from "resources/unit-ids";
import { EventListener, EVENT_TYPE } from "app/events/event";
import { Ship, ShipState } from "./ship";
import { ABIL_DOCK_TEST, SMART_ORDER_ID, MOVE_ORDER_ID, STOP_ORDER_ID, HOLD_ORDER_ID, TECH_MAJOR_VOID, ABIL_SHIP_BARREL_ROLL_LEFT, ABIL_SHIP_BARREL_ROLL_RIGHT, ABIL_SHIP_CHAINGUN, ABIL_SHIP_LASER, ABIL_SHIP_DEEP_SCAN } from "resources/ability-ids";
import { Vector2 } from "app/types/vector2";
import { ZONE_TYPE } from "app/world/zone-id";
import { ALIEN_FORCE_NAME } from "app/force/alien-force";
import { ROLE_TYPES } from "resources/crewmember-names";
import { ITEM_MINERALS_SHIP_ID } from "resources/item-ids";

// For ship bay instansiation
declare const udg_ship_zones: rect[];
declare const gg_rct_Space: rect;

export class SpaceModule {
    private game: Game;

    public spaceRect: Rectangle = Rectangle.fromHandle(gg_rct_Space);

    // These are things like minerals, asteroids
    // These will not move normally
    public spaceObjects: SpaceObject[];

    // An array of ships
    public ships: Ship[];
    private shipsForUnit = new Map<Unit, Ship>();

    public mainShip: Ship;

    public shipBays: ShipBay[];

    constructor(game: Game) {
        this.game = game;

        this.ships          = [];
        this.spaceObjects   = [];
        this.shipBays       = [];


        this.initShipAbilities();

        // try {
            // Create 300 midground asteroids
            for (let index = 0; index < 300; index++) {
                const rX = GetRandomReal(this.spaceRect.minX, this.spaceRect.maxX);
                const rY = GetRandomReal(this.spaceRect.minY, this.spaceRect.maxY);
                const asteroid = new Asteroid(rX, rY, SpaceObjectType.midground);
                asteroid.load(game);
            }
            // Create 400 background asteroids
            for (let index = 0; index < 400; index++) {
                const rX = GetRandomReal(this.spaceRect.minX, this.spaceRect.maxX);
                const rY = GetRandomReal(this.spaceRect.minY, this.spaceRect.maxY);
                const asteroid = new Asteroid(rX, rY, SpaceObjectType.background);
                asteroid.load(game);
            }
            // Create 100 foreground asteroids
            for (let index = 0; index < 400; index++) {
                const rX = GetRandomReal(this.spaceRect.minX, this.spaceRect.maxX);
                const rY = GetRandomReal(this.spaceRect.minY, this.spaceRect.maxY);
                const asteroid = new Asteroid(rX, rY, SpaceObjectType.foreground);
                asteroid.load(game);
            }
        // }
        // catch (e) {
        //     Log.Error(e);
        // }
        this.game.event.addListener( new EventListener(EVENT_TYPE.ENTER_SHIP, (self, data) => 
            this.unitEntersShip(
                data.source, 
                data.data.ship
            ))
        );
        this.game.event.addListener( new EventListener(EVENT_TYPE.LEAVE_SHIP, () => {}) );
        this.game.event.addListener( new EventListener(EVENT_TYPE.SHIP_ENTERS_SPACE, (self, data) => this.onShipEntersSpace(data.source, data.data.ship)) );
        this.game.event.addListener( new EventListener(EVENT_TYPE.SHIP_LEAVES_SPACE, (self, data) => this.onShipLeavesSpace(data.source, data.data.goal)) );
    }
    
    /**
     * Registers are repeating timer that updates projectiles
     */
    shipDeathEvent = new Trigger();
    shipMoveEvent = new Trigger();
    initShips() {
        const spaceX = this.spaceRect.centerX;
        const spaceY = this.spaceRect.centerY;

        const ship = new Ship(this.game, ShipState.inSpace, Unit.fromHandle(
            CreateUnit(this.game.forceModule.neutralPassive.handle, SHIP_MAIN_ASKELLON, spaceX, spaceY, bj_UNIT_FACING))
        );
        ship.engine.doCreateTrails = false;
        ship.unit.setTimeScale(0.1);
        this.mainShip = ship;

        /**
         * Also insansiate ships
         */
        udg_ship_zones.forEach(rect => {
            const bay = new ShipBay(rect)
            this.shipBays.push(bay);
            bay.ZONE = ZONE_TYPE.CARGO_A;

            // Also for now create a ship to sit in the dock
            const ship = new Ship(this.game, ShipState.inBay, Unit.fromHandle(
                CreateUnit(this.game.forceModule.neutralHostile.handle, SHIP_VOYAGER_UNIT, 0, 0, bj_UNIT_FACING))
            );
            this.shipsForUnit.set(ship.unit, ship);
            this.ships.push(ship);
            this.game.worldModule.travel(ship.unit, bay.ZONE);
            ship.unit.addItemById(ITEM_MINERALS_SHIP_ID);

            bay.dockShip(this.game, ship);

            this.shipDeathEvent.registerUnitEvent(ship.unit, EVENT_UNIT_DEATH);
            this.shipMoveEvent.registerUnitEvent(ship.unit, EVENT_UNIT_ISSUED_ORDER);
            this.shipMoveEvent.registerUnitEvent(ship.unit, EVENT_UNIT_ISSUED_POINT_ORDER);
            this.shipMoveEvent.registerUnitEvent(ship.unit, EVENT_UNIT_ISSUED_TARGET_ORDER);
        });

        // Hook into ship death event
        this.shipDeathEvent.addAction(() => {
            const u = Unit.fromHandle(GetDyingUnit());
            const k = Unit.fromHandle(GetKillingUnit() || GetDyingUnit());

            // Log.Information("Ship death!");

            const matchingShip = this.shipsForUnit.get(u);

            try {
                // Was the ship in a bay
                const bay = this.shipBays.find(b => b.getDockedShip() === matchingShip);

                // Now remove the ship from the bay
                if (bay) bay.onDockedShipDeath();
                // Now kill the ship
                matchingShip.onDeath(this.game, k);
                // Now clear it from ships for unit
                this.shipsForUnit.delete(u);
                this.ships.splice(this.ships.indexOf(matchingShip), 1);
                // Log.Information("Finished ship Death!");
            }
            catch (e) {
                Log.Error(e);
            }
        });

        this.shipMoveEvent.addAction(() => {
            const order = GetIssuedOrderId();

            const isSmart = order === SMART_ORDER_ID;
            const isMove = order === MOVE_ORDER_ID;
            const isStop = order === STOP_ORDER_ID;
            const isHold = order === HOLD_ORDER_ID;

            if (!isSmart && !isMove && !isStop && !isHold) return;

            const u = Unit.fromHandle(GetOrderedUnit());
            const ship = this.shipsForUnit.get(u);

            let targetLoc;

            // If we are stopping, just get ship to stop
            if (isStop || isHold) {
                return ship.engine.goToAStop();
            }
            if (GetOrderTargetUnit()) targetLoc = new Vector2(GetUnitX(GetOrderTargetUnit()), GetUnitY(GetOrderTargetUnit()));
            else targetLoc = new Vector2(GetOrderPointX(), GetOrderPointY());

            ship.onMoveOrder(targetLoc);
        })

        // Hook into the space upgrades
        
        // Listen to ugprade events
        this.game.event.addListener(new EventListener(EVENT_TYPE.MAJOR_UPGRADE_RESEARCHED, (self, data) => {
            if (data.data.researched === TECH_MAJOR_VOID) {
                const techLevel = data.data.level;

                const gotOccupationBonus = this.game.researchModule.techHasOccupationBonus(data.data.researched, techLevel);

                if (techLevel === 1) {
                    this.ships.forEach(ship => {
                        if (gotOccupationBonus && ship.unit && ship.unit.isAlive()) {
                            SetUnitAbilityLevel(ship.unit.handle, ABIL_SHIP_LASER, GetUnitAbilityLevel(ship.unit.handle, ABIL_SHIP_LASER) + 1);
                        }
                    })
                }
                if (techLevel === 2) {
                    this.ships.forEach(ship => {
                        ship.maxFuel += 20;
                        if (ship.unit && ship.unit.isAlive()) {
                            ship.unit.maxMana = ship.maxFuel;
                            SetUnitAbilityLevel(ship.unit.handle, this.shipAfterburnerAbilityId, 2);
                            if (gotOccupationBonus) {
                                SetUnitAbilityLevel(ship.unit.handle, ABIL_SHIP_DEEP_SCAN, 2);
                            }
                        }
                    })
                }
                if (techLevel === 3) {
                    this.ships.forEach(ship => {
                        if (ship.unit && ship.unit.isAlive()) {
                            SetUnitAbilityLevel(ship.unit.handle, ABIL_SHIP_CHAINGUN, 2);
                            BlzSetUnitAbilityManaCost(ship.unit.handle, ABIL_SHIP_BARREL_ROLL_LEFT, 0, 0);
                            BlzSetUnitAbilityManaCost(ship.unit.handle, ABIL_SHIP_BARREL_ROLL_RIGHT, 0, 0);
                            if (gotOccupationBonus) {
                                SetUnitAbilityLevel(ship.unit.handle, ABIL_SHIP_LASER, GetUnitAbilityLevel(ship.unit.handle, ABIL_SHIP_LASER) + 1);
                            }
                        }
                    })
                }
                if (techLevel === 4) {
                    if (gotOccupationBonus && ship.unit && ship.unit.isAlive()) {
                        SetUnitAbilityLevel(ship.unit.handle, ABIL_SHIP_LASER, GetUnitAbilityLevel(ship.unit.handle, ABIL_SHIP_LASER) + 1);
                    }
                    this.ships.forEach(ship => ship.setFuelUsagePercent(gotOccupationBonus ? 0.4 : 0.6));
                }
            }
        }));
    }

    onShipEntersSpace(who: Unit, ship: Ship) {
        ship.state = ShipState.inSpace;
        // const rect = Rectangle.fromHandle(gg_rct_Space);

        // Get mainship x,y
        ship.unit.x = this.mainShip.unit.x;
        ship.unit.y = this.mainShip.unit.y;
        // who.setTimeScale(0.1);

        ship.onEnterSpace();
        PanCameraToTimedForPlayer(who.owner.handle, ship.unit.x, ship.unit.y, 0);

        this.game.worldModule.travel(who, ZONE_TYPE.SPACE);
        this.game.worldModule.travel(ship.unit, ZONE_TYPE.SPACE);

        if (who.owner.handle === GetLocalPlayer()) {
            BlzShowTerrain(false);
        }        

        // Alien infestation
        // Grant vision of the ship if it is infested
        const t2IsInfested = this.game.researchModule.isUpgradeInfested(TECH_MAJOR_VOID, 2);
        if (t2IsInfested) {
            const alienForce = this.game.forceModule.getForce(ALIEN_FORCE_NAME);
            alienForce.getPlayers().forEach(p => ship.unit.shareVision(p, true));
        }
    }

    /**
     * The ship is leaving space and entering station... Somewhere?
     * TODO Take into account multiple landing locations
     * @param whichShip 
     * @param whichTarget 
     */
    onShipLeavesSpace(unit: Unit, goal: Unit) {
        const ship = this.shipsForUnit.get(unit);
        if (!ship) return Log.Error("No ship for unit!");

        let bays: ShipBay[];

        if (goal.typeId == SHIP_MAIN_ASKELLON) bays = this.shipBays;

        // We need to find a "free" dock
        const freeBay = this.shipBays.find(bay => bay.canDockShip());
        if (!freeBay) {
            // Display the warning to the pilot
            return DisplayTextToPlayer(unit.owner.handle, 0, 0, `No free ship bays`);
        }
        // iterate units
        ship.inShip.forEach(u => {
            this.game.worldModule.travel(u, freeBay.ZONE);
        });
        this.game.worldModule.travel(ship.unit, freeBay.ZONE);

        // Now we need to dock
        ship.onLeaveSpace();
        freeBay.dockShip(this.game, ship, true);
        PanCameraToTimedForPlayer(unit.owner.handle, unit.x, unit.y, 0);
        if (unit.owner.handle === GetLocalPlayer()) {
            BlzShowTerrain(true);
        }

        // Alien infestation
        // Remove vision of the ship if it is infested
        const t2IsInfested = this.game.researchModule.isUpgradeInfested(TECH_MAJOR_VOID, 2);
        if (t2IsInfested) {
            const alienForce = this.game.forceModule.getForce(ALIEN_FORCE_NAME);
            alienForce.getPlayers().forEach(p => ship.unit.shareVision(p, false));
        }
    }

    /**
     * Updates all ship movement
     * @param updatePeriod 
     */
    minX = this.spaceRect.minX;
    maxX = this.spaceRect.maxX;
    minY = this.spaceRect.minY;
    maxY = this.spaceRect.maxY;
    updateShips(updatePeriod: number) {
        // this.mainShip.process(this.game, updatePeriod, this.minX, this.maxX, this.minY, this.maxY);
        this.ships.forEach(ship => ship.process(this.game, updatePeriod, this.minX, this.maxX, this.minY, this.maxY));
    }

    unitEntersShip(who: Unit, whichShip: Unit) {
        // Get SHIP
        const ship = this.shipsForUnit.get(whichShip);
        if (!ship) return Log.Error("No ship?! WHAT");

        const bayMatch = this.shipBays.find((bay) => bay.getDockedShip() === ship);

        if (!bayMatch) return Log.Error("NO BAY FOUND FOR SHIP, REPORT THIS PLEASE TY THANKS NERDS");

        try {
            bayMatch.launchShip(this.game, who);
        }
        catch(e) {
            Log.Error(e);
        }
    }

    public getShipForUnit(who: Unit) {
        return this.shipsForUnit.get(who);
    }

    /**
     * Ship abilities
     */
    private shipAbilityTrigger          = new Trigger();
    private shipAfterburnerAbilityId    = FourCC('A000');
    initShipAbilities() {
        this.shipAbilityTrigger.registerAnyUnitEvent(EVENT_PLAYER_UNIT_SPELL_EFFECT);
        this.shipAbilityTrigger.addCondition(Condition(() =>
            GetSpellAbilityId() === this.shipAfterburnerAbilityId   ||
            GetSpellAbilityId() === ABIL_DOCK_TEST ||
            GetUnitTypeId(GetTriggerUnit()) === SHIP_VOYAGER_UNIT
        ));

        this.shipAbilityTrigger.addAction(() => {
            const unit = GetTriggerUnit();
            const castAbilityId = GetSpellAbilityId();

            // Phew, hope you have the water running, ready for your shower  
            const u = Unit.fromHandle(unit);           
            let ship = this.shipsForUnit.get(u);

            if (!ship) Log.Error("Ship casting movement but no ship?!");
            else if (castAbilityId === this.shipAfterburnerAbilityId) {
                ship.engine.engageAfterburner(Unit.fromHandle(unit).owner);
            }

            const crew = this.game.crewModule.getCrewmemberForUnit(ship.inShip[0])
            const isPilot = crew && crew.role === ROLE_TYPES.PILOT;
            let manaCost = BlzGetUnitAbilityManaCost(u.handle, castAbilityId, GetUnitAbilityLevel(unit, castAbilityId)-1);
            if (isPilot) {
                manaCost = Math.min(manaCost-1, 0);
            }
            ship.shipFuel -= manaCost;
        });
    }
}