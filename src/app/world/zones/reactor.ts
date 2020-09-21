import { Zone, ShipZone } from "../zone-type";
import { Unit, Effect, Destructable } from "w3ts/index";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { SoundRef } from "app/types/sound-ref";
import { AskellonEntity } from "app/station/askellon-entity";
import { Log } from "lib/serilog/serilog";
import { ZONE_TYPE } from "../zone-id";
import { ITEM_MINERAL_REACTIVE, ITEM_MINERAL_VALUABLE } from "resources/item-ids";

declare const gg_rct_reactoritemleft: rect;
declare const gg_rct_reactoritemright: rect;
declare const gg_rct_powercoresfx: rect;

export class ReactorZone extends ShipZone {

    private reactorLoop = new SoundRef("Sounds\\ReactorLoop.ogg", true, true);
    private sfx: Effect;


    constructor(id: ZONE_TYPE, exits?) {
        super(id, exits);

        this.sfx =  new Effect("Models\\Mythic_Sun.mdx", GetRectCenterX(gg_rct_powercoresfx) + 22, GetRectCenterY(gg_rct_powercoresfx) + 40);
        this.sfx.z = 180;
        this.sfx.scale = 0.6;
        this.sfx.setTimeScale(0.1);
    }
    
    public onLeave(unit: Unit) {
        super.onLeave(unit);

        
        const crewmember = PlayerStateFactory.getCrewmember(unit.owner);
        const isCrew = crewmember && crewmember.unit === unit;

        if (isCrew && crewmember && GetLocalPlayer() === unit.owner.handle) {
            // Stop Play music
            this.reactorLoop.stopSound();
            SetMusicVolume(20);
        }
    }

    public onEnter(unit: Unit) {
        super.onEnter(unit);

        
        const crewmember = PlayerStateFactory.getCrewmember(unit.owner);
        const isCrew = crewmember && crewmember.unit === unit;

        if (isCrew && crewmember && GetLocalPlayer() === unit.owner.handle) {
            // Stop Play music
            this.reactorLoop.setVolume(60);
            this.reactorLoop.playSound();
            SetMusicVolume(15);
        }
    }

    public step(delta: number) {
        EnumItemsInRect(gg_rct_reactoritemleft, Filter(() => true), () => {
            this.processItem(GetEnumItem());
        });
        EnumItemsInRect(gg_rct_reactoritemright, Filter(() => true), () => {
            this.processItem(GetEnumItem());
        });

        const tint = 155 + MathRound(AskellonEntity.getPowerPercent() * 100);
        this.sfx.setColor(tint, tint, tint);
        this.sfx.scale = 0.4 + AskellonEntity.getPowerPercent() * 0.6;
    }

    private processItem(item: item) {
        const type = GetItemTypeId(item);
        const iStacks = GetItemCharges(item);
        // If it is blue minerals
        if (type === ITEM_MINERAL_REACTIVE) {
            // Increase max power by 1
            AskellonEntity.getInstance().maxPower += 1 * iStacks;
            // Slight power regeneration increase
            AskellonEntity.getInstance().powerRegeneration += 0.01 * iStacks;
            Log.Information("Blue minerals : "+iStacks);
        }
        else if (type == ITEM_MINERAL_VALUABLE) {
            // TODO HEAL REACTOR
            // // Increase max power by 1
            // AskellonEntity.getInstance().maxPower += 2 * iStacks;
            // // Slight power regeneration increase
            // AskellonEntity.getInstance().powerRegeneration += 0.05 * iStacks;
            Log.Information("Green minerals : "+iStacks);
        }
        else {
            // Just refund 10 for now, whatever blizzard
            // const itemCost = 10;
            // Add 5 power for now
            AskellonEntity.addToPower(5);
        }
        RemoveItem(item);
    }
}