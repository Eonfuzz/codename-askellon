import { Ability } from "../ability-type";
import { AbilityModule } from "../ability-module";
import { Vector2, vectorFromUnit } from "../../types/vector2";
import { Log } from "../../../lib/serilog/serilog";
import { HIGH_QUALITY_POLYMER_ABILITY_ID } from "../../weapons/weapon-constants";
import { SPRINT_BUFF_ID } from "resources/ability-ids";
import { Vector3 } from "app/types/vector3";
import { getZFromXY } from "lib/utils";
import { SoundRef } from "app/types/sound-ref";
import { Unit } from "w3ts/index";
import { Projectile } from "app/weapons/projectile/projectile";
import { ProjectileTargetStatic, ProjectileMoverLinear } from "app/weapons/projectile/projectile-target";
import { WeaponModule } from "app/weapons/weapon-module";
import { SHIP_VOYAGER_UNIT } from "resources/unit-ids";
import { Ship, ShipState } from "app/space/ship";

/** @noSelfInFile **/
const deepScanSound = new SoundRef("Sounds\\Ships\\deep_scan.mp3", false);
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