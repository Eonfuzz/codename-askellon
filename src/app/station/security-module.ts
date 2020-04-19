import { Game } from "app/game";
import { EVENT_TYPE } from "app/events/event";
import { Trigger, Unit, Group, Rectangle } from "w3ts";
import { Log } from "lib/serilog/serilog";
import { getZFromXY } from "lib/utils";
import { BURST_RIFLE_ITEM_ID, SHOTGUN_ITEM_ID, LASER_ITEM_ID, AT_ITEM_DRAGONFIRE_BLAST, SNIPER_ITEM_ID, ITEM_ID_EMO_INHIB, ITEM_ID_REPAIR, ITEM_ID_NANOMED, ITEM_ID_25_COINS } from "app/weapons/weapon-constants";

// const UNIT_ID_STATION_SECURITY_TURRET = FourCC('');
const UNIT_ID_STATION_SECURITY_POWER = FourCC('h004');
const CRATE_ID = FourCC('h005');
export class SecurityModule {

    game: Game;

    isDestroyedMap = new Map<Unit, boolean>();

    constructor(game: Game) { this.game = game; }

    initialise() {
        const securityDamageTrigger = new Trigger();

        // Get all security units on the map
        const uGroup = CreateGroup();
        GroupEnumUnitsOfPlayer(uGroup, this.game.forceModule.stationProperty.handle, Filter(() => {
            const u = GetFilterUnit();
            const uType = GetUnitTypeId(u);
            
            // if (uType === UNIT_ID_STATION_SECURITY_TURRET) return true;
            if (uType === UNIT_ID_STATION_SECURITY_POWER) return true;
            return false;
        }));

        // Now register that the chosen unit is damaged
        ForGroup(uGroup, () => {
            const u = GetEnumUnit();
            securityDamageTrigger.registerUnitEvent(Unit.fromHandle(u), EVENT_UNIT_DAMAGED)  ;
        });

        securityDamageTrigger.addAction(() => this.onSecurityDamage(
            BlzGetEventDamageTarget(),
            GetEventDamageSource(),
            GetEventDamage()
        ));

        // Decimate crates
        this.decimateCrates();

        // Now begin crate death trig
        const crateDeath = new Trigger();
        crateDeath.registerAnyUnitEvent(EVENT_PLAYER_UNIT_DEATH);
        crateDeath.addCondition(Filter(() => GetUnitTypeId(GetDyingUnit()) === CRATE_ID));
        crateDeath.addAction(() => this.onCrateDeath(Unit.fromHandle(GetDyingUnit())));
    }

    public isUnitDestroyed(u: Unit) {
        return this.isDestroyedMap.get(u) || false;
    }

    /**
     * Prevent security death
     */
    public onSecurityDamage(u: unit, source: unit, damage: number) {
        // Is this blow gonna kill the security item?
        const damageWithAllowance = damage + GetUnitState(u, UNIT_STATE_MAX_LIFE) * 0.1;
        if (damageWithAllowance > GetUnitState(u, UNIT_STATE_LIFE)) {
            const unit = Unit.fromHandle(u);
            const unitIsDestroyed = this.isUnitDestroyed(unit);

            // Set the unit to 1 hp
            SetUnitState(u, UNIT_STATE_LIFE, 1);
            // Make the unit invulnerable
            SetUnitInvulnerable(u, true);
            // Set the damage dealt to zero
            BlzSetEventDamage(0);

            if (!unitIsDestroyed) {
                this.isDestroyedMap.set(unit, true);
                // Pause the unit
                unit.paused = true;
                // Publish event that a security object is damaged
                this.game.event.sendEvent(EVENT_TYPE.STATION_SECURITY_DISABLED, {
                    source: Unit.fromHandle(source),
                    data: { 
                        unit: unit,
                        damaged: Unit.fromHandle(u)
                    }
                });
            }
        }
    }

    /**
     * If the security unit is full hp re-enable it
     * @param u 
     */
    public onSecurityHeal(u: unit, source: unit) {

        const unit = Unit.fromHandle(u);
        const unitIsDestroyed = this.isUnitDestroyed(unit);

        // Remove damage invulnerability
        unit.invulnerable = false;

        // Once a unit is healed remove its invulnerability
        // Allow some margin of error
        if (unitIsDestroyed && GetUnitLifePercent(u) >= 99) {
            this.isDestroyedMap.set(unit, false);
            // Set unit hp to full
            SetUnitLifePercentBJ(u, 100);
            // Pause the unit
            unit.paused = false;
            // Publish event that a security object is repaired
            this.game.event.sendEvent(EVENT_TYPE.STATION_SECURITY_ENABLED, {
                source: Unit.fromHandle(source),
                data: { 
                    unit: unit,
                    damaged: Unit.fromHandle(u)
                }
            });
        }
    }



    decimateCrates() {
        const group = new Group();
        const rect = Rectangle.fromHandle(bj_mapInitialPlayableArea);

        group.enumUnitsInRect(rect, Filter(() => GetUnitTypeId(GetFilterUnit()) === CRATE_ID));
        group.for(() => {
            const doDecimate = GetRandomInt(0, 100) >= 40;
            if (doDecimate) {
                RemoveUnit(GetEnumUnit());
            }
        });
    }

    onCrateDeath(who: Unit) {
        const uX = who.x;
        const uY = who.y;
        const uZ = getZFromXY(uX, uY);

        const sfx = AddSpecialEffect(
            "abilities\\weapons\\catapult\\catapultmissile.mdl", 
            who.x, 
            who.y
        );
        BlzSetSpecialEffectZ(sfx, uZ+10);
        DestroyEffect(sfx);
        RemoveUnit(who.handle);

        // Handle loot tables
        this.spawnLootOn(uX, uY); 
    }

    spawnLootOn(x: number, y: number) {
        const mainSeed = GetRandomReal(0, 1000);
        const secondarySeed =  GetRandomReal(0, 1000);
        const tertiarySeed = GetRandomReal(0, 1000);

        // 5% for weapon spawn
        if (mainSeed >= 950) {
            if (secondarySeed > 600) CreateItem(BURST_RIFLE_ITEM_ID, x, y);
            else if (secondarySeed > 200) CreateItem(SHOTGUN_ITEM_ID, x, y);
            else CreateItem(LASER_ITEM_ID, x, y);
        }
        // 15% for weapon attachment
        else if (mainSeed >= 800) {
            if (secondarySeed > 500) CreateItem(AT_ITEM_DRAGONFIRE_BLAST, x, y);
            else CreateItem(SNIPER_ITEM_ID, x, y);
        }
        // 50% Chance for 50 coins
        else if (mainSeed >= 300) {
            CreateItem(ITEM_ID_25_COINS, x, y);
        }
        // Otherwise misc stuff
        else {
            if (secondarySeed >= 800) CreateItem(ITEM_ID_EMO_INHIB, x, y);
            if (secondarySeed >= 600) CreateItem(ITEM_ID_REPAIR, x, y);
            if (secondarySeed >= 0) CreateItem(ITEM_ID_NANOMED, x, y);
        }

        // Also reward 10 XP
        const crew = this.game.crewModule.getCrewmemberForUnit(Unit.fromHandle(GetKillingUnit()));
        if (crew) {
            crew.addExperience(this.game, 25);
        }
    }
}