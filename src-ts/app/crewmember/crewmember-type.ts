import { BurstRifle } from "../weapons/guns/burst-rifle";
import { Gun } from "../weapons/guns/gun";

/** @noSelfInFile **/

export class Crewmember {
    public role = '';
    public name = '';
    public unit: unit;
    public player: player;

    public accuracy = 100;

    public weapon: Gun | undefined;

    constructor(player: player, unit: unit) {
        this.player = player;
        this.unit = unit;
        // this.weapon = new BurstRifle();
        // this.weapon.onAdd(this);
    }

    setUnit(unit: unit) { this.unit = unit; }
    setRole(role: string) { this.role = role; }
    setName(name: string) { this.name = name; }
    setPlayer(player: player) { this.player = player; }


    log() {
        print("+++ Crewmember Information +++");
        print("Who: "+this.name);
        print("Position: "+this.role);
    }
}