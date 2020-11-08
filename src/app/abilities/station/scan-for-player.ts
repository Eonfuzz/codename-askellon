import { Ability } from "../ability-type";
import { SoundRef } from "app/types/sound-ref";
import { MessageAllPlayers } from "lib/utils";
import { COL_ORANGE, COL_INFO, COL_ATTATCH, COL_GOOD, COL_GOLD } from "resources/colours";
import { EventEntity } from "app/events/event-entity";
import { EVENT_TYPE } from "app/events/event-enum";
import { Unit, MapPlayer } from "w3ts/index";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { ABIL_SECURITY_TARGET_ALL, ABIL_ACTIVATE_SCAN_CREW, ABIL_ACTIVATE_SCAN_ALIENS } from "resources/ability-ids";
import { PlayNewSound, PLAYER_COLOR, PLAYER_RGB } from "lib/translators";
import { PlayerState } from "app/force/player-type";
import { TARGETING_TOOLTIP, TARGETING_TOOLTIP_EXTENDED } from "resources/strings";
import { Players } from "w3ts/globals/index";
import { Log } from "lib/serilog/serilog";
import { Timers } from "app/timer-type";
import { GlobalCooldownAbilityEntity } from "../global-ability-entity";
import { ALIEN_FORCE_NAME } from "app/force/forces/force-names";
import { AlienForce } from "app/force/forces/alien-force";

/** @noSelfInFile **/
const scanSound = new SoundRef("Sounds\\Ships\\deep_scan.mp3", false, true);
export class StationSecurityScanForPlayer implements Ability {

    private isScanningForAliens = false;
    constructor(scanForAliens: boolean) {
        this.isScanningForAliens = scanForAliens;
    }

    public initialise() {
        const u = Unit.fromHandle(GetTriggerUnit());

        GlobalCooldownAbilityEntity.getInstance().onAbilityCast(u.handle, ABIL_ACTIVATE_SCAN_CREW);
        GlobalCooldownAbilityEntity.getInstance().onAbilityCast(u.handle, ABIL_ACTIVATE_SCAN_ALIENS);


        MessageAllPlayers(`Activating ${COL_GOLD}Scanners|r: Searching for any ${this.isScanningForAliens ? 'Alien' : 'Crew'}`);
        Timers.addTimedAction(5.5, () => {
            scanSound.playSound();
        });

        Timers.addTimedAction(6, () => {
            MessageAllPlayers(`Scan Complete.`);
            if (!this.isScanningForAliens) {
                Players.forEach(p => {
                    const crew = PlayerStateFactory.getCrewmember(p);
                    if (crew) {
                        const pData = PlayerStateFactory.get(p);
                        const pMain = PlayerStateFactory.get(p).getUnit();
                        if (pMain && crew && crew.unit && crew.unit.isAlive() && crew.unit === pMain) {
                            const c = PLAYER_RGB[p.id];
                            PingMinimapEx(u.x, u.y, 6, c[0], c[1], c[2], false);
                        }
                    }
                })
            }
            else {
                const uGroup = CreateGroup();
                // Get all units owned by AI
                PlayerStateFactory.getAlienAI().forEach(p => {
                    GroupEnumUnitsOfPlayer(uGroup, p.handle, Filter(() => {
                        const u = GetFilterUnit();
                        PingMinimapEx( GetUnitX(u), GetUnitY(u), 3, 153, 51, 255, false);
                        return false;
                    }));
                    GroupClear(uGroup);
                });
                DestroyGroup(uGroup);

                const alienForce = PlayerStateFactory.getForce(ALIEN_FORCE_NAME) as AlienForce;

                alienForce.getPlayers().forEach(p => {
                    if (alienForce.isPlayerTransformed(p)) {
                        const u = alienForce.getActiveUnitFor(p);
                        PingMinimapEx(u.x, u.y, 3, 153, 51, 255, false);
                    }
                });
            }
        });
        return true;
    };

    public process(delta: number) {
        return false;
    };

    public destroy() {
        return true;
    };
}