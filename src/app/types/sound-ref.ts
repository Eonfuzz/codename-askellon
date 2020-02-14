/** @noSelfInFile **/

export class SoundRef {
    protected sound: sound;

    constructor(sound: string, looping: boolean) {
        this.sound = CreateSound(sound, looping, false, false, 0, 3, "");
    }

    public playSound() {
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