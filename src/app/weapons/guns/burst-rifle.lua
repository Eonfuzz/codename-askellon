require("lualib_bundle");
local ____exports = {}
local ____vector3 = require("app.types.vector3")
local Vector3 = ____vector3.Vector3
local ____gun = require("app.weapons.guns.gun")
local Gun = ____gun.Gun
local ____projectile = require("app.weapons.projectile.projectile")
local Projectile = ____projectile.Projectile
local ____projectile_2Dtarget = require("app.weapons.projectile.projectile-target")
local ProjectileTargetStatic = ____projectile_2Dtarget.ProjectileTargetStatic
local ____timed_2Devent = require("app.types.timed-event")
local TimedEvent = ____timed_2Devent.TimedEvent
local ____vector2 = require("app.types.vector2")
local Vector2 = ____vector2.Vector2
local ____weapon_2Dtooltips = require("resources.weapon-tooltips")
local BURST_RIFLE_EXTENDED = ____weapon_2Dtooltips.BURST_RIFLE_EXTENDED
local BURST_RIFLE_ITEM = ____weapon_2Dtooltips.BURST_RIFLE_ITEM
local ____translators = require("lib.translators")
local PlayNewSoundOnUnit = ____translators.PlayNewSoundOnUnit
local staticDecorator = ____translators.staticDecorator
local ____weapon_2Dconstants = require("app.weapons.weapon-constants")
local BURST_RIFLE_ABILITY_ID = ____weapon_2Dconstants.BURST_RIFLE_ABILITY_ID
local BURST_RIFLE_ITEM_ID = ____weapon_2Dconstants.BURST_RIFLE_ITEM_ID
____exports.InitBurstRifle = function(weaponModule)
    __TS__ArrayPush(weaponModule.weaponItemIds, BURST_RIFLE_ITEM_ID)
    __TS__ArrayPush(weaponModule.weaponAbilityIds, BURST_RIFLE_ABILITY_ID)
end
____exports.BurstRifle = {}
local BurstRifle = ____exports.BurstRifle
BurstRifle.name = "BurstRifle"
BurstRifle.__index = BurstRifle
BurstRifle.prototype = {}
BurstRifle.prototype.__index = BurstRifle.prototype
BurstRifle.prototype.constructor = BurstRifle
BurstRifle.____super = Gun
setmetatable(BurstRifle, BurstRifle.____super)
setmetatable(BurstRifle.prototype, BurstRifle.____super.prototype)
function BurstRifle.new(...)
    local self = setmetatable({}, BurstRifle.prototype)
    self:____constructor(...)
    return self
end
function BurstRifle.prototype.____constructor(self, item, equippedTo)
    Gun.prototype.____constructor(self, item, equippedTo)
    self.DEFAULT_STRAY = 240
    self.SHOT_DISTANCE = 1200
end
function BurstRifle.prototype.onShoot(self, weaponModule, caster, targetLocation)
    Gun.prototype.onShoot(self, weaponModule, caster, targetLocation)
    local unit = caster.unit
    local sound = PlayNewSoundOnUnit(nil, "Sounds\\BattleRifleShoot.mp3", caster.unit, 50)
    local casterLoc = Vector3.new(
        GetUnitX(unit),
        GetUnitY(unit),
        BlzGetUnitZ(unit) + 50
    ):projectTowards2D(
        GetUnitFacing(unit) * bj_DEGTORAD,
        30
    )
    local targetDistance = Vector2.new(targetLocation.x - casterLoc.x, targetLocation.y - casterLoc.y):normalise():multiplyN(self.SHOT_DISTANCE)
    local newTargetLocation = Vector3.new(targetDistance.x + casterLoc.x, targetDistance.y + casterLoc.y, targetLocation.z)
    local delay = 0
    do
        local i = 0
        while i < 5 do
            weaponModule.game.timedEventQueue:AddEvent(
                TimedEvent.new(
                    function()
                        self:fireProjectile(weaponModule, caster, newTargetLocation)
                        return true
                    end,
                    delay,
                    false
                )
            )
            delay = delay + 50
            i = i + 1
        end
    end
end
function BurstRifle.prototype.fireProjectile(self, weaponModule, caster, targetLocation)
    local unit = caster.unit
    local casterLoc = Vector3.new(
        GetUnitX(unit),
        GetUnitY(unit),
        BlzGetUnitZ(unit) + 50
    ):projectTowards2D(
        GetUnitFacing(unit) * bj_DEGTORAD,
        30
    )
    local strayTarget = self:getStrayLocation(targetLocation, caster)
    local deltaTarget = strayTarget:subtract(casterLoc)
    local projectile = Projectile.new(
        unit,
        casterLoc,
        ProjectileTargetStatic.new(deltaTarget)
    )
    projectile:addEffect(
        "war3mapImported\\Bullet.mdx",
        Vector3.new(0, 0, 0),
        deltaTarget:normalise(),
        1.6
    )
    projectile:setVelocity(2400):onCollide(
        function(____self, weaponModule, projectile, collidesWith) return self:onProjectileCollide(weaponModule, projectile, collidesWith) end
    )
    weaponModule:addProjectile(projectile)
end
function BurstRifle.prototype.onProjectileCollide(self, weaponModule, projectile, collidesWith)
    projectile:setDestroy(true)
    if self.equippedTo then
        local crewmember = weaponModule.game.crewModule:getCrewmemberForUnit(self.equippedTo.unit)
        if crewmember then
            UnitDamageTarget(
                projectile.source,
                collidesWith,
                self:getDamage(weaponModule, crewmember),
                false,
                true,
                ATTACK_TYPE_PIERCE,
                DAMAGE_TYPE_NORMAL,
                WEAPON_TYPE_WOOD_MEDIUM_STAB
            )
        end
    end
end
function BurstRifle.prototype.getTooltip(self, weaponModule, crewmember)
    local accuracyModifier = (self.DEFAULT_STRAY * (100 / crewmember.accuracy)) / 2
    local newTooltip = BURST_RIFLE_EXTENDED(
        nil,
        self:getDamage(weaponModule, crewmember),
        self.SHOT_DISTANCE - accuracyModifier,
        self.SHOT_DISTANCE + accuracyModifier
    )
    return newTooltip
end
function BurstRifle.prototype.getItemTooltip(self, weaponModule, crewmember)
    local damage = self:getDamage(weaponModule, crewmember)
    return BURST_RIFLE_ITEM(nil, self, damage)
end
function BurstRifle.prototype.getStrayLocation(self, originalLocation, caster)
    local accuracy = caster.accuracy
    local newLocation = Vector3.new(
        originalLocation.x + ((math.random() - 0.5) * self.DEFAULT_STRAY * (100 / accuracy)),
        originalLocation.y + ((math.random() - 0.5) * self.DEFAULT_STRAY * (100 / accuracy)),
        originalLocation.z
    )
    return newLocation
end
function BurstRifle.prototype.getDamage(self, weaponModule, caster)
    if self.attachment and self.attachment.name == "Ems Rifling" then
        return 20
    end
    return 15
end
function BurstRifle.prototype.getAbilityId(self)
    return BURST_RIFLE_ABILITY_ID
end
function BurstRifle.prototype.getItemId(self)
    return BURST_RIFLE_ITEM_ID
end
____exports.BurstRifle = __TS__Decorate(
    {
        staticDecorator(nil)
    },
    ____exports.BurstRifle
)
return ____exports
