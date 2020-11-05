import { Log } from "../../../lib/serilog/serilog";
import { ForceType } from "./force-type";
import { vectorFromUnit } from "app/types/vector2";
import { ABIL_TRANSFORM_HUMAN_ALIEN, TECH_MAJOR_HEALTHCARE, TECH_ROACH_DUMMY_UPGRADE, ABIL_ALIEN_EVOLVE_T1, ABIL_ALIEN_EVOLVE_T2, TECH_PLAYER_INFESTS, ABIL_ALIEN_EVOLVE_T3 } from "resources/ability-ids";
import { Crewmember } from "app/crewmember/crewmember-type";
import { alienTooltipToAlien, alienTooltipToHuman } from "resources/ability-tooltips";
import { PLAYER_COLOR, PlayNewSound } from "lib/translators";
import { Trigger, MapPlayer, Unit } from "w3ts";
import { ROLE_TYPES } from "resources/crewmember-names";
import { SoundWithCooldown } from "app/types/sound-ref";
import { STR_CHAT_ALIEN_HOST, STR_CHAT_ALIEN_SPAWN, STR_CHAT_ALIEN_TAG, STR_ALIEN_DEATH } from "resources/strings";
import { BUFF_ID, BUFF_ID_ROACH_ARMOR } from "resources/buff-ids";
import { DEFAULT_ALIEN_FORM, CREWMEMBER_UNIT_ID, UNIT_ID_NEUTRAL_BEAR, ALIEN_MINION_FORMLESS, UNIT_ID_NEUTRAL_DOG, UNIT_ID_NEUTRAL_RABBIT, UNIT_ID_NEUTRAL_STAG, ALIEN_MINION_CANITE, ALIEN_MINION_LARVA } from "resources/unit-ids";
import { VISION_TYPE } from "app/vision/vision-type";
import { ResearchFactory } from "app/research/research-factory";
import { EventListener } from "app/events/event-type";
import { EventEntity } from "app/events/event-entity";
import { EVENT_TYPE } from "app/events/event-enum";
import { TooltipEntity } from "app/tooltip/tooltip-module";
import { VisionFactory } from "app/vision/vision-factory";
import { ChatHook } from "app/chat/chat-hook-type";
import { PlayerStateFactory } from "../player-state-entity";
import { OBSERVER_FORCE_NAME, ALIEN_FORCE_NAME, ALIEN_CHAT_COLOR } from "./force-names";
import { Players } from "w3ts/globals/index";
import { DynamicBuffState } from "app/buff/dynamic-buff-state";
import { WorldEntity } from "app/world/world-entity";
import { Timers } from "app/timer-type";
import { COL_ALIEN, COL_TEAL } from "resources/colours";
import { SOUND_ALIEN_GROWL } from "resources/sounds";
import { ChatEntity } from "app/chat/chat-entity";
import { PlayerState } from "../player-type";
import { SFX_ALIEN_BLOOD } from "resources/sfx-paths";


export const MAKE_UNCLICKABLE = false;

const ALIEN_CHAT_SOUND_REF = new SoundWithCooldown(8, 'Sounds\\AlienChatSound.mp3', true);

export class AlienForce extends ForceType {
    name = ALIEN_FORCE_NAME;

    private alienHost: MapPlayer | undefined;
    private playerAlienUnits: Map<MapPlayer, Unit> = new Map();
    private playerIsTransformed: Map<MapPlayer, boolean> = new Map();
    private playerIsAlienAlliesOnly: Map<MapPlayer, boolean> = new Map();
    
    private currentAlienEvolution: number = DEFAULT_ALIEN_FORM;

    private alienDeathTrigs = new Map<Unit, Trigger>();
    // private alienTakesDamageTrigger = new Trigger();
    private alienDealsDamageTrigger = new Trigger();
    private alienKillsTrigger = new Trigger();

    constructor() {
        super();
        
        // Show vision on despair gain
        EventEntity.getInstance().addListener(new EventListener(
            EVENT_TYPE.CREW_GAIN_DESPAIR, 
            (from: EventListener, data) => {
                this.getPlayers().forEach(p => data.source.shareVision(p, true));
                // Reveal for alien AI
                PlayerStateFactory.getAlienAI().forEach(p => {
                    data.source.shareVision(p, true);
                });
            }));
        
        // Hide vision on despair gain
        EventEntity.getInstance().addListener(new EventListener(
            EVENT_TYPE.CREW_LOSE_DESPAIR, 
            (from: EventListener, data) => {

                // If healthcare 1 is infested we may still have vision
                if (ResearchFactory.getInstance().isUpgradeInfested(TECH_MAJOR_HEALTHCARE, 1)) {
                    const despair = DynamicBuffState.unitHasBuff(BUFF_ID.DESPAIR, data.source);

                    if (despair && despair.getInstanceCount() > 0 && despair.getNegativeinstanceCount() > 0) {
                        return;
                    }
                }

                this.getPlayers().forEach(p => data.source.shareVision(p, false));
                PlayerStateFactory.getAlienAI().forEach(p => {
                    data.source.shareVision(p, false);
                });
            }));

        // this.alienTakesDamageTrigger.addAction(() => this.onAlienTakesDamage());
        this.alienDealsDamageTrigger.registerAnyUnitEvent(EVENT_PLAYER_UNIT_DAMAGING);
        this.alienDealsDamageTrigger.addAction(() => this.onAlienDealsDamage());

        // Listen to unit deaths
        this.alienKillsTrigger.registerAnyUnitEvent(EVENT_PLAYER_UNIT_DEATH);
        this.alienKillsTrigger.addAction(() => {
            const dyingUnit = Unit.fromHandle(GetTriggerUnit());
            const killingUnit = Unit.fromHandle(GetKillingUnit());

            const validKillingPlayer = (this.hasPlayer(killingUnit.owner) || PlayerStateFactory.isAlienAI(killingUnit.owner)) && killingUnit.typeId !== CREWMEMBER_UNIT_ID;
            const validDyingUnit = !this.hasPlayer(dyingUnit.owner) && !PlayerStateFactory.isAlienAI(dyingUnit.owner) && dyingUnit.typeId !== CREWMEMBER_UNIT_ID;
            const validDyingType = !IsUnitType(dyingUnit.handle, UNIT_TYPE_MECHANICAL);

            if (validDyingType && validDyingUnit && validKillingPlayer) {

                let unitToSpawnType: number = undefined;

                if (dyingUnit.typeId === UNIT_ID_NEUTRAL_BEAR) unitToSpawnType = ALIEN_MINION_FORMLESS;
                else if (dyingUnit.typeId === UNIT_ID_NEUTRAL_STAG) unitToSpawnType = ALIEN_MINION_CANITE;
                else if (dyingUnit.typeId === UNIT_ID_NEUTRAL_DOG) unitToSpawnType = ALIEN_MINION_CANITE;
                else unitToSpawnType = ALIEN_MINION_LARVA;

                const aiPlayer = PlayerStateFactory.getAlienAI()[0];
                CreateUnit(aiPlayer.handle, unitToSpawnType, dyingUnit.x, dyingUnit.y, dyingUnit.facing);
            }
        })
    }
    
    makeAlien(who: Crewmember, owner: MapPlayer): Unit {
        const unitLocation = vectorFromUnit(who.unit.handle);
        // const zLoc = this.forceModule.game.getZFromXY(unitLocation.x, unitLocation.y);

        let alien = this.playerAlienUnits.get(owner);
        // Is this unit being added to aliens for the first time
        if (!alien) {
            // Set player infesting to true
            owner.setTechResearched(TECH_PLAYER_INFESTS, 1);

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
            // this.registerAlienTakesDamageExperience(alien);
            TooltipEntity.getInstance().registerTooltip(who, alienTooltipToHuman);

            this.registerAlienDeath(alien);
            // Also register the crewmember for the event
            // this.registerAlienDealsDamage(who);


            // TODO Change how vision is handled
            const pData = PlayerStateFactory.get(owner);
            const crewmember = pData.getCrewmember();                

            // mark this unit as the alien host
            if (!this.alienHost) {
                this.setHost(owner);
            }
            // Otherwise this is not the host, weaken it.
            else {
                alien.maxLife = MathRound(alien.maxLife * 0.75);
                alien.strength = MathRound(alien.strength * 0.75);
                alien.intelligence = MathRound(alien.intelligence * 0.75);
                alien.setBaseDamage( MathRound(alien.getBaseDamage(0) * 0.8), 0);
                alien.setScale(0.8, 0.8, 0.8);
                alien.removeAbility(ABIL_ALIEN_EVOLVE_T1);
                alien.removeAbility(ABIL_ALIEN_EVOLVE_T2);
            }
            alien.nameProper = "|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|nAlien";

            // Add ability tooltip
            TooltipEntity.getInstance().registerTooltip(who, alienTooltipToAlien);

            // Make brown
            alien.color = PLAYER_COLOR_BROWN;
            
            // Now create an alien for player
            this.playerAlienUnits.set(owner, alien);

            // Hiding life bars
            if (MAKE_UNCLICKABLE) alien.addAbility(FourCC('Aloc'));

            // Other things (dummy upgrades etc)
            SetPlayerTechResearched(alien.owner.handle, TECH_ROACH_DUMMY_UPGRADE, 1);

            // Post event
            if (crewmember) {
                EventEntity.getInstance().sendEvent(EVENT_TYPE.CREW_BECOMES_ALIEN, { source: alien, crewmember: crewmember });

                const oldZone = WorldEntity.getInstance().getUnitZone(crewmember.unit);
                // And handle travel
                if (oldZone) {
                    WorldEntity.getInstance().travel(alien, oldZone.id);
                }
            
            }

            alien.invulnerable = true;
            Timers.addTimedAction(1, () => alien.invulnerable = false);
            VisionFactory.getInstance().setPlayervision(owner, VISION_TYPE.HUMAN);
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
    checkVictoryConditions(): boolean {
        return this.players.length > 0;
    }

    /**
     * TODO
     */
    addPlayerMainUnit(whichUnit: Crewmember, player: MapPlayer) {
        super.addPlayerMainUnit(whichUnit, player);
        this.makeAlien(whichUnit, player);
    }


    removePlayer(player: MapPlayer, killer?: Unit) {
        const forceHasPlayer = this.players.indexOf(player) >= 0;

        if (forceHasPlayer) {
            const playerData = PlayerStateFactory.get(player);
            const crew = playerData.getCrewmember();
            const alienForm = this.getAlienFormForPlayer(player);
            
            crew.unit.removeAbility(ABIL_TRANSFORM_HUMAN_ALIEN);

            // Remove ability tooltip
            TooltipEntity.getInstance().unregisterTooltip(crew, alienTooltipToHuman);
            TooltipEntity.getInstance().unregisterTooltip(this.getAlienFormForPlayer(player), alienTooltipToHuman);

            // As this can be called on alien death we need to make sure both alien and human is dead
            const alienUnit = this.getAlienFormForPlayer(player);
            const deathTrig = this.alienDeathTrigs.get(alienUnit);
            deathTrig.destroy();
            this.alienDeathTrigs.delete(alienUnit);
            
            const transformed = this.isPlayerTransformed(player);

            if (transformed) {
                crew.unit.x = alienUnit.x;
                crew.unit.y = alienUnit.y;
            }
            else {
                alienUnit.x = crew.unit.x; 
                alienUnit.y = crew.unit.y; 
            }

            crew.unit.kill();
            alienUnit.kill();

            // Ensure player name reverts
            const pData = PlayerStateFactory.get(player);
            player.name = pData.originalName;
            player.color = pData.originalColour;

            PlayNewSound("Sounds\\Nazgul.wav", 60);
            Players.forEach(p => {
                DisplayTextToPlayer(p.handle, 0, 0, STR_ALIEN_DEATH(
                    player,
                    PLAYER_COLOR[player.id],
                    crew, 
                    alienUnit, 
                    this.getHost() === player)
                );
            });

            const obsForce = PlayerStateFactory.getForce(OBSERVER_FORCE_NAME);

            obsForce.addPlayer(player);
            obsForce.addPlayerMainUnit(crew, player);
            PlayerStateFactory.get(player).setForce(obsForce);
        }

        super.removePlayer(player, killer);        
    }

    removePlayerAlienUnit(whichUnit: Unit) {
        // Also need to call remove player as the alien unit dying will also kill the palyer
        this.removePlayer(whichUnit.owner);
    }

    transform(who: MapPlayer, toAlien: boolean): Unit | void {
        this.playerIsTransformed.set(who, toAlien);

        const alien = this.playerAlienUnits.get(who);
        const unit = this.playerUnits.get(who);

        const crewmember = PlayerStateFactory.get(who).getCrewmember();

        //@ts-ignore
        if (!alien) return Log.Error("AlienForce::transform No alien for player!");
        //@ts-ignore
        if (!unit) return Log.Error("AlienForce::transform No human for player!");

        const toHide = toAlien ? unit.unit : alien;
        const toShow = toAlien ? alien : unit.unit;

        // get the hiding unit's location and facing
        const facing = toHide.facing;
        const pos = vectorFromUnit(toHide.handle);
        const unitWasSelected = true; //toHide.isSelected(who);
        const healthPercent = GetUnitLifePercent(toHide.handle);

        // If we are turning into human, add aloc to the hiding unit
        // This is to remove highlighting info
        if (!toAlien && MAKE_UNCLICKABLE) {
            toHide.addAbility(FourCC('Aloc'));
        }
        // hide and make the unit invul
        toHide.invulnerable = true;
        toHide.pauseEx(true);
        toHide.show = false;
        // Update location
        toShow.x = pos.x;
        toShow.y = pos.y;

        // Hides tooltip info if iti s alien
        // ORDER IS IMPORTANT
        if (toAlien && MAKE_UNCLICKABLE) toShow.removeAbility(FourCC('Aloc'));

        // Unpause and show
        toShow.show = true;
        toShow.invulnerable = false;
        toShow.pauseEx(false);
        // Set shown unit life percent
        SetUnitLifePercentBJ(toShow.handle, healthPercent);

        // Update player name
        if (toAlien) {
            const unitName = (who === this.alienHost) ? 'Alien Host' : 'Alien Spawn';
            toShow.name = unitName;
            toShow.color = PLAYER_COLOR_PURPLE;

            who.name = unitName;
            who.color = PLAYER_COLOR_PURPLE;

            // Post event
            EventEntity.getInstance().sendEvent(EVENT_TYPE.CREW_TRANSFORM_ALIEN, { crewmember: crewmember, source: alien });
        }
        else {
            // Ensure player name reverts
            const pData = PlayerStateFactory.get(who);
            who.name = pData.originalName;
            who.color = pData.originalColour;

            // Post event
            EventEntity.getInstance().sendEvent(EVENT_TYPE.ALIEN_TRANSFORM_CREW, { crewmember: crewmember, source: alien });
        }

        if (unitWasSelected) SelectUnitAddForPlayer(toShow.handle, who.handle);


        return toShow;
    }

    isPlayerTransformed(who: MapPlayer) {
        const playerIsTransformed = this.playerIsTransformed.get(who);
        return playerIsTransformed;
    }

    /**
     * Updates the alien form's XP to match
     * @param game 
     * @param whichUnit 
     * @param whichPlayer 
     * @param amount 
     */
    public onUnitGainsXp(whichUnit: Crewmember, newTotal: number) {
        // Apply it as per normal to the crewmember
        super.onUnitGainsXp(whichUnit, newTotal);

        // Do the same to the alien
        const alien = this.playerAlienUnits.get(whichUnit.player);
        if (!alien) return; // Do nothing if no alien for player
        
        // Apply XP gain to alien form
        alien.suspendExperience(false);
        alien.setExperience(MathRound(newTotal), false);
        alien.suspendExperience(true);
    }

    /**
     * Returns the player's currently "active" unit
     */
    public getActiveUnitFor(who: MapPlayer) {
        if (this.playerIsTransformed.get(who)) return this.getAlienFormForPlayer(who);
        return super.getActiveUnitFor(who);
    }

    public getAlienFormForPlayer(who: MapPlayer) {
        return this.playerAlienUnits.get(who);
    }

    private onAlienDealsDamage() {
        const damageSource = Unit.fromHandle(GetEventDamageSource());
        const damagedUnit = Unit.fromHandle(BlzGetEventDamageTarget());
        const damagingPlayer = damageSource.owner;
        const damagedPlayer = damagedUnit.owner;

        // If the damaging unit isn't alien that means we're taking damage
        if (!this.playerAlienUnits.has(damagingPlayer)) return this.onAlienTakesDamage();
        // Check to make sure you aren't damaging alien stuff
        if (damagingPlayer !== damagedPlayer && !this.playerAlienUnits.has(damagedPlayer)) {
            const damageAmount = GetEventDamage();
            let xpGained: number;

            // Now handle this different
            // If we are damaging station property gain less XP
            const damagingSecurity = damagedPlayer == PlayerStateFactory.StationProperty || damagedPlayer == PlayerStateFactory.StationSecurity;
            const isAlienForm = this.playerIsTransformed.get(damagingPlayer);
            // Reward slightly less xp for being in human form
            xpGained = damagingSecurity ? 0 : (isAlienForm ? damageAmount * 1 : damageAmount * 0.4);

            if (xpGained > 0) {
                EventEntity.getInstance().sendEvent(EVENT_TYPE.CREW_GAIN_EXPERIENCE, {
                    source: damageSource,
                    data: { value: xpGained }
                });
            }
        }
    }

    private onAlienTakesDamage() {
        let damageAmount = GetEventDamage();
        const damageSource = Unit.fromHandle(GetEventDamageSource());
        const damagedUnit = Unit.fromHandle(BlzGetEventDamageTarget());
        const damagingPlayer = damageSource.owner;
        const damagedPlayer = damagedUnit.owner;

        // Hitting alien player
        const damagedUnitIsAlien = PlayerStateFactory.isAlienAI(damagedPlayer) || 
            // OR hitting alien form
            this.playerAlienUnits.has(damagedPlayer)  && this.playerAlienUnits.get(damagedPlayer) === damagedUnit;

        // Ensure that they are different owners
        // No farming xp on yourself!
        // Also check to make sure they aren't both alien players
        if (damagedUnitIsAlien && damagingPlayer !== damagedPlayer && !this.playerAlienUnits.has(damagingPlayer)) {
            // If we have roach armor reduce damage received
            if (UnitHasBuffBJ(damagedUnit.handle, BUFF_ID_ROACH_ARMOR)) {
                BlzSetEventDamage(damageAmount - 7);
                damageAmount -= 7;
            }
    
            // Okay good, now reward exp based on damage done
            const pDetails = PlayerStateFactory.get(damagingPlayer);
            const crew = pDetails.getCrewmember();
            
            let xpAmount = damageAmount;

            if (crew && crew.role === ROLE_TYPES.SEC_GUARD) {
                xpAmount *= 1.3;
            }

            EventEntity.getInstance().sendEvent(EVENT_TYPE.CREW_GAIN_EXPERIENCE, {
                source: damageSource,
                data: { value: xpAmount }
            });
        }
    }


    /**
     * Gets a list of who can see the chat messages
     * Unless overridden returns all the players
     */
    public getChatRecipients(chatEvent: ChatHook) {
        // If the player is transformed return a list of all alien players
        if (this.isPlayerTransformed(chatEvent.who) && this.playerIsAlienAlliesOnly.get(chatEvent.who)) {
            return this.players;
        }
        
        // Otherwise return default behaviour
        return super.getChatRecipients(chatEvent);
    }

    /**
     * Gets the player's visible chat name, by default shows role name
     */
    public getChatName(chatEvent: ChatHook) {
        // Log.Information("Alien is chatting? "+this.isPlayerTransformed(who));
        // If player is transformed return an alien name
        if (this.isPlayerTransformed(chatEvent.who)) {
            return this.alienHost === chatEvent.who ? STR_CHAT_ALIEN_HOST : STR_CHAT_ALIEN_SPAWN;
        }
        
        // Otherwise return default behaviour
        return super.getChatName(chatEvent);
    }

    /**
     * Return's a players chat colour
     * @param who 
     */
    public getChatColor(chatEvent: ChatHook): string {
        // If player is transformed return an alien name
        if (this.isPlayerTransformed(chatEvent.who)) {
            return ALIEN_CHAT_COLOR;
        }
        
        // Otherwise return default behaviour
        return super.getChatColor(chatEvent);
    }

    /**
     * Returns the sound to be used on chat events
     * @param who
     */
    public getChatSoundRef(chatEvent: ChatHook): SoundWithCooldown {
        // If player is transformed return an alien name
        if (this.isPlayerTransformed(chatEvent.who)) {
            return SOUND_ALIEN_GROWL;
        }
        
        // Otherwise return default behaviour
        return super.getChatSoundRef(chatEvent);
    }
    
    /**
     * Returns the chat tag, by default it will be null
     */
    public getChatTag(chatEvent: ChatHook): string | undefined { 
        // If player is transformed return an alien name
        if (this.playerIsAlienAlliesOnly.get(chatEvent.who)) {
            return STR_CHAT_ALIEN_TAG;
        }
        
        // Otherwise return default behaviour
        return super.getChatTag(chatEvent);
    }

    /**
     * Returns true if the aggression is valid
     * used by force
     * Only host can start aggression between players
     * @param aggressor 
     * @param defendant 
     */
    public aggressionIsValid(aggressor: MapPlayer, defendant: MapPlayer): boolean {
        const defendantIsAlien = this.hasPlayer(defendant);

        // If this is alien v alien, only the host can start combat
        if (defendantIsAlien) {
            return this.getHost() === aggressor;
        }

        return true;
    }

    
    /**
     * Does this force do anything on tick
     * We need to reward player income
     * @param delta 
     */
    private deltaTicker = 0;
    public onTick(delta: number) {
        super.onTick(delta);

        this.deltaTicker += delta;
        // Every few seconds, ping alien players to all aliens
        if (this.deltaTicker >= 30) {
            this.deltaTicker = 0;
            // Get alien force
            this.players.forEach(player1 => {
                this.players.forEach(player2 => {
                    if (player1 == player2) return;

                    const u = this.isPlayerTransformed(player2) 
                        ? this.getAlienFormForPlayer(player2) 
                        : PlayerStateFactory.getCrewmember(player2).unit;

                    if (GetLocalPlayer() === player1.handle) {
                        PingMinimapEx(u.x, u.y, 3, 153, 51, 255, false);
                    }
                });
            });
        }
    }

    /**
     * Evolves the alien host and all spawn
     */
    public onEvolve(newForm: number) {

        try {
            // Increment current evo
            this.currentAlienEvolution = newForm;
            const alienHost = this.getHost();
            // const forceEnt = ForceEntity.getInstance();
            const worldEnt = WorldEntity.getInstance();
            
            // Get all players
            this.players.forEach(player => {
                // Now get their alien units and replace with the new evo
                const unit = this.playerAlienUnits.get(player);
                if (unit) {
                    // Get old unit zone
                    const oldZone = worldEnt.getUnitZone(unit);

                    // Remove the old unit from the zone
                    if (oldZone) {
                        worldEnt.removeUnit(unit);
                    }
                    ReplaceUnitBJ(unit.handle, newForm, 1);

                    const replacedUnit = GetLastReplacedUnitBJ();
                    const alien = Unit.fromHandle(replacedUnit);

                    this.registerAlienDeath(alien);

                    // And handle travel
                    if (oldZone) {
                        worldEnt.travel(alien, oldZone.id);
                    }
                
                    SelectUnitForPlayerSingle(alien.handle, player.handle);

                    this.playerAlienUnits.set(player, alien);
                    alien.nameProper = "|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|nAlien";
            
                    alien.name = 'Alien Host';
                    alien.color = PLAYER_COLOR_PURPLE;

                    DestroyEffect(AddSpecialEffect(SFX_ALIEN_BLOOD, alien.x, alien.y));

                    // Now we need to also set alien spawn penalties
                    if (player !== alienHost) {
                        alien.maxLife = MathRound(alien.maxLife * 0.75);
                        alien.strength = MathRound(alien.strength * 0.75);
                        alien.intelligence = MathRound(alien.intelligence * 0.75);
                        alien.setBaseDamage( MathRound(alien.getBaseDamage(0) * 0.8), 0);
                        alien.setScale(0.8, 0.8, 0.8);
                        alien.removeAbility(ABIL_ALIEN_EVOLVE_T1);
                        alien.removeAbility(ABIL_ALIEN_EVOLVE_T2);
                        alien.removeAbility(ABIL_ALIEN_EVOLVE_T3);
                        alien.name = 'Alien Spawn';
                        
                    }
                    // If a player isn't transformed force the transformation
                    if (!this.playerIsTransformed.get(player)) {
                        this.transform(player, true);
                    }
                }
            })
        }
        catch (e) {
            Log.Error("Evolution failed!");
            Log.Error(e);
        }
    }

    
    /**
     * 
     * @param who 
     */
    public introduction(who: MapPlayer, skipDefaultIntro: boolean = false) {
        if (skipDefaultIntro != true) super.introduction(who);

        const pData = PlayerStateFactory.get(who);
        const crew = pData.getCrewmember();

        Timers.addTimedAction(4, () => {
            const isHost = this.getHost() === who;

            if (GetLocalPlayer() === who.handle) {
                SOUND_ALIEN_GROWL.setVolume(127);
                SOUND_ALIEN_GROWL.playSound();
                if (isHost) {
                    DisplayTextToPlayer(who.handle, 0, 0, `${COL_ALIEN}The hive welcomes you, my new Host.|r`);
                }
                else {
                    DisplayTextToPlayer(who.handle, 0, 0, `${COL_ALIEN}The hive welcomes you, my child.|r`);
                }
                DisplayTextToPlayer(who.handle, 0, 0, `${COL_ALIEN}Spread, go forth and feast on the biomass of the other creatures here. Kill them using your ${COL_TEAL}True Form|r${COL_ALIEN} we have gifted you and you shall build an army.|r`);
            }
        });
    }

    protected onPlayerLevelUp(who: MapPlayer, level: number) {
        super.onPlayerLevelUp(who, level);

        if (level === 4) {
            ChatEntity.getInstance().postSystemMessage(who, `${COL_ALIEN}You are powerful enough to evolve|r`);
        }
    }
}