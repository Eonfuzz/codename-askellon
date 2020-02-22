/** @noSelfInFile **/
import { Gun } from "../weapons/guns/gun";
import { Resolve } from "../buff/resolve";
import { Game } from "../game";
import { ArmableUnit } from "../weapons/guns/unit-has-weapon";
import { WeaponModule } from "../weapons/weapon-module";
import { Despair } from "../buff/despair";
import { BuffInstanceCallback, BuffInstance } from "../buff/buff-instance";
import { RESOLVE_TOOLTIP, TRANSFORM_TOOLTIP } from "resources/ability-tooltips";
import { ABIL_CREWMEMBER_INFO, ABIL_TRANSFORM_ALIEN_HUMAN, ABIL_TRANSFORM_HUMAN_ALIEN } from "resources/ability-ids";
import { ForceType } from "app/force/force-type";
import { ALIEN_FORCE_NAME, AlienForce } from "app/force/alien-force";
import { Log } from "lib/serilog/serilog";
import { CrewModule } from "./crewmember-module";

export class Crewmember extends ArmableUnit {
    public role = '';
    public name = '';
    public player: player;

    public resolve: Resolve;
    public despair: Despair;
    private force: ForceType;

    private crewModule: CrewModule;

    constructor(game: Game, player: player, unit: unit, force: ForceType) {
        super(unit);

        this.crewModule = game.crewModule;

        this.player = player;
        this.unit = unit;
        this.resolve = new Resolve(game, this);
        this.despair = new Despair(game, this);
        this.force = force;

        // Cause resolve and despair to update weapon tooltips
        this.resolve.onChange(() => this.weapon && this.updateTooltips(game.weaponModule));
        this.despair.onChange(() => this.weapon && this.updateTooltips(game.weaponModule));
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

        const accuracy = GetHeroStatBJ(1, this.unit, true);
        // if (this.resolve.getIsActive()) modifier = modifier + 10;
        // if (this.despair.getIsActive()) modifier = modifier - 75;

        return accuracy;
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

    updateTooltips(weaponModule: WeaponModule) {
        if (this.weapon) this.weapon.updateTooltip(weaponModule, this);
        
        // Now update resolve tooltip
        const income = this.crewModule.calculateIncome(this);

        // TODO
        // Work out a better way of handling this?
        const isAlienForce = this.force.is(ALIEN_FORCE_NAME);
        // Log.Information("Updating player tooltip!");
        
        if (isAlienForce) {
            // Log.Information("Player is alien!");
            let alienForce = this.force as AlienForce;
            const tooltip = TRANSFORM_TOOLTIP(
                income, 
                true, 
                alienForce.getFormName()
            );
            const tfAlien = TRANSFORM_TOOLTIP(
                income, 
                false, 
                alienForce.getFormName()
            );
            if (GetLocalPlayer() === this.player) {
                BlzSetAbilityExtendedTooltip(ABIL_TRANSFORM_HUMAN_ALIEN, tooltip, 0);
                BlzSetAbilityExtendedTooltip(ABIL_TRANSFORM_ALIEN_HUMAN, tfAlien, 0);
            }
        }
        else {
            const tooltip = RESOLVE_TOOLTIP(income);
            if (GetLocalPlayer() === this.player) {
                BlzSetAbilityExtendedTooltip(ABIL_CREWMEMBER_INFO, tooltip, 0);
            }
        }
    }
}