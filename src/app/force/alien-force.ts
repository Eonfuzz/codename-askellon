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
import { PLAYER_COLOR } from "lib/translators";
import { Trigger } from "app/types/jass-overrides/trigger";
import { ROLE_TYPES } from "resources/crewmember-names";
import { SoundRef } from "app/types/sound-ref";


export const ALIEN_FORCE_NAME = 'ALIEN';
export const DEFAULT_ALIEN_FORM = FourCC('ALI1');
export const ALIEN_CHAT_COLOR = '6f2583';
const ALIEN_CHAT_SOUND_REF = new SoundRef('Sound/ChatSound', false);

export class AlienForce extends ForceType {
    name = ALIEN_FORCE_NAME;

    public alienAIPlayer: player = Player(24);

    private alienHost: player | undefined;
    private playerAlienUnits: Map<player, unit> = new Map();
    private playerIsTransformed: Map<player, boolean> = new Map();
    
    private currentAlienEvolution: number = DEFAULT_ALIEN_FORM;

    private alienTakesDamageTrigger = new Trigger();
    private alienDealsDamageTrigger = new Trigger();

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

        this.alienTakesDamageTrigger.AddAction(() => this.onAlienTakesDamage());
        this.alienDealsDamageTrigger.RegisterAnyUnitEventBJ(EVENT_PLAYER_UNIT_DAMAGED);
        this.alienDealsDamageTrigger.AddAction(() => this.onAlienDealsDamage());
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

            // Register it for damage event
            this.registerAlienTakesDamageExperience(alien);
            // this.registerAlienDealsDamage(alien);
            // Also register the crewmember for the event
            // this.registerAlienDealsDamage(who);


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
        const crewmember = game.crewModule.getCrewmemberForPlayer(who) as Crewmember;

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

            BlzSetHeroProperName(toShow, unitName);
            // Repair alliances
            // Then make it an enemy of security
            this.forceModule.repairAllAlliances(who);
            // Make enemy of security
            SetPlayerAllianceStateAllyBJ(who, this.forceModule.stationSecurity, false);
            SetPlayerAllianceStateAllyBJ(this.forceModule.stationSecurity, who, false);

            // Post event
            game.event.sendEvent(EVENT_TYPE.CREW_TRANSFORM_ALIEN, { crewmember: crewmember, alien: alien });
        }
        else {
            this.forceModule.repairAllAlliances(who);

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
            this.getFormName(),
            whichCrew.role
        );
        const tfAlien = TRANSFORM_TOOLTIP(
            income, 
            false, 
            this.getFormName(),
            whichCrew.role
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
        // Apply it as per normal to the crewmember
        super.onUnitGainsXp(game, whichUnit, amount);

        // Do the same to the alien
        const alien = this.playerAlienUnits.get(whichUnit.player);
        if (!alien) return; // Do nothing if no alien for player

        // Apply XP gain to alien form
        SuspendHeroXP(alien, false);
        AddHeroXP(alien, MathRound(amount), true);
        SuspendHeroXP(alien, false);
    }

    public getAlienFormForPlayer(who: player) {
        return this.playerAlienUnits.get(who);
    }

    private registerAlienTakesDamageExperience(alien: unit) {
        this.alienTakesDamageTrigger.RegisterUnitEvent(alien, EVENT_UNIT_DAMAGED);
    }

    private onAlienDealsDamage() {
        const damageSource = GetEventDamageSource();
        const damagingPlayer = GetOwningPlayer(damageSource);

        if (!this.playerAlienUnits.has(damagingPlayer)) return;

        const damagedUnit = BlzGetEventDamageTarget();
        const damageAmount = GetEventDamage();

        const damagedPlayer = GetOwningPlayer(damagedUnit);

        // Check to make sure you aren't damaging alien stuff
        if (damagingPlayer !== damagedPlayer && !this.playerAlienUnits.has(damagedPlayer)) {
            let xpGained: number;

            // Now handle this different
            // If we are damaging station property gain less XP
            const damagingSecurity = damagedPlayer == this.forceModule.stationProperty || damagedPlayer == this.forceModule.stationSecurity;
            const isAlienForm = this.playerIsTransformed.get(damagingPlayer);
            // Reward slightly less xp for being in human form
            xpGained = damagingSecurity ? damageAmount * 0.3 : (isAlienForm ? damageAmount * 1 : damageAmount * 0.4);

            const crewmember = this.forceModule.game.crewModule.getCrewmemberForPlayer(damagingPlayer);
            if (crewmember) {
                this.onUnitGainsXp(this.forceModule.game, crewmember, xpGained);
            }
        }
    }

    private onAlienTakesDamage() {
        const damageSource = GetEventDamageSource();
        const damagedUnit = BlzGetEventDamageTarget();
        const damageAmount = GetEventDamage();

        const damagingPlayer = GetOwningPlayer(damageSource);
        const damagedPlayer = GetOwningPlayer(damagedUnit);

        // Ensure that they are different owners
        // No farming xp on yourself!
        // Also check to make sure they aren't both alien players
        if (damagingPlayer !== damagedPlayer && !this.playerAlienUnits.has(damagingPlayer)) {
            // Okay good, now reward exp based on damage done
            const damageSourceForce = this.forceModule.getPlayerForce(damagingPlayer);
            const crewmember = this.forceModule.game.crewModule.getCrewmemberForPlayer(damagingPlayer);

            if (damageSourceForce && crewmember) {
                // Do I make it proportional to level as a catchup mechanic?
                // Increase XP gained for damaging host by Sec Guard
                const xpAmount = crewmember.role === ROLE_TYPES.SEC_GUARD ? damageAmount * 1.3 : 1;
                damageSourceForce.onUnitGainsXp(this.forceModule.game, crewmember, xpAmount);
            }
        }
    }


    /**
     * Gets a list of who can see the chat messages
     * Unless overridden returns all the players
     */
    public getChatRecipients(sendingPlayer: player) {
        // If the player is transformed return a list of all alien players
        if (this.isPlayerTransformed(sendingPlayer)) {
            return this.players;
        }
        
        // Otherwise return default behaviour
        return super.getChatRecipients(sendingPlayer);
    }

    /**
     * Gets the player's visible chat name, by default shows role name
     */
    public getChatName(who: player) {
        // If player is transformed return an alien name
        if (this.isPlayerTransformed(who)) {
            return this.alienHost === who ? "Alien Host" : "Alien Spawn";
        }
        
        // Otherwise return default behaviour
        return super.getChatName(who);
    }

    /**
     * Return's a players chat colour
     * @param who 
     */
    public getChatColor(who: player): string {
        // If player is transformed return an alien name
        if (this.isPlayerTransformed(who)) {
            return ALIEN_CHAT_COLOR;
        }
        
        // Otherwise return default behaviour
        return super.getChatColor(who);
    }

    /**
     * Returns the sound to be used on chat events
     * @param who
     */
    public getChatSoundRef(who: player): SoundRef {
        // If player is transformed return an alien name
        if (this.isPlayerTransformed(who)) {
            return ALIEN_CHAT_SOUND_REF;
        }
        
        // Otherwise return default behaviour
        return super.getChatSoundRef(who);
    }
}