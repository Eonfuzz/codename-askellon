import {MouseInputContainer} from "./MouseInputContainer";
import {PressType} from "./PressType";
import {MouseCallback} from "./MouseCallback";
import { Vector2 } from "app/types/vector2";
import { Log } from "lib/serilog/serilog";
import { Quick } from "lib/Quick";
export class InputManagerMouseHandler {

    constructor() {
        TriggerAddAction(this.mouseInputPressTrigger, () => this.onMousePressAction());
        TriggerAddAction(this.mouseInputReleaseTrigger, () => this.onMouseReleaseAction());
        for (let i = 0; i < PLAYER_NEUTRAL_AGGRESSIVE; i++) {
            TriggerRegisterPlayerEvent(this.mouseInputPressTrigger, Player(i), EVENT_PLAYER_MOUSE_DOWN);
            TriggerRegisterPlayerEvent(this.mouseInputReleaseTrigger, Player(i), EVENT_PLAYER_MOUSE_UP);
            TriggerRegisterPlayerEvent(this.mouseInputReleaseTrigger, Player(i), EVENT_PLAYER_MOUSE_MOVE);
        }
        TriggerAddAction(this.mouseMoveTrigger, () => this.onMouseMoveAction());
    }

    private mouseInputPressTrigger: trigger = CreateTrigger();
    private mouseInputReleaseTrigger: trigger = CreateTrigger();
    private mouseMoveTrigger: trigger = CreateTrigger();
    public registeredMouseEvents: MouseInputContainer[] = [];
    public lastPosition: Vector2[] = [];
    public lastCoordinate: Vector2[] = [];

    private onMousePressAction() {
        let mouseButton = BlzGetTriggerPlayerMouseButton();
        let x = BlzGetTriggerPlayerMouseX();
        let y = BlzGetTriggerPlayerMouseY();
        this.onMouseMoveAction();
        let mouseContainer = this.getMouseContainer(mouseButton);
        mouseContainer.isDown = true;
        for (let index = 0; index < mouseContainer.callbacks.length; index += 1) {
            let callback = mouseContainer.callbacks[index];
            if (callback.enabled) {
                if (callback.pressType == PressType.PRESS) {
                    callback.triggeringPlayer = GetTriggerPlayer();
                    callback.position = new Vector2(x, y);
                    xpcall(() => {
                        callback.callback(callback);
                    }, Log.Error);
                }
            }
        }
    }

    private onMouseReleaseAction() {
        let mouseButton = BlzGetTriggerPlayerMouseButton();
        let x = BlzGetTriggerPlayerMouseX();
        let y = BlzGetTriggerPlayerMouseY();
        this.onMouseMoveAction();
        let mouseContainer = this.getMouseContainer(mouseButton);
        mouseContainer.isDown = false;
        for (let index = 0; index < mouseContainer.callbacks.length; index += 1) {
            let callback = mouseContainer.callbacks[index];
            if (callback.enabled) {
                if (callback.pressType == PressType.RELEASE) {
                    callback.triggeringPlayer = GetTriggerPlayer();
                    callback.position = new Vector2(x, y);
                    callback.callback(callback);
                }
            }
        }
    }

    private onMouseMoveAction() {
        let x = BlzGetTriggerPlayerMouseX();
        let y = BlzGetTriggerPlayerMouseY();
        this.lastPosition[GetPlayerId(GetTriggerPlayer())] = new Vector2(x, y);
        if (x != 0 && y != 0) {
            this.lastCoordinate[GetPlayerId(GetTriggerPlayer())] = new Vector2(x, y);
        }
    }

    public removeMouseCallback(mouseCallback: MouseCallback) {
        let container = this.getMouseContainer(mouseCallback.button);
        if (container.callbacks.indexOf(mouseCallback) >= 0) {
            Quick.Slice(container.callbacks, container.callbacks.indexOf(mouseCallback));
        }
    }

    public getMouseContainer(mouse: mousebuttontype) {
        let handleId = GetHandleId(mouse);
        if (this.registeredMouseEvents[handleId] == null) {
            let newKey = new MouseInputContainer(mouse);
            this.registeredMouseEvents[handleId] = newKey;
            return newKey;
        } else {
            return this.registeredMouseEvents[handleId];
        }
    }

    public isMouseButtonHeld(button: mousebuttontype) {
        return this.getMouseContainer(button).isDown;
    }

    public addMousePressCallback(mouse: mousebuttontype, callback: (key: MouseCallback) => void) {
        let container = this.getMouseContainer(mouse);
        container.callbacks.push(new MouseCallback(mouse, callback, PressType.PRESS));
        return container;
    }

    public addMouseReleaseCallback(mouse: mousebuttontype, callback: (key: MouseCallback) => void) {
        let container = this.getMouseContainer(mouse);
        container.callbacks.push(new MouseCallback(mouse, callback, PressType.RELEASE));
        return container;
    }

    public getLastMousePosition(triggerPlayer: player) {
        return this.lastPosition[GetPlayerId(triggerPlayer)] || new Vector2(0, 0);
    }

    public getLastMouseCoordinate(triggerPlayer: player) {
        return this.lastCoordinate[GetPlayerId(triggerPlayer)] || new Vector2(0, 0);
    }
}