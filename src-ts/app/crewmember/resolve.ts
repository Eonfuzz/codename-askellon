import { Game } from "../game";


/** @noSelfInFile **/

/**
 * Resolve is a buff applied to a unit
 * Can be applied multiple times and from multiple sources
 */
export class Resolve {
    
    // How long does this buff last for
    private duration: number;

    // When was this first created
    private startTimeStamp: number;

    constructor(game: Game) {
        this.duration = 0;
        this.startTimeStamp = game.getTimeStamp();
    }
}