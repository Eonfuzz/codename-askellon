import {PressType} from "./PressType";
import { Vector2 } from "app/types/vector2";

export class MouseCallback {
    public callback: (this: void, key: MouseCallback) => void;
    public button: mousebuttontype;
    public enabled: boolean = true;
    public pressType: PressType;
    public triggeringPlayer: player | undefined;
    public position: Vector2 | undefined;

    constructor(button: mousebuttontype, callback: (key: MouseCallback) => void, pressType: PressType) {
        this.button = button;
        this.callback = callback;
        this.pressType = pressType;
    }
}