/** @noSelfInFile **/
import { Crewmember } from "./crewmember-type";
import { ROLE_NAMES } from "./crewmember-names";
import { Game } from "../game";
import { Trigger } from "../types/jass-overrides/trigger";
import { BurstRifle, BURST_RIFLE_ITEM_ID } from "../weapons/guns/burst-rifle";

const CREWMEMBER_UNIT_ID = FourCC("H001");

export class CrewModule {

    CREW_MEMBERS: Array<Crewmember> = [];
    AVAILABLE_ROLES: Array<string> = [];

    crewmemberDamageTrigger: Trigger;

    constructor(game: Game) {
        // Load available roles
        this.initialiseRoles(game);
    
        // Initialise first crewmember todo    
        game.forceModule.activePlayers.forEach(player => {
            let crew = this.createCrew(game, GetPlayerId(player));
            // crew.log();
            this.CREW_MEMBERS.push(crew);
        });

        // Create crew takes damagte trigger
        this.crewmemberDamageTrigger = new Trigger();
        this.crewmemberDamageTrigger.RegisterUnitTakesDamage();
        this.crewmemberDamageTrigger.AddCondition(() => {
            const player = GetOwningPlayer(GetTriggerUnit());
            return (GetPlayerId(player) <= 22);
        });
        this.crewmemberDamageTrigger.AddAction(() => {
            const unit = GetTriggerUnit();
            const crew = this.getCrewmemberForUnit(unit);

            if (crew) {
                crew.onDamage(game);
            }
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
    
        /**
         * Now apply crewmember default weapons
         */
        if (crewmember.role) {
            const item = CreateItem(BURST_RIFLE_ITEM_ID, 0, 0);
            UnitAddItem(crewmember.unit, item);
            game.weaponModule.applyWeaponEquip(crewmember, item);
        }
        

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