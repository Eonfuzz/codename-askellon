import { Vector3 } from "../types/vector3";
import { Vector2 } from "../types/vector2";

/** @noSelfInFile **/

export class Ship {

    public unit: unit | undefined;

    // Where da ship is at
    private position: Vector2;
    // Where its going
    private momentum: Vector2;
    // Where we're being pushed
    private thrust: Vector2;

    private mass = 1.0;
    private acceleration = 50.0;

    private velocity = 0.0;
    private velocity_forward_max = 500.0;
    // Only used when moving backwards
    private velocity_backwards_max = 100.0;

    // Are we moving backwards?
    private isMovingBackwards = false;

    constructor() {
        this.position   = new Vector2(0, 0);
        this.momentum   = new Vector2(0, 0);
        this.thrust     = new Vector2(0, 0);
    }

    public updateThrust(deltaTime: number) {
        if (this.unit) {
            const shipFacing = GetUnitFacing(this.unit);

            // Convert its facing into a normalised vector
            const thrust = new Vector2(
                Cos(shipFacing * bj_DEGTORAD),
                Sin(shipFacing * bj_DEGTORAD)
            );

            // Now apply velocity
            this.momentum = thrust.multiplyN( this.velocity * deltaTime );
        }
    }

    public applyThrust(deltaTime: number) {
        this.momentum = this.momentum.add(this.thrust.multiplyN(deltaTime));
    }

    public updatePosition(deltaTime: number) {
        // Apply momentum and velocity
        this.position = this.position.add(this.momentum.multiplyN(deltaTime))
    
        if (this.unit) {
            // If we have a unit, update that unit's X and Y position
            SetUnitX(this.unit, this.position.x)
            SetUnitY(this.unit, this.position.y)
        }
    }
}