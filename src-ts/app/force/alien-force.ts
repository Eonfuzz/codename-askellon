/** @noSelfInFile **/
import { Game } from "../game";
import { Log } from "../../lib/serilog/serilog";
import { ForceModule } from "./force-module";
import { ForceType } from "./force-type";


export const ALIEN_FORCE_NAME = 'ALIEN';
export class AlienForce extends ForceType {
    name = ALIEN_FORCE_NAME;
    private alienHost: player | undefined;
    
    setHost(who: player) {
        this.alienHost = who;
    }

    getHost(): player | undefined {
        return this.alienHost;
    }

    /**
     * Checks the victory conditions of this force
     * Returns true if victory conditions are met
     */
    checkVictoryConditions(forceModule: ForceModule): boolean {
        return this.players.length > 0;
    }
}