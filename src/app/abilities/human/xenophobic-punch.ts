import { Ability } from "../ability-type";
import { Unit } from "w3ts/handles/unit";
import { WorldEntity } from "app/world/world-entity";
import { CrewFactory } from "app/crewmember/crewmember-factory";
import { Vector2 } from "app/types/vector2";
import { getZFromXY } from "lib/utils";
import { LeapEntity } from "app/leap-engine/leap-entity";
import { Vector3 } from "app/types/vector3";
import { Leap } from "app/leap-engine/leap-type";
import { getYawPitchRollFromVector } from "lib/translators";
import { Quick } from "lib/Quick";
import { SFX_SHOCKWAVE } from "resources/sfx-paths";
import { FilterIsAlive } from "resources/filters";
import { ForceEntity } from "app/force/force-entity";
import { MapPlayer } from "w3ts/index";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { ALIEN_FORCE_NAME } from "app/force/forces/force-names";
import { AlienForce } from "app/force/forces/alien-force";

export const punchMessages = [
    "Welcome to Earth!",
    "I came here to kick butt and chew gum, looks like I'm all outta gum",
    "Eat shit and die",
    "Smile you son of a bitch",
    "You are one ugly motherfucker"
];

export class XenophobicPunchAbility implements Ability {

    private unit: Unit | undefined;
    private timeElapsed: number = 0;

    private targetLoc: Vector2;

    private hasDashed = false;
    private dashAt = 0.15;
    private dashDistance = 220;

    private searchGroup = CreateGroup();
    private unitsHit = CreateGroup();

    private finishedLeaping = false;
    private leapInstance: Leap;

    private sfx: { effect: effect, alpha: number }[] = [];
    private punchSfx: effect;
    private punchSfxOffset: Vector2;

    constructor() {}

    public initialise() {
        this.unit = Unit.fromHandle(GetTriggerUnit());
        this.targetLoc = new Vector2(GetSpellTargetX(), GetSpellTargetY());
        return true;
    };

    public process(delta: number) {
        if (this.timeElapsed == 0) {
            this.unit.pauseEx(true);
            this.unit.setAnimation(8);
            this.unit.setTimeScale(1.3);
        }
        this.timeElapsed += delta;

        if (this.timeElapsed >= this.dashAt && !this.hasDashed) {
            this.hasDashed = true;
            this.unit.setTimeScale(1.2);


            const unitLoc = Vector2.fromWidget(this.unit.handle);
            const leapVec =  unitLoc.add( this.targetLoc.subtract( unitLoc ).normalise().multiplyN(this.dashDistance * (this.unit.agility / 100)) );
            this.punchSfxOffset = this.targetLoc.subtract( unitLoc ).normalise().multiplyN(40);


            let sfx = AddSpecialEffect("war3mapImported\\DustWave.mdx", unitLoc.x, unitLoc.y);
            BlzSetSpecialEffectZ(sfx, getZFromXY(unitLoc.x, unitLoc.y));
            BlzSetSpecialEffectAlpha(sfx, 40);
            BlzSetSpecialEffectScale(sfx, 0.7);
            BlzSetSpecialEffectTimeScale(sfx, 1);
            BlzSetSpecialEffectTime(sfx, 0.2);
            BlzSetSpecialEffectYaw(sfx, GetRandomInt(0, 360));
            DestroyEffect(sfx);

            this.punchSfx = AddSpecialEffect(SFX_SHOCKWAVE, unitLoc.x, unitLoc.y);
            BlzSetSpecialEffectZ(this.punchSfx, getZFromXY(unitLoc.x, unitLoc.y));
            BlzSetSpecialEffectScale(this.punchSfx, 0.7);
            BlzSetSpecialEffectYaw(this.punchSfx, GetUnitFacing(this.unit.handle) * bj_DEGTORAD);
            
            this.leapInstance = LeapEntity.getInstance().newLeap(
                this.unit.handle,
                new Vector3(leapVec.x, leapVec.y, getZFromXY(unitLoc.x, unitLoc.y)),
                35,
                2.5
            );
            this.leapInstance.onFinish(() => {
                this.unit.setTimeScale(1);
                this.unit.pauseEx(false);
                this.unit.setAnimation(7);
                this.finishedLeaping = true;
                DestroyEffect(this.punchSfx);
            });
        }

        if (this.hasDashed && !this.finishedLeaping) {
            const loc = this.leapInstance.location;

            let sfx = AddSpecialEffect("war3mapImported\\testMarine.mdx", loc.x, loc.y);
            BlzSetSpecialEffectColorByPlayer(sfx, this.unit.owner.handle);
            BlzPlaySpecialEffect(sfx, ConvertAnimType(8));
            BlzSetSpecialEffectZ(sfx, loc.z);
            BlzSetSpecialEffectAlpha(sfx, 80);
            BlzSetSpecialEffectScale(sfx, 0.7);
            // BlzSetSpecialEffectTimeScale(sfx, 1);
            // BlzSetSpecialEffectTime(sfx, 0.2);
            BlzSetSpecialEffectYaw(sfx, GetUnitFacing(this.unit.handle) * bj_DEGTORAD);
            // DestroyEffect(sfx);
            Quick.Push(this.sfx, { effect: sfx, alpha: 80 });

            // Update punch sfx
            BlzSetSpecialEffectX(this.punchSfx, loc.x + this.punchSfxOffset.x);
            BlzSetSpecialEffectY(this.punchSfx, loc.y + this.punchSfxOffset.y);
            BlzSetSpecialEffectZ(this.punchSfx, loc.z + 15);

            // Now group all units infront and deal damage
            GroupEnumUnitsInRange(
                this.searchGroup, 
                loc.x + this.punchSfxOffset.x, 
                loc.y + this.punchSfxOffset.y,
                45,
                FilterIsAlive(this.unit.owner)
            );
            ForGroup(this.searchGroup, () => {
                const unit = GetEnumUnit();
                this.damage(unit);
            });
        }

        if (this.sfx.length > 0) {
            for (let index = 0; index < this.sfx.length; index++) {
                const element = this.sfx[index];
                element.alpha -= 220 * delta;
                if (element.alpha <= 0) {
                    BlzSetSpecialEffectAlpha(element.effect, 0);
                    DestroyEffect(element.effect);
                    Quick.Slice(this.sfx, index--);
                } else {
                    BlzSetSpecialEffectAlpha(element.effect, MathRound(element.alpha));
                }             
            }
        }

        return !(this.finishedLeaping && this.sfx.length === 0);
    };

    private damage(who: unit) {
        const p = MapPlayer.fromHandle(GetOwningPlayer(who));
        if (!ForceEntity.getInstance().aggressionBetweenTwoPlayers(this.unit.owner, p)) return;
        if (!IsUnitInGroup(who, this.unitsHit)) {
            // damage unit by 25
            UnitDamageTarget(this.unit.handle, 
                who, 
                30 + this.unit.maxLife * 0.1, 
                true, 
                true, 
                ATTACK_TYPE_MAGIC, 
                DAMAGE_TYPE_ACID, 
                WEAPON_TYPE_WHOKNOWS
            );
            GroupAddUnit(this.unitsHit, who);

            // If it's an alien form human we need to award max hp
            const pData = PlayerStateFactory.get(p);
            if (pData && pData.getForce() && pData.getForce().is(ALIEN_FORCE_NAME) && (pData.getForce() as AlienForce).getAlienFormForPlayer(p) === Unit.fromHandle(who)) {
                this.unit.maxLife += 1;
            }
        }
    }

    public destroy() {
        DestroyGroup(this.searchGroup);
        DestroyGroup(this.unitsHit);
        return true;
    };
}