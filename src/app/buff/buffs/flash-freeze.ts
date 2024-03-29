import { BuffInstance } from "../buff-instance-type";
import { SoundRef } from "../../types/sound-ref";
import { BUFF_ID } from "resources/buff-ids";
import { getElapsedTime, Unit } from "w3ts/index";
import { DynamicBuff } from "../dynamic-buff-type";
import { BuffInstanceDuration } from "../buff-instance-duration-type";


/**
 * Sets movement speed to zero
 * Turnrate to molass
 * Recovers over remaining duration
 */
export class flashFreeze extends DynamicBuff {
    id = BUFF_ID.FLASH_FREEZE;

    protected doesStack = false;
    FREEZE_SOUND = new SoundRef('Sounds\\CryoGrenade.wav', false);

    // Use this to keep track of the highest duration
    private remainingDuration = 0;
    private originalTintRed: number;
    private originalTintGreen: number;
    private originalTintBlue: number;
    private originalAlpha: number;

    private startingSpeed: number;
    private startingTurnSpeed: number;

    public addInstance(unit: Unit, instance: BuffInstance, isNegativeInstance?: boolean) {
        super.addInstance(unit, instance, isNegativeInstance);

        if (!isNegativeInstance) {
            if (instance instanceof BuffInstanceDuration) {
                const i = instance as BuffInstanceDuration;
                const duration = i.endTimestamp - getElapsedTime();
                this.remainingDuration = (duration > this.remainingDuration) 
                    ? duration 
                    : this.remainingDuration;
            }

            // Also set and get original tint
            this.startingSpeed = unit.defaultMoveSpeed;
            this.startingTurnSpeed = unit.defaultTurnSpeed;

            this.originalTintBlue = BlzGetUnitIntegerField(unit.handle, UNIT_IF_TINTING_COLOR_BLUE);
            this.originalTintRed = BlzGetUnitIntegerField(unit.handle, UNIT_IF_TINTING_COLOR_RED);
            this.originalTintGreen = BlzGetUnitIntegerField(unit.handle, UNIT_IF_TINTING_COLOR_GREEN);
            this.originalAlpha = BlzGetUnitIntegerField(unit.handle, UNIT_IF_TINTING_COLOR_ALPHA);
        }
    }

    public process(gametime: number, delta: number): boolean {
        const result =  super.process(gametime, delta);
        if (!this.isActive) return result;
        this.remainingDuration -= delta;

        const multiplier = 1 - this.remainingDuration / 7;

        this.who.moveSpeed = this.startingSpeed * multiplier;
        this.who.turnSpeed = this.startingTurnSpeed * multiplier;

        this.who.setVertexColor(
            MathRound(this.originalTintRed * multiplier),
            MathRound(this.originalTintGreen * multiplier),
            MathRound(this.originalTintBlue),
            this.originalAlpha
        );
        
        return result;
    }

    public onStatusChange(newStatus: boolean) {
        if (newStatus) {
            this.FREEZE_SOUND.setVolume(50);
            this.FREEZE_SOUND.playSoundForPlayer(this.who.owner);
        }
        else {
            this.who.moveSpeed = this.startingSpeed;
            this.who.turnSpeed = this.startingTurnSpeed;
            
            this.FREEZE_SOUND.destroy();

            this.who.setVertexColor(
                this.originalTintRed,
                this.originalTintGreen,
                this.originalTintBlue,
                this.originalAlpha
            );
        }
    }
    
}