/** @noSelfInFile **/
import { Ability } from "../ability-type";
import { AbilityModule } from "../ability-module";
import { Trigger, Unit, Effect } from "w3ts";
import { BUFF_ID_ROACH_ARMOR } from "resources/buff-ids";
import { TECH_20_RANGE_UPGRADE, TECH_ROACH_DUMMY_UPGRADE } from "resources/ability-ids";
import { ALIEN_ACID_BALL } from "resources/sfx-paths";

// Damage increase each second
const MAX_DURATION = 6;
const MAX_DURATION_DAMAGE_BONUS = 30;
const MAX_DURATION_ATTACK_RANGE_BONUS = 300;

export class AcidHurl implements Ability {

    private casterUnit: Unit;
    private timeElapsed: number = 0;

    private rangeIncreaseTimer: number = 0;
    private baseAttack1Damage: number = 0;
    private totalBonusDamage: number = 0;

    private hasAttacked: boolean = false;

    constructor() {}

    public initialise(abMod: AbilityModule) {
        this.casterUnit = Unit.fromHandle(GetTriggerUnit());

        // Get attack 1 base
        this.baseAttack1Damage = BlzGetUnitWeaponIntegerField(this.casterUnit.handle, UNIT_WEAPON_IF_ATTACK_DAMAGE_BASE, 0);


        BlzSetUnitWeaponIntegerField(this.casterUnit.handle, UNIT_WEAPON_IF_ATTACK_ATTACK_TYPE, 0, 4);
        BlzSetUnitWeaponIntegerField(this.casterUnit.handle, UNIT_WEAPON_IF_ATTACK_TARGETS_ALLOWED, 0, 2);
        
        BlzSetUnitWeaponRealField(this.casterUnit.handle, UNIT_WEAPON_RF_ATTACK_PROJECTILE_SPEED, 0, 450);
        BlzSetUnitWeaponRealField(this.casterUnit.handle, UNIT_WEAPON_RF_ATTACK_PROJECTILE_SPEED, 1, 450);

        BlzSetUnitWeaponStringField(this.casterUnit.handle, UNIT_WEAPON_SF_ATTACK_PROJECTILE_ART, 0, ALIEN_ACID_BALL);
        BlzSetUnitWeaponStringField(this.casterUnit.handle, UNIT_WEAPON_SF_ATTACK_PROJECTILE_ART, 1, ALIEN_ACID_BALL);

        SetPlayerTechResearched(this.casterUnit.owner.handle, TECH_20_RANGE_UPGRADE, 5);
        SetPlayerTechResearched(this.casterUnit.owner.handle, TECH_ROACH_DUMMY_UPGRADE, 0);

        BlzUnitDisableAbility(this.casterUnit.handle, FourCC('A00X'), false, false);
        UnitRemoveBuffBJ(BUFF_ID_ROACH_ARMOR, this.casterUnit.handle);

        AddUnitAnimationProperties(this.casterUnit.handle, "spell", true);

        return true;
    };

    public process(abMod: AbilityModule, delta: number) {
        this.timeElapsed += delta;

        // Stop if time elapsed is too far
        if (this.hasAttacked || this.timeElapsed >= MAX_DURATION) {
            return false;
        }

        
        const mult = (this.timeElapsed / MAX_DURATION);
        this.totalBonusDamage = mult * MAX_DURATION_DAMAGE_BONUS;

        BlzSetUnitBaseDamage(this.casterUnit.handle, MathRound(this.totalBonusDamage + this.baseAttack1Damage), 0);

        let when = MAX_DURATION / (MAX_DURATION_ATTACK_RANGE_BONUS / 20);
        this.rangeIncreaseTimer += delta;
        if (this.rangeIncreaseTimer >= when) {            
            this.rangeIncreaseTimer -= when;
            SetPlayerTechResearched(this.casterUnit.owner.handle, TECH_20_RANGE_UPGRADE, MathRound(this.timeElapsed / when)+5);
        }

        this.casterUnit.setVertexColor(MathRound(255 - 255 * mult), 255, MathRound(255 - 255 * mult), 255);


        return true;
    };
    
    public destroy(abMod: AbilityModule) {
        if (this.casterUnit) {
                

            BlzSetUnitWeaponIntegerField(this.casterUnit.handle, UNIT_WEAPON_IF_ATTACK_ATTACK_TYPE, 0, 3);
            BlzSetUnitWeaponIntegerField(this.casterUnit.handle, UNIT_WEAPON_IF_ATTACK_TARGETS_ALLOWED, 0, 2);
            BlzSetUnitWeaponStringField(this.casterUnit.handle, UNIT_WEAPON_SF_ATTACK_PROJECTILE_ART, 0, "");
            BlzSetUnitWeaponStringField(this.casterUnit.handle, UNIT_WEAPON_SF_ATTACK_PROJECTILE_ART, 1, "");
            BlzSetUnitBaseDamage(this.casterUnit.handle, MathRound(this.baseAttack1Damage), 0);
            SetPlayerTechResearched(this.casterUnit.owner.handle, TECH_20_RANGE_UPGRADE, 0);

            BlzSetUnitWeaponRealField(this.casterUnit.handle, UNIT_WEAPON_RF_ATTACK_PROJECTILE_SPEED, 0, 4000);
            BlzSetUnitWeaponRealField(this.casterUnit.handle, UNIT_WEAPON_RF_ATTACK_PROJECTILE_SPEED, 1, 4000);
            this.casterUnit.setVertexColor(255, 255, 255, 255);

            BlzUnitDisableAbility(this.casterUnit.handle, FourCC('A00X'), true, false);
            SetPlayerTechResearched(this.casterUnit.owner.handle, TECH_ROACH_DUMMY_UPGRADE, 1);

            AddUnitAnimationProperties(this.casterUnit.handle, "spell", false);
        }

        // Destroy attack observer
        // this.attackObserver.destroy();

        return true; 
    };
}