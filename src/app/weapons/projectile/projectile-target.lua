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
____exports.ProjectileMoverLinear = {}
local ProjectileMoverLinear = ____exports.ProjectileMoverLinear
ProjectileMoverLinear.name = "ProjectileMoverLinear"
ProjectileMoverLinear.__index = ProjectileMoverLinear
ProjectileMoverLinear.prototype = {}
ProjectileMoverLinear.prototype.__index = ProjectileMoverLinear.prototype
ProjectileMoverLinear.prototype.constructor = ProjectileMoverLinear
function ProjectileMoverLinear.new(...)
    local self = setmetatable({}, ProjectileMoverLinear.prototype)
    self:____constructor(...)
    return self
end
function ProjectileMoverLinear.prototype.____constructor(self)
end
function ProjectileMoverLinear.prototype.move(self, currentPostion, goal, velocity, delta)
    local velocityVector = goal:normalise():multiplyN(velocity * delta)
    return velocityVector
end
____exports.ProjectileMoverParabolic = {}
local ProjectileMoverParabolic = ____exports.ProjectileMoverParabolic
ProjectileMoverParabolic.name = "ProjectileMoverParabolic"
ProjectileMoverParabolic.__index = ProjectileMoverParabolic
ProjectileMoverParabolic.prototype = {}
ProjectileMoverParabolic.prototype.__index = ProjectileMoverParabolic.prototype
ProjectileMoverParabolic.prototype.constructor = ProjectileMoverParabolic
function ProjectileMoverParabolic.new(...)
    local self = setmetatable({}, ProjectileMoverParabolic.prototype)
    self:____constructor(...)
    return self
end
function ProjectileMoverParabolic.prototype.____constructor(self, originalPosition, height)
    self.originalPosition = originalPosition
    self.height = height
end
function ProjectileMoverParabolic.prototype.move(self, currentPostion, goal, velocity, delta)
    local velocityVector = goal:normalise():multiplyN(velocity * delta)
    return velocityVector
end
return ____exports
