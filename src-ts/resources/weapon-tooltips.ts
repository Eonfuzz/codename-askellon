import { Gun } from "../app/weapons/guns/gun";
import { COL_ATTATCH, COL_GOOD, COL_INFO, COL_GOLD } from "./colours";

export const BURST_RIFLE_EXTENDED = (damage: any, accuracyMin: any, accuracyMax: any) => 
`|cff808080Powered by galvanic rails, this old rifle has been in active circulation since the Yulvin succession wars. 
Now many corporations produce upgrades and attachments that further improve upon its baseline functionality.|r

Fires a short burst of six bullets with |cff00ffff${accuracyMin}|r to |cff00ffff${accuracyMax}|r range, with each bullet dealing |cff00ff00${damage} damage|r.

|cffff0000If all six rounds hit the same target, this weapon will apply BREAK.|r
`;

export const BURST_RIFLE_ITEM = (weapon: Gun) => 
`|cff808080Powered by galvanic rails, this old rifle has been in active circulation since the Yulvin succession wars. 
Now many corporations produce upgrades and attachments that further improve upon its baseline functionality.|r

Attached: ${weapon.attachment ? (`${COL_GOLD}${weapon.attachment.name}`) : `${COL_ATTATCH}Empty Slot`}|r

The basic starter weapon; shoots in short burts, is good for thinning hordes and can do some serious damage up close.
${COL_GOOD}- 6 Shot Burst
- Each shot does 15 damage
- Short Cooldown|r

${COL_INFO}Can be enhanced with ${COL_ATTATCH}High Quality Polymer|r.|r
`;