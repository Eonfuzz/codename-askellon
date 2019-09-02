local ____exports = {}
____exports.Trigger = {}
local Trigger = ____exports.Trigger
Trigger.name = "Trigger"
Trigger.__index = Trigger
Trigger.prototype = {}
Trigger.prototype.__index = Trigger.prototype
Trigger.prototype.constructor = Trigger
function Trigger.new(...)
    local self = setmetatable({}, Trigger.prototype)
    self:____constructor(...)
    return self
end
function Trigger.prototype.____constructor(self)
    self.nativeTrigger = CreateTrigger()
end
function Trigger.EvaluateCondition(self, func)
    local answer = false
    xpcall(
        function()
            answer = func(nil)
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
                function() return actionFunc(nil) end,
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
return ____exports
