
local ____modules = {}
local ____moduleCache = {}
local ____originalRequire = require
local function require(file)
    if ____moduleCache[file] then
        return ____moduleCache[file]
    end
    if ____modules[file] then
        ____moduleCache[file] = ____modules[file]()
        return ____moduleCache[file]
    else
        if ____originalRequire then
            return ____originalRequire(file)
        else
            error("module '" .. file .. "' not found")
        end
    end
end
____modules = {
["src.app.types.vector2"] = function() require("lualib_bundle");
local ____exports = {}
function ____exports.vectorFromUnit(u)
    return __TS__New(
        ____exports.Vector2,
        GetUnitX(u),
        GetUnitY(u)
    )
end
____exports.Vector2 = __TS__Class()
local Vector2 = ____exports.Vector2
Vector2.name = "Vector2"
function Vector2.prototype.____constructor(self, x, y)
    self.x = x
    self.y = y
end
function Vector2.prototype.getLength(self)
    return math.sqrt(self.x * self.x + self.y * self.y)
end
function Vector2.prototype.normalise(self)
    local len = self:getLength()
    if len == 0 then
        return __TS__New(____exports.Vector2, 0, 0)
    end
    return __TS__New(____exports.Vector2, self.x / len, self.y / len)
end
function Vector2.prototype.applyPolarOffset(self, angle, offset)
    local result = __TS__New(
        ____exports.Vector2,
        self.x + Cos(angle * bj_DEGTORAD) * offset,
        self.y + Sin(angle * bj_DEGTORAD) * offset
    )
    return result
end
function Vector2.prototype.multiply(self, value)
    return __TS__New(____exports.Vector2, self.x * value.x, self.y * value.y)
end
function Vector2.prototype.multiplyN(self, value)
    return __TS__New(____exports.Vector2, self.x * value, self.y * value)
end
function Vector2.prototype.add(self, value)
    return __TS__New(____exports.Vector2, self.x + value.x, self.y + value.y)
end
function Vector2.prototype.addN(self, value)
    return __TS__New(____exports.Vector2, self.x + value, self.y + value)
end
function Vector2.prototype.subtract(self, value)
    return __TS__New(____exports.Vector2, self.x - value.x, self.y - value.y)
end
function Vector2.prototype.subtractN(self, value)
    return __TS__New(____exports.Vector2, self.x - value, self.y - value)
end
function Vector2.prototype.setLength(self, value)
    if self:getLength() == 0 then
        return __TS__New(____exports.Vector2, 0, 1):setLength(value)
    end
    return self:normalise():multiply(value)
end
function Vector2.prototype.setLengthN(self, value)
    if self:getLength() == 0 then
        return __TS__New(____exports.Vector2, 0, 1):setLengthN(value)
    end
    return self:normalise():multiplyN(value)
end
function Vector2.prototype.__tostring(self)
    return "Vector2={x:" .. tostring(self.x) .. ", y:" .. tostring(self.y) .. ",len:" .. tostring(
        self:getLength()
    ) .. "}"
end
return ____exports
end,
["src.app.types.vector3"] = function() require("lualib_bundle");
local ____exports = {}
local ____vector2 = require("src.app.types.vector2")
local Vector2 = ____vector2.Vector2
____exports.Vector3 = __TS__Class()
local Vector3 = ____exports.Vector3
Vector3.name = "Vector3"
function Vector3.prototype.____constructor(self, x, y, z)
    self.x = x
    self.y = y
    self.z = z
end
function Vector3.prototype.getLength(self)
    return math.sqrt(self.x * self.x + self.y * self.y + self.z * self.z)
end
function Vector3.prototype.normalise(self)
    local len = self:getLength()
    if len == 0 then
        return __TS__New(____exports.Vector3, 0, 0, 0)
    end
    return __TS__New(____exports.Vector3, self.x / len, self.y / len, self.z / len)
end
function Vector3.prototype.multiply(self, value)
    return __TS__New(____exports.Vector3, self.x * value.x, self.y * value.y, self.z * value.z)
end
function Vector3.prototype.multiplyN(self, value)
    return __TS__New(____exports.Vector3, self.x * value, self.y * value, self.z * value)
end
function Vector3.prototype.add(self, value)
    return __TS__New(____exports.Vector3, self.x + value.x, self.y + value.y, self.z + value.z)
end
function Vector3.prototype.addN(self, value)
    return __TS__New(____exports.Vector3, self.x + value, self.y + value, self.z + value)
end
function Vector3.prototype.subtract(self, value)
    return __TS__New(____exports.Vector3, self.x - value.x, self.y - value.y, self.z - value.z)
end
function Vector3.prototype.subtractN(self, value)
    return __TS__New(____exports.Vector3, self.x - value, self.y - value, self.z - value)
end
function Vector3.prototype.setLength(self, value)
    if self:getLength() == 0 then
        return __TS__New(____exports.Vector3, 0, 1, 0):setLength(value)
    end
    return self:normalise():multiply(value)
end
function Vector3.prototype.setLengthN(self, value)
    if self:getLength() == 0 then
        return __TS__New(____exports.Vector3, 0, 1, 0):setLengthN(value)
    end
    return self:normalise():multiplyN(value)
end
function Vector3.prototype.distanceToLine(self, lineStart, lineEnd)
    local A = self.x - lineStart.x
    local B = self.y - lineStart.y
    local C = lineEnd.x - lineStart.x
    local D = lineEnd.y - lineStart.y
    local dot = A * C + B * D
    local len_sq = C * C + D * D
    local param = -1
    if len_sq ~= 0 then
        param = dot / len_sq
    end
    local xx
    local yy
    if param < 0 then
        xx = lineStart.x
        yy = lineStart.y
    elseif param > 1 then
        xx = lineEnd.x
        yy = lineEnd.y
    else
        xx = lineStart.x + param * C
        yy = lineStart.y + param * D
    end
    local dx = self.x - xx
    local dy = self.y - yy
    return math.sqrt(dx * dx + dy * dy)
end
function Vector3.prototype.projectTowards2D(self, angle, offset)
    local result = __TS__New(____exports.Vector3, self.x, self.y, self.z)
    result.x = result.x + offset * Cos(angle)
    result.y = result.y + offset * Sin(angle)
    return result
end
function Vector3.prototype.__tostring(self)
    return "Vector3=x:" .. tostring(self.x) .. ", y:" .. tostring(self.y) .. ",z:" .. tostring(self.z) .. ",len:" .. tostring(
        self:getLength()
    )
end
function Vector3.prototype.to2D(self)
    return __TS__New(Vector2, self.x, self.y)
end
return ____exports
end,
["src.lib.serilog.serilog"] = function() require("lualib_bundle");
local ____exports = {}
____exports.LogLevel = {}
____exports.LogLevel.None = -1
____exports.LogLevel[____exports.LogLevel.None] = "None"
____exports.LogLevel.Message = 0
____exports.LogLevel[____exports.LogLevel.Message] = "Message"
____exports.LogLevel.Verbose = 1
____exports.LogLevel[____exports.LogLevel.Verbose] = "Verbose"
____exports.LogLevel.Event = 2
____exports.LogLevel[____exports.LogLevel.Event] = "Event"
____exports.LogLevel.Debug = 3
____exports.LogLevel[____exports.LogLevel.Debug] = "Debug"
____exports.LogLevel.Information = 4
____exports.LogLevel[____exports.LogLevel.Information] = "Information"
____exports.LogLevel.Warning = 5
____exports.LogLevel[____exports.LogLevel.Warning] = "Warning"
____exports.LogLevel.Error = 6
____exports.LogLevel[____exports.LogLevel.Error] = "Error"
____exports.LogLevel.Fatal = 7
____exports.LogLevel[____exports.LogLevel.Fatal] = "Fatal"
____exports.LogEventType = {}
____exports.LogEventType.Text = 0
____exports.LogEventType[____exports.LogEventType.Text] = "Text"
____exports.LogEventType.Parameter = 1
____exports.LogEventType[____exports.LogEventType.Parameter] = "Parameter"
____exports.LogEvent = __TS__Class()
local LogEvent = ____exports.LogEvent
LogEvent.name = "LogEvent"
function LogEvent.prototype.____constructor(self, Type, Text, Value)
    self.Type = Type
    self.Text = Text
    self.Value = Value
end
____exports.Log = {}
local Log = ____exports.Log
do
    local _sinks
    function Log.Init(sinks)
        _sinks = sinks
    end
    local function Parse(message, ...)
        local args = ({...})
        local logEvents = {}
        local matcher = string.gmatch(message, "{.-}")
        local match
        local text
        local n = 0
        local i = 0
        while (function()
            match = matcher(nil)
            return match
        end)() do
            do
                local s, e = string.find(message, match, 1, true)
                if not s or not e then
                    goto __continue6
                end
                text = string.sub(message, i + 1, s - 1)
                if text ~= "" then
                    __TS__ArrayPush(
                        logEvents,
                        __TS__New(____exports.LogEvent, ____exports.LogEventType.Text, text, nil)
                    )
                end
                __TS__ArrayPush(
                    logEvents,
                    __TS__New(____exports.LogEvent, ____exports.LogEventType.Parameter, match, args[n + 1])
                )
                i = e
                n = n + 1
            end
            ::__continue6::
        end
        text = string.sub(message, i + 1)
        if text ~= "" then
            __TS__ArrayPush(
                logEvents,
                __TS__New(____exports.LogEvent, ____exports.LogEventType.Text, text, nil)
            )
        end
        return logEvents
    end
    function Log.Log(level, message, ...)
        local args = ({...})
        local logEvents = Parse(
            message,
            table.unpack(args)
        )
        do
            local index = 0
            while index < #_sinks do
                if _sinks[index + 1]:LogLevel() <= level then
                    _sinks[index + 1]:Log(level, logEvents)
                end
                index = index + 1
            end
        end
    end
    function Log.Fatal(message, ...)
        local args = ({...})
        Log.Log(
            ____exports.LogLevel.Fatal,
            message,
            table.unpack(args)
        )
    end
    function Log.Error(message, ...)
        local args = ({...})
        Log.Log(
            ____exports.LogLevel.Error,
            message,
            table.unpack(args)
        )
    end
    function Log.Warning(message, ...)
        local args = ({...})
        Log.Log(
            ____exports.LogLevel.Warning,
            message,
            table.unpack(args)
        )
    end
    function Log.Information(message, ...)
        local args = ({...})
        Log.Log(
            ____exports.LogLevel.Information,
            message,
            table.unpack(args)
        )
    end
    function Log.Debug(message, ...)
        local args = ({...})
        Log.Log(
            ____exports.LogLevel.Debug,
            message,
            table.unpack(args)
        )
    end
    function Log.Message(message, ...)
        local args = ({...})
        Log.Log(
            ____exports.LogLevel.Message,
            message,
            table.unpack(args)
        )
    end
    function Log.Event(id, message)
        Log.Log(
            ____exports.LogLevel.Event,
            "{\"event\":" .. tostring(id) .. ", \"data\": " .. tostring(message) .. "}"
        )
    end
    function Log.Verbose(message, ...)
        local args = ({...})
        Log.Log(
            ____exports.LogLevel.Verbose,
            message,
            table.unpack(args)
        )
    end
end
return ____exports
end,
["src.app.weapons.projectile.projectile-target"] = function() require("lualib_bundle");
local ____exports = {}
local ____vector3 = require("src.app.types.vector3")
local Vector3 = ____vector3.Vector3
____exports.ProjectileTargetStatic = __TS__Class()
local ProjectileTargetStatic = ____exports.ProjectileTargetStatic
ProjectileTargetStatic.name = "ProjectileTargetStatic"
function ProjectileTargetStatic.prototype.____constructor(self, loc)
    self.loc = loc
end
function ProjectileTargetStatic.prototype.getTargetX(self)
    return self.loc.x
end
function ProjectileTargetStatic.prototype.getTargetY(self)
    return self.loc.y
end
function ProjectileTargetStatic.prototype.getTargetZ(self)
    return self.loc.z
end
function ProjectileTargetStatic.prototype.getTargetVector(self)
    return __TS__New(
        Vector3,
        self:getTargetX(),
        self:getTargetY(),
        self:getTargetZ()
    )
end
____exports.ProjectileTargetUnit = __TS__Class()
local ProjectileTargetUnit = ____exports.ProjectileTargetUnit
ProjectileTargetUnit.name = "ProjectileTargetUnit"
function ProjectileTargetUnit.prototype.____constructor(self, target)
    self.target = target
end
function ProjectileTargetUnit.prototype.getTargetX(self)
    return GetUnitX(self.target)
end
function ProjectileTargetUnit.prototype.getTargetY(self)
    return GetUnitY(self.target)
end
function ProjectileTargetUnit.prototype.getTargetZ(self)
    return BlzGetUnitZ(self.target)
end
function ProjectileTargetUnit.prototype.getTargetVector(self)
    return __TS__New(
        Vector3,
        self:getTargetX(),
        self:getTargetY(),
        self:getTargetZ()
    )
end
____exports.ProjectileMoverLinear = __TS__Class()
local ProjectileMoverLinear = ____exports.ProjectileMoverLinear
ProjectileMoverLinear.name = "ProjectileMoverLinear"
function ProjectileMoverLinear.prototype.____constructor(self)
end
function ProjectileMoverLinear.prototype.move(self, currentPostion, goal, velocity, delta)
    local velocityVector = goal:normalise():multiplyN(velocity * delta)
    return velocityVector
end
local GRAVITY = 800
____exports.ProjectileMoverParabolic = __TS__Class()
local ProjectileMoverParabolic = ____exports.ProjectileMoverParabolic
ProjectileMoverParabolic.name = "ProjectileMoverParabolic"
function ProjectileMoverParabolic.prototype.____constructor(self, originalPosition, goal, radians)
    self.distanceTravelled = 0
    self.distanceTravelledVertically = 0
    self.angle = 0
    self.velocity = 0
    self.timeElapsed = 0
    self.originalPos = originalPosition
    self.originalDelta = goal:subtract(originalPosition)
    local dLen = self.originalDelta:to2D():getLength()
    local velocity = SquareRoot(
        ((dLen * dLen) * GRAVITY) / (dLen * Sin(2 * radians) - 2 * self.originalDelta.z * (Cos(radians) * Cos(radians)))
    )
    self.angle = radians
    self.velocity = velocity
end
function ProjectileMoverParabolic.prototype.move(self, currentPostion, goal, velocity, deltaTime)
    local direction = self.originalDelta:normalise()
    local totalXY = self.velocity * self.timeElapsed * Cos(self.angle)
    local xyDelta = totalXY - self.distanceTravelled
    local totalZ = (self.velocity * self.timeElapsed * Sin(self.angle)) - (GRAVITY * (self.timeElapsed * self.timeElapsed)) / 2
    local zDelta = totalZ - self.distanceTravelledVertically
    self.distanceTravelled = self.distanceTravelled + xyDelta
    self.distanceTravelledVertically = self.distanceTravelledVertically + zDelta
    self.timeElapsed = self.timeElapsed + deltaTime
    return __TS__New(Vector3, direction.x * xyDelta, direction.y * xyDelta, 0 + zDelta)
end
return ____exports
end,
["src.lib.translators"] = function() require("lualib_bundle");
local ____exports = {}
function ____exports.SendMessage(msg)
    DisplayTimedTextToForce(
        bj_FORCE_ALL_PLAYERS,
        10,
        tostring(msg)
    )
end
____exports.console = __TS__Class()
local console = ____exports.console
console.name = "console"
function console.prototype.____constructor(self)
end
function console.log(self, input)
    ____exports.SendMessage(input)
end
function ____exports.getYawPitchRollFromVector(vector)
    return {
        yaw = Atan2(vector.y, vector.x),
        pitch = Asin(vector.z),
        roll = 0
    }
end
function ____exports.staticDecorator()
    return function(constructor)
    end
end
function ____exports.SendMessageUnlogged(msg)
    DisplayTimedTextToForce(
        bj_FORCE_ALL_PLAYERS,
        10,
        tostring(msg)
    )
end
function ____exports.PlayNewSoundOnUnit(soundPath, unit, volume)
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
function ____exports.ToString(input)
    return tostring(input)
end
function ____exports.DecodeFourCC(fourcc)
    return string.char((fourcc >> 24) & 255, (fourcc >> 16) & 255, (fourcc >> 8) & 255, fourcc & 255)
end
____exports.Util = __TS__Class()
local Util = ____exports.Util
Util.name = "Util"
function Util.prototype.____constructor(self)
end
function Util.isUnitCreep(self, u)
    local ownerID = GetPlayerId(
        GetOwningPlayer(u)
    )
    local ____switch14 = ownerID
    if ____switch14 == ____exports.COLOUR.NAVY then
        goto ____switch14_case_0
    end
    if ____switch14 == ____exports.COLOUR.TURQUOISE then
        goto ____switch14_case_1
    end
    if ____switch14 == ____exports.COLOUR.VOILET then
        goto ____switch14_case_2
    end
    if ____switch14 == ____exports.COLOUR.WHEAT then
        goto ____switch14_case_3
    end
    goto ____switch14_case_default
    ::____switch14_case_0::
    ::____switch14_case_1::
    ::____switch14_case_2::
    ::____switch14_case_3::
    do
        return true
    end
    ::____switch14_case_default::
    do
        return false
    end
    ::____switch14_end::
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
            local ____tmp = cntr
            cntr = ____tmp + 1
            return ____tmp
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
                    goto __continue27
                end
                output = tostring(output) .. "\"" .. tostring(arr[i + 1]) .. "\", "
            end
            ::__continue27::
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
____exports.COLOUR[____exports.COLOUR.RED] = "RED"
____exports.COLOUR.BLUE = 1
____exports.COLOUR[____exports.COLOUR.BLUE] = "BLUE"
____exports.COLOUR.TEAL = 2
____exports.COLOUR[____exports.COLOUR.TEAL] = "TEAL"
____exports.COLOUR.PURPLE = 3
____exports.COLOUR[____exports.COLOUR.PURPLE] = "PURPLE"
____exports.COLOUR.YELLOW = 4
____exports.COLOUR[____exports.COLOUR.YELLOW] = "YELLOW"
____exports.COLOUR.ORANGE = 5
____exports.COLOUR[____exports.COLOUR.ORANGE] = "ORANGE"
____exports.COLOUR.GREEN = 6
____exports.COLOUR[____exports.COLOUR.GREEN] = "GREEN"
____exports.COLOUR.PINK = 7
____exports.COLOUR[____exports.COLOUR.PINK] = "PINK"
____exports.COLOUR.GRAY = 8
____exports.COLOUR[____exports.COLOUR.GRAY] = "GRAY"
____exports.COLOUR.LIGHT_BLUE = 9
____exports.COLOUR[____exports.COLOUR.LIGHT_BLUE] = "LIGHT_BLUE"
____exports.COLOUR.DARK_GREEN = 10
____exports.COLOUR[____exports.COLOUR.DARK_GREEN] = "DARK_GREEN"
____exports.COLOUR.BROWN = 11
____exports.COLOUR[____exports.COLOUR.BROWN] = "BROWN"
____exports.COLOUR.MAROON = 12
____exports.COLOUR[____exports.COLOUR.MAROON] = "MAROON"
____exports.COLOUR.NAVY = 13
____exports.COLOUR[____exports.COLOUR.NAVY] = "NAVY"
____exports.COLOUR.TURQUOISE = 14
____exports.COLOUR[____exports.COLOUR.TURQUOISE] = "TURQUOISE"
____exports.COLOUR.VOILET = 15
____exports.COLOUR[____exports.COLOUR.VOILET] = "VOILET"
____exports.COLOUR.WHEAT = 16
____exports.COLOUR[____exports.COLOUR.WHEAT] = "WHEAT"
____exports.COLOUR.PEACH = 17
____exports.COLOUR[____exports.COLOUR.PEACH] = "PEACH"
____exports.COLOUR.MINT = 18
____exports.COLOUR[____exports.COLOUR.MINT] = "MINT"
____exports.COLOUR.LAVENDER = 19
____exports.COLOUR[____exports.COLOUR.LAVENDER] = "LAVENDER"
____exports.COLOUR.COAL = 20
____exports.COLOUR[____exports.COLOUR.COAL] = "COAL"
____exports.COLOUR.SNOW = 21
____exports.COLOUR[____exports.COLOUR.SNOW] = "SNOW"
____exports.COLOUR.EMERALD = 22
____exports.COLOUR[____exports.COLOUR.EMERALD] = "EMERALD"
____exports.COLOUR.PEANUT = 23
____exports.COLOUR[____exports.COLOUR.PEANUT] = "PEANUT"
____exports.CREEP_TYPE = {}
____exports.CREEP_TYPE.NORMAL = 0
____exports.CREEP_TYPE[____exports.CREEP_TYPE.NORMAL] = "NORMAL"
____exports.CREEP_TYPE.AIR = 1
____exports.CREEP_TYPE[____exports.CREEP_TYPE.AIR] = "AIR"
____exports.CREEP_TYPE.CHAMPION = 2
____exports.CREEP_TYPE[____exports.CREEP_TYPE.CHAMPION] = "CHAMPION"
____exports.CREEP_TYPE.BOSS = 3
____exports.CREEP_TYPE[____exports.CREEP_TYPE.BOSS] = "BOSS"
____exports.ARMOUR_TYPE = {}
____exports.ARMOUR_TYPE.UNARMOURED = 0
____exports.ARMOUR_TYPE[____exports.ARMOUR_TYPE.UNARMOURED] = "UNARMOURED"
____exports.ARMOUR_TYPE.LIGHT = 1
____exports.ARMOUR_TYPE[____exports.ARMOUR_TYPE.LIGHT] = "LIGHT"
____exports.ARMOUR_TYPE.MEDIUM = 2
____exports.ARMOUR_TYPE[____exports.ARMOUR_TYPE.MEDIUM] = "MEDIUM"
____exports.ARMOUR_TYPE.HEAVY = 3
____exports.ARMOUR_TYPE[____exports.ARMOUR_TYPE.HEAVY] = "HEAVY"
____exports.ARMOUR_TYPE.FORTIFIED = 4
____exports.ARMOUR_TYPE[____exports.ARMOUR_TYPE.FORTIFIED] = "FORTIFIED"
____exports.ARMOUR_TYPE.HERO = 5
____exports.ARMOUR_TYPE[____exports.ARMOUR_TYPE.HERO] = "HERO"
return ____exports
end,
["src.app.weapons.projectile.projectile-sfx"] = function() require("lualib_bundle");
local ____exports = {}
local ____translators = require("src.lib.translators")
local getYawPitchRollFromVector = ____translators.getYawPitchRollFromVector
____exports.ProjectileSFX = __TS__Class()
local ProjectileSFX = ____exports.ProjectileSFX
ProjectileSFX.name = "ProjectileSFX"
function ProjectileSFX.prototype.____constructor(self, sfx, startingLoc, offset, facing)
    self.offset = offset
    local facingData = getYawPitchRollFromVector(facing)
    self.yaw = facingData.yaw
    self.pitch = facingData.pitch
    self.roll = facingData.roll
    self.sfx = AddSpecialEffect(sfx, startingLoc.x, startingLoc.y)
    BlzSetSpecialEffectZ(self.sfx, startingLoc.z)
    BlzSetSpecialEffectRoll(self.sfx, self.pitch)
    BlzSetSpecialEffectYaw(self.sfx, self.yaw)
end
function ProjectileSFX.prototype.updatePosition(self, currentPosition)
    BlzSetSpecialEffectX(self.sfx, currentPosition.x + self.offset.x)
    BlzSetSpecialEffectY(self.sfx, currentPosition.y + self.offset.y)
    BlzSetSpecialEffectZ(self.sfx, currentPosition.z + self.offset.z)
end
function ProjectileSFX.prototype.setScale(self, scale)
    BlzSetSpecialEffectScale(self.sfx, scale)
end
function ProjectileSFX.prototype.destroy(self)
    DestroyEffect(self.sfx)
end
function ProjectileSFX.prototype.getEffect(self)
    return self.sfx
end
return ____exports
end,
["src.app.weapons.projectile.projectile"] = function() require("lualib_bundle");
local ____exports = {}
local ____projectile_2Dtarget = require("src.app.weapons.projectile.projectile-target")
local ProjectileMoverLinear = ____projectile_2Dtarget.ProjectileMoverLinear
local ____projectile_2Dsfx = require("src.app.weapons.projectile.projectile-sfx")
local ProjectileSFX = ____projectile_2Dsfx.ProjectileSFX
local AIRBORN_ABILITY_DUMMY = FourCC("A00C")
local DEFAULT_FILTER
DEFAULT_FILTER = function(projectile)
    return Filter(
        function()
            local unit = GetFilterUnit()
            return GetWidgetLife(unit) > 0.405 and not IsUnitAlly(
                unit,
                GetOwningPlayer(projectile.source)
            ) and IsUnitType(unit, UNIT_TYPE_STRUCTURE) == false and IsUnitType(unit, UNIT_TYPE_MAGIC_IMMUNE) == false and IsUnitType(unit, UNIT_TYPE_MECHANICAL) == false and GetUnitAbilityLevel(unit, AIRBORN_ABILITY_DUMMY) == 0
        end
    )
end
____exports.Projectile = __TS__Class()
local Projectile = ____exports.Projectile
Projectile.name = "Projectile"
function Projectile.prototype.____constructor(self, source, startPosition, target, projectileMover)
    self.collisionRadius = 30
    self.velocity = 10
    self.doDestroy = false
    self.position = startPosition
    self.target = target
    self.sfx = {}
    self.mover = projectileMover or __TS__New(ProjectileMoverLinear)
    self.source = source
    self.filter = DEFAULT_FILTER(self)
end
function Projectile.prototype.addEffect(self, sfx, offset, facing, scale)
    local _sfx = __TS__New(ProjectileSFX, sfx, self.position, offset, facing)
    _sfx:setScale(scale)
    __TS__ArrayPush(self.sfx, _sfx)
    return _sfx:getEffect()
end
function Projectile.prototype.doesCollide(self)
    return true
end
function Projectile.prototype.getPosition(self)
    return self.position
end
function Projectile.prototype.getCollisionRadius(self)
    return self.collisionRadius
end
function Projectile.prototype.setCollisionRadius(self, radius)
    self.collisionRadius = radius
    return self
end
function Projectile.prototype.willDestroy(self)
    return self.doDestroy
end
function Projectile.prototype.setDestroy(self, val)
    self.doDestroy = val
    return self
end
function Projectile.prototype.overrideFilter(self, newFunc)
    self.filter = Filter(newFunc)
    return self
end
function Projectile.prototype.onCollide(self, callback)
    self.onCollideCallback = callback
    return self
end
function Projectile.prototype.onDeath(self, callback)
    self.onDeathCallback = callback
    return self
end
function Projectile.prototype.collide(self, weaponModule, withUnit)
    if self.onCollideCallback then
        self:onCollideCallback(weaponModule, self, withUnit)
    end
end
function Projectile.prototype.getTarget(self)
    return self.target
end
function Projectile.prototype.update(self, weaponModule, deltaTime)
    local velocityToApply = self.mover:move(
        self.position,
        self:getTarget():getTargetVector(),
        self.velocity,
        deltaTime
    )
    local newPosition = self.position:add(velocityToApply)
    self.position = newPosition
    __TS__ArrayForEach(
        self.sfx,
        function(____, sfx) return sfx:updatePosition(self.position) end
    )
    if self:reachedEnd(weaponModule, velocityToApply) then
        self.doDestroy = true
    end
    return velocityToApply
end
function Projectile.prototype.setVelocity(self, velocity)
    self.velocity = velocity
    return self
end
function Projectile.prototype.reachedEnd(self, weaponModule, targetVector)
    MoveLocation(weaponModule.game.TEMP_LOCATION, self.position.x, self.position.y)
    local z = GetLocationZ(weaponModule.game.TEMP_LOCATION)
    return (self.position.z <= z)
end
function Projectile.prototype.destroy(self)
    local ____ = self.onDeathCallback and self:onDeathCallback(self)
    __TS__ArrayForEach(
        self.sfx,
        function(____, sfx) return sfx:destroy() end
    )
    self.sfx = {}
    return true
end
return ____exports
end,
["src.app.types.jass-overrides.trigger"] = function() require("lualib_bundle");
local ____exports = {}
____exports.Trigger = __TS__Class()
local Trigger = ____exports.Trigger
Trigger.name = "Trigger"
function Trigger.prototype.____constructor(self)
    self.isDestroyed = false
    self.nativeTrigger = CreateTrigger()
end
function Trigger.EvaluateCondition(self, func)
    local answer = false
    xpcall(
        function()
            answer = func()
        end,
        function(err)
            self:printError(err)
        end
    )
    return answer
end
function Trigger.printError(self, err)
    print("FATAL ERROR")
    print(err)
end
function Trigger.prototype.AddAction(self, actionFunc)
    return TriggerAddAction(
        self.nativeTrigger,
        function() return ({
            xpcall(
                function() return actionFunc() end,
                function(err) return ____exports.Trigger:printError(err) end
            )
        }) end
    )
end
function Trigger.prototype.RegisterTimerEvent(self, timeout, periodic)
    return TriggerRegisterTimerEvent(self.nativeTrigger, timeout, periodic)
end
function Trigger.prototype.RegisterTimerEventSingle(self, timeout)
    return TriggerRegisterTimerEventSingle(self.nativeTrigger, timeout)
end
function Trigger.prototype.RegisterTimerEventPeriodic(self, timeout)
    return TriggerRegisterTimerEventPeriodic(self.nativeTrigger, timeout)
end
function Trigger.prototype.RegisterPlayerStateEvent(self, whichPlayer, whichState, opcode, limitval)
    return TriggerRegisterPlayerStateEvent(self.nativeTrigger, whichPlayer, whichState, opcode, limitval)
end
function Trigger.prototype.RegisterUnitTakesDamage(self)
    return TriggerRegisterAnyUnitEventBJ(self.nativeTrigger, EVENT_PLAYER_UNIT_DAMAGED)
end
function Trigger.prototype.RegisterDeathEvent(self, whichWidget)
    return TriggerRegisterDeathEvent(self.nativeTrigger, whichWidget)
end
function Trigger.prototype.RegisterDialogEventBJ(self, whichDialog)
    return TriggerRegisterDialogEventBJ(self.nativeTrigger, whichDialog)
end
function Trigger.prototype.RegisterEnterRectSimple(self, r)
    return TriggerRegisterEnterRectSimple(self.nativeTrigger, r)
end
function Trigger.prototype.AddCondition(self, func)
    return TriggerAddCondition(
        self.nativeTrigger,
        Condition(
            function() return ____exports.Trigger:EvaluateCondition(func) end
        )
    )
end
function Trigger.prototype.AddFilterFuncCondition(self, filter)
    return TriggerAddCondition(self.nativeTrigger, filter)
end
function Trigger.prototype.RegisterAnyUnitEventBJ(self, whichEvent)
    TriggerRegisterAnyUnitEventBJ(self.nativeTrigger, whichEvent)
end
function Trigger.prototype.RegisterPlayerChatEvent(self, whichPlayer, chatMessageToDetect, exactMatchOnly)
    return TriggerRegisterPlayerChatEvent(self.nativeTrigger, whichPlayer, chatMessageToDetect, exactMatchOnly)
end
function Trigger.prototype.RegisterPlayerUnitEventSimple(self, whichPlayer, whichEvent)
    return TriggerRegisterPlayerUnitEventSimple(self.nativeTrigger, whichPlayer, whichEvent)
end
function Trigger.prototype.RegisterUnitIssuedOrder(self, whichUnit, whichEvent)
    return TriggerRegisterUnitEvent(self.nativeTrigger, whichUnit, whichEvent)
end
function Trigger.prototype.destroy(self)
    self.isDestroyed = true
    DestroyTrigger(self.nativeTrigger)
end
return ____exports
end,
["src.app.types.timed-event-queue"] = function() require("lualib_bundle");
local ____exports = {}
local ____trigger = require("src.app.types.jass-overrides.trigger")
local Trigger = ____trigger.Trigger
local ____translators = require("src.lib.translators")
local Util = ____translators.Util
____exports.TimedEventQueue = __TS__Class()
local TimedEventQueue = ____exports.TimedEventQueue
TimedEventQueue.name = "TimedEventQueue"
function TimedEventQueue.prototype.____constructor(self, game)
    self.tick = 0
    self.maxTick = 100000
    self.events = __TS__New(Map)
    self.tickRate = 0.05
    self.ticker = __TS__New(Trigger)
    self.ticker:RegisterTimerEventPeriodic(self.tickRate)
    self.ticker:AddAction(
        function()
            self.tick = (self.tick + 1) % self.maxTick
            self:HandleTick()
        end
    )
    self.game = game
end
function TimedEventQueue.prototype.HandleTick(self)
    self.events:forEach(
        (function(____, event, key)
            if event:AttemptAction(self.tick, self) then
                self.events:delete(key)
            end
        end)
    )
end
function TimedEventQueue.prototype.AddEvent(self, event)
    local hash = Util:RandomHash(10)
    event:setTickRate(1000 * self.tickRate)
    self.events:set(hash, event)
    return hash
end
function TimedEventQueue.prototype.RemoveEvent(self, eventHash)
    if self.events:has(eventHash) then
        self.events:delete(eventHash)
    end
end
function TimedEventQueue.prototype.GetEvent(self, eventHash)
    if self.events:has(eventHash) then
        return self.events:get(eventHash)
    end
end
function TimedEventQueue.prototype.GetEventExpireTime(self, event)
    return event:GetEndTick() * self.tickRate
end
function TimedEventQueue.prototype.GetGame(self)
    return self.game
end
return ____exports
end,
["src.app.types.timed-event"] = function() require("lualib_bundle");
local ____exports = {}
____exports.TimedEvent = __TS__Class()
local TimedEvent = ____exports.TimedEvent
TimedEvent.name = "TimedEvent"
function TimedEvent.prototype.____constructor(self, func, time, safe)
    if safe == nil then
        safe = true
    end
    self.safe = safe
    self.time = time
    self.func = function() return func() end
end
function TimedEvent.prototype.setTickRate(self, msPerTick)
    self.time = self.time / msPerTick
end
function TimedEvent.prototype.AttemptAction(self, currentTick, teq)
    if not self.endtime then
        self.endtime = ((currentTick + self.time) % 100000) - 1
        if self.endtime < 0 then
            self.endtime = 0
        end
    end
    if self.endtime <= currentTick then
        self:func()
        return true
    end
    return false
end
function TimedEvent.prototype.GetEndTick(self)
    return self.endtime or 1
end
return ____exports
end,
["src.resources.colours"] = function() local ____exports = {}
____exports.COL_GOOD = "|cff00ff00"
____exports.COL_BAD = "|cff808080"
____exports.COL_ATTATCH = "|cffc81e1e"
____exports.COL_MISC = "|cff808080"
____exports.COL_INFO = "|cff00ffff"
____exports.COL_RESOLVE = "|cffffff00"
____exports.COL_GOLD = "|cffffcc00"
____exports.COL_FLOOR_1 = "|cfff5a742"
____exports.COL_FLOOR_2 = "|cff41dee0"
____exports.COL_VENTS = "|cff666633"
return ____exports
end,
["src.resources.weapon-tooltips"] = function() local ____exports = {}
local ____colours = require("src.resources.colours")
local COL_ATTATCH = ____colours.COL_ATTATCH
local COL_GOOD = ____colours.COL_GOOD
local COL_INFO = ____colours.COL_INFO
local COL_GOLD = ____colours.COL_GOLD
____exports.BURST_RIFLE_EXTENDED = function(damage, accuracyMin, accuracyMax) return "|cff808080Powered by galvanic rails, this old rifle has been in active circulation since the Yulvin succession wars. \nNow many corporations produce upgrades and attachments that further improve upon its baseline functionality.|r\n\nFires a short burst of six bullets with |cff00ffff" .. tostring(accuracyMin) .. "|r to |cff00ffff" .. tostring(accuracyMax) .. "|r range, with each bullet dealing |cff00ff00" .. tostring(damage) .. " damage|r.\n\n|cffff0000If all six rounds hit the same target, this weapon will apply BREAK.|r\n" end
____exports.BURST_RIFLE_ITEM = function(weapon, damage) return "|cff808080Powered by galvanic rails, this old rifle has been in active circulation since the Yulvin succession wars. \nNow many corporations produce upgrades and attachments that further improve upon its baseline functionality.|r\n\nAttached: " .. tostring(
    weapon.attachment and tostring(COL_GOLD) .. tostring(weapon.attachment.name) or tostring(COL_ATTATCH) .. "Nothing"
) .. "|r\n\nThe standard issue rifle; ideal for thinning hordes and can dish out serious damage up close.\n" .. tostring(COL_GOOD) .. "- 6 Shot Burst\n- Each shot does " .. tostring(damage) .. " damage\n- Short Cooldown|r\n\n" .. tostring(
    (not weapon.attachment) and tostring(COL_INFO) .. "Can be enhanced with " .. tostring(COL_ATTATCH) .. "High Quality Polymer|r" .. tostring(COL_INFO) .. " and |r" .. tostring(COL_ATTATCH) .. "EMS Rifling|r" .. tostring(COL_INFO) .. ".|r" or tostring(COL_GOLD) .. "Equip and type -u to remove " .. tostring(COL_ATTATCH) .. tostring(weapon.attachment.name) .. "|r|r"
) end
return ____exports
end,
["src.app.weapons.attachment.attachment"] = function() require("lualib_bundle");
local ____exports = {}
local ____translators = require("src.lib.translators")
local PlayNewSoundOnUnit = ____translators.PlayNewSoundOnUnit
____exports.Attachment = __TS__Class()
local Attachment = ____exports.Attachment
Attachment.name = "Attachment"
function Attachment.prototype.____constructor(self, item)
    self.name = ""
    self.item = item
    self.itemId = GetItemTypeId(item)
end
function Attachment.prototype.attachTo(self, weapon)
    local canAttach = self:onAttach(weapon)
    if canAttach then
        if weapon.equippedTo then
            local sound = PlayNewSoundOnUnit("Sounds\\attachToGun.mp3", weapon.equippedTo.unit, 50)
        end
        local didAttach = weapon:attach(self)
        if didAttach then
            local ____ = self.item and RemoveItem(self.item)
            self.item = nil
            self.attachedTo = weapon
        end
        return didAttach
    end
    return false
end
function Attachment.prototype.unattach(self)
    self:onDeattach()
    if self.attachedTo and self.attachedTo.equippedTo then
        local unit = self.attachedTo.equippedTo.unit
        local unitHasSpareItemSlot = UnitInventoryCount(unit) < UnitInventorySize(unit)
        local newItem = CreateItem(
            self.itemId,
            GetUnitX(unit),
            GetUnitY(unit)
        )
        if unitHasSpareItemSlot then
            UnitAddItem(unit, newItem)
        end
    end
    self.attachedTo = nil
end
return ____exports
end,
["src.app.weapons.guns.unit-has-weapon"] = function() require("lualib_bundle");
local ____exports = {}
____exports.ArmableUnit = __TS__Class()
local ArmableUnit = ____exports.ArmableUnit
ArmableUnit.name = "ArmableUnit"
function ArmableUnit.prototype.____constructor(self, unit)
    self.unit = unit
end
return ____exports
end,
["src.app.weapons.weapon-constants"] = function() local ____exports = {}
____exports.BURST_RIFLE_ABILITY_ID = FourCC("A002")
____exports.BURST_RIFLE_ITEM_ID = FourCC("I000")
____exports.SNIPER_ABILITY_ID = FourCC("A005")
____exports.SNIPER_ITEM_ID = FourCC("I001")
____exports.EMS_RIFLING_ABILITY_ID = FourCC("A00A")
____exports.EMS_RIFLING_ITEM_ID = FourCC("I003")
____exports.HIGH_QUALITY_POLYMER_ABILITY_ID = FourCC("A009")
____exports.HIGH_QUALITY_POLYMER_ITEM_ID = FourCC("I002")
return ____exports
end,
["src.app.weapons.guns.burst-rifle"] = function() require("lualib_bundle");
local ____exports = {}
local ____vector3 = require("src.app.types.vector3")
local Vector3 = ____vector3.Vector3
local ____gun = require("src.app.weapons.guns.gun")
local Gun = ____gun.Gun
local ____projectile = require("src.app.weapons.projectile.projectile")
local Projectile = ____projectile.Projectile
local ____projectile_2Dtarget = require("src.app.weapons.projectile.projectile-target")
local ProjectileTargetStatic = ____projectile_2Dtarget.ProjectileTargetStatic
local ____timed_2Devent = require("src.app.types.timed-event")
local TimedEvent = ____timed_2Devent.TimedEvent
local ____vector2 = require("src.app.types.vector2")
local Vector2 = ____vector2.Vector2
local ____weapon_2Dtooltips = require("src.resources.weapon-tooltips")
local BURST_RIFLE_EXTENDED = ____weapon_2Dtooltips.BURST_RIFLE_EXTENDED
local BURST_RIFLE_ITEM = ____weapon_2Dtooltips.BURST_RIFLE_ITEM
local ____translators = require("src.lib.translators")
local PlayNewSoundOnUnit = ____translators.PlayNewSoundOnUnit
local ____weapon_2Dconstants = require("src.app.weapons.weapon-constants")
local BURST_RIFLE_ABILITY_ID = ____weapon_2Dconstants.BURST_RIFLE_ABILITY_ID
local BURST_RIFLE_ITEM_ID = ____weapon_2Dconstants.BURST_RIFLE_ITEM_ID
____exports.InitBurstRifle = function(weaponModule)
    __TS__ArrayPush(weaponModule.weaponItemIds, BURST_RIFLE_ITEM_ID)
    __TS__ArrayPush(weaponModule.weaponAbilityIds, BURST_RIFLE_ABILITY_ID)
end
____exports.BurstRifle = __TS__Class()
local BurstRifle = ____exports.BurstRifle
BurstRifle.name = "BurstRifle"
BurstRifle.____super = Gun
setmetatable(BurstRifle, BurstRifle.____super)
setmetatable(BurstRifle.prototype, BurstRifle.____super.prototype)
function BurstRifle.prototype.____constructor(self, item, equippedTo)
    Gun.prototype.____constructor(self, item, equippedTo)
    self.DEFAULT_STRAY = 240
    self.SHOT_DISTANCE = 1200
end
function BurstRifle.prototype.onShoot(self, weaponModule, caster, targetLocation)
    Gun.prototype.onShoot(self, weaponModule, caster, targetLocation)
    local unit = caster.unit
    local sound = PlayNewSoundOnUnit("Sounds\\BattleRifleShoot.mp3", caster.unit, 50)
    local casterLoc = __TS__New(
        Vector3,
        GetUnitX(unit),
        GetUnitY(unit),
        BlzGetUnitZ(unit) + 50
    ):projectTowards2D(
        GetUnitFacing(unit) * bj_DEGTORAD,
        30
    )
    local targetDistance = __TS__New(Vector2, targetLocation.x - casterLoc.x, targetLocation.y - casterLoc.y):normalise():multiplyN(self.SHOT_DISTANCE)
    local newTargetLocation = __TS__New(Vector3, targetDistance.x + casterLoc.x, targetDistance.y + casterLoc.y, targetLocation.z)
    local delay = 0
    do
        local i = 0
        while i < 5 do
            weaponModule.game.timedEventQueue:AddEvent(
                __TS__New(
                    TimedEvent,
                    function()
                        self:fireProjectile(weaponModule, caster, newTargetLocation)
                        return true
                    end,
                    delay,
                    false
                )
            )
            delay = delay + 50
            i = i + 1
        end
    end
end
function BurstRifle.prototype.fireProjectile(self, weaponModule, caster, targetLocation)
    local unit = caster.unit
    local casterLoc = __TS__New(
        Vector3,
        GetUnitX(unit),
        GetUnitY(unit),
        BlzGetUnitZ(unit) + 50
    ):projectTowards2D(
        GetUnitFacing(unit) * bj_DEGTORAD,
        30
    )
    local strayTarget = self:getStrayLocation(targetLocation, caster)
    local deltaTarget = strayTarget:subtract(casterLoc)
    local projectile = __TS__New(
        Projectile,
        unit,
        casterLoc,
        __TS__New(ProjectileTargetStatic, deltaTarget)
    )
    projectile:addEffect(
        "war3mapImported\\Bullet.mdx",
        __TS__New(Vector3, 0, 0, 0),
        deltaTarget:normalise(),
        1.6
    )
    projectile:setVelocity(2400):onCollide(
        function(____self, weaponModule, projectile, collidesWith) return self:onProjectileCollide(weaponModule, projectile, collidesWith) end
    )
    weaponModule:addProjectile(projectile)
end
function BurstRifle.prototype.onProjectileCollide(self, weaponModule, projectile, collidesWith)
    projectile:setDestroy(true)
    if self.equippedTo then
        local crewmember = weaponModule.game.crewModule:getCrewmemberForUnit(self.equippedTo.unit)
        if crewmember then
            UnitDamageTarget(
                projectile.source,
                collidesWith,
                self:getDamage(weaponModule, crewmember),
                false,
                true,
                ATTACK_TYPE_PIERCE,
                DAMAGE_TYPE_NORMAL,
                WEAPON_TYPE_WOOD_MEDIUM_STAB
            )
        end
    end
end
function BurstRifle.prototype.getTooltip(self, weaponModule, crewmember)
    local accuracyModifier = (self.DEFAULT_STRAY * (100 / crewmember:getAccuracy())) / 2
    local newTooltip = BURST_RIFLE_EXTENDED(
        self:getDamage(weaponModule, crewmember),
        self.SHOT_DISTANCE - accuracyModifier,
        self.SHOT_DISTANCE + accuracyModifier
    )
    return newTooltip
end
function BurstRifle.prototype.getItemTooltip(self, weaponModule, crewmember)
    local damage = self:getDamage(weaponModule, crewmember)
    return BURST_RIFLE_ITEM(self, damage)
end
function BurstRifle.prototype.getStrayLocation(self, originalLocation, caster)
    local accuracy = caster:getAccuracy()
    local newLocation = __TS__New(
        Vector3,
        originalLocation.x + ((math.random() - 0.5) * self.DEFAULT_STRAY * (100 / accuracy)),
        originalLocation.y + ((math.random() - 0.5) * self.DEFAULT_STRAY * (100 / accuracy)),
        originalLocation.z
    )
    return newLocation
end
function BurstRifle.prototype.getDamage(self, weaponModule, caster)
    if self.attachment and self.attachment.name == "Ems Rifling" then
        return 20
    end
    return 15
end
function BurstRifle.prototype.getAbilityId(self)
    return BURST_RIFLE_ABILITY_ID
end
function BurstRifle.prototype.getItemId(self)
    return BURST_RIFLE_ITEM_ID
end
return ____exports
end,
["src.app.weapons.guns.sniper-rifle"] = function() require("lualib_bundle");
local ____exports = {}
local ____vector3 = require("src.app.types.vector3")
local Vector3 = ____vector3.Vector3
local ____gun = require("src.app.weapons.guns.gun")
local Gun = ____gun.Gun
local ____projectile = require("src.app.weapons.projectile.projectile")
local Projectile = ____projectile.Projectile
local ____projectile_2Dtarget = require("src.app.weapons.projectile.projectile-target")
local ProjectileTargetStatic = ____projectile_2Dtarget.ProjectileTargetStatic
local ____timed_2Devent = require("src.app.types.timed-event")
local TimedEvent = ____timed_2Devent.TimedEvent
local ____vector2 = require("src.app.types.vector2")
local Vector2 = ____vector2.Vector2
local ____weapon_2Dtooltips = require("src.resources.weapon-tooltips")
local BURST_RIFLE_EXTENDED = ____weapon_2Dtooltips.BURST_RIFLE_EXTENDED
local BURST_RIFLE_ITEM = ____weapon_2Dtooltips.BURST_RIFLE_ITEM
local ____translators = require("src.lib.translators")
local PlayNewSoundOnUnit = ____translators.PlayNewSoundOnUnit
local getYawPitchRollFromVector = ____translators.getYawPitchRollFromVector
local ____weapon_2Dconstants = require("src.app.weapons.weapon-constants")
local SNIPER_ITEM_ID = ____weapon_2Dconstants.SNIPER_ITEM_ID
local SNIPER_ABILITY_ID = ____weapon_2Dconstants.SNIPER_ABILITY_ID
____exports.InitSniperRifle = function(weaponModule)
    __TS__ArrayPush(weaponModule.weaponItemIds, SNIPER_ITEM_ID)
    __TS__ArrayPush(weaponModule.weaponAbilityIds, SNIPER_ABILITY_ID)
end
____exports.SniperRifle = __TS__Class()
local SniperRifle = ____exports.SniperRifle
SniperRifle.name = "SniperRifle"
SniperRifle.____super = Gun
setmetatable(SniperRifle, SniperRifle.____super)
setmetatable(SniperRifle.prototype, SniperRifle.____super.prototype)
function SniperRifle.prototype.____constructor(self, item, equippedTo)
    Gun.prototype.____constructor(self, item, equippedTo)
    self.DEFAULT_STRAY = 30
    self.SHOT_DISTANCE = 1600
end
function SniperRifle.prototype.getTooltip(self, weaponModule, crewmember)
    local accuracyModifier = (self.DEFAULT_STRAY * (100 / crewmember:getAccuracy())) / 2
    local newTooltip = BURST_RIFLE_EXTENDED(
        self:getDamage(weaponModule, crewmember),
        self.SHOT_DISTANCE - accuracyModifier,
        self.SHOT_DISTANCE + accuracyModifier
    )
    return ""
end
function SniperRifle.prototype.getItemTooltip(self, weaponModule, crewmember)
    return BURST_RIFLE_ITEM(
        self,
        self:getDamage(weaponModule, crewmember)
    )
end
function SniperRifle.prototype.onShoot(self, weaponModule, caster, targetLocation)
    Gun.prototype.onShoot(self, weaponModule, caster, targetLocation)
    local unit = caster.unit
    local casterLoc = __TS__New(
        Vector3,
        GetUnitX(unit),
        GetUnitY(unit),
        BlzGetUnitZ(unit) + 50
    ):projectTowards2D(
        GetUnitFacing(unit) * bj_DEGTORAD,
        30
    )
    local targetDistance = __TS__New(Vector2, targetLocation.x - casterLoc.x, targetLocation.y - casterLoc.y):normalise():multiplyN(self.SHOT_DISTANCE)
    local newTargetLocation = __TS__New(Vector3, targetDistance.x + casterLoc.x, targetDistance.y + casterLoc.y, targetLocation.z)
    self:fireProjectile(weaponModule, caster, newTargetLocation)
end
function SniperRifle.prototype.fireProjectile(self, weaponModule, caster, targetLocation)
    local unit = caster.unit
    local sound = PlayNewSoundOnUnit("Sounds\\SniperRifleShoot.mp3", caster.unit, 50)
    local casterLoc = __TS__New(
        Vector3,
        GetUnitX(unit),
        GetUnitY(unit),
        BlzGetUnitZ(unit) + 50
    ):projectTowards2D(
        GetUnitFacing(unit) * bj_DEGTORAD,
        30
    )
    local strayTarget = self:getStrayLocation(targetLocation, caster)
    local deltaTarget = strayTarget:subtract(casterLoc)
    local projectile = __TS__New(
        Projectile,
        unit,
        casterLoc,
        __TS__New(ProjectileTargetStatic, deltaTarget)
    )
    local effect = projectile:addEffect(
        "war3mapImported\\Bullet.mdx",
        __TS__New(Vector3, 0, 0, 0),
        deltaTarget:normalise(),
        2.5
    )
    BlzSetSpecialEffectColor(effect, 130, 160, 255)
    projectile:setCollisionRadius(40):setVelocity(2400):onCollide(
        function(____self, weaponModule, projectile, collidesWith) return self:onProjectileCollide(weaponModule, projectile, collidesWith) end
    )
    weaponModule:addProjectile(projectile)
    local delay = 0
    while delay < 1000 do
        weaponModule.game.timedEventQueue:AddEvent(
            __TS__New(
                TimedEvent,
                function()
                    if not projectile or projectile:willDestroy() then
                        return true
                    end
                    local position = projectile:getPosition():add(
                        deltaTarget:normalise()
                    )
                    local sfxOrientation = getYawPitchRollFromVector(
                        deltaTarget:normalise()
                    )
                    local sfx = AddSpecialEffect("war3mapImported\\DustWave.mdx", position.x, position.y)
                    BlzSetSpecialEffectHeight(sfx, position.z)
                    BlzSetSpecialEffectYaw(sfx, sfxOrientation.yaw + 90 * bj_DEGTORAD)
                    BlzSetSpecialEffectRoll(sfx, sfxOrientation.pitch + 90 * bj_DEGTORAD)
                    BlzSetSpecialEffectAlpha(sfx, 40)
                    BlzSetSpecialEffectScale(sfx, 0.7)
                    BlzSetSpecialEffectTimeScale(sfx, 1)
                    BlzSetSpecialEffectTime(sfx, 0.5)
                    DestroyEffect(sfx)
                    return true
                end,
                delay,
                false
            )
        )
        delay = delay + 100
    end
end
function SniperRifle.prototype.onProjectileCollide(self, weaponModule, projectile, collidesWith)
    projectile:setDestroy(true)
    if self.equippedTo then
        local crewmember = weaponModule.game.crewModule:getCrewmemberForUnit(self.equippedTo.unit)
        if crewmember then
            local damage = self:getDamage(weaponModule, crewmember)
            UnitDamageTarget(projectile.source, collidesWith, damage, false, true, ATTACK_TYPE_PIERCE, DAMAGE_TYPE_NORMAL, WEAPON_TYPE_WOOD_MEDIUM_STAB)
        end
    end
end
function SniperRifle.prototype.getStrayLocation(self, originalLocation, caster)
    local accuracy = caster:getAccuracy()
    local newLocation = __TS__New(
        Vector3,
        originalLocation.x + ((math.random() - 0.5) * self.DEFAULT_STRAY * (100 / accuracy)),
        originalLocation.y + ((math.random() - 0.5) * self.DEFAULT_STRAY * (100 / accuracy)),
        originalLocation.z
    )
    return newLocation
end
function SniperRifle.prototype.getDamage(self, weaponModule, caster)
    return 120
end
function SniperRifle.prototype.getAbilityId(self)
    return SNIPER_ABILITY_ID
end
function SniperRifle.prototype.getItemId(self)
    return SNIPER_ITEM_ID
end
return ____exports
end,
["src.app.weapons.attachment.high-quality-polymer"] = function() require("lualib_bundle");
local ____exports = {}
local ____attachment = require("src.app.weapons.attachment.attachment")
local Attachment = ____attachment.Attachment
local ____serilog = require("src.lib.serilog.serilog")
local Log = ____serilog.Log
local ____weapon_2Dconstants = require("src.app.weapons.weapon-constants")
local BURST_RIFLE_ABILITY_ID = ____weapon_2Dconstants.BURST_RIFLE_ABILITY_ID
local HIGH_QUALITY_POLYMER_ABILITY_ID = ____weapon_2Dconstants.HIGH_QUALITY_POLYMER_ABILITY_ID
____exports.HighQualityPolymer = __TS__Class()
local HighQualityPolymer = ____exports.HighQualityPolymer
HighQualityPolymer.name = "HighQualityPolymer"
HighQualityPolymer.____super = Attachment
setmetatable(HighQualityPolymer, HighQualityPolymer.____super)
setmetatable(HighQualityPolymer.prototype, HighQualityPolymer.____super.prototype)
function HighQualityPolymer.prototype.____constructor(self, ...)
    Attachment.prototype.____constructor(self, ...)
    self.name = "High Quality Polymer"
end
function HighQualityPolymer.prototype.onAttach(self, weapon)
    if weapon:getAbilityId() == BURST_RIFLE_ABILITY_ID then
        if weapon.equippedTo then
            UnitAddAbility(weapon.equippedTo.unit, HIGH_QUALITY_POLYMER_ABILITY_ID)
        end
        return true
    end
    return false
end
function HighQualityPolymer.prototype.onDeattach(self)
    if self.attachedTo and self.attachedTo.equippedTo then
        UnitRemoveAbility(self.attachedTo.equippedTo.unit, HIGH_QUALITY_POLYMER_ABILITY_ID)
    end
end
function HighQualityPolymer.prototype.onEquip(self, weapon)
    Log.Information("Re-equiping gun with hqp attachment")
    if weapon and weapon.equippedTo then
        UnitAddAbility(weapon.equippedTo.unit, HIGH_QUALITY_POLYMER_ABILITY_ID)
    end
end
function HighQualityPolymer.prototype.onUnequip(self, weapon)
    Log.Information("Unequiping gun with hqp attachment")
    if weapon and weapon.equippedTo then
        UnitRemoveAbility(weapon.equippedTo.unit, HIGH_QUALITY_POLYMER_ABILITY_ID)
    end
end
return ____exports
end,
["src.app.weapons.attachment.em-rifling"] = function() require("lualib_bundle");
local ____exports = {}
local ____attachment = require("src.app.weapons.attachment.attachment")
local Attachment = ____attachment.Attachment
local ____serilog = require("src.lib.serilog.serilog")
local Log = ____serilog.Log
local ____weapon_2Dconstants = require("src.app.weapons.weapon-constants")
local BURST_RIFLE_ABILITY_ID = ____weapon_2Dconstants.BURST_RIFLE_ABILITY_ID
local EMS_RIFLING_ABILITY_ID = ____weapon_2Dconstants.EMS_RIFLING_ABILITY_ID
____exports.EmsRifling = __TS__Class()
local EmsRifling = ____exports.EmsRifling
EmsRifling.name = "EmsRifling"
EmsRifling.____super = Attachment
setmetatable(EmsRifling, EmsRifling.____super)
setmetatable(EmsRifling.prototype, EmsRifling.____super.prototype)
function EmsRifling.prototype.____constructor(self, ...)
    Attachment.prototype.____constructor(self, ...)
    self.name = "Ems Rifling"
end
function EmsRifling.prototype.onAttach(self, weapon)
    if weapon:getAbilityId() == BURST_RIFLE_ABILITY_ID then
        if weapon.equippedTo then
            UnitAddAbility(weapon.equippedTo.unit, EMS_RIFLING_ABILITY_ID)
        end
        return true
    end
    return false
end
function EmsRifling.prototype.onDeattach(self)
    if self.attachedTo and self.attachedTo.equippedTo then
        UnitRemoveAbility(self.attachedTo.equippedTo.unit, EMS_RIFLING_ABILITY_ID)
    end
end
function EmsRifling.prototype.onEquip(self, weapon)
    Log.Information("Re-equiping gun with hqp attachment")
    if weapon and weapon.equippedTo then
        UnitAddAbility(weapon.equippedTo.unit, EMS_RIFLING_ABILITY_ID)
    end
end
function EmsRifling.prototype.onUnequip(self, weapon)
    Log.Information("Unequiping gun with hqp attachment")
    if weapon and weapon.equippedTo then
        UnitRemoveAbility(weapon.equippedTo.unit, EMS_RIFLING_ABILITY_ID)
    end
end
return ____exports
end,
["src.app.weapons.weapon-module"] = function() require("lualib_bundle");
local ____exports = {}
local ____vector3 = require("src.app.types.vector3")
local Vector3 = ____vector3.Vector3
local ____burst_2Drifle = require("src.app.weapons.guns.burst-rifle")
local BurstRifle = ____burst_2Drifle.BurstRifle
local InitBurstRifle = ____burst_2Drifle.InitBurstRifle
local ____trigger = require("src.app.types.jass-overrides.trigger")
local Trigger = ____trigger.Trigger
local ____sniper_2Drifle = require("src.app.weapons.guns.sniper-rifle")
local SniperRifle = ____sniper_2Drifle.SniperRifle
local InitSniperRifle = ____sniper_2Drifle.InitSniperRifle
local ____serilog = require("src.lib.serilog.serilog")
local Log = ____serilog.Log
local ____high_2Dquality_2Dpolymer = require("src.app.weapons.attachment.high-quality-polymer")
local HighQualityPolymer = ____high_2Dquality_2Dpolymer.HighQualityPolymer
local ____em_2Drifling = require("src.app.weapons.attachment.em-rifling")
local EmsRifling = ____em_2Drifling.EmsRifling
local ____weapon_2Dconstants = require("src.app.weapons.weapon-constants")
local SNIPER_ITEM_ID = ____weapon_2Dconstants.SNIPER_ITEM_ID
local BURST_RIFLE_ITEM_ID = ____weapon_2Dconstants.BURST_RIFLE_ITEM_ID
local HIGH_QUALITY_POLYMER_ITEM_ID = ____weapon_2Dconstants.HIGH_QUALITY_POLYMER_ITEM_ID
local EMS_RIFLING_ITEM_ID = ____weapon_2Dconstants.EMS_RIFLING_ITEM_ID
____exports.WeaponModule = __TS__Class()
local WeaponModule = ____exports.WeaponModule
WeaponModule.name = "WeaponModule"
function WeaponModule.prototype.____constructor(self, game)
    self.weaponItemIds = {}
    self.weaponAbilityIds = {}
    self.guns = {}
    self.projectiles = {}
    self.projectileUpdateTimer = __TS__New(Trigger)
    self.collisionCheckGroup = CreateGroup()
    self.equipWeaponAbilityId = FourCC("A004")
    self.weaponEquipTrigger = __TS__New(Trigger)
    self.weaponShootTrigger = __TS__New(Trigger)
    self.weaponDropTrigger = __TS__New(Trigger)
    self.weaponPickupTrigger = __TS__New(Trigger)
    self.game = game
    InitBurstRifle(self)
    InitSniperRifle(self)
    self:initialiseWeaponEquip()
    self:initaliseWeaponShooting()
    self:initialiseWeaponDropPickup()
    self:initProjectiles()
end
function WeaponModule.prototype.initProjectiles(self)
    local WEAPON_UPDATE_PERIOD = 0.03
    self.projectileUpdateTimer:RegisterTimerEventPeriodic(WEAPON_UPDATE_PERIOD)
    self.projectileUpdateTimer:AddAction(
        function() return self:updateProjectiles(WEAPON_UPDATE_PERIOD) end
    )
end
function WeaponModule.prototype.updateProjectiles(self, DELTA_TIME)
    self.projectiles = __TS__ArrayFilter(
        self.projectiles,
        function(____, projectile)
            local startPosition = projectile:getPosition()
            local delta = projectile:update(self, DELTA_TIME)
            if projectile:doesCollide() then
                local nextPosition = projectile:getPosition()
                self:checkCollisionsForProjectile(projectile, startPosition, nextPosition, delta)
            end
            if projectile:willDestroy() then
                return not projectile:destroy()
            end
            return true
        end
    )
end
function WeaponModule.prototype.checkCollisionsForProjectile(self, projectile, from, to, delta)
    if not projectile.filter then
        return
    end
    GroupClear(self.collisionCheckGroup)
    local centerPoint = from:add(to):multiplyN(0.5)
    local checkDist = delta:getLength() + projectile:getCollisionRadius()
    GroupEnumUnitsInRange(self.collisionCheckGroup, centerPoint.x, centerPoint.y, checkDist, projectile.filter)
    ForGroup(
        self.collisionCheckGroup,
        function()
            local unit = GetEnumUnit()
            local unitLoc = __TS__New(
                Vector3,
                GetUnitX(unit),
                GetUnitY(unit),
                0
            )
            local distance = unitLoc:distanceToLine(from, to)
            if distance < (projectile:getCollisionRadius() + BlzGetUnitCollisionSize(unit)) then
                projectile:collide(self, unit)
            end
        end
    )
end
function WeaponModule.prototype.addProjectile(self, projectile)
    __TS__ArrayPush(self.projectiles, projectile)
end
function WeaponModule.prototype.getGunForItem(self, item)
    for ____, gun in ipairs(self.guns) do
        if gun.item == item then
            return gun
        end
    end
    return nil
end
function WeaponModule.prototype.getGunForUnit(self, unit)
    for ____, gun in ipairs(self.guns) do
        if gun.equippedTo and gun.equippedTo.unit == unit then
            return gun
        end
    end
end
function WeaponModule.prototype.initialiseWeaponEquip(self)
    self.weaponEquipTrigger:RegisterAnyUnitEventBJ(EVENT_PLAYER_UNIT_SPELL_EFFECT)
    self.weaponEquipTrigger:AddCondition(
        function()
            local spellId = GetSpellAbilityId()
            return spellId == self.equipWeaponAbilityId
        end
    )
    self.weaponEquipTrigger:AddAction(
        function()
            local unit = GetTriggerUnit()
            local orderId = GetUnitCurrentOrder(unit)
            local itemSlot = orderId - 852008
            local item = UnitItemInSlot(unit, itemSlot)
            local crewmember = self.game.crewModule:getCrewmemberForUnit(unit)
            if crewmember then
                self:applyItemEquip(crewmember, item)
            end
        end
    )
end
function WeaponModule.prototype.applyItemEquip(self, unit, item)
    local itemId = GetItemTypeId(item)
    local itemIsWeapon = self:itemIsWeapon(itemId)
    local itemIsAttachment = self:itemIsAttachment(itemId)
    if itemIsWeapon then
        local oldWeapon = self:getGunForUnit(unit.unit)
        local weaponForItem = self:getGunForItem(item) or self:createWeaponForId(item, unit)
        if oldWeapon then
            oldWeapon:onRemove(self)
        end
        if weaponForItem then
            __TS__ArrayPush(self.guns, weaponForItem)
            weaponForItem:onAdd(self, unit)
        end
    elseif itemIsAttachment then
        if unit.weapon then
            local attachment = self:createAttachmentForId(item)
            if attachment then
                attachment:attachTo(unit.weapon)
                unit.weapon:updateTooltip(self, unit)
            end
        end
    else
        Log.Warning(
            "Warning, item " .. tostring(itemId) .. " is being attached but is not attachment or weapon"
        )
    end
end
function WeaponModule.prototype.initaliseWeaponShooting(self)
    self.weaponShootTrigger:RegisterAnyUnitEventBJ(EVENT_PLAYER_UNIT_SPELL_EFFECT)
    self.weaponShootTrigger:AddCondition(
        function() return __TS__ArrayIndexOf(
            self.weaponAbilityIds,
            GetSpellAbilityId()
        ) >= 0 end
    )
    self.weaponShootTrigger:AddAction(
        function()
            local unit = GetTriggerUnit()
            local targetLocation = GetSpellTargetLoc()
            local targetLoc = __TS__New(
                Vector3,
                GetLocationX(targetLocation),
                GetLocationY(targetLocation),
                GetLocationZ(targetLocation)
            )
            local crewmember = self.game.crewModule:getCrewmemberForUnit(unit)
            local weapon = self:getGunForUnit(unit)
            if weapon and crewmember then
                local targetedUnit = GetSpellTargetUnit()
                if targetedUnit then
                    self.game.forceModule:aggressionBetweenTwoPlayers(
                        GetOwningPlayer(unit),
                        GetOwningPlayer(targetedUnit)
                    )
                end
                weapon:onShoot(self, crewmember, targetLoc)
            end
            RemoveLocation(targetLocation)
        end
    )
end
function WeaponModule.prototype.initialiseWeaponDropPickup(self)
    self.weaponDropTrigger:RegisterAnyUnitEventBJ(EVENT_PLAYER_UNIT_DROP_ITEM)
    self.weaponDropTrigger:AddCondition(
        function()
            local gun = self:getGunForItem(
                GetManipulatedItem()
            )
            if gun then
                gun:onRemove(self)
            end
            return false
        end
    )
    self.weaponPickupTrigger:RegisterAnyUnitEventBJ(EVENT_PLAYER_UNIT_PICKUP_ITEM)
    self.weaponPickupTrigger:AddCondition(
        function()
            local gun = self:getGunForItem(
                GetManipulatedItem()
            )
            local crewmember = self.game.crewModule and self.game.crewModule:getCrewmemberForUnit(
                GetManipulatingUnit()
            )
            if gun and crewmember then
                gun:updateTooltip(self, crewmember)
            end
            return false
        end
    )
end
function WeaponModule.prototype.itemIsWeapon(self, itemId)
    if itemId == SNIPER_ITEM_ID then
        return true
    end
    if itemId == BURST_RIFLE_ITEM_ID then
        return true
    end
    return false
end
function WeaponModule.prototype.itemIsAttachment(self, itemId)
    if itemId == HIGH_QUALITY_POLYMER_ITEM_ID then
        return true
    end
    if itemId == EMS_RIFLING_ITEM_ID then
        return true
    end
    return false
end
function WeaponModule.prototype.createWeaponForId(self, item, unit)
    local itemId = GetItemTypeId(item)
    if itemId == SNIPER_ITEM_ID then
        return __TS__New(SniperRifle, item, unit)
    elseif itemId == BURST_RIFLE_ITEM_ID then
        return __TS__New(BurstRifle, item, unit)
    end
    return nil
end
function WeaponModule.prototype.createAttachmentForId(self, item)
    local itemId = GetItemTypeId(item)
    if itemId == HIGH_QUALITY_POLYMER_ITEM_ID then
        return __TS__New(HighQualityPolymer, item)
    end
    if itemId == EMS_RIFLING_ITEM_ID then
        return __TS__New(EmsRifling, item)
    end
    return nil
end
return ____exports
end,
["src.app.weapons.guns.gun"] = function() require("lualib_bundle");
local ____exports = {}
local ____translators = require("src.lib.translators")
local PlayNewSoundOnUnit = ____translators.PlayNewSoundOnUnit
____exports.Gun = __TS__Class()
local Gun = ____exports.Gun
Gun.name = "Gun"
function Gun.prototype.____constructor(self, item, equippedTo)
    self.name = "default"
    self.item = item
    self.equippedTo = equippedTo
end
function Gun.prototype.onAdd(self, weaponModule, caster)
    self.equippedTo = caster
    self.equippedTo:onWeaponAdd(weaponModule, self)
    UnitAddAbility(
        caster.unit,
        self:getAbilityId()
    )
    self:updateTooltip(weaponModule, caster)
    local sound = PlayNewSoundOnUnit("Sounds\\attachToGun.mp3", caster.unit, 50)
    if self.attachment then
        self.attachment:onEquip(self)
    end
    if self.remainingCooldown and self.remainingCooldown > 0 then
        print("Reforged better add a way to set cooldowns remaining")
    end
end
function Gun.prototype.onRemove(self, weaponModule)
    if self.equippedTo then
        UnitRemoveAbility(
            self.equippedTo.unit,
            self:getAbilityId()
        )
        self.remainingCooldown = BlzGetUnitAbilityCooldownRemaining(
            self.equippedTo.unit,
            self:getAbilityId()
        )
        self.equippedTo:onWeaponRemove(weaponModule, self)
        if self.attachment then
            self.attachment:onUnequip(self)
        end
        self.equippedTo = nil
    end
end
function Gun.prototype.updateTooltip(self, weaponModule, caster)
    local itemTooltip = self:getItemTooltip(weaponModule, caster)
    BlzSetItemExtendedTooltip(self.item, itemTooltip)
    if self.equippedTo then
        local owner = GetOwningPlayer(self.equippedTo.unit)
        local newTooltip = self:getTooltip(weaponModule, caster)
        if GetLocalPlayer() == owner then
            BlzSetAbilityExtendedTooltip(
                self:getAbilityId(),
                newTooltip,
                0
            )
        end
    end
end
function Gun.prototype.onShoot(self, weaponModule, caster, targetLocation)
    self.remainingCooldown = weaponModule.game:getTimeStamp()
end
function Gun.prototype.attach(self, attachment)
    if self.attachment then
        self:detach()
    end
    self.attachment = attachment
    return true
end
function Gun.prototype.detach(self)
    if self.attachment then
        self.attachment:unattach()
        self.attachment = nil
    end
end
return ____exports
end,
["src.app.buff.buff-instance"] = function() require("lualib_bundle");
local ____exports = {}
____exports.BuffInstance = __TS__Class()
local BuffInstance = ____exports.BuffInstance
BuffInstance.name = "BuffInstance"
function BuffInstance.prototype.____constructor(self)
end
____exports.BuffInstanceDuration = __TS__Class()
local BuffInstanceDuration = ____exports.BuffInstanceDuration
BuffInstanceDuration.name = "BuffInstanceDuration"
BuffInstanceDuration.____super = ____exports.BuffInstance
setmetatable(BuffInstanceDuration, BuffInstanceDuration.____super)
setmetatable(BuffInstanceDuration.prototype, BuffInstanceDuration.____super.prototype)
function BuffInstanceDuration.prototype.____constructor(self, when, dur)
    BuffInstanceDuration.____super.prototype.____constructor(self)
    self.endTimestamp = when + dur
end
function BuffInstanceDuration.prototype.isActive(self, currentTimeStamp)
    return self.endTimestamp > currentTimeStamp
end
____exports.BuffInstanceCallback = __TS__Class()
local BuffInstanceCallback = ____exports.BuffInstanceCallback
BuffInstanceCallback.name = "BuffInstanceCallback"
BuffInstanceCallback.____super = ____exports.BuffInstance
setmetatable(BuffInstanceCallback, BuffInstanceCallback.____super)
setmetatable(BuffInstanceCallback.prototype, BuffInstanceCallback.____super.prototype)
function BuffInstanceCallback.prototype.____constructor(self, cb)
    BuffInstanceCallback.____super.prototype.____constructor(self)
    self.cb = function() return cb() end
end
function BuffInstanceCallback.prototype.isActive(self, currentTimeStamp)
    return self:cb()
end
____exports.DynamicBuff = __TS__Class()
local DynamicBuff = ____exports.DynamicBuff
DynamicBuff.name = "DynamicBuff"
function DynamicBuff.prototype.____constructor(self)
    self.isActive = false
    self.instances = {}
    self.onChangeCallbacks = {}
end
function DynamicBuff.prototype.addInstance(self, game, crewmember, instance)
    local wasActive = self.isActive
    self.isActive = true
    __TS__ArrayPush(self.instances, instance)
    if wasActive ~= self.isActive then
        __TS__ArrayForEach(
            self.onChangeCallbacks,
            function(____, cb) return cb(self) end
        )
        self:onStatusChange(game, true)
    end
end
function DynamicBuff.prototype.process(self, game, delta)
    local timestamp = game:getTimeStamp()
    local wasActive = #self.instances > 0
    self.instances = __TS__ArrayFilter(
        self.instances,
        function(____, i) return i:isActive(timestamp) end
    )
    local isActive = #self.instances > 0
    if wasActive ~= isActive then
        self.isActive = false
        self:onStatusChange(game, false)
    end
    return isActive
end
function DynamicBuff.prototype.onChange(self, cb)
    __TS__ArrayPush(self.onChangeCallbacks, cb)
end
function DynamicBuff.prototype.getIsActive(self)
    return self.isActive
end
return ____exports
end,
["src.app.types.sound-ref"] = function() require("lualib_bundle");
local ____exports = {}
____exports.SoundRef = __TS__Class()
local SoundRef = ____exports.SoundRef
SoundRef.name = "SoundRef"
function SoundRef.prototype.____constructor(self, sound, looping)
    self.sound = CreateSound(sound, looping, false, false, 0, 3, "")
end
function SoundRef.prototype.playSound(self)
    StartSound(self.sound)
end
function SoundRef.prototype.setVolume(self, volume)
    SetSoundVolume(self.sound, volume)
end
function SoundRef.prototype.stopSound(self)
    StopSound(self.sound, false, true)
end
____exports.SoundWithCooldown = __TS__Class()
local SoundWithCooldown = ____exports.SoundWithCooldown
SoundWithCooldown.name = "SoundWithCooldown"
SoundWithCooldown.____super = ____exports.SoundRef
setmetatable(SoundWithCooldown, SoundWithCooldown.____super)
setmetatable(SoundWithCooldown.prototype, SoundWithCooldown.____super.prototype)
function SoundWithCooldown.prototype.____constructor(self, cooldown, sound)
    SoundWithCooldown.____super.prototype.____constructor(self, sound, false)
    self.cooldown = cooldown
end
function SoundWithCooldown.prototype.canPlaySound(self, currentTime)
    local doPlaySound = not self.timePlayed or ((currentTime - self.timePlayed) > self.cooldown)
    if doPlaySound then
        self.timePlayed = currentTime
        return true
    end
    return false
end
return ____exports
end,
["src.app.buff.resolve"] = function() require("lualib_bundle");
local ____exports = {}
local ____buff_2Dinstance = require("src.app.buff.buff-instance")
local DynamicBuff = ____buff_2Dinstance.DynamicBuff
local ____sound_2Dref = require("src.app.types.sound-ref")
local SoundWithCooldown = ____sound_2Dref.SoundWithCooldown
local SoundRef = ____sound_2Dref.SoundRef
local RESOLVE_ABILITY_ID = FourCC("A008")
local RESOLVE_BUFF_ID = FourCC("B001")
____exports.Resolve = __TS__Class()
local Resolve = ____exports.Resolve
Resolve.name = "Resolve"
Resolve.____super = DynamicBuff
setmetatable(Resolve, Resolve.____super)
setmetatable(Resolve.prototype, Resolve.____super.prototype)
function Resolve.prototype.____constructor(self, game, crewmember)
    DynamicBuff.prototype.____constructor(self)
    self.breathSound = __TS__New(SoundWithCooldown, 10, "Sounds\\HeavyBreath.mp3")
    self.resolveMusic = __TS__New(SoundRef, "Music\\KavinskyRampage.mp3", true)
    self.crewmember = crewmember
end
function Resolve.prototype.onStatusChange(self, game, newStatus)
    if newStatus then
        self.resolveMusic:setVolume(15)
        if GetLocalPlayer() == self.crewmember.player then
            StopMusic(true)
            self.breathSound:playSound()
            self.resolveMusic:playSound()
        end
        if not UnitHasBuffBJ(self.crewmember.unit, RESOLVE_BUFF_ID) then
            game:useDummyFor(
                function(____self, dummy)
                    SetUnitX(
                        dummy,
                        GetUnitX(self.crewmember.unit)
                    )
                    SetUnitY(
                        dummy,
                        GetUnitY(self.crewmember.unit) + 50
                    )
                    IssueTargetOrder(dummy, "bloodlust", self.crewmember.unit)
                end,
                RESOLVE_ABILITY_ID
            )
        end
    else
        UnitRemoveBuffBJ(RESOLVE_BUFF_ID, self.crewmember.unit)
        __TS__ArrayForEach(
            self.onChangeCallbacks,
            function(____, cb) return cb(self) end
        )
        if GetLocalPlayer() == self.crewmember.player then
            self.breathSound:stopSound()
            self.resolveMusic:stopSound()
            ResumeMusic()
        end
    end
end
return ____exports
end,
["src.app.buff.despair"] = function() require("lualib_bundle");
local ____exports = {}
local ____buff_2Dinstance = require("src.app.buff.buff-instance")
local DynamicBuff = ____buff_2Dinstance.DynamicBuff
local ____sound_2Dref = require("src.app.types.sound-ref")
local SoundWithCooldown = ____sound_2Dref.SoundWithCooldown
local SoundRef = ____sound_2Dref.SoundRef
local DESPAIR_ABILITY_ID = FourCC("A00D")
local DESPAIR_BUFF_ID = FourCC("B004")
____exports.Despair = __TS__Class()
local Despair = ____exports.Despair
Despair.name = "Despair"
Despair.____super = DynamicBuff
setmetatable(Despair, Despair.____super)
setmetatable(Despair.prototype, Despair.____super.prototype)
function Despair.prototype.____constructor(self, game, crewmember)
    DynamicBuff.prototype.____constructor(self)
    self.jumpScareSound = __TS__New(SoundWithCooldown, 10, "Sounds\\HeavyBreath.mp3")
    self.despairMusic = __TS__New(SoundRef, "Music\\FlightIntoTheUnkown.mp3", true)
    self.despairMusic:setVolume(127)
    self.crewmember = crewmember
    self.prevUnitHealth = GetUnitState(self.crewmember.unit, UNIT_STATE_LIFE)
end
function Despair.prototype.process(self, game, delta)
    local result = DynamicBuff.prototype.process(self, game, delta)
    local currentHealth = GetUnitState(self.crewmember.unit, UNIT_STATE_LIFE)
    local deltaHealth = currentHealth - self.prevUnitHealth
    if deltaHealth > 0 then
        SetUnitState(self.crewmember.unit, UNIT_STATE_LIFE, currentHealth - deltaHealth / 2)
    end
    return result
end
function Despair.prototype.onStatusChange(self, game, newStatus)
    if newStatus then
        self.despairMusic:setVolume(127)
        if GetLocalPlayer() == self.crewmember.player then
            StopMusic(true)
            self.despairMusic:playSound()
            self.jumpScareSound:playSound()
        end
        if not UnitHasBuffBJ(self.crewmember.unit, DESPAIR_BUFF_ID) then
            game:useDummyFor(
                function(____self, dummy)
                    SetUnitX(
                        dummy,
                        GetUnitX(self.crewmember.unit)
                    )
                    SetUnitY(
                        dummy,
                        GetUnitY(self.crewmember.unit) + 50
                    )
                    IssueTargetOrder(dummy, "faeriefire", self.crewmember.unit)
                end,
                DESPAIR_ABILITY_ID
            )
        end
    else
        UnitRemoveBuffBJ(DESPAIR_BUFF_ID, self.crewmember.unit)
        __TS__ArrayForEach(
            self.onChangeCallbacks,
            function(____, cb) return cb(self) end
        )
        if GetLocalPlayer() == self.crewmember.player then
            self.despairMusic:stopSound()
            self.jumpScareSound:stopSound()
            ResumeMusic()
        end
    end
end
return ____exports
end,
["src.app.crewmember.crewmember-type"] = function() require("lualib_bundle");
local ____exports = {}
local ____resolve = require("src.app.buff.resolve")
local Resolve = ____resolve.Resolve
local ____unit_2Dhas_2Dweapon = require("src.app.weapons.guns.unit-has-weapon")
local ArmableUnit = ____unit_2Dhas_2Dweapon.ArmableUnit
local ____despair = require("src.app.buff.despair")
local Despair = ____despair.Despair
local ____buff_2Dinstance = require("src.app.buff.buff-instance")
local BuffInstanceCallback = ____buff_2Dinstance.BuffInstanceCallback
____exports.Crewmember = __TS__Class()
local Crewmember = ____exports.Crewmember
Crewmember.name = "Crewmember"
Crewmember.____super = ArmableUnit
setmetatable(Crewmember, Crewmember.____super)
setmetatable(Crewmember.prototype, Crewmember.____super.prototype)
function Crewmember.prototype.____constructor(self, game, player, unit)
    ArmableUnit.prototype.____constructor(self, unit)
    self.role = ""
    self.name = ""
    self.baseAccuracy = 100
    self.player = player
    self.unit = unit
    self.resolve = __TS__New(Resolve, game, self)
    self.despair = __TS__New(Despair, game, self)
    self.resolve:onChange(
        function() return self.weapon and self.weapon:updateTooltip(game.weaponModule, self) end
    )
    self.despair:onChange(
        function() return self.weapon and self.weapon:updateTooltip(game.weaponModule, self) end
    )
end
function Crewmember.prototype.setUnit(self, unit)
    self.unit = unit
end
function Crewmember.prototype.setRole(self, role)
    self.role = role
end
function Crewmember.prototype.setName(self, name)
    self.name = name
end
function Crewmember.prototype.setPlayer(self, player)
    self.player = player
end
function Crewmember.prototype.onWeaponAdd(self, weaponModule, whichGun)
    self.weapon = whichGun
end
function Crewmember.prototype.onWeaponRemove(self, weaponModule, whichGun)
    self.weapon = nil
end
function Crewmember.prototype.onDamage(self, game)
    local resolveActive = self.resolve:getIsActive()
    local maxHP = BlzGetUnitMaxHP(self.unit)
    local hpPercentage = (GetUnitState(self.unit, UNIT_STATE_LIFE) - GetEventDamage()) * 0.7 / maxHP
    local ____ = GetUnitLifePercent
    if not resolveActive and hpPercentage <= 0.3 then
        self.resolve:addInstance(
            game,
            self,
            __TS__New(
                BuffInstanceCallback,
                function()
                    return GetUnitLifePercent(self.unit) <= 30
                end
            )
        )
    end
    if resolveActive then
        BlzSetEventDamage(
            GetEventDamage() * 0.7
        )
    end
end
function Crewmember.prototype.getAccuracy(self)
    local modifier = 0
    if self.resolve:getIsActive() then
        modifier = modifier + 10
    end
    if self.despair:getIsActive() then
        modifier = modifier - 75
    end
    return self.baseAccuracy + modifier
end
function Crewmember.prototype.addDespair(self, game, instance)
    self.despair:addInstance(game, self, instance)
end
function Crewmember.prototype.testResolve(self, game)
    SetUnitLifePercentBJ(self.unit, 0.2)
    self.resolve:addInstance(
        game,
        self,
        __TS__New(
            BuffInstanceCallback,
            function()
                return GetUnitLifePercent(self.unit) <= 30
            end
        )
    )
end
function Crewmember.prototype.log(self)
    print("+++ Crewmember Information +++")
    print(
        "Who: " .. tostring(self.name)
    )
    print(
        "Position: " .. tostring(self.role)
    )
end
return ____exports
end,
["src.app.crewmember.crewmember-names"] = function() local ____exports = {}
____exports.ROLE_NAMES = {Captain = {"Captain Keene", "Captain Kirk", "Captain Jack Sparrow", "Captain Creed", "Captain Coloma", "Captain Dallas", "Captain Cutter", "Captain Reynolds", "Captain Willard", "Captain Fodder", "Captain Cookie"}, Navigator = {"Admiral Ackbar", "Admiral Doubt", "Admiral Hansel", "Admiral Gretel", "Admiral Jones", "Admiral Aedus", "Admiral Alex"}, ["Security Guard"] = {"Pvt Clarke", "Pvt. \"Slick\" Jones", "Col. Kaedin", "Sly Marbo", "Pvt. Frost", "Pvt. Riley", "Pvt. Blake", "Pvt. Vasquez", "Pvt. Allen", "Pvt. Jenkins", "Pvt. Summers", "Pvt. Pyle", "Pvt. Harding", "Pvt. Hudson", "Cpl. Baker", "Cpl. Hicks", "Cpl. Emerich", "Cpl. Dilan", "Cpl. Collins", "Cpl. Duncan"}}
return ____exports
end,
["src.app.force.force-type"] = function() require("lualib_bundle");
local ____exports = {}
____exports.ForceType = __TS__Class()
local ForceType = ____exports.ForceType
ForceType.name = "ForceType"
function ForceType.prototype.____constructor(self)
    self.players = {}
end
function ForceType.prototype.is(self, name)
    return self.name == name
end
function ForceType.prototype.hasPlayer(self, who)
    return __TS__ArrayIndexOf(self.players, who) >= 0
end
function ForceType.prototype.addPlayer(self, who)
    __TS__ArrayPush(self.players, who)
end
function ForceType.prototype.removePlayer(self, who)
    local idx = __TS__ArrayIndexOf(self.players, who)
    if idx >= 0 then
        __TS__ArraySplice(self.players, idx, 1)
    end
end
return ____exports
end,
["src.app.force.alien-force"] = function() require("lualib_bundle");
local ____exports = {}
local ____force_2Dtype = require("src.app.force.force-type")
local ForceType = ____force_2Dtype.ForceType
____exports.ALIEN_FORCE_NAME = "ALIEN"
____exports.AlienForce = __TS__Class()
local AlienForce = ____exports.AlienForce
AlienForce.name = "AlienForce"
AlienForce.____super = ForceType
setmetatable(AlienForce, AlienForce.____super)
setmetatable(AlienForce.prototype, AlienForce.____super.prototype)
function AlienForce.prototype.____constructor(self, ...)
    ForceType.prototype.____constructor(self, ...)
    self.name = ____exports.ALIEN_FORCE_NAME
end
function AlienForce.prototype.setHost(self, who)
    self.alienHost = who
end
function AlienForce.prototype.getHost(self)
    return self.alienHost
end
function AlienForce.prototype.checkVictoryConditions(self, forceModule)
    return #self.players > 0
end
return ____exports
end,
["src.app.force.observer-force"] = function() require("lualib_bundle");
local ____exports = {}
local ____force_2Dtype = require("src.app.force.force-type")
local ForceType = ____force_2Dtype.ForceType
____exports.OBSERVER_FORCE_NAME = "OBS"
____exports.ObserverForce = __TS__Class()
local ObserverForce = ____exports.ObserverForce
ObserverForce.name = "ObserverForce"
ObserverForce.____super = ForceType
setmetatable(ObserverForce, ObserverForce.____super)
setmetatable(ObserverForce.prototype, ObserverForce.____super.prototype)
function ObserverForce.prototype.____constructor(self, ...)
    ForceType.prototype.____constructor(self, ...)
    self.name = ____exports.OBSERVER_FORCE_NAME
end
function ObserverForce.prototype.checkVictoryConditions(self, forceModule)
    return false
end
return ____exports
end,
["src.app.force.force-module"] = function() require("lualib_bundle");
local ____exports = {}
local ____serilog = require("src.lib.serilog.serilog")
local Log = ____serilog.Log
local ____crewmember_2Dforce = require("src.app.force.crewmember-force")
local CrewmemberForce = ____crewmember_2Dforce.CrewmemberForce
local ____observer_2Dforce = require("src.app.force.observer-force")
local ObserverForce = ____observer_2Dforce.ObserverForce
____exports.ForceModule = __TS__Class()
local ForceModule = ____exports.ForceModule
ForceModule.name = "ForceModule"
function ForceModule.prototype.____constructor(self, game)
    self.forces = {}
    __TS__ArrayPush(
        self.forces,
        __TS__New(CrewmemberForce)
    )
    __TS__ArrayPush(
        self.forces,
        __TS__New(ObserverForce)
    )
    self.neutralPassive = Player(22)
    self.neutralHostile = Player(23)
end
function ForceModule.prototype.aggressionBetweenTwoPlayers(self, player1, player2)
    Log.Information(
        "Player aggression between " .. tostring(
            GetPlayerName(player1)
        ) .. " and " .. tostring(
            GetPlayerName(player2)
        )
    )
    SetPlayerAllianceStateAllyBJ(player1, player2, false)
    SetPlayerAllianceStateAllyBJ(player2, player1, false)
end
function ForceModule.prototype.checkVictoryConditions(self)
    local winningForces = __TS__ArrayFilter(
        self.forces,
        function(____, f) return f:checkVictoryConditions(self) end
    )
    return (#winningForces == 1) and winningForces[1] or nil
end
function ForceModule.prototype.getActivePlayers(self)
    local result = {}
    do
        local i = 0
        while i < GetBJMaxPlayerSlots() do
            local currentPlayer = Player(i)
            local isPlaying = GetPlayerSlotState(currentPlayer) == PLAYER_SLOT_STATE_PLAYING
            local isUser = GetPlayerController(currentPlayer) == MAP_CONTROL_USER
            if isPlaying and isUser then
                __TS__ArrayPush(
                    result,
                    Player(i)
                )
            end
            i = i + 1
        end
    end
    return result
end
function ForceModule.prototype.getForce(self, whichForce)
    return __TS__ArrayFilter(
        self.forces,
        function(____, f) return f:is(whichForce) end
    )[1]
end
return ____exports
end,
["src.app.force.crewmember-force"] = function() require("lualib_bundle");
local ____exports = {}
local ____force_2Dtype = require("src.app.force.force-type")
local ForceType = ____force_2Dtype.ForceType
____exports.CREW_FORCE_NAME = "CREW"
____exports.CrewmemberForce = __TS__Class()
local CrewmemberForce = ____exports.CrewmemberForce
CrewmemberForce.name = "CrewmemberForce"
CrewmemberForce.____super = ForceType
setmetatable(CrewmemberForce, CrewmemberForce.____super)
setmetatable(CrewmemberForce.prototype, CrewmemberForce.____super.prototype)
function CrewmemberForce.prototype.____constructor(self, ...)
    ForceType.prototype.____constructor(self, ...)
    self.name = ____exports.CREW_FORCE_NAME
end
function CrewmemberForce.prototype.checkVictoryConditions(self, forceModule)
    return #self.players > 0
end
return ____exports
end,
["src.app.world.zone-id"] = function() local ____exports = {}
____exports.ZONE_TYPE = {}
____exports.ZONE_TYPE.FLOOR_1 = 0
____exports.ZONE_TYPE[____exports.ZONE_TYPE.FLOOR_1] = "FLOOR_1"
____exports.ZONE_TYPE.FLOOR_2 = 1
____exports.ZONE_TYPE[____exports.ZONE_TYPE.FLOOR_2] = "FLOOR_2"
____exports.ZONE_TYPE.FLOOR_3 = 2
____exports.ZONE_TYPE[____exports.ZONE_TYPE.FLOOR_3] = "FLOOR_3"
____exports.ZONE_TYPE.VENTRATION = 3
____exports.ZONE_TYPE[____exports.ZONE_TYPE.VENTRATION] = "VENTRATION"
return ____exports
end,
["src.app.crewmember.crewmember-module"] = function() require("lualib_bundle");
local ____exports = {}
local ____crewmember_2Dtype = require("src.app.crewmember.crewmember-type")
local Crewmember = ____crewmember_2Dtype.Crewmember
local ____crewmember_2Dnames = require("src.app.crewmember.crewmember-names")
local ROLE_NAMES = ____crewmember_2Dnames.ROLE_NAMES
local ____trigger = require("src.app.types.jass-overrides.trigger")
local Trigger = ____trigger.Trigger
local ____serilog = require("src.lib.serilog.serilog")
local Log = ____serilog.Log
local ____weapon_2Dconstants = require("src.app.weapons.weapon-constants")
local BURST_RIFLE_ITEM_ID = ____weapon_2Dconstants.BURST_RIFLE_ITEM_ID
local ____crewmember_2Dforce = require("src.app.force.crewmember-force")
local CREW_FORCE_NAME = ____crewmember_2Dforce.CREW_FORCE_NAME
local ____zone_2Did = require("src.app.world.zone-id")
local ZONE_TYPE = ____zone_2Did.ZONE_TYPE
local CREWMEMBER_UNIT_ID = FourCC("H001")
local DELTA_CHECK = 0.25
____exports.CrewModule = __TS__Class()
local CrewModule = ____exports.CrewModule
CrewModule.name = "CrewModule"
function CrewModule.prototype.____constructor(self, game)
    self.CREW_MEMBERS = {}
    self.AVAILABLE_ROLES = {}
    self.game = game
    local playerList = game.forceModule:getActivePlayers()
    local crewForce = game.forceModule:getForce(CREW_FORCE_NAME)
    self:initialiseRoles(playerList)
    __TS__ArrayForEach(
        playerList,
        function(____, player)
            local crew = self:createCrew(
                game,
                GetPlayerId(player)
            )
            __TS__ArrayPush(self.CREW_MEMBERS, crew)
            local ____ = crewForce and crewForce:addPlayer(player)
            game.worldModule:travel(crew.unit, ZONE_TYPE.FLOOR_1)
        end
    )
    self.crewmemberDamageTrigger = __TS__New(Trigger)
    self.crewmemberDamageTrigger:RegisterUnitTakesDamage()
    self.crewmemberDamageTrigger:AddCondition(
        function()
            local player = GetOwningPlayer(
                GetTriggerUnit()
            )
            return (GetPlayerId(player) <= 22)
        end
    )
    self.crewmemberDamageTrigger:AddAction(
        function()
            local unit = GetTriggerUnit()
            local crew = self:getCrewmemberForUnit(unit)
            if crew then
                crew:onDamage(game)
            end
        end
    )
    local updateCrewTrigger = __TS__New(Trigger)
    updateCrewTrigger:RegisterTimerEventPeriodic(DELTA_CHECK)
    updateCrewTrigger:AddAction(
        function() return self:processCrew(DELTA_CHECK) end
    )
end
function CrewModule.prototype.initialiseRoles(self, players)
    __TS__ArrayForEach(
        players,
        function(____, p, index)
            if index == 0 then
                __TS__ArrayPush(self.AVAILABLE_ROLES, "Captain")
            else
                __TS__ArrayPush(self.AVAILABLE_ROLES, "Security Guard")
            end
        end
    )
end
function CrewModule.prototype.processCrew(self, time)
    __TS__ArrayForEach(
        self.CREW_MEMBERS,
        function(____, crew)
            crew.resolve:process(self.game, time)
            crew.despair:process(self.game, time)
        end
    )
end
function CrewModule.prototype.createCrew(self, game, playerId)
    local nPlayer = Player(playerId)
    local nUnit = CreateUnit(nPlayer, CREWMEMBER_UNIT_ID, 0, 0, bj_UNIT_FACING)
    local crewmember = __TS__New(Crewmember, game, nPlayer, nUnit)
    crewmember:setRole(
        self:getCrewmemberRole()
    )
    crewmember:setName(
        self:getCrewmemberName(crewmember.role)
    )
    crewmember:setPlayer(nPlayer)
    BlzShowUnitTeamGlow(crewmember.unit, false)
    BlzSetUnitName(nUnit, crewmember.role)
    BlzSetHeroProperName(nUnit, crewmember.name)
    Log.Information(
        "Created Crewmember " .. tostring(crewmember.name) .. "::" .. tostring(crewmember.role)
    )
    if crewmember.role then
        local item = CreateItem(BURST_RIFLE_ITEM_ID, 0, 0)
        UnitAddItem(crewmember.unit, item)
        game.weaponModule:applyItemEquip(crewmember, item)
    end
    game.worldModule:travel(crewmember.unit, ZONE_TYPE.FLOOR_1)
    return crewmember
end
function CrewModule.prototype.getCrewmemberRole(self)
    local i = math.floor(
        math.random() * #self.AVAILABLE_ROLES
    )
    local role = self.AVAILABLE_ROLES[i + 1]
    __TS__ArraySplice(self.AVAILABLE_ROLES, i, 1)
    return role
end
function CrewModule.prototype.getCrewmemberName(self, role)
    local namesForRole
    if role == "Captain" then
        namesForRole = ROLE_NAMES.Captain
    else
        namesForRole = ROLE_NAMES["Security Guard"]
    end
    local i = math.floor(
        math.random() * #namesForRole
    )
    local name = namesForRole[i + 1]
    __TS__ArraySplice(namesForRole, i, 1)
    return name
end
function CrewModule.prototype.getCrewmemberForPlayer(self, player)
    for ____, member in ipairs(self.CREW_MEMBERS) do
        if member.player == player then
            return member
        end
    end
end
function CrewModule.prototype.getCrewmemberForUnit(self, unit)
    for ____, member in ipairs(self.CREW_MEMBERS) do
        if member.unit == unit then
            return member
        end
    end
end
return ____exports
end,
["src.app.space.ship"] = function() require("lualib_bundle");
local ____exports = {}
local ____vector2 = require("src.app.types.vector2")
local Vector2 = ____vector2.Vector2
____exports.Ship = __TS__Class()
local Ship = ____exports.Ship
Ship.name = "Ship"
function Ship.prototype.____constructor(self, startX, startY)
    self.mass = 1
    self.acceleration = 200
    self.accelerationBackwards = 25
    self.velocity = 0
    self.velocityForwardMax = 1200
    self.velocityBackwardsMax = 500
    self.isMovingBackwards = false
    self.isGoingToStop = false
    self.position = __TS__New(Vector2, startX, startY)
    self.momentum = __TS__New(Vector2, 0, 0)
    self.thrust = __TS__New(Vector2, 0, 0)
end
function Ship.prototype.updateThrust(self, deltaTime)
    if self.unit then
        local shipFacing = GetUnitFacing(self.unit)
        if self.isGoingToStop then
            local changeBy = self.isMovingBackwards and self.acceleration or self.accelerationBackwards
            if self.velocity < changeBy then
                self.velocity = 0
                self.isGoingToStop = false
            else
                self.velocity = self.velocity - changeBy
            end
        end
        local thrust = __TS__New(
            Vector2,
            Cos(shipFacing * bj_DEGTORAD),
            Sin(shipFacing * bj_DEGTORAD)
        )
        self.momentum = thrust:multiplyN(self.velocity)
        if self.isMovingBackwards then
            self.momentum = __TS__New(Vector2, -self.momentum.x, -self.momentum.y)
        end
    end
    return self
end
function Ship.prototype.applyThrust(self, deltaTime)
    local maximum = self.isMovingBackwards and self.velocityForwardMax or self.velocityBackwardsMax
    self.momentum = self.momentum:add(
        self.thrust:multiplyN(deltaTime)
    )
    local length = self.momentum:getLength()
    if length > maximum then
        self.momentum:setLengthN(maximum)
    end
    return self
end
function Ship.prototype.updatePosition(self, deltaTime, mainShipDelta)
    self.position = self.position:add(
        self.momentum:multiplyN(deltaTime)
    )
    if mainShipDelta then
        self.position = self.position:subtract(mainShipDelta)
    end
    if self.unit then
        SetUnitX(self.unit, self.position.x)
        SetUnitY(self.unit, self.position.y)
    end
    return self
end
function Ship.prototype.increaseVelocity(self)
    self.isGoingToStop = false
    if self.isMovingBackwards then
        self.velocity = self.velocity - self.acceleration
        if self.velocity < 0 then
            self.isMovingBackwards = false
            self.velocity = self.acceleration + self.velocity
        end
    else
        self.velocity = self.velocity + self.acceleration
    end
    self:applyVelocityCap()
    return self
end
function Ship.prototype.decreaseVelocity(self)
    self.isGoingToStop = false
    if not self.isMovingBackwards then
        self.velocity = self.velocity - self.accelerationBackwards
        if self.velocity < 0 then
            self.isMovingBackwards = true
            self.velocity = self.accelerationBackwards + self.velocity
        end
    else
        self.velocity = self.velocity + self.accelerationBackwards
    end
    self:applyVelocityCap()
    return self
end
function Ship.prototype.applyVelocityCap(self)
    if self.isMovingBackwards then
        if self.velocity > self.velocityBackwardsMax then
            self.velocity = self.velocityBackwardsMax
        end
    else
        if self.velocity > self.velocityForwardMax then
            self.velocity = self.velocityForwardMax
        end
    end
end
function Ship.prototype.goToAStop(self)
    self.isGoingToStop = true
    return self
end
function Ship.prototype.getMomentum(self)
    return self.momentum
end
function Ship.prototype.getPosition(self)
    return self.position
end
function Ship.prototype.setPosition(self, pos)
    self.position = pos
end
return ____exports
end,
["src.app.space.space-objects.space-object"] = function() require("lualib_bundle");
local ____exports = {}
____exports.SpaceObject = __TS__Class()
local SpaceObject = ____exports.SpaceObject
SpaceObject.name = "SpaceObject"
function SpaceObject.prototype.____constructor(self, location)
    self.loaded = false
    self.position = location
end
function SpaceObject.prototype.updateLocation(self, delta)
    self.position = self.position:subtract(delta)
    return self
end
function SpaceObject.prototype.getLocation(self)
    return self.position
end
function SpaceObject.prototype.insideRect(self, minX, minY, maxX, maxY)
    local pos = self.position
    return pos.x > minX and pos.x < maxX and pos.y > minY and pos.y < maxY
end
function SpaceObject.prototype.isLoaded(self)
    return self.loaded
end
function SpaceObject.prototype.load(self, game)
    self.loaded = true
end
function SpaceObject.prototype.offload(self)
    self.loaded = false
end
return ____exports
end,
["src.app.space.space-objects.asteroid"] = function() require("lualib_bundle");
local ____exports = {}
local ____space_2Dobject = require("src.app.space.space-objects.space-object")
local SpaceObject = ____space_2Dobject.SpaceObject
local ____vector2 = require("src.app.types.vector2")
local Vector2 = ____vector2.Vector2
____exports.ASTEROID_UNIT_ID = FourCC("h002")
____exports.Asteroid = __TS__Class()
local Asteroid = ____exports.Asteroid
Asteroid.name = "Asteroid"
Asteroid.____super = SpaceObject
setmetatable(Asteroid, Asteroid.____super)
setmetatable(Asteroid.prototype, Asteroid.____super.prototype)
function Asteroid.prototype.____constructor(self, locX, locY)
    SpaceObject.prototype.____constructor(
        self,
        __TS__New(Vector2, locX, locY)
    )
end
function Asteroid.prototype.load(self, game)
    SpaceObject.prototype.load(self, game)
    local location = self:getLocation()
    self.unit = CreateUnit(game.forceModule.neutralPassive, ____exports.ASTEROID_UNIT_ID, location.x, location.y, bj_UNIT_FACING)
    SetUnitTimeScale(self.unit, 0.1)
    SetUnitScalePercent(
        self.unit,
        GetRandomReal(50, 300),
        GetRandomReal(50, 300),
        GetRandomReal(50, 300)
    )
    SetUnitFacing(
        self.unit,
        GetRandomReal(0, 360)
    )
end
function Asteroid.prototype.onUpdate(self)
    if self.unit then
        local loc = self:getLocation()
        SetUnitX(self.unit, loc.x)
        SetUnitY(self.unit, loc.y)
    end
end
function Asteroid.prototype.offload(self)
    SpaceObject.prototype.offload(self)
    if self.unit then
        RemoveUnit(self.unit)
    end
end
function Asteroid.prototype.pickle(self)
end
return ____exports
end,
["src.app.space.space-module"] = function() require("lualib_bundle");
local ____exports = {}
local ____ship = require("src.app.space.ship")
local Ship = ____ship.Ship
local ____trigger = require("src.app.types.jass-overrides.trigger")
local Trigger = ____trigger.Trigger
local ____asteroid = require("src.app.space.space-objects.asteroid")
local Asteroid = ____asteroid.Asteroid
____exports.SpaceModule = __TS__Class()
local SpaceModule = ____exports.SpaceModule
SpaceModule.name = "SpaceModule"
function SpaceModule.prototype.____constructor(self, game)
    self.spaceRect = gg_rct_Space
    self.shipUpdateTimer = __TS__New(Trigger)
    self.shipAbilityTrigger = __TS__New(Trigger)
    self.shipAccelAbilityId = FourCC("A001")
    self.shipDeaccelAbilityId = FourCC("A000")
    self.shipStopAbilityId = FourCC("A006")
    self.game = game
    self.ships = {}
    self.spaceObjects = {}
    local spaceX = GetRectCenterX(self.spaceRect)
    local spaceY = GetRectCenterY(self.spaceRect)
    self.mainShip = __TS__New(Ship, spaceX, spaceY)
    self.mainShip.unit = CreateUnit(
        Player(0),
        FourCC("h003"),
        spaceX,
        spaceY,
        bj_UNIT_FACING
    )
    self:createTestShip()
    local i = 0
    while i < 400 do
        i = i + 1
        self:createTestAsteroid()
    end
    self:initShips()
    self:initShipAbilities()
end
function SpaceModule.prototype.createTestShip(self)
    local unitId = FourCC("h000")
    local spaceX = GetRectCenterX(self.spaceRect)
    local spaceY = GetRectCenterY(self.spaceRect)
    local ship = __TS__New(Ship, spaceX, spaceY)
    ship.unit = CreateUnit(
        Player(0),
        unitId,
        spaceX,
        spaceY,
        bj_UNIT_FACING
    )
    __TS__ArrayPush(self.ships, ship)
end
function SpaceModule.prototype.createTestAsteroid(self)
    if not self.mainShip.unit then
        return
    end
    local x = GetUnitX(self.mainShip.unit) + GetRandomReal(-5000, 5000)
    local y = GetUnitY(self.mainShip.unit) + GetRandomReal(-5000, 5000)
    local newAsteroid = __TS__New(Asteroid, x, y)
    __TS__ArrayPush(self.spaceObjects, newAsteroid)
    newAsteroid:load(self.game)
end
function SpaceModule.prototype.initShips(self)
    local SHIP_UPDATE_PERIOD = 0.03
    self.shipUpdateTimer:RegisterTimerEventPeriodic(SHIP_UPDATE_PERIOD)
    self.shipUpdateTimer:AddAction(
        function() return self:updateShips(SHIP_UPDATE_PERIOD) end
    )
end
function SpaceModule.prototype.updateShips(self, updatePeriod)
    self.mainShip:updateThrust(updatePeriod)
    self.mainShip:applyThrust(updatePeriod)
    local oldShipPos = self.mainShip:getPosition()
    local shipDelta = self.mainShip:getMomentum():multiplyN(updatePeriod)
    __TS__ArrayForEach(
        self.spaceObjects,
        function(____, o) return o:updateLocation(shipDelta):onUpdate() end
    )
    __TS__ArrayForEach(
        self.ships,
        function(____, ship)
            ship:updateThrust(updatePeriod):applyThrust(updatePeriod):updatePosition(updatePeriod, shipDelta)
        end
    )
end
function SpaceModule.prototype.getShipForUnit(self, unit)
    if unit == self.mainShip.unit then
        return self.mainShip
    end
    for ____, ship in ipairs(self.ships) do
        if ship.unit == unit then
            return ship
        end
    end
end
function SpaceModule.prototype.initShipAbilities(self)
    self.shipAbilityTrigger:RegisterAnyUnitEventBJ(EVENT_PLAYER_UNIT_SPELL_EFFECT)
    self.shipAbilityTrigger:AddCondition(
        function() return GetSpellAbilityId() == self.shipAccelAbilityId or GetSpellAbilityId() == self.shipDeaccelAbilityId or GetSpellAbilityId() == self.shipStopAbilityId end
    )
    self.shipAbilityTrigger:AddAction(
        function()
            local unit = GetTriggerUnit()
            local castAbilityId = GetSpellAbilityId()
            local ship = self:getShipForUnit(unit)
            if ship and castAbilityId == self.shipAccelAbilityId then
                ship:increaseVelocity()
            elseif ship and castAbilityId == self.shipDeaccelAbilityId then
                ship:decreaseVelocity()
            elseif ship then
                ship:goToAStop()
            end
        end
    )
end
return ____exports
end,
["src.app.types.game-time-elapsed"] = function() require("lualib_bundle");
local ____exports = {}
____exports.GameTimeElapsed = __TS__Class()
local GameTimeElapsed = ____exports.GameTimeElapsed
GameTimeElapsed.name = "GameTimeElapsed"
function GameTimeElapsed.prototype.____constructor(self)
    self.everyTenSeconds = 0
    self.globalTimer = CreateTimer()
    TimerStart(
        self.globalTimer,
        10000,
        false,
        function() return self:incrementTimer() end
    )
end
function GameTimeElapsed.prototype.incrementTimer(self)
    self.everyTenSeconds = self.everyTenSeconds + 1
    TimerStart(
        self.globalTimer,
        10000,
        false,
        function() return self:incrementTimer() end
    )
end
function GameTimeElapsed.prototype.getTimeElapsed(self)
    return self.everyTenSeconds * 10 + TimerGetElapsed(self.globalTimer)
end
return ____exports
end,
["src.app.shops.gene-modules"] = function() require("lualib_bundle");
local ____exports = {}
____exports.GeneModule = __TS__Class()
local GeneModule = ____exports.GeneModule
GeneModule.name = "GeneModule"
function GeneModule.prototype.____constructor(self, game)
end
return ____exports
end,
["src.app.abilities.ability-type"] = function() local ____exports = {}
return ____exports
end,
["src.app.abilities.human.roll-sprint"] = function() require("lualib_bundle");
local ____exports = {}
local ____vector2 = require("src.app.types.vector2")
local vectorFromUnit = ____vector2.vectorFromUnit
local ____weapon_2Dconstants = require("src.app.weapons.weapon-constants")
local HIGH_QUALITY_POLYMER_ABILITY_ID = ____weapon_2Dconstants.HIGH_QUALITY_POLYMER_ABILITY_ID
local ROLL_DISTANCE = 330
local ROLL_DURATION = 0.3
____exports.RollWhenSprinting = __TS__Class()
local RollWhenSprinting = ____exports.RollWhenSprinting
RollWhenSprinting.name = "RollWhenSprinting"
function RollWhenSprinting.prototype.____constructor(self)
    self.timeElapsed = 0
end
function RollWhenSprinting.prototype.initialise(self, module)
    self.unit = GetTriggerUnit()
    local unitPos = vectorFromUnit(self.unit)
    local rollModifier = (GetUnitAbilityLevel(self.unit, HIGH_QUALITY_POLYMER_ABILITY_ID) > 0) and 1.3 or 1
    local targetPos = unitPos:applyPolarOffset(
        GetUnitFacing(self.unit),
        ROLL_DISTANCE * rollModifier
    )
    self.direction = targetPos:subtract(unitPos):normalise():multiplyN((ROLL_DISTANCE * rollModifier) / ROLL_DURATION)
    return true
end
function RollWhenSprinting.prototype.process(self, module, delta)
    self.timeElapsed = self.timeElapsed + delta
    if self.direction and self.unit then
        local newPosition = vectorFromUnit(self.unit):add(
            self.direction:multiplyN(delta)
        )
        SetUnitX(self.unit, newPosition.x)
        SetUnitY(self.unit, newPosition.y)
    end
    return self.timeElapsed <= ROLL_DURATION
end
function RollWhenSprinting.prototype.destroy(self, module)
    return false
end
return ____exports
end,
["src.resources.filters"] = function() local ____exports = {}
____exports.FilterIsEnemyAndAlive = function(enemyOfWho) return Filter(
    function()
        local fUnit = GetFilterUnit()
        return IsPlayerEnemy(
            GetOwningPlayer(fUnit),
            enemyOfWho
        ) and not BlzIsUnitInvulnerable(fUnit)
    end
) end
return ____exports
end,
["src.app.abilities.alien.acid-pool"] = function() require("lualib_bundle");
local ____exports = {}
local ____vector2 = require("src.app.types.vector2")
local vectorFromUnit = ____vector2.vectorFromUnit
local ____vector3 = require("src.app.types.vector3")
local Vector3 = ____vector3.Vector3
local ____projectile = require("src.app.weapons.projectile.projectile")
local Projectile = ____projectile.Projectile
local ____projectile_2Dtarget = require("src.app.weapons.projectile.projectile-target")
local ProjectileTargetStatic = ____projectile_2Dtarget.ProjectileTargetStatic
local ProjectileMoverParabolic = ____projectile_2Dtarget.ProjectileMoverParabolic
local ____filters = require("src.resources.filters")
local FilterIsEnemyAndAlive = ____filters.FilterIsEnemyAndAlive
local DAMAGE_PER_SECOND = 100
local ABILITY_SLOW_ID = FourCC("A00B")
local MISSILE_SPEED = 400
local MISSILE_ARC_HEIGHT = 800
local MISSILE_LAUNCH_SFX = "Abilities\\Spells\\Undead\\DeathCoil\\DeathCoilSpecialArt.mdl"
local MISSILE_SFX = "Abilities\\Weapons\\ChimaeraAcidMissile\\ChimaeraAcidMissile.mdl"
local POOL_SFX = "war3mapImported\\ToxicField.mdx"
local POOL_DURATION = 6
local POOL_AREA = 350
____exports.AcidPoolAbility = __TS__Class()
local AcidPoolAbility = ____exports.AcidPoolAbility
AcidPoolAbility.name = "AcidPoolAbility"
function AcidPoolAbility.prototype.____constructor(self)
    self.damageGroup = CreateGroup()
    self.lastDelta = 0
    self.checkForSlowEvery = 0.3
    self.timeElapsedSinceLastSlowCheck = 0.5
    self.timeElapsed = 0
end
function AcidPoolAbility.prototype.initialise(self, module)
    self.casterUnit = GetTriggerUnit()
    self.targetLoc = __TS__New(
        Vector3,
        GetSpellTargetX(),
        GetSpellTargetY(),
        0
    )
    self.targetLoc.z = module.game:getZFromXY(self.targetLoc.x, self.targetLoc.y)
    self.castingPlayer = GetOwningPlayer(self.casterUnit)
    local polarPoint = vectorFromUnit(self.casterUnit):applyPolarOffset(
        GetUnitFacing(self.casterUnit),
        80
    )
    local startLoc = __TS__New(
        Vector3,
        polarPoint.x,
        polarPoint.y,
        module.game:getZFromXY(polarPoint.x, polarPoint.y) + 30
    )
    local deltaTarget = self.targetLoc:subtract(startLoc)
    local projectile = __TS__New(
        Projectile,
        self.casterUnit,
        startLoc,
        __TS__New(ProjectileTargetStatic, deltaTarget),
        __TS__New(
            ProjectileMoverParabolic,
            startLoc,
            self.targetLoc,
            Deg2Rad(
                GetRandomReal(30, 70)
            )
        )
    ):onDeath(
        function(proj)
            self:createPool(
                proj:getPosition()
            )
        end
    ):onCollide(
        function() return true end
    )
    projectile:addEffect(
        MISSILE_SFX,
        __TS__New(Vector3, 0, 0, 0),
        deltaTarget:normalise(),
        1
    )
    local sfx = AddSpecialEffect(MISSILE_LAUNCH_SFX, polarPoint.x, polarPoint.y)
    BlzSetSpecialEffectHeight(sfx, -30)
    DestroyEffect(sfx)
    module.game.weaponModule:addProjectile(projectile)
    return true
end
function AcidPoolAbility.prototype.createPool(self, atWhere)
    self.poolLocation = atWhere
    self.sfx = AddSpecialEffect(POOL_SFX, atWhere.x, atWhere.y)
    BlzSetSpecialEffectTimeScale(self.sfx, 0.01)
    BlzSetSpecialEffectScale(self.sfx, 1.3)
end
function AcidPoolAbility.prototype.process(self, abMod, delta)
    if self.poolLocation and self.castingPlayer then
        self.timeElapsed = self.timeElapsed + delta
        self.timeElapsedSinceLastSlowCheck = self.timeElapsedSinceLastSlowCheck + delta
        GroupEnumUnitsInRange(
            self.damageGroup,
            self.poolLocation.x,
            self.poolLocation.y,
            POOL_AREA,
            FilterIsEnemyAndAlive(self.castingPlayer)
        )
        self.lastDelta = delta
        ForGroup(
            self.damageGroup,
            function() return self:damageUnit() end
        )
        if self.timeElapsedSinceLastSlowCheck >= self.checkForSlowEvery then
            ForGroup(
                self.damageGroup,
                function() return self:slowUnit(abMod) end
            )
            self.timeElapsedSinceLastSlowCheck = 0
        end
    end
    return self.timeElapsed < POOL_DURATION
end
function AcidPoolAbility.prototype.damageUnit(self)
    if self.casterUnit then
        local unit = GetEnumUnit()
        UnitDamageTarget(self.casterUnit, unit, DAMAGE_PER_SECOND * self.lastDelta, true, true, ATTACK_TYPE_MAGIC, DAMAGE_TYPE_ACID, WEAPON_TYPE_WHOKNOWS)
    end
end
function AcidPoolAbility.prototype.slowUnit(self, abMod)
    local unit = GetEnumUnit()
    abMod.game:useDummyFor(
        function(dummy)
            SetUnitX(
                dummy,
                GetUnitX(unit)
            )
            SetUnitY(
                dummy,
                GetUnitY(unit) + 50
            )
            IssueTargetOrder(
                dummy,
                "slow",
                GetEnumUnit()
            )
        end,
        ABILITY_SLOW_ID
    )
end
function AcidPoolAbility.prototype.destroy(self, module)
    local ____ = self.sfx and BlzSetSpecialEffectTimeScale(self.sfx, 10)
    local ____ = self.sfx and DestroyEffect(self.sfx)
    DestroyGroup(self.damageGroup)
    return true
end
return ____exports
end,
["src.lib.order-ids"] = function() local ____exports = {}
____exports.SMART_ORDER_ID = 851971
____exports.UNIT_IS_FLY = FourCC("A00C")
return ____exports
end,
["src.app.abilities.alien.leap"] = function() require("lualib_bundle");
local ____exports = {}
local ____vector3 = require("src.app.types.vector3")
local Vector3 = ____vector3.Vector3
local ____projectile_2Dtarget = require("src.app.weapons.projectile.projectile-target")
local ProjectileMoverParabolic = ____projectile_2Dtarget.ProjectileMoverParabolic
local ____translators = require("src.lib.translators")
local PlayNewSoundOnUnit = ____translators.PlayNewSoundOnUnit
local ____order_2Dids = require("src.lib.order-ids")
local UNIT_IS_FLY = ____order_2Dids.UNIT_IS_FLY
local LEAP_ID = FourCC("LEAP")
local LEAP_DISTANCE_MAX = 400
____exports.LeapAbility = __TS__Class()
local LeapAbility = ____exports.LeapAbility
LeapAbility.name = "LeapAbility"
function LeapAbility.prototype.____constructor(self)
    self.unitLocTracker = __TS__New(Vector3, 0, 0, 0)
    self.initialZ = 0
    self.timeElapsed = 0
end
function LeapAbility.prototype.initialise(self, abMod)
    self.casterUnit = GetTriggerUnit()
    local cdRemaining = BlzGetUnitAbilityCooldownRemaining(self.casterUnit, LEAP_ID)
    if cdRemaining > 0 then
        return false
    end
    local casterLoc = __TS__New(
        Vector3,
        GetUnitX(self.casterUnit),
        GetUnitY(self.casterUnit),
        0
    )
    casterLoc.z = abMod.game:getZFromXY(casterLoc.x, casterLoc.y)
    local targetLoc = __TS__New(Vector3, 0, 0, 0)
    local isSelfCast = GetSpellAbilityId() > 0
    if not isSelfCast then
        targetLoc.x = GetOrderPointX()
        targetLoc.y = GetOrderPointY()
        local delta = targetLoc:subtract(casterLoc)
        local distance = delta:getLength()
        delta = delta:normalise():multiplyN(
            math.min(distance, LEAP_DISTANCE_MAX)
        )
        targetLoc = casterLoc:add(delta)
        targetLoc.z = casterLoc.z
        BlzStartUnitAbilityCooldown(
            self.casterUnit,
            LEAP_ID,
            BlzGetAbilityCooldown(LEAP_ID, 0)
        )
    else
        targetLoc.x = GetUnitX(self.casterUnit)
        targetLoc.y = GetUnitY(self.casterUnit)
        targetLoc = targetLoc:projectTowards2D(
            Rad2Deg(
                GetUnitFacing(self.casterUnit)
            ),
            150
        )
        targetLoc.z = abMod.game:getZFromXY(targetLoc.x, targetLoc.y) + 10
    end
    self.initialZ = casterLoc.z
    self.mover = __TS__New(
        ProjectileMoverParabolic,
        casterLoc,
        targetLoc,
        Deg2Rad(isSelfCast and 82 or 45)
    )
    self.unitLocTracker = casterLoc
    local sfx = AddSpecialEffect("war3mapImported\\DustWave.mdx", casterLoc.x, casterLoc.y)
    BlzSetSpecialEffectAlpha(sfx, 40)
    BlzSetSpecialEffectScale(sfx, 0.7)
    BlzSetSpecialEffectTimeScale(sfx, 1)
    BlzSetSpecialEffectTime(sfx, 0.2)
    BlzSetSpecialEffectYaw(
        sfx,
        GetRandomInt(0, 360)
    )
    DestroyEffect(sfx)
    sfx = AddSpecialEffect("war3mapImported\\DustWave.mdx", casterLoc.x, casterLoc.y)
    BlzSetSpecialEffectAlpha(sfx, 40)
    BlzSetSpecialEffectScale(sfx, 0.8)
    BlzSetSpecialEffectTimeScale(sfx, 0.7)
    BlzSetSpecialEffectTime(sfx, 0.2)
    BlzSetSpecialEffectYaw(
        sfx,
        GetRandomInt(0, 360)
    )
    DestroyEffect(sfx)
    sfx = AddSpecialEffect("war3mapImported\\DustWave.mdx", casterLoc.x, casterLoc.y)
    BlzSetSpecialEffectAlpha(sfx, 40)
    BlzSetSpecialEffectScale(sfx, 0.9)
    BlzSetSpecialEffectTimeScale(sfx, 0.4)
    BlzSetSpecialEffectTime(sfx, 0.2)
    BlzSetSpecialEffectYaw(
        sfx,
        GetRandomInt(0, 360)
    )
    DestroyEffect(sfx)
    PlayNewSoundOnUnit(
        self:getRandomSound(),
        self.casterUnit,
        100
    )
    local angle = Rad2Deg(
        Atan2(targetLoc.y - casterLoc.y, targetLoc.x - casterLoc.x)
    )
    BlzSetUnitFacingEx(self.casterUnit, angle)
    BlzPauseUnitEx(self.casterUnit, true)
    SetUnitAnimation(self.casterUnit, "attack")
    SetUnitTimeScale(self.casterUnit, 0.3)
    UnitAddAbility(self.casterUnit, UNIT_IS_FLY)
    BlzUnitDisableAbility(self.casterUnit, UNIT_IS_FLY, true, true)
    return true
end
function LeapAbility.prototype.getRandomSound(self)
    local soundPaths = {"Units\\Critters\\Hydralisk\\HydraliskYes1.flac", "Units\\Critters\\Hydralisk\\HydraliskYesAttack1.flac", "Units\\Critters\\Hydralisk\\HydraliskYesAttack2.flac"}
    return soundPaths[GetRandomInt(0, #soundPaths - 1) + 1]
end
function LeapAbility.prototype.process(self, abMod, delta)
    if self.mover and self.casterUnit then
        local posDelta = self.mover:move(self.mover.originalPos, self.mover.originalDelta, self.mover.velocity, delta)
        local unitLoc = __TS__New(
            Vector3,
            GetUnitX(self.casterUnit) + posDelta.x,
            GetUnitY(self.casterUnit) + posDelta.y,
            self.unitLocTracker.z + posDelta.z
        )
        self.unitLocTracker = unitLoc
        local terrainZ = abMod.game:getZFromXY(unitLoc.x, unitLoc.y)
        SetUnitX(self.casterUnit, unitLoc.x)
        SetUnitY(self.casterUnit, unitLoc.y)
        SetUnitFlyHeight(self.casterUnit, unitLoc.z + self.initialZ - terrainZ, 9999)
        if self.unitLocTracker.z < terrainZ then
            return false
        end
    end
    return true
end
function LeapAbility.prototype.destroy(self, abMod)
    if self.casterUnit then
        local casterLoc = __TS__New(
            Vector3,
            GetUnitX(self.casterUnit),
            GetUnitY(self.casterUnit),
            0
        )
        casterLoc.z = abMod.game:getZFromXY(casterLoc.x, casterLoc.y)
        local sfx = AddSpecialEffect("war3mapImported\\DustWave.mdx", casterLoc.x, casterLoc.y)
        BlzSetSpecialEffectAlpha(sfx, 40)
        BlzSetSpecialEffectScale(sfx, 0.8)
        BlzSetSpecialEffectTimeScale(sfx, 0.8)
        BlzSetSpecialEffectTime(sfx, 0.2)
        BlzSetSpecialEffectYaw(
            sfx,
            GetRandomInt(0, 360)
        )
        DestroyEffect(sfx)
        sfx = AddSpecialEffect("war3mapImported\\DustWave.mdx", casterLoc.x, casterLoc.y)
        BlzSetSpecialEffectAlpha(sfx, 40)
        BlzSetSpecialEffectScale(sfx, 0.9)
        BlzSetSpecialEffectTimeScale(sfx, 0.5)
        BlzSetSpecialEffectTime(sfx, 0.2)
        BlzSetSpecialEffectYaw(
            sfx,
            GetRandomInt(0, 360)
        )
        DestroyEffect(sfx)
        SetUnitAnimation(self.casterUnit, "stand")
        SetUnitTimeScale(self.casterUnit, 1)
        UnitRemoveAbility(self.casterUnit, UNIT_IS_FLY)
        local ____ = self.casterUnit and BlzPauseUnitEx(self.casterUnit, false)
        local ____ = self.casterUnit and SetUnitFlyHeight(self.casterUnit, 0, 9999)
    end
    return true
end
return ____exports
end,
["src.app.abilities.alien.transform"] = function() require("lualib_bundle");
local ____exports = {}
local ____vector2 = require("src.app.types.vector2")
local Vector2 = ____vector2.Vector2
local vectorFromUnit = ____vector2.vectorFromUnit
local ____vector3 = require("src.app.types.vector3")
local Vector3 = ____vector3.Vector3
local ____projectile = require("src.app.weapons.projectile.projectile")
local Projectile = ____projectile.Projectile
local ____projectile_2Dtarget = require("src.app.weapons.projectile.projectile-target")
local ProjectileTargetStatic = ____projectile_2Dtarget.ProjectileTargetStatic
local ProjectileMoverParabolic = ____projectile_2Dtarget.ProjectileMoverParabolic
local ____order_2Dids = require("src.lib.order-ids")
local SMART_ORDER_ID = ____order_2Dids.SMART_ORDER_ID
local ____trigger = require("src.app.types.jass-overrides.trigger")
local Trigger = ____trigger.Trigger
____exports.TRANSFORM_ID = FourCC("TF01")
local CREATE_SFX_EVERY = 0.06
local MEAT_SFX = {"Abilities\\Weapons\\MeatwagonMissile\\MeatwagonMissile.mdl"}
local SFX_HUMAN_BLOOD = "Objects\\Spawnmodels\\Orc\\OrcLargeDeathExplode\\OrcLargeDeathExplode.mdl"
local SFX_ALIEN_BLOOD = "Objects\\Spawnmodels\\Undead\\UndeadLargeDeathExplode\\UndeadLargeDeathExplode.mdl"
local SFX_BLOOD_EXPLODE = "Units\\Undead\\Abomination\\AbominationExplosion.mdl"
local MEAT_AOE = 950
local MEAT_AOE_MIN = 150
local DURATION = 2
____exports.TransformAbility = __TS__Class()
local TransformAbility = ____exports.TransformAbility
TransformAbility.name = "TransformAbility"
function TransformAbility.prototype.____constructor(self)
    self.timeElapsed = 0
    self.timeElapsedSinceSFX = CREATE_SFX_EVERY
    self.orderTrigger = __TS__New(Trigger)
    self.timeElapsed = 0
end
function TransformAbility.prototype.initialise(self, abMod)
    self.casterUnit = GetTriggerUnit()
    self.orderTrigger:RegisterUnitIssuedOrder(self.casterUnit, EVENT_UNIT_ISSUED_POINT_ORDER)
    self.orderTrigger:AddCondition(
        function() return GetIssuedOrderId() == SMART_ORDER_ID end
    )
    self.orderTrigger:AddAction(
        function()
            self.previousOrder = GetIssuedOrderId()
            self.previousOrderTarget = __TS__New(
                Vector2,
                GetOrderPointX(),
                GetOrderPointY()
            )
        end
    )
    return true
end
function TransformAbility.prototype.process(self, abMod, delta)
    self.timeElapsed = self.timeElapsed + delta
    self.timeElapsedSinceSFX = self.timeElapsedSinceSFX + delta
    if self.timeElapsedSinceSFX >= CREATE_SFX_EVERY and self.casterUnit then
        self.timeElapsedSinceSFX = 0
        local tLoc = vectorFromUnit(self.casterUnit)
        local unitHeight = abMod.game:getZFromXY(tLoc.x, tLoc.y)
        local startLoc = __TS__New(Vector3, tLoc.x, tLoc.y, unitHeight + 80)
        local newTarget = __TS__New(
            Vector3,
            startLoc.x + self:getRandomOffset(),
            startLoc.y + self:getRandomOffset(),
            unitHeight
        )
        local projStartLoc = __TS__New(Vector3, startLoc.x, startLoc.y, unitHeight + 20)
        local projectile = __TS__New(
            Projectile,
            self.casterUnit,
            projStartLoc,
            __TS__New(
                ProjectileTargetStatic,
                newTarget:subtract(startLoc)
            ),
            __TS__New(
                ProjectileMoverParabolic,
                projStartLoc,
                newTarget,
                Deg2Rad(
                    GetRandomReal(60, 85)
                )
            )
        ):onDeath(
            function(proj)
                self:bloodSplash(
                    proj:getPosition()
                )
            end
        ):onCollide(
            function() return true end
        )
        projectile:addEffect(
            self:getRandomSFX(),
            __TS__New(Vector3, 0, 0, 0),
            newTarget:subtract(startLoc):normalise(),
            1
        )
        local bloodSfx = AddSpecialEffect(
            self:getBloodEffect(),
            startLoc.x,
            startLoc.y
        )
        BlzSetSpecialEffectZ(bloodSfx, startLoc.z - 30)
        DestroyEffect(bloodSfx)
        abMod.game.weaponModule:addProjectile(projectile)
    end
    return self.timeElapsed < DURATION
end
function TransformAbility.prototype.getRandomOffset(self)
    local isNegative = GetRandomInt(0, 1)
    return ((isNegative == 1) and -1 or 1) * math.max(
        MEAT_AOE_MIN,
        GetRandomInt(0, MEAT_AOE)
    )
end
function TransformAbility.prototype.getBloodEffect(self)
    local t = GetRandomReal(self.timeElapsed / DURATION, self.timeElapsed / DURATION * 2)
    return (t > 0.5) and SFX_ALIEN_BLOOD or SFX_HUMAN_BLOOD
end
function TransformAbility.prototype.getRandomSFX(self)
    return MEAT_SFX[GetRandomInt(0, #MEAT_SFX - 1) + 1]
end
function TransformAbility.prototype.bloodSplash(self, where)
end
function TransformAbility.prototype.destroy(self, abMod)
    if self.casterUnit then
        local tLoc = vectorFromUnit(self.casterUnit)
        local player = GetOwningPlayer(self.casterUnit)
        local unitWasSelected = IsUnitSelected(self.casterUnit, player)
        ShowUnit(self.casterUnit, false)
        local alien = CreateUnit(
            player,
            FourCC("ALI1"),
            tLoc.x,
            tLoc.y,
            GetUnitFacing(self.casterUnit)
        )
        abMod:trackUnitOrdersForAbilities(alien)
        SetUnitColor(alien, PLAYER_COLOR_BROWN)
        SetUnitLifePercentBJ(
            alien,
            GetUnitLifePercent(self.casterUnit)
        )
        if unitWasSelected then
            SelectUnitAddForPlayer(alien, player)
            SetPlayerName(player, "Alien")
        end
        if self.previousOrder and self.previousOrderTarget then
            IssuePointOrderById(alien, self.previousOrder, self.previousOrderTarget.x, self.previousOrderTarget.y)
        end
        self.orderTrigger:destroy()
    end
    return true
end
return ____exports
end,
["src.app.abilities.ability-module"] = function() require("lualib_bundle");
local ____exports = {}
local ____trigger = require("src.app.types.jass-overrides.trigger")
local Trigger = ____trigger.Trigger
local ____roll_2Dsprint = require("src.app.abilities.human.roll-sprint")
local RollWhenSprinting = ____roll_2Dsprint.RollWhenSprinting
local ____acid_2Dpool = require("src.app.abilities.alien.acid-pool")
local AcidPoolAbility = ____acid_2Dpool.AcidPoolAbility
local ____leap = require("src.app.abilities.alien.leap")
local LeapAbility = ____leap.LeapAbility
local ____order_2Dids = require("src.lib.order-ids")
local SMART_ORDER_ID = ____order_2Dids.SMART_ORDER_ID
local ____transform = require("src.app.abilities.alien.transform")
local TRANSFORM_ID = ____transform.TRANSFORM_ID
local TransformAbility = ____transform.TransformAbility
local TIMEOUT = 0.03
____exports.AbilityModule = __TS__Class()
local AbilityModule = ____exports.AbilityModule
AbilityModule.name = "AbilityModule"
function AbilityModule.prototype.____constructor(self, game)
    self.game = game
    self.data = {}
    self.triggerIterator = __TS__New(Trigger)
    self.triggerIterator:RegisterTimerEventPeriodic(TIMEOUT)
    self.triggerIterator:AddAction(
        function() return self:process(TIMEOUT) end
    )
    self.triggerAbilityCast = __TS__New(Trigger)
    self.triggerAbilityCast:RegisterAnyUnitEventBJ(EVENT_PLAYER_UNIT_SPELL_EFFECT)
    self.triggerAbilityCast:AddAction(
        function() return self:checkSpells() end
    )
    self.unitIssuedCommand = __TS__New(Trigger)
    self.unitIssuedCommand:AddAction(
        function() return self:onTrackUnitOrders() end
    )
end
function AbilityModule.prototype.checkSpells(self)
    local id = GetSpellAbilityId()
    if id == FourCC("A003") then
        local instance = __TS__New(RollWhenSprinting)
        if instance:initialise(self) then
            __TS__ArrayPush(self.data, instance)
        end
    elseif id == FourCC("ACID") then
        local instance = __TS__New(AcidPoolAbility)
        if instance:initialise(self) then
            __TS__ArrayPush(self.data, instance)
        end
    elseif id == FourCC("LEAP") then
        local instance = __TS__New(LeapAbility)
        if instance:initialise(self) then
            __TS__ArrayPush(self.data, instance)
        end
    elseif id == TRANSFORM_ID then
        local instance = __TS__New(TransformAbility)
        if instance:initialise(self) then
            __TS__ArrayPush(self.data, instance)
        end
    end
end
function AbilityModule.prototype.onTrackUnitOrders(self)
    local triggerUnit = GetTriggerUnit()
    local orderId = GetIssuedOrderId()
    if orderId == SMART_ORDER_ID and GetUnitAbilityLevel(
        triggerUnit,
        FourCC("LEAP")
    ) >= 1 then
        local instance = __TS__New(LeapAbility)
        if instance:initialise(self) then
            __TS__ArrayPush(self.data, instance)
        end
    end
end
function AbilityModule.prototype.trackUnitOrdersForAbilities(self, whichUnit)
    self.unitIssuedCommand:RegisterUnitIssuedOrder(whichUnit, EVENT_UNIT_ISSUED_POINT_ORDER)
end
function AbilityModule.prototype.process(self, delta)
    self.data = __TS__ArrayFilter(
        self.data,
        function(____, ability)
            local doDestroy = not ability:process(self, delta)
            if doDestroy then
                ability:destroy(self)
            end
            return not doDestroy
        end
    )
end
return ____exports
end,
["src.app.types.progress-bar"] = function() require("lualib_bundle");
local ____exports = {}
____exports.PROGRESS_BAR_MODEL_PATH = "Models\\Progressbar.mdxx"
____exports.ProgressBar = __TS__Class()
local ProgressBar = ____exports.ProgressBar
ProgressBar.name = "ProgressBar"
function ProgressBar.prototype.____constructor(self)
    self.progress = 0
    self.isReverse = false
end
function ProgressBar.prototype.show(self)
    self.bar = AddSpecialEffect(____exports.PROGRESS_BAR_MODEL_PATH, 0, 0)
end
function ProgressBar.prototype.hide(self)
    self:destroy()
end
function ProgressBar.prototype.moveTo(self, x, y, z)
    if not self.bar then
        return self
    end
    BlzSetSpecialEffectX(self.bar, x)
    BlzSetSpecialEffectY(self.bar, y)
    BlzSetSpecialEffectZ(self.bar, z)
    return self
end
function ProgressBar.prototype.setPercentage(self, percentage)
    if not self.bar then
        return self
    end
    BlzSetSpecialEffectTime(self.bar, percentage)
    return self
end
function ProgressBar.prototype.destroy(self)
    if not self.bar then
        return self
    end
    DestroyEffect(self.bar)
end
return ____exports
end,
["src.app.interactions.interaction-event"] = function() require("lualib_bundle");
local ____exports = {}
local ____trigger = require("src.app.types.jass-overrides.trigger")
local Trigger = ____trigger.Trigger
local ____vector2 = require("src.app.types.vector2")
local vectorFromUnit = ____vector2.vectorFromUnit
local ____progress_2Dbar = require("src.app.types.progress-bar")
local ProgressBar = ____progress_2Dbar.ProgressBar
____exports.INTERACT_MAXIMUM_DISTANCE = 350
____exports.STUN_ID = FourCC("stun")
____exports.SLOW_ID = FourCC("slow")
____exports.InteractionEvent = __TS__Class()
local InteractionEvent = ____exports.InteractionEvent
InteractionEvent.name = "InteractionEvent"
function InteractionEvent.prototype.____constructor(self, unit, targetUnit, interactTime, callback, startCallback, cancelCallback)
    self.unit = unit
    self.targetUnit = targetUnit
    self.timeRequired = (function(o, i, v)
        o[i] = v
        return v
    end)(self, "timeRemaining", interactTime)
    self.callback = callback
    self.startCallback = startCallback
    self.cancelCallback = cancelCallback
    self.progressBar = __TS__New(ProgressBar)
end
function InteractionEvent.prototype.startInteraction(self)
    self.interactionTrigger = __TS__New(Trigger)
    self.interactionTrigger:RegisterUnitIssuedOrder(self.unit, EVENT_UNIT_ISSUED_POINT_ORDER)
    self.interactionTrigger:RegisterUnitIssuedOrder(self.unit, EVENT_UNIT_ISSUED_TARGET_ORDER)
    self.interactionTrigger:RegisterUnitIssuedOrder(self.unit, EVENT_UNIT_ISSUED_ORDER)
    self.interactionTrigger:AddAction(
        function()
            self:destroy()
        end
    )
end
function InteractionEvent.prototype.process(self, delta)
    if not self.interactionTrigger or self.interactionTrigger.isDestroyed then
        return false
    end
    local v1 = vectorFromUnit(self.unit)
    local v2 = vectorFromUnit(self.targetUnit)
    if v1:subtract(v2):getLength() <= ____exports.INTERACT_MAXIMUM_DISTANCE then
        if self.timeRemaining == self.timeRequired then
            local ____ = self.progressBar and self.progressBar:show()
            self:startCallback()
        end
        if UnitHasBuffBJ(self.unit, ____exports.STUN_ID) then
            delta = 0
        elseif UnitHasBuffBJ(self.unit, ____exports.SLOW_ID) then
            delta = delta / 2
        end
        self.timeRemaining = self.timeRemaining - delta
        if self.timeRemaining <= 0 then
            self:onInteractionCompletion()
            return false
        end
    else
    end
    local ____ = self.progressBar and self.progressBar:moveTo(
        v1.x,
        v1.y,
        BlzGetUnitZ(self.unit) + 229
    ):setPercentage(1 - self.timeRemaining / self.timeRequired)
    return true
end
function InteractionEvent.prototype.onInteractionCompletion(self)
    self:callback()
end
function InteractionEvent.prototype.destroy(self)
    local ____ = self.interactionTrigger and self.interactionTrigger:destroy()
    local ____ = self.progressBar and self.progressBar:destroy()
    self.interactionTrigger = nil
    self:cancelCallback()
end
return ____exports
end,
["src.app.interactions.interactable"] = function() local ____exports = {}
return ____exports
end,
["src.app.interactions.interaction-data"] = function() require("lualib_bundle");
local ____exports = {}
local ____zone_2Did = require("src.app.world.zone-id")
local ZONE_TYPE = ____zone_2Did.ZONE_TYPE
local ____translators = require("src.lib.translators")
local PlayNewSoundOnUnit = ____translators.PlayNewSoundOnUnit
local ____colours = require("src.resources.colours")
local COL_FLOOR_1 = ____colours.COL_FLOOR_1
local COL_FLOOR_2 = ____colours.COL_FLOOR_2
local COL_VENTS = ____colours.COL_VENTS
____exports.Interactables = __TS__New(Map)
local Elevator = __TS__Class()
Elevator.name = "Elevator"
function Elevator.prototype.____constructor(self, u, zone, offset)
    self.unit = u
    self.inside_zone = zone
    self.exit_offset = offset
end
local elevatorMap = __TS__New(Map)
function ____exports.initElevators()
    local TEST_ELEVATOR_FLOOR_1 = __TS__New(Elevator, gg_unit_n001_0032, ZONE_TYPE.FLOOR_1, {x = 0, y = -180})
    local TEST_ELEVATOR_FLOOR_2 = __TS__New(Elevator, gg_unit_n001_0021, ZONE_TYPE.FLOOR_2, {x = 0, y = -180})
    TEST_ELEVATOR_FLOOR_1.to = TEST_ELEVATOR_FLOOR_2
    TEST_ELEVATOR_FLOOR_2.to = TEST_ELEVATOR_FLOOR_1
    BlzSetUnitName(
        TEST_ELEVATOR_FLOOR_1.unit,
        "Elevator to " .. tostring(COL_FLOOR_2) .. "Floor 2|r"
    )
    BlzSetUnitName(
        TEST_ELEVATOR_FLOOR_2.unit,
        "Elevator to " .. tostring(COL_FLOOR_1) .. "Floor 1|r"
    )
    elevatorMap:set(
        GetHandleId(TEST_ELEVATOR_FLOOR_1.unit),
        TEST_ELEVATOR_FLOOR_1
    )
    elevatorMap:set(
        GetHandleId(TEST_ELEVATOR_FLOOR_2.unit),
        TEST_ELEVATOR_FLOOR_2
    )
    local elevatorTest = {
        unitType = FourCC("n001"),
        onStart = function(____, iModule, fromUnit, targetUnit)
            local handleId = GetHandleId(targetUnit)
            local targetElevator = elevatorMap:get(handleId)
            SetUnitAnimationByIndex(targetUnit, 1)
            KillSoundWhenDone(
                PlayNewSoundOnUnit("Sounds\\ElevatorOpen.mp3", targetUnit, 90)
            )
            if targetElevator and targetElevator.to then
                KillSoundWhenDone(
                    PlayNewSoundOnUnit("Sounds\\ElevatorOpen.mp3", targetElevator.to.unit, 90)
                )
                SetUnitAnimationByIndex(targetElevator.to.unit, 1)
            end
        end,
        onCancel = function(____, iModule, fromUnit, targetUnit)
            local handleId = GetHandleId(targetUnit)
            local targetElevator = elevatorMap:get(handleId)
            SetUnitAnimationByIndex(targetUnit, 0)
            if targetElevator and targetElevator.to then
                SetUnitAnimationByIndex(targetElevator.to.unit, 0)
            end
        end,
        action = function(____, iModule, fromUnit, targetUnit)
            local handleId = GetHandleId(targetUnit)
            local targetElevator = elevatorMap:get(handleId)
            if targetElevator and targetElevator.to then
                SetUnitX(
                    fromUnit,
                    GetUnitX(targetElevator.to.unit) + targetElevator.to.exit_offset.x
                )
                SetUnitY(
                    fromUnit,
                    GetUnitY(targetElevator.to.unit) + targetElevator.to.exit_offset.y
                )
                if IsUnitSelected(
                    fromUnit,
                    GetOwningPlayer(fromUnit)
                ) then
                    PanCameraToTimedForPlayer(
                        GetOwningPlayer(fromUnit),
                        GetUnitX(fromUnit),
                        GetUnitY(fromUnit),
                        0
                    )
                end
                iModule.game.worldModule:travel(fromUnit, targetElevator.to.inside_zone)
            end
        end
    }
    ____exports.Interactables:set(elevatorTest.unitType, elevatorTest)
end
local hatchMap = __TS__New(Map)
function ____exports.initHatches()
    local HATCH_FLOOR_1 = __TS__New(Elevator, gg_unit_n002_0033, ZONE_TYPE.FLOOR_1, {x = 0, y = 0})
    local VENT_EXIT_FLOOR_1 = __TS__New(Elevator, gg_unit_n002_0034, ZONE_TYPE.VENTRATION, {x = 0, y = 0})
    HATCH_FLOOR_1.to = VENT_EXIT_FLOOR_1
    VENT_EXIT_FLOOR_1.to = HATCH_FLOOR_1
    BlzSetUnitName(
        HATCH_FLOOR_1.unit,
        "To " .. tostring(COL_VENTS) .. "Service Tunnels|r"
    )
    BlzSetUnitName(
        VENT_EXIT_FLOOR_1.unit,
        "Hatch to " .. tostring(COL_FLOOR_1) .. "Floor 1|r"
    )
    hatchMap:set(
        GetHandleId(HATCH_FLOOR_1.unit),
        VENT_EXIT_FLOOR_1
    )
    hatchMap:set(
        GetHandleId(VENT_EXIT_FLOOR_1.unit),
        HATCH_FLOOR_1
    )
    local hatcInteractable = {
        unitType = FourCC("n002"),
        onStart = function(____, iModule, fromUnit, targetUnit)
            local handleId = GetHandleId(targetUnit)
            local targetElevator = hatchMap:get(handleId)
            SetUnitTimeScale(targetUnit, 1.4)
            SetUnitAnimationByIndex(targetUnit, 1)
            KillSoundWhenDone(
                PlayNewSoundOnUnit("Sounds\\MetalHatch.mp33", targetUnit, 60)
            )
            if targetElevator and targetElevator.to then
                SetUnitTimeScale(targetElevator.to.unit, 1.4)
                PlayNewSoundOnUnit("Sounds\\MetalHatch.mp3", targetElevator.to.unit, 60)
                SetUnitAnimationByIndex(targetElevator.to.unit, 1)
            end
        end,
        onCancel = function(____, iModule, fromUnit, targetUnit)
            local handleId = GetHandleId(targetUnit)
            local targetElevator = hatchMap:get(handleId)
            SetUnitAnimationByIndex(targetUnit, 2)
            if targetElevator and targetElevator.to then
                SetUnitAnimationByIndex(targetElevator.to.unit, 2)
            end
        end,
        action = function(____, iModule, fromUnit, targetUnit)
            local handleId = GetHandleId(targetUnit)
            local targetElevator = hatchMap:get(handleId)
            if targetElevator and targetElevator.to then
                SetUnitX(
                    fromUnit,
                    GetUnitX(targetElevator.to.unit) + targetElevator.exit_offset.x
                )
                SetUnitY(
                    fromUnit,
                    GetUnitY(targetElevator.to.unit) + targetElevator.exit_offset.y
                )
                if IsUnitSelected(
                    fromUnit,
                    GetOwningPlayer(fromUnit)
                ) then
                    PanCameraToTimedForPlayer(
                        GetOwningPlayer(fromUnit),
                        GetUnitX(fromUnit),
                        GetUnitY(fromUnit),
                        0
                    )
                end
                iModule.game.worldModule:travel(fromUnit, targetElevator.to.inside_zone)
            end
        end
    }
    ____exports.Interactables:set(hatcInteractable.unitType, hatcInteractable)
end
return ____exports
end,
["src.app.interactions.interaction-module"] = function() require("lualib_bundle");
local ____exports = {}
local ____interaction_2Devent = require("src.app.interactions.interaction-event")
local InteractionEvent = ____interaction_2Devent.InteractionEvent
local ____trigger = require("src.app.types.jass-overrides.trigger")
local Trigger = ____trigger.Trigger
local ____interaction_2Ddata = require("src.app.interactions.interaction-data")
local Interactables = ____interaction_2Ddata.Interactables
local initElevators = ____interaction_2Ddata.initElevators
local initHatches = ____interaction_2Ddata.initHatches
local ____order_2Dids = require("src.lib.order-ids")
local SMART_ORDER_ID = ____order_2Dids.SMART_ORDER_ID
____exports.UPDATE_PERIODICAL_INTERACTION = 0.03
____exports.InteractionModule = __TS__Class()
local InteractionModule = ____exports.InteractionModule
InteractionModule.name = "InteractionModule"
function InteractionModule.prototype.____constructor(self, game)
    self.interactions = {}
    self.game = game
    self.interactionUpdateTrigger = __TS__New(Trigger)
    self.interactionUpdateTrigger:RegisterTimerEventPeriodic(____exports.UPDATE_PERIODICAL_INTERACTION)
    self.interactionUpdateTrigger:AddAction(
        function() return self:processInteractions(____exports.UPDATE_PERIODICAL_INTERACTION) end
    )
    self.interactionBeginTrigger = __TS__New(Trigger)
    self.interactionBeginTrigger:RegisterAnyUnitEventBJ(EVENT_PLAYER_UNIT_ISSUED_UNIT_ORDER)
    self.interactionBeginTrigger:AddCondition(
        function()
            return GetIssuedOrderId() == SMART_ORDER_ID
        end
    )
    self.interactionBeginTrigger:AddAction(
        function()
            local trigUnit = GetTriggerUnit()
            local targetUnit = GetOrderTargetUnit()
            local targetUnitType = GetUnitTypeId(targetUnit)
            local interact = Interactables:has(targetUnitType) and Interactables:get(targetUnitType)
            if interact and (not interact.condition or interact:condition(self, trigUnit, targetUnit)) then
                local newInteraction = __TS__New(
                    InteractionEvent,
                    GetTriggerUnit(),
                    GetOrderTargetUnit(),
                    1.5,
                    function() return interact:action(self, trigUnit, targetUnit) end,
                    function() return interact.onStart and interact:onStart(self, trigUnit, targetUnit) end,
                    function() return interact.onCancel and interact:onCancel(self, trigUnit, targetUnit) end
                )
                newInteraction:startInteraction()
                __TS__ArrayPush(self.interactions, newInteraction)
            end
        end
    )
    initElevators()
    initHatches()
end
function InteractionModule.prototype.processInteractions(self, delta)
    self.interactions = __TS__ArrayFilter(
        self.interactions,
        function(____, interaction)
            local doDestroy = not interaction:process(delta)
            if doDestroy then
                interaction:destroy()
            end
            return not doDestroy
        end
    )
end
return ____exports
end,
["src.app.types.widget-id"] = function() local ____exports = {}
____exports.LIGHT_DEST_ID = FourCC("B002")
return ____exports
end,
["src.app.world.zone-type"] = function() require("lualib_bundle");
local ____exports = {}
local ____timed_2Devent = require("src.app.types.timed-event")
local TimedEvent = ____timed_2Devent.TimedEvent
local ____widget_2Did = require("src.app.types.widget-id")
local LIGHT_DEST_ID = ____widget_2Did.LIGHT_DEST_ID
local LIGHT_CLACK = "Sounds\\LightClack.mp3"
____exports.Zone = __TS__Class()
local Zone = ____exports.Zone
Zone.name = "Zone"
function Zone.prototype.____constructor(self, id)
    self.adjacent = {}
    self.unitsInside = {}
    self.id = id
end
function Zone.prototype.onLeave(self, world, unit)
    local idx = __TS__ArrayIndexOf(self.unitsInside, unit)
    if idx >= 0 then
        __TS__ArraySplice(self.unitsInside, idx, 1)
    end
end
function Zone.prototype.onEnter(self, world, unit)
    __TS__ArrayPush(self.unitsInside, unit)
end
function Zone.prototype.getPlayersInZone(self)
    local players = __TS__ArrayMap(
        self.unitsInside,
        function(____, u) return GetOwningPlayer(u) end
    )
    return __TS__ArrayFilter(
        players,
        function(self, elem, index, ____self)
            return index == __TS__ArrayIndexOf(____self, elem)
        end
    )
end
function Zone.prototype.doCauseFear(self)
    return false
end
____exports.ShipZone = __TS__Class()
local ShipZone = ____exports.ShipZone
ShipZone.name = "ShipZone"
ShipZone.____super = ____exports.Zone
setmetatable(ShipZone, ShipZone.____super)
setmetatable(ShipZone.prototype, ShipZone.____super.prototype)
function ShipZone.prototype.____constructor(self, ...)
    ShipZone.____super.prototype.____constructor(self, ...)
    self.hasPower = true
    self.alwaysCauseFear = false
    self.hasOxygen = true
    self.lightSources = {}
end
function ShipZone.prototype.onLeave(self, world, unit)
    ShipZone.____super.prototype.onLeave(self, world, unit)
end
function ShipZone.prototype.onEnter(self, world, unit)
    ShipZone.____super.prototype.onEnter(self, world, unit)
    world.askellon:applyPowerChange(
        GetOwningPlayer(unit),
        self.hasPower,
        false
    )
end
function ShipZone.prototype.updatePower(self, worldModule, newState)
    if self.hasPower ~= newState then
        __TS__ArrayMap(
            self:getPlayersInZone(),
            function(____, p) return worldModule.askellon:applyPowerChange(p, newState, true) end
        )
        if not newState then
            __TS__ArrayForEach(
                self.lightSources,
                function(____, lightSource, i)
                    local _i = i
                    local r = GetRandomInt(2, 4)
                    local timer = 500 + r * r * 200
                    worldModule.game.timedEventQueue:AddEvent(
                        __TS__New(
                            TimedEvent,
                            function()
                                local oldSource = self.lightSources[_i + 1]
                                local oldX = GetDestructableX(oldSource)
                                local oldY = GetDestructableY(oldSource)
                                local terrainZ = worldModule.game:getZFromXY(oldX, oldY)
                                local result = CreateSound(LIGHT_CLACK, false, true, true, 10, 10, "")
                                SetSoundDuration(
                                    result,
                                    GetSoundFileDuration(LIGHT_CLACK)
                                )
                                SetSoundChannel(result, 1)
                                SetSoundVolume(result, 127)
                                SetSoundPitch(result, 1)
                                SetSoundDistances(result, 2000, 10000)
                                SetSoundDistanceCutoff(result, 4500)
                                local location = Location(oldX, oldY)
                                PlaySoundAtPointBJ(result, 127, location, terrainZ)
                                RemoveLocation(location)
                                KillSoundWhenDone(result)
                                RemoveDestructable(oldSource)
                                self.lightSources[_i + 1] = CreateDestructableZ(LIGHT_DEST_ID, oldX, oldY, terrainZ + 9999, 0, 1, 0)
                                return true
                            end,
                            timer
                        )
                    )
                end
            )
        else
            __TS__ArrayForEach(
                self.lightSources,
                function(____, lightSource, i)
                    local _i = i
                    local r = GetRandomInt(2, 4)
                    local timer = 500 + r * r * 200
                    worldModule.game.timedEventQueue:AddEvent(
                        __TS__New(
                            TimedEvent,
                            function()
                                local oldSource = self.lightSources[_i + 1]
                                local oldX = GetDestructableX(oldSource)
                                local oldY = GetDestructableY(oldSource)
                                local terrainZ = worldModule.game:getZFromXY(oldX, oldY)
                                local result = CreateSound(LIGHT_CLACK, false, true, true, 10, 10, "")
                                SetSoundDuration(
                                    result,
                                    GetSoundFileDuration(LIGHT_CLACK)
                                )
                                SetSoundChannel(result, 2)
                                SetSoundVolume(result, 127)
                                SetSoundPitch(result, 1)
                                SetSoundDistances(result, 2000, 10000)
                                SetSoundDistanceCutoff(result, 4500)
                                local location = Location(oldX, oldY)
                                PlaySoundAtPointBJ(result, 127, location, terrainZ)
                                KillSoundWhenDone(result)
                                RemoveLocation(location)
                                RemoveDestructable(oldSource)
                                self.lightSources[_i + 1] = CreateDestructableZ(LIGHT_DEST_ID, oldX, oldY, terrainZ + 100, 0, 1, 0)
                                return true
                            end,
                            timer
                        )
                    )
                end
            )
        end
    end
    self.hasPower = newState
end
function ShipZone.prototype.doCauseFear(self)
    return not self.hasPower or self.alwaysCauseFear
end
return ____exports
end,
["src.app.world.the-askellon"] = function() require("lualib_bundle");
local ____exports = {}
local ____zone_2Did = require("src.app.world.zone-id")
local ZONE_TYPE = ____zone_2Did.ZONE_TYPE
local ____zone_2Dtype = require("src.app.world.zone-type")
local ShipZone = ____zone_2Dtype.ShipZone
local ____sound_2Dref = require("src.app.types.sound-ref")
local SoundRef = ____sound_2Dref.SoundRef
local ____timed_2Devent = require("src.app.types.timed-event")
local TimedEvent = ____timed_2Devent.TimedEvent
local ____buff_2Dinstance = require("src.app.buff.buff-instance")
local BuffInstanceCallback = ____buff_2Dinstance.BuffInstanceCallback
local SMALL_DAMAGE_THRESHOLD = 300
local MODREATE_DAMAGE_THRESHOLD = 900
local EXTREME_DAMAGE_THRESHOLD = 1800
____exports.TheAskellon = __TS__Class()
local TheAskellon = ____exports.TheAskellon
TheAskellon.name = "TheAskellon"
function TheAskellon.prototype.____constructor(self, world)
    self.powerDownSound = __TS__New(SoundRef, "Sounds\\PowerDown.mp3", false)
    self.powerUpSound = __TS__New(SoundRef, "Sounds\\powerUp.mp3", false)
    self.floors = __TS__New(Map)
    self.world = world
    self.floors:set(
        ZONE_TYPE.FLOOR_1,
        __TS__New(ShipZone, ZONE_TYPE.FLOOR_1)
    )
    self.floors:set(
        ZONE_TYPE.FLOOR_2,
        __TS__New(ShipZone, ZONE_TYPE.FLOOR_2)
    )
    self.floors:set(
        ZONE_TYPE.VENTRATION,
        __TS__New(ShipZone, ZONE_TYPE.VENTRATION)
    )
    local z1 = self.floors:get(ZONE_TYPE.FLOOR_1)
    if z1 then
        __TS__ArrayPush(z1.lightSources, gg_dest_B002_0015)
        __TS__ArrayPush(z1.lightSources, gg_dest_B002_0017)
        __TS__ArrayPush(z1.lightSources, gg_dest_B002_0019)
        __TS__ArrayPush(z1.lightSources, gg_dest_B002_0022)
    end
    local vents = self.floors:get(ZONE_TYPE.VENTRATION)
    if vents then
        vents:updatePower(world, false)
        vents.alwaysCauseFear = true
    end
end
function TheAskellon.prototype.findZone(self, zone)
    return self.floors:get(zone)
end
function TheAskellon.prototype.applyPowerChange(self, player, hasPower, justChanged)
    if hasPower and justChanged then
        if GetLocalPlayer() == player then
            self.powerUpSound:playSound()
        end
        self.world.game.timedEventQueue:AddEvent(
            __TS__New(
                TimedEvent,
                function()
                    if GetLocalPlayer() == player then
                        SetDayNightModels("Environment\\DNC\\DNCLordaeron\\DNCLordaeronTerrain\\DNCLordaeronTerrain.mdl", "Environment\\DNC\\DNCLordaeron\\DNCLordaeronUnit\\DNCLordaeronUnit.mdl")
                    end
                    return true
                end,
                4000
            )
        )
    elseif hasPower and not justChanged and player == GetLocalPlayer() then
        SetDayNightModels("Environment\\DNC\\DNCLordaeron\\DNCLordaeronTerrain\\DNCLordaeronTerrain.mdl", "Environment\\DNC\\DNCLordaeron\\DNCLordaeronUnit\\DNCLordaeronUnit.mdl")
    elseif not hasPower and player == GetLocalPlayer() then
        if justChanged then
            self.powerDownSound:playSound()
        end
        SetDayNightModels("", "")
    end
    if not hasPower then
        local crew = self.world.game.crewModule:getCrewmemberForPlayer(player)
        if crew then
            crew:addDespair(
                self.world.game,
                __TS__New(
                    BuffInstanceCallback,
                    function()
                        local z = self.world:getUnitZone(crew.unit)
                        return (z and function() return z:doCauseFear() end or function() return false end)()
                    end
                )
            )
        end
    end
end
function TheAskellon.prototype.damageShip(self, damage, zone)
    local damagedZone = (zone and function() return self:findZone(zone) end or function() return self:getRandomZone()[2] end)()
    local askellonUnit = self.world.game.spaceModule.mainShip.unit
    if askellonUnit then
        UnitDamageTarget(askellonUnit, askellonUnit, damage, true, false, ATTACK_TYPE_CHAOS, DAMAGE_TYPE_UNKNOWN, WEAPON_TYPE_WHOKNOWS)
    end
    if damage > SMALL_DAMAGE_THRESHOLD then
    elseif damage > MODREATE_DAMAGE_THRESHOLD then
    elseif damage > EXTREME_DAMAGE_THRESHOLD then
    end
end
function TheAskellon.prototype.getRandomZone(self)
    local items = Array:from(self.floors)
    return items[math.floor(
        math.random() * #items
    ) + 1]
end
return ____exports
end,
["src.app.world.world-module"] = function() require("lualib_bundle");
local ____exports = {}
local ____the_2Daskellon = require("src.app.world.the-askellon")
local TheAskellon = ____the_2Daskellon.TheAskellon
local ____zone_2Did = require("src.app.world.zone-id")
local ZONE_TYPE = ____zone_2Did.ZONE_TYPE
local ____trigger = require("src.app.types.jass-overrides.trigger")
local Trigger = ____trigger.Trigger
local ____serilog = require("src.lib.serilog.serilog")
local Log = ____serilog.Log
____exports.WorldModule = __TS__Class()
local WorldModule = ____exports.WorldModule
WorldModule.name = "WorldModule"
function WorldModule.prototype.____constructor(self, game)
    self.worldZones = __TS__New(Map)
    self.unitLocation = __TS__New(Map)
    self.game = game
    self.askellon = __TS__New(TheAskellon, self)
    local deathTrigger = __TS__New(Trigger)
    deathTrigger:RegisterAnyUnitEventBJ(EVENT_PLAYER_UNIT_DEATH)
    deathTrigger:AddAction(
        function() return self:unitDeath() end
    )
end
function WorldModule.prototype.travel(self, unit, to)
    local uHandle = GetHandleId(unit)
    local oldZone = self.unitLocation:get(uHandle)
    local newZone = self:getZone(to)
    local ____ = oldZone and oldZone:onLeave(self, unit)
    local ____ = newZone and newZone:onEnter(self, unit)
    local ____ = newZone and self.unitLocation:set(uHandle, newZone)
    if oldZone then
        Log.Information(
            tostring(
                GetHeroProperName(unit)
            ) .. "::" .. tostring(ZONE_TYPE[oldZone.id]) .. "->" .. tostring(ZONE_TYPE[to])
        )
    end
end
function WorldModule.prototype.unitDeath(self)
    local unit = GetTriggerUnit()
    local handle = GetHandleId(unit)
    if self.unitLocation:has(handle) then
        local zone = self.unitLocation:get(handle)
        local ____ = zone and zone:onLeave(self, unit)
        self.unitLocation:delete(handle)
    end
end
function WorldModule.prototype.getZone(self, whichZone)
    return self.askellon:findZone(whichZone) or self.worldZones:get(whichZone)
end
function WorldModule.prototype.getPlayersInZone(self, whichZone)
    return {}
end
function WorldModule.prototype.getUnitZone(self, whichUnit)
    return self.unitLocation:get(
        GetHandleId(whichUnit)
    )
end
return ____exports
end,
["src.app.galaxy.sector-names"] = function() local ____exports = {}
____exports.SECTOR_PREFIXES = {"Alpha", "Beta", "Zeta", "Gamma", "Charlie", "Founding", "Lost", "Terrible", "Frost", "Prima", "Old"}
____exports.SECTOR_NAMES = {"Sol", "Dionysus", "Guthao", "Valanope", "Syke", "Yestrucarro", "Boar", "Enides", "Xagaoruta", "Chongiuclite", "Brion", "Yaecury", "Steinway", "Crichi", "Thullon", "Bamania", "Bolla", "Leron", "Galion", "Chuzion", "Lladivis", "Iskies", "Xentara"}
return ____exports
end,
["src.app.galaxy.sector-sector-type"] = function() require("lualib_bundle");
local ____exports = {}
local ____sector_2Dnames = require("src.app.galaxy.sector-names")
local SECTOR_NAMES = ____sector_2Dnames.SECTOR_NAMES
local SECTOR_PREFIXES = ____sector_2Dnames.SECTOR_PREFIXES
____exports.SpaceSector = __TS__Class()
local SpaceSector = ____exports.SpaceSector
SpaceSector.name = "SpaceSector"
function SpaceSector.prototype.____constructor(self)
    self.name = ""
    self.seed = ""
end
function SpaceSector.prototype.initalise(self)
    self:nameSector()
end
function SpaceSector.prototype.nameSector(self)
    local prefix = SECTOR_PREFIXES[math.floor(
        math.random() * #SECTOR_PREFIXES
    ) + 1]
    local name = SECTOR_NAMES[math.floor(
        math.random() * #SECTOR_NAMES
    ) + 1]
    self.name = tostring(prefix) .. " " .. tostring(name)
end
function SpaceSector.prototype.setSeed(self, seed)
    self.seed = seed
end
return ____exports
end,
["src.app.galaxy.sector-type"] = function() require("lualib_bundle");
local ____exports = {}
local ____sector_2Dsector_2Dtype = require("src.app.galaxy.sector-sector-type")
local SpaceSector = ____sector_2Dsector_2Dtype.SpaceSector
____exports.SpaceGrid = __TS__Class()
local SpaceGrid = ____exports.SpaceGrid
SpaceGrid.name = "SpaceGrid"
function SpaceGrid.prototype.____constructor(self)
    self.sectors = {}
end
function SpaceGrid.prototype.initSectors(self, minX, minY, maxX, maxY)
    local x = minX
    while (function()
        local ____tmp = x
        x = ____tmp + 1
        return ____tmp
    end)() < maxX do
        local newSectors = {}
        local y = minY
        while (function()
            local ____tmp = y
            y = ____tmp + 1
            return ____tmp
        end)() < maxY do
            __TS__ArrayPush(
                newSectors,
                __TS__New(SpaceSector)
            )
        end
        __TS__ArrayPush(self.sectors, newSectors)
    end
    __TS__ArrayForEach(
        self.sectors,
        function(____, sectorArray) return __TS__ArrayForEach(
            sectorArray,
            function(____, sector) return sector:initalise() end
        ) end
    )
end
return ____exports
end,
["src.app.galaxy.galaxy-module"] = function() require("lualib_bundle");
local ____exports = {}
local ____sector_2Dtype = require("src.app.galaxy.sector-type")
local SpaceGrid = ____sector_2Dtype.SpaceGrid
____exports.GalaxyModule = __TS__Class()
local GalaxyModule = ____exports.GalaxyModule
GalaxyModule.name = "GalaxyModule"
function GalaxyModule.prototype.____constructor(self, game)
    self.game = game
    self.spaceGrid = __TS__New(SpaceGrid)
end
function GalaxyModule.prototype.initSectors(self)
    self.spaceGrid:initSectors(-5, -5, 5, 5)
end
function GalaxyModule.prototype.createNavigationGrid(self)
    local centerX = GetRectCenterX(NAGIVATION_RECT)
    local centerY = GetRectCenterY(NAGIVATION_RECT)
end
return ____exports
end,
["src.app.game"] = function() require("lualib_bundle");
local ____exports = {}
local ____crewmember_2Dmodule = require("src.app.crewmember.crewmember-module")
local CrewModule = ____crewmember_2Dmodule.CrewModule
local ____weapon_2Dmodule = require("src.app.weapons.weapon-module")
local WeaponModule = ____weapon_2Dmodule.WeaponModule
local ____timed_2Devent_2Dqueue = require("src.app.types.timed-event-queue")
local TimedEventQueue = ____timed_2Devent_2Dqueue.TimedEventQueue
local ____force_2Dmodule = require("src.app.force.force-module")
local ForceModule = ____force_2Dmodule.ForceModule
local ____space_2Dmodule = require("src.app.space.space-module")
local SpaceModule = ____space_2Dmodule.SpaceModule
local ____trigger = require("src.app.types.jass-overrides.trigger")
local Trigger = ____trigger.Trigger
local ____game_2Dtime_2Delapsed = require("src.app.types.game-time-elapsed")
local GameTimeElapsed = ____game_2Dtime_2Delapsed.GameTimeElapsed
local ____gene_2Dmodules = require("src.app.shops.gene-modules")
local GeneModule = ____gene_2Dmodules.GeneModule
local ____ability_2Dmodule = require("src.app.abilities.ability-module")
local AbilityModule = ____ability_2Dmodule.AbilityModule
local ____interaction_2Dmodule = require("src.app.interactions.interaction-module")
local InteractionModule = ____interaction_2Dmodule.InteractionModule
local ____serilog = require("src.lib.serilog.serilog")
local Log = ____serilog.Log
local ____vector2 = require("src.app.types.vector2")
local Vector2 = ____vector2.Vector2
local ____world_2Dmodule = require("src.app.world.world-module")
local WorldModule = ____world_2Dmodule.WorldModule
local ____zone_2Did = require("src.app.world.zone-id")
local ZONE_TYPE = ____zone_2Did.ZONE_TYPE
local ____galaxy_2Dmodule = require("src.app.galaxy.galaxy-module")
local GalaxyModule = ____galaxy_2Dmodule.GalaxyModule
____exports.Game = __TS__Class()
local Game = ____exports.Game
Game.name = "Game"
function Game.prototype.____constructor(self)
    self.TEMP_LOCATION = Location(0, 0)
    self.noTurn = false
    self.timedEventQueue = __TS__New(TimedEventQueue, self)
    self.gameTimeElapsed = __TS__New(GameTimeElapsed)
    self.galaxyModule = __TS__New(GalaxyModule, self)
    self.forceModule = __TS__New(ForceModule, self)
    self.weaponModule = __TS__New(WeaponModule, self)
    self.spaceModule = __TS__New(SpaceModule, self)
    self.worldModule = __TS__New(WorldModule, self)
    self.crewModule = __TS__New(CrewModule, self)
    self.abilityModule = __TS__New(AbilityModule, self)
    self.geneModule = __TS__New(GeneModule, self)
    self.interactionsModule = __TS__New(InteractionModule, self)
    self.galaxyModule:initSectors()
    self:initCommands()
    self:makeUnitsTurnInstantly()
end
function Game.prototype.getTimeStamp(self)
    return self.gameTimeElapsed:getTimeElapsed()
end
function Game.prototype.initCommands(self)
    local commandTrigger = __TS__New(Trigger)
    __TS__ArrayForEach(
        self.forceModule:getActivePlayers(),
        function(____, player)
            commandTrigger:RegisterPlayerChatEvent(player, "-", false)
        end
    )
    commandTrigger:AddAction(
        function()
            local triggerPlayer = GetTriggerPlayer()
            local crew = self.crewModule:getCrewmemberForPlayer(triggerPlayer)
            local message = GetEventPlayerChatString()
            local hasCommanderPower = true
            Log.Information(
                "Player name: ",
                GetPlayerName(triggerPlayer)
            )
            if message == "-resolve" and crew then
                crew:testResolve(self)
            elseif message == "-u" and crew then
                if crew.weapon then
                    crew.weapon:detach()
                    crew.weapon:updateTooltip(self.weaponModule, crew)
                end
            elseif message == "-nt" then
                self.noTurn = not self.noTurn
            elseif message == "-p1off" then
                Log.Information("Killing power to floor 1")
                local z = self.worldModule.askellon:findZone(ZONE_TYPE.FLOOR_1)
                local ____ = z and z:updatePower(self.worldModule, false)
            elseif message == "-p1on" then
                Log.Information("Restoring power to floor 1")
                local z = self.worldModule.askellon:findZone(ZONE_TYPE.FLOOR_1)
                local ____ = z and z:updatePower(self.worldModule, true)
            elseif message == "-testalien" then
                self:getCameraXY(
                    triggerPlayer,
                    function(____self, pos)
                        local alien = CreateUnit(
                            triggerPlayer,
                            FourCC("ALI1"),
                            pos.x,
                            pos.y,
                            bj_UNIT_FACING
                        )
                        self.abilityModule:trackUnitOrdersForAbilities(alien)
                    end
                )
            end
        end
    )
end
function Game.prototype.useDummyFor(self, callback, abilityToCast)
    local dummyUnit = CreateUnit(
        Player(25),
        FourCC("dumy"),
        0,
        0,
        bj_UNIT_FACING
    )
    ShowUnit(dummyUnit, false)
    UnitAddAbility(dummyUnit, abilityToCast)
    callback(nil, dummyUnit)
    UnitApplyTimedLife(dummyUnit, 0, 3)
end
function Game.prototype.getZFromXY(self, x, y)
    MoveLocation(self.TEMP_LOCATION, x, y)
    return GetLocationZ(self.TEMP_LOCATION)
end
function Game.prototype.getCameraXY(self, whichPlayer, cb)
    local HANDLE = "CAMERA"
    local syncTrigger = __TS__New(Trigger)
    BlzTriggerRegisterPlayerSyncEvent(syncTrigger.nativeTrigger, whichPlayer, HANDLE, false)
    syncTrigger:AddAction(
        function()
            local data = BlzGetTriggerSyncData()
            local dataSplit = __TS__StringSplit(data, ",")
            local result = __TS__New(
                Vector2,
                S2R(dataSplit[1]),
                S2R(dataSplit[2])
            )
            Log.Information(
                "Got data: " .. tostring(result.x) .. ", " .. tostring(result.y)
            )
            syncTrigger:destroy()
            cb(nil, result)
        end
    )
    if GetLocalPlayer() == whichPlayer then
        local x = GetCameraTargetPositionX()
        local y = GetCameraTargetPositionY()
        BlzSendSyncData(
            HANDLE,
            tostring(x) .. "," .. tostring(y)
        )
    end
end
function Game.prototype.makeUnitsTurnInstantly(self)
    local unitTurnTrigger = __TS__New(Trigger)
    unitTurnTrigger:RegisterAnyUnitEventBJ(EVENT_PLAYER_UNIT_ISSUED_UNIT_ORDER)
    unitTurnTrigger:RegisterAnyUnitEventBJ(EVENT_PLAYER_UNIT_ISSUED_POINT_ORDER)
    unitTurnTrigger:RegisterAnyUnitEventBJ(EVENT_PLAYER_UNIT_ISSUED_TARGET_ORDER)
    unitTurnTrigger:AddAction(
        function()
            if not self.noTurn then
                return
            end
            local triggerUnit = GetTriggerUnit()
            local oX = GetUnitX(triggerUnit)
            local oY = GetUnitY(triggerUnit)
            local targetLocationX = GetOrderPointX()
            local targetLocationY = GetOrderPointY()
            if targetLocationX == nil then
                local u = GetOrderTargetUnit()
                targetLocationX = GetUnitX(u)
                targetLocationY = GetUnitY(u)
            end
            local angle = Rad2Deg(
                Atan2(targetLocationY - oY, targetLocationX - oX)
            )
            BlzSetUnitFacingEx(triggerUnit, angle)
        end
    )
end
return ____exports
end,
["src.lib.serilog.string-sink"] = function() require("lualib_bundle");
local ____exports = {}
local ____serilog = require("src.lib.serilog.serilog")
local Log = ____serilog.Log
local LogEventType = ____serilog.LogEventType
local LogLevel = ____serilog.LogLevel
local ____translators = require("src.lib.translators")
local SendMessageUnlogged = ____translators.SendMessageUnlogged
____exports.StringSink = __TS__Class()
local StringSink = ____exports.StringSink
StringSink.name = "StringSink"
function StringSink.prototype.____constructor(self, logLevel, printer)
    self.logLevel = logLevel
    self.printer = printer
    _G.SendMessage = function(msg)
        Log.Message(
            "{\"s\":\"BROADCAST\", \"m\":\"" .. tostring(msg) .. "\"}"
        )
        SendMessageUnlogged(msg)
    end
end
function StringSink.prototype.LogLevel(self)
    return self.logLevel
end
function StringSink.prototype.Log(self, level, events)
    local message = ""
    do
        local index = 0
        while index < #events do
            local event = events[index + 1]
            if event.Type == LogEventType.Text then
                message = tostring(message) .. tostring(event.Text)
            elseif event.Type == LogEventType.Parameter then
                local whichType = type(event.Value)
                local color = ____exports.StringSink.Colors[whichType]
                if color then
                    message = tostring(message) .. "|cff" .. tostring(color)
                end
                if ____exports.StringSink.Brackets[whichType] then
                    message = tostring(message) .. "{ "
                end
                message = tostring(message) .. tostring(event.Value)
                if ____exports.StringSink.Brackets[whichType] then
                    message = tostring(message) .. " }"
                end
                if color then
                    message = tostring(message) .. "|r"
                end
            end
            index = index + 1
        end
    end
    self.printer(
        string.format("[%s]: %s", ____exports.StringSink.Prefix[level], message)
    )
end
StringSink.Prefix = {[LogLevel.None] = "|cffffffffNON|r", [LogLevel.Verbose] = "|cff9d9d9dVRB|r", [LogLevel.Debug] = "|cff9d9d9dDBG|r", [LogLevel.Information] = "|cffe6cc80INF|r", [LogLevel.Message] = "|cffe6cc80MSG|r", [LogLevel.Event] = "|cffe6cc80EVT|r", [LogLevel.Warning] = "|cffffcc00WRN|r", [LogLevel.Error] = "|cffff8000ERR|r", [LogLevel.Fatal] = "|cffff0000FTL|r"}
StringSink.Colors = {["nil"] = "9d9d9d", boolean = "1eff00", number = "00ccff", string = "ff8000", table = "ffcc00", ["function"] = "ffcc00", userdata = "ffcc00"}
StringSink.Brackets = {["nil"] = false, boolean = false, number = false, string = false, table = true, ["function"] = true, userdata = true}
return ____exports
end,
["node_modules.w3ts.src.hooks.index"] = function() require("lualib_bundle");
local ____exports = {}
local oldMain
oldMain = main
local oldConfig
oldConfig = config
local hooksMainBefore = {}
local hooksMainAfter = {}
local hooksConfigBefore = {}
local hooksConfigAfter = {}
local function hookedMain()
    __TS__ArrayForEach(
        hooksMainBefore,
        function(____, func) return func() end
    )
    oldMain()
    __TS__ArrayForEach(
        hooksMainAfter,
        function(____, func) return func() end
    )
end
local function hookedConfig()
    __TS__ArrayForEach(
        hooksConfigBefore,
        function(____, func) return func() end
    )
    oldConfig()
    __TS__ArrayForEach(
        hooksConfigAfter,
        function(____, func) return func() end
    )
end
main = hookedMain
config = hookedConfig
____exports.W3TS_HOOK = {}
____exports.W3TS_HOOK.MAIN_BEFORE = "main::before"
____exports.W3TS_HOOK.MAIN_AFTER = "main::after"
____exports.W3TS_HOOK.CONFIG_BEFORE = "config::before"
____exports.W3TS_HOOK.CONFIG_AFTER = "config::after"
local entryPoints = {[____exports.W3TS_HOOK.MAIN_BEFORE] = hooksMainBefore, [____exports.W3TS_HOOK.MAIN_AFTER] = hooksMainAfter, [____exports.W3TS_HOOK.CONFIG_BEFORE] = hooksConfigBefore, [____exports.W3TS_HOOK.CONFIG_AFTER] = hooksConfigAfter}
function ____exports.addScriptHook(entryPoint, hook)
    if not (entryPoints[entryPoint] ~= nil) then
        return false
    end
    __TS__ArrayPush(entryPoints[entryPoint], hook)
    return true
end
return ____exports
end,
["src.main"] = function() require("lualib_bundle");
local ____exports = {}
local ____game = require("src.app.game")
local Game = ____game.Game
local TRANSLATORS = require("src.lib.translators")
local ____string_2Dsink = require("src.lib.serilog.string-sink")
local StringSink = ____string_2Dsink.StringSink
local ____serilog = require("src.lib.serilog.serilog")
local Log = ____serilog.Log
local LogLevel = ____serilog.LogLevel
local ____index = require("node_modules.w3ts.src.hooks.index")
local addScriptHook = ____index.addScriptHook
local function tsMain()
    Log.Init(
        {
            __TS__New(StringSink, LogLevel.Debug, TRANSLATORS.SendMessageUnlogged)
        }
    )
    local function Main()
        local AksellonSector = __TS__New(Game)
    end
    Main()
end
addScriptHook("main::after", tsMain)
return ____exports
end,
["src.app.abilities.human.grenade"] = function() require("lualib_bundle");
local ____exports = {}
local ____vector2 = require("src.app.types.vector2")
local vectorFromUnit = ____vector2.vectorFromUnit
local ____vector3 = require("src.app.types.vector3")
local Vector3 = ____vector3.Vector3
local ____projectile = require("src.app.weapons.projectile.projectile")
local Projectile = ____projectile.Projectile
local ____projectile_2Dtarget = require("src.app.weapons.projectile.projectile-target")
local ProjectileTargetStatic = ____projectile_2Dtarget.ProjectileTargetStatic
local ProjectileMoverParabolic = ____projectile_2Dtarget.ProjectileMoverParabolic
local ____filters = require("src.resources.filters")
local FilterIsEnemyAndAlive = ____filters.FilterIsEnemyAndAlive
local EXPLOSION_BASE_DAMAGE = 100
local EXPLOSION_AOE = 200
local ABILITY_GRENADE_LAUNCH = FourCC("A00B")
local MISSILE_LAUNCH_SFX = "Abilities\\Spells\\Undead\\DeathCoil\\DeathCoilSpecialArt.mdl"
local MISSILE_SFX = "Abilities\\Weapons\\ChimaeraAcidMissile\\ChimaeraAcidMissile.mdl"
____exports.GrenadeLaunchAbility = __TS__Class()
local GrenadeLaunchAbility = ____exports.GrenadeLaunchAbility
GrenadeLaunchAbility.name = "GrenadeLaunchAbility"
function GrenadeLaunchAbility.prototype.____constructor(self)
    self.damageGroup = CreateGroup()
end
function GrenadeLaunchAbility.prototype.initialise(self, module)
    self.casterUnit = GetTriggerUnit()
    self.targetLoc = __TS__New(
        Vector3,
        GetSpellTargetX(),
        GetSpellTargetY(),
        0
    )
    self.targetLoc.z = module.game:getZFromXY(self.targetLoc.x, self.targetLoc.y)
    self.castingPlayer = GetOwningPlayer(self.casterUnit)
    local polarPoint = vectorFromUnit(self.casterUnit):applyPolarOffset(
        GetUnitFacing(self.casterUnit),
        80
    )
    local startLoc = __TS__New(
        Vector3,
        polarPoint.x,
        polarPoint.y,
        module.game:getZFromXY(polarPoint.x, polarPoint.y) + 30
    )
    local deltaTarget = self.targetLoc:subtract(startLoc)
    local projectile = __TS__New(
        Projectile,
        self.casterUnit,
        startLoc,
        __TS__New(ProjectileTargetStatic, deltaTarget),
        __TS__New(
            ProjectileMoverParabolic,
            startLoc,
            self.targetLoc,
            Deg2Rad(
                GetRandomReal(15, 30)
            )
        )
    ):onDeath(
        function(proj)
            self:explode(
                proj:getPosition()
            )
        end
    ):onCollide(
        function() return true end
    )
    projectile:addEffect(
        MISSILE_SFX,
        __TS__New(Vector3, 0, 0, 0),
        deltaTarget:normalise(),
        1
    )
    local sfx = AddSpecialEffect(MISSILE_LAUNCH_SFX, polarPoint.x, polarPoint.y)
    BlzSetSpecialEffectHeight(sfx, -30)
    DestroyEffect(sfx)
    module.game.weaponModule:addProjectile(projectile)
    return true
end
function GrenadeLaunchAbility.prototype.explode(self, atWhere)
    if self.castingPlayer then
        GroupEnumUnitsInRange(
            self.damageGroup,
            atWhere.x,
            atWhere.y,
            EXPLOSION_AOE,
            FilterIsEnemyAndAlive(self.castingPlayer)
        )
        ForGroup(
            self.damageGroup,
            function() return self:damageUnit() end
        )
    end
end
function GrenadeLaunchAbility.prototype.process(self, abMod, delta)
    return true
end
function GrenadeLaunchAbility.prototype.damageUnit(self)
    if self.casterUnit then
        local unit = GetEnumUnit()
        UnitDamageTarget(self.casterUnit, unit, EXPLOSION_BASE_DAMAGE, true, true, ATTACK_TYPE_MAGIC, DAMAGE_TYPE_ACID, WEAPON_TYPE_WHOKNOWS)
    end
end
function GrenadeLaunchAbility.prototype.destroy(self, module)
    DestroyGroup(self.damageGroup)
    return true
end
return ____exports
end,
["src.app.galaxy.navigation-grid-type"] = function() require("lualib_bundle");
local ____exports = {}
____exports.NavigationGrid = __TS__Class()
local NavigationGrid = ____exports.NavigationGrid
NavigationGrid.name = "NavigationGrid"
function NavigationGrid.prototype.____constructor(self, x, y)
    self.gridItems = {}
    self.centerX = x
    self.centerY = y
end
function NavigationGrid.prototype.renderForSectors(self, galaxyModule, sectors)
end
function NavigationGrid.prototype.getFadeValue(self, distanceFromCenter)
    return 1
end
return ____exports
end,
["src.app.shops.shop-module.ts"] = function() require("lualib_bundle");
local ____exports = {}
local SharedShop = __TS__Class()
SharedShop.name = "SharedShop"
function SharedShop.prototype.____constructor(self, mainUnit)
    self.unit = mainUnit
    self.playerUnits = {}
end
____exports.ShopModule = __TS__Class()
local ShopModule = ____exports.ShopModule
ShopModule.name = "ShopModule"
function ShopModule.prototype.____constructor(self, game)
end
return ____exports
end,
["src.lib.serilog.preload-sink"] = function() require("lualib_bundle");
local ____exports = {}
____exports.PreloadSink = __TS__Class()
local PreloadSink = ____exports.PreloadSink
PreloadSink.name = "PreloadSink"
function PreloadSink.prototype.____constructor(self, logLevel, FileName)
    self.logLevel = logLevel
    self.FileName = FileName
end
function PreloadSink.prototype.LogLevel(self)
    return self.logLevel
end
function PreloadSink.prototype.LogEventToJson(self, logEvent)
    local json = "{"
    json = tostring(json) .. "\"t\":\"" .. tostring(logEvent.Text) .. "\""
    if logEvent.Value then
        local serializeRaw = ____exports.PreloadSink.SerializeRaw[type(logEvent.Value)]
        if serializeRaw then
            json = tostring(json) .. ",\"v\":" .. tostring(logEvent.Value)
        else
            json = tostring(json) .. ",\"v\":\"" .. tostring(logEvent.Value) .. "\""
        end
    end
    json = tostring(json) .. "}"
    return json
end
function PreloadSink.prototype.Log(self, level, events)
    local json = "{"
    json = tostring(json) .. "\"l\":" .. tostring(level) .. ","
    json = tostring(json) .. "\"e\":["
    do
        local index = 0
        while index < #events do
            json = tostring(json) .. tostring(
                self:LogEventToJson(events[index + 1])
            )
            if index < #events - 1 then
                json = tostring(json) .. ","
            end
            index = index + 1
        end
    end
    json = tostring(json) .. "]"
    json = tostring(json) .. "}"
    PreloadGenStart()
    Preload(
        "{\"logevent\":" .. tostring(json) .. "}"
    )
    PreloadGenEnd(self.FileName)
end
PreloadSink.SerializeRaw = {["nil"] = false, boolean = true, number = true, string = false, table = false, ["function"] = false, userdata = false}
return ____exports
end,
["src.lib.system.IO.File"] = function() require("lualib_bundle");
local ____exports = {}
____exports.File = __TS__Class()
local File = ____exports.File
File.name = "File"
function File.prototype.____constructor(self)
end
function File.write(self, filename, contents)
    PreloadGenClear()
    PreloadGenStart()
    do
        local i = 0
        while i < (#contents / 200) do
            local abilityId = ____exports.File.abilityList[i + 1]
            local buffer = string.sub(contents, (i * ____exports.File.preloadLimit) + 1, (i * ____exports.File.preloadLimit) + ____exports.File.preloadLimit)
            Preload(
                "\" )\ncall BlzSetAbilityTooltip(" .. tostring(abilityId) .. ", \"" .. tostring(buffer) .. "\", 0)\n//"
            )
            i = i + 1
        end
    end
    Preload("\" )\nendfunction\nfunction a takes nothing returns nothing\n //")
    PreloadGenEnd(filename)
    return self
end
function File.read(self, filename)
    local output = ""
    local originalTooltip = {}
    local doneReading = false
    do
        local i = 0
        while i < #self.abilityList do
            originalTooltip[i + 1] = BlzGetAbilityTooltip(self.abilityList[i + 1], 0)
            i = i + 1
        end
    end
    Preloader(filename)
    do
        local i = 0
        while i < #self.abilityList do
            if not doneReading then
                local buffer = BlzGetAbilityTooltip(self.abilityList[i + 1], 0)
                if buffer == originalTooltip[i + 1] then
                    doneReading = true
                else
                    output = tostring(output) .. tostring(buffer)
                end
            end
            BlzSetAbilityTooltip(self.abilityList[i + 1], originalTooltip[i + 1], 0)
            i = i + 1
        end
    end
    return output
end
File.preloadLimit = 200
File.abilityList = {
    FourCC("Amls"),
    FourCC("Aroc"),
    FourCC("Amic"),
    FourCC("Amil"),
    FourCC("Aclf")
}
File.maxLength = ____exports.File.preloadLimit * #____exports.File.abilityList
return ____exports
end,
["src.resources.ability-tooltips"] = function() local ____exports = {}
____exports.RESOLVE_TOOLTIP = function() return "|cff808080Everyone onboard the Askellon went through extensive surgeries to ensure that their bodies could withstand the brutalities of space travel. Be it the implanted and extensively enhanced andrenaline glands or just the human will to live; you will not go down without a fight.|r\n\nUpon reaching 30% hitpoints gain |cffffff00Resolve|r, enhancing all your abilities. |cff00ff00 \n - Gain 30% increased movement speed\n - All damage received is reduced by 30%\n|r\n" end
return ____exports
end,
["lualib_bundle"] = function() function __TS__ArrayConcat(arr1, ...)
    local args = ({...})
    local out = {}
    for ____, val in ipairs(arr1) do
        out[#out + 1] = val
    end
    for ____, arg in ipairs(args) do
        if pcall(
            function() return #arg end
        ) and type(arg) ~= "string" then
            local argAsArray = arg
            for ____, val in ipairs(argAsArray) do
                out[#out + 1] = val
            end
        else
            out[#out + 1] = arg
        end
    end
    return out
end

function __TS__ArrayEvery(arr, callbackfn)
    do
        local i = 0
        while i < #arr do
            if not callbackfn(_G, arr[i + 1], i, arr) then
                return false
            end
            i = i + 1
        end
    end
    return true
end

function __TS__ArrayFilter(arr, callbackfn)
    local result = {}
    do
        local i = 0
        while i < #arr do
            if callbackfn(_G, arr[i + 1], i, arr) then
                result[#result + 1] = arr[i + 1]
            end
            i = i + 1
        end
    end
    return result
end

function __TS__ArrayForEach(arr, callbackFn)
    do
        local i = 0
        while i < #arr do
            callbackFn(_G, arr[i + 1], i, arr)
            i = i + 1
        end
    end
end

function __TS__ArrayFind(arr, predicate)
    local len = #arr
    local k = 0
    while k < len do
        local elem = arr[k + 1]
        if predicate(_G, elem, k, arr) then
            return elem
        end
        k = k + 1
    end
    return nil
end

function __TS__ArrayFindIndex(arr, callbackFn)
    do
        local i = 0
        local len = #arr
        while i < len do
            if callbackFn(_G, arr[i + 1], i, arr) then
                return i
            end
            i = i + 1
        end
    end
    return -1
end

function __TS__ArrayIndexOf(arr, searchElement, fromIndex)
    local len = #arr
    if len == 0 then
        return -1
    end
    local n = 0
    if fromIndex then
        n = fromIndex
    end
    if n >= len then
        return -1
    end
    local k
    if n >= 0 then
        k = n
    else
        k = len + n
        if k < 0 then
            k = 0
        end
    end
    do
        local i = k
        while i < len do
            if arr[i + 1] == searchElement then
                return i
            end
            i = i + 1
        end
    end
    return -1
end

function __TS__ArrayMap(arr, callbackfn)
    local newArray = {}
    do
        local i = 0
        while i < #arr do
            newArray[i + 1] = callbackfn(_G, arr[i + 1], i, arr)
            i = i + 1
        end
    end
    return newArray
end

function __TS__ArrayPush(arr, ...)
    local items = ({...})
    for ____, item in ipairs(items) do
        arr[#arr + 1] = item
    end
    return #arr
end

function __TS__ArrayReduce(arr, callbackFn, ...)
    local len = #arr
    local k = 0
    local accumulator = nil
    if select("#", ...) ~= 0 then
        accumulator = select(1, ...)
    elseif len > 0 then
        accumulator = arr[1]
        k = 1
    else
        error("Reduce of empty array with no initial value", 0)
    end
    for i = k, len - 1 do
        accumulator = callbackFn(_G, accumulator, arr[i + 1], i, arr)
    end
    return accumulator
end

function __TS__ArrayReduceRight(arr, callbackFn, ...)
    local len = #arr
    local k = len - 1
    local accumulator = nil
    if select("#", ...) ~= 0 then
        accumulator = select(1, ...)
    elseif len > 0 then
        accumulator = arr[k + 1]
        k = k - 1
    else
        error("Reduce of empty array with no initial value", 0)
    end
    for i = k, 0, -1 do
        accumulator = callbackFn(_G, accumulator, arr[i + 1], i, arr)
    end
    return accumulator
end

function __TS__ArrayReverse(arr)
    local i = 0
    local j = #arr - 1
    while i < j do
        local temp = arr[j + 1]
        arr[j + 1] = arr[i + 1]
        arr[i + 1] = temp
        i = i + 1
        j = j - 1
    end
    return arr
end

function __TS__ArrayShift(arr)
    return table.remove(arr, 1)
end

function __TS__ArrayUnshift(arr, ...)
    local items = ({...})
    do
        local i = #items - 1
        while i >= 0 do
            table.insert(arr, 1, items[i + 1])
            i = i - 1
        end
    end
    return #arr
end

function __TS__ArraySort(arr, compareFn)
    if compareFn ~= nil then
        table.sort(
            arr,
            function(a, b) return compareFn(_G, a, b) < 0 end
        )
    else
        table.sort(arr)
    end
    return arr
end

function __TS__ArraySlice(list, first, last)
    local len = #list
    local relativeStart = first or 0
    local k
    if relativeStart < 0 then
        k = math.max(len + relativeStart, 0)
    else
        k = math.min(relativeStart, len)
    end
    local relativeEnd = last
    if last == nil then
        relativeEnd = len
    end
    local final
    if relativeEnd < 0 then
        final = math.max(len + relativeEnd, 0)
    else
        final = math.min(relativeEnd, len)
    end
    local out = {}
    local n = 0
    while k < final do
        out[n + 1] = list[k + 1]
        k = k + 1
        n = n + 1
    end
    return out
end

function __TS__ArraySome(arr, callbackfn)
    do
        local i = 0
        while i < #arr do
            if callbackfn(_G, arr[i + 1], i, arr) then
                return true
            end
            i = i + 1
        end
    end
    return false
end

function __TS__ArraySplice(list, ...)
    local len = #list
    local actualArgumentCount = select("#", ...)
    local start = select(1, ...)
    local deleteCount = select(2, ...)
    local actualStart
    if start < 0 then
        actualStart = math.max(len + start, 0)
    else
        actualStart = math.min(start, len)
    end
    local itemCount = math.max(actualArgumentCount - 2, 0)
    local actualDeleteCount
    if actualArgumentCount == 0 then
        actualDeleteCount = 0
    elseif actualArgumentCount == 1 then
        actualDeleteCount = len - actualStart
    else
        actualDeleteCount = math.min(
            math.max(deleteCount or 0, 0),
            len - actualStart
        )
    end
    local out = {}
    do
        local k = 0
        while k < actualDeleteCount do
            local from = actualStart + k
            if list[from + 1] then
                out[k + 1] = list[from + 1]
            end
            k = k + 1
        end
    end
    if itemCount < actualDeleteCount then
        do
            local k = actualStart
            while k < len - actualDeleteCount do
                local from = k + actualDeleteCount
                local to = k + itemCount
                if list[from + 1] then
                    list[to + 1] = list[from + 1]
                else
                    list[to + 1] = nil
                end
                k = k + 1
            end
        end
        do
            local k = len
            while k > len - actualDeleteCount + itemCount do
                list[k] = nil
                k = k - 1
            end
        end
    elseif itemCount > actualDeleteCount then
        do
            local k = len - actualDeleteCount
            while k > actualStart do
                local from = k + actualDeleteCount - 1
                local to = k + itemCount - 1
                if list[from + 1] then
                    list[to + 1] = list[from + 1]
                else
                    list[to + 1] = nil
                end
                k = k - 1
            end
        end
    end
    local j = actualStart
    for i = 3, actualArgumentCount do
        list[j + 1] = select(i, ...)
        j = j + 1
    end
    do
        local k = #list - 1
        while k >= len - actualDeleteCount + itemCount do
            list[k + 1] = nil
            k = k - 1
        end
    end
    return out
end

function __TS__ArrayToObject(array)
    local object = {}
    do
        local i = 0
        while i < #array do
            object[i] = array[i + 1]
            i = i + 1
        end
    end
    return object
end

function __TS__ArrayFlat(array, depth)
    if depth == nil then
        depth = 1
    end
    local result = {}
    for ____, value in ipairs(array) do
        if depth > 0 and type(value) == "table" and (value[1] ~= nil or next(value, nil) == nil) then
            result = __TS__ArrayConcat(
                result,
                __TS__ArrayFlat(value, depth - 1)
            )
        else
            result[#result + 1] = value
        end
    end
    return result
end

function __TS__ArrayFlatMap(array, callback)
    local result = {}
    do
        local i = 0
        while i < #array do
            local value = callback(_G, array[i + 1], i, array)
            if type(value) == "table" and (value[1] ~= nil or next(value, nil) == nil) then
                result = __TS__ArrayConcat(result, value)
            else
                result[#result + 1] = value
            end
            i = i + 1
        end
    end
    return result
end

function __TS__ArraySetLength(arr, length)
    if length < 0 or length ~= length or length == math.huge or math.floor(length) ~= length then
        error(
            "invalid array length: " .. tostring(length),
            0
        )
    end
    do
        local i = #arr - 1
        while i >= length do
            arr[i + 1] = nil
            i = i - 1
        end
    end
    return length
end

function __TS__Class(self)
    local c = {}
    c.__index = c
    c.prototype = {}
    c.prototype.__index = c.prototype
    c.prototype.constructor = c
    return c
end

function __TS__ClassIndex(classTable, key)
    while true do
        local getters = rawget(classTable, "____getters")
        if getters then
            local getter
            getter = getters[key]
            if getter then
                return getter(classTable)
            end
        end
        classTable = rawget(classTable, "____super")
        if not classTable then
            break
        end
        local val = rawget(classTable, key)
        if val ~= nil then
            return val
        end
    end
end

function __TS__ClassNewIndex(classTable, key, val)
    local tbl = classTable
    repeat
        do
            local setters = rawget(tbl, "____setters")
            if setters then
                local setter
                setter = setters[key]
                if setter then
                    setter(tbl, val)
                    return
                end
            end
            tbl = rawget(tbl, "____super")
        end
    until not tbl
    rawset(classTable, key, val)
end

function __TS__Decorate(decorators, target, key, desc)
    local result = target
    do
        local i = #decorators
        while i >= 0 do
            local decorator = decorators[i + 1]
            if decorator then
                local oldResult = result
                if key == nil then
                    result = decorator(_G, result)
                elseif desc ~= nil then
                    result = decorator(_G, target, key, result)
                else
                    result = decorator(_G, target, key)
                end
                result = result or oldResult
            end
            i = i - 1
        end
    end
    return result
end

function __TS__New(target, ...)
    local instance = setmetatable({}, target.prototype)
    instance:____constructor(...)
    return instance
end

function __TS__FunctionCall(fn, thisArg, ...)
    local args = ({...})
    return fn(
        thisArg,
        (unpack or table.unpack)(args)
    )
end

function __TS__GetErrorStack(self, constructor)
    local level = 1
    while true do
        local info = debug.getinfo(level, "f")
        level = level + 1
        if not info then
            level = 1
            break
        elseif info.func == constructor then
            break
        end
    end
    return debug.traceback(nil, level)
end
function __TS__WrapErrorToString(self, getDescription)
    return function(self)
        local description = __TS__FunctionCall(getDescription, self)
        local caller = debug.getinfo(3, "f")
        if _VERSION == "Lua 5.1" or (caller and caller.func ~= error) then
            return description
        else
            return tostring(description) .. "\n" .. tostring(self.stack)
        end
    end
end
function __TS__InitErrorClass(self, Type, name)
    Type.name = name
    return setmetatable(
        Type,
        {
            __call = function(____, _self, message) return __TS__New(Type, message) end
        }
    )
end
Error = __TS__InitErrorClass(
    _G,
    (function()
        local ____ = __TS__Class()
        ____.name = "____"
        function ____.prototype.____constructor(self, message)
            if message == nil then
                message = ""
            end
            self.message = message
            self.name = "Error"
            self.stack = __TS__GetErrorStack(_G, self.constructor.new)
            local metatable = getmetatable(self)
            if not metatable.__errorToStringPatched then
                metatable.__errorToStringPatched = true
                metatable.__tostring = __TS__WrapErrorToString(_G, metatable.__tostring)
            end
        end
        function ____.prototype.__tostring(self)
            return ((self.message ~= "") and function() return tostring(self.name) .. ": " .. tostring(self.message) end or function() return self.name end)()
        end
        return ____
    end)(),
    "Error"
)
for ____, errorName in ipairs({"RangeError", "ReferenceError", "SyntaxError", "TypeError", "URIError"}) do
    _G[errorName] = __TS__InitErrorClass(
        _G,
        (function()
            local ____ = __TS__Class()
            ____.name = "____"
            ____.____super = Error
            setmetatable(____, ____.____super)
            setmetatable(____.prototype, ____.____super.prototype)
            function ____.prototype.____constructor(self, ...)
                Error.prototype.____constructor(self, ...)
                self.name = errorName
            end
            return ____
        end)(),
        errorName
    )
end

function __TS__FunctionApply(fn, thisArg, args)
    if args then
        return fn(
            thisArg,
            (unpack or table.unpack)(args)
        )
    else
        return fn(thisArg)
    end
end

function __TS__FunctionBind(fn, thisArg, ...)
    local boundArgs = ({...})
    return function(____, ...)
        local args = ({...})
        do
            local i = 0
            while i < #boundArgs do
                table.insert(args, i + 1, boundArgs[i + 1])
                i = i + 1
            end
        end
        return fn(
            thisArg,
            (unpack or table.unpack)(args)
        )
    end
end

function __TS__Index(classProto)
    return function(tbl, key)
        local proto = classProto
        while true do
            local val = rawget(proto, key)
            if val ~= nil then
                return val
            end
            local getters = rawget(proto, "____getters")
            if getters then
                local getter
                getter = getters[key]
                if getter then
                    return getter(tbl)
                end
            end
            local base = rawget(
                rawget(proto, "constructor"),
                "____super"
            )
            if not base then
                break
            end
            proto = rawget(base, "prototype")
        end
    end
end

local ____symbolMetatable = {
    __tostring = function(self)
        if self.description == nil then
            return "Symbol()"
        else
            return "Symbol(" .. tostring(self.description) .. ")"
        end
    end
}
function __TS__Symbol(description)
    return setmetatable({description = description}, ____symbolMetatable)
end
Symbol = {
    iterator = __TS__Symbol("Symbol.iterator"),
    hasInstance = __TS__Symbol("Symbol.hasInstance"),
    species = __TS__Symbol("Symbol.species"),
    toStringTag = __TS__Symbol("Symbol.toStringTag")
}

function __TS__InstanceOf(obj, classTbl)
    if type(classTbl) ~= "table" then
        error("Right-hand side of 'instanceof' is not an object", 0)
    end
    if classTbl[Symbol.hasInstance] ~= nil then
        return not not classTbl[Symbol.hasInstance](classTbl, obj)
    end
    if obj ~= nil then
        local luaClass = obj.constructor
        while luaClass ~= nil do
            if luaClass == classTbl then
                return true
            end
            luaClass = luaClass.____super
        end
    end
    return false
end

function __TS__InstanceOfObject(value)
    local valueType = type(value)
    return valueType == "table" or valueType == "function"
end

function __TS__Iterator(iterable)
    if iterable[Symbol.iterator] then
        local iterator = iterable[Symbol.iterator](iterable)
        return function()
            local result = iterator:next()
            if not result.done then
                return result.value
            else
                return nil
            end
        end
    else
        local i = 0
        return function()
            i = i + 1
            return iterable[i]
        end
    end
end

Map = (function()
    local Map = __TS__Class()
    Map.name = "Map"
    function Map.prototype.____constructor(self, entries)
        self[Symbol.toStringTag] = "Map"
        self.items = {}
        self.size = 0
        self.nextKey = {}
        self.previousKey = {}
        if entries == nil then
            return
        end
        local iterable = entries
        if iterable[Symbol.iterator] then
            local iterator = iterable[Symbol.iterator](iterable)
            while true do
                local result = iterator:next()
                if result.done then
                    break
                end
                local value = result.value
                self:set(value[1], value[2])
            end
        else
            local array = entries
            for ____, kvp in ipairs(array) do
                self:set(kvp[1], kvp[2])
            end
        end
    end
    function Map.prototype.clear(self)
        self.items = {}
        self.nextKey = {}
        self.previousKey = {}
        self.firstKey = nil
        self.lastKey = nil
        self.size = 0
        return
    end
    function Map.prototype.delete(self, key)
        local contains = self:has(key)
        if contains then
            self.size = self.size - 1
            local next = self.nextKey[key]
            local previous = self.previousKey[key]
            if next and previous then
                self.nextKey[previous] = next
                self.previousKey[next] = previous
            elseif next then
                self.firstKey = next
                self.previousKey[next] = nil
            elseif previous then
                self.lastKey = previous
                self.nextKey[previous] = nil
            else
                self.firstKey = nil
                self.lastKey = nil
            end
            self.nextKey[key] = nil
            self.previousKey[key] = nil
        end
        self.items[key] = nil
        return contains
    end
    function Map.prototype.forEach(self, callback)
        for key in __TS__Iterator(
            self:keys()
        ) do
            callback(_G, self.items[key], key, self)
        end
        return
    end
    function Map.prototype.get(self, key)
        return self.items[key]
    end
    function Map.prototype.has(self, key)
        return self.nextKey[key] ~= nil or self.lastKey == key
    end
    function Map.prototype.set(self, key, value)
        local isNewValue = not self:has(key)
        if isNewValue then
            self.size = self.size + 1
        end
        self.items[key] = value
        if self.firstKey == nil then
            self.firstKey = key
            self.lastKey = key
        elseif isNewValue then
            self.nextKey[self.lastKey] = key
            self.previousKey[key] = self.lastKey
            self.lastKey = key
        end
        return self
    end
    Map.prototype[Symbol.iterator] = function(self)
        return self:entries()
    end
    function Map.prototype.entries(self)
        local items = self.items
        local nextKey = self.nextKey
        local key = self.firstKey
        return {
            [Symbol.iterator] = function(self)
                return self
            end,
            next = function(self)
                local result = {done = not key, value = {key, items[key]}}
                key = nextKey[key]
                return result
            end
        }
    end
    function Map.prototype.keys(self)
        local nextKey = self.nextKey
        local key = self.firstKey
        return {
            [Symbol.iterator] = function(self)
                return self
            end,
            next = function(self)
                local result = {done = not key, value = key}
                key = nextKey[key]
                return result
            end
        }
    end
    function Map.prototype.values(self)
        local items = self.items
        local nextKey = self.nextKey
        local key = self.firstKey
        return {
            [Symbol.iterator] = function(self)
                return self
            end,
            next = function(self)
                local result = {done = not key, value = items[key]}
                key = nextKey[key]
                return result
            end
        }
    end
    Map[Symbol.species] = Map
    return Map
end)()

function __TS__NewIndex(classProto)
    return function(tbl, key, val)
        local proto = classProto
        while true do
            local setters = rawget(proto, "____setters")
            if setters then
                local setter
                setter = setters[key]
                if setter then
                    setter(tbl, val)
                    return
                end
            end
            local base = rawget(
                rawget(proto, "constructor"),
                "____super"
            )
            if not base then
                break
            end
            proto = rawget(base, "prototype")
        end
        rawset(tbl, key, val)
    end
end

function __TS__Number(value)
    local valueType = type(value)
    if valueType == "number" then
        return value
    elseif valueType == "string" then
        local numberValue = tonumber(value)
        if numberValue then
            return numberValue
        end
        if value == "Infinity" then
            return math.huge
        end
        if value == "-Infinity" then
            return -math.huge
        end
        local stringWithoutSpaces = string.gsub(value, "%s", "")
        if stringWithoutSpaces == "" then
            return 0
        end
        return (0 / 0)
    elseif valueType == "boolean" then
        return value and 1 or 0
    else
        return (0 / 0)
    end
end

function __TS__NumberIsFinite(value)
    return type(value) == "number" and value == value and value ~= math.huge and value ~= -math.huge
end

function __TS__NumberIsNaN(value)
    return value ~= value
end

local ____radixChars = "0123456789abcdefghijklmnopqrstuvwxyz"
function __TS__NumberToString(self, radix)
    if radix == nil or radix == 10 or self == math.huge or self == -math.huge or self ~= self then
        return tostring(self)
    end
    radix = math.floor(radix)
    if radix < 2 or radix > 36 then
        error("toString() radix argument must be between 2 and 36", 0)
    end
    local integer, fraction = math.modf(
        math.abs(self)
    )
    local result = ""
    if radix == 8 then
        result = string.format("%o", integer)
    elseif radix == 16 then
        result = string.format("%x", integer)
    else
        repeat
            do
                result = tostring(
                    string.sub(____radixChars, (integer % radix) + 1, (integer % radix) + 1)
                ) .. tostring(result)
                integer = math.floor(integer / radix)
            end
        until not (integer ~= 0)
    end
    if fraction ~= 0 then
        result = tostring(result) .. "."
        local delta = 1e-16
        repeat
            do
                fraction = fraction * radix
                delta = delta * radix
                local digit = math.floor(fraction)
                result = tostring(result) .. tostring(
                    string.sub(____radixChars, digit + 1, digit + 1)
                )
                fraction = fraction - digit
            end
        until not (fraction >= delta)
    end
    if self < 0 then
        result = "-" .. tostring(result)
    end
    return result
end

function __TS__ObjectAssign(to, ...)
    local sources = ({...})
    if to == nil then
        return to
    end
    for ____, source in ipairs(sources) do
        for key in pairs(source) do
            to[key] = source[key]
        end
    end
    return to
end

function __TS__ObjectEntries(obj)
    local result = {}
    for key in pairs(obj) do
        result[#result + 1] = {key, obj[key]}
    end
    return result
end

function __TS__ObjectFromEntries(entries)
    local obj = {}
    local iterable = entries
    if iterable[Symbol.iterator] then
        local iterator = iterable[Symbol.iterator](iterable)
        while true do
            local result = iterator:next()
            if result.done then
                break
            end
            local value = result.value
            obj[value[1]] = value[2]
        end
    else
        for ____, entry in ipairs(entries) do
            obj[entry[1]] = entry[2]
        end
    end
    return obj
end

function __TS__ObjectKeys(obj)
    local result = {}
    for key in pairs(obj) do
        result[#result + 1] = key
    end
    return result
end

function __TS__ObjectRest(target, usedProperties)
    local result = {}
    for property in pairs(target) do
        if not usedProperties[property] then
            result[property] = target[property]
        end
    end
    return result
end

function __TS__ObjectValues(obj)
    local result = {}
    for key in pairs(obj) do
        result[#result + 1] = obj[key]
    end
    return result
end

Set = (function()
    local Set = __TS__Class()
    Set.name = "Set"
    function Set.prototype.____constructor(self, values)
        self[Symbol.toStringTag] = "Set"
        self.size = 0
        self.nextKey = {}
        self.previousKey = {}
        if values == nil then
            return
        end
        local iterable = values
        if iterable[Symbol.iterator] then
            local iterator = iterable[Symbol.iterator](iterable)
            while true do
                local result = iterator:next()
                if result.done then
                    break
                end
                self:add(result.value)
            end
        else
            local array = values
            for ____, value in ipairs(array) do
                self:add(value)
            end
        end
    end
    function Set.prototype.add(self, value)
        local isNewValue = not self:has(value)
        if isNewValue then
            self.size = self.size + 1
        end
        if self.firstKey == nil then
            self.firstKey = value
            self.lastKey = value
        elseif isNewValue then
            self.nextKey[self.lastKey] = value
            self.previousKey[value] = self.lastKey
            self.lastKey = value
        end
        return self
    end
    function Set.prototype.clear(self)
        self.nextKey = {}
        self.previousKey = {}
        self.firstKey = nil
        self.lastKey = nil
        self.size = 0
        return
    end
    function Set.prototype.delete(self, value)
        local contains = self:has(value)
        if contains then
            self.size = self.size - 1
            local next = self.nextKey[value]
            local previous = self.previousKey[value]
            if next and previous then
                self.nextKey[previous] = next
                self.previousKey[next] = previous
            elseif next then
                self.firstKey = next
                self.previousKey[next] = nil
            elseif previous then
                self.lastKey = previous
                self.nextKey[previous] = nil
            else
                self.firstKey = nil
                self.lastKey = nil
            end
            self.nextKey[value] = nil
            self.previousKey[value] = nil
        end
        return contains
    end
    function Set.prototype.forEach(self, callback)
        for key in __TS__Iterator(
            self:keys()
        ) do
            callback(_G, key, key, self)
        end
    end
    function Set.prototype.has(self, value)
        return self.nextKey[value] ~= nil or self.lastKey == value
    end
    Set.prototype[Symbol.iterator] = function(self)
        return self:values()
    end
    function Set.prototype.entries(self)
        local nextKey = self.nextKey
        local key = self.firstKey
        return {
            [Symbol.iterator] = function(self)
                return self
            end,
            next = function(self)
                local result = {done = not key, value = {key, key}}
                key = nextKey[key]
                return result
            end
        }
    end
    function Set.prototype.keys(self)
        local nextKey = self.nextKey
        local key = self.firstKey
        return {
            [Symbol.iterator] = function(self)
                return self
            end,
            next = function(self)
                local result = {done = not key, value = key}
                key = nextKey[key]
                return result
            end
        }
    end
    function Set.prototype.values(self)
        local nextKey = self.nextKey
        local key = self.firstKey
        return {
            [Symbol.iterator] = function(self)
                return self
            end,
            next = function(self)
                local result = {done = not key, value = key}
                key = nextKey[key]
                return result
            end
        }
    end
    Set[Symbol.species] = Set
    return Set
end)()

WeakMap = (function()
    local WeakMap = __TS__Class()
    WeakMap.name = "WeakMap"
    function WeakMap.prototype.____constructor(self, entries)
        self[Symbol.toStringTag] = "WeakMap"
        self.items = {}
        setmetatable(self.items, {__mode = "k"})
        if entries == nil then
            return
        end
        local iterable = entries
        if iterable[Symbol.iterator] then
            local iterator = iterable[Symbol.iterator](iterable)
            while true do
                local result = iterator:next()
                if result.done then
                    break
                end
                local value = result.value
                self.items[value[1]] = value[2]
            end
        else
            for ____, kvp in ipairs(entries) do
                self.items[kvp[1]] = kvp[2]
            end
        end
    end
    function WeakMap.prototype.delete(self, key)
        local contains = self:has(key)
        self.items[key] = nil
        return contains
    end
    function WeakMap.prototype.get(self, key)
        return self.items[key]
    end
    function WeakMap.prototype.has(self, key)
        return self.items[key] ~= nil
    end
    function WeakMap.prototype.set(self, key, value)
        self.items[key] = value
        return self
    end
    WeakMap[Symbol.species] = WeakMap
    return WeakMap
end)()

WeakSet = (function()
    local WeakSet = __TS__Class()
    WeakSet.name = "WeakSet"
    function WeakSet.prototype.____constructor(self, values)
        self[Symbol.toStringTag] = "WeakSet"
        self.items = {}
        setmetatable(self.items, {__mode = "k"})
        if values == nil then
            return
        end
        local iterable = values
        if iterable[Symbol.iterator] then
            local iterator = iterable[Symbol.iterator](iterable)
            while true do
                local result = iterator:next()
                if result.done then
                    break
                end
                self.items[result.value] = true
            end
        else
            for ____, value in ipairs(values) do
                self.items[value] = true
            end
        end
    end
    function WeakSet.prototype.add(self, value)
        self.items[value] = true
        return self
    end
    function WeakSet.prototype.delete(self, value)
        local contains = self:has(value)
        self.items[value] = nil
        return contains
    end
    function WeakSet.prototype.has(self, value)
        return self.items[value] == true
    end
    WeakSet[Symbol.species] = WeakSet
    return WeakSet
end)()

function __TS__SourceMapTraceBack(fileName, sourceMap)
    _G.__TS__sourcemap = _G.__TS__sourcemap or {}
    _G.__TS__sourcemap[fileName] = sourceMap
    if _G.__TS__originalTraceback == nil then
        _G.__TS__originalTraceback = debug.traceback
        debug.traceback = function(thread, message, level)
            local trace = _G.__TS__originalTraceback(thread, message, level)
            if type(trace) ~= "string" then
                return trace
            end
            local result = string.gsub(
                trace,
                "(%S+).lua:(%d+)",
                function(file, line)
                    local fileSourceMap = _G.__TS__sourcemap[tostring(file) .. ".lua"]
                    if fileSourceMap and fileSourceMap[line] then
                        return tostring(file) .. ".ts:" .. tostring(fileSourceMap[line])
                    end
                    return tostring(file) .. ".lua:" .. tostring(line)
                end
            )
            return result
        end
    end
end

function __TS__Spread(iterable)
    local arr = {}
    if type(iterable) == "string" then
        do
            local i = 0
            while i < #iterable do
                arr[#arr + 1] = string.sub(iterable, i + 1, i + 1)
                i = i + 1
            end
        end
    else
        for item in __TS__Iterator(iterable) do
            arr[#arr + 1] = item
        end
    end
    return (table.unpack or unpack)(arr)
end

function __TS__StringConcat(str1, ...)
    local args = ({...})
    local out = str1
    for ____, arg in ipairs(args) do
        out = tostring(out) .. tostring(arg)
    end
    return out
end

function __TS__StringEndsWith(self, searchString, endPosition)
    if endPosition == nil or endPosition > #self then
        endPosition = #self
    end
    return string.sub(self, endPosition - #searchString + 1, endPosition) == searchString
end

function __TS__StringPadEnd(self, maxLength, fillString)
    if fillString == nil then
        fillString = " "
    end
    if maxLength ~= maxLength then
        maxLength = 0
    end
    if maxLength == -math.huge or maxLength == math.huge then
        error("Invalid string length", 0)
    end
    if #self >= maxLength or #fillString == 0 then
        return self
    end
    maxLength = maxLength - #self
    if maxLength > #fillString then
        fillString = tostring(fillString) .. tostring(
            string.rep(
                fillString,
                math.floor(maxLength / #fillString)
            )
        )
    end
    return tostring(self) .. tostring(
        string.sub(
            fillString,
            1,
            math.floor(maxLength)
        )
    )
end

function __TS__StringPadStart(self, maxLength, fillString)
    if fillString == nil then
        fillString = " "
    end
    if maxLength ~= maxLength then
        maxLength = 0
    end
    if maxLength == -math.huge or maxLength == math.huge then
        error("Invalid string length", 0)
    end
    if #self >= maxLength or #fillString == 0 then
        return self
    end
    maxLength = maxLength - #self
    if maxLength > #fillString then
        fillString = tostring(fillString) .. tostring(
            string.rep(
                fillString,
                math.floor(maxLength / #fillString)
            )
        )
    end
    return tostring(
        string.sub(
            fillString,
            1,
            math.floor(maxLength)
        )
    ) .. tostring(self)
end

function __TS__StringReplace(source, searchValue, replaceValue)
    searchValue = string.gsub(searchValue, "[%%%(%)%.%+%-%*%?%[%^%$]", "%%%1")
    if type(replaceValue) == "string" then
        replaceValue = string.gsub(replaceValue, "[%%%(%)%.%+%-%*%?%[%^%$]", "%%%1")
        local result = string.gsub(source, searchValue, replaceValue, 1)
        return result
    else
        local result = string.gsub(
            source,
            searchValue,
            function(match) return replaceValue(_G, match) end,
            1
        )
        return result
    end
end

function __TS__StringSplit(source, separator, limit)
    if limit == nil then
        limit = 4294967295
    end
    if limit == 0 then
        return {}
    end
    local out = {}
    local index = 0
    local count = 0
    if separator == nil or separator == "" then
        while index < #source - 1 and count < limit do
            out[count + 1] = string.sub(source, index + 1, index + 1)
            count = count + 1
            index = index + 1
        end
    else
        local separatorLength = #separator
        local nextIndex = ((string.find(source, separator, nil, true) or 0) - 1)
        while nextIndex >= 0 and count < limit do
            out[count + 1] = string.sub(source, index + 1, nextIndex)
            count = count + 1
            index = nextIndex + separatorLength
            nextIndex = ((string.find(source, separator, index + 1, true) or 0) - 1)
        end
    end
    if count < limit then
        out[count + 1] = string.sub(source, index + 1)
    end
    return out
end

function __TS__StringStartsWith(self, searchString, position)
    if position == nil or position < 0 then
        position = 0
    end
    return string.sub(self, position + 1, #searchString + position) == searchString
end

function __TS__StringTrim(self)
    local result = string.gsub(self, "^[%s ﻿]*(.-)[%s ﻿]*$", "%1")
    return result
end

function __TS__StringTrimEnd(self)
    local result = string.gsub(self, "[%s ﻿]*$", "")
    return result
end

function __TS__StringTrimStart(self)
    local result = string.gsub(self, "^[%s ﻿]*", "")
    return result
end

local ____symbolRegistry = {}
function __TS__SymbolRegistryFor(key)
    if not ____symbolRegistry[key] then
        ____symbolRegistry[key] = __TS__Symbol(key)
    end
    return ____symbolRegistry[key]
end
function __TS__SymbolRegistryKeyFor(sym)
    for key in pairs(____symbolRegistry) do
        if ____symbolRegistry[key] == sym then
            return key
        end
    end
end

function __TS__TypeOf(value)
    local luaType = type(value)
    if luaType == "table" then
        return "object"
    elseif luaType == "nil" then
        return "undefined"
    else
        return luaType
    end
end

 end,
}
return require("src.main")
