import { Unit } from "w3ts/index";
import { ABILITY_HOOK } from "../hook-types";
import { Behaviour } from "../behaviour";
import { Timers } from "app/timer-type";

const REVIVE_TIME = 30;

export class CarrionReincarnationBehaviour extends Behaviour {

    protected forUnit!: Unit;
    private reviveRate: number;
    private isReviving = false;



    /**
     * Will throw an error if the instance cannot be created
     * @param event 
     */
    constructor() {
        super();
    };

    public init(forUnit: Unit): boolean {
        this.forUnit = forUnit;
        return true;
    };

    /**
     * Iterate upon this instance of the ability
     */
    public onEvent(event: ABILITY_HOOK) {
        if (event == ABILITY_HOOK.UnitDies) {
            this.forUnit = Unit.fromHandle(GetTriggerUnit());
            ReviveHero(this.forUnit.handle,this.forUnit.x,this.forUnit.y,false);
            PauseUnit(this.forUnit.handle,true);
            SetUnitAnimation(this.forUnit.handle, "death");
            SetUnitInvulnerable(this.forUnit.handle,true);
            SetUnitState(this.forUnit.handle,UNIT_STATE_LIFE,2);
            this.reviveRate = BlzGetUnitMaxHP(this.forUnit.handle) / REVIVE_TIME;
            this.isReviving = true;
        }
    };

    public step(deltaTime: number) {
        if (this.isReviving) {
            let newHp = GetWidgetLife(this.forUnit.handle) + this.reviveRate * deltaTime;
            let maxHp = BlzGetUnitMaxHP(this.forUnit.handle);
            SetUnitState(this.forUnit.handle,UNIT_STATE_LIFE, newHp);
            if (newHp >= maxHp) {
                this.isReviving = false;
                SetUnitAnimation(this.forUnit.handle, "birth");
                QueueUnitAnimation(this.forUnit.handle, "stand");
                Timers.addTimedAction(2.33, () => {
                    SetUnitInvulnerable(this.forUnit.handle,false);
                    PauseUnit(this.forUnit.handle,false);
                });
            }
        }
    };

    public doDestroy(): boolean {
        if (!this.forUnit.isAlive()) return true;
        return false;
    };

    public destroy(): void {}
    };