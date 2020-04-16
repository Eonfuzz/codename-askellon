import { Game } from "app/game";
import { EVENT_TYPE } from "app/events/event";
import { Trigger, Unit } from "w3ts";
import { Log } from "lib/serilog/serilog";

// const UNIT_ID_STATION_SECURITY_TURRET = FourCC('');
const UNIT_ID_STATION_SECURITY_POWER = FourCC('h004');

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
}