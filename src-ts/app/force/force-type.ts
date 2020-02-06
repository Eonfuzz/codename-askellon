/** @noSelfInFile **/
import { Game } from "../game";
import { Log } from "../../lib/serilog/serilog";
import { ForceModule } from "./force-module";


export abstract class ForceType {
    // Keep track of players in force
    protected players: Array<player> = [];
    abstract name: string;

    is(name: string): boolean {
        return this.name === name;
    }

    hasPlayer(who: player): boolean {
        return this.players.indexOf(who) >= 0;
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

    /**
     * Checks the victory conditions of this force
     * Returns true if victory conditions are met
     */
    abstract checkVictoryConditions(forceModule: ForceModule): boolean;
}