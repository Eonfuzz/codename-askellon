import { Ability } from "../ability-type";
import { Unit, Timer, Trigger, MapPlayer } from "w3ts/index";
import { Log } from "lib/serilog/serilog";
import { ABIL_ALIEN_LATCH, TECH_PLAYER_INFESTS, TECH_LATCHED_IN_HUMAN, TECH_LATCHED_IN_WHATEVER } from "resources/ability-ids";
import { ZONE_TYPE } from "app/world/zone-id";
import { FilterIsAlive } from "resources/filters";
import { PLAYER_COLOR } from "lib/translators";
import { GENERIC_CHAT_SOUND_REF } from "app/force/forces/force-type";
import { EventListener } from "app/events/event-type";
import { EVENT_TYPE } from "app/events/event-enum";
import { EventEntity } from "app/events/event-entity";
import { ForceEntity } from "app/force/force-entity";
import { ChatHook } from "app/chat/chat-hook-type";
import { ChatEntity } from "app/chat/chat-entity";
import { EventData } from "app/events/event-data";
import { WorldEntity } from "app/world/world-entity";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { AbilityHooks } from "../ability-hooks";
import { AddGhost, RemoveGhost, getZFromXY } from "lib/utils";
import { DummyCast } from "lib/dummy";
import { BUFF_ID_NANOMED, BUFF_ID_TRIFEX, BUFF_ID_FEAST } from "resources/buff-ids";


export class LatchAbility implements Ability {

    private unit: Unit;
    private targetUnit: Unit;

    private forceStop: boolean = false;
    private castOrder: number;

    private travelListener: EventListener;
    private unitExperienceSteal: EventListener;

    private onUnitchangeOrder: Trigger;
    private unitTakesDamageTrigger: Trigger;

    // Is a latch hook id
    private latchChatHookId: number;

    private isCastingSurvivalInstincts: boolean = false;
    private duration = 0;

    private damageTicker = 0;
    private eatAbilStackCount = 0;

    constructor() {
    }

    public initialise() {
        this.unit = Unit.fromHandle(GetTriggerUnit());
        this.targetUnit = Unit.fromHandle(GetSpellTargetUnit());
        this.castOrder = this.unit.currentOrder;

        this.travelListener = new EventListener(
            EVENT_TYPE.CREW_CHANGES_FLOOR, 
            (self, data) => this.onLatchTravel(data)
        );
        EventEntity.getInstance().addListener(this.travelListener);
        this.unitExperienceSteal = new EventListener(
            EVENT_TYPE.CREW_GAIN_EXPERIENCE, 
            (self, data) => this.onLatchedGainsXp(data)
        );

        this.unit.setPathing(false);

        AddGhost(this.unit);

        // Increment infest upgrade
        this.targetUnit.owner.setTechResearched(TECH_PLAYER_INFESTS, 
            this.targetUnit.owner.getTechCount(TECH_PLAYER_INFESTS, true) + 1
        );

        this.onUnitchangeOrder = new Trigger();
        this.onUnitchangeOrder.registerUnitEvent(this.unit, EVENT_UNIT_ISSUED_ORDER);
        this.onUnitchangeOrder.registerUnitEvent(this.unit, EVENT_UNIT_ISSUED_POINT_ORDER);
        this.onUnitchangeOrder.registerUnitEvent(this.unit, EVENT_UNIT_ISSUED_TARGET_ORDER);
        this.onUnitchangeOrder.addAction(() => this.onOrderChange());

        // if we are trageting a crewmember we gotta hijack chat
        const pData = PlayerStateFactory.get(this.targetUnit.owner);
        if (pData && pData.getCrewmember() && pData.getCrewmember().unit === this.targetUnit) {
            // Create that hook
            
            this.latchChatHookId = ChatEntity.getInstance().addHook((hook: ChatHook) => this.processChat(hook));
            this.unit.owner.setTechResearched(TECH_LATCHED_IN_HUMAN, 1);
        }
        /**
         * Helps testing and debugging
         */
        if (PlayerStateFactory.isSinglePlayer()) {
            this.unit.owner.setTechResearched(TECH_LATCHED_IN_HUMAN, 1);
        }
        this.unit.owner.setTechResearched(TECH_LATCHED_IN_WHATEVER, 1);

        // Clear any aggression
        ForceEntity.getInstance().repairAllAlliances(this.unit.owner);

        return true;
    };

    public process(delta: number) {
        if (this.forceStop) return false;

        // Make sure our current unit or target exists
        if (!this.unit || !this.unit.isAlive()) return false;
        if (!this.targetUnit || !this.targetUnit.isAlive()) return false;

        // Are we currently latching?
        // Compare current orders
        const isLatching = this.castOrder === this.unit.currentOrder;

        // Kill if we aren't
        if (!isLatching) {
            return false;
        }

        this.duration += delta;

        // Otherwise continue...
        this.unit.x = this.targetUnit.x;
        this.unit.y = this.targetUnit.y;

        // Need to check for buffs on host
        if (UnitHasBuffBJ(this.targetUnit.handle, BUFF_ID_NANOMED) || UnitHasBuffBJ(this.targetUnit.handle, BUFF_ID_TRIFEX)) {
            this.forceStop = true;
            return false;
        }

        // Deal eat damage if relevant
        this.damageTicker += delta;
        if (this.eatAbilStackCount > 0 && this.damageTicker >= 1) {
            this.damageTicker = 0;

            if (ForceEntity.getInstance().canFight(this.unit.owner, this.targetUnit.owner)) {
                UnitDamageTarget(this.unit.handle, 
                    this.targetUnit.handle, 
                    5 * this.eatAbilStackCount, 
                    true, 
                    true, 
                    ATTACK_TYPE_MAGIC, 
                    DAMAGE_TYPE_ACID, 
                    WEAPON_TYPE_WHOKNOWS
                );
            }
        }

        return true;
    };

    private processChat(hook: ChatHook) {

        if (hook.who === this.unit.owner) {
            const pData = PlayerStateFactory.get(this.targetUnit.owner);
            const crew = pData.getCrewmember();

            if (crew) {
                hook.name = crew.name;
                hook.color = PLAYER_COLOR[crew.unit.owner.id];
                hook.sound = GENERIC_CHAT_SOUND_REF;
            }
        }

        return hook;
    }

    private onLatchTravel(data: EventData) {
        if (data.source !== this.targetUnit) return;

        try {
            const newFloor = WorldEntity.getInstance().getUnitZone(data.source);

            if (!newFloor) {
                return Log.Error("Failed to follow latched unit!");
            }

            if (newFloor.id === ZONE_TYPE.SPACE) {
                return this.forceStop = true;
            }

            // Force our unit to travel too
            WorldEntity.getInstance().travel(this.unit, newFloor.id);
            // Snap camera
            // if (this.unit.isSelected(this.unit.owner)) {
                const t = new Timer();
                t.start(0, false, () => {
                    PanCameraToTimedForPlayer(this.unit.owner.handle, this.targetUnit.x, this.targetUnit.y, 0);
                    t.destroy();
                });
            // }
        }
        catch(e) {
            Log.Error("Failed to travel with latch!");
            Log.Error(e);
        }
    }

    private onLatchedGainsXp(data: EventData) {
        if (data.source === this.targetUnit) {
            const amountGained = data.data.value / 2;
            EventEntity.getInstance().sendEvent(EVENT_TYPE.CREW_GAIN_EXPERIENCE, {
                source: this.unit,
                data: { value: amountGained }
            });
        }
    }

    private onOrderChange() {
        const newOrder = GetIssuedOrderId();
        this.forceStop = true;

        // Neural Takeover
        if (newOrder === 852100) {
            this.forceStop = false;
            return;
        }
        // The Feast order ID
        else if (newOrder === 852090) {
            this.forceStop = false;
            this.eatAbilStackCount += 1;

            const bloodSfx = AddSpecialEffect("Objects\\Spawnmodels\\Orc\\OrcLargeDeathExplode\\OrcLargeDeathExplode.mdl", this.targetUnit.x, this.targetUnit.y);
            BlzSetSpecialEffectZ(bloodSfx, getZFromXY(this.targetUnit.x, this.targetUnit.y) + 5);
            DestroyEffect(bloodSfx);

            if (this.eatAbilStackCount == 1) {
                DummyCast((dummy) => {
                    SetUnitX(dummy, this.unit.x);
                    SetUnitY(dummy, this.unit.y + 50);
                    IssueTargetOrder(dummy, "faeriefire", this.targetUnit.handle);
                }, FourCC('A021'));
            }
        }
        // Our survival instincts order
        else if (newOrder === 852252) {
            this.isCastingSurvivalInstincts = true;
            // Pick all players and cause hostility
            const group = CreateGroup();

            GroupEnumUnitsInRange(
                group, 
                this.targetUnit.x, 
                this.targetUnit.y,
                1200,
                FilterIsAlive(this.targetUnit.owner)
            );
    
            ForGroup(group, () => {
                ForceEntity.getInstance().aggressionBetweenTwoPlayers(
                    this.targetUnit.owner, 
                    MapPlayer.fromHandle(GetOwningPlayer(GetEnumUnit()))
                );
            });

            DestroyGroup(group);

            AddGhost(this.unit);

            const t = new Timer();
            t.start(2, false, () => {
                RemoveGhost(this.unit);
                t.destroy();
            });
        }
    }

    public destroy() { 
        try {
            UnitRemoveBuffBJ(BUFF_ID_FEAST, this.unit.handle);
            if (this.unit && this.unit.isAlive()) {
                // Set cooldowns
                BlzStartUnitAbilityCooldown(this.unit.handle, ABIL_ALIEN_LATCH, 60);
                this.unit.setPathing(true);

                // Delay removal of ghost for 0.5 seconds           
                // this.unit.setScale(0.9, 0.9, 0.9);
                if (!this.isCastingSurvivalInstincts) {
                    const t = new Timer();
                    t.start(0.5, false, () => {
                        RemoveGhost(this.unit);
                        t.destroy();
                    });
                }
            }

            if (this.targetUnit && this.targetUnit.isAlive() && this.targetUnit.owner.id < 22) {
                this.targetUnit.owner.setTechResearched(TECH_PLAYER_INFESTS, 
                    (this.targetUnit.owner.getTechCount(TECH_PLAYER_INFESTS, true) || 0) - 1
                );
            }

            if (this.latchChatHookId) {
                ChatEntity.getInstance().removeHook(this.latchChatHookId);
            }
            this.unit.owner.setTechResearched(TECH_LATCHED_IN_HUMAN, 0);
            this.unit.owner.setTechResearched(TECH_LATCHED_IN_WHATEVER, 0);
        }
        catch(e) {
            Log.Error(e);
        }
        this.onUnitchangeOrder.destroy();
        this.unitTakesDamageTrigger.destroy();
        EventEntity.getInstance().removeListener(this.travelListener);
        EventEntity.getInstance().removeListener(this.unitExperienceSteal);
        return true;
    };
}
