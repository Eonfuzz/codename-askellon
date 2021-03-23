import { AbilityWithDone } from "../ability-type";
import { Unit } from "w3ts/handles/unit";
import { VISION_TYPE } from "app/vision/vision-type";
import { WorldEntity } from "app/world/world-entity";
import { CrewFactory } from "app/crewmember/crewmember-factory";
import { VisionFactory } from "app/vision/vision-factory";
import { DynamicBuffEntity } from "app/buff/dynamic-buff-entity";
import { BUFF_ID } from "resources/buff-ids";
import { BuffInstanceDuration } from "app/buff/buff-instance-duration-type";
import { EventEntity } from "app/events/event-entity";
import { Gun } from "app/weapons/guns/gun";
import { Crewmember } from "app/crewmember/crewmember-type";
import { Timers } from "app/timer-type";
import { ABIL_GENE_XENOPHOBIC_PUNCH } from "resources/ability-ids";
import { Log } from "lib/serilog/serilog";
import { PlayNewSoundOnUnit } from "lib/translators";
import { SFX_AVATAR } from "resources/sfx-paths";
import { getZFromXY } from "lib/utils";
import { TooltipEntity } from "app/tooltip/tooltip-module";
import { TOOLTIP_FISTS } from "resources/ability-tooltips";
import { GunItem } from "app/weapons/guns/gun-item";

const comeGetSomePath = "Sounds\\ComeGetSome.mp3";
Preload(comeGetSomePath);

export class XenophobicAbility extends AbilityWithDone {

    private unit: Unit | undefined;
    private timeElapsed: number = 0;
    private maxDuration: number = 30;

    private hasGainedResolve: boolean = false;
    private gainResolveAt = 1;

    private equippedGun: GunItem;
    private crewmember: Crewmember;

    private abilTooltipHandle: number;


    

    public init() {
        super.init();
        this.unit = Unit.fromHandle(GetTriggerUnit());
        PlayNewSoundOnUnit(comeGetSomePath, this.unit, 80);

        const crew = CrewFactory.getInstance().getCrewmemberForUnit(this.unit);

        if (crew) {
            this.crewmember = crew;
            if (crew.weapon) {
                this.equippedGun = crew.weapon;
                this.equippedGun.onRemove();
            }
        }

        this.unit.addAnimationProps("alternate", true);

        return true;
    };

    public step(delta: number) {
        if (this.timeElapsed === 0) {
            this.unit.addAbility(ABIL_GENE_XENOPHOBIC_PUNCH);

            let sfx = AddSpecialEffect(SFX_AVATAR, this.unit.x, this.unit.y);
            BlzSetSpecialEffectZ(sfx, getZFromXY(this.unit.x, this.unit.y)+20);
            // BlzSetSpecialEffectAlpha(sfx, 40);
            BlzSetSpecialEffectScale(sfx, 1.5);
            BlzSetSpecialEffectTimeScale(sfx, 0.5);
            BlzSetSpecialEffectTime(sfx, 0.2);
            BlzSetSpecialEffectYaw(sfx, this.unit.facing * bj_DEGTORAD);
            DestroyEffect(sfx);

            TooltipEntity.getInstance().registerTooltip(this.unit, TOOLTIP_FISTS);
        }
        this.timeElapsed += delta;

        // this.unit.setAnimation(6);
        if (!this.hasGainedResolve && this.timeElapsed >= this.gainResolveAt) {
            this.hasGainedResolve = true;
            DynamicBuffEntity.add(BUFF_ID.RESOLVE, this.unit, new BuffInstanceDuration(this.unit, 29));
        }
        if (this.crewmember && this.crewmember.weapon) {
            this.crewmember.weapon.onRemove();
        }
        if (this.timeElapsed >= this.maxDuration) 
            this.done = true; 
    };

    public destroy() { 
        if (this.unit) {
            this.unit.addAnimationProps("alternate", false);
            this.unit.removeAbility(ABIL_GENE_XENOPHOBIC_PUNCH);
            TooltipEntity.getInstance().unregisterTooltip(this.unit, TOOLTIP_FISTS);

            const z = WorldEntity.getInstance().getUnitZone(this.unit);
            const crew = CrewFactory.getInstance().getCrewmemberForUnit(this.unit);

            // Check if unit has gun
            if (crew && this.equippedGun && UnitHasItem(this.unit.handle, this.equippedGun.item)) {
                this.equippedGun.onAdd(crew);

                // Remove any attack cooldowns from the weapon
                Timers.addTimedAction(0.00, () => 
                    BlzStartUnitAbilityCooldown(this.crewmember.unit.handle, this.equippedGun.getAbilityId(), 0)
                );
            }
        }
        return true;
    };
}