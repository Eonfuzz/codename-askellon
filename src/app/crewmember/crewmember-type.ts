import { Gun } from "../weapons/guns/gun";
import { ArmableUnit } from "../weapons/guns/unit-has-weapon";
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

export class Crewmember extends ArmableUnit {
    public role: ROLE_TYPES;
    public name = '';
    public player: MapPlayer;

    private damageBonusMult: number = 1;

    constructor(player: MapPlayer, unit: Unit, force: ForceType, role: ROLE_TYPES) {
        super(unit);

        this.player = player;
        this.unit = unit;

        this.role = role;
    }

    setUnit(unit: Unit) { this.unit = unit; }
    setRole(role: ROLE_TYPES) { this.role = role; }
    setName(name: string) { this.name = name; }
    setPlayer(player: MapPlayer) { this.player = player; }

    onWeaponAdd(whichGun: Gun) {
        this.weapon = whichGun;
    }

    onWeaponRemove(whichGun: Gun) {
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
        if (this.weapon) this.weapon.updateTooltip(this);
    }

    addExperience(amount: number) {
        EventEntity.getInstance().sendEvent(EVENT_TYPE.CREW_GAIN_EXPERIENCE, {
            source: this.unit,
            data: { value: amount }
        });
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

        this.updateTooltips();
    }

    getDamageBonusMult() {
        return this.damageBonusMult;
    }
}