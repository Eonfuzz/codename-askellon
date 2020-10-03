import { Unit } from "w3ts/index";

export abstract class CreepOrigin {
    protected duration: number | undefined;

    constructor(duration) { this.duration = duration; }

    public abstract x(): number;
    public abstract y(): number;
    public dur() { return this.duration; };
    public step(delta) { if (this.duration) this.duration -= delta; }
    public isValid() { return this.duration === undefined ? true : (this.duration > 0); }
}

export class CreepOriginUnit extends CreepOrigin {
    private unit: Unit;
    
    constructor(source: Unit, duration = undefined) { super(duration); this.unit = source; }
    x() { return this.unit.x; }
    y() { return this.unit.y; }
    public isValid() { return super.isValid() && this.unit.isAlive(); }
}

export class CreepOriginPoint extends CreepOrigin {
    private x_: number;
    private y_: number;

    constructor(x: number, y: number, duration = undefined) { super(duration); this.x_ = x; this.y_ = y;  }
    x() { return this.x_; }
    y() { return this.y_; }
}