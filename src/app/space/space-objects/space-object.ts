/** @noSelfInFile **/
import { Vector2 } from "../../types/vector2";
import { ForceModule } from "../../force/force-module";
import { Game } from "../../game";

export enum SpaceObjectType {
    foreground, midground, background
};

export abstract class SpaceObject {
    protected position: Vector2;
    protected type: SpaceObjectType;

    private loaded: boolean = false;

    constructor(location: Vector2, type: SpaceObjectType) {
        this.position = location;
        this.type = type;
    }

    public updateLocation(delta: Vector2): SpaceObject {
        this.position = this.position.subtract(delta);
        return this;
    }

    public getLocation() {
        return this.position;
    }


    public insideRect(minX: number, minY: number, maxX: number, maxY: number): boolean {
        const pos = this.position;
        return pos.x > minX && pos.x < maxX && pos.y > minY && pos.y < maxY;
    }

    protected isLoaded(): boolean { return this.loaded; }
    public load(game: Game): void { 
        if (this.type === SpaceObjectType.midground) {
            this.loadAsUnit(game);
        }
        else {
            this.loadAsEffect(game);
        }
        this.loaded = true; 
    };
    protected offload(): void { this.loaded = false; };

    // Used if type is background, foreground
    abstract loadAsEffect(game: Game): void;
    // Used it type is midground
    abstract loadAsUnit(game: Game): void;
    
    abstract pickle(): void;
    abstract onUpdate(): void;
}