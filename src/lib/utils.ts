import { Vector2 } from "app/types/vector2";
import { Rectangle, Item, Trigger, MapPlayer } from "w3ts/index"
import { Log } from "./serilog/serilog";
import { Players } from "w3ts/globals/index";
import { SFX_BLOOD_1, SFX_BLOOD_2, SFX_BLOOD_3, SFX_BLOOD_4, SFX_BLOOD_5, SFX_BLOOD_6, SFX_BLOOD_7 } from "resources/sfx-paths";
import { Timers } from "app/timer-type";

export function GetActivePlayers() {
    return Players.filter(currentPlayer => {
            const isPlaying = currentPlayer.slotState == PLAYER_SLOT_STATE_PLAYING;
            const isUser = currentPlayer.controller == MAP_CONTROL_USER;
        
            if (isPlaying && isUser) {
                return true;
            }
    });
}

export function getRandomBlood() {
    const idx = GetRandomInt(1,7);
    if (idx === 1) return SFX_BLOOD_1;
    if (idx === 2) return SFX_BLOOD_2;
    if (idx === 3) return SFX_BLOOD_3;
    if (idx === 4) return SFX_BLOOD_4;
    if (idx === 5) return SFX_BLOOD_5;
    if (idx === 6) return SFX_BLOOD_6;
    return SFX_BLOOD_7;
}

export function CreateBlood(x: number, y: number) {
    
    const bloodSfx = AddSpecialEffect(getRandomBlood(), x, y);
    BlzSetSpecialEffectZ(bloodSfx, getZFromXY(x, y)+5);
    BlzSetSpecialEffectYaw(bloodSfx, GetRandomInt(0, 360));

    Timers.addSlowTimedAction(GetRandomInt(80, 300), () => {
        DestroyEffect(bloodSfx);
    });
}


/**
 * Should always be defined,
 * Used for measuring Z heights
 */
let TEMP_LOCATION = Location(0, 0);

export function getZFromXY(x: number, y: number): number {
    MoveLocation(TEMP_LOCATION, x, y);
    const z = GetLocationZ(TEMP_LOCATION);
    return z;

    // const cliffLevel = GetTerrainCliffLevel(x, y);

    // Log.Information("C: "+cliffLevel+"Z: "+z);
    // return (cliffLevel - 2) * 256;
}

/**
 * Returns a spread of vector2[] 
 * @param angleDegreeLeft 
 * @param angleDegreeRight 
 * @param distance 
 */
export function getPointsInRangeWithSpread(angleDegLeft: number, angleDegRight: number, numLocs: number, distance: number, centralModifier?: number): Vector2[] {
    const result = [];

    const endAngle = angleDegRight;
    let currentAngle = angleDegLeft;
    const incrementBy = (endAngle - currentAngle) / numLocs;
    
    while (currentAngle <= endAngle) {
        let distanceModifier: number = centralModifier ? 1 + Sin((result.length / numLocs) * bj_PI) * centralModifier : 1;

        result.push(
            new Vector2(0, 0).applyPolarOffset(currentAngle, distance * distanceModifier)
        );
        
        // Increment current angle
        currentAngle += incrementBy;
    }

    return result;
}

declare const udg_collision_rect: rect;
declare const udg_collision_item: item;

let collisionRect: Rectangle;
let collisionItem: Item;

export function terrainIsPathable(x: number, y: number) {
    if (!collisionRect) collisionRect = Rectangle.fromHandle(udg_collision_rect);
    if (!collisionItem) collisionItem = Item.fromHandle(udg_collision_item);
    if (IsTerrainPathable(x, y, PATHING_TYPE_WALKABILITY)) return false;

    collisionItem.visible = true;
    // move rect
    collisionRect.move(x, y);
    // Move item
    collisionItem.x = x;
    collisionItem.y = y;

    const hasItem = RectContainsItem(collisionItem.handle, collisionRect.handle)

    collisionItem.visible = false;

    return hasItem;
}

export function syncData(handle: string, listenFor: MapPlayer, taker: Function): Function {
    // Create and register listen
    const syncTrigger = new Trigger();
    syncTrigger.registerPlayerSyncEvent(listenFor, handle, false);
    syncTrigger.addAction(() => {
        const data = BlzGetTriggerSyncData();
        // Erase this trigger
        syncTrigger.destroy();
        // Return result
        taker(data);
    });

    return (self, toSend) => {
        // if (GetLocalPlayer() === listenFor.handle) {
            BlzSendSyncData(handle, toSend);
        // } 
    }
}


export function fastPointInterp(p1: Vector2, p2: Vector2, numInterps: number): Vector2[] {

    const p1x = p1.x;
    const p1y = p1.y;
    const p2x = p2.x;
    const p2y = p2.y;
    const dx = p2x - p1x;
    const dy = p2y - p1y;

    const results = [];

    for (let index = 0; index < numInterps; index++) {
        results[index] = new Vector2(p1x + dx * index/numInterps, p1y + dy * index/numInterps);
    }
    return results;
}

declare const udg_pathing_rect: rect;
let pathingRect: Rectangle;
const pathingBlockerGround =  FourCC('YTpb');
const pathingBlockerAir =  FourCC('YTab');
const pathingBlockerBoth =  FourCC('YTfb');

export function getAnyBlockers(minX: number, minY: number, maxX: number, maxY: number): destructable[] {
    if (!pathingRect) pathingRect = Rectangle.fromHandle(udg_pathing_rect);
    let result = [];
    // Move first
    pathingRect.setRect(minX-64, minY-64, maxX+64, maxY+64);
    EnumDestructablesInRectAll(pathingRect.handle, () => {
        const d = GetFilterDestructable();
        const id = GetDestructableTypeId(d);
        if (id === pathingBlockerBoth) result.push(d);
        else if (id === pathingBlockerGround) result.push(d);
        else if (id === pathingBlockerAir) result.push(d);
    });
    return result;
}

export function getGroundBlockers(minX: number, minY: number, maxX: number, maxY: number): destructable[] {
    if (!pathingRect) pathingRect = Rectangle.fromHandle(udg_pathing_rect);
    let result = [];
    // Move first
    pathingRect.setRect(minX-64, minY-64, maxX+64, maxY+64);
    EnumDestructablesInRectAll(pathingRect.handle, () => {
        const d = GetFilterDestructable();
        const id = GetDestructableTypeId(d);
        if (id === pathingBlockerBoth) result.push(d);
        else if (id === pathingBlockerGround) result.push(d);
    });
    return result;
}

export function getAirBlockers(minX: number, minY: number, maxX: number, maxY: number): destructable[] {
    if (!pathingRect) pathingRect = Rectangle.fromHandle(udg_pathing_rect);
    let result = [];
    // Move first
    pathingRect.setRect(minX-64, minY-64, maxX+64, maxY+64);
    EnumDestructablesInRectAll(pathingRect.handle, () => {
        const d = GetFilterDestructable();
        const id = GetDestructableTypeId(d);
        if (id === pathingBlockerBoth) result.push(d);
        else if (id === pathingBlockerAir) result.push(d);
    });
    return result;
}

export function normaliseAngle(angle: number) {
    let result = angle % 360;
    if (result < 0) result += 360;
    return result;
}

export function getDistanceBetweenTwoPoints(x1: number, y1: number, x2: number, y2: number) {
    return SquareRoot(Pow(x2 - x1, 2) + Pow(y2 - y1, 2));
}