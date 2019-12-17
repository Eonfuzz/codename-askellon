require("lualib_bundle");
local ____exports = {}
local ____vector3 = require("app.types.vector3")
local Vector3 = ____vector3.Vector3
local ____burst_2Drifle = require("app.weapons.guns.burst-rifle")
local BurstRifle = ____burst_2Drifle.BurstRifle
local InitBurstRifle = ____burst_2Drifle.InitBurstRifle
local BURST_RIFLE_ABILITY_ID = ____burst_2Drifle.BURST_RIFLE_ABILITY_ID
local ____trigger = require("app.types.jass-overrides.trigger")
local Trigger = ____trigger.Trigger
local ____sniper_2Drifle = require("app.weapons.guns.sniper-rifle")
local SniperRifle = ____sniper_2Drifle.SniperRifle
local InitSniperRifle = ____sniper_2Drifle.InitSniperRifle
local SNIPER_ITEM_ID = ____sniper_2Drifle.SNIPER_ITEM_ID
local ____high_2Dquality_2Dpolymer = require("app.weapons.attachment.high-quality-polymer")
local HIGH_QUALITY_POLYMER_ITEM_ID = ____high_2Dquality_2Dpolymer.HIGH_QUALITY_POLYMER_ITEM_ID
local HighQualityPolymer = ____high_2Dquality_2Dpolymer.HighQualityPolymer
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
    self.projectiles = {}
    self.projectileUpdateTimer = Trigger.new()
    self.collisionCheckGroup = CreateGroup()
    self.equipWeaponAbilityId = FourCC("A004")
    self.weaponEquipTrigger = Trigger.new()
    self.weaponShootTrigger = Trigger.new()
    self.weaponDropTrigger = Trigger.new()
    self.game = game
    InitBurstRifle(self)
    InitSniperRifle(self)
    self:initialiseWeaponEquip()
    self:initaliseWeaponShooting()
    self:initialiseWeaponDropping()
    self:initProjectiles()
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
    if not projectile.filter then
        return
    end
    GroupClear(self.collisionCheckGroup)
    local centerPoint = from:add(to):multiplyN(0.5)
    local checkDist = delta:getLength() + projectile:getCollisionRadius()
    GroupEnumUnitsInRange(self.collisionCheckGroup, centerPoint.x, centerPoint.y, checkDist, projectile.filter)
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
                projectile:collide(self, unit)
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
function WeaponModule.prototype.initialiseWeaponEquip(self)
    self.weaponEquipTrigger:RegisterAnyUnitEventBJ(EVENT_PLAYER_UNIT_SPELL_EFFECT)
    self.weaponEquipTrigger:AddCondition(
        function()
            local spellId = GetSpellAbilityId()
            return spellId == self.equipWeaponAbilityId
        end
    )
    self.weaponEquipTrigger:AddAction(
        function()
            local unit = GetTriggerUnit()
            local orderId = GetUnitCurrentOrder(unit)
            local itemSlot = orderId - 852008
            local item = UnitItemInSlot(unit, itemSlot)
            local crewmember = self.game.crewModule:getCrewmemberForUnit(unit)
            if crewmember then
                self:applyWeaponEquip(
                    crewmember,
                    item,
                    self:getGunForItem(item)
                )
            end
        end
    )
end
function WeaponModule.prototype.applyWeaponEquip(self, unit, item, gun)
    local oldWeapon = self:getGunForUnit(unit.unit)
    if oldWeapon then
        oldWeapon:onRemove(self)
    end
    if not gun then
        gun = self:createWeaponForId(item, unit.unit)
    end
    if gun then
        __TS__ArrayPush(self.guns, gun)
        gun:onAdd(self, unit)
    else
        local equippedTo = unit.weapon
        if equippedTo then
            local attachment = self:createAttachmentForId(item)
            if attachment then
                attachment:equipTo(equippedTo)
            end
        end
    end
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
            local crewmember = self.game.crewModule:getCrewmemberForUnit(unit)
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
    if itemId == SNIPER_ITEM_ID then
        return SniperRifle.new(item, unit)
    elseif itemId == BURST_RIFLE_ABILITY_ID then
        return BurstRifle.new(item, unit)
    end
    return nil
end
function WeaponModule.prototype.createAttachmentForId(self, item)
    local itemId = GetItemTypeId(item)
    if itemId == HIGH_QUALITY_POLYMER_ITEM_ID then
        return HighQualityPolymer.new()
    end
    return nil
end
return ____exports
