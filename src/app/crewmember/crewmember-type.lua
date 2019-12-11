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
    self.resolve = Resolve.new(game, self)
    self.resolve:doChange(
        function() return self:onResolveDoChange(game) end
    )
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
function Crewmember.prototype.onResolveDoChange(self, game)
    if GetUnitLifePercent(self.unit) <= 30 then
        self.resolve:createResolve(
            game,
            self,
            {
                startTimeStamp = game:getTimeStamp(),
                duration = 3
            }
        )
        return true
    end
    return false
end
function Crewmember.prototype.onResolveChange(self, game)
    local isActive = self.resolve:isActiveNoCheck()
    self.accuracy = self.accuracy + (isActive and 80 or -80)
    if self.weapon then
        self.weapon:updateTooltip(game.weaponModule, self)
    end
end
function Crewmember.prototype.onDamage(self, game)
    local resolveActive = self.resolve:isActiveNoCheck()
    local maxHP = BlzGetUnitMaxHP(self.unit)
    local hpPercentage = (GetUnitState(self.unit, UNIT_STATE_LIFE) - GetEventDamage()) * 0.7 / maxHP
    if hpPercentage <= 0.3 then
        self.resolve:createResolve(
            game,
            self,
            {
                startTimeStamp = game:getTimeStamp(),
                duration = 2
            }
        )
        return true
    end
    if resolveActive then
        BlzSetEventDamage(
            GetEventDamage() * 0.7
        )
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
