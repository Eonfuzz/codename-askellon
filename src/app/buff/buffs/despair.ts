import { SoundWithCooldown, SoundRef } from "../../types/sound-ref";
import { ABIL_ACCURACY_PENALTY_30, ABIL_DESPAIR } from "resources/ability-ids";
import { BUFF_ID, BUFF_ID_DESPAIR } from "resources/buff-ids";
import { Unit } from "w3ts/index";
import { DynamicBuff } from "../dynamic-buff-type";
import { EventEntity } from "app/events/event-entity";
import { EVENT_TYPE } from "app/events/event-enum";
import { DummyCast } from "lib/dummy";

export const despairMusic = new SoundRef("Music\\FlightIntoTheUnkown.mp3", true, true);
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

    constructor(who: Unit) {
        super();
        
        this.jumpScareSound = new SoundWithCooldown(10, "Sounds\\HeavyBreath.mp3");
        despairMusic.setVolume(127);

        this.unit = who;
        this.prevUnitHealth = this.unit.getState(UNIT_STATE_LIFE);
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
        return result;
    }

    public onStatusChange(newStatus: boolean) {
        if (newStatus) {
            this.unit.addAbility(ABIL_ACCURACY_PENALTY_30);
            despairMusic.setVolume(60);
            if (GetLocalPlayer() === this.unit.owner.handle) {
                SetMusicVolume(0);
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
        }
        else {
            this.unit.removeAbility(ABIL_ACCURACY_PENALTY_30);

            // Also remove resolve buff
            UnitRemoveBuffBJ(BUFF_ID_DESPAIR, this.unit.handle);
            this.onChangeCallbacks.forEach(cb => cb(this));

            // End music and sounds
            if (GetLocalPlayer() === this.unit.owner.handle) {
                despairMusic.stopSound();
                this.jumpScareSound.stopSound();
                SetMusicVolume(30);
            }
            
            EventEntity.getInstance().sendEvent(EVENT_TYPE.CREW_LOSE_DESPAIR, { source: this.unit, data: { instance: this } });
        }
    }
}