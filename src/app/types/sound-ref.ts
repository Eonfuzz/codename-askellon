import { GameTimeElapsed } from "./game-time-elapsed";
import { getZFromXY } from "lib/utils";

export class SoundRef {
    public sound: sound;

    constructor(sound: string, looping: boolean, not3d?: boolean) {
        this.sound = CreateSound(sound, looping, !not3d, true, 0, 3, "");
        SetSoundDuration(this.sound, GetSoundFileDuration(sound));
    }

    public playSound(doKillWhenDone?: boolean) {
        StartSound(this.sound);

        if (doKillWhenDone) {
            KillSoundWhenDone(this.sound);
        }
    }

    public playSoundOnUnit(unit: unit, volume: number, doKillWhenDone?: boolean) {
        SetSoundChannel(this.sound, 0);
        SetSoundVolume(this.sound, volume);
        SetSoundPitch(this.sound, 1.0);
        SetSoundDistances(this.sound, 2000.0, 10000.0);
        SetSoundDistanceCutoff(this.sound, 4500.0);

        AttachSoundToUnit(this.sound, unit);
        StartSound(this.sound);

        if (doKillWhenDone) {
            KillSoundWhenDone(this.sound);
        }
    }

    public playSoundOnPont(x: number, y: number, volume: number, doKillWhenDone?: boolean) {
        SetSoundChannel(this.sound, 0);
        SetSoundVolume(this.sound, volume);
        SetSoundPitch(this.sound, 1.0);
        SetSoundDistances(this.sound, 2000.0, 10000.0);
        SetSoundDistanceCutoff(this.sound, 4500.0);
        
        const loc = Location(x, y);
        PlaySoundAtPointBJ(this.sound, volume, loc, getZFromXY(x, y));
        RemoveLocation(loc);
        
        if (doKillWhenDone) {
            KillSoundWhenDone(this.sound);
        }
    }

    public setVolume(volume: number) {
        SetSoundVolume(this.sound, volume);
    }

    public stopSound(noFade?: boolean) {
        StopSound(this.sound, false, !noFade);
    }

    public destroy(noFade?: boolean) {
        StopSound(this.sound, true, !noFade);
    }
}

export class SoundWithCooldown extends SoundRef {

    private timePlayed: number | undefined;
    private cooldown: number;

    constructor(cooldown: number, sound: string, isNot3d?: boolean) {
        super(sound, false, isNot3d);
        this.cooldown = cooldown;
    }

    /**
     * 
     * @param currentTime 
     */
    public canPlaySound() {
        const currentTime = GameTimeElapsed.getTime();
        const doPlaySound = !this.timePlayed || ((currentTime - this.timePlayed) > this.cooldown);

        if (doPlaySound) {
            this.timePlayed = currentTime;
            // super.playSound();
            return true;
        }
        return false;
    }
}