/** @noSelfInFile **/
import { Crewmember } from "./crewmember-type";
import { ROLE_NAMES, ROLE_TYPES } from "../../resources/crewmember-names";
import { Game } from "../game";
import { Trigger } from "../types/jass-overrides/trigger";
import { Log } from "../../lib/serilog/serilog";
import { BURST_RIFLE_ITEM_ID, LASER_ITEM_ID } from "../weapons/weapon-constants";
import { CREW_FORCE_NAME } from "../force/crewmember-force";
import { ZONE_TYPE } from "../world/zone-id";
import { OptResult } from "app/force/opt-selection";
import { ForceType } from "app/force/force-type";
import { PLAYER_COLOR } from "lib/translators";

const CREWMEMBER_UNIT_ID = FourCC("H001");
const DELTA_CHECK = 0.25;

// How many seconds between each income tick
const INCOME_EVERY = 20;

export class CrewModule {

    game: Game;

    CREW_MEMBERS: Array<Crewmember> = [];
    playerCrewmembers = new Map<player, Crewmember>();

    allJobs: Array<ROLE_TYPES> = [];

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

        forces.forEach(force => totalPlayers += force.getPlayers().length);

        let it = 0;
        while (it < totalPlayers) {
            if (it === 0) this.allJobs.push(ROLE_TYPES.CAPTAIN);
            else if (it === 1) this.allJobs.push(ROLE_TYPES.NAVIGATOR);
            else if (it === 2) this.allJobs.push(ROLE_TYPES.DOCTOR);
            else this.allJobs.push(ROLE_TYPES.SEC_GUARD);
            it++;
        }      
    
        it = 0;
        while (it < forces.length) {
            const force = forces[it];
            // Log.Information("Force:  "+force.name);
            const players = force.getPlayers();
            let y = 0;

            while (y < players.length) {
                let player = players[y];
                let crew = this.createCrew(player, force);
                this.game.worldModule.travel(crew.unit, ZONE_TYPE.FLOOR_1);
                crew.updateTooltips(this.game.weaponModule);
                y++;
            }
            it++;
        }
    }


    timeSinceLastIncome = 0;
    processCrew(time: number) {
        const doIncome = this.timeSinceLastIncome >= INCOME_EVERY;
        this.CREW_MEMBERS.forEach(crew => {
            crew.resolve.process(this.game, time);
            crew.despair.process(this.game, time);
        });

        if (doIncome) {
            this.timeSinceLastIncome = 0;
            const amount = INCOME_EVERY / 60;
            this.CREW_MEMBERS.forEach(crew => 
                AdjustPlayerStateBJ(amount * this.calculateIncome(crew), 
                    crew.player, PLAYER_STATE_RESOURCE_GOLD
                )
            );
        }
        else {
            this.timeSinceLastIncome += time;
        }
    }

    createCrew(player: player, force: ForceType): Crewmember {   
        const role = this.getCrewmemberRole();
        const name = this.getCrewmemberName(role);

        let nUnit = CreateUnit(player, CREWMEMBER_UNIT_ID, 0, 0, bj_UNIT_FACING);
        let crewmember = new Crewmember(this.game, player, nUnit, force, role);

        crewmember.setName(name);
        crewmember.setPlayer(player);
        this.playerCrewmembers.set(player, crewmember);

        BlzShowUnitTeamGlow(crewmember.unit, false);
        BlzSetUnitName(nUnit, crewmember.role);
        BlzSetHeroProperName(nUnit, crewmember.name);
        SuspendHeroXP(nUnit, true);
    
        /**
         * Now apply crewmember default weapons
         */
        if (crewmember.role) {
            const item = CreateItem(BURST_RIFLE_ITEM_ID, 0, 0);
            UnitAddItem(crewmember.unit, item);
            this.game.weaponModule.applyItemEquip(crewmember, item);
        }
        
        this.CREW_MEMBERS.push(crewmember);
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
    
    getCrewmemberName(role: ROLE_TYPES) {
        let namesForRole;

        if (ROLE_NAMES.has(role)) {
            namesForRole = ROLE_NAMES.get(role) as string[];
            const i = Math.floor( Math.random() * namesForRole.length );
            const name = namesForRole[i];
            namesForRole.splice(i, 1);
            ROLE_NAMES.set(role, namesForRole);
            return name;
        }
        return `NAME NOT FOUND ${role}`;
    }

    getCrewmemberForPlayer(player: player) {
        return this.playerCrewmembers.get(player);
    }

    getCrewmemberForUnit(unit: unit): Crewmember | void {
        for (let member of this.CREW_MEMBERS) {
            if (member.unit == unit) {
                return member;
            }
        }
    }
}