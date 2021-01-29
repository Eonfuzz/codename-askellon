import { VISION_PENALTY, VISION_STATE, VISION_TYPE } from "./vision-type";
import { MapPlayer, Unit, Effect } from "w3ts/index";
import { Log } from "lib/serilog/serilog";
import { Hooks } from "lib/Hooks";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { SFX_FLASHLIGHT } from "resources/sfx-paths";


export class VisionFactory {
    private static instance: VisionFactory;

    public static getInstance() {        
        if (this.instance == null) {
            this.instance = new VisionFactory();
            Hooks.set(this.name, this.instance);
        }
        return this.instance;
    }


    // Player base vision types
    private playerVisionType = new Map<MapPlayer, VISION_TYPE>();
    // Calculate vision state
    private playerVisionState = new Map<MapPlayer, VISION_STATE>();
    private playerFlashlightEffect = new Map<MapPlayer, Effect>();

    // Vision penalties need to be by player
    private activeModifiers = new Map<MapPlayer, VISION_PENALTY[]>();
    private allModifiersByIndex = new Map<number, { player: MapPlayer, penalty: VISION_PENALTY }>();

    private index = 0;
    public addVisionModifier(penalty: VISION_PENALTY, forWho: Unit | MapPlayer): number {

        let forPlayer = forWho instanceof Unit 
            ? forWho.owner 
            : forWho;

        const modifiers = this.activeModifiers.has(forPlayer) 
            ? this.activeModifiers.get(forPlayer)
            : [];
        
        modifiers.push(penalty);
        this.activeModifiers.set(forPlayer, modifiers);

        let idx = this.index++;
        this.allModifiersByIndex.set(idx, {
            player: forPlayer,
            penalty: penalty
        });

        // Log.Information(forWho.name+" ADD "+VISION_PENALTY[penalty]);
        this.calculateVision(forPlayer);

        // Return out modifier index
        return idx;
    }


    public removeVisionModifier(idx: number) {
        if (!this.allModifiersByIndex.has(idx)) Log.Warning("Removing vision modifier "+idx+" but idx does not exist");
        else {
            const mod = this.allModifiersByIndex.get(idx);
            const mods = this.activeModifiers.get(mod.player);
            const modIdx = mods.indexOf(mod.penalty);

            mods.splice(modIdx, 1);
            this.calculateVision(mod.player);
        }
    }

    /**
     * Calcualtes the new vision state of a player
     * @param forWho 
     */
    public calculateVision(forWho: MapPlayer) {
        const visionType = this.playerVisionType.get(forWho);
        const oldState = this.playerVisionState.get(forWho);

        // Now calculate "lowest" penalty
        const allModifiers = this.activeModifiers.get(forWho) || [];
        const sortedMods = allModifiers.sort((a, b) => {
            if (a === b) return 0;
            return a < b ? -1 : 1;
        });

        const lowestModifier = sortedMods[0];
        let newVisionState = VISION_STATE.NORMAL;

        if (lowestModifier === VISION_PENALTY.TERRAIN_DARK_AREA) {
            if (visionType === VISION_TYPE.HUMAN) newVisionState = VISION_STATE.DARK;
            else newVisionState = VISION_STATE.ALIEN_DARK;
        }
        else if (lowestModifier === VISION_PENALTY.SUPERNATURAL_DARKNESS) {
            newVisionState = VISION_STATE.DARK;
        }
        this.playerVisionState.set(forWho, newVisionState);
        this.applyVision(forWho);
    }


    private applyVision(forWho: MapPlayer) {
        const visionType = this.playerVisionType.get(forWho);
        const state = this.playerVisionState.get(forWho);

        let p1;
        let p2;
        
        if (state === VISION_STATE.NORMAL) {
            p1 = "Environment\\DNC\\DNCLordaeron\\DNCLordaeronTerrain\\DNCLordaeronTerrain.mdl";
            p2 = "Environment\\DNC\\DNCLordaeron\\DNCLordaeronUnit\\DNCLordaeronUnit.mdl";
            const crew = PlayerStateFactory.getCrewmember(forWho);
            if (crew && this.playerFlashlightEffect.has(forWho)) {
                const sfx = this.playerFlashlightEffect.get(forWho);
                sfx.destroy();
                this.playerFlashlightEffect.delete(forWho);
            }
        }
        else if (state === VISION_STATE.DARK) {
            p1 = "";
            p2 = "";
            const crew = PlayerStateFactory.getCrewmember(forWho);
            if (crew && !this.playerFlashlightEffect.has(forWho)) {
                this.playerFlashlightEffect.set(forWho, new Effect(SFX_FLASHLIGHT, crew.unit, "hand, right"));
            }
        }
        else if (state == VISION_STATE.ALIEN_DARK) {
            p1 = "war3mapImported\\NiteVisionModelRed.mdx";
            p2 = "war3mapImported\\NiteVisionModelRed.mdx";
            const crew = PlayerStateFactory.getCrewmember(forWho);
            if (crew && !this.playerFlashlightEffect.has(forWho)) {
                this.playerFlashlightEffect.set(forWho, new Effect(SFX_FLASHLIGHT, crew.unit, "hand, right"));
            }
        }

        if (GetLocalPlayer() === forWho.handle) {
            SetDayNightModels(p1, p2);
        }
    }

    public setPlayervision(forWho: MapPlayer, to: VISION_TYPE) {
        this.playerVisionType.set(forWho, to);
        this.calculateVision(forWho);
        this.applyVision(forWho);
    }

    public getPlayerVision(forWho: MapPlayer) {
        return this.playerVisionType.get(forWho);
    }
}