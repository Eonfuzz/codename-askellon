udg_elevator_entrances = {}
udg_Lights_Floor_1 = {}
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
udg_elevator_entrance_names = __jarray("")
udg_elevator_exit_zones = __jarray("")
udg_ship_zones = {}
udg_collision_rect = nil
udg_collision_item = nil
udg_pathing_rect = nil
udg_killzones = {}
udg_Lights_Cargo = {}
udg_Lights_Bridge = {}
gg_rct_Space = nil
gg_rct_Galaxy_Map = nil
gg_rct_FallZone1 = nil
gg_rct_FallZone1Land = nil
gg_rct_GeneSplicer = nil
gg_rct_FallZoneCargo = nil
gg_rct_FallZoneCargoLand = nil
gg_rct_JumpPassCargo = nil
gg_rct_JumpPassCargoVent = nil
gg_rct_Kill_Zone = nil
gg_rct_Kill_Zone_Copy = nil
gg_rct_Kill_Zone_Copy_Copy = nil
gg_rct_Kill_Zone_Copy_Copy_Copy = nil
gg_rct_Kill_Zone_Copy_Copy_Copy_2 = nil
gg_rct_Kill_Zone_Copy_Copy_Copy_Copy = nil
gg_rct_ShipAirWaveZone = nil
gg_rct_ShipBay01 = nil
gg_rct_ShipBay02 = nil
gg_rct_ShipBay03 = nil
gg_rct_ShipBay04 = nil
gg_rct_CollisionCheckZone = nil
gg_rct_FallZoneBridge = nil
gg_rct_JumpPassBridgeVents = nil
gg_rct_JumpBassBridge = nil
gg_rct_Kill_Zone_Copy_Copy_Copy_Copy_2 = nil
gg_rct_Kill_Zone_Copy_Copy_Copy_Copy_2_Copy = nil
gg_rct_Kill_Zone_Copy_Copy_Copy_Copy_2_Copy_2 = nil
gg_rct_Kill_Zone_Copy_Copy_Copy_Copy_2_Copy_2_Copy = nil
gg_rct_Kill_Zone_Copy_Copy_Copy_Copy_2_Copy_2_Copy_Copy = nil
gg_rct_Kill_Zone_Copy_Copy_Copy_Copy_2_Copy_2_Copy_Copy_Copy = nil
gg_rct_Kill_Zone_Copy_Copy_Copy_Copy_2_Copy_2_Copy_Copy_2 = nil
gg_rct_Kill_Zone_Copy_Copy_Copy_Copy_2_Copy_Copy = nil
gg_rct_Kill_Zone_Copy_Copy_Copy_Copy_2_Copy_Copy_Copy = nil
gg_rct_pathingRect = nil
gg_trg_SetKillzones = nil
gg_trg_LightsPerFloor = nil
gg_trg_Set = nil
gg_trg_SetHatch = nil
gg_trg_SetFall = nil
gg_trg_SetPowerGenerators = nil
gg_trg_SetShipZones = nil
gg_trg_SetCollisionData = nil
gg_unit_n001_0032 = nil
gg_unit_h004_0048 = nil
gg_unit_n004_0034 = nil
gg_unit_n001_0055 = nil
gg_unit_n002_0033 = nil
gg_unit_n004_0047 = nil
gg_unit_n002_0043 = nil
gg_unit_n002_0044 = nil
gg_unit_n001_0045 = nil
gg_unit_h004_0046 = nil
gg_unit_n004_0035 = nil
gg_item_ratf_0230 = nil
gg_unit_n001_0199 = nil
gg_unit_n001_0051 = nil
gg_unit_h004_0061 = nil
gg_unit_n001_0240 = nil
gg_dest_B002_0015 = nil
gg_dest_B002_0017 = nil
gg_dest_B002_0019 = nil
gg_dest_B002_0022 = nil
gg_dest_B002_0096 = nil
gg_dest_B002_0097 = nil
gg_dest_B002_0098 = nil
gg_dest_B002_0099 = nil
gg_dest_B002_0100 = nil
gg_dest_B002_0101 = nil
gg_dest_B002_0105 = nil
gg_dest_B002_0104 = nil
gg_dest_B002_0103 = nil
gg_dest_B002_0102 = nil
gg_dest_B002_0266 = nil
gg_dest_B002_0269 = nil
gg_dest_B002_0262 = nil
gg_dest_B002_0265 = nil
gg_dest_B002_0337 = nil
gg_dest_B002_0338 = nil
gg_dest_B002_0267 = nil
gg_dest_B002_0415 = nil
gg_unit_n004_0267 = nil
gg_unit_n002_0245 = nil
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
    i = 0
    while (true) do
        if ((i > 1)) then break end
        udg_elevator_entrance_names[i] = ""
        i = i + 1
    end
    i = 0
    while (true) do
        if ((i > 1)) then break end
        udg_elevator_exit_zones[i] = ""
        i = i + 1
    end
end

function CreateAllDestructables()
    local d
    local t
    local life
    gg_dest_B002_0015 = BlzCreateDestructableZWithSkin(FourCC("B002"), -121.9, 576.3, 134.4, 358.000, 1.000, 0, FourCC("B002"))
    gg_dest_B002_0017 = BlzCreateDestructableZWithSkin(FourCC("B002"), -104.7, -37.8, 134.4, 217.000, 1.000, 0, FourCC("B002"))
    gg_dest_B002_0019 = BlzCreateDestructableZWithSkin(FourCC("B002"), 828.0, -62.8, 134.4, 117.000, 1.000, 0, FourCC("B002"))
    gg_dest_B002_0022 = BlzCreateDestructableZWithSkin(FourCC("B002"), 828.8, 542.7, 134.4, 210.000, 1.000, 0, FourCC("B002"))
    gg_dest_B002_0096 = BlzCreateDestructableZWithSkin(FourCC("B002"), -28730.8, -27410.6, 201.0, 73.000, 1.000, 0, FourCC("B002"))
    gg_dest_B002_0097 = BlzCreateDestructableZWithSkin(FourCC("B002"), -28713.7, -28208.7, 201.0, 98.000, 1.000, 0, FourCC("B002"))
    gg_dest_B002_0098 = BlzCreateDestructableZWithSkin(FourCC("B002"), -28060.4, -27407.3, 201.0, 73.000, 1.000, 0, FourCC("B002"))
    gg_dest_B002_0099 = BlzCreateDestructableZWithSkin(FourCC("B002"), -28043.3, -28205.4, 201.0, 98.000, 1.000, 0, FourCC("B002"))
    gg_dest_B002_0100 = BlzCreateDestructableZWithSkin(FourCC("B002"), -27390.6, -27404.7, 201.0, 73.000, 1.000, 0, FourCC("B002"))
    gg_dest_B002_0101 = BlzCreateDestructableZWithSkin(FourCC("B002"), -27373.5, -28202.8, 201.0, 98.000, 1.000, 0, FourCC("B002"))
    gg_dest_B002_0105 = BlzCreateDestructableZWithSkin(FourCC("B002"), -26010.6, -28187.3, 201.0, 98.000, 1.000, 0, FourCC("B002"))
    gg_dest_B002_0104 = BlzCreateDestructableZWithSkin(FourCC("B002"), -26027.7, -27389.2, 201.0, 73.000, 1.000, 0, FourCC("B002"))
    gg_dest_B002_0103 = BlzCreateDestructableZWithSkin(FourCC("B002"), -26673.7, -28213.1, 201.0, 98.000, 1.000, 0, FourCC("B002"))
    gg_dest_B002_0102 = BlzCreateDestructableZWithSkin(FourCC("B002"), -26690.8, -27415.0, 201.0, 73.000, 1.000, 0, FourCC("B002"))
    gg_dest_B002_0266 = BlzCreateDestructableZWithSkin(FourCC("B002"), -17920.8, -26258.0, 371.2, 268.000, 1.000, 0, FourCC("B002"))
    gg_dest_B002_0269 = BlzCreateDestructableZWithSkin(FourCC("B002"), -19703.4, -27262.1, 243.2, 313.000, 1.000, 0, FourCC("B002"))
    gg_dest_B002_0262 = BlzCreateDestructableZWithSkin(FourCC("B002"), -18839.8, -28247.6, 339.2, 43.000, 1.000, 0, FourCC("B002"))
    gg_dest_B002_0265 = BlzCreateDestructableZWithSkin(FourCC("B002"), -18948.5, -26241.1, 371.2, 206.000, 1.000, 0, FourCC("B002"))
    gg_dest_B002_0337 = BlzCreateDestructableZWithSkin(FourCC("B002"), -18427.3, -27110.6, 339.2, 139.000, 1.000, 0, FourCC("B002"))
    gg_dest_B002_0338 = BlzCreateDestructableZWithSkin(FourCC("B002"), -18431.9, -27871.1, 339.2, 95.182, 1.000, 0, FourCC("B002"))
    gg_dest_B002_0267 = BlzCreateDestructableZWithSkin(FourCC("B002"), -17804.3, -25225.6, 140.8, 132.000, 1.000, 0, FourCC("B002"))
    gg_dest_B002_0415 = BlzCreateDestructableZWithSkin(FourCC("B002"), -19069.5, -25223.1, 140.8, 132.000, 1.000, 0, FourCC("B002"))
end

function CreateAllItems()
    local itemID
    BlzCreateItemWithSkin(FourCC("I009"), 819.5, 355.5, FourCC("I009"))
    BlzCreateItemWithSkin(FourCC("I009"), 800.3, 427.5, FourCC("I009"))
    BlzCreateItemWithSkin(FourCC("I009"), 862.0, 347.4, FourCC("I009"))
    BlzCreateItemWithSkin(FourCC("I009"), 766.3, 368.8, FourCC("I009"))
    BlzCreateItemWithSkin(FourCC("I009"), 852.4, 420.0, FourCC("I009"))
    BlzCreateItemWithSkin(FourCC("I009"), 717.6, 362.1, FourCC("I009"))
    BlzCreateItemWithSkin(FourCC("I009"), 712.9, 426.1, FourCC("I009"))
    BlzCreateItemWithSkin(FourCC("I009"), 758.8, 424.4, FourCC("I009"))
    gg_item_ratf_0230 = BlzCreateItemWithSkin(FourCC("ratf"), 450.0, 159.3, FourCC("ratf"))
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
    gg_unit_h004_0061 = BlzCreateUnitWithSkin(p, FourCC("h004"), -17856.0, -28800.0, 270.000, FourCC("h004"))
end

function CreateUnitsForPlayer21()
    local p = Player(21)
    local u
    local unitID
    local t
    local life
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -416.0, -96.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -352.0, -224.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -224.0, -224.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -288.0, -96.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -22048.0, -25120.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -96.0, -224.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), 1376.0, 416.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), 1184.0, 416.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), 1376.0, 288.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), 1184.0, 288.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), 1248.0, 160.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), 1760.0, 480.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), 1888.0, 480.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), 1824.0, 32.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -22112.0, -28000.0, 27.736, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -23904.0, -28064.0, 264.949, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), 2016.0, -160.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), 1632.0, -160.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), 1568.0, 96.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -22112.0, -25056.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -21984.0, -25120.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -21984.0, -25184.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -22560.0, -24992.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -22496.0, -24992.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), 416.0, -928.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -28448.0, -27296.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -28384.0, -27296.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -28320.0, -27296.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -23520.0, -25056.0, 304.287, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -23712.0, -24992.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -23776.0, -24992.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -23904.0, -24992.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -28256.0, -27296.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -24032.0, -24992.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -24096.0, -24992.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -28192.0, -27296.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -28128.0, -27296.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -24096.0, -25184.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -28384.0, -27360.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -28320.0, -27360.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -28256.0, -27360.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -21984.0, -26592.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -21984.0, -26464.0, 306.863, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -22112.0, -26464.0, 86.393, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -24032.0, -26592.0, 313.811, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -24096.0, -26464.0, 356.983, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -24096.0, -26976.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -24032.0, -26976.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -21984.0, -26976.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -27296.0, 25952.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -27168.0, 25952.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -26976.0, 26080.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -27296.0, 26144.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -25440.0, 26400.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -25504.0, 26272.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -25504.0, 26208.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -24928.0, 27040.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -25056.0, 27040.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -25184.0, 27040.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -24928.0, 26912.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -28192.0, -27360.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -28320.0, -27424.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -28256.0, -27424.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -26656.0, -27296.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -26592.0, -27296.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -26528.0, -27296.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -26464.0, -27296.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -26400.0, -27296.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -26336.0, -27296.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -26592.0, -27360.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -26528.0, -27360.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -26464.0, -27360.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -26400.0, -27360.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -26528.0, -27424.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -26464.0, -27424.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -26592.0, -28000.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -26592.0, -28128.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -26528.0, -28128.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -26464.0, -28128.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -26400.0, -28128.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -26528.0, -28000.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -26592.0, -28192.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -26528.0, -28192.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -26464.0, -28192.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -26400.0, -28192.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -26528.0, -28256.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -26464.0, -28256.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -27360.0, -28256.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -28384.0, -28128.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -28320.0, -28128.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -28256.0, -28128.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -28192.0, -28128.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -27424.0, -28256.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -28384.0, -28192.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -28320.0, -28192.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -28256.0, -28192.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -28192.0, -28192.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -28320.0, -28256.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -28256.0, -28256.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -25824.0, -27360.0, 212.255, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -25824.0, -27488.0, 297.598, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -25824.0, -27616.0, 306.624, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -25824.0, -27744.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -25824.0, -27872.0, 202.414, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -25824.0, -28000.0, 177.115, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -25824.0, -28128.0, 296.435, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -25824.0, -28256.0, 306.627, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -25824.0, -28384.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -27552.0, -27296.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -27488.0, -27296.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -27424.0, -27296.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -27360.0, -27296.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -25952.0, -25568.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -26080.0, -25568.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -25952.0, -25760.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -27808.0, -25632.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -27808.0, -25760.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -27680.0, -25888.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -26464.0, -28000.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -26400.0, -28000.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -26592.0, -28064.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -26528.0, -28064.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -26464.0, -28064.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -26400.0, -28064.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -28384.0, -28000.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -28320.0, -28000.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -28256.0, -28000.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -28192.0, -28000.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -28384.0, -28064.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -28320.0, -28064.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -28256.0, -28064.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -28192.0, -28064.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -27296.0, -28192.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -27360.0, -28192.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -27424.0, -28192.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -27360.0, -28064.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -27488.0, -28128.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -27424.0, -28128.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -27360.0, -28128.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -27296.0, -28128.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -27296.0, -28064.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -27488.0, -28192.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -27488.0, -28000.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -27424.0, -28000.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -27360.0, -28000.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -27296.0, -28000.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -27488.0, -28064.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -27424.0, -28064.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -27296.0, -27296.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -27232.0, -27296.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -27488.0, -27360.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -27424.0, -27360.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -27360.0, -27360.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -27296.0, -27360.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -27424.0, -27424.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -27360.0, -27424.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -25056.0, 26912.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -25312.0, 27040.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -26464.0, 26976.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -26592.0, 26976.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -26400.0, 26976.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -27360.0, 27104.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -27232.0, 27104.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -28704.0, -27360.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -28704.0, -27488.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -28704.0, -27424.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -28704.0, -27552.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -28704.0, -27616.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -28640.0, -27424.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -28640.0, -27488.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -28640.0, -27552.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -28640.0, -27616.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -28704.0, -27680.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -28640.0, -27680.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -28704.0, -27808.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -28640.0, -27808.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -28704.0, -27744.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -28640.0, -27744.0, 270.000, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -17472.0, -28736.0, 247.305, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -17216.0, -29216.0, 76.603, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -17600.0, -28768.0, 293.891, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -18112.0, -28960.0, 258.650, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -18272.0, -28960.0, 290.986, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -18880.0, -28448.0, 90.777, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -17568.0, -25888.0, 90.777, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -18784.0, -28448.0, 90.777, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -18688.0, -28448.0, 90.777, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -19296.0, -25888.0, 90.777, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -14240.0, -27328.0, 90.777, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -14240.0, -27456.0, 180.725, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -14240.0, -27552.0, 42.558, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -14080.0, -27360.0, 154.285, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -14400.0, -27584.0, 90.777, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -14528.0, -27552.0, 62.911, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -14784.0, -27584.0, 78.867, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -14720.0, -27392.0, 149.770, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -14656.0, -27552.0, 64.070, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -14624.0, -27488.0, 203.987, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -14816.0, -27488.0, 59.921, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -14080.0, -27552.0, 127.955, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -14144.0, -27456.0, 335.757, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -14816.0, -27296.0, 86.185, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -13632.0, -25440.0, 90.777, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -13728.0, -25440.0, 90.777, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -13824.0, -25440.0, 90.777, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -14912.0, -25440.0, 90.777, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -14816.0, -25440.0, 90.777, FourCC("h005"))
    u = BlzCreateUnitWithSkin(p, FourCC("h005"), -14720.0, -25440.0, 90.777, FourCC("h005"))
end

function CreateNeutralHostile()
    local p = Player(PLAYER_NEUTRAL_AGGRESSIVE)
    local u
    local unitID
    local t
    local life
    u = BlzCreateUnitWithSkin(p, FourCC("ntrd"), 3725.9, -403.1, 210.264, FourCC("ntrd"))
    u = BlzCreateUnitWithSkin(p, FourCC("ntrd"), 3602.9, -115.6, 215.074, FourCC("ntrd"))
end

function CreateNeutralPassiveBuildings()
    local p = Player(PLAYER_NEUTRAL_PASSIVE)
    local u
    local unitID
    local t
    local life
    gg_unit_n001_0032 = BlzCreateUnitWithSkin(p, FourCC("n001"), -448.0, 960.0, 270.000, FourCC("n001"))
    gg_unit_n002_0033 = BlzCreateUnitWithSkin(p, FourCC("n002"), 1024.0, 0.0, 270.000, FourCC("n002"))
    gg_unit_n004_0034 = BlzCreateUnitWithSkin(p, FourCC("n004"), -28673.3, 26617.4, 89.562, FourCC("n004"))
    gg_unit_n004_0035 = BlzCreateUnitWithSkin(p, FourCC("n004"), -26113.3, 26361.4, 89.562, FourCC("n004"))
    u = BlzCreateUnitWithSkin(p, FourCC("nWEP"), 1024.0, -256.0, 270.000, FourCC("nWEP"))
    u = BlzCreateUnitWithSkin(p, FourCC("nMED"), -64.0, 960.0, 270.000, FourCC("nMED"))
    u = BlzCreateUnitWithSkin(p, FourCC("n007"), -14688.0, -25120.0, 270.000, FourCC("n007"))
    u = BlzCreateUnitWithSkin(p, FourCC("nGEN"), -13696.0, -24832.0, 270.000, FourCC("nGEN"))
    gg_unit_n002_0043 = BlzCreateUnitWithSkin(p, FourCC("n002"), -27584.0, -26944.0, 270.000, FourCC("n002"))
    gg_unit_n002_0044 = BlzCreateUnitWithSkin(p, FourCC("n002"), -26496.0, -25344.0, 270.000, FourCC("n002"))
    gg_unit_n001_0045 = BlzCreateUnitWithSkin(p, FourCC("n001"), -28864.0, -26944.0, 270.000, FourCC("n001"))
    gg_unit_n004_0047 = BlzCreateUnitWithSkin(p, FourCC("n004"), -26689.3, 27065.4, 89.562, FourCC("n004"))
    gg_unit_n001_0051 = BlzCreateUnitWithSkin(p, FourCC("n001"), -19008.0, -27904.0, 270.000, FourCC("n001"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), -19712.0, -27264.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), -19584.0, -27904.0, 270.000, FourCC("n002"))
    gg_unit_n001_0055 = BlzCreateUnitWithSkin(p, FourCC("n001"), -22464.0, -28864.0, 270.000, FourCC("n001"))
    gg_unit_n001_0199 = BlzCreateUnitWithSkin(p, FourCC("n001"), -23616.0, -28864.0, 270.000, FourCC("n001"))
    gg_unit_n001_0240 = BlzCreateUnitWithSkin(p, FourCC("n001"), -832.0, 960.0, 270.000, FourCC("n001"))
    u = BlzCreateUnitWithSkin(p, FourCC("n005"), -18435.9, -25586.1, 0.220, FourCC("n005"))
    u = BlzCreateUnitWithSkin(p, FourCC("n004"), -27137.3, 24569.4, 89.562, FourCC("n004"))
    u = BlzCreateUnitWithSkin(p, FourCC("n004"), -27137.3, 24057.4, 89.562, FourCC("n004"))
    gg_unit_n002_0245 = BlzCreateUnitWithSkin(p, FourCC("n002"), -14080.0, -27456.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n006"), -11856.6, -26533.3, 224.634, FourCC("n006"))
    gg_unit_n004_0267 = BlzCreateUnitWithSkin(p, FourCC("n004"), -26497.3, 25081.4, 89.562, FourCC("n004"))
end

function CreatePlayerBuildings()
    CreateBuildingsForPlayer21()
end

function CreatePlayerUnits()
    CreateUnitsForPlayer20()
    CreateUnitsForPlayer21()
end

function CreateAllUnits()
    CreateNeutralPassiveBuildings()
    CreatePlayerBuildings()
    CreateNeutralHostile()
    CreatePlayerUnits()
end

function CreateRegions()
    local we
    gg_rct_Space = Rect(6336.0, -30176.0, 29920.0, 1216.0)
    gg_rct_Galaxy_Map = Rect(-3520.0, 1856.0, -2656.0, 2720.0)
    gg_rct_FallZone1 = Rect(-96.0, 1024.0, 480.0, 1248.0)
    gg_rct_FallZone1Land = Rect(-27488.0, 26816.0, -27168.0, 27168.0)
    gg_rct_GeneSplicer = Rect(-14752.0, -25184.0, -14624.0, -25056.0)
    gg_rct_FallZoneCargo = Rect(-26432.0, -27136.0, -25760.0, -26880.0)
    gg_rct_FallZoneCargoLand = Rect(-25600.0, 26016.0, -25344.0, 26496.0)
    gg_rct_JumpPassCargo = Rect(-26816.0, -27936.0, -25696.0, -27104.0)
    gg_rct_JumpPassCargoVent = Rect(-26496.0, -26944.0, -25728.0, -26080.0)
    gg_rct_Kill_Zone = Rect(-27008.0, 27168.0, -26016.0, 28160.0)
    gg_rct_Kill_Zone_Copy = Rect(-24768.0, -24800.0, -21216.0, -23360.0)
    gg_rct_Kill_Zone_Copy_Copy = Rect(-21792.0, -26624.0, -21216.0, -24768.0)
    gg_rct_Kill_Zone_Copy_Copy_Copy = Rect(-21792.0, -28480.0, -21216.0, -26624.0)
    gg_rct_Kill_Zone_Copy_Copy_Copy_2 = Rect(-24896.0, -26592.0, -24256.0, -24736.0)
    gg_rct_Kill_Zone_Copy_Copy_Copy_Copy = Rect(-24864.0, -28416.0, -24288.0, -26560.0)
    gg_rct_ShipAirWaveZone = Rect(-29056.0, -28672.0, -25696.0, -27104.0)
    gg_rct_ShipBay01 = Rect(-28832.0, -28448.0, -28640.0, -28032.0)
    gg_rct_ShipBay02 = Rect(-27936.0, -28448.0, -27744.0, -28032.0)
    gg_rct_ShipBay03 = Rect(-27040.0, -28448.0, -26848.0, -28032.0)
    gg_rct_ShipBay04 = Rect(-26144.0, -28448.0, -25952.0, -28032.0)
    gg_rct_CollisionCheckZone = Rect(416.0, 96.0, 480.0, 160.0)
    gg_rct_FallZoneBridge = Rect(-17888.0, -28096.0, -17056.0, -27776.0)
    gg_rct_JumpPassBridgeVents = Rect(-17984.0, -28896.0, -16864.0, -28064.0)
    gg_rct_JumpBassBridge = Rect(-18016.0, -27808.0, -16896.0, -26976.0)
    gg_rct_Kill_Zone_Copy_Copy_Copy_Copy_2 = Rect(-18240.0, -27296.0, -17568.0, -26720.0)
    gg_rct_Kill_Zone_Copy_Copy_Copy_Copy_2_Copy = Rect(-19264.0, -27392.0, -18592.0, -26656.0)
    gg_rct_Kill_Zone_Copy_Copy_Copy_Copy_2_Copy_2 = Rect(-20064.0, -25024.0, -16896.0, -24192.0)
    gg_rct_Kill_Zone_Copy_Copy_Copy_Copy_2_Copy_2_Copy = Rect(-20064.0, -25152.0, -19200.0, -24992.0)
    gg_rct_Kill_Zone_Copy_Copy_Copy_Copy_2_Copy_2_Copy_Copy = Rect(-20000.0, -25344.0, -19424.0, -25120.0)
    gg_rct_Kill_Zone_Copy_Copy_Copy_Copy_2_Copy_2_Copy_Copy_Copy = Rect(-17472.0, -25344.0, -16896.0, -25120.0)
    gg_rct_Kill_Zone_Copy_Copy_Copy_Copy_2_Copy_2_Copy_Copy_2 = Rect(-17760.0, -25152.0, -16896.0, -24992.0)
    gg_rct_Kill_Zone_Copy_Copy_Copy_Copy_2_Copy_Copy = Rect(-19200.0, -27520.0, -18720.0, -26560.0)
    gg_rct_Kill_Zone_Copy_Copy_Copy_Copy_2_Copy_Copy_Copy = Rect(-18144.0, -27456.0, -17664.0, -26496.0)
    gg_rct_pathingRect = Rect(0.0, 0.0, 256.0, 256.0)
end

function Trig_SetKillzones_Actions()
    udg_killzones[1] = gg_rct_Kill_Zone
    udg_killzones[2] = gg_rct_Kill_Zone_Copy
    udg_killzones[3] = gg_rct_Kill_Zone_Copy_Copy_Copy_2
    udg_killzones[4] = gg_rct_Kill_Zone_Copy_Copy_Copy_Copy
    udg_killzones[5] = gg_rct_Kill_Zone_Copy_Copy
    udg_killzones[6] = gg_rct_Kill_Zone_Copy_Copy_Copy
    udg_killzones[7] = gg_rct_Kill_Zone_Copy_Copy_Copy_Copy_2_Copy_Copy
    udg_killzones[8] = gg_rct_Kill_Zone_Copy_Copy_Copy_Copy_2_Copy
    udg_killzones[9] = gg_rct_Kill_Zone_Copy_Copy_Copy_Copy_2
    udg_killzones[10] = gg_rct_Kill_Zone_Copy_Copy_Copy_Copy_2_Copy_Copy_Copy
    udg_killzones[11] = gg_rct_Kill_Zone_Copy_Copy_Copy_Copy_2_Copy_2
    udg_killzones[12] = gg_rct_Kill_Zone_Copy_Copy_Copy_Copy_2_Copy_2_Copy_Copy_2
    udg_killzones[13] = gg_rct_Kill_Zone_Copy_Copy_Copy_Copy_2_Copy_2_Copy_Copy_Copy
    udg_killzones[14] = gg_rct_Kill_Zone_Copy_Copy_Copy_Copy_2_Copy_2_Copy
    udg_killzones[15] = gg_rct_Kill_Zone_Copy_Copy_Copy_Copy_2_Copy_2_Copy_Copy
end

function InitTrig_SetKillzones()
    gg_trg_SetKillzones = CreateTrigger()
    TriggerAddAction(gg_trg_SetKillzones, Trig_SetKillzones_Actions)
end

function Trig_LightsPerFloor_Actions()
    udg_Lights_Floor_1[1] = gg_dest_B002_0017
    udg_Lights_Floor_1[2] = gg_dest_B002_0019
    udg_Lights_Floor_1[3] = gg_dest_B002_0022
    udg_Lights_Floor_1[4] = gg_dest_B002_0015
    udg_Lights_Cargo[1] = gg_dest_B002_0097
    udg_Lights_Cargo[2] = gg_dest_B002_0098
    udg_Lights_Cargo[3] = gg_dest_B002_0099
    udg_Lights_Cargo[4] = gg_dest_B002_0100
    udg_Lights_Cargo[5] = gg_dest_B002_0101
    udg_Lights_Cargo[6] = gg_dest_B002_0102
    udg_Lights_Cargo[7] = gg_dest_B002_0103
    udg_Lights_Cargo[8] = gg_dest_B002_0104
    udg_Lights_Cargo[9] = gg_dest_B002_0105
    udg_Lights_Cargo[10] = gg_dest_B002_0096
    udg_Lights_Bridge[1] = gg_dest_B002_0267
    udg_Lights_Bridge[2] = gg_dest_B002_0265
    udg_Lights_Bridge[3] = gg_dest_B002_0266
    udg_Lights_Bridge[4] = gg_dest_B002_0338
    udg_Lights_Bridge[5] = gg_dest_B002_0262
    udg_Lights_Bridge[6] = gg_dest_B002_0337
    udg_Lights_Bridge[7] = gg_dest_B002_0269
    udg_Lights_Bridge[8] = gg_dest_B002_0415
end

function InitTrig_LightsPerFloor()
    gg_trg_LightsPerFloor = CreateTrigger()
    TriggerAddAction(gg_trg_LightsPerFloor, Trig_LightsPerFloor_Actions)
end

function Trig_Set_Actions()
    udg_elevator_entrances[1] = gg_unit_n001_0032
    udg_elevator_entrances[2] = gg_unit_n001_0055
    udg_elevator_entrances[3] = gg_unit_n001_0045
    udg_elevator_entrances[4] = gg_unit_n001_0199
    udg_elevator_entrances[5] = gg_unit_n001_0240
    udg_elevator_entrances[6] = gg_unit_n001_0051
    udg_elevator_exits[1] = gg_unit_n001_0055
    udg_elevator_exits[2] = gg_unit_n001_0032
    udg_elevator_exits[3] = gg_unit_n001_0199
    udg_elevator_exits[4] = gg_unit_n001_0045
    udg_elevator_exits[5] = gg_unit_n001_0051
    udg_elevator_exits[6] = gg_unit_n001_0240
    udg_elevator_entrance_names[1] = "|cffffcc00Cathederal|r"
    udg_elevator_entrance_names[2] = "|cfff5a742Floor 1|r"
    udg_elevator_entrance_names[3] = "|cffffcc00Cathederal|r"
    udg_elevator_entrance_names[4] = "|cff008080Cargo|r"
    udg_elevator_entrance_names[5] = "|cffffff00Bridge|r"
    udg_elevator_entrance_names[6] = "|cfff5a742Floor 1|r"
    udg_elevator_exit_zones[1] = "FLOOR_1"
    udg_elevator_exit_zones[2] = "CHURCH"
    udg_elevator_exit_zones[3] = "CARGO_A"
    udg_elevator_exit_zones[4] = "CHURCH"
    udg_elevator_exit_zones[5] = "FLOOR_1"
    udg_elevator_exit_zones[6] = "BRIDGE"
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
    udg_hatch_entrances[7] = gg_unit_n004_0267
    udg_hatch_entrances[8] = gg_unit_n002_0245
    udg_hatch_exits[1] = gg_unit_n004_0034
    udg_hatch_exits[2] = gg_unit_n002_0033
    udg_hatch_exits[3] = gg_unit_n002_0043
    udg_hatch_exits[4] = gg_unit_n004_0035
    udg_hatch_exits[5] = gg_unit_n002_0044
    udg_hatch_exits[6] = gg_unit_n004_0047
    udg_hatch_exits[7] = gg_unit_n002_0245
    udg_hatch_exits[8] = gg_unit_n004_0267
    udg_hatch_entrance_names[1] = "|cff666633Service Tunnels|r"
    udg_hatch_entrance_names[2] = "|cfff5a742Floor 1|r"
    udg_hatch_entrance_names[3] = "|cff008080Cargo|r"
    udg_hatch_entrance_names[4] = "|cff666633Service Tunnels|r"
    udg_hatch_entrance_names[5] = "|cff666633Cargo Vents|r"
    udg_hatch_entrance_names[6] = "|cff666633Service Tunnels|r"
    udg_hatch_entrance_names[7] = "|cff00ffffBiology and Chemistry|r"
    udg_hatch_entrance_names[8] = "|cff666633Service Tunnels|r"
    udg_hatch_exit_zones[1] = "FLOOR_1"
    udg_hatch_exit_zones[2] = "SERVICE_TUNNELS"
    udg_hatch_exit_zones[3] = "SERVICE_TUNNELS"
    udg_hatch_exit_zones[4] = "CARGO_A"
    udg_hatch_exit_zones[5] = "CARGO_A_VENT"
    udg_hatch_exit_zones[6] = "SERVICE_TUNNELS"
    udg_hatch_exit_zones[7] = "BIOLOGY"
    udg_hatch_exit_zones[8] = "SERVICE_TUNNELS"
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
    udg_jump_pass_zones[3] = gg_rct_JumpPassBridgeVents
    udg_jump_pass_zones[4] = gg_rct_JumpBassBridge
    udg_jump_pass_zones_name[3] = "BRIDGE_VENT"
    udg_jump_pass_zones_name[4] = "BRIDGE"
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
    udg_power_generators[4] = gg_unit_h004_0061
    udg_power_generators[5] = gg_unit_h004_0061
    udg_power_generator_zones[4] = "BRIDGE"
    udg_power_generator_zones[5] = "BRIDGE_VENT"
end

function InitTrig_SetPowerGenerators()
    gg_trg_SetPowerGenerators = CreateTrigger()
    TriggerAddAction(gg_trg_SetPowerGenerators, Trig_SetPowerGenerators_Actions)
end

function Trig_SetShipZones_Actions()
    udg_ship_zones[1] = gg_rct_ShipBay01
    udg_ship_zones[2] = gg_rct_ShipBay02
    udg_ship_zones[3] = gg_rct_ShipBay03
    udg_ship_zones[4] = gg_rct_ShipBay04
end

function InitTrig_SetShipZones()
    gg_trg_SetShipZones = CreateTrigger()
    TriggerAddAction(gg_trg_SetShipZones, Trig_SetShipZones_Actions)
end

function Trig_SetCollisionData_Actions()
    udg_collision_item = gg_item_ratf_0230
    udg_collision_rect = gg_rct_CollisionCheckZone
    udg_pathing_rect = gg_rct_pathingRect
    SetItemVisibleBJ(false, udg_collision_item)
end

function InitTrig_SetCollisionData()
    gg_trg_SetCollisionData = CreateTrigger()
    TriggerAddAction(gg_trg_SetCollisionData, Trig_SetCollisionData_Actions)
end

function InitCustomTriggers()
    InitTrig_SetKillzones()
    InitTrig_LightsPerFloor()
    InitTrig_Set()
    InitTrig_SetHatch()
    InitTrig_SetFall()
    InitTrig_SetPowerGenerators()
    InitTrig_SetShipZones()
    InitTrig_SetCollisionData()
end

function RunInitializationTriggers()
    ConditionalTriggerExecute(gg_trg_SetKillzones)
    ConditionalTriggerExecute(gg_trg_LightsPerFloor)
    ConditionalTriggerExecute(gg_trg_Set)
    ConditionalTriggerExecute(gg_trg_SetHatch)
    ConditionalTriggerExecute(gg_trg_SetFall)
    ConditionalTriggerExecute(gg_trg_SetPowerGenerators)
    ConditionalTriggerExecute(gg_trg_SetShipZones)
    ConditionalTriggerExecute(gg_trg_SetCollisionData)
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
    SetStartLocPrioCount(0, 8)
    SetStartLocPrio(0, 0, 1, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(0, 1, 2, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(0, 2, 3, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(0, 3, 4, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(0, 4, 5, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(0, 5, 6, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(0, 6, 8, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(0, 7, 9, MAP_LOC_PRIO_HIGH)
    SetStartLocPrioCount(1, 8)
    SetStartLocPrio(1, 0, 0, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(1, 1, 2, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(1, 2, 3, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(1, 3, 4, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(1, 4, 5, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(1, 5, 6, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(1, 6, 8, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(1, 7, 9, MAP_LOC_PRIO_HIGH)
    SetStartLocPrioCount(2, 8)
    SetStartLocPrio(2, 0, 0, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(2, 1, 1, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(2, 2, 3, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(2, 3, 4, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(2, 4, 5, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(2, 5, 6, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(2, 6, 8, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(2, 7, 9, MAP_LOC_PRIO_HIGH)
    SetStartLocPrioCount(3, 8)
    SetStartLocPrio(3, 0, 0, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(3, 1, 1, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(3, 2, 2, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(3, 3, 4, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(3, 4, 5, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(3, 5, 6, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(3, 6, 8, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(3, 7, 9, MAP_LOC_PRIO_HIGH)
    SetStartLocPrioCount(4, 8)
    SetStartLocPrio(4, 0, 0, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(4, 1, 1, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(4, 2, 2, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(4, 3, 3, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(4, 4, 5, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(4, 5, 6, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(4, 6, 8, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(4, 7, 9, MAP_LOC_PRIO_HIGH)
    SetStartLocPrioCount(5, 8)
    SetStartLocPrio(5, 0, 0, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(5, 1, 1, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(5, 2, 2, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(5, 3, 3, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(5, 4, 4, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(5, 5, 6, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(5, 6, 8, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(5, 7, 9, MAP_LOC_PRIO_HIGH)
    SetStartLocPrioCount(6, 8)
    SetStartLocPrio(6, 0, 0, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(6, 1, 1, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(6, 2, 2, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(6, 3, 3, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(6, 4, 4, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(6, 5, 5, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(6, 6, 8, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(6, 7, 9, MAP_LOC_PRIO_HIGH)
    SetStartLocPrioCount(7, 9)
    SetStartLocPrio(7, 0, 0, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(7, 1, 1, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(7, 2, 2, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(7, 3, 3, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(7, 4, 4, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(7, 5, 5, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(7, 6, 6, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(7, 7, 8, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(7, 8, 9, MAP_LOC_PRIO_HIGH)
    SetStartLocPrioCount(8, 8)
    SetStartLocPrio(8, 0, 0, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(8, 1, 1, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(8, 2, 2, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(8, 3, 3, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(8, 4, 4, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(8, 5, 5, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(8, 6, 6, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(8, 7, 9, MAP_LOC_PRIO_HIGH)
    SetStartLocPrioCount(9, 8)
    SetStartLocPrio(9, 0, 0, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(9, 1, 1, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(9, 2, 2, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(9, 3, 3, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(9, 4, 4, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(9, 5, 5, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(9, 6, 6, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(9, 7, 8, MAP_LOC_PRIO_HIGH)
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
    DefineStartLocation(1, 0.0, 256.0)
    DefineStartLocation(2, 0.0, 256.0)
    DefineStartLocation(3, 0.0, 256.0)
    DefineStartLocation(4, 0.0, 256.0)
    DefineStartLocation(5, 0.0, 256.0)
    DefineStartLocation(6, 0.0, 256.0)
    DefineStartLocation(7, -27520.0, 26176.0)
    DefineStartLocation(8, 0.0, 256.0)
    DefineStartLocation(9, 0.0, 256.0)
    DefineStartLocation(10, 0.0, 256.0)
    DefineStartLocation(11, 4032.0, 19776.0)
    DefineStartLocation(12, 0.0, 256.0)
    DefineStartLocation(13, 22336.0, 28672.0)
    InitCustomPlayerSlots()
    InitCustomTeams()
    InitAllyPriorities()
end

