import { Game } from "app/game";
import { Trigger } from "app/types/jass-overrides/trigger";
import { TECH_MAJOR_WEAPONS_PRODUCTION, TECH_WEP_DAMAGE } from "resources/ability-ids";
import { STR_UPGRADE_NAME_WEAPONS, STR_UPGRADE_COMPLETE_HEADER, STR_UPGRADE_COMPLETE_SUBTITLE, STR_UPGRADE_COMPLETE_INFESTATION } from "resources/strings";
import { ALIEN_FORCE_NAME } from "app/force/alien-force";

/**
 * Handles research and upgrades
 */

 export class ResearchModule {
    public game: Game;


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
                this.processMajorUpgrade(techUnlocked, levelTech);
                // Process upgrade for all players
                this.game.crewModule.CREW_MEMBERS.forEach(c => c.onPlayerFinishUpgrade());
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
        return false;
    }

    /**
     * Grants upgrades, unlocks things and others!
     */
    processMajorUpgrade(id: number, level: number) {
        const isInfested = false;
        const alienForce = this.game.forceModule.getForce(ALIEN_FORCE_NAME);

        // Go through all players and grant the tech at the tech at the same level
        const players = this.game.forceModule.getActivePlayers();
        players.forEach(p => SetPlayerTechResearched(p, id, level));
        // Now send message to all players
        // Get all players on the ship
        const pAlert = this.game.worldModule.askellon.getPlayers();
        const techName = this.getTechName(id, level);

        pAlert.forEach(p => {
            DisplayTextToPlayer(p, 0, 0, STR_UPGRADE_COMPLETE_HEADER(techName));
            DisplayTextToPlayer(p, 0, 0, STR_UPGRADE_COMPLETE_SUBTITLE(techName));
            if (alienForce && isInfested && alienForce.hasPlayer(p)) {
                DisplayTextToPlayer(p, 0, 0, STR_UPGRADE_COMPLETE_INFESTATION(techName));
                // Play infestation complete sound
            }
            else {
                // Play upgrade complete sound
            }
        });
    }

    /**
     * 
     */
    getTechName(id: number, level: number) {
        switch (id) {
            default:
            case TECH_WEP_DAMAGE: return STR_UPGRADE_NAME_WEAPONS(level);
        }
    }
 }