import { COL_MISC, COL_RESOLVE, COL_ALIEN, COL_GOOD, COL_INFO } from "./colours";

export const RESOLVE_TOOLTIP = (playerIncome: number) => `${COL_MISC}Everyone onboard the Askellon went through extensive surgeries to ensure that their bodies could withstand the brutalities of space travel. Be it the implanted and extensively enhanced andrenaline glands or just the human will to live; you will not go down without a fight.|r

It is your duty to ensure the ship and her systems stay online. But be careful, there are ${COL_ALIEN}forces|r on the ship that seek your demise.
As a ${COL_GOOD}Crewmember|r of the Askellon you will earn income by performing your duties.

Addtionally, your determination to survive will cause you to gain ${COL_RESOLVE}Resolve|r on low HP, granting ${COL_GOOD}30% bonus|r movement speed, ${COL_GOOD}30% damage|r reduction and ${COL_INFO}improving|r your other abilities.


${COL_MISC}Current Income: ${playerIncome} per minute|r
`;

export const TRANSFORM_TOOLTIP = (playerIncome: number, toAlien: boolean, alienFormName: string) => `${COL_MISC}This host is still only a fleshy meatbag. We must hunt. Consume. Evolve. The prey on this ship shall feed us.|r

You are the ${COL_ALIEN}Alien.|r You must destroy and devour all Crew onboard the Askellon. 
Cast this ability to ${COL_INFO}transform|r into ${
    toAlien ? `${COL_ALIEN}${alienFormName}|r` : `${COL_INFO}Hunan|r`
}; feed on humans to increase your strength and evolve into more powerful forms.

Gain ${COL_RESOLVE}Resolve|r at low HP; at the ${COL_INFO}third evolution|r you no longer gain ${COL_RESOLVE}Resolve.|r

${COL_MISC}Current Income: ${playerIncome} per minute|r
`;