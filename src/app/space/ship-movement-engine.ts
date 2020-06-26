import { Vector2 } from "../types/vector2";
import { Timer, MapPlayer } from "w3ts/index";
import { SoundRef } from "app/types/sound-ref";

interface ShipChemTrail {
    effect: effect;
    life: number;
}

const afterburnerSound = new SoundRef("Sounds\\AfterburnerSound.mp3", false);

export class SpaceMovementEngine {

    // Where da ship is at
    private position: Vector2;
    // Where its going
    private momentum: Vector2;
    // Where we're being pushed
    private thrust: Vector2;

    public mass = 200;
    private airBreakMass = 750;

    protected acceleration = 400.0;
    protected accelerationBackwards = 100.0;

    private isUsingAfterburner = false;
    private afterburnerTimer = 0;

    private velocity = 0.0;
    public velocityForwardMax = 550.0;

    public maxTurningArc = 60;
    // Only used when moving backwards

    // Are we moving backwards?
    private isMovingBackwards = false;
    // Are we trying to go to a stop?
    private isGoingToStop = false;

    private facingAngleLastIteration = 0;
    private goal: Vector2;
    private angleToGoal: number;

    constructor(startX: number, startY: number, initialGoal: Vector2) {
        this.position   = new Vector2(startX, startY);
        this.momentum   = new Vector2(0, 0);
        this.thrust     = new Vector2(0, 0);

        this.setGoal(initialGoal);
    }

    public updateThrust(deltaTime: number) {
        // Update chem trails        
        // Plot the goal towards our turning arc
        let thrust = this.goal.normalise();

        // Now apply velocity
        this.thrust = thrust.multiplyN( this.velocity );

        if (this.isMovingBackwards) {
            this.thrust = this.thrust.multiplyN(-1);
        }
        return this;
    }

    public applyThrust(deltaTime: number) {
        const maximum = this.velocityForwardMax;
        
        // Reduce by mass
        const mLen = this.momentum.getLength();
        const mass = this.isGoingToStop ? this.airBreakMass : this.mass;

        // Reduce it by mass
        this.momentum = this.momentum.setLengthN( Math.max(0, mLen - mass*deltaTime) );

        // Now add thrust
        this.momentum = this.momentum.add(this.thrust.multiplyN(deltaTime));
        const length = this.momentum.getLength();

        // Ensure we don't go beyond our maximum movement speed
        if (length > maximum) {
            this.momentum = this.momentum.setLengthN(maximum);
        }

        // Update facing angle from momentum
        if (length > 1) this.updateFacingAngle();

        return this;
    }

    public updatePosition(deltaTime: number, minX: number, maxX: number, minY: number, maxY: number) {

        const oldPosition = this.position;
        // Apply momentum and velocity
        let delta = this.momentum.multiplyN(deltaTime);
        // Afterburner makes you 3x as fast
        if (this.isUsingAfterburner) {
            this.afterburnerTimer += deltaTime;
            const modifier = 1 + (this.afterburnerTimer+1)/2;
            delta = delta.multiplyN(modifier);
        }
        this.position = this.position.add(delta);

        if (this.position.x < minX) this.position.x = minX;
        else if (this.position.x > maxX) this.position.x = maxX;
        if (this.position.y < minY) this.position.y = minY;
        else if (this.position.y > maxY) this.position.y = maxY;

        return this;
    }

    /**
     * Increases velocity
     */
    public increaseVelocity() {
        this.isGoingToStop = false;
        this.velocity = this.acceleration;
        return this;
    }

    /**
     * Ship tries to go to a complete stop
     */
    public goToAStop() {
        if (!this.isMovingBackwards && this.velocity > 0) {
            this.isGoingToStop = true;
        }
        return this;
    }

    public getMomentum() {
       return this.momentum; 
    }

    public getPosition() {
        return this.position;
    }

    public setPosition(pos: Vector2) {
        this.position = pos;
    }

    public engageAfterburner(forWho: MapPlayer) {
        this.isUsingAfterburner = true;
        this.afterburnerTimer = 0;

        // Start shaking screen
        CameraSetSourceNoiseForPlayer(forWho.handle, 10, 50);
        if (GetLocalPlayer() == forWho.handle) {
            afterburnerSound.playSound();
        }

        const t = new Timer();
        t.start(6, false, () => {
            this.isUsingAfterburner = false;
            t.destroy();
            CameraClearNoiseForPlayer(forWho.handle);
        });
    }

    public destroy() {}

    /**
     * 
     * @param newGoal 
     */
    setGoal(newGoal: Vector2) {
        this.goal = newGoal.subtract(this.getPosition());
        this.angleToGoal = Rad2Deg(Atan2(this.goal.y, this.goal.x));
    }


    /**
     * Converts momentum into facing angle
     */
    private updateFacingAngle() {
        return this.facingAngleLastIteration = Rad2Deg(Atan2(this.momentum.y, this.momentum.x));        
    }

    public getFacingAngle() {
        return this.facingAngleLastIteration;
    }
}