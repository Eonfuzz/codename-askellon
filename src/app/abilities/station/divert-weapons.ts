import { Ability } from "../ability-type";
import { getZFromXY, GetActivePlayers } from "lib/utils";
import { LIGHTS_GREEN, LIGHTS_RED, SFX_LIGHTNING_BOLT, SFX_RED_SINGULARITY } from "resources/sfx-paths";
import { SoundRef } from "app/types/sound-ref";
import { testerSlots } from "app/interactions/interactables/genetic-tester";
import { GENETIC_FACILITY_TOOLTIP } from "resources/strings";
import { COL_TEAL, COL_ATTATCH, COL_INFO, COL_MISC, COL_GOOD, COL_ORANGE } from "resources/colours";
import { SOUND_COMPLEX_BEEP } from "resources/sounds";
import { ITEM_GENETIC_SAMPLE_INFESTED } from "resources/item-ids";
import { ChatEntity } from "app/chat/chat-entity";
import { Timers } from "app/timer-type";
import { MapPlayer, Unit } from "w3ts/index";
import { PlayNewSound } from "lib/translators";
import { AskellonEntity } from "app/station/askellon-entity";
import { Players } from "w3ts/globals/index";
import { ABIL_SYSTEM_REACTOR_DIVERT_WEAPONS, TECH_DUMMY_DIVERT_WEAPONS } from "resources/ability-ids";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { UNIT_ID_STATION_SECURITY_TURRET } from "resources/unit-ids";
import { Log } from "lib/serilog/serilog";

export class DivertToWeaponsAbiility implements Ability {
    constructor() {}

    timeElapsed = 0;

    public initialise() {

        const castingPlayer = MapPlayer.fromHandle(GetOwningPlayer(GetTriggerUnit()));

        Players.forEach(p => {
            p.setTechResearched(TECH_DUMMY_DIVERT_WEAPONS, 2);
        });


        const uGroup = CreateGroup();
        GroupEnumUnitsOfPlayer(uGroup, PlayerStateFactory.StationSecurity.handle, Filter(() => {
            const u = Unit.fromHandle(GetFilterUnit());
        
        
            // if (uType === UNIT_ID_STATION_SECURITY_TURRET) return true;
            if (u.typeId === UNIT_ID_STATION_SECURITY_TURRET) {
                DestroyEffect(AddSpecialEffect(SFX_RED_SINGULARITY, u.x, u.y))
            }
            return false;
        }));

        return true;
    };

    public process(delta: number) {
        this.timeElapsed += delta;
        
        return this.timeElapsed < 30;
    };

    public destroy() {
        Players.forEach(p => p.setTechResearched(ABIL_SYSTEM_REACTOR_DIVERT_WEAPONS, 0))
        return true;
    };
}