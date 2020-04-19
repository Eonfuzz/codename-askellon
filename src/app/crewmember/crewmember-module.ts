/** @noSelfInFile **/
import { Crewmember } from "./crewmember-type";
import { ROLE_NAMES, ROLE_TYPES, ROLE_DESCRIPTIONS } from "../../resources/crewmember-names";
import { Game } from "../game";
import { Trigger, MapPlayer, Unit } from "w3ts";
import { Log } from "../../lib/serilog/serilog";
import { BURST_RIFLE_ITEM_ID, LASER_ITEM_ID, SHOTGUN_ITEM_ID } from "../weapons/weapon-constants";
import { CREW_FORCE_NAME } from "../force/crewmember-force";
import { ZONE_TYPE } from "../world/zone-id";
import { OptResult } from "app/force/opt-selection";
import { ForceType } from "app/force/force-type";
import { PLAYER_COLOR } from "lib/translators";
import { TECH_WEP_DAMAGE } from "resources/ability-ids";
import { TimedEvent } from "app/types/timed-event";

const CREWMEMBER_UNIT_ID = FourCC("H001");
const DELTA_CHECK = 0.25;

// How many seconds between each income tick
const INCOME_EVERY = 20;

export class CrewModule {

    game: Game;

    CREW_MEMBERS: Array<Crewmember> = [];
    playerCrewmembers = new Map<MapPlayer, Crewmember>();

    allJobs: Array<ROLE_TYPES> = [];

    crewmemberDamageTrigger: Trigger;

    constructor(game: Game) {
        this.game = game;

        // Create crew takes damage trigger
        this.crewmemberDamageTrigger = new Trigger();
        this.crewmemberDamageTrigger.registerAnyUnitEvent(EVENT_PLAYER_UNIT_DAMAGED);
        this.crewmemberDamageTrigger.addCondition(Condition(() => {
            const player = GetOwningPlayer(GetTriggerUnit());
            return (GetPlayerId(player) <= 22);
        }));
        this.crewmemberDamageTrigger.addAction(() => {
            const unit = Unit.fromHandle(GetTriggerUnit());
            const crew = this.getCrewmemberForUnit(unit);

            if (crew) {
                crew.onDamage(game);
            }
        });

        const updateCrewTrigger = new Trigger();
        updateCrewTrigger.registerTimerEvent(DELTA_CHECK, true);
        updateCrewTrigger.addAction(() => this.processCrew(DELTA_CHECK));
    }

    initCrew(forces: ForceType[]) {
        let totalPlayers = 0;

        forces.forEach(force => totalPlayers += force.getPlayers().length);

        let it = 0;
        while (it < totalPlayers) {
            if (it === 0) this.allJobs.push(ROLE_TYPES.INQUISITOR);
            else if (it === 0) this.allJobs.push(ROLE_TYPES.CAPTAIN);
            else if (it === 1) this.allJobs.push(ROLE_TYPES.NAVIGATOR);
            else if (it === 2) this.allJobs.push(ROLE_TYPES.DOCTOR);
            else this.allJobs.push(ROLE_TYPES.SEC_GUARD);
            it++;
        }      
    
        it = 0;
        while (it < forces.length) {
            const force = forces[it];
            const players = force.getPlayers();
            let y = 0;

            while (y < players.length) {
                let player = players[y];
                let crew = this.createCrew(player, force);
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
            this.CREW_MEMBERS.forEach(crew => {
                const calculatedIncome = MathRound(amount * crew.getIncome());
                crew.player.setState(PLAYER_STATE_RESOURCE_GOLD, crew.player.getState(PLAYER_STATE_RESOURCE_GOLD) + calculatedIncome);
            });
        }
        else {
            this.timeSinceLastIncome += time;
        }
    }

    createCrew(player: MapPlayer, force: ForceType): Crewmember {   
        const role = this.getCrewmemberRole();
        const name = this.getCrewmemberName(role);
        let nUnit = Unit.fromHandle(CreateUnit(player.handle, CREWMEMBER_UNIT_ID, 0, 0, bj_UNIT_FACING));
        let crewmember = new Crewmember(this.game, player, nUnit, force, role);

        crewmember.setName(name);
        crewmember.setPlayer(player);

        this.playerCrewmembers.set(player, crewmember);
        this.CREW_MEMBERS.push(crewmember);
        
        this.game.worldModule.travel(crewmember.unit, ZONE_TYPE.FLOOR_1);

        // Add the unit to its force
        force.addPlayerMainUnit(this.game, crewmember, player);
        SelectUnitAddForPlayer(crewmember.unit.handle, player.handle);
        PanCameraToTimedForPlayer(player.handle, nUnit.x, nUnit.y, 0);
        
        let roleGaveWeapons = false;
        // Handle unique role bonuses
        // Captain starts at level 2
        if (crewmember.role === ROLE_TYPES.CAPTAIN) {
            // Log.Information("CAPTAIN BONUS");
            nUnit.setHeroLevel(2, false);
        }
        // Sec guard starts with weapon damage 1 and have shotguns
        else if (crewmember.role === ROLE_TYPES.SEC_GUARD) {
            player.setTechResearched(TECH_WEP_DAMAGE, 1);
            const item = CreateItem(SHOTGUN_ITEM_ID, 0, 0);
            UnitAddItem(crewmember.unit.handle, item);
            this.game.weaponModule.applyItemEquip(crewmember, item);
            roleGaveWeapons = true;
        }
        // Doctor begins with extra will and vigor
        else if (crewmember.role === ROLE_TYPES.DOCTOR) {
            SetHeroStr(nUnit.handle, GetHeroStr(nUnit.handle, false)+2, true);
            SetHeroInt(nUnit.handle, GetHeroInt(nUnit.handle, false)+4, true);
        }
        // Navigator has extra accuracy
        else if (crewmember.role === ROLE_TYPES.NAVIGATOR) {
            SetHeroAgi(nUnit.handle, GetHeroAgi(nUnit.handle, false)+5, true);
        }

        if (!roleGaveWeapons) {
            const item = CreateItem(BURST_RIFLE_ITEM_ID, 0, 0);
            UnitAddItem(crewmember.unit.handle, item);
            this.game.weaponModule.applyItemEquip(crewmember, item);
        }

        BlzShowUnitTeamGlow(crewmember.unit.handle, false);
        BlzSetUnitName(nUnit.handle, crewmember.role);
        BlzSetHeroProperName(nUnit.handle, crewmember.name);
        SuspendHeroXP(nUnit.handle, true);

        return crewmember;
    }
   

    getCrewmemberRole() {
        const i = Math.floor( Math.random() * this.allJobs.length );
        const role = this.allJobs[i];
        this.allJobs.splice(i, 1);
        return role;
    }
    
    getCrewmemberName(role: ROLE_TYPES) {
        if (ROLE_NAMES.has(role)) {
            const namesForRole = ROLE_NAMES.get(role) as Array<string>;
            const i = GetRandomInt(0, namesForRole.length - 1);
            const name = namesForRole[i];
            namesForRole.splice(i, 1);
            ROLE_NAMES.set(role, namesForRole);
            return name;
        }
        return `NAME NOT FOUND ${role}`;
    }

    getCrewmemberForPlayer(player: MapPlayer) {
        return this.playerCrewmembers.get(player);
    }

    getCrewmemberForUnit(unit: Unit): Crewmember | void {
        for (let member of this.CREW_MEMBERS) {
            if (member.unit == unit) {
                return member;
            }
        }
    }
}