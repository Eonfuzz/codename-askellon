import { Ability } from "../ability-type";
import { SoundRef } from "app/types/sound-ref";
import { MessageAllPlayers } from "lib/utils";
import { COL_ORANGE, COL_INFO, COL_ATTATCH, COL_GOOD, COL_GOLD, COL_ALIEN } from "resources/colours";
import { EventEntity } from "app/events/event-entity";
import { EVENT_TYPE } from "app/events/event-enum";
import { Unit, MapPlayer, playerColors } from "w3ts/index";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { ABIL_SECURITY_TARGET_ALL, ABIL_ACTIVATE_SCAN_CREW, ABIL_ACTIVATE_SCAN_ALIENS, TECH_MAJOR_SECURITY } from "resources/ability-ids";
import { Players } from "w3ts/globals/index";
import { Log } from "lib/serilog/serilog";
import { Timers } from "app/timer-type";
import { GlobalCooldownAbilityEntity } from "../global-ability-entity";
import { ALIEN_FORCE_NAME } from "app/force/forces/force-names";
import { AlienForce } from "app/force/forces/alien-force";
import { SHIP_VOYAGER_UNIT } from "resources/unit-ids";

export const scanSound = new SoundRef("Sounds\\Ships\\deep_scan.mp3", false, true);
export class StationSecurityScanForPlayer implements Ability {

    private isScanningForAliens = false;

    private scanInterval = 5;

    private duration = 0;
    private maxDuration = 10;

    private scanGroup = CreateGroup();

    constructor(scanForAliens: boolean) {
        this.isScanningForAliens = scanForAliens;
    }

    public initialise() {
        const u = Unit.fromHandle(GetTriggerUnit());

        GlobalCooldownAbilityEntity.getInstance().onAbilityCast(u.handle, ABIL_ACTIVATE_SCAN_CREW);
        GlobalCooldownAbilityEntity.getInstance().onAbilityCast(u.handle, ABIL_ACTIVATE_SCAN_ALIENS);

        this.maxDuration = u.owner.getTechCount(TECH_MAJOR_SECURITY, true) * 10;

        MessageAllPlayers(`Activating ${COL_GOLD}Scanners|r: Searching for ${this.isScanningForAliens ? `${COL_ALIEN}Alien Signatures|r` : 'Crew Signals'}`);
        return true;
    };

    public process(delta: number) {
        this.duration += delta;
        this.scanInterval -= delta;

        if (this.scanInterval <= 0) {
            this.scanInterval += 5;

            scanSound.setVolume(40);
            scanSound.playSound();
            
            if (!this.isScanningForAliens) {
                Players.forEach(p => {
                    const pData = PlayerStateFactory.get(p);
                    if (!pData) return;
                    
                    const crew = pData.getCrewmember();
                    const pMain = pData.getUnit();


                    let unit: Unit;
                    // Try to find the "main" unit
                    // First of all it's either a crewmember
                    if (pData && crew && crew.unit && crew.unit.isAlive() && crew.unit === pMain && crew.unit.show) {
                        unit = crew.unit;
                    }
                    // Or a ship..
                    else {
                        GroupEnumUnitsOfPlayer(this.scanGroup, p.handle, Filter(() => GetUnitTypeId(GetFilterUnit()) == SHIP_VOYAGER_UNIT));
                        if (BlzGroupGetSize(this.scanGroup) === 1) {
                            unit = Unit.fromHandle(BlzGroupUnitAt(this.scanGroup, 0));
                        }
                    }

                    // Then ping it!
                    if (unit && p.id < playerColors.length) {
                        const c = playerColors[p.id];
                        if (c) PingMinimapEx(unit.x, unit.y, 5, c.red, c.green, c.blue, false);
                    }
                })
            }
            else {
                const uGroup = CreateGroup();
                // Get all units owned by AI
                PlayerStateFactory.getAlienAI().forEach(p => {
                    GroupEnumUnitsOfPlayer(uGroup, p.handle, Filter(() => {
                        const u = GetFilterUnit();
                        PingMinimapEx( GetUnitX(u), GetUnitY(u), 5, 153, 51, 255, false);
                        return false;
                    }));
                    GroupClear(uGroup);
                });
                DestroyGroup(uGroup);

                const alienForce = PlayerStateFactory.getForce(ALIEN_FORCE_NAME) as AlienForce;

                alienForce.getPlayers().forEach(p => {
                    if (alienForce.isPlayerTransformed(p)) {
                        const u = alienForce.getActiveUnitFor(p);
                        PingMinimapEx(u.x, u.y, 15, 153, 51, 255, false);
                    }
                });
            }
        }


        return this.duration < this.maxDuration;
    };

    public destroy() {
        DestroyGroup(this.scanGroup);
        MessageAllPlayers(`Scan Complete.`);
        return true;
    };
}