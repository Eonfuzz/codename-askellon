import { Crewmember } from "./crewmember-type";
import { ROLE_NAMES, ROLE_TYPES, ROLE_SPAWN_LOCATIONS } from "../../resources/crewmember-names";
import { Game } from "../game";
import { Trigger, MapPlayer, Unit, Timer } from "w3ts";
import { BURST_RIFLE_ITEM_ID, SHOTGUN_ITEM_ID, ITEM_ID_EMO_INHIB, ITEM_ID_REPAIR } from "../weapons/weapon-constants";
import { ZONE_TYPE } from "../world/zone-id";
import { ForceType } from "app/force/forces/force-type";
import { TECH_WEP_DAMAGE, ABIL_INQUIS_PURITY_SEAL, TECH_MAJOR_RELIGION, ABIL_INQUIS_SMITE, ABIL_ITEM_EMOTIONAL_DAMP } from "resources/ability-ids";
import { CREWMEMBER_UNIT_ID } from "resources/unit-ids";
import { ITEM_GENETIC_SAMPLER, ITEM_SIGNAL_BOOSTER } from "resources/item-ids";
import { AlienForce } from "app/force/forces/alien-force";
import { ForceEntity } from "app/force/force-entity";
import { EventEntity } from "app/events/event-entity";
import { EVENT_TYPE } from "app/events/event-enum";

import { WorldEntity } from "app/world/world-entity";
import { EventListener } from "app/events/event-type";
import { ResearchFactory } from "app/research/research-factory";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { ALIEN_FORCE_NAME } from "app/force/forces/force-names";
import { Hooks } from "lib/Hooks";
import { Quick } from "lib/Quick";
import { Vector2 } from "app/types/vector2";

export class CrewFactory {  
    private static instance: CrewFactory;

    public static getInstance() {        
        if (this.instance == null) {
            this.instance = new CrewFactory();
            Hooks.set(this.name, this.instance);
        }
        return this.instance;
    }

    game: Game;

    crewmemberForUnit = new Map<Unit, Crewmember>();
    allCrew: Crewmember[] = [];

    allJobs: Array<ROLE_TYPES> = [];

    crewmemberDamageTrigger: Trigger;

    constructor() {
        // Create crew takes damage trigger
        this.crewmemberDamageTrigger = new Trigger();
        this.crewmemberDamageTrigger.registerAnyUnitEvent(EVENT_PLAYER_UNIT_DAMAGED);
        this.crewmemberDamageTrigger.addCondition(Condition(() => {
            const player = GetOwningPlayer(GetTriggerUnit());
            return (GetPlayerId(player) < PlayerStateFactory.AlienAIPlayer1.id);
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
            else if (it === 3) this.allJobs.push(ROLE_TYPES.ENGINEER);
            // else if (it === 3) this.allJobs.push(ROLE_TYPES.NAVIGATOR);
            else if (it < 5) this.allJobs.push(ROLE_TYPES.PILOT);
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
        }
        // Doctor begins with extra will and vigor
        else if (crewmember.role === ROLE_TYPES.DOCTOR) {
            SetHeroStr(nUnit.handle, GetHeroStr(nUnit.handle, false)+2, true);
            SetHeroInt(nUnit.handle, GetHeroInt(nUnit.handle, false)+4, true);
            const item = CreateItem(ITEM_GENETIC_SAMPLER, 0, 0);
            UnitAddItem(crewmember.unit.handle, item);

        }
        // Doctor begins with extra vigour and items
        else if (crewmember.role === ROLE_TYPES.ENGINEER) {
            SetHeroStr(nUnit.handle, GetHeroStr(nUnit.handle, false)+3, true);

            let item = CreateItem(ITEM_SIGNAL_BOOSTER, 0, 0);
            UnitAddItem(crewmember.unit.handle, item);

            item = CreateItem(ITEM_ID_REPAIR, 0, 0);
            SetItemCharges(item, 10);
            UnitAddItem(crewmember.unit.handle, item);
        }
        // Navigator has extra accuracy
        else if (crewmember.role === ROLE_TYPES.NAVIGATOR) {
            SetHeroAgi(nUnit.handle, GetHeroAgi(nUnit.handle, false)+5, true);
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
        }

        if (!roleGaveWeapons) {
            const item = CreateItem(BURST_RIFLE_ITEM_ID, 0, 0);
            UnitAddItem(crewmember.unit.handle, item);
            EventEntity.send(EVENT_TYPE.DO_EQUIP_WEAPON, {
                source: crewmember.unit,
                data: { item }
            });
        }

        const spawnLocation = this.getSpawnFor(crewmember.role);
        const location = WorldEntity.getInstance().getPointZone(spawnLocation.x, spawnLocation.y);

        
        nUnit.x = spawnLocation.x;
        nUnit.y = spawnLocation.y;
        WorldEntity.getInstance().travel(crewmember.unit, location.id);

        BlzShowUnitTeamGlow(crewmember.unit.handle, false);
        BlzSetUnitName(nUnit.handle, crewmember.role);
        BlzSetHeroProperName(nUnit.handle, crewmember.name);
        SuspendHeroXP(nUnit.handle, true);
        SetPlayerName(nUnit.owner.handle, crewmember.name);
        PanCameraToTimedForPlayer(nUnit.owner.handle, nUnit.x, nUnit.y, 0);
        this.allCrew.push(crewmember);

        return crewmember;
    }
   
    getSpawnFor(role: ROLE_TYPES): Vector2 {
        const spawns = ROLE_SPAWN_LOCATIONS.get(role);

        const option = Quick.GetRandomFromArray(spawns, 1) as Vector2[];
        if (option.length > 0) {
            const spawn = option[0];
            Quick.Slice(spawns, spawns.indexOf(spawn));
            return spawn;
        }
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