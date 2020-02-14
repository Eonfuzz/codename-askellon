/** @noSelfInFile **/
import { Gun } from "../weapons/guns/gun";
import { Resolve } from "../buff/resolve";
import { Game } from "../game";
import { ArmableUnit } from "../weapons/guns/unit-has-weapon";
import { WeaponModule } from "../weapons/weapon-module";
import { Despair } from "../buff/despair";
import { BuffInstanceCallback, BuffInstance } from "../buff/buff-instance";

export class Crewmember extends ArmableUnit {
    public role = '';
    public name = '';
    public player: player;

    private baseAccuracy = 100;

    public resolve: Resolve;
    public despair: Despair;

    constructor(game: Game, player: player, unit: unit) {
        super(unit);

        this.player = player;
        this.unit = unit;
        this.resolve = new Resolve(game, this);
        this.despair = new Despair(game, this);

        // Cause resolve and despair to update weapon tooltips
        this.resolve.onChange(() => this.weapon && this.weapon.updateTooltip(game.weaponModule, this));
        this.despair.onChange(() => this.weapon && this.weapon.updateTooltip(game.weaponModule, this));
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


    /**
     * 
     * @param game 
     */
    onDamage(game: Game) {
        const resolveActive = this.resolve.getIsActive();

        const maxHP = BlzGetUnitMaxHP(this.unit);
        const hpPercentage  = (GetUnitState(this.unit, UNIT_STATE_LIFE) - GetEventDamage()) * 0.7 / maxHP;

        GetUnitLifePercent
        if (!resolveActive && hpPercentage <= 0.3) {
            this.resolve.addInstance(game, this, new BuffInstanceCallback(() => {
                return GetUnitLifePercent(this.unit) <= 30;
            }));
        }
        
        if (resolveActive) {
            BlzSetEventDamage(GetEventDamage() * 0.7);
        }
    }

    getAccuracy(): number {
        let modifier = 0;

        if (this.resolve.getIsActive()) modifier = modifier + 10;
        if (this.despair.getIsActive()) modifier = modifier - 75;

        return this.baseAccuracy + modifier;
    }

    /**
     * adds despair to the effected unit
     * if onCheckToRemove returns true this will stay active
     * @param initialDuration 
     * @param onCheckToRemove 
     */
    addDespair(game: Game, instance: BuffInstance) {
        this.despair.addInstance(game, this, instance);
    }

    testResolve(game: Game) {
        SetUnitLifePercentBJ(this.unit, 0.2);
        this.resolve.addInstance(game, this, new BuffInstanceCallback(() => {
            return GetUnitLifePercent(this.unit) <= 30;
        }));
    }

    log() {
        print("+++ Crewmember Information +++");
        print("Who: "+this.name);
        print("Position: "+this.role);
    }
}