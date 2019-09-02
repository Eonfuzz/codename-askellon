local ____exports = {}
____exports.PreloadSink = {}
local PreloadSink = ____exports.PreloadSink
PreloadSink.name = "PreloadSink"
PreloadSink.__index = PreloadSink
PreloadSink.prototype = {}
PreloadSink.prototype.__index = PreloadSink.prototype
PreloadSink.prototype.constructor = PreloadSink
function PreloadSink.new(...)
    local self = setmetatable({}, PreloadSink.prototype)
    self:____constructor(...)
    return self
end
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
