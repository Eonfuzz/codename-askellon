import { EventEntity } from "app/events/event-entity";
import { EVENT_TYPE } from "app/events/event-enum";
import { ForceEntity } from "app/force/force-entity";
import { ALIEN_FORCE_NAME } from "app/force/forces/force-names";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { DummyCast } from "lib/dummy";
import { Log } from "lib/serilog/serilog";
import { getZFromXY } from "lib/utils";
import { ABIL_DEFILER_INFESTATION_APPLY } from "resources/ability-ids";
import { BUFF_ID, BUFF_ID_DEFILER_INFESATATION } from "resources/buff-ids";
import {  SFX_RED_SINGULARITY } from "resources/sfx-paths";
import { Effect, Group, Unit } from "w3ts/index";
import { BuffInstanceDuration } from "../buff-instance-duration-type";
import { DynamicBuff } from "../dynamic-buff-type";

export class DefilerInfestationBuff extends DynamicBuff {
    id = BUFF_ID.DEFILER_INFESTATION;

    protected doesStack = false;
    private source: Unit | undefined;

    public process(gametime: number, delta: number): boolean {
        const result =  super.process(gametime, delta);
        return result;
    }

    public onStatusChange(newStatus: boolean) {
        if (newStatus) {
            DummyCast((dummy: unit) => {
                SetUnitX(dummy, this.who.x);
                SetUnitY(dummy, this.who.y + 50);
                IssueTargetOrder(dummy, "faeriefire", this.who.handle);
            }, ABIL_DEFILER_INFESTATION_APPLY);
            this.source = this.getBuffSource();
            // Log.Information("Got source: "+this.source.name);
        }
        else {
            UnitRemoveBuffBJ(BUFF_ID_DEFILER_INFESATATION, this.who.handle);

            const sfx = new Effect(SFX_RED_SINGULARITY, this.who.x, this.who.y);
            sfx.z = getZFromXY(this.who.x, this.who.y) + 30;
            sfx.destroy();

            const g = new Group();
            const f = Filter(() => !IsUnitType(GetFilterUnit(), UNIT_TYPE_MECHANICAL));

            const buffSource = this.source;
            buffSource.damageTarget(this.who.handle, 50, false, false, ATTACK_TYPE_MAGIC, DAMAGE_TYPE_DEATH, WEAPON_TYPE_WHOKNOWS);
            
            g.enumUnitsInRange(this.who.x, this.who.y, 350, f);
            g.for(() => {
                const t = Unit.fromEnum();
                const f = PlayerStateFactory.get(t.owner);
                if (((f && f.getForce() && !f.getForce().is(ALIEN_FORCE_NAME))
                    || !PlayerStateFactory.isAlienAI(t.owner))
                    && t.handle != this.who.handle
                ) {
                    
                    buffSource.damageTarget(t.handle, 50, false, false, ATTACK_TYPE_MAGIC, DAMAGE_TYPE_DEATH, WEAPON_TYPE_WHOKNOWS);
                    EventEntity.send(EVENT_TYPE.ADD_BUFF_INSTANCE, {
                        source: buffSource,
                        data: {
                            buffId: BUFF_ID.DEFILER_INFESTATION,
                            instance: new BuffInstanceDuration(buffSource, 6),
                            target: t
                        }
                    });
                }
            });

            DestroyFilter(f);
            g.destroy();
        }
    }
}