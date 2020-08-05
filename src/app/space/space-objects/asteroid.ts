import { SpaceObject, SpaceObjectType } from "./space-object";
import { Vector2 } from "../../types/vector2";
import { Unit, Effect } from "w3ts/index";
import { SPACE_UNIT_ASTEROID } from "resources/unit-ids";
import { PlayerStateFactory } from "app/force/player-state-entity";

export const ASTEROID_SKINS = [FourCC('Ast0'), FourCC('Ast1'), FourCC('Ast2'), FourCC('Ast3')];
export const ASTEROID_SKIN_PATHS = [
    'asteroids\\var1.mdx',
    'asteroids\\var2.mdx',
    'asteroids\\var3.mdx',
    'asteroids\\var4.mdx',
];

export class Asteroid extends SpaceObject {

    private widget: Unit | Effect;

    constructor(locX: number, locY: number, type: SpaceObjectType) {
        super(new Vector2(locX, locY), type);
    }


    public loadAsUnit() {

        const location = this.getLocation();

        this.widget = new Unit(PlayerStateFactory.NeutralPassive, SPACE_UNIT_ASTEROID, location.x, location.y, bj_UNIT_FACING) as Unit;
        const i = GetRandomInt(0, ASTEROID_SKINS.length-1);
        const skin = ASTEROID_SKINS[i];

        const scaleFactor = GetRandomReal(50, 300);
        BlzSetUnitSkin(this.widget.handle, skin);
        
        this.widget.setTimeScale(GetRandomReal(0.01, 0.1));
        SetUnitScalePercent(this.widget.handle, scaleFactor, scaleFactor, scaleFactor);
        this.widget.selectionScale = scaleFactor / 100;
        this.widget.maxLife = 50 + MathRound(80 * (scaleFactor / 100) * (scaleFactor / 100));
        this.widget.life = this.widget.maxLife;
        BlzSetUnitFacingEx(this.widget.handle, GetRandomReal(0, 360));
    }

    public loadAsEffect() {
        const loc = this.getLocation();

        const isBackground = this.type === SpaceObjectType.background;
        const depth = isBackground ? GetRandomReal(-600, -1350) : GetRandomReal(600, 900);

        const i = GetRandomInt(0, ASTEROID_SKIN_PATHS.length-1);
        const skin = ASTEROID_SKIN_PATHS[i];
        this.widget = new Effect(skin, loc.x, loc.y);

        this.widget.z = depth;
        if (isBackground) {
            let t = depth < 0 ? depth * -1 : depth;

            const darkness = MathRound(255 - 255*(t/800));
            this.widget.setColor(darkness, darkness, darkness);
        }
        const scaleFactor = GetRandomReal(0.5, 3);
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