/** @noSelfInFile **/

import { Game } from "../game";
import { Ship } from "./ship";
import { Trigger } from "../types/jass-overrides/trigger";
import { SpaceObject } from "./space-objects/space-object";
import { Asteroid } from "./space-objects/asteroid";

export class SpaceModule {
    private game: Game;

    //@ts-ignore
    public spaceRect: rect = gg_rct_Space;

    // These are things like minerals, asteroids
    // These will not move normally
    public spaceObjects: SpaceObject[];

    public mainShip: Ship;

    // An array of ships
    public ships: Ship[];

    constructor(game: Game) {
        this.game = game;

        this.ships          = [];
        this.spaceObjects   = [];


        const spaceX = GetRectCenterX(this.spaceRect);
        const spaceY = GetRectCenterY(this.spaceRect);

        this.mainShip = new Ship(spaceX, spaceY);
        this.mainShip.unit = CreateUnit(Player(0), FourCC('h003'), spaceX, spaceY, bj_UNIT_FACING);

        this.createTestShip();
        let i = 0;
        while (i < 100) {
            i ++;
            this.createTestAsteroid();
        }

        this.initShips();
        this.initShipAbilities();
    }

    createTestShip() {
        const unitId = FourCC('h000');

        const spaceX = GetRectCenterX(this.spaceRect);
        const spaceY = GetRectCenterY(this.spaceRect);

        const ship = new Ship(spaceX, spaceY);
        ship.unit = CreateUnit(Player(0), unitId, spaceX, spaceY, bj_UNIT_FACING);

        // Add to our ship array
        this.ships.push(ship);
    }

    createTestAsteroid() {
        if (!this.mainShip.unit) return;

        const x = GetUnitX(this.mainShip.unit) + GetRandomReal(-2000, 2000);
        const y = GetUnitY(this.mainShip.unit) + GetRandomReal(-2000, 2000);

        const newAsteroid = new Asteroid(x, y);
        this.spaceObjects.push(newAsteroid);

        // Now load it in
        newAsteroid.load(this.game);
    }

    
    /**
     * Registers are repeating timer that updates projectiles
     */
    shipUpdateTimer = new Trigger();
    initShips() {
        const SHIP_UPDATE_PERIOD = 0.03;
        this.shipUpdateTimer.RegisterTimerEventPeriodic(SHIP_UPDATE_PERIOD);
        this.shipUpdateTimer.AddAction(() => this.updateShips(SHIP_UPDATE_PERIOD))
    }

    /**
     * Updates all ship movement
     * @param updatePeriod 
     */
    updateShips(updatePeriod: number) {
        // Update mothership
        this.mainShip.updateThrust(updatePeriod);
        this.mainShip.applyThrust(updatePeriod);

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

    /**
     * Ship abilities
     */
    private shipAbilityTrigger      = new Trigger();
    private shipAccelAbilityId      = FourCC('A001');
    private shipDeaccelAbilityId    = FourCC('A000');
    private shipStopAbilityId       = FourCC('A006');
    initShipAbilities() {
        this.shipAbilityTrigger.RegisterAnyUnitEventBJ(EVENT_PLAYER_UNIT_SPELL_EFFECT);
        this.shipAbilityTrigger.AddCondition(() =>
            GetSpellAbilityId() === this.shipAccelAbilityId     ||
            GetSpellAbilityId() === this.shipDeaccelAbilityId   ||
            GetSpellAbilityId() === this.shipStopAbilityId
        );

        this.shipAbilityTrigger.AddAction(() => {
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