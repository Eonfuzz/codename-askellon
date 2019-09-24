/** @noSelfInFile **/

import { Game } from "../game";
import { Ship } from "./ship";
import { Trigger } from "../types/jass-overrides/trigger";

export class SpaceModule {
    private game: Game;

    // These are things like minerals, asteroids
    // These will not move normally
    public spaceObjects: Object[];

    // An array of ships
    public ships: Ship[];

    constructor(game: Game) {
        this.game = game;

        this.ships          = [];
        this.spaceObjects   = [];

        this.createTestShip();

        this.initShips();
        this.initShipAbilities();
    }

    createTestShip() {
        const unitId = FourCC('h000');

        const ship = new Ship();
        ship.unit = CreateUnit(Player(0), unitId, 0, 0, bj_UNIT_FACING);

        // Add to our ship array
        this.ships.push(ship);
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
        this.ships.forEach(ship => 
            ship.updateThrust(updatePeriod)
                .applyThrust(updatePeriod)
                .updatePosition(updatePeriod));
    }

    /**
     * Gets a ship for passed unit
     * @param unit 
     */
    getShipForUnit(unit: unit): Ship | undefined {
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