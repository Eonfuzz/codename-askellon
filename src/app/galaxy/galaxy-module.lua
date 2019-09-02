local ____exports = {}
local __TSTL_sector_2Dtype = require("app.galaxy.sector-type")
local SpaceGrid = __TSTL_sector_2Dtype.SpaceGrid
local SPACE_GRID = SpaceGrid.new()
function ____exports.initSectors()
    SPACE_GRID:initSectors(-5, -5, 5, 5)
end
return ____exports
