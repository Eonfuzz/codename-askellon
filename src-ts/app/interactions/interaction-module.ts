/** @noSelfInFile **/
import { Game } from "../game";

export class InteractionModule {
    game: Game;
    
    constructor(game: Game) {
        this.game = game;
    }
}