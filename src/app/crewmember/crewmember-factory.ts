import { Crewmember } from "./crewmember-type";
import { ROLE_NAMES, ROLE_TYPES, ROLE_SPAWN_LOCATIONS } from "../../resources/crewmember-names";
import { Game } from "../game";
import { Trigger, MapPlayer, Unit, Timer, playerColors } from "w3ts";
import { BURST_RIFLE_ITEM_ID, SHOTGUN_ITEM_ID, ITEM_ID_EMO_INHIB, ITEM_ID_REPAIR, ITEM_ID_NANOMED } from "../weapons/weapon-constants";
import { ZONE_TYPE } from "../world/zone-id";
import { ForceType } from "app/force/forces/force-type";
import { TECH_WEP_DAMAGE, ABIL_INQUIS_PURITY_SEAL, TECH_MAJOR_RELIGION, ABIL_INQUIS_SMITE, ABIL_ITEM_EMOTIONAL_DAMP } from "resources/ability-ids";
import { CREWMEMBER_UNIT_ID } from "resources/unit-ids";
import { ITEM_CAPTAINS_CIGAR, ITEM_COMEBACK_DRUG, ITEM_GENETIC_SAMPLER, ITEM_SIGNAL_BOOSTER } from "resources/item-ids";
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
import { Players } from "w3ts/globals/index";
import { Log } from "lib/serilog/serilog";
import { ChatEntity } from "app/chat/chat-entity";
import { Timers } from "app/timer-type";
import { MessagePlayer } from "lib/utils";
import { COL_GOOD } from "resources/colours";
import { PlayerState, PRIVS } from "app/force/player-type";

const crwSkins = [FourCC('Crw0'), FourCC('Crw1')];

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

        // We need to load in spawn locations
        this.allJobs = [
            ROLE_TYPES.CAPTAIN, 
            ROLE_TYPES.DOCTOR, 
            ROLE_TYPES.ENGINEER, 
            ROLE_TYPES.INQUISITOR, 
            ROLE_TYPES.PILOT,
            ROLE_TYPES.SEC_GUARD,
            ROLE_TYPES.PILOT,
            ROLE_TYPES.SEC_GUARD,
            ROLE_TYPES.PILOT,
            ROLE_TYPES.SEC_GUARD
        ];

        // Loop through all of our role options
        let roleTypesVisited = new Map<ROLE_TYPES, boolean>();

        this.allJobs.forEach(j => {
            if (!roleTypesVisited.has(j)) {
                roleTypesVisited.set(j, true);
                let strId = j.toLowerCase();
                while (strId.indexOf('_') >= 0) {
                    strId = strId.replace('_', '');
                }
                while (strId.indexOf(' ') >= 0) {
                    strId = strId.replace(' ', '');
                }

                const namespaceVarName = `gg_rct_spawn${strId}`;
    
                let idx = 1;
                let namespaceCheck = `${namespaceVarName}${idx++}`;
                while (_G[namespaceCheck]) {
                    // Grab the rect center X / Y as the spawn location
                    const rect = _G[namespaceCheck] as rect;
                    const oldSpawns = ROLE_SPAWN_LOCATIONS.get(j) || [];
                    const loc = new Vector2(GetRectCenterX(rect), GetRectCenterY(rect));
                    oldSpawns.push(loc);
                    ROLE_SPAWN_LOCATIONS.set(j, oldSpawns);
                    namespaceCheck = `${namespaceVarName}${idx++}`;
                }
            }
        });

        // Now splice the role list depending on our number of players
        const numPlayers = Players.filter(p => p.slotState === PLAYER_SLOT_STATE_PLAYING && p.controller === MAP_CONTROL_USER).length;
        this.allJobs.splice(numPlayers);
    }

    initCrew() {
        const forces = PlayerStateFactory.getInstance().forces;
        let totalPlayers = 0;

        forces.forEach(force => totalPlayers += force.getPlayers().length);
    
        // Force alien host to transform
        const aForce = PlayerStateFactory.getForce(ALIEN_FORCE_NAME) as AlienForce;

        let it = 0;
        while (it < forces.length) {
            const force = forces[it];
            const players = force.getPlayers();
            let y = 0;

            while (y < players.length) {
                let player = players[y];
                let crew = this.createCrew(player, force) as Crewmember;
                // crew.updateTooltips(this.game.weaponModule);

                if (crew && force === aForce) {
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
                else if (!crew) {
                    Log.Error(`Failed to make crew for ${player.name}`);
                }

                y++;
            }
            it++;
        }

        // this.crewTimer.start(DELTA_CHECK, true, () => this.processCrew(DELTA_CHECK));
    }

    createCrew(player: MapPlayer, force: ForceType): Crewmember | void {
        const role = Quick.GetRandomFromArray(this.allJobs, 1)[0];

        // Remove the role from our list of options
        this.allJobs.splice(this.allJobs.indexOf(role), 1);

        const name = this.getCrewmemberName(role);

        const spawnLocation = this.getSpawnFor(role);
        

        if (!role) return Log.Error(`Failed to create role for ${player.name} in ${force.name} of ${role}`);
        if (!name) return Log.Error(`Failed to create name for ${player.name} in ${force.name} of ${role}`);
        if (!spawnLocation) return Log.Error(`Failed to create spawn location ${player.name} in ${force.name} of ${role}`);
        const location = WorldEntity.getInstance().getPointZone(spawnLocation.x, spawnLocation.y);
        if (!location) return Log.Error(`Failed to find spawn zone ${player.name} in ${force.name} of ${role} in ${spawnLocation.toString()}`);

        try { 
            const pData = PlayerStateFactory.get(player);
            
            let nUnit = Unit.fromHandle(BlzCreateUnitWithSkin(player.handle, CREWMEMBER_UNIT_ID, spawnLocation.x, spawnLocation.y, bj_UNIT_FACING, this.getSkinFor(pData)));
            let crewmember = new Crewmember(player, nUnit, force, role);

            crewmember.setName(name);
            crewmember.setPlayer(player);

            // Update pData
            pData.setCrewmember(crewmember);
            
            this.crewmemberForUnit.set(nUnit, crewmember);        

            // Add the unit to its force
            force.addPlayerMainUnit(crewmember, player);
            // SelectUnitAddForPlayer(crewmember.unit.handle, player.handle);
            
            let roleGaveWeapons = false;
            // Handle unique role bonuses
            // Captain starts at level 2
            if (crewmember.role === ROLE_TYPES.CAPTAIN) {
                // And slightly higher will
                crewmember.unit.setIntelligence(
                    crewmember.unit.getIntelligence(false) + 2, 
                    true
                );
                const item = CreateItem(ITEM_CAPTAINS_CIGAR, 0, 0);
                UnitAddItem(crewmember.unit.handle, item);
            }
            // Sec guard starts with weapon damage 1 and have shotguns
            else if (crewmember.role === ROLE_TYPES.SEC_GUARD) {
                roleGaveWeapons = true;

                player.setTechResearched(TECH_WEP_DAMAGE, 1);
                const item = CreateItem(SHOTGUN_ITEM_ID, 0, 0);
                UnitAddItem(crewmember.unit.handle, item);
                EventEntity.send(EVENT_TYPE.DO_EQUIP_WEAPON, {
                    source: crewmember.unit,
                    data: { item }
                });

                const drugs = CreateItem(ITEM_COMEBACK_DRUG, 0, 0);
                SetItemCharges(drugs, 3);
                UnitAddItem(crewmember.unit.handle, drugs);

            }
            // Doctor begins with extra will and vigor
            else if (crewmember.role === ROLE_TYPES.DOCTOR) {
                SetHeroStr(nUnit.handle, GetHeroStr(nUnit.handle, false)+2, true);
                SetHeroInt(nUnit.handle, GetHeroInt(nUnit.handle, false)+4, true);
                let item = CreateItem(ITEM_GENETIC_SAMPLER, 0, 0);
                UnitAddItem(crewmember.unit.handle, item);
                item = CreateItem(ITEM_ID_NANOMED, 0, 0);
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

            
            WorldEntity.getInstance().travel(crewmember.unit, location.id);

            BlzShowUnitTeamGlow(crewmember.unit.handle, false);
            BlzSetUnitName(nUnit.handle, crewmember.role);
            BlzSetHeroProperName(nUnit.handle, crewmember.name);
            SuspendHeroXP(nUnit.handle, true);
            SetPlayerName(nUnit.owner.handle, crewmember.name);
            PanCameraToTimedForPlayer(nUnit.owner.handle, nUnit.x, nUnit.y, 0);
            this.allCrew.push(crewmember);

            // Increment player "games"
            Timers.addTimedAction(30, () => {
                pData.log();
                // Increment games played
                pData.gamesPlayed += 1;
                pData.gamesLeft += 1;
                pData.save();
            });

            return crewmember;
        }
        catch(e) {
            Log.Error(`Failed to make crew ${e}`);
        }
    }
   
    getSpawnFor(role: ROLE_TYPES): Vector2 {
        const spawns = ROLE_SPAWN_LOCATIONS.get(role);

        const option = Quick.GetRandomFromArray(spawns, 1) as Vector2[];
        if (option.length > 0) {
            const spawn = option[0];
            Quick.Slice(spawns, spawns.indexOf(spawn));
            return spawn;
        }
        else {
            Log.Error(`Failed to find spawn for ${role}, max: ${spawns ? spawns.length : 'NIL'}`);
            return undefined;
        }
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

    private getSkinFor(who: PlayerState) {        
        const isVeteran = who.getUserPrivs() >= PRIVS.VETERAN;
        const skin = isVeteran ? crwSkins[1] : crwSkins[0];
        return skin;
    }
}