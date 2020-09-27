import { ZONE_TYPE, ZONE_TYPE_TO_ZONE_NAME } from "../zone-id";
import { Log } from "../../../lib/serilog/serilog";

import { Unit } from "w3ts/handles/unit";
import { MapPlayer, Timer, Region, Rectangle } from "w3ts";
import { VisionFactory } from "app/vision/vision-factory";
import { CREWMEMBER_UNIT_ID, DESTR_ID_POWERED_LIGHT_BLUE, DESTR_ID_POWERED_LIGHT_RED, DESTR_ID_POWERED_LIGHT_WHITE, DESTR_ID_POWERED_LIGHT_GREEN } from "resources/unit-ids";
import { Zone } from "./zone-type";

export abstract class ZoneWithExits extends Zone {
    // The exits to and from this zone
    protected exits: Array<Unit> = [];
    protected playerLightingModifiers = new Map<MapPlayer, number>();


    constructor(id: ZONE_TYPE) {
        super(id);
    }
    public addExit(whichExit: Unit) {
        this.exits.push(whichExit);
    }

    public setExits(to: Unit[]) {
        this.exits = to;
    }

    protected addRegion(r: rect) {
        super.addRegion(r);
    }

    public onLeave(unit: Unit) {
        super.onLeave(unit);

        if (unit.typeId === CREWMEMBER_UNIT_ID) {

            // Remove the existing modifier (if any)
            if (this.playerLightingModifiers.has(unit.owner)) {
                const mod = this.playerLightingModifiers.get(unit.owner);
                this.playerLightingModifiers.delete(unit.owner);
                VisionFactory.getInstance().removeVisionModifier(mod);
            }

            // If no oxy remove oxy loss
            // TODO
            // If no power remove power loss
            // Remove shared vision of exits
            this.exits.forEach(exit => {
                // Log.Information("Removing exit vision "+exit.name);
                exit.shareVision(unit.owner, false);
            });
        }
    }

    public onEnter(unit: Unit) {
        super.onEnter(unit);

        if (unit.typeId === CREWMEMBER_UNIT_ID) {
            // Log.Information("Sharing exit vision");
            this.exits.forEach(exit => {
                // Log.Information(exit.name);
                exit.shareVision(unit.owner, true);
            });
        }
    }

    public step(delta: number) {
    }
}