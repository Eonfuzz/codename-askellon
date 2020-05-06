import { Vector3 } from "../types/vector3";
import { Vector2 } from "../types/vector2";
import { Unit, Effect, Timer, MapPlayer } from "w3ts/index";
import { SMOKE_TRAIL_SFX } from "resources/sfx-paths";
import { Log } from "lib/serilog/serilog";
import { fastPointInterp } from "lib/utils";
import { SoundRef } from "app/types/sound-ref";

interface ShipChemTrail {
    effect: Effect;
    life: number;
}

const afterburnerSound = new SoundRef("Sounds\\AfterburnerSound.mp3", false);
const CHEM_TRAIL_LIFETIME = 1;

export class SpaceMovementEngine {

    // Where da ship is at
    private position: Vector2;
    // Where its going
    private momentum: Vector2;
    // Where we're being pushed
    private thrust: Vector2;

    private mass = 1.0;
    protected acceleration = 200.0;
    protected accelerationBackwards = 100.0;

    private isUsingAfterburner = false;
    private afterburnerTimer = 0;

    private velocity = 0.0;
    private velocityForwardMax = 450.0;
    // Only used when moving backwards
    private velocityBackwardsMax = 200.0;

    // Are we moving backwards?
    private isMovingBackwards = false;
    // Are we trying to go to a stop?
    private isGoingToStop = false;

    private chemTrails: ShipChemTrail[] = [];

    constructor(startX: number, startY: number) {
        this.position   = new Vector2(startX, startY);
        this.momentum   = new Vector2(0, 0);
        this.thrust     = new Vector2(0, 0);
    }

    public updateThrust(towardsDegree: number, deltaTime: number) {
        const shipFacing = towardsDegree;

        // Update chem trails
        this.chemTrails = this.chemTrails.filter(c => {
            c.life -= deltaTime;
            if (c.life <= 0) {
                c.effect.destroy();
                c.effect = undefined;
                return false;
            }
            c.effect.setAlpha(MathRound(255 * (c.life / CHEM_TRAIL_LIFETIME)));
            return true;
        })

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
        return this;
    }

    public applyThrust(towardsDegree: number, deltaTime: number) {
        const maximum = this.isMovingBackwards ? this.velocityForwardMax : this.velocityBackwardsMax;
        this.momentum = this.momentum.add(this.thrust.multiplyN(deltaTime));
        const length = this.momentum.getLength();

        // Ensure we don't go beyond our maximum movement speed
        if (length > maximum) {
            this.momentum.setLengthN(maximum);
        }

        return this;
    }

    public updatePosition(towardsDegree: number, deltaTime: number, minX: number, maxX: number, minY: number, maxY: number) {
        const oldPosition = this.position;
        // Apply momentum and velocity
        let delta = this.momentum.multiplyN(deltaTime);
        // Afterburner makes you 3x as fast
        if (this.isUsingAfterburner) {
            this.afterburnerTimer += deltaTime;
            delta = delta.multiplyN(1 + (this.afterburnerTimer+1)/2);
        }
        this.position = this.position.add(delta);

        if (this.position.x < minX) this.position.x = minX;
        else if (this.position.x > maxX) this.position.x = maxX;
        if (this.position.y < minY) this.position.y = minY;
        else if (this.position.y > maxY) this.position.y = maxY;

        const dLen = delta.getLength();

        const d1 = (towardsDegree + 160) * bj_DEGTORAD;
        const d2 = (towardsDegree - 160) * bj_DEGTORAD;

        fastPointInterp(oldPosition, this.position, 1 + dLen/15).forEach((p: Vector2) => {
            const sfx1 = new Effect(
                SMOKE_TRAIL_SFX, 
                p.x + Cos(d1) * 70, 
                p.y + Sin(d1) * 70
            );
            // sfx1.setTime(0.1);
            const sfx2 = new Effect(SMOKE_TRAIL_SFX, 
                p.x + Cos(d2) * 70, 
                p.y + Sin(d2) * 70
            );
            // sfx2.setTime(0.1);
            sfx1.z = 100;
            sfx2.z = 100;

            if (this.isUsingAfterburner) {
                sfx1.setColor(255, 150, 150);
                sfx1.scale = 3;
                sfx2.setColor(255, 150, 150);
                sfx2.scale = 3;
            }
    
            this.chemTrails.push({
                effect: sfx1,
                life: CHEM_TRAIL_LIFETIME
            });
            this.chemTrails.push({
                effect: sfx2,
                life: CHEM_TRAIL_LIFETIME
            });
        });

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
        // if (!this.isGoingToStop) {
        // }
        // else {
        if (!this.isMovingBackwards && this.velocity > 0) {
            this.isGoingToStop = true;
        }
        else {
            this.decreaseVelocity();
        }
        // }
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

    public destroy() {
        this.chemTrails.forEach(c => c.effect.destroy());
    }
    
}