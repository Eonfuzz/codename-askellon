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
    private acceleration = 200.0;
    private accelerationBackwards = 25.0;

    private velocity = 0.0;
    private velocityForwardMax = 1200.0;
    // Only used when moving backwards
    private velocityBackwardsMax = 500.0;

    // Are we moving backwards?
    private isMovingBackwards = false;
    // Are we trying to go to a stop?
    private isGoingToStop = false;

    constructor() {
        this.position   = new Vector2(0, 0);
        this.momentum   = new Vector2(0, 0);
        this.thrust     = new Vector2(0, 0);
    }

    public updateThrust(deltaTime: number) {
        if (this.unit) {
            const shipFacing = GetUnitFacing(this.unit);

            // Go to a stop if possible
            if (this.isGoingToStop) {
                const changeBy = this.isMovingBackwards ? this.acceleration : this.accelerationBackwards;
                if (this.velocity < changeBy) {
                    this.velocity = 0;
                    this.isGoingToStop = false;
                }
                else {
                    this.velocity = this.velocity - changeBy;
                }
            }
            
            // Convert its facing into a normalised vector
            const thrust = new Vector2(
                Cos(shipFacing * bj_DEGTORAD),
                Sin(shipFacing * bj_DEGTORAD)
            );

            // Now apply velocity
            this.momentum = thrust.multiplyN( this.velocity );

            if (this.isMovingBackwards) {
                this.momentum = new Vector2(-this.momentum.x, -this.momentum.y)
            }
        }
        return this;
    }

    public applyThrust(deltaTime: number) {
        const maximum = this.isMovingBackwards ? this.velocityForwardMax : this.velocityBackwardsMax;
        this.momentum = this.momentum.add(this.thrust.multiplyN(deltaTime));
        const length = this.momentum.getLength();

        // Ensure we don't go beyond our maximum movement speed
        if (length > maximum) {
            this.momentum.setLengthN(maximum);
        }

        return this;
    }

    public updatePosition(deltaTime: number) {
        // Apply momentum and velocity
        this.position = this.position.add(this.momentum.multiplyN(deltaTime))
    
        if (this.unit) {
            // If we have a unit, update that unit's X and Y position
            SetUnitX(this.unit, this.position.x)
            SetUnitY(this.unit, this.position.y)
        }
        return this;
    }

    /**
     * Increases velocity
     */
    public increaseVelocity() {
        this.isGoingToStop = false;
        // Allow us to go backwards
        if (this.isMovingBackwards) {
            this.velocity -= this.acceleration;
            if (this.velocity < 0) {
                this.isMovingBackwards = false;
                this.velocity = this.acceleration + this.velocity;
            }
        }
        // Otherwise increase velocity
        else {
            this.velocity += this.acceleration;
        }

        this.applyVelocityCap();
        return this;
    }

    /**
     * Decreases velocity
     * May cause the ship to go backwards
     */
    public decreaseVelocity() {
        this.isGoingToStop = false;
        // Allow us to go backwards
        if (!this.isMovingBackwards) {
            this.velocity -= this.accelerationBackwards;
            if (this.velocity < 0) {
                this.isMovingBackwards = true;
                this.velocity = this.accelerationBackwards + this.velocity;
            }
        }
        // Otherwise increase velocity
        else {
            this.velocity += this.accelerationBackwards;
        }

        this.applyVelocityCap();
        return this;
    }

    private applyVelocityCap() {
        if (this.isMovingBackwards) {
            // Make sure we haven't gone over the cap
            if (this.velocity > this.velocityBackwardsMax) {
                this.velocity = this.velocityBackwardsMax;
            }
        }
        else {
            // Make sure we haven't gone over the cap
            if (this.velocity > this.velocityForwardMax) {
                this.velocity = this.velocityForwardMax;
            }            
        }
    }

    /**
     * Ship tries to go to a complete stop
     */
    public goToAStop() {
        this.isGoingToStop = true;
        return this;
    }
}