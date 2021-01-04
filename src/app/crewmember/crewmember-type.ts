import { Gun } from "../weapons/guns/gun";
import { ArmableUnit, ArmableUnitWithItem } from "../weapons/guns/unit-has-weapon";
import { ForceType } from "app/force/forces/force-type";
import { TECH_WEP_DAMAGE } from "resources/ability-ids";
import { ROLE_TYPES } from "../../resources/crewmember-names";
import { MapPlayer, Unit } from "w3ts";
import { BUFF_ID } from "resources/buff-ids";
import { EventEntity } from "app/events/event-entity";
import { DynamicBuffEntity } from "app/buff/dynamic-buff-entity";
import { BuffInstanceCallback } from "app/buff/buff-instance-callback-type";
import { BuffInstance } from "app/buff/buff-instance-type";
import { EVENT_TYPE } from "app/events/event-enum";
import { DynamicBuffState } from "app/buff/dynamic-buff-state";
import { getRandomBlood, getZFromXY, CreateBlood } from "lib/utils";
import { EventListener } from "app/events/event-type";
import { GunItem } from "app/weapons/guns/gun-item";

export class Crewmember extends ArmableUnitWithItem {
    public role: ROLE_TYPES;
    public name = '';
    public player: MapPlayer;

    private damageBonusMult: number = 1;

    private levelBonusStr = 0;
    private levelBonusAgi = 0;
    private levelBonusInt = 0;

    constructor(player: MapPlayer, unit: Unit, force: ForceType, role: ROLE_TYPES) {
        super(unit);

        this.player = player;
        this.unit = unit;

        this.role = role;
        
        // Listen to crewmember level ups
        // Apply bonus stats as needed
        
        EventEntity.getInstance().addListener(new EventListener(EVENT_TYPE.HERO_LEVEL_UP, (listener, data) => {
            if (data.source !== this.unit) return;
            const heroLevel = data.source.getHeroLevel();

            const strGain = MathRound(this.levelBonusStr*heroLevel) - MathRound(this.levelBonusStr*(heroLevel - 1));
            const agiGain = MathRound(this.levelBonusAgi*heroLevel) - MathRound(this.levelBonusAgi*(heroLevel - 1));
            const intGain = MathRound(this.levelBonusInt*heroLevel) - MathRound(this.levelBonusInt*(heroLevel - 1));

            unit.strength = unit.strength + strGain;
            unit.agility = unit.agility + agiGain;
            unit.intelligence = unit.intelligence + intGain;
        })); 
    }

    setUnit(unit: Unit) { this.unit = unit; }
    setRole(role: ROLE_TYPES) { this.role = role; }
    setName(name: string) { this.name = name; }
    setPlayer(player: MapPlayer) { this.player = player; }

    setStrGain(to: number) { this.retroStr(this.levelBonusStr, to); this.levelBonusStr = to; }
    setAgiGain(to: number) { this.retroAgi(this.levelBonusAgi, to); this.levelBonusAgi = to; }
    setIntGain(to: number) { this.retroInt(this.levelBonusInt, to); this.levelBonusInt = to; }
    getStrGain() { return this.levelBonusStr; }
    getAgiGain() { return this.levelBonusAgi; }
    getIntGain() { return this.levelBonusInt; }

    private retroStr(oldVal: number, newVal: number) {
        const heroLevel = this.unit.getHeroLevel();
        const gain = MathRound(newVal*heroLevel) - MathRound(oldVal*heroLevel);
        this.unit.strength = this.unit.strength + gain;
    }
    private retroAgi(oldVal: number, newVal: number) {
        const heroLevel = this.unit.getHeroLevel();
        const gain = MathRound(newVal*heroLevel) - MathRound(oldVal*heroLevel);
        this.unit.agility = this.unit.agility + gain;
    }
    private retroInt(oldVal: number, newVal: number) {
        const heroLevel = this.unit.getHeroLevel();
        const gain = MathRound(newVal*heroLevel) - MathRound(oldVal*heroLevel);
        this.unit.intelligence = this.unit.intelligence + gain;
    }

    onWeaponAdd(whichGun: GunItem) {
        this.weapon = whichGun;
    }

    onWeaponRemove(whichGun: GunItem) {
        this.weapon = undefined;
    }


    /**
     * 
     * @param game 
     */
    onDamage() {
        const resolveActive = DynamicBuffState.unitHasBuff(BUFF_ID.RESOLVE, this.unit);
        
        const maxHP = BlzGetUnitMaxHP(this.unit.handle);
        const hpPercentage  = (GetUnitState(this.unit.handle, UNIT_STATE_LIFE) - GetEventDamage()) / maxHP;

        if (GetEventDamage() > 10) {
            // Create a blood effect
            CreateBlood(this.unit.x, this.unit.y);
        }
        // GetUnitLifePercent
        if (!resolveActive && hpPercentage <= 0.3) {
            DynamicBuffEntity.getInstance().addBuff(
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
    addDespair(instance: BuffInstance, isNegative?: boolean) {
        DynamicBuffEntity.getInstance().addBuff(
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
    addResolve(instance: BuffInstance, isNegative?: boolean) {
        DynamicBuffEntity.getInstance().addBuff(
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

    updateTooltips() {
        if (this.weapon) this.weapon.updateTooltip(this.unit);
    }

    addExperience(amount: number) {
        EventEntity.getInstance().sendEvent(EVENT_TYPE.CREW_GAIN_EXPERIENCE, {
            source: this.unit,
            data: { value: amount }
        });
    }

    getIncome() {
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

        this.updateTooltips();
    }

    getDamageBonusMult() {
        return this.damageBonusMult;
    }
}