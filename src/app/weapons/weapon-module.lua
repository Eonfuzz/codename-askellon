require("lualib_bundle");
local ____exports = {}
local __TSTL_vector3 = require("app.types.vector3")
local Vector3 = __TSTL_vector3.Vector3
local __TSTL_burst_2Drifle = require("app.weapons.guns.burst-rifle")
local BurstRifle = __TSTL_burst_2Drifle.BurstRifle
local __TSTL_crewmember_2Dmodule = require("app.crewmember.crewmember-module")
local getCrewmemberForUnit = __TSTL_crewmember_2Dmodule.getCrewmemberForUnit
local __TSTL_trigger = require("app.types.jass-overrides.trigger")
local Trigger = __TSTL_trigger.Trigger
____exports.WeaponModule = {}
local WeaponModule = ____exports.WeaponModule
WeaponModule.name = "WeaponModule"
WeaponModule.__index = WeaponModule
WeaponModule.prototype = {}
WeaponModule.prototype.__index = WeaponModule.prototype
WeaponModule.prototype.constructor = WeaponModule
function WeaponModule.new(...)
    local self = setmetatable({}, WeaponModule.prototype)
    self:____constructor(...)
    return self
end
function WeaponModule.prototype.____constructor(self, game)
    self.weaponItemIds = {}
    self.weaponAbilityIds = {}
    self.guns = {}
    self.projectileUpdateTimer = Trigger.new()
    self.projectiles = {}
    self.collisionCheckGroup = CreateGroup()
    self.weaponPickupTrigger = Trigger.new()
    self.weaponShootTrigger = Trigger.new()
    self.weaponDropTrigger = Trigger.new()
    self.game = game
    self:initProjectiles()
    BurstRifle:initialise(self)
    self:initialiseWeaponPickup()
    self:initaliseWeaponShooting()
    self:initialiseWeaponDropping()
end
function WeaponModule.prototype.initProjectiles(self)
    local WEAPON_UPDATE_PERIOD = 0.03
    self.projectileUpdateTimer:RegisterTimerEventPeriodic(WEAPON_UPDATE_PERIOD)
    self.projectileUpdateTimer:AddAction(
        function() return self:updateProjectiles(WEAPON_UPDATE_PERIOD) end
    )
end
function WeaponModule.prototype.updateProjectiles(self, DELTA_TIME)
    self.projectiles = __TS__ArrayFilter(
        self.projectiles,
        function(____, projectile)
            local startPosition = projectile:getPosition()
            local delta = projectile:update(self, DELTA_TIME)
            if projectile:doesCollide() then
                local nextPosition = projectile:getPosition()
                self:checkCollisionsForProjectile(projectile, startPosition, nextPosition, delta)
            end
            if projectile:willDestroy() then
                return not projectile:destroy()
            end
            return true
        end
    )
end
function WeaponModule.prototype.checkCollisionsForProjectile(self, projectile, from, to, delta)
    local centerPoint = from:add(to):multiplyN(0.5)
    local checkDist = delta:getLength() + projectile:getCollisionRadius()
    GroupClear(self.collisionCheckGroup)
    if projectile.filter then
        GroupEnumUnitsInRange(self.collisionCheckGroup, centerPoint.x, centerPoint.y, checkDist, projectile.filter)
    else
        return
    end
    ForGroup(
        self.collisionCheckGroup,
        function()
            local unit = GetEnumUnit()
            local unitLoc = Vector3.new(
                GetUnitX(unit),
                GetUnitY(unit),
                0
            )
            local distance = unitLoc:distanceToLine(from, to)
            if distance < (projectile:getCollisionRadius() + BlzGetUnitCollisionSize(unit)) then
                projectile:collide(unit)
            end
        end
    )
end
function WeaponModule.prototype.addProjectile(self, projectile)
    __TS__ArrayPush(self.projectiles, projectile)
end
function WeaponModule.prototype.getGunForItem(self, item)
    for ____, gun in ipairs(self.guns) do
        if gun.item == item then
            return gun
        end
    end
    return nil
end
function WeaponModule.prototype.getGunForUnit(self, unit)
    for ____, gun in ipairs(self.guns) do
        if gun.equippedTo == unit then
            return gun
        end
    end
end
function WeaponModule.prototype.initialiseWeaponPickup(self)
    self.weaponPickupTrigger:RegisterAnyUnitEventBJ(EVENT_PLAYER_UNIT_PICKUP_ITEM)
    self.weaponPickupTrigger:AddCondition(
        function()
            local item = GetManipulatedItem()
            local itemId = GetItemTypeId(item)
            return __TS__ArrayIndexOf(self.weaponItemIds, itemId) >= 0
        end
    )
    self.weaponPickupTrigger:AddAction(
        function()
            local item = GetManipulatedItem()
            local unit = GetManipulatingUnit()
            local crewmember = getCrewmemberForUnit(unit)
            local weapon = self:getGunForItem(item)
            if not weapon then
                weapon = self:createWeaponForId(item, unit)
                __TS__ArrayPush(self.guns, weapon)
            end
            if crewmember then
                weapon:onAdd(self, crewmember)
            end
        end
    )
end
function WeaponModule.prototype.initaliseWeaponShooting(self)
    self.weaponShootTrigger:RegisterAnyUnitEventBJ(EVENT_PLAYER_UNIT_SPELL_EFFECT)
    self.weaponShootTrigger:AddCondition(
        function() return __TS__ArrayIndexOf(
            self.weaponAbilityIds,
            GetSpellAbilityId()
        ) >= 0 end
    )
    self.weaponShootTrigger:AddAction(
        function()
            local unit = GetTriggerUnit()
            local targetLocation = GetSpellTargetLoc()
            local targetLoc = Vector3.new(
                GetLocationX(targetLocation),
                GetLocationY(targetLocation),
                GetLocationZ(targetLocation)
            )
            local crewmember = getCrewmemberForUnit(unit)
            local weapon = self:getGunForUnit(unit)
            if weapon and crewmember then
                local targetedUnit = GetSpellTargetUnit()
                if targetedUnit then
                    self.game.forceModule:aggressionBetweenTwoPlayers(
                        GetOwningPlayer(unit),
                        GetOwningPlayer(targetedUnit)
                    )
                end
                weapon:onShoot(self, crewmember, targetLoc)
            end
            RemoveLocation(targetLocation)
        end
    )
end
function WeaponModule.prototype.initialiseWeaponDropping(self)
    self.weaponDropTrigger:RegisterAnyUnitEventBJ(EVENT_PLAYER_UNIT_DROP_ITEM)
    self.weaponDropTrigger:AddCondition(
        function()
            local gun = self:getGunForItem(
                GetManipulatedItem()
            )
            if gun then
                gun:onRemove(self)
            end
            return false
        end
    )
end
function WeaponModule.prototype.createWeaponForId(self, item, unit)
    local itemId = GetItemTypeId(item)
    return BurstRifle.new(item, unit)
end
return ____exports
