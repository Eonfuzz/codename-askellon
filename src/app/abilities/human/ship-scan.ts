import { Ability } from "../ability-type";
import { AbilityModule } from "../ability-module";
import { SoundRef } from "app/types/sound-ref";
import { Unit } from "w3ts/index";
import { Ship } from "app/space/ships/ship-type";
import { ShipState } from "app/space/ships/ship-state-type";

/** @noSelfInFile **/
const deepScanSound = new SoundRef("Sounds\\Ships\\deep_scan.mp3", false, true);
export class ShipDeepScanAbility implements Ability {

    private unit: Unit;
    private ship: Ship;

    constructor() {}

    public initialise(module: AbilityModule) {
        this.unit = Unit.fromHandle(GetTriggerUnit());
        this.ship = module.game.spaceModule.getShipForUnit(this.unit);

        const mainShip = module.game.spaceModule.mainShip

        if (GetLocalPlayer() == this.unit.owner.handle) {
            deepScanSound.playSound();
        }

        if (mainShip && mainShip.unit && mainShip.unit.isAlive()) {
            PingMinimapForPlayer(this.unit.owner.handle, mainShip.unit.x, mainShip.unit.y, 3);
        }
        
        module.game.spaceModule.ships.forEach(ship => {
            if (ship !== this.ship && ship.state === ShipState.inSpace && ship.unit) {
                PingMinimapForPlayer(this.unit.owner.handle, ship.unit.x, ship.unit.y, 3);
            }
        });

        return true;
    };

    public process(module: AbilityModule, delta: number) {
        return false;
    };

    public destroy(aMod: AbilityModule) {
        this.ship = undefined;
        return true;
    };
}