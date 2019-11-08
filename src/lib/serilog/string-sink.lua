local ____exports = {}
local ____serilog = require("lib.serilog.serilog")
local Log = ____serilog.Log
local LogEventType = ____serilog.LogEventType
local LogLevel = ____serilog.LogLevel
local ____translators = require("lib.translators")
local SendMessageUnlogged = ____translators.SendMessageUnlogged
____exports.StringSink = {}
local StringSink = ____exports.StringSink
StringSink.name = "StringSink"
StringSink.__index = StringSink
StringSink.prototype = {}
StringSink.prototype.__index = StringSink.prototype
StringSink.prototype.constructor = StringSink
function StringSink.new(...)
    local self = setmetatable({}, StringSink.prototype)
    self:____constructor(...)
    return self
end
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
