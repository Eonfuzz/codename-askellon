import { ZONE_TYPE } from "app/world/zone-id";
import { Ship } from "./ship";
import { Log } from "lib/serilog/serilog";
import { ShipAnimation, ShipAnimationExitStationDock } from "./ship-animations/ship-animations";
import { Rectangle, Region } from "w3ts/index";


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

    dockShip(ship: Ship) {
        // Check for ship dock status
        if (this.dockedShip) return Log.Error("Trying to dock into bay that already has a ship!");
        if (this.animating) return Log.Error("Trying to dock into a bay that is animating!");

        // Set docking animation state
        this.dockedShip = ship;
        this.animating = true;
    }

    launchShip() {
        // Check for dock status
        if (!this.dockedShip) return Log.Error("Trying to launch ship from dock but no ship exists");
        if (this.animating) return Log.Error("Trying to launch from bay that is already animating!");

        this.animating = true;
        this.animation = new ShipAnimationExitStationDock(this.dockedShip, this);
    }
}