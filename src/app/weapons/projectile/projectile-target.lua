local ____exports = {}
local ____vector3 = require("app.types.vector3")
local Vector3 = ____vector3.Vector3
____exports.ProjectileTargetStatic = {}
local ProjectileTargetStatic = ____exports.ProjectileTargetStatic
ProjectileTargetStatic.name = "ProjectileTargetStatic"
ProjectileTargetStatic.__index = ProjectileTargetStatic
ProjectileTargetStatic.prototype = {}
ProjectileTargetStatic.prototype.__index = ProjectileTargetStatic.prototype
ProjectileTargetStatic.prototype.constructor = ProjectileTargetStatic
function ProjectileTargetStatic.new(...)
    local self = setmetatable({}, ProjectileTargetStatic.prototype)
    self:____constructor(...)
    return self
end
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
    return Vector3.new(
        self:getTargetX(),
        self:getTargetY(),
        self:getTargetZ()
    )
end
____exports.ProjectileTargetUnit = {}
local ProjectileTargetUnit = ____exports.ProjectileTargetUnit
ProjectileTargetUnit.name = "ProjectileTargetUnit"
ProjectileTargetUnit.__index = ProjectileTargetUnit
ProjectileTargetUnit.prototype = {}
ProjectileTargetUnit.prototype.__index = ProjectileTargetUnit.prototype
ProjectileTargetUnit.prototype.constructor = ProjectileTargetUnit
function ProjectileTargetUnit.new(...)
    local self = setmetatable({}, ProjectileTargetUnit.prototype)
    self:____constructor(...)
    return self
end
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
    return Vector3.new(
        self:getTargetX(),
        self:getTargetY(),
        self:getTargetZ()
    )
end
return ____exports
