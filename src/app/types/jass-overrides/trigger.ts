export class Trigger {

    nativeTrigger: trigger;
    public isDestroyed: boolean = false;

    constructor() {
        this.nativeTrigger = CreateTrigger();
    }

    public static EvaluateCondition(func: () => boolean): boolean {
        let answer: boolean = false;

        xpcall(() => {
            answer = func();
        }, (err: any) => {
            this.printError(err);
        });

        return answer;
    }


    public static printError(err: any) {
        print("FATAL ERROR");
        print(err);
    }


    public AddAction(actionFunc: () => void): triggeraction {
        return TriggerAddAction(this.nativeTrigger, () => xpcall(() => actionFunc(), err => Trigger.printError(err)));
    }

    public RegisterTimerExpire(timer: timer): event {
        return TriggerRegisterTimerExpireEvent(this.nativeTrigger, timer);
    }

    public RegisterTimerEvent(timeout: number, periodic: boolean): event {
        return TriggerRegisterTimerEvent(this.nativeTrigger, timeout, periodic);
    }

    public RegisterTimerEventSingle(timeout: number): event {
        return TriggerRegisterTimerEventSingle(this.nativeTrigger, timeout);
    }

    public RegisterTimerEventPeriodic(timeout: number): event {
        return TriggerRegisterTimerEventPeriodic(this.nativeTrigger, timeout);
    }

    public RegisterPlayerStateEvent(whichPlayer: player, whichState: playerstate, opcode: limitop, limitval: number): event {
        return TriggerRegisterPlayerStateEvent(this.nativeTrigger, whichPlayer, whichState, opcode, limitval);
    }

    public RegisterUnitTakesDamage() {
        return TriggerRegisterAnyUnitEventBJ(this.nativeTrigger, EVENT_PLAYER_UNIT_DAMAGED);
    }

    public RegisterDeathEvent(whichWidget: widget): event {
        return TriggerRegisterDeathEvent(this.nativeTrigger, whichWidget);
    }

    public RegisterDialogEventBJ(whichDialog: dialog): event {
        return TriggerRegisterDialogEventBJ(this.nativeTrigger, whichDialog);
    }


    public RegisterEnterRectSimple(r: rect): event {
        return TriggerRegisterEnterRectSimple(this.nativeTrigger, r);
    }

    // public RegisterEnterRectangle(area: Rectangle): event {
    //     const rectangle: rect = Rect(area.minX, area.minY, area.maxX, area.maxY);
    //     const trigEvent: event = this.RegisterEnterRectSimple(rectangle);
    //     RemoveRect(rectangle);
    //     return trigEvent;
    // }

    public AddCondition(func: () => boolean): triggercondition {
        return TriggerAddCondition(this.nativeTrigger, Condition(() => Trigger.EvaluateCondition(func)));
    }

    public AddFilterFuncCondition(filter: filterfunc): triggercondition {
        return TriggerAddCondition(this.nativeTrigger, filter);
    }

    public RegisterAnyUnitEventBJ(whichEvent: playerunitevent): void {
        TriggerRegisterAnyUnitEventBJ(this.nativeTrigger, whichEvent);
    }

    public RegisterPlayerChatEvent(whichPlayer: player, chatMessageToDetect: string, exactMatchOnly: boolean): event {
        return TriggerRegisterPlayerChatEvent(this.nativeTrigger, whichPlayer, chatMessageToDetect, exactMatchOnly);
    }

    public RegisterPlayerUnitEventSimple(whichPlayer: player, whichEvent: playerunitevent): event {
        return TriggerRegisterPlayerUnitEventSimple(this.nativeTrigger, whichPlayer, whichEvent);
    }

    // public RegisterPlayerEventLeave(whichPlayer: AbstractPlayer): event {
    //     return TriggerRegisterPlayerEventLeave(this.nativeTrigger, whichPlayer.wcPlayer);
    // }


    public RegisterUnitIssuedOrder(whichUnit: unit, whichEvent: unitevent): event {
        return TriggerRegisterUnitEvent(this.nativeTrigger, whichUnit, whichEvent);
    }

    public destroy() {
        this.isDestroyed = true;
        DestroyTrigger(this.nativeTrigger);
    }
}