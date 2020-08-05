import { Ability } from "../ability-type";
import { Unit, Timer, Trigger, MapPlayer } from "w3ts/index";
import { Log } from "lib/serilog/serilog";
import { ABIL_ALIEN_LATCH, TECH_PLAYER_INFESTS } from "resources/ability-ids";
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
        // this.unit.setScale(0, 0, 0);
        this.unit.addAbility(FourCC("Agho"));

        // Increment infest upgrade
        this.targetUnit.owner.setTechResearched(TECH_PLAYER_INFESTS, 
            this.targetUnit.owner.getTechCount(TECH_PLAYER_INFESTS, true) + 1
        );


        this.unitTakesDamageTrigger = new Trigger();
        this.unitTakesDamageTrigger.registerUnitEvent(this.unit, EVENT_UNIT_DAMAGED);
        this.unitTakesDamageTrigger.addAction(() => this.onDamage());

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
        }

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

        // Otherwise continue...
        this.unit.x = this.targetUnit.x;
        this.unit.y = this.targetUnit.y;

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

        const newFloor = WorldEntity.getInstance().getUnitZone(data.source);

        if (!newFloor) {
            return Log.Error("Failed to follow latched unit!");
        }

        if (newFloor.id === ZONE_TYPE.SPACE) {
            Log.Information("Unit entering space, cancelling");
            return this.forceStop = true;
        }

        // Force our unit to travel too
        WorldEntity.getInstance().travel(this.unit, newFloor.id);
        // Snap camera
        if (this.unit.isSelected(this.unit.owner)) {
            const t = new Timer();
            t.start(0, false, () => {
                PanCameraToTimedForPlayer(this.unit.owner.handle, this.targetUnit.x, this.targetUnit.y, 0);
                t.destroy();
            });
        }
    }

    private onDamage() {
        this.forceStop = true;


        if (!this.unit.paused) {
            // Mini stun to end channels
            this.unit.paused = true;
            // Worm takes bonus damage
            UnitDamageTarget(GetEventDamageSource(), 
                this.unit.handle, 
                25, 
                true, 
                true, 
                ATTACK_TYPE_MAGIC, 
                DAMAGE_TYPE_ACID, 
                WEAPON_TYPE_WHOKNOWS
            );
            this.unit.paused = false;
        }
    }

    private onLatchedGainsXp(data: EventData) {
        Log.Information("on xp gain");
        if (data.source === this.targetUnit) {
            Log.Information("on xp gain for the worm");
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

        // Our survival instincts order
        if (newOrder === 852252) {
            this.isCastingSurvivalInstincts = true;
            
            this.targetUnit.addAbility(FourCC("Agho"));
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

            const t = new Timer();
            t.start(2, false, () => {
                this.targetUnit.removeAbility(FourCC("Agho"));
                t.destroy();
            });
        }
    }

    public destroy() { 
        try {
            if (this.unit && this.unit.isAlive()) {
                // Set cooldowns
                BlzStartUnitAbilityCooldown(this.unit.handle, ABIL_ALIEN_LATCH, 60);
                this.unit.setPathing(true);

                // Delay removal of ghost for 0.5 seconds           
                // this.unit.setScale(0.9, 0.9, 0.9);
                if (!this.isCastingSurvivalInstincts) {
                    const t = new Timer();
                    t.start(0.5, false, () => {
                        this.unit.removeAbility(FourCC("Agho"));
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