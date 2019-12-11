require("lualib_bundle");
local ____exports = {}
local GALAXY_MODULE = require("app.galaxy.galaxy-module")
local ____crewmember_2Dmodule = require("app.crewmember.crewmember-module")
local CrewModule = ____crewmember_2Dmodule.CrewModule
local ____weapon_2Dmodule = require("app.weapons.weapon-module")
local WeaponModule = ____weapon_2Dmodule.WeaponModule
local ____timed_2Devent_2Dqueue = require("app.types.timed-event-queue")
local TimedEventQueue = ____timed_2Devent_2Dqueue.TimedEventQueue
local ____force_2Dmodule = require("app.force.force-module")
local ForceModule = ____force_2Dmodule.ForceModule
local ____space_2Dmodule = require("app.space.space-module")
local SpaceModule = ____space_2Dmodule.SpaceModule
local ____trigger = require("app.types.jass-overrides.trigger")
local Trigger = ____trigger.Trigger
local ____game_2Dtime_2Delapsed = require("app.types.game-time-elapsed")
local GameTimeElapsed = ____game_2Dtime_2Delapsed.GameTimeElapsed
local ____gene_2Dmodules = require("app.shops.gene-modules")
local GeneModule = ____gene_2Dmodules.GeneModule
local ____ability_2Dmodule = require("app.abilities.ability-module")
local AbilityModule = ____ability_2Dmodule.AbilityModule
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
    self.gameTimeElapsed = GameTimeElapsed.new()
    self.forceModule = ForceModule.new(self)
    self.weaponModule = WeaponModule.new(self)
    self.spaceModule = SpaceModule.new(self)
    self.crewModule = CrewModule.new(self)
    self.abilityModule = AbilityModule.new(self)
    self.geneModule = GeneModule.new(self)
    GALAXY_MODULE.initSectors()
    self:initCommands()
end
function Game.prototype.getTimeStamp(self)
    return self.gameTimeElapsed:getTimeElapsed()
end
function Game.prototype.initCommands(self)
    local commandTrigger = Trigger.new()
    __TS__ArrayForEach(
        self.forceModule.activePlayers,
        function(____, player)
            commandTrigger:RegisterPlayerChatEvent(player, "-", false)
        end
    )
    commandTrigger:AddAction(
        function()
            local triggerPlayer = GetTriggerPlayer()
            local crew = self.crewModule:getCrewmemberForPlayer(triggerPlayer)
            local message = GetEventPlayerChatString()
            if message == "-resolve" and crew then
                crew.resolve:createResolve(
                    self,
                    crew,
                    {
                        startTimeStamp = self:getTimeStamp(),
                        duration = 5
                    }
                )
                SetUnitLifePercentBJ(crew.unit, 20)
            end
        end
    )
end
return ____exports
