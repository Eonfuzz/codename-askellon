import { AbilityWithDone } from "../ability-type";
import { Unit } from "w3ts/handles/unit";
import { SoundRef } from "app/types/sound-ref";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { Minigun } from "app/weapons/guns/minigun";

const FullerAutoSounds = [ 
    new SoundRef("Sounds\\minigun_fullerauto_1.mp3", false), 
    new SoundRef("Sounds\\minigun_fullerauto_2.mp3", false) 
];

export class MinigunFullerAutoAbility extends AbilityWithDone {

    private unit: Unit | undefined;
    private wep: Minigun;

    private duration = 5;

    

    public init() {
        super.init();
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

    public step(delta: number) {
        this.duration -= delta;
        if (this.duration <= 0) this.done = true;
    };

    public destroy() {
        this.wep.fullerAutoActive = false;
        return true;
    };
}
