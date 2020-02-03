/** @noSelfInFile **/
import { Gun } from "../weapons/guns/gun";
import { Resolve } from "../buff/resolve";
import { Game } from "../game";
import { ArmableUnit } from "../weapons/guns/unit-has-weapon";
import { WeaponModule } from "../weapons/weapon-module";

export class Crewmember extends ArmableUnit {
    public role = '';
    public name = '';
    public player: player;

    public accuracy = 100;

    public resolve: Resolve;
    // public despair: Despair;

    constructor(game: Game, player: player, unit: unit) {
        super(unit);

        this.player = player;
        this.unit = unit;
        this.resolve = new Resolve(game, this);
        this.resolve.doChange(() => this.onResolveDoChange(game));
        this.resolve.onChange(() => this.onResolveChange(game));
    }

    setUnit(unit: unit) { this.unit = unit; }
    setRole(role: string) { this.role = role; }
    setName(name: string) { this.name = name; }
    setPlayer(player: player) { this.player = player; }

    onWeaponAdd(weaponModule: WeaponModule, whichGun: Gun) {
        this.weapon = whichGun;
    }

    onWeaponRemove(weaponModule: WeaponModule, whichGun: Gun) {
        this.weapon = undefined;
    }

    onResolveDoChange(game: Game) {
        if (GetUnitLifePercent(this.unit) <= 30) {
            this.resolve.createResolve(game, this, {
                startTimeStamp: game.getTimeStamp(),
                duration: 3
            });
            return true;
        }
        return false;
    }

    onResolveChange(game: Game) {
        const isActive = this.resolve.isActiveNoCheck();
        this.accuracy += (isActive ? 80 : -80); 
        if (this.weapon) this.weapon.updateTooltip(game.weaponModule, this);
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