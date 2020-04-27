/** @noSelfInFile **/

import { Game } from "../game";
import { Ship } from "./ship";
import { Trigger, Region, Rectangle, Unit } from "w3ts";
import { SpaceObject } from "./space-objects/space-object";
import { Asteroid } from "./space-objects/asteroid";
import { Log } from "lib/serilog/serilog";
import { ShipBay } from "./ship-bay";
import { SHIP_VOYAGER_UNIT } from "resources/unit-ids";

// For ship bay instansiation
declare const udg_ship_zones: rect[];
declare const gg_rct_Space: rect;

export class SpaceModule {
    private game: Game;

    public spaceRect: rect = gg_rct_Space;

    // These are things like minerals, asteroids
    // These will not move normally
    public spaceObjects: SpaceObject[];

    public mainShip: Ship;

    // An array of ships
    public ships: Ship[];

    public shipBays: ShipBay[];

    constructor(game: Game) {
        this.game = game;

        this.ships          = [];
        this.spaceObjects   = [];
        this.shipBays       = [];


        const spaceX = GetRectCenterX(this.spaceRect);
        const spaceY = GetRectCenterY(this.spaceRect);

        this.mainShip = new Ship(spaceX, spaceY);
        this.mainShip.unit = CreateUnit(Player(0), FourCC('h003'), spaceX, spaceY, bj_UNIT_FACING);

        this.initShips();
        this.initShipAbilities();
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
            const ship = new Unit(
                this.game.forceModule.stationProperty, 
                SHIP_VOYAGER_UNIT,
                bay.RECT.centerX,
                bay.RECT.centerY,
                bj_UNIT_FACING);
        })
    }

    /**
     * Updates all ship movement
     * @param updatePeriod 
     */
    updateShips(updatePeriod: number) {
        // Update mothership
        this.mainShip.updateThrust(updatePeriod);
        this.mainShip.applyThrust(updatePeriod);
        
        const oldShipPos = this.mainShip.getPosition();

        // Dont call update position
        const shipDelta = this.mainShip.getMomentum().multiplyN(updatePeriod);

        // update space object
        this.spaceObjects.forEach(o => 
            o.updateLocation(shipDelta)
             .onUpdate());

        // Now update smol ships
        this.ships.forEach(ship => {
            ship.updateThrust(updatePeriod)
                .applyThrust(updatePeriod)
                .updatePosition(updatePeriod, shipDelta)
        });
    }

    /**
     * Gets a ship for passed unit
     * @param unit 
     */
    getShipForUnit(unit: unit): Ship | undefined {
        if (unit === this.mainShip.unit) return this.mainShip;

        for (let ship of this.ships) {
            if (ship.unit == unit) {
                return ship;
            }
        }
    }

    getAskellonPosition() {
        const result = this.mainShip.getPosition();
        return result;
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
            GetSpellAbilityId() === this.shipStopAbilityId
        ));

        this.shipAbilityTrigger.addAction(() => {
            const unit = GetTriggerUnit();
            const castAbilityId = GetSpellAbilityId();

            // Phew, hope you have the water running, ready for your shower            
            let ship = this.getShipForUnit(unit);
            if (ship && castAbilityId === this.shipAccelAbilityId) {
                ship.increaseVelocity();
            }
            else if (ship && castAbilityId === this.shipDeaccelAbilityId) {
                ship.decreaseVelocity();
            }
            else if (ship) {
                ship.goToAStop();
            }
        })
    }
}