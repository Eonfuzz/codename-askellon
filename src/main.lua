local __TSTL_game = require("app.game")
local Game = __TSTL_game.Game
local TRANSLATORS = require("lib.translators")
local __TSTL_trigger = require("app.types.jass-overrides.trigger")
local Trigger = __TSTL_trigger.Trigger
local __TSTL_string_2Dsink = require("lib.serilog.string-sink")
local StringSink = __TSTL_string_2Dsink.StringSink
local __TSTL_serilog = require("lib.serilog.serilog")
local Log = __TSTL_serilog.Log
local LogLevel = __TSTL_serilog.LogLevel
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
