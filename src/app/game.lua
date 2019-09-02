local ____exports = {}
local GALAXY_MODULE = require("app.galaxy.galaxy-module")
local CREW_MODULE = require("app.crewmember.crewmember-module")
local __TSTL_weapon_2Dmodule = require("app.weapons.weapon-module")
local WeaponModule = __TSTL_weapon_2Dmodule.WeaponModule
local __TSTL_timed_2Devent_2Dqueue = require("app.types.timed-event-queue")
local TimedEventQueue = __TSTL_timed_2Devent_2Dqueue.TimedEventQueue
local __TSTL_force_2Dmodule = require("app.force.force-module")
local ForceModule = __TSTL_force_2Dmodule.ForceModule
____exports.Game = {}
local Game = ____exports.Game
Game.name = "Game"
Game.__index = Game
Game.prototype = {}
Game.prototype.__index = Game.prototype
Game.prototype.constructor = Game
function Game.new(...)
    local self = setmetatable({}, Game.prototype)
    self:____constructor(...)
    return self
end
function Game.prototype.____constructor(self)
    self.TEMP_LOCATION = Location(0, 0)
    self.timedEventQueue = TimedEventQueue.new(self)
    self.forceModule = ForceModule.new(self)
    self.weaponModule = WeaponModule.new(self)
    GALAXY_MODULE.initSectors()
    CREW_MODULE.initCrew(self)
end
return ____exports
