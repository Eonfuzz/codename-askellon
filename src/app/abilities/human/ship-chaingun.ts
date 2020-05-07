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

/** @noSelfInFile **/
const bulletModel = "war3mapImported\\Bullet.mdx";
export class ShipChaingunAbility implements Ability {

    private unit: Unit;
    private timeElapsed = 0;
    private timeSinceBullet = 0;
    private sound = new SoundRef("sounds\\chaingunSound.mp3", false);
    constructor() {}

    public initialise(module: AbilityModule) {
        this.unit = Unit.fromHandle(GetTriggerUnit());

        this.sound.playSoundOnUnit(this.unit.handle, 127);

        return true;
    };

    public process(module: AbilityModule, delta: number) {
        this.timeElapsed += delta;
        this.timeSinceBullet += delta;

        if (this.timeElapsed >= 1 && this.timeSinceBullet >= 0.1) {
            this.timeSinceBullet -= 0.1;

            const casterLoc = vectorFromUnit(this.unit.handle);

            // Create projectile
            let temp =  casterLoc.applyPolarOffset(this.unit.facing, 50);

            const z = getZFromXY(temp.x, temp.y);
            const bulletLoc = new Vector3(temp.x, temp.y, z+90);
            temp = temp.applyPolarOffset(this.unit.facing, 3000);
            const targetLoc = new Vector3(temp.x+GetRandomReal(-200,200), temp.y+GetRandomReal(-200,200), z);

            const deltaTarget = targetLoc.subtract(bulletLoc);       

            const projectile = new Projectile(
                this.unit.handle,
                bulletLoc,
                new ProjectileTargetStatic(deltaTarget),
                new ProjectileMoverLinear()
            )
            .setVelocity(1800)
            .overrideFilter((projectile: Projectile) => {
                let unit = GetFilterUnit(); 
                return GetWidgetLife(unit) > 0.405 && GetUnitTypeId(unit) === SHIP_VOYAGER_UNIT 
                    && GetOwningPlayer(unit) !== this.unit.owner.handle &&
                    IsUnitType(unit, UNIT_TYPE_MAGIC_IMMUNE) == false;
            })
            .onCollide((wepModule, projectile, withWho) => this.onCollide(wepModule, projectile, withWho));

            projectile.addEffect(bulletModel, new Vector3(0, 0, 0), deltaTarget.normalise(), 1.2);

            module.game.weaponModule.addProjectile(projectile);
        }

        return this.timeElapsed <= 5;
    };

    private onCollide(wepModule: WeaponModule, projectile: Projectile, withWho: unit) {
        const targetUnit = Unit.fromHandle(withWho);
        wepModule.game.forceModule.aggressionBetweenTwoPlayers(this.unit.owner, targetUnit.owner);

        // Now deal damage

        const crewmember = wepModule.game.crewModule.getCrewmemberForUnit(this.unit);
        let damage = 20;

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
    }


    public destroy(aMod: AbilityModule) {
        return true;
    };
}