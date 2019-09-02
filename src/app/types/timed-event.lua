local ____exports = {}
____exports.TimedEvent = {}
local TimedEvent = ____exports.TimedEvent
TimedEvent.name = "TimedEvent"
TimedEvent.__index = TimedEvent
TimedEvent.prototype = {}
TimedEvent.prototype.__index = TimedEvent.prototype
TimedEvent.prototype.constructor = TimedEvent
function TimedEvent.new(...)
    local self = setmetatable({}, TimedEvent.prototype)
    self:____constructor(...)
    return self
end
function TimedEvent.prototype.____constructor(self, func, time, safe)
    if safe == nil then
        safe = true
    end
    self.safe = safe
    self.time = time
    self.func = func
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
return ____exports
