/** @noSelfInFile **/
import { Gun } from "../weapons/guns/gun";
import { Resolve } from "../buff/resolve";
import { Game } from "../game";
import { ArmableUnit } from "../weapons/guns/unit-has-weapon";
import { WeaponModule } from "../weapons/weapon-module";
import { Despair } from "../buff/despair";
import { BuffInstanceCallback, BuffInstance } from "../buff/buff-instance";
import { ForceType } from "app/force/force-type";
import { Log } from "lib/serilog/serilog";
import { CrewModule } from "./crewmember-module";
import { VISION_TYPE } from "app/world/vision-type";
import { TECH_WEP_DAMAGE } from "resources/ability-ids";
import { ROLE_TYPES } from "./crewmember-names";

export class Crewmember extends ArmableUnit {
    public role: ROLE_TYPES;
    public name = '';
    public player: player;

    public resolve: Resolve;
    public despair: Despair;
    private force: ForceType;
    private visionType: VISION_TYPE = VISION_TYPE.NORMAL;

    private crewModule: CrewModule;

    private damageUpgradeLevel: number = 0;
    private damageBonusMult: number = 1;

    constructor(game: Game, player: player, unit: unit, force: ForceType, role: ROLE_TYPES) {
        super(unit);

        this.crewModule = game.crewModule;

        this.player = player;
        this.unit = unit;
        this.resolve = new Resolve(game, this);
        this.despair = new Despair(game, this);
        this.force = force;


        this.role = role;

        // Cause resolve and despair to update weapon tooltips
        this.resolve.onChange(() => this.weapon && this.updateTooltips(game.weaponModule));
        this.despair.onChange(() => this.weapon && this.updateTooltips(game.weaponModule));
    }

    setUnit(unit: unit) { this.unit = unit; }
    setRole(role: ROLE_TYPES) { this.role = role; }
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
        
        // Update our tooltips via our force
        this.force.updateForceTooltip(weaponModule.game, this);
    }

    addExperience(game: Game, amount: number) {
        // temporarily re-enable xp gain
        SuspendHeroXP(this.unit, false);

        this.force.onUnitGainsXp(game, this, amount);

        // now disable it
        SuspendHeroXP(this.unit, true);
    }

    getVisionType() {
        return this.visionType;
    }

    setVisionType(type: VISION_TYPE) {
        this.visionType = type;
    }

    /**
     * Update some constants when players finish upgrades
     */
    onPlayerFinishUpgrade() {

        const upgradeLevel = GetPlayerTechCount(this.player, TECH_WEP_DAMAGE, true);

        this.damageUpgradeLevel = upgradeLevel;
        this.damageBonusMult = upgradeLevel > 0 ? Pow(1.1, upgradeLevel) : 1;

        this.updateTooltips(this.crewModule.game.weaponModule);
    }

    getDamageBonusMult() {
        return this.damageBonusMult;
    }
}