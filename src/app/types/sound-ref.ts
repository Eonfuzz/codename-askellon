/** @noSelfInFile **/

export class SoundRef {
    public sound: sound;

    constructor(sound: string, looping: boolean) {
        this.sound = CreateSound(sound, looping, false, true, 0, 3, "");
        SetSoundDuration(this.sound, GetSoundFileDuration(sound));
    }

    public playSound() {
        StartSound(this.sound);
    }

    public playSoundOnUnit(unit: unit, volume: number) {
        SetSoundChannel(this.sound, 0);
        SetSoundVolume(this.sound, volume);
        SetSoundPitch(this.sound, 1.0);
        SetSoundDistances(this.sound, 2000.0, 10000.0);
        SetSoundDistanceCutoff(this.sound, 4500.0);

        AttachSoundToUnit(this.sound, unit);
        StartSound(this.sound);
    }

    public setVolume(volume: number) {
        SetSoundVolume(this.sound, volume);
    }

    public stopSound() {
        StopSound(this.sound, false, true);
    }
}

export class SoundWithCooldown extends SoundRef {

    private timePlayed: number | undefined;
    private cooldown: number;

    constructor(cooldown: number, sound: string) {
        super(sound, false);
        this.cooldown = cooldown;
    }

    /**
     * 
     * @param currentTime 
     */
    public canPlaySound(currentTime: number) {
        const doPlaySound = !this.timePlayed || ((currentTime - this.timePlayed) > this.cooldown);

        if (doPlaySound) {
            this.timePlayed = currentTime;
            // super.playSound();
            return true;
        }
        return false;
    }
}