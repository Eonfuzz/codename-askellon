/** @noSelfInFile **/

import { Game } from "../game";
import { Trigger, Region, Rectangle, Unit } from "w3ts";
import { SpaceObject } from "./space-objects/space-object";
import { Asteroid } from "./space-objects/asteroid";
import { Log } from "lib/serilog/serilog";
import { ShipBay } from "./ship-bay";
import { SHIP_VOYAGER_UNIT } from "resources/unit-ids";
import { EventListener, EVENT_TYPE } from "app/events/event";
import { Ship, ShipState } from "./ship";
import { ABIL_DOCK_TEST } from "resources/ability-ids";

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

    public shipBays: ShipBay[];

    constructor(game: Game) {
        this.game = game;

        this.ships          = [];
        this.spaceObjects   = [];
        this.shipBays       = [];


        const spaceX = this.spaceRect.centerX;
        const spaceY = this.spaceRect.centerY;

        this.initShips();
        this.initShipAbilities();

        for (let index = 0; index < 400; index++) {
            const rX = GetRandomReal(this.spaceRect.minX, this.spaceRect.maxX);
            const rY = GetRandomReal(this.spaceRect.minY, this.spaceRect.maxY);
            const asteroid = new Asteroid(rX, rY);
            asteroid.load(game);
        }

        this.game.event.addListener( new EventListener(EVENT_TYPE.ENTER_SHIP, (self, data) => 
            this.unitEntersShip(
                data.source, 
                data.data.ship
            ))
        );
        this.game.event.addListener( new EventListener(EVENT_TYPE.LEAVE_SHIP, () => {}) );
        this.game.event.addListener( new EventListener(EVENT_TYPE.SHIP_ENTERS_SPACE, (self, data) => this.onShipEntersSpace(data.source, data.data.ship)) );
        this.game.event.addListener( new EventListener(EVENT_TYPE.SHIP_LEAVES_SPACE, (self, data) => this.onShipLeavesSpace(data.source, data.data.ship)) );
    }
    
    /**
     * Registers are repeating timer that updates projectiles
     */
    shipUpdateTimer = new Trigger();
    initShips() {
        const SHIP_UPDATE_PERIOD = 0.03;
        this.shipUpdateTimer.registerTimerEvent(SHIP_UPDATE_PERIOD, true);
        this.shipUpdateTimer.addAction(() => this.updateShips(SHIP_UPDATE_PERIOD));

        /**
         * Also insansiate ships
         */
        udg_ship_zones.forEach(rect => {
            const bay = new ShipBay(rect)
            this.shipBays.push(bay);

            // Also for now create a ship to sit in the dock
            const ship = new Ship(this.game, ShipState.inBay);
            this.shipsForUnit.set(ship.unit, ship);
            this.ships.push(ship);

            bay.dockShip(ship);
        });
    }

    onShipEntersSpace(who: Unit, ship: Ship) {
        ship.state = ShipState.inSpace;
        const rect = Rectangle.fromHandle(gg_rct_Space);

        ship.unit.x = rect.centerX;
        ship.unit.y = rect.centerY;

        ship.onEnterSpace();
        PanCameraToTimedForPlayer(who.owner.handle, ship.unit.x, ship.unit.y, 0);
        if (who.owner.handle === GetLocalPlayer()) {
            BlzShowTerrain(false);
        }        
    }

    /**
     * The ship is leaving space and entering station... Somewhere?
     * TODO Take into account multiple landing locations
     * @param whichShip 
     * @param whichTarget 
     */
    onShipLeavesSpace(whichUnit: Unit, whichShip: Ship) {
        // We need to find a "free" dock
        const freeBay = this.shipBays.find(bay => !bay.hasDockedShip());
        if (!freeBay) {
            // Display the warning to the pilot
            return DisplayTextToPlayer(whichUnit.owner.handle, 0, 0, `No free ship bays`);
        }
        // Now we need to dock
        freeBay.dockShip(whichShip, true);
        PanCameraToTimedForPlayer(whichUnit.owner.handle, whichUnit.x, whichUnit.y, 0);
        if (whichUnit.owner.handle === GetLocalPlayer()) {
            BlzShowTerrain(true);
        }        
    }

    /**
     * Updates all ship movement
     * @param updatePeriod 
     */
    updateShips(updatePeriod: number) {
        // Update mothership
        // this.mainShip.updateThrust(updatePeriod);
        // this.mainShip.applyThrust(updatePeriod);
        
        // const oldShipPos = this.mainShip.getPosition();

        // // Dont call update position
        // const shipDelta = this.mainShip.getMomentum().multiplyN(updatePeriod);

        // // update space object
        // this.spaceObjects.forEach(o => 
        //     o.updateLocation(shipDelta)
        //      .onUpdate());

        // Now update smol ships
        this.ships.forEach(ship => ship.process(this.game, updatePeriod));
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

    /**
     * Ship abilities
     */
    private shipAbilityTrigger      = new Trigger();
    private shipAccelAbilityId      = FourCC('A001');
    private shipDeaccelAbilityId    = FourCC('A000');
    private shipStopAbilityId       = FourCC('A006');
    initShipAbilities() {
        this.shipAbilityTrigger.registerAnyUnitEvent(EVENT_PLAYER_UNIT_SPELL_EFFECT);
        this.shipAbilityTrigger.addCondition(Condition(() =>
            GetSpellAbilityId() === this.shipAccelAbilityId     ||
            GetSpellAbilityId() === this.shipDeaccelAbilityId   ||
            GetSpellAbilityId() === this.shipStopAbilityId      ||
            GetSpellAbilityId() === ABIL_DOCK_TEST
        ));

        this.shipAbilityTrigger.addAction(() => {
            const unit = GetTriggerUnit();
            const castAbilityId = GetSpellAbilityId();

            // Phew, hope you have the water running, ready for your shower  
            const u = Unit.fromHandle(unit);           
            let ship = this.shipsForUnit.get(u);

            if (!ship) Log.Error("Ship casting movement but no ship?!");
            else if (castAbilityId === this.shipAccelAbilityId) {
                ship.engine.increaseVelocity();
            }
            else if (castAbilityId === this.shipDeaccelAbilityId) {
                ship.engine.decreaseVelocity();
            }
            else if (castAbilityId === ABIL_DOCK_TEST) {
                this.game.event.sendEvent(EVENT_TYPE.SHIP_LEAVES_SPACE, {
                    source: u,
                    data: { ship: ship }
                })
            }
            else {
                ship.engine.goToAStop();
            }
        })
    }
}