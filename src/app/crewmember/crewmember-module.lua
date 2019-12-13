require("lualib_bundle");
local ____exports = {}
local ____crewmember_2Dtype = require("app.crewmember.crewmember-type")
local Crewmember = ____crewmember_2Dtype.Crewmember
local ____crewmember_2Dnames = require("app.crewmember.crewmember-names")
local ROLE_NAMES = ____crewmember_2Dnames.ROLE_NAMES
local ____trigger = require("app.types.jass-overrides.trigger")
local Trigger = ____trigger.Trigger
local ____burst_2Drifle = require("app.weapons.guns.burst-rifle")
local BurstRifle = ____burst_2Drifle.BurstRifle
local CREWMEMBER_UNIT_ID = FourCC("H001")
____exports.CrewModule = {}
local CrewModule = ____exports.CrewModule
CrewModule.name = "CrewModule"
CrewModule.__index = CrewModule
CrewModule.prototype = {}
CrewModule.prototype.__index = CrewModule.prototype
CrewModule.prototype.constructor = CrewModule
function CrewModule.new(...)
    local self = setmetatable({}, CrewModule.prototype)
    self:____constructor(...)
    return self
end
function CrewModule.prototype.____constructor(self, game)
    self.CREW_MEMBERS = {}
    self.AVAILABLE_ROLES = {}
    self:initialiseRoles(game)
    __TS__ArrayForEach(
        game.forceModule.activePlayers,
        function(____, player)
            local crew = self:createCrew(
                game,
                GetPlayerId(player)
            )
            __TS__ArrayPush(self.CREW_MEMBERS, crew)
        end
    )
    self.crewmemberDamageTrigger = Trigger.new()
    self.crewmemberDamageTrigger:RegisterUnitTakesDamage()
    self.crewmemberDamageTrigger:AddCondition(
        function()
            local player = GetOwningPlayer(
                GetTriggerUnit()
            )
            return (GetPlayerId(player) <= 22)
        end
    )
    self.crewmemberDamageTrigger:AddAction(
        function()
            local unit = GetTriggerUnit()
            local crew = self:getCrewmemberForUnit(unit)
            if crew then
                crew:onDamage(game)
            end
        end
    )
end
function CrewModule.prototype.initialiseRoles(self, game)
    __TS__ArrayForEach(
        game.forceModule.activePlayers,
        function(____, p, index)
            if index == 0 then
                __TS__ArrayPush(self.AVAILABLE_ROLES, "Captain")
            else
                __TS__ArrayPush(self.AVAILABLE_ROLES, "Security Guard")
            end
        end
    )
end
function CrewModule.prototype.createCrew(self, game, playerId)
    local nPlayer = Player(playerId)
    local nUnit = CreateUnit(nPlayer, CREWMEMBER_UNIT_ID, 0, 0, bj_UNIT_FACING)
    local crewmember = Crewmember.new(game, nPlayer, nUnit)
    crewmember:setRole(
        self:getCrewmemberRole()
    )
    crewmember:setName(
        self:getCrewmemberName(crewmember.role)
    )
    crewmember:setPlayer(nPlayer)
    BlzSetUnitName(nUnit, crewmember.role)
    BlzSetHeroProperName(nUnit, crewmember.name)
    if crewmember.role then
        local item = CreateItem(BurstRifle.itemId, 0, 0)
        UnitAddItem(crewmember.unit, item)
        game.weaponModule:applyWeaponEquip(crewmember, item)
    end
    return crewmember
end
function CrewModule.prototype.getCrewmemberRole(self)
    local i = math.floor(
        math.random() * #self.AVAILABLE_ROLES
    )
    local role = self.AVAILABLE_ROLES[i + 1]
    __TS__ArraySplice(self.AVAILABLE_ROLES, i, 1)
    return role
end
function CrewModule.prototype.getCrewmemberName(self, role)
    local namesForRole
    if role == "Captain" then
        namesForRole = ROLE_NAMES.Captain
    else
        namesForRole = ROLE_NAMES["Security Guard"]
    end
    local i = math.floor(
        math.random() * #namesForRole
    )
    local name = namesForRole[i + 1]
    __TS__ArraySplice(namesForRole, i, 1)
    return name
end
function CrewModule.prototype.getCrewmemberForPlayer(self, player)
    for ____, member in ipairs(self.CREW_MEMBERS) do
        if member.player == player then
            return member
        end
    end
end
function CrewModule.prototype.getCrewmemberForUnit(self, unit)
    for ____, member in ipairs(self.CREW_MEMBERS) do
        if member.unit == unit then
            return member
        end
    end
end
return ____exports
