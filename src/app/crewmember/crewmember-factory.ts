import { Crewmember } from "./crewmember-type";
import { ROLE_NAMES, ROLE_TYPES } from "../../resources/crewmember-names";
import { Game } from "../game";
import { Trigger, MapPlayer, Unit, Timer } from "w3ts";
import { BURST_RIFLE_ITEM_ID, SHOTGUN_ITEM_ID } from "../weapons/weapon-constants";
import { ZONE_TYPE } from "../world/zone-id";
import { ForceType } from "app/force/forces/force-type";
import { TECH_WEP_DAMAGE, ABIL_INQUIS_PURITY_SEAL, TECH_MAJOR_RELIGION, ABIL_INQUIS_SMITE } from "resources/ability-ids";
import { CREWMEMBER_UNIT_ID } from "resources/unit-ids";
import { ITEM_GENETIC_SAMPLER } from "resources/item-ids";
import { AlienForce } from "app/force/forces/alien-force";
import { ForceEntity } from "app/force/force-entity";
import { EventEntity } from "app/events/event-entity";
import { EVENT_TYPE } from "app/events/event-enum";

import { WorldEntity } from "app/world/world-entity";
import { EventListener } from "app/events/event-type";
import { ResearchFactory } from "app/research/research-factory";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { ALIEN_FORCE_NAME } from "app/force/forces/force-names";

export class CrewFactory {  
    private static instance: CrewFactory;

    public static getInstance() {        
        if (this.instance == null) {
            this.instance = new CrewFactory();
        }
        return this.instance;
    }

    game: Game;

    crewmemberForUnit = new Map<Unit, Crewmember>();
    allJobs: Array<ROLE_TYPES> = [];

    crewmemberDamageTrigger: Trigger;

    constructor() {
        // Create crew takes damage trigger
        this.crewmemberDamageTrigger = new Trigger();
        this.crewmemberDamageTrigger.registerAnyUnitEvent(EVENT_PLAYER_UNIT_DAMAGED);
        this.crewmemberDamageTrigger.addCondition(Condition(() => {
            const player = GetOwningPlayer(GetTriggerUnit());
            return (GetPlayerId(player) < PlayerStateFactory.AlienAIPlayer.id);
        }));
        this.crewmemberDamageTrigger.addAction(() => {
            const unit = Unit.fromHandle(GetTriggerUnit());
            const crew = this.getCrewmemberForUnit(unit);

            if (crew) {
                crew.onDamage();
            }
        });
    }

    initCrew() {
        const forces = PlayerStateFactory.getInstance().forces;
        let totalPlayers = 0;

        forces.forEach(force => totalPlayers += force.getPlayers().length);

        let it = 0;
        while (it < totalPlayers) {
            if (it === 0) this.allJobs.push(ROLE_TYPES.CAPTAIN);
            else if (it === 1) this.allJobs.push(ROLE_TYPES.DOCTOR);
            else if (it === 2) this.allJobs.push(ROLE_TYPES.INQUISITOR);
            // else if (it === 3) this.allJobs.push(ROLE_TYPES.NAVIGATOR);
            else if (it < 4) this.allJobs.push(ROLE_TYPES.PILOT);
            else this.allJobs.push(ROLE_TYPES.SEC_GUARD);
            it++;
        }      
    
        // Force alien host to transform
        const aForce = PlayerStateFactory.getForce(ALIEN_FORCE_NAME) as AlienForce;

        it = 0;
        while (it < forces.length) {
            const force = forces[it];
            const players = force.getPlayers();
            let y = 0;

            while (y < players.length) {
                let player = players[y];
                let crew = this.createCrew(player, force);
                // crew.updateTooltips(this.game.weaponModule);

                if (force === aForce) {
                    const aUnit = aForce.getAlienFormForPlayer(player);
                    // Cancel pause
                    aUnit.show = true;
                    aUnit.pauseEx(false);
                    aUnit.x = crew.unit.x - 20;
                    aUnit.y = crew.unit.y - 300;

                    
                    crew.unit.pauseEx(true);
                    aUnit.issueOrderAt("move", crew.unit.x, crew.unit.y);
                    new Timer().start(1.5, false, () => {
                        crew.unit.setAnimation("death");
                        crew.unit.pauseEx(false);

                        aUnit.pauseEx(true);
                        aUnit.show = false;
                    })
                }

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
        let crewmember = new Crewmember(player, nUnit, force, role);

        crewmember.setName(name);
        crewmember.setPlayer(player);

        // Update pData
        const pData = PlayerStateFactory.get(nUnit.owner);
        pData.setCrewmember(crewmember);
        
        this.crewmemberForUnit.set(nUnit, crewmember);        

        // Add the unit to its force
        force.addPlayerMainUnit(crewmember, player);
        // SelectUnitAddForPlayer(crewmember.unit.handle, player.handle);
        
        let roleGaveWeapons = false;
        // Handle unique role bonuses
        // Captain starts at level 2
        if (crewmember.role === ROLE_TYPES.CAPTAIN) {
            // Captain bonus is additional XP
            EventEntity.getInstance().sendEvent(EVENT_TYPE.CREW_GAIN_EXPERIENCE, {
                source: crewmember.unit,
                data: { value: 500 }
            });
            // And slightly higher will
            crewmember.unit.setIntelligence(
                crewmember.unit.getIntelligence(false) + 2, 
                true
            );

            
            nUnit.x = -18420;
            nUnit.y = -25613;

            // Now travel the unit to floor 1
            WorldEntity.getInstance().travel(crewmember.unit, ZONE_TYPE.BRIDGE, true);
        }
        // Sec guard starts with weapon damage 1 and have shotguns
        else if (crewmember.role === ROLE_TYPES.SEC_GUARD) {
            player.setTechResearched(TECH_WEP_DAMAGE, 1);
            const item = CreateItem(SHOTGUN_ITEM_ID, 0, 0);
            UnitAddItem(crewmember.unit.handle, item);
            EventEntity.send(EVENT_TYPE.DO_EQUIP_WEAPON, {
                source: crewmember.unit,
                data: { item }
            });
            roleGaveWeapons = true;
            // Now travel the unit to floor 1
            WorldEntity.getInstance().travel(crewmember.unit, ZONE_TYPE.ARMORY, true);
        }
        // Doctor begins with extra will and vigor
        else if (crewmember.role === ROLE_TYPES.DOCTOR) {
            SetHeroStr(nUnit.handle, GetHeroStr(nUnit.handle, false)+2, true);
            SetHeroInt(nUnit.handle, GetHeroInt(nUnit.handle, false)+4, true);
            const item = CreateItem(ITEM_GENETIC_SAMPLER, 0, 0);
            UnitAddItem(crewmember.unit.handle, item);

            nUnit.x = -13337;
            nUnit.y = -22229;

            // Now travel the unit to floor 1
            WorldEntity.getInstance().travel(crewmember.unit, ZONE_TYPE.BIOLOGY, true);
        }
        // Navigator has extra accuracy
        else if (crewmember.role === ROLE_TYPES.NAVIGATOR) {
            SetHeroAgi(nUnit.handle, GetHeroAgi(nUnit.handle, false)+5, true);

            WorldEntity.getInstance().travel(crewmember.unit, ZONE_TYPE.ARMORY, true);
        }
        else if (crewmember.role === ROLE_TYPES.INQUISITOR) {
            nUnit.addAbility(ABIL_INQUIS_PURITY_SEAL);
            nUnit.addAbility(ABIL_INQUIS_SMITE);
            EventEntity.getInstance().addListener(new EventListener(EVENT_TYPE.MAJOR_UPGRADE_RESEARCHED, (self, data) => {
                if (data.data.researched === TECH_MAJOR_RELIGION) {
                    const techLevel = data.data.level;
                    const gotOccupationBonus = ResearchFactory.getInstance().techHasOccupationBonus(data.data.researched, techLevel);

                    if (nUnit && nUnit.isAlive()) {
                        SetUnitAbilityLevel(nUnit.handle, ABIL_INQUIS_PURITY_SEAL, techLevel + 1);
                    }
    
                }
            }));    
            
            nUnit.x = -22916;
            nUnit.y = -25386;

            // Now travel the unit to Church
            WorldEntity.getInstance().travel(crewmember.unit, ZONE_TYPE.CHURCH, true);
        }

        if (!roleGaveWeapons) {
            const item = CreateItem(BURST_RIFLE_ITEM_ID, 0, 0);
            UnitAddItem(crewmember.unit.handle, item);
            EventEntity.send(EVENT_TYPE.DO_EQUIP_WEAPON, {
                source: crewmember.unit,
                data: { item }
            });
        }

        BlzShowUnitTeamGlow(crewmember.unit.handle, false);
        BlzSetUnitName(nUnit.handle, crewmember.role);
        BlzSetHeroProperName(nUnit.handle, crewmember.name);
        SuspendHeroXP(nUnit.handle, true);
        SetPlayerName(nUnit.owner.handle, crewmember.name);
        PanCameraToTimedForPlayer(nUnit.owner.handle, nUnit.x, nUnit.y, 0);


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