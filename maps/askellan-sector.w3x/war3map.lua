udg_ELEVATORS = {}
udg_LIGHTS = {}
udg_fall_points = {}
udg_fall_results = {}
udg_fall_result_zone_names = __jarray("")
gg_rct_Space = nil
gg_rct_Galaxy_Map = nil
gg_rct_FallZone1 = nil
gg_rct_FallZone1Land = nil
gg_trg_Set = nil
gg_unit_n001_0032 = nil
gg_unit_n001_0021 = nil
gg_unit_n002_0033 = nil
gg_unit_n002_0034 = nil
gg_dest_B002_0015 = nil
gg_dest_B002_0017 = nil
gg_dest_B002_0019 = nil
gg_dest_B002_0022 = nil
function InitGlobals()
    local i = 0
    i = 0
    while (true) do
        if ((i > 1)) then break end
        udg_ELEVATORS[i] = nil
        i = i + 1
    end
    i = 0
    while (true) do
        if ((i > 1)) then break end
        udg_fall_result_zone_names[i] = ""
        i = i + 1
    end
end

function CreateAllDestructables()
    local d
    local t
    local life
    gg_dest_B002_0017 = BlzCreateDestructableZWithSkin(FourCC("B002"), -104.7, -37.8, 134.4, 217.000, 1.000, 0, FourCC("B002"))
    gg_dest_B002_0019 = BlzCreateDestructableZWithSkin(FourCC("B002"), 828.0, -62.8, 134.4, 117.000, 1.000, 0, FourCC("B002"))
    gg_dest_B002_0022 = BlzCreateDestructableZWithSkin(FourCC("B002"), 828.8, 542.7, 134.4, 210.000, 1.000, 0, FourCC("B002"))
    gg_dest_B002_0015 = BlzCreateDestructableZWithSkin(FourCC("B002"), -121.9, 576.3, 134.4, 358.000, 1.000, 0, FourCC("B002"))
end

function CreateAllItems()
    local itemID
    BlzCreateItemWithSkin(FourCC("I000"), -155.3, -90.6, FourCC("I000"))
    BlzCreateItemWithSkin(FourCC("I000"), 60.4, -160.3, FourCC("I000"))
    BlzCreateItemWithSkin(FourCC("I000"), -167.3, -284.7, FourCC("I000"))
    BlzCreateItemWithSkin(FourCC("I000"), 93.2, 55.7, FourCC("I000"))
    BlzCreateItemWithSkin(FourCC("I001"), -252.0, 37.1, FourCC("I001"))
    BlzCreateItemWithSkin(FourCC("I001"), -407.0, 80.9, FourCC("I001"))
    BlzCreateItemWithSkin(FourCC("I002"), -361.7, 571.7, FourCC("I002"))
    BlzCreateItemWithSkin(FourCC("I003"), -265.1, 602.5, FourCC("I003"))
    BlzCreateItemWithSkin(FourCC("I004"), -340.6, 282.6, FourCC("I004"))
end

function CreateUnitsForPlayer20()
    local p = Player(20)
    local u
    local unitID
    local t
    local life
    u = BlzCreateUnitWithSkin(p, FourCC("uaco"), 328.3, -2182.2, 197.837, FourCC("uaco"))
    u = BlzCreateUnitWithSkin(p, FourCC("uaco"), 663.9, -302.4, 250.155, FourCC("uaco"))
    u = BlzCreateUnitWithSkin(p, FourCC("uaco"), 460.5, -541.0, 120.974, FourCC("uaco"))
    u = BlzCreateUnitWithSkin(p, FourCC("uaco"), 396.1, -598.2, 132.774, FourCC("uaco"))
    u = BlzCreateUnitWithSkin(p, FourCC("uaco"), 337.8, -628.5, 305.078, FourCC("uaco"))
    u = BlzCreateUnitWithSkin(p, FourCC("uaco"), 260.3, -658.4, 315.998, FourCC("uaco"))
    u = BlzCreateUnitWithSkin(p, FourCC("uaco"), 184.7, -671.5, 193.893, FourCC("uaco"))
end

function CreateNeutralHostile()
    local p = Player(PLAYER_NEUTRAL_AGGRESSIVE)
    local u
    local unitID
    local t
    local life
    u = BlzCreateUnitWithSkin(p, FourCC("ntrd"), 1398.0, 286.8, 210.264, FourCC("ntrd"))
    u = BlzCreateUnitWithSkin(p, FourCC("ntrd"), 1224.0, 430.4, 215.074, FourCC("ntrd"))
end

function CreateNeutralPassiveBuildings()
    local p = Player(PLAYER_NEUTRAL_PASSIVE)
    local u
    local unitID
    local t
    local life
    gg_unit_n001_0021 = BlzCreateUnitWithSkin(p, FourCC("n001"), -832.0, 960.0, 270.000, FourCC("n001"))
    gg_unit_n001_0032 = BlzCreateUnitWithSkin(p, FourCC("n001"), -448.0, 960.0, 270.000, FourCC("n001"))
    gg_unit_n002_0033 = BlzCreateUnitWithSkin(p, FourCC("n002"), 1024.0, 0.0, 270.000, FourCC("n002"))
    gg_unit_n002_0034 = BlzCreateUnitWithSkin(p, FourCC("n002"), -28670.7, 26621.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), -26110.7, 26365.0, 270.000, FourCC("n002"))
end

function CreatePlayerBuildings()
end

function CreatePlayerUnits()
    CreateUnitsForPlayer20()
end

function CreateAllUnits()
    CreateNeutralPassiveBuildings()
    CreatePlayerBuildings()
    CreateNeutralHostile()
    CreatePlayerUnits()
end

function CreateRegions()
    local we
    gg_rct_Space = Rect(14528.0, -19520.0, 29984.0, 864.0)
    gg_rct_Galaxy_Map = Rect(-3520.0, 1856.0, -2656.0, 2720.0)
    gg_rct_FallZone1 = Rect(-96.0, 1056.0, 480.0, 1248.0)
    gg_rct_FallZone1Land = Rect(-27488.0, 26816.0, -27168.0, 27168.0)
end

function Trig_Set_Actions()
    udg_ELEVATORS[0] = gg_unit_n001_0032
    udg_ELEVATORS[1] = gg_unit_n001_0021
    udg_ELEVATORS[2] = gg_unit_n002_0033
    udg_ELEVATORS[3] = gg_unit_n002_0034
    udg_LIGHTS[0] = gg_dest_B002_0015
    udg_LIGHTS[1] = gg_dest_B002_0017
    udg_LIGHTS[2] = gg_dest_B002_0019
    udg_LIGHTS[3] = gg_dest_B002_0022
    udg_fall_points[1] = gg_rct_FallZone1
    udg_fall_results[1] = gg_rct_FallZone1Land
    udg_fall_result_zone_names[1] = "Floor1"
end

function InitTrig_Set()
    gg_trg_Set = CreateTrigger()
    TriggerAddAction(gg_trg_Set, Trig_Set_Actions)
end

function InitCustomTriggers()
    InitTrig_Set()
end

function RunInitializationTriggers()
    ConditionalTriggerExecute(gg_trg_Set)
end

function InitCustomPlayerSlots()
    SetPlayerStartLocation(Player(0), 0)
    ForcePlayerStartLocation(Player(0), 0)
    SetPlayerColor(Player(0), ConvertPlayerColor(0))
    SetPlayerRacePreference(Player(0), RACE_PREF_HUMAN)
    SetPlayerRaceSelectable(Player(0), false)
    SetPlayerController(Player(0), MAP_CONTROL_USER)
    SetPlayerStartLocation(Player(1), 1)
    ForcePlayerStartLocation(Player(1), 1)
    SetPlayerColor(Player(1), ConvertPlayerColor(1))
    SetPlayerRacePreference(Player(1), RACE_PREF_HUMAN)
    SetPlayerRaceSelectable(Player(1), false)
    SetPlayerController(Player(1), MAP_CONTROL_USER)
    SetPlayerStartLocation(Player(2), 2)
    ForcePlayerStartLocation(Player(2), 2)
    SetPlayerColor(Player(2), ConvertPlayerColor(2))
    SetPlayerRacePreference(Player(2), RACE_PREF_HUMAN)
    SetPlayerRaceSelectable(Player(2), false)
    SetPlayerController(Player(2), MAP_CONTROL_USER)
    SetPlayerStartLocation(Player(3), 3)
    ForcePlayerStartLocation(Player(3), 3)
    SetPlayerColor(Player(3), ConvertPlayerColor(3))
    SetPlayerRacePreference(Player(3), RACE_PREF_HUMAN)
    SetPlayerRaceSelectable(Player(3), false)
    SetPlayerController(Player(3), MAP_CONTROL_USER)
    SetPlayerStartLocation(Player(4), 4)
    ForcePlayerStartLocation(Player(4), 4)
    SetPlayerColor(Player(4), ConvertPlayerColor(4))
    SetPlayerRacePreference(Player(4), RACE_PREF_HUMAN)
    SetPlayerRaceSelectable(Player(4), false)
    SetPlayerController(Player(4), MAP_CONTROL_USER)
    SetPlayerStartLocation(Player(5), 5)
    ForcePlayerStartLocation(Player(5), 5)
    SetPlayerColor(Player(5), ConvertPlayerColor(5))
    SetPlayerRacePreference(Player(5), RACE_PREF_HUMAN)
    SetPlayerRaceSelectable(Player(5), false)
    SetPlayerController(Player(5), MAP_CONTROL_USER)
    SetPlayerStartLocation(Player(6), 6)
    ForcePlayerStartLocation(Player(6), 6)
    SetPlayerColor(Player(6), ConvertPlayerColor(6))
    SetPlayerRacePreference(Player(6), RACE_PREF_HUMAN)
    SetPlayerRaceSelectable(Player(6), false)
    SetPlayerController(Player(6), MAP_CONTROL_USER)
    SetPlayerStartLocation(Player(7), 7)
    ForcePlayerStartLocation(Player(7), 7)
    SetPlayerColor(Player(7), ConvertPlayerColor(7))
    SetPlayerRacePreference(Player(7), RACE_PREF_HUMAN)
    SetPlayerRaceSelectable(Player(7), false)
    SetPlayerController(Player(7), MAP_CONTROL_USER)
    SetPlayerStartLocation(Player(8), 8)
    ForcePlayerStartLocation(Player(8), 8)
    SetPlayerColor(Player(8), ConvertPlayerColor(8))
    SetPlayerRacePreference(Player(8), RACE_PREF_HUMAN)
    SetPlayerRaceSelectable(Player(8), false)
    SetPlayerController(Player(8), MAP_CONTROL_USER)
    SetPlayerStartLocation(Player(9), 9)
    ForcePlayerStartLocation(Player(9), 9)
    SetPlayerColor(Player(9), ConvertPlayerColor(9))
    SetPlayerRacePreference(Player(9), RACE_PREF_HUMAN)
    SetPlayerRaceSelectable(Player(9), false)
    SetPlayerController(Player(9), MAP_CONTROL_USER)
    SetPlayerStartLocation(Player(20), 10)
    ForcePlayerStartLocation(Player(20), 10)
    SetPlayerColor(Player(20), ConvertPlayerColor(20))
    SetPlayerRacePreference(Player(20), RACE_PREF_UNDEAD)
    SetPlayerRaceSelectable(Player(20), false)
    SetPlayerController(Player(20), MAP_CONTROL_COMPUTER)
    SetPlayerStartLocation(Player(22), 11)
    ForcePlayerStartLocation(Player(22), 11)
    SetPlayerColor(Player(22), ConvertPlayerColor(22))
    SetPlayerRacePreference(Player(22), RACE_PREF_UNDEAD)
    SetPlayerRaceSelectable(Player(22), false)
    SetPlayerController(Player(22), MAP_CONTROL_COMPUTER)
    SetPlayerStartLocation(Player(23), 12)
    ForcePlayerStartLocation(Player(23), 12)
    SetPlayerColor(Player(23), ConvertPlayerColor(23))
    SetPlayerRacePreference(Player(23), RACE_PREF_UNDEAD)
    SetPlayerRaceSelectable(Player(23), false)
    SetPlayerController(Player(23), MAP_CONTROL_COMPUTER)
end

function InitCustomTeams()
    SetPlayerTeam(Player(0), 0)
    SetPlayerTeam(Player(1), 0)
    SetPlayerTeam(Player(2), 0)
    SetPlayerTeam(Player(3), 0)
    SetPlayerTeam(Player(4), 0)
    SetPlayerTeam(Player(5), 0)
    SetPlayerTeam(Player(6), 0)
    SetPlayerTeam(Player(7), 0)
    SetPlayerTeam(Player(8), 0)
    SetPlayerTeam(Player(9), 0)
    SetPlayerTeam(Player(22), 0)
    SetPlayerAllianceStateAllyBJ(Player(0), Player(1), true)
    SetPlayerAllianceStateAllyBJ(Player(0), Player(2), true)
    SetPlayerAllianceStateAllyBJ(Player(0), Player(3), true)
    SetPlayerAllianceStateAllyBJ(Player(0), Player(4), true)
    SetPlayerAllianceStateAllyBJ(Player(0), Player(5), true)
    SetPlayerAllianceStateAllyBJ(Player(0), Player(6), true)
    SetPlayerAllianceStateAllyBJ(Player(0), Player(7), true)
    SetPlayerAllianceStateAllyBJ(Player(0), Player(8), true)
    SetPlayerAllianceStateAllyBJ(Player(0), Player(9), true)
    SetPlayerAllianceStateAllyBJ(Player(0), Player(22), true)
    SetPlayerAllianceStateAllyBJ(Player(1), Player(0), true)
    SetPlayerAllianceStateAllyBJ(Player(1), Player(2), true)
    SetPlayerAllianceStateAllyBJ(Player(1), Player(3), true)
    SetPlayerAllianceStateAllyBJ(Player(1), Player(4), true)
    SetPlayerAllianceStateAllyBJ(Player(1), Player(5), true)
    SetPlayerAllianceStateAllyBJ(Player(1), Player(6), true)
    SetPlayerAllianceStateAllyBJ(Player(1), Player(7), true)
    SetPlayerAllianceStateAllyBJ(Player(1), Player(8), true)
    SetPlayerAllianceStateAllyBJ(Player(1), Player(9), true)
    SetPlayerAllianceStateAllyBJ(Player(1), Player(22), true)
    SetPlayerAllianceStateAllyBJ(Player(2), Player(0), true)
    SetPlayerAllianceStateAllyBJ(Player(2), Player(1), true)
    SetPlayerAllianceStateAllyBJ(Player(2), Player(3), true)
    SetPlayerAllianceStateAllyBJ(Player(2), Player(4), true)
    SetPlayerAllianceStateAllyBJ(Player(2), Player(5), true)
    SetPlayerAllianceStateAllyBJ(Player(2), Player(6), true)
    SetPlayerAllianceStateAllyBJ(Player(2), Player(7), true)
    SetPlayerAllianceStateAllyBJ(Player(2), Player(8), true)
    SetPlayerAllianceStateAllyBJ(Player(2), Player(9), true)
    SetPlayerAllianceStateAllyBJ(Player(2), Player(22), true)
    SetPlayerAllianceStateAllyBJ(Player(3), Player(0), true)
    SetPlayerAllianceStateAllyBJ(Player(3), Player(1), true)
    SetPlayerAllianceStateAllyBJ(Player(3), Player(2), true)
    SetPlayerAllianceStateAllyBJ(Player(3), Player(4), true)
    SetPlayerAllianceStateAllyBJ(Player(3), Player(5), true)
    SetPlayerAllianceStateAllyBJ(Player(3), Player(6), true)
    SetPlayerAllianceStateAllyBJ(Player(3), Player(7), true)
    SetPlayerAllianceStateAllyBJ(Player(3), Player(8), true)
    SetPlayerAllianceStateAllyBJ(Player(3), Player(9), true)
    SetPlayerAllianceStateAllyBJ(Player(3), Player(22), true)
    SetPlayerAllianceStateAllyBJ(Player(4), Player(0), true)
    SetPlayerAllianceStateAllyBJ(Player(4), Player(1), true)
    SetPlayerAllianceStateAllyBJ(Player(4), Player(2), true)
    SetPlayerAllianceStateAllyBJ(Player(4), Player(3), true)
    SetPlayerAllianceStateAllyBJ(Player(4), Player(5), true)
    SetPlayerAllianceStateAllyBJ(Player(4), Player(6), true)
    SetPlayerAllianceStateAllyBJ(Player(4), Player(7), true)
    SetPlayerAllianceStateAllyBJ(Player(4), Player(8), true)
    SetPlayerAllianceStateAllyBJ(Player(4), Player(9), true)
    SetPlayerAllianceStateAllyBJ(Player(4), Player(22), true)
    SetPlayerAllianceStateAllyBJ(Player(5), Player(0), true)
    SetPlayerAllianceStateAllyBJ(Player(5), Player(1), true)
    SetPlayerAllianceStateAllyBJ(Player(5), Player(2), true)
    SetPlayerAllianceStateAllyBJ(Player(5), Player(3), true)
    SetPlayerAllianceStateAllyBJ(Player(5), Player(4), true)
    SetPlayerAllianceStateAllyBJ(Player(5), Player(6), true)
    SetPlayerAllianceStateAllyBJ(Player(5), Player(7), true)
    SetPlayerAllianceStateAllyBJ(Player(5), Player(8), true)
    SetPlayerAllianceStateAllyBJ(Player(5), Player(9), true)
    SetPlayerAllianceStateAllyBJ(Player(5), Player(22), true)
    SetPlayerAllianceStateAllyBJ(Player(6), Player(0), true)
    SetPlayerAllianceStateAllyBJ(Player(6), Player(1), true)
    SetPlayerAllianceStateAllyBJ(Player(6), Player(2), true)
    SetPlayerAllianceStateAllyBJ(Player(6), Player(3), true)
    SetPlayerAllianceStateAllyBJ(Player(6), Player(4), true)
    SetPlayerAllianceStateAllyBJ(Player(6), Player(5), true)
    SetPlayerAllianceStateAllyBJ(Player(6), Player(7), true)
    SetPlayerAllianceStateAllyBJ(Player(6), Player(8), true)
    SetPlayerAllianceStateAllyBJ(Player(6), Player(9), true)
    SetPlayerAllianceStateAllyBJ(Player(6), Player(22), true)
    SetPlayerAllianceStateAllyBJ(Player(7), Player(0), true)
    SetPlayerAllianceStateAllyBJ(Player(7), Player(1), true)
    SetPlayerAllianceStateAllyBJ(Player(7), Player(2), true)
    SetPlayerAllianceStateAllyBJ(Player(7), Player(3), true)
    SetPlayerAllianceStateAllyBJ(Player(7), Player(4), true)
    SetPlayerAllianceStateAllyBJ(Player(7), Player(5), true)
    SetPlayerAllianceStateAllyBJ(Player(7), Player(6), true)
    SetPlayerAllianceStateAllyBJ(Player(7), Player(8), true)
    SetPlayerAllianceStateAllyBJ(Player(7), Player(9), true)
    SetPlayerAllianceStateAllyBJ(Player(7), Player(22), true)
    SetPlayerAllianceStateAllyBJ(Player(8), Player(0), true)
    SetPlayerAllianceStateAllyBJ(Player(8), Player(1), true)
    SetPlayerAllianceStateAllyBJ(Player(8), Player(2), true)
    SetPlayerAllianceStateAllyBJ(Player(8), Player(3), true)
    SetPlayerAllianceStateAllyBJ(Player(8), Player(4), true)
    SetPlayerAllianceStateAllyBJ(Player(8), Player(5), true)
    SetPlayerAllianceStateAllyBJ(Player(8), Player(6), true)
    SetPlayerAllianceStateAllyBJ(Player(8), Player(7), true)
    SetPlayerAllianceStateAllyBJ(Player(8), Player(9), true)
    SetPlayerAllianceStateAllyBJ(Player(8), Player(22), true)
    SetPlayerAllianceStateAllyBJ(Player(9), Player(0), true)
    SetPlayerAllianceStateAllyBJ(Player(9), Player(1), true)
    SetPlayerAllianceStateAllyBJ(Player(9), Player(2), true)
    SetPlayerAllianceStateAllyBJ(Player(9), Player(3), true)
    SetPlayerAllianceStateAllyBJ(Player(9), Player(4), true)
    SetPlayerAllianceStateAllyBJ(Player(9), Player(5), true)
    SetPlayerAllianceStateAllyBJ(Player(9), Player(6), true)
    SetPlayerAllianceStateAllyBJ(Player(9), Player(7), true)
    SetPlayerAllianceStateAllyBJ(Player(9), Player(8), true)
    SetPlayerAllianceStateAllyBJ(Player(9), Player(22), true)
    SetPlayerAllianceStateAllyBJ(Player(22), Player(0), true)
    SetPlayerAllianceStateAllyBJ(Player(22), Player(1), true)
    SetPlayerAllianceStateAllyBJ(Player(22), Player(2), true)
    SetPlayerAllianceStateAllyBJ(Player(22), Player(3), true)
    SetPlayerAllianceStateAllyBJ(Player(22), Player(4), true)
    SetPlayerAllianceStateAllyBJ(Player(22), Player(5), true)
    SetPlayerAllianceStateAllyBJ(Player(22), Player(6), true)
    SetPlayerAllianceStateAllyBJ(Player(22), Player(7), true)
    SetPlayerAllianceStateAllyBJ(Player(22), Player(8), true)
    SetPlayerAllianceStateAllyBJ(Player(22), Player(9), true)
    SetPlayerTeam(Player(20), 1)
    SetPlayerTeam(Player(23), 1)
    SetPlayerAllianceStateAllyBJ(Player(20), Player(23), true)
    SetPlayerAllianceStateAllyBJ(Player(23), Player(20), true)
    SetPlayerAllianceStateVisionBJ(Player(20), Player(23), true)
    SetPlayerAllianceStateVisionBJ(Player(23), Player(20), true)
end

function InitAllyPriorities()
    SetStartLocPrioCount(0, 2)
    SetStartLocPrio(0, 0, 2, MAP_LOC_PRIO_LOW)
    SetStartLocPrio(0, 1, 4, MAP_LOC_PRIO_HIGH)
    SetStartLocPrioCount(1, 1)
    SetStartLocPrio(1, 0, 6, MAP_LOC_PRIO_HIGH)
    SetStartLocPrioCount(2, 2)
    SetStartLocPrio(2, 0, 4, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(2, 1, 9, MAP_LOC_PRIO_LOW)
    SetStartLocPrioCount(3, 1)
    SetStartLocPrio(3, 0, 7, MAP_LOC_PRIO_HIGH)
    SetStartLocPrioCount(4, 1)
    SetStartLocPrio(4, 0, 2, MAP_LOC_PRIO_HIGH)
    SetStartLocPrioCount(5, 2)
    SetStartLocPrio(5, 0, 2, MAP_LOC_PRIO_LOW)
    SetStartLocPrio(5, 1, 9, MAP_LOC_PRIO_HIGH)
    SetStartLocPrioCount(6, 1)
    SetStartLocPrio(6, 0, 1, MAP_LOC_PRIO_HIGH)
    SetStartLocPrioCount(7, 1)
    SetStartLocPrio(7, 0, 3, MAP_LOC_PRIO_HIGH)
    SetStartLocPrioCount(8, 5)
    SetStartLocPrio(8, 0, 0, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(8, 1, 2, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(8, 2, 4, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(8, 3, 5, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(8, 4, 9, MAP_LOC_PRIO_HIGH)
    SetStartLocPrioCount(9, 2)
    SetStartLocPrio(9, 0, 2, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(9, 1, 5, MAP_LOC_PRIO_HIGH)
    SetStartLocPrioCount(10, 10)
    SetStartLocPrio(10, 0, 1, MAP_LOC_PRIO_LOW)
    SetStartLocPrio(10, 1, 2, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(10, 2, 3, MAP_LOC_PRIO_LOW)
    SetStartLocPrio(10, 3, 5, MAP_LOC_PRIO_LOW)
    SetStartLocPrio(10, 4, 6, MAP_LOC_PRIO_LOW)
    SetStartLocPrio(10, 5, 7, MAP_LOC_PRIO_LOW)
    SetStartLocPrio(10, 6, 8, MAP_LOC_PRIO_LOW)
    SetStartLocPrio(10, 7, 9, MAP_LOC_PRIO_LOW)
    SetStartLocPrio(10, 8, 11, MAP_LOC_PRIO_LOW)
    SetStartLocPrio(10, 9, 12, MAP_LOC_PRIO_HIGH)
    SetStartLocPrioCount(11, 10)
    SetStartLocPrio(11, 0, 0, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(11, 1, 1, MAP_LOC_PRIO_LOW)
    SetStartLocPrio(11, 2, 3, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(11, 3, 5, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(11, 4, 7, MAP_LOC_PRIO_LOW)
    SetStartLocPrio(11, 5, 8, MAP_LOC_PRIO_LOW)
    SetStartLocPrio(11, 6, 9, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(11, 7, 10, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(11, 8, 12, MAP_LOC_PRIO_LOW)
    SetStartLocPrioCount(12, 9)
    SetStartLocPrio(12, 0, 0, MAP_LOC_PRIO_LOW)
    SetStartLocPrio(12, 1, 2, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(12, 2, 3, MAP_LOC_PRIO_LOW)
    SetStartLocPrio(12, 3, 4, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(12, 4, 5, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(12, 5, 6, MAP_LOC_PRIO_LOW)
    SetStartLocPrio(12, 6, 9, MAP_LOC_PRIO_LOW)
    SetStartLocPrio(12, 7, 10, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(12, 8, 11, MAP_LOC_PRIO_LOW)
end

function main()
    SetCameraBounds(-29952.0 + GetCameraMargin(CAMERA_MARGIN_LEFT), -30208.0 + GetCameraMargin(CAMERA_MARGIN_BOTTOM), 29952.0 - GetCameraMargin(CAMERA_MARGIN_RIGHT), 29696.0 - GetCameraMargin(CAMERA_MARGIN_TOP), -29952.0 + GetCameraMargin(CAMERA_MARGIN_LEFT), 29696.0 - GetCameraMargin(CAMERA_MARGIN_TOP), 29952.0 - GetCameraMargin(CAMERA_MARGIN_RIGHT), -30208.0 + GetCameraMargin(CAMERA_MARGIN_BOTTOM))
    SetDayNightModels("Environment\\DNC\\DNCLordaeron\\DNCLordaeronTerrain\\DNCLordaeronTerrain.mdl", "Environment\\DNC\\DNCLordaeron\\DNCLordaeronUnit\\DNCLordaeronUnit.mdl")
    NewSoundEnvironment("Default")
    SetAmbientDaySound("SunkenRuinsDay")
    SetAmbientNightSound("SunkenRuinsNight")
    SetMapMusic("Music", true, 0)
    CreateRegions()
    CreateAllDestructables()
    CreateAllItems()
    CreateAllUnits()
    InitBlizzard()
    InitGlobals()
    InitCustomTriggers()
    RunInitializationTriggers()
end

function config()
    SetMapName("TRIGSTR_012")
    SetMapDescription("TRIGSTR_014")
    SetPlayers(13)
    SetTeams(13)
    SetGamePlacement(MAP_PLACEMENT_TEAMS_TOGETHER)
    DefineStartLocation(0, 0.0, 256.0)
    DefineStartLocation(1, 21696.0, 15424.0)
    DefineStartLocation(2, 192.0, 256.0)
    DefineStartLocation(3, -27840.0, 21376.0)
    DefineStartLocation(4, 128.0, 256.0)
    DefineStartLocation(5, 320.0, 256.0)
    DefineStartLocation(6, 19776.0, 13120.0)
    DefineStartLocation(7, -27520.0, 26176.0)
    DefineStartLocation(8, -3264.0, 6528.0)
    DefineStartLocation(9, 256.0, 192.0)
    DefineStartLocation(10, -17280.0, -29056.0)
    DefineStartLocation(11, 0.0, 2560.0)
    DefineStartLocation(12, 22336.0, 28672.0)
    InitCustomPlayerSlots()
    InitCustomTeams()
    InitAllyPriorities()
end

