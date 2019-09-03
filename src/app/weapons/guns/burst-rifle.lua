require("lualib_bundle");
local ____exports = {}
local __TSTL_vector3 = require("app.types.vector3")
local Vector3 = __TSTL_vector3.Vector3
local __TSTL_projectile = require("app.weapons.projectile.projectile")
local Projectile = __TSTL_projectile.Projectile
local __TSTL_projectile_2Dtarget = require("app.weapons.projectile.projectile-target")
local ProjectileTargetStatic = __TSTL_projectile_2Dtarget.ProjectileTargetStatic
local __TSTL_timed_2Devent = require("app.types.timed-event")
local TimedEvent = __TSTL_timed_2Devent.TimedEvent
local __TSTL_vector2 = require("app.types.vector2")
local Vector2 = __TSTL_vector2.Vector2
local __TSTL_weapon_2Dtooltips = require("resources.weapon-tooltips")
local BURST_RIFLE_EXTENDED = __TSTL_weapon_2Dtooltips.BURST_RIFLE_EXTENDED
local __TSTL_translators = require("lib.translators")
local PlayNewSoundOnUnit = __TSTL_translators.PlayNewSoundOnUnit
local staticDecorator = __TSTL_translators.staticDecorator
local __TSTL_crewmember_2Dmodule = require("app.crewmember.crewmember-module")
local getCrewmemberForUnit = __TSTL_crewmember_2Dmodule.getCrewmemberForUnit
____exports.BurstRifle = {}
local BurstRifle = ____exports.BurstRifle
BurstRifle.name = "BurstRifle"
BurstRifle.__index = BurstRifle
BurstRifle.prototype = {}
BurstRifle.prototype.__index = BurstRifle.prototype
BurstRifle.prototype.constructor = BurstRifle
function BurstRifle.new(...)
    local self = setmetatable({}, BurstRifle.prototype)
    self:____constructor(...)
    return self
end
function BurstRifle.prototype.____constructor(self, item, equippedTo)
    self.DEFAULT_STRAY = 200
    self.SHOT_DISTANCE = 800
    self.item = item
    self.equippedTo = equippedTo
end
function BurstRifle.initialise(self, weaponModule)
    __TS__ArrayPush(weaponModule.weaponItemIds, ____exports.BurstRifle.itemId)
    __TS__ArrayPush(weaponModule.weaponAbilityIds, ____exports.BurstRifle.abilityId)
end
function BurstRifle.prototype.onAdd(self, weaponModule, caster)
    self.equippedTo = caster.unit
    UnitAddAbility(caster.unit, ____exports.BurstRifle.abilityId)
    self:updateTooltip(weaponModule, caster)
    if self.remainingCooldown and self.remainingCooldown > 0 then
        print("Reforged better add a way to set cooldowns remaining")
    end
end
function BurstRifle.prototype.onRemove(self, weaponModule)
    if self.equippedTo then
        UnitRemoveAbility(self.equippedTo, ____exports.BurstRifle.abilityId)
        self.remainingCooldown = BlzGetUnitAbilityCooldownRemaining(self.equippedTo, ____exports.BurstRifle.abilityId)
        self.equippedTo = nil
    end
end
function BurstRifle.prototype.updateTooltip(self, weaponModule, caster)
    if self.equippedTo then
        local owner = GetOwningPlayer(self.equippedTo)
        local accuracyModifier = (self.DEFAULT_STRAY * (100 / caster.accuracy)) / 2
        local newTooltip = BURST_RIFLE_EXTENDED(
            nil,
            self:getDamage(weaponModule, caster),
            self.SHOT_DISTANCE - accuracyModifier,
            self.SHOT_DISTANCE + accuracyModifier
        )
        if GetLocalPlayer() == owner then
            BlzSetAbilityExtendedTooltip(____exports.BurstRifle.abilityId, newTooltip, 0)
        end
    end
end
function BurstRifle.prototype.onShoot(self, weaponModule, caster, targetLocation)
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
        local crewmember = getCrewmemberForUnit(self.equippedTo)
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
    return 15
end
BurstRifle.abilityId = FourCC("A002")
BurstRifle.itemId = FourCC("I000")
____exports.BurstRifle = __TS__Decorate(
    {
        staticDecorator(nil)
    },
    ____exports.BurstRifle
)
return ____exports
