import { Gun } from "../app/weapons/guns/gun";
import { COL_ATTATCH, COL_GOOD, COL_INFO, COL_GOLD, COL_MISC, COL_BAD, COL_ORANGE } from "./colours";
import { GunItem } from "app/weapons/guns/gun-item";

export const BURST_RIFLE_EXTENDED = (damage: any, accuracyMin: any, accuracyMax: any) => 
`|cff808080Powered by galvanic rails, this old rifle has been in active circulation since the Yulvin succession wars. 
Now many corporations produce upgrades and attachments that further improve upon its baseline functionality.|r

Fires a short burst of six bullets, each dealing |cff00ff00${damage} damage|r.

${COL_MISC}1 Second Cooldown|r
`;

export const BURST_RIFLE_ITEM = (weapon: GunItem, damage: any) => 
`|cff808080Powered by galvanic rails, this old rifle has been in active circulation since the Yulvin succession wars. 
Now many corporations produce upgrades and attachments that further improve upon its baseline functionality.|r

Attached: ${weapon.attachment 
    ? `${COL_GOLD}${weapon.attachment.name}`
    : `${COL_ATTATCH}Nothing`
}|r

The standard issue rifle; ideal for thinning hordes and can dish out serious damage up close.
${COL_GOOD}- 6 shot burst
- Each shot does ${damage} damage
- Short Cooldown|r

${!weapon.attachment
     ? `${COL_INFO}Can be enhanced with ${COL_ATTATCH}kinetic|r${COL_INFO} attachments.|r` 
     : `${COL_GOLD}Equip and type -u to remove ${COL_ATTATCH}${weapon.attachment.name}|r|r`
}`;

export const LASER_EXTENDED = (damage: number, currentCharges: number, accuracyMin: number, accuracyMax: number) => `
${COL_MISC}The Prismatic Accelerator is a work of engineering art, flash-forging plas rounds to shatter enemy armour, collecting impact data from each shot to enhance the next round. The sheer amount of data being collected means that storage is all but impossible, so an accurate operator and a continual stream of telemetry is vital for good results.|r

Hurls a plas bolt dealing ${COL_GOOD}${damage} energy damage|r.
The inbuilt A.I recalculates design efficiency on impact; successive hits increase this weapon's damage by ${COL_GOOD}50%|r.

${COL_ATTATCH}Missing a bolt ruins previous calculations and resets damage bonus|r

${COL_MISC}2 Seconds Cooldown|r
`;

export const LASER_ITEM = (weapon: GunItem, damage: any) => 
`${COL_MISC}The Prismatic Accelerator is a work of engineering art, flash-forging plas rounds to shatter enemy armour, collecting impact data from each shot to enhance the next round. The sheer amount of data being collected means that storage is all but impossible, so an accurate operator and a continual stream of telemetry is vital for good results.|r

Attached: ${COL_ATTATCH}Fracture Round|r

Self amplifying rifle that increases in damage with each successive hit.
${COL_GOOD}- Bad base damage 
- Missing a shot resets intensity
- |r${COL_ATTATCH}Fracture Round|r ${COL_GOOD}can deal massive damage|r

${COL_ATTATCH}Fracture Round|r ${COL_GOLD}cannot be removed.|r
`;

export const SHOTGUN_EXTENDED = (damage: any, accuracyMin: any, accuracyMax: any) => 
`|cff808080Harkon was a talented mercenary who never could quite find a mercenary company to join, not for want of trying or lack of skill, but for the fact that noone else could survive the insane odds that he casually threw himself into. 
Over the twenty years of his career, he had only one constant companion, and that was his custom-made, hand-engineered, reinforced combat shotgun. The design was sold off after he vanished, and even now there's a shady guy at every port selling 'the real Harkon Blitzer'|r

Fires a blast of 6 shots in a cone, each bullet dealing |cff00ff00${damage}|r damage.
Every bullet after the first deals 20% less damage.

${COL_MISC}2 Seconds Cooldown|r`;

export const SHOTGUN_ITEM = (weapon: GunItem, damage: any) => 
`|cff808080Harkon was a talented mercenary who never could quite find a mercenary company to join, not for want of trying or lack of skill, but for the fact that noone else could survive the insane odds that he casually threw himself into. 
Over the twenty years of his career, he had only one constant companion, and that was his custom-made, hand-engineered, reinforced combat shotgun. The design was sold off after he vanished, and even now there's a shady guy at every port selling 'the real Harkon Blitzer'|r

A close ranged shotgun that deals good damage
${COL_GOOD}- Fires a spread of shots
- Unaffected by Accuracy
- Fires 6 shots, each dealing up to |cff00ff00${damage}|r${COL_GOOD} damage
- Can be heavily customised|r

${!weapon.attachment
    ? `${COL_INFO}Can be enhanced with ${COL_ATTATCH}kinetic|r${COL_INFO} attachments.|r` 
    : `${COL_GOLD}Equip and type -u to remove ${COL_ATTATCH}${weapon.attachment.name}|r|r`
}`;

export const TESLA_EXTENDED = (damage: any, accuracyMin: any, accuracyMax: any) => 
`|cff808080LORE WIP|r

Charges for 0.5 seconds and fires a massive bolt of lightning hitting all units in a line dealing ${damage} damage and applying ${COL_INFO}Static Shock|r.
${COL_INFO}Static Shock|r units explode after 1 second, dealing ${damage/10} damage to all other nearby units and applying ${COL_INFO}Static Shock|r.
`;

export const TESLA_ITEM = (weapon: GunItem, damage: any) => 
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

export const MINIGUN_ITEM = (weapon: GunItem, damage: any) => 
`${COL_MISC}No matter the vessel, no matter the mission, Hexcorp security always tries to bring at least one Flamesaw along. 
Hostile targets are obliterated by a hail of high-powered rounds, but the Flamesaw's true source of notoriety is its infamous cooling system, which causes ammunition to engulf targets in flames.|r

A heavy weapon designed for holding down corridors
${COL_GOOD}- Great Damage
- Sets targets alight while ${COL_ORANGE}Flamesaw|r${COL_GOOD} is active
- Fires up to 250 rounds over 15 seconds
${COL_ATTATCH}- Must stand still
- Turning reduces attack speed
- Unallies all units in the cone of fire|r

${!weapon.attachment
     ? `${COL_INFO}Can be enhanced with ${COL_ATTATCH}kinetic|r${COL_INFO} attachments.|r` 
     : `${COL_GOLD}Equip and type -u to remove ${COL_ATTATCH}${weapon.attachment.name}|r|r`
}`;

export const MINIGUN_EXTENDED = (weapon: GunItem, damage: any) => 
`${COL_MISC}No matter the vessel, no matter the mission, Hexcorp security always tries to bring at least one Flamesaw along. 
Hostile targets are obliterated by a hail of high-powered rounds, but the Flamesaw's true source of notoriety is its infamous cooling system, which cause ammunition to engulf targets in flames.|r


Fires a hose of bullets over ${COL_GOOD}15 seconds|r, ramping up attack speed with each shot.
Continuous shooting while at max attack speed activates ${COL_ORANGE}Flamesaw|r, increasing damage and attack speed by ${COL_GOOD}10%|r and applying ${COL_ORANGE}Burning!|r to any units hit.

${COL_ATTATCH}This weapon does not care for friend or foe, and will hit anything within its shower of molten lead|r

${COL_MISC}8 Seconds Cooldown|r`;