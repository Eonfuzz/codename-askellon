/** @noSelfInFile **/
export const PROGRESS_BAR_MODEL_PATH = 'Models//ProgressBar.mdx';

export class ProgressBar {
    bar: effect;

    barMax: number = 100;
    barMin: number = 0;

    isReverse: boolean = false;

    constructor() {
        this.bar = AddSpecialEffect(PROGRESS_BAR_MODEL_PATH, 0, 0);
    }

    moveTo(x: number, y: number) {
        BlzSetSpecialEffectX(this.bar, x);
        BlzSetSpecialEffectY(this.bar, y);
    }

    progressBar() {}

    destroy() {
        DestroyEffect(this.bar);
    }
}