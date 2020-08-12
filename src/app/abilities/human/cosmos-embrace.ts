import { Ability } from "../ability-type";
import { Unit } from "w3ts/handles/unit";
import { BUFF_ID } from "resources/buff-ids";
import { SoundRef } from "app/types/sound-ref";
import { FilterIsAlive } from "resources/filters";
import { Effect } from "w3ts/index";
import { ForceEntity } from "app/force/force-entity";
import { DynamicBuffEntity } from "app/buff/dynamic-buff-entity";
import { BuffInstanceDuration } from "app/buff/buff-instance-duration-type";
import { AbilityHooks } from "../ability-hooks";
import { ABIL_GENE_COSMIC } from "resources/ability-ids";

const SFXAt = 0.8;
const SFXEnd = 1.6;
const EmbraceCosmosCastTime = 0.9;
const EmbraceSFX = 'war3mapImported\\Void Disc.mdx';

export class EmbraceCosmosAbility implements Ability {

    private unit: Unit | undefined;
    private soundEffect = new SoundRef("Sounds\\CosmosEmbrace.mp3", false);

    private castingOrder: number;
    private timeCast = 0;
    private sfx: Effect;
    private hasDoneDamage = false;

    constructor() {}

    public initialise() {
        this.unit = Unit.fromHandle(GetTriggerUnit());
        this.soundEffect.playSoundOnUnit(this.unit.handle, 127);
        this.castingOrder = this.unit.currentOrder;

        return true;
    };

    public process(delta: number) {
        this.timeCast += delta;

        if (this.castingOrder === this.unit.currentOrder || this.timeCast > EmbraceCosmosCastTime) {
            if (this.timeCast >= SFXAt && !this.sfx) {
                const uX = this.unit.x;
                const uY = this.unit.y;

                this.sfx = Effect.fromHandle(
                    AddSpecialEffect(EmbraceSFX, uX, uY)
                );
            }
            if (this.timeCast >= EmbraceCosmosCastTime && !this.hasDoneDamage) {
                this.hasDoneDamage = true;
                this.embraceCosmosExplode();
            }
            if (this.timeCast >= SFXEnd && this.sfx) {
                return false;
            }
        }
        else if (this.timeCast < EmbraceCosmosCastTime) {
            return false;
        }

        return true;
    };

    public embraceCosmosExplode() {
        const damageGroup = CreateGroup();
        const uX = this.unit.x;
        const uY = this.unit.y;

        GroupEnumUnitsInRange(
            damageGroup, 
            this.unit.x, 
            this.unit.y,
            350,
            FilterIsAlive(this.unit.owner)
        );
        ForGroup(damageGroup, () => this.damageUnit());

        DestroyGroup(damageGroup);
    }

    private damageUnit() {
        if (this.unit) {
            const unit = Unit.fromHandle(GetEnumUnit());

            // Check to make sure we are allowed aggression between the two teams
            const aggressionAllowed = this.unit.owner === unit.owner 
                || ForceEntity.getInstance().aggressionBetweenTwoPlayers(
                    this.unit.owner, 
                    unit.owner
                );

            // If we aren't allowed aggression we stop
            // Prevents griefing etc
            if (!aggressionAllowed) return;

            const isSelfUnit = this.unit === unit;
            // Only freeze not-self
            if (!isSelfUnit) {
                DynamicBuffEntity.getInstance().addBuff(
                    BUFF_ID.FLASH_FREEZE, 
                    unit,
                    new BuffInstanceDuration(unit, 7)
                );
            }
            
            this.unit.damageTarget(
                unit.handle, 
                isSelfUnit 
                    ? this.unit.getIntelligence(true) * 2.5 + 25
                    : this.unit.getIntelligence(true) * 5 + 50, 
                0,
                true, 
                true, 
                ATTACK_TYPE_MAGIC, 
                DAMAGE_TYPE_ACID, 
                WEAPON_TYPE_WHOKNOWS
            )
        }
    }

    public destroy() {
        // Log.Information("Destroy");
        this.soundEffect.stopSound();
        if (this.sfx) {
            this.sfx.destroy();
        }
        return true;
    };
}
