import { Ability } from "../ability-type";
import { AbilityModule } from "../ability-module";
import { Vector2, vectorFromUnit } from "../../types/vector2";
import { Log } from "../../../lib/serilog/serilog";
import { HIGH_QUALITY_POLYMER_ABILITY_ID } from "../../weapons/weapon-constants";
import { SPRINT_BUFF_ID, ABIL_SHIP_BARREL_ROLL_RIGHT } from "resources/ability-ids";
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
const bulletModel = "war3mapImported\\Bullet.mdx";
export class ShipBarrelRoll implements Ability {

    private unit: Unit;
    private ship: Ship;
    private timeElapsed = 0;


    private isRollRight: boolean = false;
    private shipMaxSpeed: number;
    private movementVector: Vector2;
    private rollDuration: number = 0.5;

    constructor() {}

    public initialise(module: AbilityModule) {
        this.unit = Unit.fromHandle(GetTriggerUnit());
        this.ship = module.game.spaceModule.getShipForUnit(this.unit);

        this.isRollRight = GetSpellAbilityId() === ABIL_SHIP_BARREL_ROLL_RIGHT;


        this.shipMaxSpeed = this.ship.engine.velocityForwardMax;
        this.movementVector = new Vector2(0, 0).applyPolarOffset(
            this.ship.unit.facing + (this.isRollRight ? 90 : - 90),
            600/this.rollDuration
        );
        return true;
    }

    public process(module: AbilityModule, delta: number) {
        this.timeElapsed += delta;

        if (!this.ship.engine) return false;

        const pos = this.ship.engine.getPosition().add(this.movementVector.multiplyN(delta));
        this.ship.engine.setPosition(pos);

        // this.ship.unit.setField(UNIT_RF_MAXIMUM_PITCH_ANGLE_DEGREES, -90);

        return this.timeElapsed <= this.rollDuration;
    }

    public destroy(aMod: AbilityModule) {
        // this.ship.unit.setField(UNIT_RF_MAXIMUM_PITCH_ANGLE_DEGREES, 45);
        return true;
    }
}