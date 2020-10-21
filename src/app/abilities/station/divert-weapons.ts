import { Ability } from "../ability-type";
import { LIGHTS_GREEN, LIGHTS_RED, SFX_LIGHTNING_BOLT, SFX_RED_SINGULARITY } from "resources/sfx-paths";
import { MapPlayer, Unit } from "w3ts/index";
import { Players } from "w3ts/globals/index";
import { ABIL_SYSTEM_REACTOR_DIVERT_WEAPONS, TECH_DUMMY_DIVERT_WEAPONS } from "resources/ability-ids";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { UNIT_ID_STATION_SECURITY_TURRET } from "resources/unit-ids";
import { Log } from "lib/serilog/serilog";
import { ChatEntity } from "app/chat/chat-entity";
import { SOUND_COMPLEX_BEEP } from "resources/sounds";

export class DivertToWeaponsAbiility implements Ability {
    constructor() {}

    timeElapsed = 0;

    public initialise() {
        Players.forEach(p => {
            p.setTechResearched(TECH_DUMMY_DIVERT_WEAPONS, 2);
        });

        const uGroup = CreateGroup();
        GroupEnumUnitsOfPlayer(uGroup, PlayerStateFactory.StationSecurity.handle, Filter(() => {
            const u = Unit.fromHandle(GetFilterUnit());
            if (u.typeId === UNIT_ID_STATION_SECURITY_TURRET) {
                DestroyEffect(AddSpecialEffect(SFX_RED_SINGULARITY, u.x, u.y))
            }
            return false;
        }));
        ChatEntity.getInstance().postMessageFor(Players, "Reactor", '00ffff', "Activating weapon overdrive", undefined, SOUND_COMPLEX_BEEP);

        return true;
    };

    public process(delta: number) {
        this.timeElapsed += delta;        
        return this.timeElapsed < 30;
    };

    public destroy() {
        ChatEntity.getInstance().postMessageFor(Players, "Reactor", '00ffff', "Weapon overdrive exceeding safety thresholds. Disabling.", undefined, SOUND_COMPLEX_BEEP);
        Players.forEach(p => p.setTechResearched(ABIL_SYSTEM_REACTOR_DIVERT_WEAPONS, 0));
        return true;
    };
}