import { COL_MISC, COL_RESOLVE, COL_ALIEN, COL_GOOD, COL_INFO, COL_ATTATCH, COL_GOLD, COL_ORANGE, COL_TEAL, COL_BAD } from "./colours";
import { ROLE_TYPES, ROLE_DESCRIPTIONS } from "resources/crewmember-names";
import { Crewmember } from "app/crewmember/crewmember-type";
import { Unit } from "w3ts/index";
import { ABIL_CREWMEMBER_INFO, ABIL_TRANSFORM_HUMAN_ALIEN, ABIL_TRANSFORM_ALIEN_HUMAN, ABIL_WEP_DIODE_EJ, ABIL_GENE_COSMIC, ABIL_GENE_XENOPHOBIC_PUNCH } from "./ability-ids";
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

        // Log.Information("Updaing Abil Tooltip");
        if (!unit) return;

        let abilLevel = unit.getAbilityLevel(this.abilCode) || 1;
        // Hack so we can support updating alien skills when observing crewmember
        if (abilLevel === 0) abilLevel = 1;

        const tooltip = this.tooltip ? this.tooltip(who, abilLevel, data) : undefined;
        const tooltipExtended = this.tooltipExtended ? this.tooltipExtended(who, abilLevel, data) : undefined;

        // Dont do anythhing if we are not local player
        if (unit.owner.handle != GetLocalPlayer()) return;

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
    (who: Crewmember, abilLevel: number, data: any) => `${COL_MISC}Repair the ship and get out of this sector... before it is too late.|r
As a ${COL_GOOD}Crewmember|r of the Askellon you earn income and experience by damaging ${COL_ALIEN}Alien Forces|r, ${COL_GOOD}Upgrading|r Askellon systems and completing ${COL_GOOD}Role Objectives|r

You are a ${who.role}:
${ROLE_DESCRIPTIONS.get(who.role)}

${COL_MISC}Current Income: ${who.getIncome()} per minute|r`
);

export const alienTooltipToAlien = new DynamicAbilityTooltip(
    ABIL_TRANSFORM_HUMAN_ALIEN,
    undefined,
    (who: Crewmember, abilLevel: number, data: any) => `${COL_MISC}Wipe out human life and claim this ship as yours.|r

You are the ${COL_ALIEN}Alien.|r Win the game by destroying or assimilating all other life onboard this ship.
Cast this ability to ${COL_INFO}transform|r, revealing your true form.
        
${COL_MISC}60 Second Cooldown|r

You are a ${who.role}:
${ROLE_DESCRIPTIONS.get(who.role)}

${COL_MISC}Current Income: ${who.getIncome()} per minute|r`
);
export const alienTooltipToHuman = new DynamicAbilityTooltip(
    ABIL_TRANSFORM_ALIEN_HUMAN,
    undefined,
    (who: Crewmember, abilLevel: number, data: any) => `${COL_MISC}Wipe out human life and claim this ship as yours.|r

You are the ${COL_ALIEN}Alien.|r Win the game by destroying or assimilating all other life onboard this ship.
Cast this ability to ${COL_INFO}transform|r, disguising as a human.

${COL_MISC}60 Second Cooldown|r

You are a ${who.role}:
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
    
Transmit the colossal amounts of information your augmented mind collects to those around you, inflicting ${COL_TEAL}Flash Freeze|r to all nearby units and deals ${COL_GOOD}${who.unit.getIntelligence(true) * 5 + 50}|r${COL_MISC} (Will Based)|r${COL_GOOD} Psionic damage|r.
This takes a massive toll on your mind, causing ${COL_ATTATCH}${MathRound((who.unit.getIntelligence(true) * 5 + 50) / 2)}|r damage to yourself.

${COL_ATTATCH}Their mundane brains buckle under your mental transmissions, but beware, for entities that can handle them may take this as an invitation...|r

${COL_MISC}80 Seconds Cooldown|r`
);

export const TOOLTIP_FISTS = new DynamicAbilityTooltip(
    ABIL_GENE_XENOPHOBIC_PUNCH,
    undefined,
    (who: Unit, abilLevel: number, data: any) => `${COL_MISC}Holy shit! He just socked the Alien across the face!|r

Dash forward and strike out with your iron fists, dealing ${COL_GOOD}${30 + MathRound(who.maxLife * 0.1)}|r damage.
Hitting an ${COL_ALIEN}Alien Player|r ${COL_GOOD}permanently|r increases your max hitpoints by ${COL_GOOD}1|r.

${COL_ORANGE}Dash range scales with accuracy, Punch damage scales with your hitpoints.|r

${COL_MISC}2 Second Cooldown|r
`);