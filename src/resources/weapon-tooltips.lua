local ____exports = {}
local ____colours = require("resources.colours")
local COL_ATTATCH = ____colours.COL_ATTATCH
local COL_GOOD = ____colours.COL_GOOD
local COL_INFO = ____colours.COL_INFO
local COL_GOLD = ____colours.COL_GOLD
____exports.BURST_RIFLE_EXTENDED = function(____, damage, accuracyMin, accuracyMax) return "|cff808080Powered by galvanic rails, this old rifle has been in active circulation since the Yulvin succession wars. \nNow many corporations produce upgrades and attachments that further improve upon its baseline functionality.|r\n\nFires a short burst of six bullets with |cff00ffff" .. tostring(accuracyMin) .. "|r to |cff00ffff" .. tostring(accuracyMax) .. "|r range, with each bullet dealing |cff00ff00" .. tostring(damage) .. " damage|r.\n\n|cffff0000If all six rounds hit the same target, this weapon will apply BREAK.|r\n" end
____exports.BURST_RIFLE_ITEM = function(____, weapon, damage) return "|cff808080Powered by galvanic rails, this old rifle has been in active circulation since the Yulvin succession wars. \nNow many corporations produce upgrades and attachments that further improve upon its baseline functionality.|r\n\nAttached: " .. tostring(
    weapon.attachment and tostring(COL_GOLD) .. tostring(weapon.attachment.name) or tostring(COL_ATTATCH) .. "Nothing"
) .. "|r\n\nThe standard issue rifle; ideal for thinning hordes and can dish out serious damage up close.\n" .. tostring(COL_GOOD) .. "- 6 Shot Burst\n- Each shot does " .. tostring(damage) .. " damage\n- Short Cooldown|r\n\n" .. tostring(
    not weapon.attachment and tostring(COL_INFO) .. "Can be enhanced with " .. tostring(COL_ATTATCH) .. "High Quality Polymer|r" .. tostring(COL_INFO) .. " and |r" .. tostring(COL_ATTATCH) .. "EMS Rifling|r" .. tostring(COL_INFO) .. ".|r" or tostring(COL_GOLD) .. "Equip and type -u to remove " .. tostring(COL_ATTATCH) .. tostring(weapon.attachment.name) .. "|r|r"
) end
return ____exports
