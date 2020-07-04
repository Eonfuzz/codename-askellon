/** @noSelfInFile **/
import { Crewmember } from "./crewmember-type";
import { ROLE_NAMES, ROLE_TYPES, ROLE_DESCRIPTIONS } from "../../resources/crewmember-names";
import { Game } from "../game";
import { Trigger, MapPlayer, Unit, Timer } from "w3ts";
import { Log } from "../../lib/serilog/serilog";
import { BURST_RIFLE_ITEM_ID, LASER_ITEM_ID, SHOTGUN_ITEM_ID } from "../weapons/weapon-constants";
import { CREW_FORCE_NAME } from "../force/crewmember-force";
import { ZONE_TYPE } from "../world/zone-id";
import { OptResult } from "app/force/opt-selection";
import { ForceType } from "app/force/force-type";
import { PLAYER_COLOR } from "lib/translators";
import { TECH_WEP_DAMAGE, ABIL_INQUIS_PURITY_SEAL, TECH_MAJOR_RELIGION, ABIL_INQUIS_SMITE } from "resources/ability-ids";
import { TimedEvent } from "app/types/timed-event";
import { EVENT_TYPE, EventListener } from "app/events/event";
import { CREWMEMBER_UNIT_ID } from "resources/unit-ids";

export class CrewModule {

    game: Game;

    crewmemberForUnit = new Map<Unit, Crewmember>();
    allJobs: Array<ROLE_TYPES> = [];

    crewmemberDamageTrigger: Trigger;

    private crewTimer = new Timer();
    constructor(game: Game) {
        this.game = game;

        // Create crew takes damage trigger
        this.crewmemberDamageTrigger = new Trigger();
        this.crewmemberDamageTrigger.registerAnyUnitEvent(EVENT_PLAYER_UNIT_DAMAGED);
        this.crewmemberDamageTrigger.addCondition(Condition(() => {
            const player = GetOwningPlayer(GetTriggerUnit());
            return (GetPlayerId(player) < this.game.forceModule.alienAIPlayer.id);
        }));
        this.crewmemberDamageTrigger.addAction(() => {
            const unit = Unit.fromHandle(GetTriggerUnit());
            const crew = this.getCrewmemberForUnit(unit);

            if (crew) {
                crew.onDamage(game);
            }
        });
    }

    initCrew(forces: ForceType[]) {
        let totalPlayers = 0;

        forces.forEach(force => totalPlayers += force.getPlayers().length);

        let it = 0;
        while (it < totalPlayers) {
            if (it === 0) this.allJobs.push(ROLE_TYPES.INQUISITOR);
            else 
            if (it === 0) this.allJobs.push(ROLE_TYPES.CAPTAIN);
            else if (it === 1) this.allJobs.push(ROLE_TYPES.INQUISITOR);
            else if (it === 2) this.allJobs.push(ROLE_TYPES.NAVIGATOR);
            else if (it === 3) this.allJobs.push(ROLE_TYPES.DOCTOR);
            else if (it < 4) this.allJobs.push(ROLE_TYPES.PILOT);
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
                // crew.updateTooltips(this.game.weaponModule);
                y++;
            }
            it++;
        }

        // this.crewTimer.start(DELTA_CHECK, true, () => this.processCrew(DELTA_CHECK));
    }

    createCrew(player: MapPlayer, force: ForceType): Crewmember {   
        const role = this.getCrewmemberRole();
        const name = this.getCrewmemberName(role);
        let nUnit = Unit.fromHandle(CreateUnit(player.handle, CREWMEMBER_UNIT_ID, 0, 0, bj_UNIT_FACING));
        let crewmember = new Crewmember(this.game, player, nUnit, force, role);

        crewmember.setName(name);
        crewmember.setPlayer(player);

        // Update pData
        const pData = this.game.forceModule.getPlayerDetails(nUnit.owner);
        pData.setCrewmember(crewmember);
        
        this.crewmemberForUnit.set(nUnit, crewmember);        
        this.game.worldModule.travel(crewmember.unit, ZONE_TYPE.FLOOR_1);

        // Add the unit to its force
        force.addPlayerMainUnit(this.game, crewmember, player);
        SelectUnitAddForPlayer(crewmember.unit.handle, player.handle);
        PanCameraToTimedForPlayer(player.handle, nUnit.x, nUnit.y, 0);
        
        let roleGaveWeapons = false;
        // Handle unique role bonuses
        // Captain starts at level 2
        if (crewmember.role === ROLE_TYPES.CAPTAIN) {
            // Captain bonus is additional XP
            this.game.event.sendEvent(EVENT_TYPE.CREW_GAIN_EXPERIENCE, {
                source: crewmember.unit,
                data: { value: 500 }
            });
            // And slightly higher will
            crewmember.unit.setIntelligence(
                crewmember.unit.getIntelligence(false) + 2, 
                true
            );
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
        else if (crewmember.role === ROLE_TYPES.INQUISITOR) {
            nUnit.addAbility(ABIL_INQUIS_PURITY_SEAL);
            nUnit.addAbility(ABIL_INQUIS_SMITE);
            this.game.event.addListener(new EventListener(EVENT_TYPE.MAJOR_UPGRADE_RESEARCHED, (self, data) => {
                if (data.data.researched === TECH_MAJOR_RELIGION) {
                    const techLevel = data.data.level;
                    const gotOccupationBonus = this.game.researchModule.techHasOccupationBonus(data.data.researched, techLevel);

                    if (nUnit && nUnit.isAlive()) {
                        SetUnitAbilityLevel(nUnit.handle, ABIL_INQUIS_PURITY_SEAL, techLevel + 1);
                    }
    
                }
            }));    
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
        SetPlayerName(nUnit.owner.handle, crewmember.name);

        return crewmember;
    }
   

    getCrewmemberRole() {
        const i = GetRandomInt(0, this.allJobs.length -1);
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

    getCrewmemberForUnit(unit: Unit): Crewmember | void {
        return this.crewmemberForUnit.has(unit) && this.crewmemberForUnit.get(unit);
    }
}