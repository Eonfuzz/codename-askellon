require("lualib_bundle");
local ____exports = {}
local __TSTL_projectile_2Dsfx = require("app.weapons.projectile.projectile-sfx")
local ProjectileSFX = __TSTL_projectile_2Dsfx.ProjectileSFX
local DEFAULT_FILTER
DEFAULT_FILTER = function(projectile)
    return Filter(
        function()
            local unit = GetFilterUnit()
            return GetWidgetLife(unit) > 0.405 and not IsUnitAlly(
                unit,
                GetOwningPlayer(projectile.source)
            ) and IsUnitType(unit, UNIT_TYPE_STRUCTURE) == false and IsUnitType(unit, UNIT_TYPE_MAGIC_IMMUNE) == false and IsUnitType(unit, UNIT_TYPE_MECHANICAL) == false
        end
    )
end
____exports.Projectile = {}
local Projectile = ____exports.Projectile
Projectile.name = "Projectile"
Projectile.__index = Projectile
Projectile.prototype = {}
Projectile.prototype.__index = Projectile.prototype
Projectile.prototype.constructor = Projectile
function Projectile.new(...)
    local self = setmetatable({}, Projectile.prototype)
    self:____constructor(...)
    return self
end
function Projectile.prototype.____constructor(self, source, startPosition, target)
    self.collisionRadius = 30
    self.velocity = 10
    self.doDestroy = false
    self.position = startPosition
    self.target = target
    self.sfx = {}
    self.source = source
    self.filter = DEFAULT_FILTER(self)
end
function Projectile.prototype.addEffect(self, sfx, offset, facing, scale)
    local _sfx = ProjectileSFX.new(sfx, self.position, offset, facing)
    _sfx:setScale(scale)
    __TS__ArrayPush(self.sfx, _sfx)
    return self
end
function Projectile.prototype.doesCollide(self)
    return true
end
function Projectile.prototype.getPosition(self)
    return self.position
end
function Projectile.prototype.getCollisionRadius(self)
    return self.collisionRadius
end
function Projectile.prototype.willDestroy(self)
    return self.doDestroy
end
function Projectile.prototype.setDestroy(self, val)
    self.doDestroy = val
    return self
end
function Projectile.prototype.overrideFilter(self, newFunc)
    self.filter = Filter(newFunc)
    return self
end
function Projectile.prototype.onCollide(self, callback)
    self.onCollideCallback = callback
    return self
end
function Projectile.prototype.onDeath(self, callback)
    self.onDeathCallback = callback
    return self
end
function Projectile.prototype.collide(self, withUnit)
    if self.onCollideCallback then
        self:onCollideCallback(self, withUnit)
    end
end
function Projectile.prototype.update(self, weaponModule, deltaTime)
    local targetVector = self.target:getTargetVector()
    local velocityVector = targetVector:normalise():multiplyN(self.velocity * deltaTime)
    local newPosition = self.position:add(velocityVector)
    self.position = newPosition
    __TS__ArrayForEach(
        self.sfx,
        function(____, sfx) return sfx:updatePosition(self.position) end
    )
    if self:reachedEnd(weaponModule, targetVector) then
        self.doDestroy = true
    end
    return velocityVector
end
function Projectile.prototype.setVelocity(self, velocity)
    self.velocity = velocity
    return self
end
function Projectile.prototype.reachedEnd(self, weaponModule, targetVector)
    MoveLocation(weaponModule.game.TEMP_LOCATION, self.position.x, self.position.y)
    local z = GetLocationZ(weaponModule.game.TEMP_LOCATION)
    return (self.position.z <= z)
end
function Projectile.prototype.destroy(self)
    __TS__ArrayForEach(
        self.sfx,
        function(____, sfx) return sfx:destroy() end
    )
    self.sfx = {}
    return true
end
return ____exports
