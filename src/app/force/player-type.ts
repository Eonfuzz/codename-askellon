import { MapPlayer, Unit } from "w3ts/index";
import { ForceType } from "./force-type";
import { Log } from "lib/serilog/serilog";
import { Crewmember } from "app/crewmember/crewmember-type";
import { Game } from "app/game";

export class PlayerWithForce {

    public player: MapPlayer;
    private force: ForceType;
    private crewmember: Crewmember;

    // The player experience shared across all agents
    private playerExperience: number = 0;

    constructor(player: MapPlayer) {
        this.player = player;
    }

    setForce(force: ForceType) {
        this.force = force;
    }

    getForce() {
        return this.force;
    }

    setExperience(to: number) {
        this.playerExperience = to;
    }

    addExperience(game: Game, howMuch: number) {
        this.playerExperience += howMuch;
        this.force.onUnitGainsXp(game, this.crewmember, this.playerExperience);
    }

    getExperience() {
        return this.playerExperience;
    }

    setCrewmember(to: Crewmember) {
        this.crewmember = to;
    }

    getCrewmember() {
        return this.crewmember;
    }
}