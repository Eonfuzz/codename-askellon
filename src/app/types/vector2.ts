/** @noSelfInFile **/

export function vectorFromUnit(u: unit): Vector2 {
    return new Vector2(GetUnitX(u), GetUnitY(u));
}

export class Vector2 {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    getLength(): number {
        return Math.sqrt( this.x*this.x + this.y*this.y );
    }

    normalise(): Vector2 {
        let len = this.getLength();

        // Catch divide by 0 exception
        if (len == 0) {
            return new Vector2(0, 0);
        }
        return new Vector2(this.x / len, this.y / len);
    }

    /**
     * Returns a new Vector2 translated towards a polar offset by angle
     * @param offset 
     * @param angle 
     */
    applyPolarOffset(angle: number, offset: number) {
        const result = new Vector2(
            this.x + Cos(angle * bj_DEGTORAD) * offset,
            this.y + Sin(angle * bj_DEGTORAD) * offset
        );
        return result;
    }

    multiply(value: Vector2) : Vector2 {
        return new Vector2(this.x * value.x, this.y * value.y);
    }
    multiplyN(value: number) : Vector2 {
        return new Vector2(this.x * value, this.y * value);
    }

    add(value: Vector2) : Vector2 {
        return new Vector2(this.x + value.x, this.y + value.y);
    }
    addN(value: number) : Vector2 {
        return new Vector2(this.x + value, this.y + value);
    }

    subtract(value: Vector2) : Vector2 {
        return new Vector2(this.x - value.x, this.y - value.y);
    }
    subtractN(value: number) : Vector2 {
        return new Vector2(this.x - value, this.y - value);
    }

    /**
     * Sets the length to a value
     * @param value 
     */
    setLength(value: Vector2) : Vector2 {
        // Catch 0 exception
        if (this.getLength() == 0) {
            return new Vector2(0, 1).setLength(value);
        }

        return this.normalise().multiply(value);
    }
    /**
     * Sets the length to a value
     * @param value 
     */
    setLengthN(value: number) : Vector2 {
        // Catch 0 exception
        if (this.getLength() == 0) {
            return new Vector2(0, 1).setLengthN(value);
        }

        return this.normalise().multiplyN(value);
    }

    toString() : string {
        return "Vector2={x:"+this.x+", y:"+this.y+",len:"+this.getLength()+"}";
    }
}