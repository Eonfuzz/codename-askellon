import { Crewmember } from "app/crewmember/crewmember-type";
import { Unit } from "w3ts/index";

export interface EventData {
    source: Unit,
    crewmember?: Crewmember,
    data?: any
}
