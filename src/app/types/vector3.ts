import { Vector2 } from "./vector2";

/** @noSelfInFile **/

export class Vector3 {
    public x: number;
    public y: number;
    public z: number;

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    getLength(): number {
        return SquareRoot( this.x*this.x + this.y*this.y + this.z*this.z );
    }

    normalise(): Vector3 {
        let len = this.getLength();

        // Catch divide by 0 exception
        if (len == 0) {
            return new Vector3(0, 0, 0);
        }
        return new Vector3(this.x / len, this.y / len, this.z / len);
    }

    multiply(value: Vector3) : Vector3 {
        return new Vector3(this.x * value.x, this.y * value.y, this.z * value.z);
    }

    multiplyN(value: number) : Vector3 {
        return new Vector3(this.x * value, this.y * value, this.z * value);
    }

    add(value: Vector3) : Vector3 {
        return new Vector3(this.x + value.x, this.y + value.y, this.z + value.z);
    }

    addN(value: number) : Vector3 {
        return new Vector3(this.x + value, this.y + value, this.z + value);
    }

    subtract(value: Vector3) : Vector3 {
        return new Vector3(this.x - value.x, this.y - value.y, this.z - value.z);
    }

    subtractN(value: number) : Vector3 {
        return new Vector3(this.x - value, this.y - value, this.z - value);
    }

    /**
     * Sets the length to a value
     * @param value 
     */
    setLength(value: Vector3) : Vector3 {
        // Catch 0 exception
        if (this.getLength() == 0) {
            return new Vector3(0, 1, 0).setLength(value);
        }

        return this.normalise().multiply(value);
    }

    /**
     * Sets the length to a value
     * @param value 
     */
    setLengthN(value: number) : Vector3 {
        // Catch 0 exception
        if (this.getLength() == 0) {
            return new Vector3(0, 1, 0).setLengthN(value);
        }

        return this.normalise().multiplyN(value);
    }

    distanceToLine(lineStart: Vector3, lineEnd: Vector3) {
        let A = this.x - lineStart.x;
        let B = this.y - lineStart.y;
        let C = lineEnd.x - lineStart.x;
        let D = lineEnd.y - lineStart.y;

        let dot = A * C + B * D;
        let len_sq = C * C + D * D;
        let param = -1;
        if (len_sq != 0) //in case of 0 length line
            param = dot / len_sq;

        let xx, yy;

        if (param < 0) {
            xx = lineStart.x;
            yy = lineStart.y;
        } else if (param > 1) {
            xx = lineEnd.x;
            yy = lineEnd.y;
        } else {
            xx = lineStart.x + param * C;
            yy = lineStart.y + param * D;
        }

        let dx = this.x - xx;
        let dy = this.y - yy;
        return SquareRoot(dx * dx + dy * dy);
    }

    /**
     * 
     * @param angle Degrees
     * @param offset 
     */
    projectTowards2D(angle: number, offset: number) {
        const result = new Vector3(this.x, this.y, this.z);
        result.x = result.x + offset * Cos(angle * bj_DEGTORAD);
        result.y = result.y + offset * Sin(angle * bj_DEGTORAD);
        return result;
    }

    /**
     * 
     * @param unit 
     */
    projectTowardsGunModel(unit: unit) {
        const r = this.projectTowards2D(GetUnitFacing(unit) - 20, 35);
        r.z += 60;
        return r;
    }

    toString() : string {
        return `Vector3=x:${this.x}, y:${this.y},z:${this.z},len:${this.getLength()}`;
    }

    to2D(): Vector2 {
        return new Vector2(this.x, this.y);
    }

    angle2Dto(where: Vector3 | Vector2) {
        return Rad2Deg(Atan2(where.y-this.y, where.x-this.x));
    }

    dot(v: Vector3 | Vector2): number {
        return this.x*v.x + this.y*v.y;
    }
}
