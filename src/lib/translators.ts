import { Vector3 } from "../app/types/vector3";
import { Unit } from "w3ts/handles/unit";
import { getZFromXY } from "./utils";
import { Players } from "w3ts/globals/index";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { PRIVS } from "app/force/player-type";

export class console {
    public static log(input: string): void {
        SendMessage(input);
    }
}

export function getYawPitchRollFromVector(vector: Vector3): {yaw: number, pitch: number, roll: number} {
    return {
        yaw: Atan2(vector.y, vector.x),
        pitch: Asin(vector.z),
        roll: 0 // TODO
    };
}

export function staticDecorator<T>() {
    return (constructor: T) => {};
}

export function SendMessage(this: void, msg: any): void {
    DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 10, `${msg}`);
}

export function SendMessageUnlogged(this: void, msg: any): void {
    DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 10, `${msg}`);
}

export function SendMessageToAdmin(this: void, msg: any): void {
    Players.forEach(p => {
        const _p = PlayerStateFactory.get(p);
        if (_p && _p.getUserPrivs() >+ PRIVS.MODERATOR) 
            DisplayTimedTextToPlayer(p.handle, 0, 0, 10, `${msg}`);
    });
}


export function PlayNewSound(soundPath: string, volume: number) {
    const result = CreateSound(soundPath, false, false, true, 10, 10, "" )
    SetSoundDuration(result, GetSoundFileDuration(soundPath));
    SetSoundChannel(result, 0);
    SetSoundVolume(result, volume);
    SetSoundPitch(result, 1.0);
    StartSound(result);
    KillSoundWhenDone(result);
    return result;
}

export function PlayNewSoundOnUnit(soundPath: string, unit: Unit, volume: number): sound {
    const result = CreateSound(soundPath, false, true, true, 10, 10, "" );
    SetSoundDuration(result, GetSoundFileDuration(soundPath));
    SetSoundChannel(result, 0);
    SetSoundVolume(result, volume);
    SetSoundPitch(result, 1.0);
    SetSoundDistances(result, 2000.0, 5000.0);
    SetSoundDistanceCutoff(result, 4500.0);
    // AttachSoundToUnit(result, unit.handle);

    const loc = Location(unit.x, unit.y);
    PlaySoundAtPointBJ(result, volume, loc, getZFromXY(unit.x, unit.y));
    RemoveLocation(loc);
    
    // StartSound(result);
    KillSoundWhenDone(result);

    return result;
}

export function PlayNewSoundAt(soundPath: string, x: number, y: number, volume: number): sound {
    const result = CreateSound(soundPath, false, true, true, 10, 10, "" );
    SetSoundDuration(result, GetSoundFileDuration(soundPath));
    SetSoundChannel(result, 0);
    SetSoundVolume(result, volume);
    SetSoundPitch(result, 1.0);
    SetSoundDistances(result, 2000.0, 5000.0);
    SetSoundDistanceCutoff(result, 4500.0);
    // AttachSoundToUnit(result, unit.handle);

    const loc = Location(x, y);
    PlaySoundAtPointBJ(result, volume, loc, getZFromXY(x, y));
    RemoveLocation(loc);
    
    // StartSound(result);
    KillSoundWhenDone(result);

    return result;
}
export interface ColourToIndex {
    [key: string]: number;
}

export function ToString(input: any): string {
    return `${input}`;
}

export function DecodeFourCC(fourcc: number): string {
    // tslint:disable-next-line:no-bitwise
    return string.char((fourcc >>> 24) & 255, (fourcc >>> 16) & 255, (fourcc >>> 8) & 255, (fourcc) & 255);
}

export class Util {

    public static COLOUR_IDS: ColourToIndex = {
        RED: 0,
        BLUE: 1,
        TEAL: 2,
        PURPLE: 3,
        YELLOW: 4,
        ORANGE: 5,
        GREEN: 6,
        PINK: 7,
        GRAY: 8,
        GREY: 8,
        LIGHT_BLUE: 9,
        LIGHTBLUE: 9,
        LB: 9,
        DARK_GREEN: 10,
        DARKGREEN: 10,
        DG: 10,
        BROWN: 11,
        MAROON: 12,
        NAVY: 13,
        TURQUOISE: 14,
        VOILET: 15,
        WHEAT: 16,
        PEACH: 17,
        MINT: 18,
        LAVENDER: 19,
        COAL: 20,
        SNOW: 21,
        EMERALD: 22,
        PEANUT: 23,
    };

    public static ColourString(colour: string, str: string): string {
        return `|cFF${colour}${str}|r`;
    }

    // public static RandomInt(min: number, max: number): number {
    //     return Math.floor(Math.random() * (max - min + 1)) + min;
    // }

    public static ShuffleArray(arr: any[]): void {
        for (let i: number = arr.length - 1; i > 0; i--) {
            const j: number = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
            // [arr[i], arr[j]] = [arr[j], arr[i]]; // swap elements

            const temp: any = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }


    public static RandomHash(length: number): string {
        let result: string = '';
        const characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength: number = characters.length;
        for (let i: number = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }


    public static GetRandomKey(collection: Map<any, any>): any {
        const index: number = Math.floor(Math.random() * collection.size);
        let cntr: number = 0;
        for (const key of collection.keys()) {
            if (cntr++ === index) {
                return key;
            }
        }
    }

    public static GetAllKeys(collection: Map<any, any>): any[] {
        const keys: any[] = [];
        for (const key of collection.keys()) {
            keys.push(key);
        }
        return keys;
    }

    public static ArraysToString(arr: any[]): string {
        let output: string = '[';
        for (let i: number = 0; i < arr.length; i++) {
            if (i === arr.length - 1) {
                output += `"${arr[i]}"`;
                continue;
            }
            output += `"${arr[i]}", `;
        }
        output += ']';
        return output;
    }

    public static ParseInt(str: string): number {
        return +str;
    }

    public static ParsePositiveInt(str: string): number {
        const int: number = Number(str);
        if (int < 0) {
            return 0;
        }
        return int;
    }

    public static Round(x: number): number {
        return Math.floor(x + 0.5 - (x + 0.5) % 1);
    }
}

export enum CREEP_TYPE {
    NORMAL,
    AIR,
    CHAMPION,
    BOSS,
}

export enum ARMOUR_TYPE {
    UNARMOURED,
    LIGHT,
    MEDIUM,
    HEAVY,
    FORTIFIED,
    HERO,

}