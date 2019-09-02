local ____exports = {}
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
function Crewmember.prototype.____constructor(self, player, unit)
    self.role = ""
    self.name = ""
    self.accuracy = 100
    self.player = player
    self.unit = unit
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
