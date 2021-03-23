import { AbilityWithDone } from "../ability-type";
import { Vector2 } from "../../types/vector2";
import { ABIL_SHIP_BARREL_ROLL_RIGHT } from "resources/ability-ids";
import { Unit } from "w3ts/index";
import { Ship } from "app/space/ships/ship-type";
import { SpaceEntity } from "app/space/space-module";

const bulletModel = "war3mapImported\\Bullet.mdx";
export class ShipBarrelRoll extends AbilityWithDone {

    private unit: Unit;
    private ship: Ship;
    private timeElapsed = 0;


    private isRollRight: boolean = false;
    private shipMaxSpeed: number;
    private movementVector: Vector2;
    private rollDuration: number = 0.25;
    private rollSlowDown: number = 0.5;
    private rollDistance: number = 200;
    private rollLength: number;

    private playingAnim = false;

    

    public init() {
        super.init();
        this.unit = Unit.fromHandle(GetTriggerUnit());
        this.ship = SpaceEntity.getInstance().getShipForUnit(this.unit);

        this.isRollRight = GetSpellAbilityId() === ABIL_SHIP_BARREL_ROLL_RIGHT;

        this.rollLength = this.rollDistance/this.rollDuration;

        this.shipMaxSpeed = this.ship.engine.velocityForwardMax;
        this.movementVector = new Vector2(0, 0).applyPolarOffset(
            this.ship.unit.facing + (this.isRollRight ? 90 : - 90),
            this.rollLength
        );
        return true;
    }

    public step(delta: number) {

        if (this.playingAnim === false) {
            this.playingAnim = true;
            this.unit.pauseEx(true);
            this.unit.setTimeScale(2);
            this.unit.setAnimation(this.isRollRight ? 6 : 5);
        }

        this.timeElapsed += delta;

        if (!this.ship.engine) return this.done = true;

        const pos = this.ship.engine.getPosition().add(this.movementVector.multiplyN(delta));
        this.ship.engine.setPosition(pos);

        let angle;
        if (this.isRollRight) 
            angle = -360 * (this.timeElapsed / this.rollDuration);
        else
            angle = -360 + 360 * (this.timeElapsed / this.rollDuration);
        this.ship.unit.setField(UNIT_RF_MAXIMUM_PITCH_ANGLE_DEGREES, angle);

        if (this.timeElapsed >= this.rollDuration) {
            let nTime = this.timeElapsed - this.rollDuration;

            this.movementVector = this.movementVector.setLengthN(this.rollLength - this.rollLength * (nTime / this.rollSlowDown));
        }

        if (this.timeElapsed >= (this.rollDuration + this.rollSlowDown)) this.done = true;
    }

    public destroy() {
        this.ship.unit.setField(UNIT_RF_MAXIMUM_PITCH_ANGLE_DEGREES, 45);
        this.unit.pauseEx(false);
        this.unit.setTimeScale(1);
        return true;
    }
}