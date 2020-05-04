/** @noSelfInFile **/
import { SpaceObject, SpaceObjectType } from "./space-object";
import { Vector2 } from "../../types/vector2";
import { ForceModule } from "../../force/force-module";
import { Game } from "../../game";
import { Log } from "lib/serilog/serilog";
import { Unit, Effect } from "w3ts/index";


export const ASTEROID_UNIT_ID = FourCC('h002');
export const ASTEROID_SKINS = [FourCC('Ast0'), FourCC('Ast1'), FourCC('Ast2'), FourCC('Ast3'), FourCC('Ast4')];
export const ASTEROID_SKIN_PATHS = [
    'asteroids\\var1.mdx',
    'asteroids\\var2.mdx',
    'asteroids\\var3.mdx',
    'asteroids\\var4.mdx',
    'asteroids\\var5.mdx',
];

export class Asteroid extends SpaceObject {

    private widget: Unit | Effect;

    constructor(locX: number, locY: number, type: SpaceObjectType) {
        super(new Vector2(locX, locY), type);
    }


    public loadAsUnit(game: Game) {

        const location = this.getLocation();

        this.widget = new Unit(game.forceModule.neutralPassive, ASTEROID_UNIT_ID, location.x, location.y, bj_UNIT_FACING) as Unit;
        const i = GetRandomInt(0, ASTEROID_SKINS.length-1);
        const skin = ASTEROID_SKINS[i];

        const scaleFactor = GetRandomReal(50, 300);
        BlzSetUnitSkin(this.widget.handle, skin);
        
        this.widget.setTimeScale(GetRandomReal(0.01, 0.1));
        SetUnitScalePercent(this.widget.handle, scaleFactor, scaleFactor, scaleFactor);
        BlzSetUnitFacingEx(this.widget.handle, GetRandomReal(0, 360));
    }

    public loadAsEffect(game: Game) {
        const loc = this.getLocation();

        const isBackground = this.type === SpaceObjectType.background;
        const depth = isBackground ? GetRandomReal(-450, -1200) : GetRandomReal(450, 700);

        const i = GetRandomInt(0, ASTEROID_SKIN_PATHS.length-1);
        const skin = ASTEROID_SKIN_PATHS[i];
        this.widget = new Effect(skin, loc.x, loc.y);

        this.widget.z = depth;
        if (isBackground) {
            const darkness = MathRound(255 - 255*(Math.abs(depth)/800));
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