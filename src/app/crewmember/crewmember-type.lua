local ____exports = {}
local ____resolve = require("app.buff.resolve")
local Resolve = ____resolve.Resolve
____exports.Crewmember = {}
local Crewmember = ____exports.Crewmember
Crewmember.name = "Crewmember"
Crewmember.__index = Crewmember
Crewmember.prototype = {}
Crewmember.prototype.__index = Crewmember.prototype
Crewmember.prototype.constructor = Crewmember
function Crewmember.new(...)
    local self = setmetatable({}, Crewmember.prototype)
    self:____constructor(...)
    return self
end
function Crewmember.prototype.____constructor(self, game, player, unit)
    self.role = ""
    self.name = ""
    self.accuracy = 100
    self.player = player
    self.unit = unit
    self.resolve = Resolve.new()
    self.resolve:onChange(
        function() return self:onResolveChange(game) end
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
function Crewmember.prototype.onResolveChange(self, game)
    local resolveActive = self.resolve:isActiveNoCheck()
    if resolveActive then
        self.resolve:removeHighlightEffect(game, self)
        self.resolve:createHighlightEffect(game, self)
    elseif GetUnitLifePercent(self.unit) <= 30 then
        self.resolve:createResolve(
            game,
            self,
            {
                startTimeStamp = game:getTimeStamp(),
                duration = 2
            }
        )
    else
        self.resolve:removeHighlightEffect(game, self)
    end
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
