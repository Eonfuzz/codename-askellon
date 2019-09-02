require("lualib_bundle");
local ____exports = {}
local GALAXY_MODULE = require("app.galaxy.galaxy-module")
local CREW_MODULE = require("app.crewmember.crewmember-module")
local WEAPON_MODULE = require("app.weapons.weapon-module")
local __TSTL_timed_2Devent_2Dqueue = require("app.types.timed-event-queue")
local TimedEventQueue = __TSTL_timed_2Devent_2Dqueue.TimedEventQueue
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
    self.timedEventQueue = TimedEventQueue.new(self)
    self.humanPlayers = {}
    do
        local i = 0
        while i < GetBJMaxPlayerSlots() do
            local currentPlayer = Player(i)
            local isPlaying = GetPlayerSlotState(currentPlayer) == PLAYER_SLOT_STATE_PLAYING
            local isUser = GetPlayerController(currentPlayer) == MAP_CONTROL_USER
            if isPlaying and isUser then
                __TS__ArrayPush(
                    self.humanPlayers,
                    Player(i)
                )
            end
            i = i + 1
        end
    end
    GALAXY_MODULE.initSectors()
    CREW_MODULE.initCrew(self)
    self.weaponModule = WEAPON_MODULE.WeaponModule.new(self)
end
return ____exports
