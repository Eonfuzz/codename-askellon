import { Ability } from "../ability-type";
import { AbilityModule } from "../ability-module";
import { Unit, Timer, Trigger, MapPlayer } from "w3ts/index";
import { BUFF_ID } from "resources/buff-ids";
import { BuffInstanceDuration } from "app/buff/buff-instance";
import { SoundRef } from "app/types/sound-ref";
import { PuritySeal } from "app/buff/purity-seal";
import { EventListener, EVENT_TYPE, EventData, Event } from "app/events/event";
import { Log } from "lib/serilog/serilog";
import { ABIL_ALIEN_LATCH, TECH_PLAYER_INFESTS } from "resources/ability-ids";
import { ZONE_TYPE } from "app/world/zone-id";
import { FilterIsAlive } from "resources/filters";
import { ChatHook } from "app/chat/chat-module";
import { PLAYER_COLOR } from "lib/translators";
import { GENERIC_CHAT_SOUND_REF } from "app/force/force-type";


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

    public initialise(module: AbilityModule) {
        this.unit = Unit.fromHandle(GetTriggerUnit());
        this.targetUnit = Unit.fromHandle(GetSpellTargetUnit());
        this.castOrder = this.unit.currentOrder;

        this.travelListener = new EventListener(
            EVENT_TYPE.CREW_CHANGES_FLOOR, 
            (self, data) => this.onLatchTravel(module, data)
        );
        module.game.event.addListener(this.travelListener);
        this.unitExperienceSteal = new EventListener(
            EVENT_TYPE.CREW_GAIN_EXPERIENCE, 
            (self, data) => this.onLatchedGainsXp(module, data)
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
        this.unitTakesDamageTrigger.addAction(() => this.onDamage(module));

        this.onUnitchangeOrder = new Trigger();
        this.onUnitchangeOrder.registerUnitEvent(this.unit, EVENT_UNIT_ISSUED_ORDER);
        this.onUnitchangeOrder.registerUnitEvent(this.unit, EVENT_UNIT_ISSUED_POINT_ORDER);
        this.onUnitchangeOrder.registerUnitEvent(this.unit, EVENT_UNIT_ISSUED_TARGET_ORDER);
        this.onUnitchangeOrder.addAction(() => this.onOrderChange(module));

        // if we are trageting a crewmember we gotta hijack chat
        const pData = module.game.forceModule.getPlayerDetails(this.targetUnit.owner);
        if (pData && pData.getCrewmember() && pData.getCrewmember().unit === this.targetUnit) {
            // Create that hook
            
            this.latchChatHookId = module.game.chatModule.addHook((hook: ChatHook) => this.processChat(module, hook));
        }

        // Clear any aggression
        module.game.forceModule.repairAllAlliances(this.unit.owner);

        return true;
    };

    public process(module: AbilityModule, delta: number) {
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

    private processChat(module: AbilityModule, hook: ChatHook) {

        if (hook.who === this.unit.owner) {
            const pData = module.game.forceModule.getPlayerDetails(this.targetUnit.owner);
            const crew = pData.getCrewmember();

            if (crew) {
                hook.name = crew.name;
                hook.color = PLAYER_COLOR[crew.unit.owner.id];
                hook.sound = GENERIC_CHAT_SOUND_REF;
            }
        }

        return hook;
    }

    private onLatchTravel(module: AbilityModule, data: EventData) {
        if (data.source !== this.targetUnit) return;

        const newFloor = module.game.worldModule.getUnitZone(data.source);

        if (!newFloor) {
            return Log.Error("Failed to follow latched unit!");
        }

        if (newFloor.id === ZONE_TYPE.SPACE) {
            Log.Information("Unit entering space, cancelling");
            return this.forceStop = true;
        }

        // Force our unit to travel too
        module.game.worldModule.travel(this.unit, newFloor.id);
        // Snap camera
        if (this.unit.isSelected(this.unit.owner)) {
            const t = new Timer();
            t.start(0, false, () => {
                PanCameraToTimedForPlayer(this.unit.owner.handle, this.targetUnit.x, this.targetUnit.y, 0);
                t.destroy();
            });
        }
    }

    private onDamage(module: AbilityModule) {
        this.forceStop = true;
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
        // Mini stun to end channels
        this.unit.paused = true;
        this.unit.paused = false;
    }

    private onLatchedGainsXp(module: AbilityModule, data: EventData) {
        Log.Information("on xp gain");
        if (data.source === this.targetUnit) {
            Log.Information("on xp gain for the worm");
            const amountGained = data.data.value / 2;
            module.game.event.sendEvent(EVENT_TYPE.CREW_GAIN_EXPERIENCE, {
                source: this.unit,
                data: { value: amountGained }
            });
        }
    }

    private onOrderChange(module: AbilityModule) {
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
                module.game.forceModule.aggressionBetweenTwoPlayers(
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

    public destroy(module: AbilityModule) { 
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
                module.game.chatModule.removeHook(this.latchChatHookId);
            }
        }
        catch(e) {
            Log.Error(e);
        }
        this.onUnitchangeOrder.destroy();
        this.unitTakesDamageTrigger.destroy();
        module.game.event.removeListener(this.travelListener);
        module.game.event.removeListener(this.unitExperienceSteal);
        return true;
    };
}