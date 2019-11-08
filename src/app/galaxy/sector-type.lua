require("lualib_bundle");
local ____exports = {}
local ____sector_2Dsector_2Dtype = require("app.galaxy.sector-sector-type")
local SpaceSector = ____sector_2Dsector_2Dtype.SpaceSector
____exports.SpaceGrid = {}
local SpaceGrid = ____exports.SpaceGrid
SpaceGrid.name = "SpaceGrid"
SpaceGrid.__index = SpaceGrid
SpaceGrid.prototype = {}
SpaceGrid.prototype.__index = SpaceGrid.prototype
SpaceGrid.prototype.constructor = SpaceGrid
function SpaceGrid.new(...)
    local self = setmetatable({}, SpaceGrid.prototype)
    self:____constructor(...)
    return self
end
function SpaceGrid.prototype.____constructor(self)
    self.sectors = {}
end
function SpaceGrid.prototype.initSectors(self, minX, minY, maxX, maxY)
    local x = minX
    while (function()
        local ____tmp = x
        x = ____tmp + 1
        return ____tmp
    end)() < maxX do
        local newSectors = {}
        local y = minY
        while (function()
            local ____tmp = y
            y = ____tmp + 1
            return ____tmp
        end)() < maxY do
            __TS__ArrayPush(
                newSectors,
                SpaceSector.new()
            )
        end
        __TS__ArrayPush(self.sectors, newSectors)
    end
    __TS__ArrayForEach(
        self.sectors,
        function(____, sectorArray) return __TS__ArrayForEach(
            sectorArray,
            function(____, sector) return sector:initalise() end
        ) end
    )
end
return ____exports
