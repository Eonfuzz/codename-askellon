import { ZONE_TYPE, ZONE_TYPE_TO_ZONE_NAME } from "../zone-id";
import { Log } from "../../../lib/serilog/serilog";

import { Unit } from "w3ts/handles/unit";
import { MapPlayer, Timer, Region, Rectangle } from "w3ts";
import { Vector2 } from "app/types/vector2";

export class Zone {
    public id: ZONE_TYPE;

    // Adjacent zones UNUSED
    protected adjacent: Array<Zone> = [];
    protected unitsInside: Array<Unit> = [];

    protected zoneRegion: Region;
    protected allRects: rect[] = [];

    constructor(id: ZONE_TYPE) {
        this.id = id;
        
        this.zoneRegion = new Region();

        try {
            // We need to scan _g to find rects that match us
            let strId = ZONE_TYPE[this.id].toLowerCase();
            while (strId.indexOf('_') >= 0) {
                strId = strId.replace('_', '');
            }
            const namespaceVarName = `gg_rct_zone${strId}`;

            let idx = 1;
            let namespaceCheck = `${namespaceVarName}${idx++}`;
            while (_G[namespaceCheck]) {
                // if (this.id === ZONE_TYPE.PLANET) Log.Information("Found planet zone! "+namespaceCheck);
                const rect = _G[namespaceCheck] as rect;
                this.addRegion(rect);
                namespaceCheck = `${namespaceVarName}${idx++}`;
            }
        }
        catch(e) {
            Log.Error("Reading regions fail");
            Log.Error(e);
        }
    }

    protected addRegion(r: rect) {
        this.zoneRegion.addRect(Rectangle.fromHandle(r));
        this.allRects.push(r);
    }

    public pointIsInZone(x: number, y: number): boolean {
        if (this.allRects.length === 0) return false;
        else return this.zoneRegion.containsCoords(x, y);
    }

    /**
     * Margin is how far away from the walls it should be
     * @param margin 
     */
    public getRandomPointInZone(margin: number = 0): Vector2 {
        if (this.allRects.length === 0) return new Vector2(0,0);
        const idx = GetRandomInt(0, this.allRects.length - 1);
        const rect = this.allRects[idx];
        return new Vector2(GetRandomReal(GetRectMinX(rect)+margin, GetRectMaxX(rect)-margin), GetRandomReal(GetRectMinY(rect)+margin, GetRectMaxY(rect)-margin));
    }

    /**
     * Unit enters the zone
     * @param unit 
     */
    public onLeave(unit: Unit) {
        const idx = this.unitsInside.indexOf(unit);
        if (idx >= 0) this.unitsInside.splice(idx, 1);
        // else Log.Warning("Failed to remove unit "+unit.name+" from "+this.id);
    }

    /**
     * Unit leaves the zone
     * @param unit 
     */
    public onEnter(unit: Unit) {
        this.unitsInside.push(unit);
    }

    public displayEnteringMessage(player: MapPlayer) {
        DisplayTextToPlayer(player.handle, 0, 0, `Entering ${ZONE_TYPE_TO_ZONE_NAME.get(this.id)}`);
    }


    /** Does nothing by default */
    public step(delta: number) {}

    /**
     * Returns all players present in a zone
     */
    public getPlayersInZone() {
        try { 
            const players = [];

            for (let index = 0; index < this.unitsInside.length; index++) {
                const u = this.unitsInside[index];
                if (!u.isHero() && !u.isAlive()) {
                    // Time to remove this unit?
                    const idx = this.unitsInside.indexOf(u);
                    if (idx >= 0) this.unitsInside.splice(idx, 1);

                    // Log.Verbose(`Removing undefined // killed unit from ${this.id}`);
                    index--;
                }
                else {
                    // Otherwise push the player to the array
                    players.push(u.owner);
                }
            }

            return players.filter(function(elem, index, self) {
                return index === self.indexOf(elem);
            });
        }
        catch (e) {
            Log.Error("Failed to get players in zone "+this.id);
            Log.Error(e);
            return [];
        }
    }

    public doCauseFear() { return false; }

    public debug() {
        Log.Information(`Zone ${this.id} -> Units Inside: ${this.unitsInside.length}`);
    }
}
