import { SoundWithCooldown, SoundRef } from "../../types/sound-ref";
import { ABIL_ACCURACY_PENALTY_30, ABIL_DESPAIR } from "resources/ability-ids";
import { BUFF_ID, BUFF_ID_DESPAIR } from "resources/buff-ids";
import { Unit, MapPlayer } from "w3ts/index";
import { DynamicBuff } from "../dynamic-buff-type";
import { EventEntity } from "app/events/event-entity";
import { EVENT_TYPE } from "app/events/event-enum";
import { DummyCast } from "lib/dummy";
import { Log } from "lib/serilog/serilog";
import { ForceEntity } from "app/force/force-entity";
import { ALIEN_FORCE_NAME } from "app/force/forces/force-names";
import { AlienForce } from "app/force/forces/alien-force";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { ChatHook } from "app/chat/chat-hook-type";
import { ChatEntity } from "app/chat/chat-entity";
import { COL_MISC } from "resources/colours";
import { BuffInstance } from "../buff-instance-type";
import { BuffInstanceDuration } from "../buff-instance-duration-type";

export const despairMusic = new SoundWithCooldown(1, "Music\\FlightIntoTheUnkown.mp3", true);
export const DESPAIR_PING_EVERY = 30;
export const chatFailedSound = new SoundWithCooldown(10, "Sounds\\RadioStatic.mp3", true);
Preload("Music\\FlightIntoTheUnkown.mp3");

/**
 * Resolve is a buff applied to a unit
 * Can be applied multiple times and from multiple sources
 */
export class Despair extends DynamicBuff {
    name = BUFF_ID.DESPAIR;

    private jumpScareSound: SoundWithCooldown;

    private unit: Unit;
    private prevUnitHealth: number;
    protected doesStack = false;

    private checkForDespairBuffTicker: number = 0;
    private pingTimer = 0;
    private hookId: number;

    constructor(who: Unit) {
        super();
        
        this.jumpScareSound = new SoundWithCooldown(10, "Sounds\\HeavyBreath.mp3");
        despairMusic.setVolume(127);

        this.unit = who;
        this.prevUnitHealth = this.unit.getState(UNIT_STATE_LIFE);
    }

    public addInstance(unit: Unit, instance: BuffInstance, isNegativeInstance?: boolean) {

        if (instance instanceof BuffInstanceDuration && !isNegativeInstance) {
            Log.Information("Instance buff duration!");

            if (this.unit.intelligence > 0) {
                instance.endTimestamp = instance.endTimestamp - MathRound(this.unit.intelligence / 3);
            }
        }

        super.addInstance(unit, instance, isNegativeInstance);
    }

    public process(gametime: number, delta: number): boolean {
        const result =  super.process(gametime, delta);
        if (!this.isActive) return result;
        
        const currentHealth = this.unit.getState(UNIT_STATE_LIFE);
        const deltaHealth = currentHealth - this.prevUnitHealth;
        this.checkForDespairBuffTicker += delta

        // If the unit has gained health reduce it by 50%
        if (deltaHealth > 0) {
            this.unit.setState(UNIT_STATE_LIFE, currentHealth - deltaHealth/2);
        }
        if (this.checkForDespairBuffTicker >= 1) {
            this.checkForDespairBuffTicker = 0;
            if (!UnitHasBuffBJ(this.unit.handle, BUFF_ID_DESPAIR)) {
                // If we don't have another ticker apply the buff to the unit
                DummyCast((dummy: unit) => {
                    SetUnitX(dummy, this.unit.x);
                    SetUnitY(dummy, this.unit.y + 50);
                    IssueTargetOrder(dummy, "faeriefire", this.unit.handle);
                }, ABIL_DESPAIR);
            }
        }
        this.pingTimer -= delta;
        if (this.pingTimer <= 0) {
            this.pingTimer = DESPAIR_PING_EVERY;
            // Get alien force
            const alienForce = PlayerStateFactory.getForce(ALIEN_FORCE_NAME) as AlienForce;
            const loc = Location(this.unit.x, this.unit.y);

            const isAlien = alienForce.hasPlayer(this.unit.owner);
            if (alienForce.hasPlayer(MapPlayer.fromLocal())) {
                if (!isAlien) PingMinimapEx(this.unit.x, this.unit.y, 3, 102, 255, 51, false);
                else PingMinimapEx(this.unit.x, this.unit.y, 3, 153, 51, 255, false);
            }

            RemoveLocation(loc);
        }
        return result;
    }

    public onStatusChange(newStatus: boolean) {
        if (newStatus) {
            this.unit.addAbility(ABIL_ACCURACY_PENALTY_30);
            if (GetLocalPlayer() === this.unit.owner.handle && despairMusic.canPlaySound()) {
                SetMusicVolume(0);
                despairMusic.setVolume(60);
                despairMusic.playSound();
                this.jumpScareSound.playSound();
            }

            // If we dont got the buff cast that bad boi
            if (!UnitHasBuffBJ(this.unit.handle, BUFF_ID_DESPAIR)) {
                // If we don't have another ticker apply the buff to the unit
                DummyCast((dummy: unit) => {
                    SetUnitX(dummy, this.unit.x);
                    SetUnitY(dummy, this.unit.y + 50);
                    IssueTargetOrder(dummy, "faeriefire", this.unit.handle);
                }, ABIL_DESPAIR);
            }

            // Publish events
            EventEntity.getInstance().sendEvent(EVENT_TYPE.CREW_GAIN_DESPAIR, { 
                source: this.unit, 
                data: { instance: this }
            });
            this.hookId = ChatEntity.getInstance().addHook((hook: ChatHook) => this.processChat(hook));
        }
        else {
            this.unit.removeAbility(ABIL_ACCURACY_PENALTY_30);

            // Also remove resolve buff
            UnitRemoveBuffBJ(BUFF_ID_DESPAIR, this.unit.handle);
            this.onChangeCallbacks.forEach(cb => cb(this));

            // End music and sounds
            if (GetLocalPlayer() === this.unit.owner.handle) {
                despairMusic.stopSound(true);
                this.jumpScareSound.stopSound(true);
                SetMusicVolume(30);
            }
            
            EventEntity.getInstance().sendEvent(EVENT_TYPE.CREW_LOSE_DESPAIR, { source: this.unit, data: { instance: this } });
            ChatEntity.getInstance().removeHook(this.hookId);
        }
    }

    
    private processChat(chat: ChatHook) {
        if (chat.who === this.who.owner && chat.name === this.who.nameProper) {
            chat.recipients = [this.who.owner];

            const randomInt = GetRandomInt(0, 4);

            if (randomInt === 0)
                chat.message = `${COL_MISC}< radio static >|r`;
            else if (randomInt === 1)
                chat.message = `${COL_MISC}< your radio isn't working >|r`;
            else if (randomInt === 2)
                chat.message = `${COL_MISC}< there's a problem with your radio >|r`;
            else if (randomInt === 3)
                chat.message = `${COL_MISC}< something is blocking your radio >|r`;
            else if (randomInt === 4)
                chat.message = `${COL_MISC}< interference >|r`;
            chat.sound = chatFailedSound;
        }
        return chat;
    }
}