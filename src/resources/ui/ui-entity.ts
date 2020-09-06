import { Hooks } from "lib/Hooks";
import { Log } from "lib/serilog/serilog";
import { Healthbar } from "./widgets/healthbar";
import { UiWidget } from "./widgets/widget";
import { WIDGET_KEYS } from "./ui-keys";
import { Trigger, MapPlayer } from "w3ts/index";
import { Entity } from "app/entity-type";

export class UIEntity extends Entity {
    private static instance: UIEntity;

    public static getInstance() {        
        if (this.instance == null) {
            this.instance = new UIEntity();
            Hooks.set(this.name, this.instance);
        }
        return this.instance;
    }


    public static start() {
        this.getInstance().init();
    }

    private widgets: UiWidget[] = [];
    private widgetByKey = new Map<WIDGET_KEYS, UiWidget>();

    public init() {
        try {

            // Remove all our UI
            BlzHideOriginFrames(true);
            BlzFrameSetAllPoints(BlzGetOriginFrame(ORIGIN_FRAME_WORLD_FRAME, 0), BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0));
            BlzFrameSetVisible(BlzGetFrameByName("ConsoleUIBackdrop",0), false);
            // Show them all, one by one

            // Enable the Portrait
            // BlzFrameSetVisible(this.originPortraitFrame, true);
            // BlzFrameSetSize(this.originPortraitFrame, 1, 0.1);

            const healthbar = new Healthbar();
            this.widgetByKey.set(WIDGET_KEYS.UI_HEALTHBAR, healthbar);
            this.widgets.push(healthbar);
        }
        catch (e) {
            Log.Error("Error setting up ui");
            Log.Error(e);
        }
    }

    step() {
        const localPlayer = MapPlayer.fromLocal();
        for (let index = 0; index < this.widgets.length; index++) {
            this.widgets[index].update(localPlayer);
        }
        
    }
}