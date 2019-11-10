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
        this.resolve = new Resolve(game, this);
        this.resolve.doChange(() => this.onResolveDoChange(game));
    }

    setUnit(unit: unit) { this.unit = unit; }
    setRole(role: string) { this.role = role; }
    setName(name: string) { this.name = name; }
    setPlayer(player: player) { this.player = player; }

    onResolveDoChange(game: Game) {
        // print("Unit life: "+GetUnitLifePercent(this.unit));
        if (GetUnitLifePercent(this.unit) <= 30) {
            this.resolve.createResolve(game, this, {
                startTimeStamp: game.getTimeStamp(),
                duration: 3
            });
            return true;
        }
        // print("DO NOT continue");
        return false;
    }

    /**
     * 
     * @param game 
     */
    onDamage(game: Game) {
        const resolveActive = this.resolve.isActiveNoCheck();

        const maxHP = BlzGetUnitMaxHP(this.unit);
        const hpPercentage  = (GetUnitState(this.unit, UNIT_STATE_LIFE) - GetEventDamage()) * 0.7 / maxHP;

        if (hpPercentage <= 0.3) {
            this.resolve.createResolve(game, this, {
                startTimeStamp: game.getTimeStamp(),
                duration: 2
            });
            return true;
        }

        if (resolveActive) {
            BlzSetEventDamage(GetEventDamage() * 0.7);
        }
    }

    log() {
        print("+++ Crewmember Information +++");
        print("Who: "+this.name);
        print("Position: "+this.role);
    }
}