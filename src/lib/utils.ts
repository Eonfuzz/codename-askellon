import { Vector2 } from "app/types/vector2";
import { Rectangle, Item, Trigger, MapPlayer } from "w3ts/index";
import { Log } from "./serilog/serilog";

/**
 * Should always be defined,
 * Used for measuring Z heights
 */
let TEMP_LOCATION = Location(0, 0);

export function getZFromXY(x: number, y: number): number {
    MoveLocation(TEMP_LOCATION, x, y);
    return GetLocationZ(TEMP_LOCATION)
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
        results.push(new Vector2(p1x + dx * index/numInterps, p1y + dy * index/numInterps))
    }
    return results;
}