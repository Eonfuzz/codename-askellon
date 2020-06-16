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
import { ROLE_TYPES } from "../../resources/crewmember-names";
import { MapPlayer, Unit } from "w3ts";
import { EVENT_TYPE } from "app/events/event";
import { BUFF_ID } from "resources/buff-ids";

export class Crewmember extends ArmableUnit {
    public role: ROLE_TYPES;
    public name = '';
    public player: MapPlayer;

    private visionType: VISION_TYPE = VISION_TYPE.NORMAL;

    private crewModule: CrewModule;

    private damageBonusMult: number = 1;

    constructor(game: Game, player: MapPlayer, unit: Unit, force: ForceType, role: ROLE_TYPES) {
        super(unit);

        this.crewModule = game.crewModule;

        this.player = player;
        this.unit = unit;

        this.role = role;
    }

    setUnit(unit: Unit) { this.unit = unit; }
    setRole(role: ROLE_TYPES) { this.role = role; }
    setName(name: string) { this.name = name; }
    setPlayer(player: MapPlayer) { this.player = player; }

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
        const resolveActive = game.buffModule.unitHasBuff(BUFF_ID.RESOLVE, this.unit);

        const maxHP = BlzGetUnitMaxHP(this.unit.handle);
        const hpPercentage  = (GetUnitState(this.unit.handle, UNIT_STATE_LIFE) - GetEventDamage()) * 0.7 / maxHP;

        // GetUnitLifePercent
        if (!resolveActive && hpPercentage <= 0.3) {
            game.buffModule.addBuff(
                BUFF_ID.RESOLVE, 
                this.unit, 
                new BuffInstanceCallback(this.unit, () => GetUnitLifePercent(this.unit.handle) <= 30)
            );
        }
        
        if (resolveActive) {
            BlzSetEventDamage(GetEventDamage() * 0.7);
        }
    }

    getAccuracy(): number {
        let modifier = 0;

        const accuracy = GetHeroStatBJ(1, this.unit.handle, true);

        return accuracy;
    }

    /**
     * adds despair to the effected unit
     * if onCheckToRemove returns true this will stay active
     * @param initialDuration 
     * @param onCheckToRemove 
     */
    addDespair(game: Game, instance: BuffInstance, isNegative?: boolean) {
        game.buffModule.addBuff(
            BUFF_ID.DESPAIR, 
            this.unit, 
            instance,
            isNegative
        );
    }

    /**
     * adds resolve to the effected unit
     * if onCheckToRemove returns true this will stay active
     * @param initialDuration 
     * @param onCheckToRemove 
     */
    addResolve(game: Game, instance: BuffInstance, isNegative?: boolean) {
        game.buffModule.addBuff(
            BUFF_ID.RESOLVE, 
            this.unit, 
            instance,
            isNegative
        );
    }

    log() {
        print("+++ Crewmember Information +++");
        print("Who: "+this.name);
        print("Position: "+this.role);
    }

    updateTooltips(weaponModule: WeaponModule) {
        if (this.weapon) this.weapon.updateTooltip(weaponModule, this);
    }

    addExperience(game: Game, amount: number) {
        game.event.sendEvent(EVENT_TYPE.CREW_GAIN_EXPERIENCE, {
            source: this.unit,
            data: { value: amount }
        });
    }

    getVisionType() {
        return this.visionType;
    }

    setVisionType(type: VISION_TYPE) {
        this.visionType = type;
    }

    getIncome() {
        const crewModified = 1.0; // TODO
        const baseIncome = 200; // TODO
        const incomePerLevel = 50; // TODO

        const crewLevel = this.unit.getHeroLevel() - 1;
        const crewExperience = this.unit.experience;
        return baseIncome + incomePerLevel * crewLevel;        
    }

    /**
     * Update some constants when players finish upgrades
     */
    onPlayerFinishUpgrade() {
        const upgradeLevel = this.player.getTechCount(TECH_WEP_DAMAGE, true);

        // this.damageUpgradeLevel = upgradeLevel;
        this.damageBonusMult = upgradeLevel > 0 ? Pow(1.1, upgradeLevel) : 1;

        this.updateTooltips(this.crewModule.game.weaponModule);
    }

    getDamageBonusMult() {
        return this.damageBonusMult;
    }
}