local ____game = require("app.game")
local Game = ____game.Game
local TRANSLATORS = require("lib.translators")
local ____trigger = require("app.types.jass-overrides.trigger")
local Trigger = ____trigger.Trigger
local ____string_2Dsink = require("lib.serilog.string-sink")
local StringSink = ____string_2Dsink.StringSink
local ____serilog = require("lib.serilog.serilog")
local Log = ____serilog.Log
local LogLevel = ____serilog.LogLevel
ceres.addHook(
    "main::after",
    function()
        Log.Init(
            {
                StringSink.new(LogLevel.Debug, TRANSLATORS.SendMessageUnlogged)
            }
        )
        local function Main()
            local AksellonSector = Game.new()
        end
        xpcall(
            function()
                local init = Trigger.new()
                init:RegisterTimerEvent(0, false)
                init:AddAction(
                    function() return Main() end
                )
            end,
            function(err)
                print(err)
            end
        )
    end
)
