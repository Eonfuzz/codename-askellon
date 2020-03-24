import { Gun } from "../app/weapons/guns/gun";
import { COL_ATTATCH, COL_GOOD, COL_INFO, COL_GOLD, COL_MISC, COL_BAD } from "./colours";

export const BURST_RIFLE_EXTENDED = (damage: any, accuracyMin: any, accuracyMax: any) => 
`|cff808080Powered by galvanic rails, this old rifle has been in active circulation since the Yulvin succession wars. 
Now many corporations produce upgrades and attachments that further improve upon its baseline functionality.|r

Fires a short burst of six bullets with |cff00ffff${accuracyMin}|r to |cff00ffff${accuracyMax}|r range, with each bullet dealing |cff00ff00${damage} damage|r.
`;

export const BURST_RIFLE_ITEM = (weapon: Gun, damage: any) => 
`|cff808080Powered by galvanic rails, this old rifle has been in active circulation since the Yulvin succession wars. 
Now many corporations produce upgrades and attachments that further improve upon its baseline functionality.|r

Attached: ${weapon.attachment 
    ? `${COL_GOLD}${weapon.attachment.name}`
    : `${COL_ATTATCH}Nothing`
}|r

The standard issue rifle; ideal for thinning hordes and can dish out serious damage up close.
- 6 Shot Burst
- Each shot does ${damage} damage
- Short Cooldown|r

${!weapon.attachment
     ? `${COL_INFO}Can be enhanced with ${COL_ATTATCH}kinetic|r attachments.|r` 
     : `${COL_GOLD}Equip and type -u to remove ${COL_ATTATCH}${weapon.attachment.name}|r|r`
}`;

export const LASER_EXTENDED = (damage: number, currentCharges: number, accuracyMin: number, accuracyMax: number) => `
${COL_MISC}Fluff TODO|r

Discharges a focused pulse of prismatic energy, dealing ${COL_GOOD}${damage} damage|r.
The inbuilt A.I recalculates pulse intensity on impact; successive hits increase this weapon's damage by ${COL_GOOD}50%|r.

${COL_MISC}2 second cooldown|r
`;

export const LASER_ITEM = (weapon: Gun, damage: any) => 
`${COL_MISC}Fluff todo|r

Attached: ${COL_ATTATCH}Diode Ejector|r

Self amplifying rifle that increases in damage with each successive hit.
${COL_GOOD}- Bad base damage 
- Missing a shot resets intensity
- |r${COL_ATTATCH}Diode Ejector|r ${COL_GOOD}can deal massive damage|r

${COL_ATTATCH}Diode Ejector|r ${COL_GOLD}cannot be removed.|r
`;

export const SHOTGUN_EXTENDED = (damage: any, accuracyMin: any, accuracyMax: any) => 
`|cff808080Harkon was a talented mercenary who never could quite find a mercenary company to join, not for want of trying or lack of skill, but for the fact that noone else could survive the insane odds that he casually threw himself into. 
Over the twenty years of his career, he had only one constant companion, and that was his custom-made, hand-engineered, reinforced combat shotgun. The design was sold off after he vanished, and even now there's a shady guy at every port selling 'the real Harkon Blitzer'|r

Fires a blast of 6 shots in a cone, each bullet dealing |cff00ff00${damage}|r damage.
If all 6 bullets hit the same target they take an additional |cff00ff00${damage*6*0.25}|r damage.
`;

export const SHOTGUN_ITEM = (weapon: Gun, damage: any) => 
`|cff808080Harkon was a talented mercenary who never could quite find a mercenary company to join, not for want of trying or lack of skill, but for the fact that noone else could survive the insane odds that he casually threw himself into. 
Over the twenty years of his career, he had only one constant companion, and that was his custom-made, hand-engineered, reinforced combat shotgun. The design was sold off after he vanished, and even now there's a shady guy at every port selling 'the real Harkon Blitzer'|r

A close ranged shotgun that deals good damage
${COL_GOOD}- Fires a spread of shots
- Unaffected by Accuracy
- Can be heavily customised
- Hitting a unit with all 6 shots crits|r

${!weapon.attachment
    ? `${COL_INFO}Can be enhanced with ${COL_ATTATCH}kinetic|r attachments.|r` 
    : `${COL_GOLD}Equip and type -u to remove ${COL_ATTATCH}${weapon.attachment.name}|r|r`
}`;

export const TESLA_EXTENDED = (damage: any, accuracyMin: any, accuracyMax: any) => 
`|cff808080LORE WIP|r

Charges for 0.5 seconds and fires a massive bolt of lightning hitting all units in a line dealing ${damage} damage and applying ${COL_INFO}Static Shock|r.
${COL_INFO}Static Shock|r units explode after 1 second, dealing ${damage/10} damage to all other nearby units and applying ${COL_INFO}Static Shock|r.
`;

export const TESLA_ITEM = (weapon: Gun, damage: any) => 
`|cff808080Lore WIP|r

A lightning cannon 
${COL_GOOD}- Great Damage
- Charge up time
- Hits multiple units
- Applies ${COL_INFO}Static Shock|r
- Can be heavily customised|r
- |r${COL_ATTATCH}Electrode Cannon|r ${COL_GOOD}can deal massive damage|r

${COL_ATTATCH}Electrode Cannon|r ${COL_GOLD}cannot be removed.|r
}`;