import { AbilityWithDone } from "../ability-type";
import { Vector2, vectorFromUnit } from "../../types/vector2";
import { SPRINT_BUFF_ID, TECH_MAJOR_VOID } from "resources/ability-ids";
import { Vector3 } from "app/types/vector3";
import { getZFromXY } from "lib/utils";
import { Unit } from "w3ts/index";
import { Projectile } from "app/weapons/projectile/projectile";
import { ProjectileTargetStatic, ProjectileMoverLinear } from "app/weapons/projectile/projectile-target";
import { SHIP_VOYAGER_UNIT } from "resources/unit-ids";
import { Ship } from "app/space/ships/ship-type";
import { PlayNewSoundOnUnit } from "lib/translators";
import { SFX_LASER_2, SFX_LASER_1 } from "resources/sfx-paths";
import { BUFF_ID } from "resources/buff-ids";
import { DynamicBuffEntity } from "app/buff/dynamic-buff-entity";
import { BuffInstanceDuration } from "app/buff/buff-instance-duration-type";
import { ResearchFactory } from "app/research/research-factory";
import { SpaceEntity } from "app/space/space-module";
import { WeaponEntity } from "app/weapons/weapon-entity";
import { CrewFactory } from "app/crewmember/crewmember-factory";
import { ForceEntity } from "app/force/force-entity";

export class ShipMacroLasAbility extends AbilityWithDone {

    private unit: Unit;
    private shootingShip: Ship;

    private bulletDamage = 60;
    private causeFires = false;

    

    public init() {
        super.init();
        this.unit = Unit.fromHandle(GetTriggerUnit());
        this.shootingShip = SpaceEntity.getInstance().getShipForUnit(this.unit);
        if (this.shootingShip && this.shootingShip.engine) this.shootingShip.engine.mass += this.shootingShip.engine.velocityForwardMax / 4;

        const abilLevel = GetUnitAbilityLevel(this.unit.handle, GetSpellAbilityId());

        PlayNewSoundOnUnit("Sounds\\Laser1.mp3", this.unit, 127);

        const casterLoc = vectorFromUnit(this.unit.handle);
        const t3VoidResearched = ResearchFactory.getInstance().getMajorUpgradeLevel(TECH_MAJOR_VOID) >= 3;
        const t3VoidBonus = ResearchFactory.getInstance().techHasOccupationBonus(TECH_MAJOR_VOID, 3);

        this.bulletDamage = t3VoidResearched ? 60 : 90;
        this.causeFires = t3VoidBonus;

        // Create projectile
        let temp =  new Vector3(casterLoc.x, casterLoc.y, getZFromXY(casterLoc.x, casterLoc.y)+20);

        const bulletLeftLoc = temp.projectTowards2D(this.unit.facing-120, 30);
        const bulletRightLoc = temp.projectTowards2D(this.unit.facing+120, 30);
        const targetLoc = temp.projectTowards2D(this.unit.facing, 3000);
        // Apply scatter
        targetLoc.x = targetLoc.x+GetRandomReal(-150,150);
        targetLoc.y = targetLoc.y+GetRandomReal(-150,150);

        const deltaLeft = targetLoc.subtract(bulletLeftLoc);
        const deltaRight = targetLoc.subtract(bulletRightLoc);       

        const projLeft = new Projectile(
            this.unit.handle,
            bulletLeftLoc,
            new ProjectileTargetStatic(deltaLeft)
        )
        .setVelocity(2400)
        .overrideFilter((projectile: Projectile) => {
            let unit = GetFilterUnit(); 
            return GetWidgetLife(unit) > 0.405
                && GetOwningPlayer(unit) !== this.unit.owner.handle &&
                IsUnitType(unit, UNIT_TYPE_MAGIC_IMMUNE) == false;
        })
        .onCollide((projectile, withWho) => this.onCollide(projectile, withWho));

        const projRight = new Projectile(
            this.unit.handle,
            bulletRightLoc,
            new ProjectileTargetStatic(deltaRight)
        )
        .setVelocity(2400)
        .overrideFilter((projectile: Projectile) => {
            let unit = GetFilterUnit(); 
            return GetWidgetLife(unit) > 0.405
                && GetOwningPlayer(unit) !== this.unit.owner.handle &&
                IsUnitType(unit, UNIT_TYPE_MAGIC_IMMUNE) == false;
        })
        .onCollide((projectile, withWho) => this.onCollide(projectile, withWho));

        BlzSetSpecialEffectScale(projLeft.addEffect(this.causeFires ? SFX_LASER_2 : SFX_LASER_1, new Vector3(0, 0, 0), deltaLeft.normalise(), 1.2), 0.5);
        BlzSetSpecialEffectScale(projRight.addEffect(this.causeFires ? SFX_LASER_2 : SFX_LASER_1, new Vector3(0, 0, 0), deltaRight.normalise(), 1.2), 0.5);

        WeaponEntity.getInstance().addProjectile(projLeft);
        WeaponEntity.getInstance().addProjectile(projRight);

        this.done = true;
        return true;
    };

    public step(delta: number) {
        return false;
    };

    private onCollide(projectile: Projectile, withWho: unit) {
        projectile.setDestroy(true);
        const targetUnit = Unit.fromHandle(withWho);
        ForceEntity.getInstance().aggressionBetweenTwoPlayers(this.unit.owner, targetUnit.owner);

        // Now deal damage

        const crewmember = CrewFactory.getInstance().getCrewmemberForUnit(this.unit);
        let damage = this.bulletDamage;

        // Add fire debuff to unit
        DynamicBuffEntity.getInstance().addBuff(BUFF_ID.FIRE, 
            Unit.fromHandle(withWho), 
            new BuffInstanceDuration(this.shootingShip.unit, 10)
        );

        if (crewmember) {
            damage *= crewmember.getDamageBonusMult();
        }
        UnitDamageTarget(
            this.unit.handle, 
            targetUnit.handle, 
            damage, 
            false, 
            true, 
            ATTACK_TYPE_PIERCE, 
            DAMAGE_TYPE_NORMAL, 
            WEAPON_TYPE_WOOD_MEDIUM_STAB
        );
        return false;
    }


    public destroy() {
        if (this.shootingShip && this.shootingShip.engine) this.shootingShip.engine.mass -= this.shootingShip.engine.velocityForwardMax / 4;
        return true;
    };
}