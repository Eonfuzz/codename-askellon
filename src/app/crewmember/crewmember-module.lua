require("lualib_bundle");
local ____exports = {}
local __TSTL_crewmember_2Dtype = require("app.crewmember.crewmember-type")
local Crewmember = __TSTL_crewmember_2Dtype.Crewmember
local __TSTL_crewmember_2Dnames = require("app.crewmember.crewmember-names")
local ROLE_NAMES = __TSTL_crewmember_2Dnames.ROLE_NAMES
local CREWMEMBER_UNIT_ID, AVAILABLE_ROLES, initialiseRoles, createCrew, getCrewmemberRole, getCrewmemberName
function initialiseRoles(game)
    __TS__ArrayForEach(
        game.forceModule.activePlayers,
        function(____, p, index)
            if index == 0 then
                __TS__ArrayPush(AVAILABLE_ROLES, "Captain")
            else
                __TS__ArrayPush(AVAILABLE_ROLES, "Security Guard")
            end
        end
    )
end
function createCrew(playerId)
    local nPlayer = Player(playerId)
    local nUnit = CreateUnit(nPlayer, CREWMEMBER_UNIT_ID, 0, 0, bj_UNIT_FACING)
    local crewmember = Crewmember.new(nPlayer, nUnit)
    crewmember:setRole(
        getCrewmemberRole()
    )
    crewmember:setName(
        getCrewmemberName(crewmember.role)
    )
    crewmember:setPlayer(nPlayer)
    BlzSetUnitName(nUnit, crewmember.role)
    BlzSetHeroProperName(nUnit, crewmember.name)
    return crewmember
end
function getCrewmemberRole()
    local i = math.floor(
        math.random() * #AVAILABLE_ROLES
    )
    local role = AVAILABLE_ROLES[i + 1]
    __TS__ArraySplice(AVAILABLE_ROLES, i, 1)
    return role
end
function getCrewmemberName(role)
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
CREWMEMBER_UNIT_ID = FourCC("H001")
local CREW_MEMBERS = {}
AVAILABLE_ROLES = {}
function ____exports.initCrew(game)
    initialiseRoles(game)
    __TS__ArrayForEach(
        game.forceModule.activePlayers,
        function(____, player)
            local crew = createCrew(
                GetPlayerId(player)
            )
            __TS__ArrayPush(CREW_MEMBERS, crew)
        end
    )
end
function ____exports.getCrewmemberForUnit(unit)
    for ____, member in ipairs(CREW_MEMBERS) do
        if member.unit == unit then
            return member
        end
    end
end
return ____exports
