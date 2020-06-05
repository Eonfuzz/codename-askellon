import { Ability } from "../ability-type";
import { AbilityModule } from "../ability-module";
import { Vector2, vectorFromUnit } from "../../types/vector2";
import { Log } from "../../../lib/serilog/serilog";
import { HIGH_QUALITY_POLYMER_ABILITY_ID } from "../../weapons/weapon-constants";
import { SPRINT_BUFF_ID } from "resources/ability-ids";
import { Vector3 } from "app/types/vector3";
import { getZFromXY } from "lib/utils";
import { SoundRef } from "app/types/sound-ref";
import { Unit } from "w3ts/index";
import { Projectile } from "app/weapons/projectile/projectile";
import { ProjectileTargetStatic, ProjectileMoverLinear } from "app/weapons/projectile/projectile-target";
import { WeaponModule } from "app/weapons/weapon-module";
import { SHIP_VOYAGER_UNIT } from "resources/unit-ids";
import { Ship, ShipState } from "app/space/ship";

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

    public initialise(module: AbilityModule) {
        this.unit = Unit.fromHandle(GetTriggerUnit());
        this.shootingShip = module.game.spaceModule.getShipForUnit(this.unit);
        if (this.shootingShip && this.shootingShip.engine) this.shootingShip.engine.mass += this.shootingShip.engine.velocityForwardMax / 4;

        const abilLevel = GetUnitAbilityLevel(this.unit.handle, GetSpellAbilityId());

        this.sound.playSoundOnUnit(this.unit.handle, 127);
        this.bulletDamage = 20 + 10 * abilLevel;

        return true;
    };

    public process(module: AbilityModule, delta: number) {
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
                new ProjectileTargetStatic(deltaTarget),
                new ProjectileMoverLinear()
            )
            .setVelocity(1500)
            .overrideFilter((projectile: Projectile) => {
                let unit = GetFilterUnit(); 
                return GetWidgetLife(unit) > 0.405 && GetUnitTypeId(unit) === SHIP_VOYAGER_UNIT 
                    && GetOwningPlayer(unit) !== this.unit.owner.handle &&
                    IsUnitType(unit, UNIT_TYPE_MAGIC_IMMUNE) == false;
            })
            .onCollide((wepModule, projectile, withWho) => this.onCollide(wepModule, projectile, withWho));

            const effect = projectile.addEffect(bulletModel, new Vector3(0, 0, 0), deltaTarget.normalise(), 1.2);
            BlzSetSpecialEffectColor(effect, 160, 140, 255);
            module.game.weaponModule.addProjectile(projectile);
        }

        return this.timeElapsed <= 5;
    };

    private onCollide(wepModule: WeaponModule, projectile: Projectile, withWho: unit) {
        projectile.setDestroy(true);
        const targetUnit = Unit.fromHandle(withWho);
        wepModule.game.forceModule.aggressionBetweenTwoPlayers(this.unit.owner, targetUnit.owner);

        // Now deal damage

        const crewmember = wepModule.game.crewModule.getCrewmemberForUnit(this.unit);
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


    public destroy(aMod: AbilityModule) {
        if (this.shootingShip && this.shootingShip.engine) this.shootingShip.engine.mass -= this.shootingShip.engine.velocityForwardMax / 4;
        return true;
    };
}