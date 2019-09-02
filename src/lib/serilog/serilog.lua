require("lualib_bundle");
local ____exports = {}
____exports.LogLevel = {}
____exports.LogLevel.None = -1
____exports.LogLevel[-1] = "None"
____exports.LogLevel.Message = 0
____exports.LogLevel[0] = "Message"
____exports.LogLevel.Verbose = 1
____exports.LogLevel[1] = "Verbose"
____exports.LogLevel.Event = 2
____exports.LogLevel[2] = "Event"
____exports.LogLevel.Debug = 3
____exports.LogLevel[3] = "Debug"
____exports.LogLevel.Information = 4
____exports.LogLevel[4] = "Information"
____exports.LogLevel.Warning = 5
____exports.LogLevel[5] = "Warning"
____exports.LogLevel.Error = 6
____exports.LogLevel[6] = "Error"
____exports.LogLevel.Fatal = 7
____exports.LogLevel[7] = "Fatal"
____exports.LogEventType = {}
____exports.LogEventType.Text = 0
____exports.LogEventType[0] = "Text"
____exports.LogEventType.Parameter = 1
____exports.LogEventType[1] = "Parameter"
____exports.LogEvent = {}
local LogEvent = ____exports.LogEvent
LogEvent.name = "LogEvent"
LogEvent.__index = LogEvent
LogEvent.prototype = {}
LogEvent.prototype.__index = LogEvent.prototype
LogEvent.prototype.constructor = LogEvent
function LogEvent.new(...)
    local self = setmetatable({}, LogEvent.prototype)
    self:____constructor(...)
    return self
end
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
                    goto __continue5
                end
                text = string.sub(message, i + 1, s - 1)
                if text ~= "" then
                    __TS__ArrayPush(
                        logEvents,
                        ____exports.LogEvent.new(____exports.LogEventType.Text, text, nil)
                    )
                end
                __TS__ArrayPush(
                    logEvents,
                    ____exports.LogEvent.new(____exports.LogEventType.Parameter, match, args[n + 1])
                )
                i = e
                n = n + 1
            end
            ::__continue5::
        end
        text = string.sub(message, i + 1)
        if text ~= "" then
            __TS__ArrayPush(
                logEvents,
                ____exports.LogEvent.new(____exports.LogEventType.Text, text, nil)
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
