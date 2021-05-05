import { Trigger, Unit, MapPlayer } from "w3ts";
import { TECH_MAJOR_WEAPONS_PRODUCTION, TECH_WEP_DAMAGE, TECH_MAJOR_HEALTHCARE, TECH_MAJOR_VOID, TECH_HERO_LEVEL, TECH_MAJOR_RELIGION, TECH_PLAYER_INFESTS, TECH_MAJOR_REACTOR, TECH_MAJOR_SECURITY, TECH_MINERALS_PROGRESS, TECH_MAJOR_REPAIR_TESTER } from "resources/ability-ids";
import { STR_UPGRADE_NAME_WEAPONS, STR_UPGRADE_NAME_RELIGION, STR_UPGRADE_COMPLETE_HEADER, STR_UPGRADE_COMPLETE_SUBTITLE, STR_UPGRADE_COMPLETE_INFESTATION, STR_UPGRADE_NAME_HEALTHCARE, STR_UPGRADE_NAME_VOID, STR_OCCUPATION_BONUS, STR_UPGRADE_NAME_REACTOR, STR_UPGRADE_NAME_SECURITY, STR_UPGRADE_MINERALS_PROGRESS, STR_UPGRADE_NAME_BLOOD_TESTER } from "resources/strings";
import { Crewmember } from "app/crewmember/crewmember-type";
import { ForceType } from "app/force/forces/force-type";
import { ROLE_TYPES } from "resources/crewmember-names";
import { SoundRef } from "app/types/sound-ref";
import { EventEntity } from "app/events/event-entity";
import { EventListener } from "app/events/event-type";
import { EVENT_TYPE } from "app/events/event-enum";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { ALIEN_FORCE_NAME } from "app/force/forces/force-names";
import { Players } from "w3ts/globals/index";
import { Hooks } from "lib/Hooks";
import { Log } from "lib/serilog/serilog";
import { AskellonEntity } from "app/station/askellon-entity";
import { MessagePlayer } from "lib/utils";

const majorResarchSound = new SoundRef("Sounds\\Station\\major_research_complete.mp3", false, true);

/**
 * Handles research and upgrades
 */
 export class ResearchFactory {  
    private static instance: ResearchFactory;

    public static getInstance() {        
        if (this.instance == null) {
            this.instance = new ResearchFactory();
            Hooks.set(this.name, this.instance);
        }
        return this.instance;
    }

    // STRING is `${UpgradeId}::${UpgradeLevel}`, isInfested
    private infestedUpgrades = new Map<string, boolean>();
    // Has the role got the occupation bonus
    private hasOccupationBonus = new Map<string, boolean>();
    // Which roles gran occupation bonus for x upgrade
    private grantsOccupationBonus = new Map<number, ROLE_TYPES[]>();
    private majorUpgradeLevels = new Map<number, number>();

    constructor() {

        this.trackCrewUpgrades();
        this.grantsOccupationBonus.set(TECH_MAJOR_VOID, [ROLE_TYPES.NAVIGATOR, ROLE_TYPES.PILOT]);
        this.grantsOccupationBonus.set(TECH_MAJOR_HEALTHCARE, [ROLE_TYPES.DOCTOR]);
        this.grantsOccupationBonus.set(TECH_MAJOR_REPAIR_TESTER, [ROLE_TYPES.DOCTOR]);
        this.grantsOccupationBonus.set(TECH_MAJOR_RELIGION, [ROLE_TYPES.INQUISITOR]);
        this.grantsOccupationBonus.set(TECH_MAJOR_REACTOR, [ROLE_TYPES.ENGINEER]);
        this.grantsOccupationBonus.set(TECH_MAJOR_SECURITY, [ROLE_TYPES.SEC_GUARD]);

        // Update player "Level x" research when a player levels up
        EventEntity.getInstance().addListener(new EventListener(EVENT_TYPE.HERO_LEVEL_UP, (self, data) => {
            const level = data.source.getHeroLevel();
            SetPlayerTechResearched(data.source.owner.handle, TECH_HERO_LEVEL, level);
        }));
    }

    /**
     * Refresh tooltips on research upgrade
     */
    trackCrewUpgrades() {
        const t = new Trigger();
        t.registerAnyUnitEvent( EVENT_PLAYER_UNIT_RESEARCH_FINISH );
        t.addAction(() => {
            const unit = Unit.fromHandle(GetTriggerUnit());
            const player = unit.owner;
            const techUnlocked = GetResearched();
            const levelTech = player.getTechCount(techUnlocked, true);

            /**
             * If tech researched is a global thing, alert and give the upgrade to all players
             */
            if (this.techIsMajor(techUnlocked)) {
                try {
                    // Process the tech upgrade yo
                    this.processMajorUpgrade(techUnlocked, levelTech, player);
                }
                catch(e) {
                    Log.Error(e);
                }
            }
            // Otherwise just update it for a single player
            else {
                const p = GetOwningPlayer(GetTriggerUnit());
                const pData = PlayerStateFactory.get(MapPlayer.fromHandle(p));
                const crew = pData.getCrewmember();
                if (crew) {
                    crew.onPlayerFinishUpgrade();

                    // Broadcast item equip event
                    EventEntity.getInstance().sendEvent(EVENT_TYPE.MINOR_UPGRADE_RESEARCHED, { 
                        source: unit, crewmember: crew, data: { researched: techUnlocked }
                    });
                }
            }
        })
    }
    

    /**
     * Returns true if the tech is a major upgrade
     */
    techIsMajor(id: number): boolean {
        if (id === TECH_MAJOR_WEAPONS_PRODUCTION) return true;
        if (id === TECH_MAJOR_HEALTHCARE) return true;
        if (id === TECH_MAJOR_VOID) return true;
        if (id === TECH_MAJOR_RELIGION) return true;
        if (id === TECH_MAJOR_REACTOR) return true;
        if (id === TECH_MAJOR_SECURITY) return true;
        if (id === TECH_MAJOR_REPAIR_TESTER) return true;
        return false;
    }

    /**
     * Grants upgrades, unlocks things and others!
     */
    public processMajorUpgrade(id: number, level: number, player?: MapPlayer) {
        try {
            const isInfested = player && player.getTechCount(TECH_PLAYER_INFESTS, true) > 0;

            // Go through all players and grant the tech at the tech at the same level
            Players.forEach(p => p.setTechResearched(id, level));

            // Now send message to all players
            // Get all players on the ship
            // const pAlert = this.game.worldModule.askellon.getPlayers();
            const techName = this.getTechName(id, level);
            this.majorUpgradeLevels.set(id, level);

            const crewmember = PlayerStateFactory.getCrewmember(player);
            if (isInfested) this.setUpgradeAsInfested(id, level, true);

            // Handle occupation bonuses
            const roles = this.grantsOccupationBonus.get(id);
            const hasOccupationBonus = crewmember && roles && roles.indexOf(crewmember.role) >= 0;
            this.setHasOccupationBonus(id, level, hasOccupationBonus);

            Players.forEach(p => {
                MessagePlayer(p, STR_UPGRADE_COMPLETE_HEADER());
                MessagePlayer(p, STR_UPGRADE_COMPLETE_SUBTITLE(techName));
                if (hasOccupationBonus) {
                    // Play upgrade complete sound
                    MessagePlayer(p, STR_OCCUPATION_BONUS());
                }

                const pData = PlayerStateFactory.get(p);
                if (pData) {
                    const pForce = pData.getForce();

                    if (pForce && isInfested && pForce.is(ALIEN_FORCE_NAME)) {
                        MessagePlayer(p, STR_UPGRADE_COMPLETE_INFESTATION());
                        // Play infestation complete sound
                    }
                }
            });

            this.onMajorUpgrade(id, level, hasOccupationBonus, isInfested);

            // Brilliant, now reward the player with experience
            if (crewmember) {
                const pData = PlayerStateFactory.get(player);
                const pForce = pData.getForce();
                this.rewardResearchXP(pForce, crewmember, player, id);
            }

            majorResarchSound.playSound();
            // Broadcast item equip event
            EventEntity.getInstance().sendEvent(EVENT_TYPE.MAJOR_UPGRADE_RESEARCHED, { 
                source: undefined, data: { researched: id, level: level }
            });
        }
        catch(e) {
            Log.Error(`Failed processing major upgrade ${e}`);
        }
    }

    /**
     * 
     */
    getTechName(id: number, level: number) {
        if (id === TECH_MAJOR_WEAPONS_PRODUCTION)
            return STR_UPGRADE_NAME_WEAPONS(level);
        if (id === TECH_MAJOR_HEALTHCARE)
            return STR_UPGRADE_NAME_HEALTHCARE(level);
        if (id === TECH_MAJOR_VOID)
            return STR_UPGRADE_NAME_VOID(level);
        if (id === TECH_MAJOR_RELIGION)
            return STR_UPGRADE_NAME_RELIGION(level);
        if (id === TECH_MAJOR_REACTOR)
            return STR_UPGRADE_NAME_REACTOR(level);
        if (id === TECH_MAJOR_SECURITY)
            return STR_UPGRADE_NAME_SECURITY(level);
        if (id === TECH_MINERALS_PROGRESS)
            return STR_UPGRADE_MINERALS_PROGRESS(level);
        if (id === TECH_MAJOR_REPAIR_TESTER)
            return STR_UPGRADE_NAME_BLOOD_TESTER(level);
        return '';
    }

    public setUpgradeAsInfested(upgrade: number, level: number, state: boolean) {
        const key = this.getKeyForUpgradeLevel(upgrade, level);
        this.infestedUpgrades.set(key, state);
    }

    public isUpgradeInfested(upgrade: number, level: number) {
        return this.infestedUpgrades.get(this.getKeyForUpgradeLevel(upgrade, level)) || false;
    }

    /**
     * Returns the role that researched the techj
     * @param upgrade 
     * @param level 
     */
    public techHasOccupationBonus(upgrade: number, level: number): boolean {
        const key = this.getKeyForUpgradeLevel(upgrade, level);
        return !!this.hasOccupationBonus.get(key);
    }

    /**
     * Sets the upgrade source
     * @param upgrade 
     * @param level 
     * @param role 
     */
    public setHasOccupationBonus(upgrade: number, level: number, state: boolean) {
        const key = this.getKeyForUpgradeLevel(upgrade, level);
        return this.hasOccupationBonus.set(key, state);
    }
    
    // Used to generate keys for upgrades
    private getKeyForUpgradeLevel(upgrade: number, level: number) {
        return `${upgrade}::${level}`;
    }

    public getMajorUpgradeLevel(upgrade: number) {
        return this.majorUpgradeLevels.get(upgrade) || 0;
    }
    
    private rewardResearchXP(force: ForceType, crewmember: Crewmember, player: MapPlayer, techUnlocked: number) {
        let baseXp = 250 * this.getMajorUpgradeLevel(techUnlocked);

        const roles = this.grantsOccupationBonus.get(techUnlocked);
        const hasOccupationBonus = crewmember && roles && roles.indexOf(crewmember.role) >= 0;

        // Increase xp by 30% if it is your role's research
        if (hasOccupationBonus) {
            baseXp * 1.3;
        }

        crewmember.addExperience(baseXp);
    }


    private onMajorUpgrade(upgradeId: number, newLevel: number, hasOccupationBonus: boolean, wasInfested: boolean) {
        if (upgradeId === TECH_MAJOR_REACTOR) {
            switch(newLevel) {
                case 1:
                    AskellonEntity.getInstance().powerRegeneration += 0.25;
                    break;
                case 2:
                    AskellonEntity.getInstance().maxPower += 25;
                    break;
                case 3:
                    AskellonEntity.getInstance().maxPower += 25;
                    break;
            }
        }
    }
 }