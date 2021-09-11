import { Log } from "../../../../lib/serilog/serilog";
import { ForceType } from "../force-type";
import { ABIL_ALTAR_IS_BUILT, ABIL_APPLY_MADNESS, ABIL_CREWMEMBER_INFO, ABIL_CULTIST_GIFT_MADNESS, ABIL_CULTIST_INFO, UNIT_IS_FLY } from "resources/ability-ids";
import { Crewmember } from "app/crewmember/crewmember-type";
import { MapPlayer, Unit, W3TS_HOOK, playerColors, Trigger, Timer, Effect, Item, Quest } from "w3ts";
import { cultistTooltip, resolveTooltip } from "resources/ability-tooltips";
import { EVENT_TYPE } from "app/events/event-enum";

// Entities and factories
import { EventEntity } from "app/events/event-entity";
import { TooltipEntity } from "app/tooltip/tooltip-module";
import { PlayerStateFactory } from "../../player-state-entity";
import { CREW_FORCE_NAME, ALIEN_FORCE_NAME, OBSERVER_FORCE_NAME, CULT_FORCE_NAME } from "../force-names";
import { AlienForce } from "../alien-force";
import { ROLE_TYPES } from "resources/crewmember-names";
import { CrewmemberForce } from "../crewmember-force";
import { VisionFactory } from "app/vision/vision-factory";
import { VISION_TYPE } from "app/vision/vision-type";
import { PlayerState } from "../../player-type";
import { Players } from "w3ts/globals/index";
import { CREWMEMBER_UNIT_ID, UNIT_ID_CULTIST_ALTAR } from "resources/unit-ids";
import { Timers } from "app/timer-type";
import { COL_MISC, COL_ATTATCH, COL_GOLD, COL_ALIEN, COL_BAD } from "resources/colours";
import { Vector2, vectorFromUnit } from "app/types/vector2";
import { Projectile } from "app/weapons/projectile/projectile";
import { Vector3 } from "app/types/vector3";
import { CreateBlood, getZFromXY, MessagePlayer } from "lib/utils";
import { ProjectileTargetStatic, ProjectileMoverParabolic } from "app/weapons/projectile/projectile-target";
import { SFX_HUMAN_BLOOD, SFX_LASER_3, SFX_RED_SINGULARITY, SFX_VOID_DISK } from "resources/sfx-paths";
import { CULTIST_ALTAR_MAX_MANA, COLOUR_CULT, CULTIST_ALTAR_BUILD_TIME, CULTIST_ALTAR_TIME_TO_REGEN, CULTIST_CORPSE_INTERVAL, CULTIST_ALTAR_REGEN_INCREASE, TECH_RESEARCH_CULT_ID } from "./constants";
import { SoundRef } from "app/types/sound-ref";
import { ITEM_CEREMONIAL_DAGGER, ITEM_HUMAN_CORPSE } from "resources/item-ids";
import { PlayNewSound, PlayNewSoundOnUnit } from "lib/translators";
import { UPGR_DUMM_HAS_ACTIVE_ALTAR } from "resources/upgrade-ids";
import { ChatEntity } from "app/chat/chat-entity";
import { SOUND_EVIL_LATIN } from "resources/sounds";

export class CultistForce extends CrewmemberForce {
    name = CULT_FORCE_NAME;
    
    public cultistGodSoundByte = new SoundRef("Sounds\\carrionSound.mp3", false, true);

    private templeSpawnedTrigger = new Trigger();

    private playerToTick: Map<number, number> = new Map<number, number>();
    private playerToAltar: Map<number, Unit> = new Map<number, Unit>();
    private altarToPlayer: Map<number, MapPlayer> = new Map<number, MapPlayer>();
    private playerAltarIsBuilt: Map<number, boolean> = new Map<number, boolean>();
    private playersPunishedCount: Map<number, number> = new Map<number, number>();

    private playerKillingPunish = new Trigger();
    private onCultistUpgrade = new Trigger();
    private onAltarDeath = new Trigger();

    private altars: Unit[] = [];

    private canWin: boolean = false;

    // Temporarily disables the kill punish
    public disablePunish: boolean = false;

    constructor() {
        super();

        const mapArea = CreateRegion();
        RegionAddRect(mapArea, GetPlayableMapRect());

        Players.forEach(p => {            
            SetPlayerAlliance(p.handle, PlayerStateFactory.CultistAIPlayer.handle, ALLIANCE_PASSIVE, false);
        });
        
        this.templeSpawnedTrigger.registerEnterRegion(mapArea, Condition(() => GetUnitTypeId(GetFilterUnit()) == UNIT_ID_CULTIST_ALTAR));
        this.templeSpawnedTrigger.addAction(() => {
            const u = Unit.fromHandle(GetTriggerUnit());
            const oldOwner = u.owner;

            if (this.playerToAltar.get(oldOwner.id)) {
                this.playerToAltar.get(oldOwner.id).kill();
            }

            this.onAltarDeath.registerUnitEvent(u, EVENT_UNIT_DEATH);
            u.owner = PlayerStateFactory.NeutralPassive;

            u.name = oldOwner.handle === GetLocalPlayer() 
                ?  `Circle of Carrion|n${COL_MISC}This is your ${COL_ATTATCH}Altar. ${COL_MISC}Right click to use.`
                : `Unknown|n${COL_MISC}Your skin crawls while looking at it|r`;
            this.players.forEach(p => {                
                u.shareVision(MapPlayer.fromIndex(p), true);
            });

            this.altarToPlayer.set(u.id, oldOwner);
            this.playerToAltar.set(oldOwner.id, u);

            this.altars.push(u);

            Timers.addTimedAction(0, () => {
                u.owner = PlayerStateFactory.CultistAIPlayer;
            });

            u.maxMana = 0;
            u.mana = 0;

            // Add checker for altar being built
            const timeToBuild = PlayerStateFactory.isSinglePlayer() ? 5 : CULTIST_ALTAR_BUILD_TIME;
            Timers.addTimedAction(timeToBuild, () => {
                if (u.isAlive() && this.getPlayerAltar(oldOwner.id) === u) {
                    this.playerAltarIsBuilt.set(oldOwner.id, true);
                    this.onAltarIsBuilt(u);
                }
            });
        });
        this.onCultistUpgrade.registerAnyUnitEvent(EVENT_PLAYER_UNIT_RESEARCH_FINISH);
        this.onCultistUpgrade.addCondition(() => GetResearched() === TECH_RESEARCH_CULT_ID);
        this.onCultistUpgrade.addAction(() => this.onCultistResearch(Unit.fromHandle(GetTriggerUnit())));

        this.onAltarDeath.addAction(() => this.onAltarDeathEv(Unit.fromHandle(GetTriggerUnit())));

        this.playerKillingPunish.registerAnyUnitEvent(EVENT_PLAYER_UNIT_DEATH);
        this.playerKillingPunish.addCondition(() => {
            const u = GetTriggerUnit();
            return GetUnitTypeId(u) === CREWMEMBER_UNIT_ID;
        });
        this.playerKillingPunish.addAction(() => this.onCrewmemberDeath(Unit.fromHandle(GetTriggerUnit()), Unit.fromHandle(GetKillingUnit())));
    }

    public canUseAltar(who: Unit, altar: Unit): boolean {
        const altarForPlayer = this.playerToAltar.get(who.owner.id);
        return altarForPlayer && altarForPlayer === altar;
    }

    private getPlayerAltar(who: number): Unit | undefined {
        const u = this.playerToAltar.get(who);
        if (u && u.isAlive()) return u;
        return undefined;
    }

    private getPlayerFromAltar(who: Unit): MapPlayer {
        const p = this.altarToPlayer.get(who.id);
        if (p) return p;
        return undefined;
    }

    private onAltarDeathEv(altar: Unit, ignorePunishment?: boolean) {
        const owner = this.getPlayerFromAltar(altar);
        if (!owner) return;

        const mAltar = this.playerToAltar.get(owner.id);

        if (altar === mAltar) {
            MessagePlayer(owner, `${COLOUR_CULT}Your Altar was destroyed!`);
            const pData = PlayerStateFactory.get(owner);
            const u = pData.getUnit();


            if (!ignorePunishment) {
                const sfx = AddSpecialEffect(SFX_RED_SINGULARITY, u.x, u.y);
                BlzSetSpecialEffectZ(sfx, getZFromXY(u.x, u.y));
                DestroyEffect(sfx);

                u.damageTarget(u.handle, 50, true, false, ATTACK_TYPE_HERO, DAMAGE_TYPE_UNKNOWN, WEAPON_TYPE_WHOKNOWS);
                BlzStartUnitAbilityCooldown(u.handle, ABIL_CULTIST_INFO, 120);
            }

            const i = this.altars.indexOf(mAltar);
            this.altars.splice(i, 1);
            this.playerToAltar.delete(owner.id);
            this.altarToPlayer.delete(altar.id);
            owner.setTechResearched(UPGR_DUMM_HAS_ACTIVE_ALTAR, 0);
        }
    }

    private onCrewmemberDeath(dyingCrew: Unit, killingCrew: Unit) {
        if (!this.hasPlayer(killingCrew.owner)) return;
        if (killingCrew.owner.isLocal()) {
            this.cultistGodSoundByte.playSound();
        }
        if (this.disablePunish) return;

        const punishCount = this.playersPunishedCount.get(killingCrew.owner.id) || 0;

        if (punishCount < 1) {
            MessagePlayer(killingCrew.owner, `${COLOUR_CULT}Feast only on the flesh of the dead!`);
            MessagePlayer(killingCrew.owner, `Warning! As ${COLOUR_CULT}punishment|r for killing a living player you lose 6 attributes! Don't do it again`);

            const sfx = AddSpecialEffect(SFX_RED_SINGULARITY, killingCrew.x, killingCrew.y);
            BlzSetSpecialEffectZ(sfx, getZFromXY(killingCrew.x, killingCrew.y));
            DestroyEffect(sfx);

            PlayNewSoundOnUnit("Sounds\\Thunder2.mp3", killingCrew, 50);
            killingCrew.strength -= 6;
            // killingCrew.agility -= 6;
            killingCrew.intelligence -= 6;

            this.playersPunishedCount.set(killingCrew.owner.id, 1);
        }
        else {
            MessagePlayer(killingCrew.owner, `${COLOUR_CULT}Again you disappoint us.`);

            this.playSpinExplodeanimationFor(killingCrew, () => {
                killingCrew.kill();   
                killingCrew.x = 0;
                killingCrew.y = 0;
                killingCrew.show = false;
            });

            Timers.addTimedAction(3, () => {
                MessagePlayer(killingCrew.owner, `${COLOUR_CULT}We make it so it will not be again`);
            });
        }
    }

    public playSpinExplodeanimationFor(who: Unit, callback: () => void, doKill: boolean = true) {
        who.paused = true;
        who.addAbility(UNIT_IS_FLY);
        who.setflyHeight(250, 50);
        who.invulnerable = true;
        PlayNewSoundOnUnit("Sounds\\HorrorRiser2.mp3", who, 127);

        SetUnitFacingTimed(who.handle, who.facing-170, 1.1);

        Timers.addTimedAction(1, () => {
            SetUnitFacingTimed(who.handle, who.facing-170, 0.8);
        });
        Timers.addTimedAction(1.8, () => {
            SetUnitFacingTimed(who.handle, who.facing-170, 0.7);
        });
        Timers.addTimedAction(2.5, () => {
            SetUnitFacingTimed(who.handle, who.facing-170, 0.6);
        });
        Timers.addTimedAction(3.1, () => {
            SetUnitFacingTimed(who.handle, who.facing-170, 0.5);
        });
        Timers.addTimedAction(3.5, () => {
            SetUnitFacingTimed(who.handle, who.facing-170, 0.4);
            PlayNewSoundOnUnit("Sounds\\HorrorRiser.mp3", who, 127);
        });
        Timers.addTimedAction(3.9, () => {
            SetUnitFacingTimed(who.handle, who.facing-170, 0.3);
        });
        Timers.addTimedAction(4.2, () => {
            SetUnitFacingTimed(who.handle, who.facing-170, 0.2);
        });
        Timers.addTimedAction(4.4, () => {
            SetUnitFacingTimed(who.handle, who.facing-170, 0.2);
        });
        Timers.addTimedAction(4.6, () => {
            SetUnitFacingTimed(who.handle, who.facing-170, 0.2);
        });
        Timers.addTimedAction(4.8, () => {
            PlayNewSoundOnUnit("Sounds\\Thunder2.mp3", who, 50);

            let sfx = AddSpecialEffect(SFX_RED_SINGULARITY, who.x, who.y);
            BlzSetSpecialEffectZ(sfx, getZFromXY(who.x, who.y) + 250);
            DestroyEffect(sfx);    

            if (doKill) {

                sfx = AddSpecialEffect(SFX_HUMAN_BLOOD, who.x, who.y);
                BlzSetSpecialEffectZ(sfx, getZFromXY(who.x, who.y) + 150);
                DestroyEffect(sfx);

                for (let index = 0; index < 8; index++) {
                    const tLoc = vectorFromUnit(who.handle);

                    const unitHeight = getZFromXY(tLoc.x, tLoc.y);
                    const startLoc = new Vector3(tLoc.x, tLoc.y, unitHeight + 250)
        
                    const newTarget = new Vector3(
                        startLoc.x + this.getRandomOffset(),
                        startLoc.y + this.getRandomOffset(),
                        unitHeight
                    );
        
                    const projStartLoc = new Vector3(startLoc.x, startLoc.y, startLoc.z);
                    const projectile = new Projectile(
                        who.handle, 
                        projStartLoc,
                        new ProjectileTargetStatic(newTarget.subtract(startLoc)),
                        new ProjectileMoverParabolic(projStartLoc, newTarget, Deg2Rad(GetRandomReal(60,85)))
                    )
                    .onDeath(proj => CreateBlood(proj.getPosition().x, proj.getPosition().y))
                    .onCollide(() => true);
        
                    projectile.addEffect("Abilities\\Weapons\\MeatwagonMissile\\MeatwagonMissile.mdl", new Vector3(0, 0, 0), newTarget.subtract(startLoc).normalise(), 1);
        
                    EventEntity.send(EVENT_TYPE.ADD_PROJECTILE, { source: who, data: { projectile: projectile }});
                }
            }
            who.removeAbility(UNIT_IS_FLY);
            who.invulnerable = false;
            this.disablePunish = true;
            if (callback) callback();
            this.disablePunish = false;
        });
    }

    private getRandomOffset(): number {
        const isNegative = GetRandomInt(0, 1);
        return (isNegative == 1 ? -1 : 1) * Math.max(-500, GetRandomInt(0, 500));
    }

    private isAltarBuilt(altar: Unit): boolean | undefined {
        const p = this.getPlayerFromAltar(altar);
        const pAltar = this.getPlayerAltar(p.id);
        if (pAltar && pAltar === altar) {
            return this.playerAltarIsBuilt.get(p.id);
        }
        return;
    }

    private onAltarIsBuilt(altar: Unit) {
        altar.maxMana = CULTIST_ALTAR_MAX_MANA;
        altar.mana = 0;

        altar.addAbility(ABIL_ALTAR_IS_BUILT);
        const player = this.getPlayerFromAltar(altar);
        if (player) {
            player.setTechResearched(UPGR_DUMM_HAS_ACTIVE_ALTAR, 1);
            MessagePlayer(player, `Your ${COLOUR_CULT}Altar|r has finished building.`);
            if (GetLocalPlayer() === player.handle) this.cultistGodSoundByte.playSound();
        }
    }

    private onCultistResearch(altarTerminal: Unit) {
        const player = altarTerminal.owner;
        const altar = this.getPlayerAltar(player.id);
        const pData = PlayerStateFactory.get(player);
        const research = GetResearched();
        const researchLevel = GetPlayerTechCount(player.handle, research, true);

        
        SOUND_EVIL_LATIN.setVolume(300);
        SOUND_EVIL_LATIN.playSound();


        Timers.addTimedAction(3, () => {
            ChatEntity.getInstance().postMessageFor(Players, `U̎ͩ̌ͬ̏̊̔͑ͯ̑ͦ͐̓̑͋͏̻̜̪͚̲̞̭̝͎̬̱͍́̕n͔̥̘̫̞͖͓̣͇͓͈̻͚͈̓͛ͭ́ͪ̅̾̔̓̾ͤ̇ͭͤ̀͡k̷̢̡̧̙̺͙̼̖̳͎̘̱̻̖̱̻ͦ͑ͨ̋̿̓ͨ͌̓̆ͭͫ͒͊͌̈ͭ͋̑n̶̷̹̬̞̭͉͔̯̞̘̭͕̼͖̻͇̯̙͎̤ͪͬ̂ͥͨ̐ͯ͘͠ỡ̛͈̤̼͉̳̮̅́̏ͦ̊̽̑̅̓͑̒̋ͭ͊ͦ̾͘͢w̸̙͓̣̪͔̞̗͉̳̙̭ͫ̒ͩ̿ͬ͆̃͛ͥ̈́̐͂͟n̴̢̨̛̝̱̮͕̑̐̃ͩ̉͌̍ͤͣ́`, COLOUR_CULT, `<< CULTIST CHANT >>`);
        });

        const u = pData.getUnit();
        this.playSpinExplodeanimationFor(u, () => {
            u.setflyHeight(0, 0);
            u.paused = false;

                
            if (GetLocalPlayer() === player.handle) this.cultistGodSoundByte.playSound();

            if (researchLevel === 1 && altar && pData) {
                SOUND_EVIL_LATIN.stopSound();
            }
            else if (researchLevel === 2 && altar && pData) {
                Timers.addTimedAction(4, () => SOUND_EVIL_LATIN.stopSound());
                this.canWin = true;
                
                const unit = pData.getUnit();
                const spawnLoc = Vector2.fromWidget(altar.handle);
                const deltaLoc = spawnLoc.add( Vector2.fromWidget(unit.handle).subtract(spawnLoc).multiplyN(0.5));
                const sfx = new Effect(SFX_VOID_DISK, deltaLoc.x, deltaLoc.y);
                sfx.scale = 0.8;
                sfx.setColor(150, 20, 30);
                Timers.addTimedAction(1, () => {
                    sfx.destroy();
                    const i = CreateItem(ITEM_CEREMONIAL_DAGGER, deltaLoc.x, deltaLoc.y);
                    if (UnitInventoryCount(unit.handle) < UnitInventorySize(unit.handle)) {
                        unit.addItem(Item.fromHandle(i));
                    }
                });
            }
            else if (researchLevel === 3 && altar && pData) {
                Timers.addTimedAction(8, () => SOUND_EVIL_LATIN.stopSound());
                this.canWin = true;
            }
        }, false);
    }

    /**
     * Checks the victory conditions of this force
     * Returns true if victory conditions are met
     */
    checkVictoryConditions(): boolean {
        return this.canWin && this.players.length > 0;
    }

    /**
     * TODO
     */
    addPlayerMainUnit(whichUnit: Crewmember, player: MapPlayer) {
        const trig = new Trigger();
        trig.registerUnitEvent(whichUnit.unit, EVENT_UNIT_DEATH);
        trig.addAction(() => this.removePlayer(player, Unit.fromHandle(GetKillingUnit() || GetDyingUnit())));

        this.playerUnits.set(player.id, whichUnit);
        this.playerDeathTriggers.set(player.id, trig);
        VisionFactory.getInstance().setPlayervision(player, VISION_TYPE.HUMAN);

        whichUnit.unit.addAbility(ABIL_CULTIST_INFO);
        whichUnit.unit.addAbility(ABIL_CULTIST_GIFT_MADNESS);

        SetPlayerAlliance(player.handle, PlayerStateFactory.CultistAIPlayer.handle, ALLIANCE_PASSIVE, true);

        this.playerToTick.set(player.id, 0);
        // Add ability tooltip
        TooltipEntity.getInstance().registerTooltip(whichUnit, cultistTooltip);
    }
    
    /**
    * Does this force do anything on tick
    * We need to reward player income
    * @param delta 
    */
   public onTick(delta: number) {
       super.onTick(delta);

       this.players.forEach(p => {
           const altar = this.getPlayerAltar(p);
        //    const altarBuilt = altar && this.isAltarBuilt(altar);

           if (altar && altar.isAlive()) {
                let tick = this.playerToTick.get(p) + delta;
                altar.mana += CULTIST_ALTAR_MAX_MANA / CULTIST_ALTAR_TIME_TO_REGEN * delta;

                if (tick > CULTIST_CORPSE_INTERVAL) {
                    tick -= CULTIST_CORPSE_INTERVAL;
                    this.onAltarTick(altar);
                }

                this.playerToTick.set(p, tick);

                if (altar.mana >= CULTIST_ALTAR_MAX_MANA) {
                    altar.mana = 0;
                    altar.setAnimation(3);
                    // Add 1 lumber for now
                    const player = MapPlayer.fromIndex(p);
                    player.setState(PLAYER_STATE_RESOURCE_LUMBER, player.getState(PLAYER_STATE_RESOURCE_LUMBER) + 1);
                }
            }
       });
   }

    private onAltarTick(altar: Unit) {
        const altarLoc = Vector3.fromWidget(altar.handle);
        const searchRange = 450;

        // Also pick all nearby items
        const rect = Rect(
            altarLoc.x - searchRange, 
            altarLoc.y - searchRange, 
            altarLoc.x + searchRange,
            altarLoc.y + searchRange
        );
        
        // let i = 0;
        EnumItemsInRect(rect, Filter(() => GetItemTypeId(GetFilterItem()) === ITEM_HUMAN_CORPSE), () => {
            const item = GetEnumItem();

            // altar.setAnimation(6);

            Timers.addTimedAction(GetRandomReal(0, 10), () => {                    
                const startLoc = Vector3.fromWidget(item);
                startLoc.z += 20;
                if (startLoc.distanceTo(altarLoc) <= searchRange) {
                    const deltaTarget = altarLoc.subtract(startLoc);
                    

                    const projectile = new Projectile(
                        altar.handle,
                        startLoc,
                        new ProjectileTargetStatic(deltaTarget),
                        new ProjectileMoverParabolic(startLoc, altarLoc, Deg2Rad(60))
                    )
                    .onDeath((proj: Projectile) => {
                        const baseRegen = CULTIST_ALTAR_MAX_MANA / CULTIST_ALTAR_TIME_TO_REGEN * CULTIST_CORPSE_INTERVAL * CULTIST_ALTAR_REGEN_INCREASE;
                        altar.mana +=  baseRegen;
                        return true;
                    })
                    .onCollide(() => true);

                    projectile.addEffect(SFX_LASER_3, new Vector3(0, 0, 0), deltaTarget.normalise(), 1);

                    EventEntity.send(EVENT_TYPE.ADD_PROJECTILE, { source: altar, data: { projectile: projectile }});
                }
            })
        });
        return true;
    }

   public onDealDamage(who: MapPlayer, target: MapPlayer, damagingUnit: unit, damagedUnit: unit) {
       // Reward XP if we are damaging Alien AI

       let targetIsAlien = PlayerStateFactory.isAlienAI(target);

        // If we aren't shooting alien minions...
        if (!targetIsAlien) {
            // Check to see if it is an alien form player
            const tData = PlayerStateFactory.get(target);
            if (tData && tData.getForce() && tData.getForce().is(ALIEN_FORCE_NAME)) {
                const alienForce = tData.getForce() as AlienForce;
                targetIsAlien = alienForce.isPlayerTransformed(target) && alienForce.getActiveUnitFor(target).handle === damagedUnit;
            }
        }
        if (PlayerStateFactory.isAlienAI(target)) {
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

   public onTakeDamage(who: MapPlayer, attacker: MapPlayer, damagedUnit: unit, damagingUnit: unit) {
   }

   removePlayer(player: MapPlayer, killer: Unit = undefined) {
       // Remove player abilities
       const pData = PlayerStateFactory.get(player);
       const crew = pData.getCrewmember();

       if (crew) {
           crew.unit.removeAbility(ABIL_CULTIST_INFO);
           crew.unit.removeAbility(ABIL_CULTIST_GIFT_MADNESS);
       }

       super.removePlayer(player, killer);

   }
}