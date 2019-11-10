require("lualib_bundle");
local ____exports = {}
local ____trigger = require("app.types.jass-overrides.trigger")
local Trigger = ____trigger.Trigger
local ____translators = require("lib.translators")
local Util = ____translators.Util
____exports.TimedEventQueue = {}
local TimedEventQueue = ____exports.TimedEventQueue
TimedEventQueue.name = "TimedEventQueue"
TimedEventQueue.__index = TimedEventQueue
TimedEventQueue.prototype = {}
TimedEventQueue.prototype.__index = TimedEventQueue.prototype
TimedEventQueue.prototype.constructor = TimedEventQueue
function TimedEventQueue.new(...)
    local self = setmetatable({}, TimedEventQueue.prototype)
    self:____constructor(...)
    return self
end
function TimedEventQueue.prototype.____constructor(self, game)
    self.tick = 0
    self.maxTick = 100000
    self.events = Map.new()
    self.tickRate = 0.05
    self.ticker = Trigger.new()
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
