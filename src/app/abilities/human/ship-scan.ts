import { Ability } from "../ability-type";
import { SoundRef } from "app/types/sound-ref";
import { Unit } from "w3ts/index";
import { Ship } from "app/space/ships/ship-type";
import { ShipState } from "app/space/ships/ship-state-type";
import { SpaceEntity } from "app/space/space-module";

/** @noSelfInFile **/
const deepScanSound = new SoundRef("Sounds\\Ships\\deep_scan.mp3", false, true);
export class ShipDeepScanAbility implements Ability {

    private unit: Unit;
    private ship: Ship;

    constructor() {}

    public initialise() {
        this.unit = Unit.fromHandle(GetTriggerUnit());

        const spaceEntity = SpaceEntity.getInstance();

        this.ship = spaceEntity.getShipForUnit(this.unit);

        const mainShip = spaceEntity.mainShip
        const planet = spaceEntity.planet;

        if (GetLocalPlayer() == this.unit.owner.handle) {
            deepScanSound.playSound();
        }

        if (mainShip && mainShip.unit && mainShip.unit.isAlive()) {
            PingMinimapForPlayer(this.unit.owner.handle, mainShip.unit.x, mainShip.unit.y, 3);
        }
        if (planet && planet.isAlive()) {
            PingMinimapForPlayer(this.unit.owner.handle, planet.x, planet.y, 3);
        }
        
        spaceEntity.ships.forEach(ship => {
            if (ship !== this.ship && ship.state === ShipState.inSpace && ship.unit) {
                PingMinimapForPlayer(this.unit.owner.handle, ship.unit.x, ship.unit.y, 3);
            }
        });

        return true;
    };

    public process(moduldelta: number) {
        return false;
    };

    public destroy() {
        this.ship = undefined;
        return true;
    };
}