local ____exports = {}
function ____exports.vectorFromUnit(u)
    return ____exports.Vector2.new(
        GetUnitX(u),
        GetUnitY(u)
    )
end
____exports.Vector2 = {}
local Vector2 = ____exports.Vector2
Vector2.name = "Vector2"
Vector2.__index = Vector2
Vector2.prototype = {}
Vector2.prototype.__index = Vector2.prototype
Vector2.prototype.constructor = Vector2
function Vector2.new(...)
    local self = setmetatable({}, Vector2.prototype)
    self:____constructor(...)
    return self
end
function Vector2.prototype.____constructor(self, x, y)
    self.x = x
    self.y = y
end
function Vector2.prototype.getLength(self)
    return math.sqrt(self.x * self.x + self.y * self.y)
end
function Vector2.prototype.normalise(self)
    local len = self:getLength()
    if len == 0 then
        return ____exports.Vector2.new(0, 0)
    end
    return ____exports.Vector2.new(self.x / len, self.y / len)
end
function Vector2.prototype.multiply(self, value)
    return ____exports.Vector2.new(self.x * value.x, self.y * value.y)
end
function Vector2.prototype.multiplyN(self, value)
    return ____exports.Vector2.new(self.x * value, self.y * value)
end
function Vector2.prototype.add(self, value)
    return ____exports.Vector2.new(self.x + value.x, self.y + value.y)
end
function Vector2.prototype.addN(self, value)
    return ____exports.Vector2.new(self.x + value, self.y + value)
end
function Vector2.prototype.subtract(self, value)
    return ____exports.Vector2.new(self.x - value.x, self.y - value.y)
end
function Vector2.prototype.subtractN(self, value)
    return ____exports.Vector2.new(self.x - value, self.y - value)
end
function Vector2.prototype.setLength(self, value)
    if self:getLength() == 0 then
        return ____exports.Vector2.new(0, 1):setLength(value)
    end
    return self:normalise():multiply(value)
end
function Vector2.prototype.setLengthN(self, value)
    if self:getLength() == 0 then
        return ____exports.Vector2.new(0, 1):setLengthN(value)
    end
    return self:normalise():multiplyN(value)
end
function Vector2.prototype.__tostring(self)
    return "Vector2={x:" .. tostring(self.x) .. ", y:" .. tostring(self.y) .. ",len:" .. tostring(
        self:getLength()
    ) .. "}"
end
return ____exports
