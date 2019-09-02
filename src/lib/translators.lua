require("lualib_bundle");
local ____exports = {}
function ____exports.SendMessage(msg)
    DisplayTimedTextToForce(
        bj_FORCE_ALL_PLAYERS,
        10,
        tostring(msg)
    )
end
____exports.console = {}
local console = ____exports.console
console.name = "console"
console.__index = console
console.prototype = {}
console.prototype.__index = console.prototype
console.prototype.constructor = console
function console.new(...)
    local self = setmetatable({}, console.prototype)
    self:____constructor(...)
    return self
end
function console.prototype.____constructor(self)
end
function console.log(self, input)
    ____exports.SendMessage(input)
end
function ____exports.SendMessageUnlogged(msg)
    DisplayTimedTextToForce(
        bj_FORCE_ALL_PLAYERS,
        10,
        tostring(msg)
    )
end
function ____exports.PlayNewSoundOnUnit(self, soundPath, unit, volume)
    local result = CreateSound(soundPath, false, true, true, 10, 10, "")
    SetSoundDuration(
        result,
        GetSoundFileDuration(soundPath)
    )
    SetSoundChannel(result, 0)
    SetSoundVolume(result, volume)
    SetSoundPitch(result, 1)
    SetSoundDistances(result, 2000, 10000)
    SetSoundDistanceCutoff(result, 4500)
    AttachSoundToUnit(result, unit)
    StartSound(result)
    KillSoundWhenDone(result)
    return result
end
function ____exports.ToString(self, input)
    return tostring(input)
end
function ____exports.DecodeFourCC(self, fourcc)
    return string.char((fourcc >> 24) & 255, (fourcc >> 16) & 255, (fourcc >> 8) & 255, fourcc & 255)
end
____exports.Util = {}
local Util = ____exports.Util
Util.name = "Util"
Util.__index = Util
Util.prototype = {}
Util.prototype.__index = Util.prototype
Util.prototype.constructor = Util
function Util.new(...)
    local self = setmetatable({}, Util.prototype)
    self:____constructor(...)
    return self
end
function Util.prototype.____constructor(self)
end
function Util.isUnitCreep(self, u)
    local ownerID = GetPlayerId(
        GetOwningPlayer(u)
    )
    local ____TS_switch10 = ownerID
    if ____TS_switch10 == ____exports.COLOUR.NAVY then
        goto ____TS_switch10_case_0
    end
    if ____TS_switch10 == ____exports.COLOUR.TURQUOISE then
        goto ____TS_switch10_case_1
    end
    if ____TS_switch10 == ____exports.COLOUR.VOILET then
        goto ____TS_switch10_case_2
    end
    if ____TS_switch10 == ____exports.COLOUR.WHEAT then
        goto ____TS_switch10_case_3
    end
    goto ____TS_switch10_case_default
    ::____TS_switch10_case_0::
    ::____TS_switch10_case_1::
    ::____TS_switch10_case_2::
    ::____TS_switch10_case_3::
    do
        return true
    end
    ::____TS_switch10_case_default::
    do
        return false
    end
    ::____TS_switch10_end::
end
function Util.ColourString(self, colour, str)
    return "|cFF" .. tostring(colour) .. tostring(str) .. "|r"
end
function Util.RandomInt(self, min, max)
    return math.floor(
        math.random() * (max - min + 1)
    ) + min
end
function Util.ShuffleArray(self, arr)
    do
        local i = #arr - 1
        while i > 0 do
            local j = math.floor(
                math.random() * (i + 1)
            )
            local temp = arr[i + 1]
            arr[i + 1] = arr[j + 1]
            arr[j + 1] = temp
            i = i - 1
        end
    end
end
function Util.RandomHash(self, length)
    local result = ""
    local characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    local charactersLength = #characters
    do
        local i = 0
        while i < length do
            result = tostring(result) .. tostring(
                string.sub(
                    characters,
                    math.floor(
                        math.random() * charactersLength
                    ) + 1,
                    math.floor(
                        math.random() * charactersLength
                    ) + 1
                )
            )
            i = i + 1
        end
    end
    return result
end
function Util.GetRandomKey(self, collection)
    local index = math.floor(
        math.random() * collection.size
    )
    local cntr = 0
    for key in __TS__Iterator(
        collection:keys()
    ) do
        if (function()
            local ____TS_tmp = cntr
            cntr = ____TS_tmp + 1
            return ____TS_tmp
        end)() == index then
            return key
        end
    end
end
function Util.GetAllKeys(self, collection)
    local keys = {}
    for key in __TS__Iterator(
        collection:keys()
    ) do
        __TS__ArrayPush(keys, key)
    end
    return keys
end
function Util.ArraysToString(self, arr)
    local output = "["
    do
        local i = 0
        while i < #arr do
            do
                if i == #arr - 1 then
                    output = tostring(output) .. "\"" .. tostring(arr[i + 1]) .. "\""
                    goto __continue23
                end
                output = tostring(output) .. "\"" .. tostring(arr[i + 1]) .. "\", "
            end
            ::__continue23::
            i = i + 1
        end
    end
    output = tostring(output) .. "]"
    return output
end
function Util.ParseInt(self, str)
    return str
end
function Util.ParsePositiveInt(self, str)
    local int = __TS__Number(str)
    if int < 0 then
        return 0
    end
    return int
end
function Util.Round(self, x)
    return math.floor(x + 0.5 - (x + 0.5) % 1)
end
Util.COLOUR_IDS = {RED = 0, BLUE = 1, TEAL = 2, PURPLE = 3, YELLOW = 4, ORANGE = 5, GREEN = 6, PINK = 7, GRAY = 8, GREY = 8, LIGHT_BLUE = 9, LIGHTBLUE = 9, LB = 9, DARK_GREEN = 10, DARKGREEN = 10, DG = 10, BROWN = 11, MAROON = 12, NAVY = 13, TURQUOISE = 14, VOILET = 15, WHEAT = 16, PEACH = 17, MINT = 18, LAVENDER = 19, COAL = 20, SNOW = 21, EMERALD = 22, PEANUT = 23}
____exports.COLOUR = {}
____exports.COLOUR.RED = 0
____exports.COLOUR[0] = "RED"
____exports.COLOUR.BLUE = 1
____exports.COLOUR[1] = "BLUE"
____exports.COLOUR.TEAL = 2
____exports.COLOUR[2] = "TEAL"
____exports.COLOUR.PURPLE = 3
____exports.COLOUR[3] = "PURPLE"
____exports.COLOUR.YELLOW = 4
____exports.COLOUR[4] = "YELLOW"
____exports.COLOUR.ORANGE = 5
____exports.COLOUR[5] = "ORANGE"
____exports.COLOUR.GREEN = 6
____exports.COLOUR[6] = "GREEN"
____exports.COLOUR.PINK = 7
____exports.COLOUR[7] = "PINK"
____exports.COLOUR.GRAY = 8
____exports.COLOUR[8] = "GRAY"
____exports.COLOUR.LIGHT_BLUE = 9
____exports.COLOUR[9] = "LIGHT_BLUE"
____exports.COLOUR.DARK_GREEN = 10
____exports.COLOUR[10] = "DARK_GREEN"
____exports.COLOUR.BROWN = 11
____exports.COLOUR[11] = "BROWN"
____exports.COLOUR.MAROON = 12
____exports.COLOUR[12] = "MAROON"
____exports.COLOUR.NAVY = 13
____exports.COLOUR[13] = "NAVY"
____exports.COLOUR.TURQUOISE = 14
____exports.COLOUR[14] = "TURQUOISE"
____exports.COLOUR.VOILET = 15
____exports.COLOUR[15] = "VOILET"
____exports.COLOUR.WHEAT = 16
____exports.COLOUR[16] = "WHEAT"
____exports.COLOUR.PEACH = 17
____exports.COLOUR[17] = "PEACH"
____exports.COLOUR.MINT = 18
____exports.COLOUR[18] = "MINT"
____exports.COLOUR.LAVENDER = 19
____exports.COLOUR[19] = "LAVENDER"
____exports.COLOUR.COAL = 20
____exports.COLOUR[20] = "COAL"
____exports.COLOUR.SNOW = 21
____exports.COLOUR[21] = "SNOW"
____exports.COLOUR.EMERALD = 22
____exports.COLOUR[22] = "EMERALD"
____exports.COLOUR.PEANUT = 23
____exports.COLOUR[23] = "PEANUT"
____exports.CREEP_TYPE = {}
____exports.CREEP_TYPE.NORMAL = 0
____exports.CREEP_TYPE[0] = "NORMAL"
____exports.CREEP_TYPE.AIR = 1
____exports.CREEP_TYPE[1] = "AIR"
____exports.CREEP_TYPE.CHAMPION = 2
____exports.CREEP_TYPE[2] = "CHAMPION"
____exports.CREEP_TYPE.BOSS = 3
____exports.CREEP_TYPE[3] = "BOSS"
____exports.ARMOUR_TYPE = {}
____exports.ARMOUR_TYPE.UNARMOURED = 0
____exports.ARMOUR_TYPE[0] = "UNARMOURED"
____exports.ARMOUR_TYPE.LIGHT = 1
____exports.ARMOUR_TYPE[1] = "LIGHT"
____exports.ARMOUR_TYPE.MEDIUM = 2
____exports.ARMOUR_TYPE[2] = "MEDIUM"
____exports.ARMOUR_TYPE.HEAVY = 3
____exports.ARMOUR_TYPE[3] = "HEAVY"
____exports.ARMOUR_TYPE.FORTIFIED = 4
____exports.ARMOUR_TYPE[4] = "FORTIFIED"
____exports.ARMOUR_TYPE.HERO = 5
____exports.ARMOUR_TYPE[5] = "HERO"
return ____exports
