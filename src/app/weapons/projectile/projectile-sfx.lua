local ____exports = {}
local __TSTL_translators = require("lib.translators")
local getYawPitchRollFromVector = __TSTL_translators.getYawPitchRollFromVector
____exports.ProjectileSFX = {}
local ProjectileSFX = ____exports.ProjectileSFX
ProjectileSFX.name = "ProjectileSFX"
ProjectileSFX.__index = ProjectileSFX
ProjectileSFX.prototype = {}
ProjectileSFX.prototype.__index = ProjectileSFX.prototype
ProjectileSFX.prototype.constructor = ProjectileSFX
function ProjectileSFX.new(...)
    local self = setmetatable({}, ProjectileSFX.prototype)
    self:____constructor(...)
    return self
end
function ProjectileSFX.prototype.____constructor(self, sfx, startingLoc, offset, facing)
    self.offset = offset
    local facingData = getYawPitchRollFromVector(nil, facing)
    self.yaw = facingData.yaw
    self.pitch = facingData.pitch
    self.roll = facingData.roll
    self.sfx = AddSpecialEffect(sfx, startingLoc.x, startingLoc.y)
    BlzSetSpecialEffectZ(self.sfx, startingLoc.z)
    BlzSetSpecialEffectRoll(self.sfx, self.pitch)
    BlzSetSpecialEffectYaw(self.sfx, self.yaw)
end
function ProjectileSFX.prototype.updatePosition(self, currentPosition)
    BlzSetSpecialEffectX(self.sfx, currentPosition.x + self.offset.x)
    BlzSetSpecialEffectY(self.sfx, currentPosition.y + self.offset.y)
    BlzSetSpecialEffectZ(self.sfx, currentPosition.z + self.offset.z)
end
function ProjectileSFX.prototype.setScale(self, scale)
    BlzSetSpecialEffectScale(self.sfx, scale)
end
function ProjectileSFX.prototype.destroy(self)
    DestroyEffect(self.sfx)
end
return ____exports
