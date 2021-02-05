//!!!!! KEEP 0 DEPENDENCIES
export namespace Quick {


    export function Tokenize(val: string) {
        const result = [];
        const str = string.gmatch(val, "%S+");

        for (const [x, y, z] of str) {
            result.push(x);
        }
        return result;
    }

    export function ReplaceVowelWith(str: string, fnc: (char: string) => string) {
        let result = '';
        for (let index = 0; index < str.length-1; index++) {
            const c = str[index].toLowerCase();
            if (c === "a" || c === "e" || c === "o" || c === "i" || c === "y" || c === "u") {
                if (str[index] === c) {
                    result += fnc(c);
                }
                else {
                    result += fnc(c).toUpperCase();
                }
            }
            else {
                result += str[index];
            }
        }
        return result;
    }

    export function Slice(arr: any[], index: number) {
        arr[index] = arr[arr.length - 1];
        delete arr[arr.length - 1];
    }

    export function Push<T>(arr: T[], value: T) {
        arr[arr.length] = value;
    }

    export function Clear<T>(arr: T[]) {
        const count = arr.length;
        for (let i = 0; i < count; i++) {
            delete arr[i];
        }
    }

    export function GroupToUnitArray(g: group): unit[] {
        let units = [];
        let val = FirstOfGroup(g);
        while (val != null) {
            Push(units, val);
            GroupRemoveUnit(g, val);
            val = FirstOfGroup(g);
        }

        return units;
    }

    export function GroupToUnitArrayDestroy(g: group): unit[] {
        let units = GroupToUnitArray(g);
        DestroyGroup(g);
        return units;
    }

    export function UnitArrayToGroup(g: unit[]): group {
        let units = CreateGroup();
        for (let i = 0; i < g.length; i++) {
            GroupAddUnit(units, g[i]);
        }

        return units;
    }

    export function GetRandomFromArray<T>(a: T[], howMany: number = 1): T[] {
        if (!a || a.length === 0) return a;
        
        let n = Math.min(a.length, howMany);

        const result = a.slice();

        for (let index = 0; index < result.length; index++) {
            let j = GetRandomInt(0, index);
            let a = result[index];
            let b = result[j];

            result[index] = b;
            result[j] = a;
        }

        return result.slice(0, n);
    }

    
    export function Clamp(value: number, min: number, max: number) {
        if (value > max) {
            value = max;
        } else if (value < min) {
            value = min;
        }
        return value;
    }


    export function isBlank(s: string) {
        return ("\n ".indexOf(s) >= 0);
    }

    export function UnpackStringNewlines(value: string) {
        let allLines: string[] = [];
        let currentLine = "";
        let previousChar = "";
        let skipToRealChar = true;
        for (let i = 0; i < value.length; i++) {
            let currentChar = value.charAt(i);
            if (isBlank(currentChar) && previousChar == "\n") {
                skipToRealChar = true;
                continue;
            }
            if (currentChar == "\n" && !skipToRealChar) {
                allLines.push(currentLine);
                currentLine = "";
            } else {
                currentLine += currentChar;
                skipToRealChar = false;
            }

            previousChar = currentChar;
        }
        if (currentLine.length > 0) allLines.push(currentLine);

        return allLines;
    }
}