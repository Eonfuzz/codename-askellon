import { Zone } from "../zone-types/zone-type";
import { Unit, MapPlayer } from "w3ts/index";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { SoundRef } from "app/types/sound-ref";
import { ZONE_TYPE } from "../zone-id";
import { ALIEN_MINION_CANITE, ALIEN_MINION_FORMLESS, ALIEN_MINION_HYDRA, CREWMEMBER_UNIT_ID } from "resources/unit-ids";
import { ZoneWithExits } from "../zone-types/zone-with-exits";
import { VisionFactory } from "app/vision/vision-factory";
import { VISION_PENALTY } from "app/vision/vision-type";
import { FogEntity } from "app/vision/fog-entity";
import { Vector2 } from "app/types/vector2";
import { ITEM_MINERALS_VALUABLE_SHIP_ID, ITEM_MINERAL_VALUABLE } from "resources/item-ids";
import { ConveyorEntity } from "app/conveyor/conveyor-entity";
import { Log } from "lib/serilog/serilog";

export class PlanetZone extends ZoneWithExits {

    public lavaSound = new SoundRef("Sounds\\LavaLoop.mp3", true, true);

    constructor(id: ZONE_TYPE) {
        super(id);

        /**
         * Create planet neokatana guy and death
         */
        const numAlienCorpses = GetRandomInt(4,8);
        const possibleAlienUnits = [ALIEN_MINION_CANITE, ALIEN_MINION_FORMLESS, ALIEN_MINION_HYDRA];
        let center = new Vector2(GetRectCenterX(gg_rct_NeoWielderDeathZone), GetRectCenterY(gg_rct_NeoWielderDeathZone));
        for (let index = 0; index < numAlienCorpses; index++) {
            const x = GetRandomReal(GetRectMinX(gg_rct_NeoWielderDeathZone), GetRectMaxX(gg_rct_NeoWielderDeathZone));
            const y = GetRandomReal(GetRectMinY(gg_rct_NeoWielderDeathZone), GetRectMaxY(gg_rct_NeoWielderDeathZone));
            const uType = possibleAlienUnits[GetRandomInt(0, possibleAlienUnits.length-1)];
            const u = CreateUnit(PlayerStateFactory.NeutralPassive.handle, uType, x, y, new Vector2(x, y).angleTo(center));
            PauseUnit(u, true);
            SetUnitInvulnerable(u, true);
            UnitAddAbility(u, FourCC('Aloc'));
            SetUnitAnimation(u, "death");
            UnitRemoveAbility(u, FourCC('A01Z'));
            UnitRemoveAbility(u, FourCC('A01T'));
            UnitRemoveAbility(u, FourCC('A01Q'));
        }

        const areasToSpawnIn = [gg_rct_NeoWielderDeathZone2, gg_rct_NeoWielderDeathZone3, gg_rct_NeoWielderDeathZone4, gg_rct_NeoWielderDeathZone5, gg_rct_NeoWielderDeathZone6, gg_rct_NeoWielderDeathZone7, gg_rct_NeoWielderDeathZone8, gg_rct_NeoWielderDeathZone9];
        areasToSpawnIn.forEach(rect => {
            center = new Vector2(GetRectCenterX(rect), GetRectCenterY(rect));
            for (let index = 0; index < GetRandomInt(2,4); index++) {
                const x = GetRandomReal(GetRectMinX(rect), GetRectMaxX(rect));
                const y = GetRandomReal(GetRectMinY(rect), GetRectMaxY(rect));
                const uType = possibleAlienUnits[GetRandomInt(0, possibleAlienUnits.length-1)];
                const u = CreateUnit(PlayerStateFactory.NeutralPassive.handle, uType, x, y, GetRandomReal(0, 360));
                PauseUnit(u, true);
                SetUnitInvulnerable(u, true);
                UnitAddAbility(u, FourCC('Aloc'));
                SetUnitAnimation(u, "death");
                UnitRemoveAbility(u, FourCC('A01Z'));
                UnitRemoveAbility(u, FourCC('A01T'));
                UnitRemoveAbility(u, FourCC('A01Q'));
            }
        });
    }

    public onLeave(unit: Unit) {
        super.onLeave(unit);

        const crewmember = PlayerStateFactory.getCrewmember(unit.owner);
        const isCrew = crewmember && crewmember.unit === unit;

        if (isCrew && crewmember && GetLocalPlayer() === unit.owner.handle) {
            this.lavaSound.stopSound();
            // SetCameraBoundsToRectForPlayerBJ(unit.owner.handle, bj_mapInitialPlayableArea);
        }
        if (isCrew && crewmember) {
            FogEntity.reset(unit.owner, 1);
        }
    }

    public onEnter(unit: Unit) {
        super.onEnter(unit);

        const crewmember = PlayerStateFactory.getCrewmember(unit.owner);
        const isCrew = crewmember && crewmember.unit === unit;

        if (isCrew && crewmember && GetLocalPlayer() === unit.owner.handle) {
            this.lavaSound.playSound();
            SetCameraBoundsToRectForPlayerBJ(unit.owner.handle, gg_rct_zoneplanet);
            BlzChangeMinimapTerrainTex("minimap-planet.dds");
        }
        if (isCrew && crewmember) {
            this.applyVisionLoss(unit.owner);

            FogEntity.transition(unit.owner, {
                fStart: 850,
                fEnd: 3200,
                density: 1,
                r: 75, g: 25, b: 5
            }, 10);
        }
    }

    private spawnMineralTicker = 0;
    private ticker = 0;
    public step(delta: number) {
        super.step(delta);

        
        this.ticker += delta;
        this.spawnMineralTicker -= delta;

        if (this.ticker > 1) {
            this.ticker = 0;
            EnumItemsInRect(gg_rct_planetMineralEat, Filter(() => true), () => {
                RemoveItem(GetEnumItem());
            });
        }

        if (this.spawnMineralTicker <= 0) {
            const loc = new Vector2(
                GetRandomReal(GetRectMinX(gg_rct_planetMineralSpawn), GetRectMaxX(gg_rct_planetMineralSpawn)),
                GetRandomReal(GetRectMinY(gg_rct_planetMineralSpawn), GetRectMaxY(gg_rct_planetMineralSpawn))
            );
            const i = CreateItem(ITEM_MINERAL_VALUABLE, loc.x, loc.y);
            ConveyorEntity.check(i);
            this.spawnMineralTicker = GetRandomReal(0, 30);
        }
    }

    /**
     * Visible power changes for local player
     * Will also update player vision status
     * @param player 
     * @param hasPower 
     * @param justChanged 
     */
    applyVisionLoss(player: MapPlayer) {
        const playerDetails = PlayerStateFactory.get(player);

        // Remove the existing modifier (if any)
        if (this.playerLightingModifiers.has(player.id)) {
            const mod = this.playerLightingModifiers.get(player.id);
            this.playerLightingModifiers.delete(player.id);
            VisionFactory.getInstance().removeVisionModifier(mod);
        }

        this.playerLightingModifiers.set(player.id, 
            VisionFactory.getInstance().addVisionModifier(VISION_PENALTY.TERRAIN_DARK_AREA, player)
        );
    }
}