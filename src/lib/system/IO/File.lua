local ____exports = {}
____exports.File = {}
local File = ____exports.File
File.name = "File"
File.__index = File
File.prototype = {}
File.prototype.__index = File.prototype
File.prototype.constructor = File
function File.new(...)
    local self = setmetatable({}, File.prototype)
    self:____constructor(...)
    return self
end
function File.prototype.____constructor(self)
end
function File.write(self, filename, contents)
    PreloadGenClear()
    PreloadGenStart()
    do
        local i = 0
        while i < (#contents / 200) do
            local abilityId = ____exports.File.abilityList[i + 1]
            local buffer = string.sub(contents, (i * ____exports.File.preloadLimit) + 1, (i * ____exports.File.preloadLimit) + ____exports.File.preloadLimit)
            Preload(
                "\" )\ncall BlzSetAbilityTooltip(" .. tostring(abilityId) .. ", \"" .. tostring(buffer) .. "\", 0)\n//"
            )
            i = i + 1
        end
    end
    Preload("\" )\nendfunction\nfunction a takes nothing returns nothing\n //")
    PreloadGenEnd(filename)
    return self
end
function File.read(self, filename)
    local output = ""
    local originalTooltip = {}
    local doneReading = false
    do
        local i = 0
        while i < #self.abilityList do
            originalTooltip[i + 1] = BlzGetAbilityTooltip(self.abilityList[i + 1], 0)
            i = i + 1
        end
    end
    Preloader(filename)
    do
        local i = 0
        while i < #self.abilityList do
            if not doneReading then
                local buffer = BlzGetAbilityTooltip(self.abilityList[i + 1], 0)
                if buffer == originalTooltip[i + 1] then
                    doneReading = true
                else
                    output = tostring(output) .. tostring(buffer)
                end
            end
            BlzSetAbilityTooltip(self.abilityList[i + 1], originalTooltip[i + 1], 0)
            i = i + 1
        end
    end
    return output
end
File.preloadLimit = 200
File.abilityList = {
    FourCC("Amls"),
    FourCC("Aroc"),
    FourCC("Amic"),
    FourCC("Amil"),
    FourCC("Aclf")
}
File.maxLength = ____exports.File.preloadLimit * #____exports.File.abilityList
return ____exports
