import { BurstRifle } from "../weapons/guns/burst-rifle";
import { Gun } from "../weapons/guns/gun";
import { BuffInstance } from "../buff/buff-instance";
import { Resolve } from "../buff/resolve";
import { Game } from "../game";

/** @noSelfInFile **/

export class Crewmember {
    public role = '';
    public name = '';
    public unit: unit;
    public player: player;

    public accuracy = 100;

    public weapon: Gun | undefined;

    public resolve: Resolve

    constructor(game: Game, player: player, unit: unit) {
        this.player = player;
        this.unit = unit;
        this.resolve = new Resolve();
        this.resolve.onChange(() => this.onResolveChange(game))
    }

    setUnit(unit: unit) { this.unit = unit; }
    setRole(role: string) { this.role = role; }
    setName(name: string) { this.name = name; }
    setPlayer(player: player) { this.player = player; }

    onResolveChange(game: Game) {
        const resolveActive = this.resolve.isActiveNoCheck();

        if (resolveActive) {
            this.resolve.removeHighlightEffect(game, this);
            this.resolve.createHighlightEffect(game, this);
        }
        else if (GetUnitLifePercent(this.unit) <= 30) {
            this.resolve.createResolve(game, this, {
                startTimeStamp: game.getTimeStamp(),
                duration: 2
            });
        }
        else {
            this.resolve.removeHighlightEffect(game, this);
        }
    }

    log() {
        print("+++ Crewmember Information +++");
        print("Who: "+this.name);
        print("Position: "+this.role);
    }
}