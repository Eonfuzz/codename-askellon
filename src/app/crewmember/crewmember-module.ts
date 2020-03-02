/** @noSelfInFile **/
import { Crewmember } from "./crewmember-type";
import { ROLE_NAMES } from "./crewmember-names";
import { Game } from "../game";
import { Trigger } from "../types/jass-overrides/trigger";
import { Log } from "../../lib/serilog/serilog";
import { BURST_RIFLE_ITEM_ID, LASER_ITEM_ID } from "../weapons/weapon-constants";
import { CREW_FORCE_NAME } from "../force/crewmember-force";
import { ZONE_TYPE } from "../world/zone-id";
import { OptResult } from "app/force/opt-selection";
import { ForceType } from "app/force/force-type";

const CREWMEMBER_UNIT_ID = FourCC("H001");
const DELTA_CHECK = 0.25;

export class CrewModule {

    game: Game;

    CREW_MEMBERS: Array<Crewmember> = [];
    allJobs: Array<string> = [];

    crewmemberDamageTrigger: Trigger;

    constructor(game: Game) {
        this.game = game;

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

    initCrew(forces: ForceType[]) {
        let totalPlayers = 0;

        forces.forEach(force => { totalPlayers += force.getPlayers().length });

        // Log.Information(`${totalPlayers} players detected`);

        let it = 0;
        while (it++ < totalPlayers) {
            if (it === 0) this.allJobs.push("Captain");
            else if (it === 1) this.allJobs.push("Navigator");
            else if (it === 2) this.allJobs.push("Noble");
            else this.allJobs.push("Security Guard");
        }      

        const crewForce = this.game.forceModule.getForce(CREW_FORCE_NAME);
    
        forces.forEach(force => force.getPlayers()
            .forEach(player => {
                let crew = this.createCrew(player, force);
                this.CREW_MEMBERS.push(crew);
                crewForce && crewForce.addPlayer(player);
                this.game.worldModule.travel(crew.unit, ZONE_TYPE.FLOOR_1);
                crew.updateTooltips(this.game.weaponModule);
            }));
    }

    processCrew(time: number) {
        this.CREW_MEMBERS.forEach(crew => {
            crew.resolve.process(this.game, time);
            crew.despair.process(this.game, time);
        });
    }

    createCrew(player: player, force: ForceType): Crewmember {   
        let nUnit = CreateUnit(player, CREWMEMBER_UNIT_ID, 0, 0, bj_UNIT_FACING);
        let crewmember = new Crewmember(this.game, player, nUnit, force);

        crewmember.setRole(this.getCrewmemberRole());
        crewmember.setName(this.getCrewmemberName(crewmember.role));
        crewmember.setPlayer(player);

        BlzShowUnitTeamGlow(crewmember.unit, false);
        BlzSetUnitName(nUnit, crewmember.role);
        BlzSetHeroProperName(nUnit, crewmember.name);
        SuspendHeroXP(nUnit, true);
    
        /**
         * Now apply crewmember default weapons
         */
        if (crewmember.role) {
            const item = CreateItem(LASER_ITEM_ID, 0, 0);
            UnitAddItem(crewmember.unit, item);
            this.game.weaponModule.applyItemEquip(crewmember, item);
        }
        

        this.game.worldModule.travel(crewmember.unit, ZONE_TYPE.FLOOR_1);

        // Add the unit to its force
        force.addPlayerMainUnit(this.game, nUnit, player);

        return crewmember;
    }

    calculateIncome(crew: Crewmember) {
        const crewModified = 1.0; // TODO
        const baseIncome = 200; // TODO
        const incomePerLevel = 100; // TODO

        const crewLevel = GetHeroLevel(crew.unit);
        const crewExperience = GetHeroXP(crew.unit);
        return baseIncome + incomePerLevel * crewLevel;
    }
    

    getCrewmemberRole() {
        const i = Math.floor( Math.random() * this.allJobs.length );
        const role = this.allJobs[i];
        this.allJobs.splice(i, 1);
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