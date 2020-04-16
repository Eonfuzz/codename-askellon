/** @noSelfInFile **/
import { Game } from "../game";
import { Log } from "../../lib/serilog/serilog";
import { ForceModule } from "./force-module";
import { ForceType } from "./force-type";
import { Vector2, vectorFromUnit } from "app/types/vector2";
import { ABIL_CREWMEMBER_INFO, ABIL_TRANSFORM_HUMAN_ALIEN, ABIL_TRANSFORM_ALIEN_HUMAN } from "resources/ability-ids";
import { Crewmember } from "app/crewmember/crewmember-type";
import { alienTooltipToAlien, alienTooltipToHuman } from "resources/ability-tooltips";
import { VISION_TYPE } from "app/world/vision-type";
import { EVENT_TYPE, EventListener } from "app/events/event";
import { PLAYER_COLOR } from "lib/translators";
import { Trigger, MapPlayer, Unit } from "w3ts";
import { ROLE_TYPES } from "resources/crewmember-names";
import { SoundRef, SoundWithCooldown } from "app/types/sound-ref";
import { STR_CHAT_ALIEN_HOST, STR_CHAT_ALIEN_SPAWN, STR_CHAT_ALIEN_TAG, STR_ALIEN_DEATH } from "resources/strings";
import { OBSERVER_FORCE_NAME } from "./observer-force";


export const ALIEN_FORCE_NAME = 'ALIEN';
export const DEFAULT_ALIEN_FORM = FourCC('ALI1');
export const ALIEN_CHAT_COLOR = '6f2583';
const ALIEN_CHAT_SOUND_REF = new SoundWithCooldown(5, 'Sounds\\AlienChatSound.mp3');

export class AlienForce extends ForceType {
    name = ALIEN_FORCE_NAME;

    public alienAIPlayer: player = Player(24);

    private alienHost: MapPlayer | undefined;
    private playerAlienUnits: Map<MapPlayer, Unit> = new Map();
    private playerIsTransformed: Map<MapPlayer, boolean> = new Map();
    private playerIsAlienAlliesOnly: Map<MapPlayer, boolean> = new Map();
    
    private currentAlienEvolution: number = DEFAULT_ALIEN_FORM;

    private alienDeathTrigs = new Map<Unit, Trigger>();
    private alienTakesDamageTrigger = new Trigger();
    private alienDealsDamageTrigger = new Trigger();

    constructor(forceModule: ForceModule) {
        super(forceModule);

        // Show vision on despair gain
        forceModule.game.event.addListener(new EventListener(
            EVENT_TYPE.CREW_GAIN_DESPAIR, 
            (from: EventListener, data: any) => {
                const crewmember = data.crewmember as Crewmember;
                this.getPlayers().forEach(p => crewmember.unit.shareVision(p, true));
            }))
        
        // Hide vision on despair gain
        forceModule.game.event.addListener(new EventListener(
            EVENT_TYPE.CREW_LOSE_DESPAIR, 
            (from: EventListener, data: any) => {
                const crewmember = data.crewmember as Crewmember;
                this.getPlayers().forEach(p => crewmember.unit.shareVision(p, false));
            }))

        this.alienTakesDamageTrigger.addAction(() => this.onAlienTakesDamage());
        this.alienDealsDamageTrigger.registerAnyUnitEvent(EVENT_PLAYER_UNIT_DAMAGED);
        this.alienDealsDamageTrigger.addAction(() => this.onAlienDealsDamage());
    }
    
    makeAlien(game: Game, who: Crewmember, owner: MapPlayer): Unit {
        const unitLocation = vectorFromUnit(who.unit.handle);
        // const zLoc = this.forceModule.game.getZFromXY(unitLocation.x, unitLocation.y);

        let alien = this.playerAlienUnits.get(owner);
        // Is this unit being added to aliens for the first time
        if (!alien) {
            // Add the transform ability
            who.unit.addAbility(ABIL_TRANSFORM_HUMAN_ALIEN);
            alien = Unit.fromHandle(CreateUnit(owner.handle, 
                this.currentAlienEvolution, 
                unitLocation.x, 
                unitLocation.y, 
                who.unit.facing
            ));
            alien.invulnerable = true;
            alien.pauseEx(true);
            alien.show = false;
            alien.experience = who.unit.experience;
            alien.suspendExperience(true);

            // Register it for damage event
            this.registerAlienTakesDamageExperience(alien);
            game.tooltips.registerTooltip(who, alienTooltipToHuman);

            this.registerAlienDeath(alien);
            // Also register the crewmember for the event
            // this.registerAlienDealsDamage(who);


            const crewmember = game.crewModule.getCrewmemberForPlayer(owner);
            if (crewmember) crewmember.setVisionType(VISION_TYPE.ALIEN);
            
            // Additionally force the transform ability to start on cooldown
            BlzStartUnitAbilityCooldown(who.unit.handle, ABIL_TRANSFORM_HUMAN_ALIEN,
                who.unit.getAbilityCooldown(ABIL_TRANSFORM_HUMAN_ALIEN, 0)
            );
            // Add ability tooltip
            game.tooltips.registerTooltip(who, alienTooltipToAlien);

            // Make brown
            alien.color = PLAYER_COLOR_BROWN;
            // Track unit ability orders
            game.abilityModule.trackUnitOrdersForAbilities(alien);

            // Now create an alien for player
            this.playerAlienUnits.set(owner, alien);

            // Post event
            if (crewmember)
                game.event.sendEvent(EVENT_TYPE.CREW_BECOMES_ALIEN, { source: alien, crewmember: crewmember });
            return alien;
        }
        
        return alien;
    }

    public registerAlienDeath(who: Unit) {
        const trig = new Trigger();

        this.alienDeathTrigs.set(who, trig);
        trig.registerUnitEvent(who, EVENT_UNIT_DEATH);
        trig.addAction(() => this.removePlayerAlienUnit(who))
    }

    getFormName() {
        return GetObjectName(this.currentAlienEvolution);
    }

    setHost(who: MapPlayer) {
        this.alienHost = who;
    }

    getHost(): MapPlayer | undefined {
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
    addPlayerMainUnit(game: Game, whichUnit: Crewmember, player: MapPlayer) {
        super.addPlayerMainUnit(game, whichUnit, player);

        this.makeAlien(game, whichUnit, player);

        // mark this unit as the alien host
        if (!this.alienHost) this.setHost(player);
        
        // If the added player is dead we need to revive if
        if (!whichUnit.unit.isAlive()) {
            whichUnit.unit.revive(whichUnit.unit.x, whichUnit.unit.y, false);
            this.transform(game, player, true);
        }
    }


    removePlayerMainUnit(game: Game, whichUnit: Crewmember, player: MapPlayer) {
        super.removePlayerMainUnit(game, whichUnit, player);
        whichUnit.unit.removeAbility(ABIL_TRANSFORM_HUMAN_ALIEN);

        // Remove ability tooltip
        game.tooltips.unregisterTooltip(whichUnit, alienTooltipToHuman);
        game.tooltips.unregisterTooltip(this.getAlienFormForPlayer(player), alienTooltipToHuman);

        // As this can be called on alien death we need to make sure both alien and human is dead
        const alienUnit = this.getAlienFormForPlayer(player);

        whichUnit.unit.kill();
        alienUnit.kill();

        // Ensure player name reverts
        const oldData = this.forceModule.getOriginalPlayerDetails(player);
        player.name = oldData.name;
        player.color = oldData.colour;

        
        const players = game.forceModule.getActivePlayers();
        players.forEach(p => {
            DisplayTextToPlayer(p.handle, 0, 0, STR_ALIEN_DEATH(
                player,
                PLAYER_COLOR[player.id],
                whichUnit, 
                alienUnit, 
                this.getHost() === player)
            );
        });

        const obsForce = this.forceModule.getForce(OBSERVER_FORCE_NAME);
        obsForce.addPlayerMainUnit(game, whichUnit, player);
        this.forceModule.addPlayerToForce(player, OBSERVER_FORCE_NAME);
        this.removePlayer(player);
    }

    removePlayerAlienUnit(whichUnit: Unit) {
        // Remove tracking trigger
        this.alienDeathTrigs.delete(whichUnit);

        this.removePlayerMainUnit(
            this.forceModule.game, 
            this.forceModule.game.crewModule.getCrewmemberForPlayer(whichUnit.owner), 
            whichUnit.owner
        );
    }

    transform(game: Game, who: MapPlayer, toAlien: boolean): Unit {
        this.playerIsTransformed.set(who, toAlien);

        const alien = this.playerAlienUnits.get(who);
        const unit = this.playerUnits.get(who);
        const crewmember = game.crewModule.getCrewmemberForPlayer(who) as Crewmember;

        if (!alien) throw new Error("AlienForce::transform No alien for player!");
        if (!unit) throw new Error("AlienForce::transform No human for player!");

        const toHide = toAlien ? unit.unit : alien;
        const toShow = toAlien ? alien : unit.unit;

        // get the hiding unit's location and facing
        const facing = toHide.facing;
        const pos = vectorFromUnit(toHide.handle);
        const unitWasSelected = toHide.isSelected(who);
        const healthPercent = GetUnitLifePercent(toHide.handle);

        // hide and make the unit invul
        toHide.invulnerable = true;
        toHide.pauseEx(true);
        toHide.show = false;
        // Update location
        toShow.x = pos.x;
        toShow.y = pos.y;
        // Unpause and show
        toShow.show = true;
        toShow.invulnerable = false;
        toShow.pauseEx(false);
        // Set shown unit life percent
        SetUnitLifePercentBJ(toShow.handle, healthPercent);

        // Update player name
        if (toAlien) {
            const unitName = (who === this.alienHost) ? 'Alien Host' : 'Alien Spawn';

            toShow.nameProper = unitName;
            // Repair alliances
            // Then make it an enemy of security
            this.forceModule.repairAllAlliances(who);
            // Make enemy of security
            who.setAlliance(this.forceModule.stationSecurity, ALLIANCE_PASSIVE, true);
            this.forceModule.stationSecurity.setAlliance(who, ALLIANCE_PASSIVE, true);
            who.name = unitName;

            // Post event
            game.event.sendEvent(EVENT_TYPE.CREW_TRANSFORM_ALIEN, { crewmember: crewmember, source: alien });
        }
        else {
            this.forceModule.repairAllAlliances(who);
            const oldData = this.forceModule.getOriginalPlayerDetails(who);
            who.name = oldData.name;

            // Post event
            game.event.sendEvent(EVENT_TYPE.ALIEN_TRANSFORM_CREW, { crewmember: crewmember, source: alien });
        }

        if (unitWasSelected) SelectUnitAddForPlayer(toShow.handle, who.handle);


        return toShow;
    }

    isPlayerTransformed(who: MapPlayer) {
        return !!this.playerIsTransformed.get(who);
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

        let levelBefore = alien.level;
        
        // Apply XP gain to alien form
        alien.suspendExperience(false);
        alien.addExperience(MathRound(amount), true);
        alien.suspendExperience(true);
    
        if (levelBefore !== alien.level) {
            game.event.sendEvent(EVENT_TYPE.HERO_LEVEL_UP, { source: alien });
        }
    }

    public getAlienFormForPlayer(who: MapPlayer) {
        return this.playerAlienUnits.get(who);
    }

    private registerAlienTakesDamageExperience(alien: Unit) {
        this.alienTakesDamageTrigger.registerUnitEvent(alien, EVENT_UNIT_DAMAGED);
    }

    private onAlienDealsDamage() {
        const damageSource = Unit.fromHandle(GetEventDamageSource());
        const damagedUnit = Unit.fromHandle(BlzGetEventDamageTarget());
        const damagingPlayer = damageSource.owner;
        const damagedPlayer = damagedUnit.owner;

        if (!this.playerAlienUnits.has(damagingPlayer)) return;

        const damageAmount = GetEventDamage();

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
        const damageAmount = GetEventDamage();
        const damageSource = Unit.fromHandle(GetEventDamageSource());
        const damagedUnit = Unit.fromHandle(BlzGetEventDamageTarget());
        const damagingPlayer = damageSource.owner;
        const damagedPlayer = damagedUnit.owner;

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
    public getChatRecipients(sendingPlayer: MapPlayer) {
        // If the player is transformed return a list of all alien players
        if (this.isPlayerTransformed(sendingPlayer) && this.playerIsAlienAlliesOnly.get(sendingPlayer)) {
            return this.players;
        }
        
        // Otherwise return default behaviour
        return super.getChatRecipients(sendingPlayer);
    }

    /**
     * Gets the player's visible chat name, by default shows role name
     */
    public getChatName(who: MapPlayer) {
        // Log.Information("Alien is chatting? "+this.isPlayerTransformed(who));
        // If player is transformed return an alien name
        if (this.isPlayerTransformed(who)) {
            return this.alienHost === who ? STR_CHAT_ALIEN_HOST : STR_CHAT_ALIEN_SPAWN;
        }
        
        // Otherwise return default behaviour
        return super.getChatName(who);
    }

    /**
     * Return's a players chat colour
     * @param who 
     */
    public getChatColor(who: MapPlayer): string {
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
    public getChatSoundRef(who: MapPlayer): SoundRef {
        // If player is transformed return an alien name
        if (this.isPlayerTransformed(who)) {
            return ALIEN_CHAT_SOUND_REF;
        }
        
        // Otherwise return default behaviour
        return super.getChatSoundRef(who);
    }
    
    /**
     * Returns the chat tag, by default it will be null
     */
    public getChatTag(who: MapPlayer): string | undefined { 
        // If player is transformed return an alien name
        if (this.playerIsAlienAlliesOnly.get(who)) {
            return STR_CHAT_ALIEN_TAG;
        }
        
        // Otherwise return default behaviour
        return super.getChatTag(who);
    }
}