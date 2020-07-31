/** @noSelfInFile **/
import { Ability } from "../ability-type";
import { Unit, Effect } from "w3ts";
import { BUFF_ID_ROACH_ARMOR, BUFF_ID } from "resources/buff-ids";
import { TECH_ROACH_DUMMY_UPGRADE } from "resources/ability-ids";
import { SFX_ACID_AURA, SFX_CONFLAGRATE_GREEN } from "resources/sfx-paths";
import { getZFromXY } from "lib/utils";
import { FilterIsEnemyAndAlive } from "resources/filters";
import { SoundRef } from "app/types/sound-ref";
import { DynamicBuffEntity } from "app/buff/dynamic-buff-entity";
import { BuffInstanceDuration } from "app/buff/buff-instance-duration-type";
import { Game } from "app/game";

// Damage increase each second
const MAX_DURATION = 6;
const MAX_DURATION_DAMAGE_BONUS = 30;
const MAX_DURATION_ATTACK_RANGE_BONUS = 300;

const DAMAGE_PER_SECOND = 30;
const DAMAGE_EVERY = 0.1;

const ABILITY_SLOW_ID = FourCC('A00B');

export class AcidStigmataAbility implements Ability {

    private casterUnit: Unit;
    private timeElapsed: number = 0;

    private damageGroup = CreateGroup();
    private damageTicker: number = DAMAGE_EVERY;

    private hasAttacked: boolean = false;

    private poisonAura: Effect;
    private soundRef = new SoundRef("Abilities\\Spells\\Undead\\Unsummon\\CityscapeCrystalShield1.flac", true);

    constructor() {}

    public initialise() {
        this.casterUnit = Unit.fromHandle(GetTriggerUnit());

        this.casterUnit.addAbility(FourCC('A00W'));
        UnitRemoveBuffBJ(BUFF_ID_ROACH_ARMOR, this.casterUnit.handle);

        AddUnitAnimationProperties(this.casterUnit.handle, "spell", true);
        SetPlayerTechResearched(this.casterUnit.owner.handle, TECH_ROACH_DUMMY_UPGRADE, 0);

        // Create poison aura
        this.poisonAura = new Effect(SFX_ACID_AURA, this.casterUnit.x, this.casterUnit.y);
        this.poisonAura.scale = 2.5;

        this.soundRef.playSoundOnUnit(this.casterUnit.handle, 40);

        return true;
    };

    public process(delta: number) {
        this.timeElapsed += delta;

        // Stop if time elapsed is too far
        if (this.hasAttacked || this.timeElapsed >= MAX_DURATION) {
            return false;
        }

        
        this.poisonAura.x = this.casterUnit.x;
        this.poisonAura.y = this.casterUnit.y;
        this.poisonAura.z = getZFromXY(this.casterUnit.x, this.casterUnit.y)+25;

        const mult = (this.timeElapsed / MAX_DURATION);

        this.casterUnit.setVertexColor(MathRound(255 - 255 * mult), 255, MathRound(255 - 255 * mult), 255);

        
        this.damageTicker += delta;
        if (this.damageTicker > DAMAGE_EVERY) {
            this.damageTicker -= DAMAGE_EVERY;
            // Get nearby units
            GroupEnumUnitsInRange(
                this.damageGroup, 
                this.casterUnit.x, 
                this.casterUnit.y,
                220,
                FilterIsEnemyAndAlive(this.casterUnit.owner)
            )

            ForGroup(this.damageGroup, () => this.damageUnit());
        }
        return true;
    };

    private damageUnit() {
        if (this.casterUnit) {
            const unit = GetEnumUnit();
            UnitDamageTarget(this.casterUnit.handle, 
                unit, 
                DAMAGE_PER_SECOND * DAMAGE_EVERY, 
                true, 
                true, 
                ATTACK_TYPE_MAGIC, 
                DAMAGE_TYPE_ACID, 
                WEAPON_TYPE_WHOKNOWS
            );
        }
    }
    
    public destroy() {
        if (this.casterUnit) {
                
            this.casterUnit.removeAbility(FourCC('A00W'));
            this.casterUnit.setVertexColor(255, 255, 255, 255);

            SetPlayerTechResearched(this.casterUnit.owner.handle, TECH_ROACH_DUMMY_UPGRADE, 1);
            AddUnitAnimationProperties(this.casterUnit.handle, "spell", false);

            // Now deal damage in an AOE
            const sfx = new Effect(SFX_CONFLAGRATE_GREEN, this.casterUnit.x, this.casterUnit.y);
            sfx.x = this.casterUnit.x;
            sfx.y = this.casterUnit.y;
            sfx.z = getZFromXY(this.casterUnit.x, this.casterUnit.y)+25;
            sfx.scale = 2;
            sfx.destroy();

            
            GroupEnumUnitsInRange(
                this.damageGroup, 
                this.casterUnit.x, 
                this.casterUnit.y,
                260,
                FilterIsEnemyAndAlive(this.casterUnit.owner)
            )

            ForGroup(this.damageGroup, () => {
                const unit = GetEnumUnit();
                UnitDamageTarget(this.casterUnit.handle, 
                    unit, 
                    30, 
                    true, 
                    true, 
                    ATTACK_TYPE_MAGIC, 
                    DAMAGE_TYPE_ACID, 
                    WEAPON_TYPE_WHOKNOWS
                );
                
                DynamicBuffEntity.getInstance().addBuff(
                    BUFF_ID.DESPAIR, 
                    Unit.fromHandle(unit), 
                    new BuffInstanceDuration(this.casterUnit, 40),
                    false
                );
                
                Game.getInstance().useDummyFor((dummy: unit) => {
                    SetUnitX(dummy, GetUnitX(unit));
                    SetUnitY(dummy, GetUnitY(unit) + 50);
                    IssueTargetOrder(dummy, 'slow', GetEnumUnit());
                }, ABILITY_SLOW_ID);
            });
        }

        this.soundRef.stopSound(true);
        this.poisonAura.destroy();

        return true; 
    };
}