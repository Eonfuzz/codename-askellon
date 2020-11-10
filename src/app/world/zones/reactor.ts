import { ShipZone } from "../zone-types/ship-zone";
import { Unit, Effect, Destructable, MapPlayer } from "w3ts/index";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { SoundRef } from "app/types/sound-ref";
import { AskellonEntity } from "app/station/askellon-entity";
import { Log } from "lib/serilog/serilog";
import { ZONE_TYPE } from "../zone-id";
import { ITEM_MINERAL_REACTIVE, ITEM_MINERAL_VALUABLE } from "resources/item-ids";
import { AskellonShip } from "app/space/ships/askellon-type";
import { EventEntity } from "app/events/event-entity";
import { EVENT_TYPE } from "app/events/event-enum";
import { TECH_MINERALS_PROGRESS } from "resources/ability-ids";
import { MessageAllPlayers } from "lib/utils";
import { COL_GOLD, COL_TEAL } from "resources/colours";
import { ResearchFactory } from "app/research/research-factory";

declare const gg_rct_reactoritemleft: rect;
declare const gg_rct_reactoritemright: rect;
declare const gg_rct_powercoresfx: rect;

export class ReactorZone extends ShipZone {

    private reactorLoop = new SoundRef("Sounds\\ReactorLoop.ogg", true, true);
    private sfx: Effect;


    constructor(id: ZONE_TYPE) {
        super(id);

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
        super.step(delta);
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
        const itemOwner = MapPlayer.fromIndex( GetItemUserData(item) );
        const oldMineralCount = AskellonEntity.getInstance().mineralsDelivered;

        // If it is blue minerals
        if (type === ITEM_MINERAL_REACTIVE) {
            // Increase max power by 1
            AskellonEntity.getInstance().maxPower += Math.floor(iStacks / 5);
            // Slight power regeneration increase
            AskellonEntity.getInstance().currentPower += 1;

            AskellonEntity.getInstance().mineralsDelivered += iStacks;
            itemOwner.setState(
                PLAYER_STATE_RESOURCE_GOLD, 
                itemOwner.getState(PLAYER_STATE_RESOURCE_GOLD) + 1 * iStacks
            );
            // Log.Information("Blue minerals : "+iStacks);
        }
        else if (type == ITEM_MINERAL_VALUABLE) {
            // TODO HEAL REACTOR
            // // Increase max power by 1
            AskellonEntity.getInstance().askellonUnit.life += 5 * iStacks;
            
            AskellonEntity.getInstance().mineralsDelivered += iStacks;
            itemOwner.setState(
                PLAYER_STATE_RESOURCE_GOLD, 
                itemOwner.getState(PLAYER_STATE_RESOURCE_GOLD) + 4 * iStacks
            );
            // // Slight power regeneration increase
            // AskellonEntity.getInstance().powerRegeneration += 0.05 * iStacks;
            // Log.Information("Green minerals : "+iStacks);
        }
        else {
            // Just refund 10 for now, whatever blizzard
            // const itemCost = 10;
            // Add 5 power for now
            AskellonEntity.addToPower(5);
        }

        const minerals = AskellonEntity.getInstance().mineralsDelivered;
        if (minerals >= 200 && oldMineralCount < 200) {
            ResearchFactory.getInstance().processMajorUpgrade(TECH_MINERALS_PROGRESS, 1);
        }
        if (minerals >= 400 && oldMineralCount < 400) {
            ResearchFactory.getInstance().processMajorUpgrade(TECH_MINERALS_PROGRESS, 2);
            MessageAllPlayers(`RAW MATERIALS QUOTA [${COL_GOLD}400/400|r] Reached`);
            MessageAllPlayers(`Restoring ${COL_GOLD}Askellon|r Engine functionality`);
        }

        RemoveItem(item);
    }
}