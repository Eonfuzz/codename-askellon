import { Vector3 } from "../types/vector3";
import { Vector2 } from "../types/vector2";
import { Unit, Effect, Timer, MapPlayer } from "w3ts/index";
import { SMOKE_TRAIL_SFX } from "resources/sfx-paths";
import { Log } from "lib/serilog/serilog";
import { fastPointInterp } from "lib/utils";
import { SoundRef } from "app/types/sound-ref";

interface ShipChemTrail {
    effect: effect;
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

    public mass = 200;
    private airBreakMass = 750;

    protected acceleration = 400.0;
    protected accelerationBackwards = 100.0;

    private isUsingAfterburner = false;
    private afterburnerTimer = 0;

    private velocity = 0.0;
    public velocityForwardMax = 750.0;
    // Only used when moving backwards

    // Are we moving backwards?
    private isMovingBackwards = false;
    // Are we trying to go to a stop?
    private isGoingToStop = false;

    private facingAngleLastIteration = 0;
    private goal: Vector2 = new Vector2(0, 0);

    private chemTrails: ShipChemTrail[] = [];
    public doCreateTrails = true;

    constructor(startX: number, startY: number, initialGoal: Vector2) {
        this.position   = new Vector2(startX, startY);
        this.momentum   = new Vector2(0, 0);
        this.thrust     = new Vector2(0, 0);

        this.goal = initialGoal;
    }

    public updateThrust(deltaTime: number) {
        // Update chem trails
        if (this.doCreateTrails) {
            this.chemTrails = this.chemTrails.filter(c => {
                c.life -= deltaTime;
                if (c.life <= 0) {
                    DestroyEffect(c.effect);
                    c.effect = undefined;
                    return false;
                }
                BlzSetSpecialEffectAlpha(c.effect, MathRound(255 * (c.life / CHEM_TRAIL_LIFETIME)));
                return true;
            })
        }
        
        // Convert its facing into a normalised vector
        const thrust = this.goal.normalise();

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

        if (this.doCreateTrails) this.updateChemTrails(delta, oldPosition);

        return this;
    }

    private updateChemTrails(delta: Vector2, oldPosition: Vector2) {
        
        const dLen = delta.getLength();

        const d1 = (this.facingAngleLastIteration + 160) * bj_DEGTORAD;
        const d2 = (this.facingAngleLastIteration - 160) * bj_DEGTORAD;

        fastPointInterp(oldPosition, this.position, 1 + dLen/20).forEach((p: Vector2) => {
            const sfx1 = AddSpecialEffect(
                SMOKE_TRAIL_SFX, 
                p.x + Cos(d1) * 70, 
                p.y + Sin(d1) * 70
            );
                
            // sfx1.setTime(0.1);
            const sfx2 = AddSpecialEffect(
                SMOKE_TRAIL_SFX, 
                p.x + Cos(d2) * 70, 
                p.y + Sin(d2) * 70
            );
                
            // sfx2.setTime(0.1);
            BlzSetSpecialEffectZ(sfx1, 100);
            BlzSetSpecialEffectZ(sfx2, 100);

            if (this.isUsingAfterburner) {
                BlzSetSpecialEffectColor(sfx1, 255, 150, 150);
                BlzSetSpecialEffectColor(sfx2, 255, 150, 150);
                BlzSetSpecialEffectScale(sfx1, 3);
                BlzSetSpecialEffectScale(sfx2, 3);
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
        // if (!this.isGoingToStop) {
        // }
        // else {
        if (!this.isMovingBackwards && this.velocity > 0) {
            this.isGoingToStop = true;
            // this.velocity = 0;
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
        this.chemTrails.forEach(c => DestroyEffect(c.effect));
    }

    /**
     * 
     * @param newGoal 
     */
    setGoal(newGoal: Vector2) {
        this.goal = newGoal.subtract(this.getPosition());
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