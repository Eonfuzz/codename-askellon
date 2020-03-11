/** @noSelfInFile **/
import { Game } from "../game";
import { Log } from "../../lib/serilog/serilog";
import { ForceModule } from "./force-module";
import { ForceType } from "./force-type";
import { Vector2, vectorFromUnit } from "app/types/vector2";
import { ABIL_CREWMEMBER_INFO, ABIL_TRANSFORM_HUMAN_ALIEN, ABIL_TRANSFORM_ALIEN_HUMAN } from "resources/ability-ids";
import { Crewmember } from "app/crewmember/crewmember-type";
import { TRANSFORM_TOOLTIP } from "resources/ability-tooltips";
import { VISION_TYPE } from "app/world/vision-type";
import { EVENT_TYPE, EventListener } from "app/events/event";


export const ALIEN_FORCE_NAME = 'ALIEN';
export const DEFAULT_ALIEN_FORM = FourCC('ALI1');

export class AlienForce extends ForceType {
    name = ALIEN_FORCE_NAME;

    public alienAIPlayer: player = Player(24);

    private alienHost: player | undefined;
    private playerAlienUnits: Map<player, unit> = new Map();
    private playerIsTransformed: Map<player, boolean> = new Map();
    
    private currentAlienEvolution: number = DEFAULT_ALIEN_FORM;

    constructor(forceModule: ForceModule) {
        super(forceModule);

        // Show vision on despair gain
        forceModule.game.event.addListener(new EventListener(
            EVENT_TYPE.CREW_GAIN_DESPAIR, 
            (from: EventListener, data: any) => {
                const crewmember = data.crewmember as Crewmember;
                this.getPlayers().forEach(p => UnitShareVision(crewmember.unit, p, true));
            }))
        
        // Hide vision on despair gain
        forceModule.game.event.addListener(new EventListener(
            EVENT_TYPE.CREW_LOSE_DESPAIR, 
            (from: EventListener, data: any) => {
                const crewmember = data.crewmember as Crewmember;
                this.getPlayers().forEach(p => UnitShareVision(crewmember.unit, p, false));
            }))
    }
    
    makeAlien(game: Game, who: unit, owner: player): unit {
        const unitLocation = vectorFromUnit(who);
        // const zLoc = this.forceModule.game.getZFromXY(unitLocation.x, unitLocation.y);

        let alien = this.playerAlienUnits.get(owner);
        // Is this unit being added to aliens for the first time
        if (!alien) {
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
            SuspendHeroXP(alien, true);

            const crewmember = game.crewModule.getCrewmemberForPlayer(owner);
            if (crewmember) crewmember.setVisionType(VISION_TYPE.ALIEN);

            // Additionally force the transform ability to start on cooldown
            BlzStartUnitAbilityCooldown(who, ABIL_TRANSFORM_HUMAN_ALIEN,
                BlzGetAbilityCooldown(ABIL_TRANSFORM_HUMAN_ALIEN, 0)
            );

            // Make brown
            SetUnitColor(alien, PLAYER_COLOR_BROWN);
            // Track unit ability orders
            game.abilityModule.trackUnitOrdersForAbilities(alien);

            // Now create an alien for player
            this.playerAlienUnits.set(owner, alien);

            // Post event
            game.event.sendEvent(EVENT_TYPE.CREW_BECOMES_ALIEN, { crewmember: crewmember, alien: alien });
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


    removePlayerMainUnit(game: Game, whichUnit: unit, player: player) {
        UnitRemoveAbility(whichUnit, ABIL_TRANSFORM_HUMAN_ALIEN);
    }

    transform(game: Game, who: player, toAlien: boolean): unit {
        this.playerIsTransformed.set(who, toAlien);

        const alien = this.playerAlienUnits.get(who);
        const unit = this.playerUnits.get(who);
        const crewmember = game.crewModule.getCrewmemberForPlayer(who);

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
            // SetPlayerName(who, unitName);
            // SetPlayerColor(who, PLAYER_COLOR_BROWN);
            BlzSetHeroProperName(toShow, unitName);

            // Post event
            game.event.sendEvent(EVENT_TYPE.CREW_TRANSFORM_ALIEN, { crewmember: crewmember, alien: alien });
        }
        else {
            const originalDetails = this.forceModule.getOriginalPlayerDetails(who);
            if (originalDetails) {
                SetPlayerName(who, originalDetails.name);
                SetPlayerColor(who, originalDetails.colour);
            }

            // Post event
            game.event.sendEvent(EVENT_TYPE.ALIEN_TRANSFORM_CREW, { crewmember: crewmember, alien: alien });
        }

        if (unitWasSelected) SelectUnitAddForPlayer(toShow, who);


        return toShow;
    }

    isPlayerTransformed(who: player) {
        return !!this.playerIsTransformed.get(who);
    }

    /**
     * Updates the forces tooltip
     * does nothing by default
     * @param game 
     * @param whichUnit 
     * @param whichPlayer 
     */
    public updateForceTooltip(game: Game, whichCrew: Crewmember) {
        const income = game.crewModule.calculateIncome(whichCrew);

        const tooltip = TRANSFORM_TOOLTIP(
            income, 
            true, 
            this.getFormName()
        );
        const tfAlien = TRANSFORM_TOOLTIP(
            income, 
            false, 
            this.getFormName()
        );
        if (GetLocalPlayer() === whichCrew.player) {
            BlzSetAbilityExtendedTooltip(ABIL_TRANSFORM_HUMAN_ALIEN, tooltip, 0);
            BlzSetAbilityExtendedTooltip(ABIL_TRANSFORM_ALIEN_HUMAN, tfAlien, 0);
        }
    }

    /**
     * Updates the alien form's XP to match
     * @param game 
     * @param whichUnit 
     * @param whichPlayer 
     * @param amount 
     */
    public onUnitGainsXp(game: Game, whichUnit: Crewmember, amount: number) {
        const alien = this.playerAlienUnits.get(whichUnit.player);
        if (!alien) return; // Do nothing if no alien for player

        // Apply XP gain to alien form
        SuspendHeroXP(alien, false);
        AddHeroXP(alien, amount, true);
        SuspendHeroXP(alien, false);
    }

    public getAlienFormForPlayer(who: player) {
        return this.playerAlienUnits.get(who);
    }
}