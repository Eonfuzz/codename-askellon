local ____exports = {}
local ____translators = require("lib.translators")
local PlayNewSoundOnUnit = ____translators.PlayNewSoundOnUnit
local ____serilog = require("lib.serilog.serilog")
local Log = ____serilog.Log
____exports.Gun = {}
local Gun = ____exports.Gun
Gun.name = "Gun"
Gun.__index = Gun
Gun.prototype = {}
Gun.prototype.__index = Gun.prototype
Gun.prototype.constructor = Gun
function Gun.new(...)
    local self = setmetatable({}, Gun.prototype)
    self:____constructor(...)
    return self
end
function Gun.prototype.____constructor(self, item, equippedTo)
    self.name = "default"
    self.item = item
    self.equippedTo = equippedTo
end
function Gun.prototype.onAdd(self, weaponModule, caster)
    self.equippedTo = caster
    self.equippedTo:onWeaponAdd(weaponModule, self)
    UnitAddAbility(
        caster.unit,
        self:getAbilityId()
    )
    self:updateTooltip(weaponModule, caster)
    local sound = PlayNewSoundOnUnit(nil, "Sounds\\attachToGun.mp3", caster.unit, 50)
    if self.attachment then
        self.attachment:onEquip(self)
    end
    if self.remainingCooldown and self.remainingCooldown > 0 then
        print("Reforged better add a way to set cooldowns remaining")
    end
end
function Gun.prototype.onRemove(self, weaponModule)
    if self.equippedTo then
        UnitRemoveAbility(
            self.equippedTo.unit,
            self:getAbilityId()
        )
        self.remainingCooldown = BlzGetUnitAbilityCooldownRemaining(
            self.equippedTo.unit,
            self:getAbilityId()
        )
        self.equippedTo:onWeaponRemove(weaponModule, self)
        if self.attachment then
            self.attachment:onUnequip(self)
        end
        self.equippedTo = nil
    end
end
function Gun.prototype.updateTooltip(self, weaponModule, caster)
    local itemTooltip = self:getItemTooltip(weaponModule, caster)
    BlzSetItemExtendedTooltip(self.item, itemTooltip)
    if self.equippedTo then
        local owner = GetOwningPlayer(self.equippedTo.unit)
        local newTooltip = self:getTooltip(weaponModule, caster)
        if GetLocalPlayer() == owner then
            local abilLevel = GetUnitAbilityLevel(
                self.equippedTo.unit,
                self:getAbilityId()
            )
            Log.Information(
                "Updating weapon tooltip " .. tostring(abilLevel)
            )
            BlzSetAbilityExtendedTooltip(
                self:getAbilityId(),
                "TEST",
                1
            )
            BlzSetAbilityTooltip(
                self:getAbilityId(),
                "BAH",
                abilLevel
            )
        end
    end
end
function Gun.prototype.onShoot(self, weaponModule, caster, targetLocation)
    self.remainingCooldown = weaponModule.game:getTimeStamp()
end
function Gun.prototype.attach(self, attachment)
    if self.attachment then
        self:detach()
    end
    self.attachment = attachment
    return true
end
function Gun.prototype.detach(self)
    if self.attachment then
        self.attachment:unattach()
        self.attachment = nil
    end
end
return ____exports
