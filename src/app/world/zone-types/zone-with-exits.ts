import { ZONE_TYPE, ZONE_TYPE_TO_ZONE_NAME } from "../zone-id";
import { Log } from "../../../lib/serilog/serilog";

import { Unit } from "w3ts/handles/unit";
import { MapPlayer, Timer, Region, Rectangle } from "w3ts";
import { VisionFactory } from "app/vision/vision-factory";
import { CREWMEMBER_UNIT_ID, DESTR_ID_POWERED_LIGHT_BLUE, DESTR_ID_POWERED_LIGHT_RED, DESTR_ID_POWERED_LIGHT_WHITE, DESTR_ID_POWERED_LIGHT_GREEN } from "resources/unit-ids";
import { Zone } from "./zone-type";

export interface pathway { entrance: Unit, exit: Unit, leadsTo: Zone };

export abstract class ZoneWithExits extends Zone {
    // The exits to and from this zone
    protected pathway: Array<pathway> = [];
    protected playerLightingModifiers = new Map<number, number>();


    constructor(id: ZONE_TYPE) {
        super(id);
    }

    public getPathways() {
        return this.pathway;
    }

    public addPathway(whichExit: pathway) {
        this.pathway.push(whichExit);
    }

    public setPathways(to: pathway[]) {
        this.pathway = to;
    }

    protected addRegion(r: rect) {
        super.addRegion(r);
    }

    public onLeave(unit: Unit) {
        super.onLeave(unit);

        if (unit.typeId === CREWMEMBER_UNIT_ID) {

            const p = unit.owner;

            // Remove the existing modifier (if any)
            if (this.playerLightingModifiers.has(p.id)) {
                const mod = this.playerLightingModifiers.get(p.id);
                this.playerLightingModifiers.delete(p.id);
                VisionFactory.getInstance().removeVisionModifier(mod);
            }

            // If no oxy remove oxy loss
            // TODO
            // If no power remove power loss
            // Remove shared vision of exits
            this.pathway.forEach(pathway => {
                // Log.Information("Removing exit vision "+exit.name);
                pathway.entrance.shareVision(unit.owner, false);
            });
        }
    }

    public onEnter(unit: Unit) {
        super.onEnter(unit);

        if (unit.typeId === CREWMEMBER_UNIT_ID) {
            // Log.Information("Sharing exit vision");
            this.pathway.forEach(pathway => {
                // Log.Information(exit.name);
                pathway.entrance.shareVision(unit.owner, true);
            });
        }
    }

    public step(delta: number) {
    }
    
    public debug() {
        Log.Information(`Zone ${this.id} -> Units Inside: ${this.unitsInside.length} -> Modifiers: ${this.playerLightingModifiers.size}`);
    }
}