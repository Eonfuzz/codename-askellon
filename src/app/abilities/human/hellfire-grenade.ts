import { AbilityWithDone } from "../ability-type";
import { Vector2, vectorFromUnit } from "../../types/vector2";
import { Vector3 } from "../../types/vector3";
import { Projectile } from "../../weapons/projectile/projectile";
import { ProjectileTargetStatic, ProjectileMoverParabolic } from "../../weapons/projectile/projectile-target";
import { FilterIsEnemyAndAlive, FilterIsAlive } from "../../../resources/filters";
import { MapPlayer, Unit } from "w3ts";
import { getZFromXY } from "lib/utils";
import { BUFF_ID } from "resources/buff-ids";
import { SFX_HELLFIRE_GRENADE, SFX_FIRE_EXPLOSION } from "resources/sfx-paths";
import { WeaponEntity } from "app/weapons/weapon-entity";
import { ForceEntity } from "app/force/force-entity";
import { BuffInstanceDuration } from "app/buff/buff-instance-duration-type";
import { DynamicBuffEntity } from "app/buff/dynamic-buff-entity";
import { CrewFactory } from "app/crewmember/crewmember-factory";
import { Timers } from "app/timer-type";

const EXPLOSION_BASE_DAMAGE = 90;
const EXPLOSION_AOE = 300;


export class HellfireGrenadeAbility extends AbilityWithDone {

    private targetLoc: Vector3 | undefined;

    private castingPlayer: MapPlayer | undefined;

    private damageGroup = CreateGroup();

    

    public init() {
        super.init();
        this.casterUnit = Unit.fromHandle(GetTriggerUnit());
        this.castingPlayer = this.casterUnit.owner;

        this.targetLoc =  new Vector3(GetSpellTargetX(), GetSpellTargetY(), 0);
        this.targetLoc.z = getZFromXY(this.targetLoc.x, this.targetLoc.y);

        const polarPoint = vectorFromUnit(this.casterUnit.handle).applyPolarOffset(this.casterUnit.facing, 80);
        const startLoc = new Vector3(polarPoint.x, polarPoint.y, getZFromXY(polarPoint.x, polarPoint.y)+30);

        const deltaTarget = this.targetLoc.subtract(startLoc);       

        const projectile = new Projectile(
            this.casterUnit.handle,
            startLoc,
            new ProjectileTargetStatic(deltaTarget),
            new ProjectileMoverParabolic(startLoc, this.targetLoc, Deg2Rad(45))
        )
        .onDeath((proj: Projectile) => this.explode(proj.getPosition()))
        .onCollide(() => true);

        projectile.addEffect(SFX_HELLFIRE_GRENADE, new Vector3(0, 0, 0), deltaTarget.normalise(), 1);

        WeaponEntity.getInstance().addProjectile(projectile);

        return true;
    };

    private explode(atWhere: Vector3) {
        this.done = true;
        let sfx = AddSpecialEffect(SFX_FIRE_EXPLOSION, atWhere.x, atWhere.y);
        BlzSetSpecialEffectZ(sfx, getZFromXY(atWhere.x, atWhere.y)+50);
        Timers.addSlowTimedAction(7, () => {
            DestroyEffect(sfx);
        });
        
        if (this.castingPlayer) {
            GroupEnumUnitsInRange(
                this.damageGroup, 
                atWhere.x, 
                atWhere.y,
                EXPLOSION_AOE,
                FilterIsAlive(this.castingPlayer)
            );
            ForGroup(this.damageGroup, () => this.damageUnit());
        }
        return true;
    }

    public step(delta: number) {};

    private damageUnit() {
        if (this.casterUnit) {
            const unit = Unit.fromHandle(GetEnumUnit());

            // Check to make sure we are allowed aggression between the two teams
            const aggressionAllowed = this.casterUnit.owner === unit.owner 
                || ForceEntity.getInstance().aggressionBetweenTwoPlayers(
                    this.casterUnit.owner, 
                    unit.owner
                );

            // If we aren't allowed aggression we stop
            // Prevents griefing etc
            if (!aggressionAllowed) return;

            // Otherwise continue onwards
            const crew = CrewFactory.getInstance().getCrewmemberForUnit(unit);
            let damageMult = 1;
            if (crew) damageMult = crew.getDamageBonusMult();

            DynamicBuffEntity.getInstance().addBuff(
                BUFF_ID.FIRE, 
                unit,
                new BuffInstanceDuration(unit, 10)
            );
            
            this.casterUnit.damageTarget(
                unit.handle, 
                EXPLOSION_BASE_DAMAGE * damageMult, 
                true, 
                true, 
                ATTACK_TYPE_MAGIC, 
                DAMAGE_TYPE_ACID, 
                WEAPON_TYPE_WHOKNOWS
            )
        }
    }

    public destroy() { 
        DestroyGroup(this.damageGroup);
        return true; 
    };
}
