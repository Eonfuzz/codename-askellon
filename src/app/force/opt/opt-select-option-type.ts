import { OPT_TYPES } from "./opt-types-enum";

export interface OptSelectOption {
    // The name of the role opt
    name: string,

    // The text displayed during selection
    text: string,

    // The hotkey for the opt
    hotkey: string,

    // What type of opt is this
    type: OPT_TYPES,

    // This must ALWAYS be selected
    // Only the main antagonist should have this selected
    isRequired: boolean,

    // The amount of times this role must be picked
    // Leave undefined for infinite
    count?: number,

    // 0..100 chance for the role to exist
    // No effect if isRequired = true
    chanceToExist: number,

    // Balancing  cost
    // unused
    balanceCost?: { protag: number, antag: number, neutral: number};
}