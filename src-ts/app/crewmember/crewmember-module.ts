/** @noSelfInFile **/
import { Crewmember } from "./crewmember-type";
import { ROLE_NAMES } from "./crewmember-names";
import { Game } from "../game";

// TODO Replace with unit id
const CREWMEMBER_UNIT_ID = FourCC("H001");

const CREW_MEMBERS: Array<Crewmember> = [];
const AVAILABLE_ROLES: Array<string> = [];

export function initCrew(game: Game) {
    // Load available roles
    initialiseRoles(game);

    // Initialise first crewmember todo

    game.humanPlayers.forEach(player => {
        let crew = createCrew(GetPlayerId(player));
        // crew.log();
        CREW_MEMBERS.push(crew);
    });
}

function initialiseRoles(game: Game) {
    game.humanPlayers.forEach((p, index) => {
        if (index === 0) {
            AVAILABLE_ROLES.push("Captain");
        } 
        else {
            AVAILABLE_ROLES.push("Security Guard");
        }

    });
}

function createCrew(playerId: number): Crewmember {
    let nPlayer = Player(playerId);

    let nUnit = CreateUnit(nPlayer, CREWMEMBER_UNIT_ID, 0, 0, bj_UNIT_FACING);

    let crewmember = new Crewmember(nPlayer, nUnit);
    crewmember.setRole(getCrewmemberRole());
    crewmember.setName(getCrewmemberName(crewmember.role));
    crewmember.setPlayer(nPlayer);

    BlzSetUnitName(nUnit, crewmember.role);
    BlzSetHeroProperName(nUnit, crewmember.name);

    return crewmember;
}

function getCrewmemberRole() {
    const i = Math.floor( Math.random() * AVAILABLE_ROLES.length );
    const role = AVAILABLE_ROLES[i];
    AVAILABLE_ROLES.splice(i, 1);
    return role;
}

function getCrewmemberName(role: string) {
    // TODO Fix this
    let namesForRole;
    if (role === "Captain") {
        namesForRole = ROLE_NAMES["Captain"];
    }
    else {
        namesForRole = ROLE_NAMES["Security Guard"];
    }
    const i = Math.floor( Math.random() * namesForRole.length );
    const name = namesForRole[i];
    // print("")
    namesForRole.splice(i, 1);
    return name;
}

export function getCrewmemberForUnit(unit: unit): Crewmember | void {
    for (let member of CREW_MEMBERS) {
        if (member.unit == unit) {
            return member;
        }
    }
}