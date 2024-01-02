import { Log } from "lib/serilog/serilog";
import { ABIL_U_DEX } from "resources/ability-ids";
import { Players } from "w3ts/globals/index";
import { Group, Trigger, Unit } from "w3ts/index";

export enum UnitDexEvent {
    INDEX,
    DEINDEX,
    DEATH,
}

export class UnitDex {

    public static initialized = false;
    public static readonly group = new Group();
    public static readonly list: number[] = [];
    public static readonly unit: Unit[] = [];
    public static eventUnit: Unit;
    private static DETECT_LEAVE_ABILITY = ABIL_U_DEX;
    private static counter = 0;
    private static count = 0;
    private static index = 0;
    private static lastIndex = 0;
    private static indexTrig = [new Trigger(), new Trigger(), new Trigger()];

    private constructor() { }

    /**
    * Register a UnitDex event.
    * @param func
    * @param eventType
    */
    static registerEvent(eventType: UnitDexEvent, func: Function) {
        return this.indexTrig[eventType].addAction(() => func());
    }

    /**
    * Remove a UnitDex event.
    * @param func
    * @param eventType
    */
    static removeEvent(eventType: UnitDexEvent, ta: triggeraction) {
        this.indexTrig[eventType].removeAction(ta);
    }

    private static onEnter() {
        const u = Unit.fromHandle(GetFilterUnit());
        const id = u.userData;

        let t = this.index;

        if (id != 0) {
            return false;
        }

        // Add to group of indexed units
        this.group.addUnit(u);

        // Give unit the leave detection ability
        u.addAbility(this.DETECT_LEAVE_ABILITY);
        u.makeAbilityPermanent(true, this.DETECT_LEAVE_ABILITY);

        // Allocate index
        if (this.index != 0) {
            this.index = this.list[t]
        } else {
            this.counter++;
            t = this.counter;
        }

        this.list[t] = -1;
        this.lastIndex = t;
        this.unit[t] = u;
        this.count++;

        // Store the index
        u.userData = t;

        if (this.initialized) {
            // Execute custom events registered with RegisterUnitIndexEvent
            this.eventUnit = u;
            this.indexTrig[UnitDexEvent.INDEX].exec();
        }

        return false;
    }

    private static onLeave() {
        if (GetIssuedOrderId() != 852056) {
            return false;
        }

        const u = Unit.fromHandle(GetTriggerUnit());

        // If unit was killed (not removed) then don't continue
        if (u.getAbilityLevel(this.DETECT_LEAVE_ABILITY) != 0) {
            if (!UnitAlive(u.handle)) {
                this.eventUnit = u;
                this.indexTrig[UnitDexEvent.DEATH].exec();
            }
            return false
        }

        const i = u.userData;

        // If unit has been indexed then deindex it
        if (i > 0 && i <= this.counter && u == this.unit[i]) {
            // Recycle the index
            this.list[i] = this.index;
            this.index = i
            this.lastIndex = i

            // Remove to group of indexed units
            this.group.removeUnit(u);

            // Execute custom events without any associated triggers
            this.eventUnit = u;
            this.indexTrig[UnitDexEvent.DEINDEX].exec();

            // Remove entry
            u.userData = 0;

            // Decrement unit count
            this.count = this.count - 1;
        }

        return false;
    }

    private static onGameStart() {
        DestroyTimer(GetExpiredTimer());
        for (let index = 1; index < this.counter; index++) {
            this.lastIndex = index;
            this.eventUnit = this.unit[index];
            if (this.eventUnit?.handle) {
                this.indexTrig[UnitDexEvent.INDEX].exec();
            }
            else {
                Log.Error(`UDexGameStart: Unit not found at ${index} of ${this.counter}`)
            }
        }
        this.lastIndex = this.counter;
        this.initialized = true;
    }

    static init() {
        const t = CreateTrigger();
        const reg = CreateRegion();
        const world = GetWorldBounds();
        const filterEnter = Filter(() => this.onEnter());

        // Detect units when they enter or leave the map
        RegionAddRect(reg, world);
        TriggerRegisterEnterRegion(CreateTrigger(), reg, filterEnter);
        RemoveRect(world);

        TriggerAddCondition(t, Filter(() => this.onLeave()));

        for (let i = 0; i < bj_MAX_PLAYER_SLOTS; i++) {
            const p = Player(i);

            // Detect "undefend"
            TriggerRegisterPlayerUnitEvent(t, p, EVENT_PLAYER_UNIT_ISSUED_ORDER, null)

            // Hide the detect ability from players
            SetPlayerAbilityAvailable(p, this.DETECT_LEAVE_ABILITY, false)

            // Index preplaced units
            const g = CreateGroup();
            GroupEnumUnitsOfPlayer(g, Players[i].handle, filterEnter);
            DestroyGroup(g);
        }

        // run init triggers
        TimerStart(CreateTimer(), 0.00, false, () => this.onGameStart());
    }
}
