/** @noSelfInFile **/
import { Vector2 } from "../../types/vector2";
import { ForceModule } from "../../force/force-module";
import { Game } from "../../game";


export abstract class SpaceObject {
    private position: Vector2;
    private loaded: boolean = false;

    constructor(location: Vector2) {
        this.position = location;
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
    protected load(game: Game): void { this.loaded = true; };
    protected offload(): void { this.loaded = false; };
    
    abstract pickle(): void;
    abstract onUpdate(): void;
}