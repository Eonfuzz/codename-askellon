import { AbilityWithDone } from "../ability-type";
import { Unit } from "w3ts/handles/unit";
import { SoundRef } from "app/types/sound-ref";
import { SOUND_STR_SYNTH_HEAL } from "resources/sounds";
import { SFX_HEAL } from "resources/sfx-paths";
import { getZFromXY } from "lib/utils";

export class InstantHealAbility extends AbilityWithDone {

    private unit: Unit;
    private sound = new SoundRef(SOUND_STR_SYNTH_HEAL, false, false);
    
    private timeElapsed = 0;
    private healOver = 0.6;
    private healPercent = 0.33;

    private sfx: effect;

    

    public init() {
        super.init();
        this.unit = Unit.fromHandle(GetTriggerUnit());
        this.sound.playSoundOnUnit(this.unit.handle, 137);
        this.unit.setVertexColor(0, 255, 0, 255);
        
        this.sfx = AddSpecialEffect(SFX_HEAL, this.unit.x, this.unit.y);
        BlzSetSpecialEffectZ(this.sfx, getZFromXY(this.unit.x, this.unit.y) + 20);

        return true;
    };

    public step(delta: number) {
        this.timeElapsed += delta;
        this.unit.life += delta / this.healOver * this.unit.maxLife * this.healPercent;

        BlzSetSpecialEffectX( this.sfx, this.unit.x );
        BlzSetSpecialEffectY( this.sfx, this.unit.y );
        BlzSetSpecialEffectZ( this.sfx, getZFromXY(this.unit.x, this.unit.y) + 20 );

        if (this.timeElapsed >= this.healOver) this.done = true;
    };

    public destroy() {
        this.unit.setVertexColor(255, 255, 255, 255);
        DestroyEffect(this.sfx);
        this.sound.destroy();
        return true;
    };
}