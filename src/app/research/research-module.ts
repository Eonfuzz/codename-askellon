import { Game } from "app/game";
import { Trigger } from "app/types/jass-overrides/trigger";
import { TECH_MAJOR_WEAPONS_PRODUCTION, TECH_WEP_DAMAGE, TECH_MAJOR_HEALTHCARE } from "resources/ability-ids";
// import { STR_OPT_ALIEN } from "resources/strings";
import { ALIEN_FORCE_NAME } from "app/force/alien-force";
import { STR_UPGRADE_NAME_WEAPONS, STR_UPGRADE_COMPLETE_HEADER, STR_UPGRADE_COMPLETE_SUBTITLE, STR_UPGRADE_COMPLETE_INFESTATION, STR_UPGRADE_NAME_HEALTHCARE } from "resources/strings";
import { Log } from "lib/serilog/serilog";
import { ROLE_TYPES } from "app/crewmember/crewmember-names";
import { Crewmember } from "app/crewmember/crewmember-type";
import { ForceType } from "app/force/force-type";

/**
 * Handles research and upgrades
 */
 export class ResearchModule {
    public game: Game;

    // STRING is `${UpgradeId}::${UpgradeLevel}`, isInfested
    private infestedUpgrades = new Map<string, boolean>();
    private upgradeSource = new Map<string, ROLE_TYPES>();
    private majorUpgradeLevels = new Map<number, number>();

    constructor(game: Game) {
        this.game = game;
    }

    /**
     * Attaches event handlers and the like
     */
    initialise() {
        this.trackCrewUpgrades();
    }

    /**
     * Refresh tooltips on research upgrade
     */
    trackCrewUpgrades() {
        const t = new Trigger();
        t.RegisterAnyUnitEventBJ( EVENT_PLAYER_UNIT_RESEARCH_FINISH );
        t.AddAction(() => {
            const player = GetOwningPlayer(GetTriggerUnit());
            const techUnlocked = GetResearched();
            const levelTech = GetPlayerTechCount(player, techUnlocked, true);
            /**
             * If tech researched is a global thing, alert and give the upgrade to all players
             */
            if (this.techIsMajor(techUnlocked)) {
                // Process the tech upgrade yo
                this.processMajorUpgrade(player, techUnlocked, levelTech);
                // Process upgrade for all players
                this.game.crewModule.CREW_MEMBERS.forEach(c => c.onPlayerFinishUpgrade());
                // Brilliant, now reward the player with experience
                const pForce = this.game.forceModule.getPlayerForce(player);
                const crewmember = this.game.crewModule.getCrewmemberForPlayer(player);

                if (pForce && crewmember) this.rewardResearchXP(pForce, crewmember, player, techUnlocked);
            }
            // Otherwise just update it for a single player
            else {
                const p = GetOwningPlayer(GetTriggerUnit());
                const crew = this.game.crewModule.getCrewmemberForPlayer(p);
                if (crew) {
                    crew.onPlayerFinishUpgrade();
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
        return false;
    }

    /**
     * Grants upgrades, unlocks things and others!
     */
    processMajorUpgrade(player: player, id: number, level: number) {
        const alienForce = this.game.forceModule.getForce(ALIEN_FORCE_NAME);
        const isInfested = alienForce && alienForce.hasPlayer(player);

        // Go through all players and grant the tech at the tech at the same level
        const players = this.game.forceModule.getActivePlayers();
        players.forEach(p => SetPlayerTechResearched(p, id, level));
        // Now send message to all players
        // Get all players on the ship
        // const pAlert = this.game.worldModule.askellon.getPlayers();
        const techName = this.getTechName(id, level);

        players.forEach(p => {
            DisplayTextToPlayer(p, 0, 0, STR_UPGRADE_COMPLETE_HEADER());
            DisplayTextToPlayer(p, 0, 0, STR_UPGRADE_COMPLETE_SUBTITLE(techName));
            if (alienForce && isInfested && alienForce.hasPlayer(p)) {
                DisplayTextToPlayer(p, 0, 0, STR_UPGRADE_COMPLETE_INFESTATION());
                // Play infestation complete sound
                this.setUpgradeAsInfested(id, level, true);
            }
            else {
                // Play upgrade complete sound
            }
        });


        const crewmember = this.game.crewModule.getCrewmemberForPlayer(player);
        if (isInfested) this.setUpgradeAsInfested(id, level, true);
        if (crewmember) this.setUpgradeSource(id, level, crewmember.role);
        this.majorUpgradeLevels.set(id, level);
    }

    /**
     * 
     */
    getTechName(id: number, level: number) {
        if (id === TECH_MAJOR_WEAPONS_PRODUCTION)
            return STR_UPGRADE_NAME_WEAPONS(level);
        if (id === TECH_MAJOR_HEALTHCARE)
            return STR_UPGRADE_NAME_HEALTHCARE(level);
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
    public getUpgradeSource(upgrade: number, level: number): ROLE_TYPES | undefined {
        const key = this.getKeyForUpgradeLevel(upgrade, level);
        return this.upgradeSource.get(key);
    }

    /**
     * Sets the upgrade source
     * @param upgrade 
     * @param level 
     * @param role 
     */
    public setUpgradeSource(upgrade: number, level: number, role: ROLE_TYPES) {
        const key = this.getKeyForUpgradeLevel(upgrade, level);
        return this.upgradeSource.set(key, role);
    }
    
    // Used to generate keys for upgrades
    private getKeyForUpgradeLevel(upgrade: number, level: number) {
        return `${upgrade}::${level}`;
    }

    public getMajorUpgradeLevel(upgrade: number) {
        return this.majorUpgradeLevels.get(upgrade) || 0;
    }
    
    private rewardResearchXP(force: ForceType, crewmember: Crewmember, player: player, techUnlocked: number) {
        let baseXp = 500 * this.getMajorUpgradeLevel(techUnlocked);

        // Increase xp by 50% if it is your role's research
        if (techUnlocked === TECH_MAJOR_HEALTHCARE && crewmember.role === ROLE_TYPES.DOCTOR) {
            baseXp * 1.5;
        }

        force.onUnitGainsXp(
            this.game, 
            crewmember, 
            // Award XP
            baseXp
        );
    }
 }