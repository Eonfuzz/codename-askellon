import { Trigger, Rectangle, Unit, MapPlayer } from "w3ts";
import { SpaceObject, SpaceObjectType } from "./space-objects/space-object";
import { Asteroid } from "./space-objects/asteroid";
import { Mineral } from "./space-objects/mineral";
import { Log } from "lib/serilog/serilog";
import { ShipBay } from "./ship-bay";
import { SHIP_VOYAGER_UNIT, SHIP_MAIN_ASKELLON, UNIT_ID_LAVA_PLANET } from "resources/unit-ids";
import { EventListener } from "app/events/event-type";
import { Ship, ShipWithFuel } from "./ships/ship-type";
import { ABIL_LEAVE_ASKELLON_CONTROLS, SMART_ORDER_ID, MOVE_ORDER_ID, STOP_ORDER_ID, HOLD_ORDER_ID, TECH_MAJOR_VOID, ABIL_SHIP_BARREL_ROLL_LEFT, ABIL_SHIP_BARREL_ROLL_RIGHT, ABIL_SHIP_CHAINGUN, ABIL_SHIP_LASER, ABIL_SHIP_DEEP_SCAN, TECH_MINERALS_PROGRESS } from "resources/ability-ids";
import { Vector2 } from "app/types/vector2";
import { ZONE_TYPE } from "app/world/zone-id";
import { ROLE_TYPES } from "resources/crewmember-names";

import { PerseusShip } from "./ships/perseus-type";
import { AskellonShip } from "./ships/askellon-type";
import { ShipState } from "./ships/ship-state-type";

import { Entity } from "app/entity-type";
import { EVENT_TYPE } from "app/events/event-enum";
import { ForceEntity } from "app/force/force-entity";
import { WorldEntity } from "app/world/world-entity";
import { EventEntity } from "app/events/event-entity";
import { ResearchFactory } from "app/research/research-factory";
// import { CrewFactory } from "app/crewmember/crewmember-factory";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { ALIEN_FORCE_NAME } from "app/force/forces/force-names";
import { Hooks } from "lib/Hooks";
import { SpaceMiningEntity } from "./space-mining-entity";
import { AskellonEntity } from "app/station/askellon-entity";
import { Quick } from "lib/Quick";
import { getRectsGivenNamespace, getZFromXY } from "lib/utils";
import { PlayerState } from "app/force/player-type";
import { MineralRare } from "./space-objects/mineral-rare";
import { Timers } from "app/timer-type";

// For ship bay instansiation
declare const gg_rct_Space: rect;

export class SpaceEntity extends Entity {
    private static instance: SpaceEntity;

    public static getInstance() {        
        if (this.instance == null) {
            this.instance = new SpaceEntity();
            Hooks.set(this.name, this.instance);
        }
        return this.instance;
    }

    public spaceRect: Rectangle = Rectangle.fromHandle(gg_rct_Space);

    // These are things like minerals, asteroids
    // These will not move normally
    public spaceObjects: SpaceObject[];

    // An array of ships
    public ships: ShipWithFuel[];
    public mainShip: AskellonShip;
    public planet: Unit;

    public shipBays: ShipBay[];

    constructor() {
        super();

        SpaceMiningEntity.getInstance();
        
        this.ships          = [];
        this.spaceObjects   = [];
        this.shipBays       = [];


        this.initShipAbilities();

        // try {
            // Create 200 midground asteroids
            for (let index = 0; index < 250; index++) {
                const rX = GetRandomReal(this.spaceRect.minX, this.spaceRect.maxX);
                const rY = GetRandomReal(this.spaceRect.minY, this.spaceRect.maxY);
                new Asteroid(rX, rY, SpaceObjectType.midground).load();
            }
            // Create 200 midground minerals
            for (let index = 0; index < 150; index++) {
                const rX = GetRandomReal(this.spaceRect.minX, this.spaceRect.maxX);
                const rY = GetRandomReal(this.spaceRect.minY, this.spaceRect.maxY);
                new Mineral(rX, rY, SpaceObjectType.midground).load();
            }
            // Create 50 midground minerals (rare)
            for (let index = 0; index < 75; index++) {
                const rX = GetRandomReal(this.spaceRect.minX, this.spaceRect.maxX);
                const rY = GetRandomReal(this.spaceRect.minY, this.spaceRect.maxY);
                new MineralRare(rX, rY, SpaceObjectType.midground).load();
            }
            // Create 400 background asteroids
            for (let index = 0; index < 100; index++) {
                const rX = GetRandomReal(this.spaceRect.minX, this.spaceRect.maxX);
                const rY = GetRandomReal(this.spaceRect.minY, this.spaceRect.maxY);
                new Asteroid(rX, rY, SpaceObjectType.background).load();
            }
            // Create 100 foreground asteroids
            for (let index = 0; index < 200; index++) {
                const rX = GetRandomReal(this.spaceRect.minX, this.spaceRect.maxX);
                const rY = GetRandomReal(this.spaceRect.minY, this.spaceRect.maxY);
                new Asteroid(rX, rY, SpaceObjectType.foreground).load();
            }
            // Create planet
            const rX = GetRandomReal(this.spaceRect.minX, this.spaceRect.maxX);
            const rY = GetRandomReal(this.spaceRect.minY, this.spaceRect.maxY);
            this.planet = Unit.fromHandle(CreateUnit(PlayerStateFactory.NeutralPassive.handle, UNIT_ID_LAVA_PLANET, rX, rY, bj_UNIT_FACING));
            this.planet.setTimeScale(0.3);
        // }
        // catch (e) {
        //     Log.Error(e);
        // }
        const eventEntity = EventEntity.getInstance();
        eventEntity.addListener( new EventListener(EVENT_TYPE.ENTER_SHIP, (self, data) => 
            this.unitEntersShip(
                data.source, 
                data.data.ship
            ))
        )
        .addListener( new EventListener(EVENT_TYPE.LEAVE_SHIP, () => {}) )
        .addListener( new EventListener(EVENT_TYPE.SHIP_ENTERS_SPACE, (self, data) => this.onShipEntersSpace(data.source, data.data.ship)) )
        .addListener( new EventListener(EVENT_TYPE.SHIP_LEAVES_SPACE, (self, data) => this.onShipLeavesSpace(data.source, data.data.goal)) );
    
        // Listen to solar event, on hit remove all ship mana        
        EventEntity.listen(EVENT_TYPE.WORLD_EVENT_SOLAR,  () => {
            this.ships.forEach(ship => {
                if (ship && ship.unit && ship.unit.isAlive()) {
                    // Deal damage to ship based on it's current fuel
                    ship.unit.damageTarget(ship.unit.handle, ship.shipFuel * 3, false, false, ATTACK_TYPE_MAGIC, DAMAGE_TYPE_LIGHTNING, WEAPON_TYPE_WHOKNOWS);
                    ship.shipFuel = 0;
                    const sfx = AddSpecialEffect("Abilities\\Weapons\\Bolt\\BoltImpact.mdl", ship.unit.x, ship.unit.y);
                    BlzSetSpecialEffectZ(sfx, getZFromXY(ship.unit.x, ship.unit.y)+200);
                    DestroyEffect(sfx);
                }
            });
        });
    }
    
    /**
     * Registers are repeating timer that updates projectiles
     */
    shipDeathEvent = new Trigger();
    shipMoveEvent = new Trigger();
    initShips() {
        this.mainShip = new AskellonShip(ShipState.inSpace, AskellonEntity.getInstance().askellonUnit);
        
        this.shipDeathEvent.registerUnitEvent(this.mainShip.unit, EVENT_UNIT_DEATH);
        this.shipMoveEvent.registerUnitEvent(this.mainShip.unit, EVENT_UNIT_ISSUED_ORDER);
        this.shipMoveEvent.registerUnitEvent(this.mainShip.unit, EVENT_UNIT_ISSUED_POINT_ORDER);
        this.shipMoveEvent.registerUnitEvent(this.mainShip.unit, EVENT_UNIT_ISSUED_TARGET_ORDER);

        const shipBays = getRectsGivenNamespace("ShipBay");

        /**
         * Also insansiate ships
         */
        shipBays.forEach(rect => {
            const zone = WorldEntity.getInstance().getPointZone(GetRectCenterX(rect), GetRectCenterY(rect));

            if (!zone) return Log.Error(`Failed to create bay for ${rect} zone does not exist!`);

            const bay = new ShipBay(rect, zone.id);
            this.shipBays.push(bay);

            // Log.Information(`New bay for ${zone.id}`);

            // Only spawn ships for these places
            if (zone.id === ZONE_TYPE.CARGO_A || zone.id === ZONE_TYPE.CARGO_B) {

                // Also for now create a ship to sit in the dock
                const ship = new PerseusShip(ShipState.inBay, Unit.fromHandle(
                    CreateUnit(PlayerStateFactory.NeutralPassive.handle, SHIP_VOYAGER_UNIT, 0, 0, bj_UNIT_FACING))
                );
                ship.unit.owner = PlayerStateFactory.StationProperty;
                
                this.ships.push(ship);

                WorldEntity.getInstance().travel(ship.unit, bay.ZONE);

                bay.dockShip(ship);

                this.shipDeathEvent.registerUnitEvent(ship.unit, EVENT_UNIT_DEATH);
                this.shipMoveEvent.registerUnitEvent(ship.unit, EVENT_UNIT_ISSUED_ORDER);
                this.shipMoveEvent.registerUnitEvent(ship.unit, EVENT_UNIT_ISSUED_POINT_ORDER);
                this.shipMoveEvent.registerUnitEvent(ship.unit, EVENT_UNIT_ISSUED_TARGET_ORDER);
            }
        });

        // Hook into ship death event
        this.shipDeathEvent.addAction(() => {
            const u = Unit.fromHandle(GetDyingUnit());
            const k =  Unit.fromHandle((UnitAlive(GetKillingUnit()) ? GetKillingUnit() : GetDyingUnit()));

            // Log.Information("Ship death!");

            const matchingShip = this.getShipForUnit(u);

            try {
                // Was the ship in a bay
                const bay = this.shipBays.find(b => b.getDockedShip() === matchingShip);

                // Now remove the ship from the bay
                if (bay) bay.onDockedShipDeath();

                if (this.mainShip !== matchingShip) {
                    // Now kill the ship
                    matchingShip.onDeath(k);
                    // Now clear it from ships for unit
                    this.ships.splice(this.ships.indexOf(matchingShip as ShipWithFuel), 1);
                    // Log.Information("Finished ship Death!");
                }
                else {
                    matchingShip.onDeath(k);
                }
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

            // Log.Information("Ship is issued an order");

            const u = Unit.fromHandle(GetOrderedUnit());
            
            const ship = this.getShipForUnit(u);

            let targetLoc;

            // If we are stopping, just get ship to stop
            if (isStop || isHold) {
                return ship.stopMovement();
            }
            if (GetOrderTargetUnit()) targetLoc = new Vector2(GetUnitX(GetOrderTargetUnit()), GetUnitY(GetOrderTargetUnit()));
            else targetLoc = new Vector2(GetOrderPointX(), GetOrderPointY());

            ship.onMoveOrder(targetLoc);
        })

        // Hook into the space upgrades
        
        // Listen to ugprade events
        EventEntity.listen(new EventListener(EVENT_TYPE.MAJOR_UPGRADE_RESEARCHED, (self, data) => {
            if (data.data.researched === TECH_MINERALS_PROGRESS) {
                if (data.data.level === 3) {
                    this.mainShip.engine.mass = 250;
                    this.mainShip.engine.velocityForwardMax = 300;
                    this.mainShip.engine.baseTurningArc = 4;
                }
            }
            if (data.data.researched === TECH_MAJOR_VOID) {
                const techLevel = data.data.level;

                const gotOccupationBonus = ResearchFactory.getInstance().techHasOccupationBonus(data.data.researched, techLevel);

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
                    this.ships.forEach(ship => {
                        if (gotOccupationBonus && ship.unit && ship.unit.isAlive()) {
                            ship.setFuelUsagePercent(gotOccupationBonus ? 0.4 : 0.6)
                            SetUnitAbilityLevel(ship.unit.handle, ABIL_SHIP_LASER, GetUnitAbilityLevel(ship.unit.handle, ABIL_SHIP_LASER) + 1);
                        }
                    });
                }
            }
        }));
    }

    onShipEntersSpace(who: Unit, ship: Ship) {
        ship.state = ShipState.inSpace;
        // const rect = Rectangle.fromHandle(gg_rct_Space);

        // Get mainship x,y
        // Depends on where we come from
        // Get old zone
        const oldZone = WorldEntity.getInstance().getUnitZone(ship.unit);

        if (!oldZone || oldZone.id !== ZONE_TYPE.PLANET) {
            ship.unit.x = this.mainShip.unit.x;
            ship.unit.y = this.mainShip.unit.y;
        }
        else {
            ship.unit.x = this.planet.x;
            ship.unit.y = this.planet.y;
        }
        // who.setTimeScale(0.1);

        ship.onEnterSpace();
        PanCameraToTimedForPlayer(who.owner.handle, ship.unit.x, ship.unit.y, 0);

        WorldEntity.getInstance().travel(who, ZONE_TYPE.SPACE);
        WorldEntity.getInstance().travel(ship.unit, ZONE_TYPE.SPACE);

        // Alien infestation
        // Grant vision of the ship if it is infested
        const t2IsInfested = ResearchFactory.getInstance().isUpgradeInfested(TECH_MAJOR_VOID, 2);
        if (t2IsInfested) {
            const alienForce = PlayerStateFactory.getForce(ALIEN_FORCE_NAME);
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
        const ship = this.getShipForUnit(unit);
        if (!ship) return Log.Error("No ship for unit!");

        let bays: ShipBay[];

        if (goal.typeId == SHIP_MAIN_ASKELLON) {
            bays = this.shipBays.filter(b => b.ZONE === ZONE_TYPE.CARGO_A || b.ZONE === ZONE_TYPE.CARGO_B);
        }
        else if (goal.typeId === UNIT_ID_LAVA_PLANET) {
            bays = this.shipBays.filter(b => b.ZONE === ZONE_TYPE.PLANET);
            // Log.Information(`Landing on planet, bays: ${bays.length}`);
        }

        // We need to find a "free" dock
        const freeBay = Quick.GetRandomFromArray(bays.filter(bay => bay.canDockShip()), 1)[0];
        if (!freeBay) {
            // Display the warning to the pilot
            return DisplayTextToPlayer(unit.owner.handle, 0, 0, `No free ship bays`);
        }
        // iterate units
        ship.inShip.forEach(u => {
            WorldEntity.getInstance().travel(u, freeBay.ZONE);
        });
        WorldEntity.getInstance().travel(ship.unit, freeBay.ZONE);

        // Now we need to dock
        ship.onLeaveSpace();
        freeBay.dockShip(ship, true);
        PanCameraToTimedForPlayer(unit.owner.handle, unit.x, unit.y, 0);
        if (unit.owner.handle === GetLocalPlayer()) {
            BlzShowTerrain(true);
        }

        // Alien infestation
        // Remove vision of the ship if it is infested
        const t2IsInfested = ResearchFactory.getInstance().isUpgradeInfested(TECH_MAJOR_VOID, 2);
        if (t2IsInfested) {
            const alienForce = PlayerStateFactory.getForce(ALIEN_FORCE_NAME);
            alienForce.getPlayers().forEach(p => ship.unit.shareVision(p, false));
        }
    }

    _timerDelay = 0.02;
    /**
     * Updates all ship movement
     * @param updatePeriod 
     */
    minX = this.spaceRect.minX;
    maxX = this.spaceRect.maxX;
    minY = this.spaceRect.minY;
    maxY = this.spaceRect.maxY;
    step() {
        if (this.mainShip)
            this.mainShip.process(this._timerDelay, this.minX, this.maxX, this.minY, this.maxY);
        this.ships.forEach(ship => ship.process(this._timerDelay, this.minX, this.maxX, this.minY, this.maxY));
    }

    unitEntersShip(who: Unit, whichShip: Unit) {
        // Get SHIP
        const ship = this.getShipForUnit(whichShip);
        if (!ship) return Log.Error("No ship?! WHAT");

        const bayMatch = this.shipBays.find((bay) => bay.getDockedShip() === ship);

        if (!bayMatch) return Log.Error("NO BAY FOUND FOR SHIP, REPORT THIS PLEASE TY THANKS NERDS");

        try {
            bayMatch.launchShip(who);
        }
        catch(e) {
            Log.Error(e);
        }
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
            GetSpellAbilityId() === ABIL_LEAVE_ASKELLON_CONTROLS ||
            GetUnitTypeId(GetTriggerUnit()) === SHIP_VOYAGER_UNIT
        ));

        this.shipAbilityTrigger.addAction(() => {
            const unit = GetTriggerUnit();
            const castAbilityId = GetSpellAbilityId();

            // Phew, hope you have the water running, ready for your shower  
            const u = Unit.fromHandle(unit);           
            let ship = this.getShipForUnit(u);

            if (!ship) Log.Error("Ship casting movement but no ship?!");
            else if (castAbilityId === this.shipAfterburnerAbilityId) {
                ship.engine.engageAfterburner(Unit.fromHandle(unit).owner);
            }



            if (ship instanceof ShipWithFuel) {
                const pData = PlayerStateFactory.get(ship.inShip[0].owner);
                const crew = pData.getCrewmember();
               
                const isPilot = crew && crew.unit === ship.inShip[0] && crew.role === ROLE_TYPES.PILOT;
                let manaCost = BlzGetUnitAbilityManaCost(u.handle, castAbilityId, GetUnitAbilityLevel(unit, castAbilityId)-1);
                if (isPilot) {
                    manaCost = Math.min(manaCost-1, 0);
                }
                ship.onFuelUseage( manaCost )
            }
        });
    }

    public getShipForUnit(who: Unit) {
        if (this.mainShip && this.mainShip.unit.handle === who.handle) {
            return this.mainShip;
        }
        return this.ships.find(s => { return s.unit.id == who.id});
    }
}