import { Ability } from "../ability-type";
import { Vector2, vectorFromUnit } from "../../types/vector2";
import { Vector3 } from "app/types/vector3";
import { getZFromXY } from "lib/utils";
import { SoundRef } from "app/types/sound-ref";
import { Unit } from "w3ts/index";
import { Projectile } from "app/weapons/projectile/projectile";
import { ProjectileTargetStatic, ProjectileMoverLinear } from "app/weapons/projectile/projectile-target";
import { SHIP_VOYAGER_UNIT } from "resources/unit-ids";
import { Ship } from "app/space/ships/ship-type";
import { ShipState } from "app/space/ships/ship-state-type";
import { SpaceEntity } from "app/space/space-module";
import { WeaponEntity } from "app/weapons/weapon-entity";
import { ForceEntity } from "app/force/force-entity";
import { CrewFactory } from "app/crewmember/crewmember-factory";

/** @noSelfInFile **/
const bulletModel = "war3mapImported\\Bullet.mdx";
export class ShipChaingunAbility implements Ability {

    private unit: Unit;
    private shootingShip: Ship;

    private timeElapsed = 0;
    private timeSinceBullet = 0;
    private bulletDamage = 20;
    private sound = new SoundRef("sounds\\chaingunSound.mp3", false);
    constructor() {}

    public initialise() {
        this.unit = Unit.fromHandle(GetTriggerUnit());
        this.shootingShip = SpaceEntity.getInstance().getShipForUnit(this.unit);
        if (this.shootingShip && this.shootingShip.engine) this.shootingShip.engine.mass += this.shootingShip.engine.velocityForwardMax / 4;

        const abilLevel = GetUnitAbilityLevel(this.unit.handle, GetSpellAbilityId());

        this.sound.playSoundOnUnit(this.unit.handle, 127);
        this.bulletDamage = 20 + 10 * abilLevel;

        return true;
    };

    public process(delta: number) {
        this.timeElapsed += delta;
        this.timeSinceBullet += delta;

        // End if we are leaving space
        if (this.shootingShip.state === ShipState.inBay) return false;

        if (this.timeElapsed >= 1 && this.timeSinceBullet >= 0.1) {
            this.timeSinceBullet -= 0.1;

            const casterLoc = vectorFromUnit(this.unit.handle);

            // Create projectile
            let temp =  casterLoc.applyPolarOffset(this.unit.facing, 50);

            const z = getZFromXY(temp.x, temp.y);
            const bulletLoc = new Vector3(temp.x, temp.y, z+90);
            temp = temp.applyPolarOffset(this.unit.facing, 2000);
            const targetLoc = new Vector3(temp.x+GetRandomReal(-200,200), temp.y+GetRandomReal(-200,200), z);

            const deltaTarget = targetLoc.subtract(bulletLoc);       

            const projectile = new Projectile(
                this.unit.handle,
                bulletLoc,
                new ProjectileTargetStatic(deltaTarget)
            )
            .setVelocity(1500)
            .overrideFilter((projectile: Projectile) => {
                let unit = GetFilterUnit(); 
                return GetWidgetLife(unit) > 0.405 && GetUnitTypeId(unit) === SHIP_VOYAGER_UNIT 
                    && GetOwningPlayer(unit) !== this.unit.owner.handle &&
                    IsUnitType(unit, UNIT_TYPE_MAGIC_IMMUNE) == false;
            })
            .onCollide((projectile, withWho) => this.onCollide(projectile, withWho));

            const effect = projectile.addEffect(bulletModel, new Vector3(0, 0, 0), deltaTarget.normalise(), 1.2);
            BlzSetSpecialEffectColor(effect, 160, 140, 255);
            WeaponEntity.getInstance().addProjectile(projectile);
        }

        return this.timeElapsed <= 5;
    };

    private onCollide(projectile: Projectile, withWho: unit) {
        projectile.setDestroy(true);
        const targetUnit = Unit.fromHandle(withWho);
        ForceEntity.getInstance().aggressionBetweenTwoPlayers(this.unit.owner, targetUnit.owner);

        // Now deal damage

        const crewmember = CrewFactory.getInstance().getCrewmemberForUnit(this.unit);
        let damage = this.bulletDamage;

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
        this.sound.destroy(true);
        if (this.shootingShip && this.shootingShip.engine) this.shootingShip.engine.mass -= this.shootingShip.engine.velocityForwardMax / 4;
        return true;
    };
}