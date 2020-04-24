/** @noSelfInFile **/
import { Game } from "../game";
import { BuffInstance, DynamicBuff, BuffInstanceDuration } from "./buff-instance";
import { SoundWithCooldown, SoundRef } from "../types/sound-ref";
import { BUFF_ID } from "resources/buff-ids";
import { Unit } from "w3ts/index";

const FREEZE_SOUND = new SoundRef('Sounds\\CryoGrenade.wav', false);
FREEZE_SOUND.setVolume(50);

/**
 * Sets movement speed to zero
 * Turnrate to molass
 * Recovers over remaining duration
 */
export class flashFreeze extends DynamicBuff {
    id = BUFF_ID.FLASH_FREEZE;

    protected doesStack = false;

    // Use this to keep track of the highest duration
    private remainingDuration = 0;
    private originalTintRed: number;
    private originalTintGreen: number;
    private originalTintBlue: number;
    private originalAlpha: number;

    private startingSpeed: number;
    private startingTurnSpeed: number;

    public addInstance(game: Game, unit: Unit, instance: BuffInstance, isNegativeInstance?: boolean) {
        super.addInstance(game, unit, instance, isNegativeInstance);

        if (!isNegativeInstance) {
            if (instance instanceof BuffInstanceDuration) {
                const i = instance as BuffInstanceDuration;
                const duration = i.endTimestamp - game.getTimeStamp();
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

    public process(game: Game, delta: number): boolean {
        const result =  super.process(game, delta);
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

    public onStatusChange(game: Game, newStatus: boolean) {
        if (newStatus) {
            if (GetLocalPlayer() === this.who.owner.handle) FREEZE_SOUND.playSound();
        }
        else {
            this.who.moveSpeed = this.startingSpeed;
            this.who.turnSpeed = this.startingTurnSpeed;
                
            this.who.setVertexColor(
                this.originalTintRed,
                this.originalTintGreen,
                this.originalTintBlue,
                this.originalAlpha
            );
        }
    }
}