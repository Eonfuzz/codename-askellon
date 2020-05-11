import { ZONE_TYPE } from "app/world/zone-id";
import { Log } from "lib/serilog/serilog";
import { ShipAnimation, ShipAnimationExitStationDock, ShipAnimationEnterStationDock } from "./ship-animations/ship-animations";
import { Rectangle, Region, Unit } from "w3ts/index";
import { Ship } from "./ship";
import { Game } from "app/game";
import { EVENT_TYPE } from "app/events/event";
import { Vector2 } from "app/types/vector2";


/**
 * A ship bay slot on the station or elsewhere
 */
export class ShipBay {
    public ZONE: ZONE_TYPE;
    public RECT: Rectangle;

    // We may not have a docked ship
    private dockedShip: Ship | undefined;
    private animating: boolean = false;

    private animation: ShipAnimation | undefined;

    // SpaceSource, where is this shipbay located
    private location: Unit;

    constructor(whichRect: rect) {
        this.RECT = Rectangle.fromHandle(whichRect);
    }

    /**
     * Can someone enter the ship in the dock
     */
    shipIsValid(): boolean {
        return this.dockedShip && !this.animating;
    }

    hasDockedShip(): boolean { return !!this.dockedShip; }
    getDockedShip(): Ship | undefined { return this.dockedShip; }
    canDockShip(): boolean { return !this.dockedShip && !this.animating; }

    dockShip(game: Game, ship: Ship, showAnimation?: boolean) {
        // Check for ship dock status
        if (this.dockedShip) return Log.Error("Trying to dock into bay that already has a ship!");
        if (this.animating) return Log.Error("Trying to dock into a bay that is animating!");

        // Set docking animation state
        if (!showAnimation) {
            this.shipDocked(game, ship);
        }
        else {
            this.animating = true;
            this.animation = new ShipAnimationEnterStationDock(ship, this);
            this.animation.onDoneCallback(() => this.shipDocked(game, ship));
        }
    }

    launchShip(game: Game, forWho: Unit) {
        // Check for dock status
        if (!this.dockedShip) return Log.Error("Trying to launch ship from dock but no ship exists");
        if (this.animating) return Log.Error("Trying to launch from bay that is already animating!");

        this.animating = true;
        this.dockedShip.onEnterShip(forWho);
        this.animation = new ShipAnimationExitStationDock(this.dockedShip, this);
        this.animation.onDoneCallback(() => {
            this.shipLaunched(game, forWho);
        });
    }

    shipLaunched(game: Game, forWho: Unit) {
        const ship = this.dockedShip;
        this.animating = false;
        this.animation = undefined;
        this.dockedShip = undefined;

        game.event.sendEvent(EVENT_TYPE.SHIP_ENTERS_SPACE, {
            source: forWho, data: { ship: ship }
        });
    }

    shipDocked(game: Game, whichShip: Ship) {
        this.animating = false;
        this.animation = undefined;
        this.dockedShip = whichShip;

        whichShip.unit.x = this.RECT.centerX;
        whichShip.unit.y = this.RECT.centerY;
        // Halt all animations
        whichShip.unit.setTimeScale(0);
        whichShip.unit.facing = 270;

        whichShip.onLeaveShip(game);
    }

    onDockedShipDeath() {
        this.animating = false;
        this.dockedShip = undefined;
        // Force destroy of the animation if we have one
        if (this.animation) {
            this.animation.destroy(true);
        }
    }
}