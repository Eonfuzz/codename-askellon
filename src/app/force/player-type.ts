import { MapPlayer, Unit } from "w3ts/index";
import { ForceType } from "./forces/force-type";
import { Crewmember } from "app/crewmember/crewmember-type";

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

    addExperience(howMuch: number) {
        this.playerExperience += howMuch;
        this.force.onUnitGainsXp(this.crewmember, this.playerExperience);
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