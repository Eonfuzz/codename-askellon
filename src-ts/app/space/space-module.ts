/** @noSelfInFile **/

import { Game } from "../game";

export class SpaceModule {
    private game: Game;

    public spaceObjects: Object[];

    constructor(game: Game) {
        this.game = game;

        this.spaceObjects = new Array();
    }
}