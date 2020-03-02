import { COL_MISC, COL_RESOLVE, COL_ALIEN, COL_GOOD, COL_INFO } from "./colours";

export const RESOLVE_TOOLTIP = (playerIncome: number) => `${COL_MISC}Everyone onboard the Askellon went through extensive surgeries to ensure that their bodies could withstand the brutalities of space travel. Be it the implanted and extensively enhanced andrenaline glands or just the human will to live; you will not go down without a fight.|r

It is your duty to ensure the ship and her systems stay online. But be careful, there are ${COL_ALIEN}forces|r on the ship that seek your demise.
As a ${COL_GOOD}Crewmember|r of the Askellon you will earn income by performing your duties.

Addtionally, your determination to survive will cause you to gain ${COL_RESOLVE}Resolve|r on low HP, granting ${COL_GOOD}30% bonus|r movement speed, ${COL_GOOD}30% damage|r reduction and ${COL_INFO}improving|r your other abilities.


${COL_MISC}Current Income: ${playerIncome} per minute|r
`;

export const TRANSFORM_TOOLTIP = (playerIncome: number, toAlien: boolean, alienFormName: string) => `${COL_MISC}This form is weak. Hunt. Consume. Evolve.|r

You are the ${COL_ALIEN}Alien.|r Destroy or devour the lesser beings aboard this vessel.
You can ${COL_INFO}transform|r into your ${
    toAlien ? `${COL_ALIEN}${alienFormName}|r` : `${COL_INFO}Human|r`
} form at will.

When critically injured you gain ${COL_RESOLVE}Resolve|r, this ability is lost at the ${COL_ALIEN}third evolution|r.

${COL_MISC}Current Income: ${playerIncome} per minute|r
`;