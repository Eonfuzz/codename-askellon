udg_elevator_entrances = {}
udg_LIGHTS = {}
udg_fall_points = {}
udg_fall_results = {}
udg_fall_result_zone_names = __jarray("")
udg_elevator_exits = {}
udg_hatch_entrances = {}
udg_hatch_exits = {}
udg_hatch_entrance_names = __jarray("")
udg_hatch_exit_zones = __jarray("")
udg_jump_pass_zones = {}
udg_jump_pass_zones_name = __jarray("")
udg_power_generators = {}
udg_power_generator_zones = __jarray("")
gg_rct_Space = nil
gg_rct_Galaxy_Map = nil
gg_rct_FallZone1 = nil
gg_rct_FallZone1Land = nil
gg_rct_GeneSplicer = nil
gg_rct_FallZoneCargo = nil
gg_rct_FallZoneCargoLand = nil
gg_rct_JumpPassCargo = nil
gg_rct_JumpPassCargoVent = nil
gg_trg_Set = nil
gg_trg_SetHatch = nil
gg_trg_SetFall = nil
gg_trg_SetPowerGenerators = nil
gg_unit_n001_0032 = nil
gg_unit_h004_0048 = nil
gg_unit_n004_0034 = nil
gg_unit_n001_0021 = nil
gg_unit_n002_0033 = nil
gg_unit_n004_0047 = nil
gg_unit_n002_0043 = nil
gg_unit_n002_0044 = nil
gg_unit_n001_0045 = nil
gg_unit_h004_0046 = nil
gg_unit_n004_0035 = nil
gg_dest_B002_0015 = nil
gg_dest_B002_0017 = nil
gg_dest_B002_0019 = nil
gg_dest_B002_0022 = nil
function InitGlobals()
    local i = 0
    i = 0
    while (true) do
        if ((i > 1)) then break end
        udg_elevator_entrances[i] = nil
        i = i + 1
    end
    i = 0
    while (true) do
        if ((i > 1)) then break end
        udg_fall_result_zone_names[i] = ""
        i = i + 1
    end
    i = 0
    while (true) do
        if ((i > 1)) then break end
        udg_elevator_exits[i] = nil
        i = i + 1
    end
    i = 0
    while (true) do
        if ((i > 1)) then break end
        udg_hatch_entrances[i] = nil
        i = i + 1
    end
    i = 0
    while (true) do
        if ((i > 1)) then break end
        udg_hatch_exits[i] = nil
        i = i + 1
    end
    i = 0
    while (true) do
        if ((i > 1)) then break end
        udg_hatch_entrance_names[i] = ""
        i = i + 1
    end
    i = 0
    while (true) do
        if ((i > 1)) then break end
        udg_hatch_exit_zones[i] = ""
        i = i + 1
    end
    i = 0
    while (true) do
        if ((i > 1)) then break end
        udg_jump_pass_zones_name[i] = ""
        i = i + 1
    end
    i = 0
    while (true) do
        if ((i > 1)) then break end
        udg_power_generator_zones[i] = ""
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
    BlzCreateItemWithSkin(FourCC("I001"), -407.0, 80.9, FourCC("I001"))
    BlzCreateItemWithSkin(FourCC("I001"), -252.0, 37.1, FourCC("I001"))
    BlzCreateItemWithSkin(FourCC("I002"), -361.7, 571.7, FourCC("I002"))
    BlzCreateItemWithSkin(FourCC("I003"), -265.1, 602.5, FourCC("I003"))
    BlzCreateItemWithSkin(FourCC("I004"), -340.6, 282.6, FourCC("I004"))
    BlzCreateItemWithSkin(FourCC("I005"), 665.8, 418.3, FourCC("I005"))
    BlzCreateItemWithSkin(FourCC("IDGN"), 117.5, 675.8, FourCC("IDGN"))
    BlzCreateItemWithSkin(FourCC("IDGN"), 45.4, 670.9, FourCC("IDGN"))
    BlzCreateItemWithSkin(FourCC("ISHO"), 335.0, 639.4, FourCC("ISHO"))
    BlzCreateItemWithSkin(FourCC("ISHO"), 203.0, 659.3, FourCC("ISHO"))
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

function CreateBuildingsForPlayer21()
    local p = Player(21)
    local u
    local unitID
    local t
    local life
    u = BlzCreateUnitWithSkin(p, FourCC("n003"), 1024.0, 896.0, 270.000, FourCC("n003"))
    gg_unit_h004_0046 = BlzCreateUnitWithSkin(p, FourCC("h004"), -27648.0, -25280.0, 270.000, FourCC("h004"))
    gg_unit_h004_0048 = BlzCreateUnitWithSkin(p, FourCC("h004"), 640.0, 768.0, 270.000, FourCC("h004"))
end

function CreateNeutralHostile()
    local p = Player(PLAYER_NEUTRAL_AGGRESSIVE)
    local u
    local unitID
    local t
    local life
    u = BlzCreateUnitWithSkin(p, FourCC("ntrd"), 3147.0, 399.4, 210.264, FourCC("ntrd"))
    u = BlzCreateUnitWithSkin(p, FourCC("ntrd"), 3024.0, 686.9, 215.074, FourCC("ntrd"))
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
    gg_unit_n004_0034 = BlzCreateUnitWithSkin(p, FourCC("n004"), -28673.3, 26617.4, 89.562, FourCC("n004"))
    gg_unit_n004_0035 = BlzCreateUnitWithSkin(p, FourCC("n004"), -26113.3, 26361.4, 89.562, FourCC("n004"))
    u = BlzCreateUnitWithSkin(p, FourCC("nWEP"), 1024.0, -256.0, 270.000, FourCC("nWEP"))
    u = BlzCreateUnitWithSkin(p, FourCC("nMED"), -64.0, 960.0, 270.000, FourCC("nMED"))
    u = BlzCreateUnitWithSkin(p, FourCC("ncp2"), -1696.0, 288.0, 270.000, FourCC("ncp2"))
    u = BlzCreateUnitWithSkin(p, FourCC("nGEN"), -1472.0, 576.0, 270.000, FourCC("nGEN"))
    gg_unit_n002_0043 = BlzCreateUnitWithSkin(p, FourCC("n002"), -27584.0, -26944.0, 270.000, FourCC("n002"))
    gg_unit_n002_0044 = BlzCreateUnitWithSkin(p, FourCC("n002"), -26496.0, -25344.0, 270.000, FourCC("n002"))
    gg_unit_n001_0045 = BlzCreateUnitWithSkin(p, FourCC("n001"), -28864.0, -26944.0, 270.000, FourCC("n001"))
    gg_unit_n004_0047 = BlzCreateUnitWithSkin(p, FourCC("n004"), -26689.3, 27065.4, 89.562, FourCC("n004"))
end

function CreatePlayerBuildings()
    CreateBuildingsForPlayer21()
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
    gg_rct_GeneSplicer = Rect(-1792.0, 192.0, -1600.0, 384.0)
    gg_rct_FallZoneCargo = Rect(-26432.0, -27136.0, -25760.0, -26880.0)
    gg_rct_FallZoneCargoLand = Rect(-25600.0, 26016.0, -25344.0, 26496.0)
    gg_rct_JumpPassCargo = Rect(-26816.0, -27936.0, -25696.0, -27104.0)
    gg_rct_JumpPassCargoVent = Rect(-26496.0, -26944.0, -25728.0, -26080.0)
end

function Trig_Set_Actions()
    udg_elevator_entrances[1] = gg_unit_n001_0032
    udg_elevator_entrances[2] = gg_unit_n001_0021
    udg_elevator_entrances[3] = gg_unit_n001_0045
    udg_elevator_exits[1] = gg_unit_n001_0021
    udg_elevator_exits[2] = gg_unit_n001_0032
    udg_elevator_exits[3] = gg_unit_n001_0021
    udg_LIGHTS[0] = gg_dest_B002_0015
    udg_LIGHTS[1] = gg_dest_B002_0017
    udg_LIGHTS[2] = gg_dest_B002_0019
    udg_LIGHTS[3] = gg_dest_B002_0022
end

function InitTrig_Set()
    gg_trg_Set = CreateTrigger()
    TriggerAddAction(gg_trg_Set, Trig_Set_Actions)
end

function Trig_SetHatch_Actions()
    udg_hatch_entrances[1] = gg_unit_n002_0033
    udg_hatch_entrances[2] = gg_unit_n004_0034
    udg_hatch_entrances[3] = gg_unit_n004_0035
    udg_hatch_entrances[4] = gg_unit_n002_0043
    udg_hatch_entrances[5] = gg_unit_n004_0047
    udg_hatch_entrances[6] = gg_unit_n002_0044
    udg_hatch_exits[1] = gg_unit_n004_0034
    udg_hatch_exits[2] = gg_unit_n002_0033
    udg_hatch_exits[3] = gg_unit_n002_0043
    udg_hatch_exits[4] = gg_unit_n004_0035
    udg_hatch_exits[5] = gg_unit_n002_0044
    udg_hatch_exits[6] = gg_unit_n004_0047
    udg_hatch_entrance_names[1] = "|cff666633Service Tunnels|r"
    udg_hatch_entrance_names[2] = "|cfff5a742Floor 1|r"
    udg_hatch_entrance_names[3] = "|cff008080Cargo|r"
    udg_hatch_entrance_names[4] = "|cff666633Service Tunnels|r"
    udg_hatch_entrance_names[5] = "|cff666633Cargo Vents|r"
    udg_hatch_entrance_names[6] = "|cff666633Service Tunnels|r"
    udg_hatch_exit_zones[1] = "FLOOR_1"
    udg_hatch_exit_zones[2] = "SERVICE_TUNNELS"
    udg_hatch_exit_zones[3] = "SERVICE_TUNNELS"
    udg_hatch_exit_zones[4] = "CARGO_A"
    udg_hatch_exit_zones[5] = "CARGO_A_VENT"
    udg_hatch_exit_zones[6] = "SERVICE_TUNNELS"
end

function InitTrig_SetHatch()
    gg_trg_SetHatch = CreateTrigger()
    TriggerAddAction(gg_trg_SetHatch, Trig_SetHatch_Actions)
end

function Trig_SetFall_Actions()
    udg_fall_points[1] = gg_rct_FallZone1
    udg_fall_results[1] = gg_rct_FallZone1Land
    udg_fall_result_zone_names[1] = "SERVICE_TUNNELS"
    udg_fall_points[2] = gg_rct_FallZoneCargo
    udg_fall_results[2] = gg_rct_FallZoneCargoLand
    udg_fall_result_zone_names[2] = "SERVICE_TUNNELS"
    udg_jump_pass_zones[1] = gg_rct_JumpPassCargoVent
    udg_jump_pass_zones[2] = gg_rct_JumpPassCargo
    udg_jump_pass_zones_name[1] = "CARGO_A_VENT"
    udg_jump_pass_zones_name[2] = "CARGO_A"
end

function InitTrig_SetFall()
    gg_trg_SetFall = CreateTrigger()
    TriggerAddAction(gg_trg_SetFall, Trig_SetFall_Actions)
end

function Trig_SetPowerGenerators_Actions()
    udg_power_generators[1] = gg_unit_h004_0048
    udg_power_generator_zones[1] = "FLOOR_1"
    udg_power_generators[2] = gg_unit_h004_0046
    udg_power_generators[3] = gg_unit_h004_0046
    udg_power_generator_zones[2] = "CARGO_A"
    udg_power_generator_zones[3] = "CARGO_A_VENT"
end

function InitTrig_SetPowerGenerators()
    gg_trg_SetPowerGenerators = CreateTrigger()
    TriggerAddAction(gg_trg_SetPowerGenerators, Trig_SetPowerGenerators_Actions)
end

function InitCustomTriggers()
    InitTrig_Set()
    InitTrig_SetHatch()
    InitTrig_SetFall()
    InitTrig_SetPowerGenerators()
end

function RunInitializationTriggers()
    ConditionalTriggerExecute(gg_trg_Set)
    ConditionalTriggerExecute(gg_trg_SetHatch)
    ConditionalTriggerExecute(gg_trg_SetFall)
    ConditionalTriggerExecute(gg_trg_SetPowerGenerators)
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
    SetPlayerStartLocation(Player(21), 11)
    ForcePlayerStartLocation(Player(21), 11)
    SetPlayerColor(Player(21), ConvertPlayerColor(21))
    SetPlayerRacePreference(Player(21), RACE_PREF_HUMAN)
    SetPlayerRaceSelectable(Player(21), false)
    SetPlayerController(Player(21), MAP_CONTROL_COMPUTER)
    SetPlayerStartLocation(Player(22), 12)
    ForcePlayerStartLocation(Player(22), 12)
    SetPlayerColor(Player(22), ConvertPlayerColor(22))
    SetPlayerRacePreference(Player(22), RACE_PREF_HUMAN)
    SetPlayerRaceSelectable(Player(22), false)
    SetPlayerController(Player(22), MAP_CONTROL_COMPUTER)
    SetPlayerStartLocation(Player(23), 13)
    ForcePlayerStartLocation(Player(23), 13)
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
    SetPlayerTeam(Player(21), 0)
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
    SetPlayerAllianceStateAllyBJ(Player(0), Player(21), true)
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
    SetPlayerAllianceStateAllyBJ(Player(1), Player(21), true)
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
    SetPlayerAllianceStateAllyBJ(Player(2), Player(21), true)
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
    SetPlayerAllianceStateAllyBJ(Player(3), Player(21), true)
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
    SetPlayerAllianceStateAllyBJ(Player(4), Player(21), true)
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
    SetPlayerAllianceStateAllyBJ(Player(5), Player(21), true)
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
    SetPlayerAllianceStateAllyBJ(Player(6), Player(21), true)
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
    SetPlayerAllianceStateAllyBJ(Player(7), Player(21), true)
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
    SetPlayerAllianceStateAllyBJ(Player(8), Player(21), true)
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
    SetPlayerAllianceStateAllyBJ(Player(9), Player(21), true)
    SetPlayerAllianceStateAllyBJ(Player(9), Player(22), true)
    SetPlayerAllianceStateAllyBJ(Player(21), Player(0), true)
    SetPlayerAllianceStateAllyBJ(Player(21), Player(1), true)
    SetPlayerAllianceStateAllyBJ(Player(21), Player(2), true)
    SetPlayerAllianceStateAllyBJ(Player(21), Player(3), true)
    SetPlayerAllianceStateAllyBJ(Player(21), Player(4), true)
    SetPlayerAllianceStateAllyBJ(Player(21), Player(5), true)
    SetPlayerAllianceStateAllyBJ(Player(21), Player(6), true)
    SetPlayerAllianceStateAllyBJ(Player(21), Player(7), true)
    SetPlayerAllianceStateAllyBJ(Player(21), Player(8), true)
    SetPlayerAllianceStateAllyBJ(Player(21), Player(9), true)
    SetPlayerAllianceStateAllyBJ(Player(21), Player(22), true)
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
    SetPlayerAllianceStateAllyBJ(Player(22), Player(21), true)
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
    SetStartLocPrio(10, 8, 12, MAP_LOC_PRIO_LOW)
    SetStartLocPrio(10, 9, 13, MAP_LOC_PRIO_HIGH)
    SetStartLocPrioCount(11, 5)
    SetStartLocPrio(11, 0, 1, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(11, 1, 4, MAP_LOC_PRIO_LOW)
    SetStartLocPrio(11, 2, 5, MAP_LOC_PRIO_LOW)
    SetStartLocPrio(11, 3, 6, MAP_LOC_PRIO_LOW)
    SetStartLocPrio(11, 4, 7, MAP_LOC_PRIO_LOW)
    SetEnemyStartLocPrioCount(11, 5)
    SetEnemyStartLocPrio(11, 0, 1, MAP_LOC_PRIO_LOW)
    SetEnemyStartLocPrio(11, 1, 4, MAP_LOC_PRIO_LOW)
    SetEnemyStartLocPrio(11, 2, 5, MAP_LOC_PRIO_LOW)
    SetEnemyStartLocPrio(11, 3, 6, MAP_LOC_PRIO_LOW)
    SetEnemyStartLocPrio(11, 4, 7, MAP_LOC_PRIO_LOW)
    SetStartLocPrioCount(12, 10)
    SetStartLocPrio(12, 0, 0, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(12, 1, 1, MAP_LOC_PRIO_LOW)
    SetStartLocPrio(12, 2, 3, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(12, 3, 5, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(12, 4, 7, MAP_LOC_PRIO_LOW)
    SetStartLocPrio(12, 5, 8, MAP_LOC_PRIO_LOW)
    SetStartLocPrio(12, 6, 9, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(12, 7, 10, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(12, 8, 13, MAP_LOC_PRIO_LOW)
    SetStartLocPrioCount(13, 9)
    SetStartLocPrio(13, 0, 0, MAP_LOC_PRIO_LOW)
    SetStartLocPrio(13, 1, 2, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(13, 2, 3, MAP_LOC_PRIO_LOW)
    SetStartLocPrio(13, 3, 4, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(13, 4, 5, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(13, 5, 6, MAP_LOC_PRIO_LOW)
    SetStartLocPrio(13, 6, 9, MAP_LOC_PRIO_LOW)
    SetStartLocPrio(13, 7, 10, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(13, 8, 12, MAP_LOC_PRIO_LOW)
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
    SetPlayers(14)
    SetTeams(14)
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
    DefineStartLocation(11, 4032.0, 19776.0)
    DefineStartLocation(12, 0.0, 2560.0)
    DefineStartLocation(13, 22336.0, 28672.0)
    InitCustomPlayerSlots()
    InitCustomTeams()
    InitAllyPriorities()
end


local ____modules = {}
local ____moduleCache = {}
local ____originalRequire = require
local function require(file)
    if ____moduleCache[file] then
        return ____moduleCache[file]
    end
    if ____modules[file] then
        ____moduleCache[file] = ____modules[file]()
        return ____moduleCache[file]
    else
        if ____originalRequire then
            return ____originalRequire(file)
        else
            error("module '" .. file .. "' not found")
        end
    end
end
____modules = {
["src.app.types.vector2"] = function() require("lualib_bundle");
local ____exports = {}
function ____exports.vectorFromUnit(u)
    return __TS__New(
        ____exports.Vector2,
        GetUnitX(u),
        GetUnitY(u)
    )
end
____exports.Vector2 = __TS__Class()
local Vector2 = ____exports.Vector2
Vector2.name = "Vector2"
function Vector2.prototype.____constructor(self, x, y)
    self.x = x
    self.y = y
end
function Vector2.prototype.getLength(self)
    return math.sqrt((self.x * self.x) + (self.y * self.y))
end
function Vector2.prototype.normalise(self)
    local len = self:getLength()
    if len == 0 then
        return __TS__New(____exports.Vector2, 0, 0)
    end
    return __TS__New(____exports.Vector2, self.x / len, self.y / len)
end
function Vector2.prototype.applyPolarOffset(self, angle, offset)
    local result = __TS__New(
        ____exports.Vector2,
        self.x + (Cos(angle * bj_DEGTORAD) * offset),
        self.y + (Sin(angle * bj_DEGTORAD) * offset)
    )
    return result
end
function Vector2.prototype.multiply(self, value)
    return __TS__New(____exports.Vector2, self.x * value.x, self.y * value.y)
end
function Vector2.prototype.multiplyN(self, value)
    return __TS__New(____exports.Vector2, self.x * value, self.y * value)
end
function Vector2.prototype.add(self, value)
    return __TS__New(____exports.Vector2, self.x + value.x, self.y + value.y)
end
function Vector2.prototype.addN(self, value)
    return __TS__New(____exports.Vector2, self.x + value, self.y + value)
end
function Vector2.prototype.subtract(self, value)
    return __TS__New(____exports.Vector2, self.x - value.x, self.y - value.y)
end
function Vector2.prototype.subtractN(self, value)
    return __TS__New(____exports.Vector2, self.x - value, self.y - value)
end
function Vector2.prototype.setLength(self, value)
    if self:getLength() == 0 then
        return __TS__New(____exports.Vector2, 0, 1):setLength(value)
    end
    return self:normalise():multiply(value)
end
function Vector2.prototype.setLengthN(self, value)
    if self:getLength() == 0 then
        return __TS__New(____exports.Vector2, 0, 1):setLengthN(value)
    end
    return self:normalise():multiplyN(value)
end
function Vector2.prototype.__tostring(self)
    return ((((("Vector2={x:" .. tostring(self.x)) .. ", y:") .. tostring(self.y)) .. ",len:") .. tostring(
        self:getLength()
    )) .. "}"
end
function Vector2.prototype.angleTo(self, where)
    return Rad2Deg(
        Atan2(where.y - self.y, where.x - self.x)
    )
end
return ____exports
end,
["src.app.types.vector3"] = function() require("lualib_bundle");
local ____exports = {}
local ____vector2 = require("src.app.types.vector2")
local Vector2 = ____vector2.Vector2
____exports.Vector3 = __TS__Class()
local Vector3 = ____exports.Vector3
Vector3.name = "Vector3"
function Vector3.prototype.____constructor(self, x, y, z)
    self.x = x
    self.y = y
    self.z = z
end
function Vector3.prototype.getLength(self)
    return math.sqrt(((self.x * self.x) + (self.y * self.y)) + (self.z * self.z))
end
function Vector3.prototype.normalise(self)
    local len = self:getLength()
    if len == 0 then
        return __TS__New(____exports.Vector3, 0, 0, 0)
    end
    return __TS__New(____exports.Vector3, self.x / len, self.y / len, self.z / len)
end
function Vector3.prototype.multiply(self, value)
    return __TS__New(____exports.Vector3, self.x * value.x, self.y * value.y, self.z * value.z)
end
function Vector3.prototype.multiplyN(self, value)
    return __TS__New(____exports.Vector3, self.x * value, self.y * value, self.z * value)
end
function Vector3.prototype.add(self, value)
    return __TS__New(____exports.Vector3, self.x + value.x, self.y + value.y, self.z + value.z)
end
function Vector3.prototype.addN(self, value)
    return __TS__New(____exports.Vector3, self.x + value, self.y + value, self.z + value)
end
function Vector3.prototype.subtract(self, value)
    return __TS__New(____exports.Vector3, self.x - value.x, self.y - value.y, self.z - value.z)
end
function Vector3.prototype.subtractN(self, value)
    return __TS__New(____exports.Vector3, self.x - value, self.y - value, self.z - value)
end
function Vector3.prototype.setLength(self, value)
    if self:getLength() == 0 then
        return __TS__New(____exports.Vector3, 0, 1, 0):setLength(value)
    end
    return self:normalise():multiply(value)
end
function Vector3.prototype.setLengthN(self, value)
    if self:getLength() == 0 then
        return __TS__New(____exports.Vector3, 0, 1, 0):setLengthN(value)
    end
    return self:normalise():multiplyN(value)
end
function Vector3.prototype.distanceToLine(self, lineStart, lineEnd)
    local A = self.x - lineStart.x
    local B = self.y - lineStart.y
    local C = lineEnd.x - lineStart.x
    local D = lineEnd.y - lineStart.y
    local dot = (A * C) + (B * D)
    local len_sq = (C * C) + (D * D)
    local param = -1
    if len_sq ~= 0 then
        param = dot / len_sq
    end
    local xx
    local yy
    if param < 0 then
        xx = lineStart.x
        yy = lineStart.y
    elseif param > 1 then
        xx = lineEnd.x
        yy = lineEnd.y
    else
        xx = lineStart.x + (param * C)
        yy = lineStart.y + (param * D)
    end
    local dx = self.x - xx
    local dy = self.y - yy
    return math.sqrt((dx * dx) + (dy * dy))
end
function Vector3.prototype.projectTowards2D(self, angle, offset)
    local result = __TS__New(____exports.Vector3, self.x, self.y, self.z)
    result.x = result.x + (offset * Cos(angle * bj_DEGTORAD))
    result.y = result.y + (offset * Sin(angle * bj_DEGTORAD))
    return result
end
function Vector3.prototype.projectTowardsGunModel(self, unit)
    local r = self:projectTowards2D(
        GetUnitFacing(unit) - 20,
        35
    )
    r.z = r.z + 60
    return r
end
function Vector3.prototype.__tostring(self)
    return (((((("Vector3=x:" .. tostring(self.x)) .. ", y:") .. tostring(self.y)) .. ",z:") .. tostring(self.z)) .. ",len:") .. tostring(
        self:getLength()
    )
end
function Vector3.prototype.to2D(self)
    return __TS__New(Vector2, self.x, self.y)
end
function Vector3.prototype.angle2Dto(self, where)
    return Rad2Deg(
        Atan2(where.y - self.y, where.x - self.x)
    )
end
function Vector3.prototype.dot(self, v)
    return (self.x * v.x) + (self.y * v.y)
end
return ____exports
end,
["src.lib.serilog.serilog"] = function() require("lualib_bundle");
local ____exports = {}
____exports.LogLevel = {}
____exports.LogLevel.None = -1
____exports.LogLevel[____exports.LogLevel.None] = "None"
____exports.LogLevel.Message = 0
____exports.LogLevel[____exports.LogLevel.Message] = "Message"
____exports.LogLevel.Verbose = 1
____exports.LogLevel[____exports.LogLevel.Verbose] = "Verbose"
____exports.LogLevel.Event = 2
____exports.LogLevel[____exports.LogLevel.Event] = "Event"
____exports.LogLevel.Debug = 3
____exports.LogLevel[____exports.LogLevel.Debug] = "Debug"
____exports.LogLevel.Information = 4
____exports.LogLevel[____exports.LogLevel.Information] = "Information"
____exports.LogLevel.Warning = 5
____exports.LogLevel[____exports.LogLevel.Warning] = "Warning"
____exports.LogLevel.Error = 6
____exports.LogLevel[____exports.LogLevel.Error] = "Error"
____exports.LogLevel.Fatal = 7
____exports.LogLevel[____exports.LogLevel.Fatal] = "Fatal"
____exports.LogEventType = {}
____exports.LogEventType.Text = 0
____exports.LogEventType[____exports.LogEventType.Text] = "Text"
____exports.LogEventType.Parameter = 1
____exports.LogEventType[____exports.LogEventType.Parameter] = "Parameter"
____exports.LogEvent = __TS__Class()
local LogEvent = ____exports.LogEvent
LogEvent.name = "LogEvent"
function LogEvent.prototype.____constructor(self, Type, Text, Value)
    self.Type = Type
    self.Text = Text
    self.Value = Value
end
____exports.Log = {}
local Log = ____exports.Log
do
    local _sinks
    function Log.Init(sinks)
        _sinks = sinks
    end
    local function Parse(message, ...)
        local args = {...}
        local logEvents = {}
        local matcher = string.gmatch(message, "{.-}")
        local match
        local text
        local n = 0
        local i = 0
        while (function()
            match = matcher(nil)
            return match
        end)() do
            do
                local s, e = string.find(message, match, 1, true)
                if (not s) or (not e) then
                    goto __continue6
                end
                text = string.sub(message, i + 1, s - 1)
                if text ~= "" then
                    __TS__ArrayPush(
                        logEvents,
                        __TS__New(____exports.LogEvent, ____exports.LogEventType.Text, text, nil)
                    )
                end
                __TS__ArrayPush(
                    logEvents,
                    __TS__New(____exports.LogEvent, ____exports.LogEventType.Parameter, match, args[n + 1])
                )
                i = e
                n = n + 1
            end
            ::__continue6::
        end
        text = string.sub(message, i + 1)
        if text ~= "" then
            __TS__ArrayPush(
                logEvents,
                __TS__New(____exports.LogEvent, ____exports.LogEventType.Text, text, nil)
            )
        end
        return logEvents
    end
    function Log.Log(level, message, ...)
        local args = {...}
        local logEvents = Parse(
            message,
            table.unpack(args)
        )
        do
            local index = 0
            while index < #_sinks do
                if _sinks[index + 1]:LogLevel() <= level then
                    _sinks[index + 1]:Log(level, logEvents)
                end
                index = index + 1
            end
        end
    end
    function Log.Fatal(message, ...)
        local args = {...}
        Log.Log(
            ____exports.LogLevel.Fatal,
            message,
            table.unpack(args)
        )
    end
    function Log.Error(message, ...)
        local args = {...}
        Log.Log(
            ____exports.LogLevel.Error,
            message,
            table.unpack(args)
        )
    end
    function Log.Warning(message, ...)
        local args = {...}
        Log.Log(
            ____exports.LogLevel.Warning,
            message,
            table.unpack(args)
        )
    end
    function Log.Information(message, ...)
        local args = {...}
        Log.Log(
            ____exports.LogLevel.Information,
            message,
            table.unpack(args)
        )
    end
    function Log.Debug(message, ...)
        local args = {...}
        Log.Log(
            ____exports.LogLevel.Debug,
            message,
            table.unpack(args)
        )
    end
    function Log.Message(message, ...)
        local args = {...}
        Log.Log(
            ____exports.LogLevel.Message,
            message,
            table.unpack(args)
        )
    end
    function Log.Event(id, message)
        Log.Log(
            ____exports.LogLevel.Event,
            ((("{\"event\":" .. tostring(id)) .. ", \"data\": ") .. tostring(message)) .. "}"
        )
    end
    function Log.Verbose(message, ...)
        local args = {...}
        Log.Log(
            ____exports.LogLevel.Verbose,
            message,
            table.unpack(args)
        )
    end
end
return ____exports
end,
["src.app.weapons.projectile.projectile-target"] = function() require("lualib_bundle");
local ____exports = {}
local ____vector3 = require("src.app.types.vector3")
local Vector3 = ____vector3.Vector3
____exports.ProjectileTargetStatic = __TS__Class()
local ProjectileTargetStatic = ____exports.ProjectileTargetStatic
ProjectileTargetStatic.name = "ProjectileTargetStatic"
function ProjectileTargetStatic.prototype.____constructor(self, loc)
    self.loc = loc
end
function ProjectileTargetStatic.prototype.getTargetX(self)
    return self.loc.x
end
function ProjectileTargetStatic.prototype.getTargetY(self)
    return self.loc.y
end
function ProjectileTargetStatic.prototype.getTargetZ(self)
    return self.loc.z
end
function ProjectileTargetStatic.prototype.getTargetVector(self)
    return __TS__New(
        Vector3,
        self:getTargetX(),
        self:getTargetY(),
        self:getTargetZ()
    )
end
____exports.ProjectileTargetUnit = __TS__Class()
local ProjectileTargetUnit = ____exports.ProjectileTargetUnit
ProjectileTargetUnit.name = "ProjectileTargetUnit"
function ProjectileTargetUnit.prototype.____constructor(self, target)
    self.target = target
end
function ProjectileTargetUnit.prototype.getTargetX(self)
    return GetUnitX(self.target)
end
function ProjectileTargetUnit.prototype.getTargetY(self)
    return GetUnitY(self.target)
end
function ProjectileTargetUnit.prototype.getTargetZ(self)
    return BlzGetUnitZ(self.target)
end
function ProjectileTargetUnit.prototype.getTargetVector(self)
    return __TS__New(
        Vector3,
        self:getTargetX(),
        self:getTargetY(),
        self:getTargetZ()
    )
end
____exports.ProjectileMoverLinear = __TS__Class()
local ProjectileMoverLinear = ____exports.ProjectileMoverLinear
ProjectileMoverLinear.name = "ProjectileMoverLinear"
function ProjectileMoverLinear.prototype.____constructor(self)
end
function ProjectileMoverLinear.prototype.move(self, currentPostion, goal, velocity, delta)
    local velocityVector = goal:normalise():multiplyN(velocity * delta)
    return velocityVector
end
local GRAVITY = 800
____exports.ProjectileMoverParabolic = __TS__Class()
local ProjectileMoverParabolic = ____exports.ProjectileMoverParabolic
ProjectileMoverParabolic.name = "ProjectileMoverParabolic"
function ProjectileMoverParabolic.prototype.____constructor(self, originalPosition, goal, radians)
    self.distanceTravelled = 0
    self.distanceTravelledVertically = 0
    self.angle = 0
    self.velocity = 0
    self.timeElapsed = 0
    self.originalPos = originalPosition
    self.originalDelta = goal:subtract(originalPosition)
    local dLen = self.originalDelta:to2D():getLength()
    local velocity = SquareRoot(
        ((dLen * dLen) * GRAVITY) / ((dLen * Sin(2 * radians)) - ((2 * self.originalDelta.z) * (Cos(radians) * Cos(radians))))
    )
    self.angle = radians
    self.velocity = velocity
end
function ProjectileMoverParabolic.prototype.move(self, currentPostion, goal, velocity, deltaTime)
    local direction = self.originalDelta:normalise()
    local totalXY = (self.velocity * self.timeElapsed) * Cos(self.angle)
    local xyDelta = totalXY - self.distanceTravelled
    local totalZ = ((self.velocity * self.timeElapsed) * Sin(self.angle)) - ((GRAVITY * (self.timeElapsed * self.timeElapsed)) / 2)
    local zDelta = totalZ - self.distanceTravelledVertically
    self.distanceTravelled = self.distanceTravelled + xyDelta
    self.distanceTravelledVertically = self.distanceTravelledVertically + zDelta
    self.timeElapsed = self.timeElapsed + deltaTime
    return __TS__New(Vector3, direction.x * xyDelta, direction.y * xyDelta, 0 + zDelta)
end
return ____exports
end,
["node_modules.w3ts.handles.handle"] = function() require("lualib_bundle");
local ____exports = {}
____exports.Handle = __TS__Class()
local Handle = ____exports.Handle
Handle.name = "Handle"
Handle.prototype.____getters = {}
Handle.prototype.__index = __TS__Index(Handle.prototype)
function Handle.prototype.____constructor(self, handle)
    self.handle = (((handle == nil) and (function() return ____exports.Handle.initHandle end)) or (function() return handle end))()
end
function Handle.prototype.____getters.id(self)
    return GetHandleId(self.handle)
end
function Handle.initFromHandle(self)
    return ____exports.Handle.initHandle ~= nil
end
function Handle.getObject(self, handle)
    local obj = self.map:get(handle)
    if obj ~= nil then
        return obj
    end
    ____exports.Handle.initHandle = handle
    local newObj = __TS__New(self)
    ____exports.Handle.initHandle = nil
    self.map:set(handle, newObj)
    return newObj
end
Handle.map = __TS__New(WeakMap)
return ____exports
end,
["node_modules.w3ts.handles.widget"] = function() require("lualib_bundle");
local ____exports = {}
local ____handle = require("node_modules.w3ts.handles.handle")
local Handle = ____handle.Handle
____exports.Widget = __TS__Class()
local Widget = ____exports.Widget
Widget.name = "Widget"
Widget.prototype.____getters = {}
Widget.prototype.__index = __TS__Index(Widget.prototype)
Widget.prototype.____setters = {}
Widget.prototype.__newindex = __TS__NewIndex(Widget.prototype)
Widget.____super = Handle
setmetatable(Widget, Widget.____super)
setmetatable(Widget.prototype, Widget.____super.prototype)
function Widget.prototype.____getters.life(self)
    return GetWidgetLife(self.handle)
end
function Widget.prototype.____setters.life(self, value)
    SetWidgetLife(self.handle, value)
end
function Widget.prototype.____getters.x(self)
    return GetWidgetX(self.handle)
end
function Widget.prototype.____getters.y(self)
    return GetWidgetY(self.handle)
end
function Widget.fromEvent(self)
    return self:fromHandle(
        GetTriggerWidget()
    )
end
function Widget.fromHandle(self, handle)
    return self:getObject(handle)
end
return ____exports
end,
["node_modules.w3ts.handles.destructable"] = function() require("lualib_bundle");
local ____exports = {}
local ____handle = require("node_modules.w3ts.handles.handle")
local Handle = ____handle.Handle
local ____widget = require("node_modules.w3ts.handles.widget")
local Widget = ____widget.Widget
____exports.Destructable = __TS__Class()
local Destructable = ____exports.Destructable
Destructable.name = "Destructable"
Destructable.prototype.____getters = {}
Destructable.prototype.__index = __TS__Index(Destructable.prototype)
Destructable.prototype.____setters = {}
Destructable.prototype.__newindex = __TS__NewIndex(Destructable.prototype)
Destructable.____super = Widget
setmetatable(Destructable, Destructable.____super)
setmetatable(Destructable.prototype, Destructable.____super.prototype)
function Destructable.prototype.____constructor(self, objectId, x, y, z, face, scale, varation)
    Widget.prototype.____constructor(
        self,
        ((Handle:initFromHandle() and (function() return nil end)) or (function() return CreateDestructableZ(objectId, x, y, z, face, scale, varation) end))()
    )
end
function Destructable.prototype.____setters.invulnerable(self, flag)
    SetDestructableInvulnerable(self.handle, flag)
end
function Destructable.prototype.____getters.invulnerable(self)
    return IsDestructableInvulnerable(self.handle)
end
function Destructable.prototype.____getters.life(self)
    return GetDestructableLife(self.handle)
end
function Destructable.prototype.____setters.life(self, value)
    SetDestructableLife(self.handle, value)
end
function Destructable.prototype.____getters.maxLife(self)
    return GetDestructableMaxLife(self.handle)
end
function Destructable.prototype.____setters.maxLife(self, value)
    SetDestructableMaxLife(self.handle, value)
end
function Destructable.prototype.____getters.name(self)
    return GetDestructableName(self.handle)
end
function Destructable.prototype.____getters.occluderHeight(self)
    return GetDestructableOccluderHeight(self.handle)
end
function Destructable.prototype.____setters.occluderHeight(self, value)
    SetDestructableOccluderHeight(self.handle, value)
end
function Destructable.prototype.____getters.typeId(self)
    return GetDestructableTypeId(self.handle)
end
function Destructable.prototype.____getters.x(self)
    return GetDestructableX(self.handle)
end
function Destructable.prototype.____getters.y(self)
    return GetDestructableY(self.handle)
end
function Destructable.prototype.destroy(self)
    RemoveDestructable(self.handle)
end
function Destructable.prototype.heal(self, life, birth)
    DestructableRestoreLife(self.handle, life, birth)
end
function Destructable.prototype.kill(self)
    KillDestructable(self.handle)
end
function Destructable.prototype.queueAnim(self, whichAnimation)
    QueueDestructableAnimation(self.handle, whichAnimation)
end
function Destructable.prototype.setAnim(self, whichAnimation)
    SetDestructableAnimation(self.handle, whichAnimation)
end
function Destructable.prototype.setAnimSpeed(self, speedFactor)
    SetDestructableAnimationSpeed(self.handle, speedFactor)
end
function Destructable.prototype.show(self, flag)
    ShowDestructable(self.handle, flag)
end
function Destructable.fromEvent(self)
    return self:fromHandle(
        GetTriggerDestructable()
    )
end
function Destructable.fromHandle(self, handle)
    return self:getObject(handle)
end
return ____exports
end,
["node_modules.w3ts.handles.point"] = function() require("lualib_bundle");
local ____exports = {}
local ____handle = require("node_modules.w3ts.handles.handle")
local Handle = ____handle.Handle
____exports.Point = __TS__Class()
local Point = ____exports.Point
Point.name = "Point"
Point.prototype.____getters = {}
Point.prototype.__index = __TS__Index(Point.prototype)
Point.prototype.____setters = {}
Point.prototype.__newindex = __TS__NewIndex(Point.prototype)
Point.____super = Handle
setmetatable(Point, Point.____super)
setmetatable(Point.prototype, Point.____super.prototype)
function Point.prototype.____constructor(self, x, y)
    Handle.prototype.____constructor(
        self,
        ((Handle:initFromHandle() and (function() return nil end)) or (function() return Location(x, y) end))()
    )
end
function Point.prototype.____getters.x(self)
    return GetLocationX(self.handle)
end
function Point.prototype.____setters.x(self, value)
    MoveLocation(self.handle, value, self.y)
end
function Point.prototype.____getters.y(self)
    return GetLocationY(self.handle)
end
function Point.prototype.____setters.y(self, value)
    MoveLocation(self.handle, self.x, value)
end
function Point.prototype.____getters.z(self)
    return GetLocationZ(self.handle)
end
function Point.prototype.destroy(self)
    RemoveLocation(self.handle)
end
function Point.prototype.setPosition(self, x, y)
    MoveLocation(self.handle, x, y)
end
function Point.fromHandle(self, handle)
    return self:getObject(handle)
end
return ____exports
end,
["node_modules.w3ts.handles.player"] = function() require("lualib_bundle");
local ____exports = {}
local ____handle = require("node_modules.w3ts.handles.handle")
local Handle = ____handle.Handle
____exports.MapPlayer = __TS__Class()
local MapPlayer = ____exports.MapPlayer
MapPlayer.name = "MapPlayer"
MapPlayer.prototype.____getters = {}
MapPlayer.prototype.__index = __TS__Index(MapPlayer.prototype)
MapPlayer.prototype.____setters = {}
MapPlayer.prototype.__newindex = __TS__NewIndex(MapPlayer.prototype)
MapPlayer.____super = Handle
setmetatable(MapPlayer, MapPlayer.____super)
setmetatable(MapPlayer.prototype, MapPlayer.____super.prototype)
function MapPlayer.prototype.____constructor(self, index)
    Handle.prototype.____constructor(
        self,
        ((Handle:initFromHandle() and (function() return nil end)) or (function() return Player(index) end))()
    )
end
function MapPlayer.prototype.____setters.color(self, color)
    SetPlayerColor(self.handle, color)
end
function MapPlayer.prototype.____getters.color(self)
    return GetPlayerColor(self.handle)
end
function MapPlayer.prototype.____getters.controller(self)
    return GetPlayerController(self.handle)
end
function MapPlayer.prototype.____getters.handicap(self)
    return GetPlayerHandicap(self.handle)
end
function MapPlayer.prototype.____setters.handicap(self, handicap)
    SetPlayerHandicap(self.handle, handicap)
end
function MapPlayer.prototype.____getters.handicapXp(self)
    return GetPlayerHandicapXP(self.handle)
end
function MapPlayer.prototype.____setters.handicapXp(self, handicap)
    SetPlayerHandicapXP(self.handle, handicap)
end
function MapPlayer.prototype.____getters.id(self)
    return GetPlayerId(self.handle)
end
function MapPlayer.prototype.____getters.name(self)
    return GetPlayerName(self.handle)
end
function MapPlayer.prototype.____setters.name(self, value)
    SetPlayerName(self.handle, value)
end
function MapPlayer.prototype.____getters.race(self)
    return GetPlayerRace(self.handle)
end
function MapPlayer.prototype.____getters.slotState(self)
    return GetPlayerSlotState(self.handle)
end
function MapPlayer.prototype.____getters.startLocation(self)
    return GetPlayerStartLocation(self.handle)
end
function MapPlayer.prototype.____getters.team(self)
    return GetPlayerTeam(self.handle)
end
function MapPlayer.prototype.addTechResearched(self, techId, levels)
    AddPlayerTechResearched(self.handle, techId, levels)
end
function MapPlayer.prototype.cacheHeroData(self)
    CachePlayerHeroData(self.handle)
end
function MapPlayer.prototype.compareAlliance(self, otherPlayer, whichAllianceSetting)
    return GetPlayerAlliance(self.handle, otherPlayer.handle, whichAllianceSetting)
end
function MapPlayer.prototype.coordsFogged(self, x, y)
    return IsFoggedToPlayer(x, y, self.handle)
end
function MapPlayer.prototype.coordsMasked(self, x, y)
    return IsMaskedToPlayer(x, y, self.handle)
end
function MapPlayer.prototype.coordsVisible(self, x, y)
    return IsVisibleToPlayer(x, y, self.handle)
end
function MapPlayer.prototype.cripple(self, toWhichPlayers, flag)
    CripplePlayer(self.handle, toWhichPlayers.handle, flag)
end
function MapPlayer.prototype.getScore(self, whichPlayerScore)
    return GetPlayerScore(self.handle, whichPlayerScore)
end
function MapPlayer.prototype.getState(self, whichPlayerState)
    return GetPlayerState(self.handle, whichPlayerState)
end
function MapPlayer.prototype.getStructureCount(self, includeIncomplete)
    return GetPlayerStructureCount(self.handle, includeIncomplete)
end
function MapPlayer.prototype.getTaxRate(self, otherPlayer, whichResource)
    return GetPlayerTaxRate(self.handle, otherPlayer, whichResource)
end
function MapPlayer.prototype.getTechCount(self, techId, specificonly)
    return GetPlayerTechCount(self.handle, techId, specificonly)
end
function MapPlayer.prototype.getTechMaxAllowed(self, techId)
    return GetPlayerTechMaxAllowed(self.handle, techId)
end
function MapPlayer.prototype.getTechResearched(self, techId, specificonly)
    return GetPlayerTechResearched(self.handle, techId, specificonly)
end
function MapPlayer.prototype.getUnitCount(self, includeIncomplete)
    return GetPlayerUnitCount(self.handle, includeIncomplete)
end
function MapPlayer.prototype.getUnitCountByType(self, unitName, includeIncomplete, includeUpgrades)
    return GetPlayerTypedUnitCount(self.handle, unitName, includeIncomplete, includeUpgrades)
end
function MapPlayer.prototype.inForce(self, whichForce)
    return IsPlayerInForce(self.handle, whichForce.handle)
end
function MapPlayer.prototype.isObserver(self)
    return IsPlayerObserver(self.handle)
end
function MapPlayer.prototype.isPlayerAlly(self, otherPlayer)
    return IsPlayerAlly(self.handle, otherPlayer.handle)
end
function MapPlayer.prototype.isPlayerEnemy(self, otherPlayer)
    return IsPlayerEnemy(self.handle, otherPlayer.handle)
end
function MapPlayer.prototype.isRacePrefSet(self, pref)
    return IsPlayerRacePrefSet(self.handle, pref)
end
function MapPlayer.prototype.isSelectable(self)
    return GetPlayerSelectable(self.handle)
end
function MapPlayer.prototype.pointFogged(self, whichPoint)
    return IsLocationFoggedToPlayer(whichPoint.handle, self.handle)
end
function MapPlayer.prototype.pointMasked(self, whichPoint)
    return IsLocationMaskedToPlayer(whichPoint.handle, self.handle)
end
function MapPlayer.prototype.pointVisible(self, whichPoint)
    return IsLocationVisibleToPlayer(whichPoint.handle, self.handle)
end
function MapPlayer.prototype.remove(self, gameResult)
    RemovePlayer(self.handle, gameResult)
end
function MapPlayer.prototype.removeAllGuardPositions(self)
    RemoveAllGuardPositions(self.handle)
end
function MapPlayer.prototype.setAbilityAvailable(self, abilId, avail)
    SetPlayerAbilityAvailable(self.handle, abilId, avail)
end
function MapPlayer.prototype.setAlliance(self, otherPlayer, whichAllianceSetting, value)
    SetPlayerAlliance(self.handle, otherPlayer.handle, whichAllianceSetting, value)
end
function MapPlayer.prototype.setOnScoreScreen(self, flag)
    SetPlayerOnScoreScreen(self.handle, flag)
end
function MapPlayer.prototype.setState(self, whichPlayerState, value)
    SetPlayerState(self.handle, whichPlayerState, value)
end
function MapPlayer.prototype.setTaxRate(self, otherPlayer, whichResource, rate)
    SetPlayerTaxRate(self.handle, otherPlayer.handle, whichResource, rate)
end
function MapPlayer.prototype.setTechMaxAllowed(self, techId, maximum)
    SetPlayerTechMaxAllowed(self.handle, techId, maximum)
end
function MapPlayer.prototype.setTechResearched(self, techId, setToLevel)
    SetPlayerTechResearched(self.handle, techId, setToLevel)
end
function MapPlayer.prototype.setUnitsOwner(self, newOwner)
    SetPlayerUnitsOwner(self.handle, newOwner)
end
function MapPlayer.fromEnum(self)
    return ____exports.MapPlayer:fromHandle(
        GetEnumPlayer()
    )
end
function MapPlayer.fromEvent(self)
    return ____exports.MapPlayer:fromHandle(
        GetTriggerPlayer()
    )
end
function MapPlayer.fromFilter(self)
    return ____exports.MapPlayer:fromHandle(
        GetFilterPlayer()
    )
end
function MapPlayer.fromHandle(self, handle)
    return self:getObject(handle)
end
function MapPlayer.fromIndex(self, index)
    return self:fromHandle(
        Player(index)
    )
end
function MapPlayer.fromLocal(self)
    return self:fromHandle(
        GetLocalPlayer()
    )
end
return ____exports
end,
["node_modules.w3ts.handles.force"] = function() require("lualib_bundle");
local ____exports = {}
local ____handle = require("node_modules.w3ts.handles.handle")
local Handle = ____handle.Handle
____exports.Force = __TS__Class()
local Force = ____exports.Force
Force.name = "Force"
Force.prototype.__index = __TS__Index(Force.prototype)
Force.____super = Handle
setmetatable(Force, Force.____super)
setmetatable(Force.prototype, Force.____super.prototype)
function Force.prototype.____constructor(self)
    Handle.prototype.____constructor(
        self,
        ((Handle:initFromHandle() and (function() return nil end)) or (function() return CreateForce() end))()
    )
end
function Force.prototype.addPlayer(self, whichPlayer)
    ForceAddPlayer(self.handle, whichPlayer.handle)
end
function Force.prototype.clear(self)
    ForceClear(self.handle)
end
function Force.prototype.destroy(self)
    DestroyForce(self.handle)
end
function Force.prototype.enumAllies(self, whichPlayer, filter)
    ForceEnumAllies(self.handle, whichPlayer.handle, filter)
end
function Force.prototype.enumEnemies(self, whichPlayer, filter)
    ForceEnumEnemies(self.handle, whichPlayer.handle, filter)
end
function Force.prototype.enumPlayers(self, filter)
    ForceEnumPlayers(self.handle, filter)
end
function Force.prototype.enumPlayersCounted(self, filter, countLimit)
    ForceEnumPlayersCounted(self.handle, filter, countLimit)
end
Force.prototype["for"] = function(self, callback)
    ForForce(self.handle, callback)
end
function Force.prototype.hasPlayer(self, whichPlayer)
    return IsPlayerInForce(whichPlayer.handle, self.handle)
end
function Force.prototype.removePlayer(self, whichPlayer)
    ForceRemovePlayer(self.handle, whichPlayer.handle)
end
function Force.fromHandle(self, handle)
    return self:getObject(handle)
end
return ____exports
end,
["node_modules.w3ts.handles.rect"] = function() require("lualib_bundle");
local ____exports = {}
local ____handle = require("node_modules.w3ts.handles.handle")
local Handle = ____handle.Handle
____exports.Rectangle = __TS__Class()
local Rectangle = ____exports.Rectangle
Rectangle.name = "Rectangle"
Rectangle.prototype.____getters = {}
Rectangle.prototype.__index = __TS__Index(Rectangle.prototype)
Rectangle.____super = Handle
setmetatable(Rectangle, Rectangle.____super)
setmetatable(Rectangle.prototype, Rectangle.____super.prototype)
function Rectangle.prototype.____constructor(self, minX, minY, maxX, maxY)
    Handle.prototype.____constructor(
        self,
        ((Handle:initFromHandle() and (function() return nil end)) or (function() return Rect(minX, minY, maxX, maxY) end))()
    )
end
function Rectangle.prototype.____getters.centerX(self)
    return GetRectCenterX(self.handle)
end
function Rectangle.prototype.____getters.centerY(self)
    return GetRectCenterY(self.handle)
end
function Rectangle.prototype.____getters.maxX(self)
    return GetRectMaxX(self.handle)
end
function Rectangle.prototype.____getters.maxY(self)
    return GetRectMaxY(self.handle)
end
function Rectangle.prototype.____getters.minX(self)
    return GetRectMinX(self.handle)
end
function Rectangle.prototype.____getters.minY(self)
    return GetRectMinY(self.handle)
end
function Rectangle.prototype.destroy(self)
    RemoveRect(self.handle)
end
function Rectangle.prototype.enumDestructables(self, filter, actionFunc)
    EnumDestructablesInRect(self.handle, filter, actionFunc)
end
function Rectangle.prototype.enumItems(self, filter, actionFunc)
    EnumItemsInRect(self.handle, filter, actionFunc)
end
function Rectangle.getWorldBounds(self)
    return ____exports.Rectangle:fromHandle(
        GetWorldBounds()
    )
end
function Rectangle.prototype.move(self, newCenterX, newCenterY)
    MoveRectTo(self.handle, newCenterX, newCenterY)
end
function Rectangle.prototype.movePoint(self, newCenterPoint)
    MoveRectToLoc(self.handle, newCenterPoint.handle)
end
function Rectangle.prototype.setRect(self, minX, minY, maxX, maxY)
    SetRect(self.handle, minX, minY, maxX, maxY)
end
function Rectangle.prototype.setRectFromPoint(self, min, max)
    SetRectFromLoc(self.handle, min.handle, max.handle)
end
function Rectangle.fromHandle(self, handle)
    return self:getObject(handle)
end
function Rectangle.fromPoint(self, min, max)
    return self:fromHandle(
        RectFromLoc(min.handle, max.handle)
    )
end
return ____exports
end,
["node_modules.w3ts.handles.group"] = function() require("lualib_bundle");
local ____exports = {}
local ____handle = require("node_modules.w3ts.handles.handle")
local Handle = ____handle.Handle
local ____unit = require("node_modules.w3ts.handles.unit")
local Unit = ____unit.Unit
____exports.Group = __TS__Class()
local Group = ____exports.Group
Group.name = "Group"
Group.prototype.____getters = {}
Group.prototype.__index = __TS__Index(Group.prototype)
Group.____super = Handle
setmetatable(Group, Group.____super)
setmetatable(Group.prototype, Group.____super.prototype)
function Group.prototype.____constructor(self)
    Handle.prototype.____constructor(
        self,
        ((Handle:initFromHandle() and (function() return nil end)) or (function() return CreateGroup() end))()
    )
end
function Group.prototype.____getters.first(self)
    return FirstOfGroup(self.handle)
end
function Group.prototype.____getters.size(self)
    return BlzGroupGetSize(self.handle)
end
function Group.prototype.addGroupFast(self, addGroup)
    return BlzGroupAddGroupFast(self.handle, addGroup.handle)
end
function Group.prototype.addUnit(self, whichUnit)
    return GroupAddUnit(self.handle, whichUnit.handle)
end
function Group.prototype.clear(self)
    GroupClear(self.handle)
end
function Group.prototype.destroy(self)
    DestroyGroup(self.handle)
end
function Group.prototype.enumUnitsInRange(self, x, y, radius, filter)
    GroupEnumUnitsInRange(self.handle, x, y, radius, filter)
end
function Group.prototype.enumUnitsInRangeCounted(self, x, y, radius, filter, countLimit)
    GroupEnumUnitsInRangeCounted(self.handle, x, y, radius, filter, countLimit)
end
function Group.prototype.enumUnitsInRangeOfPoint(self, whichPoint, radius, filter)
    GroupEnumUnitsInRangeOfLoc(self.handle, whichPoint.handle, radius, filter)
end
function Group.prototype.enumUnitsInRangeOfPointCounted(self, whichPoint, radius, filter, countLimit)
    GroupEnumUnitsInRangeOfLocCounted(self.handle, whichPoint.handle, radius, filter, countLimit)
end
function Group.prototype.enumUnitsInRect(self, r, filter)
    GroupEnumUnitsInRect(self.handle, r.handle, filter)
end
function Group.prototype.enumUnitsInRectCounted(self, r, filter, countLimit)
    GroupEnumUnitsInRectCounted(self.handle, r.handle, filter, countLimit)
end
function Group.prototype.enumUnitsOfPlayer(self, whichPlayer, filter)
    GroupEnumUnitsOfPlayer(self.handle, whichPlayer.handle, filter)
end
function Group.prototype.enumUnitsOfType(self, unitName, filter)
    GroupEnumUnitsOfType(self.handle, unitName, filter)
end
function Group.prototype.enumUnitsOfTypeCounted(self, unitName, filter, countLimit)
    GroupEnumUnitsOfTypeCounted(self.handle, unitName, filter, countLimit)
end
function Group.prototype.enumUnitsSelected(self, whichPlayer, radius, filter)
    GroupEnumUnitsSelected(self.handle, whichPlayer.handle, filter)
end
Group.prototype["for"] = function(self, callback)
    ForGroup(self.handle, callback)
end
function Group.prototype.getUnitAt(self, index)
    return Unit:fromHandle(
        BlzGroupUnitAt(self.handle, index)
    )
end
function Group.prototype.hasUnit(self, whichUnit)
    return IsUnitInGroup(whichUnit.handle, self.handle)
end
function Group.prototype.orderCoords(self, order, x, y)
    if type(order) == "string" then
        GroupPointOrder(self.handle, order, x, y)
    else
        GroupPointOrderById(self.handle, order, x, y)
    end
end
function Group.prototype.orderImmediate(self, order)
    if type(order) == "string" then
        GroupImmediateOrder(self.handle, order)
    else
        GroupImmediateOrderById(self.handle, order)
    end
end
function Group.prototype.orderPoint(self, order, whichPoint)
    if type(order) == "string" then
        GroupPointOrderLoc(self.handle, order, whichPoint.handle)
    else
        GroupPointOrderByIdLoc(self.handle, order, whichPoint.handle)
    end
end
function Group.prototype.orderTarget(self, order, targetWidget)
    if type(order) == "string" then
        GroupTargetOrder(self.handle, order, targetWidget.handle)
    else
        GroupTargetOrderById(self.handle, order, targetWidget.handle)
    end
end
function Group.prototype.removeGroupFast(self, removeGroup)
    return BlzGroupRemoveGroupFast(self.handle, removeGroup.handle)
end
function Group.prototype.removeUnit(self, whichUnit)
    return GroupRemoveUnit(self.handle, whichUnit.handle)
end
function Group.fromHandle(self, handle)
    return self:getObject(handle)
end
function Group.getEnumUnit(self)
    return Unit:fromHandle(
        GetEnumUnit()
    )
end
function Group.getFilterUnit(self)
    return Unit:fromHandle(
        GetFilterUnit()
    )
end
return ____exports
end,
["node_modules.w3ts.handles.item"] = function() require("lualib_bundle");
local ____exports = {}
local ____handle = require("node_modules.w3ts.handles.handle")
local Handle = ____handle.Handle
local ____widget = require("node_modules.w3ts.handles.widget")
local Widget = ____widget.Widget
____exports.Item = __TS__Class()
local Item = ____exports.Item
Item.name = "Item"
Item.prototype.____getters = {}
Item.prototype.__index = __TS__Index(Item.prototype)
Item.prototype.____setters = {}
Item.prototype.__newindex = __TS__NewIndex(Item.prototype)
Item.____super = Widget
setmetatable(Item, Item.____super)
setmetatable(Item.prototype, Item.____super.prototype)
function Item.prototype.____constructor(self, itemid, x, y)
    Widget.prototype.____constructor(
        self,
        ((Handle:initFromHandle() and (function() return nil end)) or (function() return CreateItem(itemid, x, y) end))()
    )
end
function Item.prototype.____getters.charges(self)
    return GetItemCharges(self.handle)
end
function Item.prototype.____setters.charges(self, value)
    SetItemCharges(self.handle, value)
end
function Item.prototype.____setters.invulnerable(self, flag)
    SetItemInvulnerable(self.handle, true)
end
function Item.prototype.____getters.invulnerable(self)
    return IsItemInvulnerable(self.handle)
end
function Item.prototype.____getters.level(self)
    return GetItemLevel(self.handle)
end
function Item.prototype.____getters.name(self)
    return GetItemName(self.handle)
end
function Item.prototype.____setters.name(self, value)
    BlzSetItemName(self.handle, value)
end
function Item.prototype.____getters.pawnable(self)
    return IsItemPawnable(self.handle)
end
function Item.prototype.____setters.pawnable(self, flag)
    SetItemPawnable(self.handle, flag)
end
function Item.prototype.____getters.player(self)
    return GetItemPlayer(self.handle)
end
function Item.prototype.____getters.____type(self)
    return GetItemType(self.handle)
end
function Item.prototype.____getters.typeId(self)
    return GetItemTypeId(self.handle)
end
function Item.prototype.____getters.userData(self)
    return GetItemUserData(self.handle)
end
function Item.prototype.____setters.userData(self, value)
    SetItemUserData(self.handle, value)
end
function Item.prototype.____getters.visible(self)
    return IsItemVisible(self.handle)
end
function Item.prototype.____setters.visible(self, flag)
    SetItemVisible(self.handle, flag)
end
function Item.prototype.____getters.x(self)
    return GetItemX(self.handle)
end
function Item.prototype.____setters.x(self, value)
    SetItemPosition(self.handle, value, self.y)
end
function Item.prototype.____getters.y(self)
    return GetItemY(self.handle)
end
function Item.prototype.____setters.y(self, value)
    SetItemPosition(self.handle, self.x, value)
end
function Item.prototype.setDropOnDeath(self, flag)
    SetItemDropOnDeath(self.handle, flag)
end
function Item.prototype.setDroppable(self, flag)
    SetItemDroppable(self.handle, flag)
end
function Item.prototype.destroy(self)
    RemoveItem(self.handle)
end
function Item.prototype.isOwned(self)
    return IsItemOwned(self.handle)
end
function Item.prototype.isPawnable(self)
    return IsItemPawnable(self.handle)
end
function Item.prototype.isPowerup(self)
    return IsItemPowerup(self.handle)
end
function Item.prototype.isSellable(self)
    return IsItemSellable(self.handle)
end
function Item.prototype.setDropId(self, unitId)
    SetItemDropID(self.handle, unitId)
end
function Item.prototype.setOwner(self, whichPlayer, changeColor)
    SetItemPlayer(self.handle, whichPlayer.handle, changeColor)
end
function Item.prototype.setPosition(self, x, y)
    SetItemPosition(self.handle, x, y)
end
function Item.prototype.setPoint(self, whichPoint)
    SetItemPosition(self.handle, whichPoint.x, whichPoint.y)
end
function Item.fromHandle(self, handle)
    return self:getObject(handle)
end
function Item.isIdPawnable(self, itemId)
    return IsItemIdPawnable(itemId)
end
function Item.isIdPowerup(self, itemId)
    return IsItemIdPowerup(itemId)
end
function Item.isIdSellable(self, itemId)
    return IsItemIdSellable(itemId)
end
return ____exports
end,
["node_modules.w3ts.handles.unit"] = function() require("lualib_bundle");
local ____exports = {}
local ____destructable = require("node_modules.w3ts.handles.destructable")
local Destructable = ____destructable.Destructable
local ____handle = require("node_modules.w3ts.handles.handle")
local Handle = ____handle.Handle
local ____player = require("node_modules.w3ts.handles.player")
local MapPlayer = ____player.MapPlayer
local ____point = require("node_modules.w3ts.handles.point")
local Point = ____point.Point
local ____widget = require("node_modules.w3ts.handles.widget")
local Widget = ____widget.Widget
____exports.Unit = __TS__Class()
local Unit = ____exports.Unit
Unit.name = "Unit"
Unit.prototype.____getters = {}
Unit.prototype.__index = __TS__Index(Unit.prototype)
Unit.prototype.____setters = {}
Unit.prototype.__newindex = __TS__NewIndex(Unit.prototype)
Unit.____super = Widget
setmetatable(Unit, Unit.____super)
setmetatable(Unit.prototype, Unit.____super.prototype)
function Unit.prototype.____constructor(self, owner, unitId, x, y, face)
    Widget.prototype.____constructor(
        self,
        ((Handle:initFromHandle() and (function() return nil end)) or (function() return CreateUnit(
            (((type(owner) == "number") and (function() return Player(owner) end)) or (function() return owner.handle end))(),
            unitId,
            x,
            y,
            face
        ) end))()
    )
end
function Unit.prototype.____setters.acquireRange(self, value)
    SetUnitAcquireRange(self.handle, value)
end
function Unit.prototype.____getters.acquireRange(self)
    return GetUnitPropWindow(self.handle)
end
function Unit.prototype.____getters.agility(self)
    return GetHeroAgi(self.handle, false)
end
function Unit.prototype.____setters.agility(self, value)
    SetHeroAgi(self.handle, value, true)
end
function Unit.prototype.____getters.armor(self)
    return BlzGetUnitArmor(self.handle)
end
function Unit.prototype.____setters.armor(self, armorAmount)
    BlzSetUnitArmor(self.handle, armorAmount)
end
function Unit.prototype.____setters.canSleep(self, flag)
    UnitAddSleep(self.handle, flag)
end
function Unit.prototype.____getters.canSleep(self)
    return UnitCanSleep(self.handle)
end
function Unit.prototype.____getters.collisionSize(self)
    return BlzGetUnitCollisionSize(self.handle)
end
function Unit.prototype.____setters.color(self, whichColor)
    SetUnitColor(self.handle, whichColor)
end
function Unit.prototype.____getters.currentOrder(self)
    return GetUnitCurrentOrder(self.handle)
end
function Unit.prototype.____getters.defaultAcquireRange(self)
    return GetUnitDefaultAcquireRange(self.handle)
end
function Unit.prototype.____getters.defaultFlyHeight(self)
    return GetUnitDefaultFlyHeight(self.handle)
end
function Unit.prototype.____getters.defaultMoveSpeed(self)
    return GetUnitDefaultMoveSpeed(self.handle)
end
function Unit.prototype.____getters.defaultPropWindow(self)
    return GetUnitDefaultPropWindow(self.handle)
end
function Unit.prototype.____getters.defaultTurnSpeed(self)
    return GetUnitDefaultTurnSpeed(self.handle)
end
function Unit.prototype.____getters.experience(self)
    return GetHeroXP(self.handle)
end
function Unit.prototype.____setters.experience(self, newXpVal)
    SetHeroXP(self.handle, newXpVal, true)
end
function Unit.prototype.____setters.facing(self, value)
    SetUnitFacing(self.handle, value)
end
function Unit.prototype.____getters.facing(self)
    return GetUnitFacing(self.handle)
end
function Unit.prototype.____getters.foodMade(self)
    return GetUnitFoodMade(self.handle)
end
function Unit.prototype.____getters.foodUsed(self)
    return GetUnitFoodUsed(self.handle)
end
function Unit.prototype.____getters.ignoreAlarmToggled(self)
    return UnitIgnoreAlarmToggled(self.handle)
end
function Unit.prototype.____getters.intelligence(self)
    return GetHeroInt(self.handle, false)
end
function Unit.prototype.____setters.intelligence(self, value)
    SetHeroInt(self.handle, value, true)
end
function Unit.prototype.____getters.inventorySize(self)
    return UnitInventorySize(self.handle)
end
function Unit.prototype.____setters.invulnerable(self, flag)
    SetUnitInvulnerable(self.handle, flag)
end
function Unit.prototype.____getters.invulnerable(self)
    return BlzIsUnitInvulnerable(self.handle)
end
function Unit.prototype.____getters.level(self)
    return GetUnitLevel(self.handle)
end
function Unit.prototype.____getters.localZ(self)
    return BlzGetLocalUnitZ(self.handle)
end
function Unit.prototype.____getters.mana(self)
    return self:getState(UNIT_STATE_MANA)
end
function Unit.prototype.____setters.mana(self, value)
    self:setState(UNIT_STATE_MANA, value)
end
function Unit.prototype.____getters.maxLife(self)
    return BlzGetUnitMaxHP(self.handle)
end
function Unit.prototype.____setters.maxLife(self, value)
    BlzSetUnitMaxHP(self.handle, value)
end
function Unit.prototype.____getters.maxMana(self)
    return BlzGetUnitMaxMana(self.handle)
end
function Unit.prototype.____setters.maxMana(self, value)
    BlzSetUnitMaxMana(self.handle, value)
end
function Unit.prototype.____setters.moveSpeed(self, value)
    SetUnitMoveSpeed(self.handle, value)
end
function Unit.prototype.____getters.moveSpeed(self)
    return GetUnitMoveSpeed(self.handle)
end
function Unit.prototype.____getters.name(self)
    return GetUnitName(self.handle)
end
function Unit.prototype.____setters.name(self, value)
    BlzSetUnitName(self.handle, value)
end
function Unit.prototype.____setters.nameProper(self, value)
    BlzSetHeroProperName(self.handle, value)
end
function Unit.prototype.____getters.nameProper(self)
    return GetHeroProperName(self.handle)
end
function Unit.prototype.____setters.owner(self, whichPlayer)
    SetUnitOwner(self.handle, whichPlayer.handle, true)
end
function Unit.prototype.____getters.owner(self)
    return MapPlayer:fromHandle(
        GetOwningPlayer(self.handle)
    )
end
function Unit.prototype.____setters.paused(self, flag)
    PauseUnit(self.handle, flag)
end
function Unit.prototype.____getters.paused(self)
    return IsUnitPaused(self.handle)
end
function Unit.prototype.____getters.point(self)
    return Point:fromHandle(
        GetUnitLoc(self.handle)
    )
end
function Unit.prototype.____setters.point(self, whichPoint)
    SetUnitPositionLoc(self.handle, whichPoint.handle)
end
function Unit.prototype.____getters.pointValue(self)
    return GetUnitPointValue(self.handle)
end
function Unit.prototype.____setters.propWindow(self, value)
    SetUnitPropWindow(self.handle, value)
end
function Unit.prototype.____getters.propWindow(self)
    return GetUnitAcquireRange(self.handle)
end
function Unit.prototype.____getters.race(self)
    return GetUnitRace(self.handle)
end
function Unit.prototype.____getters.rallyDestructable(self)
    return Destructable:fromHandle(
        GetUnitRallyDestructable(self.handle)
    )
end
function Unit.prototype.____getters.rallyPoint(self)
    return Point:fromHandle(
        GetUnitRallyPoint(self.handle)
    )
end
function Unit.prototype.____getters.rallyUnit(self)
    return ____exports.Unit:fromHandle(
        GetUnitRallyUnit(self.handle)
    )
end
function Unit.prototype.____setters.resourceAmount(self, amount)
    SetResourceAmount(self.handle, amount)
end
function Unit.prototype.____getters.resourceAmount(self)
    return GetResourceAmount(self.handle)
end
function Unit.prototype.____getters.selectable(self)
    return BlzIsUnitSelectable(self.handle)
end
function Unit.prototype.____setters.selectionScale(self, scale)
    self:setField(UNIT_RF_SELECTION_SCALE, scale)
end
function Unit.prototype.____getters.selectionScale(self)
    local result = self:getField(UNIT_RF_SELECTION_SCALE)
    return (((type(result) == "number") and (function() return result end)) or (function() return 0 end))()
end
function Unit.prototype.____setters.show(self, flag)
    ShowUnit(self.handle, flag)
end
function Unit.prototype.____getters.show(self)
    return IsUnitHidden(self.handle)
end
function Unit.prototype.____getters.skillPoints(self)
    return GetHeroSkillPoints(self.handle)
end
function Unit.prototype.____setters.skillPoints(self, skillPointDelta)
    UnitModifySkillPoints(self.handle, skillPointDelta)
end
function Unit.prototype.____getters.sleeping(self)
    return UnitIsSleeping(self.handle)
end
function Unit.prototype.____getters.strength(self)
    return GetHeroStr(self.handle, false)
end
function Unit.prototype.____setters.strength(self, value)
    SetHeroStr(self.handle, value, true)
end
function Unit.prototype.____setters.turnSpeed(self, value)
    SetUnitTurnSpeed(self.handle, value)
end
function Unit.prototype.____getters.turnSpeed(self)
    return GetUnitTurnSpeed(self.handle)
end
function Unit.prototype.____getters.typeId(self)
    return GetUnitTypeId(self.handle)
end
function Unit.prototype.____getters.userData(self)
    return GetUnitUserData(self.handle)
end
function Unit.prototype.____setters.userData(self, value)
    SetUnitUserData(self.handle, value)
end
function Unit.prototype.____setters.waygateActive(self, flag)
    WaygateActivate(self.handle, flag)
end
function Unit.prototype.____getters.waygateActive(self)
    return WaygateIsActive(self.handle)
end
function Unit.prototype.____getters.x(self)
    return GetUnitX(self.handle)
end
function Unit.prototype.____setters.x(self, value)
    SetUnitX(self.handle, value)
end
function Unit.prototype.____getters.y(self)
    return GetUnitY(self.handle)
end
function Unit.prototype.____setters.y(self, value)
    SetUnitY(self.handle, value)
end
function Unit.prototype.____getters.z(self)
    return BlzGetUnitZ(self.handle)
end
function Unit.prototype.addAbility(self, abilityId)
    return UnitAddAbility(self.handle, abilityId)
end
function Unit.prototype.addAnimationProps(self, animProperties, add)
    AddUnitAnimationProperties(self.handle, animProperties, add)
end
function Unit.prototype.addExperience(self, xpToAdd, showEyeCandy)
    AddHeroXP(self.handle, xpToAdd, showEyeCandy)
end
function Unit.prototype.addIndicator(self, red, blue, green, alpha)
    UnitAddIndicator(self.handle, red, blue, green, alpha)
end
function Unit.prototype.addItem(self, whichItem)
    return UnitAddItem(self.handle, whichItem.handle)
end
function Unit.prototype.addItemById(self, itemId)
    return UnitAddItemById(self.handle, itemId)
end
function Unit.prototype.addItemToSlotById(self, itemId, itemSlot)
    return UnitAddItemToSlotById(self.handle, itemId, itemSlot)
end
function Unit.prototype.addItemToStock(self, itemId, currentStock, stockMax)
    AddItemToStock(self.handle, itemId, currentStock, stockMax)
end
function Unit.prototype.addResourceAmount(self, amount)
    AddResourceAmount(self.handle, amount)
end
function Unit.prototype.addSleepPerm(self, add)
    UnitAddSleepPerm(self.handle, add)
end
function Unit.prototype.addType(self, whichUnitType)
    return UnitAddType(self.handle, whichUnitType)
end
function Unit.prototype.addUnitToStock(self, unitId, currentStock, stockMax)
    AddUnitToStock(self.handle, unitId, currentStock, stockMax)
end
function Unit.prototype.applyTimedLife(self, buffId, duration)
    UnitApplyTimedLife(self.handle, buffId, duration)
end
function Unit.prototype.cancelTimedLife(self)
    BlzUnitCancelTimedLife(self.handle)
end
function Unit.prototype.canSleepPerm(self)
    return UnitCanSleepPerm(self.handle)
end
function Unit.prototype.countBuffs(self, removePositive, removeNegative, magic, physical, timedLife, aura, autoDispel)
    return UnitCountBuffsEx(self.handle, removePositive, removeNegative, magic, physical, timedLife, aura, autoDispel)
end
function Unit.prototype.damageAt(self, delay, radius, x, y, amount, attack, ranged, attackType, damageType, weaponType)
    return UnitDamagePoint(self.handle, delay, radius, x, y, amount, attack, ranged, attackType, damageType, weaponType)
end
function Unit.prototype.damageTarget(self, target, amount, radius, attack, ranged, attackType, damageType, weaponType)
    return UnitDamageTarget(self.handle, target, amount, attack, ranged, attackType, damageType, weaponType)
end
function Unit.prototype.decAbilityLevel(self, abilCode)
    return DecUnitAbilityLevel(self.handle, abilCode)
end
function Unit.prototype.destroy(self)
    RemoveUnit(self.handle)
end
function Unit.prototype.disableAbility(self, abilId, flag, hideUI)
    BlzUnitHideAbility(self.handle, abilId, flag)
end
function Unit.prototype.dropItem(self, whichItem, x, y)
    return UnitDropItemPoint(self.handle, whichItem.handle, x, y)
end
function Unit.prototype.dropItemFromSlot(self, whichItem, slot)
    return UnitDropItemSlot(self.handle, whichItem.handle, slot)
end
function Unit.prototype.dropItemTarget(self, whichItem, target)
    return UnitDropItemTarget(self.handle, whichItem.handle, target.handle)
end
function Unit.prototype.endAbilityCooldown(self, abilCode)
    BlzEndUnitAbilityCooldown(self.handle, abilCode)
end
function Unit.prototype.getAbility(self, abilId)
    return BlzGetUnitAbility(self.handle, abilId)
end
function Unit.prototype.getAbilityByIndex(self, index)
    return BlzGetUnitAbilityByIndex(self.handle, index)
end
function Unit.prototype.getAbilityCooldown(self, abilId, level)
    return BlzGetUnitAbilityCooldown(self.handle, abilId, level)
end
function Unit.prototype.getAbilityCooldownRemaining(self, abilId, level)
    return BlzGetUnitAbilityCooldownRemaining(self.handle, abilId)
end
function Unit.prototype.getAbilityLevel(self, abilCode)
    return GetUnitAbilityLevel(self.handle, abilCode)
end
function Unit.prototype.getAbilityManaCost(self, abilId, level)
    return BlzGetUnitAbilityManaCost(self.handle, abilId, level)
end
function Unit.prototype.getAgility(self, includeBonuses)
    return GetHeroAgi(self.handle, includeBonuses)
end
function Unit.prototype.getAttackCooldown(self, weaponIndex)
    return BlzGetUnitAttackCooldown(self.handle, weaponIndex)
end
function Unit.prototype.getBaseDamage(self, weaponIndex)
    return BlzGetUnitBaseDamage(self.handle, weaponIndex)
end
function Unit.prototype.getDiceNumber(self, weaponIndex)
    return BlzGetUnitDiceNumber(self.handle, weaponIndex)
end
function Unit.prototype.getDiceSides(self, weaponIndex)
    return BlzGetUnitDiceSides(self.handle, weaponIndex)
end
function Unit.prototype.getField(self, field)
    local fieldType = string.sub(
        tostring(field),
        1,
        0 + ((string.find(
            tostring(field),
            ":",
            nil,
            true
        ) or 0) - 1)
    )
    local ____switch119 = fieldType
    local fieldBool, fieldInt, fieldReal, fieldString
    if ____switch119 == "unitbooleanfield" then
        goto ____switch119_case_0
    elseif ____switch119 == "unitintegerfield" then
        goto ____switch119_case_1
    elseif ____switch119 == "unitrealfield" then
        goto ____switch119_case_2
    elseif ____switch119 == "unitstringfield" then
        goto ____switch119_case_3
    end
    goto ____switch119_case_default
    ::____switch119_case_0::
    do
        fieldBool = field
        return BlzGetUnitBooleanField(self.handle, fieldBool)
    end
    ::____switch119_case_1::
    do
        fieldInt = field
        return BlzGetUnitIntegerField(self.handle, fieldInt)
    end
    ::____switch119_case_2::
    do
        fieldReal = field
        return BlzGetUnitRealField(self.handle, fieldReal)
    end
    ::____switch119_case_3::
    do
        fieldString = field
        return BlzGetUnitStringField(self.handle, fieldString)
    end
    ::____switch119_case_default::
    do
        return 0
    end
    ::____switch119_end::
end
function Unit.prototype.getflyHeight(self)
    return GetUnitFlyHeight(self.handle)
end
function Unit.prototype.getHeroLevel(self)
    return GetHeroLevel(self.handle)
end
function Unit.prototype.getIgnoreAlarm(self, flag)
    return UnitIgnoreAlarm(self.handle, flag)
end
function Unit.prototype.getIntelligence(self, includeBonuses)
    return GetHeroInt(self.handle, includeBonuses)
end
function Unit.prototype.getItemInSlot(self, slot)
    return UnitItemInSlot(self.handle, slot)
end
function Unit.prototype.getState(self, whichUnitState)
    return GetUnitState(self.handle, whichUnitState)
end
function Unit.prototype.getStrength(self, includeBonuses)
    return GetHeroStr(self.handle, includeBonuses)
end
function Unit.prototype.hasBuffs(self, removePositive, removeNegative, magic, physical, timedLife, aura, autoDispel)
    return UnitHasBuffsEx(self.handle, removePositive, removeNegative, magic, physical, timedLife, aura, autoDispel)
end
function Unit.prototype.hasItem(self, whichItem)
    return UnitHasItem(self.handle, whichItem.handle)
end
function Unit.prototype.hideAbility(self, abilId, flag)
    BlzUnitHideAbility(self.handle, abilId, flag)
end
function Unit.prototype.incAbilityLevel(self, abilCode)
    return IncUnitAbilityLevel(self.handle, abilCode)
end
function Unit.prototype.inForce(self, whichForce)
    return IsUnitInForce(self.handle, whichForce.handle)
end
function Unit.prototype.inGroup(self, whichGroup)
    return IsUnitInGroup(self.handle, whichGroup.handle)
end
function Unit.prototype.inRange(self, otherUnit, x, y, distance)
    return IsUnitInRangeXY(self.handle, x, y, distance)
end
function Unit.prototype.inRangeOfPoint(self, whichPoint, distance)
    return IsUnitInRangeLoc(self.handle, whichPoint.handle, distance)
end
function Unit.prototype.inRangeOfUnit(self, otherUnit, distance)
    return IsUnitInRange(self.handle, otherUnit, distance)
end
function Unit.prototype.interruptAttack(self)
    BlzUnitInterruptAttack(self.handle)
end
function Unit.prototype.inTransport(self, whichTransport)
    return IsUnitInTransport(self.handle, whichTransport)
end
function Unit.prototype.isAlive(self)
    return UnitAlive(self.handle)
end
function Unit.prototype.isAlly(self, whichPlayer)
    return IsUnitAlly(self.handle, whichPlayer.handle)
end
function Unit.prototype.isEnemy(self, whichPlayer)
    return IsUnitEnemy(self.handle, whichPlayer.handle)
end
function Unit.prototype.isExperienceSuspended(self)
    return IsSuspendedXP(self.handle)
end
function Unit.prototype.isFogged(self, whichPlayer)
    return IsUnitFogged(self.handle, whichPlayer.handle)
end
function Unit.prototype.isHero(self)
    return IsHeroUnitId(self.typeId)
end
function Unit.prototype.isIllusion(self)
    return IsUnitIllusion(self.handle)
end
function Unit.prototype.isLoaded(self)
    return IsUnitLoaded(self.handle)
end
function Unit.prototype.isMasked(self, whichPlayer)
    return IsUnitMasked(self.handle, whichPlayer.handle)
end
function Unit.prototype.isSelected(self, whichPlayer)
    return IsUnitSelected(self.handle, whichPlayer.handle)
end
function Unit.prototype.issueBuildOrder(self, unit, x, y)
    return (((type(unit) == "string") and (function() return IssueBuildOrder(self.handle, unit, x, y) end)) or (function() return IssueBuildOrderById(self.handle, unit, x, y) end))()
end
function Unit.prototype.issueImmediateOrder(self, order)
    return (((type(order) == "string") and (function() return IssueImmediateOrder(self.handle, order) end)) or (function() return IssueImmediateOrderById(self.handle, order) end))()
end
function Unit.prototype.issueInstantOrderAt(self, order, x, y, instantTargetWidget)
    return (((type(order) == "string") and (function() return IssueInstantPointOrder(self.handle, order, x, y, instantTargetWidget.handle) end)) or (function() return IssueInstantPointOrderById(self.handle, order, x, y, instantTargetWidget.handle) end))()
end
function Unit.prototype.issueInstantTargetOrder(self, order, targetWidget, instantTargetWidget)
    return (((type(order) == "string") and (function() return IssueInstantTargetOrder(self.handle, order, targetWidget.handle, instantTargetWidget.handle) end)) or (function() return IssueInstantTargetOrderById(self.handle, order, targetWidget.handle, instantTargetWidget.handle) end))()
end
function Unit.prototype.issueOrderAt(self, order, x, y)
    return (((type(order) == "string") and (function() return IssuePointOrder(self.handle, order, x, y) end)) or (function() return IssuePointOrderById(self.handle, order, x, y) end))()
end
function Unit.prototype.issuePointOrder(self, order, whichPoint)
    return (((type(order) == "string") and (function() return IssuePointOrderLoc(self.handle, order, whichPoint.handle) end)) or (function() return IssuePointOrderByIdLoc(self.handle, order, whichPoint.handle) end))()
end
function Unit.prototype.issueTargetOrder(self, order, targetWidget)
    return (((type(order) == "string") and (function() return IssueTargetOrder(self.handle, order, targetWidget.handle) end)) or (function() return IssueTargetOrderById(self.handle, order, targetWidget.handle) end))()
end
function Unit.prototype.isUnit(self, whichSpecifiedUnit)
    return IsUnit(self.handle, whichSpecifiedUnit)
end
function Unit.prototype.isUnitType(self, whichUnitType)
    return IsUnitType(self.handle, whichUnitType)
end
function Unit.prototype.isVisible(self, whichPlayer)
    return IsUnitVisible(self.handle, whichPlayer.handle)
end
function Unit.prototype.kill(self)
    KillUnit(self.handle)
end
function Unit.prototype.lookAt(self, whichBone, lookAtTarget, offsetX, offsetY, offsetZ)
    SetUnitLookAt(self.handle, whichBone, lookAtTarget, offsetX, offsetY, offsetZ)
end
function Unit.prototype.makeAbilityPermanent(self, permanent, abilityId)
    UnitMakeAbilityPermanent(self.handle, permanent, abilityId)
end
function Unit.prototype.modifySkillPoints(self, skillPointDelta)
    return UnitModifySkillPoints(self.handle, skillPointDelta)
end
function Unit.prototype.pauseEx(self, flag)
    BlzPauseUnitEx(self.handle, flag)
end
function Unit.prototype.pauseTimedLife(self, flag)
    UnitPauseTimedLife(self.handle, flag)
end
function Unit.prototype.queueAnimation(self, whichAnimation)
    QueueUnitAnimation(self.handle, whichAnimation)
end
function Unit.prototype.recycleGuardPosition(self)
    RecycleGuardPosition(self.handle)
end
function Unit.prototype.removeAbility(self, abilityId)
    return UnitRemoveAbility(self.handle, abilityId)
end
function Unit.prototype.removeBuffs(self, removePositive, removeNegative)
    UnitRemoveBuffs(self.handle, removePositive, removeNegative)
end
function Unit.prototype.removeBuffsEx(self, removePositive, removeNegative, magic, physical, timedLife, aura, autoDispel)
    UnitRemoveBuffsEx(self.handle, removePositive, removeNegative, magic, physical, timedLife, aura, autoDispel)
end
function Unit.prototype.removeGuardPosition(self)
    RemoveGuardPosition(self.handle)
end
function Unit.prototype.removeItem(self, whichItem)
    UnitRemoveItem(self.handle, whichItem.handle)
end
function Unit.prototype.removeItemFromSlot(self, itemSlot)
    return UnitRemoveItemFromSlot(self.handle, itemSlot)
end
function Unit.prototype.removeItemFromStock(self, itemId)
    RemoveItemFromStock(self.handle, itemId)
end
function Unit.prototype.removeType(self, whichUnitType)
    return UnitAddType(self.handle, whichUnitType)
end
function Unit.prototype.removeUnitFromStock(self, itemId)
    RemoveUnitFromStock(self.handle, itemId)
end
function Unit.prototype.resetCooldown(self)
    UnitResetCooldown(self.handle)
end
function Unit.prototype.resetLookAt(self)
    ResetUnitLookAt(self.handle)
end
function Unit.prototype.revive(self, x, y, doEyecandy)
    return ReviveHero(self.handle, x, y, doEyecandy)
end
function Unit.prototype.reviveAtPoint(self, whichPoint, doEyecandy)
    return ReviveHeroLoc(self.handle, whichPoint.handle, doEyecandy)
end
function Unit.prototype.select(self, flag)
    SelectUnit(self.handle, flag)
end
function Unit.prototype.selectSkill(self, abilCode)
    SelectHeroSkill(self.handle, abilCode)
end
function Unit.prototype.setAbilityCooldown(self, abilId, level, cooldown)
    BlzSetUnitAbilityCooldown(self.handle, abilId, level, cooldown)
end
function Unit.prototype.setAbilityLevel(self, abilCode, level)
    return SetUnitAbilityLevel(self.handle, abilCode, level)
end
function Unit.prototype.setAbilityManaCost(self, abilId, level, manaCost)
    BlzSetUnitAbilityManaCost(self.handle, abilId, level, manaCost)
end
function Unit.prototype.setAgility(self, value, permanent)
    SetHeroAgi(self.handle, value, permanent)
end
function Unit.prototype.setAnimation(self, whichAnimation)
    if type(whichAnimation) == "string" then
        SetUnitAnimation(self.handle, whichAnimation)
    else
        SetUnitAnimationByIndex(self.handle, whichAnimation)
    end
end
function Unit.prototype.setAnimationWithRarity(self, whichAnimation, rarity)
    SetUnitAnimationWithRarity(self.handle, whichAnimation, rarity)
end
function Unit.prototype.setAttackCooldown(self, cooldown, weaponIndex)
    BlzSetUnitAttackCooldown(self.handle, cooldown, weaponIndex)
end
function Unit.prototype.setBaseDamage(self, baseDamage, weaponIndex)
    BlzSetUnitBaseDamage(self.handle, baseDamage, weaponIndex)
end
function Unit.prototype.setBlendTime(self, timeScale)
    SetUnitBlendTime(self.handle, timeScale)
end
function Unit.prototype.setConstructionProgress(self, constructionPercentage)
    UnitSetConstructionProgress(self.handle, constructionPercentage)
end
function Unit.prototype.setCreepGuard(self, creepGuard)
    SetUnitCreepGuard(self.handle, creepGuard)
end
function Unit.prototype.setDiceNumber(self, diceNumber, weaponIndex)
    BlzSetUnitDiceNumber(self.handle, diceNumber, weaponIndex)
end
function Unit.prototype.setDiceSides(self, diceSides, weaponIndex)
    BlzSetUnitDiceSides(self.handle, diceSides, weaponIndex)
end
function Unit.prototype.setExperience(self, newXpVal, showEyeCandy)
    SetHeroXP(self.handle, newXpVal, showEyeCandy)
end
function Unit.prototype.setExploded(self, exploded)
    SetUnitExploded(self.handle, exploded)
end
function Unit.prototype.setField(self, field, value)
    local fieldType = string.sub(
        tostring(field),
        1,
        0 + ((string.find(
            tostring(field),
            ":",
            nil,
            true
        ) or 0) - 1)
    )
    if (fieldType == "unitbooleanfield") and (type(value) == "boolean") then
        local fieldBool = field
        return BlzSetUnitBooleanField(self.handle, fieldBool, value)
    elseif (fieldType == "unitintegerfield") and (type(value) == "number") then
        local fieldInt = field
        return BlzSetUnitIntegerField(self.handle, fieldInt, value)
    elseif (fieldType == "unitrealfield") and (type(value) == "number") then
        local fieldReal = field
        return BlzSetUnitRealField(self.handle, fieldReal, value)
    elseif (fieldType == "unitstringfield") and (type(value) == "string") then
        local fieldStr = field
        return BlzSetUnitStringField(self.handle, fieldStr, value)
    end
    return false
end
function Unit.prototype.setflyHeight(self, value, rate)
    SetUnitFlyHeight(self.handle, value, rate)
end
function Unit.prototype.setHeroLevel(self, level, showEyeCandy)
    SetHeroLevel(self.handle, level, showEyeCandy)
end
function Unit.prototype.setIntelligence(self, value, permanent)
    SetHeroInt(self.handle, value, permanent)
end
function Unit.prototype.setItemTypeSlots(self, slots)
    SetItemTypeSlots(self.handle, slots)
end
function Unit.prototype.setOwner(self, whichPlayer, changeColor)
    SetUnitOwner(self.handle, whichPlayer.handle, changeColor)
end
function Unit.prototype.setPathing(self, flag)
    SetUnitPathing(self.handle, flag)
end
function Unit.prototype.setPosition(self, x, y)
    SetUnitPosition(self.handle, x, y)
end
function Unit.prototype.setRescuable(self, byWhichPlayer, flag)
    SetUnitRescuable(self.handle, byWhichPlayer.handle, flag)
end
function Unit.prototype.setRescueRange(self, range)
    SetUnitRescueRange(self.handle, range)
end
function Unit.prototype.setScale(self, scaleX, scaleY, scaleZ)
    SetUnitScale(self.handle, scaleX, scaleY, scaleZ)
end
function Unit.prototype.setState(self, whichUnitState, newVal)
    SetUnitState(self.handle, whichUnitState, newVal)
end
function Unit.prototype.setStrength(self, value, permanent)
    SetHeroStr(self.handle, value, permanent)
end
function Unit.prototype.setTimeScale(self, timeScale)
    SetUnitTimeScale(self.handle, timeScale)
end
function Unit.prototype.setUnitAttackCooldown(self, cooldown, weaponIndex)
    BlzSetUnitAttackCooldown(self.handle, cooldown, weaponIndex)
end
function Unit.prototype.setUnitTypeSlots(self, slots)
    SetUnitTypeSlots(self.handle, slots)
end
function Unit.prototype.setUpgradeProgress(self, upgradePercentage)
    UnitSetUpgradeProgress(self.handle, upgradePercentage)
end
function Unit.prototype.setUseAltIcon(self, flag)
    UnitSetUsesAltIcon(self.handle, flag)
end
function Unit.prototype.setUseFood(self, useFood)
    SetUnitUseFood(self.handle, useFood)
end
function Unit.prototype.setVertexColor(self, red, green, blue, alpha)
    SetUnitVertexColor(self.handle, red, green, blue, alpha)
end
function Unit.prototype.shareVision(self, whichPlayer, share)
    UnitShareVision(self.handle, whichPlayer.handle, share)
end
function Unit.prototype.stripLevels(self, howManyLevels)
    return UnitStripHeroLevel(self.handle, howManyLevels)
end
function Unit.prototype.suspendDecay(self, suspend)
    UnitSuspendDecay(self.handle, suspend)
end
function Unit.prototype.suspendExperience(self, flag)
    SuspendHeroXP(self.handle, flag)
end
function Unit.prototype.useItem(self, whichItem)
    return UnitUseItem(self.handle, whichItem.handle)
end
function Unit.prototype.useItemAt(self, whichItem, x, y)
    return UnitUseItemPoint(self.handle, whichItem.handle, x, y)
end
function Unit.prototype.useItemTarget(self, whichItem, target)
    return UnitUseItemTarget(self.handle, whichItem.handle, target.handle)
end
function Unit.prototype.wakeUp(self)
    UnitWakeUp(self.handle)
end
function Unit.prototype.waygateGetDestinationX(self)
    return WaygateGetDestinationX(self.handle)
end
function Unit.prototype.waygateGetDestinationY(self)
    return WaygateGetDestinationY(self.handle)
end
function Unit.prototype.waygateSetDestination(self, x, y)
    WaygateSetDestination(self.handle, x, y)
end
function Unit.foodMadeByType(self, unitId)
    return GetFoodMade(unitId)
end
function Unit.foodUsedByType(self, unitId)
    return GetFoodUsed(unitId)
end
function Unit.fromHandle(self, handle)
    return self:getObject(handle)
end
function Unit.getPointValueByType(self, unitType)
    return GetUnitPointValueByType(unitType)
end
function Unit.isUnitIdHero(self, unitId)
    return IsHeroUnitId(unitId)
end
function Unit.isUnitIdType(self, unitId, whichUnitType)
    return IsUnitIdType(unitId, whichUnitType)
end
return ____exports
end,
["src.lib.translators"] = function() require("lualib_bundle");
local ____exports = {}
function ____exports.SendMessage(msg)
    DisplayTimedTextToForce(
        bj_FORCE_ALL_PLAYERS,
        10,
        tostring(msg)
    )
end
____exports.console = __TS__Class()
local console = ____exports.console
console.name = "console"
function console.prototype.____constructor(self)
end
function console.log(self, input)
    ____exports.SendMessage(input)
end
function ____exports.getYawPitchRollFromVector(vector)
    return {
        yaw = Atan2(vector.y, vector.x),
        pitch = Asin(vector.z),
        roll = 0
    }
end
function ____exports.staticDecorator()
    return function(constructor)
    end
end
function ____exports.SendMessageUnlogged(msg)
    DisplayTimedTextToForce(
        bj_FORCE_ALL_PLAYERS,
        10,
        tostring(msg)
    )
end
function ____exports.PlayNewSoundOnUnit(soundPath, unit, volume)
    local result = CreateSound(soundPath, false, true, true, 10, 10, "")
    SetSoundDuration(
        result,
        GetSoundFileDuration(soundPath)
    )
    SetSoundChannel(result, 0)
    SetSoundVolume(result, volume)
    SetSoundPitch(result, 1)
    SetSoundDistances(result, 2000, 10000)
    SetSoundDistanceCutoff(result, 4500)
    AttachSoundToUnit(result, unit.handle)
    StartSound(result)
    KillSoundWhenDone(result)
    return result
end
function ____exports.ToString(input)
    return tostring(input)
end
function ____exports.DecodeFourCC(fourcc)
    return string.char((fourcc >> 24) & 255, (fourcc >> 16) & 255, (fourcc >> 8) & 255, fourcc & 255)
end
____exports.Util = __TS__Class()
local Util = ____exports.Util
Util.name = "Util"
function Util.prototype.____constructor(self)
end
function Util.isUnitCreep(self, u)
    local ownerID = GetPlayerId(
        GetOwningPlayer(u)
    )
    local ____switch14 = ownerID
    if ____switch14 == ____exports.COLOUR.NAVY then
        goto ____switch14_case_0
    elseif ____switch14 == ____exports.COLOUR.TURQUOISE then
        goto ____switch14_case_1
    elseif ____switch14 == ____exports.COLOUR.VOILET then
        goto ____switch14_case_2
    elseif ____switch14 == ____exports.COLOUR.WHEAT then
        goto ____switch14_case_3
    end
    goto ____switch14_case_default
    ::____switch14_case_0::
    ::____switch14_case_1::
    ::____switch14_case_2::
    ::____switch14_case_3::
    do
        return true
    end
    ::____switch14_case_default::
    do
        return false
    end
    ::____switch14_end::
end
function Util.ColourString(self, colour, str)
    return (("|cFF" .. tostring(colour)) .. tostring(str)) .. "|r"
end
function Util.RandomInt(self, min, max)
    return math.floor(
        math.random() * ((max - min) + 1)
    ) + min
end
function Util.ShuffleArray(self, arr)
    do
        local i = #arr - 1
        while i > 0 do
            local j = math.floor(
                math.random() * (i + 1)
            )
            local temp = arr[i + 1]
            arr[i + 1] = arr[j + 1]
            arr[j + 1] = temp
            i = i - 1
        end
    end
end
function Util.RandomHash(self, length)
    local result = ""
    local characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    local charactersLength = #characters
    do
        local i = 0
        while i < length do
            result = tostring(result) .. tostring(
                string.sub(
                    characters,
                    math.floor(
                        math.random() * charactersLength
                    ) + 1,
                    math.floor(
                        math.random() * charactersLength
                    ) + 1
                )
            )
            i = i + 1
        end
    end
    return result
end
function Util.GetRandomKey(self, collection)
    local index = math.floor(
        math.random() * collection.size
    )
    local cntr = 0
    for key in __TS__Iterator(
        collection:keys()
    ) do
        if (function()
            local ____tmp = cntr
            cntr = ____tmp + 1
            return ____tmp
        end)() == index then
            return key
        end
    end
end
function Util.GetAllKeys(self, collection)
    local keys = {}
    for key in __TS__Iterator(
        collection:keys()
    ) do
        __TS__ArrayPush(keys, key)
    end
    return keys
end
function Util.ArraysToString(self, arr)
    local output = "["
    do
        local i = 0
        while i < #arr do
            do
                if i == (#arr - 1) then
                    output = tostring(output) .. (("\"" .. tostring(arr[i + 1])) .. "\"")
                    goto __continue27
                end
                output = tostring(output) .. (("\"" .. tostring(arr[i + 1])) .. "\", ")
            end
            ::__continue27::
            i = i + 1
        end
    end
    output = tostring(output) .. "]"
    return output
end
function Util.ParseInt(self, str)
    return str
end
function Util.ParsePositiveInt(self, str)
    local int = __TS__Number(str)
    if int < 0 then
        return 0
    end
    return int
end
function Util.Round(self, x)
    return math.floor((x + 0.5) - ((x + 0.5) % 1))
end
Util.COLOUR_IDS = {RED = 0, BLUE = 1, TEAL = 2, PURPLE = 3, YELLOW = 4, ORANGE = 5, GREEN = 6, PINK = 7, GRAY = 8, GREY = 8, LIGHT_BLUE = 9, LIGHTBLUE = 9, LB = 9, DARK_GREEN = 10, DARKGREEN = 10, DG = 10, BROWN = 11, MAROON = 12, NAVY = 13, TURQUOISE = 14, VOILET = 15, WHEAT = 16, PEACH = 17, MINT = 18, LAVENDER = 19, COAL = 20, SNOW = 21, EMERALD = 22, PEANUT = 23}
____exports.COLOUR = {}
____exports.COLOUR.RED = 0
____exports.COLOUR[____exports.COLOUR.RED] = "RED"
____exports.COLOUR.BLUE = 1
____exports.COLOUR[____exports.COLOUR.BLUE] = "BLUE"
____exports.COLOUR.TEAL = 2
____exports.COLOUR[____exports.COLOUR.TEAL] = "TEAL"
____exports.COLOUR.PURPLE = 3
____exports.COLOUR[____exports.COLOUR.PURPLE] = "PURPLE"
____exports.COLOUR.YELLOW = 4
____exports.COLOUR[____exports.COLOUR.YELLOW] = "YELLOW"
____exports.COLOUR.ORANGE = 5
____exports.COLOUR[____exports.COLOUR.ORANGE] = "ORANGE"
____exports.COLOUR.GREEN = 6
____exports.COLOUR[____exports.COLOUR.GREEN] = "GREEN"
____exports.COLOUR.PINK = 7
____exports.COLOUR[____exports.COLOUR.PINK] = "PINK"
____exports.COLOUR.GRAY = 8
____exports.COLOUR[____exports.COLOUR.GRAY] = "GRAY"
____exports.COLOUR.LIGHT_BLUE = 9
____exports.COLOUR[____exports.COLOUR.LIGHT_BLUE] = "LIGHT_BLUE"
____exports.COLOUR.DARK_GREEN = 10
____exports.COLOUR[____exports.COLOUR.DARK_GREEN] = "DARK_GREEN"
____exports.COLOUR.BROWN = 11
____exports.COLOUR[____exports.COLOUR.BROWN] = "BROWN"
____exports.COLOUR.MAROON = 12
____exports.COLOUR[____exports.COLOUR.MAROON] = "MAROON"
____exports.COLOUR.NAVY = 13
____exports.COLOUR[____exports.COLOUR.NAVY] = "NAVY"
____exports.COLOUR.TURQUOISE = 14
____exports.COLOUR[____exports.COLOUR.TURQUOISE] = "TURQUOISE"
____exports.COLOUR.VOILET = 15
____exports.COLOUR[____exports.COLOUR.VOILET] = "VOILET"
____exports.COLOUR.WHEAT = 16
____exports.COLOUR[____exports.COLOUR.WHEAT] = "WHEAT"
____exports.COLOUR.PEACH = 17
____exports.COLOUR[____exports.COLOUR.PEACH] = "PEACH"
____exports.COLOUR.MINT = 18
____exports.COLOUR[____exports.COLOUR.MINT] = "MINT"
____exports.COLOUR.LAVENDER = 19
____exports.COLOUR[____exports.COLOUR.LAVENDER] = "LAVENDER"
____exports.COLOUR.COAL = 20
____exports.COLOUR[____exports.COLOUR.COAL] = "COAL"
____exports.COLOUR.SNOW = 21
____exports.COLOUR[____exports.COLOUR.SNOW] = "SNOW"
____exports.COLOUR.EMERALD = 22
____exports.COLOUR[____exports.COLOUR.EMERALD] = "EMERALD"
____exports.COLOUR.PEANUT = 23
____exports.COLOUR[____exports.COLOUR.PEANUT] = "PEANUT"
____exports.PLAYER_COLOR = {"ff0303", "0042ff", "1ce6b9", "540081", "fffc00", "fe8a0e", "20c000", "e55bb0", "959697", "7ebff1", "106246", "4a2a04", "9b0000", "0000c3", "00eaff", "be00fe", "ebcd87", "f8a48b", "bfff80", "dcb9eb", "282828", "ebf0ff", "00781e", "a46f33"}
____exports.CREEP_TYPE = {}
____exports.CREEP_TYPE.NORMAL = 0
____exports.CREEP_TYPE[____exports.CREEP_TYPE.NORMAL] = "NORMAL"
____exports.CREEP_TYPE.AIR = 1
____exports.CREEP_TYPE[____exports.CREEP_TYPE.AIR] = "AIR"
____exports.CREEP_TYPE.CHAMPION = 2
____exports.CREEP_TYPE[____exports.CREEP_TYPE.CHAMPION] = "CHAMPION"
____exports.CREEP_TYPE.BOSS = 3
____exports.CREEP_TYPE[____exports.CREEP_TYPE.BOSS] = "BOSS"
____exports.ARMOUR_TYPE = {}
____exports.ARMOUR_TYPE.UNARMOURED = 0
____exports.ARMOUR_TYPE[____exports.ARMOUR_TYPE.UNARMOURED] = "UNARMOURED"
____exports.ARMOUR_TYPE.LIGHT = 1
____exports.ARMOUR_TYPE[____exports.ARMOUR_TYPE.LIGHT] = "LIGHT"
____exports.ARMOUR_TYPE.MEDIUM = 2
____exports.ARMOUR_TYPE[____exports.ARMOUR_TYPE.MEDIUM] = "MEDIUM"
____exports.ARMOUR_TYPE.HEAVY = 3
____exports.ARMOUR_TYPE[____exports.ARMOUR_TYPE.HEAVY] = "HEAVY"
____exports.ARMOUR_TYPE.FORTIFIED = 4
____exports.ARMOUR_TYPE[____exports.ARMOUR_TYPE.FORTIFIED] = "FORTIFIED"
____exports.ARMOUR_TYPE.HERO = 5
____exports.ARMOUR_TYPE[____exports.ARMOUR_TYPE.HERO] = "HERO"
return ____exports
end,
["src.app.weapons.projectile.projectile-sfx"] = function() require("lualib_bundle");
local ____exports = {}
local ____translators = require("src.lib.translators")
local getYawPitchRollFromVector = ____translators.getYawPitchRollFromVector
____exports.ProjectileSFX = __TS__Class()
local ProjectileSFX = ____exports.ProjectileSFX
ProjectileSFX.name = "ProjectileSFX"
function ProjectileSFX.prototype.____constructor(self, sfx, startingLoc, offset, facing)
    self.offset = offset
    local facingData = getYawPitchRollFromVector(facing)
    self.yaw = facingData.yaw
    self.pitch = facingData.pitch
    self.roll = facingData.roll
    self.sfx = AddSpecialEffect(sfx, startingLoc.x, startingLoc.y)
    BlzSetSpecialEffectZ(self.sfx, startingLoc.z)
    BlzSetSpecialEffectRoll(self.sfx, self.pitch)
    BlzSetSpecialEffectYaw(self.sfx, self.yaw)
end
function ProjectileSFX.prototype.updatePosition(self, currentPosition)
    BlzSetSpecialEffectPosition(self.sfx, currentPosition.x + self.offset.x, currentPosition.y + self.offset.y, currentPosition.z + self.offset.z)
end
function ProjectileSFX.prototype.setScale(self, scale)
    BlzSetSpecialEffectScale(self.sfx, scale)
end
function ProjectileSFX.prototype.destroy(self)
    DestroyEffect(self.sfx)
end
function ProjectileSFX.prototype.getEffect(self)
    return self.sfx
end
return ____exports
end,
["src.app.weapons.projectile.projectile"] = function() require("lualib_bundle");
local ____exports = {}
local ____projectile_2Dtarget = require("src.app.weapons.projectile.projectile-target")
local ProjectileMoverLinear = ____projectile_2Dtarget.ProjectileMoverLinear
local ____projectile_2Dsfx = require("src.app.weapons.projectile.projectile-sfx")
local ProjectileSFX = ____projectile_2Dsfx.ProjectileSFX
local AIRBORN_ABILITY_DUMMY = FourCC("A00C")
local DEFAULT_FILTER
DEFAULT_FILTER = function(projectile)
    return Filter(
        function()
            local unit = GetFilterUnit()
            return (((GetWidgetLife(unit) > 0.405) and (not IsUnitAlly(
                unit,
                GetOwningPlayer(projectile.source)
            ))) and (IsUnitType(unit, UNIT_TYPE_MAGIC_IMMUNE) == false)) and (GetUnitAbilityLevel(unit, AIRBORN_ABILITY_DUMMY) == 0)
        end
    )
end
____exports.Projectile = __TS__Class()
local Projectile = ____exports.Projectile
Projectile.name = "Projectile"
function Projectile.prototype.____constructor(self, source, startPosition, target, projectileMover)
    self.id = 0
    self.collisionRadius = 30
    self.velocity = 10
    self.doDestroy = false
    self.position = startPosition
    self.target = target
    self.sfx = {}
    self.mover = projectileMover or __TS__New(ProjectileMoverLinear)
    self.source = source
    self.filter = DEFAULT_FILTER(self)
end
function Projectile.prototype.setId(self, to)
    self.id = to
end
function Projectile.prototype.getId(self)
    return self.id
end
function Projectile.prototype.addEffect(self, sfx, offset, facing, scale)
    local _sfx = __TS__New(ProjectileSFX, sfx, self.position, offset, facing)
    _sfx:setScale(scale)
    __TS__ArrayPush(self.sfx, _sfx)
    return _sfx:getEffect()
end
function Projectile.prototype.doesCollide(self)
    return true
end
function Projectile.prototype.getPosition(self)
    return self.position
end
function Projectile.prototype.getCollisionRadius(self)
    return self.collisionRadius
end
function Projectile.prototype.setCollisionRadius(self, radius)
    self.collisionRadius = radius
    return self
end
function Projectile.prototype.willDestroy(self)
    return self.doDestroy
end
function Projectile.prototype.setDestroy(self, val)
    self.doDestroy = val
    return self
end
function Projectile.prototype.overrideFilter(self, newFunc)
    self.filter = Filter(newFunc)
    return self
end
function Projectile.prototype.onCollide(self, callback)
    self.onCollideCallback = callback
    return self
end
function Projectile.prototype.onDeath(self, callback)
    self.onDeathCallback = callback
    return self
end
function Projectile.prototype.collide(self, weaponModule, withUnit)
    if self.onCollideCallback then
        self.onCollideCallback(weaponModule, self, withUnit)
    end
end
function Projectile.prototype.getTarget(self)
    return self.target
end
function Projectile.prototype.update(self, weaponModule, deltaTime)
    local velocityToApply = self.mover:move(
        self.position,
        self:getTarget():getTargetVector(),
        self.velocity,
        deltaTime
    )
    local newPosition = self.position:add(velocityToApply)
    self.position = newPosition
    __TS__ArrayForEach(
        self.sfx,
        function(____, sfx) return sfx:updatePosition(self.position) end
    )
    if self:reachedEnd(weaponModule, velocityToApply) then
        self.doDestroy = true
    end
    return velocityToApply
end
function Projectile.prototype.setVelocity(self, velocity)
    self.velocity = velocity
    return self
end
function Projectile.prototype.reachedEnd(self, weaponModule, targetVector)
    MoveLocation(weaponModule.game.TEMP_LOCATION, self.position.x, self.position.y)
    local z = GetLocationZ(weaponModule.game.TEMP_LOCATION)
    return self.position.z <= z
end
function Projectile.prototype.destroy(self, weaponModule)
    local ____ = self.onDeathCallback and self:onDeathCallback(weaponModule, self)
    __TS__ArrayForEach(
        self.sfx,
        function(____, sfx) return sfx:destroy() end
    )
    self.sfx = {}
    return true
end
return ____exports
end,
["node_modules.w3ts.handles.dialog"] = function() require("lualib_bundle");
local ____exports = {}
local ____handle = require("node_modules.w3ts.handles.handle")
local Handle = ____handle.Handle
____exports.DialogButton = __TS__Class()
local DialogButton = ____exports.DialogButton
DialogButton.name = "DialogButton"
DialogButton.prototype.__index = __TS__Index(DialogButton.prototype)
DialogButton.____super = Handle
setmetatable(DialogButton, DialogButton.____super)
setmetatable(DialogButton.prototype, DialogButton.____super.prototype)
function DialogButton.prototype.____constructor(self, whichDialog, text, hotkey, quit, score)
    if hotkey == nil then
        hotkey = 0
    end
    if quit == nil then
        quit = false
    end
    if score == nil then
        score = false
    end
    if Handle:initFromHandle() then
        Handle.prototype.____constructor(self)
    elseif not quit then
        Handle.prototype.____constructor(
            self,
            DialogAddButton(whichDialog.handle, text, hotkey)
        )
    else
        Handle.prototype.____constructor(
            self,
            DialogAddQuitButton(whichDialog.handle, score, text, hotkey)
        )
    end
end
function DialogButton.fromHandle(self, handle)
    return self:getObject(handle)
end
____exports.Dialog = __TS__Class()
local Dialog = ____exports.Dialog
Dialog.name = "Dialog"
Dialog.prototype.__index = __TS__Index(Dialog.prototype)
Dialog.____super = Handle
setmetatable(Dialog, Dialog.____super)
setmetatable(Dialog.prototype, Dialog.____super.prototype)
function Dialog.prototype.____constructor(self)
    Handle.prototype.____constructor(
        self,
        ((Handle:initFromHandle() and (function() return nil end)) or (function() return DialogCreate() end))()
    )
end
function Dialog.prototype.setMessage(self, whichMessage)
    DialogSetMessage(self.handle, whichMessage)
end
function Dialog.prototype.addButton(self, text, hotkey, quit, score)
    if hotkey == nil then
        hotkey = 0
    end
    if quit == nil then
        quit = false
    end
    if score == nil then
        score = false
    end
    return __TS__New(____exports.DialogButton, self, text, hotkey, quit, score)
end
function Dialog.prototype.clear(self)
    DialogClear(self.handle)
end
function Dialog.prototype.destroy(self)
    DialogDestroy(self.handle)
end
function Dialog.prototype.display(self, whichPlayer, flag)
    DialogDisplay(whichPlayer.handle, self.handle, flag)
end
function Dialog.fromHandle(self, handle)
    return self:getObject(handle)
end
return ____exports
end,
["node_modules.w3ts.handles.effect"] = function() require("lualib_bundle");
local ____exports = {}
local ____handle = require("node_modules.w3ts.handles.handle")
local Handle = ____handle.Handle
____exports.Effect = __TS__Class()
local Effect = ____exports.Effect
Effect.name = "Effect"
Effect.prototype.____getters = {}
Effect.prototype.__index = __TS__Index(Effect.prototype)
Effect.prototype.____setters = {}
Effect.prototype.__newindex = __TS__NewIndex(Effect.prototype)
Effect.____super = Handle
setmetatable(Effect, Effect.____super)
setmetatable(Effect.prototype, Effect.____super.prototype)
function Effect.prototype.____constructor(self, modelName, a, b)
    if Handle:initFromHandle() then
        Handle.prototype.____constructor(self)
    elseif (type(a) == "number") and (type(b) == "number") then
        Handle.prototype.____constructor(
            self,
            AddSpecialEffect(modelName, a, b)
        )
    elseif (type(a) ~= "number") and (type(b) == "string") then
        Handle.prototype.____constructor(
            self,
            AddSpecialEffectTarget(modelName, a.handle, b)
        )
    end
end
function Effect.prototype.____getters.scale(self)
    return BlzGetSpecialEffectScale(self.handle)
end
function Effect.prototype.____setters.scale(self, scale)
    BlzSetSpecialEffectScale(self.handle, scale)
end
function Effect.prototype.____getters.x(self)
    return BlzGetLocalSpecialEffectX(self.handle)
end
function Effect.prototype.____setters.x(self, x)
    BlzSetSpecialEffectX(self.handle, x)
end
function Effect.prototype.____getters.y(self)
    return BlzGetLocalSpecialEffectY(self.handle)
end
function Effect.prototype.____setters.y(self, y)
    BlzSetSpecialEffectY(self.handle, y)
end
function Effect.prototype.____getters.z(self)
    return BlzGetLocalSpecialEffectZ(self.handle)
end
function Effect.prototype.____setters.z(self, z)
    BlzSetSpecialEffectZ(self.handle, z)
end
function Effect.prototype.setAlpha(self, alpha)
    BlzSetSpecialEffectAlpha(self.handle, alpha)
end
function Effect.prototype.setHeight(self, height)
    BlzSetSpecialEffectHeight(self.handle, height)
end
function Effect.prototype.setPitch(self, pitch)
    BlzSetSpecialEffectPitch(self.handle, pitch)
end
function Effect.prototype.setRoll(self, roll)
    BlzSetSpecialEffectRoll(self.handle, roll)
end
function Effect.prototype.setTime(self, value)
    BlzSetSpecialEffectTime(self.handle, value)
end
function Effect.prototype.setTimeScale(self, timeScale)
    BlzSetSpecialEffectTimeScale(self.handle, timeScale)
end
function Effect.prototype.setYaw(self, y)
    BlzSetSpecialEffectYaw(self.handle, y)
end
function Effect.prototype.addSubAnimation(self, subAnim)
    BlzSpecialEffectAddSubAnimation(self.handle, subAnim)
end
function Effect.prototype.clearSubAnimations(self)
    BlzSpecialEffectClearSubAnimations(self.handle)
end
function Effect.prototype.destroy(self)
    DestroyEffect(self.handle)
end
function Effect.prototype.playAnimation(self, animType)
    BlzPlaySpecialEffect(self.handle, animType)
end
function Effect.prototype.playWithTimeScale(self, animType, timeScale)
    BlzPlaySpecialEffectWithTimeScale(self.handle, animType, timeScale)
end
function Effect.prototype.removeSubAnimation(self, subAnim)
    BlzSpecialEffectRemoveSubAnimation(self.handle, subAnim)
end
function Effect.prototype.resetScaleMatrix(self)
    BlzResetSpecialEffectMatrix(self.handle)
end
function Effect.prototype.setColor(self, red, green, blue)
    BlzSetSpecialEffectColor(self.handle, red, green, blue)
end
function Effect.prototype.setColorByPlayer(self, whichPlayer)
    BlzSetSpecialEffectColorByPlayer(self.handle, whichPlayer.handle)
end
function Effect.prototype.setOrientation(self, yaw, pitch, roll)
    BlzSetSpecialEffectOrientation(self.handle, yaw, pitch, roll)
end
function Effect.prototype.setPosition(self, x, y, z)
    BlzSetSpecialEffectPosition(self.handle, x, y, z)
end
function Effect.prototype.setPoint(self, p)
    BlzSetSpecialEffectPositionLoc(self.handle, p.handle)
end
function Effect.prototype.setScaleMatrix(self, x, y, z)
    BlzSetSpecialEffectMatrixScale(self.handle, x, y, z)
end
function Effect.fromHandle(self, handle)
    return self:getObject(handle)
end
return ____exports
end,
["node_modules.w3ts.handles.fogmodifier"] = function() require("lualib_bundle");
local ____exports = {}
local ____handle = require("node_modules.w3ts.handles.handle")
local Handle = ____handle.Handle
____exports.FogModifier = __TS__Class()
local FogModifier = ____exports.FogModifier
FogModifier.name = "FogModifier"
FogModifier.prototype.__index = __TS__Index(FogModifier.prototype)
FogModifier.____super = Handle
setmetatable(FogModifier, FogModifier.____super)
setmetatable(FogModifier.prototype, FogModifier.____super.prototype)
function FogModifier.prototype.____constructor(self, forWhichPlayer, whichState, centerX, centerY, radius, useSharedVision, afterUnits)
    Handle.prototype.____constructor(
        self,
        ((Handle:initFromHandle() and (function() return nil end)) or (function() return CreateFogModifierRadius(forWhichPlayer.handle, whichState, centerX, centerY, radius, useSharedVision, afterUnits) end))()
    )
end
function FogModifier.prototype.destroy(self)
    DestroyFogModifier(self.handle)
end
function FogModifier.prototype.start(self)
    FogModifierStart(self.handle)
end
function FogModifier.prototype.stop(self)
    FogModifierStop(self.handle)
end
function FogModifier.fromHandle(self, handle)
    return self:getObject(handle)
end
function FogModifier.fromRect(self, forWhichPlayer, whichState, where, useSharedVision, afterUnits)
    return self:fromHandle(
        CreateFogModifierRect(forWhichPlayer.handle, whichState, where.handle, useSharedVision, afterUnits)
    )
end
return ____exports
end,
["node_modules.w3ts.handles.frame"] = function() require("lualib_bundle");
local ____exports = {}
local ____handle = require("node_modules.w3ts.handles.handle")
local Handle = ____handle.Handle
____exports.Frame = __TS__Class()
local Frame = ____exports.Frame
Frame.name = "Frame"
Frame.prototype.____getters = {}
Frame.prototype.__index = __TS__Index(Frame.prototype)
Frame.prototype.____setters = {}
Frame.prototype.__newindex = __TS__NewIndex(Frame.prototype)
Frame.____super = Handle
setmetatable(Frame, Frame.____super)
setmetatable(Frame.prototype, Frame.____super.prototype)
function Frame.prototype.____constructor(self, name, owner, priority, createContext)
    Handle.prototype.____constructor(
        self,
        ((Handle:initFromHandle() and (function() return nil end)) or (function() return BlzCreateFrame(name, owner.handle, priority, createContext) end))()
    )
end
function Frame.prototype.____setters.alpha(self, alpha)
    BlzFrameSetAlpha(self.handle, alpha)
end
function Frame.prototype.____getters.alpha(self)
    return BlzFrameGetAlpha(self.handle)
end
function Frame.prototype.____setters.enabled(self, flag)
    BlzFrameSetEnable(self.handle, flag)
end
function Frame.prototype.____getters.enabled(self)
    return BlzFrameGetEnable(self.handle)
end
function Frame.prototype.____setters.height(self, height)
    BlzFrameSetSize(self.handle, self.width, height)
end
function Frame.prototype.____getters.height(self)
    return BlzFrameGetHeight(self.handle)
end
function Frame.prototype.____setters.parent(self, parent)
    BlzFrameSetParent(self.handle, parent.handle)
end
function Frame.prototype.____getters.parent(self)
    return ____exports.Frame:fromHandle(
        BlzFrameGetParent(self.handle)
    )
end
function Frame.prototype.____setters.text(self, text)
    BlzFrameSetText(self.handle, text)
end
function Frame.prototype.____getters.text(self)
    return BlzFrameGetText(self.handle)
end
function Frame.prototype.____setters.textSizeLimit(self, size)
    BlzFrameSetTextSizeLimit(self.handle, size)
end
function Frame.prototype.____getters.textSizeLimit(self)
    return BlzFrameGetTextSizeLimit(self.handle)
end
function Frame.prototype.____setters.value(self, value)
    BlzFrameSetValue(self.handle, value)
end
function Frame.prototype.____getters.value(self)
    return BlzFrameGetValue(self.handle)
end
function Frame.prototype.____setters.visible(self, flag)
    BlzFrameSetVisible(self.handle, flag)
end
function Frame.prototype.____getters.visible(self)
    return BlzFrameIsVisible(self.handle)
end
function Frame.prototype.____setters.width(self, width)
    BlzFrameSetSize(self.handle, width, self.height)
end
function Frame.prototype.____getters.width(self)
    return BlzFrameGetWidth(self.handle)
end
function Frame.prototype.addText(self, text)
    BlzFrameAddText(self.handle, text)
end
function Frame.prototype.cageMouse(self, enable)
    BlzFrameCageMouse(self.handle, enable)
end
function Frame.prototype.clearPoints(self)
    BlzFrameClearAllPoints(self.handle)
end
function Frame.prototype.click(self)
    BlzFrameClick(self.handle)
end
function Frame.prototype.destroy(self)
    BlzDestroyFrame(self.handle)
end
function Frame.prototype.setAbsPoint(self, point, x, y)
    BlzFrameSetAbsPoint(self.handle, point, x, y)
end
function Frame.prototype.setAllPoints(self, relative)
    BlzFrameSetAllPoints(self.handle, relative.handle)
end
function Frame.prototype.setFocus(self, flag)
    BlzFrameSetFocus(self.handle, flag)
end
function Frame.prototype.setFont(self, filename, height, flags)
    BlzFrameSetFont(self.handle, filename, height, flags)
end
function Frame.prototype.setLevel(self, level)
    BlzFrameSetLevel(self.handle, level)
end
function Frame.prototype.setMinMaxValue(self, minValue, maxValue)
    BlzFrameSetMinMaxValue(self.handle, minValue, maxValue)
end
function Frame.prototype.setModel(self, modelFile, cameraIndex)
    BlzFrameSetModel(self.handle, modelFile, cameraIndex)
end
function Frame.prototype.setPoint(self, point, relative, relativePoint, x, y)
    BlzFrameSetPoint(self.handle, point, relative.handle, relativePoint, x, y)
end
function Frame.prototype.setScale(self, scale)
    BlzFrameSetScale(self.handle, scale)
end
function Frame.prototype.setSize(self, width, height)
    BlzFrameSetSize(self.handle, width, height)
end
function Frame.prototype.setSpriteAnimate(self, primaryProp, flags)
    BlzFrameSetSpriteAnimate(self.handle, primaryProp, flags)
end
function Frame.prototype.setStepSize(self, stepSize)
    BlzFrameSetStepSize(self.handle, stepSize)
end
function Frame.prototype.setTextColor(self, color)
    BlzFrameSetTextColor(self.handle, color)
end
function Frame.prototype.setTexture(self, texFile, flag, blend)
    BlzFrameSetTexture(self.handle, texFile, flag, blend)
end
function Frame.prototype.setTooltip(self, tooltip)
    BlzFrameSetTooltip(self.handle, tooltip.handle)
end
function Frame.prototype.setVertexColor(self, color)
    BlzFrameSetVertexColor(self.handle, color)
end
function Frame.autoPosition(self, enable)
    BlzEnableUIAutoPosition(enable)
end
function Frame.fromEvent(self)
    return self:fromHandle(
        BlzGetTriggerFrame()
    )
end
function Frame.fromHandle(self, handle)
    return self:getObject(handle)
end
function Frame.fromName(self, name, createContext)
    return self:fromHandle(
        BlzGetFrameByName(name, createContext)
    )
end
function Frame.fromOrigin(self, frameType, index)
    return self:fromHandle(
        BlzGetOriginFrame(frameType, index)
    )
end
function Frame.getEventHandle(self)
    return BlzGetTriggerFrameEvent()
end
function Frame.getEventText(self)
    return BlzGetTriggerFrameValue()
end
function Frame.getEventValue(self)
    return BlzGetTriggerFrameValue()
end
function Frame.hideOrigin(self, enable)
    BlzHideOriginFrames(enable)
end
function Frame.loadTOC(self, filename)
    return BlzLoadTOCFile(filename)
end
return ____exports
end,
["node_modules.w3ts.handles.gamecache"] = function() require("lualib_bundle");
local ____exports = {}
local ____handle = require("node_modules.w3ts.handles.handle")
local Handle = ____handle.Handle
____exports.GameCache = __TS__Class()
local GameCache = ____exports.GameCache
GameCache.name = "GameCache"
GameCache.prototype.__index = __TS__Index(GameCache.prototype)
GameCache.____super = Handle
setmetatable(GameCache, GameCache.____super)
setmetatable(GameCache.prototype, GameCache.____super.prototype)
function GameCache.prototype.____constructor(self, campaignFile)
    Handle.prototype.____constructor(
        self,
        ((Handle:initFromHandle() and (function() return nil end)) or (function() return InitGameCache(campaignFile) end))()
    )
    self.filename = campaignFile
end
function GameCache.prototype.flush(self)
    FlushGameCache(self.handle)
end
function GameCache.prototype.flushBoolean(self, missionKey, key)
    FlushStoredBoolean(self.handle, missionKey, key)
end
function GameCache.prototype.flushInteger(self, missionKey, key)
    FlushStoredInteger(self.handle, missionKey, key)
end
function GameCache.prototype.flushMission(self, missionKey)
    FlushStoredMission(self.handle, missionKey)
end
function GameCache.prototype.flushNumber(self, missionKey, key)
    FlushStoredInteger(self.handle, missionKey, key)
end
function GameCache.prototype.flushString(self, missionKey, key)
    FlushStoredString(self.handle, missionKey, key)
end
function GameCache.prototype.flushUnit(self, missionKey, key)
    FlushStoredUnit(self.handle, missionKey, key)
end
function GameCache.prototype.getBoolean(self, missionKey, key)
    return GetStoredBoolean(self.handle, missionKey, key)
end
function GameCache.prototype.getInteger(self, missionKey, key)
    return GetStoredInteger(self.handle, missionKey, key)
end
function GameCache.prototype.getNumber(self, missionKey, key)
    return GetStoredReal(self.handle, missionKey, key)
end
function GameCache.prototype.getString(self, missionKey, key)
    return GetStoredString(self.handle, missionKey, key)
end
function GameCache.prototype.hasBoolean(self, missionKey, key)
    return HaveStoredBoolean(self.handle, missionKey, key)
end
function GameCache.prototype.hasInteger(self, missionKey, key)
    return HaveStoredInteger(self.handle, missionKey, key)
end
function GameCache.prototype.hasNumber(self, missionKey, key)
    return HaveStoredReal(self.handle, missionKey, key)
end
function GameCache.prototype.hasString(self, missionKey, key)
    return HaveStoredString(self.handle, missionKey, key)
end
function GameCache.prototype.restoreUnit(self, missionKey, key, forWhichPlayer, x, y, face)
    return RestoreUnit(self.handle, missionKey, key, forWhichPlayer.handle, x, y, face)
end
function GameCache.prototype.save(self)
    return SaveGameCache(self.handle)
end
function GameCache.prototype.store(self, missionKey, key, value)
    if type(value) == "string" then
        StoreString(self.handle, missionKey, key, value)
    elseif type(value) == "boolean" then
        StoreBoolean(self.handle, missionKey, key, value)
    elseif type(value) == "number" then
        StoreReal(self.handle, missionKey, key, value)
    else
        StoreUnit(self.handle, missionKey, key, value)
    end
end
function GameCache.prototype.syncBoolean(self, missionKey, key)
    return SyncStoredBoolean(self.handle, missionKey, key)
end
function GameCache.prototype.syncInteger(self, missionKey, key)
    return SyncStoredInteger(self.handle, missionKey, key)
end
function GameCache.prototype.syncNumber(self, missionKey, key)
    return SyncStoredReal(self.handle, missionKey, key)
end
function GameCache.prototype.syncString(self, missionKey, key)
    return SyncStoredString(self.handle, missionKey, key)
end
function GameCache.prototype.syncUnit(self, missionKey, key)
    return SyncStoredUnit(self.handle, missionKey, key)
end
function GameCache.fromHandle(self, handle)
    return self:getObject(handle)
end
function GameCache.reloadFromDisk(self)
    return ReloadGameCachesFromDisk()
end
return ____exports
end,
["node_modules.w3ts.handles.leaderboard"] = function() require("lualib_bundle");
local ____exports = {}
local ____handle = require("node_modules.w3ts.handles.handle")
local Handle = ____handle.Handle
____exports.Leaderboard = __TS__Class()
local Leaderboard = ____exports.Leaderboard
Leaderboard.name = "Leaderboard"
Leaderboard.prototype.____getters = {}
Leaderboard.prototype.__index = __TS__Index(Leaderboard.prototype)
Leaderboard.prototype.____setters = {}
Leaderboard.prototype.__newindex = __TS__NewIndex(Leaderboard.prototype)
Leaderboard.____super = Handle
setmetatable(Leaderboard, Leaderboard.____super)
setmetatable(Leaderboard.prototype, Leaderboard.____super.prototype)
function Leaderboard.prototype.____constructor(self)
    Handle.prototype.____constructor(
        self,
        ((Handle:initFromHandle() and (function() return nil end)) or (function() return CreateLeaderboard() end))()
    )
end
function Leaderboard.prototype.____getters.displayed(self)
    return IsLeaderboardDisplayed(self.handle)
end
function Leaderboard.prototype.____getters.itemCount(self)
    return LeaderboardGetItemCount(self.handle)
end
function Leaderboard.prototype.____setters.itemCount(self, count)
    LeaderboardSetSizeByItemCount(self.handle, count)
end
function Leaderboard.prototype.____setters.label(self, value)
    LeaderboardSetLabel(self.handle, value)
end
function Leaderboard.prototype.____getters.label(self)
    return LeaderboardGetLabelText(self.handle)
end
function Leaderboard.prototype.destroy(self)
    DestroyLeaderboard(self.handle)
end
function Leaderboard.prototype.display(self, flag)
    if flag == nil then
        flag = true
    end
    LeaderboardDisplay(self.handle, flag)
end
function Leaderboard.prototype.addItem(self, label, value, p)
    LeaderboardAddItem(self.handle, label, value, p.handle)
end
function Leaderboard.prototype.removeItem(self, index)
    LeaderboardRemoveItem(self.handle, index)
end
function Leaderboard.prototype.removePlayerItem(self, p)
    LeaderboardRemovePlayerItem(self.handle, p.handle)
end
function Leaderboard.prototype.clear(self)
    LeaderboardClear(self.handle)
end
function Leaderboard.prototype.sortByValue(self, asc)
    if asc == nil then
        asc = true
    end
    LeaderboardSortItemsByValue(self.handle, asc)
end
function Leaderboard.prototype.sortByPlayer(self, asc)
    if asc == nil then
        asc = true
    end
    LeaderboardSortItemsByPlayer(self.handle, asc)
end
function Leaderboard.prototype.sortByLabel(self, asc)
    if asc == nil then
        asc = true
    end
    LeaderboardSortItemsByLabel(self.handle, asc)
end
function Leaderboard.prototype.hasPlayerItem(self, p)
    LeaderboardHasPlayerItem(self.handle, p.handle)
end
function Leaderboard.prototype.getPlayerIndex(self, p)
    return LeaderboardGetPlayerIndex(self.handle, p.handle)
end
function Leaderboard.prototype.setLabelColor(self, red, green, blue, alpha)
    LeaderboardSetLabelColor(self.handle, red, green, blue, alpha)
end
function Leaderboard.prototype.setValueColor(self, red, green, blue, alpha)
    LeaderboardSetValueColor(self.handle, red, green, blue, alpha)
end
function Leaderboard.prototype.setStyle(self, showLabel, showNames, showValues, showIcons)
    if showLabel == nil then
        showLabel = true
    end
    if showNames == nil then
        showNames = true
    end
    if showValues == nil then
        showValues = true
    end
    if showIcons == nil then
        showIcons = true
    end
    LeaderboardSetStyle(self.handle, showLabel, showNames, showValues, showIcons)
end
function Leaderboard.prototype.setItemValue(self, item, value)
    LeaderboardSetItemValue(self.handle, item, value)
end
function Leaderboard.prototype.setItemLabel(self, item, label)
    LeaderboardSetItemLabel(self.handle, item, label)
end
function Leaderboard.prototype.setItemStyle(self, item, showLabel, showValues, showIcons)
    if showLabel == nil then
        showLabel = true
    end
    if showValues == nil then
        showValues = true
    end
    if showIcons == nil then
        showIcons = true
    end
    LeaderboardSetItemStyle(self.handle, item, showLabel, showValues, showIcons)
end
function Leaderboard.prototype.setItemLabelColor(self, item, red, green, blue, alpha)
    LeaderboardSetItemLabelColor(self.handle, item, red, green, blue, alpha)
end
function Leaderboard.prototype.setItemValueColor(self, item, red, green, blue, alpha)
    LeaderboardSetItemValueColor(self.handle, item, red, green, blue, alpha)
end
function Leaderboard.prototype.setPlayerBoard(self, p)
    PlayerSetLeaderboard(p.handle, self.handle)
end
function Leaderboard.fromPlayer(self, p)
    return self:fromHandle(
        PlayerGetLeaderboard(p.handle)
    )
end
function Leaderboard.fromHandle(self, handle)
    return self:getObject(handle)
end
return ____exports
end,
["node_modules.w3ts.handles.quest"] = function() require("lualib_bundle");
local ____exports = {}
local ____handle = require("node_modules.w3ts.handles.handle")
local Handle = ____handle.Handle
____exports.QuestItem = __TS__Class()
local QuestItem = ____exports.QuestItem
QuestItem.name = "QuestItem"
QuestItem.prototype.____getters = {}
QuestItem.prototype.__index = __TS__Index(QuestItem.prototype)
QuestItem.prototype.____setters = {}
QuestItem.prototype.__newindex = __TS__NewIndex(QuestItem.prototype)
QuestItem.____super = Handle
setmetatable(QuestItem, QuestItem.____super)
setmetatable(QuestItem.prototype, QuestItem.____super.prototype)
function QuestItem.prototype.____constructor(self, whichQuest)
    Handle.prototype.____constructor(
        self,
        ((Handle:initFromHandle() and (function() return nil end)) or (function() return QuestCreateItem(whichQuest.handle) end))()
    )
end
function QuestItem.prototype.____getters.completed(self)
    return IsQuestItemCompleted(self.handle)
end
function QuestItem.prototype.____setters.completed(self, completed)
    QuestItemSetCompleted(self.handle, completed)
end
function QuestItem.prototype.setDescription(self, description)
    QuestItemSetDescription(self.handle, description)
end
____exports.Quest = __TS__Class()
local Quest = ____exports.Quest
Quest.name = "Quest"
Quest.prototype.____getters = {}
Quest.prototype.__index = __TS__Index(Quest.prototype)
Quest.prototype.____setters = {}
Quest.prototype.__newindex = __TS__NewIndex(Quest.prototype)
Quest.____super = Handle
setmetatable(Quest, Quest.____super)
setmetatable(Quest.prototype, Quest.____super.prototype)
function Quest.prototype.____constructor(self)
    Handle.prototype.____constructor(
        self,
        ((Handle:initFromHandle() and (function() return nil end)) or (function() return CreateQuest() end))()
    )
end
function Quest.prototype.____getters.completed(self)
    return IsQuestCompleted(self.handle)
end
function Quest.prototype.____setters.completed(self, completed)
    QuestSetCompleted(self.handle, completed)
end
function Quest.prototype.____getters.discovered(self)
    return IsQuestDiscovered(self.handle)
end
function Quest.prototype.____setters.discovered(self, discovered)
    QuestSetDiscovered(self.handle, discovered)
end
function Quest.prototype.____getters.enabled(self)
    return IsQuestEnabled(self.handle)
end
function Quest.prototype.____setters.enabled(self, enabled)
    QuestSetEnabled(self.handle, enabled)
end
function Quest.prototype.____getters.failed(self)
    return IsQuestFailed(self.handle)
end
function Quest.prototype.____setters.failed(self, failed)
    QuestSetFailed(self.handle, failed)
end
function Quest.prototype.____getters.required(self)
    return IsQuestRequired(self.handle)
end
function Quest.prototype.____setters.required(self, required)
    QuestSetRequired(self.handle, required)
end
function Quest.prototype.setDescription(self, description)
    QuestSetDescription(self.handle, description)
end
function Quest.prototype.setIcon(self, iconPath)
    QuestSetIconPath(self.handle, iconPath)
end
function Quest.prototype.setTitle(self, title)
    QuestSetTitle(self.handle, title)
end
function Quest.prototype.addItem(self, description)
    local questItem = __TS__New(____exports.QuestItem, self)
    questItem:setDescription(description)
    return questItem
end
function Quest.prototype.destroy(self)
    DestroyQuest(self.handle)
end
function Quest.flashQuestDialogButton(self)
    FlashQuestDialogButton()
end
function Quest.forceQuestDialogUpdate(self)
    ForceQuestDialogUpdate()
end
function Quest.fromHandle(self, handle)
    return self:getObject(handle)
end
return ____exports
end,
["node_modules.w3ts.handles.region"] = function() require("lualib_bundle");
local ____exports = {}
local ____handle = require("node_modules.w3ts.handles.handle")
local Handle = ____handle.Handle
____exports.Region = __TS__Class()
local Region = ____exports.Region
Region.name = "Region"
Region.prototype.__index = __TS__Index(Region.prototype)
Region.____super = Handle
setmetatable(Region, Region.____super)
setmetatable(Region.prototype, Region.____super.prototype)
function Region.prototype.____constructor(self)
    Handle.prototype.____constructor(
        self,
        ((Handle:initFromHandle() and (function() return nil end)) or (function() return CreateRegion() end))()
    )
end
function Region.prototype.addCell(self, x, y)
    RegionAddCell(self.handle, x, y)
end
function Region.prototype.addCellPoint(self, whichPoint)
    RegionAddCellAtLoc(self.handle, whichPoint.handle)
end
function Region.prototype.addRect(self, r)
    RegionAddRect(self.handle, r.handle)
end
function Region.prototype.clearCell(self, x, y)
    RegionClearCell(self.handle, x, y)
end
function Region.prototype.clearCellPoint(self, whichPoint)
    RegionClearCellAtLoc(self.handle, whichPoint.handle)
end
function Region.prototype.clearRect(self, r)
    RegionClearRect(self.handle, r.handle)
end
function Region.prototype.containsCoords(self, x, y)
    return IsPointInRegion(self.handle, x, y)
end
function Region.prototype.containsPoint(self, whichPoint)
    IsLocationInRegion(self.handle, whichPoint.handle)
end
function Region.prototype.containsUnit(self, whichUnit)
    return IsUnitInRegion(self.handle, whichUnit.handle)
end
function Region.prototype.destroy(self)
    RemoveRegion(self.handle)
end
function Region.fromHandle(self, handle)
    return self:getObject(handle)
end
return ____exports
end,
["node_modules.w3ts.handles.timer"] = function() require("lualib_bundle");
local ____exports = {}
local ____handle = require("node_modules.w3ts.handles.handle")
local Handle = ____handle.Handle
____exports.Timer = __TS__Class()
local Timer = ____exports.Timer
Timer.name = "Timer"
Timer.prototype.____getters = {}
Timer.prototype.__index = __TS__Index(Timer.prototype)
Timer.____super = Handle
setmetatable(Timer, Timer.____super)
setmetatable(Timer.prototype, Timer.____super.prototype)
function Timer.prototype.____constructor(self)
    Handle.prototype.____constructor(
        self,
        ((Handle:initFromHandle() and (function() return nil end)) or (function() return CreateTimer() end))()
    )
end
function Timer.prototype.____getters.elapsed(self)
    return TimerGetElapsed(self.handle)
end
function Timer.prototype.____getters.remaining(self)
    return TimerGetRemaining(self.handle)
end
function Timer.prototype.____getters.timeout(self)
    return TimerGetTimeout(self.handle)
end
function Timer.prototype.destroy(self)
    DestroyTimer(self.handle)
    return self
end
function Timer.prototype.pause(self)
    PauseTimer(self.handle)
    return self
end
function Timer.prototype.resume(self)
    ResumeTimer(self.handle)
    return self
end
function Timer.prototype.start(self, timeout, periodic, handlerFunc)
    TimerStart(self.handle, timeout, periodic, handlerFunc)
    return self
end
function Timer.fromExpired(self)
    return self:fromHandle(
        GetExpiredTimer()
    )
end
function Timer.fromHandle(self, handle)
    return self:getObject(handle)
end
return ____exports
end,
["node_modules.w3ts.handles.timerdialog"] = function() require("lualib_bundle");
local ____exports = {}
local ____handle = require("node_modules.w3ts.handles.handle")
local Handle = ____handle.Handle
____exports.TimerDialog = __TS__Class()
local TimerDialog = ____exports.TimerDialog
TimerDialog.name = "TimerDialog"
TimerDialog.prototype.____getters = {}
TimerDialog.prototype.__index = __TS__Index(TimerDialog.prototype)
TimerDialog.prototype.____setters = {}
TimerDialog.prototype.__newindex = __TS__NewIndex(TimerDialog.prototype)
TimerDialog.____super = Handle
setmetatable(TimerDialog, TimerDialog.____super)
setmetatable(TimerDialog.prototype, TimerDialog.____super.prototype)
function TimerDialog.prototype.____constructor(self, t)
    Handle.prototype.____constructor(
        self,
        ((Handle:initFromHandle() and (function() return nil end)) or (function() return CreateTimerDialog(t.handle) end))()
    )
end
function TimerDialog.prototype.____getters.display(self)
    return IsTimerDialogDisplayed(self.handle)
end
function TimerDialog.prototype.____setters.display(self, display)
    TimerDialogDisplay(self.handle, display)
end
function TimerDialog.prototype.destroy(self)
    DestroyTimerDialog(self.handle)
end
function TimerDialog.prototype.setTitle(self, title)
    TimerDialogSetTitle(self.handle, title)
end
function TimerDialog.prototype.setSpeed(self, speedMultFactor)
    TimerDialogSetSpeed(self.handle, speedMultFactor)
end
function TimerDialog.prototype.setTimeRemaining(self, value)
    TimerDialogSetRealTimeRemaining(self.handle, value)
end
function TimerDialog.fromHandle(self, handle)
    return self:getObject(handle)
end
return ____exports
end,
["node_modules.w3ts.handles.trigger"] = function() require("lualib_bundle");
local ____exports = {}
local ____handle = require("node_modules.w3ts.handles.handle")
local Handle = ____handle.Handle
____exports.Trigger = __TS__Class()
local Trigger = ____exports.Trigger
Trigger.name = "Trigger"
Trigger.____getters = {}
Trigger.prototype.____getters = {}
Trigger.prototype.__index = __TS__Index(Trigger.prototype)
Trigger.prototype.____setters = {}
Trigger.prototype.__newindex = __TS__NewIndex(Trigger.prototype)
Trigger.____super = Handle
setmetatable(Trigger, {__index = __TS__ClassIndex})
setmetatable(Trigger.prototype, Trigger.____super.prototype)
function Trigger.prototype.____constructor(self)
    Handle.prototype.____constructor(
        self,
        ((Handle:initFromHandle() and (function() return nil end)) or (function() return CreateTrigger() end))()
    )
end
function Trigger.prototype.____setters.enabled(self, flag)
    if flag then
        EnableTrigger(self.handle)
    else
        DisableTrigger(self.handle)
    end
end
function Trigger.prototype.____getters.enabled(self)
    return IsTriggerEnabled(self.handle)
end
function Trigger.prototype.____setters.waitOnSleeps(self, flag)
    TriggerWaitOnSleeps(self.handle, flag)
end
function Trigger.prototype.____getters.waitOnSleeps(self)
    return IsTriggerWaitOnSleeps(self.handle)
end
function Trigger.prototype.____getters.evalCount(self)
    return GetTriggerEvalCount(self.handle)
end
function Trigger.prototype.____getters.execCount(self)
    return GetTriggerExecCount(self.handle)
end
function Trigger.____getters.eventId(self)
    return GetTriggerEventId()
end
function Trigger.prototype.addAction(self, actionFunc)
    return TriggerAddAction(self.handle, actionFunc)
end
function Trigger.prototype.addCondition(self, condition)
    return TriggerAddCondition(self.handle, condition)
end
function Trigger.prototype.destroy(self)
    DestroyTrigger(self.handle)
end
function Trigger.prototype.eval(self)
    return TriggerEvaluate(self.handle)
end
function Trigger.prototype.exec(self)
    return TriggerExecute(self.handle)
end
function Trigger.prototype.registerAnyUnitEvent(self, whichPlayerUnitEvent)
    return TriggerRegisterAnyUnitEventBJ(self.handle, whichPlayerUnitEvent)
end
function Trigger.prototype.registerDialogButtonEvent(self, whichButton)
    return TriggerRegisterDialogButtonEvent(self.handle, whichButton.handle)
end
function Trigger.prototype.registerDialogEvent(self, whichDialog)
    return TriggerRegisterDialogEvent(self.handle, whichDialog.handle)
end
function Trigger.prototype.registerGameStateEvent(self, whichState, opcode, limitval)
    return TriggerRegisterGameStateEvent(self.handle, whichState, opcode, limitval)
end
function Trigger.prototype.registerPlayerEvent(self, whichPlayer, whichPlayerEvent)
    return TriggerRegisterPlayerEvent(self.handle, whichPlayer.handle, whichPlayerEvent)
end
function Trigger.prototype.registerPlayerKeyEvent(self, whichPlayer, whichKey, metaKey, fireOnKeyDown)
    return BlzTriggerRegisterPlayerKeyEvent(self.handle, whichPlayer.handle, whichKey, metaKey, fireOnKeyDown)
end
function Trigger.prototype.registerPlayerSyncEvent(self, whichPlayer, prefix, fromServer)
    return BlzTriggerRegisterPlayerSyncEvent(self.handle, whichPlayer.handle, prefix, fromServer)
end
function Trigger.prototype.registerPlayerMouseEvent(self, whichPlayer, whichMouseEvent)
    return TriggerRegisterPlayerMouseEventBJ(self.handle, whichPlayer.handle, whichMouseEvent)
end
function Trigger.prototype.registerPlayerUnitEvent(self, whichPlayer, whichPlayerUnitEvent, filter)
    return TriggerRegisterPlayerUnitEvent(self.handle, whichPlayer.handle, whichPlayerUnitEvent, filter)
end
function Trigger.prototype.registerUnitInRage(self, whichUnit, range, filter)
    return TriggerRegisterUnitInRange(self.handle, whichUnit, range, filter)
end
function Trigger.prototype.registerFilterUnitEvent(self, whichUnit, whichEvent, filter)
    return TriggerRegisterFilterUnitEvent(self.handle, whichUnit, whichEvent, filter)
end
function Trigger.prototype.registerUpgradeCommandEvent(self, whichUpgrade)
    return TriggerRegisterUpgradeCommandEvent(self.handle, whichUpgrade)
end
function Trigger.prototype.registerTrackableTrackEvent(self, whichTrackable)
    return TriggerRegisterTrackableTrackEvent(self.handle, whichTrackable)
end
function Trigger.prototype.registerTrackableHitEvent(self, whichTrackable)
    return TriggerRegisterTrackableHitEvent(self.handle, whichTrackable)
end
function Trigger.prototype.registerLeaveRegion(self, whichRegion, filter)
    return TriggerRegisterLeaveRegion(self.handle, whichRegion, filter)
end
function Trigger.prototype.registerEnterRegion(self, whichRegion, filter)
    return TriggerRegisterEnterRegion(self.handle, whichRegion, filter)
end
function Trigger.prototype.registerGameEvent(self, whichGameEvent)
    return TriggerRegisterGameEvent(self.handle, whichGameEvent)
end
function Trigger.prototype.registerCommandEvent(self, whichAbility, order)
    return TriggerRegisterCommandEvent(self.handle, whichAbility, order)
end
function Trigger.prototype.registerTimerEvent(self, timeout, periodic)
    return TriggerRegisterTimerEvent(self.handle, timeout, periodic)
end
function Trigger.prototype.registerTimerExpireEvent(self, t)
    return TriggerRegisterTimerExpireEvent(self.handle, t)
end
function Trigger.prototype.registerUnitEvent(self, whichUnit, whichEvent)
    return TriggerRegisterUnitEvent(self.handle, whichUnit.handle, whichEvent)
end
function Trigger.prototype.registerUnitStateEvent(self, whichUnit, whichState, opcode, limitval)
    return TriggerRegisterUnitStateEvent(self.handle, whichUnit.handle, whichState, opcode, limitval)
end
function Trigger.prototype.registerDeathEvent(self, whichWidget)
    return TriggerRegisterDeathEvent(self.handle, whichWidget.handle)
end
function Trigger.prototype.registerPlayerChatEvent(self, whichPlayer, chatMessageToDetect, exactMatchOnly)
    return TriggerRegisterPlayerChatEvent(self.handle, whichPlayer.handle, chatMessageToDetect, exactMatchOnly)
end
function Trigger.prototype.registerPlayerStateEvent(self, whichPlayer, whichState, opcode, limitval)
    return TriggerRegisterPlayerStateEvent(self.handle, whichPlayer.handle, whichState, opcode, limitval)
end
function Trigger.prototype.registerPlayerAllianceChange(self, whichPlayer, whichAlliance)
    return TriggerRegisterPlayerAllianceChange(self.handle, whichPlayer.handle, whichAlliance)
end
function Trigger.prototype.registerVariableEvent(self, varName, opcode, limitval)
    return TriggerRegisterVariableEvent(self.handle, varName, opcode, limitval)
end
function Trigger.prototype.removeAction(self, whichAction)
    return TriggerRemoveAction(self.handle, whichAction)
end
function Trigger.prototype.removeActions(self)
    return TriggerClearActions(self.handle)
end
function Trigger.prototype.removeCondition(self, whichCondition)
    return TriggerRemoveCondition(self.handle, whichCondition)
end
function Trigger.prototype.removeConditions(self)
    return TriggerClearConditions(self.handle)
end
function Trigger.prototype.reset(self)
    ResetTrigger(self.handle)
end
function Trigger.prototype.triggerRegisterFrameEvent(self, frame, eventId)
    return BlzTriggerRegisterFrameEvent(self.handle, frame.handle, eventId)
end
function Trigger.fromEvent(self)
    return self:fromHandle(
        GetTriggeringTrigger()
    )
end
function Trigger.fromHandle(self, handle)
    return self:getObject(handle)
end
return ____exports
end,
["node_modules.w3ts.handles.index"] = function() local ____exports = {}
do
    local ____export = require("node_modules.w3ts.handles.destructable")
    for ____exportKey, ____exportValue in pairs(____export) do
        ____exports[____exportKey] = ____exportValue
    end
end
do
    local ____export = require("node_modules.w3ts.handles.dialog")
    for ____exportKey, ____exportValue in pairs(____export) do
        ____exports[____exportKey] = ____exportValue
    end
end
do
    local ____export = require("node_modules.w3ts.handles.effect")
    for ____exportKey, ____exportValue in pairs(____export) do
        ____exports[____exportKey] = ____exportValue
    end
end
do
    local ____export = require("node_modules.w3ts.handles.fogmodifier")
    for ____exportKey, ____exportValue in pairs(____export) do
        ____exports[____exportKey] = ____exportValue
    end
end
do
    local ____export = require("node_modules.w3ts.handles.force")
    for ____exportKey, ____exportValue in pairs(____export) do
        ____exports[____exportKey] = ____exportValue
    end
end
do
    local ____export = require("node_modules.w3ts.handles.frame")
    for ____exportKey, ____exportValue in pairs(____export) do
        ____exports[____exportKey] = ____exportValue
    end
end
do
    local ____export = require("node_modules.w3ts.handles.gamecache")
    for ____exportKey, ____exportValue in pairs(____export) do
        ____exports[____exportKey] = ____exportValue
    end
end
do
    local ____export = require("node_modules.w3ts.handles.group")
    for ____exportKey, ____exportValue in pairs(____export) do
        ____exports[____exportKey] = ____exportValue
    end
end
do
    local ____export = require("node_modules.w3ts.handles.handle")
    for ____exportKey, ____exportValue in pairs(____export) do
        ____exports[____exportKey] = ____exportValue
    end
end
do
    local ____export = require("node_modules.w3ts.handles.item")
    for ____exportKey, ____exportValue in pairs(____export) do
        ____exports[____exportKey] = ____exportValue
    end
end
do
    local ____export = require("node_modules.w3ts.handles.leaderboard")
    for ____exportKey, ____exportValue in pairs(____export) do
        ____exports[____exportKey] = ____exportValue
    end
end
do
    local ____export = require("node_modules.w3ts.handles.player")
    for ____exportKey, ____exportValue in pairs(____export) do
        ____exports[____exportKey] = ____exportValue
    end
end
do
    local ____export = require("node_modules.w3ts.handles.point")
    for ____exportKey, ____exportValue in pairs(____export) do
        ____exports[____exportKey] = ____exportValue
    end
end
do
    local ____export = require("node_modules.w3ts.handles.quest")
    for ____exportKey, ____exportValue in pairs(____export) do
        ____exports[____exportKey] = ____exportValue
    end
end
do
    local ____export = require("node_modules.w3ts.handles.rect")
    for ____exportKey, ____exportValue in pairs(____export) do
        ____exports[____exportKey] = ____exportValue
    end
end
do
    local ____export = require("node_modules.w3ts.handles.region")
    for ____exportKey, ____exportValue in pairs(____export) do
        ____exports[____exportKey] = ____exportValue
    end
end
do
    local ____export = require("node_modules.w3ts.handles.timer")
    for ____exportKey, ____exportValue in pairs(____export) do
        ____exports[____exportKey] = ____exportValue
    end
end
do
    local ____export = require("node_modules.w3ts.handles.timerdialog")
    for ____exportKey, ____exportValue in pairs(____export) do
        ____exports[____exportKey] = ____exportValue
    end
end
do
    local ____export = require("node_modules.w3ts.handles.trigger")
    for ____exportKey, ____exportValue in pairs(____export) do
        ____exports[____exportKey] = ____exportValue
    end
end
do
    local ____export = require("node_modules.w3ts.handles.unit")
    for ____exportKey, ____exportValue in pairs(____export) do
        ____exports[____exportKey] = ____exportValue
    end
end
do
    local ____export = require("node_modules.w3ts.handles.widget")
    for ____exportKey, ____exportValue in pairs(____export) do
        ____exports[____exportKey] = ____exportValue
    end
end
return ____exports
end,
["node_modules.w3ts.hooks.index"] = function() require("lualib_bundle");
local ____exports = {}
local oldMain
oldMain = main
local oldConfig
oldConfig = config
local hooksMainBefore = {}
local hooksMainAfter = {}
local hooksConfigBefore = {}
local hooksConfigAfter = {}
local function hookedMain()
    __TS__ArrayForEach(
        hooksMainBefore,
        function(____, func) return func() end
    )
    oldMain()
    __TS__ArrayForEach(
        hooksMainAfter,
        function(____, func) return func() end
    )
end
local function hookedConfig()
    __TS__ArrayForEach(
        hooksConfigBefore,
        function(____, func) return func() end
    )
    oldConfig()
    __TS__ArrayForEach(
        hooksConfigAfter,
        function(____, func) return func() end
    )
end
main = hookedMain
config = hookedConfig
____exports.W3TS_HOOK = {}
____exports.W3TS_HOOK.MAIN_BEFORE = "main::before"
____exports.W3TS_HOOK.MAIN_AFTER = "main::after"
____exports.W3TS_HOOK.CONFIG_BEFORE = "config::before"
____exports.W3TS_HOOK.CONFIG_AFTER = "config::after"
local entryPoints = {[____exports.W3TS_HOOK.MAIN_BEFORE] = hooksMainBefore, [____exports.W3TS_HOOK.MAIN_AFTER] = hooksMainAfter, [____exports.W3TS_HOOK.CONFIG_BEFORE] = hooksConfigBefore, [____exports.W3TS_HOOK.CONFIG_AFTER] = hooksConfigAfter}
function ____exports.addScriptHook(entryPoint, hook)
    if not (entryPoints[entryPoint] ~= nil) then
        return false
    end
    __TS__ArrayPush(entryPoints[entryPoint], hook)
    return true
end
return ____exports
end,
["node_modules.w3ts.system.base64"] = function() local ____exports = {}
local chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
function ____exports.base64Encode(input)
    local output = ""
    do
        local block = 0
        local charCode = 0
        local idx = 0
        local map = chars
        while (#string.sub(
            input,
            (math.floor(idx) | 0) + 1,
            (math.floor(idx) | 0) + 1
        ) > 0) or (function()
            map = "="
            return idx % 1
        end)() do
            charCode = string.byte(
                input,
                math.floor(
                    (function()
                        idx = idx + (3 / 4)
                        return idx
                    end)()
                ) + 1
            ) or 0
            if (math.floor(idx) > #input) and (charCode == 0) then
                if (#output % 4) == 1 then
                    return tostring(output) .. "="
                end
                return tostring(output) .. "=="
            end
            if charCode > 255 then
                print("'base64Encode' failed: The string to be encoded contains characters outside of the Latin1 range.")
                return output
            end
            block = (block << 8) | charCode
            output = tostring(output) .. tostring(
                string.sub(
                    map,
                    math.floor(63 & (block >> (8 - ((idx % 1) * 8)))) + 1,
                    math.floor(63 & (block >> (8 - ((idx % 1) * 8)))) + 1
                )
            )
        end
    end
    return output
end
function ____exports.base64Decode(input)
    local i = #input
    do
        while (i > 0) and (string.sub(input, i + 1, i + 1) ~= "=") do
            i = i - 1
        end
    end
    local str = string.sub(input, 1, 0 + (i - 1))
    local output = ""
    if (#str % 4) == 1 then
        print("'base64Decode' failed: The string to be decoded is not correctly encoded.")
        return output
    end
    local bs = 0
    do
        local bc = 0
        local buffer
        local idx = 0
        while (function()
            buffer = string.sub(str, idx + 1, idx + 1)
            return buffer
        end)() do
            if #tostring(buffer) == 0 then
                break
            end
            buffer = (string.find(chars, buffer, nil, true) or 0) - 1
            idx = idx + 1;
            (((~buffer and ((function()
                bs = ((((bc % 4) ~= 0) and (function() return (bs * 64) + buffer end)) or (function() return buffer end))()
                return (function()
                    local ____tmp = bc
                    bc = ____tmp + 1
                    return ____tmp
                end)() % 4
            end)() ~= 0)) and (function() return (function()
                output = tostring(output) .. tostring(
                    string.char(255 & (bs >> ((-2 * bc) & 6)))
                )
                return output
            end)() end)) or (function() return 0 end))()
        end
    end
    return output
end
return ____exports
end,
["node_modules.w3ts.system.binaryreader"] = function() require("lualib_bundle");
local ____exports = {}
____exports.BinaryReader = __TS__Class()
local BinaryReader = ____exports.BinaryReader
BinaryReader.name = "BinaryReader"
function BinaryReader.prototype.____constructor(self, binaryString)
    self.pos = 1
    self.data = binaryString
end
function BinaryReader.prototype.read(self, fmt, size)
    local unpacked = {
        string.unpack(fmt, self.data, self.pos)
    }
    self.pos = self.pos + size
    if #unpacked <= 0 then
        return 0
    end
    return unpacked[1]
end
function BinaryReader.prototype.readDouble(self)
    return self:read(">d", 4)
end
function BinaryReader.prototype.readFloat(self)
    return self:read(">f", 4)
end
function BinaryReader.prototype.readInt8(self)
    return self:read(">b", 1)
end
function BinaryReader.prototype.readInt16(self)
    return self:read(">h", 2)
end
function BinaryReader.prototype.readInt32(self)
    return self:read(">i4", 4)
end
function BinaryReader.prototype.readUInt8(self)
    return self:read(">B", 1)
end
function BinaryReader.prototype.readUInt16(self)
    return self:read(">H", 2)
end
function BinaryReader.prototype.readUInt32(self)
    return self:read(">I4", 4)
end
function BinaryReader.prototype.readString(self)
    local value = self:read(">z", 0)
    self.pos = self.pos + (#value + 1)
    return value
end
return ____exports
end,
["node_modules.w3ts.system.binarywriter"] = function() require("lualib_bundle");
local ____exports = {}
____exports.BinaryWriter = __TS__Class()
local BinaryWriter = ____exports.BinaryWriter
BinaryWriter.name = "BinaryWriter"
function BinaryWriter.prototype.____constructor(self)
    self.values = {}
    self.fmj = ">"
end
function BinaryWriter.prototype.writeDouble(self, value)
    self.fmj = tostring(self.fmj) .. "d"
    __TS__ArrayPush(self.values, value)
end
function BinaryWriter.prototype.writeFloat(self, value)
    self.fmj = tostring(self.fmj) .. "f"
    __TS__ArrayPush(self.values, value)
end
function BinaryWriter.prototype.writeInt8(self, value)
    self.fmj = tostring(self.fmj) .. "b"
    __TS__ArrayPush(self.values, value)
end
function BinaryWriter.prototype.writeInt16(self, value)
    self.fmj = tostring(self.fmj) .. "h"
    __TS__ArrayPush(self.values, value)
end
function BinaryWriter.prototype.writeInt32(self, value)
    self.fmj = tostring(self.fmj) .. "i4"
    __TS__ArrayPush(self.values, value)
end
function BinaryWriter.prototype.writeUInt8(self, value)
    self.fmj = tostring(self.fmj) .. "B"
    __TS__ArrayPush(self.values, value)
end
function BinaryWriter.prototype.writeUInt16(self, value)
    self.fmj = tostring(self.fmj) .. "H"
    __TS__ArrayPush(self.values, value)
end
function BinaryWriter.prototype.writeUInt32(self, value)
    self.fmj = tostring(self.fmj) .. "I4"
    __TS__ArrayPush(self.values, value)
end
function BinaryWriter.prototype.writeString(self, value)
    self.fmj = tostring(self.fmj) .. "z"
    __TS__ArrayPush(self.values, value)
end
function BinaryWriter.prototype.__tostring(self)
    return string.pack(
        self.fmj,
        table.unpack(self.values)
    )
end
return ____exports
end,
["node_modules.w3ts.system.file"] = function() require("lualib_bundle");
local ____exports = {}
____exports.File = __TS__Class()
local File = ____exports.File
File.name = "File"
function File.prototype.____constructor(self)
end
function File.read(self, filename)
    local originalIcon = BlzGetAbilityIcon(self.dummyAbility)
    Preloader(filename)
    local preloadText = BlzGetAbilityIcon(self.dummyAbility)
    BlzSetAbilityIcon(self.dummyAbility, originalIcon)
    if preloadText ~= originalIcon then
        return preloadText
    end
    return "fail"
end
function File.write(self, filename, contents)
    PreloadGenClear()
    PreloadGenStart()
    Preload("\")\n//! beginusercode\nlocal o=''\nPreload=function(s)o=o..s end\nPreloadEnd=function()end\n//!endusercode\n//")
    do
        local i = 0
        while i < (#contents / ____exports.File.preloadLimit) do
            Preload(
                tostring(
                    string.sub(contents, (i * ____exports.File.preloadLimit) + 1, (i * ____exports.File.preloadLimit) + ____exports.File.preloadLimit)
                )
            )
            i = i + 1
        end
    end
    Preload(
        ("\")\n//! beginusercode\nBlzSetAbilityIcon(" .. tostring(self.dummyAbility)) .. ",o)\n//!endusercode\n//"
    )
    PreloadGenEnd(filename)
    return self
end
File.preloadLimit = 259
File.dummyAbility = FourCC("Amls")
return ____exports
end,
["node_modules.w3ts.system.gametime"] = function() require("lualib_bundle");
local ____exports = {}
local ____timer = require("node_modules.w3ts.handles.timer")
local Timer = ____timer.Timer
local elapsedTime = 0
local gameTimer = __TS__New(Timer):start(
    30,
    true,
    function()
        elapsedTime = elapsedTime + 30
    end
)
function ____exports.getElapsedTime(self)
    return elapsedTime + gameTimer.elapsed
end
return ____exports
end,
["node_modules.w3ts.system.sync"] = function() require("lualib_bundle");
local ____exports = {}
local ____player = require("node_modules.w3ts.handles.player")
local MapPlayer = ____player.MapPlayer
local ____timer = require("node_modules.w3ts.handles.timer")
local Timer = ____timer.Timer
local ____trigger = require("node_modules.w3ts.handles.trigger")
local Trigger = ____trigger.Trigger
local ____base64 = require("node_modules.w3ts.system.base64")
local base64Decode = ____base64.base64Decode
local base64Encode = ____base64.base64Encode
local ____binaryreader = require("node_modules.w3ts.system.binaryreader")
local BinaryReader = ____binaryreader.BinaryReader
local ____binarywriter = require("node_modules.w3ts.system.binarywriter")
local BinaryWriter = ____binarywriter.BinaryWriter
local ____gametime = require("node_modules.w3ts.system.gametime")
local getElapsedTime = ____gametime.getElapsedTime
local SYNC_PREFIX = "T"
local SYNC_PREFIX_CHUNK = "S"
local SYNC_MAX_CHUNK_SIZE = 244
local SyncIncomingPacket = __TS__Class()
SyncIncomingPacket.name = "SyncIncomingPacket"
function SyncIncomingPacket.prototype.____constructor(self, prefix, data)
    local isChunk = prefix == SYNC_PREFIX_CHUNK
    local header = base64Decode(
        ((isChunk and (function() return string.sub(data, 1, 0 + 10) end)) or (function() return string.sub(data, 1, 0 + 5) end))()
    )
    local reader = __TS__New(BinaryReader, header)
    local id = reader:readUInt16()
    self.req = ____exports.SyncRequest:fromIndex(id)
    self.chunks = ((isChunk and (function() return reader:readUInt16() end)) or (function() return 0 end))()
    self.chunk = ((isChunk and (function() return reader:readUInt16() end)) or (function() return 0 end))()
    self.data = ((isChunk and (function() return string.sub(data, 11) end)) or (function() return string.sub(data, 6) end))()
end
local SyncOutgoingPacket = __TS__Class()
SyncOutgoingPacket.name = "SyncOutgoingPacket"
function SyncOutgoingPacket.prototype.____constructor(self, req, data, chunk, totalChunks)
    if chunk == nil then
        chunk = -1
    end
    if totalChunks == nil then
        totalChunks = 0
    end
    self.req = req
    self.data = data
    self.chunk = chunk
    self.chunks = totalChunks
end
function SyncOutgoingPacket.prototype.getHeader(self)
    local writer = __TS__New(BinaryWriter)
    writer:writeUInt16(self.req.id)
    if self.chunk ~= -1 then
        writer:writeUInt16(self.chunks)
        writer:writeUInt16(self.chunk)
    end
    return base64Encode(
        tostring(writer)
    )
end
function SyncOutgoingPacket.prototype.__tostring(self)
    local header = self:getHeader()
    local writer = __TS__New(BinaryWriter)
    writer:writeString(self.data)
    return tostring(header) .. tostring(
        tostring(writer)
    )
end
____exports.SyncRequest = __TS__Class()
local SyncRequest = ____exports.SyncRequest
SyncRequest.name = "SyncRequest"
function SyncRequest.prototype.____constructor(self, from, data, options)
    if options == nil then
        options = ____exports.SyncRequest.defaultOptions
    end
    self.chunks = {}
    self.currentChunk = 0
    self.options = options
    self.from = from
    self.id = self:allocate()
    ____exports.SyncRequest.indicies[self.id + 1] = -1
    ____exports.SyncRequest.cache[self.id + 1] = self
    ____exports.SyncRequest:init()
    self.currentChunk = 0
    if #data <= SYNC_MAX_CHUNK_SIZE then
        self:send(
            __TS__New(SyncOutgoingPacket, self, data)
        )
    else
        local chunks = math.floor(#data / SYNC_MAX_CHUNK_SIZE)
        do
            local i = 0
            while i <= chunks do
                self:send(
                    __TS__New(
                        SyncOutgoingPacket,
                        self,
                        string.sub(data, (i * SYNC_MAX_CHUNK_SIZE) + 1, (i * SYNC_MAX_CHUNK_SIZE) + SYNC_MAX_CHUNK_SIZE),
                        i,
                        chunks
                    )
                )
                i = i + 1
            end
        end
    end
    self.startTime = getElapsedTime(nil)
    self.status = 0
    if self.options.timeout > 0 then
        __TS__New(Timer):start(
            self.options.timeout,
            false,
            function()
                Timer:fromExpired():destroy()
                if self.onError and (self.status == 0) then
                    self.onError({data = "Timeout", status = 2, time = self.startTime}, self)
                end
            end
        )
    end
end
function SyncRequest.prototype.catch(self, callback)
    self.onError = callback
    return self
end
SyncRequest.prototype["then"] = function(self, callback)
    self.onResponse = callback
    return self
end
function SyncRequest.prototype.allocate(self)
    if ____exports.SyncRequest.index ~= 0 then
        local id = ____exports.SyncRequest.index
        ____exports.SyncRequest.index = ____exports.SyncRequest.indicies[id + 1]
        return id
    else
        ____exports.SyncRequest.counter = ____exports.SyncRequest.counter + 1
        return ____exports.SyncRequest.counter
    end
end
function SyncRequest.prototype.recycle(self)
    ____exports.SyncRequest.indicies[self.id + 1] = ____exports.SyncRequest.index
    ____exports.SyncRequest.index = self.id
end
function SyncRequest.prototype.send(self, packet)
    local prefix = ((packet.chunk == -1) and SYNC_PREFIX) or SYNC_PREFIX_CHUNK
    if (self.from == MapPlayer:fromLocal()) and (not BlzSendSyncData(
        prefix,
        tostring(packet)
    )) then
        print("SyncData: Network Error")
    end
end
function SyncRequest.fromIndex(self, index)
    return self.cache[index + 1]
end
function SyncRequest.init(self)
    if self.initialized then
        return
    end
    do
        local i = 0
        while i < bj_MAX_PLAYER_SLOTS do
            local p = MapPlayer:fromIndex(i)
            if (p.controller == MAP_CONTROL_USER) and (p.slotState == PLAYER_SLOT_STATE_PLAYING) then
                self.eventTrigger:registerPlayerSyncEvent(p, SYNC_PREFIX, false)
                self.eventTrigger:registerPlayerSyncEvent(p, SYNC_PREFIX_CHUNK, false)
            end
            i = i + 1
        end
    end
    self.eventTrigger:addAction(
        function()
            self:onSync()
        end
    )
    self.initialized = true
end
function SyncRequest.onSync(self)
    local packet = __TS__New(
        SyncIncomingPacket,
        BlzGetTriggerSyncPrefix(),
        BlzGetTriggerSyncData()
    )
    if not packet.req then
        return
    end
    local ____obj, ____index = packet.req, "currentChunk"
    ____obj[____index] = ____obj[____index] + 1
    packet.req.chunks[packet.chunk + 1] = packet.data
    if packet.chunk >= packet.chunks then
        if packet.req.onResponse then
            local data = table.concat(packet.req.chunks, "" or ",")
            local status = 1
            packet.req.status = 1
            packet.req:recycle()
            packet.req.onResponse(
                {
                    data = data,
                    status = status,
                    time = getElapsedTime(nil)
                },
                packet.req
            )
        end
    end
end
SyncRequest.cache = {}
SyncRequest.counter = 0
SyncRequest.defaultOptions = {timeout = 0}
SyncRequest.eventTrigger = __TS__New(Trigger)
SyncRequest.index = 0
SyncRequest.indicies = {}
SyncRequest.initialized = false
return ____exports
end,
["node_modules.w3ts.system.index"] = function() local ____exports = {}
do
    local ____export = require("node_modules.w3ts.system.base64")
    for ____exportKey, ____exportValue in pairs(____export) do
        ____exports[____exportKey] = ____exportValue
    end
end
do
    local ____export = require("node_modules.w3ts.system.binaryreader")
    for ____exportKey, ____exportValue in pairs(____export) do
        ____exports[____exportKey] = ____exportValue
    end
end
do
    local ____export = require("node_modules.w3ts.system.binarywriter")
    for ____exportKey, ____exportValue in pairs(____export) do
        ____exports[____exportKey] = ____exportValue
    end
end
do
    local ____export = require("node_modules.w3ts.system.file")
    for ____exportKey, ____exportValue in pairs(____export) do
        ____exports[____exportKey] = ____exportValue
    end
end
do
    local ____export = require("node_modules.w3ts.system.gametime")
    for ____exportKey, ____exportValue in pairs(____export) do
        ____exports[____exportKey] = ____exportValue
    end
end
do
    local ____export = require("node_modules.w3ts.system.sync")
    for ____exportKey, ____exportValue in pairs(____export) do
        ____exports[____exportKey] = ____exportValue
    end
end
return ____exports
end,
["node_modules.w3ts.globals.index"] = function() local ____exports = {}
local ____player = require("node_modules.w3ts.handles.player")
local MapPlayer = ____player.MapPlayer
____exports.Players = {}
do
    local i = 0
    while i < bj_MAX_PLAYERS do
        ____exports.Players[i + 1] = MapPlayer:fromHandle(
            Player(i)
        )
        i = i + 1
    end
end
return ____exports
end,
["node_modules.w3ts.index"] = function() local ____exports = {}
local tsGlobals = require("node_modules.w3ts.globals.index")
do
    local ____export = require("node_modules.w3ts.handles.index")
    for ____exportKey, ____exportValue in pairs(____export) do
        ____exports[____exportKey] = ____exportValue
    end
end
do
    local ____export = require("node_modules.w3ts.hooks.index")
    for ____exportKey, ____exportValue in pairs(____export) do
        ____exports[____exportKey] = ____exportValue
    end
end
do
    local ____export = require("node_modules.w3ts.system.index")
    for ____exportKey, ____exportValue in pairs(____export) do
        ____exports[____exportKey] = ____exportValue
    end
end
____exports.tsGlobals = tsGlobals
return ____exports
end,
["src.app.types.timed-event-queue"] = function() require("lualib_bundle");
local ____exports = {}
local ____index = require("node_modules.w3ts.index")
local Trigger = ____index.Trigger
local ____translators = require("src.lib.translators")
local Util = ____translators.Util
____exports.TimedEventQueue = __TS__Class()
local TimedEventQueue = ____exports.TimedEventQueue
TimedEventQueue.name = "TimedEventQueue"
function TimedEventQueue.prototype.____constructor(self, game)
    self.tick = 0
    self.maxTick = 100000
    self.events = __TS__New(Map)
    self.tickRate = 0.05
    self.ticker = __TS__New(Trigger)
    self.ticker:registerTimerEvent(self.tickRate, true)
    self.ticker:addAction(
        function()
            self.tick = (self.tick + 1) % self.maxTick
            self:HandleTick()
        end
    )
    self.game = game
end
function TimedEventQueue.prototype.HandleTick(self)
    self.events:forEach(
        function(____, event, key)
            if event:AttemptAction(self.tick, self) then
                self.events:delete(key)
            end
        end
    )
end
function TimedEventQueue.prototype.AddEvent(self, event)
    local hash = Util:RandomHash(10)
    event:setTickRate(1000 * self.tickRate)
    self.events:set(hash, event)
    return hash
end
function TimedEventQueue.prototype.RemoveEvent(self, eventHash)
    if self.events:has(eventHash) then
        self.events:delete(eventHash)
    end
end
function TimedEventQueue.prototype.GetEvent(self, eventHash)
    if self.events:has(eventHash) then
        return self.events:get(eventHash)
    end
end
function TimedEventQueue.prototype.GetEventExpireTime(self, event)
    return event:GetEndTick() * self.tickRate
end
function TimedEventQueue.prototype.GetGame(self)
    return self.game
end
return ____exports
end,
["src.app.types.timed-event"] = function() require("lualib_bundle");
local ____exports = {}
____exports.TimedEvent = __TS__Class()
local TimedEvent = ____exports.TimedEvent
TimedEvent.name = "TimedEvent"
function TimedEvent.prototype.____constructor(self, func, time, safe)
    if safe == nil then
        safe = true
    end
    self.safe = safe
    self.time = time
    self.func = function() return func() end
end
function TimedEvent.prototype.setTickRate(self, msPerTick)
    self.time = self.time / msPerTick
end
function TimedEvent.prototype.AttemptAction(self, currentTick, teq)
    if not self.endtime then
        self.endtime = ((currentTick + self.time) % 100000) - 1
        if self.endtime < 0 then
            self.endtime = 0
        end
    end
    if self.endtime <= currentTick then
        self:func()
        return true
    end
    return false
end
function TimedEvent.prototype.GetEndTick(self)
    return self.endtime or 1
end
return ____exports
end,
["src.resources.colours"] = function() local ____exports = {}
____exports.COL_PURPLE = "|cff6f2583"
____exports.COL_TEAL = "|cff00ffff"
____exports.COL_GOOD = "|cff00ff00"
____exports.COL_BAD = "|cff808080"
____exports.COL_ATTATCH = "|cffc81e1e"
____exports.COL_MISC = "|cff808080"
____exports.COL_INFO = "|cff00ffff"
____exports.COL_RESOLVE = "|cffffff00"
____exports.COL_GOLD = "|cffffcc00"
____exports.COL_ALIEN = ____exports.COL_PURPLE
____exports.COL_FLOOR_1 = "|cfff5a742"
____exports.COL_FLOOR_2 = "|cff41dee0"
____exports.COL_CARGO_A = "|cff008080"
____exports.COL_VENTS = "|cff666633"
return ____exports
end,
["src.resources.weapon-tooltips"] = function() local ____exports = {}
local ____colours = require("src.resources.colours")
local COL_ATTATCH = ____colours.COL_ATTATCH
local COL_GOOD = ____colours.COL_GOOD
local COL_INFO = ____colours.COL_INFO
local COL_GOLD = ____colours.COL_GOLD
local COL_MISC = ____colours.COL_MISC
____exports.BURST_RIFLE_EXTENDED = function(damage, accuracyMin, accuracyMax) return ((((("|cff808080Powered by galvanic rails, this old rifle has been in active circulation since the Yulvin succession wars. \nNow many corporations produce upgrades and attachments that further improve upon its baseline functionality.|r\n\nFires a short burst of six bullets with |cff00ffff" .. tostring(accuracyMin)) .. "|r to |cff00ffff") .. tostring(accuracyMax)) .. "|r range, with each bullet dealing |cff00ff00") .. tostring(damage)) .. " damage|r.\n" end
____exports.BURST_RIFLE_ITEM = function(weapon, damage) return (((((("|cff808080Powered by galvanic rails, this old rifle has been in active circulation since the Yulvin succession wars. \nNow many corporations produce upgrades and attachments that further improve upon its baseline functionality.|r\n\nAttached: " .. tostring(
    ((weapon.attachment and (function() return tostring(COL_GOLD) .. tostring(weapon.attachment.name) end)) or (function() return tostring(COL_ATTATCH) .. "Nothing" end))()
)) .. "|r\n\nThe standard issue rifle; ideal for thinning hordes and can dish out serious damage up close.\n") .. tostring(COL_GOOD)) .. "- 6 Shot Burst\n- Each shot does ") .. tostring(damage)) .. " damage\n- Short Cooldown|r\n\n") .. tostring(
    (((not weapon.attachment) and (function() return ((tostring(COL_INFO) .. "Can be enhanced with ") .. tostring(COL_ATTATCH)) .. "kinetic|r attachments.|r" end)) or (function() return (((tostring(COL_GOLD) .. "Equip and type -u to remove ") .. tostring(COL_ATTATCH)) .. tostring(weapon.attachment.name)) .. "|r|r" end))()
) end
____exports.LASER_EXTENDED = function(damage, currentCharges, accuracyMin, accuracyMax) return (((((((("\n" .. tostring(COL_MISC)) .. "Fluff TODO|r\n\nDischarges a focused pulse of prismatic energy, dealing ") .. tostring(COL_GOOD)) .. tostring(damage)) .. " damage|r.\nThe inbuilt A.I recalculates pulse intensity on impact; successive hits increase this weapon's damage by ") .. tostring(COL_GOOD)) .. "50%|r.\n\n") .. tostring(COL_MISC)) .. "2 second cooldown|r\n" end
____exports.LASER_ITEM = function(weapon, damage) return ((((((((((((tostring(COL_MISC) .. "Fluff todo|r\n\nAttached: ") .. tostring(COL_ATTATCH)) .. "Diode Ejector|r\n\nSelf amplifying rifle that increases in damage with each successive hit.\n") .. tostring(COL_GOOD)) .. "- Bad base damage \n- Missing a shot resets intensity\n- |r") .. tostring(COL_ATTATCH)) .. "Diode Ejector|r ") .. tostring(COL_GOOD)) .. "can deal massive damage|r\n\n") .. tostring(COL_ATTATCH)) .. "Diode Ejector|r ") .. tostring(COL_GOLD)) .. "cannot be removed.|r\n" end
____exports.SHOTGUN_EXTENDED = function(damage, accuracyMin, accuracyMax) return ("|cff808080Harkon was a talented mercenary who never could quite find a mercenary company to join, not for want of trying or lack of skill, but for the fact that noone else could survive the insane odds that he casually threw himself into. \nOver the twenty years of his career, he had only one constant companion, and that was his custom-made, hand-engineered, reinforced combat shotgun. The design was sold off after he vanished, and even now there's a shady guy at every port selling 'the real Harkon Blitzer'|r\n\nFires a blast of 26 shots in a cone, each bullet dealing |cff00ff00" .. tostring(damage)) .. "|r damage.\nEvery bullet after the first deals 50% less damage.\n" end
____exports.SHOTGUN_ITEM = function(weapon, damage) return (((((("|cff808080Harkon was a talented mercenary who never could quite find a mercenary company to join, not for want of trying or lack of skill, but for the fact that noone else could survive the insane odds that he casually threw himself into. \nOver the twenty years of his career, he had only one constant companion, and that was his custom-made, hand-engineered, reinforced combat shotgun. The design was sold off after he vanished, and even now there's a shady guy at every port selling 'the real Harkon Blitzer'|r\n\nA close ranged shotgun that deals good damage\n" .. tostring(COL_GOOD)) .. "- Fires a spread of shots\n- Unaffected by Accuracy\n- Fires 26 shots, each dealing |cff00ff00") .. tostring(damage)) .. "|r") .. tostring(COL_GOOD)) .. " damage\n- Additional hits deal half damage of the last\n- Can be heavily customised|r\n\n") .. tostring(
    (((not weapon.attachment) and (function() return ((((tostring(COL_INFO) .. "Can be enhanced with ") .. tostring(COL_ATTATCH)) .. "kinetic|r") .. tostring(COL_INFO)) .. " attachments.|r" end)) or (function() return (((tostring(COL_GOLD) .. "Equip and type -u to remove ") .. tostring(COL_ATTATCH)) .. tostring(weapon.attachment.name)) .. "|r|r" end))()
) end
____exports.TESLA_EXTENDED = function(damage, accuracyMin, accuracyMax) return ((((((((("|cff808080LORE WIP|r\n\nCharges for 0.5 seconds and fires a massive bolt of lightning hitting all units in a line dealing " .. tostring(damage)) .. " damage and applying ") .. tostring(COL_INFO)) .. "Static Shock|r.\n") .. tostring(COL_INFO)) .. "Static Shock|r units explode after 1 second, dealing ") .. tostring(damage / 10)) .. " damage to all other nearby units and applying ") .. tostring(COL_INFO)) .. "Static Shock|r.\n" end
____exports.TESLA_ITEM = function(weapon, damage) return ((((((((((("|cff808080Lore WIP|r\n\nA lightning cannon \n" .. tostring(COL_GOOD)) .. "- Great Damage\n- Charge up time\n- Hits multiple units\n- Applies ") .. tostring(COL_INFO)) .. "Static Shock|r\n- Can be heavily customised|r\n- |r") .. tostring(COL_ATTATCH)) .. "Electrode Cannon|r ") .. tostring(COL_GOOD)) .. "can deal massive damage|r\n\n") .. tostring(COL_ATTATCH)) .. "Electrode Cannon|r ") .. tostring(COL_GOLD)) .. "cannot be removed.|r\n}" end
return ____exports
end,
["src.app.weapons.attachment.attachment"] = function() require("lualib_bundle");
local ____exports = {}
local ____translators = require("src.lib.translators")
local PlayNewSoundOnUnit = ____translators.PlayNewSoundOnUnit
local ____item = require("node_modules.w3ts.handles.item")
local Item = ____item.Item
____exports.Attachment = __TS__Class()
local Attachment = ____exports.Attachment
Attachment.name = "Attachment"
function Attachment.prototype.____constructor(self, item)
    self.name = ""
    self.item = item
    self.itemId = GetItemTypeId(item)
end
function Attachment.prototype.attachTo(self, weapon)
    local canAttach = self:onAttach(weapon)
    if canAttach then
        if weapon.equippedTo then
            local sound = PlayNewSoundOnUnit("Sounds\\attachToGun.mp3", weapon.equippedTo.unit, 50)
        end
        local didAttach = weapon:attach(self)
        if didAttach then
            local ____ = self.item and RemoveItem(self.item)
            self.item = nil
            self.attachedTo = weapon
        end
        return didAttach
    end
    return false
end
function Attachment.prototype.unattach(self)
    self:onDeattach()
    if self.attachedTo and self.attachedTo.equippedTo then
        local unit = self.attachedTo.equippedTo.unit
        local unitHasSpareItemSlot = UnitInventoryCount(unit.handle) < UnitInventorySize(unit.handle)
        local newItem = CreateItem(self.itemId, unit.x, unit.y)
        if unitHasSpareItemSlot then
            unit:addItem(
                Item:fromHandle(newItem)
            )
        end
    end
    self.attachedTo = nil
end
return ____exports
end,
["src.app.weapons.guns.unit-has-weapon"] = function() require("lualib_bundle");
local ____exports = {}
____exports.ArmableUnit = __TS__Class()
local ArmableUnit = ____exports.ArmableUnit
ArmableUnit.name = "ArmableUnit"
function ArmableUnit.prototype.____constructor(self, unit)
    self.unit = unit
end
return ____exports
end,
["src.app.weapons.weapon-constants"] = function() local ____exports = {}
____exports.BURST_RIFLE_ABILITY_ID = FourCC("A002")
____exports.BURST_RIFLE_ITEM_ID = FourCC("I000")
____exports.SNIPER_ABILITY_ID = FourCC("A005")
____exports.SNIPER_ITEM_ID = FourCC("I001")
____exports.LASER_ABILITY_ID = FourCC("A00H")
____exports.LASER_ITEM_ID = FourCC("I004")
____exports.SHOTGUN_ITEM_ID = FourCC("ISHO")
____exports.SHOTGUN_ABILITY_ID = FourCC("ASHO")
____exports.EMS_RIFLING_ABILITY_ID = FourCC("A00A")
____exports.EMS_RIFLING_ITEM_ID = FourCC("I003")
____exports.HIGH_QUALITY_POLYMER_ABILITY_ID = FourCC("A009")
____exports.HIGH_QUALITY_POLYMER_ITEM_ID = FourCC("I002")
____exports.AT_ITEM_DRAGONFIRE_BLAST = FourCC("IDGN")
____exports.AT_ABILITY_DRAGONFIRE_BLAST = FourCC("ADGN")
return ____exports
end,
["src.resources.ability-ids"] = function() local ____exports = {}
____exports.ABIL_CREWMEMBER_INFO = FourCC("A008")
____exports.ABIL_TRANSFORM_HUMAN_ALIEN = FourCC("TF01")
____exports.ABIL_TRANSFORM_ALIEN_HUMAN = FourCC("TF02")
____exports.ABIL_HUMAN_SPRINT = FourCC("A003")
____exports.ABIL_ALIEN_ACID_POOL = FourCC("ACID")
____exports.ABIL_ALIEN_LEAP = FourCC("LEAP")
____exports.ABIL_WEP_GRENADE = FourCC("GREN")
____exports.ABIL_WEP_DIODE_EJ = FourCC("DIOJ")
____exports.ABIL_ALIEN_SCREAM = FourCC("A00G")
____exports.ABIL_ITEM_REPAIR = FourCC("A00J")
____exports.ABIL_ACCURACY_PENALTY_30 = FourCC("A00E")
____exports.ABIL_ACCURACY_BONUS_30 = FourCC("A00F")
____exports.FIRE_ARMOR_REDUCTION = FourCC("AFIR")
____exports.SPRINT_BUFF_ID = FourCC("B000")
____exports.TECH_WEP_DAMAGE = FourCC("RDAM")
____exports.TECH_MAJOR_WEAPONS_PRODUCTION = FourCC("RWEP")
____exports.TECH_MAJOR_HEALTHCARE = FourCC("RMED")
____exports.TECH_NO_UNIT_IN_SPLICER = FourCC("RGEN")
____exports.TECH_NO_GENES_TIER_1 = FourCC("RGN1")
____exports.TECH_NO_GENES_TIER_2 = FourCC("RGN2")
____exports.TECH_NO_GENES_TIER_3 = FourCC("RGN3")
____exports.TECH_HAS_GENES_TIER_1 = FourCC("RPG1")
____exports.TECH_HAS_GENES_TIER_2 = FourCC("RPG1")
____exports.TECH_HAS_GENES_TIER_3 = FourCC("RPG1")
____exports.GENE_INSTALL_NIGHTEYE = FourCC("A00I")
____exports.ABIL_NIGHTEYE = FourCC("ANEG")
____exports.GENE_INSTALL_MOBILITY = FourCC("AGJP")
____exports.GENE_TECH_MOBILITY = FourCC("R001")
____exports.GENE_INSTALL_PSIONIC_POTENCY = FourCC("AGPS")
____exports.GENE_INSTALL_COSMIC_SENSITIVITY = FourCC("AGPS")
____exports.SMART_ORDER_ID = 851971
____exports.UNIT_IS_FLY = FourCC("A00C")
____exports.TECH_CREWMEMBER_ATTACK_ENABLE = FourCC("RATK")
return ____exports
end,
["src.app.weapons.guns.burst-rifle"] = function() require("lualib_bundle");
local ____exports = {}
local ____vector3 = require("src.app.types.vector3")
local Vector3 = ____vector3.Vector3
local ____gun = require("src.app.weapons.guns.gun")
local Gun = ____gun.Gun
local ____projectile = require("src.app.weapons.projectile.projectile")
local Projectile = ____projectile.Projectile
local ____projectile_2Dtarget = require("src.app.weapons.projectile.projectile-target")
local ProjectileTargetStatic = ____projectile_2Dtarget.ProjectileTargetStatic
local ____timed_2Devent = require("src.app.types.timed-event")
local TimedEvent = ____timed_2Devent.TimedEvent
local ____vector2 = require("src.app.types.vector2")
local Vector2 = ____vector2.Vector2
local ____weapon_2Dtooltips = require("src.resources.weapon-tooltips")
local BURST_RIFLE_EXTENDED = ____weapon_2Dtooltips.BURST_RIFLE_EXTENDED
local BURST_RIFLE_ITEM = ____weapon_2Dtooltips.BURST_RIFLE_ITEM
local ____translators = require("src.lib.translators")
local PlayNewSoundOnUnit = ____translators.PlayNewSoundOnUnit
local ____weapon_2Dconstants = require("src.app.weapons.weapon-constants")
local BURST_RIFLE_ABILITY_ID = ____weapon_2Dconstants.BURST_RIFLE_ABILITY_ID
local BURST_RIFLE_ITEM_ID = ____weapon_2Dconstants.BURST_RIFLE_ITEM_ID
____exports.InitBurstRifle = function(weaponModule)
    __TS__ArrayPush(weaponModule.weaponItemIds, BURST_RIFLE_ITEM_ID)
    __TS__ArrayPush(weaponModule.weaponAbilityIds, BURST_RIFLE_ABILITY_ID)
end
____exports.BurstRifle = __TS__Class()
local BurstRifle = ____exports.BurstRifle
BurstRifle.name = "BurstRifle"
BurstRifle.____super = Gun
setmetatable(BurstRifle, BurstRifle.____super)
setmetatable(BurstRifle.prototype, BurstRifle.____super.prototype)
function BurstRifle.prototype.____constructor(self, item, equippedTo)
    Gun.prototype.____constructor(self, item, equippedTo)
    self.spreadAOE = 240
    self.bulletDistance = 1400
end
function BurstRifle.prototype.applyWeaponAttackValues(self, weaponModule, caster)
    caster.unit:setAttackCooldown(1, 1)
    self.equippedTo.unit:setBaseDamage(
        self:getDamage(weaponModule, caster) - 1,
        0
    )
    caster.unit.acquireRange = self.bulletDistance * 0.8
    BlzSetUnitWeaponRealField(self.equippedTo.unit.handle, UNIT_WEAPON_RF_ATTACK_RANGE, 1, self.bulletDistance * 0.7)
    BlzSetUnitWeaponIntegerField(self.equippedTo.unit.handle, UNIT_WEAPON_IF_ATTACK_ATTACK_TYPE, 0, 2)
end
function BurstRifle.prototype.onShoot(self, weaponModule, caster, targetLocation)
    Gun.prototype.onShoot(self, weaponModule, caster, targetLocation)
    local unit = caster.unit.handle
    local sound = PlayNewSoundOnUnit("Sounds\\BattleRifleShoot.mp3", caster.unit, 50)
    local casterLoc = __TS__New(
        Vector3,
        GetUnitX(unit),
        GetUnitY(unit),
        BlzGetUnitZ(unit)
    ):projectTowardsGunModel(unit)
    local targetDistance = __TS__New(Vector2, targetLocation.x - casterLoc.x, targetLocation.y - casterLoc.y):normalise():multiplyN(self.bulletDistance)
    local newTargetLocation = __TS__New(Vector3, targetDistance.x + casterLoc.x, targetDistance.y + casterLoc.y, targetLocation.z)
    local delay = 0
    do
        local i = 0
        while i < 5 do
            weaponModule.game.timedEventQueue:AddEvent(
                __TS__New(
                    TimedEvent,
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
    local unit = caster.unit.handle
    local casterLoc = __TS__New(
        Vector3,
        GetUnitX(unit),
        GetUnitY(unit),
        BlzGetUnitZ(unit)
    ):projectTowardsGunModel(unit)
    local strayTarget = self:getStrayLocation(targetLocation, caster)
    local deltaTarget = strayTarget:subtract(casterLoc)
    local projectile = __TS__New(
        Projectile,
        unit,
        casterLoc,
        __TS__New(ProjectileTargetStatic, deltaTarget)
    )
    projectile:setCollisionRadius(15):setVelocity(2400):onCollide(
        function(weaponModule, projectile, collidesWith) return self:onProjectileCollide(weaponModule, projectile, collidesWith) end
    ):addEffect(
        "war3mapImported\\Bullet.mdx",
        __TS__New(Vector3, 0, 0, 0),
        deltaTarget:normalise(),
        1.4
    )
    weaponModule:addProjectile(projectile)
end
function BurstRifle.prototype.onProjectileCollide(self, weaponModule, projectile, collidesWith)
    projectile:setDestroy(true)
    if self.equippedTo then
        local crewmember = weaponModule.game.crewModule:getCrewmemberForUnit(self.equippedTo.unit)
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
function BurstRifle.prototype.getTooltip(self, weaponModule, crewmember)
    local minDistance = self.spreadAOE - (self:getStrayValue(crewmember) / 2)
    local newTooltip = BURST_RIFLE_EXTENDED(
        self:getDamage(weaponModule, crewmember),
        minDistance,
        self.spreadAOE
    )
    return newTooltip
end
function BurstRifle.prototype.getItemTooltip(self, weaponModule, crewmember)
    local damage = self:getDamage(weaponModule, crewmember)
    return BURST_RIFLE_ITEM(self, damage)
end
function BurstRifle.prototype.getDamage(self, weaponModule, caster)
    if self.attachment and (self.attachment.name == "Ems Rifling") then
        return MathRound(
            20 * caster:getDamageBonusMult()
        )
    end
    return MathRound(
        15 * caster:getDamageBonusMult()
    )
end
function BurstRifle.prototype.getAbilityId(self)
    return BURST_RIFLE_ABILITY_ID
end
function BurstRifle.prototype.getItemId(self)
    return BURST_RIFLE_ITEM_ID
end
return ____exports
end,
["src.app.weapons.attachment.high-quality-polymer"] = function() require("lualib_bundle");
local ____exports = {}
local ____attachment = require("src.app.weapons.attachment.attachment")
local Attachment = ____attachment.Attachment
local ____serilog = require("src.lib.serilog.serilog")
local Log = ____serilog.Log
local ____weapon_2Dconstants = require("src.app.weapons.weapon-constants")
local BURST_RIFLE_ABILITY_ID = ____weapon_2Dconstants.BURST_RIFLE_ABILITY_ID
local HIGH_QUALITY_POLYMER_ABILITY_ID = ____weapon_2Dconstants.HIGH_QUALITY_POLYMER_ABILITY_ID
____exports.HighQualityPolymer = __TS__Class()
local HighQualityPolymer = ____exports.HighQualityPolymer
HighQualityPolymer.name = "HighQualityPolymer"
HighQualityPolymer.____super = Attachment
setmetatable(HighQualityPolymer, HighQualityPolymer.____super)
setmetatable(HighQualityPolymer.prototype, HighQualityPolymer.____super.prototype)
function HighQualityPolymer.prototype.____constructor(self, ...)
    Attachment.prototype.____constructor(self, ...)
    self.name = "High Quality Polymer"
end
function HighQualityPolymer.prototype.onAttach(self, weapon)
    if weapon:getAbilityId() == BURST_RIFLE_ABILITY_ID then
        if weapon.equippedTo then
            UnitAddAbility(weapon.equippedTo.unit.handle, HIGH_QUALITY_POLYMER_ABILITY_ID)
        end
        return true
    end
    return false
end
function HighQualityPolymer.prototype.onDeattach(self)
    if self.attachedTo and self.attachedTo.equippedTo then
        UnitRemoveAbility(self.attachedTo.equippedTo.unit.handle, HIGH_QUALITY_POLYMER_ABILITY_ID)
    end
end
function HighQualityPolymer.prototype.onEquip(self, weapon)
    Log.Information("Re-equiping gun with hqp attachment")
    if weapon and weapon.equippedTo then
        UnitAddAbility(weapon.equippedTo.unit.handle, HIGH_QUALITY_POLYMER_ABILITY_ID)
    end
end
function HighQualityPolymer.prototype.onUnequip(self, weapon)
    Log.Information("Unequiping gun with hqp attachment")
    if weapon and weapon.equippedTo then
        UnitRemoveAbility(weapon.equippedTo.unit.handle, HIGH_QUALITY_POLYMER_ABILITY_ID)
    end
end
return ____exports
end,
["src.app.weapons.attachment.em-rifling"] = function() require("lualib_bundle");
local ____exports = {}
local ____attachment = require("src.app.weapons.attachment.attachment")
local Attachment = ____attachment.Attachment
local ____serilog = require("src.lib.serilog.serilog")
local Log = ____serilog.Log
local ____weapon_2Dconstants = require("src.app.weapons.weapon-constants")
local BURST_RIFLE_ABILITY_ID = ____weapon_2Dconstants.BURST_RIFLE_ABILITY_ID
local EMS_RIFLING_ABILITY_ID = ____weapon_2Dconstants.EMS_RIFLING_ABILITY_ID
____exports.EmsRifling = __TS__Class()
local EmsRifling = ____exports.EmsRifling
EmsRifling.name = "EmsRifling"
EmsRifling.____super = Attachment
setmetatable(EmsRifling, EmsRifling.____super)
setmetatable(EmsRifling.prototype, EmsRifling.____super.prototype)
function EmsRifling.prototype.____constructor(self, ...)
    Attachment.prototype.____constructor(self, ...)
    self.name = "Ems Rifling"
end
function EmsRifling.prototype.onAttach(self, weapon)
    if weapon:getAbilityId() == BURST_RIFLE_ABILITY_ID then
        if weapon.equippedTo then
            weapon.equippedTo.unit:addAbility(EMS_RIFLING_ABILITY_ID)
        end
        return true
    end
    return false
end
function EmsRifling.prototype.onDeattach(self)
    if self.attachedTo and self.attachedTo.equippedTo then
        UnitRemoveAbility(self.attachedTo.equippedTo.unit.handle, EMS_RIFLING_ABILITY_ID)
    end
end
function EmsRifling.prototype.onEquip(self, weapon)
    Log.Information("Re-equiping gun with hqp attachment")
    if weapon and weapon.equippedTo then
        UnitAddAbility(weapon.equippedTo.unit.handle, EMS_RIFLING_ABILITY_ID)
    end
end
function EmsRifling.prototype.onUnequip(self, weapon)
    Log.Information("Unequiping gun with hqp attachment")
    if weapon and weapon.equippedTo then
        UnitRemoveAbility(weapon.equippedTo.unit.handle, EMS_RIFLING_ABILITY_ID)
    end
end
return ____exports
end,
["src.app.weapons.attachment.diode-ejector"] = function() require("lualib_bundle");
local ____exports = {}
local ____attachment = require("src.app.weapons.attachment.attachment")
local Attachment = ____attachment.Attachment
local ____weapon_2Dconstants = require("src.app.weapons.weapon-constants")
local LASER_ABILITY_ID = ____weapon_2Dconstants.LASER_ABILITY_ID
local ____ability_2Dids = require("src.resources.ability-ids")
local ABIL_WEP_DIODE_EJ = ____ability_2Dids.ABIL_WEP_DIODE_EJ
____exports.DiodeEjector = __TS__Class()
local DiodeEjector = ____exports.DiodeEjector
DiodeEjector.name = "DiodeEjector"
DiodeEjector.____super = Attachment
setmetatable(DiodeEjector, DiodeEjector.____super)
setmetatable(DiodeEjector.prototype, DiodeEjector.____super.prototype)
function DiodeEjector.prototype.____constructor(self, ...)
    Attachment.prototype.____constructor(self, ...)
    self.name = "Diode Ejector"
end
function DiodeEjector.prototype.onAttach(self, weapon)
    if weapon:getAbilityId() == LASER_ABILITY_ID then
        if weapon.equippedTo then
            weapon.equippedTo.unit:addAbility(ABIL_WEP_DIODE_EJ)
        end
        return true
    end
    return false
end
function DiodeEjector.prototype.onDeattach(self)
end
function DiodeEjector.prototype.onEquip(self, weapon)
    if weapon and weapon.equippedTo then
        weapon.equippedTo.unit:addAbility(ABIL_WEP_DIODE_EJ)
        BlzSetUnitAbilityCooldown(
            weapon.equippedTo.unit.handle,
            ABIL_WEP_DIODE_EJ,
            0,
            BlzGetAbilityCooldown(ABIL_WEP_DIODE_EJ, 0)
        )
    end
end
function DiodeEjector.prototype.onUnequip(self, weapon)
    if weapon and weapon.equippedTo then
        weapon.equippedTo.unit:removeAbility(ABIL_WEP_DIODE_EJ)
    end
end
return ____exports
end,
["src.app.weapons.guns.laser-rifle"] = function() require("lualib_bundle");
local ____exports = {}
local ____vector3 = require("src.app.types.vector3")
local Vector3 = ____vector3.Vector3
local ____gun = require("src.app.weapons.guns.gun")
local Gun = ____gun.Gun
local ____projectile = require("src.app.weapons.projectile.projectile")
local Projectile = ____projectile.Projectile
local ____projectile_2Dtarget = require("src.app.weapons.projectile.projectile-target")
local ProjectileTargetStatic = ____projectile_2Dtarget.ProjectileTargetStatic
local ____vector2 = require("src.app.types.vector2")
local Vector2 = ____vector2.Vector2
local ____weapon_2Dtooltips = require("src.resources.weapon-tooltips")
local LASER_EXTENDED = ____weapon_2Dtooltips.LASER_EXTENDED
local LASER_ITEM = ____weapon_2Dtooltips.LASER_ITEM
local ____translators = require("src.lib.translators")
local PlayNewSoundOnUnit = ____translators.PlayNewSoundOnUnit
local ____weapon_2Dconstants = require("src.app.weapons.weapon-constants")
local LASER_ITEM_ID = ____weapon_2Dconstants.LASER_ITEM_ID
local LASER_ABILITY_ID = ____weapon_2Dconstants.LASER_ABILITY_ID
local ____diode_2Dejector = require("src.app.weapons.attachment.diode-ejector")
local DiodeEjector = ____diode_2Dejector.DiodeEjector
local INTENSITY_MAX = 4
____exports.InitLaserRifle = function(weaponModule)
    __TS__ArrayPush(weaponModule.weaponItemIds, LASER_ITEM_ID)
    __TS__ArrayPush(weaponModule.weaponAbilityIds, LASER_ABILITY_ID)
end
____exports.LaserRifle = __TS__Class()
local LaserRifle = ____exports.LaserRifle
LaserRifle.name = "LaserRifle"
LaserRifle.____super = Gun
setmetatable(LaserRifle, LaserRifle.____super)
setmetatable(LaserRifle.prototype, LaserRifle.____super.prototype)
function LaserRifle.prototype.____constructor(self, item, equippedTo)
    Gun.prototype.____constructor(self, item, equippedTo)
    self.intensity = 0
    self.collideDict = __TS__New(Map)
    self.spreadAOE = 100
    self.bulletDistance = 2100
    self.attachment = __TS__New(DiodeEjector, item)
end
function LaserRifle.prototype.applyWeaponAttackValues(self, weaponModule, caster)
    caster.unit:setAttackCooldown(1.5, 1)
    self.equippedTo.unit:setBaseDamage(
        self:getDamage(weaponModule, caster) - 1,
        0
    )
    caster.unit.acquireRange = self.bulletDistance * 0.8
    BlzSetUnitWeaponIntegerField(self.equippedTo.unit.handle, UNIT_WEAPON_IF_ATTACK_ATTACK_TYPE, 0, 5)
    BlzSetUnitWeaponRealField(self.equippedTo.unit.handle, UNIT_WEAPON_RF_ATTACK_RANGE, 1, self.bulletDistance * 0.7)
    BlzSetUnitWeaponIntegerField(self.equippedTo.unit.handle, UNIT_WEAPON_IF_ATTACK_TARGETS_ALLOWED, 0, 2)
end
function LaserRifle.prototype.onShoot(self, weaponModule, caster, targetLocation)
    Gun.prototype.onShoot(self, weaponModule, caster, targetLocation)
    local unit = caster.unit.handle
    PlayNewSoundOnUnit(
        self:getSoundPath(),
        caster.unit,
        127
    )
    local casterLoc = __TS__New(
        Vector3,
        GetUnitX(unit),
        GetUnitY(unit),
        BlzGetUnitZ(unit)
    ):projectTowardsGunModel(unit)
    local targetDistance = __TS__New(Vector2, targetLocation.x - casterLoc.x, targetLocation.y - casterLoc.y):normalise():multiplyN(self.bulletDistance)
    local newTargetLocation = __TS__New(Vector3, targetDistance.x + casterLoc.x, targetDistance.y + casterLoc.y, targetLocation.z)
    self:fireProjectile(weaponModule, caster, newTargetLocation)
end
function LaserRifle.prototype.fireProjectile(self, weaponModule, caster, targetLocation)
    local unit = caster.unit.handle
    local casterLoc = __TS__New(
        Vector3,
        GetUnitX(unit),
        GetUnitY(unit),
        BlzGetUnitZ(unit)
    ):projectTowardsGunModel(unit)
    local strayTarget = self:getStrayLocation(targetLocation, caster)
    local deltaTarget = strayTarget:subtract(casterLoc)
    local projectile = __TS__New(
        Projectile,
        unit,
        casterLoc,
        __TS__New(ProjectileTargetStatic, deltaTarget)
    )
    projectile:addEffect(
        self:getModelPath(),
        __TS__New(Vector3, 0, 0, 0),
        deltaTarget:normalise(),
        1.6
    )
    projectile:setVelocity(3000):onCollide(
        function(weaponModule, projectile, collidesWith) return self:onProjectileCollide(weaponModule, projectile, collidesWith) end
    ):onDeath(
        function(____self, weaponModule, projectile)
            local didCollide = self.collideDict:get(
                projectile:getId()
            )
            if not didCollide then
                if self.intensity > 1 then
                    PlayNewSoundOnUnit("war3mapImported\\laserMiss.mp3", caster.unit, 30)
                end
                self.intensity = 0
            else
                self.collideDict:delete(
                    projectile:getId()
                )
                PlayNewSoundOnUnit("Sounds\\LaserConfirmedHit.mp3", caster.unit, 80)
            end
            self:updateTooltip(weaponModule, caster)
        end
    )
    weaponModule:addProjectile(projectile)
end
function LaserRifle.prototype.onProjectileCollide(self, weaponModule, projectile, collidesWith)
    self.collideDict:set(
        projectile:getId(),
        true
    )
    projectile:setDestroy(true)
    self.intensity = math.min(self.intensity + 1, INTENSITY_MAX)
    if self.equippedTo then
        local crewmember = weaponModule.game.crewModule:getCrewmemberForUnit(self.equippedTo.unit)
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
function LaserRifle.prototype.getTooltip(self, weaponModule, crewmember)
    local minDistance = self.spreadAOE - (self:getStrayValue(crewmember) / 2)
    local newTooltip = LASER_EXTENDED(
        self:getDamage(weaponModule, crewmember),
        self.intensity,
        minDistance,
        self.spreadAOE
    )
    return newTooltip
end
function LaserRifle.prototype.getItemTooltip(self, weaponModule, crewmember)
    local damage = self:getDamage(weaponModule, crewmember)
    return LASER_ITEM(self, damage)
end
function LaserRifle.prototype.getDamage(self, weaponModule, caster)
    return MathRound(
        (25 * Pow(1.5, self.intensity)) * caster:getDamageBonusMult()
    )
end
function LaserRifle.prototype.getIntensity(self)
    return self.intensity
end
function LaserRifle.prototype.getAbilityId(self)
    return LASER_ABILITY_ID
end
function LaserRifle.prototype.getItemId(self)
    return LASER_ITEM_ID
end
function LaserRifle.prototype.getModelPath(self)
    local ____switch22 = self.intensity
    if ____switch22 == 0 then
        goto ____switch22_case_0
    elseif ____switch22 == 1 then
        goto ____switch22_case_1
    elseif ____switch22 == 2 then
        goto ____switch22_case_2
    elseif ____switch22 == 3 then
        goto ____switch22_case_3
    end
    goto ____switch22_case_default
    ::____switch22_case_0::
    do
        return "Weapons\\Laser1.mdx"
    end
    ::____switch22_case_1::
    do
        return "Weapons\\Laser2.mdx"
    end
    ::____switch22_case_2::
    do
        return "Weapons\\Laser3.mdx"
    end
    ::____switch22_case_3::
    do
        return "Weapons\\Laser4.mdx"
    end
    ::____switch22_case_default::
    do
        return "Weapons\\Laser5.mdx"
    end
    ::____switch22_end::
end
function LaserRifle.prototype.getSoundPath(self)
    local ____switch24 = self.intensity
    if ____switch24 == 0 then
        goto ____switch24_case_0
    elseif ____switch24 == 1 then
        goto ____switch24_case_1
    elseif ____switch24 == 2 then
        goto ____switch24_case_2
    elseif ____switch24 == 3 then
        goto ____switch24_case_3
    end
    goto ____switch24_case_default
    ::____switch24_case_0::
    do
        return "Sounds\\Laser1.mp3"
    end
    ::____switch24_case_1::
    do
        return "Sounds\\Laser2.mp3"
    end
    ::____switch24_case_2::
    do
        return "Sounds\\Laser3.mp3"
    end
    ::____switch24_case_3::
    do
        return "Sounds\\Laser4.mp3"
    end
    ::____switch24_case_default::
    do
        return "Sounds\\Laser5.mp3"
    end
    ::____switch24_end::
end
function LaserRifle.prototype.setIntensity(self, val)
    self.intensity = val
end
return ____exports
end,
["src.lib.utils"] = function() require("lualib_bundle");
local ____exports = {}
local ____vector2 = require("src.app.types.vector2")
local Vector2 = ____vector2.Vector2
local TEMP_LOCATION = Location(0, 0)
function ____exports.getZFromXY(x, y)
    MoveLocation(TEMP_LOCATION, x, y)
    return GetLocationZ(TEMP_LOCATION)
end
function ____exports.getPointsInRangeWithSpread(angleDegLeft, angleDegRight, numLocs, distance, centralModifier)
    local result = {}
    local endAngle = angleDegRight
    local currentAngle = angleDegLeft
    local incrementBy = (endAngle - currentAngle) / numLocs
    while currentAngle <= endAngle do
        local distanceModifier = ((centralModifier and (function() return 1 + (Sin((#result / numLocs) * bj_PI) * centralModifier) end)) or (function() return 1 end))()
        __TS__ArrayPush(
            result,
            __TS__New(Vector2, 0, 0):applyPolarOffset(currentAngle, distance * distanceModifier)
        )
        currentAngle = currentAngle + incrementBy
    end
    return result
end
return ____exports
end,
["src.app.weapons.guns.shotgun"] = function() require("lualib_bundle");
local ____exports = {}
local ____vector3 = require("src.app.types.vector3")
local Vector3 = ____vector3.Vector3
local ____gun = require("src.app.weapons.guns.gun")
local Gun = ____gun.Gun
local ____projectile = require("src.app.weapons.projectile.projectile")
local Projectile = ____projectile.Projectile
local ____projectile_2Dtarget = require("src.app.weapons.projectile.projectile-target")
local ProjectileTargetStatic = ____projectile_2Dtarget.ProjectileTargetStatic
local ____weapon_2Dtooltips = require("src.resources.weapon-tooltips")
local SHOTGUN_EXTENDED = ____weapon_2Dtooltips.SHOTGUN_EXTENDED
local SHOTGUN_ITEM = ____weapon_2Dtooltips.SHOTGUN_ITEM
local ____translators = require("src.lib.translators")
local PlayNewSoundOnUnit = ____translators.PlayNewSoundOnUnit
local ____weapon_2Dconstants = require("src.app.weapons.weapon-constants")
local SHOTGUN_ABILITY_ID = ____weapon_2Dconstants.SHOTGUN_ABILITY_ID
local SHOTGUN_ITEM_ID = ____weapon_2Dconstants.SHOTGUN_ITEM_ID
local ____utils = require("src.lib.utils")
local getPointsInRangeWithSpread = ____utils.getPointsInRangeWithSpread
local getZFromXY = ____utils.getZFromXY
____exports.InitShotgun = function(weaponModule)
    __TS__ArrayPush(weaponModule.weaponItemIds, SHOTGUN_ITEM_ID)
    __TS__ArrayPush(weaponModule.weaponAbilityIds, SHOTGUN_ABILITY_ID)
end
____exports.Shotgun = __TS__Class()
local Shotgun = ____exports.Shotgun
Shotgun.name = "Shotgun"
Shotgun.____super = Gun
setmetatable(Shotgun, Shotgun.____super)
setmetatable(Shotgun.prototype, Shotgun.____super.prototype)
function Shotgun.prototype.____constructor(self, item, equippedTo)
    Gun.prototype.____constructor(self, item, equippedTo)
    self.unitsHit = __TS__New(Map)
    self.spreadAOE = 240
    self.bulletDistance = 300
end
function Shotgun.prototype.applyWeaponAttackValues(self, weaponModule, caster)
    caster.unit:setAttackCooldown(1.5, 1)
    self.equippedTo.unit:setBaseDamage(
        self:getDamage(weaponModule, caster) - 1,
        0
    )
    caster.unit.acquireRange = 450
    BlzSetUnitWeaponIntegerField(
        self.equippedTo.unit.handle,
        ConvertUnitWeaponIntegerField(
            FourCC("ua1t")
        ),
        0,
        2
    )
    BlzSetUnitWeaponRealField(self.equippedTo.unit.handle, UNIT_WEAPON_RF_ATTACK_RANGE, 1, 400)
end
function Shotgun.prototype.onShoot(self, weaponModule, caster, targetLocation)
    Gun.prototype.onShoot(self, weaponModule, caster, targetLocation)
    self.unitsHit:clear()
    local unit = caster.unit.handle
    local sound = PlayNewSoundOnUnit("Sounds\\ShotgunShoot.mp3", caster.unit, 50)
    local NUM_BULLETS = 26
    local casterLoc = __TS__New(
        Vector3,
        GetUnitX(unit),
        GetUnitY(unit),
        BlzGetUnitZ(unit)
    ):projectTowardsGunModel(unit)
    local angleDeg = casterLoc:angle2Dto(targetLocation)
    local deltaLocs = getPointsInRangeWithSpread(angleDeg - 15, angleDeg + 15, NUM_BULLETS, self.bulletDistance, 1.3)
    local centerTargetLoc = casterLoc:projectTowards2D(angleDeg, self.bulletDistance * 1.4)
    centerTargetLoc.z = getZFromXY(centerTargetLoc.x, centerTargetLoc.y)
    self:fireProjectile(weaponModule, caster, centerTargetLoc, true):onCollide(
        function(weaponModule, projectile, collidesWith)
            self:onProjectileCollide(weaponModule, projectile, collidesWith)
        end
    )
    local bulletsHit = 0
    __TS__ArrayForEach(
        deltaLocs,
        function(____, loc, index)
            local nX = casterLoc.x + loc.x
            local nY = casterLoc.y + loc.y
            local targetLoc = __TS__New(
                Vector3,
                nX,
                nY,
                getZFromXY(nX, nY)
            )
            self:fireProjectile(weaponModule, caster, targetLoc, false):onCollide(
                function(weaponModule, projectile, collidesWith)
                    self:onProjectileCollide(weaponModule, projectile, collidesWith)
                end
            )
        end
    )
end
function Shotgun.prototype.fireProjectile(self, weaponModule, caster, targetLocation, isCentralProjectile)
    local unit = caster.unit.handle
    local casterLoc = __TS__New(
        Vector3,
        GetUnitX(unit),
        GetUnitY(unit),
        BlzGetUnitZ(unit)
    ):projectTowardsGunModel(unit)
    local deltaTarget = targetLocation:subtract(casterLoc)
    local projectile = __TS__New(
        Projectile,
        unit,
        casterLoc,
        __TS__New(ProjectileTargetStatic, deltaTarget)
    )
    BlzSetSpecialEffectAlpha(
        projectile:addEffect(
            (isCentralProjectile and "Abilities\\Spells\\Orc\\Shockwave\\ShockwaveMissile.mdl") or "war3mapImported\\Bullet.mdx",
            __TS__New(Vector3, 0, 0, 0),
            deltaTarget:normalise(),
            (isCentralProjectile and 0.6) or 1.4
        ),
        250
    )
    weaponModule:addProjectile(projectile)
    return projectile:setCollisionRadius(15):setVelocity(2400)
end
function Shotgun.prototype.onProjectileCollide(self, weaponModule, projectile, collidesWith)
    projectile:setDestroy(true)
    if self.equippedTo then
        local crewmember = weaponModule.game.crewModule:getCrewmemberForUnit(self.equippedTo.unit)
        local timesUnitHit = self.unitsHit:get(collidesWith) or 0
        self.unitsHit:set(collidesWith, timesUnitHit + 1)
        if crewmember then
            local damage = self:getDamage(weaponModule, crewmember) / Pow(2, timesUnitHit)
            UnitDamageTarget(projectile.source, collidesWith, damage, false, true, ATTACK_TYPE_PIERCE, DAMAGE_TYPE_NORMAL, WEAPON_TYPE_WOOD_MEDIUM_STAB)
        end
    end
end
function Shotgun.prototype.getTooltip(self, weaponModule, crewmember)
    local minDistance = self.spreadAOE - (self:getStrayValue(crewmember) / 2)
    local newTooltip = SHOTGUN_EXTENDED(
        self:getDamage(weaponModule, crewmember),
        minDistance,
        self.spreadAOE
    )
    return newTooltip
end
function Shotgun.prototype.getItemTooltip(self, weaponModule, crewmember)
    local damage = self:getDamage(weaponModule, crewmember)
    return SHOTGUN_ITEM(self, damage)
end
function Shotgun.prototype.getDamage(self, weaponModule, caster)
    return MathRound(
        35 * caster:getDamageBonusMult()
    )
end
function Shotgun.prototype.getAbilityId(self)
    return SHOTGUN_ABILITY_ID
end
function Shotgun.prototype.getItemId(self)
    return SHOTGUN_ITEM_ID
end
return ____exports
end,
["src.app.weapons.attachment.rail-rifle"] = function() require("lualib_bundle");
local ____exports = {}
local ____attachment = require("src.app.weapons.attachment.attachment")
local Attachment = ____attachment.Attachment
local ____weapon_2Dconstants = require("src.app.weapons.weapon-constants")
local BURST_RIFLE_ABILITY_ID = ____weapon_2Dconstants.BURST_RIFLE_ABILITY_ID
local SNIPER_ABILITY_ID = ____weapon_2Dconstants.SNIPER_ABILITY_ID
local SHOTGUN_ABILITY_ID = ____weapon_2Dconstants.SHOTGUN_ABILITY_ID
____exports.RailRifle = __TS__Class()
local RailRifle = ____exports.RailRifle
RailRifle.name = "RailRifle"
RailRifle.____super = Attachment
setmetatable(RailRifle, RailRifle.____super)
setmetatable(RailRifle.prototype, RailRifle.____super.prototype)
function RailRifle.prototype.____constructor(self, ...)
    Attachment.prototype.____constructor(self, ...)
    self.name = "Rail Rifle"
end
function RailRifle.prototype.onAttach(self, weapon)
    if (weapon:getAbilityId() == BURST_RIFLE_ABILITY_ID) or (weapon:getAbilityId() == SHOTGUN_ABILITY_ID) then
        if weapon.equippedTo then
            weapon.equippedTo.unit:addAbility(SNIPER_ABILITY_ID)
        end
        return true
    end
    return false
end
function RailRifle.prototype.onDeattach(self)
    if self.attachedTo and self.attachedTo.equippedTo then
        UnitRemoveAbility(self.attachedTo.equippedTo.unit.handle, SNIPER_ABILITY_ID)
    end
end
function RailRifle.prototype.onEquip(self, weapon)
    if weapon and weapon.equippedTo then
        UnitAddAbility(weapon.equippedTo.unit.handle, SNIPER_ABILITY_ID)
    end
end
function RailRifle.prototype.onUnequip(self, weapon)
    if weapon and weapon.equippedTo then
        UnitRemoveAbility(weapon.equippedTo.unit.handle, SNIPER_ABILITY_ID)
    end
end
return ____exports
end,
["src.app.weapons.attachment.dragonfire-barrel"] = function() require("lualib_bundle");
local ____exports = {}
local ____attachment = require("src.app.weapons.attachment.attachment")
local Attachment = ____attachment.Attachment
local ____weapon_2Dconstants = require("src.app.weapons.weapon-constants")
local BURST_RIFLE_ABILITY_ID = ____weapon_2Dconstants.BURST_RIFLE_ABILITY_ID
local SHOTGUN_ABILITY_ID = ____weapon_2Dconstants.SHOTGUN_ABILITY_ID
local AT_ABILITY_DRAGONFIRE_BLAST = ____weapon_2Dconstants.AT_ABILITY_DRAGONFIRE_BLAST
____exports.DragonfireBarrelAttachment = __TS__Class()
local DragonfireBarrelAttachment = ____exports.DragonfireBarrelAttachment
DragonfireBarrelAttachment.name = "DragonfireBarrelAttachment"
DragonfireBarrelAttachment.____super = Attachment
setmetatable(DragonfireBarrelAttachment, DragonfireBarrelAttachment.____super)
setmetatable(DragonfireBarrelAttachment.prototype, DragonfireBarrelAttachment.____super.prototype)
function DragonfireBarrelAttachment.prototype.____constructor(self, ...)
    Attachment.prototype.____constructor(self, ...)
    self.name = "Dragonfire Barrel"
end
function DragonfireBarrelAttachment.prototype.onAttach(self, weapon)
    if (weapon:getAbilityId() == BURST_RIFLE_ABILITY_ID) or (weapon:getAbilityId() == SHOTGUN_ABILITY_ID) then
        if weapon.equippedTo then
            weapon.equippedTo.unit:addAbility(AT_ABILITY_DRAGONFIRE_BLAST)
        end
        return true
    end
    return false
end
function DragonfireBarrelAttachment.prototype.onDeattach(self)
    if self.attachedTo and self.attachedTo.equippedTo then
        UnitRemoveAbility(self.attachedTo.equippedTo.unit.handle, AT_ABILITY_DRAGONFIRE_BLAST)
    end
end
function DragonfireBarrelAttachment.prototype.onEquip(self, weapon)
    if weapon and weapon.equippedTo then
        UnitAddAbility(weapon.equippedTo.unit.handle, AT_ABILITY_DRAGONFIRE_BLAST)
    end
end
function DragonfireBarrelAttachment.prototype.onUnequip(self, weapon)
    if weapon and weapon.equippedTo then
        UnitRemoveAbility(weapon.equippedTo.unit.handle, AT_ABILITY_DRAGONFIRE_BLAST)
    end
end
return ____exports
end,
["src.app.weapons.weapon-module"] = function() require("lualib_bundle");
local ____exports = {}
local ____vector3 = require("src.app.types.vector3")
local Vector3 = ____vector3.Vector3
local ____burst_2Drifle = require("src.app.weapons.guns.burst-rifle")
local BurstRifle = ____burst_2Drifle.BurstRifle
local InitBurstRifle = ____burst_2Drifle.InitBurstRifle
local ____index = require("node_modules.w3ts.index")
local Trigger = ____index.Trigger
local Unit = ____index.Unit
local ____serilog = require("src.lib.serilog.serilog")
local Log = ____serilog.Log
local ____high_2Dquality_2Dpolymer = require("src.app.weapons.attachment.high-quality-polymer")
local HighQualityPolymer = ____high_2Dquality_2Dpolymer.HighQualityPolymer
local ____em_2Drifling = require("src.app.weapons.attachment.em-rifling")
local EmsRifling = ____em_2Drifling.EmsRifling
local ____weapon_2Dconstants = require("src.app.weapons.weapon-constants")
local SNIPER_ITEM_ID = ____weapon_2Dconstants.SNIPER_ITEM_ID
local BURST_RIFLE_ITEM_ID = ____weapon_2Dconstants.BURST_RIFLE_ITEM_ID
local HIGH_QUALITY_POLYMER_ITEM_ID = ____weapon_2Dconstants.HIGH_QUALITY_POLYMER_ITEM_ID
local EMS_RIFLING_ITEM_ID = ____weapon_2Dconstants.EMS_RIFLING_ITEM_ID
local LASER_ITEM_ID = ____weapon_2Dconstants.LASER_ITEM_ID
local SHOTGUN_ITEM_ID = ____weapon_2Dconstants.SHOTGUN_ITEM_ID
local AT_ITEM_DRAGONFIRE_BLAST = ____weapon_2Dconstants.AT_ITEM_DRAGONFIRE_BLAST
local ____laser_2Drifle = require("src.app.weapons.guns.laser-rifle")
local InitLaserRifle = ____laser_2Drifle.InitLaserRifle
local LaserRifle = ____laser_2Drifle.LaserRifle
local ____shotgun = require("src.app.weapons.guns.shotgun")
local Shotgun = ____shotgun.Shotgun
local InitShotgun = ____shotgun.InitShotgun
local ____rail_2Drifle = require("src.app.weapons.attachment.rail-rifle")
local RailRifle = ____rail_2Drifle.RailRifle
local ____dragonfire_2Dbarrel = require("src.app.weapons.attachment.dragonfire-barrel")
local DragonfireBarrelAttachment = ____dragonfire_2Dbarrel.DragonfireBarrelAttachment
____exports.WeaponModule = __TS__Class()
local WeaponModule = ____exports.WeaponModule
WeaponModule.name = "WeaponModule"
function WeaponModule.prototype.____constructor(self, game)
    self.WEAPON_MODE = "CAST"
    self.unitsWithWeapon = __TS__New(Map)
    self.weaponItemIds = {}
    self.weaponAbilityIds = {}
    self.guns = {}
    self.projectiles = {}
    self.projectileIdCounter = 0
    self.projectileUpdateTimer = __TS__New(Trigger)
    self.collisionCheckGroup = CreateGroup()
    self.equipWeaponAbilityId = FourCC("A004")
    self.weaponEquipTrigger = __TS__New(Trigger)
    self.weaponShootTrigger = __TS__New(Trigger)
    self.weaponAttackTrigger = __TS__New(Trigger)
    self.weaponDropTrigger = __TS__New(Trigger)
    self.weaponPickupTrigger = __TS__New(Trigger)
    self.game = game
    InitBurstRifle(self)
    InitLaserRifle(self)
    InitShotgun(self)
    self:initialiseWeaponEquip()
    self:initaliseWeaponShooting()
    self:initialiseWeaponDropPickup()
    self:initProjectiles()
end
function WeaponModule.prototype.initProjectiles(self)
    local WEAPON_UPDATE_PERIOD = 0.03
    self.projectileUpdateTimer:registerTimerEvent(WEAPON_UPDATE_PERIOD, true)
    self.projectileUpdateTimer:addAction(
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
                return not projectile:destroy(self)
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
    local checkDist = (delta:getLength() + projectile:getCollisionRadius()) + 200
    GroupEnumUnitsInRange(self.collisionCheckGroup, centerPoint.x, centerPoint.y, checkDist, projectile.filter)
    ForGroup(
        self.collisionCheckGroup,
        function()
            local unit = GetEnumUnit()
            local unitLoc = __TS__New(
                Vector3,
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
    projectile:setId(self.projectileIdCounter)
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
        if gun.equippedTo and (gun.equippedTo.unit == unit) then
            return gun
        end
    end
end
function WeaponModule.prototype.initialiseWeaponEquip(self)
    self.weaponEquipTrigger:registerAnyUnitEvent(EVENT_PLAYER_UNIT_SPELL_EFFECT)
    self.weaponEquipTrigger:addCondition(
        Condition(
            function()
                local spellId = GetSpellAbilityId()
                return spellId == self.equipWeaponAbilityId
            end
        )
    )
    self.weaponEquipTrigger:addAction(
        function()
            local unit = Unit:fromHandle(
                GetTriggerUnit()
            )
            local orderId = GetUnitCurrentOrder(unit.handle)
            local itemSlot = orderId - 852008
            local item = UnitItemInSlot(unit.handle, itemSlot)
            local crewmember = self.game.crewModule:getCrewmemberForUnit(unit)
            if crewmember then
                self:applyItemEquip(crewmember, item)
            end
        end
    )
end
function WeaponModule.prototype.applyItemEquip(self, unit, item)
    local itemId = GetItemTypeId(item)
    local itemIsWeapon = self:itemIsWeapon(itemId)
    local itemIsAttachment = self:itemIsAttachment(itemId)
    if itemIsWeapon then
        local oldWeapon = self:getGunForUnit(unit.unit)
        local weaponForItem = self:getGunForItem(item) or self:createWeaponForId(item, unit)
        if oldWeapon then
            oldWeapon:onRemove(self)
        end
        if weaponForItem then
            __TS__ArrayPush(self.guns, weaponForItem)
            weaponForItem:onAdd(self, unit)
        end
    elseif itemIsAttachment then
        if unit.weapon then
            local attachment = self:createAttachmentForId(item)
            if attachment then
                attachment:attachTo(unit.weapon)
                unit:updateTooltips(self)
            end
        end
    else
        Log.Warning(
            ("Warning, item " .. tostring(itemId)) .. " is being attached but is not attachment or weapon"
        )
    end
end
function WeaponModule.prototype.initaliseWeaponShooting(self)
    self.weaponShootTrigger:registerAnyUnitEvent(EVENT_PLAYER_UNIT_SPELL_EFFECT)
    self.weaponShootTrigger:addCondition(
        Condition(
            function() return __TS__ArrayIndexOf(
                self.weaponAbilityIds,
                GetSpellAbilityId()
            ) >= 0 end
        )
    )
    self.weaponShootTrigger:addAction(
        function()
            local unit = Unit:fromHandle(
                GetTriggerUnit()
            )
            local targetLocation = GetSpellTargetLoc()
            local targetLoc = __TS__New(
                Vector3,
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
                        unit.owner,
                        Unit:fromHandle(targetedUnit).owner
                    )
                end
                weapon:onShoot(self, crewmember, targetLoc)
            end
            RemoveLocation(targetLocation)
        end
    )
    self.weaponAttackTrigger:registerAnyUnitEvent(EVENT_PLAYER_UNIT_DAMAGED)
    self.weaponAttackTrigger:addCondition(
        Condition(
            function() return BlzGetEventIsAttack() end
        )
    )
    self.weaponAttackTrigger:addAction(
        function()
            local unit = Unit:fromHandle(
                GetEventDamageSource()
            )
            local targetUnit = Unit:fromHandle(
                BlzGetEventDamageTarget()
            )
            self.game.forceModule:aggressionBetweenTwoPlayers(unit.owner, targetUnit.owner)
            if not self.unitsWithWeapon:has(
                GetEventDamageSource()
            ) then
                return
            end
            local targetLocation = __TS__New(Vector3, targetUnit.x, targetUnit.y, targetUnit.z)
            BlzSetEventDamage(0)
            local crewmember = self.game.crewModule:getCrewmemberForUnit(unit)
            local weapon = self:getGunForUnit(unit)
            if weapon and crewmember then
                local targetedUnit = GetSpellTargetUnit()
                if targetedUnit then
                    self.game.forceModule:aggressionBetweenTwoPlayers(
                        unit.owner,
                        Unit:fromHandle(targetedUnit).owner
                    )
                end
                weapon:onShoot(self, crewmember, targetLocation)
            end
        end
    )
end
function WeaponModule.prototype.initialiseWeaponDropPickup(self)
    self.weaponDropTrigger:registerAnyUnitEvent(EVENT_PLAYER_UNIT_DROP_ITEM)
    self.weaponDropTrigger:addCondition(
        Condition(
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
    )
    self.weaponPickupTrigger:registerAnyUnitEvent(EVENT_PLAYER_UNIT_PICKUP_ITEM)
    self.weaponPickupTrigger:addCondition(
        Condition(
            function()
                local gun = self:getGunForItem(
                    GetManipulatedItem()
                )
                local crewmember = self.game.crewModule and self.game.crewModule:getCrewmemberForUnit(
                    Unit:fromHandle(
                        GetManipulatingUnit()
                    )
                )
                if gun and crewmember then
                    gun:updateTooltip(self, crewmember)
                end
                return false
            end
        )
    )
end
function WeaponModule.prototype.itemIsWeapon(self, itemId)
    if itemId == BURST_RIFLE_ITEM_ID then
        return true
    end
    if itemId == LASER_ITEM_ID then
        return true
    end
    if itemId == SHOTGUN_ITEM_ID then
        return true
    end
    return false
end
function WeaponModule.prototype.itemIsAttachment(self, itemId)
    if itemId == HIGH_QUALITY_POLYMER_ITEM_ID then
        return true
    end
    if itemId == EMS_RIFLING_ITEM_ID then
        return true
    end
    if itemId == SNIPER_ITEM_ID then
        return true
    end
    if itemId == AT_ITEM_DRAGONFIRE_BLAST then
        return true
    end
    return false
end
function WeaponModule.prototype.createWeaponForId(self, item, unit)
    local itemId = GetItemTypeId(item)
    if itemId == BURST_RIFLE_ITEM_ID then
        return __TS__New(BurstRifle, item, unit)
    elseif itemId == LASER_ITEM_ID then
        return __TS__New(LaserRifle, item, unit)
    elseif itemId == SHOTGUN_ITEM_ID then
        return __TS__New(Shotgun, item, unit)
    end
    return nil
end
function WeaponModule.prototype.createAttachmentForId(self, item)
    local itemId = GetItemTypeId(item)
    if itemId == HIGH_QUALITY_POLYMER_ITEM_ID then
        return __TS__New(HighQualityPolymer, item)
    end
    if itemId == EMS_RIFLING_ITEM_ID then
        return __TS__New(EmsRifling, item)
    end
    if itemId == SNIPER_ITEM_ID then
        return __TS__New(RailRifle, item)
    end
    if itemId == AT_ITEM_DRAGONFIRE_BLAST then
        return __TS__New(DragonfireBarrelAttachment, item)
    end
    return nil
end
function WeaponModule.prototype.changeWeaponModeTo(self, weaponType)
    local unitsToRequip = {}
    local gunsToReEquip = __TS__ArrayFilter(
        self.guns,
        function(____, gun)
            if gun.equippedTo then
                __TS__ArrayPush(unitsToRequip, gun.equippedTo.unit)
                gun:onRemove(self)
                return true
            end
        end
    )
    self.WEAPON_MODE = weaponType
    __TS__ArrayForEach(
        gunsToReEquip,
        function(____, g, i) return g:onAdd(self, unitsToRequip[i + 1]) end
    )
end
return ____exports
end,
["src.app.weapons.guns.gun"] = function() require("lualib_bundle");
local ____exports = {}
local ____translators = require("src.lib.translators")
local PlayNewSoundOnUnit = ____translators.PlayNewSoundOnUnit
local ____ability_2Dids = require("src.resources.ability-ids")
local TECH_CREWMEMBER_ATTACK_ENABLE = ____ability_2Dids.TECH_CREWMEMBER_ATTACK_ENABLE
____exports.Gun = __TS__Class()
local Gun = ____exports.Gun
Gun.name = "Gun"
function Gun.prototype.____constructor(self, item, equippedTo)
    self.spreadAOE = 0
    self.bulletDistance = 1200
    self.name = "default"
    self.item = item
    self.equippedTo = equippedTo
end
function Gun.prototype.onAdd(self, weaponModule, caster)
    self.equippedTo = caster
    self.equippedTo:onWeaponAdd(weaponModule, self)
    weaponModule.unitsWithWeapon:set(caster.unit.handle, self)
    self:updateTooltip(weaponModule, caster)
    SetPlayerTechResearched(caster.player.handle, TECH_CREWMEMBER_ATTACK_ENABLE, 1)
    if weaponModule.WEAPON_MODE == "CAST" then
        caster.unit:addAbility(
            self:getAbilityId()
        )
    else
        UnitRemoveAbility(
            self.equippedTo.unit.handle,
            FourCC("Abun")
        )
    end
    local sound = PlayNewSoundOnUnit("Sounds\\attachToGun.mp3", caster.unit, 50)
    if self.attachment then
        self.attachment:onEquip(self)
    end
    if self.remainingCooldown and (self.remainingCooldown > 0) then
        print("Reforged better add a way to set cooldowns remaining")
    end
end
function Gun.prototype.onRemove(self, weaponModule)
    if self.equippedTo then
        weaponModule.unitsWithWeapon:delete(self.equippedTo.unit.handle)
        self.equippedTo.unit:removeAbility(
            self:getAbilityId()
        )
        SetPlayerTechResearched(self.equippedTo.unit.owner.handle, TECH_CREWMEMBER_ATTACK_ENABLE, 0)
        if weaponModule.WEAPON_MODE == "CAST" then
            self.remainingCooldown = BlzGetUnitAbilityCooldownRemaining(
                self.equippedTo.unit.handle,
                self:getAbilityId()
            )
        else
            UnitAddAbility(
                self.equippedTo.unit.handle,
                FourCC("Abun")
            )
        end
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
        local owner = self.equippedTo.unit.owner
        local newTooltip = self:getTooltip(weaponModule, caster)
        if GetLocalPlayer() == owner.handle then
            BlzSetAbilityExtendedTooltip(
                self:getAbilityId(),
                newTooltip,
                0
            )
        end
        self:applyWeaponAttackValues(weaponModule, caster)
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
function Gun.prototype.getStrayValue(self, caster)
    local accuracy = caster:getAccuracy()
    local accuracyModifier = Pow(100 - accuracy, 2) * (((accuracy > 0) and -1) or 1)
    return accuracyModifier
end
function Gun.prototype.getStrayLocation(self, originalLocation, caster)
    local accuracyModifier = self:getStrayValue(caster)
    local minLength = 0
    local maxLength = self.spreadAOE + (accuracyModifier / 2)
    local angleSpread = math.min(30 + (accuracyModifier / 40), 10)
    local dX = caster.unit.x - originalLocation.x
    local dY = caster.unit.y - originalLocation.y
    local thetaRadians = Atan2(dY, dX)
    local newLocation = originalLocation:projectTowards2D(
        Rad2Deg(thetaRadians) * GetRandomReal(-angleSpread, angleSpread),
        GetRandomInt(
            MathRound(minLength),
            MathRound(maxLength)
        )
    )
    return newLocation
end
return ____exports
end,
["src.resources.buff-ids"] = function() local ____exports = {}
____exports.BUFF_ID = {}
____exports.BUFF_ID.RESOLVE = 0
____exports.BUFF_ID[____exports.BUFF_ID.RESOLVE] = "RESOLVE"
____exports.BUFF_ID.DESPAIR = 1
____exports.BUFF_ID[____exports.BUFF_ID.DESPAIR] = "DESPAIR"
____exports.BUFF_ID.FIRE = 2
____exports.BUFF_ID[____exports.BUFF_ID.FIRE] = "FIRE"
return ____exports
end,
["src.app.buff.buff-instance"] = function() require("lualib_bundle");
local ____exports = {}
____exports.BuffInstance = __TS__Class()
local BuffInstance = ____exports.BuffInstance
BuffInstance.name = "BuffInstance"
function BuffInstance.prototype.____constructor(self)
end
____exports.BuffInstanceDuration = __TS__Class()
local BuffInstanceDuration = ____exports.BuffInstanceDuration
BuffInstanceDuration.name = "BuffInstanceDuration"
BuffInstanceDuration.____super = ____exports.BuffInstance
setmetatable(BuffInstanceDuration, BuffInstanceDuration.____super)
setmetatable(BuffInstanceDuration.prototype, BuffInstanceDuration.____super.prototype)
function BuffInstanceDuration.prototype.____constructor(self, when, dur)
    BuffInstanceDuration.____super.prototype.____constructor(self)
    self.endTimestamp = when + dur
end
function BuffInstanceDuration.prototype.isActive(self, currentTimeStamp)
    return self.endTimestamp > currentTimeStamp
end
____exports.BuffInstanceCallback = __TS__Class()
local BuffInstanceCallback = ____exports.BuffInstanceCallback
BuffInstanceCallback.name = "BuffInstanceCallback"
BuffInstanceCallback.____super = ____exports.BuffInstance
setmetatable(BuffInstanceCallback, BuffInstanceCallback.____super)
setmetatable(BuffInstanceCallback.prototype, BuffInstanceCallback.____super.prototype)
function BuffInstanceCallback.prototype.____constructor(self, cb)
    BuffInstanceCallback.____super.prototype.____constructor(self)
    self.cb = function() return cb() end
end
function BuffInstanceCallback.prototype.isActive(self, currentTimeStamp)
    return self:cb()
end
____exports.DynamicBuff = __TS__Class()
local DynamicBuff = ____exports.DynamicBuff
DynamicBuff.name = "DynamicBuff"
function DynamicBuff.prototype.____constructor(self)
    self.isActive = false
    self.instances = {}
    self.doesStack = true
    self.onChangeCallbacks = {}
end
function DynamicBuff.prototype.addInstance(self, game, unit, instance)
    local wasActive = self.isActive
    self.who = unit
    self.isActive = true
    __TS__ArrayPush(self.instances, instance)
    if wasActive ~= self.isActive then
        __TS__ArrayForEach(
            self.onChangeCallbacks,
            function(____, cb) return cb(self) end
        )
        self:onStatusChange(game, true)
    end
end
function DynamicBuff.prototype.process(self, game, delta)
    local timestamp = game:getTimeStamp()
    local wasActive = #self.instances > 0
    self.instances = __TS__ArrayFilter(
        self.instances,
        function(____, i) return i:isActive(timestamp) end
    )
    local isActive = (#self.instances > 0) and self.who:isAlive()
    if wasActive ~= isActive then
        self.isActive = false
        self:onStatusChange(game, false)
    end
    return isActive
end
function DynamicBuff.prototype.onChange(self, cb)
    __TS__ArrayPush(self.onChangeCallbacks, cb)
end
function DynamicBuff.prototype.canStack(self)
    return self.doesStack
end
function DynamicBuff.prototype.getIsActive(self)
    return self.isActive
end
return ____exports
end,
["src.app.types.sound-ref"] = function() require("lualib_bundle");
local ____exports = {}
____exports.SoundRef = __TS__Class()
local SoundRef = ____exports.SoundRef
SoundRef.name = "SoundRef"
function SoundRef.prototype.____constructor(self, sound, looping)
    self.sound = CreateSound(sound, looping, false, false, 0, 3, "")
    SetSoundDuration(
        self.sound,
        GetSoundFileDuration(sound)
    )
end
function SoundRef.prototype.playSound(self)
    StartSound(self.sound)
end
function SoundRef.prototype.playSoundOnUnit(self, unit, volume)
    SetSoundChannel(self.sound, 0)
    SetSoundVolume(self.sound, volume)
    SetSoundPitch(self.sound, 1)
    SetSoundDistances(self.sound, 2000, 10000)
    SetSoundDistanceCutoff(self.sound, 4500)
    AttachSoundToUnit(self.sound, unit)
    StartSound(self.sound)
end
function SoundRef.prototype.setVolume(self, volume)
    SetSoundVolume(self.sound, volume)
end
function SoundRef.prototype.stopSound(self)
    StopSound(self.sound, false, true)
end
____exports.SoundWithCooldown = __TS__Class()
local SoundWithCooldown = ____exports.SoundWithCooldown
SoundWithCooldown.name = "SoundWithCooldown"
SoundWithCooldown.____super = ____exports.SoundRef
setmetatable(SoundWithCooldown, SoundWithCooldown.____super)
setmetatable(SoundWithCooldown.prototype, SoundWithCooldown.____super.prototype)
function SoundWithCooldown.prototype.____constructor(self, cooldown, sound)
    SoundWithCooldown.____super.prototype.____constructor(self, sound, false)
    self.cooldown = cooldown
end
function SoundWithCooldown.prototype.canPlaySound(self, currentTime)
    local doPlaySound = (not self.timePlayed) or ((currentTime - self.timePlayed) > self.cooldown)
    if doPlaySound then
        self.timePlayed = currentTime
        return true
    end
    return false
end
return ____exports
end,
["src.app.buff.resolve"] = function() require("lualib_bundle");
local ____exports = {}
local ____buff_2Dinstance = require("src.app.buff.buff-instance")
local DynamicBuff = ____buff_2Dinstance.DynamicBuff
local ____sound_2Dref = require("src.app.types.sound-ref")
local SoundWithCooldown = ____sound_2Dref.SoundWithCooldown
local SoundRef = ____sound_2Dref.SoundRef
local ____ability_2Dids = require("src.resources.ability-ids")
local ABIL_ACCURACY_BONUS_30 = ____ability_2Dids.ABIL_ACCURACY_BONUS_30
local RESOLVE_ABILITY_ID = FourCC("A007")
local RESOLVE_BUFF_ID = FourCC("B001")
____exports.Resolve = __TS__Class()
local Resolve = ____exports.Resolve
Resolve.name = "Resolve"
Resolve.____super = DynamicBuff
setmetatable(Resolve, Resolve.____super)
setmetatable(Resolve.prototype, Resolve.____super.prototype)
function Resolve.prototype.____constructor(self, game, crewmember)
    DynamicBuff.prototype.____constructor(self)
    self.name = "resolve"
    self.checkForDespairBuffTicker = 0
    self.breathSound = __TS__New(SoundWithCooldown, 10, "Sounds\\HeavyBreath.mp3")
    self.resolveMusic = __TS__New(SoundRef, "Music\\KavinskyRampage.mp3", true)
    self.crewmember = crewmember
    self.prevUnitHealth = self.crewmember.unit:getState(UNIT_STATE_LIFE)
end
function Resolve.prototype.process(self, game, delta)
    local result = DynamicBuff.prototype.process(self, game, delta)
    if not self.isActive then
        return result
    end
    self.checkForDespairBuffTicker = self.checkForDespairBuffTicker + delta
    if self.checkForDespairBuffTicker >= 1 then
        self.checkForDespairBuffTicker = 0
        if not UnitHasBuffBJ(self.crewmember.unit.handle, RESOLVE_BUFF_ID) then
            game:useDummyFor(
                function(dummy)
                    SetUnitX(dummy, self.crewmember.unit.x)
                    SetUnitY(dummy, self.crewmember.unit.y + 50)
                    IssueTargetOrder(dummy, "bloodlust", self.crewmember.unit.handle)
                end,
                RESOLVE_ABILITY_ID
            )
        end
    end
    return result
end
function Resolve.prototype.onStatusChange(self, game, newStatus)
    if newStatus then
        self.crewmember.unit:addAbility(ABIL_ACCURACY_BONUS_30)
        self.resolveMusic:setVolume(15)
        if GetLocalPlayer() == self.crewmember.player.handle then
            StopMusic(true)
            self.breathSound:playSound()
            self.resolveMusic:playSound()
        end
        if not UnitHasBuffBJ(self.crewmember.unit.handle, RESOLVE_BUFF_ID) then
            game:useDummyFor(
                function(dummy)
                    SetUnitX(dummy, self.crewmember.unit.x)
                    SetUnitY(dummy, self.crewmember.unit.y + 50)
                    IssueTargetOrder(dummy, "bloodlust", self.crewmember.unit.handle)
                end,
                RESOLVE_ABILITY_ID
            )
        end
    else
        self.crewmember.unit:removeAbility(ABIL_ACCURACY_BONUS_30)
        UnitRemoveBuffBJ(RESOLVE_BUFF_ID, self.crewmember.unit.handle)
        __TS__ArrayForEach(
            self.onChangeCallbacks,
            function(____, cb) return cb(self) end
        )
        if GetLocalPlayer() == self.crewmember.player.handle then
            self.breathSound:stopSound()
            self.resolveMusic:stopSound()
            ResumeMusic()
        end
    end
end
return ____exports
end,
["src.app.force.force-type"] = function() require("lualib_bundle");
local ____exports = {}
local ____translators = require("src.lib.translators")
local PLAYER_COLOR = ____translators.PLAYER_COLOR
local ____sound_2Dref = require("src.app.types.sound-ref")
local SoundRef = ____sound_2Dref.SoundRef
local GENERIC_CHAT_SOUND_REF = __TS__New(SoundRef, "Sound/ChatSound", false)
____exports.ForceType = __TS__Class()
local ForceType = ____exports.ForceType
ForceType.name = "ForceType"
function ForceType.prototype.____constructor(self, fModule)
    self.players = {}
    self.playerUnits = __TS__New(Map)
    self.forceModule = fModule
end
function ForceType.prototype.is(self, name)
    return self.name == name
end
function ForceType.prototype.hasPlayer(self, who)
    return __TS__ArrayIndexOf(self.players, who) >= 0
end
function ForceType.prototype.getPlayers(self)
    return self.players
end
function ForceType.prototype.addPlayer(self, who)
    __TS__ArrayPush(self.players, who)
end
function ForceType.prototype.removePlayer(self, who)
    local idx = __TS__ArrayIndexOf(self.players, who)
    if idx >= 0 then
        __TS__ArraySplice(self.players, idx, 1)
    end
end
function ForceType.prototype.addPlayerMainUnit(self, game, whichUnit, player)
    self.playerUnits:set(player, whichUnit)
end
function ForceType.prototype.removePlayerMainUnit(self, game, whichUnit, player)
    self.playerUnits:delete(player)
end
function ForceType.prototype.onUnitGainsXp(self, game, whichUnit, amount)
    whichUnit.unit:suspendExperience(false)
    whichUnit.unit:addExperience(
        MathRound(amount),
        true
    )
    whichUnit.unit:suspendExperience(true)
end
function ForceType.prototype.updateForceTooltip(self, game, whichUnit)
end
function ForceType.prototype.getChatRecipients(self, sendingPlayer)
    return self.forceModule:getActivePlayers()
end
function ForceType.prototype.getChatName(self, who)
    local crew = self.forceModule.game.crewModule:getCrewmemberForPlayer(who)
    if crew then
        return crew.name
    else
        return "Missing Crew Name"
    end
end
function ForceType.prototype.getChatColor(self, who)
    return PLAYER_COLOR[who.id + 1]
end
function ForceType.prototype.getChatSoundRef(self, who)
    return GENERIC_CHAT_SOUND_REF
end
function ForceType.prototype.getChatTag(self, who)
    return
end
return ____exports
end,
["src.resources.crewmember-names"] = function() require("lualib_bundle");
local ____exports = {}
local ____colours = require("src.resources.colours")
local COL_GOLD = ____colours.COL_GOLD
local COL_VENTS = ____colours.COL_VENTS
local COL_TEAL = ____colours.COL_TEAL
local COL_ATTATCH = ____colours.COL_ATTATCH
____exports.ROLE_TYPES = {}
____exports.ROLE_TYPES.CAPTAIN = "Captain"
____exports.ROLE_TYPES.NAVIGATOR = "Navigator"
____exports.ROLE_TYPES.ENGINEER = "Engineer"
____exports.ROLE_TYPES.SEC_GUARD = "Security Guard"
____exports.ROLE_TYPES.MAJOR = "Major"
____exports.ROLE_TYPES.DOCTOR = "Doctor"
____exports.ROLE_NAMES = __TS__New(Map)
____exports.ROLE_NAMES:set(____exports.ROLE_TYPES.CAPTAIN, {"Captain Keenest", "Captain Kirk", "Captain Jack Sparrow", "Captain Creed", "Captain Coloma", "Captain Dallas", "Captain Cutter", "Captain Reynolds", "Captain Willard", "Captain Fodder", "Captain Cookie", "Captain Kimstar", "Captain Picard", "Captain Jakov", "Captain Shepherd", "Captain America", "Captain Sullivan", "Captain Frost", "Captain Shane"})
____exports.ROLE_NAMES:set(____exports.ROLE_TYPES.NAVIGATOR, {"Admiral Ackbar", "Admiral Doubt", "Admiral Hansel", "Admiral Gretel", "Admiral Jones", "Admiral Aedus", "Admiral Alex", "Navigator Stanley"})
____exports.ROLE_NAMES:set(____exports.ROLE_TYPES.SEC_GUARD, {"Pvt Clarke", "Pvt. \"Slick\" Jones", "Col. Kaedin", "Sly Marbo", "Pvt. Frost", "Pvt. Riley", "Pvt. Blake", "Pvt. Vasquez", "Pvt. Allen", "Pvt. Jenkins", "Pvt. Summers", "Pvt. Pyle", "Pvt. Harding", "Pvt. Hudson", "Cpl. Baker", "Cpl. Hicks", "Cpl. Emerich", "Cpl. Dilan", "Cpl. Collins", "Cpl. Duncan", "Cpl. Farquaad", "Pvt. Parts", "Pvt Fuzz", "Pvt Chapman", "Pvt Piggy", "Col. Harkon"})
____exports.ROLE_NAMES:set(____exports.ROLE_TYPES.ENGINEER, {"Engineer Fahr", "Engineer Isaac"})
____exports.ROLE_NAMES:set(____exports.ROLE_TYPES.MAJOR, {"Maj. Bonner", "Maj. Hatter", "Maj. Vonstroheim"})
____exports.ROLE_NAMES:set(____exports.ROLE_TYPES.DOCTOR, {"Doctor Dimento", "Doctor Quack", "Dr. Diggus Bickus", "Dr. Who"})
____exports.ROLE_DESCRIPTIONS = __TS__New(Map)
____exports.ROLE_DESCRIPTIONS:set(
    ____exports.ROLE_TYPES.CAPTAIN,
    ("The " .. tostring(COL_GOLD)) .. "Captain|r controls station security targeting and pilots the Askellon through deep space.|nIt is your job to ensure your crew survive the trip."
)
____exports.ROLE_DESCRIPTIONS:set(
    ____exports.ROLE_TYPES.NAVIGATOR,
    ((("As " .. tostring(COL_VENTS)) .. "Navigator|r you must scan deep space and lead your ") .. tostring(COL_GOLD)) .. "Captain|r through deep space.|nYou are also in charge of the Cargo Bay's ships."
)
____exports.ROLE_DESCRIPTIONS:set(
    ____exports.ROLE_TYPES.DOCTOR,
    ("As " .. tostring(COL_TEAL)) .. "Doctor|r research and upgrade Healthcare while using the Gene Splicer to upgrade your comrades."
)
____exports.ROLE_DESCRIPTIONS:set(____exports.ROLE_TYPES.MAJOR, "Major is WIP")
____exports.ROLE_DESCRIPTIONS:set(
    ____exports.ROLE_TYPES.SEC_GUARD,
    tostring(COL_ATTATCH) .. "Security Guards|r gain 30% bonus experience when damaging Alien Hosts"
)
return ____exports
end,
["src.resources.ability-tooltips"] = function() local ____exports = {}
local ____colours = require("src.resources.colours")
local COL_MISC = ____colours.COL_MISC
local COL_RESOLVE = ____colours.COL_RESOLVE
local COL_ALIEN = ____colours.COL_ALIEN
local COL_GOOD = ____colours.COL_GOOD
local COL_INFO = ____colours.COL_INFO
local ____crewmember_2Dnames = require("src.resources.crewmember-names")
local ROLE_DESCRIPTIONS = ____crewmember_2Dnames.ROLE_DESCRIPTIONS
____exports.RESOLVE_TOOLTIP = function(playerIncome, role) return ((((((((((((((((((tostring(COL_MISC) .. "Everyone onboard the Askellon went through extensive surgeries to ensure that their bodies could withstand the brutalities of space travel. Be it the implanted and extensively enhanced andrenaline glands or just the human will to live; you will not go down without a fight.|r\n\nIt is your duty to ensure the ship and her systems stay online. But be careful, there are ") .. tostring(COL_ALIEN)) .. "forces|r on the ship that seek your demise.\nAs a ") .. tostring(COL_GOOD)) .. "Crewmember|r of the Askellon you will earn income by performing your duties.\n\nAddtionally, your determination to survive will cause you to gain ") .. tostring(COL_RESOLVE)) .. "Resolve|r on low HP, granting ") .. tostring(COL_GOOD)) .. "30% bonus|r movement speed, ") .. tostring(COL_GOOD)) .. "30% damage|r reduction and ") .. tostring(COL_INFO)) .. "improving|r your other abilities.\n\n") .. tostring(
    ROLE_DESCRIPTIONS:get(role)
)) .. "\n\n") .. tostring(COL_MISC)) .. "Current Income: ") .. tostring(playerIncome)) .. " per minute|r\n" end
____exports.TRANSFORM_TOOLTIP = function(playerIncome, toAlien, alienFormName, role) return ((((((((((((((((tostring(COL_MISC) .. "This form is weak. Hunt. Consume. Evolve.|r\n\nYou are the ") .. tostring(COL_ALIEN)) .. "Alien.|r Destroy or devour the lesser beings aboard this vessel.\nYou can ") .. tostring(COL_INFO)) .. "transform|r into your ") .. tostring(
    ((toAlien and (function() return (tostring(COL_ALIEN) .. tostring(alienFormName)) .. "|r" end)) or (function() return tostring(COL_INFO) .. "Human|r" end))()
)) .. " form at will.\n\nWhen critically injured you gain ") .. tostring(COL_RESOLVE)) .. "Resolve|r, this ability is lost at the ") .. tostring(COL_ALIEN)) .. "third evolution|r.\n\n") .. tostring(
    ROLE_DESCRIPTIONS:get(role)
)) .. "\n\n") .. tostring(COL_MISC)) .. "Current Income: ") .. tostring(playerIncome)) .. " per minute|r\n" end
return ____exports
end,
["src.app.force.crewmember-force"] = function() require("lualib_bundle");
local ____exports = {}
local ____force_2Dtype = require("src.app.force.force-type")
local ForceType = ____force_2Dtype.ForceType
local ____ability_2Dids = require("src.resources.ability-ids")
local ABIL_CREWMEMBER_INFO = ____ability_2Dids.ABIL_CREWMEMBER_INFO
local ____ability_2Dtooltips = require("src.resources.ability-tooltips")
local RESOLVE_TOOLTIP = ____ability_2Dtooltips.RESOLVE_TOOLTIP
____exports.CREW_FORCE_NAME = "CREW"
____exports.CrewmemberForce = __TS__Class()
local CrewmemberForce = ____exports.CrewmemberForce
CrewmemberForce.name = "CrewmemberForce"
CrewmemberForce.____super = ForceType
setmetatable(CrewmemberForce, CrewmemberForce.____super)
setmetatable(CrewmemberForce.prototype, CrewmemberForce.____super.prototype)
function CrewmemberForce.prototype.____constructor(self, ...)
    ForceType.prototype.____constructor(self, ...)
    self.name = ____exports.CREW_FORCE_NAME
end
function CrewmemberForce.prototype.checkVictoryConditions(self, forceModule)
    return #self.players > 0
end
function CrewmemberForce.prototype.addPlayerMainUnit(self, game, whichUnit, player)
    ForceType.prototype.addPlayerMainUnit(self, game, whichUnit, player)
    whichUnit:addAbility(ABIL_CREWMEMBER_INFO)
end
function CrewmemberForce.prototype.removePlayerMainUnit(self, game, whichUnit, player)
    ForceType.prototype.removePlayerMainUnit(self, game, whichUnit, player)
    whichUnit:removeAbility(ABIL_CREWMEMBER_INFO)
end
function CrewmemberForce.prototype.updateForceTooltip(self, game, whichCrew)
    local income = game.crewModule:calculateIncome(whichCrew)
    local tooltip = RESOLVE_TOOLTIP(income, whichCrew.role)
    if GetLocalPlayer() == whichCrew.player.handle then
        BlzSetAbilityExtendedTooltip(ABIL_CREWMEMBER_INFO, tooltip, 0)
    end
end
return ____exports
end,
["src.app.force.observer-force"] = function() require("lualib_bundle");
local ____exports = {}
local ____force_2Dtype = require("src.app.force.force-type")
local ForceType = ____force_2Dtype.ForceType
____exports.OBSERVER_FORCE_NAME = "OBS"
____exports.ObserverForce = __TS__Class()
local ObserverForce = ____exports.ObserverForce
ObserverForce.name = "ObserverForce"
ObserverForce.____super = ForceType
setmetatable(ObserverForce, ObserverForce.____super)
setmetatable(ObserverForce.prototype, ObserverForce.____super.prototype)
function ObserverForce.prototype.____constructor(self, ...)
    ForceType.prototype.____constructor(self, ...)
    self.name = ____exports.OBSERVER_FORCE_NAME
end
function ObserverForce.prototype.checkVictoryConditions(self, forceModule)
    return false
end
return ____exports
end,
["src.resources.strings"] = function() local ____exports = {}
local ____colours = require("src.resources.colours")
local COL_GOOD = ____colours.COL_GOOD
local COL_BAD = ____colours.COL_BAD
local COL_ALIEN = ____colours.COL_ALIEN
local COL_ATTATCH = ____colours.COL_ATTATCH
local COL_GOLD = ____colours.COL_GOLD
local COL_INFO = ____colours.COL_INFO
local COL_TEAL = ____colours.COL_TEAL
____exports.STR_OPT_MESSAGE = tostring(COL_BAD) .. "Role Preference|r"
____exports.STR_OPT_HUMAN = "Human"
____exports.STR_OPT_ALIEN = "Alien"
____exports.STR_OPT_CULT = "Cultist"
____exports.STR_CHAT_ALIEN_HOST = "Alien Host"
____exports.STR_CHAT_ALIEN_SPAWN = "Alien Spawn"
____exports.STR_CHAT_ALIEN_TAG = "[ALIEN]"
____exports.STR_GENE_REQUIRES_HEALTHCARE = ((tostring(COL_TEAL) .. "Gene Splicer|r ") .. tostring(COL_GOLD)) .. "requires Healthcare 2.0|r"
____exports.STR_UPGRADE_NAME_WEAPONS = function(researchLevel) return ((((tostring(COL_ATTATCH) .. "WEAPONS PRODUCTION|r") .. tostring(COL_GOLD)) .. " TIER ") .. tostring(researchLevel)) .. "|r" end
____exports.STR_UPGRADE_NAME_HEALTHCARE = function(researchLevel) return ((((tostring(COL_INFO) .. "HEALTHCARE|r") .. tostring(COL_GOLD)) .. " TIER ") .. tostring(researchLevel)) .. "|r" end
____exports.STR_UPGRADE_COMPLETE_HEADER = function() return tostring(COL_GOLD) .. "-= STATION FUNCTIONALITY RESTORED =-|r" end
____exports.STR_UPGRADE_COMPLETE_SUBTITLE = function(upgradeName) return (tostring(COL_GOLD) .. "RESEARCH:|r ") .. tostring(upgradeName) end
____exports.STR_UPGRADE_COMPLETE_INFESTATION = function() return tostring(COL_ALIEN) .. "INFESTATION COMPLETE|r" end
____exports.STR_GENE_SUCCESSFUL = function() return ((tostring(COL_INFO) .. "Gene Splicing:|r ") .. tostring(COL_GOOD)) .. "SUCCESSFUL|r" end
____exports.STR_GENE_ALIEN_SUCCESSFUL = function() return tostring(COL_ALIEN) .. "Alien Epidermis Mimicking Gene Install|r" end
return ____exports
end,
["src.app.force.opt-selection"] = function() require("lualib_bundle");
local ____exports = {}
local ____serilog = require("src.lib.serilog.serilog")
local Log = ____serilog.Log
local ____index = require("node_modules.w3ts.index")
local Trigger = ____index.Trigger
local MapPlayer = ____index.MapPlayer
local Dialog = ____index.Dialog
local DialogButton = ____index.DialogButton
local ____colours = require("src.resources.colours")
local COL_GOOD = ____colours.COL_GOOD
local COL_MISC = ____colours.COL_MISC
local COL_ALIEN = ____colours.COL_ALIEN
local ____strings = require("src.resources.strings")
local STR_OPT_MESSAGE = ____strings.STR_OPT_MESSAGE
____exports.OPT_TYPES = {}
____exports.OPT_TYPES.PROTAGANIST = "Protagainst"
____exports.OPT_TYPES.ANTAGONST = "Antagonist"
____exports.OPT_TYPES.NEUTRAL = "Neutral"
____exports.OptSelection = __TS__Class()
local OptSelection = ____exports.OptSelection
OptSelection.name = "OptSelection"
function OptSelection.prototype.____constructor(self, defaultOpt)
    self.dialog = __TS__New(Dialog)
    self.clickTrigger = __TS__New(Trigger)
    self.players = {}
    self.optVsButton = __TS__New(Map)
    self.buttonVsOpt = __TS__New(Map)
    self.playersInOpt = __TS__New(Map)
    self.optsForPlayer = __TS__New(Map)
    self.playerOptPower = __TS__New(Map)
    self.optsPossible = {}
    self.defaultOpt = defaultOpt
end
function OptSelection.prototype.addOpt(self, what)
    __TS__ArrayPush(self.optsPossible, what)
end
function OptSelection.prototype.setOptPower(self, who, optPower)
    self.playerOptPower:set(who, optPower)
end
function OptSelection.prototype.getOptPower(self, player)
    return self.playerOptPower:get(player) or 10
end
function OptSelection.prototype.askPlayerOpts(self, forces)
    local allOpts = __TS__ArraySlice(self.optsPossible)
    __TS__ArrayPush(allOpts, self.defaultOpt)
    self.players = forces:getActivePlayers()
    __TS__ArrayForEach(
        self.players,
        function(____, p) return self.dialog:display(p, true) end
    )
    self.dialog:setMessage(STR_OPT_MESSAGE)
    __TS__ArrayForEach(
        allOpts,
        function(____, opt, i)
            local tooltip = opt.text
            local button = self.dialog:addButton(
                tostring(
                    self:getTypePefix(opt.type)
                ) .. tostring(tooltip),
                GetLocalizedHotkey(opt.hotkey)
            )
            self.optVsButton:set(opt, button)
            self.buttonVsOpt:set(button, opt)
        end
    )
    self.clickTrigger:registerDialogEvent(self.dialog)
    self.clickTrigger:addAction(
        function() return self:onDialogClick() end
    )
    __TS__ArrayForEach(
        self.players,
        function(____, player) return self.dialog:display(player, true) end
    )
end
function OptSelection.prototype.onDialogClick(self)
    local dialog = self.dialog
    local button = DialogButton:fromHandle(
        GetClickedButton()
    )
    local player = MapPlayer:fromHandle(
        GetTriggerPlayer()
    )
    local optType = self.buttonVsOpt:get(button)
    if not optType then
        return Log.Warning("Opt selected with variables")
    end
    if not self.playersInOpt:has(optType) then
        self.playersInOpt:set(optType, {})
    end
    if not self.optsForPlayer:has(player) then
        self.optsForPlayer:set(player, {})
    end
    local playersOptedList = self.playersInOpt:get(optType)
    if playersOptedList then
        local idx = __TS__ArrayIndexOf(playersOptedList, player)
        if idx >= 0 then
            __TS__ArraySplice(playersOptedList, idx, 1)
        else
            __TS__ArrayPush(playersOptedList, player)
        end
    end
    local optsForPlayerList = self.optsForPlayer:get(player)
    if optsForPlayerList then
        local idx = __TS__ArrayIndexOf(optsForPlayerList, optType)
        if idx >= 0 then
            __TS__ArraySplice(optsForPlayerList, idx, 1)
        else
            __TS__ArrayPush(optsForPlayerList, optType)
        end
    end
    self:updateDialog()
end
function OptSelection.prototype.updateDialog(self)
    local allOpts = __TS__ArraySlice(self.optsPossible)
    __TS__ArrayPush(allOpts, self.defaultOpt)
    self.dialog:clear()
    self.dialog:setMessage(STR_OPT_MESSAGE)
    __TS__ArrayForEach(
        allOpts,
        function(____, opt)
            local playersOpted = self.playersInOpt:get(opt)
            local text = tostring(
                self:getTypePefix(opt.type)
            ) .. tostring(opt.text)
            if playersOpted then
                __TS__ArrayForEach(
                    playersOpted,
                    function(____, p)
                        local opts = self.optsForPlayer:get(p)
                        local localString = tostring(text) .. ((" " .. tostring(COL_GOOD)) .. "Opted In!|r")
                        if p.handle == GetLocalPlayer() then
                            text = localString
                        end
                    end
                )
            end
            local button = self.dialog:addButton(
                text,
                GetLocalizedHotkey(opt.hotkey)
            )
            self.optVsButton:set(opt, button)
            self.buttonVsOpt:set(button, opt)
        end
    )
    __TS__ArrayForEach(
        self.players,
        function(____, p) return self.dialog:display(p, true) end
    )
end
function OptSelection.prototype.getTypePefix(self, ____type)
    local ____switch28 = ____type
    if ____switch28 == ____exports.OPT_TYPES.PROTAGANIST then
        goto ____switch28_case_0
    elseif ____switch28 == ____exports.OPT_TYPES.ANTAGONST then
        goto ____switch28_case_1
    elseif ____switch28 == ____exports.OPT_TYPES.NEUTRAL then
        goto ____switch28_case_2
    end
    goto ____switch28_end
    ::____switch28_case_0::
    do
        return tostring(COL_GOOD) .. "Protaganist:|r "
    end
    ::____switch28_case_1::
    do
        return tostring(COL_ALIEN) .. "Antagonist:|r "
    end
    ::____switch28_case_2::
    do
        return tostring(COL_MISC) .. "Neutral:|r "
    end
    ::____switch28_end::
end
function OptSelection.prototype.endOptSelection(self, force)
    self.buttonVsOpt:clear()
    __TS__ArrayForEach(
        self.players,
        function(____, p) return self.dialog:display(p, false) end
    )
    local playersNoRole = force:getActivePlayers()
    local rolesToUse = __TS__ArrayFilter(
        self.optsPossible,
        function(____, opt) return GetRandomInt(0, 100) <= opt.chanceToExist end
    )
    local result = {}
    __TS__ArrayForEach(
        rolesToUse,
        function(____, r)
            local playersOptedForRole = self.playersInOpt:get(r) or ({})
            local srcPlayersAvailableForRole = __TS__ArrayFilter(
                playersNoRole,
                function(____, p1) return __TS__ArraySome(
                    playersOptedForRole,
                    function(____, p2) return p1 == p2 end
                ) end
            )
            if (r.isRequired and r.count) and (#srcPlayersAvailableForRole <= r.count) then
                while (#srcPlayersAvailableForRole < r.count) and (#playersNoRole > 0) do
                    __TS__ArrayPush(
                        srcPlayersAvailableForRole,
                        __TS__ArraySplice(
                            playersNoRole,
                            GetRandomInt(0, #playersNoRole - 1),
                            1
                        )[1]
                    )
                end
            end
            local playersGettingRole = {}
            while (#playersGettingRole < (r.count or 1)) and (#srcPlayersAvailableForRole > 0) do
                local player = __TS__ArraySplice(
                    srcPlayersAvailableForRole,
                    GetRandomInt(0, #srcPlayersAvailableForRole - 1),
                    1
                )[1]
                local idx = __TS__ArrayIndexOf(playersNoRole, player)
                if idx >= 0 then
                    __TS__ArraySplice(playersNoRole, idx, 1)
                end
                __TS__ArrayPush(playersGettingRole, player)
            end
            __TS__ArrayForEach(
                playersGettingRole,
                function(____, p)
                    __TS__ArrayPush(result, {player = p, role = r})
                end
            )
        end
    )
    __TS__ArrayForEach(
        playersNoRole,
        function(____, p) return __TS__ArrayPush(result, {player = p, role = self.defaultOpt}) end
    )
    return result
end
return ____exports
end,
["src.app.force.force-module"] = function() require("lualib_bundle");
local ____exports = {}
local ____crewmember_2Dforce = require("src.app.force.crewmember-force")
local CrewmemberForce = ____crewmember_2Dforce.CrewmemberForce
local CREW_FORCE_NAME = ____crewmember_2Dforce.CREW_FORCE_NAME
local ____alien_2Dforce = require("src.app.force.alien-force")
local AlienForce = ____alien_2Dforce.AlienForce
local ALIEN_FORCE_NAME = ____alien_2Dforce.ALIEN_FORCE_NAME
local ____observer_2Dforce = require("src.app.force.observer-force")
local ObserverForce = ____observer_2Dforce.ObserverForce
local ____index = require("node_modules.w3ts.index")
local Trigger = ____index.Trigger
local MapPlayer = ____index.MapPlayer
local ____opt_2Dselection = require("src.app.force.opt-selection")
local OptSelection = ____opt_2Dselection.OptSelection
local OPT_TYPES = ____opt_2Dselection.OPT_TYPES
local ____strings = require("src.resources.strings")
local STR_OPT_ALIEN = ____strings.STR_OPT_ALIEN
local STR_OPT_HUMAN = ____strings.STR_OPT_HUMAN
____exports.ForceModule = __TS__Class()
local ForceModule = ____exports.ForceModule
ForceModule.name = "ForceModule"
function ForceModule.prototype.____constructor(self, game)
    self.forces = {}
    self.playerOriginalDetails = __TS__New(Map)
    self.playerForceDetails = __TS__New(Map)
    self.aggressionId = 0
    self.aggressionLog = __TS__New(Map)
    self.allAggressionLogs = {}
    self.game = game
    __TS__ArrayForEach(
        self:getActivePlayers(),
        function(____, p)
            self.playerOriginalDetails:set(p, {name = p.name, colour = p.color})
        end
    )
    __TS__ArrayPush(
        self.forces,
        __TS__New(CrewmemberForce, self)
    )
    __TS__ArrayPush(
        self.forces,
        __TS__New(ObserverForce, self)
    )
    self.stationSecurity = MapPlayer:fromIndex(22)
    self.stationProperty = MapPlayer:fromIndex(21)
    self.alienAIPlayer = MapPlayer:fromIndex(20)
    self.unknownPlayer = MapPlayer:fromIndex(23)
    self.neutralHostile = MapPlayer:fromIndex(25)
    self.neutralPassive = MapPlayer:fromIndex(26)
    local ticker = __TS__New(Trigger)
    ticker:registerTimerEvent(5, true)
    ticker:addAction(
        function() return self:onAggressionTick(5) end
    )
end
function ForceModule.prototype.getOriginalPlayerDetails(self, who)
    return self.playerOriginalDetails:get(who)
end
function ForceModule.prototype.aggressionBetweenTwoPlayers(self, player1, player2)
    player1:setAlliance(player2, ALLIANCE_PASSIVE, false)
    player2:setAlliance(player1, ALLIANCE_PASSIVE, false)
    self:addAggressionLog(player1, player2)
end
function ForceModule.prototype.addAggressionLog(self, player1, player2)
    if player2 == self.alienAIPlayer then
        return
    end
    local newItem = {
        id = (function()
            local ____tmp = self.aggressionId
            self.aggressionId = ____tmp + 1
            return ____tmp
        end)(),
        aggressor = player1,
        defendant = player2,
        timeStamp = self.game:getTimeStamp(),
        remainingDuration = 30,
        key = ""
    }
    newItem.key = self:getLogKey(player1, player2)
    local logs = self.aggressionLog:get(newItem.key) or ({})
    __TS__ArrayPush(logs, newItem)
    self.aggressionLog:set(newItem.key, logs)
    __TS__ArrayPush(self.allAggressionLogs, newItem)
end
function ForceModule.prototype.onAggressionTick(self, delta)
    self.allAggressionLogs = __TS__ArrayFilter(
        self.allAggressionLogs,
        function(____, instance)
            local key = instance.key
            instance.remainingDuration = instance.remainingDuration - delta
            if instance.remainingDuration <= 0 then
                local logs = self.aggressionLog:get(key)
                local idx = __TS__ArrayIndexOf(logs, instance)
                __TS__ArraySplice(logs, idx, 1)
                self.aggressionLog:set(key, logs)
                if #logs == 0 then
                    instance.aggressor:setAlliance(instance.defendant, ALLIANCE_PASSIVE, true)
                    instance.defendant:setAlliance(instance.aggressor, ALLIANCE_PASSIVE, true)
                end
                return false
            end
            return true
        end
    )
end
function ForceModule.prototype.getLogKey(self, aggressor, defendant)
    local p1Id = aggressor.id
    local p2Id = defendant.id
    local sortP2First = p2Id < p1Id
    return ((sortP2First and (function() return (tostring(p2Id) .. "::") .. tostring(p1Id) end)) or (function() return (tostring(p1Id) .. "::") .. tostring(p2Id) end))()
end
function ForceModule.prototype.repairAllAlliances(self, forPlayer)
    local players = self:getActivePlayers()
    __TS__ArrayForEach(
        players,
        function(____, p)
            local key = self:getLogKey(p, forPlayer)
            local instances = self.aggressionLog:get(key)
            if instances then
                self.aggressionLog:delete(key)
                self.allAggressionLogs = __TS__ArrayFilter(
                    self.allAggressionLogs,
                    function(____, x) return __TS__ArrayIndexOf(instances, x) == -1 end
                )
                forPlayer:setAlliance(p, ALLIANCE_PASSIVE, true)
                p:setAlliance(forPlayer, ALLIANCE_PASSIVE, true)
            end
        end
    )
    forPlayer:setAlliance(self.stationSecurity, ALLIANCE_PASSIVE, true)
end
function ForceModule.prototype.checkVictoryConditions(self)
    local winningForces = __TS__ArrayFilter(
        self.forces,
        function(____, f) return f:checkVictoryConditions(self) end
    )
    return (((#winningForces == 1) and (function() return winningForces[1] end)) or (function() return nil end))()
end
function ForceModule.prototype.getActivePlayers(self)
    local result = {}
    do
        local i = 0
        while i < GetBJMaxPlayerSlots() do
            local currentPlayer = MapPlayer:fromIndex(i)
            local isPlaying = currentPlayer.slotState == PLAYER_SLOT_STATE_PLAYING
            local isUser = currentPlayer.controller == MAP_CONTROL_USER
            if isPlaying and isUser then
                __TS__ArrayPush(result, currentPlayer)
            end
            i = i + 1
        end
    end
    return result
end
function ForceModule.prototype.getForce(self, whichForce)
    return __TS__ArrayFilter(
        self.forces,
        function(____, f) return f:is(whichForce) end
    )[1]
end
function ForceModule.prototype.getForces(self)
    return self.forces
end
function ForceModule.prototype.initForcesFor(self, opts)
    __TS__ArrayForEach(
        opts,
        function(____, opt) return self:addPlayerToForce(opt.player, opt.role.name) end
    )
end
function ForceModule.prototype.getForceFromName(self, name)
    local force = self:getForce(name)
    if not force then
        local ____switch30 = name
        if ____switch30 == ALIEN_FORCE_NAME then
            goto ____switch30_case_0
        elseif ____switch30 == CREW_FORCE_NAME then
            goto ____switch30_case_1
        end
        goto ____switch30_case_default
        ::____switch30_case_0::
        do
            force = __TS__New(AlienForce, self)
            goto ____switch30_end
        end
        ::____switch30_case_1::
        ::____switch30_case_default::
        do
            force = __TS__New(CrewmemberForce, self)
            goto ____switch30_end
        end
        ::____switch30_end::
        __TS__ArrayPush(self.forces, force)
    end
    return force
end
function ForceModule.prototype.getOpts(self, callback)
    local optSelection = __TS__New(OptSelection, {name = CREW_FORCE_NAME, isRequired = false, text = STR_OPT_HUMAN, hotkey = "h", type = OPT_TYPES.PROTAGANIST, chanceToExist = 100})
    optSelection:addOpt({name = ALIEN_FORCE_NAME, isRequired = true, text = STR_OPT_ALIEN, hotkey = "a", type = OPT_TYPES.ANTAGONST, chanceToExist = 100, count = 1})
    optSelection:askPlayerOpts(self)
    local timer = CreateTimer()
    StartTimerBJ(
        timer,
        false,
        ((#self:getActivePlayers() > 1) and 15) or 1
    )
    local timerTrig = __TS__New(Trigger)
    local timerDialog = CreateTimerDialog(timer)
    TimerDialogDisplay(timerDialog, true)
    timerTrig:registerTimerExpireEvent(timer)
    timerTrig:addAction(
        function()
            TimerDialogDisplay(timerDialog, false)
            local results = optSelection:endOptSelection(self)
            callback(results)
        end
    )
end
function ForceModule.prototype.addPlayerToForce(self, player, forceName)
    local force = self:getForce(forceName)
    if not force then
        force = self:getForceFromName(forceName)
    end
    self.playerForceDetails:set(player, force)
    force:addPlayer(player)
end
function ForceModule.prototype.getPlayerForce(self, player)
    return self.playerForceDetails:get(player)
end
return ____exports
end,
["src.app.world.vision-type"] = function() local ____exports = {}
____exports.VISION_TYPE = {}
____exports.VISION_TYPE.NORMAL = 0
____exports.VISION_TYPE[____exports.VISION_TYPE.NORMAL] = "NORMAL"
____exports.VISION_TYPE.OBSERVER = 1
____exports.VISION_TYPE[____exports.VISION_TYPE.OBSERVER] = "OBSERVER"
____exports.VISION_TYPE.ALIEN = 2
____exports.VISION_TYPE[____exports.VISION_TYPE.ALIEN] = "ALIEN"
____exports.VISION_TYPE.NIGHT_VISION = 3
____exports.VISION_TYPE[____exports.VISION_TYPE.NIGHT_VISION] = "NIGHT_VISION"
____exports.VISION_TYPE.BLIND = 4
____exports.VISION_TYPE[____exports.VISION_TYPE.BLIND] = "BLIND"
return ____exports
end,
["src.app.events.event"] = function() require("lualib_bundle");
local ____exports = {}
____exports.EVENT_TYPE = {}
____exports.EVENT_TYPE.ALIEN_TRANSFORM_CREW = 0
____exports.EVENT_TYPE[____exports.EVENT_TYPE.ALIEN_TRANSFORM_CREW] = "ALIEN_TRANSFORM_CREW"
____exports.EVENT_TYPE.CREW_TRANSFORM_ALIEN = 1
____exports.EVENT_TYPE[____exports.EVENT_TYPE.CREW_TRANSFORM_ALIEN] = "CREW_TRANSFORM_ALIEN"
____exports.EVENT_TYPE.CREW_BECOMES_ALIEN = 2
____exports.EVENT_TYPE[____exports.EVENT_TYPE.CREW_BECOMES_ALIEN] = "CREW_BECOMES_ALIEN"
____exports.EVENT_TYPE.CREW_GAIN_RESOLVE = 3
____exports.EVENT_TYPE[____exports.EVENT_TYPE.CREW_GAIN_RESOLVE] = "CREW_GAIN_RESOLVE"
____exports.EVENT_TYPE.CREW_GAIN_DESPAIR = 4
____exports.EVENT_TYPE[____exports.EVENT_TYPE.CREW_GAIN_DESPAIR] = "CREW_GAIN_DESPAIR"
____exports.EVENT_TYPE.CREW_LOSE_RESOLVE = 5
____exports.EVENT_TYPE[____exports.EVENT_TYPE.CREW_LOSE_RESOLVE] = "CREW_LOSE_RESOLVE"
____exports.EVENT_TYPE.CREW_LOSE_DESPAIR = 6
____exports.EVENT_TYPE[____exports.EVENT_TYPE.CREW_LOSE_DESPAIR] = "CREW_LOSE_DESPAIR"
____exports.EVENT_TYPE.CREW_CHANGES_FLOOR = 7
____exports.EVENT_TYPE[____exports.EVENT_TYPE.CREW_CHANGES_FLOOR] = "CREW_CHANGES_FLOOR"
____exports.EVENT_TYPE.STATION_SECURITY_DISABLED = 8
____exports.EVENT_TYPE[____exports.EVENT_TYPE.STATION_SECURITY_DISABLED] = "STATION_SECURITY_DISABLED"
____exports.EVENT_TYPE.STATION_SECURITY_ENABLED = 9
____exports.EVENT_TYPE[____exports.EVENT_TYPE.STATION_SECURITY_ENABLED] = "STATION_SECURITY_ENABLED"
____exports.EventListener = __TS__Class()
local EventListener = ____exports.EventListener
EventListener.name = "EventListener"
function EventListener.prototype.____constructor(self, ____type, onEvent)
    self.eventType = ____type
    self.onEvent = function(____, data) return onEvent(self, data) end
end
return ____exports
end,
["src.app.force.alien-force"] = function() require("lualib_bundle");
local ____exports = {}
local ____force_2Dtype = require("src.app.force.force-type")
local ForceType = ____force_2Dtype.ForceType
local ____vector2 = require("src.app.types.vector2")
local vectorFromUnit = ____vector2.vectorFromUnit
local ____ability_2Dids = require("src.resources.ability-ids")
local ABIL_TRANSFORM_HUMAN_ALIEN = ____ability_2Dids.ABIL_TRANSFORM_HUMAN_ALIEN
local ABIL_TRANSFORM_ALIEN_HUMAN = ____ability_2Dids.ABIL_TRANSFORM_ALIEN_HUMAN
local ____ability_2Dtooltips = require("src.resources.ability-tooltips")
local TRANSFORM_TOOLTIP = ____ability_2Dtooltips.TRANSFORM_TOOLTIP
local ____vision_2Dtype = require("src.app.world.vision-type")
local VISION_TYPE = ____vision_2Dtype.VISION_TYPE
local ____event = require("src.app.events.event")
local EVENT_TYPE = ____event.EVENT_TYPE
local EventListener = ____event.EventListener
local ____index = require("node_modules.w3ts.index")
local Trigger = ____index.Trigger
local Unit = ____index.Unit
local ____crewmember_2Dnames = require("src.resources.crewmember-names")
local ROLE_TYPES = ____crewmember_2Dnames.ROLE_TYPES
local ____sound_2Dref = require("src.app.types.sound-ref")
local SoundWithCooldown = ____sound_2Dref.SoundWithCooldown
local ____strings = require("src.resources.strings")
local STR_CHAT_ALIEN_HOST = ____strings.STR_CHAT_ALIEN_HOST
local STR_CHAT_ALIEN_SPAWN = ____strings.STR_CHAT_ALIEN_SPAWN
local STR_CHAT_ALIEN_TAG = ____strings.STR_CHAT_ALIEN_TAG
____exports.ALIEN_FORCE_NAME = "ALIEN"
____exports.DEFAULT_ALIEN_FORM = FourCC("ALI1")
____exports.ALIEN_CHAT_COLOR = "6f2583"
local ALIEN_CHAT_SOUND_REF = __TS__New(SoundWithCooldown, 5, "Sounds\\AlienChatSound.mp3")
____exports.AlienForce = __TS__Class()
local AlienForce = ____exports.AlienForce
AlienForce.name = "AlienForce"
AlienForce.____super = ForceType
setmetatable(AlienForce, AlienForce.____super)
setmetatable(AlienForce.prototype, AlienForce.____super.prototype)
function AlienForce.prototype.____constructor(self, forceModule)
    ForceType.prototype.____constructor(self, forceModule)
    self.name = ____exports.ALIEN_FORCE_NAME
    self.alienAIPlayer = Player(24)
    self.playerAlienUnits = __TS__New(Map)
    self.playerIsTransformed = __TS__New(Map)
    self.playerIsAlienAlliesOnly = __TS__New(Map)
    self.currentAlienEvolution = ____exports.DEFAULT_ALIEN_FORM
    self.alienTakesDamageTrigger = __TS__New(Trigger)
    self.alienDealsDamageTrigger = __TS__New(Trigger)
    forceModule.game.event:addListener(
        __TS__New(
            EventListener,
            EVENT_TYPE.CREW_GAIN_DESPAIR,
            function(from, data)
                local crewmember = data.crewmember
                __TS__ArrayForEach(
                    self:getPlayers(),
                    function(____, p) return crewmember.unit:shareVision(p, true) end
                )
            end
        )
    )
    forceModule.game.event:addListener(
        __TS__New(
            EventListener,
            EVENT_TYPE.CREW_LOSE_DESPAIR,
            function(from, data)
                local crewmember = data.crewmember
                __TS__ArrayForEach(
                    self:getPlayers(),
                    function(____, p) return crewmember.unit:shareVision(p, false) end
                )
            end
        )
    )
    self.alienTakesDamageTrigger:addAction(
        function() return self:onAlienTakesDamage() end
    )
    self.alienDealsDamageTrigger:registerAnyUnitEvent(EVENT_PLAYER_UNIT_DAMAGED)
    self.alienDealsDamageTrigger:addAction(
        function() return self:onAlienDealsDamage() end
    )
end
function AlienForce.prototype.makeAlien(self, game, who, owner)
    local unitLocation = vectorFromUnit(who.handle)
    local alien = self.playerAlienUnits:get(owner)
    if not alien then
        who:addAbility(ABIL_TRANSFORM_HUMAN_ALIEN)
        alien = Unit:fromHandle(
            CreateUnit(owner.handle, self.currentAlienEvolution, unitLocation.x, unitLocation.y, who.facing)
        )
        alien.invulnerable = true
        alien:pauseEx(true)
        alien.show = false
        alien:suspendExperience(true)
        self:registerAlienTakesDamageExperience(alien)
        local crewmember = game.crewModule:getCrewmemberForPlayer(owner)
        if crewmember then
            crewmember:setVisionType(VISION_TYPE.ALIEN)
        end
        BlzStartUnitAbilityCooldown(
            who.handle,
            ABIL_TRANSFORM_HUMAN_ALIEN,
            who:getAbilityCooldown(ABIL_TRANSFORM_HUMAN_ALIEN, 0)
        )
        alien.color = PLAYER_COLOR_BROWN
        game.abilityModule:trackUnitOrdersForAbilities(alien)
        self.playerAlienUnits:set(owner, alien)
        game.event:sendEvent(EVENT_TYPE.CREW_BECOMES_ALIEN, {crewmember = crewmember, alien = alien})
        return alien
    end
    return alien
end
function AlienForce.prototype.getFormName(self)
    return GetObjectName(self.currentAlienEvolution)
end
function AlienForce.prototype.setHost(self, who)
    self.alienHost = who
end
function AlienForce.prototype.getHost(self)
    return self.alienHost
end
function AlienForce.prototype.checkVictoryConditions(self, forceModule)
    return #self.players > 0
end
function AlienForce.prototype.addPlayerMainUnit(self, game, whichUnit, player)
    ForceType.prototype.addPlayerMainUnit(self, game, whichUnit, player)
    self:makeAlien(game, whichUnit, player)
    self:setHost(player)
end
function AlienForce.prototype.removePlayerMainUnit(self, game, whichUnit, player)
    ForceType.prototype.removePlayerMainUnit(self, game, whichUnit, player)
    whichUnit:removeAbility(ABIL_TRANSFORM_HUMAN_ALIEN)
end
function AlienForce.prototype.transform(self, game, who, toAlien)
    self.playerIsTransformed:set(who, toAlien)
    local alien = self.playerAlienUnits:get(who)
    local unit = self.playerUnits:get(who)
    local crewmember = game.crewModule:getCrewmemberForPlayer(who)
    if not alien then
        error(
            __TS__New(Error, "AlienForce::transform No alien for player!"),
            0
        )
    end
    if not unit then
        error(
            __TS__New(Error, "AlienForce::transform No human for player!"),
            0
        )
    end
    local toHide = ((toAlien and (function() return unit end)) or (function() return alien end))()
    local toShow = ((toAlien and (function() return alien end)) or (function() return unit end))()
    local facing = toHide.facing
    local pos = vectorFromUnit(toHide.handle)
    local unitWasSelected = toHide:isSelected(who)
    local healthPercent = GetUnitLifePercent(toHide.handle)
    toHide.invulnerable = true
    toHide:pauseEx(true)
    toHide.show = false
    toShow.x = pos.x
    toShow.y = pos.y
    toShow.show = true
    toShow.invulnerable = false
    toShow:pauseEx(false)
    SetUnitLifePercentBJ(toShow.handle, healthPercent)
    if toAlien then
        local unitName = ((who == self.alienHost) and "Alien Host") or "Alien Spawn"
        toShow.nameProper = unitName
        self.forceModule:repairAllAlliances(who)
        who:setAlliance(self.forceModule.stationSecurity, ALLIANCE_PASSIVE, true)
        self.forceModule.stationSecurity:setAlliance(who, ALLIANCE_PASSIVE, true)
        game.event:sendEvent(EVENT_TYPE.CREW_TRANSFORM_ALIEN, {crewmember = crewmember, alien = alien})
    else
        self.forceModule:repairAllAlliances(who)
        game.event:sendEvent(EVENT_TYPE.ALIEN_TRANSFORM_CREW, {crewmember = crewmember, alien = alien})
    end
    if unitWasSelected then
        SelectUnitAddForPlayer(toShow.handle, who.handle)
    end
    return toShow
end
function AlienForce.prototype.isPlayerTransformed(self, who)
    return not (not self.playerIsTransformed:get(who))
end
function AlienForce.prototype.updateForceTooltip(self, game, whichCrew)
    local income = game.crewModule:calculateIncome(whichCrew)
    local tooltip = TRANSFORM_TOOLTIP(
        income,
        true,
        self:getFormName(),
        whichCrew.role
    )
    local tfAlien = TRANSFORM_TOOLTIP(
        income,
        false,
        self:getFormName(),
        whichCrew.role
    )
    if GetLocalPlayer() == whichCrew.player.handle then
        BlzSetAbilityExtendedTooltip(ABIL_TRANSFORM_HUMAN_ALIEN, tooltip, 0)
        BlzSetAbilityExtendedTooltip(ABIL_TRANSFORM_ALIEN_HUMAN, tfAlien, 0)
    end
end
function AlienForce.prototype.onUnitGainsXp(self, game, whichUnit, amount)
    ForceType.prototype.onUnitGainsXp(self, game, whichUnit, amount)
    local alien = self.playerAlienUnits:get(whichUnit.player)
    if not alien then
        return
    end
    alien:suspendExperience(false)
    alien:addExperience(
        MathRound(amount),
        true
    )
    alien:suspendExperience(true)
end
function AlienForce.prototype.getAlienFormForPlayer(self, who)
    return self.playerAlienUnits:get(who)
end
function AlienForce.prototype.registerAlienTakesDamageExperience(self, alien)
    self.alienTakesDamageTrigger:registerUnitEvent(alien, EVENT_UNIT_DAMAGED)
end
function AlienForce.prototype.onAlienDealsDamage(self)
    local damageSource = Unit:fromHandle(
        GetEventDamageSource()
    )
    local damagedUnit = Unit:fromHandle(
        BlzGetEventDamageTarget()
    )
    local damagingPlayer = damageSource.owner
    local damagedPlayer = damagedUnit.owner
    if not self.playerAlienUnits:has(damagingPlayer) then
        return
    end
    local damageAmount = GetEventDamage()
    if (damagingPlayer ~= damagedPlayer) and (not self.playerAlienUnits:has(damagedPlayer)) then
        local xpGained
        local damagingSecurity = (damagedPlayer == self.forceModule.stationProperty) or (damagedPlayer == self.forceModule.stationSecurity)
        local isAlienForm = self.playerIsTransformed:get(damagingPlayer)
        xpGained = ((damagingSecurity and (function() return damageAmount * 0.3 end)) or (function() return ((isAlienForm and (function() return damageAmount * 1 end)) or (function() return damageAmount * 0.4 end))() end))()
        local crewmember = self.forceModule.game.crewModule:getCrewmemberForPlayer(damagingPlayer)
        if crewmember then
            self:onUnitGainsXp(self.forceModule.game, crewmember, xpGained)
        end
    end
end
function AlienForce.prototype.onAlienTakesDamage(self)
    local damageAmount = GetEventDamage()
    local damageSource = Unit:fromHandle(
        GetEventDamageSource()
    )
    local damagedUnit = Unit:fromHandle(
        BlzGetEventDamageTarget()
    )
    local damagingPlayer = damageSource.owner
    local damagedPlayer = damagedUnit.owner
    if (damagingPlayer ~= damagedPlayer) and (not self.playerAlienUnits:has(damagingPlayer)) then
        local damageSourceForce = self.forceModule:getPlayerForce(damagingPlayer)
        local crewmember = self.forceModule.game.crewModule:getCrewmemberForPlayer(damagingPlayer)
        if damageSourceForce and crewmember then
            local xpAmount = (((crewmember.role == ROLE_TYPES.SEC_GUARD) and (function() return damageAmount * 1.3 end)) or (function() return 1 end))()
            damageSourceForce:onUnitGainsXp(self.forceModule.game, crewmember, xpAmount)
        end
    end
end
function AlienForce.prototype.getChatRecipients(self, sendingPlayer)
    if self:isPlayerTransformed(sendingPlayer) and self.playerIsAlienAlliesOnly:get(sendingPlayer) then
        return self.players
    end
    return ForceType.prototype.getChatRecipients(self, sendingPlayer)
end
function AlienForce.prototype.getChatName(self, who)
    if self:isPlayerTransformed(who) then
        return ((self.alienHost == who) and STR_CHAT_ALIEN_HOST) or STR_CHAT_ALIEN_SPAWN
    end
    return ForceType.prototype.getChatName(self, who)
end
function AlienForce.prototype.getChatColor(self, who)
    if self:isPlayerTransformed(who) then
        return ____exports.ALIEN_CHAT_COLOR
    end
    return ForceType.prototype.getChatColor(self, who)
end
function AlienForce.prototype.getChatSoundRef(self, who)
    if self:isPlayerTransformed(who) then
        return ALIEN_CHAT_SOUND_REF
    end
    return ForceType.prototype.getChatSoundRef(self, who)
end
function AlienForce.prototype.getChatTag(self, who)
    if self.playerIsAlienAlliesOnly:get(who) then
        return STR_CHAT_ALIEN_TAG
    end
    return ForceType.prototype.getChatTag(self, who)
end
return ____exports
end,
["src.app.buff.despair"] = function() require("lualib_bundle");
local ____exports = {}
local ____buff_2Dinstance = require("src.app.buff.buff-instance")
local DynamicBuff = ____buff_2Dinstance.DynamicBuff
local ____sound_2Dref = require("src.app.types.sound-ref")
local SoundWithCooldown = ____sound_2Dref.SoundWithCooldown
local SoundRef = ____sound_2Dref.SoundRef
local ____ability_2Dids = require("src.resources.ability-ids")
local ABIL_ACCURACY_PENALTY_30 = ____ability_2Dids.ABIL_ACCURACY_PENALTY_30
local ____event = require("src.app.events.event")
local EVENT_TYPE = ____event.EVENT_TYPE
local ____buff_2Dids = require("src.resources.buff-ids")
local BUFF_ID = ____buff_2Dids.BUFF_ID
local DESPAIR_ABILITY_ID = FourCC("A00D")
local DESPAIR_BUFF_ID = FourCC("B004")
____exports.Despair = __TS__Class()
local Despair = ____exports.Despair
Despair.name = "Despair"
Despair.____super = DynamicBuff
setmetatable(Despair, Despair.____super)
setmetatable(Despair.prototype, Despair.____super.prototype)
function Despair.prototype.____constructor(self, game, crewmember)
    DynamicBuff.prototype.____constructor(self)
    self.name = BUFF_ID.DESPAIR
    self.checkForDespairBuffTicker = 0
    self.jumpScareSound = __TS__New(SoundWithCooldown, 10, "Sounds\\HeavyBreath.mp3")
    self.despairMusic = __TS__New(SoundRef, "Music\\FlightIntoTheUnkown.mp3", true)
    self.despairMusic:setVolume(127)
    self.crewmember = crewmember
    self.prevUnitHealth = self.crewmember.unit:getState(UNIT_STATE_LIFE)
end
function Despair.prototype.process(self, game, delta)
    local result = DynamicBuff.prototype.process(self, game, delta)
    if not self.isActive then
        return result
    end
    local currentHealth = self.crewmember.unit:getState(UNIT_STATE_LIFE)
    local deltaHealth = currentHealth - self.prevUnitHealth
    self.checkForDespairBuffTicker = self.checkForDespairBuffTicker + delta
    if deltaHealth > 0 then
        self.crewmember.unit:setState(UNIT_STATE_LIFE, currentHealth - (deltaHealth / 2))
    end
    if self.checkForDespairBuffTicker >= 1 then
        self.checkForDespairBuffTicker = 0
        if not UnitHasBuffBJ(self.crewmember.unit.handle, DESPAIR_BUFF_ID) then
            game:useDummyFor(
                function(dummy)
                    SetUnitX(dummy, self.crewmember.unit.x)
                    SetUnitY(dummy, self.crewmember.unit.y + 50)
                    IssueTargetOrder(dummy, "faeriefire", self.crewmember.unit.handle)
                end,
                DESPAIR_ABILITY_ID
            )
        end
    end
    return result
end
function Despair.prototype.onStatusChange(self, game, newStatus)
    if newStatus then
        self.crewmember.unit:addAbility(ABIL_ACCURACY_PENALTY_30)
        self.despairMusic:setVolume(127)
        if GetLocalPlayer() == self.crewmember.player.handle then
            StopMusic(true)
            self.despairMusic:playSound()
            self.jumpScareSound:playSound()
        end
        if not UnitHasBuffBJ(self.crewmember.unit.handle, DESPAIR_BUFF_ID) then
            game:useDummyFor(
                function(dummy)
                    SetUnitX(dummy, self.crewmember.unit.x)
                    SetUnitY(dummy, self.crewmember.unit.y + 50)
                    IssueTargetOrder(dummy, "faeriefire", self.crewmember.unit.handle)
                end,
                DESPAIR_ABILITY_ID
            )
        end
        game.event:sendEvent(EVENT_TYPE.CREW_GAIN_DESPAIR, {crewmember = self.crewmember, instance = self})
    else
        self.crewmember.unit:removeAbility(ABIL_ACCURACY_PENALTY_30)
        UnitRemoveBuffBJ(DESPAIR_BUFF_ID, self.crewmember.unit.handle)
        __TS__ArrayForEach(
            self.onChangeCallbacks,
            function(____, cb) return cb(self) end
        )
        if GetLocalPlayer() == self.crewmember.player.handle then
            self.despairMusic:stopSound()
            self.jumpScareSound:stopSound()
            ResumeMusic()
        end
        game.event:sendEvent(EVENT_TYPE.CREW_LOSE_DESPAIR, {crewmember = self.crewmember, instance = self})
    end
end
return ____exports
end,
["src.app.crewmember.crewmember-type"] = function() require("lualib_bundle");
local ____exports = {}
local ____resolve = require("src.app.buff.resolve")
local Resolve = ____resolve.Resolve
local ____unit_2Dhas_2Dweapon = require("src.app.weapons.guns.unit-has-weapon")
local ArmableUnit = ____unit_2Dhas_2Dweapon.ArmableUnit
local ____despair = require("src.app.buff.despair")
local Despair = ____despair.Despair
local ____buff_2Dinstance = require("src.app.buff.buff-instance")
local BuffInstanceCallback = ____buff_2Dinstance.BuffInstanceCallback
local ____vision_2Dtype = require("src.app.world.vision-type")
local VISION_TYPE = ____vision_2Dtype.VISION_TYPE
local ____ability_2Dids = require("src.resources.ability-ids")
local TECH_WEP_DAMAGE = ____ability_2Dids.TECH_WEP_DAMAGE
____exports.Crewmember = __TS__Class()
local Crewmember = ____exports.Crewmember
Crewmember.name = "Crewmember"
Crewmember.____super = ArmableUnit
setmetatable(Crewmember, Crewmember.____super)
setmetatable(Crewmember.prototype, Crewmember.____super.prototype)
function Crewmember.prototype.____constructor(self, game, player, unit, force, role)
    ArmableUnit.prototype.____constructor(self, unit)
    self.name = ""
    self.visionType = VISION_TYPE.NORMAL
    self.damageUpgradeLevel = 0
    self.damageBonusMult = 1
    self.crewModule = game.crewModule
    self.player = player
    self.unit = unit
    self.resolve = __TS__New(Resolve, game, self)
    self.despair = __TS__New(Despair, game, self)
    self.force = force
    self.role = role
    self.resolve:onChange(
        function() return self.weapon and self:updateTooltips(game.weaponModule) end
    )
    self.despair:onChange(
        function() return self.weapon and self:updateTooltips(game.weaponModule) end
    )
end
function Crewmember.prototype.setUnit(self, unit)
    self.unit = unit
end
function Crewmember.prototype.setRole(self, role)
    self.role = role
end
function Crewmember.prototype.setName(self, name)
    self.name = name
end
function Crewmember.prototype.setPlayer(self, player)
    self.player = player
end
function Crewmember.prototype.onWeaponAdd(self, weaponModule, whichGun)
    self.weapon = whichGun
end
function Crewmember.prototype.onWeaponRemove(self, weaponModule, whichGun)
    self.weapon = nil
end
function Crewmember.prototype.onDamage(self, game)
    local resolveActive = self.resolve:getIsActive()
    local maxHP = BlzGetUnitMaxHP(self.unit.handle)
    local hpPercentage = ((GetUnitState(self.unit.handle, UNIT_STATE_LIFE) - GetEventDamage()) * 0.7) / maxHP
    if (not resolveActive) and (hpPercentage <= 0.3) then
        self.resolve:addInstance(
            game,
            self.unit,
            __TS__New(
                BuffInstanceCallback,
                function()
                    return GetUnitLifePercent(self.unit.handle) <= 30
                end
            )
        )
    end
    if resolveActive then
        BlzSetEventDamage(
            GetEventDamage() * 0.7
        )
    end
end
function Crewmember.prototype.getAccuracy(self)
    local modifier = 0
    local accuracy = GetHeroStatBJ(1, self.unit.handle, true)
    return accuracy
end
function Crewmember.prototype.addDespair(self, game, instance)
    self.despair:addInstance(game, self.unit, instance)
end
function Crewmember.prototype.testResolve(self, game)
    SetUnitLifePercentBJ(self.unit.handle, 0.2)
    self.resolve:addInstance(
        game,
        self.unit,
        __TS__New(
            BuffInstanceCallback,
            function()
                return GetUnitLifePercent(self.unit.handle) <= 30
            end
        )
    )
end
function Crewmember.prototype.log(self)
    print("+++ Crewmember Information +++")
    print(
        "Who: " .. tostring(self.name)
    )
    print(
        "Position: " .. tostring(self.role)
    )
end
function Crewmember.prototype.updateTooltips(self, weaponModule)
    if self.weapon then
        self.weapon:updateTooltip(weaponModule, self)
    end
    self.force:updateForceTooltip(weaponModule.game, self)
end
function Crewmember.prototype.addExperience(self, game, amount)
    local oldLevel = GetHeroLevel(self.unit.handle)
    SuspendHeroXP(self.unit.handle, false)
    self.force:onUnitGainsXp(game, self, amount)
    SuspendHeroXP(self.unit.handle, true)
    if GetHeroLevel(self.unit.handle) ~= oldLevel then
        self:updateTooltips(game.weaponModule)
    end
end
function Crewmember.prototype.getVisionType(self)
    return self.visionType
end
function Crewmember.prototype.setVisionType(self, ____type)
    self.visionType = ____type
end
function Crewmember.prototype.onPlayerFinishUpgrade(self)
    local upgradeLevel = self.player:getTechCount(TECH_WEP_DAMAGE, true)
    self.damageUpgradeLevel = upgradeLevel
    self.damageBonusMult = (((upgradeLevel > 0) and (function() return Pow(1.1, upgradeLevel) end)) or (function() return 1 end))()
    self:updateTooltips(self.crewModule.game.weaponModule)
end
function Crewmember.prototype.getDamageBonusMult(self)
    return self.damageBonusMult
end
return ____exports
end,
["src.app.world.zone-id"] = function() require("lualib_bundle");
local ____exports = {}
local ____colours = require("src.resources.colours")
local COL_VENTS = ____colours.COL_VENTS
local COL_CARGO_A = ____colours.COL_CARGO_A
local COL_FLOOR_1 = ____colours.COL_FLOOR_1
____exports.ZONE_TYPE = {}
____exports.ZONE_TYPE.FLOOR_1 = "FLOOR_1"
____exports.ZONE_TYPE.FLOOR_2 = "FLOOR_2"
____exports.ZONE_TYPE.FLOOR_3 = "FLOOR_3"
____exports.ZONE_TYPE.CARGO_A = "CARGO_A"
____exports.ZONE_TYPE.CARGO_A_VENT = "CARGO_A_VENT"
____exports.ZONE_TYPE.SERVICE_TUNNELS = "SERVICE_TUNNELS"
____exports.STRING_TO_ZONE_TYPE = __TS__New(Map)
____exports.STRING_TO_ZONE_TYPE:set("FLOOR_1", ____exports.ZONE_TYPE.FLOOR_1)
____exports.STRING_TO_ZONE_TYPE:set("FLOOR_2", ____exports.ZONE_TYPE.FLOOR_2)
____exports.STRING_TO_ZONE_TYPE:set("FLOOR_3", ____exports.ZONE_TYPE.FLOOR_3)
____exports.STRING_TO_ZONE_TYPE:set("CARGO_A", ____exports.ZONE_TYPE.CARGO_A)
____exports.STRING_TO_ZONE_TYPE:set("CARGO_A_VENT", ____exports.ZONE_TYPE.CARGO_A_VENT)
____exports.STRING_TO_ZONE_TYPE:set("SERVICE_TUNNELS", ____exports.ZONE_TYPE.SERVICE_TUNNELS)
____exports.ZONE_TYPE_TO_ZONE_NAME = __TS__New(Map)
____exports.ZONE_TYPE_TO_ZONE_NAME:set(
    ____exports.ZONE_TYPE.FLOOR_1,
    tostring(COL_FLOOR_1) .. "Floor 1|r - Recreation"
)
____exports.ZONE_TYPE_TO_ZONE_NAME:set(
    ____exports.ZONE_TYPE.SERVICE_TUNNELS,
    tostring(COL_VENTS) .. "Service Tunnels|r"
)
____exports.ZONE_TYPE_TO_ZONE_NAME:set(
    ____exports.ZONE_TYPE.CARGO_A,
    tostring(COL_CARGO_A) .. "Cargo|r"
)
____exports.ZONE_TYPE_TO_ZONE_NAME:set(
    ____exports.ZONE_TYPE.CARGO_A_VENT,
    tostring(COL_VENTS) .. "Cargo Vents|r"
)
return ____exports
end,
["src.app.crewmember.crewmember-module"] = function() require("lualib_bundle");
local ____exports = {}
local ____crewmember_2Dtype = require("src.app.crewmember.crewmember-type")
local Crewmember = ____crewmember_2Dtype.Crewmember
local ____crewmember_2Dnames = require("src.resources.crewmember-names")
local ROLE_NAMES = ____crewmember_2Dnames.ROLE_NAMES
local ROLE_TYPES = ____crewmember_2Dnames.ROLE_TYPES
local ____index = require("node_modules.w3ts.index")
local Trigger = ____index.Trigger
local Unit = ____index.Unit
local ____weapon_2Dconstants = require("src.app.weapons.weapon-constants")
local BURST_RIFLE_ITEM_ID = ____weapon_2Dconstants.BURST_RIFLE_ITEM_ID
local SHOTGUN_ITEM_ID = ____weapon_2Dconstants.SHOTGUN_ITEM_ID
local ____zone_2Did = require("src.app.world.zone-id")
local ZONE_TYPE = ____zone_2Did.ZONE_TYPE
local ____ability_2Dids = require("src.resources.ability-ids")
local TECH_WEP_DAMAGE = ____ability_2Dids.TECH_WEP_DAMAGE
local CREWMEMBER_UNIT_ID = FourCC("H001")
local DELTA_CHECK = 0.25
local INCOME_EVERY = 20
____exports.CrewModule = __TS__Class()
local CrewModule = ____exports.CrewModule
CrewModule.name = "CrewModule"
function CrewModule.prototype.____constructor(self, game)
    self.CREW_MEMBERS = {}
    self.playerCrewmembers = __TS__New(Map)
    self.allJobs = {}
    self.timeSinceLastIncome = 0
    self.game = game
    self.crewmemberDamageTrigger = __TS__New(Trigger)
    self.crewmemberDamageTrigger:registerAnyUnitEvent(EVENT_PLAYER_UNIT_DAMAGED)
    self.crewmemberDamageTrigger:addCondition(
        Condition(
            function()
                local player = GetOwningPlayer(
                    GetTriggerUnit()
                )
                return GetPlayerId(player) <= 22
            end
        )
    )
    self.crewmemberDamageTrigger:addAction(
        function()
            local unit = Unit:fromHandle(
                GetTriggerUnit()
            )
            local crew = self:getCrewmemberForUnit(unit)
            if crew then
                crew:onDamage(game)
            end
        end
    )
    local updateCrewTrigger = __TS__New(Trigger)
    updateCrewTrigger:registerTimerEvent(DELTA_CHECK, true)
    updateCrewTrigger:addAction(
        function() return self:processCrew(DELTA_CHECK) end
    )
end
function CrewModule.prototype.initCrew(self, forces)
    local totalPlayers = 0
    __TS__ArrayForEach(
        forces,
        function(____, force) return (function()
            totalPlayers = totalPlayers + #force:getPlayers()
            return totalPlayers
        end)() end
    )
    local it = 0
    while it < totalPlayers do
        if it == 0 then
            __TS__ArrayPush(self.allJobs, ROLE_TYPES.CAPTAIN)
        elseif it == 1 then
            __TS__ArrayPush(self.allJobs, ROLE_TYPES.NAVIGATOR)
        elseif it == 2 then
            __TS__ArrayPush(self.allJobs, ROLE_TYPES.DOCTOR)
        else
            __TS__ArrayPush(self.allJobs, ROLE_TYPES.SEC_GUARD)
        end
        it = it + 1
    end
    it = 0
    while it < #forces do
        local force = forces[it + 1]
        local players = force:getPlayers()
        local y = 0
        while y < #players do
            local player = players[y + 1]
            local crew = self:createCrew(player, force)
            crew:updateTooltips(self.game.weaponModule)
            y = y + 1
        end
        it = it + 1
    end
end
function CrewModule.prototype.processCrew(self, time)
    local doIncome = self.timeSinceLastIncome >= INCOME_EVERY
    __TS__ArrayForEach(
        self.CREW_MEMBERS,
        function(____, crew)
            crew.resolve:process(self.game, time)
            crew.despair:process(self.game, time)
        end
    )
    if doIncome then
        self.timeSinceLastIncome = 0
        local amount = INCOME_EVERY / 60
        __TS__ArrayForEach(
            self.CREW_MEMBERS,
            function(____, crew)
                local calculatedIncome = MathRound(
                    amount * self:calculateIncome(crew)
                )
                crew.player:setState(
                    PLAYER_STATE_RESOURCE_GOLD,
                    crew.player:getState(PLAYER_STATE_RESOURCE_GOLD) + calculatedIncome
                )
            end
        )
    else
        self.timeSinceLastIncome = self.timeSinceLastIncome + time
    end
end
function CrewModule.prototype.createCrew(self, player, force)
    local role = self:getCrewmemberRole()
    local name = self:getCrewmemberName(role)
    local nUnit = Unit:fromHandle(
        CreateUnit(player.handle, CREWMEMBER_UNIT_ID, 0, 0, bj_UNIT_FACING)
    )
    local crewmember = __TS__New(Crewmember, self.game, player, nUnit, force, role)
    crewmember:setName(name)
    crewmember:setPlayer(player)
    self.playerCrewmembers:set(player, crewmember)
    __TS__ArrayPush(self.CREW_MEMBERS, crewmember)
    self.game.worldModule:travel(crewmember.unit, ZONE_TYPE.FLOOR_1)
    force:addPlayerMainUnit(self.game, nUnit, player)
    SelectUnitAddForPlayer(crewmember.unit.handle, player.handle)
    PanCameraToTimedForPlayer(player.handle, nUnit.x, nUnit.y, 0)
    local roleGaveWeapons = false
    if crewmember.role == ROLE_TYPES.CAPTAIN then
        nUnit:setHeroLevel(2, false)
    elseif crewmember.role == ROLE_TYPES.SEC_GUARD then
        player:setTechResearched(TECH_WEP_DAMAGE, 1)
        local item = CreateItem(SHOTGUN_ITEM_ID, 0, 0)
        UnitAddItem(crewmember.unit.handle, item)
        self.game.weaponModule:applyItemEquip(crewmember, item)
        roleGaveWeapons = true
    elseif crewmember.role == ROLE_TYPES.DOCTOR then
        SetHeroStr(
            nUnit.handle,
            GetHeroStr(nUnit.handle, false) + 2,
            true
        )
        SetHeroInt(
            nUnit.handle,
            GetHeroInt(nUnit.handle, false) + 4,
            true
        )
    elseif crewmember.role == ROLE_TYPES.NAVIGATOR then
        SetHeroAgi(
            nUnit.handle,
            GetHeroAgi(nUnit.handle, false) + 5,
            true
        )
    end
    if not roleGaveWeapons then
        local item = CreateItem(BURST_RIFLE_ITEM_ID, 0, 0)
        UnitAddItem(crewmember.unit.handle, item)
        self.game.weaponModule:applyItemEquip(crewmember, item)
    end
    BlzShowUnitTeamGlow(crewmember.unit.handle, false)
    BlzSetUnitName(nUnit.handle, crewmember.role)
    BlzSetHeroProperName(nUnit.handle, crewmember.name)
    SuspendHeroXP(nUnit.handle, true)
    return crewmember
end
function CrewModule.prototype.calculateIncome(self, crew)
    local crewModified = 1
    local baseIncome = 200
    local incomePerLevel = 50
    local crewLevel = crew.unit:getHeroLevel() - 1
    local crewExperience = crew.unit.experience
    return baseIncome + (incomePerLevel * crewLevel)
end
function CrewModule.prototype.getCrewmemberRole(self)
    local i = math.floor(
        math.random() * #self.allJobs
    )
    local role = self.allJobs[i + 1]
    __TS__ArraySplice(self.allJobs, i, 1)
    return role
end
function CrewModule.prototype.getCrewmemberName(self, role)
    if ROLE_NAMES:has(role) then
        local namesForRole = ROLE_NAMES:get(role)
        local i = GetRandomInt(0, #namesForRole - 1)
        local name = namesForRole[i + 1]
        __TS__ArraySplice(namesForRole, i, 1)
        ROLE_NAMES:set(role, namesForRole)
        return name
    end
    return "NAME NOT FOUND " .. tostring(role)
end
function CrewModule.prototype.getCrewmemberForPlayer(self, player)
    return self.playerCrewmembers:get(player)
end
function CrewModule.prototype.getCrewmemberForUnit(self, unit)
    for ____, member in ipairs(self.CREW_MEMBERS) do
        if member.unit == unit then
            return member
        end
    end
end
return ____exports
end,
["src.app.space.ship"] = function() require("lualib_bundle");
local ____exports = {}
local ____vector2 = require("src.app.types.vector2")
local Vector2 = ____vector2.Vector2
____exports.Ship = __TS__Class()
local Ship = ____exports.Ship
Ship.name = "Ship"
function Ship.prototype.____constructor(self, startX, startY)
    self.mass = 1
    self.acceleration = 200
    self.accelerationBackwards = 25
    self.velocity = 0
    self.velocityForwardMax = 1200
    self.velocityBackwardsMax = 500
    self.isMovingBackwards = false
    self.isGoingToStop = false
    self.position = __TS__New(Vector2, startX, startY)
    self.momentum = __TS__New(Vector2, 0, 0)
    self.thrust = __TS__New(Vector2, 0, 0)
end
function Ship.prototype.updateThrust(self, deltaTime)
    if self.unit then
        local shipFacing = GetUnitFacing(self.unit)
        if self.isGoingToStop then
            local changeBy = ((self.isMovingBackwards and (function() return self.acceleration end)) or (function() return self.accelerationBackwards end))()
            if self.velocity < changeBy then
                self.velocity = 0
                self.isGoingToStop = false
            else
                self.velocity = self.velocity - changeBy
            end
        end
        local thrust = __TS__New(
            Vector2,
            Cos(shipFacing * bj_DEGTORAD),
            Sin(shipFacing * bj_DEGTORAD)
        )
        self.momentum = thrust:multiplyN(self.velocity)
        if self.isMovingBackwards then
            self.momentum = __TS__New(Vector2, -self.momentum.x, -self.momentum.y)
        end
    end
    return self
end
function Ship.prototype.applyThrust(self, deltaTime)
    local maximum = ((self.isMovingBackwards and (function() return self.velocityForwardMax end)) or (function() return self.velocityBackwardsMax end))()
    self.momentum = self.momentum:add(
        self.thrust:multiplyN(deltaTime)
    )
    local length = self.momentum:getLength()
    if length > maximum then
        self.momentum:setLengthN(maximum)
    end
    return self
end
function Ship.prototype.updatePosition(self, deltaTime, mainShipDelta)
    self.position = self.position:add(
        self.momentum:multiplyN(deltaTime)
    )
    if mainShipDelta then
        self.position = self.position:subtract(mainShipDelta)
    end
    if self.unit then
        SetUnitX(self.unit, self.position.x)
        SetUnitY(self.unit, self.position.y)
    end
    return self
end
function Ship.prototype.increaseVelocity(self)
    self.isGoingToStop = false
    if self.isMovingBackwards then
        self.velocity = self.velocity - self.acceleration
        if self.velocity < 0 then
            self.isMovingBackwards = false
            self.velocity = self.acceleration + self.velocity
        end
    else
        self.velocity = self.velocity + self.acceleration
    end
    self:applyVelocityCap()
    return self
end
function Ship.prototype.decreaseVelocity(self)
    self.isGoingToStop = false
    if not self.isMovingBackwards then
        self.velocity = self.velocity - self.accelerationBackwards
        if self.velocity < 0 then
            self.isMovingBackwards = true
            self.velocity = self.accelerationBackwards + self.velocity
        end
    else
        self.velocity = self.velocity + self.accelerationBackwards
    end
    self:applyVelocityCap()
    return self
end
function Ship.prototype.applyVelocityCap(self)
    if self.isMovingBackwards then
        if self.velocity > self.velocityBackwardsMax then
            self.velocity = self.velocityBackwardsMax
        end
    else
        if self.velocity > self.velocityForwardMax then
            self.velocity = self.velocityForwardMax
        end
    end
end
function Ship.prototype.goToAStop(self)
    self.isGoingToStop = true
    return self
end
function Ship.prototype.getMomentum(self)
    return self.momentum
end
function Ship.prototype.getPosition(self)
    return self.position
end
function Ship.prototype.setPosition(self, pos)
    self.position = pos
end
return ____exports
end,
["src.app.space.space-objects.space-object"] = function() require("lualib_bundle");
local ____exports = {}
____exports.SpaceObject = __TS__Class()
local SpaceObject = ____exports.SpaceObject
SpaceObject.name = "SpaceObject"
function SpaceObject.prototype.____constructor(self, location)
    self.loaded = false
    self.position = location
end
function SpaceObject.prototype.updateLocation(self, delta)
    self.position = self.position:subtract(delta)
    return self
end
function SpaceObject.prototype.getLocation(self)
    return self.position
end
function SpaceObject.prototype.insideRect(self, minX, minY, maxX, maxY)
    local pos = self.position
    return (((pos.x > minX) and (pos.x < maxX)) and (pos.y > minY)) and (pos.y < maxY)
end
function SpaceObject.prototype.isLoaded(self)
    return self.loaded
end
function SpaceObject.prototype.load(self, game)
    self.loaded = true
end
function SpaceObject.prototype.offload(self)
    self.loaded = false
end
return ____exports
end,
["src.app.space.space-objects.asteroid"] = function() require("lualib_bundle");
local ____exports = {}
local ____space_2Dobject = require("src.app.space.space-objects.space-object")
local SpaceObject = ____space_2Dobject.SpaceObject
local ____vector2 = require("src.app.types.vector2")
local Vector2 = ____vector2.Vector2
____exports.ASTEROID_UNIT_ID = FourCC("h002")
____exports.Asteroid = __TS__Class()
local Asteroid = ____exports.Asteroid
Asteroid.name = "Asteroid"
Asteroid.____super = SpaceObject
setmetatable(Asteroid, Asteroid.____super)
setmetatable(Asteroid.prototype, Asteroid.____super.prototype)
function Asteroid.prototype.____constructor(self, locX, locY)
    SpaceObject.prototype.____constructor(
        self,
        __TS__New(Vector2, locX, locY)
    )
end
function Asteroid.prototype.load(self, game)
    SpaceObject.prototype.load(self, game)
    local location = self:getLocation()
    self.unit = CreateUnit(game.forceModule.neutralPassive.handle, ____exports.ASTEROID_UNIT_ID, location.x, location.y, bj_UNIT_FACING)
    SetUnitTimeScale(self.unit, 0.1)
    SetUnitScalePercent(
        self.unit,
        GetRandomReal(50, 300),
        GetRandomReal(50, 300),
        GetRandomReal(50, 300)
    )
    SetUnitFacing(
        self.unit,
        GetRandomReal(0, 360)
    )
end
function Asteroid.prototype.onUpdate(self)
    if self.unit then
        local loc = self:getLocation()
        SetUnitX(self.unit, loc.x)
        SetUnitY(self.unit, loc.y)
    end
end
function Asteroid.prototype.offload(self)
    SpaceObject.prototype.offload(self)
    if self.unit then
        RemoveUnit(self.unit)
    end
end
function Asteroid.prototype.pickle(self)
end
return ____exports
end,
["src.app.space.space-module"] = function() require("lualib_bundle");
local ____exports = {}
local ____ship = require("src.app.space.ship")
local Ship = ____ship.Ship
local ____index = require("node_modules.w3ts.index")
local Trigger = ____index.Trigger
local ____asteroid = require("src.app.space.space-objects.asteroid")
local Asteroid = ____asteroid.Asteroid
____exports.SpaceModule = __TS__Class()
local SpaceModule = ____exports.SpaceModule
SpaceModule.name = "SpaceModule"
function SpaceModule.prototype.____constructor(self, game)
    self.spaceRect = gg_rct_Space
    self.shipUpdateTimer = __TS__New(Trigger)
    self.shipAbilityTrigger = __TS__New(Trigger)
    self.shipAccelAbilityId = FourCC("A001")
    self.shipDeaccelAbilityId = FourCC("A000")
    self.shipStopAbilityId = FourCC("A006")
    self.game = game
    self.ships = {}
    self.spaceObjects = {}
    local spaceX = GetRectCenterX(self.spaceRect)
    local spaceY = GetRectCenterY(self.spaceRect)
    self.mainShip = __TS__New(Ship, spaceX, spaceY)
    self.mainShip.unit = CreateUnit(
        Player(0),
        FourCC("h003"),
        spaceX,
        spaceY,
        bj_UNIT_FACING
    )
    self:createTestShip()
    local i = 0
    while i < 400 do
        i = i + 1
        self:createTestAsteroid()
    end
    self:initShips()
    self:initShipAbilities()
end
function SpaceModule.prototype.createTestShip(self)
    local unitId = FourCC("h000")
    local spaceX = GetRectCenterX(self.spaceRect)
    local spaceY = GetRectCenterY(self.spaceRect)
    local ship = __TS__New(Ship, spaceX, spaceY)
    ship.unit = CreateUnit(
        Player(0),
        unitId,
        spaceX,
        spaceY,
        bj_UNIT_FACING
    )
    __TS__ArrayPush(self.ships, ship)
end
function SpaceModule.prototype.createTestAsteroid(self)
    if not self.mainShip.unit then
        return
    end
    local x = GetUnitX(self.mainShip.unit) + GetRandomReal(-5000, 5000)
    local y = GetUnitY(self.mainShip.unit) + GetRandomReal(-5000, 5000)
    local newAsteroid = __TS__New(Asteroid, x, y)
    __TS__ArrayPush(self.spaceObjects, newAsteroid)
    newAsteroid:load(self.game)
end
function SpaceModule.prototype.initShips(self)
    local SHIP_UPDATE_PERIOD = 0.03
    self.shipUpdateTimer:registerTimerEvent(SHIP_UPDATE_PERIOD, true)
    self.shipUpdateTimer:addAction(
        function() return self:updateShips(SHIP_UPDATE_PERIOD) end
    )
end
function SpaceModule.prototype.updateShips(self, updatePeriod)
    self.mainShip:updateThrust(updatePeriod)
    self.mainShip:applyThrust(updatePeriod)
    local oldShipPos = self.mainShip:getPosition()
    local shipDelta = self.mainShip:getMomentum():multiplyN(updatePeriod)
    __TS__ArrayForEach(
        self.spaceObjects,
        function(____, o) return o:updateLocation(shipDelta):onUpdate() end
    )
    __TS__ArrayForEach(
        self.ships,
        function(____, ship)
            ship:updateThrust(updatePeriod):applyThrust(updatePeriod):updatePosition(updatePeriod, shipDelta)
        end
    )
end
function SpaceModule.prototype.getShipForUnit(self, unit)
    if unit == self.mainShip.unit then
        return self.mainShip
    end
    for ____, ship in ipairs(self.ships) do
        if ship.unit == unit then
            return ship
        end
    end
end
function SpaceModule.prototype.getAskellonPosition(self)
    local result = self.mainShip:getPosition()
    return result
end
function SpaceModule.prototype.initShipAbilities(self)
    self.shipAbilityTrigger:registerAnyUnitEvent(EVENT_PLAYER_UNIT_SPELL_EFFECT)
    self.shipAbilityTrigger:addCondition(
        Condition(
            function() return ((GetSpellAbilityId() == self.shipAccelAbilityId) or (GetSpellAbilityId() == self.shipDeaccelAbilityId)) or (GetSpellAbilityId() == self.shipStopAbilityId) end
        )
    )
    self.shipAbilityTrigger:addAction(
        function()
            local unit = GetTriggerUnit()
            local castAbilityId = GetSpellAbilityId()
            local ship = self:getShipForUnit(unit)
            if ship and (castAbilityId == self.shipAccelAbilityId) then
                ship:increaseVelocity()
            elseif ship and (castAbilityId == self.shipDeaccelAbilityId) then
                ship:decreaseVelocity()
            elseif ship then
                ship:goToAStop()
            end
        end
    )
end
return ____exports
end,
["src.app.types.game-time-elapsed"] = function() require("lualib_bundle");
local ____exports = {}
____exports.GameTimeElapsed = __TS__Class()
local GameTimeElapsed = ____exports.GameTimeElapsed
GameTimeElapsed.name = "GameTimeElapsed"
function GameTimeElapsed.prototype.____constructor(self)
    self.everyTenSeconds = 0
    self.globalTimer = CreateTimer()
    TimerStart(
        self.globalTimer,
        10000,
        false,
        function() return self:incrementTimer() end
    )
end
function GameTimeElapsed.prototype.incrementTimer(self)
    self.everyTenSeconds = self.everyTenSeconds + 1
    TimerStart(
        self.globalTimer,
        10000,
        false,
        function() return self:incrementTimer() end
    )
end
function GameTimeElapsed.prototype.getTimeElapsed(self)
    return (self.everyTenSeconds * 10) + TimerGetElapsed(self.globalTimer)
end
return ____exports
end,
["src.app.shops.gene-modules"] = function() require("lualib_bundle");
local ____exports = {}
local ____ability_2Dids = require("src.resources.ability-ids")
local TECH_NO_GENES_TIER_1 = ____ability_2Dids.TECH_NO_GENES_TIER_1
local TECH_NO_GENES_TIER_2 = ____ability_2Dids.TECH_NO_GENES_TIER_2
local TECH_NO_GENES_TIER_3 = ____ability_2Dids.TECH_NO_GENES_TIER_3
local TECH_NO_UNIT_IN_SPLICER = ____ability_2Dids.TECH_NO_UNIT_IN_SPLICER
local TECH_HAS_GENES_TIER_1 = ____ability_2Dids.TECH_HAS_GENES_TIER_1
local TECH_HAS_GENES_TIER_2 = ____ability_2Dids.TECH_HAS_GENES_TIER_2
local TECH_HAS_GENES_TIER_3 = ____ability_2Dids.TECH_HAS_GENES_TIER_3
local GENE_INSTALL_NIGHTEYE = ____ability_2Dids.GENE_INSTALL_NIGHTEYE
local ABIL_NIGHTEYE = ____ability_2Dids.ABIL_NIGHTEYE
local GENE_INSTALL_MOBILITY = ____ability_2Dids.GENE_INSTALL_MOBILITY
local GENE_TECH_MOBILITY = ____ability_2Dids.GENE_TECH_MOBILITY
local GENE_INSTALL_COSMIC_SENSITIVITY = ____ability_2Dids.GENE_INSTALL_COSMIC_SENSITIVITY
local TECH_MAJOR_HEALTHCARE = ____ability_2Dids.TECH_MAJOR_HEALTHCARE
local ____index = require("node_modules.w3ts.index")
local Trigger = ____index.Trigger
local Unit = ____index.Unit
local ____serilog = require("src.lib.serilog.serilog")
local Log = ____serilog.Log
local ____alien_2Dforce = require("src.app.force.alien-force")
local ALIEN_FORCE_NAME = ____alien_2Dforce.ALIEN_FORCE_NAME
local ____strings = require("src.resources.strings")
local STR_GENE_SUCCESSFUL = ____strings.STR_GENE_SUCCESSFUL
local STR_GENE_ALIEN_SUCCESSFUL = ____strings.STR_GENE_ALIEN_SUCCESSFUL
local ____event = require("src.app.events.event")
local EventListener = ____event.EventListener
local EVENT_TYPE = ____event.EVENT_TYPE
local ____crewmember_2Dnames = require("src.resources.crewmember-names")
local ROLE_TYPES = ____crewmember_2Dnames.ROLE_TYPES
____exports.GeneModule = __TS__Class()
local GeneModule = ____exports.GeneModule
GeneModule.name = "GeneModule"
function GeneModule.prototype.____constructor(self, game)
    self.instances = {}
    self.group = CreateGroup()
    self.game = game
end
function GeneModule.prototype.initGenes(self)
    local players = self.game.forceModule:getActivePlayers()
    __TS__ArrayForEach(
        players,
        function(____, p)
            p:setTechResearched(TECH_NO_GENES_TIER_1, 1)
            p:setTechResearched(TECH_NO_GENES_TIER_2, 1)
            p:setTechResearched(TECH_NO_GENES_TIER_3, 1)
        end
    )
    local checkTrig = __TS__New(Trigger)
    checkTrig:registerTimerEvent(0.5, true)
    checkTrig:addAction(
        function() return self:checkGeneRequirements() end
    )
end
function GeneModule.prototype.addNewGeneInstance(self, who, geneUiUnit)
    local crew = self.game.crewModule:getCrewmemberForUnit(who)
    if crew then
        local instance = {
            source = crew,
            ui = geneUiUnit,
            castTrigger = __TS__New(Trigger)
        }
        __TS__ArrayPush(self.instances, instance)
        instance.castTrigger:registerUnitEvent(geneUiUnit, EVENT_UNIT_SPELL_FINISH)
        instance.castTrigger:addAction(
            function() return self:onGeneCast(instance) end
        )
    else
        geneUiUnit:kill()
    end
end
function GeneModule.prototype.checkGeneRequirements(self)
    self.instances = __TS__ArrayFilter(
        self.instances,
        function(____, gInstance)
            if not gInstance.ui:isAlive() then
                gInstance.castTrigger:destroy()
                return false
            end
            local instanceOwner = gInstance.source.unit.owner
            local units = {}
            GroupEnumUnitsInRect(
                self.group,
                gg_rct_GeneSplicer,
                Filter(
                    function()
                        local u = Unit:fromHandle(
                            GetFilterUnit()
                        )
                        if (u.owner ~= instanceOwner) and (u.typeId ~= FourCC("ncp2")) then
                            local crew = self.game.crewModule:getCrewmemberForUnit(u)
                            if crew then
                                __TS__ArrayPush(units, crew)
                            end
                        end
                        return false
                    end
                )
            )
            instanceOwner:setTechResearched(TECH_NO_UNIT_IN_SPLICER, ((#units == 1) and 1) or 0)
            if #units == 1 then
                local targetedUnit = units[1]
                gInstance.unitInGeneZone = targetedUnit
                local unitHasTier1Genes = self:hasTier1Genes(targetedUnit)
                local unitHasTier2Genes = self:hasTier2Genes(targetedUnit)
                local unitHasTier3Genes = self:hasTier3Genes(targetedUnit)
                gInstance.unitInGeneZone.player:setTechResearched(TECH_NO_GENES_TIER_1, (unitHasTier1Genes and 0) or 1)
                gInstance.unitInGeneZone.player:setTechResearched(TECH_NO_GENES_TIER_2, (unitHasTier2Genes and 0) or 1)
                gInstance.unitInGeneZone.player:setTechResearched(TECH_NO_GENES_TIER_3, (unitHasTier3Genes and 0) or 1)
            end
            return true
        end
    )
end
function GeneModule.prototype.hasTier1Genes(self, who)
    return who.player:getTechCount(TECH_HAS_GENES_TIER_1, true) > 0
end
function GeneModule.prototype.hasTier2Genes(self, who)
    return who.player:getTechCount(TECH_HAS_GENES_TIER_2, true) > 0
end
function GeneModule.prototype.hasTier3Genes(self, who)
    return who.player:getTechCount(TECH_HAS_GENES_TIER_3, true) > 0
end
function GeneModule.prototype.onGeneCast(self, instance)
    local castAbil = GetSpellAbilityId()
    local techLevel = self.game.researchModule:getMajorUpgradeLevel(TECH_MAJOR_HEALTHCARE)
    local doGiveBonusXp = self.game.researchModule:getUpgradeSource(TECH_MAJOR_HEALTHCARE, 2) == ROLE_TYPES.DOCTOR
    local bonusXpInfested = self.game.researchModule:isUpgradeInfested(TECH_MAJOR_HEALTHCARE, 2)
    if not instance.unitInGeneZone then
        return
    end
    local target = instance.unitInGeneZone
    local alienForce = self.game.forceModule:getForce(ALIEN_FORCE_NAME)
    local targetIsAlien = alienForce:hasPlayer(target.player)
    local messageSuccessful = STR_GENE_SUCCESSFUL()
    local messageAlien = STR_GENE_ALIEN_SUCCESSFUL()
    DisplayTextToPlayer(instance.source.player.handle, 0, 0, messageSuccessful)
    DisplayTextToPlayer(target.player.handle, 0, 0, messageSuccessful)
    if castAbil == GENE_INSTALL_NIGHTEYE then
        SetPlayerTechResearched(instance.unitInGeneZone.player.handle, TECH_HAS_GENES_TIER_1, 1)
        if not targetIsAlien then
            UnitAddAbility(instance.unitInGeneZone.unit.handle, ABIL_NIGHTEYE)
        end
    elseif castAbil == GENE_INSTALL_MOBILITY then
        SetPlayerTechResearched(instance.unitInGeneZone.player.handle, TECH_HAS_GENES_TIER_1, 1)
        if not targetIsAlien then
            SetPlayerTechResearched(instance.unitInGeneZone.player.handle, GENE_TECH_MOBILITY, 1)
        end
    elseif castAbil == GENE_INSTALL_COSMIC_SENSITIVITY then
        SetPlayerTechResearched(instance.unitInGeneZone.player.handle, TECH_HAS_GENES_TIER_2, 1)
        if not targetIsAlien then
            self.game.event:addListener(
                __TS__New(
                    EventListener,
                    EVENT_TYPE.CREW_TRANSFORM_ALIEN,
                    function(event, data)
                        local zone = self.game.worldModule:getUnitZone(data.alien)
                        local ourZone = self.game.worldModule:getUnitZone(target.unit)
                        Log.Information("Game transform event post listener")
                        if (zone and ourZone) and (zone.id == ourZone.id) then
                            DisplayTextToPlayer(target.player.handle, 0, 0, "TRANSFORM DETECTED")
                        end
                    end
                )
            )
        end
    end
    if (instance.source.role == ROLE_TYPES.DOCTOR) and doGiveBonusXp then
        local installerForce = self.game.forceModule:getPlayerForce(instance.source.player)
        local targetForce = self.game.forceModule:getPlayerForce(instance.unitInGeneZone.player)
        installerForce:onUnitGainsXp(self.game, instance.source, 100)
        targetForce:onUnitGainsXp(self.game, instance.unitInGeneZone, 100)
    end
    if bonusXpInfested then
        local host = alienForce:getHost()
        if host then
            local hostCrewmember = self.game.crewModule:getCrewmemberForPlayer(host)
            local ____ = hostCrewmember and alienForce:onUnitGainsXp(self.game, hostCrewmember, 100)
        end
    end
    if targetIsAlien then
        DisplayTextToPlayer(target.player.handle, 0, 0, messageAlien)
    end
end
return ____exports
end,
["src.app.abilities.ability-type"] = function() local ____exports = {}
return ____exports
end,
["src.resources.filters"] = function() local ____exports = {}
____exports.FilterIsEnemyAndAlive = function(enemyOfWho) return Filter(
    function()
        local fUnit = GetFilterUnit()
        return IsPlayerEnemy(
            GetOwningPlayer(fUnit),
            enemyOfWho.handle
        ) and (not BlzIsUnitInvulnerable(fUnit))
    end
) end
return ____exports
end,
["src.app.abilities.alien.acid-pool"] = function() require("lualib_bundle");
local ____exports = {}
local ____vector2 = require("src.app.types.vector2")
local vectorFromUnit = ____vector2.vectorFromUnit
local ____vector3 = require("src.app.types.vector3")
local Vector3 = ____vector3.Vector3
local ____projectile = require("src.app.weapons.projectile.projectile")
local Projectile = ____projectile.Projectile
local ____projectile_2Dtarget = require("src.app.weapons.projectile.projectile-target")
local ProjectileTargetStatic = ____projectile_2Dtarget.ProjectileTargetStatic
local ProjectileMoverParabolic = ____projectile_2Dtarget.ProjectileMoverParabolic
local ____filters = require("src.resources.filters")
local FilterIsEnemyAndAlive = ____filters.FilterIsEnemyAndAlive
local ____unit = require("node_modules.w3ts.handles.unit")
local Unit = ____unit.Unit
local DAMAGE_PER_SECOND = 100
local ABILITY_SLOW_ID = FourCC("A00B")
local MISSILE_SPEED = 400
local MISSILE_ARC_HEIGHT = 800
local MISSILE_LAUNCH_SFX = "Abilities\\Spells\\Undead\\DeathCoil\\DeathCoilSpecialArt.mdl"
local MISSILE_SFX = "Abilities\\Weapons\\ChimaeraAcidMissile\\ChimaeraAcidMissile.mdl"
local POOL_SFX = "war3mapImported\\ToxicField.mdx"
local POOL_DURATION = 6
local POOL_AREA = 350
____exports.AcidPoolAbility = __TS__Class()
local AcidPoolAbility = ____exports.AcidPoolAbility
AcidPoolAbility.name = "AcidPoolAbility"
function AcidPoolAbility.prototype.____constructor(self)
    self.damageGroup = CreateGroup()
    self.lastDelta = 0
    self.checkForSlowEvery = 0.3
    self.timeElapsedSinceLastSlowCheck = 0.5
    self.timeElapsed = 0
end
function AcidPoolAbility.prototype.initialise(self, module)
    self.casterUnit = Unit:fromHandle(
        GetTriggerUnit()
    )
    self.castingPlayer = self.casterUnit.owner
    self.targetLoc = __TS__New(
        Vector3,
        GetSpellTargetX(),
        GetSpellTargetY(),
        0
    )
    self.targetLoc.z = module.game:getZFromXY(self.targetLoc.x, self.targetLoc.y)
    local polarPoint = vectorFromUnit(self.casterUnit.handle):applyPolarOffset(self.casterUnit.facing, 80)
    local startLoc = __TS__New(
        Vector3,
        polarPoint.x,
        polarPoint.y,
        module.game:getZFromXY(polarPoint.x, polarPoint.y) + 30
    )
    local deltaTarget = self.targetLoc:subtract(startLoc)
    local projectile = __TS__New(
        Projectile,
        self.casterUnit.handle,
        startLoc,
        __TS__New(ProjectileTargetStatic, deltaTarget),
        __TS__New(
            ProjectileMoverParabolic,
            startLoc,
            self.targetLoc,
            Deg2Rad(
                GetRandomReal(30, 70)
            )
        )
    ):onDeath(
        function(proj)
            self:createPool(
                proj:getPosition()
            )
        end
    ):onCollide(
        function() return true end
    )
    projectile:addEffect(
        MISSILE_SFX,
        __TS__New(Vector3, 0, 0, 0),
        deltaTarget:normalise(),
        1
    )
    local sfx = AddSpecialEffect(MISSILE_LAUNCH_SFX, polarPoint.x, polarPoint.y)
    BlzSetSpecialEffectHeight(sfx, -30)
    DestroyEffect(sfx)
    module.game.weaponModule:addProjectile(projectile)
    return true
end
function AcidPoolAbility.prototype.createPool(self, atWhere)
    self.poolLocation = atWhere
    self.sfx = AddSpecialEffect(POOL_SFX, atWhere.x, atWhere.y)
    BlzSetSpecialEffectTimeScale(self.sfx, 0.01)
    BlzSetSpecialEffectScale(self.sfx, 1.3)
end
function AcidPoolAbility.prototype.process(self, abMod, delta)
    if self.poolLocation and self.castingPlayer then
        self.timeElapsed = self.timeElapsed + delta
        self.timeElapsedSinceLastSlowCheck = self.timeElapsedSinceLastSlowCheck + delta
        GroupEnumUnitsInRange(
            self.damageGroup,
            self.poolLocation.x,
            self.poolLocation.y,
            POOL_AREA,
            FilterIsEnemyAndAlive(self.castingPlayer)
        )
        self.lastDelta = delta
        ForGroup(
            self.damageGroup,
            function() return self:damageUnit() end
        )
        if self.timeElapsedSinceLastSlowCheck >= self.checkForSlowEvery then
            ForGroup(
                self.damageGroup,
                function() return self:slowUnit(abMod) end
            )
            self.timeElapsedSinceLastSlowCheck = 0
        end
    end
    return self.timeElapsed < POOL_DURATION
end
function AcidPoolAbility.prototype.damageUnit(self)
    if self.casterUnit then
        local unit = GetEnumUnit()
        UnitDamageTarget(self.casterUnit.handle, unit, DAMAGE_PER_SECOND * self.lastDelta, true, true, ATTACK_TYPE_MAGIC, DAMAGE_TYPE_ACID, WEAPON_TYPE_WHOKNOWS)
    end
end
function AcidPoolAbility.prototype.slowUnit(self, abMod)
    local unit = GetEnumUnit()
    abMod.game:useDummyFor(
        function(dummy)
            SetUnitX(
                dummy,
                GetUnitX(unit)
            )
            SetUnitY(
                dummy,
                GetUnitY(unit) + 50
            )
            IssueTargetOrder(
                dummy,
                "slow",
                GetEnumUnit()
            )
        end,
        ABILITY_SLOW_ID
    )
end
function AcidPoolAbility.prototype.destroy(self, module)
    local ____ = self.sfx and BlzSetSpecialEffectTimeScale(self.sfx, 10)
    local ____ = self.sfx and DestroyEffect(self.sfx)
    DestroyGroup(self.damageGroup)
    return true
end
return ____exports
end,
["src.app.abilities.alien.leap"] = function() require("lualib_bundle");
local ____exports = {}
local ____vector3 = require("src.app.types.vector3")
local Vector3 = ____vector3.Vector3
local ____translators = require("src.lib.translators")
local PlayNewSoundOnUnit = ____translators.PlayNewSoundOnUnit
local ____unit = require("node_modules.w3ts.handles.unit")
local Unit = ____unit.Unit
local LEAP_ID = FourCC("LEAP")
local LEAP_DISTANCE_MAX = 400
____exports.LeapAbility = __TS__Class()
local LeapAbility = ____exports.LeapAbility
LeapAbility.name = "LeapAbility"
function LeapAbility.prototype.____constructor(self)
    self.leapExpired = false
    self.timeElapsed = 0
end
function LeapAbility.prototype.initialise(self, abMod)
    self.casterUnit = GetTriggerUnit()
    local cdRemaining = BlzGetUnitAbilityCooldownRemaining(self.casterUnit, LEAP_ID)
    if cdRemaining > 0 then
        return false
    end
    local casterLoc = __TS__New(
        Vector3,
        GetUnitX(self.casterUnit),
        GetUnitY(self.casterUnit),
        0
    )
    local clickLoc = __TS__New(
        Vector3,
        GetOrderPointX(),
        GetOrderPointY(),
        0
    )
    local isSelfCast = GetSpellAbilityId() > 0
    if (not isSelfCast) and (clickLoc:subtract(casterLoc):getLength() < 800) then
        return false
    end
    casterLoc.z = abMod.game:getZFromXY(casterLoc.x, casterLoc.y)
    local targetLoc = __TS__New(Vector3, 0, 0, 0)
    if not isSelfCast then
        targetLoc.x = GetOrderPointX()
        targetLoc.y = GetOrderPointY()
        local delta = targetLoc:subtract(casterLoc)
        local distance = delta:getLength()
        delta = delta:normalise():multiplyN(
            math.min(distance, LEAP_DISTANCE_MAX)
        )
        targetLoc = casterLoc:add(delta)
        targetLoc.z = casterLoc.z
        BlzStartUnitAbilityCooldown(
            self.casterUnit,
            LEAP_ID,
            BlzGetAbilityCooldown(LEAP_ID, 0)
        )
    else
        targetLoc.x = GetSpellTargetX()
        targetLoc.y = GetSpellTargetY()
        targetLoc.z = abMod.game:getZFromXY(targetLoc.x, targetLoc.y) + 10
    end
    local sfx = AddSpecialEffect("war3mapImported\\DustWave.mdx", casterLoc.x, casterLoc.y)
    BlzSetSpecialEffectAlpha(sfx, 40)
    BlzSetSpecialEffectScale(sfx, 0.7)
    BlzSetSpecialEffectTimeScale(sfx, 1)
    BlzSetSpecialEffectTime(sfx, 0.2)
    BlzSetSpecialEffectYaw(
        sfx,
        GetRandomInt(0, 360)
    )
    DestroyEffect(sfx)
    sfx = AddSpecialEffect("war3mapImported\\DustWave.mdx", casterLoc.x, casterLoc.y)
    BlzSetSpecialEffectAlpha(sfx, 40)
    BlzSetSpecialEffectScale(sfx, 0.8)
    BlzSetSpecialEffectTimeScale(sfx, 0.7)
    BlzSetSpecialEffectTime(sfx, 0.2)
    BlzSetSpecialEffectYaw(
        sfx,
        GetRandomInt(0, 360)
    )
    DestroyEffect(sfx)
    sfx = AddSpecialEffect("war3mapImported\\DustWave.mdx", casterLoc.x, casterLoc.y)
    BlzSetSpecialEffectAlpha(sfx, 40)
    BlzSetSpecialEffectScale(sfx, 0.9)
    BlzSetSpecialEffectTimeScale(sfx, 0.4)
    BlzSetSpecialEffectTime(sfx, 0.2)
    BlzSetSpecialEffectYaw(
        sfx,
        GetRandomInt(0, 360)
    )
    DestroyEffect(sfx)
    PlayNewSoundOnUnit(
        self:getRandomSound(),
        Unit:fromHandle(self.casterUnit),
        100
    )
    local angle = Rad2Deg(
        Atan2(targetLoc.y - casterLoc.y, targetLoc.x - casterLoc.x)
    )
    BlzSetUnitFacingEx(self.casterUnit, angle)
    SetUnitAnimation(self.casterUnit, "attack")
    SetUnitTimeScale(self.casterUnit, 0.3)
    abMod.game.leapModule:newLeap(self.casterUnit, targetLoc, 45, 3):onFinish(
        function(leapEntry)
            self.leapExpired = true
        end
    )
    return true
end
function LeapAbility.prototype.getRandomSound(self)
    local soundPaths = {"Units\\Critters\\Hydralisk\\HydraliskYes1.flac", "Units\\Critters\\Hydralisk\\HydraliskYesAttack1.flac", "Units\\Critters\\Hydralisk\\HydraliskYesAttack2.flac"}
    return soundPaths[GetRandomInt(0, #soundPaths - 1) + 1]
end
function LeapAbility.prototype.process(self, abMod, delta)
    return not self.leapExpired
end
function LeapAbility.prototype.destroy(self, abMod)
    if self.casterUnit then
        local casterLoc = __TS__New(
            Vector3,
            GetUnitX(self.casterUnit),
            GetUnitY(self.casterUnit),
            0
        )
        casterLoc.z = abMod.game:getZFromXY(casterLoc.x, casterLoc.y)
        local sfx = AddSpecialEffect("war3mapImported\\DustWave.mdx", casterLoc.x, casterLoc.y)
        BlzSetSpecialEffectAlpha(sfx, 40)
        BlzSetSpecialEffectScale(sfx, 0.8)
        BlzSetSpecialEffectTimeScale(sfx, 0.8)
        BlzSetSpecialEffectTime(sfx, 0.2)
        BlzSetSpecialEffectYaw(
            sfx,
            GetRandomInt(0, 360)
        )
        DestroyEffect(sfx)
        sfx = AddSpecialEffect("war3mapImported\\DustWave.mdx", casterLoc.x, casterLoc.y)
        BlzSetSpecialEffectAlpha(sfx, 40)
        BlzSetSpecialEffectScale(sfx, 0.9)
        BlzSetSpecialEffectTimeScale(sfx, 0.5)
        BlzSetSpecialEffectTime(sfx, 0.2)
        BlzSetSpecialEffectYaw(
            sfx,
            GetRandomInt(0, 360)
        )
        DestroyEffect(sfx)
        SetUnitAnimation(self.casterUnit, "stand")
        SetUnitTimeScale(self.casterUnit, 1)
    end
    return true
end
return ____exports
end,
["src.app.abilities.alien.transform"] = function() require("lualib_bundle");
local ____exports = {}
local ____vector2 = require("src.app.types.vector2")
local Vector2 = ____vector2.Vector2
local vectorFromUnit = ____vector2.vectorFromUnit
local ____vector3 = require("src.app.types.vector3")
local Vector3 = ____vector3.Vector3
local ____projectile = require("src.app.weapons.projectile.projectile")
local Projectile = ____projectile.Projectile
local ____projectile_2Dtarget = require("src.app.weapons.projectile.projectile-target")
local ProjectileTargetStatic = ____projectile_2Dtarget.ProjectileTargetStatic
local ProjectileMoverParabolic = ____projectile_2Dtarget.ProjectileMoverParabolic
local ____alien_2Dforce = require("src.app.force.alien-force")
local ALIEN_FORCE_NAME = ____alien_2Dforce.ALIEN_FORCE_NAME
local ____ability_2Dids = require("src.resources.ability-ids")
local SMART_ORDER_ID = ____ability_2Dids.SMART_ORDER_ID
local ____index = require("node_modules.w3ts.index")
local Trigger = ____index.Trigger
local Unit = ____index.Unit
local CREATE_SFX_EVERY = 0.06
local MEAT_SFX = {"Abilities\\Weapons\\MeatwagonMissile\\MeatwagonMissile.mdl"}
local SFX_HUMAN_BLOOD = "Objects\\Spawnmodels\\Orc\\OrcLargeDeathExplode\\OrcLargeDeathExplode.mdl"
local SFX_ALIEN_BLOOD = "Objects\\Spawnmodels\\Undead\\UndeadLargeDeathExplode\\UndeadLargeDeathExplode.mdl"
local SFX_BLOOD_EXPLODE = "Units\\Undead\\Abomination\\AbominationExplosion.mdl"
local MEAT_AOE = 950
local MEAT_AOE_MIN = 150
local DURATION_TO_ALIEN = 2
local DURATION_TO_HUMAN = 0.5
____exports.TransformAbility = __TS__Class()
local TransformAbility = ____exports.TransformAbility
TransformAbility.name = "TransformAbility"
function TransformAbility.prototype.____constructor(self, toAlienFromHuman)
    self.timeElapsedSinceSFX = CREATE_SFX_EVERY
    self.orderTrigger = __TS__New(Trigger)
    self.toAlien = true
    self.timeElapsed = 0
    self.toAlien = toAlienFromHuman
    self.duration = (self.toAlien and DURATION_TO_ALIEN) or DURATION_TO_HUMAN
end
function TransformAbility.prototype.initialise(self, abMod)
    self.casterUnit = Unit:fromHandle(
        GetTriggerUnit()
    )
    self.orderTrigger:registerUnitEvent(self.casterUnit, EVENT_UNIT_ISSUED_POINT_ORDER)
    self.orderTrigger:addCondition(
        Condition(
            function() return GetIssuedOrderId() == SMART_ORDER_ID end
        )
    )
    self.orderTrigger:addAction(
        function()
            self.previousOrder = GetIssuedOrderId()
            self.previousOrderTarget = __TS__New(
                Vector2,
                GetOrderPointX(),
                GetOrderPointY()
            )
        end
    )
    return true
end
function TransformAbility.prototype.process(self, abMod, delta)
    self.timeElapsed = self.timeElapsed + delta
    self.timeElapsedSinceSFX = self.timeElapsedSinceSFX + delta
    if (self.timeElapsedSinceSFX >= CREATE_SFX_EVERY) and self.casterUnit then
        self.timeElapsedSinceSFX = 0
        local tLoc = vectorFromUnit(self.casterUnit.handle)
        local unitHeight = abMod.game:getZFromXY(tLoc.x, tLoc.y)
        local startLoc = __TS__New(Vector3, tLoc.x, tLoc.y, unitHeight + 80)
        local newTarget = __TS__New(
            Vector3,
            startLoc.x + self:getRandomOffset(),
            startLoc.y + self:getRandomOffset(),
            unitHeight
        )
        local projStartLoc = __TS__New(Vector3, startLoc.x, startLoc.y, unitHeight + 20)
        local projectile = __TS__New(
            Projectile,
            self.casterUnit.handle,
            projStartLoc,
            __TS__New(
                ProjectileTargetStatic,
                newTarget:subtract(startLoc)
            ),
            __TS__New(
                ProjectileMoverParabolic,
                projStartLoc,
                newTarget,
                Deg2Rad(
                    GetRandomReal(60, 85)
                )
            )
        ):onDeath(
            function(proj)
                self:bloodSplash(
                    proj:getPosition()
                )
            end
        ):onCollide(
            function() return true end
        )
        projectile:addEffect(
            self:getRandomSFX(),
            __TS__New(Vector3, 0, 0, 0),
            newTarget:subtract(startLoc):normalise(),
            1
        )
        local bloodSfx = AddSpecialEffect(
            self:getBloodEffect(),
            startLoc.x,
            startLoc.y
        )
        BlzSetSpecialEffectZ(bloodSfx, startLoc.z - 30)
        DestroyEffect(bloodSfx)
        abMod.game.weaponModule:addProjectile(projectile)
    end
    return self.timeElapsed < self.duration
end
function TransformAbility.prototype.getRandomOffset(self)
    local isNegative = GetRandomInt(0, 1)
    return (((isNegative == 1) and -1) or 1) * math.max(
        MEAT_AOE_MIN,
        GetRandomInt(0, MEAT_AOE)
    )
end
function TransformAbility.prototype.getBloodEffect(self)
    local deltaPercent = self.timeElapsed / self.duration
    local t = GetRandomReal(deltaPercent, deltaPercent * 2)
    if self.toAlien then
        return ((t > 0.5) and SFX_ALIEN_BLOOD) or SFX_HUMAN_BLOOD
    end
    return ((t > 0.5) and SFX_HUMAN_BLOOD) or SFX_ALIEN_BLOOD
end
function TransformAbility.prototype.getRandomSFX(self)
    return MEAT_SFX[GetRandomInt(0, #MEAT_SFX - 1) + 1]
end
function TransformAbility.prototype.bloodSplash(self, where)
end
function TransformAbility.prototype.destroy(self, abMod)
    if self.casterUnit then
        local alienForce = abMod.game.forceModule:getForce(ALIEN_FORCE_NAME)
        local alien = alienForce:transform(abMod.game, self.casterUnit.owner, self.toAlien)
        if self.previousOrder and self.previousOrderTarget then
            IssuePointOrderById(alien.handle, self.previousOrder, self.previousOrderTarget.x, self.previousOrderTarget.y)
        end
        self.orderTrigger:destroy()
    end
    return true
end
return ____exports
end,
["src.app.abilities.human.diode-ejector"] = function() require("lualib_bundle");
local ____exports = {}
local ____vector3 = require("src.app.types.vector3")
local Vector3 = ____vector3.Vector3
local ____projectile = require("src.app.weapons.projectile.projectile")
local Projectile = ____projectile.Projectile
local ____projectile_2Dtarget = require("src.app.weapons.projectile.projectile-target")
local ProjectileTargetStatic = ____projectile_2Dtarget.ProjectileTargetStatic
local ProjectileMoverLinear = ____projectile_2Dtarget.ProjectileMoverLinear
local ____translators = require("src.lib.translators")
local PlayNewSoundOnUnit = ____translators.PlayNewSoundOnUnit
local ____utils = require("src.lib.utils")
local getZFromXY = ____utils.getZFromXY
local ____unit = require("node_modules.w3ts.handles.unit")
local Unit = ____unit.Unit
local NUM_PROJECTILES = 20
local PROJECTILE_CONE = 45
local PROJECTILE_RANGE = 450
local PROJECTILE_SPEED = 2800
____exports.DiodeEjectAbility = __TS__Class()
local DiodeEjectAbility = ____exports.DiodeEjectAbility
DiodeEjectAbility.name = "DiodeEjectAbility"
function DiodeEjectAbility.prototype.____constructor(self)
    self.doneDamage = false
    self.hasLeaped = false
    self.ventDamagePoint = 0.1
    self.startLeapAt = 0.15
    self.weaponIntensityOnCast = 0
    self.leapExpired = false
    self.timeElapsed = 0
end
function DiodeEjectAbility.prototype.initialise(self, abMod)
    self.casterUnit = Unit:fromHandle(
        GetTriggerUnit()
    )
    self.targetLoc = __TS__New(
        Vector3,
        GetSpellTargetX(),
        GetSpellTargetY(),
        0
    )
    self.targetLoc.z = abMod.game:getZFromXY(self.targetLoc.x, self.targetLoc.y)
    self.crew = abMod.game.crewModule:getCrewmemberForUnit(self.casterUnit)
    self.weapon = self.crew.weapon
    self.weaponIntensityOnCast = self.weapon:getIntensity()
    return true
end
function DiodeEjectAbility.prototype.process(self, abMod, delta)
    local leapFinished = false
    self.timeElapsed = self.timeElapsed + delta
    if (not self.doneDamage) and (self.ventDamagePoint <= self.timeElapsed) then
        self.doneDamage = true
        self:doVentDamage(abMod)
    end
    if (not self.hasLeaped) and (self.startLeapAt <= self.timeElapsed) then
        self:startLeap(abMod)
        self.hasLeaped = true
    end
    return not self.leapExpired
end
function DiodeEjectAbility.prototype.doVentDamage(self, abMod)
    if (((not self.casterUnit) or (not self.weapon)) or (not self.crew)) or (not self.targetLoc) then
        return
    end
    local cX = self.casterUnit.x
    local cY = self.casterUnit.y
    local casterLoc = __TS__New(
        Vector3,
        cX,
        cY,
        abMod.game:getZFromXY(cX, cY)
    )
    local projStartLoc = casterLoc:projectTowards2D(self.casterUnit.facing, 30)
    projStartLoc.z = projStartLoc.z + 20
    local angleToTarget = projStartLoc:angle2Dto(self.targetLoc)
    local deltaTarget = self.targetLoc:subtract(projStartLoc)
    local sfxModel = self.weapon:getModelPath()
    local accuracy = self.crew:getAccuracy() / 100
    local projectileRange = PROJECTILE_RANGE * ((1 + accuracy) - 1)
    local spread = PROJECTILE_CONE * ((1 + 1) - accuracy)
    local weaponBaseDamage = self.weapon:getDamage(abMod.game.weaponModule, self.crew)
    local diodeDamage = (50 + (weaponBaseDamage * 3)) / NUM_PROJECTILES
    local endAngle = angleToTarget + spread
    local currentAngle = angleToTarget - spread
    local incrementBy = (endAngle - currentAngle) / NUM_PROJECTILES
    PlayNewSoundOnUnit(
        self.weapon:getSoundPath(),
        self.casterUnit,
        127
    )
    while currentAngle <= endAngle do
        local endLoc = projStartLoc:projectTowards2D(currentAngle, projectileRange)
        endLoc.z = abMod.game:getZFromXY(endLoc.x, endLoc.y)
        local projectile = __TS__New(
            Projectile,
            self.casterUnit.handle,
            __TS__New(Vector3, projStartLoc.x, projStartLoc.y, projStartLoc.z),
            __TS__New(
                ProjectileTargetStatic,
                endLoc:subtract(projStartLoc)
            ),
            __TS__New(ProjectileMoverLinear)
        ):setVelocity(PROJECTILE_SPEED):onCollide(
            function(module, projectile, who)
                projectile:setDestroy(true)
                if self.casterUnit then
                    UnitDamageTarget(self.casterUnit.handle, who, diodeDamage, true, true, ATTACK_TYPE_MAGIC, DAMAGE_TYPE_ACID, WEAPON_TYPE_WHOKNOWS)
                end
            end
        )
        projectile:addEffect(
            sfxModel,
            __TS__New(Vector3, 0, 0, 0),
            deltaTarget:normalise(),
            1
        )
        abMod.game.weaponModule:addProjectile(projectile)
        currentAngle = currentAngle + incrementBy
    end
    self.weapon:setIntensity(0)
end
function DiodeEjectAbility.prototype.startLeap(self, abMod)
    if ((not self.casterUnit) or (not self.weapon)) or (not self.crew) then
        return
    end
    local cX = self.casterUnit.x
    local cY = self.casterUnit.y
    local casterLoc = __TS__New(
        Vector3,
        cX,
        cY,
        getZFromXY(cX, cY)
    )
    local weaponIntensity = self.weaponIntensityOnCast
    local distanceJumpBack = 128 + ((140 * weaponIntensity) / 4)
    local targetLoc = casterLoc:projectTowards2D(self.casterUnit.facing, -distanceJumpBack)
    abMod.game.leapModule:newLeap(self.casterUnit.handle, targetLoc, 45, 3):onFinish(
        function(leapEntry)
            self.leapExpired = true
        end
    )
end
function DiodeEjectAbility.prototype.destroy(self, abMod)
    if self.casterUnit then
        local cX = self.casterUnit.x
        local cY = self.casterUnit.y
        local casterLoc = __TS__New(
            Vector3,
            cX,
            cY,
            abMod.game:getZFromXY(cX, cY)
        )
        local sfx = AddSpecialEffect("Abilities\\Spells\\Orc\\WarStomp\\WarStompCaster.mdl", casterLoc.x, casterLoc.y)
        DestroyEffect(sfx)
    end
    return true
end
return ____exports
end,
["src.app.abilities.alien.scream"] = function() require("lualib_bundle");
local ____exports = {}
local ____buff_2Dinstance = require("src.app.buff.buff-instance")
local BuffInstanceDuration = ____buff_2Dinstance.BuffInstanceDuration
local ____sound_2Dref = require("src.app.types.sound-ref")
local SoundRef = ____sound_2Dref.SoundRef
____exports.ScreamAbility = __TS__Class()
local ScreamAbility = ____exports.ScreamAbility
ScreamAbility.name = "ScreamAbility"
function ScreamAbility.prototype.____constructor(self)
end
function ScreamAbility.prototype.initialise(self, abMod)
    return true
end
function ScreamAbility.prototype.process(self, abMod, delta)
    local screamSound = __TS__New(SoundRef, "Sounds\\Nazgul.wav", false)
    screamSound:playSound()
    KillSoundWhenDone(screamSound.sound)
    __TS__ArrayForEach(
        abMod.game.crewModule.CREW_MEMBERS,
        function(____, c)
            c:addDespair(
                abMod.game,
                __TS__New(
                    BuffInstanceDuration,
                    abMod.game:getTimeStamp(),
                    30
                )
            )
        end
    )
    return false
end
function ScreamAbility.prototype.destroy(self, abMod)
    return true
end
return ____exports
end,
["src.app.abilities.human.sprint-leap"] = function() require("lualib_bundle");
local ____exports = {}
local ____vector2 = require("src.app.types.vector2")
local vectorFromUnit = ____vector2.vectorFromUnit
local ____ability_2Dids = require("src.resources.ability-ids")
local SPRINT_BUFF_ID = ____ability_2Dids.SPRINT_BUFF_ID
local ____vector3 = require("src.app.types.vector3")
local Vector3 = ____vector3.Vector3
local ____utils = require("src.lib.utils")
local getZFromXY = ____utils.getZFromXY
local TECH_UPGRADE_SPRINT_LEAP = FourCC("R001")
____exports.SprintLeapAbility = __TS__Class()
local SprintLeapAbility = ____exports.SprintLeapAbility
SprintLeapAbility.name = "SprintLeapAbility"
function SprintLeapAbility.prototype.____constructor(self)
    self.distanceTravelled = 0
    self.timeElapsed = 0
end
function SprintLeapAbility.prototype.initialise(self, module)
    self.unit = GetTriggerUnit()
    local hasUpgrade = GetPlayerTechCount(
        GetOwningPlayer(self.unit),
        TECH_UPGRADE_SPRINT_LEAP,
        true
    ) > 0
    if not hasUpgrade then
        return false
    end
    self.unitLastLoc = vectorFromUnit(self.unit)
    return true
end
function SprintLeapAbility.prototype.process(self, module, delta)
    self.timeElapsed = self.timeElapsed + delta
    if (self.unit and UnitHasBuffBJ(self.unit, SPRINT_BUFF_ID)) and self.unitLastLoc then
        local newPos = vectorFromUnit(self.unit)
        local delta = newPos:subtract(self.unitLastLoc):getLength()
        if (delta == 0) and (self.timeElapsed > 0.3) then
            UnitRemoveBuffBJ(SPRINT_BUFF_ID, self.unit)
            return false
        end
        self.distanceTravelled = ((delta == 0) and 0) or (self.distanceTravelled + delta)
        self.unitLastLoc = newPos
    else
        return false
    end
    return true
end
function SprintLeapAbility.prototype.destroy(self, aMod)
    if self.unit then
        local targetLoc = __TS__New(
            Vector3,
            GetUnitX(self.unit),
            GetUnitY(self.unit),
            0
        )
        targetLoc.z = getZFromXY(targetLoc.x, targetLoc.z)
        local sfx = AddSpecialEffect("war3mapImported\\DustWave.mdx", targetLoc.x, targetLoc.y)
        BlzSetSpecialEffectAlpha(sfx, 40)
        BlzSetSpecialEffectScale(sfx, 0.9)
        BlzSetSpecialEffectTimeScale(sfx, 0.4)
        BlzSetSpecialEffectTime(sfx, 0.2)
        BlzSetSpecialEffectYaw(
            sfx,
            GetRandomInt(0, 360)
        )
        DestroyEffect(sfx)
        aMod.game.leapModule:newLeap(
            self.unit,
            targetLoc:projectTowards2D(
                GetUnitFacing(self.unit),
                self.distanceTravelled / 2
            ),
            30,
            2.5
        )
    end
    return false
end
return ____exports
end,
["src.app.abilities.human.night-vision"] = function() require("lualib_bundle");
local ____exports = {}
local ____vision_2Dtype = require("src.app.world.vision-type")
local VISION_TYPE = ____vision_2Dtype.VISION_TYPE
local ____unit = require("node_modules.w3ts.handles.unit")
local Unit = ____unit.Unit
local NIGHT_VISION_DURATION = 30
____exports.NightVisionAbility = __TS__Class()
local NightVisionAbility = ____exports.NightVisionAbility
NightVisionAbility.name = "NightVisionAbility"
function NightVisionAbility.prototype.____constructor(self)
    self.timeElapsed = 0
    self.oldVis = VISION_TYPE.NORMAL
end
function NightVisionAbility.prototype.initialise(self, abMod)
    self.unit = Unit:fromHandle(
        GetTriggerUnit()
    )
    local z = abMod.game.worldModule:getUnitZone(self.unit)
    local crew = abMod.game.crewModule:getCrewmemberForUnit(self.unit)
    if z and crew then
        self.oldVis = crew:getVisionType()
        crew:setVisionType(VISION_TYPE.NIGHT_VISION)
        z:onEnter(abMod.game.worldModule, self.unit)
    end
    return true
end
function NightVisionAbility.prototype.process(self, module, delta)
    self.timeElapsed = self.timeElapsed + delta
    return self.timeElapsed < NIGHT_VISION_DURATION
end
function NightVisionAbility.prototype.destroy(self, aMod)
    if self.unit then
        local z = aMod.game.worldModule:getUnitZone(self.unit)
        local crew = aMod.game.crewModule:getCrewmemberForUnit(self.unit)
        if z and crew then
            crew:setVisionType(self.oldVis)
            z:onEnter(aMod.game.worldModule, self.unit)
        end
    end
    return false
end
return ____exports
end,
["src.app.abilities.human.repair"] = function() require("lualib_bundle");
local ____exports = {}
local ____index = require("node_modules.w3ts.index")
local Unit = ____index.Unit
local ____translators = require("src.lib.translators")
local PlayNewSoundOnUnit = ____translators.PlayNewSoundOnUnit
local REPAIR_DURATION = 6
local REPAIR_TICK_EVERY = 1
local REPAIR_AMOUNT = 100
____exports.ItemRepairAbility = __TS__Class()
local ItemRepairAbility = ____exports.ItemRepairAbility
ItemRepairAbility.name = "ItemRepairAbility"
function ItemRepairAbility.prototype.____constructor(self)
    self.timeElapsed = 0
    self.timeElapsedSinceLastRepair = 0
end
function ItemRepairAbility.prototype.initialise(self, module)
    self.unit = Unit:fromHandle(
        GetTriggerUnit()
    )
    self.targetUnit = Unit:fromHandle(
        GetSpellTargetUnit()
    )
    self.castOrderId = GetUnitCurrentOrder(self.unit.handle)
    return true
end
function ItemRepairAbility.prototype.process(self, module, delta)
    self.timeElapsed = self.timeElapsed + delta
    self.timeElapsedSinceLastRepair = self.timeElapsedSinceLastRepair + delta
    if GetUnitCurrentOrder(self.unit.handle) ~= self.castOrderId then
        return false
    end
    if self.timeElapsedSinceLastRepair >= REPAIR_TICK_EVERY then
        self.timeElapsedSinceLastRepair = self.timeElapsedSinceLastRepair - REPAIR_TICK_EVERY
        local sound = PlayNewSoundOnUnit("UI\\Feedback\\CheckpointPopup\\QuestCheckpoint.flac", self.targetUnit, 127)
        KillSoundWhenDone(sound)
        self.targetUnit.life = self.targetUnit.life + REPAIR_AMOUNT
        module.game.stationSecurity:onSecurityHeal(self.targetUnit.handle, self.unit.handle)
        if self.targetUnit.life >= self.targetUnit.maxLife then
            self.unit:pauseEx(true)
            self.unit:pauseEx(false)
            return false
        end
    end
    if self.timeElapsed >= 0.5 then
        local v = MathRound(
            math.max(
                Sin(((self.timeElapsed * bj_PI) * 2) + (bj_PI / 2)),
                0
            ) * 100
        )
        self.targetUnit:setVertexColor(255 - v, 255 - v, 255, 255)
        self.unit:setVertexColor(255 - v, 255 - v, 255, 255)
    end
    return self.timeElapsed < REPAIR_DURATION
end
function ItemRepairAbility.prototype.destroy(self, aMod)
    self.targetUnit:setVertexColor(255, 255, 255, 255)
    self.unit:setVertexColor(255, 255, 255, 255)
    return false
end
return ____exports
end,
["src.app.abilities.human.rail-rifle"] = function() require("lualib_bundle");
local ____exports = {}
local ____unit = require("node_modules.w3ts.handles.unit")
local Unit = ____unit.Unit
local ____translators = require("src.lib.translators")
local PlayNewSoundOnUnit = ____translators.PlayNewSoundOnUnit
local getYawPitchRollFromVector = ____translators.getYawPitchRollFromVector
local ____utils = require("src.lib.utils")
local getZFromXY = ____utils.getZFromXY
local ____vector3 = require("src.app.types.vector3")
local Vector3 = ____vector3.Vector3
local ____projectile = require("src.app.weapons.projectile.projectile")
local Projectile = ____projectile.Projectile
local ____projectile_2Dtarget = require("src.app.weapons.projectile.projectile-target")
local ProjectileTargetStatic = ____projectile_2Dtarget.ProjectileTargetStatic
local ____sound_2Dref = require("src.app.types.sound-ref")
local SoundRef = ____sound_2Dref.SoundRef
local ____vector2 = require("src.app.types.vector2")
local vectorFromUnit = ____vector2.vectorFromUnit
local ____timed_2Devent = require("src.app.types.timed-event")
local TimedEvent = ____timed_2Devent.TimedEvent
____exports.RailRifleAbility = __TS__Class()
local RailRifleAbility = ____exports.RailRifleAbility
RailRifleAbility.name = "RailRifleAbility"
function RailRifleAbility.prototype.____constructor(self)
    self.timeElapsed = 0
end
function RailRifleAbility.prototype.initialise(self, abMod)
    self.unit = Unit:fromHandle(
        GetTriggerUnit()
    )
    self.sound = __TS__New(SoundRef, "Sounds\\chargeUp.mp3", false)
    self.sound:playSoundOnUnit(self.unit.handle, 30)
    self.castOrderId = self.unit.currentOrder
    if GetSpellTargetUnit() then
        self.targetUnit = Unit:fromHandle(
            GetSpellTargetUnit()
        )
        self.targetLoc = __TS__New(
            Vector3,
            self.targetUnit.x,
            self.targetUnit.y,
            getZFromXY(self.targetUnit.x, self.targetUnit.y)
        )
    else
        self.targetLoc = __TS__New(
            Vector3,
            GetSpellTargetX(),
            GetSpellTargetY(),
            getZFromXY(
                GetSpellTargetX(),
                GetSpellTargetY()
            )
        )
    end
    return true
end
function RailRifleAbility.prototype.process(self, module, delta)
    local unit = self.unit
    self.timeElapsed = self.timeElapsed + delta
    local doCancel = self.unit.currentOrder ~= self.castOrderId
    if doCancel and (self.timeElapsed < 0.75) then
        return false
    end
    if self.targetUnit then
        self.prevTargetLoc = self.targetLoc
        self.targetLoc = __TS__New(
            Vector3,
            self.targetUnit.x,
            self.targetUnit.y,
            getZFromXY(self.targetUnit.x, self.targetUnit.y)
        )
        self.unit.facing = vectorFromUnit(self.unit.handle):angleTo(
            self.targetLoc:to2D()
        )
    end
    if doCancel then
        local sound = PlayNewSoundOnUnit("Sounds\\SniperRifleShoot.mp3", unit, 50)
        local casterLoc = __TS__New(
            Vector3,
            unit.x,
            unit.y,
            getZFromXY(unit.x, unit.y) + 50
        ):projectTowards2D(unit.facing * bj_DEGTORAD, 30)
        local targetLoc = self.targetLoc
        local PROJ_SPEED = 2400
        if self.targetUnit then
            local dVec = self.targetLoc:subtract(self.prevTargetLoc)
            local dLen = dVec:getLength()
            local ourDistance = self.targetLoc:subtract(casterLoc):getLength()
            local tTakenToDistance = ourDistance / PROJ_SPEED
            local tTakenNewLoc = self.targetLoc:getLength() / PROJ_SPEED
            targetLoc = self.targetLoc:add(
                dVec:normalise():multiplyN(tTakenNewLoc - tTakenToDistance)
            )
        end
        local deltaTarget = targetLoc:subtract(casterLoc):normalise()
        deltaTarget.x = deltaTarget.x * 6000
        deltaTarget.y = deltaTarget.y * 6000
        local collisionRadius = 25
        local projectile = __TS__New(
            Projectile,
            unit.handle,
            casterLoc,
            __TS__New(ProjectileTargetStatic, deltaTarget)
        )
        local effect = projectile:addEffect(
            "war3mapImported\\Bullet.mdx",
            __TS__New(Vector3, 0, 0, 0),
            targetLoc:subtract(casterLoc):normalise(),
            2.5
        )
        module.game.weaponModule:addProjectile(projectile)
        if self.timeElapsed >= 2 then
            self:createSmokeRingsFor(module, projectile, deltaTarget)
        end
        if self.timeElapsed >= 3 then
            local facingVec = targetLoc:subtract(casterLoc):normalise()
            collisionRadius = 40
            projectile:addEffect(
                "war3mapImported\\Bullet.mdx",
                __TS__New(Vector3, 15, 0, 0),
                facingVec,
                2.5
            )
            projectile:addEffect(
                "war3mapImported\\Bullet.mdx",
                __TS__New(Vector3, -15, 0, 0),
                facingVec,
                2.5
            )
            projectile:addEffect(
                "war3mapImported\\Bullet.mdx",
                __TS__New(Vector3, 0, 15, 0),
                facingVec,
                2.5
            )
            projectile:addEffect(
                "war3mapImported\\Bullet.mdx",
                __TS__New(Vector3, 0, -15, 0),
                facingVec,
                2.5
            )
        end
        projectile:setCollisionRadius(collisionRadius):setVelocity(PROJ_SPEED):onCollide(
            function(weaponModule, projectile, collidesWith) return self:onProjectileCollide(weaponModule, projectile, collidesWith) end
        )
        return false
    end
    return true
end
function RailRifleAbility.prototype.onProjectileCollide(self, weaponModule, projectile, collidesWith)
    projectile:setDestroy(true)
    local crewmember = weaponModule.game.crewModule:getCrewmemberForUnit(self.unit)
    if crewmember then
        local chargeFactor = Pow(1 + (self.timeElapsed / 10), 2)
        UnitDamageTarget(
            projectile.source,
            collidesWith,
            (50 + (chargeFactor * 200)) * crewmember:getDamageBonusMult(),
            false,
            true,
            ATTACK_TYPE_PIERCE,
            DAMAGE_TYPE_NORMAL,
            WEAPON_TYPE_WOOD_MEDIUM_STAB
        )
    end
end
function RailRifleAbility.prototype.createSmokeRingsFor(self, module, projectile, deltaTarget)
    local delay = 0
    while delay < 1000 do
        module.game.timedEventQueue:AddEvent(
            __TS__New(
                TimedEvent,
                function()
                    if (not projectile) or projectile:willDestroy() then
                        return true
                    end
                    local position = projectile:getPosition():add(
                        deltaTarget:normalise()
                    )
                    local sfxOrientation = getYawPitchRollFromVector(
                        deltaTarget:normalise()
                    )
                    local sfx = AddSpecialEffect("war3mapImported\\DustWave.mdx", position.x, position.y)
                    BlzSetSpecialEffectHeight(sfx, position.z)
                    BlzSetSpecialEffectYaw(sfx, sfxOrientation.yaw + (90 * bj_DEGTORAD))
                    BlzSetSpecialEffectRoll(sfx, sfxOrientation.pitch + (90 * bj_DEGTORAD))
                    BlzSetSpecialEffectAlpha(sfx, 40)
                    BlzSetSpecialEffectScale(sfx, 0.7)
                    BlzSetSpecialEffectTimeScale(sfx, 1)
                    BlzSetSpecialEffectTime(sfx, 0.5)
                    DestroyEffect(sfx)
                    return true
                end,
                delay,
                false
            )
        )
        delay = delay + 100
    end
end
function RailRifleAbility.prototype.destroy(self, aMod)
    StopSound(self.sound.sound, true, true)
    SetSoundVolume(self.sound.sound, 0)
    return false
end
return ____exports
end,
["src.app.abilities.human.dragonfire-blast"] = function() require("lualib_bundle");
local ____exports = {}
local ____vector3 = require("src.app.types.vector3")
local Vector3 = ____vector3.Vector3
local ____projectile = require("src.app.weapons.projectile.projectile")
local Projectile = ____projectile.Projectile
local ____projectile_2Dtarget = require("src.app.weapons.projectile.projectile-target")
local ProjectileTargetStatic = ____projectile_2Dtarget.ProjectileTargetStatic
local ____index = require("node_modules.w3ts.index")
local Unit = ____index.Unit
local ____utils = require("src.lib.utils")
local getPointsInRangeWithSpread = ____utils.getPointsInRangeWithSpread
local getZFromXY = ____utils.getZFromXY
local ____translators = require("src.lib.translators")
local PlayNewSoundOnUnit = ____translators.PlayNewSoundOnUnit
local getYawPitchRollFromVector = ____translators.getYawPitchRollFromVector
local ____buff_2Dids = require("src.resources.buff-ids")
local BUFF_ID = ____buff_2Dids.BUFF_ID
local ____buff_2Dinstance = require("src.app.buff.buff-instance")
local BuffInstanceDuration = ____buff_2Dinstance.BuffInstanceDuration
local SPREAD = 45
local NUM_BULLETS = 26
local DISTANCE = 300
local MISSILE_BULLET = "war3mapImported\\Bullet.mdx"
local MISSILE_BULLET_FIRE = "Abilities\\Spells\\Other\\BreathOfFire\\BreathOfFireDamage.mdl"
local MISSILE_FIRE_WAVE = "Abilities\\Spells\\Undead\\DeathCoil\\DeathCoilSpecialArt.mdl"
local FIRE_BREATH = "Abilities\\Spells\\Other\\BreathOfFire\\BreathOfFireMissile.mdl"
____exports.DragonFireBlastAbility = __TS__Class()
local DragonFireBlastAbility = ____exports.DragonFireBlastAbility
DragonFireBlastAbility.name = "DragonFireBlastAbility"
function DragonFireBlastAbility.prototype.____constructor(self)
    self.unitsHit = __TS__New(Map)
    self.damageGroup = CreateGroup()
end
function DragonFireBlastAbility.prototype.initialise(self, module)
    self.casterUnit = Unit:fromHandle(
        GetTriggerUnit()
    )
    self.unitsHit:clear()
    local sound = PlayNewSoundOnUnit("Sounds\\ShotgunShoot.mp3", self.casterUnit, 50)
    self.targetLoc = __TS__New(
        Vector3,
        GetSpellTargetX(),
        GetSpellTargetY(),
        0
    )
    self.targetLoc.z = module.game:getZFromXY(self.targetLoc.x, self.targetLoc.y)
    local casterLoc = __TS__New(Vector3, self.casterUnit.x, self.casterUnit.y, self.casterUnit.z):projectTowardsGunModel(self.casterUnit.handle)
    local angleDeg = casterLoc:angle2Dto(self.targetLoc)
    local flameLoc = casterLoc:projectTowards2D(angleDeg, 190)
    local sfx = AddSpecialEffect(FIRE_BREATH, flameLoc.x, flameLoc.y)
    local facingData = getYawPitchRollFromVector(
        self.targetLoc:subtract(casterLoc):normalise()
    )
    BlzSetSpecialEffectRoll(sfx, facingData.pitch)
    BlzSetSpecialEffectYaw(sfx, facingData.yaw)
    BlzSetSpecialEffectPitch(sfx, facingData.roll)
    BlzSetSpecialEffectZ(sfx, casterLoc.z - 80)
    BlzSetSpecialEffectScale(sfx, 1)
    BlzSetSpecialEffectTimeScale(sfx, 200)
    local deltaLocs = getPointsInRangeWithSpread(angleDeg - SPREAD, angleDeg + SPREAD, NUM_BULLETS, DISTANCE, 0.9)
    local centerTargetLoc = casterLoc:projectTowards2D(angleDeg, DISTANCE * 1.4)
    centerTargetLoc.z = getZFromXY(centerTargetLoc.x, centerTargetLoc.y)
    __TS__ArrayForEach(
        deltaLocs,
        function(____, loc, index)
            local nX = casterLoc.x + loc.x
            local nY = casterLoc.y + loc.y
            local targetLoc = __TS__New(
                Vector3,
                nX,
                nY,
                getZFromXY(nX, nY)
            )
            self:fireProjectile(module.game.weaponModule, self.casterUnit, targetLoc, false):onCollide(
                function(weaponModule, projectile, collidesWith) return self:onProjectileCollide(module.game.weaponModule, projectile, collidesWith) end
            )
        end
    )
    return true
end
function DragonFireBlastAbility.prototype.fireProjectile(self, weaponModule, caster, targetLocation, isCentralProjectile)
    local unit = caster.handle
    local casterLoc = __TS__New(
        Vector3,
        GetUnitX(unit),
        GetUnitY(unit),
        BlzGetUnitZ(unit)
    ):projectTowardsGunModel(unit)
    local deltaTarget = targetLocation:subtract(casterLoc)
    local projectile = __TS__New(
        Projectile,
        unit,
        casterLoc,
        __TS__New(ProjectileTargetStatic, deltaTarget)
    )
    projectile:addEffect(
        MISSILE_BULLET,
        __TS__New(Vector3, 0, 0, 0),
        deltaTarget:normalise(),
        1.4
    )
    projectile:addEffect(
        MISSILE_BULLET_FIRE,
        __TS__New(Vector3, 0, 0, 0),
        deltaTarget:normalise(),
        0.4
    )
    weaponModule:addProjectile(projectile)
    return projectile:setCollisionRadius(15):setVelocity(1250)
end
function DragonFireBlastAbility.prototype.process(self, abMod, delta)
    return true
end
function DragonFireBlastAbility.prototype.destroy(self, module)
    DestroyGroup(self.damageGroup)
    return true
end
function DragonFireBlastAbility.prototype.onProjectileCollide(self, weaponModule, projectile, collidesWith)
    projectile:setDestroy(true)
    local timesUnitHit = self.unitsHit:get(collidesWith) or 0
    self.unitsHit:set(collidesWith, timesUnitHit + 1)
    local crewmember = weaponModule.game.crewModule:getCrewmemberForUnit(self.casterUnit)
    weaponModule.game.buffModule:addBuff(
        BUFF_ID.FIRE,
        Unit:fromHandle(collidesWith),
        __TS__New(
            BuffInstanceDuration,
            weaponModule.game:getTimeStamp(),
            10
        )
    )
    if crewmember then
        local damage = (20 * crewmember:getDamageBonusMult()) / Pow(2, timesUnitHit)
        UnitDamageTarget(projectile.source, collidesWith, damage, false, true, ATTACK_TYPE_PIERCE, DAMAGE_TYPE_NORMAL, WEAPON_TYPE_WOOD_MEDIUM_STAB)
    end
end
return ____exports
end,
["src.app.abilities.ability-module"] = function() require("lualib_bundle");
local ____exports = {}
local ____index = require("node_modules.w3ts.index")
local Trigger = ____index.Trigger
local ____acid_2Dpool = require("src.app.abilities.alien.acid-pool")
local AcidPoolAbility = ____acid_2Dpool.AcidPoolAbility
local ____leap = require("src.app.abilities.alien.leap")
local LeapAbility = ____leap.LeapAbility
local ____transform = require("src.app.abilities.alien.transform")
local TransformAbility = ____transform.TransformAbility
local ____diode_2Dejector = require("src.app.abilities.human.diode-ejector")
local DiodeEjectAbility = ____diode_2Dejector.DiodeEjectAbility
local ____ability_2Dids = require("src.resources.ability-ids")
local ABIL_TRANSFORM_HUMAN_ALIEN = ____ability_2Dids.ABIL_TRANSFORM_HUMAN_ALIEN
local ABIL_HUMAN_SPRINT = ____ability_2Dids.ABIL_HUMAN_SPRINT
local ABIL_ALIEN_ACID_POOL = ____ability_2Dids.ABIL_ALIEN_ACID_POOL
local ABIL_ALIEN_LEAP = ____ability_2Dids.ABIL_ALIEN_LEAP
local ABIL_TRANSFORM_ALIEN_HUMAN = ____ability_2Dids.ABIL_TRANSFORM_ALIEN_HUMAN
local ABIL_ALIEN_SCREAM = ____ability_2Dids.ABIL_ALIEN_SCREAM
local ABIL_WEP_DIODE_EJ = ____ability_2Dids.ABIL_WEP_DIODE_EJ
local ABIL_NIGHTEYE = ____ability_2Dids.ABIL_NIGHTEYE
local SMART_ORDER_ID = ____ability_2Dids.SMART_ORDER_ID
local ABIL_ITEM_REPAIR = ____ability_2Dids.ABIL_ITEM_REPAIR
local ____scream = require("src.app.abilities.alien.scream")
local ScreamAbility = ____scream.ScreamAbility
local ____sprint_2Dleap = require("src.app.abilities.human.sprint-leap")
local SprintLeapAbility = ____sprint_2Dleap.SprintLeapAbility
local ____night_2Dvision = require("src.app.abilities.human.night-vision")
local NightVisionAbility = ____night_2Dvision.NightVisionAbility
local ____repair = require("src.app.abilities.human.repair")
local ItemRepairAbility = ____repair.ItemRepairAbility
local ____weapon_2Dconstants = require("src.app.weapons.weapon-constants")
local SNIPER_ABILITY_ID = ____weapon_2Dconstants.SNIPER_ABILITY_ID
local AT_ABILITY_DRAGONFIRE_BLAST = ____weapon_2Dconstants.AT_ABILITY_DRAGONFIRE_BLAST
local ____rail_2Drifle = require("src.app.abilities.human.rail-rifle")
local RailRifleAbility = ____rail_2Drifle.RailRifleAbility
local ____dragonfire_2Dblast = require("src.app.abilities.human.dragonfire-blast")
local DragonFireBlastAbility = ____dragonfire_2Dblast.DragonFireBlastAbility
local TIMEOUT = 0.03
____exports.AbilityModule = __TS__Class()
local AbilityModule = ____exports.AbilityModule
AbilityModule.name = "AbilityModule"
function AbilityModule.prototype.____constructor(self, game)
    self.game = game
    self.data = {}
    self.triggerIterator = __TS__New(Trigger)
    self.triggerIterator:registerTimerEvent(TIMEOUT, true)
    self.triggerIterator:addAction(
        function() return self:process(TIMEOUT) end
    )
    self.triggerAbilityCast = __TS__New(Trigger)
    self.triggerAbilityCast:registerAnyUnitEvent(EVENT_PLAYER_UNIT_SPELL_EFFECT)
    self.triggerAbilityCast:addAction(
        function() return self:checkSpells() end
    )
    self.unitIssuedCommand = __TS__New(Trigger)
    self.unitIssuedCommand:addAction(
        function() return self:onTrackUnitOrders() end
    )
end
function AbilityModule.prototype.checkSpells(self)
    local id = GetSpellAbilityId()
    local instance
    local ____switch7 = id
    if ____switch7 == ABIL_HUMAN_SPRINT then
        goto ____switch7_case_0
    elseif ____switch7 == ABIL_WEP_DIODE_EJ then
        goto ____switch7_case_1
    elseif ____switch7 == ABIL_NIGHTEYE then
        goto ____switch7_case_2
    elseif ____switch7 == ABIL_ALIEN_ACID_POOL then
        goto ____switch7_case_3
    elseif ____switch7 == ABIL_ALIEN_LEAP then
        goto ____switch7_case_4
    elseif ____switch7 == ABIL_ALIEN_SCREAM then
        goto ____switch7_case_5
    elseif ____switch7 == ABIL_ITEM_REPAIR then
        goto ____switch7_case_6
    elseif ____switch7 == SNIPER_ABILITY_ID then
        goto ____switch7_case_7
    elseif ____switch7 == AT_ABILITY_DRAGONFIRE_BLAST then
        goto ____switch7_case_8
    elseif ____switch7 == ABIL_TRANSFORM_HUMAN_ALIEN then
        goto ____switch7_case_9
    elseif ____switch7 == ABIL_TRANSFORM_ALIEN_HUMAN then
        goto ____switch7_case_10
    end
    goto ____switch7_end
    ::____switch7_case_0::
    do
        instance = __TS__New(SprintLeapAbility)
        if instance:initialise(self) then
            __TS__ArrayPush(self.data, instance)
        end
        goto ____switch7_end
    end
    ::____switch7_case_1::
    do
        instance = __TS__New(DiodeEjectAbility)
        if instance:initialise(self) then
            __TS__ArrayPush(self.data, instance)
        end
        goto ____switch7_end
    end
    ::____switch7_case_2::
    do
        instance = __TS__New(NightVisionAbility)
        if instance:initialise(self) then
            __TS__ArrayPush(self.data, instance)
        end
        goto ____switch7_end
    end
    ::____switch7_case_3::
    do
        instance = __TS__New(AcidPoolAbility)
        if instance:initialise(self) then
            __TS__ArrayPush(self.data, instance)
        end
        goto ____switch7_end
    end
    ::____switch7_case_4::
    do
        instance = __TS__New(LeapAbility)
        if instance:initialise(self) then
            __TS__ArrayPush(self.data, instance)
        end
        goto ____switch7_end
    end
    ::____switch7_case_5::
    do
        instance = __TS__New(ScreamAbility)
        if instance:initialise(self) then
            __TS__ArrayPush(self.data, instance)
        end
        goto ____switch7_end
    end
    ::____switch7_case_6::
    do
        instance = __TS__New(ItemRepairAbility)
        if instance:initialise(self) then
            __TS__ArrayPush(self.data, instance)
        end
        goto ____switch7_end
    end
    ::____switch7_case_7::
    do
        instance = __TS__New(RailRifleAbility)
        if instance:initialise(self) then
            __TS__ArrayPush(self.data, instance)
        end
        goto ____switch7_end
    end
    ::____switch7_case_8::
    do
        instance = __TS__New(DragonFireBlastAbility)
        if instance:initialise(self) then
            __TS__ArrayPush(self.data, instance)
        end
        goto ____switch7_end
    end
    ::____switch7_case_9::
    ::____switch7_case_10::
    do
        instance = __TS__New(TransformAbility, id == ABIL_TRANSFORM_HUMAN_ALIEN)
        if instance:initialise(self) then
            __TS__ArrayPush(self.data, instance)
        end
        goto ____switch7_end
    end
    ::____switch7_end::
end
function AbilityModule.prototype.onTrackUnitOrders(self)
    local triggerUnit = GetTriggerUnit()
    local orderId = GetIssuedOrderId()
    if (orderId == SMART_ORDER_ID) and (GetUnitAbilityLevel(
        triggerUnit,
        FourCC("LEAP")
    ) >= 1) then
        local instance = __TS__New(LeapAbility)
        if instance:initialise(self) then
            __TS__ArrayPush(self.data, instance)
        end
    end
end
function AbilityModule.prototype.trackUnitOrdersForAbilities(self, whichUnit)
    self.unitIssuedCommand:registerUnitEvent(whichUnit, EVENT_UNIT_ISSUED_POINT_ORDER)
end
function AbilityModule.prototype.process(self, delta)
    self.data = __TS__ArrayFilter(
        self.data,
        function(____, ability)
            local doDestroy = not ability:process(self, delta)
            if doDestroy then
                ability:destroy(self)
            end
            return not doDestroy
        end
    )
end
return ____exports
end,
["src.app.types.progress-bar"] = function() require("lualib_bundle");
local ____exports = {}
____exports.PROGRESS_BAR_MODEL_PATH = "Models\\Progressbar.mdxx"
____exports.ProgressBar = __TS__Class()
local ProgressBar = ____exports.ProgressBar
ProgressBar.name = "ProgressBar"
function ProgressBar.prototype.____constructor(self)
    self.progress = 0
    self.isReverse = false
end
function ProgressBar.prototype.show(self)
    self.bar = AddSpecialEffect(____exports.PROGRESS_BAR_MODEL_PATH, 0, 0)
end
function ProgressBar.prototype.hide(self)
    self:destroy()
end
function ProgressBar.prototype.moveTo(self, x, y, z)
    if not self.bar then
        return self
    end
    BlzSetSpecialEffectX(self.bar, x)
    BlzSetSpecialEffectY(self.bar, y)
    BlzSetSpecialEffectZ(self.bar, z)
    return self
end
function ProgressBar.prototype.setPercentage(self, percentage)
    if not self.bar then
        return self
    end
    BlzSetSpecialEffectTime(self.bar, percentage)
    return self
end
function ProgressBar.prototype.destroy(self)
    if not self.bar then
        return self
    end
    DestroyEffect(self.bar)
end
return ____exports
end,
["src.app.interactions.interaction-event"] = function() require("lualib_bundle");
local ____exports = {}
local ____index = require("node_modules.w3ts.index")
local Trigger = ____index.Trigger
local Unit = ____index.Unit
local ____vector2 = require("src.app.types.vector2")
local vectorFromUnit = ____vector2.vectorFromUnit
local ____progress_2Dbar = require("src.app.types.progress-bar")
local ProgressBar = ____progress_2Dbar.ProgressBar
local ____ability_2Dids = require("src.resources.ability-ids")
local SMART_ORDER_ID = ____ability_2Dids.SMART_ORDER_ID
____exports.INTERACT_MAXIMUM_DISTANCE = 350
____exports.STUN_ID = FourCC("stun")
____exports.SLOW_ID = FourCC("slow")
____exports.InteractionEvent = __TS__Class()
local InteractionEvent = ____exports.InteractionEvent
InteractionEvent.name = "InteractionEvent"
function InteractionEvent.prototype.____constructor(self, unit, targetUnit, interactTime, callback, startCallback, cancelCallback)
    self.unit = Unit:fromHandle(unit)
    self.targetUnit = Unit:fromHandle(targetUnit)
    self.timeRequired = (function(o, i, v)
        o[i] = v
        return v
    end)(self, "timeRemaining", interactTime)
    self.callback = callback
    self.startCallback = startCallback
    self.cancelCallback = cancelCallback
    self.progressBar = __TS__New(ProgressBar)
end
function InteractionEvent.prototype.startInteraction(self)
    self.interactionTrigger = __TS__New(Trigger)
    self.interactionTrigger:registerUnitEvent(self.unit, EVENT_UNIT_ISSUED_POINT_ORDER)
    self.interactionTrigger:registerUnitEvent(self.unit, EVENT_UNIT_ISSUED_TARGET_ORDER)
    self.interactionTrigger:registerUnitEvent(self.unit, EVENT_UNIT_ISSUED_ORDER)
    self.interactionTrigger:addAction(
        function()
            if (GetIssuedOrderId() ~= SMART_ORDER_ID) or ((GetIssuedOrderId() == SMART_ORDER_ID) and (GetOrderTargetUnit() ~= self.targetUnit.handle)) then
                self:destroy()
            end
        end
    )
end
function InteractionEvent.prototype.process(self, delta)
    if (not self.interactionTrigger) or (not self.interactionTrigger.enabled) then
        return false
    end
    local v1 = vectorFromUnit(self.unit.handle)
    local v2 = vectorFromUnit(self.targetUnit.handle)
    if v1:subtract(v2):getLength() <= ____exports.INTERACT_MAXIMUM_DISTANCE then
        if self.timeRemaining == self.timeRequired then
            local ____ = self.progressBar and self.progressBar:show()
            self:startCallback()
        end
        if UnitHasBuffBJ(self.unit.handle, ____exports.STUN_ID) then
            delta = 0
        elseif UnitHasBuffBJ(self.unit.handle, ____exports.SLOW_ID) then
            delta = delta / 2
        end
        self.timeRemaining = self.timeRemaining - delta
        if self.timeRemaining <= 0 then
            self:onInteractionCompletion()
            return false
        end
    else
    end
    local ____ = self.progressBar and self.progressBar:moveTo(v1.x, v1.y, self.unit.z + 229):setPercentage(1 - (self.timeRemaining / self.timeRequired))
    return true
end
function InteractionEvent.prototype.onInteractionCompletion(self)
    self:callback()
end
function InteractionEvent.prototype.destroy(self)
    local ____ = self.interactionTrigger and self.interactionTrigger:destroy()
    local ____ = self.progressBar and self.progressBar:destroy()
    self.interactionTrigger = nil
    self:cancelCallback()
end
return ____exports
end,
["src.app.interactions.interactable"] = function() local ____exports = {}
return ____exports
end,
["src.app.interactions.interaction-data"] = function() require("lualib_bundle");
local ____exports = {}
local ____zone_2Did = require("src.app.world.zone-id")
local ZONE_TYPE = ____zone_2Did.ZONE_TYPE
local ____translators = require("src.lib.translators")
local PlayNewSoundOnUnit = ____translators.PlayNewSoundOnUnit
local ____colours = require("src.resources.colours")
local COL_FLOOR_1 = ____colours.COL_FLOOR_1
local COL_FLOOR_2 = ____colours.COL_FLOOR_2
local COL_MISC = ____colours.COL_MISC
local ____index = require("node_modules.w3ts.index")
local Trigger = ____index.Trigger
local Unit = ____index.Unit
local ____ability_2Dids = require("src.resources.ability-ids")
local TECH_MAJOR_HEALTHCARE = ____ability_2Dids.TECH_MAJOR_HEALTHCARE
local ____strings = require("src.resources.strings")
local STR_GENE_REQUIRES_HEALTHCARE = ____strings.STR_GENE_REQUIRES_HEALTHCARE
____exports.Interactables = __TS__New(Map)
local Elevator = __TS__Class()
Elevator.name = "Elevator"
function Elevator.prototype.____constructor(self, u, zone, offset)
    self.unit = u
    self.inside_zone = zone
    self.exit_offset = offset
end
local elevatorMap = __TS__New(Map)
function ____exports.initElevators()
    local TEST_ELEVATOR_FLOOR_1 = __TS__New(
        Elevator,
        Unit:fromHandle(gg_unit_n001_0032),
        ZONE_TYPE.FLOOR_1,
        {x = 0, y = -180}
    )
    local TEST_ELEVATOR_FLOOR_2 = __TS__New(
        Elevator,
        Unit:fromHandle(gg_unit_n001_0021),
        ZONE_TYPE.FLOOR_2,
        {x = 0, y = -180}
    )
    TEST_ELEVATOR_FLOOR_1.to = TEST_ELEVATOR_FLOOR_2
    TEST_ELEVATOR_FLOOR_2.to = TEST_ELEVATOR_FLOOR_1
    TEST_ELEVATOR_FLOOR_1.unit.name = ((("Elevator to " .. tostring(COL_FLOOR_2)) .. "Floor 2|r|n") .. tostring(COL_MISC)) .. "Right Click To Use|r"
    TEST_ELEVATOR_FLOOR_2.unit.name = ((("Elevator to " .. tostring(COL_FLOOR_1)) .. "Floor 1|r|n") .. tostring(COL_MISC)) .. "Right Click To Use|r"
    elevatorMap:set(TEST_ELEVATOR_FLOOR_1.unit.typeId, TEST_ELEVATOR_FLOOR_1)
    elevatorMap:set(TEST_ELEVATOR_FLOOR_2.unit.typeId, TEST_ELEVATOR_FLOOR_2)
    local ELEVATOR_TYPE = FourCC("n001")
    local elevatorTest = {
        unitType = ELEVATOR_TYPE,
        onStart = function(____, iModule, fromUnit, targetUnit)
            local handleId = targetUnit.id
            local targetElevator = elevatorMap:get(handleId)
            targetUnit:setAnimation(1)
            KillSoundWhenDone(
                PlayNewSoundOnUnit("Sounds\\ElevatorOpen.mp3", targetUnit, 90)
            )
            if targetElevator and targetElevator.to then
                KillSoundWhenDone(
                    PlayNewSoundOnUnit("Sounds\\ElevatorOpen.mp3", targetElevator.to.unit, 90)
                )
                targetElevator.to.unit:setAnimation(1)
            end
        end,
        onCancel = function(____, iModule, fromUnit, targetUnit)
            local handleId = targetUnit.id
            local targetElevator = elevatorMap:get(handleId)
            targetUnit:setAnimation(0)
            if targetElevator and targetElevator.to then
                targetElevator.to.unit:setAnimation(0)
            end
        end,
        action = function(____, iModule, fromUnit, targetUnit)
            local handleId = targetUnit.id
            local targetElevator = elevatorMap:get(handleId)
            if targetElevator and targetElevator.to then
                fromUnit.x = targetElevator.to.unit.x + targetElevator.to.exit_offset.x
                fromUnit.y = targetElevator.to.unit.y + targetElevator.to.exit_offset.y
                if IsUnitSelected(fromUnit.handle, fromUnit.owner.handle) then
                    PanCameraToTimedForPlayer(fromUnit.owner.handle, fromUnit.x, fromUnit.y, 0)
                end
                iModule.game.worldModule:travel(fromUnit, targetElevator.to.inside_zone)
            end
        end
    }
    ____exports.Interactables:set(ELEVATOR_TYPE, elevatorTest)
end
local hatchMap = __TS__New(Map)
function ____exports.initHatches(game)
    local hatches = {}
    __TS__ArrayForEach(
        udg_hatch_entrances,
        function(____, entrance, i)
            local entranceName = udg_hatch_entrance_names[i + 1]
            local hatchExitZone = game.worldModule:getZoneByName(udg_hatch_exit_zones[i + 1])
            local elevator = __TS__New(
                Elevator,
                Unit:fromHandle(entrance),
                hatchExitZone,
                {x = 0, y = 0}
            )
            BlzSetUnitName(
                entrance,
                ((("To " .. tostring(entranceName)) .. "|n") .. tostring(COL_MISC)) .. "Right Click To Use|r"
            )
            hatchMap:set(
                GetHandleId(entrance),
                elevator
            )
            __TS__ArrayPush(hatches, elevator)
        end
    )
    __TS__ArrayForEach(
        hatches,
        function(____, hatch, i)
            local exit = udg_hatch_exits[i + 1]
            hatch.to = hatchMap:get(
                GetHandleId(exit)
            )
            hatchMap:set(hatch.unit.typeId, hatch)
        end
    )
    local HATCH_TYPE = FourCC("n002")
    local LADDER_TYPE = FourCC("n004")
    local hatchInteractable = {
        unitType = HATCH_TYPE,
        onStart = function(____, iModule, fromUnit, targetUnit)
            local handleId = targetUnit.id
            local targetElevator = hatchMap:get(handleId)
            targetUnit:setTimeScale(1.4)
            targetUnit:setAnimation(1)
            if targetUnit.typeId == HATCH_TYPE then
                KillSoundWhenDone(
                    PlayNewSoundOnUnit("Sounds\\MetalHatch.mp33", targetUnit, 40)
                )
            end
            if targetElevator and targetElevator.to then
                targetElevator.to.unit:setTimeScale(1.4)
                if targetElevator.to.unit.typeId == HATCH_TYPE then
                    KillSoundWhenDone(
                        PlayNewSoundOnUnit("Sounds\\MetalHatch.mp3", targetElevator.to.unit, 40)
                    )
                end
                targetElevator.to.unit:setAnimation(1)
            end
        end,
        onCancel = function(____, iModule, fromUnit, targetUnit)
            local handleId = targetUnit.id
            local targetElevator = hatchMap:get(handleId)
            targetUnit:setAnimation(2)
            if targetElevator and targetElevator.to then
                targetElevator.to.unit:setAnimation(2)
            end
        end,
        action = function(____, iModule, fromUnit, targetUnit)
            local handleId = targetUnit.id
            local targetElevator = hatchMap:get(handleId)
            if targetElevator and targetElevator.to then
                fromUnit.x = targetElevator.to.unit.x + targetElevator.to.exit_offset.x
                fromUnit.y = targetElevator.to.unit.y + targetElevator.to.exit_offset.y
                if IsUnitSelected(fromUnit.handle, fromUnit.owner.handle) then
                    PanCameraToTimedForPlayer(fromUnit.owner.handle, fromUnit.x, fromUnit.y, 0)
                end
                iModule.game.worldModule:travel(fromUnit, targetElevator.to.inside_zone)
            end
        end
    }
    ____exports.Interactables:set(HATCH_TYPE, hatchInteractable)
    ____exports.Interactables:set(LADDER_TYPE, hatchInteractable)
end
____exports.initWeaponsTerminals = function()
    local WEAPONS_UPGRADE_TERMINAL = FourCC("nWEP")
    local MEDICAL_UPGRADE_TERMINAL = FourCC("nMED")
    local GENE_SPLICER_TERMINAL = FourCC("nGEN")
    local upgradeTerminalProcessing = {
        onStart = function(____, iModule, fromUnit, targetUnit)
        end,
        onCancel = function(____, iModule, fromUnit, targetUnit)
        end,
        action = function(____, iModule, fromUnit, targetUnit)
            local handleId = targetUnit.id
            local uX = targetUnit.x
            local uY = targetUnit.y
            local player = fromUnit.owner
            local targetUType = targetUnit.typeId
            local unitType
            if targetUType == WEAPONS_UPGRADE_TERMINAL then
                unitType = FourCC("hWEP")
            elseif targetUType == MEDICAL_UPGRADE_TERMINAL then
                unitType = FourCC("hMED")
            elseif targetUType == GENE_SPLICER_TERMINAL then
                if GetPlayerTechCount(player.handle, TECH_MAJOR_HEALTHCARE, true) < 1 then
                    DisplayTextToPlayer(player.handle, 0, 0, STR_GENE_REQUIRES_HEALTHCARE)
                    return false
                end
                unitType = FourCC("hGEN")
            else
                unitType = FourCC("hWEP")
            end
            local nUnit = CreateUnit(player.handle, unitType, uX, uY, bj_UNIT_FACING)
            SelectUnitForPlayerSingle(nUnit, player.handle)
            local trackUnselectEvent = __TS__New(Trigger)
            trackUnselectEvent:registerPlayerUnitEvent(
                player,
                EVENT_PLAYER_UNIT_DESELECTED,
                Condition(
                    function() return GetTriggerUnit() == nUnit end
                )
            )
            trackUnselectEvent:addAction(
                function()
                    UnitApplyTimedLife(
                        nUnit,
                        FourCC("b001"),
                        3
                    )
                    trackUnselectEvent:destroy()
                end
            )
            if targetUType == GENE_SPLICER_TERMINAL then
                iModule.game.geneModule:addNewGeneInstance(
                    fromUnit,
                    Unit:fromHandle(nUnit)
                )
            end
        end
    }
    ____exports.Interactables:set(WEAPONS_UPGRADE_TERMINAL, upgradeTerminalProcessing)
    ____exports.Interactables:set(MEDICAL_UPGRADE_TERMINAL, upgradeTerminalProcessing)
    ____exports.Interactables:set(GENE_SPLICER_TERMINAL, upgradeTerminalProcessing)
end
return ____exports
end,
["src.app.interactions.interaction-module"] = function() require("lualib_bundle");
local ____exports = {}
local ____interaction_2Devent = require("src.app.interactions.interaction-event")
local InteractionEvent = ____interaction_2Devent.InteractionEvent
local ____interaction_2Ddata = require("src.app.interactions.interaction-data")
local Interactables = ____interaction_2Ddata.Interactables
local initElevators = ____interaction_2Ddata.initElevators
local initHatches = ____interaction_2Ddata.initHatches
local initWeaponsTerminals = ____interaction_2Ddata.initWeaponsTerminals
local ____ability_2Dids = require("src.resources.ability-ids")
local SMART_ORDER_ID = ____ability_2Dids.SMART_ORDER_ID
local ____index = require("node_modules.w3ts.index")
local Trigger = ____index.Trigger
local Unit = ____index.Unit
____exports.UPDATE_PERIODICAL_INTERACTION = 0.03
____exports.InteractionModule = __TS__Class()
local InteractionModule = ____exports.InteractionModule
InteractionModule.name = "InteractionModule"
function InteractionModule.prototype.____constructor(self, game)
    self.interactions = {}
    self.game = game
    self.interactionUpdateTrigger = __TS__New(Trigger)
    self.interactionUpdateTrigger:registerTimerEvent(____exports.UPDATE_PERIODICAL_INTERACTION, true)
    self.interactionUpdateTrigger:addAction(
        function() return self:processInteractions(____exports.UPDATE_PERIODICAL_INTERACTION) end
    )
    self.interactionBeginTrigger = __TS__New(Trigger)
    self.interactionBeginTrigger:registerAnyUnitEvent(EVENT_PLAYER_UNIT_ISSUED_UNIT_ORDER)
    self.interactionBeginTrigger:addCondition(
        Condition(
            function()
                return GetIssuedOrderId() == SMART_ORDER_ID
            end
        )
    )
    self.interactionBeginTrigger:addAction(
        function()
            local trigUnit = Unit:fromHandle(
                GetTriggerUnit()
            )
            local targetUnit = Unit:fromHandle(
                GetOrderTargetUnit()
            )
            local targetUnitType = targetUnit.typeId
            if #__TS__ArrayFilter(
                self.interactions,
                function(____, i) return (i.unit == trigUnit) and (i.targetUnit == targetUnit) end
            ) > 0 then
                return
            end
            local interact = Interactables:has(targetUnitType) and Interactables:get(targetUnitType)
            if interact and ((not interact.condition) or interact:condition(self, trigUnit, targetUnit)) then
                local newInteraction = __TS__New(
                    InteractionEvent,
                    GetTriggerUnit(),
                    GetOrderTargetUnit(),
                    1.5,
                    function() return interact:action(self, trigUnit, targetUnit) end,
                    function() return interact.onStart and interact:onStart(self, trigUnit, targetUnit) end,
                    function() return interact.onCancel and interact:onCancel(self, trigUnit, targetUnit) end
                )
                newInteraction:startInteraction()
                __TS__ArrayPush(self.interactions, newInteraction)
            end
        end
    )
    initElevators()
    initHatches(game)
    initWeaponsTerminals()
end
function InteractionModule.prototype.processInteractions(self, delta)
    self.interactions = __TS__ArrayFilter(
        self.interactions,
        function(____, interaction)
            local doDestroy = not interaction:process(delta)
            if doDestroy then
                interaction:destroy()
            end
            return not doDestroy
        end
    )
end
return ____exports
end,
["src.app.types.widget-id"] = function() local ____exports = {}
____exports.LIGHT_DEST_ID = FourCC("B002")
return ____exports
end,
["src.app.world.zone-type"] = function() require("lualib_bundle");
local ____exports = {}
local ____zone_2Did = require("src.app.world.zone-id")
local ZONE_TYPE_TO_ZONE_NAME = ____zone_2Did.ZONE_TYPE_TO_ZONE_NAME
local ____timed_2Devent = require("src.app.types.timed-event")
local TimedEvent = ____timed_2Devent.TimedEvent
local ____serilog = require("src.lib.serilog.serilog")
local Log = ____serilog.Log
local ____widget_2Did = require("src.app.types.widget-id")
local LIGHT_DEST_ID = ____widget_2Did.LIGHT_DEST_ID
local ____unit = require("node_modules.w3ts.handles.unit")
local Unit = ____unit.Unit
local ____event = require("src.app.events.event")
local EventListener = ____event.EventListener
local EVENT_TYPE = ____event.EVENT_TYPE
local ____utils = require("src.lib.utils")
local getZFromXY = ____utils.getZFromXY
local LIGHT_CLACK = "Sounds\\LightClack.mp3"
____exports.Zone = __TS__Class()
local Zone = ____exports.Zone
Zone.name = "Zone"
function Zone.prototype.____constructor(self, game, id)
    self.adjacent = {}
    self.unitsInside = {}
    self.id = id
    self.game = game
end
function Zone.prototype.onLeave(self, world, unit)
    local idx = __TS__ArrayIndexOf(self.unitsInside, unit)
    if idx >= 0 then
        __TS__ArraySplice(self.unitsInside, idx, 1)
    end
end
function Zone.prototype.onEnter(self, world, unit)
    __TS__ArrayPush(self.unitsInside, unit)
end
function Zone.prototype.displayEnteringMessage(self, player)
    DisplayTextToPlayer(
        player.handle,
        0,
        0,
        "Entering " .. tostring(
            ZONE_TYPE_TO_ZONE_NAME:get(self.id)
        )
    )
end
function Zone.prototype.getPlayersInZone(self)
    local players = __TS__ArrayMap(
        self.unitsInside,
        function(____, u) return u.owner end
    )
    return __TS__ArrayFilter(
        players,
        function(self, elem, index, ____self)
            return index == __TS__ArrayIndexOf(____self, elem)
        end
    )
end
function Zone.prototype.doCauseFear(self)
    return false
end
____exports.ShipZone = __TS__Class()
local ShipZone = ____exports.ShipZone
ShipZone.name = "ShipZone"
ShipZone.____super = ____exports.Zone
setmetatable(ShipZone, ShipZone.____super)
setmetatable(ShipZone.prototype, ShipZone.____super.prototype)
function ShipZone.prototype.____constructor(self, game, id)
    ShipZone.____super.prototype.____constructor(self, game, id)
    self.hasPower = true
    self.alwaysCauseFear = false
    self.hasOxygen = true
    self.lightSources = {}
    self.powerGenerators = {}
    local matchingIndexes = {}
    __TS__ArrayForEach(
        udg_power_generator_zones,
        function(____, zone, index) return (id == zone) and __TS__ArrayPush(matchingIndexes, index) end
    )
    __TS__ArrayForEach(
        matchingIndexes,
        function(____, index)
            __TS__ArrayPush(
                self.powerGenerators,
                Unit:fromHandle(udg_power_generators[index + 1])
            )
        end
    )
    game.event:addListener(
        __TS__New(
            EventListener,
            EVENT_TYPE.STATION_SECURITY_DISABLED,
            function(____self, data) return self:onGeneratorDestroy(data.unit, data.source) end
        )
    )
    game.event:addListener(
        __TS__New(
            EventListener,
            EVENT_TYPE.STATION_SECURITY_ENABLED,
            function(____self, data) return self:onGeneratorRepair(data.unit, data.source) end
        )
    )
end
function ShipZone.prototype.onGeneratorDestroy(self, generator, source)
    if __TS__ArrayIndexOf(self.powerGenerators, generator) >= 0 then
        Log.Information(
            ("Generator for " .. tostring(self.id)) .. " was destroyed!"
        )
        self:updatePower(false)
    end
end
function ShipZone.prototype.onGeneratorRepair(self, generator, source)
    if __TS__ArrayIndexOf(self.powerGenerators, generator) >= 0 then
        Log.Information(
            ("Generator for " .. tostring(self.id)) .. " was repaired!!"
        )
        self:updatePower(true)
    end
end
function ShipZone.prototype.onLeave(self, world, unit)
    ShipZone.____super.prototype.onLeave(self, world, unit)
end
function ShipZone.prototype.onEnter(self, world, unit)
    ShipZone.____super.prototype.onEnter(self, world, unit)
    world.askellon:applyPowerChange(unit.owner, self.hasPower, false)
end
function ShipZone.prototype.updatePower(self, newState)
    if self.hasPower ~= newState then
        __TS__ArrayMap(
            self:getPlayersInZone(),
            function(____, p) return self.game.worldModule.askellon:applyPowerChange(p, newState, true) end
        )
        if not newState then
            __TS__ArrayForEach(
                self.lightSources,
                function(____, lightSource, i)
                    local _i = i
                    local r = GetRandomInt(2, 4)
                    local timer = 500 + ((r * r) * 200)
                    self.game.worldModule.game.timedEventQueue:AddEvent(
                        __TS__New(
                            TimedEvent,
                            function()
                                local oldSource = self.lightSources[_i + 1]
                                local oldX = GetDestructableX(oldSource)
                                local oldY = GetDestructableY(oldSource)
                                local terrainZ = self.game.worldModule.game:getZFromXY(oldX, oldY)
                                local result = CreateSound(LIGHT_CLACK, false, true, true, 10, 10, "")
                                SetSoundDuration(
                                    result,
                                    GetSoundFileDuration(LIGHT_CLACK)
                                )
                                SetSoundChannel(result, 1)
                                SetSoundVolume(result, 127)
                                SetSoundPitch(result, 1)
                                SetSoundDistances(result, 2000, 10000)
                                SetSoundDistanceCutoff(result, 4500)
                                local location = Location(oldX, oldY)
                                PlaySoundAtPointBJ(result, 127, location, terrainZ)
                                RemoveLocation(location)
                                KillSoundWhenDone(result)
                                RemoveDestructable(oldSource)
                                self.lightSources[_i + 1] = CreateDestructableZ(LIGHT_DEST_ID, oldX, oldY, terrainZ + 9999, 0, 1, 0)
                                return true
                            end,
                            timer
                        )
                    )
                end
            )
        else
            __TS__ArrayForEach(
                self.lightSources,
                function(____, lightSource, i)
                    local _i = i
                    local r = GetRandomInt(2, 4)
                    local timer = 500 + ((r * r) * 200)
                    self.game.timedEventQueue:AddEvent(
                        __TS__New(
                            TimedEvent,
                            function()
                                local oldSource = self.lightSources[_i + 1]
                                local oldX = GetDestructableX(oldSource)
                                local oldY = GetDestructableY(oldSource)
                                local terrainZ = getZFromXY(oldX, oldY)
                                local result = CreateSound(LIGHT_CLACK, false, true, true, 10, 10, "")
                                SetSoundDuration(
                                    result,
                                    GetSoundFileDuration(LIGHT_CLACK)
                                )
                                SetSoundChannel(result, 2)
                                SetSoundVolume(result, 127)
                                SetSoundPitch(result, 1)
                                SetSoundDistances(result, 2000, 10000)
                                SetSoundDistanceCutoff(result, 4500)
                                local location = Location(oldX, oldY)
                                PlaySoundAtPointBJ(result, 127, location, terrainZ)
                                KillSoundWhenDone(result)
                                RemoveLocation(location)
                                RemoveDestructable(oldSource)
                                self.lightSources[_i + 1] = CreateDestructableZ(LIGHT_DEST_ID, oldX, oldY, terrainZ + 100, 0, 1, 0)
                                return true
                            end,
                            timer
                        )
                    )
                end
            )
        end
    end
    self.hasPower = newState
end
function ShipZone.prototype.doCauseFear(self)
    return (not self.hasPower) or self.alwaysCauseFear
end
return ____exports
end,
["src.app.world.the-askellon"] = function() require("lualib_bundle");
local ____exports = {}
local ____zone_2Did = require("src.app.world.zone-id")
local ZONE_TYPE = ____zone_2Did.ZONE_TYPE
local ____zone_2Dtype = require("src.app.world.zone-type")
local ShipZone = ____zone_2Dtype.ShipZone
local ____sound_2Dref = require("src.app.types.sound-ref")
local SoundRef = ____sound_2Dref.SoundRef
local ____timed_2Devent = require("src.app.types.timed-event")
local TimedEvent = ____timed_2Devent.TimedEvent
local ____buff_2Dinstance = require("src.app.buff.buff-instance")
local BuffInstanceCallback = ____buff_2Dinstance.BuffInstanceCallback
local ____serilog = require("src.lib.serilog.serilog")
local Log = ____serilog.Log
local ____alien_2Dforce = require("src.app.force.alien-force")
local ALIEN_FORCE_NAME = ____alien_2Dforce.ALIEN_FORCE_NAME
local ____vision_2Dtype = require("src.app.world.vision-type")
local VISION_TYPE = ____vision_2Dtype.VISION_TYPE
local ____ability_2Dids = require("src.resources.ability-ids")
local ABIL_NIGHTEYE = ____ability_2Dids.ABIL_NIGHTEYE
local SMALL_DAMAGE_THRESHOLD = 300
local MODREATE_DAMAGE_THRESHOLD = 900
local EXTREME_DAMAGE_THRESHOLD = 1800
____exports.TheAskellon = __TS__Class()
local TheAskellon = ____exports.TheAskellon
TheAskellon.name = "TheAskellon"
function TheAskellon.prototype.____constructor(self, world)
    self.powerDownSound = __TS__New(SoundRef, "Sounds\\PowerDown.mp3", false)
    self.powerUpSound = __TS__New(SoundRef, "Sounds\\powerUp.mp3", false)
    self.floors = __TS__New(Map)
    self.world = world
    self.floors:set(
        ZONE_TYPE.FLOOR_1,
        __TS__New(ShipZone, world.game, ZONE_TYPE.FLOOR_1)
    )
    self.floors:set(
        ZONE_TYPE.FLOOR_2,
        __TS__New(ShipZone, world.game, ZONE_TYPE.FLOOR_2)
    )
    self.floors:set(
        ZONE_TYPE.CARGO_A,
        __TS__New(ShipZone, world.game, ZONE_TYPE.CARGO_A)
    )
    self.floors:set(
        ZONE_TYPE.CARGO_A_VENT,
        __TS__New(ShipZone, world.game, ZONE_TYPE.CARGO_A_VENT)
    )
    self.floors:set(
        ZONE_TYPE.SERVICE_TUNNELS,
        __TS__New(ShipZone, world.game, ZONE_TYPE.SERVICE_TUNNELS)
    )
    local z1 = self.floors:get(ZONE_TYPE.FLOOR_1)
    if z1 then
        __TS__ArrayPush(z1.lightSources, gg_dest_B002_0015)
        __TS__ArrayPush(z1.lightSources, gg_dest_B002_0017)
        __TS__ArrayPush(z1.lightSources, gg_dest_B002_0019)
        __TS__ArrayPush(z1.lightSources, gg_dest_B002_0022)
    end
    local SERVICE_TUNNELS = self.floors:get(ZONE_TYPE.SERVICE_TUNNELS)
    if SERVICE_TUNNELS then
        SERVICE_TUNNELS:updatePower(false)
        SERVICE_TUNNELS.alwaysCauseFear = true
    end
    local CARGO_A_VENT = self.floors:get(ZONE_TYPE.CARGO_A_VENT)
    if CARGO_A_VENT then
        CARGO_A_VENT:updatePower(false)
        CARGO_A_VENT.alwaysCauseFear = true
    end
end
function TheAskellon.prototype.findZone(self, zone)
    return self.floors:get(zone)
end
function TheAskellon.prototype.applyPowerChange(self, player, hasPower, justChanged)
    local alienForce = self.world.game.forceModule:getForce(ALIEN_FORCE_NAME)
    local crewmember = self.world.game.crewModule:getCrewmemberForPlayer(player)
    local vision = ((crewmember and (function() return crewmember:getVisionType() end)) or (function() return VISION_TYPE.NORMAL end))()
    if hasPower and justChanged then
        if GetLocalPlayer() == player.handle then
            self.powerUpSound:playSound()
        end
        self.world.game.timedEventQueue:AddEvent(
            __TS__New(
                TimedEvent,
                function()
                    if GetLocalPlayer() == player.handle then
                        local ____switch12 = vision
                        if ____switch12 == VISION_TYPE.NIGHT_VISION then
                            goto ____switch12_case_0
                        elseif ____switch12 == VISION_TYPE.ALIEN then
                            goto ____switch12_case_1
                        end
                        goto ____switch12_case_default
                        ::____switch12_case_0::
                        ::____switch12_case_1::
                        ::____switch12_case_default::
                        do
                            SetDayNightModels("Environment\\DNC\\DNCLordaeron\\DNCLordaeronTerrain\\DNCLordaeronTerrain.mdl", "Environment\\DNC\\DNCLordaeron\\DNCLordaeronUnit\\DNCLordaeronUnit.mdl")
                        end
                        ::____switch12_end::
                    end
                    return true
                end,
                4000
            )
        )
    elseif (hasPower and (not justChanged)) and (player.handle == GetLocalPlayer()) then
        local ____switch14 = vision
        if ____switch14 == VISION_TYPE.NIGHT_VISION then
            goto ____switch14_case_0
        elseif ____switch14 == VISION_TYPE.ALIEN then
            goto ____switch14_case_1
        end
        goto ____switch14_case_default
        ::____switch14_case_0::
        ::____switch14_case_1::
        ::____switch14_case_default::
        do
            SetDayNightModels("Environment\\DNC\\DNCLordaeron\\DNCLordaeronTerrain\\DNCLordaeronTerrain.mdl", "Environment\\DNC\\DNCLordaeron\\DNCLordaeronUnit\\DNCLordaeronUnit.mdl")
        end
        ::____switch14_end::
    elseif (not hasPower) and (player.handle == GetLocalPlayer()) then
        if justChanged then
            self.powerDownSound:playSound()
        end
        local ____switch17 = vision
        if ____switch17 == VISION_TYPE.NIGHT_VISION then
            goto ____switch17_case_0
        elseif ____switch17 == VISION_TYPE.ALIEN then
            goto ____switch17_case_1
        end
        goto ____switch17_case_default
        ::____switch17_case_0::
        ::____switch17_case_1::
        do
            SetDayNightModels("war3mapImported\\NiteVisionModelRed.mdx", "war3mapImported\\war3mapImported\\NiteVisionModelRed.mdx")
            goto ____switch17_end
        end
        ::____switch17_case_default::
        do
            SetDayNightModels("", "")
        end
        ::____switch17_end::
    end
    if ((not hasPower) and crewmember) and (GetUnitAbilityLevel(crewmember.unit.handle, ABIL_NIGHTEYE) == 0) then
        crewmember:addDespair(
            self.world.game,
            __TS__New(
                BuffInstanceCallback,
                function()
                    local z = self.world:getUnitZone(crewmember.unit)
                    local hasNighteye = GetUnitAbilityLevel(crewmember.unit.handle, ABIL_NIGHTEYE)
                    return (((z and (hasNighteye == 0)) and (function() return z:doCauseFear() end)) or (function() return false end))()
                end
            )
        )
    end
end
function TheAskellon.prototype.damageShip(self, damage, zone)
    local damagedZone = ((zone and (function() return self:findZone(zone) end)) or (function() return self:getRandomZone()[2] end))()
    local askellonUnit = self.world.game.spaceModule.mainShip.unit
    if askellonUnit then
        UnitDamageTarget(askellonUnit, askellonUnit, damage, true, false, ATTACK_TYPE_CHAOS, DAMAGE_TYPE_UNKNOWN, WEAPON_TYPE_WHOKNOWS)
    end
    if damage > SMALL_DAMAGE_THRESHOLD then
    elseif damage > MODREATE_DAMAGE_THRESHOLD then
    elseif damage > EXTREME_DAMAGE_THRESHOLD then
    end
end
function TheAskellon.prototype.getRandomZone(self)
    local items = Array:from(self.floors)
    return items[math.floor(
        math.random() * #items
    ) + 1]
end
function TheAskellon.prototype.setPilot(self, crewmember)
    self.pilot = crewmember
end
function TheAskellon.prototype.getPilot(self)
    return self.pilot
end
function TheAskellon.prototype.getPlayers(self)
    local result = {}
    __TS__ArrayForEach(
        Array:from(self.floors),
        function(____, v) return __TS__ArrayForEach(
            v[2]:getPlayersInZone(),
            function(____, p) return __TS__ArrayPush(result, p) end
        ) end
    )
    return result
end
function TheAskellon.prototype.onSecurityDamage(self, destroyedSecurity, vandal)
    Log.Information("Ship found security damage!")
end
function TheAskellon.prototype.onSecurityRepair(self, repairedSecurity, engineer)
    Log.Information("Ship found security repair!")
end
return ____exports
end,
["src.app.world.world-module"] = function() require("lualib_bundle");
local ____exports = {}
local ____the_2Daskellon = require("src.app.world.the-askellon")
local TheAskellon = ____the_2Daskellon.TheAskellon
local ____zone_2Did = require("src.app.world.zone-id")
local STRING_TO_ZONE_TYPE = ____zone_2Did.STRING_TO_ZONE_TYPE
local ____index = require("node_modules.w3ts.index")
local Trigger = ____index.Trigger
local Unit = ____index.Unit
local ____serilog = require("src.lib.serilog.serilog")
local Log = ____serilog.Log
local ____event = require("src.app.events.event")
local EVENT_TYPE = ____event.EVENT_TYPE
local ____alien_2Dforce = require("src.app.force.alien-force")
local ALIEN_FORCE_NAME = ____alien_2Dforce.ALIEN_FORCE_NAME
____exports.WorldModule = __TS__Class()
local WorldModule = ____exports.WorldModule
WorldModule.name = "WorldModule"
function WorldModule.prototype.____constructor(self, game)
    self.worldZones = __TS__New(Map)
    self.unitLocation = __TS__New(Map)
    self.game = game
    self.askellon = __TS__New(TheAskellon, self)
    local deathTrigger = __TS__New(Trigger)
    deathTrigger:registerAnyUnitEvent(EVENT_PLAYER_UNIT_DEATH)
    deathTrigger:addAction(
        function() return self:unitDeath() end
    )
end
function WorldModule.prototype.handleTravel(self, unit, to)
    local uHandle = unit.id
    local oldZone = self.unitLocation:get(uHandle)
    local newZone = self:getZone(to)
    local ____ = oldZone and oldZone:onLeave(self, unit)
    local ____ = newZone and newZone:onEnter(self, unit)
    local ____ = newZone and self.unitLocation:set(uHandle, newZone)
end
function WorldModule.prototype.travel(self, unit, to)
    local alienForce = self.game.forceModule:getForce(ALIEN_FORCE_NAME)
    self:handleTravel(unit, to)
    local crew = self.game.crewModule:getCrewmemberForUnit(unit)
    local alien = alienForce:getAlienFormForPlayer(unit.owner)
    local isCrewmember = crew and (crew.unit == unit)
    if alien == unit then
        local alienCrew = self.game.crewModule:getCrewmemberForPlayer(unit.owner)
        self:handleTravel(alienCrew.unit, to)
    elseif (isCrewmember and alien) and crew then
        self:handleTravel(alien, to)
    end
    if isCrewmember and crew then
        local newLoc = self:getZone(to)
        local ____ = newLoc and newLoc:displayEnteringMessage(crew.player)
    end
    if (crew and (crew.unit == unit)) or (alien == unit) then
        self.game.event:sendEvent(EVENT_TYPE.CREW_CHANGES_FLOOR, {crewmember = crew})
    end
end
function WorldModule.prototype.unitDeath(self)
    local unit = Unit:fromHandle(
        GetTriggerUnit()
    )
    local handle = unit.id
    if self.unitLocation:has(handle) then
        local zone = self.unitLocation:get(handle)
        local ____ = zone and zone:onLeave(self, unit)
        self.unitLocation:delete(handle)
    end
end
function WorldModule.prototype.getZone(self, whichZone)
    return self.askellon:findZone(whichZone) or self.worldZones:get(whichZone)
end
function WorldModule.prototype.getZoneByName(self, whichZone)
    local result = STRING_TO_ZONE_TYPE:get(whichZone)
    if not result then
        Log.Error(
            "FAILED TO GET ZONE FOR " .. tostring(whichZone)
        )
    end
    return result
end
function WorldModule.prototype.getPlayersInZone(self, whichZone)
    return {}
end
function WorldModule.prototype.getUnitZone(self, whichUnit)
    return self.unitLocation:get(whichUnit.id)
end
return ____exports
end,
["src.app.galaxy.sector-names"] = function() local ____exports = {}
____exports.SECTOR_PREFIXES = {"Alpha", "Beta", "Zeta", "Gamma", "Charlie", "Founding", "Lost", "Terrible", "Frost", "Prima", "Old"}
____exports.SECTOR_NAMES = {"Sol", "Dionysus", "Guthao", "Valanope", "Syke", "Yestrucarro", "Boar", "Enides", "Xagaoruta", "Chongiuclite", "Brion", "Yaecury", "Steinway", "Crichi", "Thullon", "Bamania", "Bolla", "Leron", "Galion", "Chuzion", "Lladivis", "Iskies", "Xentara"}
return ____exports
end,
["src.app.galaxy.sector-sector-type"] = function() require("lualib_bundle");
local ____exports = {}
local ____sector_2Dnames = require("src.app.galaxy.sector-names")
local SECTOR_NAMES = ____sector_2Dnames.SECTOR_NAMES
local SECTOR_PREFIXES = ____sector_2Dnames.SECTOR_PREFIXES
____exports.SpaceSector = __TS__Class()
local SpaceSector = ____exports.SpaceSector
SpaceSector.name = "SpaceSector"
function SpaceSector.prototype.____constructor(self)
    self.name = ""
    self.seed = 0
    self.hasGenerated = false
end
function SpaceSector.prototype.initalise(self)
    self:nameSector()
end
function SpaceSector.prototype.nameSector(self)
    local prefix = SECTOR_PREFIXES[math.floor(
        math.random() * #SECTOR_PREFIXES
    ) + 1]
    local name = SECTOR_NAMES[math.floor(
        math.random() * #SECTOR_NAMES
    ) + 1]
    self.name = (tostring(prefix) .. " ") .. tostring(name)
end
function SpaceSector.prototype.setSeed(self, seed)
    self.seed = seed
end
function SpaceSector.prototype.generateMinerals(self)
    SetRandomSeed(self.seed)
    local mineralDensity = GetRandomInt(20, 60)
end
return ____exports
end,
["src.app.galaxy.sector-type"] = function() require("lualib_bundle");
local ____exports = {}
local ____sector_2Dsector_2Dtype = require("src.app.galaxy.sector-sector-type")
local SpaceSector = ____sector_2Dsector_2Dtype.SpaceSector
____exports.SpaceGrid = __TS__Class()
local SpaceGrid = ____exports.SpaceGrid
SpaceGrid.name = "SpaceGrid"
function SpaceGrid.prototype.____constructor(self)
    self.sectors = {}
end
function SpaceGrid.prototype.initSectors(self, minX, minY, maxX, maxY)
    local x = minX
    while (function()
        local ____tmp = x
        x = ____tmp + 1
        return ____tmp
    end)() < maxX do
        local newSectors = {}
        local y = minY
        while (function()
            local ____tmp = y
            y = ____tmp + 1
            return ____tmp
        end)() < maxY do
            __TS__ArrayPush(
                newSectors,
                __TS__New(SpaceSector)
            )
        end
        __TS__ArrayPush(self.sectors, newSectors)
    end
    __TS__ArrayForEach(
        self.sectors,
        function(____, sectorArray) return __TS__ArrayForEach(
            sectorArray,
            function(____, sector) return sector:initalise() end
        ) end
    )
end
function SpaceGrid.prototype.navigateTo(self, position)
    local nSector = self.sectors[position.x + 1][position.y + 1]
    return nSector
end
return ____exports
end,
["src.app.galaxy.navigation-grid-type"] = function() require("lualib_bundle");
local ____exports = {}
local ____vector3 = require("src.app.types.vector3")
local Vector3 = ____vector3.Vector3
local ____serilog = require("src.lib.serilog.serilog")
local Log = ____serilog.Log
local GRID_MODEL = "Doodads\\Cinematic\\FootSwitch\\FootSwitch.mdl"
local NAV_GRID_DISPLAY_X = 4
local NAV_GRID_DISPLAY_Y = 4
local NAV_GRID_SCALE = 1.2
local NAV_GRID_SIZE = 200
local NAV_GRID_ALPHA = 90
____exports.NavigationGrid = __TS__Class()
local NavigationGrid = ____exports.NavigationGrid
NavigationGrid.name = "NavigationGrid"
function NavigationGrid.prototype.____constructor(self)
    self.location = __TS__New(Vector3, 0, 0, 0)
    self.gridItems = {}
end
function NavigationGrid.prototype.setCenter(self, x, y, z)
    self.location = __TS__New(Vector3, x, y, z)
end
function NavigationGrid.prototype.getNewDisplay(self, x, y, sectors)
    local display = {}
    local xIterator = x - NAV_GRID_DISPLAY_X
    local totalX = 0
    local maxX = x + NAV_GRID_DISPLAY_X
    local maxY = y + NAV_GRID_DISPLAY_Y
    Log.Information("Creating sector map!")
    while xIterator <= maxX do
        local yIterator = y - NAV_GRID_DISPLAY_Y
        local resultArray = {}
        totalX = totalX + 1
        Log.Information(
            "x: " .. tostring(xIterator)
        )
        local totalY = 0
        while yIterator <= maxY do
            Log.Information(
                "y: " .. tostring(yIterator)
            )
            resultArray[yIterator + 1] = self:createItemsForSector(sectors[xIterator + 1][yIterator + 1], totalX, totalY)
            yIterator = yIterator + 1
            totalY = totalY + 1
        end
        __TS__ArrayPush(display, resultArray)
        xIterator = xIterator + 1
    end
    __TS__ArrayForEach(
        self.gridItems,
        function(____, x) return __TS__ArrayForEach(
            x,
            function(____, y)
                DestroyEffect(y.locationEffect)
                __TS__ArrayForEach(
                    y.innerEffects,
                    function(____, s) return DestroyEffect(s) end
                )
            end
        ) end
    )
    self.gridItems = display
end
function NavigationGrid.prototype.createItemsForSector(self, sector, x, y)
    local worldSfx = AddSpecialEffect(GRID_MODEL, self.location.x, self.location.y)
    BlzSetSpecialEffectScale(worldSfx, NAV_GRID_SCALE)
    BlzSetSpecialEffectAlpha(worldSfx, NAV_GRID_ALPHA)
    return {x = x, y = y, locationEffect = worldSfx, innerEffects = {}}
end
function NavigationGrid.prototype.renderForOffset(self, offset)
    __TS__ArrayForEach(
        self.gridItems,
        function(____, x) return __TS__ArrayForEach(
            x,
            function(____, gridItem)
                local nX = (gridItem.x + ((offset.x - NAV_GRID_SIZE) * NAV_GRID_SIZE)) + self.location.x
                local nY = (gridItem.y + ((offset.y - NAV_GRID_SIZE) * NAV_GRID_SIZE)) + self.location.y
                BlzSetSpecialEffectX(gridItem.locationEffect, nX)
                BlzSetSpecialEffectY(gridItem.locationEffect, nY)
                BlzSetSpecialEffectZ(gridItem.locationEffect, self.location.z)
            end
        ) end
    )
end
function NavigationGrid.prototype.getFadeValue(self, distanceFromCenter)
    return 1
end
return ____exports
end,
["src.app.galaxy.galaxy-module"] = function() require("lualib_bundle");
local ____exports = {}
local ____sector_2Dtype = require("src.app.galaxy.sector-type")
local SpaceGrid = ____sector_2Dtype.SpaceGrid
local ____vector2 = require("src.app.types.vector2")
local Vector2 = ____vector2.Vector2
local ____serilog = require("src.lib.serilog.serilog")
local Log = ____serilog.Log
local ____navigation_2Dgrid_2Dtype = require("src.app.galaxy.navigation-grid-type")
local NavigationGrid = ____navigation_2Dgrid_2Dtype.NavigationGrid
local GRID_RECT = gg_rct_Galaxy_Map
____exports.GalaxyModule = __TS__Class()
local GalaxyModule = ____exports.GalaxyModule
GalaxyModule.name = "GalaxyModule"
function GalaxyModule.prototype.____constructor(self, game)
    self.galaxyMap = __TS__New(NavigationGrid)
    self.currentSector = __TS__New(Vector2, 0, 0)
    self.game = game
    self.spaceGrid = __TS__New(SpaceGrid)
end
function GalaxyModule.prototype.initSectors(self)
    self.spaceGrid:initSectors(-5, -5, 5, 5)
end
function GalaxyModule.prototype.getCurrentSector(self)
    return self.spaceGrid.sectors[self.currentSector.x + 1][self.currentSector.y + 1]
end
function GalaxyModule.prototype.navigateToSector(self, deltaX, deltaY)
    local oldSector = self.spaceGrid.sectors[self.currentSector.x + 1][self.currentSector.y + 1]
    local nSector = self.spaceGrid:navigateTo(
        __TS__New(Vector2, self.currentSector.x + deltaX, self.currentSector.y + deltaY)
    )
    local pilot = self.game.worldModule.askellon:getPilot() or self.game.crewModule.CREW_MEMBERS[1]
    if not nSector then
        return Log.Error("Failed to jump to new location!")
    end
    self.currentSector = __TS__New(Vector2, self.currentSector.x + deltaX, self.currentSector.y + deltaY)
    Log.Information(
        "Entering " .. tostring(nSector.name)
    )
    if pilot then
        DisplayText(
            pilot.unit.owner.id,
            "Entering " .. tostring(nSector.name)
        )
    end
    self.galaxyMap:getNewDisplay(self.currentSector.x, self.currentSector.y, self.spaceGrid.sectors)
    self.galaxyMap:renderForOffset(
        __TS__New(Vector2, 0, 0)
    )
end
function GalaxyModule.prototype.createNavigationGrid(self)
    local centerX = GetRectCenterX(gg_rct_Galaxy_Map)
    local centerY = GetRectCenterY(gg_rct_Galaxy_Map)
    self.galaxyMap:setCenter(
        centerX,
        centerY,
        self.game:getZFromXY(centerX, centerY)
    )
    self.galaxyMap:getNewDisplay(self.currentSector.x, self.currentSector.y, self.spaceGrid.sectors)
    self.galaxyMap:renderForOffset(
        self.game.spaceModule:getAskellonPosition()
    )
end
return ____exports
end,
["src.app.leap-engine.leap-module"] = function() require("lualib_bundle");
local ____exports = {}
local ____index = require("node_modules.w3ts.index")
local Trigger = ____index.Trigger
local Unit = ____index.Unit
local ____projectile_2Dtarget = require("src.app.weapons.projectile.projectile-target")
local ProjectileMoverParabolic = ____projectile_2Dtarget.ProjectileMoverParabolic
local ____vector3 = require("src.app.types.vector3")
local Vector3 = ____vector3.Vector3
local ____utils = require("src.lib.utils")
local getZFromXY = ____utils.getZFromXY
local ____timed_2Devent = require("src.app.types.timed-event")
local TimedEvent = ____timed_2Devent.TimedEvent
local ____sound_2Dref = require("src.app.types.sound-ref")
local SoundRef = ____sound_2Dref.SoundRef
local ____ability_2Dids = require("src.resources.ability-ids")
local UNIT_IS_FLY = ____ability_2Dids.UNIT_IS_FLY
____exports.LEAP_INTERVAL = 0.03
____exports.LeapEntry = __TS__Class()
local LeapEntry = ____exports.LeapEntry
LeapEntry.name = "LeapEntry"
function LeapEntry.prototype.____constructor(self, who, toWhere, angle, timescale)
    if timescale == nil then
        timescale = 1
    end
    local cX = GetUnitX(who)
    local cY = GetUnitY(who)
    local cZ = getZFromXY(cX, cY)
    self.unit = who
    self.location = __TS__New(Vector3, cX, cY, cZ)
    self.initalLocation = __TS__New(Vector3, cX, cY, cZ)
    self.timescale = timescale
    self.mover = __TS__New(
        ProjectileMoverParabolic,
        self.location,
        toWhere,
        Deg2Rad(angle)
    )
    BlzPauseUnitEx(who, true)
    UnitAddAbility(who, UNIT_IS_FLY)
    BlzUnitDisableAbility(who, UNIT_IS_FLY, true, true)
end
function LeapEntry.prototype.onFinish(self, cb)
    self.onFinishCallback = function(____, entry) return cb(entry) end
end
function LeapEntry.prototype.update(self, delta)
    local posDelta = self.mover:move(self.mover.originalPos, self.mover.originalDelta, self.mover.velocity, delta)
    local unitLoc = __TS__New(
        Vector3,
        GetUnitX(self.unit) + posDelta.x,
        GetUnitY(self.unit) + posDelta.y,
        self.location.z + posDelta.z
    )
    self.location = unitLoc
    local terrainZ = getZFromXY(unitLoc.x, unitLoc.y)
    if self.location.z < terrainZ then
        BlzPauseUnitEx(self.unit, false)
        UnitRemoveAbility(self.unit, UNIT_IS_FLY)
        SetUnitFlyHeight(self.unit, 0, 9999)
        return false
    end
    SetUnitX(self.unit, unitLoc.x)
    SetUnitY(self.unit, unitLoc.y)
    SetUnitFlyHeight(self.unit, unitLoc.z - terrainZ, 9999)
    return true
end
____exports.LeapModule = __TS__Class()
local LeapModule = ____exports.LeapModule
LeapModule.name = "LeapModule"
function LeapModule.prototype.____constructor(self, game)
    self.instances = {}
    self.fallingSounds = {
        __TS__New(SoundRef, "Sounds\\FallingWind.mp3", false),
        __TS__New(SoundRef, "Sounds\\FallingWhistle.mp3", false),
        __TS__New(SoundRef, "Sounds\\SnakeDeath.mp3", false)
    }
    self.game = game
    self.leapTrigger = __TS__New(Trigger)
end
function LeapModule.prototype.initialise(self)
    self.leapTrigger:registerTimerEvent(____exports.LEAP_INTERVAL, true)
    self.leapTrigger:addAction(
        function() return self:updateLeaps() end
    )
end
function LeapModule.prototype.updateLeaps(self)
    self.instances = __TS__ArrayFilter(
        self.instances,
        function(____, i)
            local doDestroy = not i:update(____exports.LEAP_INTERVAL)
            if doDestroy then
                if i.onFinishCallback then
                    i:onFinishCallback(i)
                end
                local unitLoc = i.location
                local insideRectIndex = self:findInsideRect(udg_fall_points, unitLoc)
                if insideRectIndex then
                    local targetRect = udg_fall_results[insideRectIndex + 1]
                    local ____ = targetRect and self:makeUnitFall(i.unit, targetRect, udg_fall_result_zone_names[insideRectIndex + 1])
                else
                    local newZone = self:findInsideRect(udg_jump_pass_zones, unitLoc)
                    local resultZone = (not (not newZone)) and udg_jump_pass_zones_name[newZone + 1]
                    local z = resultZone and self.game.worldModule:getZoneByName(resultZone)
                    local ____ = z and self.game.worldModule:travel(
                        Unit:fromHandle(i.unit),
                        z
                    )
                end
            end
            return not doDestroy
        end
    )
end
function LeapModule.prototype.makeUnitFall(self, who, targetRect, zoneName)
    local locX = GetRandomReal(
        GetRectMinX(targetRect),
        GetRectMaxX(targetRect)
    )
    local locY = GetRandomReal(
        GetRectMinY(targetRect),
        GetRectMaxY(targetRect)
    )
    local player = GetOwningPlayer(who)
    BlzPauseUnitEx(who, true)
    ShowUnit(who, false)
    local seed = GetRandomInt(0, 100)
    local fallingSound
    if seed <= 70 then
        fallingSound = self.fallingSounds[1]
    elseif seed <= 90 then
        fallingSound = self.fallingSounds[2]
    else
        fallingSound = self.fallingSounds[3]
    end
    fallingSound:playSoundOnUnit(who, 127)
    self.game.timedEventQueue:AddEvent(
        __TS__New(
            TimedEvent,
            function()
                local z = self.game.worldModule:getZoneByName(zoneName)
                local ____ = z and self.game.worldModule:travel(
                    Unit:fromHandle(who),
                    z
                )
                PanCameraToTimedForPlayer(player, locX, locY, 0)
                UnitAddAbility(who, UNIT_IS_FLY)
                BlzUnitDisableAbility(who, UNIT_IS_FLY, true, true)
                SetUnitFlyHeight(who, 800, 9999)
                return true
            end,
            250
        )
    )
    self.game.timedEventQueue:AddEvent(
        __TS__New(
            TimedEvent,
            function()
                SetUnitX(who, locX)
                SetUnitY(who, locY)
                ShowUnit(who, true)
                SelectUnitAddForPlayer(who, player)
                return true
            end,
            500
        )
    )
    self.game.timedEventQueue:AddEvent(
        __TS__New(
            TimedEvent,
            function()
                SelectUnitAddForPlayer(who, player)
                SetUnitFlyHeight(who, 0, 1600)
                return true
            end,
            2300
        )
    )
    self.game.timedEventQueue:AddEvent(
        __TS__New(
            TimedEvent,
            function()
                local damage = GetUnitState(who, UNIT_STATE_LIFE) * 0.4
                UnitDamageTarget(who, who, damage, false, false, ATTACK_TYPE_CHAOS, DAMAGE_TYPE_UNKNOWN, WEAPON_TYPE_WHOKNOWS)
                SetUnitAnimation(who, "death")
                local sfx = AddSpecialEffect("Abilities\\Spells\\Orc\\WarStomp\\WarStompCaster.mdl", locX, locY)
                DestroyEffect(sfx)
                return true
            end,
            2800
        )
    )
    self.game.timedEventQueue:AddEvent(
        __TS__New(
            TimedEvent,
            function()
                BlzPauseUnitEx(who, false)
                UnitRemoveAbility(who, UNIT_IS_FLY)
                SetUnitFlyHeight(who, 0, 9999)
                return true
            end,
            5800
        )
    )
end
function LeapModule.prototype.findInsideRect(self, rects, loc)
    do
        local i = 0
        while i < #rects do
            local rect = rects[i + 1]
            if (((rect and (GetRectMinX(rect) < loc.x)) and (GetRectMinY(rect) < loc.y)) and (GetRectMaxX(rect) > loc.x)) and (GetRectMaxY(rect) > loc.y) then
                return i
            end
            i = i + 1
        end
    end
end
function LeapModule.prototype.newLeap(self, who, toWhere, angle, timescale)
    local leapInstance = __TS__New(____exports.LeapEntry, who, toWhere, angle, timescale)
    __TS__ArrayPush(self.instances, leapInstance)
    return leapInstance
end
return ____exports
end,
["src.app.research.research-module"] = function() require("lualib_bundle");
local ____exports = {}
local ____index = require("node_modules.w3ts.index")
local Trigger = ____index.Trigger
local Unit = ____index.Unit
local MapPlayer = ____index.MapPlayer
local ____ability_2Dids = require("src.resources.ability-ids")
local TECH_MAJOR_WEAPONS_PRODUCTION = ____ability_2Dids.TECH_MAJOR_WEAPONS_PRODUCTION
local TECH_MAJOR_HEALTHCARE = ____ability_2Dids.TECH_MAJOR_HEALTHCARE
local ____alien_2Dforce = require("src.app.force.alien-force")
local ALIEN_FORCE_NAME = ____alien_2Dforce.ALIEN_FORCE_NAME
local ____strings = require("src.resources.strings")
local STR_UPGRADE_NAME_WEAPONS = ____strings.STR_UPGRADE_NAME_WEAPONS
local STR_UPGRADE_COMPLETE_HEADER = ____strings.STR_UPGRADE_COMPLETE_HEADER
local STR_UPGRADE_COMPLETE_SUBTITLE = ____strings.STR_UPGRADE_COMPLETE_SUBTITLE
local STR_UPGRADE_COMPLETE_INFESTATION = ____strings.STR_UPGRADE_COMPLETE_INFESTATION
local STR_UPGRADE_NAME_HEALTHCARE = ____strings.STR_UPGRADE_NAME_HEALTHCARE
local ____crewmember_2Dnames = require("src.resources.crewmember-names")
local ROLE_TYPES = ____crewmember_2Dnames.ROLE_TYPES
____exports.ResearchModule = __TS__Class()
local ResearchModule = ____exports.ResearchModule
ResearchModule.name = "ResearchModule"
function ResearchModule.prototype.____constructor(self, game)
    self.infestedUpgrades = __TS__New(Map)
    self.upgradeSource = __TS__New(Map)
    self.majorUpgradeLevels = __TS__New(Map)
    self.game = game
end
function ResearchModule.prototype.initialise(self)
    self:trackCrewUpgrades()
end
function ResearchModule.prototype.trackCrewUpgrades(self)
    local t = __TS__New(Trigger)
    t:registerAnyUnitEvent(EVENT_PLAYER_UNIT_RESEARCH_FINISH)
    t:addAction(
        function()
            local unit = Unit:fromHandle(
                GetTriggerUnit()
            )
            local player = unit.owner
            local techUnlocked = GetResearched()
            local levelTech = player:getTechCount(techUnlocked, true)
            if self:techIsMajor(techUnlocked) then
                self:processMajorUpgrade(player, techUnlocked, levelTech)
                __TS__ArrayForEach(
                    self.game.crewModule.CREW_MEMBERS,
                    function(____, c) return c:onPlayerFinishUpgrade() end
                )
                local pForce = self.game.forceModule:getPlayerForce(player)
                local crewmember = self.game.crewModule:getCrewmemberForPlayer(player)
                if pForce and crewmember then
                    self:rewardResearchXP(pForce, crewmember, player, techUnlocked)
                end
            else
                local p = GetOwningPlayer(
                    GetTriggerUnit()
                )
                local crew = self.game.crewModule:getCrewmemberForPlayer(
                    MapPlayer:fromHandle(p)
                )
                if crew then
                    crew:onPlayerFinishUpgrade()
                end
            end
        end
    )
end
function ResearchModule.prototype.techIsMajor(self, id)
    if id == TECH_MAJOR_WEAPONS_PRODUCTION then
        return true
    end
    if id == TECH_MAJOR_HEALTHCARE then
        return true
    end
    return false
end
function ResearchModule.prototype.processMajorUpgrade(self, player, id, level)
    local alienForce = self.game.forceModule:getForce(ALIEN_FORCE_NAME)
    local isInfested = alienForce and alienForce:hasPlayer(player)
    local players = self.game.forceModule:getActivePlayers()
    __TS__ArrayForEach(
        players,
        function(____, p) return p:setTechResearched(id, level) end
    )
    local techName = self:getTechName(id, level)
    __TS__ArrayForEach(
        players,
        function(____, p)
            DisplayTextToPlayer(
                p.handle,
                0,
                0,
                STR_UPGRADE_COMPLETE_HEADER()
            )
            DisplayTextToPlayer(
                p.handle,
                0,
                0,
                STR_UPGRADE_COMPLETE_SUBTITLE(techName)
            )
            if (alienForce and isInfested) and alienForce:hasPlayer(p) then
                DisplayTextToPlayer(
                    p.handle,
                    0,
                    0,
                    STR_UPGRADE_COMPLETE_INFESTATION()
                )
                self:setUpgradeAsInfested(id, level, true)
            else
            end
        end
    )
    local crewmember = self.game.crewModule:getCrewmemberForPlayer(player)
    if isInfested then
        self:setUpgradeAsInfested(id, level, true)
    end
    if crewmember then
        self:setUpgradeSource(id, level, crewmember.role)
    end
    self.majorUpgradeLevels:set(id, level)
end
function ResearchModule.prototype.getTechName(self, id, level)
    if id == TECH_MAJOR_WEAPONS_PRODUCTION then
        return STR_UPGRADE_NAME_WEAPONS(level)
    end
    if id == TECH_MAJOR_HEALTHCARE then
        return STR_UPGRADE_NAME_HEALTHCARE(level)
    end
    return ""
end
function ResearchModule.prototype.setUpgradeAsInfested(self, upgrade, level, state)
    local key = self:getKeyForUpgradeLevel(upgrade, level)
    self.infestedUpgrades:set(key, state)
end
function ResearchModule.prototype.isUpgradeInfested(self, upgrade, level)
    return self.infestedUpgrades:get(
        self:getKeyForUpgradeLevel(upgrade, level)
    ) or false
end
function ResearchModule.prototype.getUpgradeSource(self, upgrade, level)
    local key = self:getKeyForUpgradeLevel(upgrade, level)
    return self.upgradeSource:get(key)
end
function ResearchModule.prototype.setUpgradeSource(self, upgrade, level, role)
    local key = self:getKeyForUpgradeLevel(upgrade, level)
    return self.upgradeSource:set(key, role)
end
function ResearchModule.prototype.getKeyForUpgradeLevel(self, upgrade, level)
    return (tostring(upgrade) .. "::") .. tostring(level)
end
function ResearchModule.prototype.getMajorUpgradeLevel(self, upgrade)
    return self.majorUpgradeLevels:get(upgrade) or 0
end
function ResearchModule.prototype.rewardResearchXP(self, force, crewmember, player, techUnlocked)
    local baseXp = 500 * self:getMajorUpgradeLevel(techUnlocked)
    if (techUnlocked == TECH_MAJOR_HEALTHCARE) and (crewmember.role == ROLE_TYPES.DOCTOR) then
        local ____ = baseXp * 1.5
    end
    force:onUnitGainsXp(self.game, crewmember, baseXp)
end
return ____exports
end,
["src.app.chat.chat-system"] = function() require("lualib_bundle");
local ____exports = {}
____exports.ChatSystem = __TS__Class()
local ChatSystem = ____exports.ChatSystem
ChatSystem.name = "ChatSystem"
function ChatSystem.prototype.____constructor(self, game, forWho)
    self.messageQueue = {}
    self.timeSinceLastMessage = 0
    self.timestampLastMessage = 0
    self.game = game
    self.player = forWho
end
function ChatSystem.prototype.getGameTime(self)
    return self.game:getTimeStamp()
end
function ChatSystem.prototype.getChatColor(self, playerColor)
    return "|cff" .. tostring(playerColor)
end
function ChatSystem.prototype.getChatTimeTag(self)
    local timeStamp = self:getGameTime()
    local minutes = I2S(
        MathRound(timeStamp / 60)
    )
    local seconds = I2S(
        MathRound(
            self:getGameTime() % 60
        )
    )
    if #minutes < 2 then
        minutes = "0" .. tostring(minutes)
    end
    if #seconds < 2 then
        seconds = "0" .. tostring(seconds)
    end
    return ((("[" .. tostring(minutes)) .. ":") .. tostring(seconds)) .. "]"
end
function ChatSystem.prototype.getChatUser(self, playerName, playerColor)
    local name = playerName
    local color = self:getChatColor(playerColor)
    return (tostring(color) .. tostring(name)) .. "|r"
end
function ChatSystem.prototype.messageIsValid(self, message)
    return #message <= 128
end
function ChatSystem.prototype.generateMessage(self, playerName, playerColor, message, messageTag)
    if GetLocalPlayer() == self.player.handle then
        return (((tostring(
            self:getChatTimeTag()
        ) .. " ") .. tostring(
            self:getChatUser(playerName, playerColor)
        )) .. ": ") .. tostring(message)
    end
    return ""
end
function ChatSystem.prototype.update(self)
    local ____string = ""
    local queue = __TS__ArraySlice(self.messageQueue)
    while #queue > 0 do
        local message = __TS__ArrayShift(queue)
        if message then
            ____string = tostring(____string) .. (tostring(message) .. "\n")
        else
            ____string = tostring(____string) .. ""
        end
    end
    BlzFrameSetText(self.frame, ____string)
end
function ChatSystem.prototype.addMessage(self, message)
    __TS__ArrayPush(self.messageQueue, message)
    if #self.messageQueue > 10 then
        __TS__ArrayShift(self.messageQueue)
    end
end
function ChatSystem.prototype.sendMessage(self, playerName, playerColor, message, messageTag, sound)
    local timestamp = self:getGameTime()
    if GetLocalPlayer() == self.player.handle then
        if self:messageIsValid(message) then
            local text = self:generateMessage(playerName, playerColor, message, messageTag)
            self:addMessage(text)
            self:update()
            if sound then
                sound:playSound()
            end
            self.timestampLastMessage = timestamp
            self.timeSinceLastMessage = 0
        end
    end
end
function ChatSystem.prototype.updateFade(self, timeSinceLastPost)
    self.timeSinceLastMessage = self.timeSinceLastMessage + timeSinceLastPost
    local alpha = math.max(
        math.min(255 - (((self.timeSinceLastMessage - 6) / 3) * 255), 255),
        0
    )
    if self.chatFrame and (self.player.handle == GetLocalPlayer()) then
        BlzFrameSetAlpha(
            self.chatFrame,
            MathRound(alpha)
        )
    end
end
function ChatSystem.prototype.init(self, chatHandle, chatText)
    self.chatFrame = chatHandle
    self.frame = chatText
end
return ____exports
end,
["src.app.chat.chat-module"] = function() require("lualib_bundle");
local ____exports = {}
local ____index = require("node_modules.w3ts.index")
local Trigger = ____index.Trigger
local MapPlayer = ____index.MapPlayer
local ____zone_2Did = require("src.app.world.zone-id")
local ZONE_TYPE = ____zone_2Did.ZONE_TYPE
local ____chat_2Dsystem = require("src.app.chat.chat-system")
local ChatSystem = ____chat_2Dsystem.ChatSystem
____exports.PRIVS = {}
____exports.PRIVS.USER = 0
____exports.PRIVS[____exports.PRIVS.USER] = "USER"
____exports.PRIVS.MODERATOR = 1
____exports.PRIVS[____exports.PRIVS.MODERATOR] = "MODERATOR"
____exports.PRIVS.DEVELOPER = 2
____exports.PRIVS[____exports.PRIVS.DEVELOPER] = "DEVELOPER"
____exports.ChatModule = __TS__Class()
local ChatModule = ____exports.ChatModule
ChatModule.name = "ChatModule"
function ChatModule.prototype.____constructor(self, game)
    self.chatHandlers = __TS__New(Map)
    self.game = game
    self.chatHandlers = __TS__New(Map)
end
function ChatModule.prototype.initialise(self)
    local players = self.game.forceModule:getActivePlayers()
    local font = "LVCMono.otf"
    BlzFrameSetVisible(
        BlzGetFrameByName("AllianceDialog", 0),
        false
    )
    BlzFrameSetEnable(
        BlzGetFrameByName("AllianceDialog", 0),
        false
    )
    BlzFrameSetVisible(
        BlzGetFrameByName("ChatDialog", 0),
        false
    )
    BlzFrameSetEnable(
        BlzGetFrameByName("ChatDialog", 0),
        false
    )
    BlzFrameSetVisible(
        BlzGetFrameByName("UpperButtonBarAlliesButton", 0),
        false
    )
    BlzFrameSetEnable(
        BlzGetFrameByName("UpperButtonBarAlliesButton", 0),
        false
    )
    BlzFrameSetVisible(
        BlzGetFrameByName("UpperButtonBarChatButton", 0),
        false
    )
    BlzFrameSetEnable(
        BlzGetFrameByName("UpperButtonBarChatButton", 0),
        false
    )
    local chatHandle = BlzCreateSimpleFrame(
        "Chat",
        BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0),
        0
    )
    local chatTextHandle = BlzGetFrameByName("Chat Text", 0)
    BlzFrameSetVisible(
        BlzGetOriginFrame(ORIGIN_FRAME_CHAT_MSG, 0),
        false
    )
    BlzFrameSetAbsPoint(chatHandle, FRAMEPOINT_BOTTOMLEFT, -0.1, 0.17)
    BlzFrameSetLevel(chatHandle, 8)
    BlzFrameSetTextAlignment(chatTextHandle, TEXT_JUSTIFY_BOTTOM, TEXT_JUSTIFY_LEFT)
    BlzFrameSetFont(
        chatTextHandle,
        "UI\\Font\\" .. tostring(font),
        0.011,
        1
    )
    __TS__ArrayForEach(
        players,
        function(____, p)
            local chatHandler = __TS__New(ChatSystem, self.game, p)
            chatHandler:init(chatHandle, chatTextHandle)
            self.chatHandlers:set(p, chatHandler)
        end
    )
    local messageTrigger = __TS__New(Trigger)
    __TS__ArrayForEach(
        self.game.forceModule:getActivePlayers(),
        function(____, player)
            messageTrigger:registerPlayerChatEvent(player, "", false)
        end
    )
    messageTrigger:addAction(
        function() return self:onChatMessage() end
    )
    local fadeTrig = __TS__New(Trigger)
    fadeTrig:registerTimerEvent(0.3, true)
    fadeTrig:addAction(
        function() return self:updateFade(0.3) end
    )
end
function ChatModule.prototype.updateFade(self, deltaTime)
    self.chatHandlers:forEach(
        function(____, handler) return handler:updateFade(deltaTime) end
    )
end
function ChatModule.prototype.onChatMessage(self)
    local player = MapPlayer:fromHandle(
        GetTriggerPlayer()
    )
    local message = GetEventPlayerChatString()
    local crew = self.game.crewModule:getCrewmemberForPlayer(player)
    local isCommand = string.sub(message, 1, 1) == "-"
    if isCommand then
        self:handleCommand(player, message, crew)
    else
        self:handleMessage(player, message, crew)
    end
end
function ChatModule.prototype.handleCommand(self, player, message, crew)
    local priv = self:getUserPrivs(player)
    if priv >= 2 then
        if (message == "-u") and crew then
            if crew.weapon then
                crew.weapon:detach()
            end
            crew:updateTooltips(self.game.weaponModule)
        elseif message == "-p1off" then
            local z = self.game.worldModule.askellon:findZone(ZONE_TYPE.FLOOR_1)
            local ____ = z and z:updatePower(false)
        elseif message == "-p1on" then
            local z = self.game.worldModule.askellon:findZone(ZONE_TYPE.FLOOR_1)
            local ____ = z and z:updatePower(true)
        elseif message == "-nt" then
            self.game.noTurn = not self.game.noTurn
        elseif ((string.find(message, "-m", nil, true) or 0) - 1) == 0 then
            local mSplit = __TS__StringSplit(message, " ")
            local dX = S2I(mSplit[2] or "0")
            local dY = S2I(mSplit[3] or "0")
            self.game.galaxyModule:navigateToSector(dX, dY)
        elseif ((string.find(message, "-wa", nil, true) or 0) - 1) == 0 then
            self.game.weaponModule:changeWeaponModeTo("ATTACK")
        elseif ((string.find(message, "-wc", nil, true) or 0) - 1) == 0 then
            self.game.weaponModule:changeWeaponModeTo("CAST")
        end
    end
    if priv >= 1 then
    end
    if priv >= 0 then
    end
end
function ChatModule.prototype.handleMessage(self, player, message, crew)
    local force = self.game.forceModule:getPlayerForce(player)
    if force then
        local recipients = force:getChatRecipients(player)
        local playername = force:getChatName(player)
        local color = force:getChatColor(player)
        local sound = force:getChatSoundRef(player)
        local messageTag = force:getChatTag(player)
        self:postMessageFor(recipients, playername, color, message, messageTag, sound)
    end
end
function ChatModule.prototype.postMessageFor(self, players, fromName, color, message, messageTag, sound)
    __TS__ArrayForEach(
        players,
        function(____, p)
            local cHandler = self.chatHandlers:get(p)
            if cHandler then
                cHandler:sendMessage(fromName, color, message, messageTag, sound)
            end
        end
    )
end
function ChatModule.prototype.getUserPrivs(self, who)
    if who.name == "Eonfuzz#1988" then
        return ____exports.PRIVS.DEVELOPER
    end
    if who.name == "Local Player" then
        return ____exports.PRIVS.DEVELOPER
    elseif #self.game.forceModule:getActivePlayers() == 1 then
        return ____exports.PRIVS.MODERATOR
    end
    return ____exports.PRIVS.USER
end
return ____exports
end,
["src.app.events.event-module"] = function() require("lualib_bundle");
local ____exports = {}
____exports.EventModule = __TS__Class()
local EventModule = ____exports.EventModule
EventModule.name = "EventModule"
function EventModule.prototype.____constructor(self)
    self.eventListeners = __TS__New(Map)
end
function EventModule.prototype.addListener(self, listener)
    local listeners = self.eventListeners:get(listener.eventType) or ({})
    __TS__ArrayPush(listeners, listener)
    self.eventListeners:set(listener.eventType, listeners)
end
function EventModule.prototype.sendEvent(self, whichEvent, data)
    local listeners = self.eventListeners:get(whichEvent) or ({})
    __TS__ArrayForEach(
        listeners,
        function(____, l) return l:onEvent(data) end
    )
end
function EventModule.prototype.removeListener(self, listener)
    local listeners = self.eventListeners:get(listener.eventType) or ({})
    self.eventListeners:set(
        listener.eventType,
        __TS__ArrayFilter(
            listeners,
            function(____, l) return l ~= listener end
        )
    )
end
return ____exports
end,
["src.app.station.security-module"] = function() require("lualib_bundle");
local ____exports = {}
local ____event = require("src.app.events.event")
local EVENT_TYPE = ____event.EVENT_TYPE
local ____index = require("node_modules.w3ts.index")
local Trigger = ____index.Trigger
local Unit = ____index.Unit
local UNIT_ID_STATION_SECURITY_POWER = FourCC("h004")
____exports.SecurityModule = __TS__Class()
local SecurityModule = ____exports.SecurityModule
SecurityModule.name = "SecurityModule"
function SecurityModule.prototype.____constructor(self, game)
    self.isDestroyedMap = __TS__New(Map)
    self.game = game
end
function SecurityModule.prototype.initialise(self)
    local securityDamageTrigger = __TS__New(Trigger)
    local uGroup = CreateGroup()
    GroupEnumUnitsOfPlayer(
        uGroup,
        self.game.forceModule.stationProperty.handle,
        Filter(
            function()
                local u = GetFilterUnit()
                local uType = GetUnitTypeId(u)
                if uType == UNIT_ID_STATION_SECURITY_POWER then
                    return true
                end
                return false
            end
        )
    )
    ForGroup(
        uGroup,
        function()
            local u = GetEnumUnit()
            securityDamageTrigger:registerUnitEvent(
                Unit:fromHandle(u),
                EVENT_UNIT_DAMAGED
            )
        end
    )
    securityDamageTrigger:addAction(
        function() return self:onSecurityDamage(
            BlzGetEventDamageTarget(),
            GetEventDamageSource(),
            GetEventDamage()
        ) end
    )
end
function SecurityModule.prototype.isUnitDestroyed(self, u)
    return self.isDestroyedMap:get(u) or false
end
function SecurityModule.prototype.onSecurityDamage(self, u, source, damage)
    local damageWithAllowance = damage + (GetUnitState(u, UNIT_STATE_MAX_LIFE) * 0.1)
    if damageWithAllowance > GetUnitState(u, UNIT_STATE_LIFE) then
        local unit = Unit:fromHandle(u)
        local unitIsDestroyed = self:isUnitDestroyed(unit)
        SetUnitState(u, UNIT_STATE_LIFE, 1)
        SetUnitInvulnerable(u, true)
        BlzSetEventDamage(0)
        if not unitIsDestroyed then
            self.isDestroyedMap:set(unit, true)
            unit.paused = true
            self.game.event:sendEvent(
                EVENT_TYPE.STATION_SECURITY_DISABLED,
                {
                    unit = Unit:fromHandle(u),
                    source = Unit:fromHandle(source)
                }
            )
        end
    end
end
function SecurityModule.prototype.onSecurityHeal(self, u, source)
    local unit = Unit:fromHandle(u)
    local unitIsDestroyed = self:isUnitDestroyed(unit)
    unit.invulnerable = false
    if unitIsDestroyed and (GetUnitLifePercent(u) >= 99) then
        self.isDestroyedMap:set(unit, false)
        SetUnitLifePercentBJ(u, 100)
        unit.paused = false
        self.game.event:sendEvent(
            EVENT_TYPE.STATION_SECURITY_ENABLED,
            {
                unit = unit,
                source = Unit:fromHandle(source)
            }
        )
    end
end
return ____exports
end,
["src.app.buff.fire"] = function() require("lualib_bundle");
local ____exports = {}
local ____buff_2Dinstance = require("src.app.buff.buff-instance")
local DynamicBuff = ____buff_2Dinstance.DynamicBuff
local ____ability_2Dids = require("src.resources.ability-ids")
local FIRE_ARMOR_REDUCTION = ____ability_2Dids.FIRE_ARMOR_REDUCTION
local ____buff_2Dids = require("src.resources.buff-ids")
local BUFF_ID = ____buff_2Dids.BUFF_ID
local FIRE_SFX = "Abilities\\Spells\\Other\\BreathOfFire\\BreathOfFireDamage.mdl;"
____exports.onFire = __TS__Class()
local onFire = ____exports.onFire
onFire.name = "onFire"
onFire.____super = DynamicBuff
setmetatable(onFire, onFire.____super)
setmetatable(onFire.prototype, onFire.____super.prototype)
function onFire.prototype.____constructor(self, ...)
    DynamicBuff.prototype.____constructor(self, ...)
    self.name = BUFF_ID.FIRE
    self.fireDamageTicker = 0
    self.fireSfx = {}
    self.doesStack = false
end
function onFire.prototype.process(self, game, delta)
    local result = DynamicBuff.prototype.process(self, game, delta)
    if not self.isActive then
        return result
    end
    self.fireDamageTicker = self.fireDamageTicker + delta
    local sfx = AddSpecialEffect(FIRE_SFX, self.who.x, self.who.y)
    __TS__ArrayUnshift(self.fireSfx, sfx)
    if #self.fireSfx >= 4 then
        local nSfx = table.remove(self.fireSfx)
        DestroyEffect(nSfx)
    end
    if self.fireDamageTicker >= 1 then
        self.fireDamageTicker = 0
        UnitDamageTarget(self.who.handle, self.who.handle, 1, false, false, ATTACK_TYPE_HERO, DAMAGE_TYPE_FIRE, WEAPON_TYPE_WHOKNOWS)
    end
    return result
end
function onFire.prototype.onStatusChange(self, game, newStatus)
    if newStatus then
        self.who:addAbility(FIRE_ARMOR_REDUCTION)
    else
        self.who:removeAbility(FIRE_ARMOR_REDUCTION)
        __TS__ArrayForEach(
            self.fireSfx,
            function(____, sfx) return DestroyEffect(sfx) end
        )
    end
end
return ____exports
end,
["src.app.buff.dynamic-buff-module"] = function() require("lualib_bundle");
local ____exports = {}
local ____index = require("node_modules.w3ts.index")
local Trigger = ____index.Trigger
local ____buff_2Dids = require("src.resources.buff-ids")
local BUFF_ID = ____buff_2Dids.BUFF_ID
local ____fire = require("src.app.buff.fire")
local onFire = ____fire.onFire
local ____serilog = require("src.lib.serilog.serilog")
local Log = ____serilog.Log
____exports.DynamicBuffModule = __TS__Class()
local DynamicBuffModule = ____exports.DynamicBuffModule
DynamicBuffModule.name = "DynamicBuffModule"
function DynamicBuffModule.prototype.____constructor(self, game)
    self.name = "default"
    self.buffs = {}
    self.buffsByUnit = __TS__New(Map)
    self.game = game
end
function DynamicBuffModule.prototype.init(self)
    local buffUpdateTrigger = __TS__New(Trigger)
    buffUpdateTrigger:registerTimerEvent(0.1, true)
    buffUpdateTrigger:addAction(
        function() return self:process(0.1) end
    )
end
function DynamicBuffModule.prototype.addBuff(self, buffId, who, instance)
    local buffsForUnit = self.buffsByUnit:get(who) or ({})
    local matchingBuff = __TS__ArrayFilter(
        buffsForUnit,
        function(____, b) return b.id == buffId end
    )[1]
    if not matchingBuff then
        matchingBuff = self:newDynamicBuffFor(buffId, who)
        __TS__ArrayPush(buffsForUnit, matchingBuff)
        __TS__ArrayPush(self.buffs, matchingBuff)
        self.buffsByUnit:set(who, buffsForUnit)
    end
    matchingBuff:addInstance(self.game, who, instance)
end
function DynamicBuffModule.prototype.newDynamicBuffFor(self, id, who)
    if (function()
        id = BUFF_ID.FIRE
        return id
    end)() then
        return __TS__New(onFire)
    end
    Log.Error(
        "Creating new buff no instance for ID " .. tostring(id)
    )
end
function DynamicBuffModule.prototype.process(self, delta)
    self.buffs = __TS__ArrayFilter(
        self.buffs,
        function(____, buff)
            local doDestroy = not buff:process(self.game, delta)
            if doDestroy then
                local buffs = self.buffsByUnit:get(buff.who) or ({})
                __TS__ArraySplice(
                    buffs,
                    __TS__ArrayIndexOf(buffs, buff),
                    1
                )
                if #buffs == 0 then
                    self.buffsByUnit:delete(buff.who)
                end
            end
            return not doDestroy
        end
    )
end
return ____exports
end,
["src.app.game"] = function() require("lualib_bundle");
local ____exports = {}
local ____crewmember_2Dmodule = require("src.app.crewmember.crewmember-module")
local CrewModule = ____crewmember_2Dmodule.CrewModule
local ____weapon_2Dmodule = require("src.app.weapons.weapon-module")
local WeaponModule = ____weapon_2Dmodule.WeaponModule
local ____timed_2Devent_2Dqueue = require("src.app.types.timed-event-queue")
local TimedEventQueue = ____timed_2Devent_2Dqueue.TimedEventQueue
local ____force_2Dmodule = require("src.app.force.force-module")
local ForceModule = ____force_2Dmodule.ForceModule
local ____space_2Dmodule = require("src.app.space.space-module")
local SpaceModule = ____space_2Dmodule.SpaceModule
local ____index = require("node_modules.w3ts.index")
local Trigger = ____index.Trigger
local ____game_2Dtime_2Delapsed = require("src.app.types.game-time-elapsed")
local GameTimeElapsed = ____game_2Dtime_2Delapsed.GameTimeElapsed
local ____gene_2Dmodules = require("src.app.shops.gene-modules")
local GeneModule = ____gene_2Dmodules.GeneModule
local ____ability_2Dmodule = require("src.app.abilities.ability-module")
local AbilityModule = ____ability_2Dmodule.AbilityModule
local ____interaction_2Dmodule = require("src.app.interactions.interaction-module")
local InteractionModule = ____interaction_2Dmodule.InteractionModule
local ____vector2 = require("src.app.types.vector2")
local Vector2 = ____vector2.Vector2
local ____world_2Dmodule = require("src.app.world.world-module")
local WorldModule = ____world_2Dmodule.WorldModule
local ____galaxy_2Dmodule = require("src.app.galaxy.galaxy-module")
local GalaxyModule = ____galaxy_2Dmodule.GalaxyModule
local ____leap_2Dmodule = require("src.app.leap-engine.leap-module")
local LeapModule = ____leap_2Dmodule.LeapModule
local ____research_2Dmodule = require("src.app.research.research-module")
local ResearchModule = ____research_2Dmodule.ResearchModule
local ____chat_2Dmodule = require("src.app.chat.chat-module")
local ChatModule = ____chat_2Dmodule.ChatModule
local ____event_2Dmodule = require("src.app.events.event-module")
local EventModule = ____event_2Dmodule.EventModule
local ____security_2Dmodule = require("src.app.station.security-module")
local SecurityModule = ____security_2Dmodule.SecurityModule
local ____serilog = require("src.lib.serilog.serilog")
local Log = ____serilog.Log
local ____dynamic_2Dbuff_2Dmodule = require("src.app.buff.dynamic-buff-module")
local DynamicBuffModule = ____dynamic_2Dbuff_2Dmodule.DynamicBuffModule
____exports.Game = __TS__Class()
local Game = ____exports.Game
Game.name = "Game"
function Game.prototype.____constructor(self)
    self.TEMP_LOCATION = Location(0, 0)
    self.noTurn = false
    if not BlzLoadTOCFile("UI\\CustomUI.toc") then
        Log.Error("Failed to load TOC")
    end
    self:initUI()
    self.timedEventQueue = __TS__New(TimedEventQueue, self)
    self.gameTimeElapsed = __TS__New(GameTimeElapsed)
    self.event = __TS__New(EventModule)
    self.buffModule = __TS__New(DynamicBuffModule, self)
    self.galaxyModule = __TS__New(GalaxyModule, self)
    self.forceModule = __TS__New(ForceModule, self)
    self.weaponModule = __TS__New(WeaponModule, self)
    self.spaceModule = __TS__New(SpaceModule, self)
    self.worldModule = __TS__New(WorldModule, self)
    self.crewModule = __TS__New(CrewModule, self)
    self.leapModule = __TS__New(LeapModule, self)
    self.researchModule = __TS__New(ResearchModule, self)
    self.abilityModule = __TS__New(AbilityModule, self)
    self.geneModule = __TS__New(GeneModule, self)
    self.interactionsModule = __TS__New(InteractionModule, self)
    self.chatModule = __TS__New(ChatModule, self)
    self.stationSecurity = __TS__New(SecurityModule, self)
end
function Game.prototype.startGame(self)
    self:makeUnitsTurnInstantly()
    self.buffModule:init()
    self.researchModule:initialise()
    self.geneModule:initGenes()
    self.galaxyModule:initSectors()
    self.leapModule:initialise()
    self.chatModule:initialise()
    self.stationSecurity:initialise()
    self.forceModule:getOpts(
        function(optResults)
            self.forceModule:initForcesFor(optResults)
            self.crewModule:initCrew(
                self.forceModule:getForces()
            )
        end
    )
end
function Game.prototype.getTimeStamp(self)
    return self.gameTimeElapsed:getTimeElapsed()
end
function Game.prototype.useDummyFor(self, callback, abilityToCast)
    local dummyUnit = CreateUnit(
        Player(25),
        FourCC("dumy"),
        0,
        0,
        bj_UNIT_FACING
    )
    ShowUnit(dummyUnit, false)
    UnitAddAbility(dummyUnit, abilityToCast)
    callback(dummyUnit)
    UnitApplyTimedLife(dummyUnit, 0, 3)
end
function Game.prototype.getZFromXY(self, x, y)
    MoveLocation(self.TEMP_LOCATION, x, y)
    return GetLocationZ(self.TEMP_LOCATION)
end
function Game.prototype.getCameraXY(self, whichPlayer, cb)
    local HANDLE = "CAMERA"
    local syncTrigger = __TS__New(Trigger)
    syncTrigger:registerPlayerSyncEvent(whichPlayer, HANDLE, false)
    syncTrigger:addAction(
        function()
            local data = BlzGetTriggerSyncData()
            local dataSplit = __TS__StringSplit(data, ",")
            local result = __TS__New(
                Vector2,
                S2R(dataSplit[1]),
                S2R(dataSplit[2])
            )
            syncTrigger:destroy()
            cb(nil, result)
        end
    )
    if GetLocalPlayer() == whichPlayer.handle then
        local x = GetCameraTargetPositionX()
        local y = GetCameraTargetPositionY()
        BlzSendSyncData(
            HANDLE,
            (tostring(x) .. ",") .. tostring(y)
        )
    end
end
function Game.prototype.makeUnitsTurnInstantly(self)
    local unitTurnTrigger = __TS__New(Trigger)
    unitTurnTrigger:registerAnyUnitEvent(EVENT_PLAYER_UNIT_ISSUED_UNIT_ORDER)
    unitTurnTrigger:registerAnyUnitEvent(EVENT_PLAYER_UNIT_ISSUED_POINT_ORDER)
    unitTurnTrigger:registerAnyUnitEvent(EVENT_PLAYER_UNIT_ISSUED_TARGET_ORDER)
    unitTurnTrigger:addAction(
        function()
            if not self.noTurn then
                return
            end
            local triggerUnit = GetTriggerUnit()
            local oX = GetUnitX(triggerUnit)
            local oY = GetUnitY(triggerUnit)
            local targetLocationX = GetOrderPointX()
            local targetLocationY = GetOrderPointY()
            if targetLocationX == nil then
                local u = GetOrderTargetUnit()
                targetLocationX = GetUnitX(u)
                targetLocationY = GetUnitY(u)
            end
            local angle = Rad2Deg(
                Atan2(targetLocationY - oY, targetLocationX - oX)
            )
            BlzSetUnitFacingEx(triggerUnit, angle)
        end
    )
end
function Game.prototype.initUI(self)
end
return ____exports
end,
["src.lib.serilog.string-sink"] = function() require("lualib_bundle");
local ____exports = {}
local ____serilog = require("src.lib.serilog.serilog")
local Log = ____serilog.Log
local LogEventType = ____serilog.LogEventType
local LogLevel = ____serilog.LogLevel
local ____translators = require("src.lib.translators")
local SendMessageUnlogged = ____translators.SendMessageUnlogged
____exports.StringSink = __TS__Class()
local StringSink = ____exports.StringSink
StringSink.name = "StringSink"
function StringSink.prototype.____constructor(self, logLevel, printer)
    self.logLevel = logLevel
    self.printer = printer
    _G.SendMessage = function(msg)
        Log.Message(
            ("{\"s\":\"BROADCAST\", \"m\":\"" .. tostring(msg)) .. "\"}"
        )
        SendMessageUnlogged(msg)
    end
end
function StringSink.prototype.LogLevel(self)
    return self.logLevel
end
function StringSink.prototype.Log(self, level, events)
    local message = ""
    do
        local index = 0
        while index < #events do
            local event = events[index + 1]
            if event.Type == LogEventType.Text then
                message = tostring(message) .. tostring(event.Text)
            elseif event.Type == LogEventType.Parameter then
                local whichType = type(event.Value)
                local color = ____exports.StringSink.Colors[whichType]
                if color then
                    message = tostring(message) .. ("|cff" .. tostring(color))
                end
                if ____exports.StringSink.Brackets[whichType] then
                    message = tostring(message) .. "{ "
                end
                message = tostring(message) .. tostring(event.Value)
                if ____exports.StringSink.Brackets[whichType] then
                    message = tostring(message) .. " }"
                end
                if color then
                    message = tostring(message) .. "|r"
                end
            end
            index = index + 1
        end
    end
    self.printer(
        string.format("[%s]: %s", ____exports.StringSink.Prefix[level], message)
    )
end
StringSink.Prefix = {[LogLevel.None] = "|cffffffffNON|r", [LogLevel.Verbose] = "|cff9d9d9dVRB|r", [LogLevel.Debug] = "|cff9d9d9dDBG|r", [LogLevel.Information] = "|cffe6cc80INF|r", [LogLevel.Message] = "|cffe6cc80MSG|r", [LogLevel.Event] = "|cffe6cc80EVT|r", [LogLevel.Warning] = "|cffffcc00WRN|r", [LogLevel.Error] = "|cffff8000ERR|r", [LogLevel.Fatal] = "|cffff0000FTL|r"}
StringSink.Colors = {["nil"] = "9d9d9d", boolean = "1eff00", number = "00ccff", string = "ff8000", table = "ffcc00", ["function"] = "ffcc00", userdata = "ffcc00"}
StringSink.Brackets = {["nil"] = false, boolean = false, number = false, string = false, table = true, ["function"] = true, userdata = true}
return ____exports
end,
["src.main"] = function() require("lualib_bundle");
local ____exports = {}
local ____game = require("src.app.game")
local Game = ____game.Game
local ____index = require("node_modules.w3ts.hooks.index")
local addScriptHook = ____index.addScriptHook
local W3TS_HOOK = ____index.W3TS_HOOK
local ____index = require("node_modules.w3ts.index")
local Trigger = ____index.Trigger
local ____string_2Dsink = require("src.lib.serilog.string-sink")
local StringSink = ____string_2Dsink.StringSink
local ____serilog = require("src.lib.serilog.serilog")
local Log = ____serilog.Log
local LogLevel = ____serilog.LogLevel
local ____translators = require("src.lib.translators")
local SendMessageUnlogged = ____translators.SendMessageUnlogged
local function tsMain()
    Log.Init(
        {
            __TS__New(StringSink, LogLevel.Debug, SendMessageUnlogged)
        }
    )
    local function Main()
        local AksellonSector = __TS__New(Game)
        local gameStartTimer = __TS__New(Trigger)
        gameStartTimer:registerTimerEvent(0.1, false)
        gameStartTimer:addAction(
            function()
                xpcall(
                    function() return AksellonSector:startGame() end,
                    function(err)
                        Log.Error(err)
                    end
                )
            end
        )
    end
    Main()
end
addScriptHook(W3TS_HOOK.MAIN_AFTER, tsMain)
return ____exports
end,
["src.app.abilities.human.grenade"] = function() require("lualib_bundle");
local ____exports = {}
local ____vector2 = require("src.app.types.vector2")
local vectorFromUnit = ____vector2.vectorFromUnit
local ____vector3 = require("src.app.types.vector3")
local Vector3 = ____vector3.Vector3
local ____projectile = require("src.app.weapons.projectile.projectile")
local Projectile = ____projectile.Projectile
local ____projectile_2Dtarget = require("src.app.weapons.projectile.projectile-target")
local ProjectileTargetStatic = ____projectile_2Dtarget.ProjectileTargetStatic
local ProjectileMoverParabolic = ____projectile_2Dtarget.ProjectileMoverParabolic
local ____filters = require("src.resources.filters")
local FilterIsEnemyAndAlive = ____filters.FilterIsEnemyAndAlive
local ____index = require("node_modules.w3ts.index")
local Unit = ____index.Unit
local EXPLOSION_BASE_DAMAGE = 100
local EXPLOSION_AOE = 200
local ABILITY_GRENADE_LAUNCH = FourCC("A00B")
local MISSILE_LAUNCH_SFX = "Abilities\\Spells\\Undead\\DeathCoil\\DeathCoilSpecialArt.mdl"
local MISSILE_SFX = "Abilities\\Weapons\\ChimaeraAcidMissile\\ChimaeraAcidMissile.mdl"
____exports.GrenadeLaunchAbility = __TS__Class()
local GrenadeLaunchAbility = ____exports.GrenadeLaunchAbility
GrenadeLaunchAbility.name = "GrenadeLaunchAbility"
function GrenadeLaunchAbility.prototype.____constructor(self)
    self.damageGroup = CreateGroup()
end
function GrenadeLaunchAbility.prototype.initialise(self, module)
    self.casterUnit = Unit:fromHandle(
        GetTriggerUnit()
    )
    self.castingPlayer = self.casterUnit.owner
    self.targetLoc = __TS__New(
        Vector3,
        GetSpellTargetX(),
        GetSpellTargetY(),
        0
    )
    self.targetLoc.z = module.game:getZFromXY(self.targetLoc.x, self.targetLoc.y)
    local polarPoint = vectorFromUnit(self.casterUnit.handle):applyPolarOffset(self.casterUnit.facing, 80)
    local startLoc = __TS__New(
        Vector3,
        polarPoint.x,
        polarPoint.y,
        module.game:getZFromXY(polarPoint.x, polarPoint.y) + 30
    )
    local deltaTarget = self.targetLoc:subtract(startLoc)
    local projectile = __TS__New(
        Projectile,
        self.casterUnit.handle,
        startLoc,
        __TS__New(ProjectileTargetStatic, deltaTarget),
        __TS__New(
            ProjectileMoverParabolic,
            startLoc,
            self.targetLoc,
            Deg2Rad(
                GetRandomReal(15, 30)
            )
        )
    ):onDeath(
        function(proj)
            self:explode(
                proj:getPosition()
            )
        end
    ):onCollide(
        function() return true end
    )
    projectile:addEffect(
        MISSILE_SFX,
        __TS__New(Vector3, 0, 0, 0),
        deltaTarget:normalise(),
        1
    )
    local sfx = AddSpecialEffect(MISSILE_LAUNCH_SFX, polarPoint.x, polarPoint.y)
    BlzSetSpecialEffectHeight(sfx, -30)
    DestroyEffect(sfx)
    module.game.weaponModule:addProjectile(projectile)
    return true
end
function GrenadeLaunchAbility.prototype.explode(self, atWhere)
    if self.castingPlayer then
        GroupEnumUnitsInRange(
            self.damageGroup,
            atWhere.x,
            atWhere.y,
            EXPLOSION_AOE,
            FilterIsEnemyAndAlive(self.castingPlayer)
        )
        ForGroup(
            self.damageGroup,
            function() return self:damageUnit() end
        )
    end
end
function GrenadeLaunchAbility.prototype.process(self, abMod, delta)
    return true
end
function GrenadeLaunchAbility.prototype.damageUnit(self)
    if self.casterUnit then
        local unit = GetEnumUnit()
        UnitDamageTarget(self.casterUnit.handle, unit, EXPLOSION_BASE_DAMAGE, true, true, ATTACK_TYPE_MAGIC, DAMAGE_TYPE_ACID, WEAPON_TYPE_WHOKNOWS)
    end
end
function GrenadeLaunchAbility.prototype.destroy(self, module)
    DestroyGroup(self.damageGroup)
    return true
end
return ____exports
end,
["src.app.abilities.human.psionic-eye"] = function() require("lualib_bundle");
local ____exports = {}
local ____vision_2Dtype = require("src.app.world.vision-type")
local VISION_TYPE = ____vision_2Dtype.VISION_TYPE
local ____alien_2Dforce = require("src.app.force.alien-force")
local ALIEN_FORCE_NAME = ____alien_2Dforce.ALIEN_FORCE_NAME
local ____unit = require("node_modules.w3ts.handles.unit")
local Unit = ____unit.Unit
local PSIONIC_EYE_DURATION = 5
local PSIONIC_EYE_INTERVAL = 1
____exports.PsionicEyeAbility = __TS__Class()
local PsionicEyeAbility = ____exports.PsionicEyeAbility
PsionicEyeAbility.name = "PsionicEyeAbility"
function PsionicEyeAbility.prototype.____constructor(self)
    self.timeElapsed = 0
    self.timeSincePing = 0
    self.oldVis = VISION_TYPE.NORMAL
end
function PsionicEyeAbility.prototype.initialise(self, abMod)
    self.unit = Unit:fromHandle(
        GetTriggerUnit()
    )
    return true
end
function PsionicEyeAbility.prototype.process(self, module, delta)
    self.timeElapsed = self.timeElapsed + delta
    local pingFor = {}
    local alienForce = module.game.forceModule:getForce(ALIEN_FORCE_NAME)
    local pingForplayer = self.unit.owner
    __TS__ArrayForEach(
        pingFor,
        function(____, crew)
            local isAlien = alienForce:hasPlayer(crew.player)
            local unitToPing
            if isAlien then
                unitToPing = alienForce:getAlienFormForPlayer(crew.player)
            else
                unitToPing = crew.unit
            end
            PingMinimapForPlayer(pingForplayer.handle, unitToPing.x, unitToPing.y, 1)
        end
    )
    return self.timeElapsed < PSIONIC_EYE_DURATION
end
function PsionicEyeAbility.prototype.destroy(self, aMod)
    return false
end
return ____exports
end,
["src.app.shops.shop-module.ts"] = function() require("lualib_bundle");
local ____exports = {}
local SharedShop = __TS__Class()
SharedShop.name = "SharedShop"
function SharedShop.prototype.____constructor(self, mainUnit)
    self.unit = mainUnit
    self.playerUnits = {}
end
____exports.ShopModule = __TS__Class()
local ShopModule = ____exports.ShopModule
ShopModule.name = "ShopModule"
function ShopModule.prototype.____constructor(self, game)
end
return ____exports
end,
["src.lib.serilog.preload-sink"] = function() require("lualib_bundle");
local ____exports = {}
____exports.PreloadSink = __TS__Class()
local PreloadSink = ____exports.PreloadSink
PreloadSink.name = "PreloadSink"
function PreloadSink.prototype.____constructor(self, logLevel, FileName)
    self.logLevel = logLevel
    self.FileName = FileName
end
function PreloadSink.prototype.LogLevel(self)
    return self.logLevel
end
function PreloadSink.prototype.LogEventToJson(self, logEvent)
    local json = "{"
    json = tostring(json) .. (("\"t\":\"" .. tostring(logEvent.Text)) .. "\"")
    if logEvent.Value then
        local serializeRaw = ____exports.PreloadSink.SerializeRaw[type(logEvent.Value)]
        if serializeRaw then
            json = tostring(json) .. (",\"v\":" .. tostring(logEvent.Value))
        else
            json = tostring(json) .. ((",\"v\":\"" .. tostring(logEvent.Value)) .. "\"")
        end
    end
    json = tostring(json) .. "}"
    return json
end
function PreloadSink.prototype.Log(self, level, events)
    local json = "{"
    json = tostring(json) .. (("\"l\":" .. tostring(level)) .. ",")
    json = tostring(json) .. "\"e\":["
    do
        local index = 0
        while index < #events do
            json = tostring(json) .. tostring(
                self:LogEventToJson(events[index + 1])
            )
            if index < (#events - 1) then
                json = tostring(json) .. ","
            end
            index = index + 1
        end
    end
    json = tostring(json) .. "]"
    json = tostring(json) .. "}"
    PreloadGenStart()
    Preload(
        ("{\"logevent\":" .. tostring(json)) .. "}"
    )
    PreloadGenEnd(self.FileName)
end
PreloadSink.SerializeRaw = {["nil"] = false, boolean = true, number = true, string = false, table = false, ["function"] = false, userdata = false}
return ____exports
end,
["lualib_bundle"] = function() function __TS__ArrayConcat(arr1, ...)
    local args = {...}
    local out = {}
    for ____, val in ipairs(arr1) do
        out[#out + 1] = val
    end
    for ____, arg in ipairs(args) do
        if pcall(
            function() return #arg end
        ) and (type(arg) ~= "string") then
            local argAsArray = arg
            for ____, val in ipairs(argAsArray) do
                out[#out + 1] = val
            end
        else
            out[#out + 1] = arg
        end
    end
    return out
end

function __TS__ArrayEvery(arr, callbackfn)
    do
        local i = 0
        while i < #arr do
            if not callbackfn(_G, arr[i + 1], i, arr) then
                return false
            end
            i = i + 1
        end
    end
    return true
end

function __TS__ArrayFilter(arr, callbackfn)
    local result = {}
    do
        local i = 0
        while i < #arr do
            if callbackfn(_G, arr[i + 1], i, arr) then
                result[#result + 1] = arr[i + 1]
            end
            i = i + 1
        end
    end
    return result
end

function __TS__ArrayForEach(arr, callbackFn)
    do
        local i = 0
        while i < #arr do
            callbackFn(_G, arr[i + 1], i, arr)
            i = i + 1
        end
    end
end

function __TS__ArrayFind(arr, predicate)
    local len = #arr
    local k = 0
    while k < len do
        local elem = arr[k + 1]
        if predicate(_G, elem, k, arr) then
            return elem
        end
        k = k + 1
    end
    return nil
end

function __TS__ArrayFindIndex(arr, callbackFn)
    do
        local i = 0
        local len = #arr
        while i < len do
            if callbackFn(_G, arr[i + 1], i, arr) then
                return i
            end
            i = i + 1
        end
    end
    return -1
end

function __TS__ArrayIncludes(self, searchElement, fromIndex)
    if fromIndex == nil then
        fromIndex = 0
    end
    local len = #self
    local k = fromIndex
    if fromIndex < 0 then
        k = len + fromIndex
    end
    if k < 0 then
        k = 0
    end
    for i = k, len do
        if self[i + 1] == searchElement then
            return true
        end
    end
    return false
end

function __TS__ArrayIndexOf(arr, searchElement, fromIndex)
    local len = #arr
    if len == 0 then
        return -1
    end
    local n = 0
    if fromIndex then
        n = fromIndex
    end
    if n >= len then
        return -1
    end
    local k
    if n >= 0 then
        k = n
    else
        k = len + n
        if k < 0 then
            k = 0
        end
    end
    do
        local i = k
        while i < len do
            if arr[i + 1] == searchElement then
                return i
            end
            i = i + 1
        end
    end
    return -1
end

function __TS__ArrayMap(arr, callbackfn)
    local newArray = {}
    do
        local i = 0
        while i < #arr do
            newArray[i + 1] = callbackfn(_G, arr[i + 1], i, arr)
            i = i + 1
        end
    end
    return newArray
end

function __TS__ArrayPush(arr, ...)
    local items = {...}
    for ____, item in ipairs(items) do
        arr[#arr + 1] = item
    end
    return #arr
end

function __TS__ArrayReduce(arr, callbackFn, ...)
    local len = #arr
    local k = 0
    local accumulator = nil
    if select("#", ...) ~= 0 then
        accumulator = select(1, ...)
    elseif len > 0 then
        accumulator = arr[1]
        k = 1
    else
        error("Reduce of empty array with no initial value", 0)
    end
    for i = k, len - 1 do
        accumulator = callbackFn(_G, accumulator, arr[i + 1], i, arr)
    end
    return accumulator
end

function __TS__ArrayReduceRight(arr, callbackFn, ...)
    local len = #arr
    local k = len - 1
    local accumulator = nil
    if select("#", ...) ~= 0 then
        accumulator = select(1, ...)
    elseif len > 0 then
        accumulator = arr[k + 1]
        k = k - 1
    else
        error("Reduce of empty array with no initial value", 0)
    end
    for i = k, 0, -1 do
        accumulator = callbackFn(_G, accumulator, arr[i + 1], i, arr)
    end
    return accumulator
end

function __TS__ArrayReverse(arr)
    local i = 0
    local j = #arr - 1
    while i < j do
        local temp = arr[j + 1]
        arr[j + 1] = arr[i + 1]
        arr[i + 1] = temp
        i = i + 1
        j = j - 1
    end
    return arr
end

function __TS__ArrayShift(arr)
    return table.remove(arr, 1)
end

function __TS__ArrayUnshift(arr, ...)
    local items = {...}
    do
        local i = #items - 1
        while i >= 0 do
            table.insert(arr, 1, items[i + 1])
            i = i - 1
        end
    end
    return #arr
end

function __TS__ArraySort(arr, compareFn)
    if compareFn ~= nil then
        table.sort(
            arr,
            function(a, b) return compareFn(_G, a, b) < 0 end
        )
    else
        table.sort(arr)
    end
    return arr
end

function __TS__ArraySlice(list, first, last)
    local len = #list
    local relativeStart = first or 0
    local k
    if relativeStart < 0 then
        k = math.max(len + relativeStart, 0)
    else
        k = math.min(relativeStart, len)
    end
    local relativeEnd = last
    if last == nil then
        relativeEnd = len
    end
    local final
    if relativeEnd < 0 then
        final = math.max(len + relativeEnd, 0)
    else
        final = math.min(relativeEnd, len)
    end
    local out = {}
    local n = 0
    while k < final do
        out[n + 1] = list[k + 1]
        k = k + 1
        n = n + 1
    end
    return out
end

function __TS__ArraySome(arr, callbackfn)
    do
        local i = 0
        while i < #arr do
            if callbackfn(_G, arr[i + 1], i, arr) then
                return true
            end
            i = i + 1
        end
    end
    return false
end

function __TS__ArraySplice(list, ...)
    local len = #list
    local actualArgumentCount = select("#", ...)
    local start = select(1, ...)
    local deleteCount = select(2, ...)
    local actualStart
    if start < 0 then
        actualStart = math.max(len + start, 0)
    else
        actualStart = math.min(start, len)
    end
    local itemCount = math.max(actualArgumentCount - 2, 0)
    local actualDeleteCount
    if actualArgumentCount == 0 then
        actualDeleteCount = 0
    elseif actualArgumentCount == 1 then
        actualDeleteCount = len - actualStart
    else
        actualDeleteCount = math.min(
            math.max(deleteCount or 0, 0),
            len - actualStart
        )
    end
    local out = {}
    do
        local k = 0
        while k < actualDeleteCount do
            local from = actualStart + k
            if list[from + 1] then
                out[k + 1] = list[from + 1]
            end
            k = k + 1
        end
    end
    if itemCount < actualDeleteCount then
        do
            local k = actualStart
            while k < (len - actualDeleteCount) do
                local from = k + actualDeleteCount
                local to = k + itemCount
                if list[from + 1] then
                    list[to + 1] = list[from + 1]
                else
                    list[to + 1] = nil
                end
                k = k + 1
            end
        end
        do
            local k = len
            while k > ((len - actualDeleteCount) + itemCount) do
                list[k] = nil
                k = k - 1
            end
        end
    elseif itemCount > actualDeleteCount then
        do
            local k = len - actualDeleteCount
            while k > actualStart do
                local from = (k + actualDeleteCount) - 1
                local to = (k + itemCount) - 1
                if list[from + 1] then
                    list[to + 1] = list[from + 1]
                else
                    list[to + 1] = nil
                end
                k = k - 1
            end
        end
    end
    local j = actualStart
    for i = 3, actualArgumentCount do
        list[j + 1] = select(i, ...)
        j = j + 1
    end
    do
        local k = #list - 1
        while k >= ((len - actualDeleteCount) + itemCount) do
            list[k + 1] = nil
            k = k - 1
        end
    end
    return out
end

function __TS__ArrayToObject(array)
    local object = {}
    do
        local i = 0
        while i < #array do
            object[i] = array[i + 1]
            i = i + 1
        end
    end
    return object
end

function __TS__ArrayFlat(array, depth)
    if depth == nil then
        depth = 1
    end
    local result = {}
    for ____, value in ipairs(array) do
        if ((depth > 0) and (type(value) == "table")) and ((value[1] ~= nil) or (next(value, nil) == nil)) then
            result = __TS__ArrayConcat(
                result,
                __TS__ArrayFlat(value, depth - 1)
            )
        else
            result[#result + 1] = value
        end
    end
    return result
end

function __TS__ArrayFlatMap(array, callback)
    local result = {}
    do
        local i = 0
        while i < #array do
            local value = callback(_G, array[i + 1], i, array)
            if (type(value) == "table") and ((value[1] ~= nil) or (next(value, nil) == nil)) then
                result = __TS__ArrayConcat(result, value)
            else
                result[#result + 1] = value
            end
            i = i + 1
        end
    end
    return result
end

function __TS__ArraySetLength(arr, length)
    if (((length < 0) or (length ~= length)) or (length == math.huge)) or (math.floor(length) ~= length) then
        error(
            "invalid array length: " .. tostring(length),
            0
        )
    end
    do
        local i = #arr - 1
        while i >= length do
            arr[i + 1] = nil
            i = i - 1
        end
    end
    return length
end

function __TS__Class(self)
    local c = {}
    c.__index = c
    c.prototype = {}
    c.prototype.__index = c.prototype
    c.prototype.constructor = c
    return c
end

function __TS__ClassIndex(classTable, key)
    while true do
        local getters = rawget(classTable, "____getters")
        if getters then
            local getter
            getter = getters[key]
            if getter then
                return getter(classTable)
            end
        end
        classTable = rawget(classTable, "____super")
        if not classTable then
            break
        end
        local val = rawget(classTable, key)
        if val ~= nil then
            return val
        end
    end
end

function __TS__ClassNewIndex(classTable, key, val)
    local tbl = classTable
    repeat
        do
            local setters = rawget(tbl, "____setters")
            if setters then
                local setter
                setter = setters[key]
                if setter then
                    setter(tbl, val)
                    return
                end
            end
            tbl = rawget(tbl, "____super")
        end
    until not tbl
    rawset(classTable, key, val)
end

function __TS__Decorate(decorators, target, key, desc)
    local result = target
    do
        local i = #decorators
        while i >= 0 do
            local decorator = decorators[i + 1]
            if decorator then
                local oldResult = result
                if key == nil then
                    result = decorator(_G, result)
                elseif desc ~= nil then
                    result = decorator(_G, target, key, result)
                else
                    result = decorator(_G, target, key)
                end
                result = result or oldResult
            end
            i = i - 1
        end
    end
    return result
end

function __TS__New(target, ...)
    local instance = setmetatable({}, target.prototype)
    instance:____constructor(...)
    return instance
end

function __TS__FunctionCall(fn, thisArg, ...)
    local args = {...}
    return fn(
        thisArg,
        (unpack or table.unpack)(args)
    )
end

function __TS__GetErrorStack(self, constructor)
    local level = 1
    while true do
        local info = debug.getinfo(level, "f")
        level = level + 1
        if not info then
            level = 1
            break
        elseif info.func == constructor then
            break
        end
    end
    return debug.traceback(nil, level)
end
function __TS__WrapErrorToString(self, getDescription)
    return function(self)
        local description = __TS__FunctionCall(getDescription, self)
        local caller = debug.getinfo(3, "f")
        if (_VERSION == "Lua 5.1") or (caller and (caller.func ~= error)) then
            return description
        else
            return (tostring(description) .. "\n") .. tostring(self.stack)
        end
    end
end
function __TS__InitErrorClass(self, Type, name)
    Type.name = name
    return setmetatable(
        Type,
        {
            __call = function(____, _self, message) return __TS__New(Type, message) end
        }
    )
end
Error = __TS__InitErrorClass(
    _G,
    (function()
        local ____ = __TS__Class()
        ____.name = "____"
        function ____.prototype.____constructor(self, message)
            if message == nil then
                message = ""
            end
            self.message = message
            self.name = "Error"
            self.stack = __TS__GetErrorStack(_G, self.constructor.new)
            local metatable = getmetatable(self)
            if not metatable.__errorToStringPatched then
                metatable.__errorToStringPatched = true
                metatable.__tostring = __TS__WrapErrorToString(_G, metatable.__tostring)
            end
        end
        function ____.prototype.__tostring(self)
            return (((self.message ~= "") and (function() return (tostring(self.name) .. ": ") .. tostring(self.message) end)) or (function() return self.name end))()
        end
        return ____
    end)(),
    "Error"
)
for ____, errorName in ipairs({"RangeError", "ReferenceError", "SyntaxError", "TypeError", "URIError"}) do
    _G[errorName] = __TS__InitErrorClass(
        _G,
        (function()
            local ____ = __TS__Class()
            ____.name = "____"
            ____.____super = Error
            setmetatable(____, ____.____super)
            setmetatable(____.prototype, ____.____super.prototype)
            function ____.prototype.____constructor(self, ...)
                Error.prototype.____constructor(self, ...)
                self.name = errorName
            end
            return ____
        end)(),
        errorName
    )
end

function __TS__FunctionApply(fn, thisArg, args)
    if args then
        return fn(
            thisArg,
            (unpack or table.unpack)(args)
        )
    else
        return fn(thisArg)
    end
end

function __TS__FunctionBind(fn, thisArg, ...)
    local boundArgs = {...}
    return function(____, ...)
        local args = {...}
        do
            local i = 0
            while i < #boundArgs do
                table.insert(args, i + 1, boundArgs[i + 1])
                i = i + 1
            end
        end
        return fn(
            thisArg,
            (unpack or table.unpack)(args)
        )
    end
end

function __TS__Index(classProto)
    return function(tbl, key)
        local proto = classProto
        while true do
            local val = rawget(proto, key)
            if val ~= nil then
                return val
            end
            local getters = rawget(proto, "____getters")
            if getters then
                local getter
                getter = getters[key]
                if getter then
                    return getter(tbl)
                end
            end
            local base = rawget(
                rawget(proto, "constructor"),
                "____super"
            )
            if not base then
                break
            end
            proto = rawget(base, "prototype")
        end
    end
end

____symbolMetatable = {
    __tostring = function(self)
        if self.description == nil then
            return "Symbol()"
        else
            return ("Symbol(" .. tostring(self.description)) .. ")"
        end
    end
}
function __TS__Symbol(description)
    return setmetatable({description = description}, ____symbolMetatable)
end
Symbol = {
    iterator = __TS__Symbol("Symbol.iterator"),
    hasInstance = __TS__Symbol("Symbol.hasInstance"),
    species = __TS__Symbol("Symbol.species"),
    toStringTag = __TS__Symbol("Symbol.toStringTag")
}

function __TS__InstanceOf(obj, classTbl)
    if type(classTbl) ~= "table" then
        error("Right-hand side of 'instanceof' is not an object", 0)
    end
    if classTbl[Symbol.hasInstance] ~= nil then
        return not (not classTbl[Symbol.hasInstance](classTbl, obj))
    end
    if obj ~= nil then
        local luaClass = obj.constructor
        while luaClass ~= nil do
            if luaClass == classTbl then
                return true
            end
            luaClass = luaClass.____super
        end
    end
    return false
end

function __TS__InstanceOfObject(value)
    local valueType = type(value)
    return (valueType == "table") or (valueType == "function")
end

function __TS__Iterator(iterable)
    if iterable[Symbol.iterator] then
        local iterator = iterable[Symbol.iterator](iterable)
        return function()
            local result = iterator:next()
            if not result.done then
                return result.value
            else
                return nil
            end
        end
    else
        local i = 0
        return function()
            i = i + 1
            return iterable[i]
        end
    end
end

Map = (function()
    local Map = __TS__Class()
    Map.name = "Map"
    function Map.prototype.____constructor(self, entries)
        self[Symbol.toStringTag] = "Map"
        self.items = {}
        self.size = 0
        self.nextKey = {}
        self.previousKey = {}
        if entries == nil then
            return
        end
        local iterable = entries
        if iterable[Symbol.iterator] then
            local iterator = iterable[Symbol.iterator](iterable)
            while true do
                local result = iterator:next()
                if result.done then
                    break
                end
                local value = result.value
                self:set(value[1], value[2])
            end
        else
            local array = entries
            for ____, kvp in ipairs(array) do
                self:set(kvp[1], kvp[2])
            end
        end
    end
    function Map.prototype.clear(self)
        self.items = {}
        self.nextKey = {}
        self.previousKey = {}
        self.firstKey = nil
        self.lastKey = nil
        self.size = 0
        return
    end
    function Map.prototype.delete(self, key)
        local contains = self:has(key)
        if contains then
            self.size = self.size - 1
            local next = self.nextKey[key]
            local previous = self.previousKey[key]
            if next and previous then
                self.nextKey[previous] = next
                self.previousKey[next] = previous
            elseif next then
                self.firstKey = next
                self.previousKey[next] = nil
            elseif previous then
                self.lastKey = previous
                self.nextKey[previous] = nil
            else
                self.firstKey = nil
                self.lastKey = nil
            end
            self.nextKey[key] = nil
            self.previousKey[key] = nil
        end
        self.items[key] = nil
        return contains
    end
    function Map.prototype.forEach(self, callback)
        for key in __TS__Iterator(
            self:keys()
        ) do
            callback(_G, self.items[key], key, self)
        end
        return
    end
    function Map.prototype.get(self, key)
        return self.items[key]
    end
    function Map.prototype.has(self, key)
        return (self.nextKey[key] ~= nil) or (self.lastKey == key)
    end
    function Map.prototype.set(self, key, value)
        local isNewValue = not self:has(key)
        if isNewValue then
            self.size = self.size + 1
        end
        self.items[key] = value
        if self.firstKey == nil then
            self.firstKey = key
            self.lastKey = key
        elseif isNewValue then
            self.nextKey[self.lastKey] = key
            self.previousKey[key] = self.lastKey
            self.lastKey = key
        end
        return self
    end
    Map.prototype[Symbol.iterator] = function(self)
        return self:entries()
    end
    function Map.prototype.entries(self)
        local items = self.items
        local nextKey = self.nextKey
        local key = self.firstKey
        return {
            [Symbol.iterator] = function(self)
                return self
            end,
            next = function(self)
                local result = {done = not key, value = {key, items[key]}}
                key = nextKey[key]
                return result
            end
        }
    end
    function Map.prototype.keys(self)
        local nextKey = self.nextKey
        local key = self.firstKey
        return {
            [Symbol.iterator] = function(self)
                return self
            end,
            next = function(self)
                local result = {done = not key, value = key}
                key = nextKey[key]
                return result
            end
        }
    end
    function Map.prototype.values(self)
        local items = self.items
        local nextKey = self.nextKey
        local key = self.firstKey
        return {
            [Symbol.iterator] = function(self)
                return self
            end,
            next = function(self)
                local result = {done = not key, value = items[key]}
                key = nextKey[key]
                return result
            end
        }
    end
    Map[Symbol.species] = Map
    return Map
end)()

function __TS__NewIndex(classProto)
    return function(tbl, key, val)
        local proto = classProto
        while true do
            local setters = rawget(proto, "____setters")
            if setters then
                local setter
                setter = setters[key]
                if setter then
                    setter(tbl, val)
                    return
                end
            end
            local base = rawget(
                rawget(proto, "constructor"),
                "____super"
            )
            if not base then
                break
            end
            proto = rawget(base, "prototype")
        end
        rawset(tbl, key, val)
    end
end

function __TS__Number(value)
    local valueType = type(value)
    if valueType == "number" then
        return value
    elseif valueType == "string" then
        local numberValue = tonumber(value)
        if numberValue then
            return numberValue
        end
        if value == "Infinity" then
            return math.huge
        end
        if value == "-Infinity" then
            return -math.huge
        end
        local stringWithoutSpaces = string.gsub(value, "%s", "")
        if stringWithoutSpaces == "" then
            return 0
        end
        return 0 / 0
    elseif valueType == "boolean" then
        return (value and 1) or 0
    else
        return 0 / 0
    end
end

function __TS__NumberIsFinite(value)
    return (((type(value) == "number") and (value == value)) and (value ~= math.huge)) and (value ~= -math.huge)
end

function __TS__NumberIsNaN(value)
    return value ~= value
end

____radixChars = "0123456789abcdefghijklmnopqrstuvwxyz"
function __TS__NumberToString(self, radix)
    if ((((radix == nil) or (radix == 10)) or (self == math.huge)) or (self == -math.huge)) or (self ~= self) then
        return tostring(self)
    end
    radix = math.floor(radix)
    if (radix < 2) or (radix > 36) then
        error("toString() radix argument must be between 2 and 36", 0)
    end
    local integer, fraction = math.modf(
        math.abs(self)
    )
    local result = ""
    if radix == 8 then
        result = string.format("%o", integer)
    elseif radix == 16 then
        result = string.format("%x", integer)
    else
        repeat
            do
                result = tostring(
                    string.sub(____radixChars, (integer % radix) + 1, (integer % radix) + 1)
                ) .. tostring(result)
                integer = math.floor(integer / radix)
            end
        until not (integer ~= 0)
    end
    if fraction ~= 0 then
        result = tostring(result) .. "."
        local delta = 1e-16
        repeat
            do
                fraction = fraction * radix
                delta = delta * radix
                local digit = math.floor(fraction)
                result = tostring(result) .. tostring(
                    string.sub(____radixChars, digit + 1, digit + 1)
                )
                fraction = fraction - digit
            end
        until not (fraction >= delta)
    end
    if self < 0 then
        result = "-" .. tostring(result)
    end
    return result
end

function __TS__ObjectAssign(to, ...)
    local sources = {...}
    if to == nil then
        return to
    end
    for ____, source in ipairs(sources) do
        for key in pairs(source) do
            to[key] = source[key]
        end
    end
    return to
end

function __TS__ObjectEntries(obj)
    local result = {}
    for key in pairs(obj) do
        result[#result + 1] = {key, obj[key]}
    end
    return result
end

function __TS__ObjectFromEntries(entries)
    local obj = {}
    local iterable = entries
    if iterable[Symbol.iterator] then
        local iterator = iterable[Symbol.iterator](iterable)
        while true do
            local result = iterator:next()
            if result.done then
                break
            end
            local value = result.value
            obj[value[1]] = value[2]
        end
    else
        for ____, entry in ipairs(entries) do
            obj[entry[1]] = entry[2]
        end
    end
    return obj
end

function __TS__ObjectKeys(obj)
    local result = {}
    for key in pairs(obj) do
        result[#result + 1] = key
    end
    return result
end

function __TS__ObjectRest(target, usedProperties)
    local result = {}
    for property in pairs(target) do
        if not usedProperties[property] then
            result[property] = target[property]
        end
    end
    return result
end

function __TS__ObjectValues(obj)
    local result = {}
    for key in pairs(obj) do
        result[#result + 1] = obj[key]
    end
    return result
end

Set = (function()
    local Set = __TS__Class()
    Set.name = "Set"
    function Set.prototype.____constructor(self, values)
        self[Symbol.toStringTag] = "Set"
        self.size = 0
        self.nextKey = {}
        self.previousKey = {}
        if values == nil then
            return
        end
        local iterable = values
        if iterable[Symbol.iterator] then
            local iterator = iterable[Symbol.iterator](iterable)
            while true do
                local result = iterator:next()
                if result.done then
                    break
                end
                self:add(result.value)
            end
        else
            local array = values
            for ____, value in ipairs(array) do
                self:add(value)
            end
        end
    end
    function Set.prototype.add(self, value)
        local isNewValue = not self:has(value)
        if isNewValue then
            self.size = self.size + 1
        end
        if self.firstKey == nil then
            self.firstKey = value
            self.lastKey = value
        elseif isNewValue then
            self.nextKey[self.lastKey] = value
            self.previousKey[value] = self.lastKey
            self.lastKey = value
        end
        return self
    end
    function Set.prototype.clear(self)
        self.nextKey = {}
        self.previousKey = {}
        self.firstKey = nil
        self.lastKey = nil
        self.size = 0
        return
    end
    function Set.prototype.delete(self, value)
        local contains = self:has(value)
        if contains then
            self.size = self.size - 1
            local next = self.nextKey[value]
            local previous = self.previousKey[value]
            if next and previous then
                self.nextKey[previous] = next
                self.previousKey[next] = previous
            elseif next then
                self.firstKey = next
                self.previousKey[next] = nil
            elseif previous then
                self.lastKey = previous
                self.nextKey[previous] = nil
            else
                self.firstKey = nil
                self.lastKey = nil
            end
            self.nextKey[value] = nil
            self.previousKey[value] = nil
        end
        return contains
    end
    function Set.prototype.forEach(self, callback)
        for key in __TS__Iterator(
            self:keys()
        ) do
            callback(_G, key, key, self)
        end
    end
    function Set.prototype.has(self, value)
        return (self.nextKey[value] ~= nil) or (self.lastKey == value)
    end
    Set.prototype[Symbol.iterator] = function(self)
        return self:values()
    end
    function Set.prototype.entries(self)
        local nextKey = self.nextKey
        local key = self.firstKey
        return {
            [Symbol.iterator] = function(self)
                return self
            end,
            next = function(self)
                local result = {done = not key, value = {key, key}}
                key = nextKey[key]
                return result
            end
        }
    end
    function Set.prototype.keys(self)
        local nextKey = self.nextKey
        local key = self.firstKey
        return {
            [Symbol.iterator] = function(self)
                return self
            end,
            next = function(self)
                local result = {done = not key, value = key}
                key = nextKey[key]
                return result
            end
        }
    end
    function Set.prototype.values(self)
        local nextKey = self.nextKey
        local key = self.firstKey
        return {
            [Symbol.iterator] = function(self)
                return self
            end,
            next = function(self)
                local result = {done = not key, value = key}
                key = nextKey[key]
                return result
            end
        }
    end
    Set[Symbol.species] = Set
    return Set
end)()

WeakMap = (function()
    local WeakMap = __TS__Class()
    WeakMap.name = "WeakMap"
    function WeakMap.prototype.____constructor(self, entries)
        self[Symbol.toStringTag] = "WeakMap"
        self.items = {}
        setmetatable(self.items, {__mode = "k"})
        if entries == nil then
            return
        end
        local iterable = entries
        if iterable[Symbol.iterator] then
            local iterator = iterable[Symbol.iterator](iterable)
            while true do
                local result = iterator:next()
                if result.done then
                    break
                end
                local value = result.value
                self.items[value[1]] = value[2]
            end
        else
            for ____, kvp in ipairs(entries) do
                self.items[kvp[1]] = kvp[2]
            end
        end
    end
    function WeakMap.prototype.delete(self, key)
        local contains = self:has(key)
        self.items[key] = nil
        return contains
    end
    function WeakMap.prototype.get(self, key)
        return self.items[key]
    end
    function WeakMap.prototype.has(self, key)
        return self.items[key] ~= nil
    end
    function WeakMap.prototype.set(self, key, value)
        self.items[key] = value
        return self
    end
    WeakMap[Symbol.species] = WeakMap
    return WeakMap
end)()

WeakSet = (function()
    local WeakSet = __TS__Class()
    WeakSet.name = "WeakSet"
    function WeakSet.prototype.____constructor(self, values)
        self[Symbol.toStringTag] = "WeakSet"
        self.items = {}
        setmetatable(self.items, {__mode = "k"})
        if values == nil then
            return
        end
        local iterable = values
        if iterable[Symbol.iterator] then
            local iterator = iterable[Symbol.iterator](iterable)
            while true do
                local result = iterator:next()
                if result.done then
                    break
                end
                self.items[result.value] = true
            end
        else
            for ____, value in ipairs(values) do
                self.items[value] = true
            end
        end
    end
    function WeakSet.prototype.add(self, value)
        self.items[value] = true
        return self
    end
    function WeakSet.prototype.delete(self, value)
        local contains = self:has(value)
        self.items[value] = nil
        return contains
    end
    function WeakSet.prototype.has(self, value)
        return self.items[value] == true
    end
    WeakSet[Symbol.species] = WeakSet
    return WeakSet
end)()

function __TS__SourceMapTraceBack(fileName, sourceMap)
    _G.__TS__sourcemap = _G.__TS__sourcemap or ({})
    _G.__TS__sourcemap[fileName] = sourceMap
    if _G.__TS__originalTraceback == nil then
        _G.__TS__originalTraceback = debug.traceback
        debug.traceback = function(thread, message, level)
            local trace = _G.__TS__originalTraceback(thread, message, level)
            if type(trace) ~= "string" then
                return trace
            end
            local result = string.gsub(
                trace,
                "(%S+).lua:(%d+)",
                function(file, line)
                    local fileSourceMap = _G.__TS__sourcemap[tostring(file) .. ".lua"]
                    if fileSourceMap and fileSourceMap[line] then
                        return (tostring(file) .. ".ts:") .. tostring(fileSourceMap[line])
                    end
                    return (tostring(file) .. ".lua:") .. tostring(line)
                end
            )
            return result
        end
    end
end

function __TS__Spread(iterable)
    local arr = {}
    if type(iterable) == "string" then
        do
            local i = 0
            while i < #iterable do
                arr[#arr + 1] = string.sub(iterable, i + 1, i + 1)
                i = i + 1
            end
        end
    else
        for item in __TS__Iterator(iterable) do
            arr[#arr + 1] = item
        end
    end
    return (table.unpack or unpack)(arr)
end

function __TS__StringConcat(str1, ...)
    local args = {...}
    local out = str1
    for ____, arg in ipairs(args) do
        out = tostring(out) .. tostring(arg)
    end
    return out
end

function __TS__StringEndsWith(self, searchString, endPosition)
    if (endPosition == nil) or (endPosition > #self) then
        endPosition = #self
    end
    return string.sub(self, (endPosition - #searchString) + 1, endPosition) == searchString
end

function __TS__StringPadEnd(self, maxLength, fillString)
    if fillString == nil then
        fillString = " "
    end
    if maxLength ~= maxLength then
        maxLength = 0
    end
    if (maxLength == -math.huge) or (maxLength == math.huge) then
        error("Invalid string length", 0)
    end
    if (#self >= maxLength) or (#fillString == 0) then
        return self
    end
    maxLength = maxLength - #self
    if maxLength > #fillString then
        fillString = tostring(fillString) .. tostring(
            string.rep(
                fillString,
                math.floor(maxLength / #fillString)
            )
        )
    end
    return tostring(self) .. tostring(
        string.sub(
            fillString,
            1,
            math.floor(maxLength)
        )
    )
end

function __TS__StringPadStart(self, maxLength, fillString)
    if fillString == nil then
        fillString = " "
    end
    if maxLength ~= maxLength then
        maxLength = 0
    end
    if (maxLength == -math.huge) or (maxLength == math.huge) then
        error("Invalid string length", 0)
    end
    if (#self >= maxLength) or (#fillString == 0) then
        return self
    end
    maxLength = maxLength - #self
    if maxLength > #fillString then
        fillString = tostring(fillString) .. tostring(
            string.rep(
                fillString,
                math.floor(maxLength / #fillString)
            )
        )
    end
    return tostring(
        string.sub(
            fillString,
            1,
            math.floor(maxLength)
        )
    ) .. tostring(self)
end

function __TS__StringReplace(source, searchValue, replaceValue)
    searchValue = string.gsub(searchValue, "[%%%(%)%.%+%-%*%?%[%^%$]", "%%%1")
    if type(replaceValue) == "string" then
        replaceValue = string.gsub(replaceValue, "[%%%(%)%.%+%-%*%?%[%^%$]", "%%%1")
        local result = string.gsub(source, searchValue, replaceValue, 1)
        return result
    else
        local result = string.gsub(
            source,
            searchValue,
            function(match) return replaceValue(_G, match) end,
            1
        )
        return result
    end
end

function __TS__StringSplit(source, separator, limit)
    if limit == nil then
        limit = 4294967295
    end
    if limit == 0 then
        return {}
    end
    local out = {}
    local index = 0
    local count = 0
    if (separator == nil) or (separator == "") then
        while (index < (#source - 1)) and (count < limit) do
            out[count + 1] = string.sub(source, index + 1, index + 1)
            count = count + 1
            index = index + 1
        end
    else
        local separatorLength = #separator
        local nextIndex = (string.find(source, separator, nil, true) or 0) - 1
        while (nextIndex >= 0) and (count < limit) do
            out[count + 1] = string.sub(source, index + 1, nextIndex)
            count = count + 1
            index = nextIndex + separatorLength
            nextIndex = (string.find(source, separator, index + 1, true) or 0) - 1
        end
    end
    if count < limit then
        out[count + 1] = string.sub(source, index + 1)
    end
    return out
end

function __TS__StringStartsWith(self, searchString, position)
    if (position == nil) or (position < 0) then
        position = 0
    end
    return string.sub(self, position + 1, #searchString + position) == searchString
end

function __TS__StringTrim(self)
    local result = string.gsub(self, "^[%s ﻿]*(.-)[%s ﻿]*$", "%1")
    return result
end

function __TS__StringTrimEnd(self)
    local result = string.gsub(self, "[%s ﻿]*$", "")
    return result
end

function __TS__StringTrimStart(self)
    local result = string.gsub(self, "^[%s ﻿]*", "")
    return result
end

____symbolRegistry = {}
function __TS__SymbolRegistryFor(key)
    if not ____symbolRegistry[key] then
        ____symbolRegistry[key] = __TS__Symbol(key)
    end
    return ____symbolRegistry[key]
end
function __TS__SymbolRegistryKeyFor(sym)
    for key in pairs(____symbolRegistry) do
        if ____symbolRegistry[key] == sym then
            return key
        end
    end
end

function __TS__TypeOf(value)
    local luaType = type(value)
    if luaType == "table" then
        return "object"
    elseif luaType == "nil" then
        return "undefined"
    else
        return luaType
    end
end

 end,
}
return require("src.main")
