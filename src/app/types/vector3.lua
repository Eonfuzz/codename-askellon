local ____exports = {}
____exports.Vector3 = {}
local Vector3 = ____exports.Vector3
Vector3.name = "Vector3"
Vector3.__index = Vector3
Vector3.prototype = {}
Vector3.prototype.__index = Vector3.prototype
Vector3.prototype.constructor = Vector3
function Vector3.new(...)
    local self = setmetatable({}, Vector3.prototype)
    self:____constructor(...)
    return self
end
function Vector3.prototype.____constructor(self, x, y, z)
    self.x = x
    self.y = y
    self.z = z
end
function Vector3.prototype.getLength(self)
    return math.sqrt(self.x * self.x + self.y * self.y + self.z * self.z)
end
function Vector3.prototype.normalise(self)
    local len = self:getLength()
    if len == 0 then
        return ____exports.Vector3.new(0, 0, 0)
    end
    return ____exports.Vector3.new(self.x / len, self.y / len, self.z / len)
end
function Vector3.prototype.multiply(self, value)
    return ____exports.Vector3.new(self.x * value.x, self.y * value.y, self.z * value.z)
end
function Vector3.prototype.multiplyN(self, value)
    return ____exports.Vector3.new(self.x * value, self.y * value, self.z * value)
end
function Vector3.prototype.add(self, value)
    return ____exports.Vector3.new(self.x + value.x, self.y + value.y, self.z + value.z)
end
function Vector3.prototype.addN(self, value)
    return ____exports.Vector3.new(self.x + value, self.y + value, self.z + value)
end
function Vector3.prototype.subtract(self, value)
    return ____exports.Vector3.new(self.x - value.x, self.y - value.y, self.z - value.z)
end
function Vector3.prototype.subtractN(self, value)
    return ____exports.Vector3.new(self.x - value, self.y - value, self.z - value)
end
function Vector3.prototype.setLength(self, value)
    if self:getLength() == 0 then
        return ____exports.Vector3.new(0, 1, 0):setLength(value)
    end
    return self:normalise():multiply(value)
end
function Vector3.prototype.setLengthN(self, value)
    if self:getLength() == 0 then
        return ____exports.Vector3.new(0, 1, 0):setLengthN(value)
    end
    return self:normalise():multiplyN(value)
end
function Vector3.prototype.distanceToLine(self, lineStart, lineEnd)
    local A = self.x - lineStart.x
    local B = self.y - lineStart.y
    local C = lineEnd.x - lineStart.x
    local D = lineEnd.y - lineStart.y
    local dot = A * C + B * D
    local len_sq = C * C + D * D
    local param = -1
    if len_sq ~= 0 then
        param = dot / len_sq
    end
    local xx
    local yy
    if param < 0 then
        xx = lineStart.x
        yy = lineStart.y
    elseif param > 1 then
        xx = lineEnd.x
        yy = lineEnd.y
    else
        xx = lineStart.x + param * C
        yy = lineStart.y + param * D
    end
    local dx = self.x - xx
    local dy = self.y - yy
    return math.sqrt(dx * dx + dy * dy)
end
function Vector3.prototype.projectTowards2D(self, angle, offset)
    local result = ____exports.Vector3.new(self.x, self.y, self.z)
    result.x = result.x + offset * Cos(angle)
    result.y = result.y + offset * Sin(angle)
    return result
end
function Vector3.prototype.__tostring(self)
    return "Vector3={x:" .. tostring(self.x) .. ", y:" .. tostring(self.y) .. ",z:" .. tostring(self.z) .. ",len:" .. tostring(
        self:getLength()
    ) .. "}"
end
return ____exports
