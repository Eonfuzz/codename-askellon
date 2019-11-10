/** @noSelfInFile **/
import { Crewmember } from "./crewmember-type";
import { ROLE_NAMES } from "./crewmember-names";
import { Game } from "../game";

const CREWMEMBER_UNIT_ID = FourCC("H001");

export class CrewModule {

    CREW_MEMBERS: Array<Crewmember> = [];
    AVAILABLE_ROLES: Array<string> = [];

    constructor(game: Game) {
        // Load available roles
        this.initialiseRoles(game);
    
        // Initialise first crewmember todo
    
        game.forceModule.activePlayers.forEach(player => {
            let crew = this.createCrew(game, GetPlayerId(player));
            // crew.log();
            this.CREW_MEMBERS.push(crew);
        });
    }

    initialiseRoles(game: Game) {
        game.forceModule.activePlayers.forEach((p, index) => {
            if (index === 0) {
                this.AVAILABLE_ROLES.push("Captain");
            } 
            else {
                this.AVAILABLE_ROLES.push("Security Guard");
            }
    
        });
    }

    createCrew(game: Game, playerId: number): Crewmember {
        let nPlayer = Player(playerId);
    
        let nUnit = CreateUnit(nPlayer, CREWMEMBER_UNIT_ID, 0, 0, bj_UNIT_FACING);
    
        let crewmember = new Crewmember(game, nPlayer, nUnit);
        crewmember.setRole(this.getCrewmemberRole());
        crewmember.setName(this.getCrewmemberName(crewmember.role));
        crewmember.setPlayer(nPlayer);
    
        BlzSetUnitName(nUnit, crewmember.role);
        BlzSetHeroProperName(nUnit, crewmember.name);
    
        return crewmember;
    }
    

    getCrewmemberRole() {
        const i = Math.floor( Math.random() * this.AVAILABLE_ROLES.length );
        const role = this.AVAILABLE_ROLES[i];
        this.AVAILABLE_ROLES.splice(i, 1);
        return role;
    }
    
    getCrewmemberName(role: string) {
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

    getCrewmemberForPlayer(player: player) {
        for (let member of this.CREW_MEMBERS) {
            if (member.player == player) {
                return member;
            }
        }
    }

    getCrewmemberForUnit(unit: unit): Crewmember | void {
        for (let member of this.CREW_MEMBERS) {
            if (member.unit == unit) {
                return member;
            }
        }
    }
}