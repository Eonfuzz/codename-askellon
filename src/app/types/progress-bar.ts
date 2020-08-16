/** @noSelfInFile **/
export const PROGRESS_BAR_MODEL_PATH = 'Models\\Progressbar.mdxx';

export class ProgressBar {
    bar: effect | undefined;

    // barMax: number = 100;
    // barMin: number = 0;
    progress: number = 0;

    isReverse: boolean = false;

    constructor() {
    }

    show(forPlayer: player) {
        this.bar = AddSpecialEffect(PROGRESS_BAR_MODEL_PATH, 0, 0);
        BlzSetSpecialEffectColorByPlayer(this.bar, forPlayer);
    }

    hide() {
        this.destroy();
    }

    moveTo(x: number, y: number, z: number) {
        if (!this.bar) return this;

        BlzSetSpecialEffectX(this.bar, x);
        BlzSetSpecialEffectY(this.bar, y);
        BlzSetSpecialEffectZ(this.bar, z);
        return this;
    }

    setPercentage(percentage: number) {
        if (!this.bar) return this;

        BlzSetSpecialEffectTime(this.bar, percentage);
        return this;
    }

    destroy() {
        if (!this.bar) return this;

        DestroyEffect(this.bar);
    }
}