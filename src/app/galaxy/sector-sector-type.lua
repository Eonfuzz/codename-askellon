local ____exports = {}
local __TSTL_sector_2Dnames = require("app.galaxy.sector-names")
local SECTOR_NAMES = __TSTL_sector_2Dnames.SECTOR_NAMES
local SECTOR_PREFIXES = __TSTL_sector_2Dnames.SECTOR_PREFIXES
____exports.SpaceSector = {}
local SpaceSector = ____exports.SpaceSector
SpaceSector.name = "SpaceSector"
SpaceSector.__index = SpaceSector
SpaceSector.prototype = {}
SpaceSector.prototype.__index = SpaceSector.prototype
SpaceSector.prototype.constructor = SpaceSector
function SpaceSector.new(...)
    local self = setmetatable({}, SpaceSector.prototype)
    self:____constructor(...)
    return self
end
function SpaceSector.prototype.____constructor(self)
    self.name = ""
    self.seed = ""
end
function SpaceSector.prototype.initalise(self)
    self:nameSector()
end
function SpaceSector.prototype.nameSector(self)
    local prefix = SECTOR_PREFIXES[math.floor(
        math.random() * #SECTOR_PREFIXES
    ) + 1]
    local name = SECTOR_NAMES[math.floor(
        math.random() * #SECTOR_NAMES
    ) + 1]
    self.name = tostring(prefix) .. " " .. tostring(name)
    print(
        "Sector [" .. tostring(self.name) .. "]"
    )
end
function SpaceSector.prototype.setSeed(self, seed)
    self.seed = seed
end
return ____exports
