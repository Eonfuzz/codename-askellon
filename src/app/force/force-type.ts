/** @noSelfInFile **/
import { Game } from "../game";
import { Log } from "../../lib/serilog/serilog";
import { ForceModule } from "./force-module";


export abstract class ForceType {
    // Keep track of players in force
    protected players: Array<player> = [];
    protected playerUnits: Map<player, unit> = new Map();

    protected forceModule: ForceModule;
    abstract name: string;
    
    constructor(fModule: ForceModule) { this.forceModule = fModule; }

    is(name: string): boolean {
        return this.name === name;
    }

    hasPlayer(who: player): boolean {
        return this.players.indexOf(who) >= 0;
    }

    getPlayers() {
        return this.players
    }

    addPlayer(who: player) {
        this.players.push(who);
    }

    removePlayer(who: player) {
        const idx = this.players.indexOf(who);

        if (idx >= 0) {
            this.players.splice(idx, 1);
        }
    }

    public addPlayerMainUnit(game: Game, whichUnit: unit, player: player): void {
        this.playerUnits.set(player, whichUnit);
    };

    /**
     * Checks the victory conditions of this force
     * Returns true if victory conditions are met
     */
    abstract checkVictoryConditions(forceModule: ForceModule): boolean;
}