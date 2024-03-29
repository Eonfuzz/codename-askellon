import { Crewmember } from "app/crewmember/crewmember-type";
import { Unit } from "w3ts/index";
import { DynamicTooltip } from "resources/ability-tooltips";
import { EventListener } from "app/events/event-type";
import { EventEntity } from "app/events/event-entity";
import { EVENT_TYPE } from "app/events/event-enum";
import { EventData } from "app/events/event-data";
import { Hooks } from "lib/Hooks";
import { Log } from "lib/serilog/serilog";

/**
 * Dynamic update of tooltips
 * Requires registing of tooltips and their events
 */
export class TooltipEntity {
    private static instance: TooltipEntity;

    public static getInstance() {        
        if (this.instance == null) {
            this.instance = new TooltipEntity();
            Hooks.set(this.name, this.instance);
        }
        return this.instance;
    }

    private tooltips = new Map<Unit | Crewmember, DynamicTooltip[]>();


    constructor() {
        // Update a tooltip for a single unit if it equips a weapon
        EventEntity.getInstance().addListener([
            new EventListener(EVENT_TYPE.WEAPON_EQUIP, (self, data) => this.updateTooltips(data)),
            // Update a tooltip for a single unit if it removes a weapon
            new EventListener(EVENT_TYPE.WEAPON_UNEQUIP, (self, data) => this.updateTooltips(data)),
            // Update a tooltip for a single unit if it levels up
            new EventListener(EVENT_TYPE.HERO_LEVEL_UP, (self, data) => this.updateTooltips(data)),
            // Update a tooltip for a single unit on a minor upgrade
            new EventListener(EVENT_TYPE.MINOR_UPGRADE_RESEARCHED, (self, data) => this.updateTooltips(data)),
            // Update a tooltip on alien transform
            new EventListener(EVENT_TYPE.CREW_BECOMES_ALIEN, (self, data) => this.updateTooltips(data)),
            // Update a tooltip on alien transform
            new EventListener(EVENT_TYPE.CREW_TRANSFORM_ALIEN, (self, data) => this.updateTooltips(data)),
            // Gene upgrade applied
            new EventListener(EVENT_TYPE.GENE_UPGRADE_INSTALLED, (self, data) => this.updateTooltips(data)),
            // Update a tooltip for all units on major upgrade
            new EventListener(EVENT_TYPE.MAJOR_UPGRADE_RESEARCHED, (self, data) => this.updateAllTooltip(data))
        ]);
    }

    /**
     * Updates all tooltips
     */
    updateAllTooltip(data: EventData) {
        this.tooltips.forEach((tooltips, u) => {
            tooltips.forEach(t => t.update(u, data));
        });
    }

    /**
     * Updates tooltips for a unit or crewmember
     * @param who 
     */
    updateTooltips(data: EventData) {
        const unitTooltips = data.source ? this.tooltips.get(data.source) : undefined;
        const crewTooltips = data.crewmember ? this.tooltips.get(data.crewmember) : undefined;

        // Now go through and update them
        if (unitTooltips) unitTooltips.forEach(t => t.update(data.source, data));
        if (crewTooltips) crewTooltips.forEach(t => t.update(data.crewmember, data));
    }

    /**
     * Registers a tooltip for updating
     * @param who 
     * @param tooltip 
     */
    registerTooltip(who: Unit, tooltip: DynamicTooltip)
    registerTooltip(who: Crewmember, tooltip: DynamicTooltip)
    registerTooltip(who: Unit | Crewmember, tooltip: DynamicTooltip) {
        const tooltipsForWho = this.tooltips.get(who) || [];
        tooltipsForWho.push(tooltip);
        this.tooltips.set(who, tooltipsForWho);
        tooltip.update(who, undefined);
    }

    /**
     * Removes a tooltip that requires updating
     * @param who 
     * @param tooltip 
     */
    unregisterTooltip(who: Unit, tooltip: DynamicTooltip)
    unregisterTooltip(who: Crewmember, tooltip: DynamicTooltip)
    unregisterTooltip(who: Unit | Crewmember, tooltip: DynamicTooltip) {
        if (this.tooltips.has(who)) {
            const tooltipsForWho = this.tooltips.get(who) || [];
            tooltipsForWho.splice(tooltipsForWho.indexOf(tooltip), 1);
            // Set or delete
            if (tooltipsForWho.length === 0) this.tooltips.delete(who);
            else this.tooltips.set(who, tooltipsForWho);
        }
        
    }
}