import { ShipZone } from "../zone-types/ship-zone";
import { Unit, Effect, Destructable, MapPlayer, Rectangle, Region, Timer } from "w3ts/index";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { SoundRef } from "app/types/sound-ref";
import { AskellonEntity } from "app/station/askellon-entity";
import { Log } from "lib/serilog/serilog";
import { ZONE_TYPE } from "../zone-id";
import { ITEM_MINERAL_REACTIVE, ITEM_MINERAL_VALUABLE, ITEM_REMOTE_BOMB } from "resources/item-ids";
import { AskellonShip } from "app/space/ships/askellon-type";
import { EventEntity } from "app/events/event-entity";
import { EVENT_TYPE } from "app/events/event-enum";
import { TECH_MINERALS_PROGRESS, TECH_MAJOR_VOID } from "resources/ability-ids";
import { getZFromXY, MessageAllPlayers, MessagePlayer } from "lib/utils";
import { COL_GOLD, COL_TEAL, COL_ATTATCH, COL_BAD } from "resources/colours";
import { ResearchFactory } from "app/research/research-factory";
import { PlayerState } from "app/force/player-type";
import { ROLE_TYPES } from "resources/crewmember-names";
import { Quick } from "lib/Quick";
import { ALIEN_STRUCTURE_TUMOR, ALIEN_MINION_CANITE, ALIEN_MINION_FORMLESS } from "resources/unit-ids";
import { Timers } from "app/timer-type";
import { SFX_ALIEN_BLOOD, SFX_BUILDING_EXPLOSION, SFX_EXPLOSION_GROUND } from "resources/sfx-paths";
import { PlayNewSound } from "lib/translators";
import { CreepEntity } from "app/creep/creep-entity";
import { Vector2 } from "app/types/vector2";

declare const gg_rct_reactoritemleft: rect;
declare const gg_rct_reactoritemright: rect;
declare const gg_rct_powercoresfx: rect;
declare const udg_main_power_generator: unit;

export class ReactorZone extends ShipZone {

    private reactorLoop = new SoundRef("Sounds\\ReactorLoop.ogg", true, true);
    private sfx: Effect;

    private infestedOreDeliveryCounter: number = 0;
    private spawnableAreas: Rectangle[] = [];

    private reactorUnit: Unit;

    private STEP_INTERVAL = 0.5;
    private stepCounter = 0;

    constructor(id: ZONE_TYPE) {
        super(id);

        this.sfx =  new Effect("Models\\Mythic_Sun.mdx", GetRectCenterX(gg_rct_powercoresfx) + 22, GetRectCenterY(gg_rct_powercoresfx) + 40);
        this.sfx.z = 180;
        this.sfx.scale = 0.6;
        this.sfx.setTimeScale(0.1);

        this.reactorUnit = Unit.fromHandle(udg_main_power_generator);
        
        let idx = 1;
        let namespaceCheck = `gg_rct_MineralInfestationSpawn${idx++}`;
        while (_G[namespaceCheck]) {
            const r = _G[namespaceCheck] as rect;
            this.spawnableAreas.push(Rectangle.fromHandle(r));
            namespaceCheck = `gg_rct_MineralInfestationSpawn${idx++}`;
        }
    }
    
    public onLeave(unit: Unit) {
        super.onLeave(unit);

        
        const crewmember = PlayerStateFactory.getCrewmember(unit.owner.id);
        const isCrew = crewmember && crewmember.unit === unit;

        if (isCrew && GetLocalPlayer() === unit.owner.handle) {
            // Stop Play music
            this.reactorLoop.stopSound();
            SetMusicVolume(20);
        }
    }

    public onEnter(unit: Unit) {
        super.onEnter(unit);

        
        const crewmember = PlayerStateFactory.getCrewmember(unit.owner.id);
        const isCrew = crewmember && crewmember.unit === unit;

        if (isCrew && crewmember && GetLocalPlayer() === unit.owner.handle) {
            // Stop Play music
            this.reactorLoop.setVolume(60);
            this.reactorLoop.playSound();
            SetMusicVolume(15);
        }
    }

    public step(delta: number) {
        super.step(delta);
        EnumItemsInRect(gg_rct_reactoritemleft, Filter(() => true), () => {
            this.processItem(GetEnumItem());
        });
        EnumItemsInRect(gg_rct_reactoritemright, Filter(() => true), () => {
            this.processItem(GetEnumItem());
        });

        this.stepCounter += delta;
        if (this.stepCounter >= this.STEP_INTERVAL) {
            this.stepCounter -= this.STEP_INTERVAL;
            const tint = 155 + MathRound(AskellonEntity.getPowerPercent() * 100);
            this.sfx.setColor(tint, tint, tint);
            this.sfx.scale = 0.4 + AskellonEntity.getPowerPercent() * 0.6;
        }
    }

    private processItem(item: item) {
        const type = GetItemTypeId(item);
        const iStacks = GetItemCharges(item);
        const itemOwner = MapPlayer.fromIndex( GetItemUserData(item) );
        const oldMineralCount = AskellonEntity.getInstance().mineralsDelivered;

        const ownerCrewmember = PlayerStateFactory.getCrewmember(itemOwner.id);
        const oreIsInfested = ResearchFactory.getInstance().isUpgradeInfested(TECH_MAJOR_VOID, 3);

        // If it is blue minerals
        if (type === ITEM_MINERAL_REACTIVE) {
            // Increase max power by 1
            AskellonEntity.getInstance().maxPower += Math.floor(iStacks / 5);
            // Slight power regeneration increase
            AskellonEntity.getInstance().currentPower += 1;

            AskellonEntity.getInstance().mineralsDelivered += iStacks;
            if (ownerCrewmember && ownerCrewmember.role === ROLE_TYPES.PILOT) {
                const mineralReward = 1 * iStacks;
                itemOwner.setState(
                    PLAYER_STATE_RESOURCE_GOLD, 
                    itemOwner.getState(PLAYER_STATE_RESOURCE_GOLD) + mineralReward
                );
                ownerCrewmember.addExperience(iStacks);
                MessagePlayer(ownerCrewmember.player, `Pilot MD Reward Programme: +${mineralReward} minerals`)
            }
            if (oreIsInfested) this.infestedOreDeliveryCounter += iStacks;
        }
        else if (type == ITEM_MINERAL_VALUABLE) {
            // TODO HEAL REACTOR
            // // Increase max power by 1
            AskellonEntity.getInstance().askellonUnit.life += 5 * iStacks;
            
            AskellonEntity.getInstance().mineralsDelivered += iStacks;
            if (ownerCrewmember && ownerCrewmember.role === ROLE_TYPES.PILOT) {
                const mineralReward =  4 * iStacks;
                itemOwner.setState(
                    PLAYER_STATE_RESOURCE_GOLD, 
                    itemOwner.getState(PLAYER_STATE_RESOURCE_GOLD) + mineralReward
                );
                ownerCrewmember.addExperience(iStacks * 2);
                MessagePlayer(ownerCrewmember.player, `Pilot MD Reward Programme: +${mineralReward} minerals`)
            }
            if (oreIsInfested) this.infestedOreDeliveryCounter += iStacks;
        }
        else if (type == ITEM_REMOTE_BOMB) {
            MessageAllPlayers(`[${COL_BAD}DANGER|r] Explosive Item detected on reactor feed`);
            const askellonUnit = AskellonEntity.getInstance().askellonUnit;
            this.itemExplosion(new Vector2(GetItemX(item), GetItemY(item)));
            askellonUnit.damageTarget(askellonUnit.handle, 1050 * iStacks, false, false, ATTACK_TYPE_CHAOS, DAMAGE_TYPE_DEATH, WEAPON_TYPE_WHOKNOWS);
            AskellonEntity.causePowerSurge(1 + iStacks);
        }
        else {
            // Just refund 10 for now, whatever blizzard
            // const itemCost = 10;
            // Add 5 power for now
            AskellonEntity.addToPower(5);
        }

        if (this.infestedOreDeliveryCounter >= 250) {
            this.infestedOreDeliveryCounter -= 250;

            MessageAllPlayers(`[${COL_ATTATCH}DANGER|r] Reactor foreign contaminants exceeding safety thresholds`);
            Timers.addTimedAction(1, () => {
                MessageAllPlayers(`[${COL_ATTATCH}DANGER|r] Expulsing excess matter`);
            });
            AskellonEntity.causePowerSurge();
            CameraSetSourceNoise(10, 100);
            Timers.addTimedAction(1, () => {
                PlayNewSound("Sounds\\ShipDamage\\GroanLong2.mp3", 127);
            });

            this.spawnableAreas.forEach(z => {
                for (let index = 0; index < GetRandomInt(1, 3); index++) {
                    const x = GetRandomReal(z.minX, z.maxX);
                    const y = GetRandomReal(z.minY, z.maxY);
    
                    Timers.addTimedAction(GetRandomReal(2, 6), () => {
                        DestroyEffect(AddSpecialEffect(SFX_ALIEN_BLOOD, x, y));
                        const tumor = CreateUnit(PlayerStateFactory.AlienAIPlayer1.handle, ALIEN_STRUCTURE_TUMOR, x, y, bj_UNIT_FACING);
                        CreepEntity.addCreepWithSource(600, Unit.fromHandle(tumor));
                    })
                }
                for (let index = 0; index < GetRandomInt(6, 10); index++) {
                    const x = GetRandomReal(z.minX, z.maxX);
                    const y = GetRandomReal(z.minY, z.maxY);
    
                    Timers.addTimedAction(GetRandomReal(6, 10), () => {
                        DestroyEffect(AddSpecialEffect(SFX_ALIEN_BLOOD, x, y));
                        CreateUnit(PlayerStateFactory.AlienAIPlayer1.handle, ALIEN_MINION_CANITE, x, y, bj_UNIT_FACING);
                    })
                }
                for (let index = 0; index < GetRandomInt(1, 3); index++) {
                    const x = GetRandomReal(z.minX, z.maxX);
                    const y = GetRandomReal(z.minY, z.maxY);
    
                    Timers.addTimedAction(GetRandomReal(1, 3), () => {
                        DestroyEffect(AddSpecialEffect(SFX_ALIEN_BLOOD, x, y));
                        CreateUnit(PlayerStateFactory.AlienAIPlayer1.handle, ALIEN_MINION_FORMLESS, x, y, bj_UNIT_FACING);
                    })
                }
            });
            Timers.addTimedAction(8.5, () => CameraSetSourceNoise(0, 0))
        }

        const minerals = AskellonEntity.getInstance().mineralsDelivered;
        if (minerals >= 200 && oldMineralCount < 200) {
            ResearchFactory.getInstance().processMajorUpgrade(TECH_MINERALS_PROGRESS, 1);
        }
        if (minerals >= 400 && oldMineralCount < 400) {
            ResearchFactory.getInstance().processMajorUpgrade(TECH_MINERALS_PROGRESS, 2);
            MessageAllPlayers(`RAW MATERIALS QUOTA [${COL_GOLD}400/400|r] Reached`);
            MessageAllPlayers(`Improving Crew Armor`);
        }
        if (minerals >= 600 && oldMineralCount < 600) {
            ResearchFactory.getInstance().processMajorUpgrade(TECH_MINERALS_PROGRESS, 3);
            MessageAllPlayers(`RAW MATERIALS QUOTA [${COL_GOLD}600/600|r] Reached`);
            MessageAllPlayers(`Restoring ${COL_GOLD}Askellon|r Engine functionality`);
        }

        RemoveItem(item);
    }

    private itemExplosion(where: Vector2) {
        let sfx = new Effect(SFX_BUILDING_EXPLOSION, where.x, where.y);
        sfx.z = getZFromXY(where.x, where.y) + 5;
        sfx.destroy();

        let offset = 250;
        this.reactorUnit.damageAt(0.1, 350, where.x, where.y, 200, false, false, ATTACK_TYPE_CHAOS, DAMAGE_TYPE_DEATH, WEAPON_TYPE_WHOKNOWS);
        
        

        Timers.addTimedAction(0.2, () => {
            PlayNewSound("Sounds\\ExplosionBassHeavy.mp3", 127);
            CameraSetSourceNoise(0, 0);

            let mirrorLoc = Vector2.fromWidget(this.reactorUnit.handle).applyPolarOffset(this.reactorUnit.facing, GetRandomReal(0, 300));

            let sfx = new Effect(SFX_EXPLOSION_GROUND, mirrorLoc.x+GetRandomReal(-100, 100), mirrorLoc.y+GetRandomReal(-100, 100));
            sfx.destroy();
            this.reactorUnit.damageTarget(this.reactorUnit.handle, 1500, false, false, ATTACK_TYPE_CHAOS, DAMAGE_TYPE_DEATH, WEAPON_TYPE_WHOKNOWS);
        

            let i = 0;
            while (i < 360) {
                const p = where.applyPolarOffset(i, offset);
                let sfx = new Effect(SFX_EXPLOSION_GROUND, p.x, p.y);
                sfx.setYaw(GetRandomReal(0, 360));
                sfx.z = getZFromXY(where.x, where.y) + 5;
                sfx.destroy();
                
                i += 360 / 6;
            }
        });
    }
}