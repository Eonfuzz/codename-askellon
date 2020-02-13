/** @noSelfInFile **/
import { Crewmember } from "./crewmember-type";
import { ROLE_NAMES } from "./crewmember-names";
import { Game } from "../game";
import { Trigger } from "../types/jass-overrides/trigger";
import { Log } from "../../lib/serilog/serilog";
import { BURST_RIFLE_ITEM_ID } from "../weapons/weapon-constants";
import { CREW_FORCE_NAME } from "../force/crewmember-force";
import { ZONE_TYPE } from "../world/zone-id";

const CREWMEMBER_UNIT_ID = FourCC("H001");
const DELTA_CHECK = 0.25;

export class CrewModule {

    game: Game;

    CREW_MEMBERS: Array<Crewmember> = [];
    AVAILABLE_ROLES: Array<string> = [];

    crewmemberDamageTrigger: Trigger;

    constructor(game: Game) {
        this.game = game;
        const playerList = game.forceModule.getActivePlayers();
        const crewForce = game.forceModule.getForce(CREW_FORCE_NAME);

        // Load available roles
        this.initialiseRoles(playerList);
    
        // Initialise first crewmember todo    
        playerList.forEach(player => {
            let crew = this.createCrew(game, GetPlayerId(player));
            this.CREW_MEMBERS.push(crew);
            crewForce && crewForce.addPlayer(player);
            game.worldModule.travel(crew.unit, ZONE_TYPE.FLOOR_1);
        });

        // Create crew takes damage trigger
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

        const updateCrewTrigger = new Trigger();
        updateCrewTrigger.RegisterTimerEventPeriodic(DELTA_CHECK);
        updateCrewTrigger.AddAction(() => this.processCrew(DELTA_CHECK));
    }

    initialiseRoles(players: Array<player>) {
        players.forEach((p, index) => {
            if (index === 0) {
                this.AVAILABLE_ROLES.push("Captain");
            } 
            else {
                this.AVAILABLE_ROLES.push("Security Guard");
            }
        });
    }

    processCrew(time: number) {
        this.CREW_MEMBERS.forEach(crew => {
            crew.resolve.process(this.game, time);
            crew.despair.process(this.game, time);
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
    
        Log.Information(`Created Crewmember ${crewmember.name}::${crewmember.role}`);

        /**
         * Now apply crewmember default weapons
         */
        if (crewmember.role) {
            const item = CreateItem(BURST_RIFLE_ITEM_ID, 0, 0);
            UnitAddItem(crewmember.unit, item);
            game.weaponModule.applyItemEquip(crewmember, item);
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