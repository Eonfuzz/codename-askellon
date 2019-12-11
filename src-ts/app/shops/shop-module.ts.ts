/** @noSelfInFile **/
import { Game } from "../game";

class SharedShop {
    private unit: unit;
    private playerUnits: Array<unit>;

    constructor(mainUnit: unit) {
        this.unit = mainUnit;
        this.playerUnits = [];
    }
}


export class ShopModule {   

    constructor(game: Game) {
    }
}