/** @noSelfInFile **/
import { Game } from "../game";
import { Log } from "../../lib/serilog/serilog";
import { ForceModule } from "./force-module";
import { ForceType } from "./force-type";
import { Vector2, vectorFromUnit } from "app/types/vector2";
import { ABIL_CREWMEMBER_INFO, ABIL_TRANSFORM_HUMAN_ALIEN } from "resources/ability-ids";


export const ALIEN_FORCE_NAME = 'ALIEN';
export const DEFAULT_ALIEN_FORM = FourCC('ALI1');

export class AlienForce extends ForceType {
    name = ALIEN_FORCE_NAME;

    private alienHost: player | undefined;
    private playerAlienUnits: Map<player, unit> = new Map();
    private playerIsTransformed: Map<player, boolean> = new Map();
    
    private currentAlienEvolution: number = DEFAULT_ALIEN_FORM;
    
    makeAlien(game: Game, who: unit, owner: player): unit {
        const unitLocation = vectorFromUnit(who);
        // const zLoc = this.forceModule.game.getZFromXY(unitLocation.x, unitLocation.y);

        let alien = this.playerAlienUnits.get(owner);
        // Is this unit being added to aliens for the first time
        if (!alien) {
            // Remove the crewmember information ability
            UnitRemoveAbility(who, ABIL_CREWMEMBER_INFO);
            // Add the transform ability
            UnitAddAbility(who, ABIL_TRANSFORM_HUMAN_ALIEN);
            alien = CreateUnit(owner, 
                this.currentAlienEvolution, 
                unitLocation.x, 
                unitLocation.y, 
                GetUnitFacing(who)
            );
            SetUnitInvulnerable(alien, true);
            BlzPauseUnitEx(alien, true);
            ShowUnit(alien, false);

            // Make brown
            SetUnitColor(alien, PLAYER_COLOR_BROWN);
            // Track unit ability orders
            game.abilityModule.trackUnitOrdersForAbilities(alien);

            // Now create an alien for player
            this.playerAlienUnits.set(owner, alien);
            return alien;
        }
        
        return alien;
    }

    getFormName() {
        return GetObjectName(this.currentAlienEvolution);
    }

    setHost(who: player) {
        this.alienHost = who;
    }

    getHost(): player | undefined {
        return this.alienHost;
    }

    /**
     * Checks the victory conditions of this force
     * Returns true if victory conditions are met
     */
    checkVictoryConditions(forceModule: ForceModule): boolean {
        return this.players.length > 0;
    }

    /**
     * TODO
     */
    addPlayerMainUnit(game: Game, whichUnit: unit, player: player) {
        super.addPlayerMainUnit(game, whichUnit, player);

        this.makeAlien(game, whichUnit, player);
        // mark this unit as the alien host
        this.setHost(player);
    }

    transform(who: player, toAlien: boolean): unit {
        this.playerIsTransformed.set(who, toAlien);

        const alien = this.playerAlienUnits.get(who);
        const unit = this.playerUnits.get(who);

        if (!alien) throw new Error("AlienForce::transform No alien for player!");
        if (!unit) throw new Error("AlienForce::transform No human for player!");

        const toHide = toAlien ? unit : alien;
        const toShow = toAlien ? alien : unit;

        // get the hiding unit's location and facing
        const facing = GetUnitFacing(toHide);
        const pos = vectorFromUnit(toHide);
        const unitWasSelected = IsUnitSelected(toHide, who);
        const healthPercent = GetUnitLifePercent(toHide);

        // hide and make the unit invul
        SetUnitInvulnerable(toHide, true);
        BlzPauseUnitEx(toHide, true);
        ShowUnit(toHide, false);
        // Update location
        SetUnitX(toShow, pos.x);
        SetUnitY(toShow, pos.y);
        // Unpause and show
        ShowUnit(toShow, true);
        SetUnitInvulnerable(toShow, false);
        BlzPauseUnitEx(toShow, false);
        // Set shown unit life percent
        SetUnitLifePercentBJ(toShow, healthPercent);

        // Update player name
        if (toAlien) {
            const unitName = (who === this.alienHost) ? 'Alien Host' : 'Alien Spawn';
            SetPlayerName(who, unitName);
            SetPlayerColor(who, PLAYER_COLOR_BROWN);
            BlzSetHeroProperName(toShow, unitName);
        }
        else {
            const originalDetails = this.forceModule.getOriginalPlayerDetails(who);
            if (originalDetails) {
                SetPlayerName(who, originalDetails.name);
                SetPlayerColor(who, originalDetails.colour);
            }
        }

        if (unitWasSelected) SelectUnitAddForPlayer(toShow, who);

        return toShow;
    }

    isPlayerTransformed(who: player) {
        return !!this.playerIsTransformed.get(who);
    }
}