import { Game } from "app/game";
import { EVENT_TYPE } from "app/events/event";
import { Trigger } from "app/types/jass-overrides/trigger";
import { Log } from "lib/serilog/serilog";

const UNIT_ID_STATION_SECURITY_TURRET = FourCC('');
const UNIT_ID_STATION_SECURITY_POWER = FourCC('');

export class SecurityModule {

    game: Game;

    constructor(game: Game) { this.game = game; }

    initialise() {
        const securityDamageTrigger = new Trigger();

        // Get all security units on the map
        const uGroup = CreateGroup();
        GroupEnumUnitsOfPlayer(uGroup, this.game.forceModule.stationSecurity, Filter(() => {
            const u = GetFilterUnit();
            const uType = GetUnitTypeId(u);
            
            if (uType === UNIT_ID_STATION_SECURITY_TURRET) return true;
            if (uType === UNIT_ID_STATION_SECURITY_POWER) return true;
            return false;
        }));

        // Now register that the chosen unit is damaged
        ForGroup(uGroup, () => {
            const u = GetEnumUnit();
            securityDamageTrigger.RegisterUnitEvent(u, EVENT_UNIT_DAMAGED)  ;
        });

        securityDamageTrigger.AddAction(() => this.onSecurityDamage(
            BlzGetEventDamageTarget(),
            GetEventDamageSource(),
            GetEventDamage()
        ));
    }

    /**
     * Prevent security death
     */
    onSecurityDamage(u: unit, source: unit, damage: number) {
        // Is this blow gonna kill the security item?
        if (damage > GetUnitState(u, UNIT_STATE_LIFE)) {
            // Set the unit to 1 hp
            SetUnitState(u, UNIT_STATE_LIFE, 1);
            // Make the unit invulnerable
            SetUnitInvulnerable(u, true);
            // Pause the unit
            BlzPauseUnitEx(u, true);
            // Set the damage dealt to zero
            BlzSetEventDamage(0);

            // Publish event that a security object is damaged
            this.game.event.sendEvent(EVENT_TYPE.STATION_SECURITY_DISABLED, {
                unit: u,
                source: source
            });
        }
    }

    /**
     * If the security unit is full hp re-enable it
     * @param u 
     */
    onSecurityHeal(u: unit, source: unit) {
        // Allow some margin of error
        if (GetUnitLifePercent(u) >= 99) {
            // Set unit hp to full
            SetUnitLifePercentBJ(u, 100);
            // Make the unit invulnerable
            SetUnitInvulnerable(u, false);
            // Pause the unit
            BlzPauseUnitEx(u, true);
            // Set the damage dealt to zero
            BlzSetEventDamage(0);

            // Publish event that a security object is repaired
            this.game.event.sendEvent(EVENT_TYPE.STATION_SECURITY_ENABLED, {
                unit: u,
                source: source
            });
        }
    }
}