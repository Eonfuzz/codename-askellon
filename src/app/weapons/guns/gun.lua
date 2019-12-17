local ____exports = {}
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
    self.equippedTo = caster.unit
    UnitAddAbility(
        caster.unit,
        self:getAbilityId()
    )
    self:updateTooltip(weaponModule, caster)
    if self.attachment then
        self.attachment:equipTo(self)
    end
    if self.remainingCooldown and self.remainingCooldown > 0 then
        print("Reforged better add a way to set cooldowns remaining")
    end
end
function Gun.prototype.onRemove(self, weaponModule)
    if self.equippedTo then
        UnitRemoveAbility(
            self.equippedTo,
            self:getAbilityId()
        )
        self.remainingCooldown = BlzGetUnitAbilityCooldownRemaining(
            self.equippedTo,
            self:getAbilityId()
        )
        self.equippedTo = nil
    end
end
function Gun.prototype.updateTooltip(self, weaponModule, caster)
    if self.equippedTo then
        local owner = GetOwningPlayer(self.equippedTo)
        local newTooltip = self:getTooltip(weaponModule, caster)
        if GetLocalPlayer() == owner then
            BlzSetAbilityExtendedTooltip(
                self:getAbilityId(),
                newTooltip,
                0
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
    self.attachment = self.attachment
    return true
end
function Gun.prototype.detach(self)
    if self.attachment then
        self.attachment:unequip()
        self.attachment = nil
    end
end
return ____exports
