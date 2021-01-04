import { Ability } from "../ability-type";
import { Unit } from "w3ts/handles/unit";
import { BUFF_ID } from "resources/buff-ids";
import { SoundRef } from "app/types/sound-ref";
import { FilterIsAlive } from "resources/filters";
import { Effect } from "w3ts/index";
import { ForceEntity } from "app/force/force-entity";
import { DynamicBuffEntity } from "app/buff/dynamic-buff-entity";
import { BuffInstanceDuration } from "app/buff/buff-instance-duration-type";
import { AbilityHooks } from "../ability-hooks";
import { ABIL_GENE_COSMIC } from "resources/ability-ids";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { Minigun } from "app/weapons/guns/minigun";

const FullerAutoSounds = [ 
    new SoundRef("Sounds\\minigun_fullerauto_1.mp3", false), 
    new SoundRef("Sounds\\minigun_fullerauto_2.mp3", false) 
];

export class MinigunFullerAutoAbility implements Ability {

    private unit: Unit | undefined;
    private wep: Minigun;

    private duration = 5;

    constructor() {}

    public initialise() {
        this.unit = Unit.fromHandle(GetTriggerUnit());
        FullerAutoSounds[ GetRandomInt(0, FullerAutoSounds.length -1)].playSoundOnUnit(this.unit.handle, 127);

        const crew = PlayerStateFactory.getCrewmember(this.unit.owner);
        if (crew && crew.unit === this.unit) {
            const minigun = crew.weapon as Minigun; 
            this.wep = minigun;
            this.wep.fullerAutoActive = true;
        }
        return true;
    };

    public process(delta: number) {
        this.duration -= delta;
        return this.duration > 0;
    };

    public destroy() {
        this.wep.fullerAutoActive = false;
        return true;
    };
}
