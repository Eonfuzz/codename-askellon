import { SpaceObject, SpaceObjectType } from "./space-object";
import { Vector2 } from "../../types/vector2";
import { Unit, Effect } from "w3ts/index";
import { SPACE_UNIT_MINERAL } from "resources/unit-ids";
import { PlayerStateFactory } from "app/force/player-state-entity";


export const MINERAL_SKINS = [FourCC('Min1'), FourCC('Min2')];
export const MINERAL_SKIN_PATHS = [
    'Sc2\\Doodads\\mineral cluster 01.mdx',
    'Sc2\\Doodads\\mineral cluster 03.mdx',
];

export class Mineral extends SpaceObject {

    private widget: Unit | Effect;

    constructor(locX: number, locY: number, type: SpaceObjectType) {
        super(new Vector2(locX, locY), type);
    }


    public loadAsUnit() {

        const location = this.getLocation();

        this.widget = new Unit(PlayerStateFactory.NeutralPassive, SPACE_UNIT_MINERAL, location.x, location.y, bj_UNIT_FACING) as Unit;
        const i = GetRandomInt(0, MINERAL_SKINS.length-1);
        const skin = MINERAL_SKINS[i];

        const scaleFactor = GetRandomReal(50, 150);
        BlzSetUnitSkin(this.widget.handle, skin);
        
        this.widget.setTimeScale(GetRandomReal(0.01, 0.1));
        SetUnitScalePercent(this.widget.handle, scaleFactor, scaleFactor, scaleFactor);
        this.widget.selectionScale = scaleFactor / 100;
        this.widget.paused = true;
        this.widget.maxLife = 2000 + MathRound(2500 * (scaleFactor / 100) * (scaleFactor / 100));
        this.widget.life = this.widget.maxLife;
        BlzSetUnitFacingEx(this.widget.handle, GetRandomReal(0, 360));
    }

    public loadAsEffect() {
        const loc = this.getLocation();

        const isBackground = this.type === SpaceObjectType.background;
        const depth = isBackground ? GetRandomReal(-450, -1200) : GetRandomReal(450, 700);

        const i = GetRandomInt(0, MINERAL_SKIN_PATHS.length-1);
        const skin = MINERAL_SKIN_PATHS[i];
        this.widget = new Effect(skin, loc.x, loc.y);

        this.widget.z = depth;
        if (isBackground) {
            let t = depth < 0 ? depth * -1 : depth;

            const darkness = MathRound(255 - 255*(t/800));
            this.widget.setColor(darkness, darkness, darkness);
        }
        const scaleFactor = GetRandomReal(0.2, 1);
        this.widget.scale = scaleFactor;
        this.widget.setYaw(GetRandomInt(0, 360));
        this.widget.setTimeScale(GetRandomReal(0.01, 0.1));
    }

    public onUpdate() {
        const loc = this.getLocation();
        this.widget.x = loc.x;
        this.widget.y = loc.y;
    }

    public offload() {
        super.offload();
        
        this.widget.destroy();
    }
    
    public pickle() {}
}