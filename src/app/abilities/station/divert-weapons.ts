import { AbilityWithDone } from "../ability-type";
import { LIGHTS_GREEN, LIGHTS_RED, SFX_LIGHTNING_BOLT, SFX_RED_SINGULARITY } from "resources/sfx-paths";
import { MapPlayer, Unit } from "w3ts/index";
import { Players } from "w3ts/globals/index";
import { ABIL_SYSTEM_REACTOR_DIVERT_WEAPONS, TECH_DUMMY_DIVERT_WEAPONS, TECH_MAJOR_REACTOR } from "resources/ability-ids";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { UNIT_ID_STATION_SECURITY_TURRET } from "resources/unit-ids";
import { Log } from "lib/serilog/serilog";
import { ChatEntity } from "app/chat/chat-entity";
import { SOUND_COMPLEX_BEEP } from "resources/sounds";
import { ResearchFactory } from "app/research/research-factory";
import { COL_ATTATCH } from "resources/colours";

export class DivertToWeaponsAbiility extends AbilityWithDone {
    

    timeElapsed = 0;

    infestedTurrets: Unit[] = [];

    public init() {
        super.init();
        const isInfested = ResearchFactory.getInstance().isUpgradeInfested(TECH_MAJOR_REACTOR, 3);
        Players.forEach(p => {
            p.setTechResearched(TECH_DUMMY_DIVERT_WEAPONS, 2);
        });

        const uGroup = CreateGroup();
        GroupEnumUnitsOfPlayer(uGroup, PlayerStateFactory.StationSecurity.handle, Filter(() => {
            const u = Unit.fromHandle(GetFilterUnit());
            if (u.typeId === UNIT_ID_STATION_SECURITY_TURRET) {
                DestroyEffect(AddSpecialEffect(SFX_RED_SINGULARITY, u.x, u.y));

                if (isInfested) {
                    this.infestedTurrets.push(u);
                    u.owner = PlayerStateFactory.AlienAIPlayer1;
                    u.color = PLAYER_COLOR_PURPLE;
                }
            }
            return false;
        }));
        ChatEntity.getInstance().postMessageFor(Players, "Reactor", COL_ATTATCH, "Activating weapon overdrive", undefined, SOUND_COMPLEX_BEEP);

        return true;
    };

    public step(delta: number) {
        this.timeElapsed += delta;        
        if (this.timeElapsed >= 30) {            
            this.done = true; 
        }
    };

    public destroy() {
        this.infestedTurrets.forEach(u => {
            u.owner = PlayerStateFactory.StationSecurity;
            u.color = PLAYER_COLOR_LIGHT_GRAY;
        });
        ChatEntity.getInstance().postMessageFor(Players, "Reactor", COL_ATTATCH, "Weapon overdrive exceeding safety thresholds. Disabling.", undefined, SOUND_COMPLEX_BEEP);
        Players.forEach(p => p.setTechResearched(TECH_DUMMY_DIVERT_WEAPONS, 0));
        return true;
    };
}