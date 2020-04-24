import { COL_MISC, COL_RESOLVE, COL_ALIEN, COL_GOOD, COL_INFO, COL_ATTATCH, COL_GOLD, COL_ORANGE, COL_TEAL } from "./colours";
import { ROLE_TYPES, ROLE_DESCRIPTIONS } from "resources/crewmember-names";
import { Crewmember } from "app/crewmember/crewmember-type";
import { Unit } from "w3ts/index";
import { ABIL_CREWMEMBER_INFO, ABIL_TRANSFORM_HUMAN_ALIEN, ABIL_TRANSFORM_ALIEN_HUMAN, ABIL_WEP_DIODE_EJ, ABIL_GENE_COSMIC } from "./ability-ids";
import { Log } from "lib/serilog/serilog";
import { AT_ABILITY_DRAGONFIRE_BLAST } from "app/weapons/weapon-constants";

// On major upgrade (all)
// On weapon equip
// On attachment equip
// On level up
// On research

export interface DynamicTooltip {
    update(who: Unit | Crewmember, data: any);
}

export class DynamicAbilityTooltip implements DynamicTooltip {
    abilCode: number;

    tooltip?: (who: Unit | Crewmember, abilLevel: number, data: any) => string;
    tooltipExtended?: (who: Unit | Crewmember, abilLevel: number, data: any) => string;

    constructor(
        abilCode: number, 
        tooltip?: (who: Unit | Crewmember, abilLevel: number, data: any) => string, 
        tooltipExtended?: (who: Unit | Crewmember, abilLevel: number, data: any) => string
    ) {
        this.abilCode = abilCode;
        this.tooltip = (who: Unit | Crewmember, abilLevel: number, data: any) => tooltip && tooltip(who, abilLevel, data);
        this.tooltipExtended = (who: Unit | Crewmember, abilLevel: number, data: any) => tooltipExtended && tooltipExtended(who, abilLevel, data);
    }

    public update(who: Unit | Crewmember, data: any) {
        const unit = (who instanceof Crewmember ? who.unit : who) as Unit;
        // Dont do anythhing if we are not local player
        if (unit.owner.handle != GetLocalPlayer()) return;

        let abilLevel = unit.getAbilityLevel(this.abilCode) || 1;
        // Hack so we can support updating alien skills when observing crewmember
        if (abilLevel === 0) abilLevel = 1;

        const tooltip = this.tooltip ? this.tooltip(who, abilLevel, data) : undefined;
        const tooltipExtended = this.tooltipExtended ? this.tooltipExtended(who, abilLevel, data) : undefined;

        if (tooltip) {
            BlzSetAbilityTooltip(this.abilCode, tooltip, abilLevel - 1);
        }
        if (tooltipExtended) {
            BlzSetAbilityExtendedTooltip(this.abilCode, tooltipExtended, abilLevel - 1);
        }
    }
}

export const resolveTooltip = new DynamicAbilityTooltip(
    ABIL_CREWMEMBER_INFO,
    undefined,
    (who: Crewmember, abilLevel: number, data: any) => `${COL_MISC}Everyone onboard the Askellon went through extensive surgeries to ensure that their bodies could withstand the brutalities of space travel. Be it the implanted and extensively enhanced andrenaline glands or just the human will to live; you will not go down without a fight.|r

It is your duty to ensure the ship and her systems stay online. But be careful, there are ${COL_ALIEN}forces|r on the ship that seek your demise.
As a ${COL_GOOD}Crewmember|r of the Askellon you will earn income by performing your duties.

Addtionally, your determination to survive will cause you to gain ${COL_RESOLVE}Resolve|r on low HP, granting ${COL_GOOD}30% bonus|r movement speed, ${COL_GOOD}30% damage|r reduction and ${COL_INFO}improving|r your other abilities.

${ROLE_DESCRIPTIONS.get(who.role)}

${COL_MISC}Current Income: ${who.getIncome()} per minute|r`
);

export const alienTooltipToAlien = new DynamicAbilityTooltip(
    ABIL_TRANSFORM_HUMAN_ALIEN,
    undefined,
    (who: Crewmember, abilLevel: number, data: any) => `${COL_MISC}Everyone onboard the Askellon went through extensive surgeries to ensure that their bodies could withstand the brutalities of space travel. Be it the implanted and extensively enhanced andrenaline glands or just the human will to live; you will not go down without a fight.|r

You are the ${COL_ALIEN}Alien.|r Destroy or devour the lesser beings aboard this vessel.
You can ${COL_INFO}transform|r into your ${COL_ALIEN}${data.alienFormName}|r form at will.
        
When critically injured you gain ${COL_RESOLVE}Resolve|r, this ability is lost at the ${COL_ALIEN}third evolution|r.
    
${ROLE_DESCRIPTIONS.get(who.role)}

${COL_MISC}Current Income: ${who.getIncome()} per minute|r`
);

export const alienTooltipToHuman = new DynamicAbilityTooltip(
    ABIL_TRANSFORM_ALIEN_HUMAN,
    undefined,
    (who: Crewmember, abilLevel: number, data: any) => `${COL_MISC}Everyone onboard the Askellon went through extensive surgeries to ensure that their bodies could withstand the brutalities of space travel. Be it the implanted and extensively enhanced andrenaline glands or just the human will to live; you will not go down without a fight.|r

You are the ${COL_ALIEN}Alien.|r Destroy or devour the lesser beings aboard this vessel.
You can ${COL_INFO}transform|r into your ${COL_INFO}Human|r form at will.
        
When critically injured you gain ${COL_RESOLVE}Resolve|r, this ability is lost at the ${COL_ALIEN}third evolution|r.
    
${ROLE_DESCRIPTIONS.get(who.role)}

${COL_MISC}Current Income: ${who.getIncome()} per minute|r`
);

export const dragonBreathBlastTooltip = new DynamicAbilityTooltip(
    AT_ABILITY_DRAGONFIRE_BLAST,
    undefined,
    (who: Crewmember, abilLevel: number, data: any) => 
    `${COL_MISC}The dragonfire barrel can trace its origins to an age burried far under terran history, and was originaly used as weaponised fireworks by eastern terrans. In the modern age the weapon has been repurposed and outfitted with a slow burning napalm; useful for burning through armor and sowing confusing.|r
    
${COL_GOLD}Attchment for ${COL_ATTATCH}Kinetic|r ${COL_GOLD}weapons.|r

Detontes a shrapnel charge laced with napalm; firing ${COL_GOOD}26|r ${COL_ORANGE}burning|r shards within a wide but short range. Each shard does ${COL_GOOD}${20*who.getDamageBonusMult()}|r damage and sets the target on ${COL_ORANGE}fire|r.

${COL_MISC}15 Seconds Cooldown|r`
);

export const diodeEjectTooltip = new DynamicAbilityTooltip(
    ABIL_WEP_DIODE_EJ,
    undefined,
    (who: Crewmember, abilLevel: number, data: any) => 
    `${COL_MISC}Prismatic Accelerator rounds use highly unstable plas infusion, only made into stable bullets by precise machining. When a bullet is inproperly machined, it quickly explodes into a hail of molten shards, not unlike a shotgun. After a few grizly accidents during testing, this reaction was turned into a secondary firing mode, making sure to only let the rounds rupture once a safe distance from the operator.|r

Fires ${COL_GOOD}20|r short ranged plas blasts, dealing up to ${COL_GOOD}${
    50 + MathRound(25 * Pow(1.5, (who.weapon as any).getIntensity()) * who.getDamageBonusMult()) * 4
    }|r  damage; ${COL_ATTATCH}divided|r amongst each beam of light.
${COL_INFO}Firing this at full power causes you to be sent flying back.|r

${COL_MISC}45 Second Cooldown|r`
);


export const TOOLTIP_EMBRACE_COSMOS = new DynamicAbilityTooltip(
    ABIL_GENE_COSMIC,
    undefined,
    (who: Crewmember, abilLevel: number, data: any) => `${COL_MISC}Stretching unfamiliar muscles you reach out, and feel an entity far away. Its many folded gaze stares deep into your soul; the chill you feel is an understanding of a truth you should never have known.|r
    
Transmit the colossal amounts of information your augmented mind collects to those around you, inflicting ${COL_TEAL}Flash Freeze|r to all nearby units and deals ${COL_GOOD}${who.unit.getIntelligence(true) * 5 + 50}|r${COL_MISC}(Will Based)|r${COL_GOOD} damage|r.

${COL_ATTATCH}Their mundane brains buckle under your mental transmissions, but beware, for entities that can handle them may take them as an invitation...|r

${COL_MISC}80 Seconds Cooldown|r`
);