import { Log } from "../../../lib/serilog/serilog";
import { ForceType } from "./force-type";
import { vectorFromUnit, Vector2 } from "app/types/vector2";
import { ABIL_TRANSFORM_HUMAN_ALIEN, TECH_MAJOR_HEALTHCARE, TECH_ROACH_DUMMY_UPGRADE, TECH_PLAYER_INFESTS, ABIL_ALIEN_WEBSHOT, ABIL_ALIEN_BROODNEST, ABIL_ALIEN_WEBWALK } from "resources/ability-ids";
import { Crewmember } from "app/crewmember/crewmember-type";
import { alienTooltipToAlien, alienTooltipToHuman } from "resources/ability-tooltips";
import { PlayNewSound } from "lib/translators";
import { Trigger, MapPlayer, Unit, playerColors } from "w3ts";
import { ROLE_TYPES } from "resources/crewmember-names";
import { SoundWithCooldown } from "app/types/sound-ref";
import { STR_CHAT_ALIEN_HOST, STR_CHAT_ALIEN_SPAWN, STR_CHAT_ALIEN_TAG, STR_ALIEN_DEATH } from "resources/strings";
import { BUFF_ID, BUFF_ID_ROACH_ARMOR } from "resources/buff-ids";
import { DEFAULT_ALIEN_FORM, CREWMEMBER_UNIT_ID, UNIT_ID_NEUTRAL_BEAR, ALIEN_MINION_FORMLESS, UNIT_ID_NEUTRAL_DOG, UNIT_ID_NEUTRAL_STAG, ALIEN_MINION_CANITE, ALIEN_MINION_LARVA, DEFILER_ALIEN_FORM } from "resources/unit-ids";
import { VISION_TYPE } from "app/vision/vision-type";
import { ResearchFactory } from "app/research/research-factory";
import { EventListener } from "app/events/event-type";
import { EventEntity } from "app/events/event-entity";
import { EVENT_TYPE } from "app/events/event-enum";
import { TooltipEntity } from "app/tooltip/tooltip-module";
import { VisionFactory } from "app/vision/vision-factory";
import { ChatHook } from "app/chat/chat-hook-type";
import { PlayerStateFactory } from "../player-state-entity";
import { OBSERVER_FORCE_NAME, ALIEN_FORCE_NAME, ALIEN_CHAT_COLOR, CREW_FORCE_NAME } from "./force-names";
import { Players } from "w3ts/globals/index";
import { DynamicBuffState } from "app/buff/dynamic-buff-state";
import { WorldEntity } from "app/world/world-entity";
import { Timers } from "app/timer-type";
import { COL_ALIEN, COL_TEAL, COL_GOLD } from "resources/colours";
import { SOUND_ALIEN_GROWL } from "resources/sounds";
import { ChatEntity } from "app/chat/chat-entity";
import { SFX_ALIEN_BLOOD } from "resources/sfx-paths";
import { CrewmemberForce } from "./crewmember-force";
import { MessagePlayer, MessageAllPlayers, CreateBlood } from "lib/utils";
import { Quick } from "lib/Quick";
import { UPGR_DUMMY_IS_ALIEN_HOST } from "resources/upgrade-ids";
import { GameTimeElapsed } from "app/types/game-time-elapsed";


export const MAKE_UNCLICKABLE = false;


export class AlienForce extends ForceType {
    name = ALIEN_FORCE_NAME;

    private alienHost: MapPlayer | undefined;
    private playerAlienUnits: Map<number, Unit> = new Map();
    private playerIsTransformed: Map<number, boolean> = new Map();
    private playerIsAlienAlliesOnly: Map<number, boolean> = new Map();
    
    private currentAlienEvolution: number = DEFAULT_ALIEN_FORM;

    private alienDeathTrigs = new Map<number, Trigger>();
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

        // Listen to unit deaths
        this.alienKillsTrigger.registerAnyUnitEvent(EVENT_PLAYER_UNIT_DEATH);
        this.alienKillsTrigger.addAction(() => {
            const dyingUnit = Unit.fromHandle(GetTriggerUnit());
            const killingUnit = Unit.fromHandle(GetKillingUnit());

            const validKillingPlayer = 
                // If it's an alien AI killer
                PlayerStateFactory.isAlienAI(killingUnit.owner) ||
                // If it's a player killer
                (this.hasPlayer(killingUnit.owner) && this.getAlienFormForPlayer(killingUnit.owner) === killingUnit);
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
        try {
            const unitLocation = vectorFromUnit(who.unit.handle);
            // const zLoc = this.forceModule.game.getZFromXY(unitLocation.x, unitLocation.y);

            let alien = this.playerAlienUnits.get(owner.id);
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

                this.applyAlienMinionHost(alien, owner === this.alienHost);
                alien.nameProper = "|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|nAlien";

                // Add ability tooltip
                TooltipEntity.getInstance().registerTooltip(who, alienTooltipToAlien);

                // Make brown
                alien.color = PLAYER_COLOR_BROWN;
                
                // Now create an alien for player
                this.playerAlienUnits.set(owner.id, alien);
                

                // Hiding life bars
                if (MAKE_UNCLICKABLE) 
                    alien.addAbility(FourCC('Aloc'));

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
                
                    // If this is the second alien display messages to alien players
                    this.players.forEach(p => {
                        if (p !== owner.id) {
                            MessagePlayer(MapPlayer.fromIndex(p), `${playerColors[owner.id].code}${crewmember.name}|r ${COL_ALIEN} has become an Alien. Send messages starting with ${COL_GOLD}.|r${COL_ALIEN} to communicate only with aliens.|r`);
                        }
                    })
                }

                alien.invulnerable = true;
                Timers.addTimedAction(1, () => alien.invulnerable = false);
                VisionFactory.getInstance().setPlayervision(owner, VISION_TYPE.HUMAN);

                // Now force ally with all alien units
                PlayerStateFactory.getAlienAI().forEach(p => {
                    owner.setAlliance(p, ALLIANCE_PASSIVE, true);
                });
                
                return alien;
            }
            return alien;
        }
        catch(e) {
            Log.Error("Error making alien");
            Log.Error(e);
        }
    }

    public registerAlienDeath(who: Unit) {
        const trig = new Trigger();

        this.alienDeathTrigs.set(who.id, trig);
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
        const forceHasPlayer = this.players.indexOf(player.id) >= 0;

        if (forceHasPlayer) {
            const playerData = PlayerStateFactory.get(player);
            const crew = playerData.getCrewmember();
            
            crew.unit.removeAbility(ABIL_TRANSFORM_HUMAN_ALIEN);

            if (crew.unit.show) {
                // Place a corpse
                BlzSetUnitFacingEx(crew.unit.handle, 270);
                const cFacing = 270;
                const cLoc = Vector2.fromWidget(crew.unit.handle).applyPolarOffset(cFacing, -30);
                
                for (let index = 0; index < GetRandomInt(3, 5); index++) {
                    CreateBlood(cLoc.x + GetRandomReal(-40, 40), cLoc.y + GetRandomReal(-40, 40))                
                }
            }

            // Remove ability tooltip
            TooltipEntity.getInstance().unregisterTooltip(crew, alienTooltipToHuman);
            TooltipEntity.getInstance().unregisterTooltip(this.getAlienFormForPlayer(player), alienTooltipToHuman);

            // As this can be called on alien death we need to make sure both alien and human is dead
            const alienUnit = this.getAlienFormForPlayer(player);
            const deathTrig = this.alienDeathTrigs.get(alienUnit.id);
            deathTrig.destroy();
            this.alienDeathTrigs.delete(alienUnit.id);
            // Now remove our existing death trigs for human
            super.removePlayer(player, killer);  
            
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

            PlayNewSound("Sounds\\Nazgul.wav", 50);
            Players.forEach(p => {
                DisplayTextToPlayer(p.handle, 0, 0, STR_ALIEN_DEATH(
                    player,
                    playerColors[player.id].code,
                    crew, 
                    alienUnit, 
                    this.getHost() === player)
                );
            });

            const obsForce = PlayerStateFactory.getForce(OBSERVER_FORCE_NAME);

            obsForce.addPlayer(player);
            obsForce.addPlayerMainUnit(crew, player);
            PlayerStateFactory.get(player).setForce(obsForce);

            if (player === this.alienHost && this.players.length > 0) {
                this.repickHost();
            }
            // Otherwise if the game time is less than five minutes, pick a new host
            else if (this.players.length === 0 && GameTimeElapsed.getTime() <= 8*60) {
                const crewForce = PlayerStateFactory.getForce(CREW_FORCE_NAME) as CrewmemberForce;
                if (crewForce.getPlayers().length > 1) {
                    Timers.addTimedAction(10, () => {
                        // Lastly check the player count
                        if (crewForce.getPlayers().length <= 1) return;
                        MessageAllPlayers(`Alien died too early... Repicking the ${COL_ALIEN}Alien Host|r.`);
                        
                        const crwPlayers = crewForce.getPlayers();
                        const pickedPlayer = Quick.GetRandomFromArray(crwPlayers, 1)[0];

                        crewForce.removePlayer(pickedPlayer, undefined, true);
                        
                        const crewPickedPlayer = PlayerStateFactory.getCrewmember(pickedPlayer);
        
                        PlayerStateFactory.get(pickedPlayer).setForce(this);
                        this.addPlayer(pickedPlayer);
                        this.addPlayerMainUnit(crewPickedPlayer, pickedPlayer);
                        this.repickHost();
                    });
                }
            }
        }      
    }

    /**
     * Repicks the alien host
     */
    repickHost() {
        // Let the players know the host died... a second time
        Timers.addTimedAction(5, () => {
            this.players.forEach(p => {
                MessagePlayer(MapPlayer.fromIndex(p), `${COL_ALIEN}Children, your ${COL_TEAL}Host|r${COL_ALIEN} may be dead but you are still alive. The hive will promote one of you.`);
            });
        });
        // Now try the actual repickening
        Timers.addTimedAction(60, () => {
            const alienHost = Quick.GetRandomFromArray(this.players, 1)[0];

            if (alienHost) {
                const player = MapPlayer.fromIndex(alienHost);
                const pData = PlayerStateFactory.get(alienHost);
                const crew = PlayerStateFactory.getCrewmember(alienHost);
                const alienUnit = this.getAlienFormForPlayer(player);

                this.setHost(player);
                this.applyAlienMinionHost(alienUnit, true);
                this.players.forEach(p => {
                    MessagePlayer(p, `|cff${pData.originalColour}${crew.name}|r${COL_ALIEN} is your new host.`);
                });
            }

        });
    }

    removePlayerAlienUnit(whichUnit: Unit) {
        // Log.Information(`Remove alien unit called on ${whichUnit.owner.name}`);
        // Also need to call remove player as the alien unit dying will also kill the palyer
        this.removePlayer(whichUnit.owner);
    }

    transform(who: MapPlayer, toAlien: boolean): Unit | void {
        this.playerIsTransformed.set(who.id, toAlien);

        const alien = this.playerAlienUnits.get(who.id);
        let unit = this.playerUnits.get(who.id);

        const crewmember = PlayerStateFactory.get(who).getCrewmember();

        if (!alien) return Log.Error("AlienForce::transform No alien for "+who.name+"!");
        if (!unit) {
            if (crewmember && crewmember.unit) {
                this.playerUnits.set(who.id, unit);
                unit = this.playerUnits.get(who.id);
            }
            if (!unit) return Log.Error("AlienForce::transform No human for "+who.name+"!");
        }


        const toHide = toAlien ? unit.unit : alien;
        const toShow = toAlien ? alien : unit.unit;

        // get the hiding unit's location and facing
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

    isPlayerTransformed(who: number)
    isPlayerTransformed(who: MapPlayer)
    isPlayerTransformed(who: MapPlayer | number) {
        const playerIsTransformed = this.playerIsTransformed.get(who instanceof MapPlayer ? who.id : who);
        return !!playerIsTransformed;
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
        const alien = this.playerAlienUnits.get(whichUnit.player.id);
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
        if (this.playerIsTransformed.get(who.id)) return this.getAlienFormForPlayer(who);
        return super.getActiveUnitFor(who);
    }

    getAlienFormForPlayer(who: number)
    getAlienFormForPlayer(who: MapPlayer)
    public getAlienFormForPlayer(who: MapPlayer | number) {
        return this.playerAlienUnits.get(who instanceof MapPlayer ? who.id : who);
    }

    /**
     * Gets a list of who can see the chat messages
     * Unless overridden returns all the players
     */
    public getChatRecipients(chatEvent: ChatHook) {
        // If the player is transformed return a list of all alien players
        if (chatEvent.message[0] == ".") {
            return this.players.map( p => MapPlayer.fromIndex(p));
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
        if (chatEvent.message[0] !== "." && this.isPlayerTransformed(chatEvent.who)) {
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
        if (chatEvent.message[0] == "." || this.isPlayerTransformed(chatEvent.who)) {
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
        if (chatEvent.message[0] == "." || this.isPlayerTransformed(chatEvent.who)) {
            return SOUND_ALIEN_GROWL;
        }
        
        // Otherwise return default behaviour
        return super.getChatSoundRef(chatEvent);
    }

    public getChatMessage(chatEvent: ChatHook): string {
        if (chatEvent.message[0] == ".") {
            chatEvent.message = chatEvent.message.slice(1, chatEvent.message.length);
            chatEvent.doContinue = false;
        }
        return super.getChatMessage(chatEvent);
    }
    
    /**
     * Returns the chat tag, by default it will be null
     */
    public getChatTag(chatEvent: ChatHook): string | undefined { 
        // If player is transformed return an alien name
        if (chatEvent.message[0] == "." || this.playerIsAlienAlliesOnly.get(chatEvent.who.id)) {
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

                    if (MapPlayer.fromLocal().id === player1) {
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
        // Increment current evo
        this.currentAlienEvolution = newForm;
        const alienHost = this.getHost();
        const worldEnt = WorldEntity.getInstance();
        
        this.getPlayers().forEach((player) => {
            try {
                // Now get their alien units and replace with the new evo
                const unit = this.playerAlienUnits.get(player.id);
                const crew = PlayerStateFactory.getCrewmember(player);
                
                if (!unit) {
                    Log.Information("wtf no unit for alien")
                }

                // Is our "Current" unit hidden?
                const transformingUnitIsHidden = this.playerIsTransformed.get(player.id) 
                    // If the player is transformed we need to check if the alien is visible
                    ? !unit.show
                    // Otherwise check if the crew is visible
                    : (crew && crew.unit && !crew.unit.show)
                
                // If the current alien is hidden, skip this player
                if (crew && !crew.unit.isAlive()) 
                    return Log.Information(`EVOLVE ATTEMPT Crewmember for ${player.name} is dead`);

                if (unit) {
                    // Get old unit zone
                    const oldZone = worldEnt.getUnitZone(unit);

                    // Remove the old unit from the zone
                    if (oldZone) {
                        worldEnt.removeUnit(unit);
                    }

                    // Remove old alien death
                    const oldAlienDeath = this.alienDeathTrigs.get(unit.id);
                    oldAlienDeath.destroy();
                    this.alienDeathTrigs.delete(unit.id);
                    // Now call replace func
                    ReplaceUnitBJ(unit.handle, newForm, 1);

                    const replacedUnit = GetLastReplacedUnitBJ();
                    const alien = Unit.fromHandle(replacedUnit);

                    this.registerAlienDeath(alien);

                    // And handle travel
                    if (oldZone) {
                        worldEnt.travel(alien, oldZone.id);
                    }
                
                    SelectUnitForPlayerSingle(alien.handle, player.handle);

                    this.playerAlienUnits.set(player.id, alien);
                    alien.nameProper = "|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|n|nAlien";
            
                    alien.name = 'Alien Host';
                    alien.color = PLAYER_COLOR_PURPLE;

                    // Now we need to also set alien spawn penalties
                    this.applyAlienMinionHost(alien, player === alienHost);

                    if (!transformingUnitIsHidden) {
                        DestroyEffect(AddSpecialEffect(SFX_ALIEN_BLOOD, alien.x, alien.y));

                        // If a player isn't transformed force the transformation
                        if (!this.playerIsTransformed.get(player.id)) {
                            this.transform(player, true);
                        }
                    }
                }
            }
            catch (e) {
                Log.Error("Evolution failed!");
                Log.Error(e);
            }
        });
    }

    private applyAlienMinionHost(alien: Unit, isHost: boolean) {
        const wasHost = alien.owner === this.alienHost;

        if (!isHost) {
            alien.maxLife = MathRound(alien.maxLife * 0.75);
            alien.strength = MathRound(alien.strength * 0.75);
            alien.intelligence = MathRound(alien.intelligence * 0.75);
            alien.setBaseDamage( MathRound(alien.getBaseDamage(0) * 0.8), 0);

            const scale = alien.getField(UNIT_RF_SCALING_VALUE) as number;

            alien.setScale(scale * 0.9, scale * 0.9, scale * 0.9);
            alien.name = 'Alien Spawn';
            SetPlayerTechResearched(alien.owner.handle, UPGR_DUMMY_IS_ALIEN_HOST, 0);
        }
        else {
            alien.name = 'Alien Host';
            const scale = alien.getField(UNIT_RF_SCALING_VALUE) as number;

            alien.setScale(scale * 1.05, scale * 1.05, scale * 1.05);

            // If we were not Alien Host
            // We need to undo the stat penalties
            if (!wasHost) {
                alien.maxLife = MathRound(alien.maxLife * 1.33);
                alien.strength = MathRound(alien.strength * 1.33);
                alien.intelligence = MathRound(alien.intelligence * 1.33);
                alien.setBaseDamage( MathRound(alien.getBaseDamage(0) * 1.25), 0);
            }

            this.setHost(alien.owner);
            SetPlayerTechResearched(alien.owner.handle, UPGR_DUMMY_IS_ALIEN_HOST, 1);
        }

        // Some unique alien stuff here.
        // Messy but where should I put it?
        if (alien.typeId === DEFILER_ALIEN_FORM) {
            alien.setAbilityLevel(ABIL_ALIEN_WEBSHOT, 2);
            alien.setAbilityLevel(ABIL_ALIEN_BROODNEST, 2);
            alien.setAbilityLevel(ABIL_ALIEN_WEBWALK, 2);
        }
    } 
    
    /**
     * 
     * @param who 
     */
    public introduction(who: MapPlayer, skipDefaultIntro: boolean = false) {
        if (skipDefaultIntro != true) super.introduction(who);
        Timers.addTimedAction(4, () => {
            const isHost = this.getHost() === who;

            SOUND_ALIEN_GROWL.setVolume(127);
            SOUND_ALIEN_GROWL.playSoundForPlayer(MapPlayer.fromLocal());

            if (GetLocalPlayer() === who.handle) {
                if (isHost) {
                    MessagePlayer(who, `${COL_ALIEN}The hive welcomes you, my new Host.|r`);
                }
                else {
                    MessagePlayer(who, `${COL_ALIEN}The hive welcomes you, my child.|r`);
                }
                MessagePlayer(who, `${COL_ALIEN}Spread, go forth and feast on the biomass of the other creatures here. Kill them using your ${COL_TEAL}True Form|r${COL_ALIEN} we have gifted you and you shall build an army.|r`);
                if (!isHost) {
                    MessagePlayer(who, `- ${COL_ALIEN}Send messages starting with ${COL_GOLD}.|r${COL_ALIEN} to communicate only with aliens.|r`);
                }
            }
        });
    }

    protected onPlayerLevelUp(who: MapPlayer, level: number) {
        super.onPlayerLevelUp(who, level);

        if (level === 4) {
            ChatEntity.getInstance().postSystemMessage(who, `${COL_ALIEN}You are powerful enough to evolve|r`);
        }
        if (level === 7) {
            ChatEntity.getInstance().postSystemMessage(who, `${COL_ALIEN}You are powerful enough to evolve|r`);
        }
    }

    public onDealDamage(who: MapPlayer, target: MapPlayer, damagingUnit: unit, damagedUnit: unit) {
        // Reward XP if we are damaging Alien AI
 
        // Check to see if it is a human
        const tData = PlayerStateFactory.get(target);
        if (tData && tData.getForce() && tData.getForce().is(CREW_FORCE_NAME)) {
            const crewForce = tData.getForce() as CrewmemberForce;
            const targetIsHuman = crewForce.getActiveUnitFor(target).handle === damagedUnit;

            if (targetIsHuman) {
                const pData = PlayerStateFactory.get(who);
                const crew = pData.getCrewmember() 
                const xpMultiplier = (crew && crew.role === ROLE_TYPES.SEC_GUARD) ? 1.5 : 1;
    
                const damageAmount = GetEventDamage();
                
                EventEntity.getInstance().sendEvent(EVENT_TYPE.CREW_GAIN_EXPERIENCE, {
                    source: crew.unit,
                    data: { value: damageAmount * xpMultiplier }
                });
            }
        }

    }
 
    public onTakeDamage(who: MapPlayer, attacker: MapPlayer, damagedUnit: unit, damagingUnit: unit) {
        if (UnitHasBuffBJ(damagedUnit, BUFF_ID_ROACH_ARMOR)) {
            BlzSetEventDamage(GetEventDamage() - 4);
        }
    }
}