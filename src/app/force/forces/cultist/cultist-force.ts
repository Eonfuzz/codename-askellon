import { Log } from "../../../../lib/serilog/serilog";
import { ForceType } from "../force-type";
import { ABIL_ALTAR_IS_BUILT, ABIL_CREWMEMBER_INFO, ABIL_CULTIST_INFO } from "resources/ability-ids";
import { Crewmember } from "app/crewmember/crewmember-type";
import { MapPlayer, Unit, W3TS_HOOK, playerColors, Trigger, Timer, Effect } from "w3ts";
import { resolveTooltip } from "resources/ability-tooltips";
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
import { COL_MISC, COL_ATTATCH } from "resources/colours";
import { Vector2 } from "app/types/vector2";
import { Projectile } from "app/weapons/projectile/projectile";
import { Vector3 } from "app/types/vector3";
import { getZFromXY, MessagePlayer } from "lib/utils";
import { ProjectileTargetStatic, ProjectileMoverParabolic } from "app/weapons/projectile/projectile-target";
import { WeaponEntity } from "app/weapons/weapon-entity";
import { SFX_LASER_3, SFX_RED_SINGULARITY, SFX_VOID_DISK } from "resources/sfx-paths";
import { CULTIST_ALTAR_MAX_MANA, COLOUR_CULT, CULTIST_ALTAR_BUILD_TIME, CULTIST_ALTAR_TIME_TO_REGEN, CULTIST_CORPSE_INTERVAL, CULTIST_ALTAR_REGEN_INCREASE, TECH_RESEARCH_CULT_ID } from "./constants";
import { SoundRef } from "app/types/sound-ref";
import { ITEM_CEREMONIAL_DAGGER, ITEM_HUMAN_CORPSE } from "resources/item-ids";

export class CultistForce extends CrewmemberForce {
    name = CULT_FORCE_NAME;
    
    public cultistGodSoundByte = new SoundRef("Sounds\\carrionSound.mp3", false, true);

    private templeSpawnedTrigger = new Trigger();

    private playerToTick: Map<MapPlayer, number> = new Map<MapPlayer, number>();
    private playerToAltar: Map<MapPlayer, Unit> = new Map<MapPlayer, Unit>();
    private playerAltarIsBuilt: Map<MapPlayer, boolean> = new Map<MapPlayer, boolean>();

    private playerKillingPunish = new Trigger();
    private onCultistUpgrade = new Trigger();

    private altars: Unit[] = [];

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

            u.owner = PlayerStateFactory.NeutralPassive;

            u.name = oldOwner.handle === GetLocalPlayer() 
                ?  `Circle of Carrion|n${COL_MISC}This is your ${COL_ATTATCH}Altar. ${COL_MISC}Right click to use.`
                : `Unknown|n${COL_MISC}Your skin crawls while looking at it|r`;
            this.players.forEach(p => {                
                u.shareVision(p, true);
            });

            SetUnitUserData(u.handle, oldOwner.id);

            this.playerToAltar.set(oldOwner, u);
            this.altars.push(u);

            Timers.addTimedAction(0, () => {
                u.owner = PlayerStateFactory.CultistAIPlayer;
            });

            u.maxMana = 0;
            u.mana = 0;

            // Add checker for altar being built
            const timeToBuild = PlayerStateFactory.isSinglePlayer() ? 5 : CULTIST_ALTAR_BUILD_TIME;
            Timers.addTimedAction(timeToBuild, () => {
                if (u.isAlive() && this.getPlayerAltar(oldOwner) === u) {
                    this.playerAltarIsBuilt.set(oldOwner, true);
                    this.onAltarIsBuilt(u);
                }
            });
        });
        this.onCultistUpgrade.registerAnyUnitEvent(EVENT_PLAYER_UNIT_RESEARCH_FINISH);
        this.onCultistUpgrade.addCondition(() => GetResearched() === TECH_RESEARCH_CULT_ID);
        this.onCultistUpgrade.addAction(() => this.onCultistResearch(Unit.fromHandle(GetTriggerUnit())));

        this.playerKillingPunish.registerAnyUnitEvent(EVENT_PLAYER_UNIT_DEATH);
        this.playerKillingPunish.addCondition(() => {
            const u = GetTriggerUnit();
            return GetUnitTypeId(u) === CREWMEMBER_UNIT_ID;
        });
        this.playerKillingPunish.addAction(() => this.onCrewmemberDeath(Unit.fromHandle(GetTriggerUnit()), Unit.fromHandle(GetKillingUnit())));
    }

    public canUseAltar(who: Unit, altar: Unit): boolean {
        const altarForPlayer = this.playerToAltar.get(who.owner);
        return altarForPlayer && altarForPlayer === altar;
    }

    private getPlayerAltar(who: MapPlayer): Unit | undefined {
        const u = this.playerToAltar.get(who);
        if (u && u.isAlive()) return u;
        return undefined;
    }

    private onCrewmemberDeath(dyingCrew: Unit, killingCrew: Unit) {
        if (!this.hasPlayer(killingCrew.owner)) return;
        MessagePlayer(killingCrew.owner, `${COLOUR_CULT}We feast only on the flesh of the dead!`);
        MessagePlayer(killingCrew.owner, `As ${COL_ATTATCH}punishment|r for killing a living player`);
    }

    private isAltarBuilt(altar: Unit): boolean | undefined {
        const p = MapPlayer.fromIndex(GetUnitUserData(altar.handle));
        const pAltar = this.getPlayerAltar(p);
        if (pAltar && pAltar === altar) {
            return this.playerAltarIsBuilt.get(p);
        }
        return;
    }

    private onAltarIsBuilt(altar: Unit) {
        altar.maxMana = CULTIST_ALTAR_MAX_MANA;
        altar.mana = 0;

        altar.addAbility(ABIL_ALTAR_IS_BUILT);
        const player = MapPlayer.fromIndex(altar.userData);
        // TODO Send message to player
        MessagePlayer(player, `My ${COLOUR_CULT}a̷̲͕̰̼͎̾͑͜l̵̢̅͆͐̓͒̌̀͝t̷̫̬̩̥͕͕̗͚̽̕a̶̛̛̝̬̓́̒̄͆̎̈́͛̊̓̓̚r̸͓̤̬̯̚|r is built. Gifts from the v̴̯͔͔̈́o̴̦͓͖̅̓̄̀̂ȉ̴͚̮̰͍͇̰̏͂̀͊̌̐͋͂̽́̇̏͝d̷̜͔̱̰̥̲̥͍͈̱̣̔̏̃̎̓̿̌͆̀̃̈̀̚̚͝ you shall have`);
        if (GetLocalPlayer() === player.handle) this.cultistGodSoundByte.playSound();
    }

    private onCultistResearch(altarTerminal: Unit) {
        const player = altarTerminal.owner;
        const altar = this.getPlayerAltar(player);
        const pData = PlayerStateFactory.get(player);
        const research = GetResearched();
        const researchLevel = GetPlayerTechCount(player.handle, research, true);

        if (researchLevel === 1 && altar && pData) {
            const unit = pData.getUnit();
            const spawnLoc = Vector2.fromWidget(altar.handle);
            const deltaLoc = spawnLoc.add( Vector2.fromWidget(unit.handle).subtract(spawnLoc).multiplyN(0.5));
            const sfx = new Effect(SFX_VOID_DISK, deltaLoc.x, deltaLoc.y);
            sfx.scale = 0.8;
            sfx.setColor(150, 20, 30);
            Timers.addTimedAction(1, () => {
                sfx.destroy();
                CreateItem(ITEM_CEREMONIAL_DAGGER, deltaLoc.x, deltaLoc.y);
            });
        }
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
        const trig = new Trigger();
        trig.registerUnitEvent(whichUnit.unit, EVENT_UNIT_DEATH);
        trig.addAction(() => this.removePlayer(player, Unit.fromHandle(GetKillingUnit() || GetDyingUnit())));

        this.playerUnits.set(player, whichUnit);
        this.playerDeathTriggers.set(player, trig);
        VisionFactory.getInstance().setPlayervision(player, VISION_TYPE.HUMAN);

        whichUnit.unit.addAbility(ABIL_CULTIST_INFO);

        SetPlayerAlliance(player.handle, PlayerStateFactory.CultistAIPlayer.handle, ALLIANCE_PASSIVE, true);

        this.playerToTick.set(player, 0);
        // Add ability tooltip
        // TooltipEntity.getInstance().registerTooltip(whichUnit, resolveTooltip);
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
           const altarBuilt = altar && this.isAltarBuilt(altar);

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
                    p.setState(PLAYER_STATE_RESOURCE_LUMBER, p.getState(PLAYER_STATE_RESOURCE_LUMBER) + 1);
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
}